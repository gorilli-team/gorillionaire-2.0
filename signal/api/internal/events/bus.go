// signal/api/internal/events/eventbus.go

package events

import (
	"sync"
)

type EventType string

const (
	SignalEvent EventType = "signal"
)

type Event struct {
	Type    EventType   `json:"type"`
	Channel string      `json:"channel"`
	Payload interface{} `json:"payload"`
}

type EventBus struct {
	subscribers map[chan Event]bool
	mu          sync.RWMutex
}

func NewEventBus() *EventBus {
	return &EventBus{
		subscribers: make(map[chan Event]bool),
	}
}

func (eb *EventBus) Subscribe() chan Event {
	eb.mu.Lock()
	defer eb.mu.Unlock()
	ch := make(chan Event, 100)
	eb.subscribers[ch] = true
	return ch
}

func (eb *EventBus) Unsubscribe(ch chan Event) {
	eb.mu.Lock()
	defer eb.mu.Unlock()
	delete(eb.subscribers, ch)
	close(ch)
}

func (eb *EventBus) Publish(event Event) {
	eb.mu.RLock()
	defer eb.mu.RUnlock()

	for subscriber := range eb.subscribers {
		select {
		case subscriber <- event:
		default:
			// Drop event if subscriber's buffer is full
		}
	}
}
