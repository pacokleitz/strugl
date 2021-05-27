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
	}

	stmt, err := env.db.Prepare(`INSERT INTO users (username, password) VALUES ($1, $2)`)
	if err != nil {
		log.Fatal(err)
	}

	password_hash, err := auth.HashPassword(user.Password)
	if err != nil {
		log.Fatal(err)
	}

	_, err = stmt.Exec(user.Username, password_hash)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Fprintf(w, user.Username)
}

func (env *Env) Auth_user(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Fatalf("Unable to decode the request body.  %v", err)
	}

	var (
		username string
		password string
	)

	query := `SELECT username, password FROM users WHERE username = $1`
	err = env.db.QueryRow(query, user.Username).Scan(&username, &password)
	if err != nil {
		log.Fatal(err)
	}

	if auth.CheckPasswordHash(user.Password, password) {
		expires := time.Now().AddDate(0, 0, 7)
		cookie := http.Cookie{Name: "token", Value: username, Domain: "strugl.cc", Expires: expires, HttpOnly: true}
		http.SetCookie(w, &cookie)
        fmt.Fprintf(w, user.Username)
        return
	}
    fmt.Fprintf(w, "%s bad credentials", user.Username)
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
        username VARCHAR(30) NOT NULL,
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

	log.Fatal(http.ListenAndServe("0.0.0.0:8080", router))
}
