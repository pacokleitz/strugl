package postgres

func (store PostgresStore) FollowUser(user_id int64, following_id int64) error {

	stmt, err := store.Store.Preparex(`INSERT INTO followings (user_id, following_id) VALUES ($1, $2)`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(user_id, following_id)
	if err != nil {
		return err
	}

	return nil
}

func (store PostgresStore) FollowTopic(user_id int64, topic_id int64) error {

	stmt, err := store.Store.Preparex(`INSERT INTO users_to_topics (user_id, topic_id) VALUES ($1, $2)`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(user_id, topic_id)
	if err != nil {
		return err
	}

	return nil
}