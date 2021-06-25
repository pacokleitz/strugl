package models

type User struct {
	ID          int64  `json:"id" db:"user_id"`
	Username    string `json:"username" db:"username"`
	ProfileName string `json:"profile_name" db:"profile_name"`
	Email       string `json:"email" db:"email"`
	Password    string `json:"password" db:"password_hash"`
}
