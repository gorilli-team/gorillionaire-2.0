#!/bin/bash

# Ensure protoc-gen-go is installed and available in PATH
if ! command -v protoc-gen-go &> /dev/null
then
    echo "protoc-gen-go could not be found. Installing..."
    go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
    export PATH="$PATH:$(go env GOPATH)/bin"
fi

# Install ts-proto if not already installed
if ! command -v protoc-gen-ts_proto &> /dev/null
then
    echo "protoc-gen-ts_proto could not be found. Installing..."
    npm install -g ts-proto
    export PATH="$PATH:$(npm bin -g)"
fi

# Set the paths for the output directories
GO_OUT_DIR="./gen/v1/go/proto"
PYTHON_OUT_DIR="./gen/v1/python/proto"
TYPESCRIPT_OUT_DIR="./gen/v1/typescript/proto"

# Ensure the output directories exist
mkdir -p $GO_OUT_DIR
mkdir -p $PYTHON_OUT_DIR
mkdir -p $TYPESCRIPT_OUT_DIR

# Generate Go code
echo "Generating Go code..."
protoc \
    --go_out=$GO_OUT_DIR \
    --go_opt=paths=source_relative \
    --go_opt=Mv1/envio/envio.proto=github.com/gorilli/gorillionaire-2.0/gen/v1/go/proto/envio \
    ./v1/envio/envio.proto

# Generate Python code
echo "Generating Python code..."
protoc --python_out=$PYTHON_OUT_DIR ./v1/envio/envio.proto

# Generate TypeScript code using ts-proto
echo "Generating TypeScript code..."
protoc \
    --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_proto_out=$TYPESCRIPT_OUT_DIR \
    --ts_proto_opt=outputServices=grpc-web,env=node,esModuleInterop=true \
    ./v1/envio/envio.proto

echo "Protobuf files generated successfully."