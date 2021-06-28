package httpx

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
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
	UpdateUser(username string, newUser models.User) (models.User, error)
	DeleteUser(username string) error
}

func (h Handler) HandleUserCreate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var usr models.User

	err := json.NewDecoder(r.Body).Decode(&usr)
	if err != nil {
		http.Error(w, "Form error", http.StatusOK)
		return
	}

	username, err := h.UserService.CreateUser(usr)
	if err != nil {
		if errors.Is(err, user.ErrUsernameInvalid) || errors.Is(err, user.ErrEmailInvalid) || errors.Is(err, user.ErrUsernameTaken) || errors.Is(err, user.ErrEmailTaken) {
			http.Error(w, err.Error(), http.StatusOK)
		} else {
			http.Error(w, "Error", http.StatusOK)
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
		log.Print(err)
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(userProfile)
}

func (h Handler) HandleUserByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	user_id, err := strconv.ParseInt(ps.ByName("id"), 10, 64)
	if err != nil {
		http.Error(w, "Bad id", http.StatusUnprocessableEntity)
		return
	}

	userProfile, err := h.UserService.GetUser(user_id)
	if err != nil {
		log.Print(err)
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(userProfile)
}

func (h Handler) HandleUserByUsername(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	username := ps.ByName("username")

	userProfile, err := h.UserService.GetUserByUsername(username)
	if err != nil {
		log.Print(err)
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(userProfile)
}
