package postgres

import (
	"github.com/jmoiron/sqlx"
	"errors"
	"os"
	"fmt"
	"time"
)

type PostgresStore struct {
	Store *sqlx.DB
}

var (
	ErrDbEnvVarNotSet = errors.New("database env variable credentials not set")
)

// DB connexion (needed before using queries)
func (store PostgresStore) New() (error) {

	dbHost, isSetdbHost := os.LookupEnv("DB_HOST")
	dbPort, isSetdbPort := os.LookupEnv("DB_PORT")
	dbUser, isSetdbUser := os.LookupEnv("DB_USER")
	dbPass, isSetdbPass := os.LookupEnv("DB_PASS")
	dbName, isSetdbName := os.LookupEnv("DB_NAME")

	if !(isSetdbHost && isSetdbPort && isSetdbUser && isSetdbPass && isSetdbName) {
		return ErrDbEnvVarNotSet
	}

	connectionString := fmt.Sprintf("postgres://%s:%s@%s:%s/%s", dbUser, dbPass, dbHost, dbPort, dbName)
	db, err := sqlx.Open("pgx", connectionString)
	if err != nil {
		return err
	}

	// Wait for db to start
	for i := 0; i < 5; i++ {
		if err := db.Ping(); err != nil {
			time.Sleep(1 * time.Second)
		} else {
			continue
		}
	}

	store.Store = db

	err = store.MigrateDB()
	if err != nil {
		return err
	}

	return nil
}


