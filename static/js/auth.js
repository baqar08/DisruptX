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
const btnLogout = document.getElementById("btn-logout");
const userInfo = document.getElementById("user-info");
const userEmail = document.getElementById("user-email");
const authError = document.getElementById("auth-error");

if (btnLogin) {
    btnLogin.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("User:", result.user);
                window.location.href = "/dashboard";
            })
            .catch((error) => {
                console.error("Error:", error);
                authError.textContent = error.message;
                authError.style.display = "block";
            });
    });
}

if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.reload();
        }).catch((error) => {
            console.error(error);
        });
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (btnLogin) btnLogin.style.display = "none";
        if (userInfo) {
            userInfo.style.display = "block";
            userEmail.textContent = user.email;
        }
    } else {
        if (btnLogin) btnLogin.style.display = "flex";
        if (userInfo) userInfo.style.display = "none";
    }
});

