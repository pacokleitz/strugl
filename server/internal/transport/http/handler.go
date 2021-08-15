package httpx

import (
	"github.com/julienschmidt/httprouter"
)

type Handler struct {
	Router        *httprouter.Router
	UserService   UserService
	PostService   PostService
	AuthService   AuthService
	FollowService FollowService
}

func NewHandler(userService UserService, postService PostService, authService AuthService, followService FollowService) *Handler {
	return &Handler{
		UserService:   userService,
		PostService:   postService,
		AuthService:   authService,
		FollowService: followService,
	}
}

func (h *Handler) SetupRoutes() {

	h.Router = httprouter.New()

	h.Router.POST("/users", h.HandleUserCreate)
	h.Router.GET("/users/name/:username", h.HandleUserByUsername)
	h.Router.GET("/users/id/:id", h.HandleUserByID)
	h.Router.GET("/users/me", h.Protected(h.HandleUserMe))

	h.Router.GET("/topics/:name", h.HandleTopicByName)

	h.Router.POST("/auth", h.HandleAuth)
	h.Router.POST("/auth/token", h.HandleAuthToken)

	h.Router.POST("/posts", h.Protected(h.HandlePostCreate))
	h.Router.GET("/posts/id/:id", h.HandlePostGet)
	h.Router.GET("/posts/user/:username", h.HandlePostsGetByUser)
	h.Router.GET("/posts/topic/:topic", h.HandlePostsGetByTopic)
	h.Router.GET("/posts/feed", h.Protected(h.HandlePostsGetFeed))

	h.Router.POST("/follow/user", h.Protected(h.HandleFollowUser))
	h.Router.POST("/unfollow/user", h.Protected(h.HandleUnfollowUser))
	h.Router.POST("/follow/topic", h.Protected(h.HandleFollowTopic))
	h.Router.POST("/unfollow/topic", h.Protected(h.HandleUnfollowTopic))
	
	h.Router.GET("/followers/:id", h.HandleGetFollowers)
	h.Router.GET("/followings/:id", h.HandleGetFollowings)

}
