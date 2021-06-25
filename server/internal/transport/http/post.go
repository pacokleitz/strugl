package httpx

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"

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

func (h Handler) HandlePostCreate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var p models.Post

	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, "Form error", http.StatusOK)
		return
	}

	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)
	p.Author = user_data.Username

	post_id, err := h.PostService.CreatePost(p)
	if err != nil {
		http.Error(w, "DB Error", http.StatusOK)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, post_id)
}

func (h Handler) HandleGetPostsByUser(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var username string

	err := json.NewDecoder(r.Body).Decode(&username)
	if err != nil {
		http.Error(w, "Username argument missing", http.StatusBadRequest)
		return
	}

	pp, err := h.PostService.GetPostsByUser(username)
	if err != nil {
		http.Error(w, "Unknown user", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, pp)
}
