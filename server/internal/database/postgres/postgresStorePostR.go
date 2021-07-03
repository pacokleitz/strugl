package postgres

import (
	"strugl/internal/models"
	"database/sql"
)

func (store PostgresStore) GetPost(id int64) (*models.Post, error) {

	var p models.Post

	query := `SELECT post_id, posts.user_id, username, content, date_created, date_updated FROM posts 
				INNER JOIN users on posts.user_id = users.user_id 
				WHERE post_id = $1`

	err := store.Store.QueryRowx(query, id).StructScan(&p)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

func (store PostgresStore) GetPostsByUser(username string) ([]models.Post, error) {

	var pp []models.Post

	query := `SELECT post_id, posts.user_id, username, content, date_created, date_updated FROM posts 
				INNER JOIN users ON posts.user_id = users.user_id 
				WHERE username = $1 ORDER BY date_created DESC`

	rows, err := store.Store.Queryx(query, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p models.Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		pp = append(pp, p)
	}

	return pp, nil
}

func (store PostgresStore) GetPostsByTopic(topic string) ([]models.Post, error) {

	var pp []models.Post

	query := `SELECT posts.post_id, posts.user_id, username, content, date_created, date_updated FROM posts 
				INNER JOIN topics ON posts.post_id = topics.post_id 
				INNER JOIN users on posts.user_id = users.user_id
				WHERE topic = $1 ORDER BY date_created DESC`

	rows, err := store.Store.Queryx(query, topic)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p models.Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		pp = append(pp, p)
	}

	return pp, nil
}

func (store PostgresStore) GetPostsBookmarked(username string) ([]models.Post, error) {
	var pp []models.Post

	query := `SELECT post_id, posts.user_id, content, date_created, date_updated FROM posts 
				INNER JOIN bookmarks ON posts.post_id = bookmarks.post_id
				INNER JOIN users ON bookmarks.user_id = users.user_id
				WHERE bookmarks.user_id = $1 ORDER BY date_created DESC`

	rows, err := store.Store.Queryx(query, username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p models.Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		pp = append(pp, p)
	}

	return pp, nil
}

// TO DO
func (store PostgresStore) GetPostsUpvoted(username string) ([]models.Post, error) {
	var posts []models.Post
	return posts, nil
}

func (store PostgresStore) GetTopicsFeed(username string) ([]models.Post, error) {
	var posts []models.Post
	return posts, nil
}

func (store PostgresStore) GetFollowsFeed(username string) ([]models.Post, error) {
	var posts []models.Post
	return posts, nil
}

func (store PostgresStore) GetFeed(user_id int64) ([]models.Post, error) {

	var pp []models.Post

	// à vérifier
	query := `SELECT post_id, posts.user_id, username, content, date_created, date_updated FROM posts
				LEFT JOIN topics ON topics.post_id = posts.post_id
				LEFT JOIN interests ON interests.user_id = posts.user_id
				LEFT JOIN followings ON followings.following_id = posts.user_id
				WHERE followings.user_id = $1 OR interests.user_id = $1 ORDER BY date_created DESC`

	rows, err := store.Store.Queryx(query, user_id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var p models.Post
		err = rows.StructScan(&p)
		if err != nil {
			return nil, err
		}
		pp = append(pp, p)
	}

	return pp, nil
}