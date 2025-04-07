package subscription

import (
	"fmt"
	"log"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/nats-io/nats.go"
)

func newJetStreamBatchSubscription(js nats.JetStreamContext, opts *Options) (*batchSubscription, error) {
	if opts.BatchHandler == nil {
		return nil, fmt.Errorf("batch handler is required")
	}

	sub := &batchSubscription{
		handler:    opts.BatchHandler,
		errHandler: opts.ErrorHandler,
		opts:       opts,
		active:     false,
		batch:      make([]*message.Message, 0, opts.BatchSize),
		batchChan:  make(chan *message.Message, opts.BatchSize),
		stopChan:   make(chan struct{}),
	}

	// Create NATS subscription
	log.Printf("Creating subscription for %s", opts.Subject)
	natsSub, err := js.Subscribe(opts.Subject, sub.handleMessage)
	if err != nil {
		return nil, fmt.Errorf("failed to create subscription: %w", err)
	}

	sub.sub = natsSub
	return sub, nil
}
