package db

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	_ "github.com/lib/pq"
)

type DBConfig struct {
	URL         string
	MaxConns    *int32
	MinConns    *int32
	MaxConnIdle *time.Duration
}

// DB is a wrapper around the sql.DB type
type DB struct {
	pool *pgxpool.Pool
}

type BatchQuery struct {
	Query string
	Args  []interface{}
}

// Connect creates a new connection to the database
func Connect(ctx context.Context, config DBConfig) (*DB, error) {
	// ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	// defer cancel()

	poolConfig, err := pgxpool.ParseConfig(config.URL)
	if err != nil {
		log.Fatalf("Unable to parse config: %v", err)
	}

	if config.MaxConns != nil {
		poolConfig.MaxConns = *config.MaxConns
	}
	if config.MinConns != nil {
		poolConfig.MinConns = *config.MinConns
	}
	if config.MaxConnIdle != nil {
		poolConfig.MaxConnIdleTime = *config.MaxConnIdle
	}
	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)

	if err != nil {
		return nil, fmt.Errorf("failed to connect to the database: %w", err)
	}

	return NewDB(pool), nil
}

// NewDB creates a new DB instance
func NewDB(pool *pgxpool.Pool) *DB {
	return &DB{pool}
}

func (db *DB) Close() {
	db.pool.Close()
}

// QueryRow is a wrapper around sql.DB.QueryRow
func (db *DB) QueryRow(ctx context.Context, query string, args ...interface{}) pgx.Row {
	row := db.pool.QueryRow(ctx, query, args...)
	return row
}

func (db *DB) Query(ctx context.Context, query string, args ...interface{}) (pgx.Rows, error) {
	rows, err := db.pool.Query(ctx, query, args...)
	return rows, err
}

func (db *DB) Exec(ctx context.Context, query string, args ...interface{}) (int64, error) {
	tag, err := db.pool.Exec(ctx, query, args...)
	if err != nil {
		return 0, err
	}
	return tag.RowsAffected(), nil
}

func (db *DB) Batch(ctx context.Context, queries *[]BatchQuery) ([]int64, error) {
	batch := &pgx.Batch{}
	for _, q := range *queries {
		batch.Queue(q.Query, q.Args...)
	}

	br := db.pool.SendBatch(ctx, batch)
	defer br.Close()

	results := make([]int64, len(*queries))
	for i := range *queries {
		tag, err := br.Exec()
		if err != nil {
			return nil, err
		}
		results[i] = tag.RowsAffected()
	}

	return results, nil
}
