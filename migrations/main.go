// This is custom goose binary with sqlite3 support only.

package main

import (
	"context"
	_ "database/sql"
	"flag"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/jackc/pgx/v5/stdlib"

	"github.com/pressly/goose/v3"
)

// const CONNECTION_STRING = "dbname=shepherd user=postgres password=postgres host=db port=5432"

var CONNECTION_STRING = os.Getenv("CONNECTION_STRING")

func main() {
	dir := flag.String("dir", ".", "directory with migration files")
	// action := flag.String("a", "up", "goose command")
	actions := flag.String("a", "up,down,redo,status,version,create", "goose actions")
	flag.Parse()
	args := flag.Args()
	ctx := context.Background()

	// command := *action
	commands := strings.Split(*actions, ",")
	log.Println("CONNECTION_STRING", CONNECTION_STRING)
	db, err := goose.OpenDBWithDriver("postgres", CONNECTION_STRING)
	if err != nil {
		log.Fatalf("goose: failed to open DB: %v\n", err)
	}

	defer func() {
		if err := db.Close(); err != nil {
			log.Fatalf("goose: failed to close DB: %v\n", err)
		}
	}()

	arguments := []string{}
	if len(args) > 3 {
		arguments = append(arguments, args[3:]...)
	}
	for _, command := range commands {
		fmt.Printf("goose %v %v\n", command, *dir)

		if err := goose.RunContext(ctx, command, db, *dir, arguments...); err != nil {
			log.Printf("goose %v: %v", command, err)
		}
	}

}

func replaceComa(s string) string {
	return strings.Replace(s, ",", ".", 1)
}
