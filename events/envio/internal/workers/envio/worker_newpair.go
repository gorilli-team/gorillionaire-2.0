package envio

import (
	"context"
	"log"
	"proto-v1/envio"
	"sync"
	"time"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/workers"
	"google.golang.org/protobuf/proto"
)

type EnvioNewPairWorker struct {
	// pool        *pgxpool.Pool
	batchSize   int
	batchWindow time.Duration
	mu          sync.Mutex
	buffer      []*envio.EnvioNewPair
	timeseries  chan<- []*envio.EnvioNewPair
}

var _ workers.Worker = (*EnvioNewPairWorker)(nil)

func NewEnvioNewPairWorker(config Config) *EnvioNewPairWorker {
	if config.BatchSize == 0 {
		config.BatchSize = 100
	}

	return &EnvioNewPairWorker{
		batchSize:   config.BatchSize,
		batchWindow: config.BatchWindow,
	}
}

func (w *EnvioNewPairWorker) periodicFlush() {
	ticker := time.NewTicker(w.batchWindow)
	defer ticker.Stop()

	for range ticker.C {
		w.flushBuffer()
	}
}

func (w *EnvioNewPairWorker) flushBuffer() {
	w.mu.Lock()
	defer w.mu.Unlock()

	if len(w.buffer) == 0 {
		return
	}
}

func (w *EnvioNewPairWorker) Process(ctx context.Context, msg *message.Message) error {
	// Convert protobuf message to EnvioNewPair
	envioEvent := &envio.EnvioNewPair{}

	err := proto.Unmarshal(msg.Data, envioEvent)
	if err != nil {
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

func (w *EnvioNewPairWorker) ProcessBatch(ctx context.Context, msgs []*message.Message) error {
	for _, msg := range msgs {
		if err := w.Process(ctx, msg); err != nil {
			log.Printf("Error processing event: %v", err)
		}
		log.Printf("Processed event: %v", msg.Subject)
	}
	return nil
}

func (w *EnvioNewPairWorker) Name() string {
	return "gorillioner.envio.newpair"
}
