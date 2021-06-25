package post

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"unicode"

	"strugl/internal/models"

	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/jmoiron/sqlx"
)

var (
	ErrPostDoNotExist = errors.New("post not found in db")
)

type Service struct {
	DB *sqlx.DB
}

func NewService(db *sqlx.DB) Service {
	return Service{
		DB: db,
	}
}

func (s Service) GetPost(id uint) (*models.Post, error) {
	var p models.Post
	query := `SELECT post_id, user_id, content, date_created, date_modified FROM users WHERE post_id = $1`
	err := s.DB.QueryRowx(query, id).StructScan(&p)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, err
		}
	}
	return &p, nil
}

func (s Service) GetPostsByUser(username string) ([]models.Post, error) {
	var posts []models.Post

	query := `SELECT post_id, user_id, content, date_created, date_modified FROM posts 
				INNER JOIN users ON posts.user_id = users.user_id 
				WHERE username = $1 ORDER BY date_created DESC`
	rows, err := s.DB.Queryx(query, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p models.Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

func (s Service) GetPostsByTopic(topic string) ([]models.Post, error) {
	var posts []models.Post

	query := `SELECT post_id, user_id, content, date_created, date_modified FROM posts 
				INNER JOIN topics ON posts.post_id = topics.post_id 
				WHERE topic = $1 ORDER BY date_created DESC`
	rows, err := s.DB.Queryx(query, topic)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p models.Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

func (s Service) GetPostsBookmarked(username string) ([]models.Post, error) {
	var posts []models.Post

	//query := `SELECT * FROM posts INNER JOIN topics ON posts.post_id = topics.post_id WHERE topic = $1 ORDER BY date_created ASC`
	query := `SELECT post_id, user_id, content, date_created, date_modified FROM posts 
				INNER JOIN bookmarks ON posts.post_id = bookmarks.post_id
				INNER JOIN users ON bookmarks.user_id = users.user_id
				WHERE bookmarks.user_id = $1 ORDER BY date_created DESC`

	rows, err := s.DB.Queryx(query, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p models.Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

// TODO
func (s Service) GetPostsUpvoted(username string) ([]models.Post, error) {
	var posts []models.Post
	return posts, nil
}

func (s Service) GetTopicsFeed(username string) ([]models.Post, error) {
	var posts []models.Post
	return posts, nil
}

func (s Service) GetFollowsFeed(username string) ([]models.Post, error) {
	var posts []models.Post
	return posts, nil
}

// END TODO

func (s Service) GetFeed(username string) ([]models.Post, error) {
	var posts []models.Post

	// TODO
	// query := `SELECT post_id, user_id, content, date_created, date_modified FROM posts
	// 			LEFT JOIN topics ON topics.post_id = posts.post_id
	//			LEFT JOIN interests ON interests.user_id = posts.user_id
	// 			LEFT JOIN followings ON followings.user_id = posts.user_id
	// 			WHERE followings.user_id = $1 OR interests.user_id = $1 ORDER BY date_created DESC`

	query := `SELECT post_id, user_id, content, date_created, date_modified FROM posts 
				WHERE post_id IN (
					SELECT post_id FROM topics WHERE topic in (
						SELECT topic FROM interests WHERE user_id = $1)) OR
						user_id in (SELECT following_id FROM followings WHERE user_id = $1)`

	rows, err := s.DB.Queryx(query, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p models.Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

// Insert a post in DB "posts" table with the topics entries in "topics" table
func (s Service) CreatePost(p models.Post) (int64, error) {

	// Begin transaction
	tx, err := s.DB.Beginx()
	if err != nil {
		return -1, err
	}

	// Insert Post in DB posts table
	stmtPost, err := tx.Preparex(`INSERT INTO posts (user_id, content) VALUES ($1, $2)`)
	if err != nil {
		tx.Rollback()
		return -1, err
	}

	res, err := stmtPost.Exec(p.Author, p.Content)
	if err != nil {
		tx.Rollback()
		return -1, err
	}

	post_id, err := res.LastInsertId()
	if err != nil {
		tx.Rollback()
		return -1, err
	}

	// Insert each topic of the Post in DB topics table
	postTopics := GetPostTopics(p.Content)
	stmtTopicsValueString, stmtTopicsArgs := GetBulkTopicsStatement(p.ID, postTopics)

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

	tx.Commit()
	if err != nil {
		return -1, err
	}

	return post_id, nil
}

// Delete a post and cascade delete all associated entries (topics, bookmarks, upvotes)
func (s Service) DeletePost(post_id int64) error {

	stmt, err := s.DB.Preparex(`DELETE FROM posts WHERE post_id = $1`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(post_id)
	if err != nil {
		return err
	}

	return nil
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
