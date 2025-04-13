package query

import (
	"context"
	"fmt"
	"time"

	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/db"
	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
	"github.com/jackc/pgx/v5"
)

func (q *Query) AddCurrency(ctx context.Context, currency *model.Currency) error {

	createdAt := time.Now()
	updatedAt := time.Now()
	query := `
		INSERT INTO currency (symbol, name, description, type, chain_id, address, decimals, icon_url, website_url, coingecko_id, cmc_id, codex_id, creator_address, total_supply, circulating_supply, is_scam, is_active, is_verified, creation_date, launch_date, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
	`
	_, err := q.db.Exec(ctx, query, currency.Symbol, currency.Name, currency.Description, currency.Type, currency.ChainId, currency.Address, currency.Decimals, currency.IconURL, currency.WebsiteURL, currency.CoingeckoID, currency.CmcID, currency.CodexID, currency.CreatorAddress, currency.TotalSupply, currency.CirculatingSupply, currency.IsScam, currency.IsActive, currency.IsVerified, currency.CreationDate, currency.LaunchDate, createdAt, updatedAt)
	if err != nil {
		return err
	}
	return nil

}

func (q *Query) AddCurrencyBatch(ctx context.Context, currencies []*model.Currency) error {

	createdAt := time.Now()
	updatedAt := time.Now()
	query := `
		INSERT INTO currency (symbol, name, description, type, chain_id, address, decimals, icon_url, website_url, coingecko_id, cmc_id, codex_id, creator_address, total_supply, circulating_supply, is_scam, is_active, is_verified, creation_date, launch_date, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
	`
	batch := &pgx.Batch{}
	for _, currency := range currencies {
		batch.Queue(query, currency.Symbol, currency.Name, currency.Description, currency.Type, currency.ChainId, currency.Address, currency.Decimals, currency.IconURL, currency.WebsiteURL, currency.CoingeckoID, currency.CmcID, currency.CodexID, currency.CreatorAddress, currency.TotalSupply, currency.CirculatingSupply, currency.IsScam, currency.IsActive, currency.IsVerified, currency.CreationDate, currency.LaunchDate, createdAt, updatedAt)
	}
	batchQueries := &[]db.BatchQuery{
		{
			Query: query,
			Args:  []interface{}{currencies},
		},
	}
	results, err := q.db.Batch(ctx, batchQueries)
	if err != nil {
		return err
	}
	for _, result := range results {
		if result != 1 {
			return fmt.Errorf("failed to insert currency: %d", result)
		}
	}
	return nil

}

func (q *Query) GetCurrency(ctx context.Context, currency *model.CurrencyQuery) error {
	query := `
		SELECT * FROM currency WHERE 1=1
	`
	if currency.Symbol != nil {
		query += ` AND symbol = $1`
	}
	if currency.Name != nil {
		query += ` AND name = $2`
	}

	if currency.Type != nil {
		query += ` AND type = $4`
	}
	if currency.ChainId != nil {
		query += ` AND chain_id = $5`
	}
	if currency.Address != nil {
		query += ` AND address = $6`
	}
	if currency.Decimals != nil {
		query += ` AND decimals = $7`
	}

	if currency.CoingeckoID != nil {
		query += ` AND coingecko_id = $10`
	}
	if currency.CmcID != nil {
		query += ` AND cmc_id = $11`
	}
	if currency.IsActive != nil {
		query += ` AND is_active = $12`
	}
	if currency.IsVerified != nil {
		query += ` AND is_verified = $13`
	}
	if currency.LaunchDate != nil {
		query += ` AND launch_date = $14`
	}
	if currency.Limit != nil {
		query += ` LIMIT $15`
	}
	if currency.Offset != nil {
		query += ` OFFSET $16`
	}

	rows, err := q.db.Query(ctx, query, currency.Symbol, currency.Name, currency.Type, currency.ChainId, currency.Address, currency.Decimals, currency.CoingeckoID, currency.CmcID, currency.CodexID, currency.IsScam, currency.IsActive, currency.IsVerified, currency.LaunchDate, currency.Limit, currency.Offset)
	if err != nil {
		return err
	}
	defer rows.Close()

	return nil
}

func (q *Query) GetCurrencyBatch(ctx context.Context, currencies []*model.Currency) error {
	return nil
}
