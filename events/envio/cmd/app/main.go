package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilli/gorillionaire-2.0/events/envio/internal/workers/envio"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/client"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/config"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/handler"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/subscription"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/workers"
	// "github.com/jackc/pgx/v4/pgxpool"
)

const (
	ENVIO_SUBJECT     = "envio.>"
	TIMESCALE_SUBJECT = "timeseries.>"
)

type Config struct {
	NatsURL          string
	TimescaleSubject string
	Routes           []RouteConfig
}

func main() {
	// Create context
	// ctx := context.Background()

	// Configuration
	cfg := Config{
		NatsURL:          getEnvOrDefault("NATS_URL", "nats://localhost:4222"),
		TimescaleSubject: getEnvOrDefault("TIMESCALE_URL", TIMESCALE_SUBJECT),
		Routes: []RouteConfig{
			{
				Pattern:     ENVIO_SUBJECT,
				Workers:     10,
				ChannelSize: 1000,
				WorkerName:  "envio",
			},
			// {
			// 	Pattern:     TIMESCALE_SUBJECT,
			// 	Workers:     5,
			// 	ChannelSize: 1000,
			// 	WorkerName:  "timeseries",
			// },
		},
	}

	// Create NATS client
	natsClient, err := client.New(&config.Config{
		URL:            cfg.NatsURL,
		ConnectTimeout: 10 * time.Second,
	})
	if err != nil {
		log.Fatalf("Failed to create NATS client: %v", err)
	}
	defer natsClient.Close()

	// Connect to TimescaleDB
	// pool, err := pgxpool.Connect(ctx, cfg.TimescaleSubject)
	// if err != nil {
	// 	log.Fatalf("Failed to connect to TimescaleDB: %v", err)
	// }
	// defer pool.Close()

	// Create and populate worker registry
	registry := workers.NewRegistry()
	// Register envio worker
	envioWorker := envio.NewEnvioWorker(envio.Config{
		// Pool: pool,
	})
	registry.Register(envioWorker)

	// Create subscriptions for each route
	for _, route := range cfg.Routes {
		// Create batch subscription for better performance
		sub, err := natsClient.Subscribe(&subscription.Options{
			Subject:     route.Pattern,
			BatchSize:   route.ChannelSize,
			BatchWindow: time.Second,
			BatchHandler: handler.BatchHandlerFunc(func(ctx context.Context, msgs []*message.Message) error {
				for _, msg := range msgs {
					// Get worker from registry
					worker, ok := registry.Get(route.WorkerName)
					if !ok {
						return fmt.Errorf("worker %s not found", route.WorkerName)
					}

					// Convert message to event
					event := &workers.Event{
						Timestamp: time.Now().Format(time.RFC3339),
						Data:      msg.Data,
						Route:     msg.Subject,
					}

					// Process message
					if err := worker.Process(ctx, event); err != nil {
						log.Printf("Error processing message: %v", err)
					}
				}
				return nil
			}),
		})
		if err != nil {
			log.Fatalf("Failed to create subscription for %s: %v", route.Pattern, err)
		}

		// Start subscription
		if err := sub.Start(); err != nil {
			log.Fatalf("Failed to start subscription for %s: %v", route.Pattern, err)
		}
		defer sub.Stop()
	}

	// Wait for interrupt signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	<-sigChan
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
