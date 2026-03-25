# Sovereign v13.0 Security Protocol

## 1. Institutional MFA (Multi-Factor Authentication)
The Admin Command Center is protected by a simulated Institutional MFA layer.
- **Protocol**: Session Token Verification.
- **Requirement**: `SOV-AUTH-13-2026`.
- **Enforcement**: Session termination on invalid attempts.

## 2. Dynamic IP Whitelisting
Admin sessions are locked to recognized institutional IP addresses.
- **Automatic Whitelisting**: The developer's machine is automatically whitelisted during the build phase.
- **Global Constraints**: Access from unknown data centers/VPNs is blocked and logged.

## 3. Serverless Proxy Architecture (Netlify)
Sensitive API credentials are no longer exposed on the client-side.
- **Functions**: `/functions/ai-proxy.js` handles all OpenRouter calls.
- **Environment Variables**: Keys are stored securely in the Netlify dashboard.
- **CORS Enforcement**: Functions only respond to Sovereign Platform origins.

## 4. Global Error Triage
All runtime anomalies are logged to Firestore `logs/errors` for administrative review.
- **Exposure Prevention**: Error stacks are scrubbed before reaching the production console.
