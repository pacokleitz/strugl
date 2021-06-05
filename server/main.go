package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/jackc/pgx/v4/stdlib"
	"github.com/julienschmidt/httprouter"
	"github.com/dgrijalva/jwt-go"

	"strugl/auth"
	"strugl/models"
)

// Struct used for dependency injection in handlers
type Env struct {
	db *sql.DB
}

func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprint(w, "Welcome to Strugl API!\n")
}

func (env *Env) Create_user(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Fatalf("Unable to decode the request body.  %v", err)
		http.Error(w, "Form error", http.StatusOK)
		return
	}

	if (!auth.CheckEmail(user.Email)) {
		http.Error(w, "Email error", http.StatusOK)
		return
	}

	if (!auth.CheckUsername(user.Username)) {
		http.Error(w, "Username error", http.StatusOK)
		return
	}

	if (!auth.CheckUsernameAvailability(user.Username, env.db)) {
		http.Error(w, "Username already taken", http.StatusOK)
		return
	}

	if (!auth.CheckEmailAvailability(user.Email, env.db)) {
		http.Error(w, "Email already taken", http.StatusOK)
		return
	}

	stmt, err := env.db.Prepare(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3)`)
	if err != nil {
		log.Fatal(err)
		return
	}

	password_hash, err := auth.HashPassword(user.Password)
	if err != nil {
		log.Fatal(err)
		return
	}

	_, err = stmt.Exec(user.Username, user.Email, password_hash)
	if err != nil {
		log.Fatal(err)
		return
	}

	// Send back username with status_code 201
	w.WriteHeader(http.StatusCreated)
	fmt.Fprintf(w, user.Username)
}

func (env *Env) Auth_user(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Fatalf("Unable to decode the request body.  %v", err)
		return
	}

	var (
		username string
		password string
	)

	query := `SELECT username, password FROM users WHERE username = $1`
	err = env.db.QueryRow(query, user.Username).Scan(&username, &password)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Credentials error", http.StatusUnauthorized)
			return
		}
		log.Fatal(err)
		return
	}

	if auth.CheckPasswordHash(user.Password, password) {
		expires := time.Now().AddDate(0, 0, 7)
		token, err := auth.CreateToken(user.Username)
		if err != nil {
			log.Fatal(err)
			return
		}
		cookie := http.Cookie{Name: "token", Value: token, Domain: "strugl.cc", Expires: expires, HttpOnly: true}
		http.SetCookie(w, &cookie)
        fmt.Fprintf(w, user.Username)
        return
	}
    http.Error(w, "Credentials error", http.StatusUnauthorized)
}

func (env *Env) Get_username(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	token, err := auth.VerifyToken(r)
	if err != nil {
		http.Error(w, "Token error", http.StatusUnauthorized)
		return
	}

	if token.Valid {
		claims := token.Claims.(jwt.MapClaims)
		username := claims["username"].(string)
		fmt.Fprint(w, username)
	}
}



func main() {

	// Setup db
	connectionString := fmt.Sprintf("postgres://postgres:%s@db:5432/postgres", os.Getenv("DB_PASS"))
	db, err := sql.Open("pgx", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	// Dependency injection struct
	env := &Env{db: db}

	query := `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
		email VARCHAR(254) UNIQUE NOT NULL,
        password VARCHAR(64) NOT NULL
    );`

	// Executes the SQL query in our database. Check err to ensure there was no error.
	_, err = db.Exec(query)
    if err != nil {
		log.Fatal(err)
	}

	defer env.db.Close()

	router := httprouter.New()
	router.GET("/", Index)
	router.POST("/users", env.Create_user)
	router.POST("/auth", env.Auth_user)
	router.GET("/users/me", env.Get_username)

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
