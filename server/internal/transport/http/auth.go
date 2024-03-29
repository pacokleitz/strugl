package httpx

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"

	"strugl/internal/models"
)

type AuthService interface {
	AuthUser(username string, password string) (int64, error)

	CreateToken(token models.Jwtoken) (string, error)
	VerifyToken(tokenString string) (models.Jwtoken, error)
}

type JwtokenJSON struct {
	Token    string `json:"token"`
	Username string `json:"username"`
}

func (h Handler) HandleAuth(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var usr models.User

	err := json.NewDecoder(r.Body).Decode(&usr)
	if err != nil {
		return
	}

	user_id, err := h.AuthService.AuthUser(usr.Username, usr.Password)
	if err != nil {
		http.Error(w, "Credentials invalid", http.StatusUnauthorized)
		return
	}

	if user_id >= 0 {
		token_data := models.Jwtoken{User_ID: user_id, Username: usr.Username}
		token, err := h.AuthService.CreateToken(token_data)
		if err != nil {
			http.Error(w, "JWT error", http.StatusUnprocessableEntity)
			return
		}

		// removed Secure: true + Domain : strugl.cc and SameSite: http.SameSiteStrictMode for dev !

		cookie := http.Cookie{Name: "token", Value: token, Path: "/", MaxAge: 259200, Secure: true, HttpOnly: true, SameSite: http.SameSiteNoneMode}
		http.SetCookie(w, &cookie)
		fmt.Fprintf(w, usr.Username)
		return
	}

	http.Error(w, "Credentials error", http.StatusUnauthorized)
}

func (h Handler) HandleAuthToken(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var usr models.User

	err := json.NewDecoder(r.Body).Decode(&usr)
	if err != nil {
		return
	}

	user_id, err := h.AuthService.AuthUser(usr.Username, usr.Password)
	if err != nil {
		http.Error(w, "Credentials invalid", http.StatusUnauthorized)
		return
	}

	if user_id >= 0 {
		token_data := models.Jwtoken{User_ID: user_id, Username: usr.Username}
		token, err := h.AuthService.CreateToken(token_data)
		if err != nil {
			http.Error(w, "JWT error", http.StatusUnprocessableEntity)
			return
		}

		tokenJSON := JwtokenJSON{Username: usr.Username, Token: token}

		json.NewEncoder(w).Encode(tokenJSON)
		return
	}

	http.Error(w, "Credentials error", http.StatusUnauthorized)
}

func (h Handler) HandleLogout(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	cookie, err := r.Cookie("token")
	if err != nil {
		http.Error(w, "no cookie", http.StatusUnprocessableEntity)
		return
	}

	cookie.MaxAge = 0
	cookie.Value = ""
	cookie.SameSite = http.SameSiteNoneMode
	cookie.Secure = true
	cookie.HttpOnly = true
	cookie.Path = "/"

	http.SetCookie(w, cookie)
}
