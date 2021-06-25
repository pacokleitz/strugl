package httpx

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/julienschmidt/httprouter"

	"strugl/internal/models"
)

func (h Handler) HandlePostCreate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var p models.Post

	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		http.Error(w, "Form error", http.StatusOK)
		return
	}

	post_id, err := h.PostService.CreatePost(p)
	if err != nil {
		http.Error(w, "DB Error", http.StatusOK)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, post_id)
}


