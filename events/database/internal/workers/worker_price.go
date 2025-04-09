package workers

import (
	"context"
	"time"

	gorillionairedb "github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/db"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
)

type PriceDBWorker struct {
	db          *gorillionairedb.DB
	batchSize   int
	batchWindow time.Duration
}

func NewPriceDBWorker(config *Config) *PriceDBWorker {
	return &PriceDBWorker{
		db:          config.DB,
		batchSize:   config.BatchSize,
		batchWindow: config.BatchWindow,
	}
}

func (w *PriceDBWorker) ProcessBatch(ctx context.Context, msgs []*message.Message) error {
	return nil
}

func (w *PriceDBWorker) Process(ctx context.Context, msg *message.Message) error {
	return nil
}

func (w *PriceDBWorker) Start() error {
	return nil
}

func (w *PriceDBWorker) Stop() error {
	return nil
}

func (w *PriceDBWorker) Name() string {
	return "price-db-worker"
}
