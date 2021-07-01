package postgres

import (
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
				WHERE username = $1`
				
	err := store.Store.QueryRowx(query, username).StructScan(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

