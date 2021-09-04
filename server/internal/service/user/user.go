package user

import (
	"errors"
	"io"
	"io/ioutil"
	"os"
	"strconv"

	"strugl/internal/database"
	"strugl/internal/models"

	_ "github.com/jackc/pgx/v4/stdlib"
)

var (
	ErrEmailInvalid    = errors.New("email invalid")
	ErrUsernameInvalid = errors.New("username invalid")
	ErrProfilenameInvalid = errors.New("profile name invalid")
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

func (s Service) UpdateUser(user_id int64, newUser models.UserProfile) error {

	if !CheckBio(newUser.Bio) {
		return ErrBioInvalid
	}

	if !CheckProfilename(newUser.ProfileName) {
		return ErrProfilenameInvalid
	}
	
	return s.Store.UpdateUser(user_id, newUser)
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

func (s Service) SetAvatar(user_id int64, extension string, img io.Reader) (string, error) {

	userIdStr := strconv.FormatInt(user_id, 10)

	if err := os.MkdirAll("/static/avatars", 0644); err != nil {
		return "", err
	}

	f, err := ioutil.TempFile("/static/avatars/", userIdStr + "-*." + extension )
    if err != nil {
        return "", err
    }

	defer f.Close()

	_, err = io.Copy(f, img)
	if err != nil {
		return "", err
	}

	// Update the link to the avatar in user DB
	if err = s.Store.UpdateUserAvatar(user_id, f.Name()); err != nil {
		return "", err
	}

	return f.Name(), nil
}
