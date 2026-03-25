# Sovereign Platform v9.1 - MASTER RESTORE BUILD

This is the definitive, high-authority production build of the TradeSovereign ecosystem. Reconstructed for absolute structural integrity and v9.1 feature parity.

## 🚀 Deployment Instructions

### 1. Simple Hosting (Netlify / Vercel)
1. **Upload**: Drag and drop the contents of this ZIP (or the `TradeSovereign` folder) into Netlify.
2. **Environment Variables**: Add your API keys (Razorpay, Supabase, etc.) in the dashboard.
3. **Site is Live**: Your platform will be accessible immediately via the Netlify URL.

### 2. Custom Domain Setup
- Go to your Domain Settings in Netlify.
- Add `tradesovereign.com`.
- Point your CNAME records to the Netlify subdomain.

## 🛠️ Configuration
All critical AI and Payment keys are retrieved **dynamically** from your Firestore `admin/settings` document. Ensure this document exists with the following fields:
- `OPENROUTER_API_KEY`
- `RAZORPAY_KEY_ID`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## 🛡️ Security
Apply the rules provided in `SECURITY_RULES.md` to your Firebase and Supabase consoles immediately upon deployment.

---
**Build ID**: Sovereign_v9.1_PROD_RESTORE
**Status**: DEFINITIVE / PRODUCTION_READY
