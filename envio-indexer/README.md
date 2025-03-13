# Gorillionaire Envio Indexer

## Overview

The Envio Indexer service for Gorillionaire tracks token swaps and listings on the Monad blockchain. It monitors trading activity and sends signals to our backend and to all Telegram subscribers when it detects unusual spikes in volume or large transfers from whale wallets. These signals are then used to generate trading insights.

## Features

- **🔍 Token Transfer Tracking** - Monitor large token transfers and whale wallet activity
- **📊 Volume Analysis** - Track and analyze trading volume spikes
- **🤖 Telegram Notifications** - Real-time alerts for significant on-chain events
- **🔄 Backend Integration** - Seamless data flow to signal generation service
- **⚡ Real-time Indexing** - Immediate processing of Monad blockchain events

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PNPM package manager
- Envio CLI tool

### Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Fill in the required environment variables in `.env`:

- `ENVIO_API_TOKEN` - Envio API token
- `ENVIO_TELEGRAM_BOT_TOKEN` - Telegram bot token
- `ENVIO_TELEGRAM_CHAT_ID` - Telegram chat ID
- `ENVIO_API_BASE_URL` - API base URL
- `ENVIO_BACKEND_API_KEY` - Backend API key

### Installation

```bash
# Install dependencies
pnpm install

# Generate types and handlers
pnpm codegen

# Start the indexer
pnpm start
```

## Project Structure

```
├── src/              # Source code
│   ├── handlers/     # Event handlers
│   └── types/        # Generated types
├── generated/        # Generated code
├── test/            # Test files
├── config.yaml      # Indexer configuration
└── schema.graphql   # GraphQL schema
```
