package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/rs/cors"

	"strugl/internal/database"
	"strugl/internal/service/user"
	"strugl/internal/service/post"
	"strugl/internal/service/auth"
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
	authService := auth.NewService(db)

	h := transportHTTP.NewHandler(userService, postService, authService)


	h.SetupRoutes()

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"https://strugl.cc", "http://localhost:3000"},
		AllowCredentials: true,
		Debug: true,
	})

	corsRouter := c.Handler(h.Router)

	if err := http.ListenAndServe(":8080", corsRouter); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err)
	}
}
