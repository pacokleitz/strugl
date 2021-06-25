package models

type Post struct {
	ID           int64  `json:"id" db:"post_id"`
	Author       string `json:"author"`
	Author_ID    int64  `json:"author_id" db:"user_id"`
	Content      string `json:"content" db:"content"`
	DateCreated  string `json:"date_created" db:"date_created"`
	DateModified string `json:"date_modified" db:"date_modified"`
}
