package sse

import (
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/query"
	"github.com/gorilli/gorillionaire-2.0/signal/api/server/sse"

	"github.com/gin-gonic/gin"
)

func SSEHandler(c *gin.Context) {

	signalHash := c.Param("signal_hash")
	if signalHash == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "signal_hash is required"})
		return
	}

	qrInterface, exist := c.Get("qr")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "timeseries manager not found"})
		return
	}
	qr := qrInterface.(*query.Query)

	ch, err := qr.GetSignal(&model.SignalQuery{
		SignalHash: &signalHash,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if ch == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "signal not found"})
		return
	}

	userID := fmt.Sprintf("%v", c.MustGet("user_id"))

	broadcasterInterface, exist := c.Get("sse")
	if !exist {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "sse broker not found"})
		return
	}
	broadcaster := broadcasterInterface.(*sse.Broadcaster)

	client := &sse.Client{
		ID:       userID,
		Channel:  signalHash,
		Messages: make(chan []byte, 10),
		Done:     make(chan struct{}),
	}

	broadcaster.AddClient(client)

	// Set headers
	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("Connection", "keep-alive")
	c.Writer.Header().Set("Transfer-Encoding", "chunked")

	// Keep-alive ticker
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	go func() {
		<-c.Request.Context().Done()
		close(client.Done)
	}()

	c.Stream(func(w io.Writer) bool {
		select {
		case msg := <-client.Messages:
			c.SSEvent("tick", string(msg))
		case <-ticker.C:
			c.SSEvent("ping", time.Now().Unix())
		case <-client.Done:
			broadcaster.RemoveClient(client)
			return false
		}
		return true
	})
}
