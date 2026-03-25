# Top Administrator FAQ (v4.0 Zero-Code)

### Q: How do I disable the AI Tutor to save money this month?
**A:** Head to `admin.html`. Under **Infrastructure -> Feature Flags**, flip the "Lumi AI Tutor" toggle to the off position. The sidebar will immediately vanish from the public Student Dashboard. No coding required.

### Q: Why isn't Polygon.io showing real-time price drops in TradeOS?
**A:** Navigate to **Monitoring Logs**. Look for a `[WARN] Rate Limit` or `[ERROR] Connection Refused` notice. If you hit your quota, navigate to `API Matrix` and rotate your key instantly.

### Q: I uploaded a PDF but it's not showing up for Class 12 Science?
**A:** Ensure you properly mapped the blob storage parameters. The CMS Engine requires explicit tagging (Class > Subject > Chapter). If untagged, the PDF rests in global Blob Storage waiting for assignment.

### Q: My "Security Score" dropped from 98/100 to 75/100. Why?
**A:** Check the **Security Center Audit** tab. It will list the vulnerabilities. Usually, this means an IP Whitelist expired or a CSP header failed validation on an external CDN injection. The AI system will provide a `"Fix Now"` button to apply the patch autonomously.
