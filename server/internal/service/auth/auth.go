package auth

import (
	"database/sql"
	"errors"
	"fmt"
	"os"
	"strconv"
	"strugl/internal/models"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrCredentialsInvalid = errors.New("credentials invalid")
	ErrInvalidToken       = errors.New("token invalid")
)

type Service struct {
	DB *sqlx.DB
}

func NewService(db *sqlx.DB) Service {
	return Service{
		DB: db,
	}
}

// Create jwtoken string from a Jwtoken struct
func (s Service) CreateToken(data models.Jwtoken) (string, error) {
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["user_id"] = strconv.FormatInt(data.User_ID, 10)
	atClaims["username"] = data.Username
	atClaims["exp"] = time.Now().AddDate(0, 0, 7).Unix()
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	token, err := at.SignedString([]byte(os.Getenv("ACCESS_SECRET")))
	if err != nil {
		return "", err
	}
	return token, nil
}

// Verify token and return token data if valid
func (s Service) VerifyToken(tokenString string) (models.Jwtoken, error) {

	var jwtoken models.Jwtoken

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})
	if err != nil {
		return jwtoken, err
	}

	if token.Valid {
		claims := token.Claims.(jwt.MapClaims)
		user_id, err := strconv.ParseInt(claims["user_id"].(string), 10, 64)
		if err != nil {
			return jwtoken, err
		}
		uname := claims["username"].(string)

		jwtoken = models.Jwtoken{User_ID: user_id, Username: uname}
		return jwtoken, nil
	}
	return jwtoken, ErrInvalidToken
}

// Check if credentials are valid and return user_id
func (s Service) AuthUser(username string, password string) (int64, error) {

	var usr models.User

	query := `SELECT user_id, password_hash FROM users WHERE username = $1`
	err := s.DB.QueryRowx(query, username).StructScan(&usr)
	if err != nil {
		if err == sql.ErrNoRows {
			return -1, ErrCredentialsInvalid
		}
		return -1, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(usr.Password), []byte(password))
	if err != nil {
		return -1, ErrCredentialsInvalid
	}

	return usr.ID, nil
}
