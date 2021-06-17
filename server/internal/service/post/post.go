package post

import (
	"database/sql"
	_ "github.com/jackc/pgx/v4/stdlib"
)

type Service struct {
	DB *sql.DB
}

type Post struct {
	ID       int64  `json:"id"`
	Author   string `json:"author"`
	Text     string `json:"username"`
	Topics   []string `json:"topics"`
	Upvotes int64 `json:"upvotes"`
}

func NewService(db *sql.DB) Service {
	return Service{
		DB: db,
	}
}
