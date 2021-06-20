package httpx

import (
	"strugl/internal/transport/http/httpservice"
	"github.com/julienschmidt/httprouter"
)

type Handler struct {
	Router      *httprouter.Router
	UserService httpservice.UserService
}

func NewHandler(userService httpservice.UserService) *Handler {
	return &Handler{
		UserService: userService,
	}
}

func (h *Handler) SetupRoutes() {

	h.Router = httprouter.New()


	h.Router.POST("/api/users", h.HandleUserCreate)
	h.Router.POST("/api/users/auth", h.HandleUserAuth)
	h.Router.GET("/api/users/me", h.HandleUserIdentity)
}
