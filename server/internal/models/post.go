package models

import (
	"database/sql"
	"encoding/json"
)

type Post struct {
	ID          int64          `json:"id" db:"post_id"`
	Author      string         `json:"author" db:"username"`
	Author_ID   int64          `json:"author_id" db:"user_id"`
	Content     string         `json:"content" db:"content"`
	DateCreated string         `json:"date_created" db:"date_created"`
	DateUpdated JsonNullString `json:"date_updated" db:"date_updated"`
}

type Topic struct {
    Topic string `json:"topic" db:"topic"`
}



type JsonNullString struct {
    sql.NullString
}

func (v JsonNullString) MarshalJSON() ([]byte, error) {
    if v.Valid {
        return json.Marshal(v.String)
    } else {
        return json.Marshal(nil)
    }
}

func (v *JsonNullString) UnmarshalJSON(data []byte) error {
    // Unmarshalling into a pointer will let us detect null
    var x *string
    if err := json.Unmarshal(data, &x); err != nil {
        return err
    }
    if x != nil {
        v.Valid = true
        v.String = *x
    } else {
        v.Valid = false
    }
    return nil
}