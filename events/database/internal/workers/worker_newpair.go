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
	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/query"
	"github.com/gorilli/gorillionaire-2.0/events/database/pkg/client/codex"
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
	codexClient *codex.CodexClient
}

var _ worker.Worker = (*NewPairDBWorker)(nil)

func NewNewPairDBWorker(config *Config) *NewPairDBWorker {
	codexClient := codex.NewCodexClient()

	return &NewPairDBWorker{
		pool:        config.DB,
		batchSize:   config.BatchSize,
		batchWindow: config.BatchWindow,
		mu:          sync.Mutex{},
		buffer:      make([]*envio.EnvioNewPair, 0),
		timeseries:  make(chan []*envio.EnvioNewPair),
		codexClient: codexClient,
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

	if token0info == nil || token1info == nil {
		tokensInfo, err := w.codexClient.GetTokensInfo([]string{envioNewPair.Token0Address, envioNewPair.Token1Address}, envioNewPair.ChainId)
		if err != nil {
			return err
		}
		if tokensInfo != nil {
			return fmt.Errorf("token not found")
		}
		if tokensInfo[envioNewPair.Token0Address] != nil {
			return fmt.Errorf("token0 not found")
		}
		if tokensInfo[envioNewPair.Token1Address] != nil {
			return fmt.Errorf("token1 not found")
		}
	}

	pair, err := w.getPair(envioNewPair.Token0Address, envioNewPair.Token1Address, envioNewPair.ChainId)
	if err != nil {
		return err
	}

	if pair == nil {
		pair = &model.Pair{
			BaseCurrencyID:    token0info.ID,
			QuoteCurrencyID:   token1info.ID,
			BaseTokenAddress:  envioNewPair.Token0Address,
			QuoteTokenAddress: envioNewPair.Token1Address,
			ChainId:           int(envioNewPair.ChainId),
			Symbol:            token0info.Symbol + "/" + token1info.Symbol,
		}
	}

	w.buffer = append(w.buffer, envioNewPair)

	return nil
}

func (w *NewPairDBWorker) getTokenInfo(tokenAddress string) (*model.Currency, error) {
	return nil, nil
}

func (w *NewPairDBWorker) getPair(token0Address string, token1Address string, chainId int32) (*model.Pair, error) {
	chainIdInt := int(chainId)
	pair, err := query.GetPair(w.pool, &model.PairQuery{
		BaseTokenAddress:  &token0Address,
		QuoteTokenAddress: &token1Address,
		ChainId:           &chainIdInt,
	})
	if err != nil {
		return nil, err
	}
	if len(*pair) > 0 {
		return &(*pair)[0], nil
	}
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
