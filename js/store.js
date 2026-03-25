/* 
  SOVEREIGN v12.0 - DIGITAL STORE CONTROLLER
  Institutional Asset Distribution
*/

import nexus from './payment.js';

class StoreController {
    constructor() {
        this.products = [
            { id: 'sov-algo-v1', name: 'Sovereign Algo Runner', price: 4999, category: 'Trading' },
            { id: 'sov-macro-pro', name: 'Institutional Macro Suite', price: 12999, category: 'Education' },
            { id: 'sov-vault-pass', name: 'Elite Vault Access', price: 25000, category: 'Access' }
        ];
        this.init();
    }

    init() {
        this.renderCatalog();
    }

    renderCatalog() {
        const catalog = document.getElementById('store-catalog');
        if (!catalog) return;

        catalog.innerHTML = this.products.map(p => `
            <div class="glass-panel p-8 card-hover border-yellow-500/10 flex flex-col h-full">
                <div class="mb-4 text-xs font-bold text-gold uppercase tracking-widest">${p.category}</div>
                <h3 class="text-xl font-extrabold font-heading mb-4">${p.name}</h3>
                <div class="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                    <span class="text-2xl font-bold font-mono">₹${p.price.toLocaleString()}</span>
                    <button onclick="initiatePayment(${p.price}, '${p.name}')" class="btn-gold px-6 py-2 text-xs">ACQUIRE</button>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.storeNexus = new StoreController();
});
