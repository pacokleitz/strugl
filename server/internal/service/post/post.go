package post

import (
	"errors"

	"strugl/internal/database"
	"strugl/internal/models"

	_ "github.com/jackc/pgx/v4/stdlib"
)

var (
	ErrPostDoNotExist = errors.New("post not found in db")
)

type Service struct {
	Store database.DataStore
}

func NewService(store database.DataStore) Service {
	return Service{
		Store: store,
	}
}

func (s Service) GetPost(id int64) (*models.Post, error) {
	return s.Store.GetPost(id)
}

func (s Service) GetPostsByUser(username string) ([]models.Post, error) {
	return s.Store.GetPostsByUser(username)
}

func (s Service) GetPostsByTopic(topic string) ([]models.Post, error) {
	return s.Store.GetPostsByTopic(topic)
}

func (s Service) GetPostsBookmarked(username string) ([]models.Post, error) {
	return s.Store.GetPostsBookmarked(username)
}

// TODO Section
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

func (s Service) GetFeed(user_id int64) ([]models.Post, error) {
	return s.Store.GetFeed(user_id)
}

// Insert a post in DB "posts" table with the topics entries in "topics" table
func (s Service) CreatePost(p models.Post) (int64, error) {

	topics := GetPostTopics(p.Content)
	return s.Store.CreatePost(p, topics)
}

// Delete a post and cascade delete all associated entries (topics, bookmarks, upvotes)
func (s Service) DeletePost(post_id int64) error {
	return s.Store.DeletePost(post_id)
}

func (s Service) GetTopic(topic string) (*models.Topic, error) {
	return s.Store.GetTopic(topic)
}

func (s Service) GetRecomTopics(user_id int64) ([]models.Topic, error) {
	return s.Store.GetRecomTopics(user_id)
}