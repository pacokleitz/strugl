package user

import (
	"errors"

	"strugl/internal/database"
	"strugl/internal/models"

	_ "github.com/jackc/pgx/v4/stdlib"
)

var (
	ErrEmailInvalid    = errors.New("email invalid")
	ErrUsernameInvalid = errors.New("username invalid")
	ErrBioInvalid      = errors.New("bio invalid")
	ErrUsernameTaken   = errors.New("username taken")
	ErrEmailTaken      = errors.New("email taken")
)

type Service struct {
	Store database.DataStore
}

func NewService(store database.DataStore) Service {
	return Service{
		Store: store,
	}
}

func (s Service) CreateUser(user models.User) (string, error) {

	var err error

	if !CheckEmail(user.Email) {
		return "", ErrEmailInvalid
	}

	if !CheckUsername(user.Username) {
		return "", ErrUsernameInvalid
	}

	if !CheckBio(user.Bio) {
		return "", ErrBioInvalid
	}

	if !s.Store.CheckUsernameAvailability(user.Username) {
		return "", ErrUsernameTaken
	}

	if !s.Store.CheckEmailAvailability(user.Email) {
		return "", ErrEmailTaken
	}

	user.Password, err = HashPassword(user.Password)
	if err != nil {
		return "", err
	}

	// Temporary until avatar logic implementation
	user.Avatar = "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-user-1.png&r=0&g=0&b=0"

	return s.Store.CreateUser(user)
}

func (s Service) UpdateUser(username string, newUser models.User) (*models.User, error) {

	// Check form here
	return s.Store.UpdateUser(username, newUser)
}

func (s Service) DeleteUser(username string) error {

	return s.Store.DeleteUser(username)
}

func (s Service) GetUser(user_id int64) (*models.UserProfile, error) {

	return s.Store.GetUser(user_id)
}

func (s Service) GetUserByUsername(username string) (*models.UserProfile, error) {

	return s.Store.GetUserByUsername(username)
}

func (s Service) GetRecomUsers(user_id int64) ([]models.UserProfile, error) {
	return s.Store.GetRecomUsers(user_id)
}