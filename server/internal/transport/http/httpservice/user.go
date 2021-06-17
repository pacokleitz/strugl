package httpservice

import (
	"strugl/internal/service/user"
)

type UserService interface {
	CreateUser(user user.User) (string, error)
	AuthUser(username string, password string) (bool, error)
	UpdateUser(username string, newUser user.User) (user.User, error)
	DeleteUser(username string) error
}
