/* ==========================================================================
   CHEMVIRTUAL LAB - BANK SOAL KUIS EVALUASI (15 BUTIR SOAL KOMPREHENSIF)
   ========================================================================== */

const LAB_QUIZ_DATA = [
  {
    id: 1,
    question: "Alat Pelindung Diri (APD) manakah yang WAJIB digunakan untuk melindungi kornea mata dari bahaya percikan asam pekat atau ledakan serpihan kaca?",
    options: [
      "Kacamata baca biasa dengan lensa minus",
      "Safety Goggles bertutup samping kedap percikan",
      "Topi pelindung (hairnet)",
      "Kacamata hitam anti sinar UV polaroid"
    ],
    correct: 1,
    explanation: "Safety Goggles dirancang khusus dengan bingkai silikon menutup rapat sekeliling mata dan ventilasi anti-percikan cairan kimia, berbeda dengan kacamata biasa yang memiliki celah di samping."
  },
  {
    id: 2,
    question: "Bahan jas laboratorium kimia yang paling tepat dan aman sesuai standar keselamatan kerja adalah terbuat dari...",
    options: [
      "100% serat sintetis nilon tipis mengkilap",
      "Bahan katun tebal 100% dan tahan api tidak mudah meleleh",
      "Bahan plastik polietilen elastis tipis",
      "Bahan wol tebal berbulu lebat"
    ],
    correct: 1,
    explanation: "Bahan katun tebal tidak mudah meleleh jika terkena percikan panas atau api (berbeda dengan nilon/poliester yang dapat meleleh dan menempel pada kulit), serta memberikan daya serap awal terhadap percikan asam/basa."
  },
  {
    id: 3,
    question: "Jika tangan praktikan tanpa sengaja tertumpah larutan Asam Klorida (HCl) pekat, tindakan pertolongan pertama yang paling BENAR dan SEGERA adalah...",
    options: [
      "Mengoleskan pasta gigi atau mentega tebal di atas luka",
      "Membasuh dengan larutan basa kuat NaOH pekat agar netral",
      "Membilas segera dengan air mengalir deras terus-menerus minimal 15-20 menit",
      "Menutupnya rapat-rapat dengan plester perban tanpa dicuci"
    ],
    correct: 2,
    explanation: "Pertolongan pertama luka bakar kimia adalah dekontaminasi cepat menggunakan air bersih mengalir terus-menerus selama minimal 15–20 menit untuk mengencerkan dan membuang asam. Menetralkan dengan basa kuat dilarang karena reaksi netralisasi menghasilkan panas eksotermik yang justru memperparah luka bakar!"
  },
  {
    id: 4,
    question: "Pada alat pengukur volume cairan, bagaimanakah cara membaca skala meniskus yang benar untuk larutan air atau cairan bening pada buret dan gelas ukur?",
    options: [
      "Membaca titik puncak cembung teratas cairan secara miring dari atas",
      "Membaca garis dasar cekung terbawah cairan dengan posisi mata tegak lurus sejajar",
      "Membaca titik tengah antara cekung dan cembung",
      "Membaca titik permukaan cairan dari arah bawah sudut 45 derajat"
    ],
    correct: 1,
    explanation: "Untuk cairan yang membasahi dinding kaca (seperti air/larutan jernih), meniskus yang terbentuk adalah meniskus cekung. Pembacaan skala volume yang valid dilakukan pada bagian TERBAWAH dari cekungan meniskus dengan garis mata tepat sejajar (mencegah kesalahan paralaks)."
  },
  {
    id: 5,
    question: "Simbol piktogram belah ketupat merah bergambar tengkorak dengan dua tulang bersilang (☠️) memiliki arti...",
    options: [
      "Zat bersifat korosif dan mengikis logam",
      "Zat memiliki toksisitas akut tinggi / beracun mematikan",
      "Zat pengoksidasi pemicu kebakaran hebat",
      "Zat radioaktif berdaya tembus tinggi"
    ],
    correct: 1,
    explanation: "Simbol tengkorak dan tulang bersilang merupakan piktogram GHS untuk Toksisitas Akut (Acute Toxicity) Kelas 1, 2, atau 3 yang dapat menyebabkan keracunan fatal atau kematian meski terpapar dalam jumlah sangat sedikit."
  },
  {
    id: 6,
    question: "Alat laboratorium berbentuk silinder kerucut dengan leher sempit yang sangat cocok untuk wadah pengocokan saat titrasi asam-basa adalah...",
    options: [
      "Gelas Beker (Beaker Glass)",
      "Labu Erlenmeyer (Conical Flask)",
      "Tabung Reaksi (Test Tube)",
      "Gelas Ukur (Measuring Cylinder)"
    ],
    correct: 1,
    explanation: "Labu Erlenmeyer didesain dengan dinding miring menyempit ke atas sehingga larutan dapat digoyang memutar secara cepat selama titrasi tanpa khawatir cairan terpercik keluar."
  },
  {
    id: 7,
    question: "Bunyi Hukum Kekekalan Massa yang dikemukakan oleh Antoine Lavoisier (1789) menyatakan bahwa...",
    options: [
      "Massa zat sebelum reaksi selalu lebih berat daripada massa zat sesudah reaksi",
      "Volume gas berbanding lurus dengan mol partikel pada suhu tetap",
      "Dalam sistem tertutup, massa total zat-zat sebelum reaksi sama dengan massa total zat-zat sesudah reaksi",
      "Massa zat berubah menjadi energi secara spontan dalam reaksi kimia"
    ],
    correct: 2,
    explanation: "Hukum Lavoisier menyatakan kekekalan materi dalam sistem tertutup: tidak ada atom yang diciptakan atau dimusnahkan selama reaksi kimia, hanya terjadi penataan ulang ikatan kimia, sehingga massa reaktan = massa produk."
  },
  {
    id: 8,
    question: "Sebanyak 4 gram gas Hidrogen direaksikan dengan 32 gram gas Oksigen dalam wadah tertutup menghasilkan Air murni (H₂O). Sesuai Hukum Proust (rasio massa H : O = 1 : 8), berapakah massa air yang terbentuk?",
    options: [
      "18 gram",
      "32 gram",
      "36 gram",
      "40 gram"
    ],
    correct: 2,
    explanation: "Rasio massa H : O = 1 : 8. Untuk 4 g H dibutuhkan 4 × 8 = 32 g O. Karena tersedia tepat 32 g O, maka seluruh 4 g H dan 32 g O bereaksi sempurna menghasilkan: 4 g + 32 g = 36 gram Air (H₂O)."
  },
  {
    id: 9,
    question: "Model atom yang menggambarkan elektron bergerak mengelilingi inti atom pada lintasan stasioner dengan tingkat energi (kulit K, L, M, N) tertentu dikemukakan oleh...",
    options: [
      "John Dalton",
      "J.J. Thomson",
      "Ernest Rutherford",
      "Niels Bohr"
    ],
    correct: 3,
    explanation: "Niels Bohr menyempurnakan kelemahan teori Rutherford dengan mengemukakan postulat bahwa elektron beredar pada orbit lingkaran berenergi tetap tanpa memancarkan radiasi, dan hanya memancarkan/menyerap energi ketika berpindah lintasan."
  },
  {
    id: 10,
    question: "Suatu atom Natrium memiliki nomor atom (Z) = 11 dan nomor massa (A) = 23. Jumlah proton, elektron, dan neutron pada atom netral tersebut berturut-turut adalah...",
    options: [
      "11 proton, 11 elektron, 12 neutron",
      "11 proton, 12 elektron, 11 neutron",
      "23 proton, 11 elektron, 12 neutron",
      "11 proton, 11 elektron, 23 neutron"
    ],
    correct: 0,
    explanation: "Nomor atom Z = 11 menunjukkan jumlah proton = 11 dan jumlah elektron = 11 (pada atom netral). Jumlah neutron = Nomor Massa (A) - Nomor Atom (Z) = 23 - 11 = 12 neutron."
  },
  {
    id: 11,
    question: "Dalam satu periode dari KIRI ke KANAN pada Tabel Periodik Unsur, tren sifat keelektronegatifan unsur umumnya akan...",
    options: [
      "Semakin berkurang karena jumlah kulit bertambah",
      "Semakin bertambah besar karena muatan inti efektif meningkat dan jari-jari atom mengecil",
      "Tetap konstan dan sama untuk semua unsur",
      "Berkurang drastis pada golongan halogen"
    ],
    correct: 1,
    explanation: "Dari kiri ke kanan dalam satu periode, muatan inti bertambah kuat sementara jumlah kulit atom tetap, sehingga tarikan inti terhadap pasangan elektron ikatan semakin kuat (keelektronegatifan bertambah)."
  },
  {
    id: 12,
    question: "Pada uji nyala api senyawa logam garam dapur (NaCl) dengan kawat nikrom pada nyala api Bunsen, warna nyala khas yang teramati adalah...",
    options: [
      "Merah karmin menyala",
      "Kuning terang menyala (khas kation Natrium)",
      "Ungu lembayung / violet",
      "Hijau apel terang"
    ],
    correct: 1,
    explanation: "Kation Natrium (Na⁺) menghasilkan emisi spektrum cahaya yang sangat kuat pada panjang gelombang doublet 589 nm yang berwarna Kuning Terang (Yellow-Orange Flame)."
  },
  {
    id: 13,
    question: "Akronim metode internasional P.A.S.S. saat mengoperasikan Alat Pemadam Api Ringan (APAR) di laboratorium adalah singkatan dari...",
    options: [
      "Push, Alert, Spray, Stop",
      "Pull (Tarik pin), Aim (Arahkan corong), Squeeze (Tekan tuas), Sweep (Sapukan merata)",
      "Power, Action, Safety, Secure",
      "Pour, Activate, Shake, Save"
    ],
    correct: 1,
    explanation: "Teknik PASS: P = Pull the pin (tarik pin pengaman), A = Aim at base of fire (arahkan ke pangkal api), S = Squeeze the handle (tekan tuas pemadam), S = Sweep side to side (sapukan merata ke kiri-kanan)."
  },
  {
    id: 14,
    question: "Manakah tindakan di bawah ini yang MERUPAKAN PELANGGARAN FATAL aturan keselamatan kerja di laboratorium kimia?",
    options: [
      "Membaca label botol bahan kimia sebanyak dua kali sebelum menuang",
      "Memipet cairan kimia beracun atau asam pekat langsung menggunakan mulut (mouth pipetting)",
      "Menyalakan lemari asam saat mereaksikan zat yang menghasilkan uap gas",
      "Mencuci tangan dengan sabun setelah selesai praktikum"
    ],
    correct: 1,
    explanation: "Memipet larutan kimia dengan mulut (mouth pipetting) adalah pelanggaran keselamatan paling fatal di laboratorium karena berisiko tinggi menelan atau menghirup uap bahan kimia beracun dan korosif. Selalu gunakan bulb karet atau pipet filler!"
  },
  {
    id: 15,
    question: "Bagaimanakah prosedur pembuangan sisa larutan kimia logam berat seperti Tembaga(II) Sulfat (CuSO₄) setelah praktikum selesai?",
    options: [
      "Dituangkan langsung ke wastafel cuci piring dengan air sedikit",
      "Dibuang ke tong sampah kertas di sudut ruangan",
      "Dibuang ke botol limbah B3 khusus penampung kation logam berat anorganik berlabel",
      "Diuapkan hingga habis di atas meja praktikum terbuka"
    ],
    correct: 2,
    explanation: "Limbah logam berat bersifat bioakumulatif dan merusak ekosistem air sehingga dilarang dibuang ke saluran air biasa. Limbah tersebut wajib ditampung dalam jeriken/botol limbah B3 anorganik untuk diolah oleh pihak berwenang."
  }
];

window.LAB_QUIZ_DATA = LAB_QUIZ_DATA;
