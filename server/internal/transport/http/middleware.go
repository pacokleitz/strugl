package httpx

import (
	"net/http"
	"context"
	"strugl/internal/models"
	
	"github.com/julienschmidt/httprouter"
)


func (h Handler) Protected(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

		cookie, err := r.Cookie("token")
		if err != nil {
			http.Error(w, "No auth cookie", http.StatusUnauthorized)
			return
		}

		tokenString := cookie.Value

		jwtoken, err := h.AuthService.VerifyToken(tokenString)
		if err != nil {
			http.Error(w, "JWT error", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), models.Jwtoken{}, *jwtoken)

		next(w, r.WithContext(ctx), ps)
	}
}
