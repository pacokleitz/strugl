package postgres

import (
	"strugl/internal/models"
	"fmt"
	"unicode"
	"strings"
)

func (store PostgresStore) CreatePost(p models.Post) (int64, error) {

	var post_id int64

	// Begin transaction
	tx, err := store.Store.Beginx()
	if err != nil {
		return -1, err
	}

	query := `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING post_id`
	err = tx.QueryRowx(query, p.Author_ID, p.Content).Scan(&post_id)
	if err != nil {
		tx.Rollback()
		return -1, err
	}

	// Insert each topic of the Post in DB topics table
	postTopics := GetPostTopics(p.Content)
	stmtTopicsValueString, stmtTopicsArgs := GetBulkTopicsStatement(post_id, postTopics)

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

// Extract a slice of topics from the post content
func GetPostTopics(postContent string) []string {

	var postTopics []string

	postWords := strings.Split(postContent, " ")

	for _, word := range postWords {
		if topic, isTopic := IsTopic(word); isTopic {
			postTopics = append(postTopics, topic)
		}
	}

	return postTopics
}

// Check if a word is a hashtag returning a bool if it matched and the topic string
func IsTopic(w string) (string, bool) {

	wTrim := strings.TrimSpace(w)

	if wTrim[0] == '#' {
		for _, letter := range wTrim[1:] {
			if !unicode.IsLetter(letter) && !unicode.IsDigit(letter) {
				return "", false
			}
		}
		return wTrim[1:], true
	}
	return "", false
}

// Make bulk inserting possible without having to query DB multiple times
// Create sql statement string inserting all topics at once (Batch Insert)
func GetBulkTopicsStatement(post_id int64, topics []string) (string, []interface{}) {

	valueStrings := make([]string, 0, len(topics))
	valueArgs := make([]interface{}, 0, len(topics)*2)
	i := 1

	for _, topic := range topics {
		valueString := fmt.Sprintf("($%d, $%d)", i, i+1)
		valueStrings = append(valueStrings, valueString)
		valueArgs = append(valueArgs, post_id)
		valueArgs = append(valueArgs, topic)
		i += 2
	}

	return strings.Join(valueStrings, ","), valueArgs
}
