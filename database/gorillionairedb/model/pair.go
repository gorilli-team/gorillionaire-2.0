package model

import "time"

type Pair struct {
	ID                int       `json:"id" db:"id"`
	BaseCurrencyID    int       `json:"base_currency_id" db:"base_currency_id"`
	QuoteCurrencyID   int       `json:"quote_currency_id" db:"quote_currency_id"`
	BaseTokenAddress  string    `json:"base_token_address" db:"base_token_address"`
	QuoteTokenAddress string    `json:"quote_token_address" db:"quote_token_address"`
	ChainId           int       `json:"chain_id" db:"chain_id"`
	Symbol            string    `json:"symbol" db:"symbol"`
	PairType          string    `json:"pair_type" db:"pair_type"`
	PoolAddress       string    `json:"pool_address" db:"pool_address"`
	FeePercent        float64   `json:"fee_percent" db:"fee_percent"`
	IsActive          bool      `json:"is_active" db:"is_active"`
	CreatedAt         time.Time `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at" db:"updated_at"`
}

type PairQuery struct {
	BaseCurrencyID    *int
	QuoteCurrencyID   *int
	BaseTokenAddress  *string
	QuoteTokenAddress *string
	ChainId           *int
	Symbol            *string
	PairType          *string
	PoolAddress       *string
	FeePercent        *float64
	IsActive          *bool
	Limit             *int
	Offset            *int
}
