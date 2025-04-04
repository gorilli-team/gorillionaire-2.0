package config

import "errors"

var (
	// ErrInvalidURL is returned when the NATS URL is invalid
	ErrInvalidURL = errors.New("invalid NATS URL")

	// ErrInvalidTimeout is returned when the timeout value is invalid
	ErrInvalidTimeout = errors.New("invalid timeout value")

	// ErrInvalidTLSConfig is returned when the TLS configuration is invalid
	ErrInvalidTLSConfig = errors.New("invalid TLS configuration")
)
