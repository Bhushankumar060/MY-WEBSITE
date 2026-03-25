# Setup Instructions

## 1. Firebase Initialization
1. Go to your [Firebase Console](https://console.firebase.google.com).
2. Click **Add Project** -> name it `TradeSovereign`.
3. Go to **Authentication**, enable **Email/Password**.
4. Go to **Firestore Database**, create the DB in production mode.
    - Setup strict security rules allowing read-only access for `users` and read-write for `admins`.
5. Go to **Storage**, activate your premium buckets.
6. Click the Web `< />` icon on your dashboard to retrieve your app config variables.

## 2. Environment Variables (.env)
Edit the `.env.example` file located in the root of the project and duplicate it to `.env`. Ensure your production server environment ingests these before building or exposing via secure serverless endpoints.

```env
OPENAI_API_KEY="sk-..."
POLYGON_API_KEY="..."
FINNHUB_API_KEY="..."
ALPHA_VANTAGE_API_KEY="..."

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="..."
# etc...
```

## 3. Serverless Integration (Important)
Since this is a fully static website, your API calls to OpenAI and Finnhub must originate from a secure backend to prevent exposing the API keys. 
We strongly recommend setting up **Firebase Cloud Functions**. 
- Map `fetch('/api/chat')` on the frontend `ai-widget.js` to trigger a Firebase Cloud function containing `process.env.OPENAI_API_KEY`!
