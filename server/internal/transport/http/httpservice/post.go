package httpservice

import (
	"strugl/internal/service/post"
)

type PostService interface {
	GetPost(id uint) (*post.Post, error)
	GetPostsByUser(username string) ([]post.Post, error)
	GetPostsByTopic(topic string) ([]post.Post, error)
	GetPostsBookmarked(username string) ([]post.Post, error)
	GetPostsUpvoted(username string) ([]post.Post, error)
	GetTopicsFeed(username string) ([]post.Post, error)
	GetFollowsFeed(username string) ([]post.Post, error)
	GetFeed(username string) ([]post.Post, error)
	CreatePost(post post.Post) error
	DeletePost(post_id int64) error
}
