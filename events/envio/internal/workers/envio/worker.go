package envio

// EnvioEvent is a common interface for all Envio event types
type EnvioEvent interface {
	GetTimestamp() string
	GetData() []byte
}

// ... rest of the code ...
