package postgres

func (store PostgresStore) UnfollowTopic(user_id int64, topic_id int64) error {

	stmt, err := store.Store.Preparex(`DELETE FROM users_to_topics WHERE user_id = $1 AND topic_id = $2`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(user_id, topic_id)
	if err != nil {
		return err
	}

	return nil
}

func (store PostgresStore) UnfollowUser(user_id int64, following_id int64) error {

	stmt, err := store.Store.Preparex(`DELETE FROM followings WHERE user_id = $1 AND following_id = $2`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(user_id, following_id)
	if err != nil {
		return err
	}

	return nil
}
