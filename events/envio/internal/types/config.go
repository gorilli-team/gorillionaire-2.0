package types

import (
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/workers"
)

type RouteConfig struct {
	Pattern     string
	Workers     int
	ChannelSize int
	Worker      workers.Worker
}

type Config struct {
	NatsURL          string
	TimescaleSubject string
	Routes           []RouteConfig
}
