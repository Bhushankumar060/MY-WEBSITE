/**
 * TradeSovereign v8.0 – Global Utilities
 * 
 * Handles:
 *  - Unified Dark/Light Mode (system-aware + persistent)
 *  - Premium Toast Notifications (RBAC feedback, API alerts)
 *  - Mobile Navigation Toggles
 *  - Global SEO & Versioning Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeControl();
    initMobileNav();
    updateGlobalVersioning();
});

// ─── 1. Unified Theme Control ──────────────────────────────────────────────
export function initThemeControl() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon   = document.getElementById('theme-icon');

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.documentElement.classList.remove('dark');
            if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
            showToast(`Mode: ${newTheme.toUpperCase()}`, 'info');
        });
    }

    // Init: LocalStorage > System Preference
    const saved = localStorage.getItem('theme');
    if (saved) applyTheme(saved);
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) applyTheme('dark');
}

// ─── 2. Premium Toast Notifications ────────────────────────────────────────
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    
    const colors = {
        success: 'bg-green-500',
        error:   'bg-primary',
        info:    'bg-secondary text-black',
        warning: 'bg-[#FFE900] text-black'
    };

    toast.className = `${colors[type] || colors.info} neo-border p-4 shadow-neo flex items-center gap-3 font-bold uppercase text-xs tracking-widest animate-bounce-in min-w-[250px] mb-3`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'error' ? 'fa-triangle-exclamation' : 'fa-circle-info'} text-lg"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

function createToastContainer() {
    const c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'fixed bottom-8 right-8 z-[9999] flex flex-col items-end';
    document.body.appendChild(c);
    return c;
}

// ─── 3. Mobile Navigation ──────────────────────────────────────────────────
export function initMobileNav() {
    const burger = document.querySelector('.mobile-burger');
    const menu   = document.querySelector('.mobile-menu');
    if (burger && menu) {
        burger.addEventListener('click', () => {
            menu.classList.toggle('hidden');
            burger.classList.toggle('bg-primary');
        });
    }
}

// ─── 4. Sync All versions locally ──────────────────────────────────────────
function updateGlobalVersioning() {
    const v = "v8.0";
    // Update logo spans
    document.querySelectorAll('.version-span').forEach(el => el.innerText = v);
    // Safety check for title
    if (!document.title.includes(v)) {
        document.title = document.title.replace(/v[0-9](\.[0-9])?/g, v);
    }
}

// Global hook for easy access
window.tsToast = showToast;