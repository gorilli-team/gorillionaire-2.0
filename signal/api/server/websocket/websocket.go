package websocket

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/events"

	// "github.com/gorilli/gorillionaire-2.0/signal/api/internal/ingestor"

	"github.com/gin-gonic/gin"
	wb "github.com/gorilla/websocket"
	"github.com/vmihailenco/msgpack/v5"
)

type ChannelAction string

const (
	ChannelSubscribe   ChannelAction = "subscribe"
	ChannleUnsubscribe ChannelAction = "unsubscribe"
	ChannelMessage     ChannelAction = "message"
)

type MessageType string

const (
	MessagePing        MessageType = "ping"
	MessageSubscribe   MessageType = "subscribe"
	MessageUnsubscribe MessageType = "unsubscribe"
	MessageSignal      MessageType = "signal"
	MessageTransaction MessageType = "transaction"
)

type Message struct {
	Type    MessageType `msgpack:"type"`
	Payload interface{} `msgpack:"payload"`
}

type SubscribePayload struct {
	Channel string `msgpack:"channel"`
}

type ActionType string

const (
	BUY  ActionType = "BUY"
	SELL ActionType = "SELL"
)

type SignalPayload struct {
	UserID     int        `json:"user_id" msgpack:"user_id"`
	Channel    string     `json:"channel" msgpack:"channel"`
	SignalID   string     `json:"signal_id" msgpack:"signal_id"`
	Source     string     `json:"source" msgpack:"source"`
	Ticker     string     `json:"ticker" msgpack:"ticker"`
	Price      float64    `json:"price" msgpack:"price"`
	Confidence float64    `json:"confidence" msgpack:"confidence"`
	Side       ActionType `json:"side" msgpack:"side"`
	AssetType  string     `json:"asset_type" msgpack:"asset_type"`
	SignalTime int64      `json:"signal_time" msgpack:"signal_time"`
}

type TransactionPayload struct {
	UserID        int     `json:"user_id" msgpack:"user_id"`
	TransactionId string  `json:"transaction_id" msgpack:"transaction_id"`
	Side          string  `json:"side" msgpack:"side"`
	Symbol        string  `json:"symbol" msgpack:"symbol"`
	Quantity      float64 `json:"quantity" msgpack:"quantity"`
	Price         float64 `json:"price" msgpack:"price"`
	OrderTime     int64   `json:"order_time" msgpack:"order_time"`
}

// Client represents a single WebSocket connection
type Client struct {
	conn *wb.Conn
	send chan []byte
	id   int
}

type ClientJob struct {
	client    *Client
	message   *Message
	frameType int
}

type ChannelJob struct {
	action  ChannelAction
	channel string
	client  *Client
	message []byte
}

type ClientMessageJob struct {
	client  *Client
	message []byte
}

type WebSocketJob interface {
}

// WebSocketServer manages all connected clients and broadcasting
type WebSocketServer struct {
	clients  map[*Client]bool
	channels map[string][]*Client
	eventBus *events.EventBus
	// broadcast  chan []byte
	register          chan *Client
	unregister        chan *Client
	channelJobs       chan *ChannelJob
	clientJobs        chan *ClientJob
	clientMessageJobs chan *ClientMessageJob
	signals           chan *SignalPayload
	transactions      chan *TransactionPayload
	clientMu          sync.RWMutex
	channelMu         sync.RWMutex
}

// Initialize a new WebSocket server instance
func NewWebSocketServer(eventBus *events.EventBus) *WebSocketServer {
	return &WebSocketServer{
		clients:  make(map[*Client]bool),
		channels: make(map[string][]*Client),
		eventBus: eventBus,
		// broadcast:  make(chan []byte, 1024),
		register:          make(chan *Client, 1024),
		unregister:        make(chan *Client, 1024),
		channelJobs:       make(chan *ChannelJob, 1024),
		clientJobs:        make(chan *ClientJob, 1024),
		clientMessageJobs: make(chan *ClientMessageJob, 1024),
		signals:           make(chan *SignalPayload, 1024),
		transactions:      make(chan *TransactionPayload, 1024),
		clientMu:          sync.RWMutex{},
		channelMu:         sync.RWMutex{},
	}
}

// Run starts the WebSocket server's main loop
func (ws *WebSocketServer) Run() {
	for {
		select {
		case client := <-ws.register:
			ws.clientMu.Lock()
			ws.clients[client] = true
			ws.clientMu.Unlock()

		case client := <-ws.unregister:
			ws.clientMu.Lock()
			if _, ok := ws.clients[client]; ok {
				delete(ws.clients, client)
				close(client.send)
			}

			ws.clientMu.Unlock()
		case clientJobs := <-ws.clientMessageJobs:
			clientJobs.client.send <- clientJobs.message
		case channelJob := <-ws.channelJobs:
			switch channelJob.action {
			case ChannelSubscribe:
				ws.channelMu.Lock()
				ws.channels[channelJob.channel] = append(ws.channels[channelJob.channel], channelJob.client)
				ws.channelMu.Unlock()
			case ChannleUnsubscribe:
				ws.channelMu.Lock()
				clients := ws.channels[channelJob.channel]
				for i, c := range clients {
					if c == channelJob.client {
						clients = append(clients[:i], clients[i+1:]...)
						break
					}
				}
				ws.channels[channelJob.channel] = clients
				ws.channelMu.Unlock()
			case ChannelMessage:
				ws.channelMu.RLock()
				clients := ws.channels[channelJob.channel]
				for _, c := range clients {
					c.send <- channelJob.message
				}
				ws.channelMu.RUnlock()
			}
		// case message := <-ws.broadcast:
		// 	ws.clientMu.RLock()
		// 	for client := range ws.clients {
		// 		select {
		// 		case client.send <- message:
		// 		default:
		// 			close(client.send)
		// 			delete(ws.clients, client)
		// 		}
		// 	}
		// 	ws.clientMu.RUnlock()
		case job := <-ws.clientJobs:
			job.client.processMessage(ws, job.message, job.frameType)
		case signal := <-ws.signals:
			ws.eventBus.Publish(events.Event{
				Channel: signal.Channel,
				Payload: signal,
			})
			// case transaction := <-ws.transactions:
			// 	ws.eventBus.Publish(events.TransactionEvent, transaction)
		}

	}
}

// Upgrader configuration
var upgrader = wb.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
	CheckOrigin: func(r *http.Request) bool {
		return true // Adjust for production
	},
}

// HandleWebSocket manages incoming WebSocket connections
func (ws *WebSocketServer) HandleWebSocket(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		log.Println("User ID not found in context")
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("Upgrade error: %v", err)
		return
	}

	client := &Client{
		conn: conn,
		send: make(chan []byte, 256),
		id:   int(userID.(float64)),
	}

	ws.register <- client

	go client.readPump(ws)
	go client.writePump()
}

// readPump reads incoming messages from clients
func (c *Client) readPump(ws *WebSocketServer) {
	defer func() {
		ws.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(8192)
	c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		frameType, data, err := c.conn.ReadMessage()
		if err != nil {
			log.Printf("Client %s disconnected: %v\n", c, err)
			break
		}

		msg := new(Message)
		if err := msgpack.Unmarshal(data, msg); err != nil {
			log.Printf("Message decode error: %v\n", err)
			continue
		}
		ws.clientJobs <- &ClientJob{client: c, message: msg, frameType: frameType}
		// ws.broadcast <- message // broadcast message to all clients
	}
}

func (c *Client) unmarshalPayload(msg interface{}, destination interface{}, frameType int) error {
	switch payload := msg.(type) {
	case []byte:
		if frameType == wb.BinaryMessage {
			if err := msgpack.Unmarshal(payload, destination); err != nil {
				log.Printf("Subscribe message decode error (msgpack): %v\n", err)
				return err
			}
		} else {
			if err := json.Unmarshal(payload, destination); err != nil {
				log.Printf("Subscribe message decode error (json): %v\n", err)
				return err
			}
		}

	case map[string]interface{}:
		// Already decoded map — convert manually or using mapstructure/json again
		// Option 1: Re-marshal and unmarshal into struct
		raw, err := json.Marshal(payload)
		if err != nil {
			log.Printf("Marshal error: %v\n", err)
			return err
		}
		if err := json.Unmarshal(raw, destination); err != nil {
			log.Printf("Subscribe message decode error (json->struct): %v\n", err)
			return err
		}

	default:
		log.Printf("Unsupported payload type: %T\n", payload)
		return fmt.Errorf("unsupported payload type: %T", payload)
	}
	return nil
}

func (c *Client) processMessage(ws *WebSocketServer, msg *Message, frameType int) {
	switch msg.Type {
	case "ping":
		c.send <- []byte("pong")
	case MessageSubscribe:
		subMsg := new(SubscribePayload)
		if err := c.unmarshalPayload(msg.Payload, subMsg, frameType); err != nil {
			log.Printf("Subscribe message decode error: %v\n", err)
			return
		}
		log.Printf("Client %s subscribed to channel %s\n", c, subMsg.Channel)

		ws.channelJobs <- &ChannelJob{
			action:  ChannelSubscribe,
			channel: subMsg.Channel,
			client:  c,
		}

	case MessageUnsubscribe:
		subMsg := new(SubscribePayload)
		if err := c.unmarshalPayload(msg.Payload, subMsg, frameType); err != nil {
			log.Printf("unsubscribed message decode error: %v\n", err)
			return
		}
		log.Printf("Client %s unsubscribed from channel %s\n", c, subMsg.Channel)
		ws.channelJobs <- &ChannelJob{
			action:  ChannleUnsubscribe,
			channel: subMsg.Channel,
			client:  c,
		}
	case MessageSignal:
		signalMsg := new(SignalPayload)
		if err := c.unmarshalPayload(msg.Payload, signalMsg, frameType); err != nil {
			log.Printf("signal message decode error: %v\n", err)
			return
		}
		signalMsg.UserID = c.id
		ws.signals <- signalMsg
	case MessageTransaction:
		transactionMsg := new(TransactionPayload)
		if err := c.unmarshalPayload(msg.Payload, transactionMsg, frameType); err != nil {
			log.Printf("signal message decode error: %v\n", err)
			return
		}
		transactionMsg.UserID = c.id
		ws.transactions <- transactionMsg
	default:
		log.Printf("Unknown message type: %s\n", msg.Type)
	}
}

// writePump sends messages to the client
func (c *Client) writePump() {
	ticker := time.NewTicker((54 * time.Second))
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(wb.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(wb.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write([]byte("\n"))
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(wb.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
