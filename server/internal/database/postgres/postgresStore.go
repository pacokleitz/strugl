package postgres

import (
	"errors"
	"fmt"
	"github.com/jmoiron/sqlx"
	"os"
	"time"
)

type PostgresStore struct {
	Store *sqlx.DB
}

var (
	ErrDbEnvVarNotSet = errors.New("database env variable credentials not set")
)

// DB connexion (needed before using queries)
func New() (*PostgresStore, error) {

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

	store := &PostgresStore{db}

	err = store.MigrateDB()
	if err != nil {
		return nil, err
	}

	return store, nil
}
