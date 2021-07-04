package follow

import (
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

// Get the list of followers of user_id
func (s Service) GetFollowers(user_id int64) ([]models.UserProfile, error) {

	return s.Store.GetFollowers(user_id)
}

// Get the list of people followed by user_id
func (s Service) GetFollowings(user_id int64) ([]models.UserProfile, error) {

	return s.Store.GetFollowings(user_id)
}

// Follow following_id
func (s Service) Follow(user_id int64, following_id int64) error {

	return s.Store.Follow(user_id, following_id)
}

// Unfollow following_id
func (s Service) Unfollow(user_id int64, following_id int64) error {

	return s.Store.Unfollow(user_id, following_id)
}
