package database

import (
	"database/sql"
	"fmt"
	"os"
	"errors"

	_ "github.com/jackc/pgx/v4/stdlib"
)

var (
	ErrDbEnvVarNotSet = errors.New("database env variable credentials not set")
)

func NewDatabase() (*sql.DB, error) {
	dbHost, isSetdbHost := os.LookupEnv("DB_HOST")
	dbPort, isSetdbPort := os.LookupEnv("DB_PORT")
	dbUser, isSetdbUser := os.LookupEnv("DB_USER")
	dbPass, isSetdbPass := os.LookupEnv("DB_PASS")
	dbName, isSetdbName := os.LookupEnv("DB_NAME")

	if !(isSetdbHost && isSetdbPort && isSetdbUser && isSetdbPass && isSetdbName) {
		return nil, ErrDbEnvVarNotSet
	}

	connectionString := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", dbUser, dbPass, dbHost, dbPort, dbName)
	db, err := sql.Open("pgx", connectionString)
	if err != nil {
		return nil, err
	}

	err = MigrateDB(db)
	if err != nil {
		return db, err
	}

	if err := db.Ping(); err != nil {
		return db, err
	}

	return db, nil
}