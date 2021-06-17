package user

import (
	"database/sql"
	"errors"
	_ "github.com/jackc/pgx/v4/stdlib"
	"strugl/internal/utils/auth"
)

var (
	ErrEmailInvalid    = errors.New("email invalid")
	ErrUsernameInvalid = errors.New("username invalid")
	ErrUsernameTaken   = errors.New("username taken")
	ErrEmailTaken      = errors.New("email taken")

	ErrCredentialsInvalid = errors.New("credentials invalid")
)

type Service struct {
	DB *sql.DB
}

type User struct {
	ID       int64  `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func NewService(db *sql.DB) Service {
	return Service{
		DB: db,
	}
}

func (s Service) CreateUser(user User) (string, error) {

	if !auth.CheckEmail(user.Email) {
		return "", ErrEmailInvalid
	}

	if !auth.CheckUsername(user.Username) {
		return "", ErrUsernameInvalid
	}

	if !auth.CheckUsernameAvailability(user.Username, s.DB) {
		return "", ErrUsernameTaken
	}

	if !auth.CheckEmailAvailability(user.Email, s.DB) {
		return "", ErrEmailTaken
	}

	stmt, err := s.DB.Prepare(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`)
	if err != nil {
		return "", err
	}

	password_hash, err := auth.HashPassword(user.Password)
	if err != nil {
		return "", err
	}

	_, err = stmt.Exec(user.Username, user.Email, password_hash)
	if err != nil {
		return "", err
	}

	return user.Username, nil
}

func (s Service) AuthUser(username string, password string) (bool, error) {

	var dbPassword string

	query := `SELECT password FROM users WHERE username = $1`
	err := s.DB.QueryRow(query, username).Scan(&dbPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			return false, ErrCredentialsInvalid
		}
		return false, err
	}

	if auth.CheckPasswordHash(password, dbPassword) {
		return true, nil
	}
	return false, nil

}

func (s Service) UpdateUser(username string, newUser User) (User, error) {

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
