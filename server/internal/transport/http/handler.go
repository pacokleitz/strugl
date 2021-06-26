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

	h.Router.POST("/api/users", h.HandleUserCreate)
	h.Router.POST("/api/users/auth", h.HandleUserAuth)
	h.Router.GET("/api/users/me", h.Protected(h.HandleUserMe))

	h.Router.POST("/api/posts", h.Protected(h.HandlePostCreate))
	h.Router.POST("/api/posts/user", h.HandleGetPostsByUser)
}
