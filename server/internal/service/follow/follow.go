package follow

import (
	"strugl/internal/models"

	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/jmoiron/sqlx"
)

type Service struct {
	DB *sqlx.DB
}

func NewService(db *sqlx.DB) Service {
	return Service{
		DB: db,
	}
}

// Get the list of followers of user_id
func (s Service) GetFollowers(user_id int64) ([]models.UserProfile, error) {
	var uu []models.UserProfile

	query := `SELECT users.user_id, username, profile_name, bio, avatar FROM users
				INNER JOIN followings ON users.user_id = followings.user_id
				WHERE followings.following_id = $1`
	rows, err := s.DB.Queryx(query, user_id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var u models.UserProfile
		err = rows.StructScan(&u)
		if err != nil {
			return nil, err
		}
		uu = append(uu, u)
	}
	return uu, nil
}

// Get the list of people followed by user_id
func (s Service) GetFollowings(user_id int64) ([]models.UserProfile, error) {

	var uu []models.UserProfile

	query := `SELECT users.user_id, username, profile_name, bio, avatar FROM users
				INNER JOIN followings ON users.user_id = followings.following_id
				WHERE followings.user_id = $1`
	rows, err := s.DB.Queryx(query, user_id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var u models.UserProfile
		err = rows.StructScan(&u)
		if err != nil {
			return nil, err
		}
		uu = append(uu, u)
	}

	return uu, nil
}

// Follow following_id
func (s Service) Follow(user_id int64, following_id int64) error {

	stmt, err := s.DB.Preparex(`INSERT INTO followings (user_id, following_id) VALUES ($1, $2)`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(user_id, following_id)
	if err != nil {
		return err
	}

	return nil
}

// Unfollow following_id
func (s Service) Unfollow(user_id int64, following_id int64) error {

	stmt, err := s.DB.Preparex(`DELETE FROM followings WHERE user_id = $1 AND following_id = $2`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(user_id, following_id)
	if err != nil {
		return err
	}

	return nil
}
