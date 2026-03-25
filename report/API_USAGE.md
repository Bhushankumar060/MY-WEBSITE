# API Integration & Usage Guide

TradeSovereign utilizes multiple powerful APIs strictly architected for modular integration. Reference the `.env.example` file for injecting these into your build steps.

> **Security Warning:** As a static application, never deploy raw API keys in plain text `index.html` or `.js` files if they possess billing limits. Always proxy these calls through Firebase Cloud Functions or your host's serverless edge functions.

## 1. Firebase (Auth, Firestore, Storage)
- **Purpose:** Handling Admin authentication, storing the Class/Subject/Chapter hierarchy (Firestore), and hosting PDF study materials (Storage).
- **How to obtain:** https://console.firebase.google.com/
- **Usage:** Set up a web project and use the configuration object. The `.env` variables prefix with `NEXT_PUBLIC_FIREBASE...` for historical continuity.

## 2. OpenAI (GPT-4o)
- **Purpose:** Powers the student Q&A chat widget floating across the application, and the Admin panel query generator.
- **How to obtain:** https://platform.openai.com/
- **Usage:** Use `OPENAI_API_KEY`. Implement a simple HTTP POST request to `https://api.openai.com/v1/chat/completions` from a secure proxy.

## 3. Polygon.io
- **Purpose:** Real-time Stock and Crypto Quotes (WebSocket support for Live Ticker).
- **How to obtain:** https://polygon.io/
- **Usage:** Used in the `trading-zone/index.html` via the `wss://socket.polygon.io/crypto` endpoints. Use the `POLYGON_API_KEY`.

## 4. Alpha Vantage
- **Purpose:** Technical Indicators (RSI, MACD, SMA) for educational trader demos.
- **How to obtain:** https://www.alphavantage.co/support/#api-key
- **Usage:** Requires `ALPHA_VANTAGE_API_KEY`. Use REST endpoints `function=RSI`, `function=MACD` passing the target symbol.

## 5. Finnhub
- **Purpose:** Financial News & Sentiment Analysis feeds.
- **How to obtain:** https://finnhub.io/
- **Usage:** Use `FINNHUB_API_KEY`. Connect to `/news` or `/news-sentiment` endpoints to populate the main trader dashboard sidebar.

## 6. TradingView (Embedded Widgets)
- **Purpose:** No explicit API key required. We use their powerful iframe/script injection wrappers to generate interactive charts and economic calendars out of the box.
- **Usage:** Found seamlessly operating in `trading-zone/index.html`.
