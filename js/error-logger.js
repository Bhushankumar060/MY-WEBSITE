/* 
  SOVEREIGN v12.0 - GLOBAL ERROR TRIAGE
  Institutional Error Monitoring
*/

import { db } from './firebase-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

class SovereignLogger {
    constructor() {
        this.init();
    }

    init() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            this.reportError({
                message: msg,
                url: url,
                line: lineNo,
                column: columnNo,
                stack: error ? error.stack : 'N/A',
                type: 'RUNTIME_ERROR'
            });
            return false;
        };

        window.onunhandledrejection = (event) => {
            this.reportError({
                message: event.reason,
                type: 'PROMISE_REJECTION'
            });
        };
    }

    async reportError(details) {
        console.error("[SOVEREIGN ERROR]:", details);
        try {
            await addDoc(collection(db, "logs", "errors", "entries"), {
                ...details,
                timestamp: serverTimestamp(),
                userAgent: navigator.userAgent,
                location: window.location.href
            });
        } catch (e) {
            console.warn("Failed to log error to Firestore:", e);
        }
    }

    logEvent(name, data) {
        console.log(`[SOVEREIGN EVENT]: ${name}`, data);
    }
}

const logger = new SovereignLogger();
export default logger;
