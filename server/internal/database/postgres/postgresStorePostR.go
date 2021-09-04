package postgres

import (
	"database/sql"
	"strugl/internal/models"
)

func (store PostgresStore) GetPost(id int64) (*models.Post, error) {

	var p models.Post

	query := `SELECT post_id, posts.user_id, username, profile_name, content, date_created, date_updated FROM posts 
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

	pp := make([]models.Post, 0)

	query := `SELECT post_id, posts.user_id, username, profile_name, avatar, content, date_created, date_updated FROM posts 
				INNER JOIN users ON posts.user_id = users.user_id 
				WHERE LOWER(username) = LOWER($1) ORDER BY date_created DESC`

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

	pp := make([]models.Post, 0)

	query := `SELECT posts.post_id, posts.user_id, username, profile_name, avatar, content, date_created, date_updated FROM posts 
				INNER JOIN posts_to_topics ON posts_to_topics.post_id = posts.post_id
				INNER JOIN topics ON posts_to_topics.topic_id = topics.topic_id 
				INNER JOIN users on posts.user_id = users.user_id
				WHERE topics.topic_name = LOWER($1) ORDER BY date_created DESC`

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

func (store PostgresStore) GetPostsBookmarked(user_id int64) ([]models.Post, error) {

	pp := make([]models.Post, 0)

	query := `SELECT posts.post_id, posts.user_id, username, profile_name, avatar, content, posts.date_created, date_updated FROM posts 
				INNER JOIN bookmarks ON bookmarks.post_id = posts.post_id
				INNER JOIN users on posts.user_id = users.user_id
				WHERE bookmarks.user_id = $1 ORDER BY bookmarks.date_created DESC`

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

// TO DO
func (store PostgresStore) GetPostsUpvoted(username string) ([]models.Post, error) {
	pp := make([]models.Post, 0)
	return pp, nil
}

func (store PostgresStore) GetTopicsFeed(username string) ([]models.Post, error) {
	pp := make([]models.Post, 0)
	return pp, nil
}

func (store PostgresStore) GetFollowsFeed(username string) ([]models.Post, error) {
	pp := make([]models.Post, 0)
	return pp, nil
}

func (store PostgresStore) GetFeed(user_id int64) ([]models.Post, error) {

	pp := make([]models.Post, 0)

	// TO DO
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

	// temporary
	query := `SELECT DISTINCT posts.post_id, users.username, users.profile_name, users.avatar, posts.user_id, posts.content, posts.date_created, posts.date_updated FROM posts
				INNER JOIN users on posts.user_id = users.user_id
				WHERE posts.post_id IN (
					SELECT post_id FROM posts_to_topics WHERE topic_id IN (
						SELECT topic_id FROM users_to_topics WHERE user_id = $1
						)
					)
					OR posts.user_id IN (
						SELECT following_id FROM followings WHERE user_id = $1
					)
					OR posts.user_id = $1 ORDER BY posts.date_created DESC`

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

	query := `SELECT topic_id, topic_name FROM topics WHERE topic_name = LOWER($1)`

	err := store.Store.QueryRowx(query, topic).StructScan(&t)
	if err != nil {
		return nil, err
	}
	return &t, nil
}

func (store PostgresStore) GetRecomTopics(user_id int64) ([]models.Topic, error) {

	tt := make([]models.Topic, 0)

	query := `SELECT topic_name, topic_id FROM topics
				WHERE topic_id NOT IN (
					SELECT topic_id FROM users_to_topics WHERE user_id = $1
				)
				ORDER BY RANDOM()
				LIMIT 3`

	rows, err := store.Store.Queryx(query, user_id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var t models.Topic
		err = rows.StructScan(&t)
		if err != nil {
			return nil, err
		}
		tt = append(tt, t)
	}
	return tt, nil
}
