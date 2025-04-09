package publisher

import (
	"log"

	"github.com/nats-io/nats.go"
)

type Publisher struct {
	js      nats.JetStreamContext
	msgChan chan *PublishMessage
}

type PublishMessage struct {
	Subject string
	Data    []byte
}

func NewPublisher(js nats.JetStreamContext) *Publisher {
	msgChan := make(chan *PublishMessage, 1000)
	publisher := &Publisher{js: js, msgChan: msgChan}
	go publisher.Start()
	return publisher
}

func (p *Publisher) Publish(msg *PublishMessage) {
	if p == nil {
		log.Printf("Publisher: attempted to publish but Publisher is nil or not initialized")
		return
	}
	if p.msgChan == nil {
		log.Printf("Publisher: attempted to publish but channel is not initialized")
		return
	}
	if p.js == nil {
		log.Printf("Publisher: attempted to publish but js is not initialized")
		return
	}
	select {
	case p.msgChan <- msg:
		// sent successfully
		log.Printf("Publisher: message sent to %s", msg.Subject)
	default:
		log.Printf("Publisher: message dropped, channel is full")
	}
}

func (p *Publisher) PublishBatch(msgs []*PublishMessage) error {
	for _, msg := range msgs {
		_, err := p.js.Publish(msg.Subject, msg.Data)
		if err != nil {
			log.Printf("Publisher: failed to publish to %s: %v", msg.Subject, err)
		} else {
			log.Printf("Publisher: published to %s", msg.Subject)
		}
	}
	return nil
}

func (p *Publisher) Start() {
	for msg := range p.msgChan {
		_, err := p.js.Publish(msg.Subject, msg.Data)
		if err != nil {
			log.Printf("Publisher: failed to publish to %s: %v", msg.Subject, err)
		} else {
			log.Printf("Publisher: published to %s", msg.Subject)
		}
	}
}

func (p *Publisher) Stop() {
	log.Println("Publisher: stopping")

	close(p.msgChan)
}
