package follow

import (
	// "database/sql"
	// "errors"
	// "fmt"
	// "strings"
	// "unicode"

	// "strugl/internal/models"

	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/jmoiron/sqlx"
)


type Service struct {
	DB *sqlx.DB
}

func NewService(db *sqlx.DB) Service {
	return Service{
		DB: db,
	}
}

// func (s Service) GetFollowers(topic string) ([]models.UserProfile, error) {
// 	var pp []models.User

// 	query := `SELECT posts.post_id, posts.user_id, username, content, date_created, date_updated FROM posts 
// 				INNER JOIN topics ON posts.post_id = topics.post_id 
// 				INNER JOIN users on posts.user_id = users.user_id
// 				WHERE topic = $1 ORDER BY date_created DESC`
// 	rows, err := s.DB.Queryx(query, topic)
// 	if err != nil {
// 		return nil, err
// 	}

// 	for rows.Next() {
// 		var p models.Post
// 		err = rows.StructScan(&p)
// 		if err != nil {
// 			return nil, err
// 		}
// 		pp = append(pp, p)
// 	}

// 	return pp, nil
// }

// func (s Service) GetFollowings(id int64) (*models.Post, error) {
// 	var p models.Post
// 	query := `SELECT post_id, posts.user_id, username, content, date_created, date_updated FROM posts 
// 				INNER JOIN users on posts.user_id = users.user_id 
// 				WHERE post_id = $1`
// 	err := s.DB.QueryRowx(query, id).StructScan(&p)
// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			return nil, nil
// 		}
// 		return nil, err
// 	}
// 	return &p, nil
// }



// // Insert a post in DB "posts" table with the topics entries in "topics" table
// func (s Service) Follow(p models.Post) (int64, error) {
// 	var post_id int64

// 	// Begin transaction
// 	tx, err := s.DB.Beginx()
// 	if err != nil {
// 		return -1, err
// 	}

// 	query := `INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING post_id`
// 	err = tx.QueryRowx(query, p.Author_ID, p.Content).Scan(&post_id)
// 	if err != nil {
// 		tx.Rollback()
// 		return -1, err
// 	}

// 	// Insert each topic of the Post in DB topics table
// 	postTopics := GetPostTopics(p.Content)
// 	stmtTopicsValueString, stmtTopicsArgs := GetBulkTopicsStatement(post_id, postTopics)

// 	if stmtTopicsValueString != "" {
// 		stmtTopicsString := fmt.Sprintf("INSERT INTO topics (post_id, topic) VALUES %s", stmtTopicsValueString)

// 		stmtTopics, err := tx.Preparex(stmtTopicsString)
// 		if err != nil {
// 			tx.Rollback()
// 			return -1, err
// 		}

// 		_, err = stmtTopics.Exec(stmtTopicsArgs...)
// 		if err != nil {
// 			tx.Rollback()
// 			return -1, err
// 		}
// 	}

// 	tx.Commit()
// 	if err != nil {
// 		tx.Rollback()
// 		return -1, err
// 	}

// 	return post_id, nil
// }

// // Delete a post and cascade delete all associated entries (topics, bookmarks, upvotes)
// func (s Service) Unfollow(post_id int64) error {

// 	stmt, err := s.DB.Preparex(`DELETE FROM posts WHERE post_id = $1`)
// 	if err != nil {
// 		return err
// 	}

// 	_, err = stmt.Exec(post_id)
// 	if err != nil {
// 		return err
// 	}

// 	return nil
// }