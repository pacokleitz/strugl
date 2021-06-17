package main

import (
	"fmt"
	"net/http"
	"os"

	"strugl/internal/database"
	"strugl/internal/service/user"
	transportHTTP "strugl/internal/transport/http"
)

var PORT = 8080

func run() error {
	db, err := database.NewDatabase()
	if err != nil {
		return err
	}
	defer db.Close()

	userService := user.NewService(db)

	h := transportHTTP.NewHandler(userService)

	h.SetupRoutes()

	port, isPortSet := os.LookupEnv("API_PORT")
	if !isPortSet {
		port = "8080"
	}

	serverAddr := fmt.Sprintf(":%s", port)
	fmt.Printf("Server running on %s\n", serverAddr)

	if err := http.ListenAndServe(serverAddr, h.Router); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
	}
}
