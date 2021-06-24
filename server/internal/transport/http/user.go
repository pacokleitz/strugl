package httpx

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"

	"github.com/dgrijalva/jwt-go"
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

func (h Handler) HandleUserIdentity(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	tokenString, err := ExtractCookieToken(r)
	if err != nil {
		http.Error(w, "Token error", http.StatusUnauthorized)
		return
	}

	token, err := h.AuthService.VerifyToken(tokenString)
	if err != nil {
		http.Error(w, "Token error", http.StatusUnauthorized)
		return
	}

	if token.Valid {
		claims := token.Claims.(jwt.MapClaims)
		username := claims["username"].(string)
		fmt.Fprint(w, username)
	}
}
