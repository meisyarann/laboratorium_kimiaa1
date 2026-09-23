/* ==========================================================================
   CHEMVIRTUAL LAB - MODUL 8: MESIN KUIS INTERAKTIF & REVIEW JAWABAN
   ========================================================================== */

class QuizEngineModule {
  constructor() {
    this.questions = LAB_QUIZ_DATA;
    this.currentIndex = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.isSubmitted = false;
    this.score = 0;
    this.timeLeftSeconds = 15 * 60; // 15 Menit
    this.timerInterval = null;
  }

  init() {
    this.renderQuestion();
    this.setupEventListeners();
    this.startTimer();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    const timerElem = document.getElementById('quiz-timer-text');
    if (!timerElem) return;

    this.timerInterval = setInterval(() => {
      if (this.timeLeftSeconds <= 0) {
        clearInterval(this.timerInterval);
        alert("Waktu pengerjaan kuis telah habis! Kuis akan dinilai secara otomatis.");
        this.submitQuiz();
        return;
      }

      this.timeLeftSeconds--;
      const min = Math.floor(this.timeLeftSeconds / 60);
      const sec = this.timeLeftSeconds % 60;
      timerElem.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }, 1000);
  }

  renderQuestion() {
    const q = this.questions[this.currentIndex];
    if (!q) return;

    // Progress text
    const badge = document.getElementById('quiz-counter-badge');
    if (badge) {
      badge.textContent = `Soal ${this.currentIndex + 1} dari ${this.questions.length}`;
    }

    // Question title
    const qTitle = document.getElementById('quiz-question-title');
    if (qTitle) {
      qTitle.textContent = `${this.currentIndex + 1}. ${q.question}`;
    }

    // Options list
    const optionsContainer = document.getElementById('quiz-options-mount');
    if (optionsContainer) {
      const letters = ['A', 'B', 'C', 'D'];
      optionsContainer.innerHTML = q.options.map((optText, optIdx) => {
        const isSelected = this.userAnswers[this.currentIndex] === optIdx;
        let extraClass = '';
        if (this.isSubmitted) {
          if (optIdx === q.correct) extraClass = 'correct';
          else if (isSelected && optIdx !== q.correct) extraClass = 'incorrect';
        } else if (isSelected) {
          extraClass = 'selected';
        }

        return `
          <div class="quiz-option-item ${extraClass}" data-index="${optIdx}">
            <span class="opt-letter">${letters[optIdx]}</span>
            <span>${optText}</span>
          </div>
        `;
      }).join('');
    }

    // Explanation box (if already submitted)
    const expBox = document.getElementById('quiz-explanation-box');
    if (expBox) {
      if (this.isSubmitted) {
        expBox.style.display = 'block';
        expBox.innerHTML = `
          <strong>💡 Pembahasan Soal #${this.currentIndex + 1}:</strong><br>
          ${q.explanation}
        `;
      } else {
        expBox.style.display = 'none';
      }
    }

    // Update Nav Buttons
    const btnPrev = document.getElementById('btn-quiz-prev');
    const btnNext = document.getElementById('btn-quiz-next');
    if (btnPrev) btnPrev.disabled = (this.currentIndex === 0);
    if (btnNext) {
      btnNext.textContent = (this.currentIndex === this.questions.length - 1) ? 'Tinjau / Selesai' : 'Berikutnya →';
    }
  }

  setupEventListeners() {
    // Klik Opsi Jawaban
    const optionsMount = document.getElementById('quiz-options-mount');
    if (optionsMount) {
      optionsMount.addEventListener('click', (e) => {
        if (this.isSubmitted) return;
        const opt = e.target.closest('.quiz-option-item');
        if (opt && opt.dataset.index !== undefined) {
          this.userAnswers[this.currentIndex] = parseInt(opt.dataset.index, 10);
          this.renderQuestion();
        }
      });
    }

    // Tombol Previous & Next
    const btnPrev = document.getElementById('btn-quiz-prev');
    const btnNext = document.getElementById('btn-quiz-next');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.renderQuestion();
        }
      });
    }
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (this.currentIndex < this.questions.length - 1) {
          this.currentIndex++;
          this.renderQuestion();
        } else {
          // Confirm submit
          if (!this.isSubmitted) {
            const answeredCount = this.userAnswers.filter(a => a !== null).length;
            if (confirm(`Anda telah menjawab ${answeredCount} dari ${this.questions.length} soal. Yakin ingin mengumpulkan jawaban kuis?`)) {
              this.submitQuiz();
            }
          }
        }
      });
    }

    // Tombol Submit Manual
    const btnSubmit = document.getElementById('btn-quiz-submit');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        if (!this.isSubmitted) this.submitQuiz();
      });
    }

    // Tombol Coba Lagi
    const btnRetry = document.getElementById('btn-quiz-retry');
    if (btnRetry) {
      btnRetry.addEventListener('click', () => {
        this.resetQuiz();
      });
    }
  }

  submitQuiz() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.isSubmitted = true;

    // Hitung Skor
    let correctCount = 0;
    this.questions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    this.score = Math.round((correctCount / this.questions.length) * 100);

    // Save to global state & LocalStorage
    localStorage.setItem('chemvirtuallab_quiz_score', this.score);
    if (window.App) {
      window.App.setQuizScore(this.score);
      if (this.score >= 75) {
        window.App.markModuleCompleted(8);
      }
    }

    // Tampilkan Kartu Hasil
    const questionCard = document.getElementById('quiz-active-card');
    const resultCard = document.getElementById('quiz-result-card');
    if (questionCard) questionCard.style.display = 'none';
    if (resultCard) {
      resultCard.style.display = 'block';
      const scoreNumElem = document.getElementById('quiz-score-num');
      const scoreMsgElem = document.getElementById('quiz-score-msg');

      if (scoreNumElem) scoreNumElem.textContent = this.score;
      if (scoreMsgElem) {
        const isPassed = this.score >= 75;
        scoreMsgElem.innerHTML = `
          <h3 style="font-size:1.4rem; color:${isPassed ? '#15803d' : '#b91c1c'}; margin-bottom:0.5rem;">
            ${isPassed ? '🎉 SELAMAT! ANDA LULUS EVALUASI' : '⚠️ BELUM MEMENUHI KKM (75)'}
          </h3>
          <p style="font-size:0.95rem; color:var(--text-secondary); max-width:600px; margin:0 auto 1.5rem;">
            Jawaban benar: <strong>${correctCount} dari ${this.questions.length} soal</strong>.<br>
            ${isPassed 
              ? 'Nilai Anda memenuhi syarat untuk penerbitan Sertifikat Kelulusan resmi yang ditandatangani oleh <strong>Fatma Alawiyah, S.Pd.,Gr</strong>.'
              : 'Anda dapat meninjau pembahasan seluruh nomor soal atau mengulang kuis kembali untuk meningkatkan nilai kelulusan sertifikat.'}
          </p>
        `;
      }
    }
  }

  resetQuiz() {
    this.currentIndex = 0;
    this.userAnswers = new Array(this.questions.length).fill(null);
    this.isSubmitted = false;
    this.timeLeftSeconds = 15 * 60;

    const questionCard = document.getElementById('quiz-active-card');
    const resultCard = document.getElementById('quiz-result-card');
    if (questionCard) questionCard.style.display = 'block';
    if (resultCard) resultCard.style.display = 'none';

    this.renderQuestion();
    this.startTimer();
  }
}

window.QuizEngineModule = QuizEngineModule;
