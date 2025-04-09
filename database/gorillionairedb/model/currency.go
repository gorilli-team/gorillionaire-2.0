package model

import "time"

type Currency struct {
	ID                int       `json:"id" db:"id"`
	Symbol            string    `json:"symbol" db:"symbol"`
	Name              string    `json:"name" db:"name"`
	Description       string    `json:"description" db:"description"`
	Type              string    `json:"type" db:"type"`
	Address           string    `json:"address" db:"address"`
	IconURL           string    `json:"icon_url" db:"icon_url"`
	WebsiteURL        string    `json:"website_url" db:"website_url"`
	ImageBannerURL    string    `json:"image_banner_url" db:"image_banner_url"`
	CoingeckoID       string    `json:"coingecko_id" db:"coingecko_id"`
	CmcID             string    `json:"cmc_id" db:"cmc_id"`
	CodexID           string    `json:"codex_id" db:"codex_id"`
	CreatorAddress    string    `json:"creator_address" db:"creator_address"`
	TotalSupply       float64   `json:"total_supply" db:"total_supply"`
	CirculatingSupply float64   `json:"circulating_supply" db:"circulating_supply"`
	ChainId           int       `json:"chain_id" db:"chain_id"`
	Decimals          int       `json:"decimals" db:"decimals"`
	IsScam            bool      `json:"is_scam" db:"is_scam"`
	IsActive          bool      `json:"is_active" db:"is_active"`
	IsVerified        bool      `json:"is_verified" db:"is_verified"`
	CreationDate      time.Time `json:"creation_date" db:"creation_date"`
	LaunchDate        time.Time `json:"launch_date" db:"launch_date"`
	CreatedAt         time.Time `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at" db:"updated_at"`
}

type CurrencyQuery struct {
	Symbol      *string
	Name        *string
	Type        *string
	ChainId     *int
	Address     *string
	Decimals    *int
	CoingeckoID *string
	CmcID       *string
	CodexID     *string
	IsActive    *bool
	IsVerified  *bool
	IsScam      *bool
	LaunchDate  *time.Time
	Limit       *int
	Offset      *int
}
