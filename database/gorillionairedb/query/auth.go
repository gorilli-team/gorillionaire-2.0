package query

import (
	"context"
	"time"

	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
)

func (q *Query) GetUserByApiKey(apiKey string) (*model.User, error) {
	query := `
		SELECT id, email, password, created_at, updated_at
		FROM users
		WHERE api_key = $1
	`
	user := &model.User{}
	err := q.db.QueryRow(context.Background(), query, apiKey).Scan(&user.ID, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
	return user, err
}

func (q *Query) SaveRefreshToken(userID string, refreshToken string, expiresAt time.Time) error {
	query := `
		INSERT INTO refresh_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)`
	_, err := q.db.Exec(context.Background(), query, userID, refreshToken, expiresAt)
	return err
}

func (q *Query) GetUserByRefreshToken(refreshToken string) (*model.User, error) {
	query := `
		SELECT id, email, password, created_at, updated_at
		FROM users
		WHERE refresh_token = $1
	`
	user := &model.User{}
	err := q.db.QueryRow(context.Background(), query, refreshToken).Scan(&user.ID, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
	return user, err
}

func (q *Query) GetUserByEmail(email string) (*model.User, error) {
	query := `
		SELECT id, email, password, created_at, updated_at
		FROM users
		WHERE email = $1
	`
	user := &model.User{}
	err := q.db.QueryRow(context.Background(), query, email).Scan(&user.ID, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt)
	return user, err
}
