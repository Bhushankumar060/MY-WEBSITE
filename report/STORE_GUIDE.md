# Sovereign Store Guide v9.2

This guide outlines the management of digital products in the Sovereign Store.

## 1. Product Listings
The store renders products dynamically via `js/store.js`. To add a new product:
1. Edit the `products` array in `js/store.js`.
2. Add the `id`, `name`, `price`, and `category`.
3. The store will automatically render the new product on the next reload.

## 2. Inventory & Pricing
- **Pricing**: All prices should be in **INR**.
- **Checkout**: Handled by the **PaymentNexus** in `js/payment.js`.
- **Transactions**: Logged to **Supabase** in the `purchases` table.

---
**Build ID**: SOV_V9.2_PRO_REF
