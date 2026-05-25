# QuizMind

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white)
![Responsive](https://img.shields.io/badge/Responsive-Design-4F46E5?style=for-the-badge)
![No Framework](https://img.shields.io/badge/No_Framework-Vanilla_JS-green?style=for-the-badge)

> A modern, fully responsive, frontend-only interactive quiz platform built with vanilla HTML, CSS, and JavaScript. QuizMind delivers a polished, production-grade learning experience — from curated quiz categories and real-time scoring to a global leaderboard and personal progress tracking.

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Authentication System](#authentication-system)
- [Quiz System](#quiz-system)
- [LocalStorage Architecture](#localstorage-architecture)
- [Responsive Design](#responsive-design)
- [Mobile Navigation](#mobile-navigation)
- [UI/UX Design Highlights](#uiux-design-highlights)
- [Installation and Usage](#installation-and-usage)
- [Future Improvements](#future-improvements)

---

## Introduction

QuizMind is a feature-rich, single-page quiz platform designed to showcase modern frontend development practices without relying on any CSS framework or JavaScript library. Every interaction — from animated page transitions to real-time score tracking — is engineered from scratch using clean, organized vanilla code.

The platform is structured around a multi-view SPA (Single Page Application) architecture where all views are rendered and managed entirely in the browser. Users can browse categorized quizzes, take timed challenges, track their performance in a personal dashboard, and compete on a global leaderboard — all without a single page reload.

This project was built as a frontend portfolio piece to demonstrate mastery of JavaScript DOM manipulation, CSS architecture, responsive design, client-side state management, and thoughtful UX engineering.

---

## Features

**Core Platform**

- Multi-view single-page application with animated view transitions
- Browser History API integration — the back button navigates correctly between views
- Dark mode with system preference detection and persistent user preference via localStorage
- Fully responsive layout that adapts seamlessly from desktop to mobile

**Quiz Experience**

- Dynamic quiz rendering driven entirely by a structured JavaScript data file
- Per-category timed quizzes with a live countdown timer
- Previous and Next question navigation with answer persistence — revisiting a question restores the previously selected answer
- Correct answer scoring computed from an index-map structure, ensuring no double-counting regardless of navigation direction
- Animated progress bar tracking completion across questions
- Detailed results screen with per-question breakdown, accuracy percentage, and real time-spent calculation

**User System**

- Username-based authentication with sign-in, session persistence, and sign-out
- Protected views that require authentication before access
- Auth guard system redirecting unauthenticated users to the login flow

**Progress and Leaderboard**

- Per-category quiz progress saved automatically to localStorage
- Resume interrupted quizzes from exactly where you left off
- Completed quiz review — click any finished quiz to re-read your results
- Global leaderboard aggregated from all stored user scores
- Personal "My Quizzes" dashboard showing progress, completion status, and scores

**Landing Page**

- Hero section with call-to-action buttons
- Trending categories section with direct links to quiz intros
- Three-step visual guide with smooth scroll behavior triggered by the "See How It Works" button
- Animated CTA section

---

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Semantic document structure and SPA view scaffolding |
| CSS3 | Custom design system, animations, dark mode, responsive layout |
| Vanilla JavaScript (ES6+) | SPA routing, DOM rendering, state management, quiz logic |
| CSS Custom Properties | Centralized theming and dark mode switching |
| CSS Grid and Flexbox | All layout systems — no external grid framework used |
| Font Awesome 7 | Icon library for UI elements throughout the platform |
| Google Fonts (Inter, Manrope) | Typography — clean, modern sans-serif font pairing |
| Browser History API | SPA navigation with back/forward button support |
| localStorage API | Authentication, quiz progress, scores, and theme persistence |

No CSS frameworks (Bootstrap, Tailwind), no JavaScript libraries (React, Vue, jQuery), and no build tools are required. The entire project runs directly in the browser from static files.

---

## Project Structure

```
quizmind/
│
├── index.html              # Single HTML file containing all view templates
├── style.css               # Complete custom CSS design system
├── app.js                  # Main application logic — routing, rendering, state
├── data.js                 # Quiz data source — categories, questions, answers
│
└── images/
    ├── landingpage1.jpg    # Hero section background image
    ├── logicIQ.jpg         # Logic and IQ category cover
    ├── webdesign.jpg       # Web Design category cover
    ├── ux.jpg              # UX Design category cover
    └── motiondesign.jpg    # Motion Graphics category cover
```

The architecture follows a clear separation of concerns: structure in HTML, presentation in CSS, behavior in JavaScript, and content in data.js. All views are defined in `index.html` and toggled by JavaScript — only one view is visible at a time using a CSS `.active` class managed by the `switchView()` function.

---

## Authentication System

QuizMind implements a lightweight, frontend-only authentication system designed to simulate the behavior of a real auth flow without a backend.

**How it works:**

When a user clicks "Sign In", they are prompted to enter a username. This username is immediately persisted to localStorage under the key `quizUser`. On every subsequent page load, the application checks for this key during initialization and restores the authenticated session automatically — the user remains signed in across browser sessions.

```javascript
// Session check on init
const savedUser = localStorage.getItem('quizUser');
if (savedUser) updateAuthUI(savedUser);
```

The auth state drives several behaviors across the platform:

- The navigation header updates to display "Hi, [username]" when authenticated
- Quiz scores are saved under a user-specific key (`quizScores_username`), meaning scores are tied to individual accounts
- The leaderboard aggregates scores across all stored user sessions, so multiple users on the same device can compete
- Protected views check for an active session before rendering sensitive content

While this system uses localStorage rather than server-side tokens, it accurately mirrors the structural patterns of real authentication — session persistence, user-scoped data, and UI state driven by auth status — making it a valid demonstration of auth flow architecture in a frontend context.

---

## Quiz System

The quiz engine is the core of the application. Every quiz is driven dynamically from the `data.js` file, which exports a structured object where each key is a category name and its value is an array of question objects.

**Data structure per question:**

```javascript
{
    image: "images/category.jpg",       // Category cover image (first question only)
    description: "Quiz description...", // Shown on the intro page (first question only)
    timeLimit: 240,                     // Total seconds for the quiz (first question only)
    question: "Question text here?",
    answers: ["Option A", "Option B", "Option C", "Option D"],
    correct: 1                          // Zero-based index of the correct answer
}
```

**Answer tracking with an index map:**

A critical design decision is storing answers as an object map (`{ questionIndex: selectedAnswerIndex }`) rather than a sequential array. This approach solves the classic previous-button scoring bug:

```javascript
// Answers stored as a map
activeQuizState.answers = { 0: 2, 1: 0, 3: 1 }

// Score calculated by iterating all questions exactly once
questions.forEach((q, i) => {
    if (activeQuizState.answers[i] === q.correct) score++;
});
```

This means:

- Navigating back to a question and changing the answer simply overwrites the map entry — no duplication
- Skipping a question leaves its index undefined — counted as incorrect and shown as unanswered in the summary
- The score is always computed at results time from the final state of the map, never incremented in real time

**Quiz lifecycle:**

1. User selects a category from the categories grid
2. Quiz intro view shows the description, question count, and time estimate
3. On "Start Quiz", the state object is initialized and the timer starts
4. Each question is rendered from the data array with answer options built dynamically
5. Selecting an option enables the Next button; the selection is stored in the answers map
6. On the last question, "Next" becomes "Finish Quiz"
7. Results are calculated from the final answers map, saved to localStorage, and the results view is rendered

---

## LocalStorage Architecture

All client-side persistence is organized under clearly namespaced localStorage keys:

| Key | Value | Purpose |
|---|---|---|
| `quizUser` | `"username"` | Active authenticated session |
| `theme` | `"dark"` or `"light"` | User's preferred color scheme |
| `quizProgress_[Category]` | Serialized state object | Saves mid-quiz progress per category |
| `quizScores_[username]` | Array of score objects | Stores best scores per user per category |

Quiz progress objects include the current question index and the full answers map, enabling complete mid-session restoration. When a user resumes a quiz, their previously selected answers are visually restored on each question as they navigate.

Score objects track the category name, score, total questions, and timestamp, enabling accurate leaderboard construction by iterating all `quizScores_*` keys at render time.

---

## Responsive Design

QuizMind is built mobile-first with a three-tier responsive layout system defined entirely in custom CSS using media queries.

**Breakpoints:**

| Breakpoint | Target | Key layout changes |
|---|---|---|
| Default (> 1024px) | Desktop | Two-column hero, three-column grids, side-by-side intro layout |
| max-width: 1024px | Tablet | Single-column hero, two-column category grid, stacked intro |
| max-width: 768px | Mobile | Single-column everything, hidden desktop nav, stacked quiz footer |
| max-width: 420px | Small mobile | Reduced typography scale, tighter spacing |

The layout engine uses CSS Grid for all multi-column sections and Flexbox for component-level alignment. No fixed widths are used on container elements — all layouts flow naturally within their responsive context.

Notable responsive behaviors include the categories grid collapsing from a 3-2-1 column layout, the quiz footer buttons stacking vertically on mobile, the results stats row shifting to a single column, and the hero section reorganizing from a two-column split to a stacked layout.

---

## Mobile Navigation

On mobile viewports, the desktop navigation bar is hidden and replaced with a hamburger menu drawer. The drawer slides in from the side as an overlay, providing full navigation access without consuming permanent screen space.

**Implementation details:**

- A hamburger icon button appears in the header on mobile, replacing the inline nav links
- Clicking the icon toggles a class on the body, triggering a CSS transition on the drawer panel
- The drawer contains all navigation links, the theme toggle, and the auth controls
- Tapping any nav link or the overlay backdrop closes the drawer automatically
- The transition uses CSS `transform: translateX()` for GPU-accelerated animation, keeping the interaction smooth on low-powered mobile devices

---

## UI/UX Design Highlights

QuizMind was designed to feel like a polished commercial product. Every visual and interaction decision was deliberate.

**Design system:**

All colors, shadows, and spacing are defined as CSS custom properties on `:root`, with a parallel dark mode override block on `body.dark`. The entire visual theme switches with a single class toggle — only the class changes, CSS handles the rest.

```css
:root {
    --color-primary: #4F46E5;
    --color-background: #F4F7FB;
    --color-surface: #FFFFFF;
}

body.dark {
    --color-background: #0B1220;
    --color-surface: #111827;
    --color-primary: #818CF8;
}
```

**Interaction polish:**

- View transitions use a `fadeIn` keyframe animation — each new view fades up from a slight vertical offset, giving the SPA a native-app feel
- Buttons apply `transform: translateY(-1px)` on hover with a subtle box-shadow transition
- Category and quiz cards lift with `transform: translateY(-4px)` on hover
- Option cards show a highlighted selection ring using `box-shadow` and border-color change
- The progress bar width animates with a 0.4s ease transition on every question advance
- The timer display updates every second with zero layout shift

**Typography:**

The platform uses a two-font pairing: Inter for body text and UI elements, and Manrope for headings. Font weights range from 400 to 800, with heavier weights reserved for hero titles and score displays to create clear visual hierarchy.

**Color and depth:**

Cards and surfaces use layered shadows from a custom shadow scale (`--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-float`) rather than flat borders alone. This creates a sense of depth and elevation that guides the user's eye to interactive elements.

---

## Installation and Usage

QuizMind requires no build tools, package managers, or server configuration. It runs directly from any static file server.

**Option 1 — VS Code Live Server (recommended):**

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
2. Open the project folder in VS Code
3. Right-click `index.html` and select "Open with Live Server"
4. The app opens at `http://127.0.0.1:5500`

**Option 2 — Python local server:**

```bash
git clone https://github.com/your-username/quizmind.git
cd quizmind
python -m http.server 8000
# Open http://localhost:8000
```

**Option 3 — Node.js:**

```bash
git clone https://github.com/your-username/quizmind.git
cd quizmind
npx serve .
# Open the URL shown in the terminal
```

> Note: Because `app.js` and `data.js` use ES6 module syntax (`import`/`export`), browsers block module loading from `file://` URLs. Always use a local server rather than opening `index.html` directly.

**Adding quiz content:**

All quiz data lives in `data.js`. To add a new category, add a new key to the exported `quizzes` object following the existing structure, and add a cover image to the `images/` folder. The categories grid, intro page, and My Quizzes dashboard will all reflect it automatically — no other changes are needed.

---

## Future Improvements

**Backend integration**

Migrating from localStorage to a real backend (Node.js + Express or a service like Supabase) would enable genuine multi-user authentication, server-side score persistence, and a truly global leaderboard shared across all devices and sessions.

**User profiles**

A dedicated profile page showing total quizzes completed, average accuracy, time spent, strongest categories, and earned badges would add significant depth to the personal progress system.

**Quiz creation**

An in-browser quiz builder allowing authenticated users to create, publish, and share their own quiz categories would transform QuizMind from a content-consumption platform into a community-driven one.

**Advanced question types**

Beyond multiple-choice, supporting true/false, fill-in-the-blank, image-based questions, and ordered ranking would make the quiz engine significantly more versatile.

**Spaced repetition**

Tracking which questions a user gets wrong and surfacing them in future sessions using a spaced repetition algorithm would improve long-term knowledge retention.

**Accessibility**

Full WCAG 2.1 AA compliance including keyboard navigation throughout the quiz flow, ARIA live regions for timer updates, focus management on view transitions, and sufficient color contrast in all theme variants.

**PWA support**

Adding a service worker and web app manifest would allow QuizMind to be installed on mobile home screens and function offline, significantly improving the mobile experience.

---

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add: brief description'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request with a clear description of the change

---

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it for personal or commercial purposes with attribution.

---

<div align="center">

**QuizMind** — Built as a frontend portfolio project.

Designed and developed with a commitment to clean code, thoughtful design, and the craft of frontend engineering.

Made with dedication.

</div>