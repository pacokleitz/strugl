package postgres

// Delete a post and cascade delete all associated entries (topics, bookmarks, upvotes)
func (store PostgresStore) DeletePost(post_id int64) error {

	stmt, err := store.Store.Preparex(`DELETE FROM posts WHERE post_id = $1`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(post_id)
	if err != nil {
		return err
	}

	return nil
}