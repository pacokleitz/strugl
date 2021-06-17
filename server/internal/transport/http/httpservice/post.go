package httpservice

import (
	"strugl/internal/service/post"
)

type PostService interface {
	GetPost(ID uint) (post.Post, error)
	GetUserPosts(username string) (post.Post, error)
	GetTopicPosts(topic string) ([]post.Post, error)
	CreatePost(user post.Post) (post.Post, error)
	UpdatePost(ID uint, newUser post.Post) (post.Post, error)
	DeletePost(ID uint) error
}
