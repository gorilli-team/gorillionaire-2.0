FROM golang:1.23.5-alpine3.21 AS builder
ENV CGO_ENABLED=0 GOOS=linux GOARCH=arm64

RUN apk add --no-cache gcc musl-dev

WORKDIR /app
COPY go.mod go.sum ./

RUN go mod download

COPY main.go ./

RUN go build -o /app/migration ./main.go

FROM scratch
WORKDIR /app

COPY ./data/ /app/data
COPY --from=builder /app/migration /app/migration
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

CMD ["/app/migration", "-dir", "/app/data/gorillioner", "-a", "up"]
