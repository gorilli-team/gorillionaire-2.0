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

func TestBatchSubscription(t *testing.T) {
	// Setup NATS test server
	ns, err := natsServer()
	require.NoError(t, err)
	defer ns.Shutdown()

	// Create NATS connection
	nc, err := nats.Connect(ns.ClientURL())
	require.NoError(t, err)
	defer nc.Close()

	t.Run("NewBatchSubscription", func(t *testing.T) {
		t.Run("should return error when batch handler is nil", func(t *testing.T) {
			opts := &Options{
				Subject: "test.subject",
			}
			_, err := newBatchSubscription(nc, opts)
			assert.Error(t, err)
			assert.Contains(t, err.Error(), "batch handler is required")
		})

		t.Run("should create subscription successfully", func(t *testing.T) {
			opts := &Options{
				Subject: "test.subject",
				BatchHandler: handler.BatchHandlerFunc(func(ctx context.Context, msgs []*message.Message) error {
					return nil
				}),
			}
			sub, err := newBatchSubscription(nc, opts)
			assert.NoError(t, err)
			assert.NotNil(t, sub)
		})
	})

	t.Run("Batch Message Handling", func(t *testing.T) {
		received := make(chan []*message.Message, 1)
		opts := &Options{
			Subject:     "test.subject",
			BatchSize:   2,
			BatchWindow: 100 * time.Millisecond,
			BatchHandler: handler.BatchHandlerFunc(func(ctx context.Context, msgs []*message.Message) error {
				received <- msgs
				return nil
			}),
		}

		sub, err := newBatchSubscription(nc, opts)
		require.NoError(t, err)
		require.NoError(t, sub.Start())
		defer sub.Stop()

		// Publish test messages
		err = nc.Publish("test.subject", []byte("test data 1"))
		require.NoError(t, err)
		err = nc.Publish("test.subject", []byte("test data 2"))
		require.NoError(t, err)

		// Wait for batch
		select {
		case msgs := <-received:
			assert.Len(t, msgs, 2)
			assert.Equal(t, "test.subject", msgs[0].Subject)
			assert.Equal(t, []byte("test data 1"), msgs[0].Data)
			assert.Equal(t, []byte("test data 2"), msgs[1].Data)
		case <-time.After(time.Second):
			t.Fatal("timeout waiting for batch")
		}
	})

	t.Run("Batch Window", func(t *testing.T) {
		received := make(chan []*message.Message, 1)
		opts := &Options{
			Subject:     "test.subject",
			BatchSize:   10,
			BatchWindow: 100 * time.Millisecond,
			BatchHandler: handler.BatchHandlerFunc(func(ctx context.Context, msgs []*message.Message) error {
				received <- msgs
				return nil
			}),
		}

		sub, err := newBatchSubscription(nc, opts)
		require.NoError(t, err)
		require.NoError(t, sub.Start())
		defer sub.Stop()

		// Publish single message
		err = nc.Publish("test.subject", []byte("test data"))
		require.NoError(t, err)

		// Wait for batch (should trigger due to window)
		select {
		case msgs := <-received:
			assert.Len(t, msgs, 1)
			assert.Equal(t, []byte("test data"), msgs[0].Data)
		case <-time.After(200 * time.Millisecond):
			t.Fatal("timeout waiting for batch")
		}
	})

	t.Run("Error Handling", func(t *testing.T) {
		expectedErr := errors.New("test error")
		receivedErr := make(chan error, 1)
		opts := &Options{
			Subject:     "test.subject",
			BatchSize:   2,
			BatchWindow: 100 * time.Millisecond,
			BatchHandler: handler.BatchHandlerFunc(func(ctx context.Context, msgs []*message.Message) error {
				return expectedErr
			}),
			ErrorHandler: handler.ErrorHandlerFunc(func(ctx context.Context, err error, msg *message.Message) {
				receivedErr <- err
			}),
		}

		sub, err := newBatchSubscription(nc, opts)
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
			BatchHandler: handler.BatchHandlerFunc(func(ctx context.Context, msgs []*message.Message) error {
				return nil
			}),
		}

		sub, err := newBatchSubscription(nc, opts)
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
