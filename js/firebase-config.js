/**
 * SOVEREIGN v9.1 - CORE FIREBASE MESH
 * Handles Auth, Firestore settings, and Global Cloud-Error Logging.
 */

const firebaseConfig = {
    apiKey: "AIzaSyCsq7LTCf1FNwa_X17Wv6as5_mpgQiYF_U",
    authDomain: "tradesovereign.firebaseapp.com",
    projectId: "tradesovereign",
    storageBucket: "tradesovereign.firebasestorage.app",
    messagingSenderId: "822633667371",
    appId: "1:822633667371:web:ccdc63e90dffd42513c36e"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

/**
 * GLOBAL_ERROR_LOGGING_SYSTEM
 * Log all production errors to Firestore for high-authority monitoring.
 */
document.addEventListener('DOMContentLoaded', () => {
    window.onerror = function(msg, url, line, col, error) {
        if (!db) return;
        db.collection('admin').doc('monitoring').collection('logs').add({
            timestamp: new Date().toISOString(),
            message: msg,
            origin: url,
            trace: error ? error.stack : 'N/A',
            user: auth.currentUser ? auth.currentUser.email : 'GUEST'
        });
        return false;
    };
    console.log("SOVEREIGN_MESH: Security & Monitoring Active.");
});
