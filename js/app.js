// app.js - TradeSovereign LMS Core Logic
const API_URL = 'http://localhost:3000/api';

const App = {
    token: localStorage.getItem('ts_token'),
    user: JSON.parse(localStorage.getItem('ts_user')),

    init() {
        this.updateUI();
        this.bindAuthEvents();
    },

    setSession(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('ts_token', token);
        localStorage.setItem('ts_user', JSON.stringify(user));
        this.updateUI();
    },

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('ts_token');
        localStorage.removeItem('ts_user');
        this.updateUI();
        window.location.href = '/';
    },

    updateUI() {
        const guestElements = document.querySelectorAll('.guest-only');
        const authElements = document.querySelectorAll('.auth-only');
        const userNameDisplays = document.querySelectorAll('.user-name-display');

        if (this.token) {
            guestElements.forEach(el => el.style.display = 'none');
            authElements.forEach(el => el.style.display = 'block'); // or flex
            userNameDisplays.forEach(el => el.textContent = this.user?.email || 'Student');
        } else {
            guestElements.forEach(el => el.style.display = 'block');
            authElements.forEach(el => el.style.display = 'none');
        }
    },

    async register(email, password) {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        this.setSession(data.token, { _id: data._id, email: data.email });
        return data;
    },

    async login(email, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        this.setSession(data.token, { _id: data._id, email: data.email });
        return data;
    },

    async getCourses() {
        const res = await fetch(`${API_URL}/courses`);
        return await res.json();
    },

    async getCourseDetails(id) {
        const res = await fetch(`${API_URL}/courses/${id}`);
        return await res.json();
    },

    async saveProgress(courseId, lessonId) {
        if (!this.token) return;
        const res = await fetch(`${API_URL}/progress/${courseId}/${lessonId}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${this.token}` }
        });
        return await res.json();
    },

    bindAuthEvents() {
        // Find generic login forms to attach handlers to
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    await this.login(document.getElementById('email').value, document.getElementById('password').value);
                    alert("Logged in successfully!");
                    window.location.reload();
                } catch (err) {
                    alert(err.message);
                }
            });
        }
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    await this.register(document.getElementById('reg_email').value, document.getElementById('reg_password').value);
                    alert("Registered successfully!");
                    window.location.reload();
                } catch (err) {
                    alert(err.message);
                }
            });
        }

        const logoutBtns = document.querySelectorAll('.logout-btn');
        logoutBtns.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        }));
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
