# The Sovereign Platform: Absolute Risk Mitigation Plan

A platform of this unprecedented complexity faces catastrophic failure vectors. Here is the architectural defense matrix against those vectors.

## Risk 1: API Quota Exhaustion & Financial Bleed
**The Threat:** Thousands of students querying the OpenAI "Lumi Tutor" simultaneously or the TradeOS continually polling Finnhub, resulting in thousands of dollars in overage fees or hard rate-limits.
**The Mitigation:**
1. **Edge-Level Caching:** The Firebase Function API Proxy caches identical Finnhub/Polygon stock queries for 60 seconds. A thousand users polling BTC/USD concurrently generate exactly ONE upstream API call.
2. **Hard-Stop Toggles:** The `admin.html` Feature Toggle allows the host to instantly kill the "Lumi Tutor" globally with a single click if billing thresholds are breached.

## Risk 2: Exposed Secrets in the DOM
**The Threat:** A malicious actor inspects the `trading-zone` source code, extracts the Alpha Vantage key, and uses it maliciously.
**The Mitigation:**
1. **Zero Client-Side Keys:** No raw keys exist in the `index.html` files. The frontend only possesses anonymous Firebase tokens. Keys are exclusively rotated by the Admin into Firestore, and only the isolated Edge Functions retrieve them.

## Risk 3: Admin Brute-Force & Session Hijacking
**The Threat:** An attacker brute-forces the `admin.html` login and corrupts the entire `classes` collection.
**The Mitigation:**
1. **MFA Native Enforcement:** Standard email/password combos are rejected. An active TOTP token is mathematically required to bypass the security rule threshold (`mfa_verified == true`).
2. **.htaccess IP Whitelisting:** The `/admin.html` route is physically bound by the Apache/Netlify middleware. If the IP origin is not verified, the server drops the connection before Firebase Auth even initializes.

## Risk 4: UI/UX Client Thrashing
**The Threat:** Loading the GSAP animations, Liquid Glass blurs, and TradingView iframes causes Low-End mobile devices to crash.
**The Mitigation:**
1. Heavily throttled `requestAnimationFrame` hooks.
2. Liquid Glass `backdrop-filter` is disabled via media queries on critically low-spec devices, degrading gracefully to pure flat hex colors to maintain the Neubrutalist aesthetic without GPU throttling.
