/* ==========================================================================
   CHEMVIRTUAL LAB - MODUL 6: PRAKTIKUM SEDERHANA (3 SIMULASI LAB INTERAKTIF)
   ========================================================================== */

class VirtualLabsModule {
  constructor() {
    this.activeSimId = 'sim-lavoisier';

    // State Simulasi 1: Lavoisier Balance
    this.lavoisier = {
      isClosedSystem: true,
      hasMixed: false,
      tareWeight: 120.00,
      solAWeight: 45.30,
      solBWeight: 52.40,
      currentMass: 217.70,
      isTared: false
    };

    // State Simulasi 2: Flame Test
    this.flame = {
      currentIon: 'Na',
      isWireInFlame: false,
      ions: {
        Li: { name: "Litium (Li⁺)", color: "#e11d48", glow: "rgba(225, 29, 72, 0.85)", wave: "670.8 nm", desc: "Merah Karmin Menyala (Crimson Red)" },
        Na: { name: "Natrium (Na⁺)", color: "#facc15", glow: "rgba(250, 204, 21, 0.95)", wave: "589.2 nm", desc: "Kuning Terang Sangat Kuat (Doublet D-line)" },
        K:  { name: "Kalium (K⁺)", color: "#c084fc", glow: "rgba(192, 132, 252, 0.85)", wave: "766.5 nm", desc: "Ungu Lembayung / Violet Lembut" },
        Cu: { name: "Tembaga (Cu²⁺)", color: "#2dd4bf", glow: "rgba(45, 212, 191, 0.85)", wave: "510.5 nm", desc: "Hijau Toska / Zamrud Terang" },
        Ba: { name: "Barium (Ba²⁺)", color: "#a3e635", glow: "rgba(163, 230, 53, 0.85)", wave: "553.5 nm", desc: "Hijau Apel Muda Khas" },
        Ca: { name: "Kalsium (Ca²⁺)", color: "#fb923c", glow: "rgba(251, 146, 60, 0.85)", wave: "622.0 nm", desc: "Merah Jingga / Merah Bata" }
      }
    };

    // State Simulasi 3: Titrasi Asam-Basa
    this.titration = {
      buretteVolumeTotal: 50.0,
      buretteUsed: 0.0,
      flaskAcidVol: 20.0,
      hclMolarity: 0.1,
      naohMolarity: 0.1,
      indicator: 'pp',
      isTitrating: false,
      isEndpointReached: false,
      dropInterval: null
    };
  }

  init() {
    this.setupSimTabs();
    this.initLavoisierSim();
    this.initFlameSim();
    this.initTitrationSim();
  }

  setupSimTabs() {
    const tabs = document.querySelectorAll('.sim-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetPaneId = tab.dataset.target;
        document.querySelectorAll('.sim-view-pane').forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(targetPaneId);
        if (pane) pane.classList.add('active');
        this.activeSimId = targetPaneId;
      });
    });
  }

  /* -------------------------------------------------------------
     SIMULASI 1: UJI HUKUM KEKEKALAN MASSA (LAVOISIER)
     ------------------------------------------------------------- */
  initLavoisierSim() {
    this.updateLavoisierScaleDisplay();

    // Toggle sistem terbuka vs tertutup
    const btnClosed = document.getElementById('btn-lav-closed');
    const btnOpen = document.getElementById('btn-lav-open');
    if (btnClosed && btnOpen) {
      btnClosed.addEventListener('click', () => {
        this.lavoisier.isClosedSystem = true;
        btnClosed.classList.add('active');
        btnOpen.classList.remove('active');
        this.resetLavoisier();
      });

      btnOpen.addEventListener('click', () => {
        this.lavoisier.isClosedSystem = false;
        btnOpen.classList.add('active');
        btnClosed.classList.remove('active');
        this.resetLavoisier();
      });
    }

    // Tombol Campurkan Reaktan
    const btnMix = document.getElementById('btn-lav-mix');
    if (btnMix) {
      btnMix.addEventListener('click', () => {
        this.mixLavoisierReactants();
      });
    }

    // Tombol Reset
    const btnReset = document.getElementById('btn-lav-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.resetLavoisier();
      });
    }
  }

  updateLavoisierScaleDisplay() {
    const scaleElem = document.getElementById('lav-scale-readout');
    if (!scaleElem) return;
    scaleElem.textContent = `${this.lavoisier.currentMass.toFixed(2)} g`;
  }

  mixLavoisierReactants() {
    if (this.lavoisier.hasMixed) return;
    this.lavoisier.hasMixed = true;

    const flaskGraphic = document.getElementById('lav-flask-graphic');
    const logBox = document.getElementById('lav-obs-log');

    // Animasi perubahan warna dan endapan putih BaSO4
    if (flaskGraphic) {
      flaskGraphic.style.transition = 'all 1.2s ease';
      flaskGraphic.style.filter = 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9))';
      const precipitate = document.getElementById('lav-precipitate-layer');
      if (precipitate) {
        precipitate.style.height = '24px';
        precipitate.style.background = '#f8fafc';
        precipitate.style.borderTop = '2px solid #cbd5e1';
      }
    }

    // Hitung massa setelah reaksi
    if (this.lavoisier.isClosedSystem) {
      // Massa TETAP SAMA PERSIS (Kekekalan Massa)
      this.lavoisier.currentMass = 217.70;
      this.updateLavoisierScaleDisplay();

      if (logBox) {
        logBox.innerHTML = `
          <div style="background:#f0fdf4; border:1px solid #86efac; padding:0.75rem; border-radius:8px; color:#166534; font-size:0.86rem;">
            <strong>✅ HASIL OBSERVASI (SISTEM TERTUTUP):</strong><br>
            • Reaksi: BaCl₂ (aq) + Na₂SO₄ (aq) → BaSO₄ (s) ↓ + 2 NaCl (aq)<br>
            • Massa Sebelum: <strong>217.70 gram</strong> | Massa Sesudah: <strong>217.70 gram</strong><br>
            • Teramati endapan putih Barium Sulfat di dasar labu.<br>
            • <em>Kesimpulan: Hukum Lavoisier TERBUKTI BENAR. Massa reaktan = massa produk!</em>
          </div>
        `;
      }
    } else {
      // Pada sistem terbuka, sebagian uap gas / aerosol menguap sehingga massa sedikit berkurang
      this.lavoisier.currentMass = 215.15;
      this.updateLavoisierScaleDisplay();

      if (logBox) {
        logBox.innerHTML = `
          <div style="background:#fff1f2; border:1px solid #fecdd3; padding:0.75rem; border-radius:8px; color:#991b1b; font-size:0.86rem;">
            <strong>⚠️ HASIL OBSERVASI (SISTEM TERBUKA):</strong><br>
            • Massa Sebelum: <strong>217.70 gram</strong> | Massa Sesudah: <strong>215.15 gram (-2.55 g)</strong><br>
            • Mengapa massa berkurang? Karena wadah terbuka menyebabkan partikel aerosol/uap keluar ke udara bebas.<br>
            • <em>Hukum Kekekalan Massa hanya berlaku mutlak pada SISTEM TERTUTUP!</em>
          </div>
        `;
      }
    }
  }

  resetLavoisier() {
    this.lavoisier.hasMixed = false;
    this.lavoisier.currentMass = 217.70;
    this.updateLavoisierScaleDisplay();

    const precipitate = document.getElementById('lav-precipitate-layer');
    if (precipitate) {
      precipitate.style.height = '0px';
    }

    const logBox = document.getElementById('lav-obs-log');
    if (logBox) {
      logBox.innerHTML = `<p style="font-size:0.84rem; color:var(--text-muted);">Belum ada reaksi yang dicampurkan. Klik tombol "Campurkan Reaktan".</p>`;
    }
  }

  /* -------------------------------------------------------------
     SIMULASI 2: UJI NYALA API UNSUR LOGAM (FLAME TEST)
     ------------------------------------------------------------- */
  initFlameSim() {
    const ionBtnsContainer = document.getElementById('flame-ions-picker-mount');
    if (ionBtnsContainer) {
      const ions = this.flame.ions;
      ionBtnsContainer.innerHTML = Object.keys(ions).map(key => `
        <button class="btn btn-secondary btn-sm flame-ion-btn ${key === this.flame.currentIon ? 'active' : ''}" data-ion="${key}">
          ${ions[key].name}
        </button>
      `).join('');

      ionBtnsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.flame-ion-btn');
        if (btn && btn.dataset.ion) {
          this.selectFlameIon(btn.dataset.ion);
        }
      });
    }

    // Tombol Uji Nyala
    const btnTest = document.getElementById('btn-flame-test');
    if (btnTest) {
      btnTest.addEventListener('click', () => {
        this.triggerFlameTest();
      });
    }

    // Tombol Bersihkan Kawat
    const btnClean = document.getElementById('btn-flame-clean');
    if (btnClean) {
      btnClean.addEventListener('click', () => {
        this.resetFlameToNormal();
      });
    }
  }

  selectFlameIon(ionKey) {
    this.flame.currentIon = ionKey;
    document.querySelectorAll('.flame-ion-btn').forEach(btn => {
      if (btn.dataset.ion === ionKey) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    const ionData = this.flame.ions[ionKey];
    const infoMount = document.getElementById('flame-ion-info-mount');
    if (infoMount) {
      infoMount.innerHTML = `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:0.85rem;">
          <strong style="color:var(--text-dark);">${ionData.name}</strong><br>
          <span style="font-size:0.84rem; color:var(--text-secondary);">Warna Emisi: <strong>${ionData.desc}</strong></span><br>
          <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--accent-blue);">Panjang Gelombang Spektral (λ): ${ionData.wave}</span>
        </div>
      `;
    }
  }

  triggerFlameTest() {
    const ionData = this.flame.ions[this.flame.currentIon];
    const flameCore = document.getElementById('sim-flame-core');
    const wireElem = document.getElementById('sim-nichrome-wire');

    if (wireElem) {
      wireElem.style.transform = 'translateY(60px) rotate(15deg)';
    }

    if (flameCore && ionData) {
      setTimeout(() => {
        flameCore.style.background = `radial-gradient(ellipse at bottom, #ffffff 0%, ${ionData.color} 50%, transparent 100%)`;
        flameCore.style.filter = `drop-shadow(0 0 25px ${ionData.glow})`;

        const resultBox = document.getElementById('flame-result-box');
        if (resultBox) {
          resultBox.innerHTML = `
            <div style="background:#f0f9ff; border:1px solid #bae6fd; padding:0.75rem; border-radius:8px; color:var(--text-dark); font-size:0.86rem;">
              <strong>🔥 Eksitasi Elektron Teramati!</strong><br>
              Ketika elektron kation <strong>${ionData.name}</strong> menyerap kalor api Bunsen, elektron meloncat ke tingkat energi lebih tinggi (eksitasi). Saat kembali ke tingkat dasar (de-eksitasi), elektron memancarkan foton cahaya berenergi khas dengan warna: <strong style="color:${ionData.color}; font-size:0.95rem;">${ionData.desc}</strong> (λ = ${ionData.wave}).
            </div>
          `;
        }
      }, 400);
    }
  }

  resetFlameToNormal() {
    const flameCore = document.getElementById('sim-flame-core');
    const wireElem = document.getElementById('sim-nichrome-wire');

    if (wireElem) {
      wireElem.style.transform = 'translateY(0px) rotate(0deg)';
    }

    if (flameCore) {
      flameCore.style.background = `radial-gradient(ellipse at bottom, #38bdf8 0%, #0284c7 40%, rgba(56, 189, 248, 0.2) 70%, transparent 100%)`;
      flameCore.style.filter = `drop-shadow(0 0 20px rgba(56, 189, 248, 0.8))`;
    }

    const resultBox = document.getElementById('flame-result-box');
    if (resultBox) {
      resultBox.innerHTML = `<p style="font-size:0.82rem; color:var(--text-muted);">Kawat nikrom telah dibersihkan dalam HCl pekat. Pilih sampel garam lalu klik 'Uji Nyala Api'.</p>`;
    }
  }

  /* -------------------------------------------------------------
     SIMULASI 3: TITRASI ASAM-BASA SEDERHANA
     ------------------------------------------------------------- */
  initTitrationSim() {
    this.updateTitrationDisplay();

    // Tombol Teteskan 1 mL
    const btnDrop1 = document.getElementById('btn-titrate-drop-1');
    if (btnDrop1) {
      btnDrop1.addEventListener('click', () => {
        this.addTitrant(1.0);
      });
    }

    // Tombol Teteskan Tetes Halus 0.1 mL
    const btnDropFine = document.getElementById('btn-titrate-drop-fine');
    if (btnDropFine) {
      btnDropFine.addEventListener('click', () => {
        this.addTitrant(0.1);
      });
    }

    // Tombol Reset Titrasi
    const btnResetTitrate = document.getElementById('btn-titrate-reset');
    if (btnResetTitrate) {
      btnResetTitrate.addEventListener('click', () => {
        this.resetTitration();
      });
    }
  }

  addTitrant(amount) {
    if (this.titration.buretteUsed + amount > 50.0) return;
    this.titration.buretteUsed = parseFloat((this.titration.buretteUsed + amount).toFixed(1));

    // Animasi kran buret & tetesan
    const dropAnim = document.getElementById('titration-drop-anim');
    if (dropAnim) {
      dropAnim.style.opacity = '1';
      dropAnim.style.transform = 'translateY(25px)';
      setTimeout(() => {
        dropAnim.style.opacity = '0';
        dropAnim.style.transform = 'translateY(0px)';
      }, 300);
    }

    this.updateTitrationDisplay();
  }

  updateTitrationDisplay() {
    const vUsed = this.titration.buretteUsed;
    const vRemain = (50.0 - vUsed).toFixed(1);

    // Update level cairan buret
    const buretteLiquid = document.getElementById('burette-liquid-level');
    if (buretteLiquid) {
      const heightPercent = ((50.0 - vUsed) / 50.0) * 80;
      buretteLiquid.style.height = `${heightPercent}%`;
    }

    // Display readout
    const volDisplay = document.getElementById('titrate-vol-readout');
    if (volDisplay) {
      volDisplay.textContent = `${vUsed.toFixed(1)} mL`;
    }

    // Warna indikator fenolftalein pada Erlenmeyer
    // Titik ekuivalen: V_NaOH = 20.0 mL (0.1 M HCl × 20 mL = 0.1 M NaOH × 20 mL)
    const flaskLiquid = document.getElementById('flask-titration-liquid');
    const logMount = document.getElementById('titrate-log-mount');

    if (flaskLiquid) {
      if (vUsed < 19.5) {
        // Asam berlebih -> Bening jernih
        flaskLiquid.style.background = 'rgba(224, 242, 254, 0.4)';
        if (logMount) {
          logMount.innerHTML = `
            <p style="font-size:0.84rem; color:var(--text-secondary);">
              Volume NaOH tertetes: <strong>${vUsed.toFixed(1)} mL</strong>. Larutan masih asam (pH < 7), indikator PP tetap <strong>tak berwarna (bening)</strong>.
            </p>
          `;
        }
      } else if (vUsed >= 19.5 && vUsed < 20.0) {
        // Mendekati titik ekuivalen -> Merah muda pudar sekejap
        flaskLiquid.style.background = 'rgba(244, 114, 182, 0.35)';
        if (logMount) {
          logMount.innerHTML = `
            <p style="font-size:0.84rem; color:#be185d;">
              ⚠️ <strong>Mendekati Titik Akhir!</strong> Warna merah muda mulai tampak sesaat lalu hilang saat dikocok. Kurangi tetesan menjadi 0.1 mL/tetes.
            </p>
          `;
        }
      } else if (vUsed >= 20.0 && vUsed <= 20.5) {
        // TEPAT TITIK AKHIR EKIVALEN! -> Merah muda seulas persisten
        flaskLiquid.style.background = 'rgba(236, 72, 153, 0.65)';
        if (logMount) {
          logMount.innerHTML = `
            <div style="background:#fdf2f8; border:1.5px solid #f472b6; padding:0.75rem; border-radius:8px; color:#9d174d; font-size:0.86rem;">
              <strong>🎉 TITIK AKHIR TITRASI TERCAPAI! (V = 20.0 mL)</strong><br>
              • Warna larutan berubah menjadi <strong>merah muda seulas persisten</strong> selama 30 detik.<br>
              • Perhitungan Konsentrasi: <em>M₁ × V₁ = M₂ × V₂</em><br>
              • <em>M_HCl × 20.0 mL = 0.1 M × 20.0 mL ➔ <strong>M_HCl = 0.100 M (Tepat!)</strong></em>
            </div>
          `;
        }
      } else {
        // Terlewat (Kelebihan Basa) -> Merah ungu pekat
        flaskLiquid.style.background = 'rgba(190, 24, 93, 0.85)';
        if (logMount) {
          logMount.innerHTML = `
            <div style="background:#fff1f2; border:1px solid #fecdd3; padding:0.75rem; border-radius:8px; color:#991b1b; font-size:0.86rem;">
              <strong>⚠️ KELEBIHAN TITRAN (Over-titration)!</strong><br>
              Volume NaOH (${vUsed.toFixed(1)} mL) melebihi titik ekuivalen. Larutan menjadi sangat basa (pH > 10) dengan warna merah tua pekat. Dalam analisis kuantitatif, praktikan harus mengulang titrasi dengan lebih hati-hati.
            </div>
          `;
        }
      }
    }
  }

  resetTitration() {
    this.titration.buretteUsed = 0.0;
    this.updateTitrationDisplay();
  }
}

window.VirtualLabsModule = VirtualLabsModule;
