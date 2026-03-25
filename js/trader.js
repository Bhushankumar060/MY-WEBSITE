/* 
  SOVEREIGN v12.0 - TRADER TERMINAL CONTROLLER
  High-Frequency Market Telemetry
*/

class TraderController {
    constructor() {
        this.watchlist = [
            { symbol: 'NIFTY 50', price: 22450.25, change: '+1.20%', vol: '1.2M', trend: 'up' },
            { symbol: 'BANKNIFTY', price: 48200.50, change: '-0.45%', vol: '840K', trend: 'down' },
            { symbol: 'SOV-TREASURY', price: 104.20, change: '+0.15%', vol: '2.5M', trend: 'up' },
            { symbol: 'RELIANCE', price: 2980.00, change: '+2.10%', vol: '4.1M', trend: 'up' }
        ];
        this.init();
    }

    init() {
        this.startPulse();
        this.renderWatchlist();
    }

    startPulse() {
        const ticker = document.getElementById('pulse-ticker');
        if (!ticker) return;

        setInterval(() => {
            const data = this.watchlist.map(item => {
                const noise = (Math.random() - 0.5) * 2;
                const newPrice = (item.price + noise).toFixed(2);
                return `<span class="flex items-center space-x-2">
                    <span class="text-white">${item.symbol}</span>
                    <span class="${noise > 0 ? 'text-green-500' : 'text-red-500'}">${newPrice}</span>
                </span>`;
            }).join('<span class="text-muted mx-4 opacity-30">|</span>');
            
            ticker.innerHTML = data;
        }, 800);
    }

    renderWatchlist() {
        const body = document.getElementById('watchlist-body');
        if (!body) return;

        body.innerHTML = this.watchlist.map(item => `
            <tr class="border-b border-white/5 hover:bg-yellow-500/5 transition-colors group">
                <td class="p-4 font-bold text-white">${item.symbol}</td>
                <td class="p-4 font-mono">${item.price.toFixed(2)}</td>
                <td class="p-4 ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}">${item.change}</td>
                <td class="p-4 text-muted">${item.vol}</td>
                <td class="p-4 text-right">
                    <button class="text-gold text-[10px] font-bold uppercase tracking-widest px-4 py-2 border border-gold/30 rounded hover:bg-gold hover:text-black transition-all">
                        DEPLOY
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.traderNexus = new TraderController();
});
