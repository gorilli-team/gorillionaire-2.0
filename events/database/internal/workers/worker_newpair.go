package workers

import (
	"context"
	"fmt"
	"log"
	"proto-v1/envio"
	"sync"
	"time"

	gorillionairedb "github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/db"
	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/worker"
	"google.golang.org/protobuf/proto"
)

type NewPairDBWorker struct {
	pool        *gorillionairedb.DB
	batchSize   int
	batchWindow time.Duration
	mu          sync.Mutex
	buffer      []*envio.EnvioNewPair
	timeseries  chan<- []*envio.EnvioNewPair
}

var _ worker.Worker = (*NewPairDBWorker)(nil)

func NewNewPairDBWorker(config *Config) *NewPairDBWorker {
	return &NewPairDBWorker{
		pool:        config.DB,
		batchSize:   config.BatchSize,
		batchWindow: config.BatchWindow,
		mu:          sync.Mutex{},
		buffer:      make([]*envio.EnvioNewPair, 0),
		timeseries:  make(chan []*envio.EnvioNewPair),
	}
}

func (w *NewPairDBWorker) ProcessBatch(ctx context.Context, msgs []*message.Message) error {
	for _, msg := range msgs {
		if err := w.ProcessEventsBatch(ctx, msg); err != nil {
			log.Printf("Error processing event: %v", err)
			err := msg.Ack()
			if err != nil {
				log.Printf("Error acknowledging event: %v", err)
			}
		}
		log.Printf("Processed event: %v", msg.Subject)
	}
	return nil
}

func (w *NewPairDBWorker) ProcessEventsBatch(ctx context.Context, msg *message.Message) error {
	envioNewPairBatch := &envio.EnvioNewPairBatch{}
	err := proto.Unmarshal(msg.Data, envioNewPairBatch)
	if err != nil {
		return fmt.Errorf("error unmarshalling new pair event: %v", err)
	}

	for _, envioNewPair := range envioNewPairBatch.Events {
		if err := w.process(ctx, envioNewPair); err != nil {
			log.Printf("Error processing event: %v", err)
		}
	}
	return nil
}

func (w *NewPairDBWorker) Process(ctx context.Context, msg *message.Message) error {
	return w.ProcessEventsBatch(ctx, msg)
}

func (w *NewPairDBWorker) process(ctx context.Context, envioNewPair *envio.EnvioNewPair) error {

	token0info, err := w.getTokenInfo(envioNewPair.Token0Address)
	if err != nil {
		return err
	}

	token1info, err := w.getTokenInfo(envioNewPair.Token1Address)
	if err != nil {
		return err
	}

	if token0info == nil {
		w.enrichToken(envioNewPair.Token0Address)
	}

	if token1info == nil {
		w.enrichToken(envioNewPair.Token1Address)
	}

	pair, err := w.getPair(envioNewPair.Token0Address, envioNewPair.Token1Address, envioNewPair.ChainName)
	if err != nil {
		return err
	}

	if pair == nil {
		pair = &model.Pair{
			BaseCurrencyID:    token0info.ID,
			QuoteCurrencyID:   token1info.ID,
			BaseTokenAddress:  envioNewPair.Token0Address,
			QuoteTokenAddress: envioNewPair.Token1Address,
			ChainName:         envioNewPair.ChainName,
			Symbol:            token0info.Symbol + "/" + token1info.Symbol,
		}
	}

	w.buffer = append(w.buffer, envioNewPair)

	return nil
}

func (w *NewPairDBWorker) enrichToken(tokenAddress string) (*model.Currency, error) {
	return nil, nil
}

func (w *NewPairDBWorker) getTokenInfo(tokenAddress string) (*model.Currency, error) {
	return nil, nil
}

func (w *NewPairDBWorker) getPair(token0Address string, token1Address string, chainName string) (*model.Pair, error) {
	return nil, nil
}

func (w *NewPairDBWorker) Start() error {
	return nil
}

func (w *NewPairDBWorker) Stop() error {
	return nil
}

func (w *NewPairDBWorker) Name() string {
	return "newpair-db-worker"
}
