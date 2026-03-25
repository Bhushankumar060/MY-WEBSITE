# API Matrix & Rotation Framework

TradeSovereign relies on massive 3rd-party data aggregation. Because exposing raw API keys inside static HTML is a critical security vulnerability, the V4 architecture introduces the **API Management Matrix**.

## Currently Monitored External Endpoints:
1. **Polygon.io** (WebSockets) -> Live TradeOS crypto/stock pricing.
2. **OpenAI GPT-4o** -> Drives the "Lumi" Student Tutor.
3. **Finnhub** -> Live Trader sentiment analysis.
4. **Alpha Vantage** -> Technical indicator compilation.

## How to Rotate Keys (Without touching code)
1. Within the `admin.html` dashboard, navigate to **Infrastructure -> API Matrix**.
2. You will see a list of connected endpoints accompanied by live Quota tracking and latency pings.
3. To rotate a key securely, locate the API, enter the new `sk_...` or `pk_...` string into the obfuscated text field, and click **Rotate Key**. 
4. The system will dispatch an automated serverless function test. If successful, the new key immediately takes over. No server restart required.

*Monitoring quotas here prevents surprise billing overages from AI API providers.*
