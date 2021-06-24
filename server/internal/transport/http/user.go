package httpx

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/julienschmidt/httprouter"

	"github.com/dgrijalva/jwt-go"
	"strugl/internal/service/user"
	"strugl/internal/utils/auth"
)

func (h Handler) HandleUserCreate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var usr user.User

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

func (h Handler) HandleUserAuth(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var usr user.User

	// à vérifier
	err := json.NewDecoder(r.Body).Decode(&usr)
	if err != nil {
		return
	}

	isUser, err := h.UserService.AuthUser(usr.Username, usr.Password)
	if err != nil {
		http.Error(w, "not ok", http.StatusOK)
		return
	}

	if isUser {
		expires := time.Now().AddDate(0, 0, 7)
		token, err := auth.CreateToken(usr.Username)
		if err != nil {
			http.Error(w, "jwt error", http.StatusOK)
			return
		}

		cookie := http.Cookie{Name: "token", Value: token, Domain: "strugl.cc", Secure: true, SameSite: http.SameSiteStrictMode, Expires: expires, HttpOnly: true}
		http.SetCookie(w, &cookie)
		fmt.Fprintf(w, usr.Username)
		return
	}

	http.Error(w, "Credentials error", http.StatusUnauthorized)
}

func (h Handler) HandleUserIdentity(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	token, err := auth.VerifyToken(r)
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
