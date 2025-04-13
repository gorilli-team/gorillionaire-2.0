// signal/api/internal/events/events.go

package events

import (
	"context"
	"encoding/json"

	"proto-v1/event"

	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/client"
	"github.com/nats-io/nats.go"
	"github.com/rs/zerolog/log"
)

var NATS_EVENT_SIGNAL_SUBJECT = "gorillionaire.events.signal.*"

type EventsConsumer struct {
	ctx        context.Context
	natsClient *client.Client
	js         nats.JetStreamContext
	eventBus   *EventBus
}

func NewEventsConsumer(ctx context.Context, natsClient *client.Client, eventBus *EventBus) *EventsConsumer {
	return &EventsConsumer{
		ctx:        ctx,
		natsClient: natsClient,
		js:         natsClient.JetStream(),
		eventBus:   eventBus,
	}
}

func (ec *EventsConsumer) Start() error {
	return ec.subscribe("signals.*")
}

func (ec *EventsConsumer) subscribe(channel string) error {
	_, err := ec.js.Subscribe(channel, func(msg *nats.Msg) {
		var signalEvent event.SignalEvent
		if err := json.Unmarshal(msg.Data, &signalEvent); err != nil {
			log.Error().Err(err).Msg("Failed to unmarshal signal event")
			return
		}

		ec.eventBus.Publish(Event{
			Type:    SignalEvent,
			Channel: channel,
			Payload: signalEvent,
		})
	})
	return err
}
