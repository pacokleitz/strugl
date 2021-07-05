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
	CheckUsernameAvailability(username string) bool
	CheckEmailAvailability(email string) bool

	GetPost(id int64) (*models.Post, error)
	GetPostsByUser(username string) ([]models.Post, error)
	GetPostsByTopic(topic string) ([]models.Post, error)
	GetPostsBookmarked(username string) ([]models.Post, error)
	GetPostsUpvoted(username string) ([]models.Post, error)
	GetTopicsFeed(username string) ([]models.Post, error)
	GetFollowsFeed(username string) ([]models.Post, error)
	GetFeed(user_id int64) ([]models.Post, error)
	CreatePost(post models.Post, topics []string) (int64, error)
	DeletePost(post_id int64) error

	GetCredentials(username string) (models.AuthCredentials, error)

	GetFollowers(user_id int64) ([]models.UserProfile, error)
	GetFollowings(user_id int64) ([]models.UserProfile, error)
	FollowUser(user_id int64, following_id int64) error
	UnfollowUser(user_id int64, following_id int64) error
	FollowTopic(user_id int64, topic string) error
	UnfollowTopic(user_id int64, topic string) error
}
