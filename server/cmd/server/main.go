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
	"strugl/internal/service/user"
	transportHTTP "strugl/internal/transport/http"
)

func run() error {

	var datastore postgres.PostgresStore

	err := datastore.New()
	if err != nil {
		return err
	}
	defer datastore.Store.Close()

	userService := user.NewService(datastore)
	postService := post.NewService(datastore)
	authService := auth.NewService(datastore)
	followService := follow.NewService(datastore)

	h := transportHTTP.NewHandler(userService, postService, authService, followService)

	h.SetupRoutes()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"https://strugl.cc", "http://localhost:3000"},
		AllowCredentials: true,
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
