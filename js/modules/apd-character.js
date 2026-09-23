/* ==========================================================================
   CHEMVIRTUAL LAB - MODUL 2: KARTUN APD LENGKAP INTERAKTIF & CHECKLIST
   ========================================================================== */

const APD_ITEMS_INFO = {
  goggles: {
    title: "Kacamata Pengaman (Safety Goggles)",
    icon: "🥽",
    category: "Pelindung Mata & Wajah",
    standard: "Standar ANSI Z87.1 / EN 166 (Tahan Benturan & Percikan)",
    material: "Polikarbonat jernih dengan pelindung samping dan ventilasi tidak langsung (indirect vent)",
    function: "Melindungi mata secara total dari percikan cairan kimia korosif, uap asam/basa pekat, debu berbahaya, dan pecahan proyektil kaca lab.",
    hazardWithout: "Percikan asam sulfat atau basa pekat dapat merusak kornea mata permanen hingga menyebabkan kebutaan hanya dalam hitungan detik!",
    properUsage: "Pastikan tali karet terpasang pas dan kedap menempel pada kontur wajah. Jangan sesekali mengucek mata dengan tangan berkaos tangan!"
  },
  mask: {
    title: "Masker Kimia / Respirator (Cartridge Respirator)",
    icon: "😷",
    category: "Pelindung Pernapasan",
    standard: "Standar NIOSH N95 / Katrid Gas Organik & Uap Asam (EN 14387)",
    material: "Lapisan meltblown elektrostatik dengan filter karbon aktif berpori",
    function: "Menyaring partikel aerosol kimia beracun, asap reaktif, dan uap pelarut organik yang mudah menguap agar tidak terhirup ke saluran paru-paru.",
    hazardWithout: "Menghirup uap kloroform, benzena, atau gas klorin dapat meracuni organ hati, merusak alveolus paru, dan memicu pingsan seketika.",
    properUsage: "Rapatkan klip hidung logam hingga tidak ada kebocoran udara di celah pipi. Bila bau bahan kimia mulai tercium, segera ganti katrid filter."
  },
  coat: {
    title: "Jas Laboratorium Katun Lengan Panjang",
    icon: "🥼",
    category: "Pelindung Badan Utama",
    standard: "SNI / ISO 13688:2013 (Pakaian Pelindung Laboratorium)",
    material: "100% Katun Tebal Tahan Api (Cotton Drill) dengan kancing tekan mudah lepas (snap button)",
    function: "Melindungi permukaan kulit tubuh dan pakaian harian dari tumpahan zat kimia, percikan asam, dan kontak panas langsung.",
    hazardWithout: "Pakaian sintetis tipis dapat langsung terbakar atau meleleh menyatu ke kulit saat terkena api atau asam pekat!",
    properUsage: "Seluruh kancing jas lab WAJIB dikancingkan rapat dari leher hingga bawah. Lengan baju tidak boleh digulung selama bekerja di meja praktikum."
  },
  gloves: {
    title: "Sarung Tangan Nitril Tahan Kimia",
    icon: "🧤",
    category: "Pelindung Tangan & Jari",
    standard: "EN 374-1:2016 Tipe A/B (Uji Ketahanan Kimia & Mikroorganisme)",
    material: "Karet sintetis Nitril Bebas Serbuk (Powder-Free Nitrile Rubber)",
    function: "Mencegah kontak dermal langsung antara tangan dengan zat kimia korosif, karsinogenik, dan pelarut organik berdaya tembus tinggi.",
    hazardWithout: "Bahan korosif seperti fenol dan asam nitrat dapat menembus kulit menimbulkan nekrosis sel dan iritasi parah tanpa rasa sakit awal.",
    properUsage: "Periksa kebocoran sarung tangan sebelum dipakai dengan meniupnya. Selalu lepas sarung tangan sebelum menyentuh gagang pintu atau layar ponsel!"
  },
  pants: {
    title: "Celana Panjang Kain Tebal",
    icon: "👖",
    category: "Pelindung Kaki Bagian Atas",
    standard: "Standar Keselamatan Kerja Lab Kimia (Full-Length Trousers)",
    material: "Kain katun kanvas tebal non-sintetis, menutupi mata kaki tanpa celah robekan",
    function: "Mencegah tetesan cairan kimia yang terjatuh dari meja lab mengenai kulit paha dan betis.",
    hazardWithout: "Celana pendek atau rok di atas lutut membuat kulit kaki terbuka telanjang terhadap percikan asam panas atau pecahan kaca jatuh.",
    properUsage: "Pilihlah celana yang pas dan nyaman, jangan memakai celana robek (ripped jeans) atau legging berbahan nilon tipis."
  },
  shoes: {
    title: "Sepatu Keselamatan Tertutup (Closed Safety Shoes)",
    icon: "👞",
    category: "Pelindung Kaki & Telapak",
    standard: "Standar Keselamatan Laboratorium Kimia (Non-Canvas, Anti-Slip Sole)",
    material: "Bahan kulit sintetis kedap cairan dengan sol karet berpola anti-slip",
    function: "Melindungi kaki dari benda tajam (pecahan tabung reaksi di lantai) dan cairan asam pekat yang tumpah ke lantai lab.",
    hazardWithout: "Memakai sandal jepit, sepatu kanvas bolong, atau sepatu berhak tinggi sangat berisiko tertusuk beling dan tersiram tumpahan zat asam!",
    properUsage: "Wajib menutupi seluruh punggung kaki dan tumit. Jangan gunakan sepatu berbahan kanvas kain tenun karena mudah menyerap cairan kimia berbahaya."
  },
  head: {
    title: "Penutup Kepala / Hairnet & Rambut Rapi",
    icon: "🧢",
    category: "Pelindung Rambut & Kepala",
    standard: "Standar Higienitas & Keselamatan Operasional Lab",
    material: "Kain polipropilena non-woven elastis bernapas",
    function: "Mengikat rambut panjang agar tidak tergerai menyentuh api bunsen terbuka, bahan kimia reaktif, atau tersangkut di peralatan berputar.",
    hazardWithout: "Rambut panjang yang tergerai dapat terbakar seketika oleh api pembakar Bunsen dalam sekejap mata!",
    properUsage: "Rambut panjang wajib diikat ke belakang secara rapi dan dimasukkan ke dalam hairnet sebelum mengenakan jas laboratorium."
  }
};

class APDCharacterModule {
  constructor() {
    this.activeItemKey = 'goggles';
    this.checklistState = {
      head: false,
      goggles: false,
      mask: false,
      coat: false,
      gloves: false,
      pants: false,
      shoes: false
    };
  }

  init() {
    this.renderCartoonSVG();
    this.renderDetailCard(this.activeItemKey);
    this.setupEventListeners();
  }

  renderCartoonSVG() {
    const container = document.getElementById('apd-cartoon-mount');
    if (!container) return;

    // SVG Kartun Manusia Saintis Kimia Ber-APD Lengkap
    container.innerHTML = `
      <div class="cartoon-wrapper">
        <svg viewBox="0 0 320 480" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Gradien Jas Lab -->
            <linearGradient id="coatGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffffff"/>
              <stop offset="60%" stop-color="#f8fafc"/>
              <stop offset="100%" stop-color="#e2e8f0"/>
            </linearGradient>
            <!-- Gradien Kacamata Goggles -->
            <linearGradient id="goggleGlass" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#0284c7" stop-opacity="0.9"/>
            </linearGradient>
            <!-- Gradien Sarung Tangan Nitril Biru -->
            <linearGradient id="gloveGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#38bdf8"/>
              <stop offset="100%" stop-color="#0369a1"/>
            </linearGradient>
            <!-- Gradien Celana Navy -->
            <linearGradient id="pantsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e293b"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <!-- Gradien Sepatu Kulit Safety -->
            <linearGradient id="shoesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#334155"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <!-- Bayangan Karakter -->
            <radialGradient id="charShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="rgba(15, 23, 42, 0.25)"/>
              <stop offset="100%" stop-color="transparent"/>
            </radialGradient>
          </defs>

          <!-- Bayangan di Lantai -->
          <ellipse cx="160" cy="466" rx="90" ry="12" fill="url(#charShadow)"/>

          <!-- SEPATU KESELAMATAN (SAFETY SHOES) -->
          <g id="svg-shoes" class="svg-part" data-part="shoes">
            <!-- Sepatu Kiri -->
            <path d="M125 440 L125 455 C125 464, 105 466, 95 466 C85 466, 85 458, 92 452 L110 440 Z" fill="url(#shoesGrad)" stroke="#0f172a" stroke-width="2"/>
            <rect x="90" y="460" width="36" height="6" rx="3" fill="#0f172a"/>
            <!-- Sepatu Kanan -->
            <path d="M195 440 L195 455 C195 464, 215 466, 225 466 C235 466, 235 458, 228 452 L210 440 Z" fill="url(#shoesGrad)" stroke="#0f172a" stroke-width="2"/>
            <rect x="194" y="460" width="36" height="6" rx="3" fill="#0f172a"/>
          </g>

          <!-- CELANA PANJANG TEBAL -->
          <g id="svg-pants" class="svg-part" data-part="pants">
            <!-- Kaki Kiri -->
            <path d="M120 330 L112 442 L138 442 L148 340 Z" fill="url(#pantsGrad)" stroke="#0f172a" stroke-width="2"/>
            <!-- Kaki Kanan -->
            <path d="M200 330 L208 442 L182 442 L172 340 Z" fill="url(#pantsGrad)" stroke="#0f172a" stroke-width="2"/>
            <!-- Pinggang Celana -->
            <path d="M118 320 L202 320 L196 345 L124 345 Z" fill="#1e293b"/>
          </g>

          <!-- JAS LABORATORIUM LENGAN PANJANG & TUBUH -->
          <g id="svg-coat" class="svg-part" data-part="coat">
            <!-- Lengan Kiri -->
            <path d="M115 155 L65 260 L85 270 L130 180 Z" fill="url(#coatGrad)" stroke="#94a3b8" stroke-width="2"/>
            <!-- Lengan Kanan -->
            <path d="M205 155 L255 260 L235 270 L190 180 Z" fill="url(#coatGrad)" stroke="#94a3b8" stroke-width="2"/>
            <!-- Badan Jas Lab -->
            <path d="M110 150 L210 150 L220 335 C220 345, 100 345, 100 335 Z" fill="url(#coatGrad)" stroke="#94a3b8" stroke-width="2.5"/>
            <!-- Kerah Jas Lab Kiri & Kanan -->
            <path d="M135 150 L160 210 L130 185 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
            <path d="M185 150 L160 210 L190 185 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
            <!-- Garis Kancing Tengah -->
            <line x1="160" y1="210" x2="160" y2="340" stroke="#94a3b8" stroke-width="2" stroke-dasharray="2 4"/>
            <!-- Kancing Jas Lab -->
            <circle cx="160" cy="225" r="4" fill="#64748b"/>
            <circle cx="160" cy="255" r="4" fill="#64748b"/>
            <circle cx="160" cy="285" r="4" fill="#64748b"/>
            <circle cx="160" cy="315" r="4" fill="#64748b"/>
            <!-- Saku Jas Lab Kiri & Kanan -->
            <rect x="112" y="270" width="32" height="36" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
            <rect x="176" y="270" width="32" height="36" rx="4" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
            <!-- Saku Dada & Pena -->
            <rect x="116" y="185" width="26" height="30" rx="3" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
            <line x1="124" y1="180" x2="124" y2="195" stroke="#0284c7" stroke-width="3"/>
          </g>

          <!-- SARUNG TANGAN NITRIL (GLOVES) -->
          <g id="svg-gloves" class="svg-part" data-part="gloves">
            <!-- Sarung Tangan Kiri -->
            <path d="M60 262 C50 270, 52 295, 66 298 C74 300, 84 290, 85 272 Z" fill="url(#gloveGrad)" stroke="#0369a1" stroke-width="2"/>
            <!-- Sarung Tangan Kanan (Memegang Labu Erlenmeyer Mini) -->
            <path d="M260 262 C270 270, 268 295, 254 298 C246 300, 236 290, 235 272 Z" fill="url(#gloveGrad)" stroke="#0369a1" stroke-width="2"/>
          </g>

          <!-- KEPALA & WAJAH -->
          <g id="svg-head-base">
            <!-- Leher -->
            <rect x="148" y="130" width="24" height="25" fill="#fbcfe8" rx="4"/>
            <!-- Kepala/Wajah -->
            <ellipse cx="160" cy="100" rx="36" ry="42" fill="#fed7aa" stroke="#f97316" stroke-width="1.5"/>
            <!-- Telinga Kiri & Kanan -->
            <ellipse cx="123" cy="100" rx="6" ry="10" fill="#fed7aa"/>
            <ellipse cx="197" cy="100" rx="6" ry="10" fill="#fed7aa"/>
            <!-- Rambut Belakang -->
            <path d="M125 90 C120 50, 200 50, 195 90 Z" fill="#475569"/>
          </g>

          <!-- PENUTUP KEPALA (HAIRNET) -->
          <g id="svg-head" class="svg-part" data-part="head">
            <path d="M120 85 C120 40, 200 40, 200 85 C204 88, 202 96, 195 96 C180 94, 140 94, 125 96 C118 96, 116 88, 120 85 Z" fill="#93c5fd" opacity="0.9" stroke="#3b82f6" stroke-width="2"/>
            <!-- Pola Jaring Hairnet -->
            <path d="M130 65 Q160 55 190 65" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 3"/>
            <path d="M135 78 Q160 68 185 78" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 3"/>
          </g>

          <!-- MATA & ALIS -->
          <g id="svg-eyes-base">
            <ellipse cx="146" cy="94" rx="4" ry="5" fill="#1e293b"/>
            <ellipse cx="174" cy="94" rx="4" ry="5" fill="#1e293b"/>
            <circle cx="147" cy="92" r="1.5" fill="#ffffff"/>
            <circle cx="175" cy="92" r="1.5" fill="#ffffff"/>
            <!-- Alis -->
            <path d="M140 86 Q146 82 152 86" stroke="#475569" stroke-width="2" fill="none"/>
            <path d="M168 86 Q174 82 180 86" stroke="#475569" stroke-width="2" fill="none"/>
          </g>

          <!-- KACAMATA PENGAMAN (SAFETY GOGGLES) -->
          <g id="svg-goggles" class="svg-part" data-part="goggles">
            <!-- Bingkai Kacamata -->
            <rect x="132" y="82" width="28" height="24" rx="8" fill="url(#goggleGlass)" stroke="#0284c7" stroke-width="3"/>
            <rect x="160" y="82" width="28" height="24" rx="8" fill="url(#goggleGlass)" stroke="#0284c7" stroke-width="3"/>
            <!-- Jembatan Hidung -->
            <path d="M158 92 L162 92" stroke="#0284c7" stroke-width="4"/>
            <!-- Kilau Kaca Lensa -->
            <path d="M136 86 L144 100" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
            <path d="M164 86 L172 100" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
            <!-- Tali Pengikat Elastis Kacamata -->
            <path d="M132 94 L123 96" stroke="#0284c7" stroke-width="3"/>
            <path d="M188 94 L197 96" stroke="#0284c7" stroke-width="3"/>
          </g>

          <!-- MASKER KIMIA / RESPIRATOR -->
          <g id="svg-mask" class="svg-part" data-part="mask">
            <!-- Tubuh Masker -->
            <path d="M140 108 C140 108, 160 102, 180 108 C185 116, 178 135, 160 135 C142 135, 135 116, 140 108 Z" fill="#0284c7" stroke="#075985" stroke-width="2"/>
            <!-- Katup Buang Tengah (Exhalation Valve) -->
            <circle cx="160" cy="122" r="6" fill="#38bdf8" stroke="#0369a1" stroke-width="1.5"/>
            <circle cx="160" cy="122" r="3" fill="#ffffff"/>
            <!-- Tali Masker ke Belakang Telinga -->
            <path d="M140 114 L124 105" stroke="#0284c7" stroke-width="1.5"/>
            <path d="M180 114 L196 105" stroke="#0284c7" stroke-width="1.5"/>
          </g>
        </svg>

        <!-- HOTSPOT BUTTONS BERANIMASI PULSE -->
        <button class="apd-hotspot hotspot-head" data-part="head" title="Penutup Kepala">1</button>
        <button class="apd-hotspot hotspot-eyes active" data-part="goggles" title="Kacamata Pengaman">2</button>
        <button class="apd-hotspot hotspot-mask" data-part="mask" title="Masker Respirator">3</button>
        <button class="apd-hotspot hotspot-coat" data-part="coat" title="Jas Laboratorium">4</button>
        <button class="apd-hotspot hotspot-gloves-l" data-part="gloves" title="Sarung Tangan Kiri">5</button>
        <button class="apd-hotspot hotspot-gloves-r" data-part="gloves" title="Sarung Tangan Kanan">5</button>
        <button class="apd-hotspot hotspot-pants" data-part="pants" title="Celana Panjang Tebal">6</button>
        <button class="apd-hotspot hotspot-shoes" data-part="shoes" title="Sepatu Keselamatan">7</button>
      </div>
    `;
  }

  renderDetailCard(itemKey) {
    const data = APD_ITEMS_INFO[itemKey];
    if (!data) return;
    this.activeItemKey = itemKey;

    const panel = document.getElementById('apd-detail-mount');
    if (!panel) return;

    panel.innerHTML = `
      <div class="apd-detail-card">
        <div class="apd-detail-header">
          <div class="apd-detail-icon">${data.icon}</div>
          <div>
            <h3>${data.title}</h3>
            <span class="badge-tag">${data.category}</span>
          </div>
        </div>

        <p><strong>Fungsi Utama:</strong> ${data.function}</p>

        <div class="apd-specs-grid">
          <div class="apd-spec-box">
            <strong>Standar Resmi</strong>
            <span>${data.standard}</span>
          </div>
          <div class="apd-spec-box">
            <strong>Material Standar</strong>
            <span>${data.material}</span>
          </div>
        </div>

        <p style="font-size:0.86rem; color:var(--text-secondary); margin-top:0.6rem;">
          <strong>💡 Tips Penggunaan Benar:</strong> ${data.properUsage}
        </p>

        <div class="apd-warning-box">
          <strong>⚠️ Bahaya Fatal Jika Diabaikan:</strong>
          <p>${data.hazardWithout}</p>
        </div>
      </div>
    `;

    // Highlight active hotspot
    document.querySelectorAll('.apd-hotspot').forEach(btn => {
      if (btn.dataset.part === itemKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  setupEventListeners() {
    // Klik Hotspot Karakter
    document.addEventListener('click', (e) => {
      const hotspot = e.target.closest('.apd-hotspot');
      if (hotspot && hotspot.dataset.part) {
        this.renderDetailCard(hotspot.dataset.part);
      }
    });

    // Checklist APD
    const checklistBox = document.getElementById('apd-checklist-items');
    if (checklistBox) {
      checklistBox.addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"]')) {
          const part = e.target.dataset.part;
          this.checklistState[part] = e.target.checked;
          const parentItem = e.target.closest('.checklist-item');
          if (parentItem) {
            if (e.target.checked) parentItem.classList.add('checked');
            else parentItem.classList.remove('checked');
          }
          this.checkAllAPD();
        }
      });
    }

    // Tombol Cek Kelayakan Masuk Lab
    const btnVerify = document.getElementById('btn-verify-apd');
    if (btnVerify) {
      btnVerify.addEventListener('click', () => {
        this.verifyLabReadiness();
      });
    }
  }

  checkAllAPD() {
    const total = Object.keys(this.checklistState).length;
    const checkedCount = Object.values(this.checklistState).filter(Boolean).length;
    const counterText = document.getElementById('apd-counter-text');
    if (counterText) {
      counterText.textContent = `${checkedCount} / ${total} Lengkap`;
    }
  }

  verifyLabReadiness() {
    const total = Object.keys(this.checklistState).length;
    const checkedCount = Object.values(this.checklistState).filter(Boolean).length;
    const statusBox = document.getElementById('apd-verify-status');
    if (!statusBox) return;

    if (checkedCount === total) {
      statusBox.innerHTML = `
        <div style="background:#f0fdf4; border:2px solid #86efac; border-radius:12px; padding:1rem; color:#166534; margin-top:1rem;">
          <h4 style="color:#15803d; font-size:1.1rem; display:flex; align-items:center; gap:0.4rem;">
            ✅ SELAMAT! APD ANDA LENGKAP & MEMENUHI STANDAR
          </h4>
          <p style="font-size:0.86rem; margin-top:0.3rem;">
            Anda telah memahami seluruh fungsi APD keselamatan kerja kimia. Anda diizinkan untuk melangkah ke Modul 3: Aturan & Prosedur Laboratorium.
          </p>
        </div>
      `;
      // Update global progress
      if (window.App) window.App.markModuleCompleted(2);
    } else {
      statusBox.innerHTML = `
        <div style="background:#fff1f2; border:2px solid #fecdd3; border-radius:12px; padding:1rem; color:#991b1b; margin-top:1rem;">
          <h4 style="color:#b91c1c; font-size:1.1rem; display:flex; align-items:center; gap:0.4rem;">
            ⛔ AKSES MASUK LAB DITOLAK!
          </h4>
          <p style="font-size:0.86rem; margin-top:0.3rem;">
            Masih ada <strong>${total - checkedCount} APD</strong> yang belum Anda kenakan/centang. Kelalaian satu APD saja dapat berakibat fatal saat insiden kimia terjadi.
          </p>
        </div>
      `;
    }
  }
}

window.APDCharacterModule = APDCharacterModule;
