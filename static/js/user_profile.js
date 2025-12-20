import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const usernameEl = document.getElementById('navbar-username');
const logoutBtn = document.getElementById('nav-logout-btn');

if (!usernameEl) {
    console.error('Username element not found');
} else if (!window.firebaseConfig || !window.firebaseConfig.apiKey) {
    console.warn('Firebase config not available');
    usernameEl.textContent = 'Guest';
    if (logoutBtn) logoutBtn.style.display = 'none';
} else {
    try {
        const app = initializeApp(window.firebaseConfig);
        const auth = getAuth(app);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                const displayName = user.displayName || user.email?.split('@')[0] || 'User';
                usernameEl.textContent = displayName;
                if (logoutBtn) logoutBtn.style.display = 'block';
                console.log('User logged in:', displayName);
            } else {
                usernameEl.textContent = 'Guest';
                if (logoutBtn) logoutBtn.style.display = 'none';
                console.log('No user logged in');
            }
        });

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                signOut(auth).then(() => {
                    window.location.href = '/auth';
                }).catch((error) => {
                    console.error('Logout error:', error);
                });
            });
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
        usernameEl.textContent = 'Guest';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}
