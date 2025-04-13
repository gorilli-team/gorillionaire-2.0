package routes

import (
	"net/http"

	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/handlers"
	"github.com/gorilli/gorillionaire-2.0/signal/api/internal/handlers/api"
	v1 "github.com/gorilli/gorillionaire-2.0/signal/api/internal/routes/v1"

	"github.com/gorilla/csrf"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, secretKey string) {

	root := r.Group("/")
	root.GET("/ping", handlers.Ping)
	root.GET("/health", handlers.Health)
	root.GET("/version", handlers.Version)

	root.GET("/csrf-token", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"csrf_token": csrf.Token(c.Request),
		})
	})
	root.POST("/refresh-token", api.RefreshTokenHandler)
	apiGroup := r.Group("/api")
	apiGroup.POST("/login", api.UserLoginHandler)
	apiGroup.POST("/auth/api-key", api.ApiKeyLoginHandler)
	root.POST("/register", api.UserRegisterHandler)
	v1.RegisterApiRoutes(apiGroup, secretKey)

}
