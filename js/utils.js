/**
 * SOVEREIGN v9.2 - UTILITY MATRIX
 * Shared helper functions for the entire Sovereign ecosystem.
 */

const Utils = {
    formatCurrency(amount, currency = 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    generateId(prefix = 'SOV') {
        return `${prefix}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    },

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
    }
};
