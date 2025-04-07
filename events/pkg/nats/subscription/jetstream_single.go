package subscription

import (
	"fmt"

	"github.com/nats-io/nats.go"
)

func newJetStreamSingleSubscription(js nats.JetStreamContext, opts *Options) (*singleSubscription, error) {
	if opts.Handler == nil {
		return nil, fmt.Errorf("handler is required")
	}

	sub := &singleSubscription{
		handler:    opts.Handler,
		errHandler: opts.ErrorHandler,
		opts:       opts,
		active:     false,
	}

	// Create JetStream subscription
	natsSub, err := js.Subscribe(opts.Subject, sub.handleMessage)
	if err != nil {
		return nil, fmt.Errorf("failed to create subscription: %w", err)
	}

	sub.sub = natsSub
	return sub, nil
}
