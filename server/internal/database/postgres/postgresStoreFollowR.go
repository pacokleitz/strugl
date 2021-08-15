package postgres

import (
	"strugl/internal/models"
)

func (store PostgresStore) GetFollowers(user_id int64) ([]models.UserProfile, error) {

	uu := make([]models.UserProfile, 0)

	query := `SELECT users.user_id, username, profile_name, bio, avatar FROM users
				INNER JOIN followings ON users.user_id = followings.user_id
				WHERE followings.following_id = $1`

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

func (store PostgresStore) GetFollowings(user_id int64) ([]models.UserProfile, error) {

	uu := make([]models.UserProfile, 0)

	query := `SELECT users.user_id, username, profile_name, bio, avatar FROM users
				INNER JOIN followings ON users.user_id = followings.following_id
				WHERE followings.user_id = $1`

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
