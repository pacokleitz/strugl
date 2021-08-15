package postgres

import (
	"database/sql"
	"strugl/internal/models"
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

	query := `SELECT post_id, posts.user_id, username, avatar, content, date_created, date_updated FROM posts 
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

	query := `SELECT posts.post_id, posts.user_id, username, avatar, content, date_created, date_updated FROM posts 
				INNER JOIN posts_to_topics ON posts_to_topics.post_id = posts.post_id
				INNER JOIN topics ON posts_to_topics.topic_id = topics.topic_id 
				INNER JOIN users on posts.user_id = users.user_id
				WHERE topics.topic_name = $1 ORDER BY date_created DESC`

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
	// query := `SELECT DISTINCT posts.post_id, auth.user_id, auth.username, posts.content, posts.date_created, posts.date_updated FROM users
				
	// 			/* get the topics followed by the user */
	// 			LEFT JOIN users_to_topics ON users_to_topics.user_id = users.user_id
	// 			/* get the posts_ids associated to these topics */
	// 			LEFT JOIN posts_to_topics ON posts_to_topics.topic_id = users_to_topics.topic_id
				
	// 			/* get the users followed by the user */
	// 			LEFT JOIN followings ON followings.user_id = users.user_id

	// 			/* get the posts from the users followed by the user OR associated with the topics followed by the user */
	// 			LEFT JOIN posts ON (followings.following_id = posts.user_id OR posts.post_id = posts_to_topics.post_id)

	// 			/* get the usernames of the posts authors */
	// 			LEFT JOIN users auth ON posts.user_id = auth.user_id
				
	// 			WHERE users.user_id = $1 OR auth.user_id = $1 ORDER BY date_created DESC`

	query := `SELECT DISTINCT posts.post_id, users.username, users.avatar, posts.user_id, posts.content, posts.date_created, posts.date_updated FROM posts
				INNER JOIN users on posts.user_id = users.user_id
				WHERE posts.post_id IN (
					SELECT post_id FROM posts_to_topics WHERE topic_id IN (
						SELECT topic_id FROM users_to_topics WHERE user_id = $1
						)
					)
					OR posts.user_id IN (
						SELECT following_id FROM followings WHERE user_id = $1
					)
					OR posts.user_id = $1`

	

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

func (store PostgresStore) GetTopic(topic string) (*models.Topic, error) {

	var t models.Topic

	query := `SELECT topic_id, topic_name FROM topics WHERE topic_name = $1`

	err := store.Store.QueryRowx(query, topic).StructScan(&t)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &t, nil
}