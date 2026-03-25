# Enterprise Security Architecture (v4.0)

As a financial and educational platform, TradeSovereign enforces strict zero-trust parameters.

## 1. Multi-Factor Authentication (MFA)
Accessing `/admin.html` is impossible via standard password authentication. The login portal requires a **6-digit Time-based One-Time Password (TOTP)** sent directly to the root administrator's registered device.

## 2. IP Whitelisting
To prevent rogue access, the platform checks the requesting origin signature. You can view currently whitelisted IPs directly via the **Security Center** tab inside the dashboard. Connection requests from unknown IPs will result in an immediate 403 Forbidden rejection.

## 3. Content Security Policies (CSP)
We utilize hardened HTTP headers natively injected into our `head` tags:
- `Strict-Transport-Security` ensures the platform only ever resolves over HTTPS.
- `X-Frame-Options: DENY` prevents clickjacking embedded malicious iframes.
- `Content-Security-Policy` guarantees that only authorized CDNs (Tailwind, FontAwesome, Google Fonts, GSAP) can run scripts. 

*Any detected breach logs instantly to the Monitoring Dashboard.*
