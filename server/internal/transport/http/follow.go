package httpx

import (
	"strugl/internal/models"
	"github.com/julienschmidt/httprouter"
	"encoding/json"
	"strconv"
	"net/http"
)

type FollowService interface {
	Follow(user_id int64, following_id int64) error
	Unfollow(user_id int64, following_id int64) error
	GetFollowers(user_id int64) ([]models.UserProfile, error)
	GetFollowings(user_id int64) ([]models.UserProfile, error)
}

func (h Handler) HandleFollow(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var user models.UserProfile

	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Form error", http.StatusOK)
		return
	}

	err = h.FollowService.Follow(user_data.User_ID, user.ID)
	if err != nil {
		http.Error(w, "Follow error", http.StatusBadRequest)
		return
	}
}

func (h Handler) HandleUnfollow(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var user models.UserProfile

	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Form error", http.StatusOK)
		return
	}

	err = h.FollowService.Unfollow(user_data.User_ID, user.ID)
	if err != nil {
		http.Error(w, "Follow error", http.StatusBadRequest)
	}
}


func (h Handler) HandleGetFollowers(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	
	user_id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Bad id", http.StatusUnprocessableEntity)
		return
	}

	followers, err := h.FollowService.GetFollowers(user_id)
	if err != nil {
		http.Error(w, "Get followers error", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(followers)
}


func (h Handler) HandleGetFollowings(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	
	user_id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Bad id", http.StatusUnprocessableEntity)
		return
	}

	followings, err := h.FollowService.GetFollowings(user_id)
	if err != nil {
		http.Error(w, "Get followings error", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(followings)
}