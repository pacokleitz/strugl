package postgres

import (
	"strugl/internal/models"
)

func (store PostgresStore) CreateUser(user models.User) (error) {

	stmt, err := store.Store.Prepare(`INSERT INTO users (username, profile_name, bio, email, avatar, password_hash) VALUES ($1, $2, $3, $4, $5, $6)`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(user.Username, user.Username, user.Bio, user.Email, user.Avatar, user.Password)
	if err != nil {
		return err
	}

	return nil
}