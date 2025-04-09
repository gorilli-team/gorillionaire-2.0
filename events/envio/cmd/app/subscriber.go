package main

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/worker"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/nats-io/nats.go"
)

// Messages on these subjects will be handled:
// envio.orders.create -> route: "orders.create"
// envio.orders.update -> route: "orders.update"
// envio.payments.process -> route: "payments.process"

// type Event struct {
// 	Timestamp time.Time `json:"timestamp"`
// 	Data      []byte    `json:"data"`
// 	Route     string    `json:"route"`
// }

type RouteConfig struct {
	Pattern     string        // NATS subject pattern (e.g., "envio.*")
	Workers     int           // Number of workers for this route
	ChannelSize int           // Size of the channel buffer
	Worker      worker.Worker // Name of the worker implementation to use
	BatchSize   int           // Number of events to batch together
	BatchWindow time.Duration // Maximum time to wait before processing a batch
}

type SubscriberConfig struct {
	Routes           []RouteConfig
	TimescaleSubject string
	Pool             *pgxpool.Pool
}

type routeWorkerPool struct {
	messages    chan *message.Message
	workers     int
	worker      worker.Worker
	batchSize   int
	batchWindow time.Duration
}

type Subscriber struct {
	config     SubscriberConfig
	nc         *nats.Conn
	ctx        context.Context
	cancel     context.CancelFunc
	wg         sync.WaitGroup
	routePools map[string]*routeWorkerPool
	registry   *worker.Registry
}

func NewSubscriber(config SubscriberConfig, nc *nats.Conn, registry *worker.Registry) (*Subscriber, error) {
	ctx, cancel := context.WithCancel(context.Background())

	s := &Subscriber{
		config:     config,
		nc:         nc,
		ctx:        ctx,
		cancel:     cancel,
		routePools: make(map[string]*routeWorkerPool),
		registry:   registry,
	}

	// Initialize worker pools for each route
	for _, route := range config.Routes {
		// Get worker implementation from registry
		// worker, ok := registry.Get(route.WorkerName)
		// if !ok {
		// 	return nil, fmt.Errorf("worker implementation not found for: %s", route.WorkerName)
		// }

		s.routePools[route.Pattern] = &routeWorkerPool{
			messages:    make(chan *message.Message, route.ChannelSize),
			workers:     route.Workers,
			worker:      route.Worker,
			batchSize:   route.BatchSize,
			batchWindow: route.BatchWindow,
		}
	}

	return s, nil
}

func (s *Subscriber) Start() error {
	// Start workers for each route pattern
	for pattern, pool := range s.routePools {
		// Start the worker pool for this route pattern
		for i := 0; i < pool.workers; i++ {
			s.wg.Add(1)
			go s.batchWorker(i, pattern, pool)
		}

		// Subscribe to the route pattern with queue group for load balancing
		_, err := s.nc.QueueSubscribe(pattern, pattern, func(natsMsg *nats.Msg) {
			var msg message.Message
			if err := json.Unmarshal(natsMsg.Data, &msg); err != nil {
				log.Printf("Error unmarshaling event for subject %s: %v", msg.Subject, err)
				return
			}

			// Add route information
			msg.Route = msg.Subject

			// Send to the appropriate worker pool
			select {
			case pool.messages <- &msg:
			default:
				log.Printf("Channel full for route pattern %s, dropping event", pattern)
			}
		})

		if err != nil {
			return err
		}
	}

	return nil
}

func (s *Subscriber) Stop() {
	s.cancel()
	s.wg.Wait()
}

func (s *Subscriber) batchWorker(id int, pattern string, pool *routeWorkerPool) {
	defer s.wg.Done()
	log.Printf("Starting batch worker %d for pattern %s using %s worker", id, pattern, pool.worker.Name())

	batch := make([]*message.Message, 0, pool.batchSize)
	timer := time.NewTimer(pool.batchWindow)
	defer timer.Stop()

	for {
		select {
		case <-s.ctx.Done():
			// Process any remaining events before shutting down
			if len(batch) > 0 {
				s.processBatch(pool.worker, batch)
			}
			return
		case msg := <-pool.messages:
			// Convert our Event to worker.Event
			// workerEvent := &workers.Event{
			// 	Timestamp: event.Timestamp.String(),
			// 	Data:      event.Data,
			// 	Route:     event.Route,
			// }

			batch = append(batch, msg)

			// Process batch if we've reached batch size
			if len(batch) >= pool.batchSize {
				s.processBatch(pool.worker, batch)
				batch = make([]*message.Message, 0, pool.batchSize)
				timer.Reset(pool.batchWindow)
			}
		case <-timer.C:
			// Process batch if we have any events and reached the time window
			if len(batch) > 0 {
				s.processBatch(pool.worker, batch)
				batch = make([]*message.Message, 0, pool.batchSize)
			}
			timer.Reset(pool.batchWindow)
		}
	}
}

func (s *Subscriber) processBatch(worker worker.Worker, batch []*message.Message) {
	if batchWorker, ok := worker.(interface {
		ProcessBatch(context.Context, []*message.Message) error
	}); ok {
		// Use batch processing if supported
		if err := batchWorker.ProcessBatch(s.ctx, batch); err != nil {
			log.Printf("Error processing batch: %v", err)
		}
	} else {
		// Fall back to processing events individually
		for _, msg := range batch {
			if err := worker.Process(s.ctx, msg); err != nil {
				log.Printf("Error processing event: %v", err)
			}
		}
	}
}
