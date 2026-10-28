/**
 * AI Peer Teaching Kit - Gemini API Integration & Intelligent Offline Fallback
 * Works completely offline out-of-the-box with built-in rubrics,
 * and seamlessly calls Gemini 1.5 / 2.0 when a key is provided.
 */

class AIService {
  constructor() {
    this.storageKey = 'royal_peer_gemini_key';
    const envKey = (typeof window !== 'undefined' && window.ENV && window.ENV.GEMINI_API_KEY) ? window.ENV.GEMINI_API_KEY.trim() : '';
    this.apiKey = localStorage.getItem(this.storageKey) || envKey || '';
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  setApiKey(key) {
    this.apiKey = (key || '').trim();
    if (this.apiKey) {
      localStorage.setItem(this.storageKey, this.apiKey);
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  /**
   * Evaluate a student's teach-back explanation
   */
  async evaluateTeachBack(topic, userExplanation) {
    // 1. If Gemini API key is available and online, attempt live call
    if (this.hasApiKey() && navigator.onLine) {
      try {
        const liveResult = await this.callGeminiEvaluate(topic, userExplanation);
        if (liveResult) return liveResult;
      } catch (err) {
        console.warn("Gemini API call failed or timed out, gracefully falling back to offline evaluator:", err);
      }
    }

    // 2. Intelligent Offline Fallback Evaluation
    return this.evaluateOffline(topic, userExplanation);
  }

  /**
   * Offline evaluation based on rubric keywords, length, structure, and concept matching
   */
  evaluateOffline(topic, explanation) {
    const text = (explanation || '').trim();
    const rubric = topic.teachBackRubric || {
      conceptChecklist: [],
      requiredKeywords: []
    };

    if (text.length < 25) {
      return {
        score: 35,
        passed: false,
        xpEarned: 25,
        dollReaction: "Oh! That was very brief! Can you explain it a bit more with an analogy or example?",
        whatWasCorrect: "You started, but the explanation is too short to judge complete understanding.",
        whatWasMissing: "Add details on how it works, what problems it solves, and give a real-world example.",
        matchedConcepts: ["Attempted explanation"],
        missingConcepts: ["Core definition", "Practical example", "Underlying mechanism"]
      };
    }

    let calculatedScore = 40; // Base score for thoughtful attempt
    const matched = [];
    const missing = [];

    // Check checklist items
    if (rubric.conceptChecklist && rubric.conceptChecklist.length > 0) {
      rubric.conceptChecklist.forEach(item => {
        if (item.regex && item.regex.test(text)) {
          calculatedScore += item.weight || 15;
          matched.push(item.name);
        } else {
          missing.push(item.name);
        }
      });
    } else {
      // Generic topic heuristic
      const words = text.split(/\s+/).length;
      if (words > 40) calculatedScore += 30;
      if (text.includes("because") || text.includes("example") || text.includes("like")) calculatedScore += 20;
      matched.push("Clear communication effort");
    }

    // Length and depth bonus
    if (text.length > 200) calculatedScore += 5;
    if (text.length > 400) calculatedScore += 5;

    // Cap between 0 and 100
    const finalScore = Math.min(100, Math.max(30, Math.round(calculatedScore)));
    const passed = finalScore >= 65;

    let dollReaction = "";
    if (finalScore >= 90) {
      dollReaction = "✨ Splendid! You taught me so clearly that I feel like a scholar myself! Your analogy and core principles were spot on!";
    } else if (finalScore >= 75) {
      dollReaction = "🌟 I understand it so much better now! You grasped the main pillars well. Just polish the subtle nuances and you'll be a master mentor!";
    } else if (finalScore >= 60) {
      dollReaction = "📖 Good effort! I caught the main idea, but some important steps were left out. Take another peek at the Robot's explanation and try again!";
    } else {
      dollReaction = "🤔 Hmm, I'm still a bit puzzled. Could you simplify the concepts and explain what stopping condition or mechanism keeps it all together?";
    }

    return {
      score: finalScore,
      passed,
      xpEarned: Math.round(finalScore * 0.8),
      dollReaction,
      whatWasCorrect: matched.length > 0
        ? `You accurately covered: ${matched.join(", ")}.`
        : "You captured the general spirit of the topic.",
      whatWasMissing: missing.length > 0
        ? `Could be deepened by clarifying: ${missing.join(", ")}.`
        : "Excellent depth! Try incorporating edge cases or asymptotic complexity next.",
      matchedConcepts: matched,
      missingConcepts: missing
    };
  }

  /**
   * Live Gemini 1.5/2.0 API call for teach-back grading
   */
  async callGeminiEvaluate(topic, explanation) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    const prompt = `
You are the "Doll", an eager, royal apprentice student in an educational peer-teaching kit.
The user (a student) is practicing the Feynman Technique by teaching you the topic: "${topic.title}".

Here is what the user taught you:
"""
${explanation}
"""

Evaluate their explanation strictly as JSON with this exact schema:
{
  "score": <number between 0 and 100 representing conceptual accuracy and clarity>,
  "passed": <boolean, true if score >= 65>,
  "dollReaction": "<in character as the Doll, 1-2 warm, royal, encouraging sentences>",
  "whatWasCorrect": "<concise paragraph highlighting what they explained accurately>",
  "whatWasMissing": "<concise paragraph pointing out missing concepts or misconceptions>"
}

Output ONLY valid JSON. No markdown backticks, no extra text.`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      score: parsed.score || 75,
      passed: parsed.score >= 65,
      xpEarned: Math.round((parsed.score || 75) * 0.8),
      dollReaction: parsed.dollReaction || "Thank you for teaching me!",
      whatWasCorrect: parsed.whatWasCorrect || "Good conceptual overview.",
      whatWasMissing: parsed.whatWasMissing || "Review edge cases.",
      matchedConcepts: ["AI verified understanding"],
      missingConcepts: []
    };
  }

  /**
   * Generate an explanation for a brand new custom topic typed by the user
   */
  async generateCustomTopic(topicTitle, subject = "General Academics") {
    if (this.hasApiKey() && navigator.onLine) {
      try {
        const liveTopic = await this.callGeminiCustomTopic(topicTitle, subject);
        if (liveTopic) return liveTopic;
      } catch (e) {
        console.warn("Live topic creation failed, generating local template:", e);
      }
    }

    // Local procedural topic builder
    return {
      id: "custom-" + Date.now(),
      title: topicTitle,
      subject: subject || "Custom Study Domain",
      badge: "✨ Custom Topic",
      confidenceDefault: 2,
      difficulty: "Custom",
      summary: `In-depth exploration and peer mastery of ${topicTitle}.`,
      robotExplanation: {
        intro: `Greetings, explorer! Let us analyze "${topicTitle}" from first principles.`,
        analogy: `Think of "${topicTitle}" like a bustling royal courier network: every message has a designated sender, path, and recipient to avoid chaos.`,
        keyPoints: [
          `Core Concept: ${topicTitle} revolves around clear structural rules and predictable state transformations.`,
          `Practical Utility: It solves efficiency bottlenecks and organizes complex systems into manageable units.`,
          `Common Pitfall: Beware of boundary conditions and unhandled assumptions when applying it.`,
          `Best Practice: Break down each component step-by-step before attempting whole-system synthesis.`
        ],
        mnemonic: `Remember: Define the foundation, trace the flow, verify the outcome!`,
        interactivePrompt: `Ask yourself: What is the primary problem that ${topicTitle} was created to solve?`
      },
      teachBackRubric: {
        targetAudience: "A junior apprentice seeking practical clarity.",
        requiredKeywords: ["core", "system", "process", "example", "result"],
        idealAnswerSummary: `Clear definition of ${topicTitle}, why it is used, and how it behaves in practice.`,
        conceptChecklist: [
          { name: "Explained definition & objective", weight: 30, regex: /definition|means|purpose|goal|why/i },
          { name: "Provided everyday analogy or example", weight: 35, regex: /like|example|imagine|instance/i },
          { name: "Identified key components or mechanism", weight: 35, regex: /works|step|mechanism|system/i }
        ]
      },
      quizQuestions: [
        {
          question: `What is the fundamental objective of ${topicTitle}?`,
          options: [
            `To organize, simplify, and solve problems systematically`,
            `To increase system latency`,
            `To bypass security and protocols`,
            `To delete operational history`
          ],
          correct: 0,
          explanation: `${topicTitle} is designed to streamline processes, remove ambiguity, and optimize solutions.`
        },
        {
          question: `Which methodology yields the deepest mastery of ${topicTitle}?`,
          options: [
            `Passive memorization without practice`,
            `Teaching it back in plain words (The Feynman Technique)`,
            `Skipping definitions and guessing`,
            `Ignoring foundational principles`
          ],
          correct: 1,
          explanation: `Explaining concepts simply to another person reveals blind spots and cements lasting neural pathways.`
        },
        {
          question: `When analyzing ${topicTitle}, what should be verified first?`,
          options: [
            `The baseline assumptions and prerequisites`,
            `The color of the presentation slides`,
            `The computer wallpaper`,
            `Unrelated historical trivia`
          ],
          correct: 0,
          explanation: `Verifying foundational assumptions ensures your reasoning rests on solid bedrock.`
        },
        {
          question: `What is the risk of over-complicating ${topicTitle}?`,
          options: [
            `Maintenance overhead and conceptual confusion`,
            `Instant perfection`,
            `Zero memory usage`,
            `Automatic exam exemption`
          ],
          correct: 0,
          explanation: `Over-engineering increases failure points; simplicity and clarity are hallmarks of true mastery.`
        },
        {
          question: `How can you best test your retention of ${topicTitle} over time?`,
          options: [
            `Spaced repetition intervals (Day 1, 3, 7, 14)`,
            `Cramming all night once a year`,
            `Never reviewing the material`,
            `Discarding all notes immediately`
          ],
          correct: 0,
          explanation: `Spaced repetition combats the Ebbinghaus forgetting curve and transfers insights into long-term memory.`
        }
      ],
      bossQuestions: [
        {
          question: `What advanced paradigm governs deep mastery of ${topicTitle}?`,
          options: ["First-principles decomposition and structural synthesis", "Superficial skimming", "Rote copying", "Random iteration"],
          correct: 0,
          explanation: "Mastery requires dissecting a domain into irreducible truths and reasoning upwards."
        },
        {
          question: `In production environments, how is ${topicTitle} rigorously validated?`,
          options: ["Systematic testing, benchmarking, and peer review", "Guesswork", "Assuming zero bugs exist", "Disabling all monitors"],
          correct: 0,
          explanation: "Empirical benchmarking and peer verification validate reliability."
        },
        {
          question: `What cognitive bias most frequently leads students to overestimate their understanding of ${topicTitle}?`,
          options: ["The Illusion of Explanatory Depth", "Anchoring bias", "Confirmation bias", "Gambler's fallacy"],
          correct: 0,
          explanation: "The Illusion of Explanatory Depth occurs when someone believes they understand a topic until forced to explain it step-by-step."
        },
        {
          question: `Which approach best prevents regression when applying ${topicTitle}?`,
          options: ["Continuous iterative review and automated sanity checks", "Ignoring warnings", "Never testing edge cases", "Deleting logs"],
          correct: 0,
          explanation: "Continuous validation catches edge cases before they escalate."
        },
        {
          question: `How does teaching ${topicTitle} to a peer improve the teacher's own neural encoding?`,
          options: ["It forces active recall, conceptual reorganization, and gap identification", "It drains mental energy with no benefit", "It causes retroactive amnesia", "It has no scientific effect"],
          correct: 0,
          explanation: "Peer teaching engages metacognition, requiring the teacher to restructure mental models."
        },
        {
          question: `What metric indicates true fluency in ${topicTitle}?`,
          options: ["The ability to explain it clearly without jargon to a novice", "Reciting complex formulas from memory without understanding", "Using 50 acronyms in a row", "Speaking quickly"],
          correct: 0,
          explanation: "True understanding is proven by translating complex nuances into lucid, accessible terms."
        },
        {
          question: `What role does deliberate practice play in mastering ${topicTitle}?`,
          options: ["Focusing on weak sub-components with immediate corrective feedback", "Repeating only easy tasks you already know", "Practicing while asleep", "Skipping difficult problems"],
          correct: 0,
          explanation: "Deliberate practice targets specific weaknesses right at the edge of current ability."
        },
        {
          question: `When encountering an anomalous outcome in ${topicTitle}, what is the scientific response?`,
          options: ["Isolate variables and trace causality back to the root cause", "Ignore the anomaly", "Blame the hardware blindly", "Change the question"],
          correct: 0,
          explanation: "Anomalies provide the greatest learning opportunities when methodically investigated."
        },
        {
          question: `Why is cross-domain analogy effective when studying ${topicTitle}?`,
          options: ["It anchors unfamiliar abstract concepts to well-established neural schemas", "It confuses the brain", "It makes exams longer", "It avoids studying"],
          correct: 0,
          explanation: "Analogies bridge unfamiliar concepts with intuitive real-world mental models."
        },
        {
          question: `What is the ultimate milestone in the Royal Peer Apprenticeship?`,
          options: ["Attaining Royal Mentor status and guiding fellow students", "Closing the laptop forever", "Scoring 100 on one quiz and quitting", "Memorizing without understanding"],
          correct: 0,
          explanation: "The highest academic tier is attained when you can mentor and uplift others."
        }
      ],
      flashcards: [
        { front: `Core Definition of ${topicTitle}`, back: `A structured discipline focusing on first principles, robust models, and systematic problem solving.` },
        { front: `Why use the Feynman Technique for ${topicTitle}?`, back: `Teaching it back simply forces active recall and immediately reveals gaps in understanding.` },
        { front: `What is the Spaced Repetition strategy?`, back: `Reviewing at Days 1, 3, 7, and 14 to permanently lock insights into long-term memory.` },
        { front: `What is the Golden Rule of Mastery?`, back: `If you cannot explain it simply, you do not understand it well enough.` }
      ],
      memoryPairs: [
        { id: "cm1", label: "Core Concept", match: "Foundation of " + topicTitle },
        { id: "cm2", label: "Feynman Step", match: "Teach back in plain terms" },
        { id: "cm3", label: "Deliberate Review", match: "Target weak points directly" },
        { id: "cm4", label: "Grand Mastery", match: "Explain without jargon" }
      ]
    };
  }

  async callGeminiCustomTopic(topicTitle, subject) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;

    const prompt = `
Create an educational module for a college learning site for the topic: "${topicTitle}" (Subject: "${subject}").
Output strictly valid JSON with this structure:
{
  "summary": "1 sentence overview",
  "robotExplanation": {
    "intro": "Warm scholarly greeting introducing the topic",
    "analogy": "An intuitive everyday analogy explaining the topic clearly",
    "keyPoints": ["Point 1", "Point 2", "Point 3", "Point 4"],
    "mnemonic": "A catchy memory hook or rhyme",
    "interactivePrompt": "A quick calculation or rule of thumb"
  },
  "teachBackRubric": {
    "targetAudience": "A beginner student",
    "requiredKeywords": ["keyword1", "keyword2", "keyword3"],
    "idealAnswerSummary": "Ideal short summary of the topic",
    "conceptChecklist": [
      {"name": "Concept 1", "weight": 35},
      {"name": "Concept 2", "weight": 35},
      {"name": "Concept 3", "weight": 30}
    ]
  },
  "quizQuestions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why option 0 is correct"
    }
  ]
}
Provide exactly 5 quizQuestions. Output ONLY the JSON object, no markdown, no other text.`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1400 }
      })
    });

    if (!response.ok) throw new Error("Gemini response not ok: " + response.status);
    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const clean = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);

    return {
      id: 'custom-' + Date.now(),
      title: topicTitle,
      subject: subject || 'Specialized Domain',
      badge: '✨ Custom Topic',
      confidenceDefault: 2,
      difficulty: 'Intermediate',
      summary: parsed.summary,
      robotExplanation: parsed.robotExplanation,
      teachBackRubric: parsed.teachBackRubric,
      quizQuestions: parsed.quizQuestions,
      bossQuestions: parsed.quizQuestions, // can duplicate or expand
      flashcards: [
        { front: `What is ${topicTitle}?`, back: parsed.summary },
        { front: `Analogy for ${topicTitle}`, back: parsed.robotExplanation.analogy },
        { front: `Key Rule for ${topicTitle}`, back: parsed.robotExplanation.keyPoints[0] || 'Understand first principles.' }
      ],
      memoryPairs: [
        { id: "cm1", label: "Core Idea", match: parsed.summary.slice(0, 30) + '...' },
        { id: "cm2", label: "Analogy", match: "Real-world mental bridge" }
      ]
    };
  }
}

window.aiService = new AIService();
