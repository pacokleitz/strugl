package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/rs/cors"

	"strugl/internal/database/postgres"
	"strugl/internal/service/auth"
	"strugl/internal/service/follow"
	"strugl/internal/service/post"
	"strugl/internal/service/search"
	"strugl/internal/service/user"
	transportHTTP "strugl/internal/transport/http"
)

func run() error {

	datastore, err := postgres.New()
	if err != nil {
		return err
	}
	defer datastore.Store.Close()

	userService := user.NewService(datastore)
	postService := post.NewService(datastore)
	authService := auth.NewService(datastore)
	followService := follow.NewService(datastore)
	searchService := search.NewService(datastore)

	h := transportHTTP.NewHandler(userService, postService, authService, followService, searchService)

	h.SetupRoutes()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"https://strugl.cc", "http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "DELETE", "HEAD", "PUT"},
		Debug:            true,
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
