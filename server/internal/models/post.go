package models

import "database/sql"

type Post struct {
	ID          int64          `json:"id" db:"post_id"`
	Author      string         `json:"author" db:"username"`
	Author_ID   int64          `json:"author_id" db:"user_id"`
	Content     string         `json:"content" db:"content"`
	DateCreated string         `json:"date_created" db:"date_created"`
	DateUpdated sql.NullString `json:"date_updated" db:"date_updated"`
}
