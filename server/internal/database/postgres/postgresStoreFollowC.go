package postgres

func (store PostgresStore) Follow(user_id int64, following_id int64) error {

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

func (store PostgresStore) Unfollow(user_id int64, following_id int64) error {

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
