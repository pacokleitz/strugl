package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/rs/cors"

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

	port, isPortSet := os.LookupEnv("API_PORT")
	if !isPortSet {
		port = "8080"
	}

	serverAddr := fmt.Sprintf(":%s", port)
	fmt.Printf("Server running on %s\n", serverAddr)
	
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000", "https://strugl.cc"},
    		AllowCredentials: true,
		AllowedMethods: []string{"PUT", "PATCH", "GET", "POST", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
    		Debug: true,
	})

	corsRouter := c.Handler(h.Router)

	if err := http.ListenAndServe(serverAddr, corsRouter); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
	}
}
