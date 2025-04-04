package subscription

import (
	"fmt"
	"sync"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/handler"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/nats-io/nats.go"
)

// singleSubscription implements the Subscription interface for single message handling
type singleSubscription struct {
	sub        *nats.Subscription
	handler    handler.Handler
	errHandler handler.ErrorHandler
	opts       *Options
	active     bool
	mu         sync.RWMutex
}

// newSingleSubscription creates a new single message subscription
func newSingleSubscription(conn *nats.Conn, opts *Options) (*singleSubscription, error) {
	if opts.Handler == nil {
		return nil, fmt.Errorf("handler is required")
	}

	sub := &singleSubscription{
		handler:    opts.Handler,
		errHandler: opts.ErrorHandler,
		opts:       opts,
		active:     false,
	}

	// Create NATS subscription
	natsSub, err := conn.Subscribe(opts.Subject, sub.handleMessage)
	if err != nil {
		return nil, fmt.Errorf("failed to create subscription: %w", err)
	}

	sub.sub = natsSub
	return sub, nil
}

// handleMessage processes a single NATS message
func (s *singleSubscription) handleMessage(natsMsg *nats.Msg) {
	msg := &message.Message{
		Subject: natsMsg.Subject,
		Data:    natsMsg.Data,
		Headers: make(map[string]string),
		ReplyTo: natsMsg.Reply,
	}

	// Copy headers
	for k, v := range natsMsg.Header {
		if len(v) > 0 {
			msg.Headers[k] = v[0]
		}
	}

	// Handle message
	if err := s.handler.Handle(s.opts.Context, msg); err != nil {
		if s.errHandler != nil {
			s.errHandler.HandleError(s.opts.Context, err, msg)
		}
	}
}

// Start starts the subscription
func (s *singleSubscription) Start() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.active {
		return fmt.Errorf("subscription already active")
	}

	s.active = true
	return nil
}

// Stop stops the subscription
func (s *singleSubscription) Stop() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if !s.active {
		return fmt.Errorf("subscription not active")
	}

	if err := s.sub.Unsubscribe(); err != nil {
		return fmt.Errorf("failed to unsubscribe: %w", err)
	}

	s.active = false
	return nil
}

// IsActive returns whether the subscription is active
func (s *singleSubscription) IsActive() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.active
}

// Subject returns the subscription subject
func (s *singleSubscription) Subject() string {
	return s.opts.Subject
}

// QueueGroup returns the queue group
func (s *singleSubscription) QueueGroup() string {
	return s.opts.QueueGroup
}
