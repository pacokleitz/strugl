package httpx

import (
	"github.com/julienschmidt/httprouter"
	"net/http"
)

type Handler struct {
	Router        *httprouter.Router
	UserService   UserService
	PostService   PostService
	AuthService   AuthService
	FollowService FollowService
	SearchService SearchService
}

func NewHandler(userService UserService, postService PostService, authService AuthService, followService FollowService, searchService SearchService) *Handler {
	return &Handler{
		UserService:   userService,
		PostService:   postService,
		AuthService:   authService,
		FollowService: followService,
		SearchService: searchService,
	}
}

func (h *Handler) SetupRoutes() {

	h.Router = httprouter.New()

	h.Router.POST("/users", h.HandleUserCreate)
	h.Router.GET("/users/name/:username", h.HandleUserByUsername)
	h.Router.GET("/users/id/:id", h.HandleUserByID)
	h.Router.GET("/users/me", h.Protected(h.HandleUserMe))
	h.Router.PUT("/users/avatar", h.Protected(h.HandleUserAvatar))
	h.Router.PUT("/users", h.Protected(h.HandleUserUpdate))

	h.Router.GET("/topics/:name", h.HandleTopicByName)

	h.Router.POST("/auth", h.HandleAuth)
	h.Router.POST("/auth/token", h.HandleAuthToken)
	h.Router.GET("/auth/logout", h.Protected(h.HandleLogout))

	h.Router.POST("/posts", h.Protected(h.HandlePostCreate))
	h.Router.GET("/posts/bookmarks", h.Protected(h.HandlePostsGetBookmarks))
	h.Router.GET("/posts/id/:id", h.HandlePostGet)
	h.Router.GET("/posts/user/:username", h.HandlePostsGetByUser)
	h.Router.GET("/posts/topic/:topic", h.HandlePostsGetByTopic)
	h.Router.GET("/posts/bookmarks/:id", h.Protected(h.HandleBookmarkPost))
	h.Router.DELETE("/posts/bookmarks/:id", h.Protected(h.HandleUnBookmarkPost))
	h.Router.GET("/posts/feed", h.Protected(h.HandlePostsGetFeed))

	h.Router.GET("/recom/topics", h.Protected(h.HandleTopicsRecom))
	h.Router.GET("/recom/users", h.Protected(h.HandleUsersRecom))

	h.Router.GET("/search/:str", h.HandleSearch)

	h.Router.POST("/follow/user", h.Protected(h.HandleFollowUser))
	h.Router.POST("/unfollow/user", h.Protected(h.HandleUnfollowUser))
	h.Router.POST("/follow/topic", h.Protected(h.HandleFollowTopic))
	h.Router.POST("/unfollow/topic", h.Protected(h.HandleUnfollowTopic))

	h.Router.GET("/followers/:id", h.HandleGetFollowers)
	h.Router.GET("/followings/:id", h.HandleGetFollowings)
	h.Router.GET("/interests/:id", h.HandleGetInterests)

	h.Router.ServeFiles("/static/*filepath", http.Dir("/static/"))
}
