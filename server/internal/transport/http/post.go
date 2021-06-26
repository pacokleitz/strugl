package httpx

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"

	"strugl/internal/models"
)

type PostService interface {
	GetPost(id int64) (*models.Post, error)
	GetPostsByUser(username string) ([]models.Post, error)
	GetPostsByTopic(topic string) ([]models.Post, error)
	GetPostsBookmarked(username string) ([]models.Post, error)
	GetPostsUpvoted(username string) ([]models.Post, error)
	GetTopicsFeed(username string) ([]models.Post, error)
	GetFollowsFeed(username string) ([]models.Post, error)
	GetFeed(user_id int64) ([]models.Post, error)

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
	p.Author_ID = user_data.User_ID
	p.Author = user_data.Username

	post_id, err := h.PostService.CreatePost(p)
	if err != nil {
		log.Print(err)
		http.Error(w, "DB Error", http.StatusOK)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, post_id)
}

func (h Handler) HandlePostGet(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	post_id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Bad post_id", http.StatusBadRequest)
		return
	}

	p, err := h.PostService.GetPost(post_id)
	if err != nil {
		log.Print(err)
		http.Error(w, "Unknown post_id", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(p)
}

func (h Handler) HandlePostsGetByUser(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	username := ps.ByName("username")

	pp, err := h.PostService.GetPostsByUser(username)
	if err != nil {
		log.Print(err)
		http.Error(w, "Unknown user", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(pp)
}

func (h Handler) HandlePostsGetByTopic(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	topic := ps.ByName("topic")

	pp, err := h.PostService.GetPostsByTopic(topic)
	if err != nil {
		log.Print(err)
		http.Error(w, "Unknown topic", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(pp)
}

func (h Handler) HandlePostsGetFeed(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	pp, err := h.PostService.GetFeed(user_data.User_ID)
	if err != nil {
		log.Print(err)
		http.Error(w, "Unknown topic", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(pp)
}