# Gorillionaire

## Overview

**Gorillionaire** is an advanced signal protocol designed to provide real-time trading insights by aggregating and processing multi-source data. It enables AI agents and traders to make informed decisions in the fast-moving cryptocurrency market.

By integrating price feeds, historical on-chain data, whale/developer activity, new token launches, and social sentiment (Twitter/Discord), Gorillionaire generates actionable signals. These signals are streamed to users via multiple channels, including Telegram, Discord, Twitter, and, in the future, Farcaster and Lens.

## Deployment on Monad Testnet

Gorillionaire is being developed and tested on the **Monad Testnet**, launching on Monad to introduce a new way to integrate AI Agents faster and more reliably. This enables high-speed, low-latency execution and enhances the scalability of AI-powered trading strategies.

## Participation in EVM/Accathon

We are excited to announce our participation in the **EVM/Accathon**, where we are showcasing Gorillionaire’s capabilities in AI-driven trading. Our goal is to push the boundaries of AI-integrated crypto trading and establish new industry standards.

![EVM/Accathon Logo](./evmaccathon.png)

## Features

### Multi-Source Data Aggregation

- **📊 Price Feeds** – Collects data from multiple sources to ensure accurate market insights.
- **⛓ Historical On-Chain Data** – Analyzes past blockchain transactions to detect trends and anomalies.
- **🐋 Whale & Developer Activity** – Monitors large transactions and development patterns.
- **🚀 New Token Launches** – Identifies and tracks newly launched tokens.
- **🗣 Social Sentiment Analysis** – Evaluates Twitter and Discord discussions to gauge market sentiment.

### Real-Time Signal Processing & Delivery

- **📡 Live Signal Websocket** – Clients can subscribe to a real-time signal feed for instant updates.
- **🔗 Multi-Channel Distribution** – Insights are shared across Telegram, Discord, Twitter, and upcoming decentralized social platforms.
- **🤖 AI-Ready Signals** – Trading AI agents can integrate Gorillionaire’s insights to enhance decision-making.

## Agent-Based Architecture

Gorillionaire operates through a layered agent system, with each level specializing in a specific function:

### **Level 1: Data Extraction Agents**

This level is responsible for gathering raw data from various sources. It includes:

- **📡 Price Detector** – Aggregates price data from multiple feeds.
- **🐋 Whale Detector** – Monitors large transactions and whale movements.
- **🚀 Token Launch Detector** – Identifies new token deployments.
- **🗣 Social Activity Detector** – Analyzes Twitter and Discord discussions.
- **📜 General Activity Detector** – Tracks blockchain activity for relevant patterns.

### **Level 2: Signal Generation Agents**

This level processes data from Level 1 and generates actionable signals. It currently includes:

- **🔥 DEGEN NAD** – High-risk, high-reward trading signals.
- **⚡ AGGRESSIVE NAD** – Balanced strategy with a strong focus on rapid opportunities.
- **📈 VALUE INVESTOR NAD** – Long-term investment insights based on fundamental value.

These agents provide refined insights that other AI agents or human traders can use to make decisions. When transmitting signals, additional metadata is included to support further refinement and validation by external models or decision-makers.

## How It Works

1. **Data Collection** – Level 1 agents continuously extract information from multiple sources.
2. **Processing & Signal Generation** – Level 2 agents analyze data and produce actionable insights.
3. **Distribution & Subscription** – Users and AI agents subscribe to the websocket to receive live trading signals.
4. **Decision-Making Support** – External AI trading bots or traders leverage signals for enhanced decision-making.

## Getting Started

To start using Gorillionaire, set up the necessary dependencies and run the system with the following command:

```sh
pnpm clean && pnpm install --no-frozen-lockfile && pnpm run build && pnpm start --characters="./characters/gorillionaire.character.json"
```

## Future Roadmap

- **📢 Integration with Farcaster & Lens** – Expanding social sentiment tracking.
- **🔬 More Advanced AI Models** – Enhancing predictive capabilities.
- **🛠 Developer API** – Enabling external agents to interact seamlessly with Gorillionaire.

---

With Gorillionaire, trading AI development becomes faster, easier, and more customizable, making it the go-to protocol for crypto traders looking for cutting-edge market intelligence.



---------------------------------------------------
<br />
<div id="readme-top" align="center">
  <a href="">
    <img src="./docs/img/gorillionaire-logo.svg" alt="Gorillionaire Logo" width="220" height="55">
  </a>

  <p align="center" style="font-size: 24px">
    <strong>AI Crypto Signals & Gamified Trading platform</strong>
    <br />
    <a href="https://app.gorillionai.re/" style="font-size: 16px"><strong>Visit the website »</strong></a>
    <br />
    <div>
    <div style="display: flex; flex-direction: row; justify-content: center; align-items: center">
    <p>
    Powered by
    </p>
        <a href="https://www.gorilli.io/en">
            <img src="./docs/img/gorilli-logo.svg" alt="Gorilli Logo" width="100" height="30">
        </a>
        </div>
    </div>
  </p>
</div>

# Table of contents

<!-- TOC -->
  - [1. Overview](#1-overview)
  - [2. Target audience](#2-target-audience)
  - [3. Long-term sustainability](#3-long-term-sustainability)
  - [4. Submission details](#4-submission-details)
  - [5. Technologies used](#5-technologies-used)
  - [6. Sponsors](#6-sponsors)
  - [7. Security considerations](#7-security-considerations)
  - [8. Implementation](#8-implementation)
    - [8.1 Token tracking](#81-token-tracking)
    - [8.2 Data polling](#82-data-polling)
    - [8.3 Signal generation](#83-signal-generation)
    - [8.4 Nillion's Secret Vault](#84-nillions-secret-vault)
    - [8.5 AccessNFT smart contract](#85-accessnft-smart-contract)
  - [9. License](#9-license)

## 1. Overview

Gorillionaire is an innovative AI Crypto Signals & Gamified Trading platform. Maximize your profits by accessing to premium trading signal generated by our Signal Agent, which will give you the most up to date suggestions based on actual market conditions. Gain points with every trade you make, enjoy the competition with other traders, and make a living by accessing every market opportunity available to you!

## 2. Target audience

Gorillionaire is a platform that makes trading tokens easier and quicker, allowing both degens and seasoned tradfi traders to access the market's most hidden opportunities. The trading signal system lowers the access barriers to this kind of activities, allowing for mass-adoption of the platform.

## 3. Long-term sustainability

Signals generated by our agent are stored in an encrypted database provided by Nillion. This allows the project to grant access to users willing to contribute by purchasing the Gorillionaire Access NFT, which will allow complete access to the signal generation function, as well as fostering the competition on the trader's leaderboard.

## 4. Submission details

- GitHub Repository: https://github.com/gorilli-team/gorillionaire
- Link to the project: https://app.gorillionai.re/

## 5. Technologies used

<a href="https://nextjs.org/"><img src="./docs/img/nextjs-logo.png" alt="NextJS Logo" width="50" height="50"></a>
<a href="https://www.mongodb.com/"><img src="./docs/img/mongodb-logo.svg" alt="MongoDB Logo" width="50" height="50"></a>
<a href="https://supabase.com/"><img src="./docs/img/supabase-logo.svg" alt="Supabase Logo" width="50" height="50"></a>
<a href="https://testnet.monad.xyz/"><img src="./docs/img/monad-logo.webp" alt="Monad Logo" width="50" height="50"></a>
<a href="https://www.pyth.network/"><img src="./docs/img/pyth-logo.svg" alt="Langchain Logo" width="50" height="50"></a>
<a href="https://blockvision.org/"><img src="./docs/img/blockvision-logo.svg" alt="Blockvision Logo" width="50" height="50"></a>
<a href="https://www.codex.io/"><img src="./docs/img/codex-logo.png" alt="Codex Logo" width="50" height="50"></a>
<a href="https://www.langchain.com/"><img src="./docs/img/langchain-logo.png" alt="Langchain Logo" width="70" height="50"></a>

## 6. Sponsors

<a href="https://www.privy.io/"><img src="./docs/img/privy-logo.jpg" alt="Privy Logo" width="50" height="50"></a>
<a href="https://0x.org/products/swap"><img src="./docs/img/0x-logo.png" alt="0x Logo" width="50" height="50"></a>
<a href="https://nillion.com/"><img src="./docs/img/nillion-logo.jpg" alt="Nillion Logo" width="50" height="50"></a>
<a href="https://envio.dev/"><img src="./docs/img/envio-logo.png" alt="Envio Logo" width="120" height="50"></a>

| Sponsor     | Integration method    | Description                                                                                                                                                         | Link to the bounty |
| ----------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Privy       | Wallet authentication | Users can easily access the platform with their wallet thanks to Privy, which smoothens the onboarding process with crypto/fiat onramping.                          | [Link](https://monad-foundation.notion.site/Sponsor-Bounties-Resources-1916367594f2802ba5d8c832089fde42?p=1916367594f280e987a0d78437c2c777&pm=c)         |
| 0x Swap API | Swap tokens           | Users can execute their trade according to the signal generated thanks to 0x Swap API, which allows them to find the best swap opportunity available on the market. | [Link](https://monad-foundation.notion.site/Sponsor-Bounties-Resources-1916367594f2802ba5d8c832089fde42?p=1916367594f2808588d7d30ce1ee5f00&pm=c)         |
| Nillion     | Encrypted storage     | Generated signals are stored securely on a decentralized database provided by Nillion.                                                                              | [Link](https://monad-foundation.notion.site/Sponsor-Bounties-Resources-1916367594f2802ba5d8c832089fde42?p=1916367594f280aea084c6cf78329696&pm=c)         |
| Envio       | Token tracking        | Transfers and listings events are tracked with Envio, these will serve as the context for the signal generation process.                                            | [Link](https://monad-foundation.notion.site/Sponsor-Bounties-Resources-1916367594f2802ba5d8c832089fde42?p=1a16367594f280378f5eedd541e71366&pm=c)         |


## 7. Security considerations

| Category           | Security measures                                | Description                                                                                                                       |
| ------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Smart contracts    | Followed CEI pattern                             | The mint function in AccessNFT updates the token counter before minting the NFT, preventing re-entrancy attacks.                  |
|                    | Inherited from standard contracts (OpenZeppelin) | AccessNFT inherits from ERC721 and Ownable standard contracts from the OpenZeppelin library, ensuring adherence to best practices |
| API Calls          | Privy token authorization                        | Only users with an authorized Privy token can access to API calls to the backend                                                  |
| Nillion            | NFT based authorization                          | Encrypted signals are accessible only to users that successfully purchased the AccessNFT                                          |
| Leaderboard scores | Backup transactions on DB                        | Transaction intents are stored on DB to verify the assignment of trading points when the transaction is executed                  |

## 8. Implementation
<div style="display: flex; justify-content:center">
<img src="./docs/img/Final diagram (minimal).png" alt="Implementation Diagram" width="800" height="650"></img>
</div>


### 8.1 Token tracking

The best trading signals are generated with the most accurate events and information about the tokens available. We decided to track the 3 most traded tokens in the Monad Testnet, which are Molandak (DAK), Moyaki (YAKI), and Chog (CHOG).<br>
We acquire information regarding transfers, spikes, new listings, token holders, tokens price evolution, and the native token MON price. These information are fetched via 4 different services:

- **Envio**: transfers, spikes, listings
- **Codex**: tokens price
- **Blockvision**: token holders
- **Pyth**: MON price

All the data are then stored on MongoDB (except for the MON price which is rendered on the frontend).

More details [here]().

### 8.2 Data polling

The raw data stored on MongoDB are then fetched every 30 minutes by the Signal Agent, which will query each collections and will fetch only the newly added events. Langchain's text splitter has been used for converting those events into machine readable vectors via the OpenAI Embeddings. Those embeddings are then stored in a Supabase database for the next step.

More details [here](./langchain/README.md).

### 8.3 Signal generation

The signal generation process has been created with Langchain. This tool helped us to structure a chain of prompts that translates an input prompt into an actionable and coherent trading signal. Thanks to the `match_documents` function on Supabase database, we are able to find the best events for the input prompt given. These events will then serve as the context for the generated signal.

More details [here](./langchain/README.md).

### 8.4 Nillion's Secret Vault

All the signals are stored in a decentralized database provided by Nillion. Thanks to Nillion, we are able to guarantee the encryption of both the trading signal text and the events that generated it, granting exclusive access only to those users that purchased the Gorillionaire Access NFT.

More details [here](./nillion/README.md).

### 8.5 AccessNFT smart contract
The smart contract for minting the Gorillionare Access NFT has been deployed on the Monad Testnet at the following address:
- [0x12bF70e3325104ed2D7fefbB8f3e88cE2Dd66A30](https://testnet.monadexplorer.com/address/0x12bF70e3325104ed2D7fefbB8f3e88cE2Dd66A30)

AccessNFT is a standard ERC721 contract that allows users to mint their NFT, with a minimum value sent of 1 MON. This NFT will serve as the access key to the exclusive signals generated by the agent.

More details [here](./access-nft/README.md).

## 9. License
The project has been developed for the Monad EVM/ACCATHON. All the files are licensed under the [MIT License](./LICENSE). We reserve the rights to change the license for further production deployment of the entire project.


## 🎯 User Experience (UX)

We put strong emphasis on delivering an intuitive and accessible user experience with **Gorillionaire**, ensuring users of all backgrounds — from DeFi veterans to first-time traders — can navigate and use the platform effortlessly.

### ✅ Intuitive Design  
The interface is clean, consistent, and easy to navigate. We followed UX best practices to ensure users can quickly understand where to go and what to do, with a clear and logical structure across all screens.

### ✅ User-Friendliness  
Every interaction in **Gorillionaire** is designed to be simple and accessible, even for users unfamiliar with crypto trading or blockchain technologies. Features are easy to find, actions are straightforward, and the overall flow is smooth and frictionless.

### ✅ Accessibility  
We’ve paid attention to accessibility standards to make **Gorillionaire** inclusive for everyone:
- High-contrast color schemes for better visibility and readability.
- Clear visual hierarchy and semantic structure.
- Keyboard navigation and screen reader compatibility for users with motor or visual impairments.

### ✅ Responsive Design  
**Gorillionaire** is fully responsive and optimized for mobile devices. The layout adapts perfectly across different screen sizes, ensuring a seamless experience on both desktop and smartphones.

### ✅ Visual Appeal  
The UI has a modern and engaging visual design — with a harmonious color palette, smooth transitions, and thoughtfully crafted components. The platform is not only functional but also aesthetically pleasing, making it enjoyable to use.

### ✨ Why This Matters  
We believe that a great user experience is key to onboarding more people into decentralized finance. By focusing on design, accessibility, and responsiveness, **Gorillionaire** offers a seamless and inclusive experience that leverages the performance power of **Monad**.
