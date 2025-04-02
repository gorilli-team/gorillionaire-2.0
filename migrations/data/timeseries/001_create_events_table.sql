-- +goose Up
CREATE SCHEMA IF NOT EXISTS timeseries;

-- Create the events table
CREATE SCHEMA IF NOT EXISTS timeseries;

CREATE TABLE IF NOT EXISTS timeseries.events (
    timestamp TIMESTAMPTZ NOT NULL,
    id BIGSERIAL NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (timestamp, id)
);

-- Convert the table to a TimescaleDB hypertable
SELECT
    create_hypertable (
        'timeseries.events',
        'timestamp',
        if_not_exists => TRUE
    );
-- Create an index on the timestamp column for faster queries
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON timeseries.events (timestamp DESC);

-- Create a GIN index on the JSONB data column for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_events_data ON timeseries.events USING GIN (data); 

-- +goose Down
DROP INDEX IF EXISTS idx_events_data;
DROP INDEX IF EXISTS idx_events_timestamp;
DROP TABLE IF EXISTS timeseries.events CASCADE;
DROP SCHEMA IF EXISTS timeseries CASCADE;