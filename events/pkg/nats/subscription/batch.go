package subscription

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/handler"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/nats-io/nats.go"
)

// batchSubscription implements the Subscription interface for batch message handling
type batchSubscription struct {
	sub        *nats.Subscription
	handler    handler.BatchHandler
	errHandler handler.ErrorHandler
	opts       *Options
	active     bool
	mu         sync.RWMutex
	batch      []*message.Message
	batchTimer *time.Timer
	batchChan  chan *message.Message
	stopChan   chan struct{}
}

// newBatchSubscription creates a new batch message subscription
func newBatchSubscription(conn *nats.Conn, opts *Options) (*batchSubscription, error) {
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
	natsSub, err := conn.Subscribe(opts.Subject, sub.handleMessage)
	if err != nil {
		return nil, fmt.Errorf("failed to create subscription: %w", err)
	}

	sub.sub = natsSub
	return sub, nil
}

// handleMessage processes a single NATS message and adds it to the batch
func (s *batchSubscription) handleMessage(natsMsg *nats.Msg) {
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

	// Add to batch channel
	select {
	case s.batchChan <- msg:
	case <-s.stopChan:
	}
}

// processBatch processes the current batch of messages
func (s *batchSubscription) processBatch() {
	s.mu.Lock()
	if len(s.batch) == 0 {
		s.mu.Unlock()
		return
	}

	// Create a copy of the batch
	batch := make([]*message.Message, len(s.batch))
	copy(batch, s.batch)
	s.batch = s.batch[:0]
	s.mu.Unlock()

	// Handle batch
	if err := s.handler.HandleBatch(s.opts.Context, batch); err != nil {
		if s.errHandler != nil {
			for _, msg := range batch {
				s.errHandler.HandleError(s.opts.Context, err, msg)
			}
		}
	}
}

// Start starts the subscription and batch processing
func (s *batchSubscription) Start() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if s.active {
		return fmt.Errorf("subscription already active")
	}

	s.active = true
	s.batchTimer = time.NewTimer(s.opts.BatchWindow)

	// Start batch processing goroutine
	go s.processBatches()

	return nil
}

// processBatches handles batch processing
func (s *batchSubscription) processBatches() {
	for {
		select {
		case msg := <-s.batchChan:
			s.mu.Lock()
			s.batch = append(s.batch, msg)
			currentSize := len(s.batch)
			s.mu.Unlock()

			if currentSize >= s.opts.BatchSize {
				s.processBatch()
			}
		case <-s.batchTimer.C:
			s.processBatch()
			s.batchTimer.Reset(s.opts.BatchWindow)
		case <-s.stopChan:
			s.processBatch()
			return
		}
	}
}

// Stop stops the subscription and batch processing
func (s *batchSubscription) Stop() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if !s.active {
		return fmt.Errorf("subscription not active")
	}

	// Stop batch processing
	close(s.stopChan)
	if s.batchTimer != nil {
		s.batchTimer.Stop()
	}

	// Unsubscribe from NATS
	if err := s.sub.Unsubscribe(); err != nil {
		return fmt.Errorf("failed to unsubscribe: %w", err)
	}

	s.active = false
	return nil
}

// IsActive returns whether the subscription is active
func (s *batchSubscription) IsActive() bool {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.active
}

// Subject returns the subscription subject
func (s *batchSubscription) Subject() string {
	return s.opts.Subject
}

// QueueGroup returns the queue group
func (s *batchSubscription) QueueGroup() string {
	return s.opts.QueueGroup
}
