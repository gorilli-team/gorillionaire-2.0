package query

import (
	"context"

	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
)

func (q *Query) AddSignal(ctx context.Context, signal *model.Signal) error {
	query := `
		INSERT INTO signals (name, description, created_at, updated_at)
		VALUES ($1, $2, $3, $4)
	`
	_, err := q.db.Exec(ctx, query, signal.Name, signal.Description, signal.CreatedAt, signal.UpdatedAt)
	return err
}

func (q *Query) AddSignalBatch(ctx context.Context, signals []*model.Signal) error {
	query := `
		INSERT INTO signals (name, description, created_at, updated_at)
		VALUES ($1, $2, $3, $4)
	`
	args := make([]any, len(signals)*4)
	for i, signal := range signals {
		args[i*4] = signal.Name
		args[i*4+1] = signal.Description
		args[i*4+2] = signal.CreatedAt
		args[i*4+3] = signal.UpdatedAt
	}
	_, err := q.db.Exec(ctx, query, args...)
	return err
}

func (q *Query) GetSignal(qr *model.SignalQuery) (*model.Signal, error) {
	query := `
		SELECT * FROM signals WHERE 1
	`
	if qr.ID != nil {
		query += " AND id = $1"
	}
	if qr.SignalHash != nil {
		query += " AND signal_hash = $2"
	}
	if qr.Name != nil {
		query += " AND name = $3"
	}
	if qr.Active != nil {
		query += " AND active = $4"
	}
	if qr.Limit != nil {
		query += " LIMIT $5"
	}
	if qr.Offset != nil {
		query += " OFFSET $6"
	}
	row := q.db.QueryRow(q.ctx, query, qr.ID, qr.SignalHash, qr.Name, qr.Active, qr.Limit, qr.Offset)
	signal := &model.Signal{}
	err := row.Scan(&signal.ID, &signal.Name, &signal.Description, &signal.CreatedAt, &signal.UpdatedAt)
	return signal, err
}

func (q *Query) GetSignals(qr *model.SignalQuery) ([]*model.Signal, error) {
	query := `
		SELECT * FROM signals WHERE 1
	`
	if qr.Active != nil {
		query += " AND active = $1"
	}
	if qr.Limit != nil {
		query += " LIMIT $2"
	}
	rows, err := q.db.Query(q.ctx, query, qr.ID, qr.SignalHash, qr.Name, qr.Active, qr.Limit, qr.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	signals := make([]*model.Signal, 0)
	for rows.Next() {
		signal := &model.Signal{}
		err := rows.Scan(&signal.ID, &signal.Name, &signal.Description, &signal.CreatedAt, &signal.UpdatedAt)
		if err != nil {
			return nil, err
		}
		signals = append(signals, signal)
	}
	return signals, nil
}

func (q *Query) GetSignalBatch(signals []*model.Signal) error {
	query := `
		SELECT * FROM signals WHERE id = $1
	`
	_, err := q.db.Query(q.ctx, query, signals)
	return err
}
