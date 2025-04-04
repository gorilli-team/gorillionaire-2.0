package subscription

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/handler"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/nats-io/nats.go"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestSingleSubscription(t *testing.T) {
	// Setup NATS test server
	ns, err := natsServer()
	require.NoError(t, err)
	defer ns.Shutdown()

	// Create NATS connection
	nc, err := nats.Connect(ns.ClientURL())
	require.NoError(t, err)
	defer nc.Close()

	t.Run("NewSingleSubscription", func(t *testing.T) {
		t.Run("should return error when handler is nil", func(t *testing.T) {
			opts := &Options{
				Subject: "test.subject",
			}
			_, err := newSingleSubscription(nc, opts)
			assert.Error(t, err)
			assert.Contains(t, err.Error(), "handler is required")
		})

		t.Run("should create subscription successfully", func(t *testing.T) {
			opts := &Options{
				Subject: "test.subject",
				Handler: handler.HandlerFunc(func(ctx context.Context, msg *message.Message) error {
					return nil
				}),
			}
			sub, err := newSingleSubscription(nc, opts)
			assert.NoError(t, err)
			assert.NotNil(t, sub)
		})
	})

	t.Run("Message Handling", func(t *testing.T) {
		received := make(chan *message.Message, 1)
		opts := &Options{
			Subject: "test.subject",
			Handler: handler.HandlerFunc(func(ctx context.Context, msg *message.Message) error {
				received <- msg
				return nil
			}),
		}

		sub, err := newSingleSubscription(nc, opts)
		require.NoError(t, err)
		require.NoError(t, sub.Start())
		defer sub.Stop()

		// Publish test message
		err = nc.Publish("test.subject", []byte("test data"))
		require.NoError(t, err)

		// Wait for message
		select {
		case msg := <-received:
			assert.Equal(t, "test.subject", msg.Subject)
			assert.Equal(t, []byte("test data"), msg.Data)
		case <-time.After(time.Second):
			t.Fatal("timeout waiting for message")
		}
	})

	t.Run("Error Handling", func(t *testing.T) {
		expectedErr := errors.New("test error")
		receivedErr := make(chan error, 1)
		opts := &Options{
			Subject: "test.subject",
			Handler: handler.HandlerFunc(func(ctx context.Context, msg *message.Message) error {
				return expectedErr
			}),
			ErrorHandler: handler.ErrorHandlerFunc(func(ctx context.Context, err error, msg *message.Message) {
				receivedErr <- err
			}),
		}

		sub, err := newSingleSubscription(nc, opts)
		require.NoError(t, err)
		require.NoError(t, sub.Start())
		defer sub.Stop()

		// Publish test message
		err = nc.Publish("test.subject", []byte("test data"))
		require.NoError(t, err)

		// Wait for error
		select {
		case err := <-receivedErr:
			assert.Equal(t, expectedErr, err)
		case <-time.After(time.Second):
			t.Fatal("timeout waiting for error")
		}
	})

	t.Run("Subscription Lifecycle", func(t *testing.T) {
		opts := &Options{
			Subject: "test.subject",
			Handler: handler.HandlerFunc(func(ctx context.Context, msg *message.Message) error {
				return nil
			}),
		}

		sub, err := newSingleSubscription(nc, opts)
		require.NoError(t, err)

		// Test Start
		assert.NoError(t, sub.Start())
		assert.True(t, sub.IsActive())

		// Test Stop
		assert.NoError(t, sub.Stop())
		assert.False(t, sub.IsActive())

		// Test double stop
		assert.Error(t, sub.Stop())
	})
}
