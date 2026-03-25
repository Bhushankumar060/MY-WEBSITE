# Sovereign Troubleshooting v9.2

This guide outlines the recovery protocols for common issues in the Sovereign Platform.

## 1. 3D Background Loading Fault
- **Cause**: High-performance Three.js engine blocked by browser or slow CDN.
- **Fix**: Check your internet connection or verify the `js/three-bg.js` link in your HTML.
- **Recovery**: Falling back to a static glassmorphic background is automatic.

## 2. SSO Login Rejection
- **Cause**: Invalid Firebase credentials or lack of network connectivity.
- **Fix**: Ensure your email and vault passphrase are correct.
- **Recovery**: Check your Firebase Console -> Authentication to verify your user exists.

## 3. Payment Key Missing
- **Cause**: `admin/settings` doc in Firestore is missing the `RAZORPAY_KEY_ID`.
- **Fix**: Re-populate the doc in the Firestore console.
- **Recovery**: Any missing keys will trigger a `SYSTEM_OFFLINE` alert.

## 4. Global Error Monitor
Access the `admin/monitoring/logs` collection in Firestore to view high-authority stack traces for any runtime crashes.

---
**Build ID**: SOV_V9.2_PRO_REF
