/**
 * SOVEREIGN v9.2 - GLOBAL ERROR MONITORING
 * Automatically logs all runtime errors to Firestore for high-authority analysis.
 */

const ErrorLogger = {
    init() {
        window.onerror = (msg, url, line, col, error) => {
            if (typeof db === 'undefined') return false;
            
            db.collection('admin').doc('monitoring').collection('logs').add({
                timestamp: new Date().toISOString(),
                message: msg,
                origin: url,
                line: line,
                trace: error ? error.stack : 'N/A',
                user: (typeof auth !== 'undefined' && auth.currentUser) ? auth.currentUser.email : 'GUEST',
                platform: navigator.userAgent
            }).catch(e => console.error("LOGGER_FAIL:", e));
            
            return false; // Let browser process normally
        };
        console.log("ERROR_LOGGER: Global Monitoring Active.");
    }
};

document.addEventListener('DOMContentLoaded', () => ErrorLogger.init());
