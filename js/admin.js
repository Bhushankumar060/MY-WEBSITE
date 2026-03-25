/**
 * SOVEREIGN v9.2 - ADMIN COMMAND LOGIC
 * Manages tab switching, authentication guards, and session termination.
 */

const AdminController = {
    tabs: {
        dashboard: `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="card p-8 space-y-4 glass">
                    <p class="text-[10px] uppercase font-black tracking-widest text-slate-500">Total_Users</p>
                    <p class="text-4xl font-heading font-black">1.2k</p>
                    <div class="h-1 bg-primary/20 rounded-full"><div class="w-2/3 h-full bg-primary rounded-full shadow-[0_0_10px_#10b981]"></div></div>
                </div>
                <div class="card p-8 space-y-4 glass">
                    <p class="text-[10px] uppercase font-black tracking-widest text-slate-500">Revenue_Monthly</p>
                    <p class="text-4xl font-heading font-black">₹4.2L</p>
                    <p class="text-xs text-green font-bold">+12% from last week</p>
                </div>
            </div>
        `,
        api: `
            <div class="max-w-4xl space-y-8">
                <h3 class="text-2xl font-black uppercase tracking-tighter">Global API Matrix</h3>
                <div class="grid gap-6">
                    <div class="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                        <label class="text-[10px] font-black uppercase text-slate-500">OpenRouter_API_Key</label>
                        <div class="flex gap-4">
                            <input type="password" value="sk-or-v1-****************" class="flex-grow bg-dark border border-white/10 p-4 rounded-xl text-xs font-mono" readonly>
                            <button class="px-6 bg-primary text-dark font-black text-[10px] uppercase rounded-xl">Update</button>
                        </div>
                    </div>
                </div>
            </div>
        `
    },

    init() {
        firebase.auth().onAuthStateChanged(user => {
            if (!user && !window.location.pathname.includes('login.html')) {
                window.location.href = 'admin/login.html';
            } else if (user && !window.location.pathname.includes('login.html')) {
                this.showTab('dashboard');
            }
        });
    },

    showTab(tabId) {
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const btn = document.getElementById('btn-' + tabId);
        if (btn) btn.classList.add('active');
        
        const container = document.getElementById('tab-container');
        if (container) {
            container.innerHTML = this.tabs[tabId] || `<div class="p-10 text-center opacity-30 uppercase font-black text-xs tracking-widest">Section under reconstruction...</div>`;
            document.getElementById('tab-title').innerText = tabId.toUpperCase() + '_MODULE';
        }
    },

    logout() {
        firebase.auth().signOut().then(() => window.location.href = 'admin/login.html');
    }
};

document.addEventListener('DOMContentLoaded', () => AdminController.init());
