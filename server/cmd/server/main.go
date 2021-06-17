package main

import (
	"fmt"
	"net/http"
	"os"

	"strugl/internal/database"
	"strugl/internal/service/user"
	transportHTTP "strugl/internal/transport/http"
)

func run() error {
	db, err := database.NewDatabase()
	if err != nil {
		return err
	}
	defer db.Close()

	userService := user.NewService(db)

	h := transportHTTP.NewHandler(userService)

	h.SetupRoutes()

	if err := http.ListenAndServe(":8080", h.Router); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
	}
}
