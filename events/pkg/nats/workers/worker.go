package workers

import (
	"context"
)

// Event represents a message to be processed
type Event struct {
	Timestamp string      `json:"timestamp"`
	Data      interface{} `json:"data"`
	Route     string      `json:"route"`
}

// Worker defines the interface that all worker implementations must satisfy
type Worker interface {
	// Process handles a single event
	Process(ctx context.Context, event *Event) error
	// Name returns the unique identifier for this worker
	Name() string
}

// Registry maintains a map of all available workers
type Registry struct {
	workers map[string]Worker
}

// NewRegistry creates a new worker registry
func NewRegistry() *Registry {
	return &Registry{
		workers: make(map[string]Worker),
	}
}

// Register adds a worker to the registry
func (r *Registry) Register(w Worker) {
	r.workers[w.Name()] = w
}

// Get retrieves a worker by name
func (r *Registry) Get(name string) (Worker, bool) {
	w, ok := r.workers[name]
	return w, ok
}
