package httpx

import (
	"net/http"
	"log"
	"encoding/json"
	"time"
	"fmt"

	"github.com/julienschmidt/httprouter"

	"strugl/internal/models"
)

func (h Handler) HandleUserAuth(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var usr models.User

	// à vérifier
	err := json.NewDecoder(r.Body).Decode(&usr)
	if err != nil {
		return
	}

	isUser, err := h.AuthService.AuthUser(usr.Username, usr.Password)
	if err != nil {
		http.Error(w, "not ok", http.StatusOK)
	}

	if isUser {
		expires := time.Now().AddDate(0, 0, 7)
		token, err := h.AuthService.CreateToken(usr.Username)
		if err != nil {
			http.Error(w, "jwt error", http.StatusOK)
			return
		}

		cookie := http.Cookie{Name: "token", Value: token, Domain: "api.strugl.cc", Expires: expires, HttpOnly: true}
		http.SetCookie(w, &cookie)
		fmt.Fprintf(w, usr.Username)
		return
	}

	http.Error(w, "Credentials error", http.StatusUnauthorized)
}

func ExtractCookieToken(r *http.Request) (string, error) {
	cookie, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			if err == http.ErrNoCookie {
				log.Println("Error finding cookie: ", err)
			}
		}
		return "", err
	}
	token := cookie.Value
	return token, nil
}