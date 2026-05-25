// Run the authentication check immediately when the script loads to catch route trespassers
checkAuth();

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const logoutBtnDesktop = document.getElementById('logout-btn-desktop');
    const logoutBtnMobile = document.getElementById('logout-btn-mobile');

    if (loginForm) loginForm.addEventListener('submit', login);
    if (signupForm) signupForm.addEventListener('submit', signup);

    // Wire up both logout buttons
    if (logoutBtnDesktop) logoutBtnDesktop.addEventListener('click', logout);
    if (logoutBtnMobile) logoutBtnMobile.addEventListener('click', logout);

    // Dynamic UI modifications based on current session status
    updateUI();
});

function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    const path = window.location.pathname;

    const isLoginPage = path.endsWith('login.html');
    const isSignupPage = path.endsWith('signup.html');
    const isIndexPage = path.endsWith('index.html') || path.endsWith('/');

    if (currentUser && (isLoginPage || isSignupPage)) {
        window.location.href = 'index.html';
    } else if (!currentUser && isIndexPage) {
        window.location.href = 'login.html';
    }
}

function signup(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('error-msg');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        errorMsg.textContent = "An account with this email already exists.";
        return;
    }

    users.push({ email, password });
    localStorage.setItem('users', JSON.stringify(users));

    alert("Account created successfully! Please log in.");
    window.location.href = 'login.html';
}

function login(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('error-msg');

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find(user => user.email === email && user.password === password);

    if (validUser) {
        localStorage.setItem('currentUser', email);
        window.location.href = 'index.html';
    } else {
        errorMsg.textContent = "Invalid email or password.";
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function updateUI() {
    const currentUser = localStorage.getItem('currentUser');

    // Desktop UI Selectors
    const navSignIn = document.getElementById('nav-sign-in');
    const btnGetStarted = document.getElementById('btn-get-started');
    const userDisplayDesktop = document.getElementById('user-display-desktop');
    const logoutBtnDesktop = document.getElementById('logout-btn-desktop');

    // Mobile UI Selectors
    const guestUiMobile = document.getElementById('guest-ui-mobile');
    const authUiMobile = document.getElementById('auth-ui-mobile');
    const userDisplayMobile = document.getElementById('user-display-mobile');

    if (currentUser) {
        // --- 1. Update Desktop Header ---
        if (navSignIn) navSignIn.style.display = 'none';
        if (btnGetStarted) btnGetStarted.style.display = 'none';
        if (userDisplayDesktop) {
            const displayName = localStorage.getItem('userDisplayName') || currentUser.split('@')[0];
            userDisplayDesktop.textContent = `Hi, ${displayName}`; // Greets with everything before '@'
            userDisplayDesktop.style.display = 'inline-block';
        }
        if (logoutBtnDesktop) logoutBtnDesktop.style.display = 'inline-block';

        // --- 2. Update Mobile Drawer ---
        if (guestUiMobile) guestUiMobile.style.display = 'none';
        if (authUiMobile) authUiMobile.style.display = 'block';
        if (userDisplayMobile) {
            const displayName = localStorage.getItem('userDisplayName') || currentUser.split('@')[0];
            userDisplayMobile.textContent = `Hi, ${displayName}`;
        }
    }
}