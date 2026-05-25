import { quizzes } from './data.js'

// ─── State ───────────────────────────────────────────────────────────────────
let activeQuizState = null;
let timerInterval   = null;
let timeRemaining   = 0;
let quizStartTime   = null;

// ─── DOM refs ────────────────────────────────────────────────────────────────
const views = {
    landing:     document.getElementById('landing-view'),
    categories:  document.getElementById('categories-view'),
    intro:       document.getElementById('intro-view'),
    quiz:        document.getElementById('quiz-view'),
    results:     document.getElementById('results-view'),
    leaderboard: document.getElementById('leaderboard-view'),
    myQuizzes:   document.getElementById('my-quizzes-view'),
};

const navLinks = {
    landing:     document.getElementById('nav-browse'),
    categories:  document.getElementById('nav-categories'),
    leaderboard: document.getElementById('nav-leaderboard'),
    myQuizzes:   document.getElementById('nav-my-quizzes'),
};

// ─── History API ─────────────────────────────────────────────────────────────
function pushState(viewName, extra = {}) {
    history.pushState({ view: viewName, ...extra }, '', '#' + viewName);
}

window.addEventListener('popstate', (e) => {
    const state = e.state;
    if (!state) { renderLanding(false); return; }
    switch (state.view) {
        case 'landing':     renderLanding(false);    break;
        case 'categories':  renderCategories(false); break;
        case 'intro':       state.category ? renderQuizIntro(state.category, false) : renderCategories(false); break;
        case 'leaderboard': renderLeaderboard(false); break;
        case 'myQuizzes':   renderMyQuizzes(false);  break;
        case 'quiz':        activeQuizState ? renderQuestion(false)  : renderCategories(false); break;
        case 'results':     activeQuizState ? renderResults(false)   : renderCategories(false); break;
        default:            renderLanding(false);
    }
});

// ─── Init ────────────────────────────────────────────────────────────────────
function init() {

    // ── Dark mode ─────────────────────────────────────────────────────────────
    const themeBtn   = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
        themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    } else {
        themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            localStorage.setItem('theme', 'dark');
            themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
        } else {
            localStorage.setItem('theme', 'light');
            themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
        }
    });

    // ── Desktop nav ───────────────────────────────────────────────────────────
    if (navLinks.landing)     navLinks.landing.addEventListener('click',     e => { e.preventDefault(); renderLanding(); });
    if (navLinks.categories)  navLinks.categories.addEventListener('click',  e => { e.preventDefault(); renderCategories(); });
    if (navLinks.leaderboard) navLinks.leaderboard.addEventListener('click', e => { e.preventDefault(); renderLeaderboard(); });
    if (navLinks.myQuizzes)   navLinks.myQuizzes.addEventListener('click',   e => { e.preventDefault(); renderMyQuizzes(); });

    // ── Landing buttons ───────────────────────────────────────────────────────
    document.getElementById('btn-browse')?.addEventListener('click', renderCategories);
    document.getElementById('btn-get-started')?.addEventListener('click', renderCategories);
    document.getElementById('btn-back-categories')?.addEventListener('click', renderCategories);

    document.querySelector('.btn-outline')?.addEventListener('click', openHowItWorksModal);
    document.querySelectorAll('.step').forEach(s => {
        s.style.cursor = 'pointer';
        s.addEventListener('click', openHowItWorksModal);
    });

    document.querySelector('.explore-link')?.addEventListener('click', e => { e.preventDefault(); renderCategories(); });

    const trendingCategories = ['Web Design', 'UX Design', 'Motion Graphics'];
    document.querySelectorAll('.trending-card .btn-light').forEach((btn, i) => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', () => {
            renderCategories(true);
            setTimeout(() => renderQuizIntro(trendingCategories[i]), 50);
        });
    });

    // ── Modal ─────────────────────────────────────────────────────────────────
    const modal = document.getElementById('how-it-works-modal');
    if (modal) {
        document.getElementById('hiw-close-btn')?.addEventListener('click', closeHowItWorksModal);
        document.getElementById('hiw-dismiss-btn')?.addEventListener('click', closeHowItWorksModal);
        document.getElementById('hiw-start-btn')?.addEventListener('click', () => { closeHowItWorksModal(); renderCategories(); });
        modal.addEventListener('click', e => { if (e.target === modal) closeHowItWorksModal(); });
    }

    // ── Quiz actions ──────────────────────────────────────────────────────────
    document.getElementById('btn-start-quiz')?.addEventListener('click', () => startQuizFromIntro(true));
    document.getElementById('btn-next')?.addEventListener('click', handleNextQuestion);
    document.getElementById('btn-retry')?.addEventListener('click', startQuizFromResults);
    document.getElementById('btn-home')?.addEventListener('click', renderCategories);

    // Previous question
    document.querySelector('.quiz-footer .btn-light')?.addEventListener('click', () => {
        if (!activeQuizState || activeQuizState.currentQuestionIndex === 0) return;
        activeQuizState.currentQuestionIndex--;
        renderQuestion(false);
    });

    // ── Logo ──────────────────────────────────────────────────────────────────
    document.querySelector('.logo')?.addEventListener('click', () => renderLanding());

    // ── Hamburger / Mobile Drawer ─────────────────────────────────────────────
    const hamburgerBtn   = document.getElementById('hamburger-btn');
    const mobileDrawer   = document.getElementById('mobile-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');

    function openDrawer() {
        hamburgerBtn.classList.add('open');
        mobileDrawer.classList.add('open');
        drawerBackdrop.classList.add('open');
        mobileDrawer.setAttribute('aria-hidden', 'false');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
        hamburgerBtn.classList.remove('open');
        mobileDrawer.classList.remove('open');
        drawerBackdrop.classList.remove('open');
        mobileDrawer.setAttribute('aria-hidden', 'true');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburgerBtn?.addEventListener('click', () =>
        hamburgerBtn.classList.contains('open') ? closeDrawer() : openDrawer()
    );
    drawerBackdrop?.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeDrawer(); closeHowItWorksModal(); }
    });

    function updateMobActive(activeId) {
        document.querySelectorAll('.mob-nav-link').forEach(l => l.classList.remove('active'));
        document.getElementById(activeId)?.classList.add('active');
    }

    const mobNavActions = {
        'mob-nav-browse':      () => { renderLanding();     updateMobActive('mob-nav-browse'); },
        'mob-nav-categories':  () => { renderCategories();  updateMobActive('mob-nav-categories'); },
        'mob-nav-leaderboard': () => { renderLeaderboard(); updateMobActive('mob-nav-leaderboard'); },
        'mob-nav-my-quizzes':  () => { renderMyQuizzes();   updateMobActive('mob-nav-my-quizzes'); },
    };
    Object.entries(mobNavActions).forEach(([id, fn]) => {
        document.getElementById(id)?.addEventListener('click', e => { e.preventDefault(); fn(); closeDrawer(); });
    });

    document.getElementById('mob-get-started-btn')?.addEventListener('click', () => { renderCategories(); closeDrawer(); });

    // ── Boot ──────────────────────────────────────────────────────────────────
    history.replaceState({ view: 'landing' }, '', '#landing');
    renderLanding(false);
}

// ─── View Switcher ───────────────────────────────────────────────────────────
function switchView(viewName, navName) {
    Object.values(views).forEach(v => { if (v) v.classList.remove('active'); });
    if (views[viewName]) views[viewName].classList.add('active');
    Object.values(navLinks).forEach(l => { if (l) l.classList.remove('active'); });
    if (navName && navLinks[navName]) navLinks[navName].classList.add('active');
}

// ─── Render Functions ────────────────────────────────────────────────────────
function renderLanding(addHistory = true) {
    if (addHistory) pushState('landing');
    switchView('landing', 'landing');
}

function renderCategories(addHistory = true) {
    if (addHistory) pushState('categories');
    switchView('categories', 'categories');

    const grid = document.getElementById('categories-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.keys(quizzes).forEach(category => {
        const firstQ = quizzes[category][0];
        const card   = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `<img src="${firstQ.image}" alt="${category}"><h3>${category}</h3>`;
        card.addEventListener('click', () => renderQuizIntro(category));
        grid.appendChild(card);
    });
}

function renderQuizIntro(categoryStr, addHistory = true) {
    if (addHistory) pushState('intro', { category: categoryStr });
    switchView('intro', 'categories');

    const categoryData   = quizzes[categoryStr];
    const questionsCount = categoryData ? categoryData.length : 0;
    const firstQ         = categoryData ? categoryData[0] : null;

    document.getElementById('intro-title').textContent          = categoryStr;
    document.getElementById('intro-question-count').textContent = questionsCount;
    document.getElementById('intro-time-estimate').textContent  =
        Math.ceil(((firstQ && firstQ.timeLimit) ? firstQ.timeLimit : questionsCount * 30) / 60);

    const descP = document.querySelector('.intro-desc .desc-p');
    if (descP && firstQ?.description) descP.textContent = firstQ.description;

    const introImagePane = document.querySelector('.intro-image-pane');
    if (introImagePane && firstQ?.image) {
        introImagePane.style.backgroundImage    = `url('${firstQ.image}')`;
        introImagePane.style.backgroundSize     = 'cover';
        introImagePane.style.backgroundPosition = 'center';
    }

    const btnStart  = document.getElementById('btn-start-quiz');
    const resumeBtn = document.getElementById('btn-resume-quiz');
    const existing  = localStorage.getItem('quizProgress_' + categoryStr);

    if (existing) {
        const saved      = JSON.parse(existing);
        const inProgress = saved.currentQuestionIndex > 0 && saved.currentQuestionIndex < questionsCount;
        btnStart.textContent = inProgress ? 'Restart Quiz' : 'Start Quiz';
        if (inProgress && !resumeBtn) {
            const btnResume = document.createElement('button');
            btnResume.id        = 'btn-resume-quiz';
            btnResume.className = 'btn btn-primary-light btn-large';
            btnResume.style.marginLeft = '8px';
            btnResume.textContent = 'Resume Quiz';
            btnResume.addEventListener('click', () => startQuizFromIntro(false));
            btnStart.parentNode.insertBefore(btnResume, btnStart.nextSibling);
        } else if (!inProgress && resumeBtn) {
            resumeBtn.remove();
        }
    } else {
        btnStart.textContent = 'Start Quiz';
        if (resumeBtn) resumeBtn.remove();
    }
}

// ─── Quiz Engine ─────────────────────────────────────────────────────────────
function saveProgress(state) {
    localStorage.setItem('quizProgress_' + state.category, JSON.stringify(state));
}

function startQuizFromIntro(forceRestart) {
    const category = document.getElementById('intro-title').textContent;
    if (forceRestart) {
        activeQuizState = { category, currentQuestionIndex: 0, score: 0, answers: [], answersMap: {} };
    } else {
        const existing = localStorage.getItem('quizProgress_' + category);
        activeQuizState = existing
            ? JSON.parse(existing)
            : { category, currentQuestionIndex: 0, score: 0, answers: [], answersMap: {} };
    }
    saveProgress(activeQuizState);

    const firstQ = quizzes[category]?.[0];
    timeRemaining = (firstQ && firstQ.timeLimit) ? firstQ.timeLimit : quizzes[category].length * 30;
    quizStartTime = Date.now();
    startTimer();
    renderQuestion();
}

function startTimer() {
    const timerDisplay = document.querySelector('.quiz-t-right');
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeRemaining <= 0) { clearInterval(timerInterval); renderResults(); return; }
        timeRemaining--;
        const m = Math.floor(timeRemaining / 60);
        const s = timeRemaining % 60;
        if (timerDisplay) timerDisplay.textContent = `Time Remaining: ${m}:${s < 10 ? '0' : ''}${s}`;
    }, 1000);
}

function startQuizFromResults() {
    if (!activeQuizState) { renderCategories(); return; }
    activeQuizState.currentQuestionIndex = 0;
    activeQuizState.score    = 0;
    activeQuizState.answers  = [];
    activeQuizState.answersMap = {};
    saveProgress(activeQuizState);

    const firstQ = quizzes[activeQuizState.category]?.[0];
    timeRemaining = (firstQ && firstQ.timeLimit) ? firstQ.timeLimit : quizzes[activeQuizState.category].length * 30;
    quizStartTime = Date.now();
    startTimer();
    renderQuestion();
}

function renderQuestion(addHistory = true) {
    if (addHistory) pushState('quiz');
    switchView('quiz', 'categories');

    if (!activeQuizState || !quizzes[activeQuizState.category]) { renderCategories(); return; }

    const questions = quizzes[activeQuizState.category];
    const qData     = questions[activeQuizState.currentQuestionIndex];

    const qTopLeft = document.querySelector('.quiz-t-left');
    if (qTopLeft) qTopLeft.textContent = activeQuizState.category;

    document.getElementById('progress-text').textContent =
        `Question ${activeQuizState.currentQuestionIndex + 1} of ${questions.length}`;

    const barFill = document.getElementById('progress-bar-fill');
    if (barFill) barFill.style.width = `${(activeQuizState.currentQuestionIndex / questions.length) * 100}%`;

    document.getElementById('question-text').textContent = qData.question;

    const answersGrid = document.getElementById('answers-grid');
    answersGrid.innerHTML = '';
    delete answersGrid.dataset.selectedIndex;

    const btnNext = document.getElementById('btn-next');
    btnNext.disabled  = true;
    btnNext.innerHTML = activeQuizState.currentQuestionIndex >= questions.length - 1
        ? 'Finish Quiz &rarr;' : 'Next Question &rarr;';

    const btnPrev = document.querySelector('.quiz-footer .btn-light');
    if (btnPrev) btnPrev.disabled = activeQuizState.currentQuestionIndex === 0;

    qData.answers.forEach((answerStr, index) => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.textContent = answerStr;

        const prevAnswer = activeQuizState.answersMap?.[activeQuizState.currentQuestionIndex];
        if (prevAnswer === index) {
            card.classList.add('selected');
            answersGrid.dataset.selectedIndex = index;
            btnNext.disabled = false;
        }

        card.addEventListener('click', () => {
            Array.from(answersGrid.children).forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            answersGrid.dataset.selectedIndex = index;
            btnNext.disabled = false;
        });
        answersGrid.appendChild(card);
    });
}

function handleNextQuestion() {
    const answersGrid = document.getElementById('answers-grid');
    const selectedStr = answersGrid.dataset.selectedIndex;
    if (!selectedStr) return;

    const selectedIdx = parseInt(selectedStr, 10);
    const questions   = quizzes[activeQuizState.category];
    const currentIdx  = activeQuizState.currentQuestionIndex;

    if (!activeQuizState.answersMap) activeQuizState.answersMap = {};
    activeQuizState.answersMap[currentIdx] = selectedIdx;

    activeQuizState.answers = questions.map((_, i) =>
        activeQuizState.answersMap[i] !== undefined ? activeQuizState.answersMap[i] : -1
    );
    activeQuizState.score = questions.reduce((acc, q, i) =>
        activeQuizState.answersMap[i] === q.correct ? acc + 1 : acc, 0
    );

    activeQuizState.currentQuestionIndex++;
    saveProgress(activeQuizState);

    if (activeQuizState.currentQuestionIndex >= questions.length) {
        const barFill = document.getElementById('progress-bar-fill');
        if (barFill) barFill.style.width = '100%';
        setTimeout(renderResults, 400);
    } else {
        renderQuestion();
    }
}

function renderResults(addHistory = true) {
    clearInterval(timerInterval);
    if (addHistory) pushState('results');
    switchView('results', 'categories');

    if (!activeQuizState) { renderCategories(); return; }

    const questions = quizzes[activeQuizState.category];
    const total     = questions.length;

    // Use currentUser (set by auth.js) to save scores
    const user = localStorage.getItem('currentUser');
    if (user) {
        const key    = `quizScores_${user}`;
        const scores = JSON.parse(localStorage.getItem(key)) || [];
        const existing = scores.find(s => s.category === activeQuizState.category);
        if (!existing) {
            scores.push({ category: activeQuizState.category, score: activeQuizState.score, total, date: new Date().toISOString() });
        } else if (activeQuizState.score > existing.score) {
            Object.assign(existing, { score: activeQuizState.score, total, date: new Date().toISOString() });
        }
        localStorage.setItem(key, JSON.stringify(scores));
    }

    document.getElementById('final-score').textContent = `${activeQuizState.score} / ${total}`;

    if (quizStartTime) {
        const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        document.querySelectorAll('.stat-box').forEach(box => {
            if (box.querySelector('.stat-label')?.textContent === 'Time Spent')
                box.querySelector('.stat-val').textContent =
                    `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        });
    }

    const accuracyEl = document.querySelector('.accuracy-pill');
    if (accuracyEl) {
        const pct = Math.round((activeQuizState.score / total) * 100);
        accuracyEl.innerHTML = `<span class="icon"><i class="fa-solid fa-check" style="color:rgb(29,184,46);"></i></span> ${pct}% Accuracy`;
    }

    const feedbackEl = document.getElementById('feedback-message');
    const pct = activeQuizState.score / total;
    if      (pct === 1)  feedbackEl.textContent = 'Perfect score! Outstanding work.';
    else if (pct >= 0.7) feedbackEl.textContent = 'Great job! You have a solid understanding.';
    else if (pct >= 0.5) feedbackEl.textContent = 'Good effort! A little more practice and you will master this.';
    else                 feedbackEl.textContent  = 'Keep trying! Every mistake is a learning opportunity.';

    const summaryBox = document.querySelector('.results-summary-box');
    if (summaryBox && activeQuizState.answers) {
        let html = `<div class="summary-header"><span>Question Summary</span></div>`;
        questions.forEach((q, i) => {
            const selected  = activeQuizState.answers[i] ?? -1;
            const isCorrect = selected === q.correct;
            html += `
                <div class="summary-item">
                    <div class="item-num">${i + 1}</div>
                    <div class="item-text">
                        <strong>${q.question}</strong>
                        <span>Correct: ${q.answers[q.correct]}</span>
                    </div>
                    <div class="item-status ${isCorrect ? 'correct' : 'incorrect'}"
                         style="color:${isCorrect ? 'var(--color-success)' : '#ba1a1a'};font-size:20px;">
                        ${isCorrect ? '✔' : '✘'}
                    </div>
                </div>`;
        });
        summaryBox.innerHTML = html;
    }
}

function renderLeaderboard(addHistory = true) {
    if (addHistory) pushState('leaderboard');
    switchView('leaderboard', 'leaderboard');

    const container = document.getElementById('leaderboard-list');
    if (!container) return;

    const allScores = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith('quizScores_')) continue;
        const user = key.replace('quizScores_', '');
        JSON.parse(localStorage.getItem(key)).forEach(s =>
            allScores.push({ name: user, score: s.score, total: s.total, category: s.category })
        );
    }
    allScores.sort((a, b) => b.score - a.score);

    container.innerHTML = `<div class="leaderboard-wrapper">
        ${allScores.length === 0
            ? `<p style="text-align:center;padding:40px;color:var(--text-muted)">No scores yet. Take a quiz to appear here!</p>`
            : allScores.map((u, i) => `
                <div class="leaderboard-item">
                    <span>#${i + 1} — ${u.name} <span style="color:var(--text-muted);font-size:0.85rem;">(${u.category})</span></span>
                    <strong>${u.score}/${u.total} pts</strong>
                </div>`).join('')}
    </div>`;
}

function renderMyQuizzes(addHistory = true) {
    if (addHistory) pushState('myQuizzes');
    switchView('myQuizzes', 'myQuizzes');

    const container = document.getElementById('my-quizzes-list');
    if (!container) return;
    container.innerHTML = '';

    const savedQuizzes = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('quizProgress_')) {
            try { savedQuizzes.push(JSON.parse(localStorage.getItem(key))); } catch (e) {}
        }
    }

    if (savedQuizzes.length === 0) {
        container.innerHTML = `<p style="grid-column:span 3;text-align:center;padding:40px;color:var(--text-muted);">You haven't started any quizzes yet.</p>`;
        return;
    }

    savedQuizzes.forEach(quizState => {
        const categoryData = quizzes[quizState.category];
        const totalQ       = categoryData ? categoryData.length : 5;
        const firstQ       = categoryData ? categoryData[0] : null;
        const isCompleted  = quizState.currentQuestionIndex >= totalQ;
        const percent      = Math.min(100, Math.round((quizState.currentQuestionIndex / totalQ) * 100));

        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            ${firstQ?.image ? `<img src="${firstQ.image}" alt="${quizState.category}">` : ''}
            <div style="position:relative;z-index:2;width:100%;">
                <h3 style="font-size:1.5rem;margin-bottom:8px;">${quizState.category}</h3>
                <div style="background:rgba(255,255,255,0.2);display:inline-block;padding:4px 12px;border-radius:4px;font-size:0.875rem;">
                    ${isCompleted ? 'Completed ✓' : 'In Progress'}
                </div>
                ${isCompleted ? `<p style="font-size:0.875rem;margin-top:8px;font-weight:normal;opacity:0.9;">Score: ${quizState.score}/${totalQ}</p>` : ''}
                <div style="margin-top:16px;">
                    <div style="font-size:0.75rem;margin-bottom:4px;opacity:0.8;">Progress ${percent}%</div>
                    <div style="height:6px;border-radius:99px;background:rgba(0,0,0,0.2);">
                        <div style="width:${isCompleted ? 100 : percent}%;height:100%;background:white;border-radius:99px;"></div>
                    </div>
                </div>
            </div>`;

        card.addEventListener('click', () => {
            activeQuizState = quizState;
            isCompleted ? renderResults() : renderQuestion();
        });
        container.appendChild(card);
    });
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function openHowItWorksModal() {
    const modal = document.getElementById('how-it-works-modal');
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeHowItWorksModal() {
    const modal = document.getElementById('how-it-works-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// ─── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
