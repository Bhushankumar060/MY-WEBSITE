# Troubleshooting & Fallback Matrix

This document provides exact, zero-code resolutions for the most critical failure states an administrator might encounter.

## 1. The Screen is Completely Blank (White Screen of Death)
**Symptom:** You navigate to `admin.html` and nothing loads.
**Resolution:**
1. This is almost exclusively an unhandled script breaking the DOM.
2. Check the `Monitoring Logs` via your Firebase Console external link if the UI is down.
3. If the error mentions `MFA Token Invalid`, flush your browser cache and request a new TOTP key.

## 2. Students Cannot See Newly Uploaded PDFs
**Symptom:** You dropped a PDF into Blob Storage, but the Student Zone shows "No Resources Available."
**Resolution:**
1. Files uploaded to raw Firebase Storage must be mapped to a Firestore document to appear.
2. Head to **CMS Engine**. Ensure that the specific PDF URI is actively linked under `Class X > Subject Y > Chapter Z`.

## 3. "AI Tutor Is Offline" Error
**Symptom:** Students report the Lumi Chatbot returns a red error box.
**Resolution:**
1. Head to **Infrastructure -> Feature Flags** and ensure the "Lumi AI Tutor" switch is ON.
2. If it is ON, check **Monitoring Logs** for `HTTP 429 Quota Exceeded`.
3. If quota is exceeded, navigate to **API Matrix** and rotate the OpenAI GPT-4 key to a billing-active string.

## 4. Admin Access Denied (403 Forbidden)
**Symptom:** You attempt to load the dashboard but get a server block.
**Resolution:**
1. Your IP Address has likely changed dynamically.
2. You must log into your Vercel/Netlify/Hostinger control panel and update the `.htaccess` or middleware IP whitelist manually to include your new dynamic IP. This is a hard-coded security lock that prevents remote hijackers even if they possess your laptop.
