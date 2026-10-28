/**
 * AI Peer Teaching Kit - Procedural Sound Effects Engine
 * Built with Web Audio API for 100% offline, zero-dependency audio.
 * Works even when opening index.html directly from file:///.
 */

class SoundEffectsEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('royal_peer_muted') === 'true';
    this.initialized = false;
  }

  init() {
    if (this.initialized && this.audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.initialized = true;
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('royal_peer_muted', this.isMuted ? 'true' : 'false');
    return this.isMuted;
  }

  // Soft subtle button click
  playClick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.audioCtx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.06);
  }

  // 3D Card flip swoosh
  playFlip() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    const filter = this.audioCtx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.09);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.09);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.09);
  }

  // Royal Golden Chord chime for correct answers
  playCorrect() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    // Harmonic chord: C5, E5, G5, C6 (523Hz, 659Hz, 784Hz, 1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.04);

      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.14, this.audioCtx.currentTime + idx * 0.04 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.6 + idx * 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime + idx * 0.04);
      osc.stop(this.audioCtx.currentTime + 0.6 + idx * 0.04);
    });
  }

  // Gentle low gong / wrong buzzer
  playIncorrect() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(146.83, this.audioCtx.currentTime); // D3
    osc1.frequency.exponentialRampToValueAtTime(110, this.audioCtx.currentTime + 0.35); // A2

    osc2.frequency.setValueAtTime(155.56, this.audioCtx.currentTime); // Eb3 dissonant beat
    osc2.frequency.exponentialRampToValueAtTime(116.5, this.audioCtx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(this.audioCtx.currentTime + 0.35);
    osc2.stop(this.audioCtx.currentTime + 0.35);
  }

  // Power-up beam / magic aura swoosh for Quiz Battle
  playPowerUp() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.5);
  }

  // Level-Up Royal Fanfare
  playLevelUp() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    // Grand fanfare sequence: G4 -> C5 -> E5 -> G5
    const notes = [
      { f: 392.00, t: 0.00, d: 0.15 },
      { f: 523.25, t: 0.14, d: 0.15 },
      { f: 659.25, t: 0.28, d: 0.20 },
      { f: 783.99, t: 0.48, d: 0.50 }
    ];

    notes.forEach(note => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, this.audioCtx.currentTime + note.t);

      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime + note.t);
      gain.gain.linearRampToValueAtTime(0.18, this.audioCtx.currentTime + note.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime + note.t);
      osc.stop(this.audioCtx.currentTime + note.t + note.d);
    });
  }

  // Boss Alert / Dramatic sound
  playBossAlert() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    const notes = [220, 233.08, 220, 246.94];
    notes.forEach((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + idx * 0.12 + 0.18);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(this.audioCtx.currentTime + idx * 0.12);
      osc.stop(this.audioCtx.currentTime + idx * 0.12 + 0.18);
    });
  }
}

// Global audio singleton
window.soundFx = new SoundEffectsEngine();
