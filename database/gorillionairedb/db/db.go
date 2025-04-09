package gorillionairedb

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

// DB is a wrapper around the sql.DB type
type DB struct {
	*pgxpool.Pool
	ctx context.Context
}

type BatchQuery struct {
	query string
	args  []interface{}
}

// Connect creates a new connection to the database
func Connect(dsn string) (*DB, error) {
	ctx := context.Background()
	// ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	// defer cancel()

	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		log.Fatalf("Unable to parse config: %v", err)
	}

	poolConfig.MaxConns = 10
	poolConfig.MinConns = 2

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)

	if err != nil {
		return nil, fmt.Errorf("failed to connect to the database: %w", err)
	}

	return New(pool, ctx), nil
}

// NewDB creates a new DB instance
func New(pool *pgxpool.Pool, ctx context.Context) *DB {
	return &DB{pool, ctx}
}

func (db *DB) Close() {
	defer db.Pool.Close()
}

// QueryRow is a wrapper around sql.DB.QueryRow
func (db *DB) QueryRow(query string, args ...interface{}) pgx.Row {
	row := db.Pool.QueryRow(db.ctx, query, args...)
	return row
}

func (db *DB) Query(query string, args ...interface{}) (pgx.Rows, error) {
	rows, err := db.Pool.Query(db.ctx, query, args...)
	return rows, err
}

func (db *DB) Batch(queries []BatchQuery) pgx.BatchResults {
	batch := &pgx.Batch{}
	for i := range queries {
		batch.Queue(queries[i].query, queries[i].args...)
	}
	br := db.Pool.SendBatch(db.ctx, batch)
	return br
}
