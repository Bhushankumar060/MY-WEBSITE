# Payment System Setup Guide

## Overview
TradeSovereign v7.0 uses **Razorpay** for payment processing and optionally logs transactions to **Supabase** for your admin dashboard.

---

## Razorpay Configuration

### What Each Key Does
| Key | Location | Safe to expose? |
|-----|----------|----------------|
| `RAZORPAY_KEY_ID` | Client-side JS | ✅ Yes — it's public |
| `RAZORPAY_SECRET_KEY` | Netlify Function only | ❌ No — server-only |

### Setting Up Test Mode (Recommended First)
1. Log in to `dashboard.razorpay.com`
2. Toggle to **Test Mode** (top-right switch)
3. Go to Settings → API Keys → Generate Test Keys
4. Update `RAZORPAY_KEY_ID` in your `.env` with the `rzp_test_...` key
5. Use Razorpay's test card: `4111 1111 1111 1111` to verify the flow

### Going Live
1. Complete Razorpay KYC verification
2. Switch `RAZORPAY_KEY_ID` in `.env` to your `rzp_live_...` key
3. Update the same in Netlify Environment Variables
4. Deploy and test with a real ₹1 transaction

---

## Supabase Configuration

### Create the Purchases Table
Run this SQL in your Supabase SQL Editor (`app.supabase.com` → SQL Editor):

```sql
CREATE TABLE purchases (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     text NOT NULL,
  user_email  text NOT NULL,
  plan_id     text NOT NULL,
  payment_id  text NOT NULL,
  amount      numeric NOT NULL,
  currency    text NOT NULL DEFAULT 'INR',
  status      text NOT NULL DEFAULT 'success',
  created_at  timestamptz DEFAULT now()
);

-- Allow authenticated users to insert their own purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own purchases" ON purchases FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all" ON purchases FOR SELECT USING (true);
```

### Viewing Transactions in Admin Panel
All payments are visible in the Admin Panel under the **Payments** tab.
They are fetched live from Supabase using the anon key.

---

## Payment Flow (End-to-End)
1. User clicks **"Buy Plan"** on landing page
2. Razorpay popup appears (test or live mode)
3. User completes payment
4. Client receives `razorpay_payment_id` + `razorpay_signature`
5. Our Netlify Function (`razorpay-verify.js`) verifies the signature using HMAC-SHA256
6. On success: Supabase records the transaction + Firebase unlocks premium content
7. User sees the success modal and gains access

> [!CAUTION]
> Never switch to `rzp_live_` keys until you have tested the complete flow with test keys first.
