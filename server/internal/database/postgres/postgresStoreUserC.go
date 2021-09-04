package postgres

import (
	"strugl/internal/models"
)

func (store PostgresStore) CreateUser(user models.User) (string, error) {

	stmt, err := store.Store.Prepare(`INSERT INTO users (username, profile_name, bio, avatar, password_hash) VALUES ($1, $2, $3, $4, $5)`)
	if err != nil {
		return "", err
	}

	_, err = stmt.Exec(user.Username, user.Username, user.Bio, user.Avatar, user.Password)
	if err != nil {
		return "", err
	}

	return user.Username, nil
}
