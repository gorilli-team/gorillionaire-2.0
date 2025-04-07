package config

import (
	"time"
)

// Config holds the configuration for NATS client
type Config struct {
	// Connection settings
	URL            string        `json:"url" yaml:"url"`
	Username       string        `json:"username" yaml:"username"`
	Password       string        `json:"password" yaml:"password"`
	Token          string        `json:"token" yaml:"token"`
	ConnectTimeout time.Duration `json:"connect_timeout" yaml:"connect_timeout"`

	// Reconnection settings
	MaxReconnects int           `json:"max_reconnects" yaml:"max_reconnects"`
	ReconnectWait time.Duration `json:"reconnect_wait" yaml:"reconnect_wait"`

	// Flush settings
	FlushTimeout time.Duration `json:"flush_timeout" yaml:"flush_timeout"`

	// Queue group settings
	QueueGroup string `json:"queue_group" yaml:"queue_group"`

	// TLS settings
	TLSConfig *TLSConfig `json:"tls_config" yaml:"tls_config"`

	// JetStream settings
	UseJetStream bool `json:"use_jetstream" yaml:"use_jetstream"`
}

// TLSConfig holds TLS configuration
type TLSConfig struct {
	CertFile string `json:"cert_file" yaml:"cert_file"`
	KeyFile  string `json:"key_file" yaml:"key_file"`
	CAFile   string `json:"ca_file" yaml:"ca_file"`
}

// DefaultConfig returns a default configuration
func DefaultConfig() *Config {
	return &Config{
		URL:            "nats://localhost:4222",
		ConnectTimeout: 5 * time.Second,
		MaxReconnects:  5,
		ReconnectWait:  time.Second,
		FlushTimeout:   5 * time.Second,
	}
}

// Validate checks if the configuration is valid
func (c *Config) Validate() error {
	if c.URL == "" {
		return ErrInvalidURL
	}
	if c.ConnectTimeout <= 0 {
		return ErrInvalidTimeout
	}
	return nil
}
