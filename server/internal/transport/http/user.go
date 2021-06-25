package httpx

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"

	"strugl/internal/service/user"
	"strugl/internal/models"
)

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
	username := r.Context().Value(models.Jwtoken{})
	fmt.Fprint(w, username)
}