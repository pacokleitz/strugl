package user

import (
	"errors"
	"github.com/jmoiron/sqlx"

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
	DB *sqlx.DB
}

func NewService(db *sqlx.DB) Service {
	return Service{
		DB: db,
	}
}

func (s Service) CreateUser(user models.User) (string, error) {

	if !CheckEmail(user.Email) {
		return "", ErrEmailInvalid
	}

	if !CheckUsername(user.Username) {
		return "", ErrUsernameInvalid
	}

	if !CheckBio(user.Bio) {
		return "", ErrBioInvalid
	}

	if !CheckUsernameAvailability(user.Username, s.DB) {
		return "", ErrUsernameTaken
	}

	if !CheckEmailAvailability(user.Email, s.DB) {
		return "", ErrEmailTaken
	}

	password_hash, err := HashPassword(user.Password)
	if err != nil {
		return "", err
	}

	// Temporary until avatar logic implementation
	user.Avatar = "https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-user-1.png&r=0&g=0&b=0"

	stmt, err := s.DB.Prepare(`INSERT INTO users (username, profile_name, bio, email, avatar, password_hash) VALUES ($1, $2, $3, $4, $5, $6)`)
	if err != nil {
		return "", err
	}

	_, err = stmt.Exec(user.Username, user.Username, user.Bio, user.Email, user.Avatar, password_hash)
	if err != nil {
		return "", err
	}

	return user.Username, nil
}

func (s Service) UpdateUser(username string, newUser models.User) (models.User, error) {

	// TODO
	stmt, err := s.DB.Prepare(`UPDATE users SET x=y, z=u WHERE username = $1`)
	if err != nil {
		return newUser, err
	}

	_, err = stmt.Exec(username)
	if err != nil {
		return newUser, err
	}

	return newUser, nil
}

func (s Service) DeleteUser(username string) error {

	stmt, err := s.DB.Prepare(`DELETE FROM users WHERE username = $1`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(username)
	if err != nil {
		return err
	}

	return nil
}

func (s Service) GetUser(user_id int64) (*models.UserProfile, error) {

	var user models.UserProfile

	query := `SELECT user_id, username, profile_name, bio, avatar FROM users 
				WHERE user_id = $1`

	err := s.DB.QueryRowx(query, user_id).StructScan(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (s Service) GetUserByUsername(username string) (*models.UserProfile, error) {

	var user models.UserProfile

	query := `SELECT user_id, username, profile_name, bio, avatar FROM users 
				WHERE username = $1`
				
	err := s.DB.QueryRowx(query, username).StructScan(&user)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
