# Gorillionaire Backend Service

## Overview

The backend service for Gorillionaire handles real-time signal processing, user authentication, activity tracking, and WebSocket connections for live updates. It serves as the central hub for processing and distributing trading signals to connected clients.

## Features

- **🔐 User Authentication** - Secure user authentication system
- **📊 Signal Processing** - Real-time processing of trading signals
- **🔄 WebSocket Integration** - Live updates for connected clients
- **📈 Activity Tracking** - User activity and points system
- **🌐 REST API** - Comprehensive API endpoints for frontend integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Yarn package manager

### Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Fill in the required environment variables in `.env`:

- `MONGODB_CONNECTION_STRING` - Your MongoDB connection string
- `PORT` - Server port (default: 3001)
- Other required API keys and configuration

### Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Start production server
yarn start
```

## API Documentation

### WebSocket Endpoints

- `/events/token/{tokenName}` - Subscribe to specific token events
- `/events/notifications` - Subscribe to general notifications

### REST Endpoints

#### Authentication

- `POST /auth/signin` - User sign-in
- `POST /auth/verify` - Verify user token

#### Activity

- `GET /activity/points` - Get user points
- `GET /activity/leaderboard` - Get activity leaderboard
- `POST /activity/trade-points` - Record trade activity

#### Signals

- `GET /signals/generated` - Get generated signals
- `GET /signals/user` - Get user-specific signals

#### Trades

- `GET /trade/completed` - Get completed trades
- `GET /trade/0x-quote` - Generate a trade intent

## Project Structure

```
src/
├── app.js          # Express app configuration
├── server.js       # Server entry point
├── websocket.js    # WebSocket server setup
├── models/         # MongoDB models
├── routes/         # API routes
└── utils/          # Utility functions
```

## Integration Logic

### Event Processing & Signal Generation

**1- Receiving events from the Envio indexer**<br>
The backend receives three types of events from the indexer via POST requests:

- Token transfers
- Volume spikes
- Price updates<br>

Each event is authenticated and stored in MongoDB collections.

**2- WebSocket event broadcasting**<br>
When new events are received, they are immediately broadcast to relevant WebSocket channels:

- Token-specific events go to `/events/token/{tokenName}` subscribers
- General notifications go to `/events/notifications` subscribers

**3- Signal data preparation**<br>
The events are formatted and enriched with additional context before being sent to the LangChain service for signal generation:

- Transfer events include hourly transfer statistics
- Volume spikes include percentage increases
- Price updates include historical comparisons

**4- Integration with LangChain service**<br>
The prepared event data is sent to the LangChain service which processes it through its chain of prompts to generate trading signals. The generated signals are then stored in MongoDB and broadcast to subscribed clients.

**5- Integration with 0x API**<br>
The backend integrates with the 0x API to get the best price for the token pair and the slippage tolerance for the trade.

The intent for the generated trade is then saved in the database so it can be used to cross-check the trade after it is executed and award the user with points.
