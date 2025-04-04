package envio

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"

	"proto-v1/envio"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/workers"
	"github.com/jackc/pgx/v4/pgxpool"
)

type EnvioWorker struct {
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

func NewEnvioWorker(config Config) *EnvioWorker {
	if config.BatchSize == 0 {
		config.BatchSize = 100
	}
	if config.BatchWindow == 0 {
		config.BatchWindow = 1 * time.Second
	}

	w := &EnvioWorker{
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

func (w *EnvioWorker) periodicFlush() {
	ticker := time.NewTicker(w.batchWindow)
	defer ticker.Stop()

	for range ticker.C {
		w.flushBuffer()
	}
}

func (w *EnvioWorker) flushBuffer() {
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

func (w *EnvioWorker) Name() string {
	return "envio"
}

func (w *EnvioWorker) Process(ctx context.Context, event *workers.Event) error {
	// Convert protobuf message to EnvioPriceEvent
	envioEvent := &envio.EnvioPriceEvent{}

	// Convert interface{} to []byte
	data, ok := event.Data.([]byte)
	if !ok {
		// Try to marshal the data if it's not already []byte
		var err error
		data, err = json.Marshal(event.Data)
		if err != nil {
			log.Printf("Error marshaling event data: %v", err)
			return err
		}
	}

	if err := json.Unmarshal(data, envioEvent); err != nil {
		log.Printf("Error unmarshaling protobuf message: %v", err)
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
func (w *EnvioWorker) ProcessBatch(ctx context.Context, events []*workers.Event) error {
	if len(events) == 0 {
		return nil
	}

	// Convert all events to EnvioPriceEvents
	envioEvents := make([]*envio.EnvioPriceEvent, 0, len(events))
	for _, event := range events {
		envioEvent := &envio.EnvioPriceEvent{}

		// Convert interface{} to []byte
		data, ok := event.Data.([]byte)
		if !ok {
			// Try to marshal the data if it's not already []byte
			var err error
			data, err = json.Marshal(event.Data)
			if err != nil {
				log.Printf("Error marshaling event data: %v", err)
				continue
			}
		}

		if err := json.Unmarshal(data, envioEvent); err != nil {
			log.Printf("Error unmarshaling protobuf message: %v", err)
			continue
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
