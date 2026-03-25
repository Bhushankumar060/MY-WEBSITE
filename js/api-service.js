/**
 * TradeSovereign v5 – Secure API Service Layer
 *
 * All financial and AI API calls are routed through Netlify Functions (/.netlify/functions/).
 * This ensures zero API keys are ever exposed in the browser's source code or network tab.
 * This file is the single point of contact for all external data fetching.
 */

// ─── Base URL for Netlify Serverless Functions ─────────────────────────────
const PROXY_BASE = "/.netlify/functions";

// ─── Usage Logger (writes API call counts to Firestore for the Admin Panel) 
import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

async function logApiUsage(api, endpoint) {
  try {
    await addDoc(collection(db, "logs", "api_usage", "entries"), {
      api, endpoint, timestamp: serverTimestamp()
    });
  } catch (e) { /* silent fail */ }
}

// ═══════════════════════════════════════════════════════════
// 🤖 OpenAI API – via serverless proxy
// ═══════════════════════════════════════════════════════════
export async function askLumiTutor(userMessage, context = "student learning platform") {
  await logApiUsage("openai", "chat/completions");
  const res = await fetch(`${PROXY_BASE}/openai-proxy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: `You are Lumi, a friendly AI tutor for K-12 students on a ${context}. Answer in simple, encouraging language.` },
        { role: "user",   content: userMessage }
      ]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "I'm thinking... please try again!";
}

export async function askChaplinForecast(prompt) {
  await logApiUsage("openai", "chat/completions");
  const res = await fetch(`${PROXY_BASE}/openai-proxy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are Chaplin, a professional trading AI. Provide sharp, concise technical analysis and generate PineScript or Python code when asked." },
        { role: "user",   content: prompt }
      ]
    })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "Analysis unavailable.";
}

// ═══════════════════════════════════════════════════════════
// 📈 Polygon.io – Live Stock / Crypto Prices
// ═══════════════════════════════════════════════════════════
export async function getStockPrice(ticker) {
  await logApiUsage("polygon", `ticker/${ticker}`);
  const res = await fetch(`${PROXY_BASE}/polygon-proxy?ticker=${ticker}`);
  return res.json();
}

export async function getMarketSnapshot(tickers = ["AAPL","TSLA","MSFT","BTC","ETH"]) {
  await logApiUsage("polygon", "snapshot");
  const res = await fetch(`${PROXY_BASE}/polygon-proxy?tickers=${tickers.join(",")}`);
  return res.json();
}

// ═══════════════════════════════════════════════════════════
// 📰 Finnhub – Market News & Sentiment
// ═══════════════════════════════════════════════════════════
export async function getMarketNews(category = "general") {
  await logApiUsage("finnhub", "news");
  const res = await fetch(`${PROXY_BASE}/finnhub-proxy?type=news&category=${category}`);
  return res.json();
}

export async function getStockSentiment(symbol) {
  await logApiUsage("finnhub", `sentiment/${symbol}`);
  const res = await fetch(`${PROXY_BASE}/finnhub-proxy?type=sentiment&symbol=${symbol}`);
  return res.json();
}
