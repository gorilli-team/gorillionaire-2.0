package server

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	database "github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/db"
	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/query"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/client"
	"github.com/gorilli/gorillionaire-2.0/events/pkg/nats/config"
	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/events"
	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/handlers/api"

	// "github.com/gorilli/gorillionaire-2.0/signal/api/internal/ingestor"
	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/middleware"
	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/routes"

	"golang.org/x/time/rate"

	sseServer "github.com/gorilli/gorillionaire-2.0/signal/api/server/sse"
	websocketServer "github.com/gorilli/gorillionaire-2.0/signal/api/server/websocket"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

var DATABASE_URL = os.Getenv("DATABASE_TIMESERIES_URL")

const JWT_SECRET = "your-secret-here"

const HOST = "localhost:8082"

var limiter = rate.NewLimiter(1, 5)

const (
	NATS_URL = "nats://localhost:4222"
)

func rateLimiter(c *gin.Context) {
	if !limiter.Allow() {
		c.JSON(http.StatusTooManyRequests, gin.H{"error": "too many requests"})
		c.Abort()
		return
	}
	c.Next()
}

func Run() {
	fmt.Println(gin.Version)

	r := gin.Default()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	// r.Use(gin.CORS())

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // or ["*"] for development
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-CSRF-Token"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true, // Important if you're using cookies or CSRF tokens
		MaxAge:           12 * time.Hour,
	}))
	r.Use(gin.ErrorLogger())
	// r.Use(gin.BodyLimit(1000000))
	// r.Use(gin.RequestID())
	r.Use(rateLimiter)
	r.Use(middleware.CSRFMiddleware())

	r.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format("02/Jan/2006:15:04:05 -0700"),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	}))
	db, err := database.Connect(context.Background(), database.DBConfig{
		URL: DATABASE_URL,
	})

	if err != nil {
		log.Fatal().Err(err).Msg("Failed to connect database")
	}
	ctx := context.Background()
	qr := query.NewQueryManager(ctx, db)

	r.Use(func(c *gin.Context) {
		host := c.Request.Header.Get("Origin")
		c.Writer.Header().Set("Access-Control-Allow-Origin", host)
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})
	eventBus := events.NewEventBus()
	sseServer := sseServer.NewBroadcaster(eventBus)
	// ingestor := ingestor.NewIngestor(ctx, db, sseServer)
	wsServer := websocketServer.NewWebSocketServer(eventBus)
	natsClient, err := client.New(&config.Config{
		URL:          NATS_URL,
		UseJetStream: true,
	})
	if err != nil {
		log.Fatal().Err(err).Msg("Failed to create NATS client")
	}
	eventsConsumer := events.NewEventsConsumer(ctx, natsClient, eventBus)
	eventsConsumer.Start()

	go wsServer.Run()
	// go ingestor.Start()

	r.Use(func(c *gin.Context) {
		c.Set("db", db)
		c.Set("host", HOST)
		c.Set("qr", qr)
		// c.Set("ingestor", ingestor)
		c.Set("jwt_secret", []byte(JWT_SECRET))
		c.Set("sse", sseServer)
		c.Next()
	})
	r.POST("/login-generator", api.UserLoginHandler)
	wsGroup := r.Group("/ws")
	wsGroup.Use(middleware.AuthMiddleware(JWT_SECRET))
	wsGroup.GET("", wsServer.HandleWebSocket)

	routes.RegisterRoutes(r, JWT_SECRET)
	// r.Use(cors.New(cors.Config{
	// 	AllowOrigins:     []string{"*"},
	// 	AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
	// 	AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Cache-Control"},
	// 	ExposeHeaders:    []string{"Content-Length"},
	// 	AllowCredentials: true,
	// 	MaxAge:           12 * time.Hour,
	// }))
	defer db.Close()
	// defer ingestor.Stop()

	r.Run(HOST) // listen and serve on 0.0.0.0:8080
}
