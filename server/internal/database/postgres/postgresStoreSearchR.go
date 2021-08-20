package postgres

import (
	"strugl/internal/models"
)

// simple placeholder for search function
func (store PostgresStore) SearchUser(username string) ([]models.UserProfile, error) {

	uu := make([]models.UserProfile, 0)

	query := `SELECT user_id, username, profile_name, bio, avatar FROM users
				WHERE username ILIKE $1 || '%'
				ORDER BY LENGTH(username) ASC
				LIMIT 5`

	rows, err := store.Store.Queryx(query, username)
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

// simple placeholder for search function
func (store PostgresStore) SearchTopic(topic string) ([]models.Topic, error) {

	tt := make([]models.Topic, 0)

	query := `SELECT topic_id, topic_name FROM topics
				WHERE topic_name ILIKE $1 || '%'
				ORDER BY LENGTH(topic_name) ASC
				LIMIT 5`

	rows, err := store.Store.Queryx(query, topic)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var t models.Topic
		err = rows.StructScan(&t)
		if err != nil {
			return nil, err
		}
		tt = append(tt, t)
	}

	return tt, nil
}
