package auth

import (
	"fmt"
	"os"
	"time"
	"errors"
	"database/sql"

	"github.com/dgrijalva/jwt-go"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"

	
)

var (
	ErrCredentialsInvalid = errors.New("credentials invalid")
)

type Service struct {
	DB *sqlx.DB
}

func NewService(db *sqlx.DB) Service {
	return Service{
		DB: db,
	}
}

func (s Service) CreateToken(username string) (string, error) {
	var err error
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["username"] = username
	atClaims["exp"] = time.Now().AddDate(0, 0, 7).Unix()
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return "", err
	}
	return token, nil
}

func (s Service) VerifyToken(tokenString string) (*jwt.Token, error) {

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
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

	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(dbPassword))
	return err == nil, err
}
