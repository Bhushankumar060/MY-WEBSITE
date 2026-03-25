/**
 * Netlify Function: razorpay-verify
 * Verifies Razorpay payment signature server-side using the secret key.
 * The Razorpay Secret Key NEVER touches the browser.
 *
 * POST /.netlify/functions/razorpay-verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */

const crypto = require("crypto");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET_KEY;
  if (!RAZORPAY_SECRET) {
    return { statusCode: 500, body: JSON.stringify({ error: "Razorpay secret not configured." }) };
  }

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, body: "Invalid JSON" }; }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  // Razorpay signature verification algorithm
  const payload  = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected = crypto
    .createHmac("sha256", RAZORPAY_SECRET)
    .update(payload)
    .digest("hex");

  const verified = expected === razorpay_signature;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ verified })
  };
};
