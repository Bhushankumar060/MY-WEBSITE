/**
 * Netlify Function: polygon-proxy
 * Keeps the Polygon.io API key completely server-side.
 * Client calls: GET /.netlify/functions/polygon-proxy?ticker=AAPL
 */

exports.handler = async (event) => {
  const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
  if (!POLYGON_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Polygon key not configured." }) };
  }

  const { ticker, tickers } = event.queryStringParameters || {};
  let url;

  if (tickers) {
    // Batch snapshot for multiple tickers
    url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${tickers}&apiKey=${POLYGON_API_KEY}`;
  } else if (ticker) {
    // Single ticker last trade
    url = `https://api.polygon.io/v2/last/trade/${ticker}?apiKey=${POLYGON_API_KEY}`;
  } else {
    return { statusCode: 400, body: "Provide ?ticker=SYMBOL or ?tickers=A,B,C" };
  }

  const res  = await fetch(url);
  const data = await res.json();
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    body:       JSON.stringify(data)
  };
};
