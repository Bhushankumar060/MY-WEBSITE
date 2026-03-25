/* 
  SOVEREIGN v12.0 - STUDENT DOMAIN CONTROLLER
  Institutional Curriculum Matrix
*/

class StudentController {
    constructor() {
        this.subjects = [
            { id: 'macro', name: 'Advanced Macroeconomics', progress: 78, status: 'Active', icon: 'fa-globe-americas' },
            { id: 'quant', name: 'Quantitative Analysis', progress: 45, status: 'In-Progress', icon: 'fa-calculator' },
            { id: 'strat', name: 'Strategic Leadership', progress: 92, status: 'Mastery', icon: 'fa-chess-king' },
            { id: 'fin', name: 'Corporate Finance v2', progress: 12, status: 'Initialized', icon: 'fa-chart-pie' }
        ];
        this.init();
    }

    init() {
        this.renderMatrix();
    }

    renderMatrix() {
        const matrix = document.getElementById('subject-matrix');
        if (!matrix) return;

        matrix.innerHTML = this.subjects.map(s => `
            <div class="glass-panel p-6 card-hover border-yellow-500/10 flex items-center space-x-6">
                <div class="w-16 h-16 bg-yellow-500/5 rounded-xl flex items-center justify-center text-3xl text-gold">
                    <i class="fas ${s.icon}"></i>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-center mb-2">
                        <h4 class="font-bold">${s.name}</h4>
                        <span class="text-[10px] font-bold uppercase tracking-tighter text-gold opacity-60">${s.status}</span>
                    </div>
                    <div class="w-full bg-black/40 h-1.5 rounded-full">
                        <div class="bg-brand-gold h-full rounded-full transition-all duration-1000" style="width: ${s.progress}%"></div>
                    </div>
                </div>
                <button class="p-4 hover:text-gold-bright transition-all"><i class="fas fa-play-circle text-2xl"></i></button>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.studentNexus = new StudentController();
});
