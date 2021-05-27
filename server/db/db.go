package db

import (
	"database/sql"
	"fmt"
	"log"
	// "os"

	_ "github.com/jackc/pgx/v4"
	// "github.com/golang-migrate/migrate/v4"
	// _ "github.com/golang-migrate/migrate/v4/database/postgres"
	// _ "github.com/golang-migrate/migrate/v4/source/file"
)

var Db = CreateDatabase()

func CreateDatabase() (*sql.DB) {
	serverName := "localhost"
	user := "postgres"
	password := "postgres"
	dbName := "postgres"

	connectionString := fmt.Sprintf("postgres://%s:%s@%s:5432/%s", user, password, serverName, dbName)
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	// if err := migrateDatabase(db); err != nil {
	// 	return db, err
	// }

	return db
}

// func migrateDatabase(db *sql.DB) error {
// 	driver, err := mysql.WithInstance(db, &postgres.Config{})
// 	if err != nil {
// 		return err
// 	}

// 	dir, err := os.Getwd()
// 	if err != nil {
// 		log.Fatal(err)
// 	}

// 	migration, err := migrate.NewWithDatabaseInstance(
// 		fmt.Sprintf("file://%s/db/migrations", dir),
// 		"mysql",
// 		driver,
// 	)
// 	if err != nil {
// 		return err
// 	}

// 	migration.Log = &MigrationLogger{}

// 	migration.Log.Printf("Applying database migrations")
// 	err = migration.Up()
// 	if err != nil && err != migrate.ErrNoChange {
// 		return err
// 	}

// 	version, _, err := migration.Version()
// 	if err != nil {
// 		return err
// 	}

// 	migration.Log.Printf("Active database version: %d", version)

// 	return nil
// }