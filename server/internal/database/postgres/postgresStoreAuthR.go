package postgres

import (
	"database/sql"
	"strugl/internal/database/utils/sql/errors"
	"strugl/internal/models"
)

func (store PostgresStore) GetCredentials(username string) (models.AuthCredentials, error) {

	var creds models.AuthCredentials

	query := `SELECT user_id, password_hash FROM users WHERE username = $1`
	err := store.Store.QueryRowx(query, username).StructScan(&creds)
	if err != nil {
		if err == sql.ErrNoRows {
			return creds, sqlerrors.ErrUserNotFound
		}
		return creds, err
	}

	return creds, nil
}
