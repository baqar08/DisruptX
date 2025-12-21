import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

if (!window.firebaseConfig || !window.firebaseConfig.apiKey) {
    console.error("Firebase Config is missing! Check your .env file and server restart.");
    alert("Configuration Error: Firebase API Key is missing. Please check the .env file.");
}

const app = initializeApp(window.firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const btnLogin = document.getElementById("btn-google-login");
const btnGuestLogin = document.getElementById("btn-guest-login");
const btnLogout = document.getElementById("btn-logout");
const userInfo = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");
const authError = document.getElementById("auth-error");

if (btnLogin) {
    btnLogin.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("User:", result.user);
                return result.user.getIdToken();
            })
            .then((idToken) => {
                return fetch('/api/firebase-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idToken: idToken })
                });
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.removeItem('guestMode');
                    localStorage.removeItem('guestId');
                    window.location.href = "/dashboard";
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                authError.textContent = error.message || "Login failed";
                authError.style.display = "block";
            });
    });
}

if (btnGuestLogin) {
    btnGuestLogin.addEventListener("click", () => {
        const guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        fetch('/api/guest-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ guestId: guestId })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('guestMode', 'true');
                    localStorage.setItem('guestId', guestId);
                    console.log("Guest login:", guestId);
                    window.location.href = "/dashboard";
                } else {
                    throw new Error(data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                authError.textContent = "Guest login failed";
                authError.style.display = "block";
            });
    });
}

if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                localStorage.removeItem('guestMode');
                localStorage.removeItem('guestId');

                const isGuest = localStorage.getItem('guestMode') === 'true';
                if (!isGuest) {
                    return signOut(auth);
                }
            })
            .then(() => {
                window.location.href = "/auth";
            })
            .catch((error) => {
                console.error("Logout error:", error);
                window.location.href = "/auth";
            });
    });
}

onAuthStateChanged(auth, (user) => {
    const isGuest = localStorage.getItem('guestMode') === 'true';

    if (user) {
        if (btnLogin) btnLogin.style.display = "none";
        if (btnGuestLogin) btnGuestLogin.style.display = "none";
        if (userInfo) {
            userInfo.style.display = "block";
            userEmail.textContent = user.email;
        }
    } else if (isGuest) {
        if (btnLogin) btnLogin.style.display = "none";
        if (btnGuestLogin) btnGuestLogin.style.display = "none";
        if (userInfo) {
            userInfo.style.display = "block";
            userEmail.textContent = "Guest User";
        }
    } else {
        if (btnLogin) btnLogin.style.display = "flex";
        if (btnGuestLogin) btnGuestLogin.style.display = "flex";
        if (userInfo) userInfo.style.display = "none";
    }
});


