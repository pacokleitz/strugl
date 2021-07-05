package postgres

import (
	"fmt"
	"strugl/internal/database/utils/sql/bulk"
	"strugl/internal/models"
)

func (store PostgresStore) CreatePost(post models.Post, topics []string) (int64, error) {

	var post_id int64

	// Begin transaction
	tx, err := store.Store.Beginx()
	if err != nil {
		return -1, err
	}

	query := `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING post_id`
	err = tx.QueryRowx(query, post.Author_ID, post.Content).Scan(&post_id)
	if err != nil {
		tx.Rollback()
		return -1, err
	}

	numTopics := len(topics)

	if numTopics > 0 {

		// Insert the topics in database
		stmtTopicsValueString := sqlbulk.GetBulkInsertStatement(numTopics)

		stmtTopicsString := fmt.Sprintf("INSERT INTO topics topic_name VALUES %s", stmtTopicsValueString)

		stmtTopics, err := tx.Preparex(stmtTopicsString)
		if err != nil {
			tx.Rollback()
			return -1, err
		}

		// topics convert to interface ?
		_, err = stmtTopics.Exec(topics)
		if err != nil {
			tx.Rollback()
			return -1, err
		}

		// Link every topic to the post in database
		stmtTopicsValueString, stmtTopicsArgs := sqlbulk.GetBulkPostsTopicsStatement(post_id, topics)

		stmtPostsTopicsString := fmt.Sprintf("INSERT INTO topics (topic_id, topic_name) VALUES %s", stmtTopicsValueString)

		stmtPostsTopics, err := tx.Preparex(stmtPostsTopicsString)
		if err != nil {
			tx.Rollback()
			return -1, err
		}

		_, err = stmtPostsTopics.Exec(stmtTopicsArgs...)
		if err != nil {
			tx.Rollback()
			return -1, err
		}

	}

	tx.Commit()
	if err != nil {
		tx.Rollback()
		return -1, err
	}

	return post_id, nil
}
