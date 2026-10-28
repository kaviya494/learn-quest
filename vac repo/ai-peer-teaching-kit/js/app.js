/**
 * AI Peer Teaching Kit for Weak Topics - Core Application Controller
 * Handles state persistence, navigation, interactive modules, and gamification.
 * Written with clean structure and academic comments for college viva presentation.
 */

class PeerTeachingKitApp {
  constructor() {
    this.currentTopic = null;
    this.topics = [...DEFAULT_TOPICS];
    this.audio = window.soundFx;
    this.ai = window.aiService;

    // Active quiz battle state
    this.quizIndex = 0;
    this.quizScore = 0;
    this.dollPoints = 0;
    this.robotPoints = 0;
    this.quizAnswered = false;

    // Boss level state
    this.bossIndex = 0;
    this.bossScore = 0;
    this.bossTimer = null;
    this.bossTimeRemaining = 120;
    this.bossActive = false;

    // Flashcard state
    this.cardIndex = 0;
    this.cardFlipped = false;

    // Memory match state
    this.memoryCards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.memoryLocked = false;

    // Text to speech state
    this.isSpeaking = false;
    this.synth = window.speechSynthesis || null;

    // 3D Scene references
    this.heroScene = null;
    this.battleScene = null;
    this.trophyViewer = null;

    // Load persisted student profile
    this.loadState();
  }

  /* ==========================================================================
     1. PERSISTENCE & USER PROFILE STATE (localStorage)
     ========================================================================== */
  loadState() {
    const raw = localStorage.getItem('royal_peer_kit_state');
    const defaultState = {
      xp: 120,
      streak: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
      topicsState: {},
      unlockedTrophies: ['ruby'],
      unlockedBadges: ['first_lesson'],
      customTopics: [],
      revisionItems: []
    };

    if (raw) {
      try {
        this.state = Object.assign(defaultState, JSON.parse(raw));
      } catch (e) {
        this.state = defaultState;
      }
    } else {
      this.state = defaultState;
    }

    // Merge custom topics saved by user
    if (this.state.customTopics && this.state.customTopics.length > 0) {
      this.state.customTopics.forEach(custom => {
        if (!this.topics.find(t => t.id === custom.id)) {
          this.topics.push(custom);
        }
      });
    }

    // Initialize topicsState defaults
    this.topics.forEach(t => {
      if (!this.state.topicsState[t.id]) {
        this.state.topicsState[t.id] = {
          confidence: t.confidenceDefault || 2,
          mastered: false,
          teachBackCompleted: false,
          teachBackScore: 0,
          quizHighscore: 0,
          bossDefeated: false,
          lastReviewed: null
        };
      }
    });

    // Verify streak
    this.checkStreak();

    // Set initial active topic
    const savedActiveId = localStorage.getItem('royal_peer_active_topic') || 'recursion';
    this.currentTopic = this.topics.find(t => t.id === savedActiveId) || this.topics[0];
  }

  saveState() {
    try {
      localStorage.setItem('royal_peer_kit_state', JSON.stringify(this.state));
      localStorage.setItem('royal_peer_active_topic', this.currentTopic.id);
    } catch (e) {
      console.warn("Could not save to localStorage:", e);
    }
    this.renderHeaderStats();
  }

  checkStreak() {
    const today = new Date().toISOString().split('T')[0];
    const last = this.state.lastActiveDate;

    if (!last) {
      this.state.streak = 1;
      this.state.lastActiveDate = today;
    } else if (last === today) {
      // Already active today, maintain streak
    } else {
      const lastDate = new Date(last);
      const currentDate = new Date(today);
      const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        this.state.streak += 1;
      } else if (diffDays > 1) {
        this.state.streak = 1; // Reset streak if missed more than 1 day
      }
      this.state.lastActiveDate = today;
    }

    // Award trophy based on streak
    if (this.state.streak >= 3 && !this.state.unlockedTrophies.includes('emerald')) {
      this.unlockTrophy('emerald', 'Emerald of Tenacity (3-Day Streak!)');
    }
  }

  /* ==========================================================================
     2. LEVEL & XP SYSTEM (Apprentice -> Scholar -> Sage -> Royal Mentor)
     ========================================================================== */
  getLevelInfo() {
    const xp = this.state.xp || 0;
    if (xp < 250) {
      return {
        title: "Apprentice",
        tier: 1,
        minXP: 0,
        nextXP: 250,
        progress: (xp / 250) * 100,
        badgeIcon: "📜"
      };
    } else if (xp < 600) {
      return {
        title: "Scholar",
        tier: 2,
        minXP: 250,
        nextXP: 600,
        progress: ((xp - 250) / 350) * 100,
        badgeIcon: "📖"
      };
    } else if (xp < 1200) {
      return {
        title: "Sage",
        tier: 3,
        minXP: 600,
        nextXP: 1200,
        progress: ((xp - 600) / 600) * 100,
        badgeIcon: "✨"
      };
    } else {
      return {
        title: "Royal Mentor",
        tier: 4,
        minXP: 1200,
        nextXP: 2000,
        progress: Math.min(100, ((xp - 1200) / 800) * 100),
        badgeIcon: "👑"
      };
    }
  }

  addXP(amount, reason = "Study Activity") {
    const oldLevel = this.getLevelInfo().title;
    this.state.xp += amount;
    const newLevel = this.getLevelInfo().title;

    this.showToast(`+${amount} XP: ${reason}! 🌟`, "success");

    // Check level up fanfare
    if (oldLevel !== newLevel) {
      if (this.audio) this.audio.playLevelUp();
      this.showLevelUpModal(newLevel);

      if (newLevel === 'Scholar' && !this.state.unlockedTrophies.includes('sapphire')) {
        this.unlockTrophy('sapphire', 'Sapphire of Wisdom (Attained Scholar rank)');
      }
      if (newLevel === 'Royal Mentor' && !this.state.unlockedTrophies.includes('crown')) {
        this.unlockTrophy('crown', 'Royal Crown of Mentorship (Grand Mastery!)');
      }
    }

    this.saveState();
  }

  unlockTrophy(trophyId, name) {
    if (!this.state.unlockedTrophies.includes(trophyId)) {
      this.state.unlockedTrophies.push(trophyId);
      this.showToast(`🏆 3D Trophy Unlocked: ${name}!`, "trophy");
      if (this.audio) this.audio.playLevelUp();
      this.saveState();
      this.renderTreasury();
    }
  }

  unlockBadge(badgeId, title) {
    if (!this.state.unlockedBadges.includes(badgeId)) {
      this.state.unlockedBadges.push(badgeId);
      this.showToast(`🎖️ Badge Earned: ${title}!`, "badge");
      this.saveState();
      this.renderDashboard();
    }
  }

  /* ==========================================================================
     3. INITIALIZATION & DOM BINDINGS
     ========================================================================== */
  init() {
    this.renderHeaderStats();
    this.setupNavigation();
    this.setupTopicSelector();
    this.setupPeerExplainer();
    this.setupTeachBack();
    this.setupQuizBattle();
    this.setupBossLevel();
    this.setupFlashcards();
    this.setupSpacedPlanner();
    this.setupDashboard();
    this.setupApiKeyModal();
    this.setupSoundControls();

    // Initialize 3D Scenes after DOM is ready
    setTimeout(() => {
      this.initThreeScenes();
    }, 150);

    // Initial render of topic content
    this.loadTopic(this.currentTopic.id);
  }

  initThreeScenes() {
    try {
      if (typeof THREE !== 'undefined') {
        // Hero 3D Scene
        const heroCanvas = document.getElementById('heroThreeCanvas');
        if (heroCanvas && window.HeroScene) {
          this.heroScene = new window.HeroScene('heroThreeCanvas');
        }

        // Quiz Battle 3D Scene
        const battleCanvas = document.getElementById('battleThreeCanvas');
        if (battleCanvas && window.BattleScene) {
          this.battleScene = new window.BattleScene('battleThreeCanvas');
        }

        // Dashboard Trophy 3D Scene
        const trophyCanvas = document.getElementById('trophyThreeCanvas');
        if (trophyCanvas && window.TrophyViewer) {
          this.trophyViewer = new window.TrophyViewer('trophyThreeCanvas');
        }
      } else {
        console.warn("Three.js not loaded. Verify libs/three.min.js.");
      }
    } catch (e) {
      console.warn("3D initialization note:", e);
    }
  }

  /* ==========================================================================
     4. NAVIGATION & SECTION CONTROLS
     ========================================================================== */
  setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .hero-cta-btn, .section-jump-btn');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('data-target') || link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          e.preventDefault();
          this.navigateTo(targetId.substring(1));
        }
      });
    });

    // Mobile menu toggle if present
    const mobileBtn = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('royalNavMenu');
    if (mobileBtn && navMenu) {
      mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
      });
    }
  }

  navigateTo(sectionId) {
    if (this.audio) this.audio.playClick();

    const sections = document.querySelectorAll('.app-section');
    let targetSection = document.getElementById(sectionId);

    if (!targetSection) return;

    sections.forEach(sec => sec.classList.remove('active-section'));
    targetSection.classList.add('active-section');

    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-target') === `#${sectionId}` || link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Scroll smoothly to section
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Handle section-specific triggers
    if (sectionId === 'battleSection' && this.battleScene) {
      setTimeout(() => this.battleScene.onResize(), 100);
    }
    if (sectionId === 'dashboardSection') {
      this.renderDashboard();
      if (this.trophyViewer) setTimeout(() => this.trophyViewer.onResize(), 100);
    }
  }

  /* ==========================================================================
     5. TOPIC SELECTOR & CONFIDENCE RATER
     ========================================================================== */
  setupTopicSelector() {
    const container = document.getElementById('topicGridContainer');
    const filterBtns = document.querySelectorAll('.topic-filter-pill');
    const customInput = document.getElementById('customTopicInput');
    const customAddBtn = document.getElementById('addCustomTopicBtn');

    this.renderTopicCards('all');

    // Filter pills
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.audio) this.audio.playClick();
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        this.renderTopicCards(filter);
      });
    });

    // Add Custom Topic handler
    if (customAddBtn && customInput) {
      customAddBtn.addEventListener('click', async () => {
        const val = customInput.value.trim();
        if (!val) {
          this.showToast("Please enter a topic title!", "warning");
          return;
        }

        customAddBtn.disabled = true;
        customAddBtn.innerHTML = "<span>Summoning Topic... ⏳</span>";

        try {
          const newTopic = await this.ai.generateCustomTopic(val);
          this.topics.unshift(newTopic);
          this.state.customTopics = this.state.customTopics || [];
          this.state.customTopics.unshift(newTopic);

          this.state.topicsState[newTopic.id] = {
            confidence: 2,
            mastered: false,
            teachBackCompleted: false,
            teachBackScore: 0,
            quizHighscore: 0,
            bossDefeated: false,
            lastReviewed: null
          };

          this.saveState();
          this.renderTopicCards('all');
          this.loadTopic(newTopic.id);
          customInput.value = '';

          this.showToast(`Summoned "${val}" successfully!`, "success");
          this.navigateTo('explainerSection');
        } catch (e) {
          this.showToast("Failed to create topic: " + e.message, "warning");
        } finally {
          customAddBtn.disabled = false;
          customAddBtn.innerHTML = "<span>Study This Topic ⚜</span>";
        }
      });
    }
  }

  renderTopicCards(filter = 'all') {
    const container = document.getElementById('topicGridContainer');
    if (!container) return;

    container.innerHTML = '';

    const filtered = this.topics.filter(t => {
      if (filter === 'all') return true;
      if (filter === 'cs') return t.subject.includes('Programming') || t.subject.includes('Data') || t.subject.includes('Operating');
      if (filter === 'dbms') return t.subject.includes('Database') || t.subject.includes('DBMS');
      if (filter === 'math') return t.subject.includes('Math');
      if (filter === 'physics') return t.subject.includes('Physics');
      return true;
    });

    filtered.forEach(topic => {
      const topicData = this.state.topicsState[topic.id] || { confidence: 2 };
      const card = document.createElement('div');
      card.className = `topic-card ${this.currentTopic.id === topic.id ? 'active-topic-card' : ''}`;
      card.setAttribute('data-id', topic.id);

      // Star ratings
      let starsHtml = '';
      for (let s = 1; s <= 5; s++) {
        starsHtml += `<span class="star-rating-icon ${s <= topicData.confidence ? 'filled' : ''}" data-star="${s}">★</span>`;
      }

      card.innerHTML = `
        <div class="topic-card-badge">${topic.badge || '📚 Concept'}</div>
        <h3 class="topic-card-title">${topic.title}</h3>
        <p class="topic-card-desc">${topic.summary}</p>
        <div class="topic-confidence-box">
          <label class="confidence-label">My Confidence (1-5):</label>
          <div class="star-group" data-id="${topic.id}">
            ${starsHtml}
          </div>
        </div>
        <div class="topic-card-actions">
          <button class="royal-btn-secondary select-topic-btn" data-id="${topic.id}">
            Select & Learn ➜
          </button>
        </div>
      `;

      // Star rating click handler
      card.querySelectorAll('.star-rating-icon').forEach(star => {
        star.addEventListener('click', (e) => {
          e.stopPropagation();
          const rating = parseInt(star.getAttribute('data-star'));
          this.setTopicConfidence(topic.id, rating);
        });
      });

      // Card selection click
      card.addEventListener('click', () => {
        this.loadTopic(topic.id);
        this.navigateTo('explainerSection');
      });

      container.appendChild(card);
    });
  }

  setTopicConfidence(topicId, rating) {
    if (!this.state.topicsState[topicId]) {
      this.state.topicsState[topicId] = {};
    }
    this.state.topicsState[topicId].confidence = rating;
    if (this.audio) this.audio.playClick();
    this.saveState();
    this.renderTopicCards();
    this.showToast(`Updated confidence to ${rating}/5!`, "info");
  }

  loadTopic(topicId) {
    const found = this.topics.find(t => t.id === topicId);
    if (!found) return;

    this.currentTopic = found;
    this.saveState();

    // Update active UI cards
    document.querySelectorAll('.topic-card').forEach(c => {
      c.classList.toggle('active-topic-card', c.getAttribute('data-id') === topicId);
    });

    // Populate Peer Explainer
    this.renderPeerExplainer();

    // Populate Teach-Back
    this.resetTeachBack();

    // Populate Quiz Battle
    this.resetQuizBattle();

    // Populate Boss Level
    this.resetBossLevel();

    // Populate Flashcards
    this.resetFlashcards();

    // Update header pill
    const activePill = document.getElementById('currentActiveTopicPill');
    if (activePill) {
      activePill.textContent = found.title;
    }
  }

  /* ==========================================================================
     6. PEER EXPLAINER (ROBOT CHARACTER)
     ========================================================================== */
  setupPeerExplainer() {
    const audioBtn = document.getElementById('robotAudioReadBtn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        this.toggleRobotSpeech();
      });
    }
  }

  renderPeerExplainer() {
    const topic = this.currentTopic;
    const exp = topic.robotExplanation;
    if (!exp) return;

    const titleEl = document.getElementById('explainerTopicTitle');
    const introEl = document.getElementById('robotIntroText');
    const analogyEl = document.getElementById('robotAnalogyText');
    const pointsList = document.getElementById('robotKeyPointsList');
    const mnemonicEl = document.getElementById('robotMnemonicText');
    const promptEl = document.getElementById('robotInteractivePrompt');

    if (titleEl) titleEl.textContent = topic.title;
    if (introEl) introEl.textContent = exp.intro;
    if (analogyEl) analogyEl.textContent = exp.analogy;
    if (mnemonicEl) mnemonicEl.textContent = exp.mnemonic;
    if (promptEl) promptEl.textContent = exp.interactivePrompt || '';

    if (pointsList && exp.keyPoints) {
      pointsList.innerHTML = '';
      exp.keyPoints.forEach(pt => {
        const li = document.createElement('li');
        li.className = 'robot-point-item';
        li.innerHTML = `<span class="point-bullet">⚜</span> <span>${pt}</span>`;
        pointsList.appendChild(li);
      });
    }

    // Stop ongoing speech on topic switch
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      const audioBtn = document.getElementById('robotAudioReadBtn');
      if (audioBtn) audioBtn.innerHTML = `<span>🔊 Listen to Robot Peer</span>`;
    }
  }

  toggleRobotSpeech() {
    if (!this.synth) {
      this.showToast("Speech synthesis not supported in this browser.", "warning");
      return;
    }

    const audioBtn = document.getElementById('robotAudioReadBtn');

    if (this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (audioBtn) audioBtn.innerHTML = `<span>🔊 Listen to Robot Peer</span>`;
      return;
    }

    const exp = this.currentTopic.robotExplanation;
    const fullText = `${exp.intro}. Here is an everyday analogy: ${exp.analogy}. Key points: ${exp.keyPoints.join('. ')}. Remember: ${exp.mnemonic}`;

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 1.0;
    utterance.pitch = 0.95; // Slightly robotic/scholarly cadence

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (audioBtn) audioBtn.innerHTML = `<span>⏹ Stop Voice</span>`;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (audioBtn) audioBtn.innerHTML = `<span>🔊 Listen to Robot Peer</span>`;
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (audioBtn) audioBtn.innerHTML = `<span>🔊 Listen to Robot Peer</span>`;
    };

    this.synth.speak(utterance);
  }

  /* ==========================================================================
     7. TEACH-BACK MODE (THE DOLL ACTS AS STUDENT)
     ========================================================================== */
  setupTeachBack() {
    const evalBtn = document.getElementById('evaluateTeachBackBtn');
    const textarea = document.getElementById('teachBackInput');
    const clearBtn = document.getElementById('clearTeachBackBtn');

    if (evalBtn && textarea) {
      evalBtn.addEventListener('click', async () => {
        const text = textarea.value.trim();
        if (text.length < 15) {
          this.showToast("Please explain a bit more so the Doll can evaluate your teaching!", "warning");
          return;
        }

        evalBtn.disabled = true;
        evalBtn.innerHTML = `<span>The Doll is Thinking... 💭</span>`;
        if (this.audio) this.audio.playClick();

        try {
          const result = await this.ai.evaluateTeachBack(this.currentTopic, text);
          this.displayTeachBackResult(result);

          // Update state
          const tState = this.state.topicsState[this.currentTopic.id];
          if (tState) {
            tState.teachBackCompleted = true;
            tState.teachBackScore = Math.max(tState.teachBackScore || 0, result.score);
            tState.lastReviewed = new Date().toISOString();
          }

          // Add XP and badge
          this.addXP(result.xpEarned, "Feynman Teach-Back");
          this.unlockBadge('feynman_disciple', 'Feynman Disciple (Taught a peer successfully!)');

          // Schedule spaced revision automatically
          this.addSpacedRevision(this.currentTopic.id, this.currentTopic.title);

        } catch (e) {
          this.showToast("Evaluation error: " + e.message, "warning");
        } finally {
          evalBtn.disabled = false;
          evalBtn.innerHTML = `<span>Evaluate My Teaching ⚜</span>`;
        }
      });
    }

    if (clearBtn && textarea) {
      clearBtn.addEventListener('click', () => {
        textarea.value = '';
        this.resetTeachBack();
      });
    }
  }

  resetTeachBack() {
    const feedbackBox = document.getElementById('teachBackFeedbackCard');
    if (feedbackBox) feedbackBox.classList.add('hidden');
    const dollTopicName = document.getElementById('dollPromptTopicTitle');
    if (dollTopicName) dollTopicName.textContent = this.currentTopic.title;
  }

  displayTeachBackResult(result) {
    const feedbackBox = document.getElementById('teachBackFeedbackCard');
    if (!feedbackBox) return;

    feedbackBox.classList.remove('hidden');

    const scoreNumber = document.getElementById('teachScoreNumber');
    const dollSpeech = document.getElementById('dollFeedbackSpeech');
    const correctText = document.getElementById('teachWhatWasCorrect');
    const missingText = document.getElementById('teachWhatWasMissing');
    const scoreMeter = document.getElementById('teachScoreBarFill');

    if (scoreNumber) scoreNumber.textContent = `${result.score}%`;
    if (dollSpeech) dollSpeech.textContent = `"${result.dollReaction}"`;
    if (correctText) correctText.textContent = result.whatWasCorrect;
    if (missingText) missingText.textContent = result.whatWasMissing;

    if (scoreMeter) {
      scoreMeter.style.width = `${result.score}%`;
      if (result.score >= 80) {
        scoreMeter.style.backgroundColor = '#4E8752'; // Gold-green
      } else if (result.score >= 60) {
        scoreMeter.style.backgroundColor = '#C9A24B'; // Royal gold
      } else {
        scoreMeter.style.backgroundColor = '#9B1130'; // Burgundy
      }
    }

    if (result.score >= 70) {
      if (this.audio) this.audio.playCorrect();
    } else {
      if (this.audio) this.audio.playIncorrect();
    }

    feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ==========================================================================
     8. QUIZ BATTLE (3D ARENA & 5 MCQS)
     ========================================================================== */
  setupQuizBattle() {
    const nextBtn = document.getElementById('battleNextQuestionBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.quizIndex++;
        const questions = this.currentTopic.quizQuestions || [];
        if (this.quizIndex < questions.length) {
          this.renderQuizQuestion();
        } else {
          this.finishQuizBattle();
        }
      });
    }

    const restartBtn = document.getElementById('battleRestartBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.resetQuizBattle();
      });
    }
  }

  resetQuizBattle() {
    this.quizIndex = 0;
    this.quizScore = 0;
    this.dollPoints = 0;
    this.robotPoints = 0;
    this.quizAnswered = false;

    const resultBox = document.getElementById('battleResultSummary');
    const questionCard = document.getElementById('battleQuestionCard');
    if (resultBox) resultBox.classList.add('hidden');
    if (questionCard) questionCard.classList.remove('hidden');

    this.updateBattleScores();
    this.renderQuizQuestion();
  }

  updateBattleScores() {
    const dollHp = document.getElementById('battleDollPowerFill');
    const robotHp = document.getElementById('battleRobotPowerFill');
    const dollScoreText = document.getElementById('battleDollScoreText');
    const robotScoreText = document.getElementById('battleRobotScoreText');

    const totalQuestions = (this.currentTopic.quizQuestions || []).length || 5;

    if (dollHp) dollHp.style.width = `${(this.dollPoints / totalQuestions) * 100}%`;
    if (robotHp) robotHp.style.width = `${(this.robotPoints / totalQuestions) * 100}%`;

    if (dollScoreText) dollScoreText.textContent = `${this.dollPoints} pts`;
    if (robotScoreText) robotScoreText.textContent = `${this.robotPoints} pts`;
  }

  renderQuizQuestion() {
    this.quizAnswered = false;
    const questions = this.currentTopic.quizQuestions || [];
    const q = questions[this.quizIndex];
    if (!q) return;

    const progressEl = document.getElementById('battleQuestionCounter');
    const questionText = document.getElementById('battleQuestionText');
    const optionsGrid = document.getElementById('battleOptionsGrid');
    const explBox = document.getElementById('battleInstantExplanation');
    const nextBtn = document.getElementById('battleNextQuestionBtn');

    if (progressEl) progressEl.textContent = `Question ${this.quizIndex + 1} of ${questions.length}`;
    if (questionText) questionText.textContent = q.question;
    if (explBox) explBox.classList.add('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');

    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'battle-option-btn';
        btn.innerHTML = `
          <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
          <span class="option-label">${optText}</span>
        `;

        btn.addEventListener('click', () => {
          this.handleQuizAnswer(idx, q, btn, optionsGrid);
        });

        optionsGrid.appendChild(btn);
      });
    }
  }

  handleQuizAnswer(selectedIndex, question, chosenBtn, optionsGrid) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;

    const isCorrect = selectedIndex === question.correct;
    const allBtns = optionsGrid.querySelectorAll('.battle-option-btn');

    allBtns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === question.correct) {
        btn.classList.add('correct-choice');
      } else if (idx === selectedIndex && !isCorrect) {
        btn.classList.add('wrong-choice');
      }
    });

    // Instant explanation box
    const explBox = document.getElementById('battleInstantExplanation');
    const explText = document.getElementById('battleExplanationText');
    const nextBtn = document.getElementById('battleNextQuestionBtn');

    if (explText) {
      explText.innerHTML = `<strong>${isCorrect ? '✅ Correct!' : '❌ Incorrect.'}</strong> ${question.explanation}`;
    }
    if (explBox) explBox.classList.remove('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');

    // 3D Visualizer reaction & sound
    if (isCorrect) {
      this.quizScore++;
      this.dollPoints++;
      if (this.battleScene) this.battleScene.triggerDollPowerUp();
      if (this.audio) this.audio.playCorrect();
      this.addXP(30, "Quiz Battle Victory");
    } else {
      this.robotPoints++;
      if (this.battleScene) this.battleScene.triggerRobotStrike();
      if (this.audio) this.audio.playIncorrect();
    }

    this.updateBattleScores();
  }

  finishQuizBattle() {
    const questionCard = document.getElementById('battleQuestionCard');
    const resultBox = document.getElementById('battleResultSummary');
    const title = document.getElementById('battleSummaryTitle');
    const desc = document.getElementById('battleSummaryDesc');
    const xpNotice = document.getElementById('battleEarnedXpNotice');

    if (questionCard) questionCard.classList.add('hidden');
    if (resultBox) resultBox.classList.remove('hidden');

    const total = (this.currentTopic.quizQuestions || []).length;
    const percentage = Math.round((this.quizScore / total) * 100);

    // Save high score
    const tState = this.state.topicsState[this.currentTopic.id];
    if (tState) {
      tState.quizHighscore = Math.max(tState.quizHighscore || 0, this.quizScore);
      if (percentage >= 80) tState.mastered = true;
    }

    if (percentage >= 80) {
      if (title) title.textContent = "🏆 Resounding Victory in the Arena!";
      if (desc) desc.textContent = `You guided the Doll to complete victory with ${this.quizScore}/${total} correct! The Robot salutes your command of ${this.currentTopic.title}.`;
      this.unlockBadge('battle_victor', 'Battle Victor (Triumphed in the 3D Arena!)');
      if (this.audio) this.audio.playLevelUp();
    } else if (percentage >= 60) {
      if (title) title.textContent = "⚔️ A Hard-Fought Draw!";
      if (desc) desc.textContent = `You scored ${this.quizScore}/${total}. The Doll stood her ground well, but review the Robot's mnemonics for complete dominance!`;
    } else {
      if (title) title.textContent = "🛡️ The Robot Took the Match!";
      if (desc) desc.textContent = `You scored ${this.quizScore}/${total}. Do not worry—failure is merely the first iteration of understanding. Review the notes and rematch!`;
    }

    if (xpNotice) xpNotice.textContent = `Earned ${this.quizScore * 30} Total XP this battle!`;
    this.saveState();
  }

  /* ==========================================================================
     9. BOSS LEVEL (TIMED 10-QUESTION GRAND TRIAL)
     ========================================================================== */
  setupBossLevel() {
    const startBtn = document.getElementById('startBossChallengeBtn');
    const nextBtn = document.getElementById('bossNextQuestionBtn');
    const retryBtn = document.getElementById('bossRetryBtn');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startBossChallenge();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.bossIndex++;
        const questions = this.currentTopic.bossQuestions || this.currentTopic.quizQuestions || [];
        if (this.bossIndex < questions.length) {
          this.renderBossQuestion();
        } else {
          this.finishBossChallenge();
        }
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.resetBossLevel();
      });
    }
  }

  resetBossLevel() {
    if (this.bossTimer) clearInterval(this.bossTimer);
    this.bossActive = false;
    this.bossIndex = 0;
    this.bossScore = 0;
    this.bossTimeRemaining = 120;

    const intro = document.getElementById('bossIntroView');
    const arena = document.getElementById('bossActiveArenaView');
    const result = document.getElementById('bossResultView');

    if (intro) intro.classList.remove('hidden');
    if (arena) arena.classList.add('hidden');
    if (result) result.classList.add('hidden');
  }

  startBossChallenge() {
    this.resetBossLevel();
    this.bossActive = true;

    const intro = document.getElementById('bossIntroView');
    const arena = document.getElementById('bossActiveArenaView');
    if (intro) intro.classList.add('hidden');
    if (arena) arena.classList.remove('hidden');

    if (this.audio) this.audio.playBossAlert();

    // Start 120s countdown
    this.bossTimeRemaining = 120;
    this.updateBossTimerDisplay();

    this.bossTimer = setInterval(() => {
      this.bossTimeRemaining--;
      this.updateBossTimerDisplay();
      if (this.bossTimeRemaining <= 0) {
        clearInterval(this.bossTimer);
        this.finishBossChallenge(true); // timed out
      }
    }, 1000);

    this.renderBossQuestion();
  }

  updateBossTimerDisplay() {
    const timerEl = document.getElementById('bossTimerDisplay');
    if (!timerEl) return;
    const mins = Math.floor(this.bossTimeRemaining / 60);
    const secs = this.bossTimeRemaining % 60;
    timerEl.textContent = `⏱ ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    if (this.bossTimeRemaining < 20) {
      timerEl.style.color = '#B22222';
    } else {
      timerEl.style.color = '#C9A24B';
    }
  }

  renderBossQuestion() {
    const questions = this.currentTopic.bossQuestions || this.currentTopic.quizQuestions || [];
    const q = questions[this.bossIndex];
    if (!q) return;

    const counter = document.getElementById('bossQuestionCounter');
    const title = document.getElementById('bossQuestionText');
    const optionsGrid = document.getElementById('bossOptionsGrid');
    const explBox = document.getElementById('bossInstantExplanation');
    const nextBtn = document.getElementById('bossNextQuestionBtn');

    if (counter) counter.textContent = `Trial ${this.bossIndex + 1} of ${questions.length}`;
    if (title) title.textContent = q.question;
    if (explBox) explBox.classList.add('hidden');
    if (nextBtn) nextBtn.classList.add('hidden');

    if (optionsGrid) {
      optionsGrid.innerHTML = '';
      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'boss-option-btn';
        btn.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + idx)}</span> <span>${optText}</span>`;

        btn.addEventListener('click', () => {
          this.handleBossAnswer(idx, q, optionsGrid);
        });

        optionsGrid.appendChild(btn);
      });
    }
  }

  handleBossAnswer(selectedIndex, question, optionsGrid) {
    const allBtns = optionsGrid.querySelectorAll('.boss-option-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = selectedIndex === question.correct;
    if (isCorrect) {
      this.bossScore++;
      if (this.audio) this.audio.playCorrect();
    } else {
      if (this.audio) this.audio.playIncorrect();
    }

    allBtns.forEach((btn, idx) => {
      if (idx === question.correct) btn.classList.add('correct-choice');
      else if (idx === selectedIndex && !isCorrect) btn.classList.add('wrong-choice');
    });

    const explBox = document.getElementById('bossInstantExplanation');
    const explText = document.getElementById('bossExplanationText');
    const nextBtn = document.getElementById('bossNextQuestionBtn');

    if (explText) {
      explText.innerHTML = `<strong>${isCorrect ? '✅ Flawless!' : '❌ Missed.'}</strong> ${question.explanation}`;
    }
    if (explBox) explBox.classList.remove('hidden');
    if (nextBtn) nextBtn.classList.remove('hidden');
  }

  finishBossChallenge(timedOut = false) {
    if (this.bossTimer) clearInterval(this.bossTimer);
    this.bossActive = false;

    const arena = document.getElementById('bossActiveArenaView');
    const result = document.getElementById('bossResultView');
    const title = document.getElementById('bossResultTitle');
    const desc = document.getElementById('bossResultDesc');

    if (arena) arena.classList.add('hidden');
    if (result) result.classList.remove('hidden');

    const total = (this.currentTopic.bossQuestions || []).length || 10;
    const passed = this.bossScore >= Math.ceil(total * 0.7);

    if (passed) {
      if (title) title.textContent = "👑 The Grand Trial is Won! Topic Conquered!";
      if (desc) desc.textContent = `Remarkable fortitude! You answered ${this.bossScore}/${total} correctly against the royal clock! You have earned the Crown of Mastery!`;
      this.addXP(250, "Boss Trial Conquered");
      this.unlockBadge('boss_slayer', 'Boss Slayer (Conquered the 10-Question Trial!)');
      this.unlockTrophy('crown', 'Royal Crown of Mentorship');
      if (this.audio) this.audio.playLevelUp();

      const tState = this.state.topicsState[this.currentTopic.id];
      if (tState) tState.bossDefeated = true;
    } else {
      if (title) title.textContent = timedOut ? "⌛ Time Expired in the Trial!" : "⚔️ The Trial Withstood Your Strike!";
      if (desc) desc.textContent = `You scored ${this.bossScore}/${total} correct. The Boss requires 70% accuracy to yield. Refresh your mind with flashcards and retry!`;
    }

    this.saveState();
  }

  /* ==========================================================================
     10. 3D FLASHCARDS & MEMORY MATCH MINI-GAME
     ========================================================================== */
  setupFlashcards() {
    // Mode switcher
    const flashBtn = document.getElementById('viewFlashcardsModeBtn');
    const matchBtn = document.getElementById('viewMemoryMatchModeBtn');
    const flashView = document.getElementById('flashcardsContainerView');
    const matchView = document.getElementById('memoryMatchContainerView');

    if (flashBtn && matchBtn) {
      flashBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playClick();
        flashBtn.classList.add('active');
        matchBtn.classList.remove('active');
        if (flashView) flashView.classList.remove('hidden');
        if (matchView) matchView.classList.add('hidden');
      });

      matchBtn.addEventListener('click', () => {
        if (this.audio) this.audio.playClick();
        matchBtn.classList.add('active');
        flashBtn.classList.remove('active');
        if (matchView) matchView.classList.remove('hidden');
        if (flashView) flashView.classList.add('hidden');
        this.initMemoryMatch();
      });
    }

    // Flashcard Flip & Next/Prev
    const cardEl = document.getElementById('royalFlashcard3D');
    const flipBtn = document.getElementById('flipFlashcardBtn');
    const prevBtn = document.getElementById('prevFlashcardBtn');
    const nextBtn = document.getElementById('nextFlashcardBtn');

    if (cardEl) {
      cardEl.addEventListener('click', () => this.toggleCardFlip());
    }
    if (flipBtn) {
      flipBtn.addEventListener('click', () => this.toggleCardFlip());
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const cards = this.currentTopic.flashcards || [];
        if (cards.length === 0) return;
        this.cardIndex = (this.cardIndex - 1 + cards.length) % cards.length;
        this.renderFlashcard();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const cards = this.currentTopic.flashcards || [];
        if (cards.length === 0) return;
        this.cardIndex = (this.cardIndex + 1) % cards.length;
        this.renderFlashcard();
      });
    }

    // "Know This" reward button
    const knowBtn = document.getElementById('knowFlashcardBtn');
    if (knowBtn) {
      knowBtn.addEventListener('click', () => {
        this.addXP(15, "Flashcard Mastered");
        if (this.audio) this.audio.playCorrect();
        const cards = this.currentTopic.flashcards || [];
        this.cardIndex = (this.cardIndex + 1) % cards.length;
        this.renderFlashcard();
      });
    }
  }

  resetFlashcards() {
    this.cardIndex = 0;
    this.cardFlipped = false;
    this.renderFlashcard();
  }

  toggleCardFlip() {
    const card = document.getElementById('royalFlashcard3D');
    if (!card) return;
    this.cardFlipped = !this.cardFlipped;
    card.classList.toggle('flipped', this.cardFlipped);
    if (this.audio) this.audio.playFlip();
  }

  renderFlashcard() {
    const cards = this.currentTopic.flashcards || [];
    const card = cards[this.cardIndex];
    if (!card) return;

    this.cardFlipped = false;
    const cardEl = document.getElementById('royalFlashcard3D');
    if (cardEl) cardEl.classList.remove('flipped');

    const frontText = document.getElementById('flashcardFrontContent');
    const backText = document.getElementById('flashcardBackContent');
    const counter = document.getElementById('flashcardCounterText');

    if (frontText) frontText.textContent = card.front;
    if (backText) backText.textContent = card.back;
    if (counter) counter.textContent = `Card ${this.cardIndex + 1} of ${cards.length}`;
  }

  // Memory Match mini-game
  initMemoryMatch() {
    const pairs = this.currentTopic.memoryPairs || [];
    const grid = document.getElementById('memoryCardsGrid');
    const statusText = document.getElementById('memoryGameStatus');

    if (!grid || pairs.length === 0) return;

    this.flippedCards = [];
    this.matchedPairs = 0;
    this.memoryLocked = false;
    if (statusText) statusText.textContent = `Pairs Matched: 0 / ${pairs.length}`;

    // Flatten into 2 cards per pair (label card and match card)
    const deck = [];
    pairs.forEach(p => {
      deck.push({ id: p.id, type: 'label', text: p.label });
      deck.push({ id: p.id, type: 'match', text: p.match });
    });

    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);

    grid.innerHTML = '';
    deck.forEach((cardData, idx) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card-3d';
      cardEl.setAttribute('data-pair-id', cardData.id);
      cardEl.setAttribute('data-index', idx);

      cardEl.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-card-front">
            <span class="royal-crest-symbol">⚜</span>
          </div>
          <div class="memory-card-back">
            <span class="memory-card-text">${cardData.text}</span>
          </div>
        </div>
      `;

      cardEl.addEventListener('click', () => {
        this.handleMemoryCardClick(cardEl, cardData, pairs.length);
      });

      grid.appendChild(cardEl);
    });
  }

  handleMemoryCardClick(cardEl, cardData, totalPairs) {
    if (this.memoryLocked) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    cardEl.classList.add('flipped');
    if (this.audio) this.audio.playFlip();

    this.flippedCards.push({ element: cardEl, data: cardData });

    if (this.flippedCards.length === 2) {
      this.memoryLocked = true;
      const [c1, c2] = this.flippedCards;

      if (c1.data.id === c2.data.id && c1.data.type !== c2.data.type) {
        // Matched!
        setTimeout(() => {
          c1.element.classList.add('matched');
          c2.element.classList.add('matched');
          this.matchedPairs++;
          if (this.audio) this.audio.playCorrect();

          const statusText = document.getElementById('memoryGameStatus');
          if (statusText) statusText.textContent = `Pairs Matched: ${this.matchedPairs} / ${totalPairs}`;

          this.flippedCards = [];
          this.memoryLocked = false;

          if (this.matchedPairs === totalPairs) {
            this.showToast("🎉 All Memory Pairs Matched! +80 XP!", "success");
            this.addXP(80, "Memory Match Victory");
            this.unlockBadge('memory_maestro', 'Memory Maestro (Completed Match Mini-game)');
            if (this.audio) this.audio.playLevelUp();
          }
        }, 500);
      } else {
        // Not a match, flip back
        setTimeout(() => {
          c1.element.classList.remove('flipped');
          c2.element.classList.remove('flipped');
          this.flippedCards = [];
          this.memoryLocked = false;
        }, 900);
      }
    }
  }

  /* ==========================================================================
     11. SPACED REVISION PLANNER (DAY 1, 3, 7, 14)
     ========================================================================== */
  setupSpacedPlanner() {
    const addCurrentBtn = document.getElementById('scheduleCurrentTopicBtn');
    if (addCurrentBtn) {
      addCurrentBtn.addEventListener('click', () => {
        this.addSpacedRevision(this.currentTopic.id, this.currentTopic.title);
      });
    }
    this.renderPlanner();
  }

  addSpacedRevision(topicId, topicTitle) {
    this.state.revisionItems = this.state.revisionItems || [];
    const exists = this.state.revisionItems.find(r => r.topicId === topicId);

    const now = new Date();
    const intervals = [
      { day: 1, label: "Day 1 (Immediate Consolidation)", due: new Date(now.getTime() + 1 * 86400000).toISOString().split('T')[0], done: false },
      { day: 3, label: "Day 3 (Active Recall Check)", due: new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0], done: false },
      { day: 7, label: "Day 7 (Deep Memory Locking)", due: new Date(now.getTime() + 7 * 86400000).toISOString().split('T')[0], done: false },
      { day: 14, label: "Day 14 (Permanent Mastery)", due: new Date(now.getTime() + 14 * 86400000).toISOString().split('T')[0], done: false }
    ];

    if (exists) {
      exists.startDate = now.toISOString().split('T')[0];
      exists.intervals = intervals;
      this.showToast(`Updated Spaced Revision schedule for "${topicTitle}"!`, "info");
    } else {
      this.state.revisionItems.push({
        topicId,
        topicTitle,
        startDate: now.toISOString().split('T')[0],
        intervals
      });
      this.showToast(`Scheduled Spaced Revision for "${topicTitle}"! 📅`, "success");
    }

    this.saveState();
    this.renderPlanner();
  }

  renderPlanner() {
    const list = document.getElementById('spacedPlannerList');
    if (!list) return;

    const items = this.state.revisionItems || [];
    if (items.length === 0) {
      list.innerHTML = `
        <div class="empty-planner-notice">
          <p>No revision sessions currently scheduled. Complete a teach-back session or click "Schedule Current Topic" above to generate your scientific spaced intervals!</p>
        </div>
      `;
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    list.innerHTML = '';

    items.forEach((item, itemIdx) => {
      const card = document.createElement('div');
      card.className = 'planner-topic-schedule-card';

      let intervalsHtml = '';
      item.intervals.forEach((step, sIdx) => {
        const isDueToday = step.due === today && !step.done;
        const isOverdue = step.due < today && !step.done;

        intervalsHtml += `
          <div class="interval-step-pill ${step.done ? 'step-completed' : (isDueToday ? 'step-due' : '')}">
            <input type="checkbox" id="rev_${itemIdx}_${sIdx}" ${step.done ? 'checked' : ''} data-item="${itemIdx}" data-step="${sIdx}">
            <label for="rev_${itemIdx}_${sIdx}">
              <strong>${step.label}</strong>
              <span class="step-date">Due: ${step.due} ${isDueToday ? '🔥 (TODAY!)' : (isOverdue ? '⚠️' : '')}</span>
            </label>
          </div>
        `;
      });

      card.innerHTML = `
        <div class="planner-card-header">
          <h4>⚜ ${item.topicTitle}</h4>
          <span class="planner-started-date">Started: ${item.startDate}</span>
        </div>
        <div class="planner-intervals-grid">
          ${intervalsHtml}
        </div>
      `;

      card.querySelectorAll('input[type="checkbox"]').forEach(box => {
        box.addEventListener('change', (e) => {
          const it = parseInt(box.getAttribute('data-item'));
          const st = parseInt(box.getAttribute('data-step'));
          this.state.revisionItems[it].intervals[st].done = box.checked;
          if (box.checked) {
            this.addXP(20, "Spaced Revision Completed");
            if (this.audio) this.audio.playCorrect();
          }
          this.saveState();
          this.renderPlanner();
        });
      });

      list.appendChild(card);
    });
  }

  /* ==========================================================================
     12. PROGRESS DASHBOARD & ROYAL TREASURY
     ========================================================================== */
  setupDashboard() {
    // Trophy selector pills
    const trophyPills = document.querySelectorAll('.trophy-selector-pill');
    trophyPills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (this.audio) this.audio.playClick();
        trophyPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const trophy = pill.getAttribute('data-trophy');
        if (this.trophyViewer) {
          this.trophyViewer.loadTrophy(trophy);
        }
      });
    });

    // Reset Progress button
    const resetBtn = document.getElementById('resetAllProgressBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset all XP, streaks, and quiz records to initial state?")) {
          localStorage.removeItem('royal_peer_kit_state');
          this.loadState();
          this.renderHeaderStats();
          this.renderDashboard();
          this.showToast("All progress reset.", "info");
        }
      });
    }
  }

  renderDashboard() {
    const lvl = this.getLevelInfo();

    // Dashboard Level & XP
    const lvlTitle = document.getElementById('dashLevelTitle');
    const lvlBadge = document.getElementById('dashLevelBadgeIcon');
    const xpCurrent = document.getElementById('dashCurrentXp');
    const xpNext = document.getElementById('dashNextLevelXp');
    const xpBar = document.getElementById('dashXpProgressBarFill');
    const streakEl = document.getElementById('dashStreakCount');

    if (lvlTitle) lvlTitle.textContent = lvl.title;
    if (lvlBadge) lvlBadge.textContent = lvl.badgeIcon;
    if (xpCurrent) xpCurrent.textContent = `${this.state.xp} XP`;
    if (xpNext) xpNext.textContent = `Next Rank: ${lvl.nextXP} XP`;
    if (xpBar) xpBar.style.width = `${lvl.progress}%`;
    if (streakEl) streakEl.textContent = `${this.state.streak} Days`;

    // Weak vs Strong breakdown
    this.renderWeakVsStrongTopics();

    // Badges
    this.renderBadges();

    // 3D Treasury
    this.renderTreasury();
  }

  renderWeakVsStrongTopics() {
    const weakList = document.getElementById('dashWeakTopicsList');
    const strongList = document.getElementById('dashStrongTopicsList');

    if (!weakList || !strongList) return;

    weakList.innerHTML = '';
    strongList.innerHTML = '';

    this.topics.forEach(t => {
      const tState = this.state.topicsState[t.id] || { confidence: 2 };
      const isStrong = (tState.confidence >= 4) || (tState.mastered) || (tState.quizHighscore >= 4);

      const item = document.createElement('div');
      item.className = 'topic-status-pill';
      item.innerHTML = `
        <span class="topic-pill-name">${t.title}</span>
        <span class="topic-pill-conf">${'★'.repeat(tState.confidence)}${'☆'.repeat(5 - tState.confidence)}</span>
      `;
      item.addEventListener('click', () => {
        this.loadTopic(t.id);
        this.navigateTo('explainerSection');
      });

      if (isStrong) {
        strongList.appendChild(item);
      } else {
        weakList.appendChild(item);
      }
    });

    if (weakList.children.length === 0) {
      weakList.innerHTML = `<p class="dash-empty-hint">✨ Wonderful! You have no weak topics left!</p>`;
    }
    if (strongList.children.length === 0) {
      strongList.innerHTML = `<p class="dash-empty-hint">Master a topic or achieve high confidence to see it here.</p>`;
    }
  }

  renderBadges() {
    const container = document.getElementById('dashBadgesGrid');
    if (!container) return;

    const allBadges = [
      { id: 'first_lesson', icon: '📜', name: 'First Lesson', desc: 'Commenced the Royal Apprenticeship' },
      { id: 'feynman_disciple', icon: '🧠', name: 'Feynman Disciple', desc: 'Taught a concept back to the Doll' },
      { id: 'battle_victor', icon: '⚔️', name: 'Battle Victor', desc: 'Scored 80%+ in the 3D Quiz Arena' },
      { id: 'memory_maestro', icon: '🃏', name: 'Memory Maestro', desc: 'Cleared 3D Memory Match cards' },
      { id: 'boss_slayer', icon: '👑', name: 'Boss Slayer', desc: 'Conquered the 10-Question Trial' },
      { id: 'grand_sage', icon: '✨', name: 'Grand Sage', desc: 'Reached 1,200+ XP in the Academy' }
    ];

    container.innerHTML = '';
    allBadges.forEach(b => {
      const isUnlocked = this.state.unlockedBadges.includes(b.id);
      const badgeDiv = document.createElement('div');
      badgeDiv.className = `badge-display-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`;
      badgeDiv.innerHTML = `
        <div class="badge-icon-wrap">${b.icon}</div>
        <div class="badge-title-text">${b.name}</div>
        <div class="badge-desc-text">${b.desc}</div>
        <div class="badge-status-tag">${isUnlocked ? 'Unlocked ⚜' : 'Locked 🔒'}</div>
      `;
      container.appendChild(badgeDiv);
    });
  }

  renderTreasury() {
    const rubyStatus = document.getElementById('trophyRubyStatus');
    const emeraldStatus = document.getElementById('trophyEmeraldStatus');
    const sapphireStatus = document.getElementById('trophySapphireStatus');
    const crownStatus = document.getElementById('trophyCrownStatus');

    const unlocked = this.state.unlockedTrophies || [];

    if (rubyStatus) rubyStatus.textContent = unlocked.includes('ruby') ? '✨ Unlocked' : '🔒 Locked';
    if (emeraldStatus) emeraldStatus.textContent = unlocked.includes('emerald') ? '✨ Unlocked' : '🔒 Locked (3-day streak)';
    if (sapphireStatus) sapphireStatus.textContent = unlocked.includes('sapphire') ? '✨ Unlocked' : '🔒 Locked (Scholar Rank)';
    if (crownStatus) crownStatus.textContent = unlocked.includes('crown') ? '✨ Unlocked' : '🔒 Locked (Conquer Boss / Grand Mentor)';
  }

  /* ==========================================================================
     13. GEMINI API KEY MODAL & SOUND CONTROLS
     ========================================================================== */
  setupApiKeyModal() {
    const openBtn = document.getElementById('openApiKeyModalBtn');
    const modal = document.getElementById('apiKeyModal');
    const closeBtn = document.getElementById('closeApiKeyModalBtn');
    const saveBtn = document.getElementById('saveApiKeyBtn');
    const clearBtn = document.getElementById('clearApiKeyBtn');
    const input = document.getElementById('geminiApiKeyInput');
    const statusEl = document.getElementById('apiKeyStatusIndicator');

    const updateStatus = () => {
      if (this.ai.hasApiKey()) {
        if (statusEl) {
          statusEl.innerHTML = `<span class="status-badge-active">● Live Gemini AI Active</span>`;
        }
        if (input) input.value = this.ai.getApiKey();
      } else {
        if (statusEl) {
          statusEl.innerHTML = `<span class="status-badge-offline">○ Offline Fallback Engine Active (No Key Needed)</span>`;
        }
        if (input) input.value = '';
      }
    };

    updateStatus();

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        updateStatus();
        modal.classList.remove('hidden');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    }

    if (saveBtn && input && modal) {
      saveBtn.addEventListener('click', () => {
        const val = input.value.trim();
        this.ai.setApiKey(val);
        updateStatus();
        modal.classList.add('hidden');
        this.showToast(val ? "Gemini API Key activated for live teaching!" : "API Key cleared; offline mode active.", "success");
      });
    }

    if (clearBtn && input) {
      clearBtn.addEventListener('click', () => {
        this.ai.setApiKey('');
        input.value = '';
        updateStatus();
        this.showToast("API key removed. Running 100% offline.", "info");
      });
    }
  }

  setupSoundControls() {
    const muteBtn = document.getElementById('muteSoundToggleBtn');
    if (!muteBtn) return;

    const updateIcon = () => {
      if (this.audio.isMuted) {
        muteBtn.innerHTML = `<span>🔇 Audio Off</span>`;
      } else {
        muteBtn.innerHTML = `<span>🔔 Audio On</span>`;
      }
    };

    updateIcon();

    muteBtn.addEventListener('click', () => {
      const isMuted = this.audio.toggleMute();
      updateIcon();
      this.showToast(isMuted ? "Sound effects muted" : "Sound effects enabled", "info");
    });
  }

  /* ==========================================================================
     14. HEADER STATS & NOTIFICATIONS
     ========================================================================== */
  renderHeaderStats() {
    const xpEl = document.getElementById('headerXpCounter');
    const levelEl = document.getElementById('headerLevelTitle');
    const streakEl = document.getElementById('headerStreakCount');

    const lvl = this.getLevelInfo();

    if (xpEl) xpEl.textContent = `${this.state.xp} XP`;
    if (levelEl) levelEl.textContent = `${lvl.badgeIcon} ${lvl.title}`;
    if (streakEl) streakEl.textContent = `🔥 ${this.state.streak}d`;
  }

  showToast(message, type = "info") {
    let container = document.getElementById('royalToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'royalToastContainer';
      container.className = 'royal-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `royal-toast-msg toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-show');
    }, 20);

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  showLevelUpModal(newLevel) {
    const modal = document.createElement('div');
    modal.className = 'royal-modal-overlay level-up-modal-overlay';
    modal.innerHTML = `
      <div class="royal-modal-card level-up-card">
        <div class="level-up-crown-icon">👑</div>
        <h2 class="level-up-title">Royal Ascension!</h2>
        <p class="level-up-desc">By decree of the Academy, your diligent peer study has elevated you to:</p>
        <div class="level-up-badge">${newLevel}</div>
        <p class="level-up-perk">New privileges and honors unlocked in the Royal Treasury!</p>
        <button class="royal-btn-primary modal-close-btn" id="closeLevelUpBtn">
          <span>Accept Royal Rank ⚜</span>
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#closeLevelUpBtn').addEventListener('click', () => {
      modal.remove();
    });
  }
}

// Instantiate app once window is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.peerApp = new PeerTeachingKitApp();
  window.peerApp.init();
});
