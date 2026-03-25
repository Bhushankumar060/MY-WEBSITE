# Store Guide – TradeSovereign v8.0

## Adding a New Product (Zero Code)

1. Log in to the **Admin Panel** (`/admin.html`).
2. Click the **"Store Products"** tab in the left sidebar.
3. Fill in the product form:
   - **Title** – product name (e.g., "Options Trading Masterclass PDF")
   - **Category** – Books / Notes / PDF Packs / Premium Courses
   - **Price (₹)** – in Indian Rupees
   - **Description** – short summary shown on the card
   - **Upload File** – drag and drop the PDF or content file (stored in Firebase Storage, never public)
   - **Upload Thumbnail** – JPG/PNG image shown on the product card
4. Click **"Publish Product"**.
5. The product **instantly appears** on `store.html` without any redeployment.

---

## How the Purchase Flow Works

```
User clicks "Buy Now"
  → Razorpay popup (live or test mode)
  → User pays
  → Server verifies payment signature (/.netlify/functions/razorpay-verify)
  → Supabase `purchases` table records the transaction
  → Firestore /users/{uid}/purchases grants access
  → Product appears in user's "My Library"
  → Firebase Storage generates a signed download URL (expires in 1 hour)
```

> [!NOTE]
> The actual PDF file is never publicly accessible. Only users with a verified purchase record in Firestore receive a temporary signed URL.

---

## Managing Sales (Admin Payments Tab)

- View all transactions with user email, product, and payment ID.
- Manually revoke access: delete the Firestore document at `/users/{uid}/purchases/{purchaseId}`.
- Issue refunds: Go to `dashboard.razorpay.com` → Transactions → Refund.

---

## Pricing Best Practices

| Category | Recommended Range |
|---|---|
| Notes (single subject) | ₹49 – ₹199 |
| PDF Packs (multi-subject) | ₹199 – ₹499 |
| Books | ₹299 – ₹799 |
| Premium Courses | ₹499 – ₹2,499 |

---

## Supabase Table Setup

Run this SQL in `app.supabase.com` → SQL Editor (one-time setup):

```sql
-- This is already created from PAYMENT_SETUP.md
-- The purchases table stores all product transactions.
-- No additional tables needed for the store.
```

The `plan_id` column stores `store_product_{firestoreDocId}` for store purchases, making them distinguishable from subscription plans.
