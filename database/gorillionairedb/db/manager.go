package gorillionairedb

// import (
// 	"context"
// 	"log"

// 	"github.com/jackc/pgx/v5"
// )

// type TimeseriesManager struct {
// 	db  *DB
// 	ctx context.Context
// }

// func NewTimeseriesManager(ctx context.Context, db *DB) *TimeseriesManager {
// 	return &TimeseriesManager{
// 		db:  db,
// 		ctx: ctx,
// 	}
// }

// func (w *TimeseriesManager) Process(ctx context.Context, msg *message.Message) error {
// 	batch := &pgx.Batch{}

// 	// Add query to batch
// 	batch.Queue(`
// 		INSERT INTO events (timestamp, data, route)
// 		VALUES ($1, $2, $3)
// 	`, event.Timestamp, event.Data, event.Route)

// 	// Execute batch
// 	br := w.pool.SendBatch(ctx, batch)
// 	defer br.Close()

// 	_, err := br.Exec()
// 	if err != nil {
// 		log.Printf("Error executing batch: %v", err)
// 		return err
// 	}

// 	return nil
// }

// // ProcessBatch handles multiple events in a single database transaction
// func (w *TimeseriesManager) ProcessBatch(ctx context.Context, events []*workers.Event) error {
// 	if len(events) == 0 {
// 		return nil
// 	}

// 	batch := &pgx.Batch{}

// 	// Add all events to the batch
// 	for _, event := range events {
// 		batch.Queue(`
// 			INSERT INTO events (timestamp, data, route)
// 			VALUES ($1, $2, $3)
// 		`, event.Timestamp, event.Data, event.Route)
// 	}

// 	// Execute batch within a transaction
// 	tx, err := w.pool.Begin(ctx)
// 	if err != nil {
// 		return err
// 	}
// 	defer tx.Rollback(ctx)

// 	br := tx.SendBatch(ctx, batch)
// 	defer br.Close()

// 	// Execute all queued queries
// 	for i := 0; i < batch.Len(); i++ {
// 		if _, err := br.Exec(); err != nil {
// 			log.Printf("Error executing batch item %d: %v", i, err)
// 			return err
// 		}
// 	}

// 	return tx.Commit(ctx)
// }
