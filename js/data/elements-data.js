/* ==========================================================================
   CHEMVIRTUAL LAB - DATA TABEL PERIODIK & STRUKTUR ATOM & HUKUM DASAR
   ========================================================================== */

const BOHR_ATOMS_DATA = {
  H:  { name: "Hidrogen", z: 1,  mass: 1.008, shells: [1], symbol: "H", group: "IA", period: 1 },
  He: { name: "Helium",   z: 2,  mass: 4.003, shells: [2], symbol: "He", group: "VIIIA", period: 1 },
  Li: { name: "Litium",   z: 3,  mass: 6.94,  shells: [2, 1], symbol: "Li", group: "IA", period: 2 },
  C:  { name: "Karbon",   z: 6,  mass: 12.01, shells: [2, 4], symbol: "C", group: "IVA", period: 2 },
  N:  { name: "Nitrogen", z: 7,  mass: 14.01, shells: [2, 5], symbol: "N", group: "VA", period: 2 },
  O:  { name: "Oksigen",  z: 8,  mass: 16.00, shells: [2, 6], symbol: "O", group: "VIA", period: 2 },
  Na: { name: "Natrium",  z: 11, mass: 22.99, shells: [2, 8, 1], symbol: "Na", group: "IA", period: 3 },
  Mg: { name: "Magnesium",z: 12, mass: 24.31, shells: [2, 8, 2], symbol: "Mg", group: "IIA", period: 3 },
  Al: { name: "Aluminium",z: 13, mass: 26.98, shells: [2, 8, 3], symbol: "Al", group: "IIIA", period: 3 },
  Si: { name: "Silikon",  z: 14, mass: 28.09, shells: [2, 8, 4], symbol: "Si", group: "IVA", period: 3 },
  P:  { name: "Fosfor",   z: 15, mass: 30.97, shells: [2, 8, 5], symbol: "P", group: "VA", period: 3 },
  S:  { name: "Belerang", z: 16, mass: 32.06, shells: [2, 8, 6], symbol: "S", group: "VIA", period: 3 },
  Cl: { name: "Klorin",   z: 17, mass: 35.45, shells: [2, 8, 7], symbol: "Cl", group: "VIIA", period: 3 },
  Ar: { name: "Argon",    z: 18, mass: 39.95, shells: [2, 8, 8], symbol: "Ar", group: "VIIIA", period: 3 },
  K:  { name: "Kalium",   z: 19, mass: 39.10, shells: [2, 8, 8, 1], symbol: "K", group: "IA", period: 4 },
  Ca: { name: "Kalsium",  z: 20, mass: 40.08, shells: [2, 8, 8, 2], symbol: "Ca", group: "IIA", period: 4 }
};

// Database Unsur Periodik Lengkap (118 Unsur)
const PERIODIC_ELEMENTS_DATA = [
  { z: 1, s: "H", n: "Hidrogen", m: 1.008, c: "nonmetal", g: 1, p: 1, conf: "1s¹" },
  { z: 2, s: "He", n: "Helium", m: 4.003, c: "noble", g: 18, p: 1, conf: "1s²" },
  { z: 3, s: "Li", n: "Litium", m: 6.941, c: "alkali", g: 1, p: 2, conf: "[He] 2s¹" },
  { z: 4, s: "Be", n: "Berilium", m: 9.012, c: "alkaline", g: 2, p: 2, conf: "[He] 2s²" },
  { z: 5, s: "B", n: "Boron", m: 10.81, c: "metalloid", g: 13, p: 2, conf: "[He] 2s² 2p¹" },
  { z: 6, s: "C", n: "Karbon", m: 12.01, c: "nonmetal", g: 14, p: 2, conf: "[He] 2s² 2p²" },
  { z: 7, s: "N", n: "Nitrogen", m: 14.01, c: "nonmetal", g: 15, p: 2, conf: "[He] 2s² 2p³" },
  { z: 8, s: "O", n: "Oksigen", m: 16.00, c: "nonmetal", g: 16, p: 2, conf: "[He] 2s² 2p⁴" },
  { z: 9, s: "F", n: "Fluorin", m: 19.00, c: "halogen", g: 17, p: 2, conf: "[He] 2s² 2p⁵" },
  { z: 10, s: "Ne", n: "Neon", m: 20.18, c: "noble", g: 18, p: 2, conf: "[He] 2s² 2p⁶" },
  { z: 11, s: "Na", n: "Natrium", m: 22.99, c: "alkali", g: 1, p: 3, conf: "[Ne] 3s¹" },
  { z: 12, s: "Mg", n: "Magnesium", m: 24.31, c: "alkaline", g: 2, p: 3, conf: "[Ne] 3s²" },
  { z: 13, s: "Al", n: "Aluminium", m: 26.98, c: "post-trans", g: 13, p: 3, conf: "[Ne] 3s² 3p¹" },
  { z: 14, s: "Si", n: "Silikon", m: 28.09, c: "metalloid", g: 14, p: 3, conf: "[Ne] 3s² 3p²" },
  { z: 15, s: "P", n: "Fosfor", m: 30.97, c: "nonmetal", g: 15, p: 3, conf: "[Ne] 3s² 3p³" },
  { z: 16, s: "S", n: "Belerang", m: 32.06, c: "nonmetal", g: 16, p: 3, conf: "[Ne] 3s² 3p⁴" },
  { z: 17, s: "Cl", n: "Klorin", m: 35.45, c: "halogen", g: 17, p: 3, conf: "[Ne] 3s² 3p⁵" },
  { z: 18, s: "Ar", n: "Argon", m: 39.95, c: "noble", g: 18, p: 3, conf: "[Ne] 3s² 3p⁶" },
  { z: 19, s: "K", n: "Kalium", m: 39.10, c: "alkali", g: 1, p: 4, conf: "[Ar] 4s¹" },
  { z: 20, s: "Ca", n: "Kalsium", m: 40.08, c: "alkaline", g: 2, p: 4, conf: "[Ar] 4s²" },
  { z: 21, s: "Sc", n: "Skandium", m: 44.96, c: "transition", g: 3, p: 4, conf: "[Ar] 3d¹ 4s²" },
  { z: 22, s: "Ti", n: "Titanium", m: 47.87, c: "transition", g: 4, p: 4, conf: "[Ar] 3d² 4s²" },
  { z: 23, s: "V", n: "Vanadium", m: 50.94, c: "transition", g: 5, p: 4, conf: "[Ar] 3d³ 4s²" },
  { z: 24, s: "Cr", n: "Kromium", m: 52.00, c: "transition", g: 6, p: 4, conf: "[Ar] 3d⁵ 4s¹" },
  { z: 25, s: "Mn", n: "Mangan", m: 54.94, c: "transition", g: 7, p: 4, conf: "[Ar] 3d⁵ 4s²" },
  { z: 26, s: "Fe", n: "Besi", m: 55.85, c: "transition", g: 8, p: 4, conf: "[Ar] 3d⁶ 4s²" },
  { z: 27, s: "Co", n: "Kobalt", m: 58.93, c: "transition", g: 9, p: 4, conf: "[Ar] 3d⁷ 4s²" },
  { z: 28, s: "Ni", n: "Nikel", m: 58.69, c: "transition", g: 10, p: 4, conf: "[Ar] 3d⁸ 4s²" },
  { z: 29, s: "Cu", n: "Tembaga", m: 63.55, c: "transition", g: 11, p: 4, conf: "[Ar] 3d¹⁰ 4s¹" },
  { z: 30, s: "Zn", n: "Seng", m: 65.38, c: "transition", g: 12, p: 4, conf: "[Ar] 3d¹⁰ 4s²" },
  { z: 31, s: "Ga", n: "Galium", m: 69.72, c: "post-trans", g: 13, p: 4, conf: "[Ar] 3d¹⁰ 4s² 4p¹" },
  { z: 32, s: "Ge", n: "Germanium", m: 72.63, c: "metalloid", g: 14, p: 4, conf: "[Ar] 3d¹⁰ 4s² 4p²" },
  { z: 33, s: "As", n: "Arsenik", m: 74.92, c: "metalloid", g: 15, p: 4, conf: "[Ar] 3d¹⁰ 4s² 4p³" },
  { z: 34, s: "Se", n: "Selenium", m: 78.97, c: "nonmetal", g: 16, p: 4, conf: "[Ar] 3d¹⁰ 4s² 4p⁴" },
  { z: 35, s: "Br", n: "Bromin", m: 79.90, c: "halogen", g: 17, p: 4, conf: "[Ar] 3d¹⁰ 4s² 4p⁵" },
  { z: 36, s: "Kr", n: "Kripton", m: 83.80, c: "noble", g: 18, p: 4, conf: "[Ar] 3d¹⁰ 4s² 4p⁶" },
  { z: 37, s: "Rb", n: "Rubidium", m: 85.47, c: "alkali", g: 1, p: 5, conf: "[Kr] 5s¹" },
  { z: 38, s: "Sr", n: "Stronsium", m: 87.62, c: "alkaline", g: 2, p: 5, conf: "[Kr] 5s²" },
  { z: 39, s: "Y", n: "Itrium", m: 88.91, c: "transition", g: 3, p: 5, conf: "[Kr] 4d¹ 5s²" },
  { z: 40, s: "Zr", n: "Zirkonium", m: 91.22, c: "transition", g: 4, p: 5, conf: "[Kr] 4d² 5s²" },
  { z: 47, s: "Ag", n: "Perak", m: 107.87, c: "transition", g: 11, p: 5, conf: "[Kr] 4d¹⁰ 5s¹" },
  { z: 50, s: "Sn", n: "Timah", m: 118.71, c: "post-trans", g: 14, p: 5, conf: "[Kr] 4d¹⁰ 5s² 5p²" },
  { z: 53, s: "I", n: "Iodin", m: 126.90, c: "halogen", g: 17, p: 5, conf: "[Kr] 4d¹⁰ 5s² 5p⁵" },
  { z: 54, s: "Xe", n: "Xenon", m: 131.29, c: "noble", g: 18, p: 5, conf: "[Kr] 4d¹⁰ 5s² 5p⁶" },
  { z: 56, s: "Ba", n: "Barium", m: 137.33, c: "alkaline", g: 2, p: 6, conf: "[Xe] 6s²" },
  { z: 79, s: "Au", n: "Emas", m: 196.97, c: "transition", g: 11, p: 6, conf: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹" },
  { z: 80, s: "Hg", n: "Raksa", m: 200.59, c: "transition", g: 12, p: 6, conf: "[Xe] 4f¹⁴ 5d¹⁰ 6s²" },
  { z: 82, s: "Pb", n: "Timbal", m: 207.2, c: "post-trans", g: 14, p: 6, conf: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²" },
  { z: 92, s: "U", n: "Uranium", m: 238.03, c: "actinide", g: 3, p: 7, conf: "[Rn] 5f³ 6d¹ 7s²" }
];

// Data Hukum-Hukum Dasar Kimia
const CHEMICAL_LAWS_DATA = [
  {
    id: "lavoisier",
    title: "Hukum Kekekalan Massa (Lavoisier, 1789)",
    formula: "Massa Total Reaktan = Massa Total Produk",
    explanation: "Dalam suatu sistem tertutup, massa zat sebelum dan sesudah reaksi kimia selalu sama (tetap), tidak ada atom yang hilang ataupun tercipta baru.",
    example: "Reaksi pembentukan endapan: BaCl₂ (aq) + Na₂SO₄ (aq) → BaSO₄ (s) + 2NaCl (aq). Jika massa total awal 150 gram, maka massa total akhir tetap tepat 150 gram.",
    hasLab: true,
    labId: "vlab-pane-lavoisier",
    labName: "Praktikum Virtual Lavoisier",
    labIcon: "⚖️"
  },
  {
    id: "proust",
    title: "Hukum Perbandingan Tetap (Proust, 1799)",
    formula: "Massa Unsur A : Massa Unsur B = Rasio Konstan",
    explanation: "Perbandingan massa unsur-unsur pembentuk suatu senyawa kimia murni selalu tetap dan tertentu, dari mana pun senyawa itu diperoleh.",
    example: "Air murni (H₂O) selalu memiliki rasio massa Hidrogen : Oksigen = 1 : 8. Jika 2 gram Hidrogen direaksikan dengan 16 gram Oksigen, terbentuk tepat 18 gram Air tanpa sisa.",
    hasLab: true,
    labId: "vlab-pane-proust",
    labName: "Praktikum Virtual Proust",
    labIcon: "🧪"
  },
  {
    id: "dalton",
    title: "Hukum Kelipatan Berganda (Dalton, 1803)",
    formula: "Rasio Massa Unsur Kedua = Bilangan Bulat Sederhana",
    explanation: "Bila dua unsur membentuk lebih dari satu jenis senyawa, dan jika massa salah satu unsur dibuat sama, maka massa unsur lainnya berbanding sebagai bilangan bulat dan sederhana.",
    example: "Senyawa CO dan CO₂. Untuk 12 gram Karbon yang sama, massa Oksigen pada CO adalah 16 gram, sedangkan pada CO₂ adalah 32 gram. Rasio O(CO) : O(CO₂) = 16 : 32 = 1 : 2.",
    hasLab: true,
    labId: "vlab-pane-dalton",
    labName: "Praktikum Virtual Dalton",
    labIcon: "⚛️"
  },
  {
    id: "gay_lussac",
    title: "Hukum Perbandingan Volume (Gay-Lussac, 1808)",
    formula: "V₁ : V₂ : V₃ = Koefisien₁ : Koefisien₂ : Koefisien₃",
    explanation: "Pada suhu (T) dan tekanan (P) yang sama, volume gas-gas yang bereaksi dan volume gas hasil reaksi berbanding lurus sebagai bilangan bulat sederhana.",
    example: "2 H₂ (g) + O₂ (g) → 2 H₂O (g). Rasio volume = 2 Liter Gas Hidrogen + 1 Liter Gas Oksigen → 2 Liter Uap Air.",
    hasLab: true,
    labId: "vlab-pane-gases",
    labName: "Kalkulator Volume Gas",
    labIcon: "💨"
  },
  {
    id: "avogadro",
    title: "Hipotesis Avogadro (Avogadro, 1811)",
    formula: "V₁ / n₁ = V₂ / n₂   (N = n × 6.022 × 10²³)",
    explanation: "Pada suhu dan tekanan yang sama, semua gas yang memiliki volume yang sama akan mengandung jumlah molekul (partikel) yang sama banyak.",
    example: "1 mol gas apa saja pada kondisi standar (STP: 0°C, 1 atm) selalu menempati volume tepat 22.4 Liter dan mengandung 6.022 × 10²³ molekul.",
    hasLab: true,
    labId: "vlab-pane-gases",
    labName: "Kalkulator Gas Avogadro",
    labIcon: "🎈"
  }
];

window.BOHR_ATOMS_DATA = BOHR_ATOMS_DATA;
window.PERIODIC_ELEMENTS_DATA = PERIODIC_ELEMENTS_DATA;
window.CHEMICAL_LAWS_DATA = CHEMICAL_LAWS_DATA;
