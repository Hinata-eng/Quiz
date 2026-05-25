// ============================================================
//  login.js — QuizMind
//  Handles: stars, form validation, password toggle, auth
// ============================================================

// ── Stars Generator ──────────────────────────────────────────
function generateStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;

    const count = 120;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const size  = Math.random() * 2.5 + 0.5;
        const x     = Math.random() * 100;
        const y     = Math.random() * 100;
        const dur   = (Math.random() * 4 + 2).toFixed(1);
        const del   = (Math.random() * 5).toFixed(1);
        const minOp = (Math.random() * 0.15 + 0.05).toFixed(2);
        const maxOp = (Math.random() * 0.5  + 0.4).toFixed(2);

        star.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}%;
            top: ${y}%;
            --dur: ${dur}s;
            --delay: ${del}s;
            --min-op: ${minOp};
            --max-op: ${maxOp};
        `;
        fragment.appendChild(star);
    }
    container.appendChild(fragment);
}

// ── Password Toggle ──────────────────────────────────────────
function initPasswordToggle() {
    const toggleBtn    = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const eyeIcon      = document.getElementById('eye-icon');

    if (!toggleBtn || !passwordInput || !eyeIcon) return;

    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        eyeIcon.className  = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
}

// ── Validation Helpers ───────────────────────────────────────
function showError(fieldId, message) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add('input-error');
}

function clearError(fieldId) {
    const errorEl = document.getElementById(`${fieldId}-error`);
    const inputEl = document.getElementById(fieldId);
    if (errorEl) errorEl.textContent = '';
    if (inputEl) inputEl.classList.remove('input-error');
}

function clearAllErrors() {
    ['firstName', 'lastName', 'email', 'password', 'terms'].forEach(clearError);
}

function validateForm(firstName, lastName, email, password, termsChecked) {
    let valid = true;
    clearAllErrors();

    if (!firstName.trim()) {
        showError('firstName', 'First name is required.');
        valid = false;
    }
    if (!lastName.trim()) {
        showError('lastName', 'Last name is required.');
        valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
        showError('email', 'Email address is required.');
        valid = false;
    } else if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address.');
        valid = false;
    }

    if (!password) {
        showError('password', 'Password is required.');
        valid = false;
    } else if (password.length < 6) {
        showError('password', 'Password must be at least 6 characters.');
        valid = false;
    }

    if (!termsChecked) {
        const termsError = document.getElementById('terms-error');
        if (termsError) termsError.textContent = 'You must agree to the terms to continue.';
        valid = false;
    }

    return valid;
}

// ── Real-time validation ─────────────────────────────────────
function initRealtimeValidation() {
    ['firstName', 'lastName', 'email', 'password'].forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error') && input.value.trim()) {
                clearError(id);
            }
        });
    });

    const termsCheckbox = document.getElementById('terms-checkbox');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', () => {
            if (termsCheckbox.checked) {
                const termsError = document.getElementById('terms-error');
                if (termsError) termsError.textContent = '';
            }
        });
    }
}

// ── Auth Logic ───────────────────────────────────────────────
function handleLogin(firstName, lastName, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = users.find(u => u.email === email && u.password === password);

    if (validUser) {
        // Save the email as the current logged-in user
        localStorage.setItem('currentUser', email);

        // Save the display name (first + last) entered at login time
        const displayName = (firstName.trim() + ' ' + lastName.trim()).trim();
        localStorage.setItem('userDisplayName', displayName);

        return { success: true };
    }

    const emailExists = users.some(u => u.email === email);
    if (emailExists) {
        return { success: false, message: 'Incorrect password. Please try again.' };
    }
    return { success: false, message: 'No account found with this email. Please sign up first.' };
}

// ── Form Submit ──────────────────────────────────────────────
function initForm() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName    = (document.getElementById('firstName')?.value  || '').trim();
        const lastName     = (document.getElementById('lastName')?.value   || '').trim();
        const email        = document.getElementById('email').value.trim();
        const password     = document.getElementById('password').value;
        const termsChecked = document.getElementById('terms-checkbox')?.checked || false;

        if (!validateForm(firstName, lastName, email, password, termsChecked)) return;

        const submitBtn = document.getElementById('login-submit');
        const btnText   = document.getElementById('login-btn-text');
        const spinner   = document.getElementById('login-spinner');

        submitBtn.disabled     = true;
        btnText.style.display  = 'none';
        spinner.style.display  = 'inline-block';

        await new Promise(r => setTimeout(r, 700));

        const result = handleLogin(firstName, lastName, email, password);

        if (result.success) {
            btnText.textContent           = '✓ Welcome back!';
            btnText.style.display         = 'inline';
            spinner.style.display         = 'none';
            submitBtn.style.background    = 'linear-gradient(135deg, #22c55e, #16a34a)';
            setTimeout(() => { window.location.href = 'index.html'; }, 600);
        } else {
            submitBtn.disabled    = false;
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
            showError('email', result.message);
        }
    });
}

// ── Social buttons ───────────────────────────────────────────
function initSocialButtons() {
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('title') || 'Social';
            alert(`${title} login coming soon!`);
        });
    });
}

// ── Check if already logged in ───────────────────────────────
function checkAlreadyLoggedIn() {
    if (localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
    }
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    checkAlreadyLoggedIn();
    generateStars();
    initPasswordToggle();
    initRealtimeValidation();
    initForm();
    initSocialButtons();
});
