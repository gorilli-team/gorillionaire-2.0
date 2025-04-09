module github.com/gorilli/gorillionaire-2.0/events/database

go 1.24.1

require (
	github.com/gorilli/gorillionaire-2.0/events/pkg v0.0.0
	github.com/nats-io/nats.go v1.39.1 // indirect
	proto-v1 v0.0.0
)

require (
	github.com/gorilli/gorillionaire-2.0/database/gorillionairedb v0.0.0-00010101000000-000000000000
	github.com/rs/zerolog v1.15.0
	google.golang.org/protobuf v1.36.6
)

require (
	github.com/google/go-tpm v0.9.3 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/pgx/v5 v5.7.4 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/lib/pq v1.10.9 // indirect
	github.com/minio/highwayhash v1.0.3 // indirect
	github.com/nats-io/jwt/v2 v2.7.3 // indirect
	github.com/nats-io/nats-server/v2 v2.11.0 // indirect
	github.com/nats-io/nkeys v0.4.10 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	golang.org/x/crypto v0.36.0 // indirect
	golang.org/x/sync v0.12.0 // indirect
	golang.org/x/sys v0.31.0 // indirect
	golang.org/x/text v0.23.0 // indirect
	golang.org/x/time v0.11.0 // indirect
)

replace (
	github.com/gorilli/gorillionaire-2.0/database/gorillionairedb => ../../database/gorillionairedb
	github.com/gorilli/gorillionaire-2.0/events/pkg => ../pkg
	proto-v1 => ../../proto/gen/v1/go/proto/v1
)
