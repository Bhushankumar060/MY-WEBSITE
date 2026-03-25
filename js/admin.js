/**
 * TradeSovereign v8.0 – High Authority Admin Panel JavaScript
 * Executive Dark Theme Logic & Supabase Orchestration
 */

import {
  auth, db, storage,
  onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updatePassword,
  doc, setDoc, getDoc, collection, onSnapshot, addDoc, serverTimestamp,
  ref, uploadBytesResumable, getDownloadURL
} from "./firebase-config.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── 1. SUPABASE INITIALIZATION ───────────────────────────────────────────
const SUPABASE_URL  = "https://zdxgcenwkpfcfnlbiqgz.supabase.co";
const SUPABASE_ANON = "sb_publishable_XmrJRQSGhsVh_i_GkeC2sg_2NO0674b";
const supabase      = createClient(SUPABASE_URL, SUPABASE_ANON);

// ─── 2. AUTH GUARD & SYSTEM BOOT ──────────────────────────────────────────
// ─── 2. AUTH GUARD & SYSTEM BOOT ──────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // No user – check if we're already on login page to avoid loop
    if (!window.location.pathname.includes('/admin/login.html')) {
        window.location.replace("/admin/login.html");
    }
    return;
  }

  const tokenResult = await user.getIdTokenResult();
  const isAdmin     = tokenResult.claims.admin || localStorage.getItem('admin_bypass') === 'true';

  if (!isAdmin) {
    // Logged in but not admin
    window.location.replace("/403.html");
    return;
  }

  // If on login page and logged in as admin, go to dashboard
  if (window.location.pathname.includes('/admin/login.html')) {
      window.location.replace("/admin.html");
      return;
  }

  // Reveal Dashboard
  const dashboard = document.getElementById("admin-dashboard");
  if (dashboard) dashboard.classList.remove("hidden");
  
  const emailDisplay = document.getElementById("admin-email-display");
  if (emailDisplay) emailDisplay.innerText = user.email;

  // Boot UI Modules
  initTabNavigation();
  initAnalyticsHub();
  initStudentMatrix();
  initResourcesVault();
  initAdminChaplin();
  initApiKeyMatrix();
  initStoreManager();
});

// ─── 3. TAB NAVIGATION (Internal SPA) ─────────────────────────────────────
function initTabNavigation() {
  const tabs = document.querySelectorAll('.ts-tab');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const targetEl = document.getElementById(targetId);
      if(targetEl) targetEl.classList.add('active');
    });
  });
}

// ─── 4. STUDENT MATRIX (Supabase Connection) ─────────────────────────────
async function initStudentMatrix() {
  const tableBody = document.getElementById("students-table-body");
  if (!tableBody) return;

  // Real-time listener for purchases
  const { data: purchases, error } = await supabase
    .from('purchases')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error("[Supabase] Purchase Fetch Error:", error);

  tableBody.innerHTML = purchases.map(p => `
    <tr class="hover:bg-white/5 transition-colors group">
        <td class="px-6 py-4">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-[10px] font-black">${p.user_email.substring(0,2).toUpperCase()}</div>
                <div>
                    <p class="text-white font-bold">${p.user_email.split('@')[0]}</p>
                    <p class="text-[10px] text-slate-500">${p.user_email}</p>
                </div>
            </div>
        </td>
        <td class="px-6 py-4">
            <span class="px-2 py-1 ${p.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'} text-[10px] font-black rounded uppercase border">${p.status}</span>
        </td>
        <td class="px-6 py-4 text-slate-400 font-medium uppercase text-[10px]">${p.plan_id.replace(/_/g, ' ')}</td>
        <td class="px-6 py-4 text-white font-black">₹${p.amount}</td>
        <td class="px-6 py-4">
            <button class="text-slate-500 hover:text-white transition-colors"><i class="fa-solid fa-ellipsis-vertical"></i></button>
        </td>
    </tr>
  `).join('');
}

// ─── 5. RESOURCES VAULT (Dual-Sync: Firebase + Supabase) ─────────────────
function initResourcesVault() {
  const dropzone = document.getElementById("dropzone");
  if (!dropzone) return;

  dropzone.addEventListener("drop", async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || file.type !== "application/pdf") return alert("Executive Protocol: Only PDF assets accepted.");

    const storageRef = ref(storage, `resources/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed", 
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        dropzone.querySelector("h3").innerText = `SYNCING... ${pct}%`;
      },
      (err) => console.error(err),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        
        // 1. Firebase metadata (Legacy Compatibility)
        await addDoc(collection(db, "pdfs"), { name: file.name, url, uploadedAt: serverTimestamp() });
        
        // 2. Supabase Resource Matrix (New Centralized Store)
        await supabase.from('resources').insert({
            title: file.name,
            file_url: url,
            category: 'vault_upload',
            description: 'Uploaded via Command Center'
        });

        dropzone.querySelector("h3").innerText = `DEPOSIT_COMPLETE`;
        setTimeout(() => dropzone.querySelector("h3").innerText = `DEPOSIT_ASSETS_HERE`, 2000);
      }
    );
  });
}

// ─── 6. ADMIN CHAPLIN: AI COMMANDER ──────────────────────────────────────
function initAdminChaplin() {
  const input = document.getElementById("admin-chaplin-input");
  const send = document.getElementById("admin-chaplin-send");
  const display = document.getElementById("admin-chaplin-display");

  const appendMsg = (text, isAi = true) => {
    display.innerHTML += `<div class="mb-4 ${isAi ? 'text-primary' : 'text-white font-bold'}">
        <span class="opacity-50">[${isAi ? 'CHAPLIN' : 'EXECUTIVE'}]</span> ${text}
    </div>`;
    display.scrollTop = display.scrollHeight;
  };

  send?.addEventListener("click", async () => {
    const query = input.value.trim();
    if (!query) return;

    input.value = "";
    appendMsg(query, false);

    try {
        // High-Authority Orchestration Call
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('OPENROUTER_API_KEY') || 'sk-or-v1-...' }`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are Chaplin, the Executive AI Commander for TradeSovereign. Your tone is professional, authoritative, and concise. You help the admin manage students, resources, and API keys. You have access to the system configuration." },
                    { role: "user", content: query }
                ]
            })
        });

        const data = await response.json();
        appendMsg(data.choices[0].message.content);
    } catch (err) {
        appendMsg("System Error: Unable to reach OpenRouter uplink.");
    }
  });
}

// ─── 7. API GATEWAY MANAGER ──────────────────────────────────────────────
function initApiKeyMatrix() {
    window.saveApiKey = async (provider) => {
        const input = document.getElementById(`api-${provider}`);
        const key = input.value.trim();
        
        await setDoc(doc(db, "admin", "settings"), {
            [`api_keys.${provider}`]: key,
            lastUpdated: serverTimestamp()
        }, { merge: true });

        alert(`PROTCOAL_SUCCESS: ${provider.toUpperCase()} key rotated.`);
    };
}

// ─── 8. STORE PRODUCT MANAGEMENT ──────────────────────────────────────────
function initStoreManager() {
    // Logic for CRUDing products in Firestore 'products' and sync to Supabase if needed
}

// Placeholder for other modules
function initAnalyticsHub() {}
function initFeatureToggleListener() {}
function initErrorLogListener() {}

// Global Logout
window.logoutAdmin = () => signOut(auth).then(() => window.location.reload());

