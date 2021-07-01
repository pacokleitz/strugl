package database

import (
	"strugl/internal/models"
)

type DataStore interface {
	CreateUser(user models.User) (string, error)
	GetUser(user_id int64) (*models.UserProfile, error)
	GetUserByUsername(username string) (*models.UserProfile, error)
	UpdateUser(username string, newUser models.User) (*models.User, error)
	DeleteUser(username string) error

	GetPost(id int64) (*models.Post, error)
	GetPostsByUser(username string) ([]models.Post, error)
	GetPostsByTopic(topic string) ([]models.Post, error)
	GetPostsBookmarked(username string) ([]models.Post, error)
	GetPostsUpvoted(username string) ([]models.Post, error)
	GetTopicsFeed(username string) ([]models.Post, error)
	GetFollowsFeed(username string) ([]models.Post, error)
	GetFeed(user_id int64) ([]models.Post, error)
	CreatePost(post models.Post) (int64, error)
	DeletePost(post_id int64) error
}