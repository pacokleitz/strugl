package httpx

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/julienschmidt/httprouter"

	"strugl/internal/models"
)

type AuthService interface {
	AuthUser(username string, password string) (int64, error)

	CreateToken(token models.Jwtoken) (string, error)
	VerifyToken(tokenString string) (models.Jwtoken, error)
}

func (h Handler) HandleAuth(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var usr models.User

	// à vérifier
	err := json.NewDecoder(r.Body).Decode(&usr)
	if err != nil {
		return
	}

	user_id, err := h.AuthService.AuthUser(usr.Username, usr.Password)
	if err != nil {
		http.Error(w, "not ok", http.StatusOK)
		return
	}

	if user_id >= 0 {
		token_data := models.Jwtoken{User_ID: user_id, Username: usr.Username}
		expires := time.Now().AddDate(0, 0, 7)
		token, err := h.AuthService.CreateToken(token_data)
		if err != nil {
			http.Error(w, "jwt error", http.StatusOK)
			return
		}

		cookie := http.Cookie{Name: "token", Value: token, Domain: "strugl.cc", Expires: expires, HttpOnly: true, Secure: true, SameSite: http.SameSiteStrictMode}
		http.SetCookie(w, &cookie)
		fmt.Fprintf(w, usr.Username)
		return
	}

	http.Error(w, "Credentials error", http.StatusUnauthorized)
}
