package postgres

import (
	"strugl/internal/models"
	"fmt"
	"strugl/internal/database/utils/sqlbulk"
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

	// Insert each topic of the Post in DB topics table
	stmtTopicsValueString, stmtTopicsArgs := sqlbulk.GetBulkTopicsStatement(post_id, topics)

	if stmtTopicsValueString != "" {
		stmtTopicsString := fmt.Sprintf("INSERT INTO topics (post_id, topic) VALUES %s", stmtTopicsValueString)

		stmtTopics, err := tx.Preparex(stmtTopicsString)
		if err != nil {
			tx.Rollback()
			return -1, err
		}

		_, err = stmtTopics.Exec(stmtTopicsArgs...)
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


