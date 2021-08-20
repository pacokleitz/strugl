package httpx

import (
	"encoding/json"
	"github.com/julienschmidt/httprouter"
	"log"
	"net/http"
	"strugl/internal/models"
)

type SearchService interface {
	Search(str string) ([]models.UserProfile, []models.Topic, error)
}

func (h Handler) HandleSearch(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var err error

	searchResult := struct {
		Users  []models.UserProfile `json:"users"`
		Topics []models.Topic       `json:"topics"`
	}{}

	searchWord := ps.ByName("str")

	searchResult.Users, searchResult.Topics, err = h.SearchService.Search(searchWord)
	if err != nil {
		log.Print(err)
		http.Error(w, "Search error", http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(searchResult)
}
