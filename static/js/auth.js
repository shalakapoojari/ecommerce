// Authentication module
const AuthModule = {
    checkAuth() {
        fetch('/api/auth/user')
            .then(res => res.json())
            .then(data => {
                const userNameEl = document.getElementById('user-name');
                const loginLink = document.getElementById('login-link');
                const logoutBtn = document.getElementById('logout-btn');

                if (data.user) {
                    userNameEl.textContent = data.user;
                    userNameEl.style.display = 'inline';
                    loginLink.style.display = 'none';
                    logoutBtn.style.display = 'inline';
                } else {
                    userNameEl.style.display = 'none';
                    loginLink.style.display = 'inline';
                    logoutBtn.style.display = 'none';
                }
            });
    },

    login(email, password) {
        return fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(res => res.json());
    },

    signup(email, password) {
        return fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(res => res.json());
    },

    logout() {
        return fetch('/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json()).then(data => {
            this.checkAuth();
            return data;
        });
    }
};

// Check auth on page load
document.addEventListener('DOMContentLoaded', () => {
    AuthModule.checkAuth();

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            AuthModule.logout().then(() => {
                window.location.href = '/';
            });
        });
    }
});
