package subscription

import (
	"github.com/nats-io/nats-server/v2/server"
)

func natsServer() (*server.Server, error) {
	opts := &server.Options{
		Port:     4222,
		HTTPPort: -1,
		Cluster:  server.ClusterOpts{Port: -1},
		NoLog:    true,
		NoSigs:   true,
	}
	return server.NewServer(opts)
}
