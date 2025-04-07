package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gorilli/gorillionaire-2.0/events/envio/internal/types"
	envio_worker "github.com/gorilli/gorillionaire-2.0/events/envio/internal/workers/envio"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/client"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/config"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/handler"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/subscription"
	// "github.com/jackc/pgx/v4/pgxpool"
)

const (
	ENVIO_PRICE_SUBJECT   = "gorillioner.envio.price"
	ENVIO_NEWPAIR_SUBJECT = "gorillioner.envio.newpair"
	TIMESCALE_SUBJECT     = "timeseries.>"
)

func main() {
	// Create context
	// ctx := context.Background()

	// Register workers
	envioPriceWorker := envio_worker.NewEnvioPriceWorker(envio_worker.Config{
		// Pool: pool,
	})
	envioNewPairWorker := envio_worker.NewEnvioNewPairWorker(envio_worker.Config{
		// Pool: pool,
	})

	// Configuration
	cfg := types.Config{
		NatsURL:          getEnvOrDefault("NATS_URL", "nats://localhost:4222"),
		TimescaleSubject: getEnvOrDefault("TIMESCALE_URL", TIMESCALE_SUBJECT),
		Routes: []types.RouteConfig{
			{
				Pattern:     ENVIO_PRICE_SUBJECT,
				Workers:     10,
				ChannelSize: 1000,
				Worker:      envioPriceWorker,
			},
			{
				Pattern:     ENVIO_NEWPAIR_SUBJECT,
				Workers:     10,
				ChannelSize: 1000,
				Worker:      envioNewPairWorker,
			},
		},
	}

	// Create NATS client
	natsClient, err := client.New(&config.Config{
		URL:            cfg.NatsURL,
		ConnectTimeout: 10 * time.Second,
		UseJetStream:   true,
	})
	if err != nil {
		log.Fatalf("Failed to create NATS client: %v", err)
	}
	defer natsClient.Close()

	// Create subscriptions for each route
	for _, route := range cfg.Routes {
		// Create batch subscription for better performance
		log.Printf("Creating subscription for %s", route.Pattern)
		sub, err := natsClient.Subscribe(&subscription.Options{
			Subject:      route.Pattern,
			BatchSize:    route.ChannelSize,
			BatchWindow:  time.Second,
			UseJetStream: true,
			BatchHandler: handler.BatchHandlerFunc(route.Worker.ProcessBatch),
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
