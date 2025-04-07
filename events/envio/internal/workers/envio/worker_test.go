package envio

import (
	"context"
	"encoding/json"
	"testing"
	"time"

	"proto-v1/envio"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/workers"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestEnvioWorker(t *testing.T) {
	t.Run("NewEnvioWorker", func(t *testing.T) {
		t.Run("should create worker with default values", func(t *testing.T) {
			timeseries := make(chan []*envio.EnvioPriceEvent, 1)
			worker := NewEnvioWorker(Config{
				Timeseries: timeseries,
			})

			assert.Equal(t, 100, worker.batchSize)
			assert.Equal(t, time.Second, worker.batchWindow)
			assert.NotNil(t, worker.timeseries)
		})

		t.Run("should create worker with custom values", func(t *testing.T) {
			timeseries := make(chan []*envio.EnvioPriceEvent, 1)
			worker := NewEnvioWorker(Config{
				BatchSize:   50,
				BatchWindow: 500 * time.Millisecond,
				Timeseries:  timeseries,
			})

			assert.Equal(t, 50, worker.batchSize)
			assert.Equal(t, 500*time.Millisecond, worker.batchWindow)
			assert.NotNil(t, worker.timeseries)
		})
	})

	t.Run("Process", func(t *testing.T) {
		timeseries := make(chan []*envio.EnvioPriceEvent, 1)
		worker := NewEnvioWorker(Config{
			BatchSize:   2,
			BatchWindow: 100 * time.Millisecond,
			Timeseries:  timeseries,
		})

		t.Run("should process valid event", func(t *testing.T) {
			// Create test event
			event := &envio.EnvioPriceEvent{
				FromAddress:       "0x123",
				ToAddress:         "0x456",
				Amount:            "100",
				BlockNumber:       "123456",
				BlockTimestamp:    time.Now().Format(time.RFC3339),
				TransactionHash:   "0x789",
				TokenSymbol:       "ETH",
				TokenName:         "Ethereum",
				TokenAddress:      "0x000",
				TokenDecimals:     18,
				ThisHourTransfers: 50,
			}
			data, err := json.Marshal(event)
			require.NoError(t, err)

			// Process event
			err = worker.Process(context.Background(), &workers.Event{
				Data: data,
			})
			assert.NoError(t, err)

			// Wait for batch to be processed
			select {
			case batch := <-timeseries:
				assert.Len(t, batch, 1)
				assert.Equal(t, event.FromAddress, batch[0].FromAddress)
				assert.Equal(t, event.Amount, batch[0].Amount)
			case <-time.After(200 * time.Millisecond):
				t.Fatal("timeout waiting for batch")
			}
		})

		t.Run("should handle invalid event data", func(t *testing.T) {
			err := worker.Process(context.Background(), &workers.Event{
				Data: "invalid data",
			})
			assert.Error(t, err)
		})

		t.Run("should batch multiple events", func(t *testing.T) {
			// Create test events
			events := []*envio.EnvioPriceEvent{
				{
					FromAddress:       "0x123",
					ToAddress:         "0x456",
					Amount:            "100",
					BlockNumber:       "123456",
					BlockTimestamp:    time.Now().Format(time.RFC3339),
					TransactionHash:   "0x789",
					TokenSymbol:       "ETH",
					TokenName:         "Ethereum",
					TokenAddress:      "0x000",
					TokenDecimals:     18,
					ThisHourTransfers: 50,
				},
				{
					FromAddress:       "0xabc",
					ToAddress:         "0xdef",
					Amount:            "200",
					BlockNumber:       "123457",
					BlockTimestamp:    time.Now().Format(time.RFC3339),
					TransactionHash:   "0xxyz",
					TokenSymbol:       "BTC",
					TokenName:         "Bitcoin",
					TokenAddress:      "0x001",
					TokenDecimals:     8,
					ThisHourTransfers: 100,
				},
			}

			// Process events
			for _, event := range events {
				data, err := json.Marshal(event)
				require.NoError(t, err)

				err = worker.Process(context.Background(), &workers.Event{
					Data: data,
				})
				assert.NoError(t, err)
			}

			// Wait for batch to be processed
			select {
			case batch := <-timeseries:
				assert.Len(t, batch, 2)
				assert.Equal(t, events[0].FromAddress, batch[0].FromAddress)
				assert.Equal(t, events[1].FromAddress, batch[1].FromAddress)
			case <-time.After(200 * time.Millisecond):
				t.Fatal("timeout waiting for batch")
			}
		})
	})

	t.Run("ProcessBatch", func(t *testing.T) {
		timeseries := make(chan []*envio.EnvioPriceEvent, 1)
		worker := NewEnvioWorker(Config{
			BatchSize:   2,
			BatchWindow: 100 * time.Millisecond,
			Timeseries:  timeseries,
		})

		t.Run("should process batch of events", func(t *testing.T) {
			// Create test events
			events := []*workers.Event{
				{
					Data: mustMarshal(&envio.EnvioPriceEvent{
						FromAddress:       "0x123",
						ToAddress:         "0x456",
						Amount:            "100",
						BlockNumber:       "123456",
						BlockTimestamp:    time.Now().Format(time.RFC3339),
						TransactionHash:   "0x789",
						TokenSymbol:       "ETH",
						TokenName:         "Ethereum",
						TokenAddress:      "0x000",
						TokenDecimals:     18,
						ThisHourTransfers: 50,
					}),
				},
				{
					Data: mustMarshal(&envio.EnvioPriceEvent{
						FromAddress:       "0xabc",
						ToAddress:         "0xdef",
						Amount:            "200",
						BlockNumber:       "123457",
						BlockTimestamp:    time.Now().Format(time.RFC3339),
						TransactionHash:   "0xxyz",
						TokenSymbol:       "BTC",
						TokenName:         "Bitcoin",
						TokenAddress:      "0x001",
						TokenDecimals:     8,
						ThisHourTransfers: 100,
					}),
				},
			}

			// Process batch
			err := worker.ProcessBatch(context.Background(), events)
			assert.NoError(t, err)

			// Wait for batch to be processed
			select {
			case batch := <-timeseries:
				assert.Len(t, batch, 2)
				assert.Equal(t, "0x123", batch[0].FromAddress)
				assert.Equal(t, "0xabc", batch[1].FromAddress)
			case <-time.After(200 * time.Millisecond):
				t.Fatal("timeout waiting for batch")
			}
		})

		t.Run("should handle empty batch", func(t *testing.T) {
			err := worker.ProcessBatch(context.Background(), nil)
			assert.NoError(t, err)
		})

		t.Run("should handle invalid events in batch", func(t *testing.T) {
			events := []*workers.Event{
				{
					Data: "invalid data",
				},
			}

			err := worker.ProcessBatch(context.Background(), events)
			assert.NoError(t, err) // Should not return error, just log it
		})
	})
}

func mustMarshal(v interface{}) []byte {
	data, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}
	return data
}
