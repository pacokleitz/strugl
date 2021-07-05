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
func (s Service) FollowUser(user_id int64, following_id int64) error {

	return s.Store.FollowUser(user_id, following_id)
}

// Unfollow following_id
func (s Service) UnfollowUser(user_id int64, following_id int64) error {

	return s.Store.UnfollowUser(user_id, following_id)
}

// Follow topic
func (s Service) FollowTopic(user_id int64, topic string) error {

	return s.Store.FollowTopic(user_id, topic)
}

// Unfollow topic
func (s Service) UnfollowTopic(user_id int64, topic string) error {

	return s.Store.UnfollowTopic(user_id, topic)
}