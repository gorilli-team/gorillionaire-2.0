package types

import "proto-v1/envio"

// EnvioEvent is a common interface for all Envio event types
type EnvioEvent interface {
	GetBlockTimestamp() string
	GetTransactionHash() string
}

// PriceEvent is a type alias for EnvioPriceEvent
type PriceEvent = envio.EnvioPriceEvent

// NewPairEvent is a type alias for EnvioNewPair
type NewPairEvent = envio.EnvioNewPair
