package database

import (
	"fmt"
	"os"
	"errors"
	"github.com/jmoiron/sqlx"
	"time"

	_ "github.com/jackc/pgx/v4/stdlib"
)

var (
	ErrDbEnvVarNotSet = errors.New("database env variable credentials not set")
)

func NewDatabase() (*sqlx.DB, error) {
	dbHost, isSetdbHost := os.LookupEnv("DB_HOST")
	dbPort, isSetdbPort := os.LookupEnv("DB_PORT")
	dbUser, isSetdbUser := os.LookupEnv("DB_USER")
	dbPass, isSetdbPass := os.LookupEnv("DB_PASS")
	dbName, isSetdbName := os.LookupEnv("DB_NAME")

	if !(isSetdbHost && isSetdbPort && isSetdbUser && isSetdbPass && isSetdbName) {
		return nil, ErrDbEnvVarNotSet
	}

	connectionString := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", dbUser, dbPass, dbHost, dbPort, dbName)
	db, err := sqlx.Open("pgx", connectionString)
	if err != nil {
		return nil, err
	}

	// Wait for db to start
	for i := 0; i < 5; i++ {
		if err := db.Ping(); err != nil {
			time.Sleep(1 * time.Second)
		} else {
			continue
		}
	}
	
	err = MigrateDB(db)
	if err != nil {
		return db, err
	}

	

	return db, nil
}