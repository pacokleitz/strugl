package postgres

import (
	"database/sql"
	"strugl/internal/models"
)

func (store PostgresStore) GetUser(user_id int64) (*models.UserProfile, error) {

	var user models.UserProfile

	query := `SELECT user_id, username, profile_name, bio, avatar FROM users 
				WHERE user_id = $1`

	err := store.Store.QueryRowx(query, user_id).StructScan(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (store PostgresStore) GetUserByUsername(username string) (*models.UserProfile, error) {

	var user models.UserProfile

	query := `SELECT user_id, username, profile_name, bio, avatar FROM users 
				WHERE LOWER(username) = LOWER($1)`

	err := store.Store.QueryRowx(query, username).StructScan(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (store PostgresStore) CheckEmailAvailability(email string) bool {

	var db_email string

	query := `SELECT email FROM users WHERE email = $1`
	err := store.Store.QueryRow(query, email).Scan(&db_email)
	if err != nil {
		return err == sql.ErrNoRows
	}
	return false
}

func (store PostgresStore) CheckUsernameAvailability(username string) bool {

	var db_username string

	query := `SELECT username FROM users WHERE LOWER(username) = LOWER($1)`
	err := store.Store.QueryRow(query, username).Scan(&db_username)
	if err != nil {
		return err == sql.ErrNoRows
	}
	return false
}

func (store PostgresStore) GetRecomUsers(user_id int64) ([]models.UserProfile, error) {

	uu := make([]models.UserProfile, 0)

	query := `SELECT user_id, username, profile_name, bio, avatar FROM users
				WHERE user_id != $1 
				AND user_id NOT IN (
					SELECT following_id FROM followings WHERE user_id = $1
				)
				ORDER BY RANDOM()
				LIMIT 3`

	rows, err := store.Store.Queryx(query, user_id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var u models.UserProfile
		err = rows.StructScan(&u)
		if err != nil {
			return nil, err
		}
		uu = append(uu, u)
	}

	return uu, nil
}
