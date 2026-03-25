/**
 * TradeSovereign v5 – Firebase SDK Initializer
 * 
 * The Firebase client SDK config is SAFE to embed in frontend code.
 * Security is enforced via Firestore Security Rules (not by hiding this config).
 * All sensitive/financial API keys are hosted server-side via Netlify Functions.
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// ─── Firebase Project Config (safe to be public) ──────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyCsq7LTCf1FNwa_X17Wv6as5_mpgQiYF_U",
  authDomain:        "tradesovereign.firebaseapp.com",
  projectId:         "tradesovereign",
  storageBucket:     "tradesovereign.firebasestorage.app",
  messagingSenderId: "822633667371",
  appId:             "1:822633667371:web:ccdc63e90dffd42513c36e"
};

// ─── Initialize Firebase Services ─────────────────────────────────────────
const app     = initializeApp(firebaseConfig);
const auth    = getAuth(app);
const db      = getFirestore(app);
const storage = getStorage(app);

// ─── Global Error Logger → pushes to Firestore logs/errors ───────────────
window.onerror = function(message, source, lineno, colno, error) {
  addDoc(collection(db, "logs", "errors", "entries"), {
    message, source, lineno, colno,
    stack:     error?.stack || "N/A",
    userAgent: navigator.userAgent,
    timestamp: serverTimestamp()
  }).catch(() => {}); // Silent fail so it never breaks the page
};

// ─── Feature Toggle Listener: instantly reflect admin changes ────────────
let featureToggles = { lumi_tutor: true, chaplin_bot: true };

onSnapshot(doc(db, "admin", "settings"), (snap) => {
  if (snap.exists()) {
    featureToggles = snap.data().featureToggles || featureToggles;
    applyFeatureToggles(featureToggles);
  }
});

function applyFeatureToggles(toggles) {
  // Hide/show Lumi AI Tutor widget globally
  document.querySelectorAll('[data-feature="lumi-tutor"]').forEach(el => {
    el.style.display = toggles.lumi_tutor ? '' : 'none';
  });
  // Hide/show Chaplin Forecaster widget globally
  document.querySelectorAll('[data-feature="chaplin-bot"]').forEach(el => {
    el.style.display = toggles.chaplin_bot ? '' : 'none';
  });
}

// ─── Exports ──────────────────────────────────────────────────────────────
export { 
  app, auth, db, storage, featureToggles,
  onAuthStateChanged, signInWithEmailAndPassword, signOut, updateEmail, updatePassword,
  doc, setDoc, getDoc, collection, onSnapshot, addDoc, serverTimestamp,
  ref, uploadBytesResumable, getDownloadURL
};
