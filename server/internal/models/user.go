package models

type User struct {
	ID          int64  `json:"id" db:"user_id"`
	Username    string `json:"username" db:"username"`
	ProfileName string `json:"profile_name" db:"profile_name"`
	Avatar      string `json:"avatar" db:"avatar"`
	Bio         string `json:"bio" db:"bio"`
	Password    string `json:"password" db:"password_hash"`
}

// TODO à utiliser dans struct User
type UserProfile struct {
	ID          int64  `json:"id" db:"user_id"`
	Username    string `json:"username" db:"username"`
	ProfileName string `json:"profile_name" db:"profile_name"`
	Bio         string `json:"bio" db:"bio"`
	Avatar      string `json:"avatar" db:"avatar"`
}

type AuthCredentials struct {
	ID       int64  `json:"id" db:"user_id"`
	Username string `json:"username" db:"username"`
	Password string `json:"password" db:"password_hash"`
}
