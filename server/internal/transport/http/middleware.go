package httpx

import (
	"context"
	"net/http"
	"strings"
	"strugl/internal/models"

	"github.com/julienschmidt/httprouter"
)

func (h Handler) Protected(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

		var tokenString string

		cookie, err := r.Cookie("token")
		if err != nil {
			reqToken := r.Header.Get("Authorization")
			if reqToken == "" {
				http.Error(w, "No auth cookie or auth header", http.StatusUnauthorized)
				return
			}
			splitToken := strings.Split(reqToken, "Bearer ")
			tokenString = splitToken[1]
		} else {
			tokenString = cookie.Value
		}

		jwtoken, err := h.AuthService.VerifyToken(tokenString)
		if err != nil {
			http.Error(w, "Invalid jwt", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), models.ContextTokenKey, jwtoken)

		next(w, r.WithContext(ctx), ps)
	}
}
