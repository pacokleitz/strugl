package httpx

import (
	"github.com/julienschmidt/httprouter"
	"strugl/internal/transport/http/httpservice"
)

type Handler struct {
	Router      *httprouter.Router
	UserService httpservice.UserService
	PostService httpservice.PostService
	AuthService httpservice.AuthService
}

func NewHandler(userService httpservice.UserService, postService httpservice.PostService, authService httpservice.AuthService) *Handler {
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
}
