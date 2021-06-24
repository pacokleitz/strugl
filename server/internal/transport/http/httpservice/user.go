package httpservice

import (
	"strugl/internal/models"
)

type UserService interface {
	CreateUser(user models.User) (string, error)
	UpdateUser(username string, newUser models.User) (models.User, error)
	DeleteUser(username string) error
}
