package httpservice

import (
	"strugl/internal/models"
)

type AuthService interface {

	AuthUser(username string, password string) (int64, error)

	CreateToken(token models.Jwtoken) (string, error)
	VerifyToken(tokenString string) (*models.Jwtoken, error)
}
