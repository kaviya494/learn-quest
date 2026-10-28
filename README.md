# AI Peer Teaching Kit for Weak Topics ⚜

An elegant, gamified, and scientifically grounded learning web application designed for students to conquer difficult academic topics through the **Feynman Technique** and **Peer-to-Peer Teaching**.

Developed as a college project combining **Artificial Intelligence**, **Pedagogical Cognitive Science**, and **Interactive 3D Web Graphics (Three.js)**.

---

## 🌟 Key Highlights & Design Philosophy

- **Palace Library Aesthetic:** Designed with a regal, classical scholarly atmosphere:
  - Background: Muted sage grey gradient (`#9CA79A` to `#8A9688`)
  - Panels & Cards: Warm cream beige (`#F3E9D2`) and parchment
  - 3D Characters: Deep royal burgundy (`#6D1128`) with antique gold (`#C9A24B`) trim
  - Typography: Majestic serif titles (Cinzel, Playfair Display, 64–96px) and readable body serif (Cormorant Garamond, Lora, 20px+)
- **100% Offline Capability:** Runs directly by double-clicking `index.html` in any browser. No web server, Node.js, build step, or command line required!
- **Zero CORS / Zero External Asset Failure:** 3D models and sound effects are generated procedurally (Three.js primitives + Web Audio API synthesizer), preventing any security/CORS errors when running directly from the local filesystem (`file:///`).
- **Dual-Mode AI:** Works out-of-the-box with rich built-in academic content and heuristic evaluation rubrics, with an optional field to input a Google Gemini API key for live AI answers.

---

## 🚀 How to Run the Project

1. **Direct Double-Click (Zero Setup):**
   - Locate the project folder on your laptop.
   - Double-click `index.html`.
   - The application opens immediately in your default web browser (Chrome, Edge, Firefox, Brave, Safari).
2. **Audio:**
   - Click anywhere on the page or press the **"🔔 Audio On"** toggle in the header. The procedural Web Audio synthesizer plays golden chords for correct answers, gentle buzzers for misses, card flip whooshes, and royal fanfares.
3. **Optional Gemini API Key (Two Methods):**
   - **Method A (In-App UI):** Click the **"🔑 API Key"** button in the top navigation bar, paste your Google Gemini API key, and click **"Save & Apply"** (persisted in `localStorage`).
   - **Method B (File-based):** Edit [env.js](file:///C:/Users/ARIF/.gemini/antigravity/scratch/ai-peer-teaching-kit/env.js) and paste your key into `window.ENV.GEMINI_API_KEY = "..."`. An [.env.example](file:///C:/Users/ARIF/.gemini/antigravity/scratch/ai-peer-teaching-kit/.env.example) and [.env](file:///C:/Users/ARIF/.gemini/antigravity/scratch/ai-peer-teaching-kit/.env) template are also provided for standard environment variable workflows.
   - If no key is provided, the application runs 100% on its built-in offline engine.

---

## 🏛️ Core Features

### 1. Weak Topic Selector & Confidence Rater
- Choose between built-in topics spanning **Programming & Algorithms**, **Database Management Systems (DBMS)**, **Mathematics & Probability**, **Modern Physics**, and **Operating Systems**.
- Rate your confidence level from **1 to 5 stars** to mark concepts as weak or mastered.
- **Custom Topic Summoner:** Type any college topic (e.g., *Dynamic Programming*, *Dijkstra's Algorithm*, *Cache Coherence*) to instantly create a study kit.

### 2. Peer Explainer (Robot Peer: Arch-Tutor Borg)
- Explains difficult topics in plain, accessible terms using:
  - An intuitive **everyday real-world analogy** (e.g., Russian nesting dolls for recursion, palace ledgers for SQL normalization, spinning coins for quantum superposition).
  - Four **foundational pillars** and key rules.
  - A memorable **Royal Mnemonic**.
  - An **interactive walkthrough** prompt.
  - Native **Text-to-Speech audio** to listen to the Robot explain the topic aloud.

### 3. Teach-Back Mode (The Doll: Princess Aria)
- Implements the **Feynman Technique**: you become the teacher!
- Princess Aria asks you to explain the concept to her in simple words.
- Type your explanation in the text area and click **"Evaluate My Teaching"**.
- Receives immediate feedback:
  - **Conceptual Score (0–100%)**
  - **What you explained accurately**
  - **What missing points or edge cases you missed**
  - Encouraging in-character dialogue from the Doll
  - Knowledge XP awarded for teaching.

### 4. 3D Quiz Battle Arena
- A dedicated Three.js 3D arena where the **Robot Examiner** and the **Doll Apprentice** face off on an ancient marble dais with inlaid gold runes.
- 5 multiple-choice questions per topic with instant explanations.
- **Dynamic 3D visual feedback:**
  - Answering correctly powers up the Doll with a golden aura, celebratory jump, and filling power meter!
  - Answering incorrectly triggers an energy strike from the Robot, increasing the Robot's dominance.

### 5. Boss Level: The Grand 10-Question Trial
- A high-stakes timed challenge with a **120-second countdown timer**.
- Tests deep conceptual nuances and edge cases.
- Scoring **70%+** unlocks the legendary **Royal Crown of Mentorship** and awards **250 XP**!

### 6. 3D Flashcards & Memory Match Mini-Game
- **3D Flashcards:** Interactive cards with realistic 3D perspective flips, keyboard/click navigation, and "I Know This" mastery tracking.
- **Memory Match:** A 4x2 card grid mini-game where students flip and match concepts to their definitions against the clock.

### 7. Spaced Revision Planner
- Combats the Ebbinghaus Forgetting Curve using the **Leitner Spaced Repetition** protocol.
- Automatically schedules review milestones at:
  - **Day 1:** Immediate consolidation
  - **Day 3:** Active recall check
  - **Day 7:** Deep memory locking
  - **Day 14:** Permanent mastery
- Interactive checkboxes calculate real-time due dates, flagging items due today.

### 8. Progress Dashboard & 3D Gem Treasury
- **Academic Rank System:**
  - 📜 *Apprentice* (0 – 249 XP)
  - 📖 *Scholar* (250 – 599 XP)
  - ✨ *Sage* (600 – 1199 XP)
  - 👑 *Royal Mentor* (1200+ XP)
- **Weak vs. Strong Breakdown:** Categorizes topics based on confidence and quiz scores.
- **Study Streak Tracker:** Daily streak counter with streak preservation in `localStorage`.
- **Badges of Honor:** Collectible achievement badges (First Lesson, Feynman Disciple, Battle Victor, Memory Maestro, Boss Slayer, Grand Sage).
- **Interactive 3D Trophy Showcase:** Real-time 3D models rendered with Three.js (*Ruby of Courage*, *Emerald of Tenacity*, *Sapphire of Wisdom*, and *Royal Crown*). Drag to inspect in 3D!

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Structure** | HTML5 (Semantic, Accessible) | Clean markup, high readability |
| **Styling** | CSS3 (Custom Properties, Flexbox, Grid, 3D Transforms) | Royal palace library aesthetic, responsive design |
| **3D Engine** | Three.js (r128 UMD build stored in `/libs`) | Hero 3D scene, Quiz Battle arena, 3D collectible trophies |
| **Audio** | HTML5 Web Audio API | Procedural sound generation (chimes, buzzers, fanfare, flips) |
| **Speech** | Web Speech API (`window.speechSynthesis`) | Spoken reading of peer explanations |
| **Storage** | Browser `localStorage` API | Persisting streaks, XP, topics state, badges, and revision dates |
| **AI Integration** | Google Gemini API (v1beta) + Local Regex Rubrics | Live evaluation fallback for offline environments |

---

## 📁 Project Directory Structure

```
ai-peer-teaching-kit/
│
├── index.html               # Main entry point (double-click to run)
├── README.md                # Project documentation and viva guide
│
├── css/
│   └── style.css            # Complete palace library styles, animations, responsive layout
│
├── js/
│   ├── data.js              # Comprehensive curriculum database & quizzes for 5+ topics
│   ├── audio.js             # Procedural sound effects synthesizer (Web Audio API)
│   ├── three-hero.js        # Three.js 3D Hero scene (low-poly Robot & Doll with mouse tracking)
│   ├── three-battle.js      # Three.js 3D Quiz Battle arena with energy beams & auras
│   ├── three-trophy.js      # Three.js 3D Collectible gems & royal crown viewer
│   ├── gemini-api.js        # Gemini API integration & intelligent offline rubric evaluator
│   └── app.js               # Application controller, state management, and event bindings
│
├── libs/
│   └── three.min.js         # Local standalone Three.js library (for 100% offline usage)
│
└── assets/                  # Project assets and icons
```

---

## 🎓 College Viva Presentation Guide

### Key Viva Questions & Recommended Answers

#### Q1: What is the core pedagogical problem this project solves?
> **Answer:** "Most students rely on passive learning methods like re-reading textbooks or watching tutorial videos. This creates the *Illusion of Explanatory Depth*, where students overestimate their understanding until tested. Our project operationalizes the **Feynman Technique**: by prompting students to explain concepts in simple terms to an AI peer (the Doll) and receiving instant rubric feedback, it engages active retrieval and metacognition."

#### Q2: How does the app achieve zero-dependency offline functionality?
> **Answer:** "All core assets and libraries are self-contained. The Three.js library is packaged locally in `/libs/three.min.js`. Instead of loading external 3D files (like `.gltf` or `.obj`) which trigger browser CORS blocks when loaded via `file:///`, we procedurally generate our 3D geometries and materials. Furthermore, sound effects are synthesized mathematically in real-time using the native browser Web Audio API, eliminating external `.mp3` dependencies."

#### Q3: How is the student's teach-back explanation evaluated?
> **Answer:** "The evaluation engine follows a dual-mode design:
> 1. **Offline Mode:** Uses a domain-specific weighted rubric that analyzes structural depth, required keyword presence, semantic regular expressions (such as base conditions, stack frames, or anomalies), and conceptual completeness.
> 2. **Online Mode (Optional):** When a user enters a Gemini API key, the explanation is passed to Google Gemini with a structured JSON schema prompt, acting as the novice Doll student to provide conceptual feedback."

#### Q4: How does the spaced repetition scheduling work?
> **Answer:** "It is based on the Leitner spaced repetition system. When a student completes a teach-back session on a topic, the application calculates review dates at intervals of 1, 3, 7, and 14 days from the current date. The dashboard tracks the status of each interval and flags reviews due today, helping transfer memories from short-term to permanent cortical storage."

---

## 📜 License
Created for academic demonstration and college project submission. Open for educational use.
