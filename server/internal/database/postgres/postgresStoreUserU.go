package postgres

import (
	"strugl/internal/models"
)

// TO DO
func (store PostgresStore) UpdateUser(username string, newUser models.User) (*models.User, error) {

	stmt, err := store.Store.Prepare(`UPDATE users SET x=y, z=u WHERE LOWER(username) = LOWER($1)`)
	if err != nil {
		return &newUser, err
	}

	_, err = stmt.Exec(username)
	if err != nil {
		return &newUser, err
	}

	return &newUser, nil

}
