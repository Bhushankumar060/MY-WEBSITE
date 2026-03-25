/**
 * Netlify Function: finnhub-proxy
 * Keeps the Finnhub API key completely server-side.
 * Client calls:
 *   GET /.netlify/functions/finnhub-proxy?type=news&category=general
 *   GET /.netlify/functions/finnhub-proxy?type=sentiment&symbol=AAPL
 */

exports.handler = async (event) => {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
  if (!FINNHUB_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Finnhub key not configured." }) };
  }

  const { type, category, symbol } = event.queryStringParameters || {};
  let url;

  if (type === "news") {
    url = `https://finnhub.io/api/v1/news?category=${category || "general"}&token=${FINNHUB_API_KEY}`;
  } else if (type === "sentiment") {
    url = `https://finnhub.io/api/v1/news-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  } else {
    return { statusCode: 400, body: "Provide ?type=news or ?type=sentiment" };
  }

  const res  = await fetch(url);
  const data = await res.json();
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body:       JSON.stringify(data)
  };
};
