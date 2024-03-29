package httpx

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
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
	UpdateUser(user_id int64, newUser models.UserProfile) error
	DeleteUser(username string) error
	SetAvatar(user_id int64, extension string, img io.Reader) (string, error)
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
		if errors.Is(err, user.ErrUsernameInvalid) {
			http.Error(w, err.Error(), http.StatusBadRequest)
		} else if errors.Is(err, user.ErrUsernameTaken) {
			http.Error(w, err.Error(), http.StatusConflict)
		} else {
			http.Error(w, "DB Error", http.StatusUnprocessableEntity)
		}
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, username)
}

func (h Handler) HandleUserUpdate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	userTokenData := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	var usr models.UserProfile

	err := json.NewDecoder(r.Body).Decode(&usr)
	if err != nil {
		http.Error(w, "Form error", http.StatusBadRequest)
		return
	}

	if err = h.UserService.UpdateUser(userTokenData.User_ID, usr); err != nil {
		http.Error(w, "DB Error", http.StatusBadRequest)
		return
	}
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
		http.Error(w, "DB Error", http.StatusBadRequest)
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

func (h Handler) HandleUserAvatar(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	err := r.ParseMultipartForm(1024 * 1024 * 1) // max 5mb ?
	if err != nil {
		http.Error(w, "File too large (max 1MB)", http.StatusUnprocessableEntity)
		return
	}

	clientFile, _, err := r.FormFile("avatar")
	if err != nil {
		http.Error(w, "Avatar file error", http.StatusBadRequest)
		return
	}
	defer clientFile.Close()

	// Check the mediatype of the file received
	buff := make([]byte, 512)
	if _, err := clientFile.Read(buff); err != nil {
		http.Error(w, "Avatar file error", http.StatusUnprocessableEntity)
		return
	}

	var extension string

	mimeType := http.DetectContentType(buff)
	if mimeType == "image/jpg" || mimeType == "image/jpeg" {
		extension = "jpg"

	} else if mimeType == "image/png" {
		extension = "png"

	} else {
		http.Error(w, "File type error (only jpg/png are valid)", http.StatusUnsupportedMediaType)
		return
	}

	clientFile.Seek(0, io.SeekStart)

	user_data := r.Context().Value(models.ContextTokenKey).(models.Jwtoken)

	avatarUrl, err := h.UserService.SetAvatar(user_data.User_ID, extension, clientFile)
	if err != nil {
		http.Error(w, "Error saving avatar", http.StatusUnprocessableEntity)
		return
	}

	fmt.Fprint(w, avatarUrl)
}
