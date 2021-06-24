package httpservice

import (
	"github.com/dgrijalva/jwt-go"
)

type AuthService interface {

	AuthUser(username string, password string) (bool, error)

	CreateToken(username string) (string, error)
	VerifyToken(tokenString string) (*jwt.Token, error)
}
