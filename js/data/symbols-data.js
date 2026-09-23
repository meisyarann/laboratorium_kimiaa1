/* ==========================================================================
   CHEMVIRTUAL LAB - DATA SIMBOL KESELAMATAN KERJA (GHS HAZARD PICTOGRAMS)
   ========================================================================== */

const GHS_SYMBOLS_DATA = [
  {
    id: "flammable",
    name: "Mudah Terbakar",
    engName: "Flammable",
    iconChar: "🔥",
    color: "#ef4444",
    description: "Bahan yang memiliki titik nyala rendah, mudah menyala bila terkena percikan api, gesekan, atau panas tinggi. Dapat berbentuk gas, cairan, atau aerosol.",
    examples: "Etanol (C₂H₅OH), Aseton (CH₃COCH₃), Gas LPG / Metana, Eter, Logam Natrium (bereaksi dengan air).",
    handling: "Simpan di lemari khusus tahan api, jauhkan dari sumber api terbuka, listrik statis, dan sinar matahari langsung.",
    firstAid: "Bila pakaian terbakar: STOP, DROP, and ROLL (Gulingkan badan di lantai) atau selimuti dengan Fire Blanket."
  },
  {
    id: "corrosive",
    name: "Korosif",
    engName: "Corrosive",
    iconChar: "🧪",
    color: "#ea580c",
    description: "Bahan yang dapat merusak jaringan hidup (kulit, mata) secara permanen berupa luka bakar kimia parah, serta dapat mengikis dan melarutkan logam/wadah.",
    examples: "Asam Klorida pekat (HCl), Asam Sulfat pekat (H₂SO₄), Asam Nitrat (HNO₃), Natrium Hidroksida padat (NaOH).",
    handling: "Wajib memakai kacamata pelindung (goggles), sarung tangan nitril/neoprena tebal, dan bekerja di dalam lemari asam (fume hood).",
    firstAid: "Segera bilas bagian yang terpapar dengan air mengalir deras terus-menerus selama minimal 15–20 menit!"
  },
  {
    id: "toxic",
    name: "Beracun / Toksisitas Akut",
    engName: "Acute Toxicity / Poison",
    iconChar: "☠️",
    color: "#dc2626",
    description: "Zat yang dalam konsentrasi sangat kecil dapat menimbulkan keracunan akut parah, kegagalan organ fatal, koma, hingga kematian jika terhirup, tertelan, atau terserap kulit.",
    examples: "Kalium Sianida (KCN), Raksa / Merkuri (Hg), Arsenik Trioksida (As₂O₃), Gas Karbon Monoksida (CO).",
    handling: "Gunakan masker respirator berfilter gas kimia, lemari asam terkunci, dan simpan di lemari racun berlabel ketat.",
    firstAid: "Segera bawa korban ke udara segar, jangan memancing muntah tanpa arahan medis darurat, hubungi IGD."
  },
  {
    id: "oxidizing",
    name: "Pengoksidasi",
    engName: "Oxidizing Agent",
    iconChar: "⭕🔥",
    color: "#d97706",
    description: "Zat yang melepaskan oksigen secara cepat sehingga dapat memicu, memperhebat, atau mempercepat pembakaran bahan mudah menyala lainnya secara dahsyat.",
    examples: "Kalium Permanganat (KMnO₄), Hidrogen Peroksida pekat (H₂O₂), Kalium Klorat (KClO₃), Asam Perklorat.",
    handling: "Jangan pernah menyimpan berdekatan dengan bahan pereduksi, pelarut organik, kayu, atau kain lap laboratorium.",
    firstAid: "Padamkan api oksidator dengan pasir kering, serbuk kimia khusus, atau air dalam jumlah melimpah bila aman."
  },
  {
    id: "explosive",
    name: "Mudah Meledak",
    engName: "Explosive",
    iconChar: "💥",
    color: "#b91c1c",
    description: "Bahan padat atau cair yang secara spontan atau akibat guncangan/gesekan mampu menghasilkan reaksi kimia berkecepatan tinggi dengan gas panas dan tekanan dahsyat.",
    examples: "Trinitrotoluena (TNT), Nitrogliserin, Amonium Nitrat pekat, Asam Pikrat kering.",
    handling: "Hindarkan dari benturan keras, gesekan, loncatan bunga api, dan suhu tinggi. Amati kelembapan penyimpanan.",
    firstAid: "Bila terjadi ledakan, segera bunyikan alarm darurat, evakuasi seluruh gedung menuju titik kumpul (assembly point)."
  },
  {
    id: "health_hazard",
    name: "Bahaya Kesehatan Kronis",
    engName: "Health Hazard / Carcinogen",
    iconChar: "👤🫁",
    color: "#7c3aed",
    description: "Zat yang berpotensi memicu kanker (karsinogenik), mutasi DNA genetik (mutagenik), toksisitas reproduksi, dan kerusakan organ dalam jangka panjang.",
    examples: "Benzena (C₆H₆), Formalin / Formaldehida, Timbal (Pb), Kloroform berlebih, Asbes.",
    handling: "Minimalkan paparan dengan lemari asam kedap aliran udara dan penggunaan APD lengkap.",
    firstAid: "Lepaskan seluruh pakaian yang terkontaminasi dan lakukan pemeriksaan medis berkala."
  },
  {
    id: "irritant",
    name: "Bahaya / Iritan Ringan",
    engName: "Harmful / Irritant",
    iconChar: "❗",
    color: "#eab308",
    description: "Zat kimia yang dapat menyebabkan iritasi lokal pada kulit, selaput lendir mata, bersin/batuk saluran pernapasan, atau pusing dan mengantuk.",
    examples: "Amonia encer (NH₄OH), Kalsium Klorida, Asam Asetat encer, Etil Asetat, Pemutih pakaian.",
    handling: "Bekerja di ruangan berfasilitas sirkulasi udara baik dan selalu kenakan sarung tangan lateks.",
    firstAid: "Bilas kulit dengan sabun dan air mengalir, hirup udara segar bila mulai merasa pusing."
  },
  {
    id: "environment",
    name: "Berbahaya bagi Lingkungan",
    engName: "Environmental Hazard",
    iconChar: "🐟🌳",
    color: "#16a34a",
    description: "Zat yang mencemari tanah, sungai, danau, serta sangat beracun bagi ekosistem perairan dan satwa akuatik dengan efek jangka panjang (bioakumulasi).",
    examples: "Tembaga(II) Sulfat (CuSO₄), Logam Berat (Pb, Hg, Cd), Klorobenzena, Pestisida kimia.",
    handling: "DILARANG KERAS membuang sisa zat atau limbah ke wastafel air limbah rumah tangga! Masukkan ke botol limbah B3 berlabel.",
    firstAid: "Tampung tumpahan menggunakan bahan penyerap inert (pasir / vermikulit) dan serahkan ke pengolah limbah B3 resmi."
  },
  {
    id: "gas_cylinder",
    name: "Gas Bertekanan",
    engName: "Gas Under Pressure",
    iconChar: "🥫",
    color: "#0284c7",
    description: "Gas yang disimpan di dalam tabung silinder bertekanan tinggi (≥ 200 kPa). Dapat meledak bila terkena panas berlebih atau bila katupnya patah.",
    examples: "Silinder Oksigen murni (O₂), Nitrogen cair/gas (N₂), Argon, Helium, Asetilena untuk pengelasan.",
    handling: "Tabung harus selalu dirantai/diikat kuat tegak pada dinding dan dilindungi tutup pelindung katup saat tidak digunakan.",
    firstAid: "Bila tabung bocor dingin (cryogenic), jangan sentuh langsung untuk mencegah radang beku (frostbite)."
  }
];

window.GHS_SYMBOLS_DATA = GHS_SYMBOLS_DATA;
