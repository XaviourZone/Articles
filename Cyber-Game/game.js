/**
 * CyberGuard - 2D Cybersecurity Awareness Mini-Game Engine
 * Pure Vanilla JavaScript implementation with native Web Audio API fallback.
 */

(() => {
  'use strict';

  // --- SVG Icon Dictionary (Crisp vector icons for Retina & Mobile) ---
  const SVG = {
    laptop: (w = 32, h = 32) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="12" rx="2"></rect>
        <line x1="2" y1="20" x2="22" y2="20"></line>
      </svg>`,
    plug: (w = 32, h = 32) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v6M9 2v6M6 8h12v4a6 6 0 0 1-12 0v-4zM12 18v4"></path>
      </svg>`,
    quarantine: (w = 32, h = 32) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>`,
    usb: (w = 26, h = 26) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="7" y="10" width="10" height="11" rx="2"></rect>
        <rect x="9" y="3" width="6" height="7"></rect>
        <line x1="10" y1="5" x2="10" y2="7"></line>
        <line x1="14" y1="5" x2="14" y2="7"></line>
      </svg>`,
    mail: (w = 20, h = 20) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>`,
    shieldAlert: (w = 22, h = 22) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>`,
    shieldCheck: (w = 22, h = 22) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
      </svg>`,
    shield: (w = 22, h = 22) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>`,
    link: (w = 18, h = 18) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
      </svg>`,
    wifi: (w = 24, h = 24) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"></path>
      </svg>`,
    wifiHoneypot: (w = 24, h = 24) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1.42 9a16 16 0 0 1 21.16 0M5 12.55a11 11 0 0 1 14.08 0"></path>
        <path d="M13 13l-3 4h4l-2 5" stroke="#ef4444"></path>
      </svg>`,
    lock: (w = 20, h = 20) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>`,
    lockOpen: (w = 20, h = 20) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
      </svg>`,
    phone: (w = 20, h = 20) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="3"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
      </svg>`,
    bellAlert: (w = 20, h = 20) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        <circle cx="18" cy="4" r="3" fill="#ef4444" stroke="none"></circle>
      </svg>`,
    desktop: (w = 22, h = 22) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>`,
    bulb: (w = 18, h = 18) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18h6M10 22h4M15 11a5 5 0 1 0-6 0c0 2 1.5 3 1.5 4h3c0-1 1.5-2 1.5-4z"></path>
      </svg>`,
    key: (w = 18, h = 18) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21 2-2 2m-1.5 1.5L14 9l-3-3L8 9M3 15a6 6 0 1 0 12 0c0-1.8-.8-3.4-2.1-4.5L21 2"></path>
      </svg>`,
    download: (w = 18, h = 18) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>`,
    idBadge: (w = 40, h = 40) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="5" width="16" height="16" rx="2"></rect>
        <path d="M9 2h6v3H9z"></path>
        <circle cx="12" cy="11" r="2.5"></circle>
        <path d="M8 17a4 4 0 0 1 8 0"></path>
      </svg>`,
    user: (w = 20, h = 20) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>`,
    plane: (w = 18, h = 18) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>`,
    stickyNote: (w = 18, h = 18) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"></path>
        <polyline points="14 3 14 9 20 9"></polyline>
        <line x1="7" y1="13" x2="13" y2="13"></line>
        <line x1="7" y1="17" x2="17" y2="17"></line>
      </svg>`,
    shredder: (w = 32, h = 32) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="6" width="18" height="8" rx="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
        <path d="M6 14v6M10 14v7M14 14v5M18 14v6M8 6V3h8v3"></path>
      </svg>`,
    magnet: (w = 32, h = 32) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 14v-4a8 8 0 0 1 16 0v4M4 14h5M15 14h5M4 10h5M15 10h5"></path>
      </svg>`,
    recycle: (w = 32, h = 32) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 19H4.81a2 2 0 0 1-1.74-2.99l2.2-3.81M14.5 19H20a2 2 0 0 0 1.73-3l-2.73-4.73M12 2l4.28 7.42a2 2 0 0 1-1.74 2.99H7.46a2 2 0 0 1-1.73-1L10 4z"></path>
      </svg>`,
    doc: (w = 20, h = 20) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </svg>`,
    can: (w = 20, h = 20) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="6" y="4" width="12" height="16" rx="4"></rect>
        <line x1="8" y1="10" x2="16" y2="10"></line>
      </svg>`,
    coffee: (w = 20, h = 20) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
      </svg>`,
    clock: (w = 16, h = 16) => `
      <svg class="svg-scenario" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>`,
    soundOn: (w = 17, h = 17) => `
      <svg class="svg-icon" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>`,
    soundOff: (w = 17, h = 17) => `
      <svg class="svg-icon" viewBox="0 0 24 24" width="${w}" height="${h}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      </svg>`,
    medal: (rank) => {
      const colors = ['#f59e0b', '#94a3b8', '#d97706'];
      const c = colors[rank - 1] || '#38bdf8';
      return `<svg class="svg-inline" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`;
    },
    star: (w = 16, h = 16) => `
      <svg class="svg-inline" viewBox="0 0 24 24" width="${w}" height="${h}" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>`
  };

  // --- Sound Effects Synthesizer (Native Web Audio API Fallback) ---
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playSuccess() {
      if (!this.enabled) return;
      this.init();
      const audio = new Audio('./assets/audio/success.mp3');
      audio.play().catch(() => {
        this.synthChime();
      });
    }

    playFailure() {
      if (!this.enabled) return;
      this.init();
      const audio = new Audio('./assets/audio/failure.mp3');
      audio.play().catch(() => {
        this.synthBuzzer();
      });
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    synthChime() {
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.36);
      });
    }

    synthBuzzer() {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);
    }
  }

  // --- Game State Manager ---
  class CyberGame {
    constructor() {
      this.sound = new SoundEngine();
      this.currentLevel = 1;
      this.maxLevels = 10;
      this.lives = 3;
      this.maxLives = 3;
      this.score = 1000;
      this.timerId = null;
      this.activeTimerSeconds = 0;

      // Player identity & one-go tracking (clean by default - no hardcoded names)
      const savedName = localStorage.getItem('cyberguard_player_name');
      if (savedName === 'XAN' || savedName === 'Alex Vance') {
        localStorage.removeItem('cyberguard_player_name');
        this.playerName = '';
      } else {
        this.playerName = savedName || '';
      }
      this.isOneGoRun = true;
      this.runMistakes = 0;
      
      // DOM Elements
      this.startScreen = document.getElementById('start-screen');
      this.gameOverScreen = document.getElementById('game-over-screen');
      this.victoryScreen = document.getElementById('victory-screen');
      this.levelStage = document.getElementById('level-stage');
      this.feedbackModal = document.getElementById('feedback-modal');
      this.contentBox = document.getElementById('scenario-content-box');

      // Start Tabs & Name elements
      this.playerNameInput = document.getElementById('player-name-input');
      this.tabBtnBriefing = document.getElementById('tab-btn-briefing');
      this.tabBtnLeaderboard = document.getElementById('tab-btn-leaderboard');
      this.paneBriefing = document.getElementById('pane-briefing');
      this.paneLeaderboard = document.getElementById('pane-leaderboard');
      this.leaderboardBody = document.getElementById('leaderboard-body');
      this.btnLeaderboardPlay = document.getElementById('btn-leaderboard-play');
      this.btnResetLeaderboard = document.getElementById('btn-reset-leaderboard');
      
      // HUD elements
      this.hudLevelNum = document.getElementById('hud-level-num');
      this.hudProgressFill = document.getElementById('hud-progress-fill');
      this.hudScore = document.getElementById('hud-score');
      this.hudLivesContainer = document.getElementById('hud-lives');
      this.soundToggleBtn = document.getElementById('btn-sound-toggle');
      this.soundIcon = document.getElementById('sound-icon');
      
      // Scenario Briefing elements
      this.scenarioPill = document.getElementById('scenario-pill');
      this.scenarioTimer = document.getElementById('scenario-timer');
      this.scenarioTitle = document.getElementById('scenario-title');
      this.scenarioPrompt = document.getElementById('scenario-prompt');

      // Feedback modal elements
      this.feedbackIcon = document.getElementById('feedback-icon');
      this.feedbackTitle = document.getElementById('feedback-title');
      this.feedbackMsg = document.getElementById('feedback-msg');
      this.feedbackTip = document.getElementById('feedback-tip');
      this.btnFeedbackAction = document.getElementById('btn-feedback-action');

      // Certificate elements
      this.certAgentNameInput = document.getElementById('cert-agent-name');
      this.certDisplayName = document.getElementById('cert-display-name');
      this.certFinalScore = document.getElementById('cert-final-score');
      this.certLivesLeft = document.getElementById('cert-lives-left');
      this.certDate = document.getElementById('cert-date');
      this.victoryOneGoBanner = document.getElementById('victory-one-go-banner');
      this.btnViewLeaderboard = document.getElementById('btn-view-leaderboard');

      this.pendingOutcome = null; // { success: boolean, nextLevel: number }

      this.initEvents();
      this.initPlayerIdentity();
      this.renderLeaderboard();
    }

    initPlayerIdentity() {
      if (this.playerNameInput) {
        this.playerNameInput.value = this.playerName;
        this.playerNameInput.addEventListener('input', (e) => {
          this.playerName = e.target.value.trim();
          if (this.playerName) {
            localStorage.setItem('cyberguard_player_name', this.playerName);
          } else {
            localStorage.removeItem('cyberguard_player_name');
          }
          if (this.certAgentNameInput) this.certAgentNameInput.value = this.playerName;
          if (this.certDisplayName) this.certDisplayName.textContent = this.playerName || 'Security Champion';
        });
      }
      if (this.certAgentNameInput) {
        this.certAgentNameInput.value = this.playerName;
      }
      if (this.certDisplayName) {
        this.certDisplayName.textContent = this.playerName || 'Security Champion';
      }
    }

    switchStartTab(tabName) {
      if (tabName === 'briefing') {
        this.tabBtnBriefing.classList.add('active');
        this.tabBtnLeaderboard.classList.remove('active');
        this.paneBriefing.classList.add('active');
        this.paneLeaderboard.classList.remove('active');
      } else {
        this.tabBtnLeaderboard.classList.add('active');
        this.tabBtnBriefing.classList.remove('active');
        this.paneLeaderboard.classList.add('active');
        this.paneBriefing.classList.remove('active');
        this.renderLeaderboard();
      }
    }

    // Default Leaderboard is empty by default - whoever enters their name and wins will appear!
    getDefaultLeaderboard() {
      return [];
    }

    getLeaderboard() {
      try {
        const version = localStorage.getItem('cyberguard_lb_ver');
        if (version !== 'clean_open_v3') {
          // Reset cache so leaderboard begins completely empty for genuine users
          localStorage.setItem('cyberguard_leaderboard', JSON.stringify([]));
          localStorage.setItem('cyberguard_lb_ver', 'clean_open_v3');
          const oldName = localStorage.getItem('cyberguard_player_name');
          if (oldName === 'XAN' || oldName === 'Alex Vance') {
            localStorage.removeItem('cyberguard_player_name');
          }
          return [];
        }
        const stored = localStorage.getItem('cyberguard_leaderboard');
        if (stored) {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            // Guarantee no hardcoded placeholder accounts exist
            const filtered = list.filter(item => item && item.name && item.name !== 'XAN' && item.name !== 'Alex Vance');
            if (filtered.length !== list.length) {
              localStorage.setItem('cyberguard_leaderboard', JSON.stringify(filtered));
            }
            return filtered;
          }
        }
      } catch (err) {
        console.warn('Error reading leaderboard from storage', err);
      }
      return this.getDefaultLeaderboard();
    }

    saveToLeaderboard(entry) {
      const list = this.getLeaderboard();
      list.push(entry);
      // Sort highest score first
      list.sort((a, b) => b.score - a.score);
      // Keep top 15
      const topList = list.slice(0, 15);
      localStorage.setItem('cyberguard_leaderboard', JSON.stringify(topList));
      this.renderLeaderboard();
    }

    renderLeaderboard() {
      if (!this.leaderboardBody) return;
      const list = this.getLeaderboard();
      this.leaderboardBody.innerHTML = '';

      if (list.length === 0) {
        this.leaderboardBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px 16px;">
              <div style="margin-bottom: 8px; color: var(--task-accent);">${SVG.shield(32, 32)}</div>
              <strong style="color: #fff; font-size: 0.95rem;">No players registered yet</strong><br>
              <span style="color: var(--task-accent); font-size: 0.8rem;">Type your name &amp; complete all 10 scenarios in one go to take Rank #1!</span>
            </td>
          </tr>
        `;
        return;
      }

      list.forEach((entry, idx) => {
        const row = document.createElement('tr');
        const rankDisplay = idx < 3 ? `${SVG.medal(idx + 1)} #${idx + 1}` : `#${idx + 1}`;
        const isFlawless = entry.status && entry.status.includes('Flawless');
        const badgeClass = isFlawless ? 'badge-flawless' : 'badge-survivor';

        row.innerHTML = `
          <td class="leaderboard-rank">${rankDisplay}</td>
          <td><strong>${entry.name}</strong></td>
          <td style="color: var(--accent-cyan); font-family: var(--font-display); font-weight: 700;">${entry.score}</td>
          <td><span class="${badgeClass}">${entry.status}</span></td>
          <td style="color: var(--text-muted); font-size: 0.8rem;">${entry.date}</td>
        `;
        this.leaderboardBody.appendChild(row);
      });
    }

    initEvents() {
      // Start Tab Switching
      if (this.tabBtnBriefing) {
        this.tabBtnBriefing.addEventListener('click', () => {
          this.sound.playClick();
          this.switchStartTab('briefing');
        });
      }
      if (this.tabBtnLeaderboard) {
        this.tabBtnLeaderboard.addEventListener('click', () => {
          this.sound.playClick();
          this.switchStartTab('leaderboard');
        });
      }
      if (this.btnLeaderboardPlay) {
        this.btnLeaderboardPlay.addEventListener('click', () => {
          this.sound.playClick();
          this.startGame();
        });
      }
      if (this.btnResetLeaderboard) {
        this.btnResetLeaderboard.addEventListener('click', () => {
          this.sound.playClick();
          localStorage.setItem('cyberguard_leaderboard', JSON.stringify(this.getDefaultLeaderboard()));
          this.renderLeaderboard();
        });
      }

      document.getElementById('btn-start-game').addEventListener('click', () => {
        this.sound.playClick();
        this.startGame();
      });

      document.getElementById('btn-retry-game').addEventListener('click', () => {
        this.sound.playClick();
        this.resetGame();
      });

      document.getElementById('btn-play-again').addEventListener('click', () => {
        this.sound.playClick();
        this.resetGame();
      });

      if (this.btnViewLeaderboard) {
        this.btnViewLeaderboard.addEventListener('click', () => {
          this.sound.playClick();
          this.victoryScreen.classList.remove('active');
          this.startScreen.classList.add('active');
          this.switchStartTab('leaderboard');
        });
      }

      this.soundToggleBtn.addEventListener('click', () => {
        const enabled = this.sound.toggle();
        this.soundIcon.innerHTML = enabled ? SVG.soundOn(17, 17) : SVG.soundOff(17, 17);
      });

      this.btnFeedbackAction.addEventListener('click', () => {
        this.sound.playClick();
        this.feedbackModal.classList.remove('active');
        if (this.pendingOutcome) {
          if (this.pendingOutcome.success) {
            if (this.pendingOutcome.nextLevel > this.maxLevels) {
              this.showVictoryScreen();
            } else {
              this.loadLevel(this.pendingOutcome.nextLevel);
            }
          } else {
            // Check lives
            if (this.lives <= 0) {
              this.showGameOverScreen();
            } else {
              this.loadLevel(this.currentLevel);
            }
          }
          this.pendingOutcome = null;
        }
      });

      // Certificate real-time name update
      if (this.certAgentNameInput) {
        this.certAgentNameInput.addEventListener('input', (e) => {
          const val = e.target.value.trim();
          this.playerName = val;
          if (this.certDisplayName) {
            this.certDisplayName.textContent = val || 'Security Champion';
          }
          if (this.playerNameInput) {
            this.playerNameInput.value = val;
          }
          if (val) {
            localStorage.setItem('cyberguard_player_name', val);
          } else {
            localStorage.removeItem('cyberguard_player_name');
          }
        });
      }

      document.getElementById('btn-print-cert').addEventListener('click', () => {
        window.print();
      });
    }

    startGame() {
      if (this.playerNameInput) {
        const typed = this.playerNameInput.value.trim();
        this.playerName = typed;
        if (typed) {
          localStorage.setItem('cyberguard_player_name', typed);
        }
      }
      this.startScreen.classList.remove('active');
      this.isOneGoRun = true;
      this.runMistakes = 0;
      this.loadLevel(1);
    }

    resetGame() {
      this.currentLevel = 1;
      this.lives = 3;
      this.score = 1000;
      this.isOneGoRun = true;
      this.runMistakes = 0;
      this.updateHUD();
      this.gameOverScreen.classList.remove('active');
      this.victoryScreen.classList.remove('active');
      this.loadLevel(1);
    }

    updateHUD() {
      this.hudLevelNum.textContent = `${this.currentLevel} / ${this.maxLevels}`;
      const progressPercent = Math.min(100, Math.round(((this.currentLevel - 1) / this.maxLevels) * 100));
      this.hudProgressFill.style.width = `${progressPercent}%`;
      this.hudScore.textContent = this.score;

      // Update hearts
      for (let i = 1; i <= this.maxLives; i++) {
        const heartEl = document.getElementById(`heart-${i}`);
        if (heartEl) {
          if (i <= this.lives) {
            heartEl.classList.remove('lost');
          } else {
            heartEl.classList.add('lost');
          }
        }
      }
    }

    clearTimer() {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
      this.scenarioTimer.style.display = 'none';
    }

    takeDamage(explanation, tip) {
      this.clearTimer();
      this.lives--;
      this.runMistakes++;
      this.score = Math.max(0, this.score - 150);
      this.sound.playFailure();
      this.updateHUD();

      // Screen shake animation
      document.body.classList.add('shake-screen');
      setTimeout(() => document.body.classList.remove('shake-screen'), 450);

      this.pendingOutcome = { success: false };

      this.showFeedback({
        isSuccess: false,
        title: 'SECURITY BREACH DETECTED',
        iconHtml: SVG.shieldAlert(48, 48),
        msg: explanation,
        tip: tip || 'Always double check indicators before taking action.',
        btnText: this.lives > 0 ? 'RETRY SCENARIO' : 'VIEW REPORT'
      });
    }

    completeLevel(successMsg, tip) {
      this.clearTimer();
      this.score += 250;
      this.sound.playSuccess();
      this.updateHUD();

      this.pendingOutcome = {
        success: true,
        nextLevel: this.currentLevel + 1
      };

      this.showFeedback({
        isSuccess: true,
        title: 'THREAT MITIGATED',
        iconHtml: SVG.shieldCheck(48, 48),
        msg: successMsg,
        tip: tip || 'Good practice! Maintaining vigilance protects entire networks.',
        btnText: this.currentLevel === this.maxLevels ? 'CLAIM CERTIFICATE' : 'NEXT SCENARIO'
      });
    }

    showFeedback({ isSuccess, title, iconHtml, msg, tip, btnText }) {
      const card = document.getElementById('feedback-card');
      if (isSuccess) {
        card.classList.remove('failed');
      } else {
        card.classList.add('failed');
      }
      this.feedbackIcon.innerHTML = iconHtml;
      this.feedbackTitle.textContent = title;
      this.feedbackMsg.textContent = msg;
      this.feedbackTip.innerHTML = `<strong>Security Takeaway:</strong> ${tip}`;
      this.btnFeedbackAction.textContent = btnText;
      this.feedbackModal.classList.add('active');
    }

    showGameOverScreen() {
      this.clearTimer();
      this.isOneGoRun = false;
      this.setTaskTheme('mfa', 'BREACH');
      document.getElementById('gameover-level-reached').textContent = `${this.currentLevel} / ${this.maxLevels}`;
      document.getElementById('gameover-score').textContent = this.score;
      this.gameOverScreen.classList.add('active');
    }

    showVictoryScreen() {
      this.clearTimer();
      this.setTaskTheme('ssl', 'CHAMPION');
      this.hudProgressFill.style.width = '100%';
      this.certFinalScore.textContent = `${this.score} PTS (${this.lives === 3 ? 'FLAWLESS' : 'VERIFIED'})`;
      this.certLivesLeft.textContent = `${this.lives} / 3 LIVES`;
      const effectiveName = this.playerName ? this.playerName.trim() : 'Player';
      if (this.certDisplayName) {
        this.certDisplayName.textContent = effectiveName;
      }
      if (this.certAgentNameInput) {
        this.certAgentNameInput.value = this.playerName;
      }
      
      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).toUpperCase();
      this.certDate.textContent = dateFormatted;

      // Handle One-Go Leaderboard Induction
      if (this.isOneGoRun && this.lives > 0) {
        const isFlawless = this.lives === 3;
        const statusText = isFlawless ? 'Flawless (3/3 Lives)' : 'Completed (One-Go)';
        const dateShort = now.toISOString().split('T')[0];

        this.saveToLeaderboard({
          name: effectiveName,
          score: this.score,
          status: statusText,
          date: dateShort
        });

        if (this.victoryOneGoBanner) {
          this.victoryOneGoBanner.style.display = 'flex';
          const titleEl = this.victoryOneGoBanner.querySelector('strong');
          const pEl = this.victoryOneGoBanner.querySelector('p');
          if (titleEl) {
            titleEl.innerHTML = `${isFlawless ? SVG.star(18, 18) : SVG.shieldCheck(18, 18)} ${isFlawless ? 'FLAWLESS 1-GO INDUCTEE!' : 'ONE-GO COMPLETION!'}`;
          }
          if (pEl) {
            pEl.textContent = `Outstanding work, ${effectiveName}! You completed all 10 scenarios in one go. You have been officially added to the Landing Page Leaderboard!`;
          }
        }
      } else {
        if (this.victoryOneGoBanner) {
          this.victoryOneGoBanner.style.display = 'none';
        }
      }

      this.victoryScreen.classList.add('active');
    }

    setTaskTheme(themeKey, badgeLabel) {
      document.body.setAttribute('data-task-theme', themeKey);
      const hudBadge = document.getElementById('hud-badge-tag');
      if (hudBadge) {
        hudBadge.textContent = badgeLabel || 'CHALLENGE';
      }
    }

    // --- Scenario Routing ---
    loadLevel(levelNumber) {
      this.clearTimer();
      this.currentLevel = levelNumber;
      this.updateHUD();
      this.contentBox.innerHTML = '';

      switch (levelNumber) {
        case 1:
          this.setTaskTheme('password', 'CREDENTIALS');
          this.buildLevel1_Password();
          break;
        case 2:
          this.setTaskTheme('hardware', 'HARDWARE');
          this.buildLevel2_USB();
          break;
        case 3:
          this.setTaskTheme('email', 'EMAIL');
          this.buildLevel3_Phishing();
          break;
        case 4:
          this.setTaskTheme('wifi', 'WIRELESS');
          this.buildLevel4_Wifi();
          break;
        case 5:
          this.setTaskTheme('mfa', 'MFA AUTH');
          this.buildLevel5_MFA();
          break;
        case 6:
          this.setTaskTheme('popup', 'BROWSER');
          this.buildLevel6_Popup();
          break;
        case 7:
          this.setTaskTheme('social', 'PRIVACY');
          this.buildLevel7_SocialMedia();
          break;
        case 8:
          this.setTaskTheme('workstation', 'WORKSPACE');
          this.buildLevel8_PhysicalSecurity();
          break;
        case 9:
          this.setTaskTheme('ssl', 'ENCRYPTION');
          this.buildLevel9_BrowserWarning();
          break;
        case 10:
          this.setTaskTheme('disposal', 'DATA LIFECYCLE');
          this.buildLevel10_DataDisposal();
          break;
        default:
          this.showVictoryScreen();
          break;
      }
    }

    // =========================================================================
    // LEVEL 1: The Password (Typing + Dictionary/PII Trick)
    // =========================================================================
    buildLevel1_Password() {
      this.scenarioPill.textContent = 'TASK 1 : CREDENTIAL SECURITY';
      this.scenarioTitle.textContent = 'Master Password Setup';
      this.scenarioPrompt.textContent = 'Create a secure master password. Criteria: >= 8 chars, 1 uppercase, 1 number, 1 symbol. TRICK ALERT: Common dictionary words, predictable seasons/years, or personal names will be rejected!';

      this.contentBox.innerHTML = `
        <div class="password-level-container">
          <div class="input-group">
            <input type="text" id="pwd-input" class="cyber-input" placeholder="Type a strong custom password..." autocomplete="off" spellcheck="false" autofocus>
          </div>

          <button class="suggest-pwd-btn" id="btn-suggest-pwd">
            ${SVG.bulb(16, 16)} Suggest "Strong" Password (Decoy Test)
          </button>

          <div class="strength-meter-wrap">
            <div class="meter-header">
              <span class="hud-label">PASSWORD STRENGTH:</span>
              <span class="strength-label" id="pwd-strength-text" style="color: var(--accent-red);">WEAK</span>
            </div>
            <div class="meter-bars-grid">
              <div class="meter-segment" id="pwd-seg-1"></div>
              <div class="meter-segment" id="pwd-seg-2"></div>
              <div class="meter-segment" id="pwd-seg-3"></div>
              <div class="meter-segment" id="pwd-seg-4"></div>
            </div>
          </div>

          <div class="requirements-list">
            <div class="req-item" id="req-len">
              <span class="req-bullet">○</span> At least 8 characters
            </div>
            <div class="req-item" id="req-upper">
              <span class="req-bullet">○</span> 1+ Uppercase letter (A-Z)
            </div>
            <div class="req-item" id="req-num">
              <span class="req-bullet">○</span> 1+ Numeric digit (0-9)
            </div>
            <div class="req-item" id="req-sym">
              <span class="req-bullet">○</span> 1+ Special symbol (!@#$%)
            </div>
            <div class="req-item" id="req-nocommon" style="grid-column: span 2;">
              <span class="req-bullet">○</span> No dictionary words, seasons, or personal name
            </div>
          </div>

          <button class="cyber-btn primary-btn" id="btn-submit-pwd" style="margin-top: 6px;">
            <span class="btn-icon">${SVG.lock(16, 16)}</span> SUBMIT SECURE PASSWORD
          </button>
        </div>
      `;

      const input = document.getElementById('pwd-input');
      const suggestBtn = document.getElementById('btn-suggest-pwd');
      const strengthText = document.getElementById('pwd-strength-text');
      const seg1 = document.getElementById('pwd-seg-1');
      const seg2 = document.getElementById('pwd-seg-2');
      const seg3 = document.getElementById('pwd-seg-3');
      const seg4 = document.getElementById('pwd-seg-4');
      const reqLen = document.getElementById('req-len');
      const reqUpper = document.getElementById('req-upper');
      const reqNum = document.getElementById('req-num');
      const reqSym = document.getElementById('req-sym');
      const reqNoCommon = document.getElementById('req-nocommon');
      const submitBtn = document.getElementById('btn-submit-pwd');

      // Decoy suggestion feature (teaches why popular strong-looking passwords are traps)
      suggestBtn.addEventListener('click', () => {
        this.sound.playClick();
        input.value = 'Summer2026!';
        validate();
      });

      const validate = () => {
        const val = input.value;
        const lower = val.toLowerCase();
        const hasLen = val.length >= 8;
        const hasUpper = /[A-Z]/.test(val);
        const hasNum = /[0-9]/.test(val);
        const hasSym = /[^A-Za-z0-9]/.test(val);

        // Banned common words, seasons, predictable patterns, or user's name
        const playerFirstName = (this.playerName || '').split(' ')[0].toLowerCase();
        const bannedWords = ['password', 'admin', 'summer', 'winter', 'spring', 'autumn', 'welcome', 'qwerty', '123456'];
        if (playerFirstName && playerFirstName.length >= 3) {
          bannedWords.push(playerFirstName);
        }

        const containsBanned = bannedWords.some(w => lower.includes(w));
        const hasNoCommon = !containsBanned && val.length > 0;

        const updateReq = (el, met) => {
          el.classList.toggle('met', met);
          el.querySelector('.req-bullet').textContent = met ? '●' : '○';
        };

        updateReq(reqLen, hasLen);
        updateReq(reqUpper, hasUpper);
        updateReq(reqNum, hasNum);
        updateReq(reqSym, hasSym);
        updateReq(reqNoCommon, hasNoCommon);

        const basicScore = [hasLen, hasUpper, hasNum, hasSym].filter(Boolean).length;
        [seg1, seg2, seg3, seg4].forEach(s => s.className = 'meter-segment');

        if (containsBanned && basicScore >= 3) {
          strengthText.textContent = 'DECOY / COMMON PATTERN (UNSAFE)';
          strengthText.style.color = 'var(--accent-amber)';
          seg1.classList.add('fair');
          seg2.classList.add('fair');
          return { valid: false, reason: 'common_pattern' };
        }

        if (basicScore <= 1) {
          strengthText.textContent = 'WEAK';
          strengthText.style.color = 'var(--accent-red)';
          if (basicScore === 1) seg1.classList.add('weak');
        } else if (basicScore === 2) {
          strengthText.textContent = 'FAIR';
          strengthText.style.color = 'var(--accent-amber)';
          seg1.classList.add('fair');
          seg2.classList.add('fair');
        } else if (basicScore === 3) {
          strengthText.textContent = 'GOOD';
          strengthText.style.color = '#38bdf8';
          seg1.classList.add('good');
          seg2.classList.add('good');
          seg3.classList.add('good');
        } else if (basicScore === 4 && hasNoCommon) {
          strengthText.textContent = 'STRONG & UNIQUE';
          strengthText.style.color = 'var(--accent-green)';
          seg1.classList.add('strong');
          seg2.classList.add('strong');
          seg3.classList.add('strong');
          seg4.classList.add('strong');
        }

        return { valid: basicScore === 4 && hasNoCommon, reason: containsBanned ? 'common_pattern' : 'complexity' };
      };

      input.addEventListener('input', validate);

      submitBtn.addEventListener('click', () => {
        this.sound.playClick();
        const res = validate();
        if (res.valid) {
          this.completeLevel(
            'Strong master password configured! High entropy and zero dictionary patterns.',
            'Attackers use automated wordlists that test permutations of seasons, "admin", and personal names in milliseconds. Unique passphrases defeat this!'
          );
        } else if (res.reason === 'common_pattern') {
          this.takeDamage(
            'COMMON PATTERN TRAP! Your password meets basic length/symbol rules but contains a common dictionary word (like "Summer", "Password", or your name)!',
            'Over 60% of breached passwords are just common words with "@" or "!" added to the end. Avoid predictable seasonal words and names.'
          );
        } else {
          this.takeDamage(
            'Password does not meet enterprise complexity standards. Weak passwords can be brute-forced in seconds.',
            'Ensure your password has at least 8 characters, an uppercase letter, a number, and a symbol.'
          );
        }
      });
    }

    // =========================================================================
    // LEVEL 2: The Found USB (Drag & Drop + Curiosity Bait & Juice Jacking Trick)
    // =========================================================================
    buildLevel2_USB() {
      this.scenarioPill.textContent = 'TASK 2 : HARDWARE & PERIPHERALS';
      this.scenarioTitle.textContent = 'The Unknown Flash Drive';
      this.scenarioPrompt.textContent = 'You discovered a flash drive in the corridor with a tempting label. Drag or tap to assign it to the correct destination: Work Laptop, Public Charging Kiosk, or IT Security Bin.';

      this.contentBox.innerHTML = `
        <div class="dnd-stage">
          <div class="mobile-tap-tip">${SVG.bulb(14, 14)} Tap flash drive, then tap destination (or drag)</div>

          <div class="targets-container">
            <div class="drop-target-card target-danger" id="target-laptop" data-target="laptop">
              <span class="target-emoji">${SVG.laptop(36, 36)}</span>
              <span class="target-title">Work Laptop</span>
              <span class="target-sub">Plug in to check contents</span>
            </div>

            <div class="drop-target-card target-danger" id="target-kiosk" data-target="kiosk">
              <span class="target-emoji">${SVG.plug(36, 36)}</span>
              <span class="target-title">Charging Kiosk</span>
              <span class="target-sub">Plug into public USB port</span>
            </div>

            <div class="drop-target-card target-safe" id="target-trash" data-target="trash">
              <span class="target-emoji">${SVG.quarantine(36, 36)}</span>
              <span class="target-title">IT SecOps Bin</span>
              <span class="target-sub">Quarantine & hardware analysis</span>
            </div>
          </div>

          <div class="draggable-item" id="drag-usb" draggable="true" tabindex="0">
            <span class="item-icon">${SVG.usb(26, 26)}</span>
            <div class="item-meta">
              <span class="item-title">CONFIDENTIAL_SALARIES_2026.xlsx</span>
              <span class="item-tag">HR Payroll - PRIVATE</span>
            </div>
          </div>
        </div>
      `;

      const usb = document.getElementById('drag-usb');
      const targets = document.querySelectorAll('.drop-target-card');
      let isUsbSelected = false;

      // Mobile Tap-To-Select & Tap-To-Assign
      usb.addEventListener('click', (e) => {
        this.sound.playClick();
        isUsbSelected = !isUsbSelected;
        usb.classList.toggle('item-selected', isUsbSelected);
      });

      targets.forEach(target => {
        target.addEventListener('click', () => {
          if (isUsbSelected) {
            isUsbSelected = false;
            usb.classList.remove('item-selected');
            const targetType = target.getAttribute('data-target');
            this.handleUsbDrop(targetType);
          }
        });
      });

      usb.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', 'usb');
        e.dataTransfer.effectAllowed = 'move';
        usb.style.opacity = '0.5';
      });

      usb.addEventListener('dragend', () => {
        usb.style.opacity = '1';
        targets.forEach(t => t.classList.remove('drag-over'));
      });

      targets.forEach(target => {
        target.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          target.classList.add('drag-over');
        });

        target.addEventListener('dragleave', () => {
          target.classList.remove('drag-over');
        });

        target.addEventListener('drop', (e) => {
          e.preventDefault();
          target.classList.remove('drag-over');
          const targetType = target.getAttribute('data-target');
          this.handleUsbDrop(targetType);
        });
      });

      this.attachPointerDragFallback(usb, targets, (droppedTarget) => {
        const targetType = droppedTarget.getAttribute('data-target');
        this.handleUsbDrop(targetType);
      });
    }

    handleUsbDrop(targetType) {
      if (targetType === 'laptop') {
        this.takeDamage(
          'BADUSB MALWARE EXPLOIT! The drive was a malicious HID Rubber Ducky simulating keyboard strokes to inject ransomware within 2 seconds.',
          'Attackers deliberately label USBs with tantalizing names like "Salaries" or "Executive Bonuses" to exploit natural curiosity.'
        );
      } else if (targetType === 'kiosk') {
        this.takeDamage(
          'JUICE JACKING & ROGUE PORT RISK! Plugging untrusted flash drives or devices into public charging hubs exposes data lines to hardware taps.',
          'Never connect untrusted storage media or phones to public charging kiosks. Rogue data pins can siphon information.'
        );
      } else if (targetType === 'trash') {
        this.completeLevel(
          'Threat quarantined! Handed over to IT SecOps for safe offline sandbox analysis.',
          'Social engineers rely on employee curiosity. Refusing to plug in mystery drives saves enterprise subnets.'
        );
      }
    }

    attachPointerDragFallback(draggableEl, dropTargets, onDropCallback) {
      let isDragging = false;
      let startX = 0, startY = 0;
      let origTransform = '';

      const onPointerDown = (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        origTransform = draggableEl.style.transform || '';
        draggableEl.setPointerCapture(e.pointerId);
        draggableEl.style.zIndex = '1000';
      };

      const onPointerMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        draggableEl.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;

        dropTargets.forEach(target => {
          const rect = target.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            target.classList.add('drag-over');
          } else {
            target.classList.remove('drag-over');
          }
        });
      };

      const onPointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        draggableEl.releasePointerCapture(e.pointerId);
        draggableEl.style.transform = origTransform;
        draggableEl.style.zIndex = '';

        let matchedTarget = null;
        dropTargets.forEach(target => {
          const rect = target.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            matchedTarget = target;
          }
          target.classList.remove('drag-over');
        });

        if (matchedTarget) {
          onDropCallback(matchedTarget);
        }
      };

      draggableEl.addEventListener('pointerdown', onPointerDown);
      draggableEl.addEventListener('pointermove', onPointerMove);
      draggableEl.addEventListener('pointerup', onPointerUp);
      draggableEl.addEventListener('pointercancel', onPointerUp);
    }

    // =========================================================================
    // LEVEL 3: The Phishing Email (Fake Report & Unsubscribe Traps)
    // =========================================================================
    buildLevel3_Phishing() {
      this.scenarioPill.textContent = 'TASK 3 : EMAIL COMMUNICATION';
      this.scenarioTitle.textContent = 'Urgent Executive Email';
      this.scenarioPrompt.textContent = 'Inspect this incoming security warning. TRICK ALERT: Phishers include fake "Report" links and fake "Unsubscribe" buttons inside the email body! Use the genuine Client Toolbar.';

      this.contentBox.innerHTML = `
        <div class="email-client-ui">
          <div class="email-header-bar">
            <span class="email-client-title">${SVG.mail(18, 18)} SecureMail Client v5.2</span>
            <div class="email-toolbar-actions">
              <button class="client-toolbar-btn" id="btn-real-toolbar-report">
                ${SVG.shieldAlert(16, 16)} Report Phishing (Client Toolbar)
              </button>
            </div>
          </div>

          <div class="email-meta-pane">
            <div class="email-from-row">
              <span class="email-label">FROM:</span>
              <span class="email-sender">PayPal Security &lt;support@paypa1-security-alert.com&gt;</span>
              <span class="email-spoof-tag">External Sender</span>
            </div>
            <div class="email-subject-row">
              <span class="email-label">SUBJECT:</span>
              <strong style="color: #dc2626;">URGENT: Unauthorized login detected from Moscow, RU!</strong>
            </div>
          </div>

          <div class="email-body-pane">
            <div class="email-alert-box">
              ${SVG.shieldAlert(16, 16)} Your account will be frozen within <strong>2 hours</strong> unless you verify your password.
            </div>

            <p>Dear Valued Customer,</p>
            <p>
              We recorded abnormal sign-in activity on your business account. Please review your active sessions immediately using the secure portal link below:
            </p>

            <div class="email-action-row">
              <div class="phish-link-wrapper" id="phish-link-wrap">
                <button class="fake-reset-btn" id="btn-fake-reset">
                  ${SVG.link(16, 16)} Click Here to Reset Password
                </button>
                <div class="url-inspect-tooltip" id="url-tooltip">
                  URL: http://paypa1-login-credential-stealer.ru/reset
                </div>
              </div>

              <!-- Decoy body link -->
              <button class="email-fake-report-link" id="btn-fake-body-report">
                ${SVG.shield(16, 16)} Click here to Report False Alarm to PayPal
              </button>
            </div>

            <button class="email-unsubscribe-link" id="btn-fake-unsubscribe">
              Unsubscribe from security notifications
            </button>
          </div>
        </div>
      `;

      const fakeResetBtn = document.getElementById('btn-fake-reset');
      const fakeBodyReport = document.getElementById('btn-fake-body-report');
      const fakeUnsub = document.getElementById('btn-fake-unsubscribe');
      const realToolbarReport = document.getElementById('btn-real-toolbar-report');

      fakeResetBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.takeDamage(
          'CREDENTIAL HARVESTING TRAP! You clicked the reset button leading to a fake Russian domain (paypa1 with the number 1).',
          'Always hover over links to inspect destination hostnames before clicking.'
        );
      });

      fakeBodyReport.addEventListener('click', () => {
        this.sound.playClick();
        this.takeDamage(
          'IN-BODY REPORT TRAP! The attacker embedded a fake "Report False Alarm" link INSIDE the email text that redirected to malware!',
          'Never trust links embedded inside a suspicious email body. Always use your email software toolbar (Outlook/Gmail report button).'
        );
      });

      fakeUnsub.addEventListener('click', () => {
        this.sound.playClick();
        this.takeDamage(
          'UNSUBSCRIBE TRAP! Clicking "Unsubscribe" in phishing emails verifies to the scammer that your inbox is active and often downloads payloads.',
          'Never click "Unsubscribe" on unsolicited phishing emails. Report and delete them via your email client interface.'
        );
      });

      realToolbarReport.addEventListener('click', () => {
        this.sound.playClick();
        this.completeLevel(
          'Outstanding work! You used the genuine Email Client Toolbar to report and quarantine the phish.',
          'Attackers frequently embed fake "Report" and "Unsubscribe" links in their body text. Relying on client software controls is the safest practice.'
        );
      });
    }

    // =========================================================================
    // LEVEL 4: Coffee Shop Wi-Fi (Evil Twin Honeypot Trick)
    // =========================================================================
    buildLevel4_Wifi() {
      this.scenarioPill.textContent = 'TASK 4 : WIRELESS NETWORKS';
      this.scenarioTitle.textContent = 'Public Wi-Fi Connection';
      this.scenarioPrompt.textContent = 'You need Wi-Fi at a café. TRICK ALERT: Rogue attackers set up "Evil Twin" honeypots with tempting names like "VIP_5G". Turn on your VPN and pick the authentic venue Wi-Fi!';

      this.contentBox.innerHTML = `
        <div class="wifi-hub-container">
          <div class="vpn-toggle-bar">
            <div class="vpn-info">
              <div class="vpn-title">
                <span>${SVG.shieldCheck(18, 18)} Corporate VPN Tunnel</span>
              </div>
              <span class="vpn-status-text" id="vpn-status-label">STATUS: DISCONNECTED (UNPROTECTED)</span>
            </div>
            <label class="switch-wrapper">
              <input type="checkbox" id="vpn-toggle-input">
              <span class="slider-switch"></span>
            </label>
          </div>

          <div class="networks-list">
            <div class="network-item" id="net-coffeeshop" data-network="guest">
              <div class="network-left">
                <span class="wifi-wave-icon">${SVG.wifi(24, 24)}</span>
                <div>
                  <div class="network-name">CoffeeShop_Guest</div>
                  <div class="network-security">Official Venue Wi-Fi (Open)</div>
                </div>
              </div>
              <span class="network-connect-btn">CONNECT</span>
            </div>

            <!-- Evil Twin Honeypot AP -->
            <div class="network-item" id="net-honeypot" data-network="honeypot">
              <div class="network-left">
                <span class="wifi-wave-icon">${SVG.wifiHoneypot(24, 24)}</span>
                <div>
                  <div class="network-name">
                    CoffeeShop_FREE_HIGH_SPEED_VIP_5G
                    <span class="network-honeypot-badge">STRONG SIGNAL</span>
                  </div>
                  <div class="network-security">Unverified Rogue AP (Open)</div>
                </div>
              </div>
              <span class="network-connect-btn">CONNECT</span>
            </div>

            <div class="network-item" id="net-staff" data-network="staff">
              <div class="network-left">
                <span class="wifi-wave-icon">${SVG.lock(24, 24)}</span>
                <div>
                  <div class="network-name">Barista_Internal_WPA3</div>
                  <div class="network-security">Secured (Password Required)</div>
                </div>
              </div>
              <span class="network-connect-btn" style="opacity: 0.5;">LOCKED</span>
            </div>
          </div>
        </div>
      `;

      const vpnToggle = document.getElementById('vpn-toggle-input');
      const vpnStatusLabel = document.getElementById('vpn-status-label');
      const guestNetwork = document.getElementById('net-coffeeshop');
      const honeypotNetwork = document.getElementById('net-honeypot');
      const staffNetwork = document.getElementById('net-staff');

      vpnToggle.addEventListener('change', () => {
        this.sound.playClick();
        if (vpnToggle.checked) {
          vpnStatusLabel.textContent = 'STATUS: CONNECTED (WIREGUARD AES-256 ENCRYPTED)';
          vpnStatusLabel.classList.add('connected');
        } else {
          vpnStatusLabel.textContent = 'STATUS: DISCONNECTED (UNPROTECTED)';
          vpnStatusLabel.classList.remove('connected');
        }
      });

      honeypotNetwork.addEventListener('click', () => {
        this.sound.playClick();
        this.takeDamage(
          'EVIL TWIN HONEYPOT TRAP! Attackers broadcast high-speed fake Wi-Fi with names like "FREE_VIP_5G" to hijack DNS and inject malicious captive portals.',
          'Always verify the official SSID with staff. Shady "VIP" or "Ultra-Fast" open SSIDs are classic man-in-the-middle traps.'
        );
      });

      guestNetwork.addEventListener('click', () => {
        this.sound.playClick();
        if (vpnToggle.checked) {
          this.completeLevel(
            'Safe connection established! Connected to official guest network with active VPN tunnel encryption.',
            'Even on official public networks, unencrypted packets can be sniffed. A VPN secures all outbound data.'
          );
        } else {
          this.takeDamage(
            'EAVESDROPPING TRAP! You connected to public Wi-Fi without activating your VPN first. Attackers sniffed your session tokens.',
            'Never connect to untrusted public networks without turning on your VPN beforehand.'
          );
        }
      });

      staffNetwork.addEventListener('click', () => {
        this.sound.playClick();
        this.takeDamage(
          'Access Denied. You do not possess the credentials for the private staff network.',
          'Connect to the official guest network with your VPN enabled.'
        );
      });
    }

    // =========================================================================
    // LEVEL 5: MFA Verification (MFA Fatigue / Push Bombing Trick)
    // =========================================================================
    buildLevel5_MFA() {
      this.scenarioPill.textContent = 'TASK 5 : TWO-FACTOR AUTH';
      this.scenarioTitle.textContent = 'Repeated Login Prompts';
      this.scenarioPrompt.textContent = 'Your workstation needs 2FA verification within 10s. TRICK ALERT: Attackers are push-bombing your phone with rogue prompts. DENY the rogue prompt and enter the valid code!';

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      let timeLeft = 10;
      let promptDenied = false;

      this.contentBox.innerHTML = `
        <div class="mfa-stage-container">
          <div class="phone-device-mockup">
            <div class="phone-speaker"></div>
            <div class="phone-screen" style="position: relative;">
              <!-- Rogue Push Bombing Overlay -->
              <div class="phone-push-overlay" id="phone-push-prompt">
                <div class="push-title">${SVG.bellAlert(16, 16)} UNEXPECTED LOGIN REQUEST</div>
                <div class="push-body">Location: Beijing, China<br>Device: Chrome on Linux</div>
                <div class="push-actions">
                  <button class="push-btn-deny" id="btn-push-deny">DENY ✕</button>
                  <button class="push-btn-approve" id="btn-push-approve">APPROVE ✓</button>
                </div>
              </div>

              <span class="phone-app-badge">${SVG.phone(14, 14)} Authenticator Pro</span>
              <p style="font-size: 0.78rem; color: #94a3b8;">One-Time Passcode (TOTP)</p>
              <div class="phone-otp-code" id="mfa-phone-code">${generatedCode.slice(0, 3)} ${generatedCode.slice(3)}</div>
              <p style="font-size: 0.72rem; color: #cbd5e1;">Valid for login session</p>
            </div>
          </div>

          <div class="mfa-computer-terminal">
            <div class="terminal-title">${SVG.desktop(18, 18)} Workstation Login Verification</div>
            <p style="font-size: 0.88rem; color: var(--text-secondary);">
              Deny any unexpected foreign push requests, then enter the 6-digit TOTP code:
            </p>

            <div class="countdown-bar-wrap">
              <div class="countdown-bar-fill" id="mfa-countdown-fill"></div>
            </div>

            <div class="input-group">
              <input type="text" id="mfa-input" class="cyber-input" placeholder="Enter 6-digit code" maxlength="7" autocomplete="off" autofocus>
            </div>

            <button class="cyber-btn primary-btn" id="btn-verify-mfa">
              <span>${SVG.key(16, 16)}</span> VERIFY &amp; LOGIN
            </button>
          </div>
        </div>
      `;

      this.scenarioTimer.style.display = 'inline-block';
      this.scenarioTimer.innerHTML = `${SVG.clock(15, 15)} ${timeLeft}s`;

      const input = document.getElementById('mfa-input');
      const verifyBtn = document.getElementById('btn-verify-mfa');
      const countdownFill = document.getElementById('mfa-countdown-fill');
      const pushPrompt = document.getElementById('phone-push-prompt');
      const pushApprove = document.getElementById('btn-push-approve');
      const pushDeny = document.getElementById('btn-push-deny');

      pushApprove.addEventListener('click', () => {
        this.sound.playClick();
        this.clearTimer();
        this.takeDamage(
          'MFA FATIGUE TRAP! You clicked "Approve" on a fraudulent login request from China. The attacker gained immediate access to your enterprise cloud!',
          'Never approve unexpected MFA push notifications. When prompted unexpectedly, always click Deny and report to SecOps.'
        );
      });

      pushDeny.addEventListener('click', () => {
        this.sound.playClick();
        promptDenied = true;
        pushPrompt.style.display = 'none';
      });

      this.timerId = setInterval(() => {
        timeLeft--;
        this.scenarioTimer.innerHTML = `${SVG.clock(15, 15)} ${timeLeft}s`;
        if (countdownFill) {
          countdownFill.style.width = `${(timeLeft / 10) * 100}%`;
        }

        if (timeLeft <= 0) {
          this.clearTimer();
          this.takeDamage(
            'TIME EXPIRED! The one-time token expired before verification was completed.',
            'TOTP codes refresh every 30 seconds to prevent replay attacks.'
          );
        }
      }, 1000);

      const checkCode = () => {
        this.sound.playClick();
        const entered = input.value.replace(/\s+/g, '');
        if (entered === generatedCode) {
          this.clearTimer();
          this.completeLevel(
            'MFA Authentication confirmed! You avoided the push-bombing trap and authenticated safely.',
            'MFA fatigue attacks rely on pestering users until they accidentally approve unauthorized sign-ins. Always verify origin and deny suspicious prompts.'
          );
        } else {
          this.takeDamage(
            'INVALID TOKEN! The verification code entered does not match the authenticator token.',
            'Double-check digits carefully before submitting time-sensitive tokens.'
          );
        }
      };

      verifyBtn.addEventListener('click', checkCode);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkCode();
      });
    }

    // =========================================================================
    // LEVEL 6: The Pop-Up (Fake Close & Deceptive Cancel Tricks)
    // =========================================================================
    buildLevel6_Popup() {
      this.scenarioPill.textContent = 'TASK 6 : WEB BROWSING';
      this.scenarioTitle.textContent = 'Malicious Browser Alert';
      this.scenarioPrompt.textContent = 'Scareware has locked your screen! TRICK ALERT: The fake pop-up contains a painted "✕" and a deceptive "Cancel" button that actually execute malware. Use the real browser tab close control!';

      this.contentBox.innerHTML = `
        <div class="fake-desktop-window">
          <div class="desktop-bg-pattern"></div>
          
          <!-- Real browser tab close control -->
          <button class="browser-tab-real-close" id="btn-real-tab-close" title="Close Browser Tab">
            ✕ Close Tab
          </button>

          <div class="scam-popup-modal">
            <div class="scam-header">
              <span>${SVG.shieldAlert(16, 16)} CRITICAL SYSTEM ALERT (SECURITY CENTER)</span>
              <!-- Fake X painted inside scam banner -->
              <span class="scam-fake-x" id="btn-fake-x" title="Close">✕</span>
            </div>

            <div class="scam-body">
              <div class="scam-huge-alert">
                ${SVG.shieldAlert(20, 20)} 17 TROJANS &amp; SPYWARE INFECTIONS DETECTED!
              </div>
              <p style="font-size: 0.82rem; color: #4b5563;">
                Your banking credentials and passwords are being transmitted. Immediate cleaning required!
              </p>

              <button class="scam-fake-cta-btn" id="btn-scam-download">
                ${SVG.download(16, 16)} DOWNLOAD ANTIVIRUS CLEANER NOW! (FREE)
              </button>

              <div class="scam-decoy-row">
                <!-- Deceptive Cancel button -->
                <button class="scam-decoy-btn" id="btn-scam-cancel">Cancel / Close Protection</button>
                <button class="scam-decoy-btn" id="btn-scam-decoy-2">Call Tech Support</button>
              </div>
            </div>
          </div>
        </div>
      `;

      const realTabClose = document.getElementById('btn-real-tab-close');
      const fakeX = document.getElementById('btn-fake-x');
      const fakeCancel = document.getElementById('btn-scam-cancel');
      const scamDownload = document.getElementById('btn-scam-download');
      const fakeDecoy2 = document.getElementById('btn-scam-decoy-2');

      const triggerInfection = (msg) => {
        this.sound.playClick();
        this.takeDamage(
          msg || 'INFECTION TRIGGERED! You clicked deceptive scareware elements.',
          'Never click anywhere inside a fake security warning dialog. Close the host tab using browser controls or terminate the process.'
        );
      };

      fakeX.addEventListener('click', () => {
        triggerInfection('FAKE CLOSE BUTTON TRAP! The "✕" in the red header was painted by scammers to trigger the download script!');
      });

      fakeCancel.addEventListener('click', () => {
        triggerInfection('DECEPTIVE CANCEL TRAP! Malvertising dialogs bind the "Cancel" button to the exact same download payload as the main button!');
      });

      scamDownload.addEventListener('click', () => {
        triggerInfection('DOWNLOAD TRAP! You clicked the scareware call-to-action button.');
      });

      fakeDecoy2.addEventListener('click', () => {
        triggerInfection('TECH SUPPORT SCAM TRAP! Dialing unsolicited numbers connects to rogue call centers that demand remote access to drain accounts.');
      });

      realTabClose.addEventListener('click', () => {
        this.sound.playClick();
        this.completeLevel(
          'Threat terminated cleanly using genuine browser tab controls!',
          'Scareware operators intentionally disguise malicious scripts behind fake "X" and "Cancel" buttons. Always close the browser tab or use Task Manager.'
        );
      });
    }

    // =========================================================================
    // LEVEL 7: Social Media Oversharing (ID Badge Exposure Trick)
    // =========================================================================
    buildLevel7_SocialMedia() {
      this.scenarioPill.textContent = 'TASK 7 : SOCIAL PRIVACY';
      this.scenarioTitle.textContent = 'Workplace Photo Sharing';
      this.scenarioPrompt.textContent = 'A colleague is posting their airport selfie. TRICK ALERT: Besides the boarding pass barcode and address, their company security access badge is exposed on the table! Redact all 3!';

      this.contentBox.innerHTML = `
        <div class="social-feed-card">
          <div class="social-author-row">
            <span class="author-avatar">${SVG.user(20, 20)}</span>
            <div>
              <div class="author-name">Taylor Reed (@taylor_dev)</div>
              <div style="font-size: 0.72rem; color: var(--text-muted);">Drafting a post...</div>
            </div>
          </div>

          <div class="social-caption-box">
            "Finally going on vacation! Hawaii here I come! Desk is clean and badges are packed!"
          </div>

          <div class="table-items-row">
            <!-- Boarding pass -->
            <div class="boarding-pass-preview" style="flex: 1;">
              <div class="pass-header">
                <span>SKYLINE AIRWAYS • FIRST CLASS</span>
                <span>GATE B14</span>
              </div>

              <div class="pass-details-grid">
                <div>
                  <span class="hud-label" style="color: #64748b;">PASSENGER</span>
                  <div style="font-weight: 700;">TAYLOR REED</div>
                </div>
                <div>
                  <span class="hud-label" style="color: #64748b;">FLIGHT</span>
                  <div style="font-weight: 700;">SK-8492</div>
                </div>
              </div>

              <div class="sensitive-zone" id="zone-address" title="Click to Redact Home Address">
                <span class="hud-label" style="color: #dc2626;">HOME ADDRESS (PII)</span>
                <div style="font-weight: 600; font-size: 0.85rem;">742 Evergreen Terrace, Springfield</div>
              </div>

              <div class="sensitive-zone" id="zone-barcode" title="Click to Redact Barcode">
                <span class="hud-label" style="color: #dc2626;">ENCRYPTED PNR BARCODE</span>
                <div class="pass-barcode-area">|||| ||||| |||| || ||||||</div>
              </div>
            </div>

            <!-- Company Access Badge on the table (TRICK) -->
            <div class="company-id-badge" id="zone-badge" title="Click to Redact Company Security Badge">
              <span class="hud-label" style="color: #dc2626;">COMPANY ID BADGE</span>
              <div style="display: flex; justify-content: center; margin: 4px 0; color: #1e293b;">
                ${SVG.idBadge(42, 42)}
              </div>
              <strong style="font-size: 0.78rem;">CyberGuard Corp</strong>
              <span style="font-size: 0.7rem; color: #475569;">Security Level 4</span>
              <span style="font-family: monospace; font-size: 0.65rem;">ID: #9941-SEC-EXP</span>
            </div>
          </div>

          <button class="cyber-btn primary-btn" id="btn-post-photo">
            <span>${SVG.plane(16, 16)}</span> POST PHOTO TO SOCIAL MEDIA
          </button>
        </div>
      `;

      const zoneAddress = document.getElementById('zone-address');
      const zoneBarcode = document.getElementById('zone-barcode');
      const zoneBadge = document.getElementById('zone-badge');
      const postBtn = document.getElementById('btn-post-photo');

      let addressBlurred = false;
      let barcodeBlurred = false;
      let badgeBlurred = false;

      zoneAddress.addEventListener('click', () => {
        this.sound.playClick();
        addressBlurred = !addressBlurred;
        zoneAddress.classList.toggle('blurred', addressBlurred);
      });

      zoneBarcode.addEventListener('click', () => {
        this.sound.playClick();
        barcodeBlurred = !barcodeBlurred;
        zoneBarcode.classList.toggle('blurred', barcodeBlurred);
      });

      zoneBadge.addEventListener('click', () => {
        this.sound.playClick();
        badgeBlurred = !badgeBlurred;
        zoneBadge.classList.toggle('blurred', badgeBlurred);
      });

      postBtn.addEventListener('click', () => {
        this.sound.playClick();
        if (addressBlurred && barcodeBlurred && badgeBlurred) {
          this.completeLevel(
            'All sensitive indicators redacted! Barcode, home address, and company access badge protected.',
            'Photos containing corporate ID badges allow adversaries to clone RFID/barcodes, identify internal facility access credentials, or perform targeted social engineering.'
          );
        } else if (!badgeBlurred) {
          this.takeDamage(
            'COMPANY BADGE EXPOSURE TRAP! You redacted the boarding pass, but left your corporate security ID badge visible in the photo!',
            'High-resolution smartphone photos allow attackers to clone badge barcodes and print fake employee passes for physical facility infiltration.'
          );
        } else {
          this.takeDamage(
            'OVERSHARING RISK! Unredacted personal information or flight barcodes exposed.',
            'Always redact 2D barcodes, addresses, and employee badges before posting travel photos online.'
          );
        }
      });
    }

    // =========================================================================
    // LEVEL 8: Physical Security (The Sticky Note on Monitor Trick)
    // =========================================================================
    buildLevel8_PhysicalSecurity() {
      this.scenarioPill.textContent = 'TASK 8 : WORKSPACE PRIVACY';
      this.scenarioTitle.textContent = 'Unattended Workstation';
      this.scenarioPrompt.textContent = 'You are stepping away for coffee. TRICK ALERT: Someone left a password written on a sticky note attached to the monitor! Remove the sticky note AND lock the workstation.';

      this.contentBox.innerHTML = `
        <div class="workstation-monitor" id="workstation-monitor">
          <!-- Password Sticky Note (TRICK) -->
          <div class="monitor-sticky-note" id="monitor-sticky-note" title="Click to peel and shred password sticky note!">
            ${SVG.stickyNote(14, 14)} Pwd: Admin2026!
          </div>

          <div class="monitor-screen-open" id="monitor-open-screen">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 6px;">
              <span>Confidential_Salaries_2026.xlsx</span>
              <span style="color: #f87171;">RESTRICTED - INTERNAL ONLY</span>
            </div>
            <div style="font-family: monospace; font-size: 0.82rem; line-height: 1.8; opacity: 0.85;">
              1. CEO: $450,000 | Stock Options: 120,000<br>
              2. Head of Security: $210,000 | PII Encrypted<br>
              3. Finance Director: $195,000 | Bank: Chase #9941
            </div>
            <div style="margin-top: auto; font-size: 0.78rem; color: #cbd5e1; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 4px;">
              Stepping away for a coffee break in 5 minutes...
            </div>
          </div>

          <div class="monitor-screen-locked" id="monitor-locked-screen">
            <div style="color: var(--accent-cyan); margin-bottom: 4px;">${SVG.lock(48, 48)}</div>
            <h3 style="font-family: var(--font-display); font-size: 1.3rem;">WORKSTATION LOCKED</h3>
            <span class="badge-tag">AUTHENTICATION REQUIRED TO RESUME</span>
          </div>
        </div>

        <div class="lock-actions-pane">
          <div class="keyboard-shortcut-hint">
            <span class="hud-label">SHORTCUT:</span>
            <button class="key-cap" id="btn-key-win">⊞ Win</button>
            <span>+</span>
            <button class="key-cap" id="btn-key-l">L</button>
          </div>

          <button class="cyber-btn primary-btn" id="btn-lock-screen">
            <span>${SVG.lock(16, 16)}</span> LOCK WORKSTATION
          </button>

          <button class="cyber-btn danger-btn" id="btn-walk-away" style="padding: 10px 16px; font-size: 0.82rem;">
            <span>${SVG.user(16, 16)}</span> Walk Away Unlocked
          </button>
        </div>
      `;

      const stickyNote = document.getElementById('monitor-sticky-note');
      const monitorOpen = document.getElementById('monitor-open-screen');
      const monitorLocked = document.getElementById('monitor-locked-screen');
      const lockBtn = document.getElementById('btn-lock-screen');
      const keyWin = document.getElementById('btn-key-win');
      const keyL = document.getElementById('btn-key-l');
      const walkAwayBtn = document.getElementById('btn-walk-away');

      let stickyPeeled = false;
      let isLocked = false;

      stickyNote.addEventListener('click', () => {
        this.sound.playClick();
        stickyPeeled = true;
        stickyNote.classList.add('peeled');
      });

      const triggerLock = () => {
        if (isLocked) return;
        this.sound.playClick();

        if (!stickyPeeled) {
          this.takeDamage(
            'STICKY NOTE CREDENTIAL TRAP! You locked your computer, but left your password written on a yellow sticky note stuck to your monitor!',
            '"Pass-on-a-Post-it" is a leading cause of physical credential leaks. Never write passwords on desks or monitors.'
          );
          return;
        }

        isLocked = true;
        monitorOpen.style.display = 'none';
        monitorLocked.classList.add('active');

        setTimeout(() => {
          this.completeLevel(
            'Clean desk and locked screen! Password sticky note disposed and workstation secured.',
            'Maintaining clean desk hygiene and locking sessions before stepping away stops opportunistic shoulder surfers.'
          );
        }, 500);
      };

      lockBtn.addEventListener('click', triggerLock);
      keyWin.addEventListener('click', triggerLock);
      keyL.addEventListener('click', triggerLock);

      walkAwayBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.takeDamage(
          'WORKSTATION COMPROMISED! While you were grabbing coffee, an unauthorized visitor snapped photos of executive payroll spreadsheets.',
          'Always lock your computer (Win+L or Cmd+Ctrl+Q) whenever leaving your desk.'
        );
      });
    }

    // =========================================================================
    // LEVEL 9: Browser Warning (Fake Root Certificate Trap)
    // =========================================================================
    buildLevel9_BrowserWarning() {
      this.scenarioPill.textContent = 'TASK 9 : WEB ENCRYPTION';
      this.scenarioTitle.textContent = 'SSL Certificate Warning';
      this.scenarioPrompt.textContent = 'Your browser triggered an invalid SSL certificate warning. TRICK ALERT: A banner urges you to "Install our Root Certificate to fix this". Make the safe security decision!';

      this.contentBox.innerHTML = `
        <div class="browser-chrome-mockup">
          <div class="browser-address-bar">
            <span class="ssl-broken-icon">${SVG.lockOpen(14, 14)} Not Secure</span>
            <span>https://secure-bank-login.portal.net/auth</span>
          </div>

          <div class="browser-warning-content">
            <div class="warning-main-title">
              <span style="color: #ea4335;">${SVG.shieldAlert(28, 28)}</span>
              Your connection is not private
            </div>

            <p style="line-height: 1.6; font-size: 0.92rem;">
              Attackers might be trying to steal your information from <strong>secure-bank-login.portal.net</strong> (passwords, messages, credit cards).
            </p>

            <!-- Deceptive Root Certificate Installation Trap (TRICK) -->
            <div class="fake-root-cert-box">
              <span>${SVG.shieldAlert(15, 15)} Quick Fix: Install our Root CA Security Certificate to bypass warning</span>
              <button class="btn-install-root-cert" id="btn-fake-cert-install">Install Root Cert</button>
            </div>

            <div style="font-family: monospace; font-size: 0.78rem; color: #9aa0a6;">
              NET::ERR_CERT_AUTHORITY_INVALID (Untrusted self-signed certificate)
            </div>

            <div class="browser-options-row">
              <button class="btn-chrome-safe" id="btn-return-safety">
                ${SVG.shieldCheck(16, 16)} Return to Safety (Recommended)
              </button>

              <button class="proceed-link-stealth" id="btn-proceed-unsafe">
                Advanced: Proceed to unsafe site anyway
              </button>
            </div>
          </div>
        </div>
      `;

      const safeBtn = document.getElementById('btn-return-safety');
      const unsafeBtn = document.getElementById('btn-proceed-unsafe');
      const fakeCertBtn = document.getElementById('btn-fake-cert-install');

      fakeCertBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.takeDamage(
          'ROOT CA SPOOFING TRAP! Installing untrusted root certificates allows adversaries to decrypt ALL your encrypted HTTPS web traffic, passwords, and tokens forever!',
          'Never install third-party root security certificates prompted by websites to "fix" SSL warnings.'
        );
      });

      safeBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.completeLevel(
          'Excellent security judgment! You respected cryptographic warnings and refused fake root cert installation.',
          'Untrusted certificate errors indicate potential Man-in-the-Middle traffic interception. Returning to safety preserves cryptographic integrity.'
        );
      });

      unsafeBtn.addEventListener('click', () => {
        this.sound.playClick();
        this.takeDamage(
          'MAN-IN-THE-MIDDLE ATTACK! You bypassed browser cryptographic warnings. An attacker stripped encryption and captured your banking credentials.',
          'Never click "Proceed anyway" on unexpected SSL certificate errors on sensitive login portals.'
        );
      });
    }

    // =========================================================================
    // LEVEL 10: Data Disposal (Hardware Degausser & USB Flash Drive Trick)
    // =========================================================================
    buildLevel10_DataDisposal() {
      this.scenarioPill.textContent = 'TASK 10 : DATA DISPOSAL';
      this.scenarioTitle.textContent = 'Secure Information Disposal';
      this.scenarioPrompt.textContent = 'Clean the desk! TRICK ALERT: An old backup USB drive cannot go into a paper shredder or recycle bin! Sort paper to Shredder, trash to Recycle, and USB to Hardware E-Waste!';

      this.contentBox.innerHTML = `
        <div class="disposal-stage-wrap">
          <div class="mobile-tap-tip">${SVG.bulb(14, 14)} Tap an item, then tap destination bin (or drag)</div>

          <div class="disposal-targets-row">
            <div class="disposal-target target-safe" id="target-shredder" data-accept="confidential">
              <span class="target-emoji">${SVG.shredder(32, 32)}</span>
              <strong style="color: #fff; font-size: 0.95rem;">Paper Shredder</strong>
              <span class="target-sub">Cross-cut destruction for paper</span>
            </div>

            <div class="disposal-target" id="target-ewaste" data-accept="ewaste">
              <span class="target-emoji">${SVG.magnet(32, 32)}</span>
              <strong style="color: #fff; font-size: 0.95rem;">Hardware E-Waste</strong>
              <span class="target-sub">Degausser for flash drives</span>
            </div>

            <div class="disposal-target" id="target-recycle" data-accept="trash">
              <span class="target-emoji">${SVG.recycle(32, 32)}</span>
              <strong style="color: #fff; font-size: 0.95rem;">Recycle Bin</strong>
              <span class="target-sub">Soda cans & food packaging</span>
            </div>
          </div>

          <div style="font-size: 0.82rem; color: var(--text-muted);">
            Items remaining on desk: <span id="items-remaining-count" style="color: var(--accent-cyan); font-weight: bold;">5</span>
          </div>

          <div class="disposal-desk-items" id="desk-items-container">
            <div class="desk-item" id="item-audit" data-type="confidential" draggable="true" tabindex="0">
              <span class="item-icon">${SVG.doc(20, 20)}</span>
              <span class="item-title">CONFIDENTIAL: Financial Audit 2026</span>
            </div>

            <div class="desk-item" id="item-passwords" data-type="confidential" draggable="true" tabindex="0">
              <span class="item-icon">${SVG.stickyNote(20, 20)}</span>
              <span class="item-title">RESTRICTED: Admin Passwords</span>
            </div>

            <!-- Electronic USB Media (TRICK) -->
            <div class="desk-item" id="item-usb-backup" data-type="ewaste" draggable="true" tabindex="0">
              <span class="item-icon">${SVG.usb(20, 20)}</span>
              <span class="item-title">Old Backup Flash Drive (Encrypted)</span>
            </div>

            <div class="desk-item" id="item-soda" data-type="trash" draggable="true" tabindex="0">
              <span class="item-icon">${SVG.can(20, 20)}</span>
              <span class="item-title">Empty Soda Can</span>
            </div>

            <div class="desk-item" id="item-cup" data-type="trash" draggable="true" tabindex="0">
              <span class="item-icon">${SVG.coffee(20, 20)}</span>
              <span class="item-title">Used Paper Coffee Cup</span>
            </div>
          </div>
        </div>
      `;

      const shredder = document.getElementById('target-shredder');
      const ewaste = document.getElementById('target-ewaste');
      const recycle = document.getElementById('target-recycle');
      const targets = [shredder, ewaste, recycle];
      const itemsContainer = document.getElementById('desk-items-container');
      const countLabel = document.getElementById('items-remaining-count');

      let remaining = 5;
      let selectedItem = null;

      const triggerDisposal = (item, target) => {
        this.handleDisposalDrop(item, target, itemsContainer, countLabel, () => {
          remaining--;
          countLabel.textContent = remaining;
          if (remaining <= 0) {
            this.completeLevel(
              'Grand Master Victory! All physical records shredded, hardware degaussed, and waste sorted.',
              'Electronic media requires dedicated degaussing or physical shredding bins. Throwing storage devices in regular trash causes major data leakage!'
            );
          }
        });
      };

      // Tap-to-select on desk items
      document.querySelectorAll('.desk-item').forEach(item => {
        item.addEventListener('click', () => {
          this.sound.playClick();
          if (selectedItem === item) {
            item.classList.remove('item-selected');
            selectedItem = null;
          } else {
            if (selectedItem) selectedItem.classList.remove('item-selected');
            selectedItem = item;
            item.classList.add('item-selected');
          }
        });
      });

      // Tap-to-assign on targets
      targets.forEach(target => {
        target.addEventListener('click', () => {
          if (selectedItem) {
            const itemToDispose = selectedItem;
            selectedItem = null;
            itemToDispose.classList.remove('item-selected');
            triggerDisposal(itemToDispose, target);
          }
        });
      });

      const setupDragForItem = (item) => {
        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', item.id);
          e.dataTransfer.effectAllowed = 'move';
          item.style.opacity = '0.5';
        });

        item.addEventListener('dragend', () => {
          item.style.opacity = '1';
          targets.forEach(t => t.classList.remove('drag-over'));
        });

        this.attachPointerDragFallback(item, targets, (droppedTarget) => {
          triggerDisposal(item, droppedTarget);
        });
      };

      targets.forEach(target => {
        target.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          target.classList.add('drag-over');
        });

        target.addEventListener('dragleave', () => {
          target.classList.remove('drag-over');
        });

        target.addEventListener('drop', (e) => {
          e.preventDefault();
          target.classList.remove('drag-over');
          const itemId = e.dataTransfer.getData('text/plain');
          const item = document.getElementById(itemId);
          if (item) {
            triggerDisposal(item, target);
          }
        });
      });

      document.querySelectorAll('.desk-item').forEach(setupDragForItem);
    }

    handleDisposalDrop(item, target, container, countLabel, onSuccess) {
      const itemType = item.getAttribute('data-type');
      const acceptType = target.getAttribute('data-accept');

      if (itemType === 'confidential' && acceptType === 'trash') {
        this.takeDamage(
          'DATA LEAK! You put confidential audit sheets into the regular recycle bin. Dumpster divers can recover intact corporate secrets.',
          'All documents bearing PII or financial data must be fed into a cross-cut shredder.'
        );
        return;
      }

      if (itemType === 'confidential' && acceptType === 'ewaste') {
        this.takeDamage(
          'SORTING ERROR! Paper documents should be placed in the cross-cut paper shredder, not hardware degaussers.',
          'Sort paper documents to paper shredders.'
        );
        return;
      }

      if (itemType === 'ewaste' && acceptType === 'confidential') {
        this.takeDamage(
          'BLADE JAM TRAP! You tried to put a metallic/plastic USB flash drive into a paper shredder! It broke the mechanical shredder teeth.',
          'Never put electronic hardware into a paper shredder. Use dedicated hardware e-waste bins.'
        );
        return;
      }

      if (itemType === 'ewaste' && acceptType === 'trash') {
        this.takeDamage(
          'DATA BREACH TRAP! You discarded a flash drive into the regular recycle bin. Dumpster divers can read the NAND chips to extract databases!',
          'All electronic flash drives and hard drives must be sent to certified hardware e-waste degaussing.'
        );
        return;
      }

      if (itemType === 'trash' && acceptType !== 'trash') {
        this.takeDamage(
          'EQUIPMENT JAM! Only paper documents belong in document shredders, and only electronics in e-waste.',
          'Soda cans and food packaging go into standard recycling.'
        );
        return;
      }

      // Valid disposal with micro-animation
      this.sound.playClick();
      item.classList.add('item-shredding');
      setTimeout(() => {
        item.remove();
        onSuccess();
      }, 250);
    }
  }

  // Launch application when DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    new CyberGame();
  });
})();

