package httpservice

import (
	"strugl/internal/service/user"
)

// UserService - the interface for our user service
type UserService interface {
	CreateUser(user user.User) (string, error)
	AuthUser(username string, password string) (bool, error)
	UpdateUser(username string, newUser user.User) (user.User, error)
	DeleteUser(username string) error
}
