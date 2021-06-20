package auth

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"time"
	"unicode"

	"github.com/dgrijalva/jwt-go"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func CheckEmail(email string) bool {
	if m, _ := regexp.MatchString(`^([\w\.\_]{2,10})@(\w{1,}).([a-z]{2,4})$`, email); !m {
		return false
	} else {
		return true
	}
}

func CheckUsername(username string) bool {
	if len(username) == 0 {
		return false
	}

	for _, r := range username {
		if !unicode.IsLetter(r) && !unicode.IsDigit(r) {
			return false
		}
	}

	return true
}

func CheckUsernameAvailability(username string, db *sqlx.DB) bool {
	var db_username string

	query := `SELECT username FROM users WHERE username = $1`
	err := db.QueryRow(query, username).Scan(&db_username)
	if err != nil {
		if err == sql.ErrNoRows {
			return true
		}
		log.Fatal(err)
	}
	return false
}

func CheckEmailAvailability(email string, db *sqlx.DB) bool {
	var db_email string

	query := `SELECT email FROM users WHERE email = $1`
	err := db.QueryRow(query, email).Scan(&db_email)
	if err != nil {
		if err == sql.ErrNoRows {
			return true
		}
		log.Fatal(err)
	}
	return false
}

func CreateToken(username string) (string, error) {
	var err error
	os.Setenv("ACCESS_SECRET", "jdnfksdmfksd") //this should be in an env file
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

func ExtractCookieToken(r *http.Request) (string, error) {
	cookie, err := r.Cookie("token")
	if err != nil {
		if err == http.ErrNoCookie {
			if err == http.ErrNoCookie {
				log.Println("Error finding cookie: ", err)
			}
		}
		return "", err
	}
	token := cookie.Value
	return token, nil
}

func VerifyToken(r *http.Request) (*jwt.Token, error) {
	tokenString, err := ExtractCookieToken(r)
	if err != nil {
		return nil, err
	}

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
