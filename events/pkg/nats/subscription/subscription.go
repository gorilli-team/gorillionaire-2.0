package subscription

import (
	"context"
	"fmt"
	"time"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/handler"
	"github.com/nats-io/nats.go"
)

// Options holds subscription options
type Options struct {
	// Subject to subscribe to
	Subject string

	// Queue group for load balancing
	QueueGroup string

	// Handler for processing messages
	Handler handler.Handler

	// BatchHandler for processing message batches
	BatchHandler handler.BatchHandler

	// ErrorHandler for handling errors
	ErrorHandler handler.ErrorHandler

	// Batch size for batch processing
	BatchSize int

	// Batch window for batch processing
	BatchWindow time.Duration

	// Context for cancellation
	Context context.Context

	// UseJetStream for JetStream
	UseJetStream bool
}

// Option is a function that modifies subscription options
type Option func(*Options)

// WithQueueGroup sets the queue group
func WithQueueGroup(group string) Option {
	return func(o *Options) {
		o.QueueGroup = group
	}
}

// WithBatchSize sets the batch size
func WithBatchSize(size int) Option {
	return func(o *Options) {
		o.BatchSize = size
	}
}

// WithBatchWindow sets the batch window
func WithBatchWindow(window time.Duration) Option {
	return func(o *Options) {
		o.BatchWindow = window
	}
}

// WithErrorHandler sets the error handler
func WithErrorHandler(h handler.ErrorHandler) Option {
	return func(o *Options) {
		o.ErrorHandler = h
	}
}

// WithContext sets the context
func WithContext(ctx context.Context) Option {
	return func(o *Options) {
		o.Context = ctx
	}
}

// DefaultOptions returns default subscription options
func DefaultOptions(subject string, h handler.Handler) *Options {
	return &Options{
		Subject:     subject,
		Handler:     h,
		BatchSize:   100,
		BatchWindow: time.Second,
		Context:     context.Background(),
	}
}

// Subscription represents a NATS subscription
type Subscription interface {
	// Start starts the subscription
	Start() error

	// Stop stops the subscription
	Stop() error

	// IsActive returns whether the subscription is active
	IsActive() bool

	// Subject returns the subscription subject
	Subject() string

	// QueueGroup returns the queue group
	QueueGroup() string
}

// NewSingleSubscription creates a new single message subscription
func NewSingleSubscription(conn *nats.Conn, opts *Options) (Subscription, error) {
	if opts.Handler == nil {
		return nil, fmt.Errorf("handler is required")
	}
	return newSingleSubscription(conn, opts)
}

// NewBatchSubscription creates a new batch message subscription
func NewBatchSubscription(conn *nats.Conn, opts *Options) (Subscription, error) {
	if opts.BatchHandler == nil {
		return nil, fmt.Errorf("batch handler is required")
	}
	return newBatchSubscription(conn, opts)
}

// NewJetStreamSubscription creates a new JetStream subscription
func NewJetStreamSubscription(js nats.JetStreamContext, opts *Options) (Subscription, error) {
	if opts.Handler == nil {
		return nil, fmt.Errorf("handler is required")
	}
	return newJetStreamSingleSubscription(js, opts)
}

// NewJetStreamBatchSubscription creates a new JetStream batch subscription
func NewJetStreamBatchSubscription(js nats.JetStreamContext, opts *Options) (Subscription, error) {
	if opts.BatchHandler == nil {
		return nil, fmt.Errorf("batch handler is required")
	}
	return newJetStreamBatchSubscription(js, opts)
}
