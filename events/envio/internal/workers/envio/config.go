package envio

import (
	"time"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/publisher"
)

type DBMessage struct {
	Route string
	Data  []*[]byte
}

type Config struct {
	// Pool        *pgxpool.Pool
	BatchSize   int
	BatchWindow time.Duration
	Publisher   *publisher.Publisher
	PubSubject  string
}
