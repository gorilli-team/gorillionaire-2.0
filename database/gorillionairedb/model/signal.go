package model

import "time"

type Signal struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Active      bool      `json:"active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type SignalQuery struct {
	ID         *int    `json:"id"`
	SignalHash *string `json:"signal_hash"`
	Name       *string `json:"name"`
	Active     *bool   `json:"active"`
	Limit      *int    `json:"limit"`
	Offset     *int    `json:"offset"`
}
