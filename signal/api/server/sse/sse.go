// internal/sse/broadcaster.go
package sse

import (
	"encoding/json"
	"fmt"
	"sync"

	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/events"
	"github.com/rs/zerolog/log"
)

type Client struct {
	ID       string
	Channel  string
	Messages chan []byte
	Done     chan struct{}
}

type Broadcaster struct {
	mu       sync.RWMutex
	clients  map[string]map[string]*Client // channel -> id -> client
	eventBus *events.EventBus
}

func NewBroadcaster(eventBus *events.EventBus) *Broadcaster {
	b := &Broadcaster{
		clients:  make(map[string]map[string]*Client),
		eventBus: eventBus,
	}

	// Subscribe to event bus
	eventCh := eventBus.Subscribe()
	go b.handleEvents(eventCh)

	return b
}

func (b *Broadcaster) handleEvents(eventCh chan events.Event) {
	for event := range eventCh {
		// Convert event to JSON bytes
		data, err := json.Marshal(event)
		if err != nil {
			log.Error().Err(err).Msg("Failed to marshal event")
			continue
		}

		// Broadcast to all clients subscribed to the event's channel
		b.Broadcast(event.Channel, data)
	}
}

func (b *Broadcaster) AddClient(client *Client) {
	b.mu.Lock()
	defer b.mu.Unlock()

	if b.clients[client.Channel] == nil {
		b.clients[client.Channel] = make(map[string]*Client)
	}
	b.clients[client.Channel][client.ID] = client
	fmt.Printf("Client %s subscribed to channel %s\n", client.ID, client.Channel)
}

func (b *Broadcaster) RemoveClient(client *Client) {
	b.mu.Lock()
	defer b.mu.Unlock()

	if _, ok := b.clients[client.Channel]; ok {
		delete(b.clients[client.Channel], client.ID)
		if len(b.clients[client.Channel]) == 0 {
			delete(b.clients, client.Channel)
		}
		fmt.Printf("Client %s disconnected from channel %s\n", client.ID, client.Channel)
	}
}

func (b *Broadcaster) Broadcast(channel string, message []byte) {
	b.mu.RLock()
	defer b.mu.RUnlock()

	if clients, ok := b.clients[channel]; ok {
		for _, client := range clients {
			select {
			case client.Messages <- message:
			default:
				// Drop message if buffer is full
			}
		}
	}
}
