package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/rs/cors"

	"strugl/internal/database"
	"strugl/internal/service/user"
	"strugl/internal/service/post"
	transportHTTP "strugl/internal/transport/http"
)

func run() error {
	db, err := database.NewDatabase()
	if err != nil {
		return err
	}
	defer db.Close()

	userService := user.NewService(db)
	postService := post.NewService(db)

	h := transportHTTP.NewHandler(userService, postService)


	h.SetupRoutes()

	port, isPortSet := os.LookupEnv("API_PORT")
	if !isPortSet {
		port = "8080"
	}

	serverAddr := fmt.Sprintf(":%s", port)
	fmt.Printf("Server running on %s\n", serverAddr)

	corsRouter := cors.Default().Handler(h.Router)

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
