package workers

import (
	"time"

	gorillionairedb "github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/db"
)

type Config struct {
	DB          *gorillionairedb.DB
	BatchSize   int
	BatchWindow time.Duration
}
