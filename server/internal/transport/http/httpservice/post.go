package httpservice

import (
	"strugl/internal/models"
)

type PostService interface {
	GetPost(id uint) (*models.Post, error)
	GetPostsByUser(username string) ([]models.Post, error)
	GetPostsByTopic(topic string) ([]models.Post, error)
	GetPostsBookmarked(username string) ([]models.Post, error)
	GetPostsUpvoted(username string) ([]models.Post, error)
	GetTopicsFeed(username string) ([]models.Post, error)
	GetFollowsFeed(username string) ([]models.Post, error)
	GetFeed(username string) ([]models.Post, error)
	CreatePost(post models.Post) (int64, error)
	DeletePost(post_id int64) error
}
