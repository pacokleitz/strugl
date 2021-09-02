package postgres

import (
	"strugl/internal/models"
)

// TO DO
func (store PostgresStore) UpdateUser(user_id int64, newUser models.UserProfile) error {

	stmt, err := store.Store.Prepare(`UPDATE users SET profile_name=$2, bio=$3 WHERE user_id = $1`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(user_id, newUser.ProfileName, newUser.Bio)
	if err != nil {
		return err
	}

	return nil
}

func (store PostgresStore) UpdateUserAvatar(user_id int64, avatar string) error {

	stmt, err := store.Store.Prepare(`UPDATE users SET avatar=$2 WHERE user_id = $1`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(user_id, avatar)
	if err != nil {
		return err
	}

	return nil
}