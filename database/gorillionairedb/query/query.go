package query

import (
	"context"

	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/db"
)

type Query struct {
	db  *db.DB
	ctx context.Context
}

func NewQueryManager(ctx context.Context, db *db.DB) *Query {
	return &Query{db, ctx}
}
