package message

import (
	"encoding/json"
	"time"
)

// Message represents a NATS message with metadata
type Message struct {
	Subject     string            `json:"subject"`
	Data        []byte            `json:"data"`
	Headers     map[string]string `json:"headers,omitempty"`
	Timestamp   time.Time         `json:"timestamp"`
	ReplyTo     string            `json:"reply_to,omitempty"`
	SequenceNum uint64            `json:"sequence_num,omitempty"`
}

// NewMessage creates a new Message instance
func NewMessage(subject string, data []byte) *Message {
	return &Message{
		Subject:   subject,
		Data:      data,
		Headers:   make(map[string]string),
		Timestamp: time.Now(),
	}
}

// WithHeaders adds headers to the message
func (m *Message) WithHeaders(headers map[string]string) *Message {
	m.Headers = headers
	return m
}

// WithReplyTo sets the reply subject
func (m *Message) WithReplyTo(replyTo string) *Message {
	m.ReplyTo = replyTo
	return m
}

// WithSequenceNum sets the sequence number
func (m *Message) WithSequenceNum(seq uint64) *Message {
	m.SequenceNum = seq
	return m
}

// JSON unmarshals the message data into the provided interface
func (m *Message) JSON(v interface{}) error {
	return json.Unmarshal(m.Data, v)
}

// String returns the message data as a string
func (m *Message) String() string {
	return string(m.Data)
}

// Bytes returns the raw message data
func (m *Message) Bytes() []byte {
	return m.Data
}
