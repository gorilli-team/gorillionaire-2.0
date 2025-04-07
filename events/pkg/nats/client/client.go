package client

import (
	"context"
	"fmt"
	"math"
	"sync"
	"time"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/config"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/subscription"
	"github.com/nats-io/nats.go"
)

// Client represents a NATS client
type Client struct {
	conn   *nats.Conn
	js     nats.JetStreamContext
	config *config.Config
	subs   map[string]subscription.Subscription
	mu     sync.RWMutex
	ctx    context.Context
	cancel context.CancelFunc
}

// New creates a new NATS client
func New(cfg *config.Config) (*Client, error) {
	if err := cfg.Validate(); err != nil {
		return nil, fmt.Errorf("invalid config: %w", err)
	}

	ctx, cancel := context.WithCancel(context.Background())

	client := &Client{
		config: cfg,
		subs:   make(map[string]subscription.Subscription),
		ctx:    ctx,
		cancel: cancel,
	}

	if err := client.connect(); err != nil {

		cancel()
		return nil, err
	}

	return client, nil
}

// connect establishes a connection to NATS with exponential backoff retry
func (c *Client) connect() error {
	opts := []nats.Option{
		nats.Timeout(c.config.ConnectTimeout),
		nats.MaxReconnects(c.config.MaxReconnects),
		nats.ReconnectWait(c.config.ReconnectWait),
	}

	if c.config.Username != "" && c.config.Password != "" {
		opts = append(opts, nats.UserInfo(c.config.Username, c.config.Password))
	}

	if c.config.Token != "" {
		opts = append(opts, nats.Token(c.config.Token))
	}

	if c.config.TLSConfig != nil {
		opts = append(opts, nats.ClientCert(c.config.TLSConfig.CertFile, c.config.TLSConfig.KeyFile))
		if c.config.TLSConfig.CAFile != "" {
			opts = append(opts, nats.RootCAs(c.config.TLSConfig.CAFile))
		}
	}

	var conn *nats.Conn
	var err error
	maxRetries := 10
	baseDelay := 1 * time.Second
	maxDelay := 30 * time.Second

	for i := 0; i < maxRetries; i++ {
		conn, err = nats.Connect(c.config.URL, opts...)
		if err == nil {
			break
		}

		if i == maxRetries-1 {
			return fmt.Errorf("failed to connect to NATS after %d attempts: %w", maxRetries, err)
		}

		// Calculate delay with exponential backoff and jitter
		delay := time.Duration(math.Min(float64(baseDelay*time.Duration(math.Pow(2, float64(i)))), float64(maxDelay)))
		// Add jitter (±20%)
		jitter := time.Duration(float64(delay) * 0.2)
		delay = delay + time.Duration(float64(jitter)*2*(float64(time.Now().UnixNano()%2)-0.5))

		select {
		case <-c.ctx.Done():
			return fmt.Errorf("connection attempt cancelled: %w", c.ctx.Err())
		case <-time.After(delay):
			// Retry after delay
			fmt.Printf("Retrying connection in %s\n", delay)
		}
	}

	if c.config.UseJetStream {
		js, err := conn.JetStream()
		if err != nil {
			conn.Close()
			return fmt.Errorf("failed to create JetStream context: %w", err)
		}
		c.js = js
	}
	c.conn = conn
	return nil
}

// Close closes the NATS connection
func (c *Client) Close() {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Stop all subscriptions
	for _, sub := range c.subs {
		sub.Stop()
	}

	// Close connection
	if c.conn != nil {
		c.conn.Close()
	}

	// Cancel context
	if c.cancel != nil {
		c.cancel()
	}
}

// Publish publishes a message to NATS
func (c *Client) Publish(msg *message.Message) error {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if c.conn == nil {
		return fmt.Errorf("not connected to NATS")
	}

	if c.config.UseJetStream && c.js != nil {
		_, err := c.js.Publish(msg.Subject, msg.Data)
		return err
	}

	return c.conn.Publish(msg.Subject, msg.Data)
}

// Subscribe creates a new subscription
func (c *Client) Subscribe(opts *subscription.Options) (subscription.Subscription, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.conn == nil {
		return nil, fmt.Errorf("not connected to NATS")
	}

	// Create subscription based on configuration
	var sub subscription.Subscription
	var err error

	if c.config.UseJetStream && c.js != nil {
		sub, err = c.createJetStreamSubscription(opts)
	} else {
		sub, err = c.createNatsSubscription(opts)
	}

	if err != nil {
		return nil, err
	}

	// Store subscription
	c.subs[opts.Subject] = sub

	return sub, nil
}

// createJetStreamSubscription creates a JetStream subscription
func (c *Client) createJetStreamSubscription(opts *subscription.Options) (subscription.Subscription, error) {
	if opts.BatchHandler != nil {
		return subscription.NewJetStreamBatchSubscription(c.js, opts)
	}
	return subscription.NewJetStreamSubscription(c.js, opts)
}

// createNatsSubscription creates a regular NATS subscription
func (c *Client) createNatsSubscription(opts *subscription.Options) (subscription.Subscription, error) {
	if opts.BatchHandler != nil {
		return subscription.NewBatchSubscription(c.conn, opts)
	}
	return subscription.NewSingleSubscription(c.conn, opts)
}
