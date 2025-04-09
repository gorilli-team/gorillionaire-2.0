package query

import (
	"context"

	gorillionairedb "github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/db"
	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
)

func AddNewPair(ctx context.Context, db *gorillionairedb.DB, pair *model.Pair) error {
	query := `
		INSERT INTO pairs (base_currency_id, quote_currency_id, base_token_address, quote_token_address, chain_name, symbol, pair_type, pool_address, fee_percent, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`
	_, err := db.Exec(ctx, query, pair.BaseCurrencyID, pair.QuoteCurrencyID, pair.BaseTokenAddress, pair.QuoteTokenAddress, pair.ChainName, pair.Symbol, pair.PairType, pair.PoolAddress, pair.FeePercent, pair.IsActive)
	return err
}

func AddNewPairBatch(ctx context.Context, db *gorillionairedb.DB, pairs []*model.Pair) error {
	query := `
		INSERT INTO pairs (base_currency_id, quote_currency_id, base_token_address, quote_token_address, chain_name, symbol, pair_type, pool_address, fee_percent, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`
	args := make([]any, len(pairs)*10)
	for i, pair := range pairs {
		args[i*10] = pair.BaseCurrencyID
		args[i*10+1] = pair.QuoteCurrencyID
		args[i*10+2] = pair.BaseTokenAddress
		args[i*10+3] = pair.QuoteTokenAddress
		args[i*10+4] = pair.ChainName
		args[i*10+5] = pair.Symbol
		args[i*10+6] = pair.PairType
		args[i*10+7] = pair.PoolAddress
		args[i*10+8] = pair.FeePercent
		args[i*10+9] = pair.IsActive
	}
	_, err := db.Exec(ctx, query, args...)
	return err
}

func GetNewPair(ctx context.Context, db *gorillionairedb.DB, pairQuery *model.PairQuery) (*[]model.Pair, error) {
	query := `
		SELECT * FROM pairs WHERE base_currency_id = $1 AND quote_currency_id = $2 AND base_token_address = $3 AND quote_token_address = $4 AND chain_name = $5 AND symbol = $6 AND pair_type = $7 AND pool_address = $8 AND fee_percent = $9 AND is_active = $10
	`
	rows, err := db.Query(query, pairQuery.BaseCurrencyID, pairQuery.QuoteCurrencyID, pairQuery.BaseTokenAddress, pairQuery.QuoteTokenAddress, pairQuery.ChainName, pairQuery.Symbol, pairQuery.PairType, pairQuery.PoolAddress, pairQuery.FeePercent, pairQuery.IsActive)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	pairList := make([]model.Pair, 0)
	for rows.Next() {
		pair := model.Pair{}
		err := rows.Scan(&pair.ID, &pair.BaseCurrencyID, &pair.QuoteCurrencyID, &pair.BaseTokenAddress, &pair.QuoteTokenAddress, &pair.ChainName, &pair.Symbol, &pair.PairType, &pair.PoolAddress, &pair.FeePercent, &pair.IsActive)
		if err != nil {
			return nil, err
		}
		pairList = append(pairList, pair)
	}

	return &pairList, nil
}
