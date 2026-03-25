# Sovereign v9.1 Security Manifest

To ensure the structural and financial integrity of the Sovereign Platform, apply the following security rules to your cloud providers.

## 1. Firebase Firestore Rules
Apply these in your Firebase Console -> Firestore -> Rules tab.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only the designated admin can read/write the settings
    match /admin/{document=**} {
      allow read, write: if request.auth != null && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
    }
    
    // Public can write error logs (for monitoring) but not read them
    match /admin/monitoring/logs/{logId} {
      allow create: if true;
      allow read: if request.auth != null && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
    }
  }
}
```

## 2. Supabase Storage & Table Rules (RLS)
Apply these in your Supabase Dashboard -> Authentication -> Policies.

### Purchases Table
- **Policy**: `authenticated_insert`
- **Definition**: `allow insert if auth.role() = 'authenticated'`
- **Policy**: `admin_full_access`
- **Definition**: `allow all if auth.email() = 'YOUR_ADMIN_EMAIL@gmail.com'`

## 3. Environment Variable Requirement
Ensure the following are set in your hosting environment (Netlify/Hostinger):
- `OPENROUTER_API_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_SECRET_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

---
**Build ID**: Sovereign_v9.1_PROD_RESTORE
