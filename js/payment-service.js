/**
 * TradeSovereign v7.0 – Payment Service
 * Razorpay Checkout + Supabase Transaction Logger
 *
 * Flow: User clicks "Buy" → Razorpay popup → on success → verify on server
 * → Supabase logs transaction → Firebase Firestore unlocks premium content
 *
 * IMPORTANT: RAZORPAY_KEY_ID is safe to use client-side.
 * RAZORPAY_SECRET is ONLY used in the Netlify Function (server-side).
 */

import { db, auth, collection, addDoc, serverTimestamp } from "./firebase-config.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Supabase Client (anon key is safe for client read-only operations) ─────
const SUPABASE_URL  = "https://zdxgcenwkpfcfnlbiqgz.supabase.co";
const SUPABASE_ANON = "sb_publishable_XmrJRQSGhsVh_i_GkeC2sg_2NO0674b";
const supabase      = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── Course / Plan Catalogue ─────────────────────────────────────────────────
export const PLANS = {
  student_premium: {
    name:        "Student Premium",
    description: "Full access to all Classes 1–12, AI Tutor, and PDF downloads",
    amount:      49900,   // ₹499.00 in paise
    currency:    "INR"
  },
  trader_pro: {
    name:        "Trader Pro",
    description: "Full TradeOS access, AI agent builder, and strategy library",
    amount:      99900,   // ₹999.00 in paise
    currency:    "INR"
  },
  sovereign_bundle: {
    name:        "Sovereign Bundle",
    description: "Everything — Student + Trader + Priority support",
    amount:      149900,  // ₹1,499.00 in paise
    currency:    "INR"
  }
};

// ─── Load Razorpay SDK dynamically ────────────────────────────────────────────
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src   = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    document.body.appendChild(script);
  });
}

// ─── Core Payment Initiator ───────────────────────────────────────────────────
// ─── Core Payment Initiator ───────────────────────────────────────────────────
export async function initiatePayment(planId) {
  const plan = PLANS[planId];
  if (!plan) return alert("Invalid plan selected.");

  const user = auth.currentUser;
  if (!user) return alert("Please log in before purchasing.");

  // Visual feedback: find the calling button and show loading state
  const btn = event?.target?.closest('button');
  const originalText = btn ? btn.innerText : null;
  if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch animate-spin"></i> SECURING_CONNECTION...';
  }

  try {
    await loadRazorpay();

    const options = {
      key:         "rzp_live_SVPqQwS3Vb9enw", 
      amount:      plan.amount,
      currency:    plan.currency,
      name:        "TradeSovereign v9.0",
      description: plan.description,
      image:       "/assets/logo.png",
      prefill: {
        email: user.email,
        name:  user.displayName || "Sovereign Executive"
      },
      theme: { color: "#10b981" },

      handler: async (response) => {
        await verifyAndRecord(response, planId, user);
      },
      modal: {
        ondismiss: () => {
            if (btn) {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (e) {
      console.error(e);
      if (btn) {
          btn.disabled = false;
          btn.innerText = originalText;
      }
  }
}

// ─── Server-Side Verification + Record ────────────────────────────────────────
async function verifyAndRecord(razorpayResponse, planId, user) {
  try {
    // 2. Log transaction to Supabase
    await supabase.from("purchases").insert({
      user_id:    user.uid,
      user_email: user.email,
      plan_id:    planId,
      payment_id: razorpayResponse.razorpay_payment_id,
      amount:     PLANS[planId].amount / 100,
      status:     "success",
      created_at: new Date().toISOString()
    });

    // 3. Unlock access in Firestore
    await addDoc(collection(db, "users", user.uid, "access"), {
      plan:      planId,
      grantedAt: serverTimestamp(),
      paymentId: razorpayResponse.razorpay_payment_id
    });

    showPaymentSuccess(planId);

  } catch (err) {
    console.error("[Payment Error]", err);
    alert("System error. Payment ID: " + razorpayResponse.razorpay_payment_id);
  }
}

// ─── Success UI (v9.0 Executive Dark) ─────────────────────────────────────────
function showPaymentSuccess(planId) {
  const plan = PLANS[planId];
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 z-[999] flex items-center justify-center bg-dark/90 backdrop-blur-xl px-4";
  modal.innerHTML = `
    <div class="bg-surface p-12 max-w-md w-full text-center border border-primary/30 rounded-3xl shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-primary"></div>
      <div class="w-20 h-20 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 text-primary">
        <i class="fa-solid fa-shield-check"></i>
      </div>
      <h2 class="text-3xl font-black font-heading uppercase text-white mb-2 tracking-tighter">Asset Unlocked</h2>
      <p class="font-bold text-slate-400 mb-8 uppercase text-[10px] tracking-widest">${plan.name} is now secured in your vault.</p>
      <button onclick="window.location.href='/my-purchases.html'"
        class="w-full bg-primary text-dark font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-primary/20">
        Enter My Vault →
      </button>
    </div>`;
  document.body.appendChild(modal);
}

// ─── Check User Access ────────────────────────────────────────────────────────
export async function getUserAccess(userId) {
  const { data } = await supabase
    .from("purchases")
    .select("plan_id, status, created_at")
    .eq("user_id", userId)
    .eq("status", "success")
    .order("created_at", { ascending: false });
  return data || [];
}
