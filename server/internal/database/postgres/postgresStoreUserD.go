package postgres

func (store PostgresStore) DeleteUser(username string) error {
	stmt, err := store.Store.Prepare(`DELETE FROM users WHERE username = $1`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(username)
	if err != nil {
		return err
	}

	return nil
}
