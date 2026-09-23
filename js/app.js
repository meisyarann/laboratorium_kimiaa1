/* ==========================================================================
   CHEMVIRTUAL LAB - MAIN APPLICATION ROUTER & STATE CONTROLLER
   Laboratorium Virtual Kimia & Multimedia Pembelajaran Interaktif
   Guru Kimia: Fatma Alawiyah, S.Pd.,Gr (NIP: 200103272025212017)
   ========================================================================== */

class AppController {
  constructor() {
    this.currentModuleId = 1;
    this.totalModules = 10;
    this.studentName = "Peserta Didik";
    this.quizScore = 0;

    this.completedModules = {
      1: true, // Beranda dikunjungi
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false
    };

    // Sub-modules
    this.apdModule = null;
    this.threeEquipModule = null;
    this.chemTheoryModule = null;
    this.virtualLabsModule = null;
    this.lkpdModule = null;
    this.quizModule = null;
    this.reflectionModule = null;
    this.certModule = null;

    // Web Audio context for pleasant UI feedback sounds
    this.audioCtx = null;
  }

  init() {
    this.loadState();
    this.spawnBackgroundMolecules();
    this.initAudioContext();
    this.initNavigation();
    this.initSubModules();
    this.updateGlobalProgress();
    this.navigateToModule(this.currentModuleId, false);
  }

  loadState() {
    try {
      const savedCompleted = localStorage.getItem('chemvirtuallab_completed_modules');
      if (savedCompleted) {
        this.completedModules = JSON.parse(savedCompleted);
      }

      const savedName = localStorage.getItem('chemvirtuallab_student_name');
      if (savedName) {
        this.studentName = savedName;
      }

      const savedScore = localStorage.getItem('chemvirtuallab_quiz_score');
      if (savedScore) {
        this.quizScore = parseInt(savedScore, 10);
      }
    } catch (e) {
      console.warn("State load error:", e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('chemvirtuallab_completed_modules', JSON.stringify(this.completedModules));
      localStorage.setItem('chemvirtuallab_student_name', this.studentName);
      localStorage.setItem('chemvirtuallab_quiz_score', this.quizScore.toString());
    } catch (e) {
      console.warn("State save error:", e);
    }
  }

  initSubModules() {
    if (window.APDCharacterModule) {
      this.apdModule = new window.APDCharacterModule();
      this.apdModule.init();
    }
    if (window.ThreeEquipmentModule) {
      this.threeEquipModule = new window.ThreeEquipmentModule();
      this.threeEquipModule.init();
    }
    if (window.ChemicalTheoryModule) {
      this.chemTheoryModule = new window.ChemicalTheoryModule();
      this.chemTheoryModule.init();
    }
    if (window.VirtualLabsModule) {
      this.virtualLabsModule = new window.VirtualLabsModule();
      this.virtualLabsModule.init();
    }
    if (window.LKPDPBLModule) {
      this.lkpdModule = new window.LKPDPBLModule();
      this.lkpdModule.init();
    }
    if (window.QuizEngineModule) {
      this.quizModule = new window.QuizEngineModule();
      this.quizModule.init();
    }
    if (window.ReflectionModule) {
      this.reflectionModule = new window.ReflectionModule();
      this.reflectionModule.init();
    }
    if (window.CertificateModule) {
      this.certModule = new window.CertificateModule();
      this.certModule.init();
    }
  }

  initNavigation() {
    // Nav Bar Links
    document.querySelectorAll('.nav-module-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const modId = parseInt(item.dataset.mod, 10);
        if (modId) {
          this.playClickSound();
          this.navigateToModule(modId);
        }
      });
    });

    // Home Grid Module Cards
    document.querySelectorAll('.module-card').forEach(card => {
      card.addEventListener('click', () => {
        const modId = parseInt(card.dataset.mod, 10);
        if (modId) {
          this.playClickSound();
          this.navigateToModule(modId);
        }
      });
    });

    // Next / Previous Buttons in Page Footers
    document.querySelectorAll('.btn-page-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.currentModuleId > 1) {
          this.playClickSound();
          this.navigateToModule(this.currentModuleId - 1);
        }
      });
    });

    document.querySelectorAll('.btn-page-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.currentModuleId < this.totalModules) {
          this.playClickSound();
          this.markModuleCompleted(this.currentModuleId);
          this.navigateToModule(this.currentModuleId + 1);
        }
      });
    });

    // Brand logo click returns home
    const brandLogo = document.querySelector('.brand-wrapper');
    if (brandLogo) {
      brandLogo.addEventListener('click', () => {
        this.playClickSound();
        this.navigateToModule(1);
      });
    }

    // Tab Aturan Lab (Halaman 3)
    const ruleTabs = document.querySelectorAll('.rules-tab-btn');
    ruleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        ruleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetId = tab.dataset.target;
        document.querySelectorAll('.rules-content-tab').forEach(c => c.classList.remove('active'));
        const content = document.getElementById(targetId);
        if (content) content.classList.add('active');
        this.playClickSound();
      });
    });
  }

  navigateToModule(modId, scroll = true) {
    if (modId < 1 || modId > this.totalModules) return;
    this.currentModuleId = modId;

    // Sembunyikan semua halaman, tampilkan halaman terpilih
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active-view');
    });

    const targetView = document.getElementById(`page-module-${modId}`);
    if (targetView) {
      targetView.classList.add('active-view');
    }

    // Update Nav Bar Items
    document.querySelectorAll('.nav-module-item').forEach(item => {
      if (parseInt(item.dataset.mod, 10) === modId) {
        item.classList.add('active');
        // Scroll horizontal subnav agar item terlihat
        item.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });

    // Trigger per-module specific refresh
    if (modId === 4 && this.threeEquipModule) {
      // Refresh Three.js render
      this.threeEquipModule.loadApparatusModel(this.threeEquipModule.currentEquipId);
    } else if (modId === 5 && this.chemTheoryModule) {
      this.chemTheoryModule.initBohrCanvas();
    } else if (modId === 10 && this.certModule) {
      this.certModule.loadData();
      this.certModule.renderCertificateCanvas();
    }

    if (scroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  markModuleCompleted(modId) {
    this.completedModules[modId] = true;
    this.saveState();
    this.updateGlobalProgress();

    // Visual mark on home card
    const card = document.querySelector(`.module-card[data-mod="${modId}"]`);
    if (card) {
      card.classList.add('completed');
      const badge = card.querySelector('.mod-card-badge');
      if (badge) badge.textContent = '✓ Selesai';
    }
  }

  updateGlobalProgress() {
    const completedCount = Object.values(this.completedModules).filter(Boolean).length;
    const percent = Math.round((completedCount / this.totalModules) * 100);

    const fillBar = document.getElementById('global-progress-fill');
    const textLabel = document.getElementById('global-progress-text');

    if (fillBar) fillBar.style.width = `${percent}%`;
    if (textLabel) textLabel.textContent = `${percent}%`;

    const homeStatCompleted = document.getElementById('home-stat-completed');
    if (homeStatCompleted) homeStatCompleted.textContent = `${completedCount} / ${this.totalModules}`;
  }

  setStudentName(name) {
    this.studentName = name;
    this.saveState();
    if (this.certModule) {
      this.certModule.studentName = name;
      this.certModule.renderCertificateCanvas();
    }
  }

  setQuizScore(score) {
    this.quizScore = score;
    this.saveState();
    if (this.certModule) {
      this.certModule.score = score;
      this.certModule.renderCertificateCanvas();
    }
  }

  /* -------------------------------------------------------------
     BACKGROUND FLOATING MOLECULES ANIMATION
     ------------------------------------------------------------- */
  spawnBackgroundMolecules() {
    const bgContainer = document.getElementById('bg-molecules-container');
    if (!bgContainer) return;

    bgContainer.innerHTML = '';
    const numBubbles = 16;
    for (let i = 0; i < numBubbles; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'molecule-bubble';

      const size = Math.floor(Math.random() * 80) + 30;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}vw`;
      bubble.style.top = `${Math.random() * 100}vh`;
      bubble.style.animationDuration = `${Math.random() * 14 + 12}s`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;

      bgContainer.appendChild(bubble);
    }
  }

  /* -------------------------------------------------------------
     WEB AUDIO SYNTHESIZED SOUND EFFECTS
     ------------------------------------------------------------- */
  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    } catch (e) {
      // Audio not supported
    }
  }

  playClickSound() {
    if (!this.audioCtx) return;
    try {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {}
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.App = new AppController();
  window.App.init();
});
