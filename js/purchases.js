/* 
  SOVEREIGN v12.0 - VAULT CONTROLLER
  Institutional Asset Distribution
*/

class VaultController {
    constructor() {
        this.assets = [
            { id: 'sov-token-01', name: 'Mastery Certificate: Macro', type: 'Credential', date: '2026-03-20' },
            { id: 'sov-algo-runner', name: 'Sovereign Algo v1.2', type: 'Software', date: '2026-03-24' }
        ];
        this.init();
    }

    init() {
        this.renderVault();
    }

    renderVault() {
        const vault = document.getElementById('vault-matrix');
        if (!vault) return;

        vault.innerHTML = this.assets.map(a => `
            <div class="glass-panel p-6 border-yellow-500/10 flex items-center justify-between group">
                <div class="flex items-center space-x-6">
                    <div class="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-gold opacity-60 group-hover:opacity-100 transition-all">
                        <i class="fas fa-file-contract text-xl"></i>
                    </div>
                    <div>
                        <h4 class="font-bold">${a.name}</h4>
                        <p class="text-[10px] text-muted uppercase tracking-widest">${a.type} | Issued: ${a.date}</p>
                    </div>
                </div>
                <button class="text-gold hover:text-gold-bright transition-all">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.vaultNexus = new VaultController();
});
