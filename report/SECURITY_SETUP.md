# Sovereign Security Setup v9.2

This guide outlines the critical security configurations for the Sovereign Platform.

## 1. Firebase Firestore Rules
Apply these in your Firebase Console -> Firestore -> Rules.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only the designated admin can read/write settings
    match /admin/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
    }
  }
}
```

## 2. Supabase RLS Policies
Ensure 'purchases' table has 'authenticated insert' permission enabled.

## 3. Global Error Logging
All runtime errors are captured by `js/error-logger.js` and stored in `admin/monitoring/logs` in Firestore for real-time audit capability.

---
**Build ID**: SOV_V9.2_PRO_REF
