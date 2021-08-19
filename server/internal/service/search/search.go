package search

import (
	"strings"
	"strugl/internal/database"
	"strugl/internal/models"

	_ "github.com/jackc/pgx/v4/stdlib"
)

type Service struct {
	Store database.DataStore
}

func NewService(store database.DataStore) Service {
	return Service{
		Store: store,
	}
}

func (s Service) Search(str string) ([]models.UserProfile, []models.Topic, error) {
	str = strings.ToLower(str)
	uu, err := s.Store.SearchUser(str)
	if err != nil {
		return nil, nil, err
	}
	tt, err := s.Store.SearchTopic(str)
	if err != nil {
		return uu, nil, err
	}

	return uu, tt, nil
}
