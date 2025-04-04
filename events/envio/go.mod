module github.com/gorilli/gorillionaire-2.0/events/envio

go 1.24.1

require (
	github.com/gorilli/gorillionaire-2.0/events/pkg v0.0.0-00010101000000-000000000000
	github.com/jackc/pgx/v4 v4.18.1
	github.com/nats-io/nats.go v1.39.1
	proto-v1 v0.0.0
)

replace (
	github.com/gorilli/gorillionaire-2.0/events/pkg => ../pkg
	proto-v1 => ../../proto/gen/v1/go/proto/v1
)

require (
	github.com/google/go-tpm v0.9.3 // indirect
	github.com/jackc/chunkreader/v2 v2.0.1 // indirect
	github.com/jackc/pgconn v1.14.0 // indirect
	github.com/jackc/pgio v1.0.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgproto3/v2 v2.3.2 // indirect
	github.com/jackc/pgservicefile v0.0.0-20221227161230-091c0ba34f0a // indirect
	github.com/jackc/pgtype v1.14.0 // indirect
	github.com/jackc/puddle v1.3.0 // indirect
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/minio/highwayhash v1.0.3 // indirect
	github.com/nats-io/jwt/v2 v2.7.3 // indirect
	github.com/nats-io/nats-server/v2 v2.11.0 // indirect
	github.com/nats-io/nkeys v0.4.10 // indirect
	github.com/nats-io/nuid v1.0.1 // indirect
	go.uber.org/automaxprocs v1.6.0 // indirect
	golang.org/x/crypto v0.36.0 // indirect
	golang.org/x/sys v0.31.0 // indirect
	golang.org/x/text v0.23.0 // indirect
	golang.org/x/time v0.11.0 // indirect
	google.golang.org/protobuf v1.36.6 // indirect
)
