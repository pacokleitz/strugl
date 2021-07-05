package httpx

import (
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"net/http"
	"strconv"
	"strugl/internal/models"
)

type FollowService interface {
	FollowUser(user_id int64, following_id int64) error
	UnfollowUser(user_id int64, following_id int64) error
	GetFollowers(user_id int64) ([]models.UserProfile, error)
	GetFollowings(user_id int64) ([]models.UserProfile, error)
	FollowTopic(user_id int64, topic string) error
	UnfollowTopic(user_id int64, topic string) error
}

func (h Handler) HandleFollowUser(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var user models.UserProfile

	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Form error", http.StatusBadRequest)
		return
	}

	err = h.FollowService.FollowUser(user_data.User_ID, user.ID)
	if err != nil {
		http.Error(w, "DB error", http.StatusBadRequest)
		return
	}
}

func (h Handler) HandleUnfollowUser(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var user models.UserProfile

	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Form error", http.StatusBadRequest)
		return
	}

	err = h.FollowService.UnfollowUser(user_data.User_ID, user.ID)
	if err != nil {
		http.Error(w, "DB error", http.StatusBadRequest)
	}
}

func (h Handler) HandleFollowTopic(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	topic := struct {
		Topic string `json:"topic"`
	}{}

	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	err := json.NewDecoder(r.Body).Decode(&topic)
	if err != nil {
		http.Error(w, "Form error", http.StatusBadRequest)
		return
	}

	err = h.FollowService.FollowTopic(user_data.User_ID, topic.Topic)
	if err != nil {
		http.Error(w, "DB error", http.StatusBadRequest)
		return
	}
}

func (h Handler) HandleUnfollowTopic(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	topic := struct {
		Topic string `json:"topic"`
	}{}

	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	err := json.NewDecoder(r.Body).Decode(&topic)
	if err != nil {
		http.Error(w, "Form error", http.StatusBadRequest)
		return
	}

	err = h.FollowService.UnfollowTopic(user_data.User_ID, topic.Topic)
	if err != nil {
		http.Error(w, "DB error", http.StatusBadRequest)
	}
}

func (h Handler) HandleGetFollowers(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	user_id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Incorrect ID", http.StatusUnprocessableEntity)
		return
	}

	followers, err := h.FollowService.GetFollowers(user_id)
	if err != nil {
		http.Error(w, "DB Error", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(followers)
}

func (h Handler) HandleGetFollowings(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	user_id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Incorrect ID", http.StatusUnprocessableEntity)
		return
	}

	followings, err := h.FollowService.GetFollowings(user_id)
	if err != nil {
		http.Error(w, "DB Error", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(followings)
}
