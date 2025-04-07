package envio

import (
	"context"
	"log"
	"sync"
	"time"

	"proto-v1/envio"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/workers"
	"github.com/jackc/pgx/v4/pgxpool"
	"google.golang.org/protobuf/proto"
)

type EnvioPriceWorker struct {
	// pool        *pgxpool.Pool
	batchSize   int
	batchWindow time.Duration
	mu          sync.Mutex
	buffer      []*envio.EnvioPriceEvent
	timeseries  chan<- []*envio.EnvioPriceEvent
}

type Config struct {
	Pool        *pgxpool.Pool
	BatchSize   int
	BatchWindow time.Duration
	Timeseries  chan<- []*envio.EnvioPriceEvent
}

var _ workers.Worker = (*EnvioPriceWorker)(nil)

func NewEnvioPriceWorker(config Config) *EnvioPriceWorker {
	if config.BatchSize == 0 {
		config.BatchSize = 100
	}
	if config.BatchWindow == 0 {
		config.BatchWindow = 1 * time.Second
	}

	w := &EnvioPriceWorker{
		// pool:        config.Pool,
		batchSize:   config.BatchSize,
		batchWindow: config.BatchWindow,
		buffer:      make([]*envio.EnvioPriceEvent, 0, config.BatchSize),
		timeseries:  config.Timeseries,
	}

	// Start background routine to flush buffer periodically
	go w.periodicFlush()

	return w
}

func (w *EnvioPriceWorker) periodicFlush() {
	ticker := time.NewTicker(w.batchWindow)
	defer ticker.Stop()

	for range ticker.C {
		w.flushBuffer()
	}
}

func (w *EnvioPriceWorker) flushBuffer() {
	w.mu.Lock()
	if len(w.buffer) == 0 {
		w.mu.Unlock()
		return
	}

	// Create a copy of the buffer to send
	batch := make([]*envio.EnvioPriceEvent, len(w.buffer))
	copy(batch, w.buffer)
	w.buffer = w.buffer[:0]
	w.mu.Unlock()

	// Send to timeseries channel
	select {
	case w.timeseries <- batch:
	default:
		log.Printf("Warning: timeseries channel is full, dropping batch of %d events", len(batch))
	}
}

func (w *EnvioPriceWorker) Name() string {
	return "gorillioner.envio.price"
}

func (w *EnvioPriceWorker) Process(ctx context.Context, msg *message.Message) error {
	// Convert protobuf message to EnvioPriceEvent
	envioEvent, err := w.process(msg.Data)
	if err != nil {
		log.Printf("Error processing event: %v", err)
		return err
	}

	// Add to buffer
	w.mu.Lock()
	w.buffer = append(w.buffer, envioEvent)
	currentSize := len(w.buffer)
	w.mu.Unlock()

	// Flush if buffer is full
	if currentSize >= w.batchSize {
		w.flushBuffer()
	}

	return nil
}

// ProcessBatch handles multiple events in a single batch
func (w *EnvioPriceWorker) ProcessBatch(ctx context.Context, msgs []*message.Message) error {
	if len(msgs) == 0 {
		return nil
	}

	// Convert all events to EnvioPriceEvents
	log.Printf("Processing batch of %d events", len(msgs))
	envioEvents := make([]*envio.EnvioPriceEvent, 0, len(msgs))
	for _, event := range msgs {
		envioEvent, err := w.process(event.Data)
		if err != nil {
			log.Printf("Error processing event: %v", err)
			return err
		}

		envioEvents = append(envioEvents, envioEvent)
	}

	// Add to buffer
	w.mu.Lock()
	w.buffer = append(w.buffer, envioEvents...)
	currentSize := len(w.buffer)
	w.mu.Unlock()

	// Flush if buffer is full
	if currentSize >= w.batchSize {
		w.flushBuffer()
	}

	return nil
}

func (w *EnvioPriceWorker) process(data []byte) (*envio.EnvioPriceEvent, error) {
	envioEvent := &envio.EnvioPriceEvent{}

	err := proto.Unmarshal(data, envioEvent)
	if err != nil {
		log.Printf("Error unmarshaling protobuf message: %v", err)
		return nil, err
	}

	return envioEvent, nil
}
