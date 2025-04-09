package types

import (
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/worker"
)

type RouteConfig struct {
	Pattern     string
	Workers     int
	ChannelSize int
	Worker      worker.Worker
}

type Config struct {
	NatsURL string
	Routes  []RouteConfig
}
