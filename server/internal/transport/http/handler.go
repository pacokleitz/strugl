package httpx

import (
	"github.com/julienschmidt/httprouter"
)

type Handler struct {
	Router      *httprouter.Router
	UserService UserService
	PostService PostService
	AuthService AuthService
}

func NewHandler(userService UserService, postService PostService, authService AuthService) *Handler {
	return &Handler{
		UserService: userService,
		PostService: postService,
		AuthService: authService,
	}
}

func (h *Handler) SetupRoutes() {

	h.Router = httprouter.New()

	h.Router.POST("/users", h.HandleUserCreate)
	h.Router.GET("/users/me", h.Protected(h.HandleUserMe))

	h.Router.POST("/auth", h.HandleAuth)

	h.Router.POST("/posts", h.Protected(h.HandlePostCreate))
	h.Router.GET("/posts/id/:id", h.HandlePostGet)
	h.Router.GET("/posts/user/:username", h.HandlePostsGetByUser)
	h.Router.GET("/posts/topic/:topic", h.HandlePostsGetByTopic)
	//h.Router.GET("/api/posts/feed", h.Protected(h.HandlePostsGetFeed))
}
