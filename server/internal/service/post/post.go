package post

import (
	"database/sql"
	// "encoding/json"
	// "fmt"
	// "log"
	// "net/http"
	// "time"

	// "github.com/dgrijalva/jwt-go"
	_ "github.com/jackc/pgx/v4/stdlib"
	// "github.com/julienschmidt/httprouter"
	// "strugl/auth"
	// "strugl/models"
)

// Service - the struct for our comment service
type Service struct {
	DB *sql.DB
}

// Comment - defines our comment structure
type Post struct {
	ID       int64  `json:"id"`
	Author   string `json:"author"`
	Text     string `json:"username"`
	Topics   []string `json:"topics"`
	Upvotes int64 `json:"upvotes"`
}

// NewService - returns a new user service
func NewService(db *sql.DB) Service {
	return Service{
		DB: db,
	}
}
