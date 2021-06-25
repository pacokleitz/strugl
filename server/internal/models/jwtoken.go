package models

type ContextKey string

const ContextTokenKey ContextKey = "token"

type Jwtoken struct {
	User_ID  int64
	Username string
}
