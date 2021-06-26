package user

import (
	"regexp"
	"unicode"
	"golang.org/x/crypto/bcrypt"
	"database/sql"
	"github.com/jmoiron/sqlx"

)

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

func CheckBio(bio string) bool {
	len := len(bio)
	return len <= 200 && len >= 0
}

func CheckUsernameAvailability(username string, DB *sqlx.DB) bool {
	var db_username string

	query := `SELECT username FROM users WHERE username = $1`
	err := DB.QueryRow(query, username).Scan(&db_username)
	if err != nil {
		return err == sql.ErrNoRows
	}
	return false
}

func CheckEmailAvailability(email string, DB *sqlx.DB) bool {
	var db_email string

	query := `SELECT email FROM users WHERE email = $1`
	err := DB.QueryRow(query, email).Scan(&db_email)
	if err != nil {
		return err == sql.ErrNoRows
	}
	return false
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}
