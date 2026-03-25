# Sovereign API Management v9.2

This guide outlines the dynamic orchestration of API credentials within the Sovereign Platform.

## 1. Dynamic Key Retrieval
Sovereign v9.2 uses a **Cloud Service Mesh** to retrieve all critical API keys from your Firestore `admin/settings` document. This ensures that no sensitive keys are ever hardcoded in the frontend.

## 2. Required Firestore Fields
Ensure your `admin/settings` document contains the following fields:
- `OPENROUTER_API_KEY`: For AI (Lumi & Chaplin).
- `RAZORPAY_KEY_ID`: For Checkout.
- `SUPABASE_URL`: For Transactions.
- `SUPABASE_ANON_KEY`: For Transactions.

## 3. Updating Credentials
To update a key globally:
1. Log in to the Cloud Console (Firestore).
2. Edit the field in the `admin/settings` document.
3. The platform will automatically pull the new key on the next reload.

---
**Build ID**: SOV_V9.2_PRO_REF
