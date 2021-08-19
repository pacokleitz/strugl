package httpx

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"

	"strugl/internal/models"
	"strugl/internal/service/user"
)

type UserService interface {
	CreateUser(user models.User) (string, error)
	GetUser(user_id int64) (*models.UserProfile, error)
	GetUserByUsername(username string) (*models.UserProfile, error)
	GetRecomUsers(user_id int64) ([]models.UserProfile, error)
	UpdateUser(username string, newUser models.User) (*models.User, error)
	DeleteUser(username string) error
}

func (h Handler) HandleUserCreate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var usr models.User

	err := json.NewDecoder(r.Body).Decode(&usr)
	if err != nil {
		http.Error(w, "Form error", http.StatusBadRequest)
		return
	}

	username, err := h.UserService.CreateUser(usr)
	if err != nil {
		if errors.Is(err, user.ErrUsernameInvalid) || errors.Is(err, user.ErrEmailInvalid) {
			http.Error(w, err.Error(), http.StatusBadRequest)
		} else if errors.Is(err, user.ErrUsernameTaken) || errors.Is(err, user.ErrEmailTaken) {
			http.Error(w, err.Error(), http.StatusConflict)
		} else {
			http.Error(w, "DB Error", http.StatusUnprocessableEntity)
		}
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, username)
}

func (h Handler) HandleUserMe(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	userTokenData := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)
	userProfile, err := h.UserService.GetUser(userTokenData.User_ID)
	if err != nil {
		http.Error(w, "DB Error", http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(userProfile)
}

func (h Handler) HandleUserByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user_id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Incorrect ID", http.StatusBadRequest)
		return
	}

	userProfile, err := h.UserService.GetUser(user_id)
	if err != nil {
		http.Error(w, "DB Error", http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(userProfile)
}

func (h Handler) HandleUserByUsername(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username := ps.ByName("username")

	userProfile, err := h.UserService.GetUserByUsername(username)
	if err != nil {
		http.Error(w, "DB Error", http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(userProfile)
}

func (h Handler) HandleUsersRecom(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	uu, err := h.UserService.GetRecomUsers(user_data.User_ID)
	if err != nil {
		http.Error(w, "Users recommendation error", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(uu)
}
