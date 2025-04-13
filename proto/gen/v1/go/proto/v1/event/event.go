package event

// SignalEvent represents a signal event
type SignalEvent struct {
	ID        string  `json:"id"`
	Channel   string  `json:"channel"`
	Symbol    string  `json:"symbol"`
	Price     float64 `json:"price"`
	Timestamp int64   `json:"timestamp"`
}
