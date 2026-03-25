# Real-Time Monitoring & Logs

You no longer need to rely on complex AWS CloudWatch or Firebase console readouts. V4 introduces a real-time terminal directly within the dashboard.

## Accessing the Logs
Navigate to **DevOps & Security -> Monitoring Logs**.

## Interpreting Output
- **[INFO]**: Standard operational milestones. E.g. "Firebase Auth Token Executed".
- **[WARN]**: Approaching limitations. Pay close attention to these, especially regarding API Quotas. If Finnhub hits 50/60 limits, the system will warn you here so you can implement caching via the Feature Flags tab.
- **[ERROR]**: Front-end breakage. If a user receives a blank white screen, the exact structural Javascript breakdown (e.g., `TypeError: Cannot read properties`) will print here alongside their device signature.

## Uptime Pings
You can manually run a heartbeat sequence via the **Run Ping** button. This sends 5 sequential rapid requests to OpenAI, Polygon, and Firebase to ensure external dependencies haven't suffered outages.
