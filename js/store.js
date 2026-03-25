/**
 * SOVEREIGN v9.2 - STORE LOGISTICS
 * Manages product rendering and category filtering.
 */

const StoreController = {
    init() {
        console.log("STORE_CONTROLLER: Initializing Logistics.");
        this.renderProducts();
    },

    renderProducts() {
        // Dynamic product rendering logic
        const container = document.getElementById('product-grid');
        if (!container) return;
        
        // Mock products for v9.2 restoration
        const products = [
            { id: 'STRAT_SENTINEL', name: 'Sentinel Alpha Pack', price: 4999, category: 'Trading' },
            { id: 'COURSE_QUANTUM', name: 'Quantum Orderflow', price: 9999, category: 'Course' }
        ];

        products.forEach(p => {
            const card = `
                <div class="vault-card p-10 space-y-6 glass card-hover group">
                    <h3 class="text-2xl font-black uppercase tracking-tighter">${p.name}</h3>
                    <p class="text-slate-400 text-sm">₹${p.price}</p>
                    <button onclick="PaymentNexus.checkout({id: '${p.id}', name: '${p.name}', price: ${p.price}})" class="w-full py-4 bg-primary text-dark font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400">Purchase_Asset</button>
                </div>
            `;
            container.innerHTML += card;
        });
    }
};

document.addEventListener('DOMContentLoaded', () => StoreController.init());
