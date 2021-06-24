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

	if !CheckUsernameAvailability(user.Username, s.DB) {
		return "", ErrUsernameTaken
	}

	if !CheckEmailAvailability(user.Email, s.DB) {
		return "", ErrEmailTaken
	}

	stmt, err := s.DB.Prepare(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`)
	if err != nil {
		return "", err
	}

	password_hash, err := HashPassword(user.Password)
	if err != nil {
		return "", err
	}

	_, err = stmt.Exec(user.Username, user.Email, password_hash)
	if err != nil {
		return "", err
	}

	return user.Username, nil
}

func (s Service) UpdateUser(username string, newUser models.User) (models.User, error) {

	// ToDo
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

