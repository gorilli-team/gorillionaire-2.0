package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	gorillionairedb "github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/db"
	"github.com/gorilli/gorillionaire-2.0/events/database/internal/types"
	"github.com/gorilli/gorillionaire-2.0/events/database/internal/workers"
	"github.com/gorilli/gorillionaire-2.0/events/database/pkg/utils"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/client"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/config"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/handler"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/subscription"
)

var gorillionaire_DB_DSN = utils.GetEnvOrDefault("gorillionaire_DB_DSN", "postgres://gorilli:gorilli@localhost:5452/gorillionaire?sslmode=disable")

const (
	GORILLIONAIRE_DB_NEWPAIR_SUBJECT = "gorillionaire.db.newpair"
	GORILLIONAIRE_DB_PRICE_SUBJECT   = "gorillionaire.db.price"
)

func main() {

	// Create NATS client
	natsClient, err := client.New(&config.Config{
		URL:            utils.GetEnvOrDefault("NATS_URL", "nats://localhost:4222"),
		ConnectTimeout: 10 * time.Second,
		UseJetStream:   true,
	})
	if err != nil {
		log.Fatalf("Failed to create NATS client: %v", err)
	}

	db, err := gorillionairedb.Connect(gorillionaire_DB_DSN)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	databaseNewPairWorker := workers.NewNewPairDBWorker(&workers.Config{
		DB: db,
	})

	databasePriceWorker := workers.NewPriceDBWorker(&workers.Config{
		DB: db,
	})

	cfg := types.Config{
		// NatsURL: getEnvOrDefault("NATS_URL", "nats://localhost:4222"),
		Routes: []types.RouteConfig{
			{
				Pattern:     GORILLIONAIRE_DB_NEWPAIR_SUBJECT,
				Workers:     10,
				ChannelSize: 1000,
				Worker:      databaseNewPairWorker,
			},
			{
				Pattern:     GORILLIONAIRE_DB_PRICE_SUBJECT,
				Workers:     10,
				ChannelSize: 1000,
				Worker:      databasePriceWorker,
			},
		},
	}
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
