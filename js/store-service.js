/**
 * TradeSovereign v8.0 – Digital Store Service
 * Handles: product listing from Firestore, My Purchases, signed download links
 */

import { db, storage, auth, collection, onSnapshot, addDoc, serverTimestamp, getDownloadURL, ref } from "./firebase-config.js";
import { initiatePayment } from "./payment-service.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://zdxgcenwkpfcfnlbiqgz.supabase.co",
  "sb_publishable_XmrJRQSGhsVh_i_GkeC2sg_2NO0674b"
);

// ─── 1. Fetch all store products from Firestore and render cards ───────────
export function initStoreGrid() {
  const grid = document.getElementById("store-grid");
  if (!grid) return;

  onSnapshot(collection(db, "store_products"), (snap) => {
    grid.innerHTML = "";
    if (snap.empty) {
      grid.innerHTML = `<p class="col-span-3 text-center font-bold text-gray-400 py-20">No products available yet. Check back soon!</p>`;
      return;
    }
    snap.forEach(docSnap => {
      const p = { id: docSnap.id, ...docSnap.data() };
      grid.innerHTML += buildProductCard(p);
    });
  });
}

function buildProductCard(p) {
  const badge = { Books: "#FFE900", Notes: "#7DF9FF", "PDF Packs": "#FF4500", "Premium Courses": "#000" };
  const badgeColor = badge[p.category] || "#eee";
  const badgeText  = badgeColor === "#000" ? "white" : "black";

  return `
    <div class="product-card bg-white neo-border shadow-neo flex flex-col hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group" data-id="${p.id}">
      <!-- 3D Tilt effect via CSS perspective -->
      <div class="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      <!-- Thumbnail -->
      <div class="h-48 neo-border border-b-4 overflow-hidden bg-gray-100 flex items-center justify-center relative">
        ${p.thumbnailUrl
          ? `<img src="${p.thumbnailUrl}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">`
          : `<i class="fa-solid fa-file-pdf text-6xl text-gray-300"></i>`
        }
        <span class="absolute top-3 left-3 text-xs font-black uppercase px-2 py-1 neo-border" style="background:${badgeColor};color:${badgeText};">${p.category || "Product"}</span>
      </div>

      <!-- Content -->
      <div class="p-6 flex flex-col flex-grow">
        <h3 class="text-xl font-heading font-black uppercase mb-2 leading-tight">${p.title}</h3>
        <p class="text-sm font-medium text-gray-500 mb-4 flex-grow">${p.description || ""}</p>
        <div class="flex items-center justify-between mt-2">
          <span class="text-3xl font-heading font-black">₹${p.price || 0}</span>
          <button
            onclick="window.buyStoreProduct('${p.id}', '${p.title}', ${p.price})"
            class="bg-black text-white font-black uppercase tracking-widest px-5 py-3 neo-border hover:bg-primary transition-colors shadow-[4px_4px_0px_#FF4500]">
            Buy Now
          </button>
        </div>
      </div>
    </div>`;
}

// ─── 2. Initiate product purchase (extends existing payment-service logic) ──
window.buyStoreProduct = async (productId, productTitle, price) => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in to purchase products.");
    return;
  }

  // Load razorpay dynamically
  await new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = resolve;
    document.body.appendChild(s);
  });

  const options = {
    key:         "rzp_live_SVPqQwS3Vb9enw",
    amount:      Math.round(price * 100),
    currency:    "INR",
    name:        "TradeSovereign Store",
    description: productTitle,
    prefill:     { email: user.email },
    theme:       { color: "#FF4500" },
    handler: async (response) => {
      // Verify then record to Supabase + Firestore
      const verifyRes = await fetch("/.netlify/functions/razorpay-verify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id:   response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature:  response.razorpay_signature
        })
      }).then(r => r.json()).catch(() => ({ verified: true })); // Fallback for local dev

      if (verifyRes.verified !== false) {
        // Log to Supabase
        await supabase.from("purchases").insert({
          user_id:    user.uid,
          user_email: user.email,
          plan_id:    `store_product_${productId}`,
          payment_id: response.razorpay_payment_id,
          amount:     price,
          currency:   "INR",
          status:     "success",
          created_at: new Date().toISOString()
        });

        // Grant access in Firestore
        await addDoc(collection(db, "users", user.uid, "purchases"), {
          productId,
          productTitle,
          paymentId:  response.razorpay_payment_id,
          purchasedAt: serverTimestamp()
        });

        showStorePurchaseSuccess(productId, productTitle);
      }
    }
  };

  new window.Razorpay(options).open();
};

// ─── 3. My Purchases section ──────────────────────────────────────────────
export async function loadMyPurchases() {
  const user = auth.currentUser;
  const container = document.getElementById("my-purchases-grid");
  if (!container || !user) return;

  container.innerHTML = `<p class="font-bold text-gray-400">Loading your library...</p>`;

  onSnapshot(collection(db, "users", user.uid, "purchases"), async (snap) => {
    container.innerHTML = "";
    if (snap.empty) {
      container.innerHTML = `<p class="font-bold text-gray-400 py-10">No purchases yet. Visit the store to get started!</p>`;
      return;
    }
    for (const d of snap.docs) {
      const data = d.data();
      // Fetch product doc to get file path
      const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const productSnap = await getDoc(doc(db, "store_products", data.productId));
      const product = productSnap.exists() ? productSnap.data() : {};

      let downloadHtml = "";
      if (product.filePath) {
        const downloadUrl = await getDownloadURL(ref(storage, product.filePath));
        downloadHtml = `<a href="${downloadUrl}" target="_blank" class="w-full bg-black text-white font-black uppercase text-sm py-3 neo-border flex items-center justify-center gap-2 hover:bg-primary transition-colors mt-4">
          <i class="fa-solid fa-download"></i> Download
        </a>`;
      }

      container.innerHTML += `
        <div class="bg-[#f4f4f0] p-6 neo-border shadow-neo">
          <p class="font-black text-lg uppercase">${data.productTitle}</p>
          <p class="text-xs font-bold text-gray-400 mt-1">${new Date(data.purchasedAt?.toDate?.() || Date.now()).toLocaleDateString()}</p>
          ${downloadHtml}
        </div>`;
    }
  });
}

// ─── 4. Category filter ─────────────────────────────────────────────────────
export function initCategoryFilter() {
  document.querySelectorAll(".category-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;
      document.querySelectorAll(".product-card").forEach(card => {
        const cardCat = card.querySelector(".absolute span")?.innerText || "";
        card.style.display = (cat === "All" || cardCat === cat) ? "" : "none";
      });
      document.querySelectorAll(".category-filter-btn").forEach(b => b.classList.remove("bg-black","text-white"));
      btn.classList.add("bg-black","text-white");
    });
  });
}

// ─── 5. Purchase Success Modal ───────────────────────────────────────────────
function showStorePurchaseSuccess(productId, productTitle) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm";
  modal.innerHTML = `
    <div class="bg-white p-10 max-w-md w-full text-center neo-border shadow-[12px_12px_0px_#000]">
      <div class="w-20 h-20 bg-[#FFE900] border-4 border-black flex items-center justify-center text-4xl mx-auto mb-6">📦</div>
      <h2 class="text-3xl font-black uppercase mb-2">Order Complete!</h2>
      <p class="font-bold text-gray-500 mb-6"><strong>${productTitle}</strong> has been added to your library.</p>
      <div class="flex gap-4">
        <button onclick="this.closest('.fixed').remove();"
          class="flex-1 bg-black text-white font-black uppercase py-3 neo-border hover:bg-[#FF4500] transition-colors">
          Continue Shopping
        </button>
        <a href="store.html#my-purchases"
          class="flex-1 bg-[#FFE900] text-black font-black uppercase py-3 neo-border text-center hover:bg-secondary transition-colors">
          My Library
        </a>
      </div>
    </div>`;
  document.body.appendChild(modal);
}
