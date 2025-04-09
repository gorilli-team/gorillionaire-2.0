package model

import "time"

type Currency struct {
	ID              int       `json:"id" db:"id"`
	Symbol          string    `json:"symbol" db:"symbol"`
	Name            string    `json:"name" db:"name"`
	Description     string    `json:"description" db:"description"`
	Type            string    `json:"type" db:"type"`
	Chain           string    `json:"chain" db:"chain"`
	ContractAddress string    `json:"contract_address" db:"contract_address"`
	Decimals        int       `json:"decimals" db:"decimals"`
	IconURL         string    `json:"icon_url" db:"icon_url"`
	WebsiteURL      string    `json:"website_url" db:"website_url"`
	CoingeckoID     string    `json:"coingecko_id" db:"coingecko_id"`
	CmcID           string    `json:"cmc_id" db:"cmc_id"`
	IsActive        bool      `json:"is_active" db:"is_active"`
	IsVerified      bool      `json:"is_verified" db:"is_verified"`
	LaunchDate      time.Time `json:"launch_date" db:"launch_date"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

type CurrencyQuery struct {
	Symbol          *string
	Name            *string
	Type            *string
	Chain           *string
	ContractAddress *string
	Decimals        *int
	CoingeckoID     *string
	CmcID           *string
	IsActive        *bool
	IsVerified      *bool
	LaunchDate      *time.Time
	Limit           *int
	Offset          *int
}
