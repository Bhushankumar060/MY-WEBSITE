# Sovereign Payment Setup v9.2

This guide outlines the integration of Razorpay and Supabase for Sovereign Platform v9.2.

## 1. Razorpay Integration
1. Go to your Razorpay Dashboard -> API Keys.
2. Obtain your `RAZORPAY_KEY_ID`.
3. Enter this ID into your Firestore `admin/settings` document.
4. The platform will automatically use this key for all checkouts.

## 2. Supabase Integration
1. Go to your Supabase Dashboard -> Project Settings -> API.
2. Obtain your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. Add these to your Firestore `admin/settings` document.
4. Ensure the `purchases` table has `authenticated insert` RLS enabled.

---
**Build ID**: SOV_V9.2_PRO_REF
