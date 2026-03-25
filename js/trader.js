/**
 * SOVEREIGN v9.2 - TRADER TERMINAL LOGIC
 * Handles the Pulse chart, watchlist, and Chaplin AI signals.
 */

const TraderController = {
    canvas: null,
    ctx: null,
    points: [],

    init() {
        this.canvas = document.getElementById('sentinel-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.points = Array(100).fill(0).map(() => this.canvas.height / 2);
        
        window.addEventListener('resize', () => this.resize());
        this.draw();
        this.initWatchlist();
    },

    resize() {
        if (!this.canvas) return;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    },

    draw() {
        if (!this.ctx) return;
        requestAnimationFrame(() => this.draw());
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        this.ctx.clearRect(0, 0, w, h);
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 3;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#f59e0b';
        
        const step = w / (this.points.length - 1);
        this.ctx.moveTo(0, this.points[0]);
        for (let i = 1; i < this.points.length; i++) {
            this.ctx.lineTo(i * step, this.points[i]);
        }
        this.ctx.stroke();

        this.points.shift();
        this.points.push(this.points[this.points.length - 1] + (Math.random() - 0.5) * 30);
        
        if (Math.random() > 0.95) {
            const price = document.getElementById('hero-price');
            if (price) price.innerText = '₹' + (22450 + (Math.random() - 0.5) * 50).toFixed(2);
        }
    },

    initWatchlist() {
        const sectors = ["FINANCE", "METAL", "TECH", "ENERGY"];
        const list = document.getElementById('watchlist');
        if (list) {
            sectors.forEach(s => {
                list.innerHTML += `
                    <div class="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center glass">
                        <span class="text-[10px] font-black uppercase text-white">${s}_CLUSTER</span>
                        <span class="text-[10px] font-black text-green uppercase">+1.2%</span>
                    </div>
                `;
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => TraderController.init());
