package client

import (
	"context"
	"fmt"
	"sync"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/config"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/message"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/subscription"
	"github.com/nats-io/nats.go"
)

// Client represents a NATS client
type Client struct {
	conn   *nats.Conn
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

// connect establishes a connection to NATS
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

	conn, err := nats.Connect(c.config.URL, opts...)
	if err != nil {
		return fmt.Errorf("failed to connect to NATS: %w", err)
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

	return c.conn.Publish(msg.Subject, msg.Data)
}

// Subscribe creates a new subscription
func (c *Client) Subscribe(opts *subscription.Options) (subscription.Subscription, error) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if c.conn == nil {
		return nil, fmt.Errorf("not connected to NATS")
	}

	// Create subscription
	sub, err := c.createSubscription(opts)
	if err != nil {
		return nil, err
	}

	// Store subscription
	c.subs[opts.Subject] = sub

	return sub, nil
}

// createSubscription creates a new subscription based on options
func (c *Client) createSubscription(opts *subscription.Options) (subscription.Subscription, error) {
	if opts.BatchHandler != nil {
		return c.createBatchSubscription(opts)
	}

	return c.createSingleSubscription(opts)
}

// createSingleSubscription creates a subscription for single message handling
func (c *Client) createSingleSubscription(opts *subscription.Options) (subscription.Subscription, error) {
	sub, err := subscription.NewSingleSubscription(c.conn, opts)
	if err != nil {
		return nil, err
	}

	return sub, nil
}

// createBatchSubscription creates a subscription for batch message handling
func (c *Client) createBatchSubscription(opts *subscription.Options) (subscription.Subscription, error) {
	sub, err := subscription.NewBatchSubscription(c.conn, opts)
	if err != nil {
		return nil, err
	}

	return sub, nil
}
