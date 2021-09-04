package user

import (
	"golang.org/x/crypto/bcrypt"
	"unicode"
)

// func CheckEmail(email string) bool {

// 	if m, _ := regexp.MatchString(`^([\w\.\_]{2,10})@(\w{1,}).([a-z]{2,4})$`, email); !m {
// 		return false
// 	} else {
// 		return true
// 	}
// }

func CheckUsername(username string) bool {

	lenUsername := len(username)

	if lenUsername == 0 || lenUsername > 25 {
		return false
	}

	for _, r := range username {
		if !unicode.IsLetter(r) && !unicode.IsDigit(r) {
			return false
		}
	}
	return true
}

func CheckProfilename(name string) bool {

	lenName := len(name)

	if lenName == 0 || lenName > 30 {
		return false
	}

	for _, r := range name {
		if !unicode.IsLetter(r) && !unicode.IsDigit(r) && !unicode.IsSpace(r) {
			return false
		}
	}
	return true
}

func CheckBio(bio string) bool {

	len := len(bio)
	return len <= 200 && len >= 0
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	return string(bytes), err
}
