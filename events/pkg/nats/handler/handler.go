package handler

import (
	"context"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
)

// Handler defines the interface for processing NATS messages
type Handler interface {
	// Handle processes a single message
	Handle(ctx context.Context, msg *message.Message) error
}

// HandlerFunc is a function type that implements the Handler interface
type HandlerFunc func(ctx context.Context, msg *message.Message) error

// Handle implements the Handler interface
func (f HandlerFunc) Handle(ctx context.Context, msg *message.Message) error {
	return f(ctx, msg)
}

// BatchHandler defines the interface for processing batches of NATS messages
type BatchHandler interface {
	// HandleBatch processes multiple messages
	HandleBatch(ctx context.Context, msgs []*message.Message) error
}

// BatchHandlerFunc is a function type that implements the BatchHandler interface
type BatchHandlerFunc func(ctx context.Context, msgs []*message.Message) error

// HandleBatch implements the BatchHandler interface
func (f BatchHandlerFunc) HandleBatch(ctx context.Context, msgs []*message.Message) error {
	return f(ctx, msgs)
}

// ErrorHandler defines the interface for handling errors
type ErrorHandler interface {
	// HandleError processes an error that occurred during message handling
	HandleError(ctx context.Context, err error, msg *message.Message)
}

// ErrorHandlerFunc is a function type that implements the ErrorHandler interface
type ErrorHandlerFunc func(ctx context.Context, err error, msg *message.Message)

// HandleError implements the ErrorHandler interface
func (f ErrorHandlerFunc) HandleError(ctx context.Context, err error, msg *message.Message) {
	f(ctx, err, msg)
}
