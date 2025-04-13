package v1

import (
	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/handlers/api/v1/signals"
	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/handlers/api/v1/sse"
	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterApiRoutes(r *gin.RouterGroup, secretKey string) {
	v1Auth := r.Group("/v1")
	v1Auth.Use(middleware.AuthMiddleware(secretKey))
	v1Auth.GET("/signals", signals.Signals)
	v1Auth.GET("/signal/:signal", sse.SSEHandler)
}
