package post

import (
	"database/sql"

	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/jmoiron/sqlx"
)

type Service struct {
	DB *sqlx.DB
}

type Post struct {
	ID           int64  `json:"id" db:"post_id"`
	Author       string `json:"author" db:"user_id"`
	Content      string `json:"content" db:"content"`
	Upvotes      int64  `json:"upvotes" db:"upvotes"`
	DateCreated  string `json:"date_created" db:"date_created"`
	DateModified string `json:"date_modified" db:"date_modified"`
}

func NewService(db *sqlx.DB) Service {
	return Service{
		DB: db,
	}
}

func (s Service) GetPost(id uint) (*Post, error) {
	var p Post
	query := `SELECT post_id, user_id, content, date_created, date_modified FROM users WHERE post_id = $1`
	err := s.DB.QueryRowx(query, id).StructScan(&p)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, err
		}
	}
	return &p, nil
}

func (s Service) GetPostsByUser(username string) ([]Post, error) {
	var posts []Post

	//query := `SELECT * FROM posts WHERE user_id IN (SELECT user_id FROM users WHERE username = $1) ORDER BY date_created ASC`
	query := `SELECT post_id, user_id, content, date_created, date_modified FROM posts 
				INNER JOIN users ON posts.user_id = users.user_id 
				WHERE username = $1 ORDER BY date_created ASC`
	rows, err := s.DB.Queryx(query, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

func (s Service) GetPostsByTopic(topic string) ([]Post, error) {
	var posts []Post

	query := `SELECT post_id, user_id, content, date_created, date_modified FROM posts 
				INNER JOIN topics ON posts.post_id = topics.post_id 
				WHERE topic = $1 ORDER BY date_created ASC`
	rows, err := s.DB.Queryx(query, topic)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

func (s Service) GetPostsBookmarked(username string) ([]Post, error) {
	var posts []Post

	//query := `SELECT * FROM posts INNER JOIN topics ON posts.post_id = topics.post_id WHERE topic = $1 ORDER BY date_created ASC`
	query := `SELECT post_id, user_id, content, date_created, date_modified FROM posts 
				INNER JOIN bookmarks ON posts.post_id = bookmarks.post_id
				INNER JOIN users ON bookmarks.user_id = users.user_id
				WHERE bookmarks.user_id = $1 ORDER BY date_created ASC`

	rows, err := s.DB.Queryx(query, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

// TODO
func (s Service) GetPostsUpvoted(username string) ([]Post, error) {
	var posts []Post
	return posts, nil
}

func (s Service) GetTopicsFeed(username string) ([]Post, error) {
	var posts []Post
	return posts, nil
}

func (s Service) GetFollowsFeed(username string) ([]Post, error) {
	var posts []Post
	return posts, nil
}
// END TODO

func (s Service) GetFeed(username string) ([]Post, error) {
	var posts []Post

	// TODO
	query := `SELECT post_id, user_id, content, date_created, date_modified FROM posts 
				INNER JOIN followings ON followings.user_id = .post_id
				INNER JOIN topics ON topics.user_id = users.user_id
				WHERE bookmarks.user_id = $1 ORDER BY date_created ASC`

	rows, err := s.DB.Queryx(query, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

func (s Service) CreatePost(Post) error {
	return nil
}
func (s Service) UpdatePost(Post) (Post, error)
func (s Service) DeletePost(Post) error
