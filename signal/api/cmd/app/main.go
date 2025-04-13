package main

import (
	"github.com/gorilli/gorillionaire-2.0/signal/api/server"

	"github.com/rs/zerolog"
)

func main() {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	server.Run()
}
