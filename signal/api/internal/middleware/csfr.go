package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/csrf"
)

func CSRFMiddleware() gin.HandlerFunc {
	csrfMiddleware := csrf.Protect(
		[]byte("32-byte-long-auth-key-123456789012"), // 32 bytes key
		csrf.Secure(false),                           // ⚠️ In production set to true
		csrf.ErrorHandler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			http.Error(w, "CSRF token mismatch", http.StatusForbidden)
		})),
	)

	return func(c *gin.Context) {
		csrfMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Wrap writer to satisfy both Gin and gorilla/csrf
			writer := &wrappedWriter{ResponseWriter: c.Writer, Writer: w}
			c.Writer = writer
			c.Request = r
			c.Next()
		})).ServeHTTP(c.Writer, c.Request)
	}
}

// Correct wrapped writer
type wrappedWriter struct {
	gin.ResponseWriter                     // Gin's ResponseWriter
	Writer             http.ResponseWriter // Gorilla's ResponseWriter
}

// Ensure to override necessary methods explicitly:

func (w *wrappedWriter) Header() http.Header {
	return w.Writer.Header()
}

func (w *wrappedWriter) Write(data []byte) (int, error) {
	return w.Writer.Write(data)
}

func (w *wrappedWriter) WriteHeader(statusCode int) {
	w.Writer.WriteHeader(statusCode)
}
