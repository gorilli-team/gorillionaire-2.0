-- +goose Up
CREATE SCHEMA IF NOT EXISTS gorillionaire;
CREATE OR REPLACE FUNCTION generate_objectid() RETURNS TEXT AS $$ SELECT lower(lpad(to_hex(EXTRACT(EPOCH FROM clock_timestamp())::int), 8, '0') || lpad(to_hex(floor(random() * 100000000)::int), 16, '0')); $$ LANGUAGE sql;

CREATE TABLE IF NOT EXISTS gorillionaire.users (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100),
    company_website_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gorillionaire.api_keys (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    api_key VARCHAR(100) UNIQUE NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES gorillionaire.users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gorillionaire.currency (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) UNIQUE NOT NULL,         -- e.g. BTC, ETH
    name VARCHAR(100) NOT NULL,                 -- e.g. Bitcoin
    description TEXT,                           -- Optional text about the currency
    type VARCHAR(50) NOT NULL DEFAULT 'coin',   -- coin, token, stablecoin, etc.

    chain_id INT NOT NULL,                 -- Ethereum, Solana, Bitcoin, etc.
    address VARCHAR(100),              -- Only for tokens, e.g. ERC-20 address
    decimals INT NOT NULL DEFAULT 18,           -- For formatting purposes

    icon_url TEXT,                              -- Optional logo or icon
    website_url TEXT,                           -- Optional external link
    image_banner_url TEXT,                      -- Image banner URL

    coingecko_id VARCHAR(100),                  -- Reference to CoinGecko API
    cmc_id VARCHAR(100),                        -- CoinMarketCap ID (optional)

    codex_id VARCHAR(100),                      -- Codex ID
    creator_address VARCHAR(100),               -- Creator address
    is_scam BOOLEAN DEFAULT FALSE,              -- Whether the currency is a scam
    total_supply NUMERIC(38, 18),              -- Total supply of the currency
    circulating_supply NUMERIC(38, 18),        -- Circulating supply of the currency
    creation_date DATE,                         -- When the currency was created
    launch_date DATE,                           -- When the token was launched

    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gorillionaire.pairs (
    id SERIAL PRIMARY KEY,

    base_currency_id INT NOT NULL,    -- e.g. ETH in ETH/USDC
    quote_currency_id INT NOT NULL,   -- e.g. USDC in ETH/USDC
    base_token_address VARCHAR(100) NOT NULL, -- e.g. 0x0000000000000000000000000000000000000000
    quote_token_address VARCHAR(100) NOT NULL, -- e.g. 0x0000000000000000000000000000000000000000
    chain_id INT NOT NULL, -- e.g. Ethereum, Solana, Bitcoin, etc.

    symbol VARCHAR(50) UNIQUE NOT NULL,      -- e.g. ETH/USDC
    pair_type VARCHAR(20) DEFAULT 'spot',    -- spot, perpetual, futures
    dex_name VARCHAR(100),                  -- Uniswap, Sushiswap, etc.
    pool_address VARCHAR(100),              -- DEX LP pool contract address

    fee_percent NUMERIC(5, 4),              -- e.g. 0.0030 for 0.3%
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_base_currency
        FOREIGN KEY (base_currency_id)
        REFERENCES gorillionaire.currency(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_quote_currency
        FOREIGN KEY (quote_currency_id)
        REFERENCES gorillionaire.currency(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gorillionaire.signals (
    id SERIAL PRIMARY KEY,
    signal TEXT DEFAULT generate_objectid() NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gorillionaire.events (
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
        'gorillionaire.events',
        'timestamp',
        if_not_exists => TRUE
    );
-- Create an index on the timestamp column for faster queries
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON gorillionaire.events (timestamp DESC);

-- Create a GIN index on the JSONB data column for faster JSON queries
CREATE INDEX IF NOT EXISTS idx_events_data ON gorillionaire.events USING GIN (data); 

-- +goose Down
DROP INDEX IF EXISTS idx_events_data;
DROP INDEX IF EXISTS idx_events_timestamp;

DROP TABLE IF EXISTS gorillionaire.events CASCADE;
DROP TABLE IF EXISTS gorillionaire.pairs CASCADE;
DROP TABLE IF EXISTS gorillionaire.currency CASCADE;
DROP SCHEMA IF EXISTS gorillionaire CASCADE;