/**
 * ======================================================================================
 * GOOGLE APPS SCRIPT: CHEMVIRTUAL LAB KIMIA (KONEKSI SPREADSHEET REAL-TIME)
 * Guru Kimia Pengampu: Fatma Alawiyah, S.Pd.,Gr (NIP: 200103272025212017)
 * Media Pembelajaran Interaktif Laboratorium Virtual Kimia SMA/MA - Kelas X.1 s.d. X.5
 * ======================================================================================
 * 
 * PETUNJUK PENERAPAN DALAM 2 MENIT:
 * 1. Buka Google Spreadsheet baru di browser: https://sheets.new
 * 2. Beri nama file Spreadsheet, misalnya: "Data Siswa & Nilai ChemVirtual Lab"
 * 3. Klik menu: Ekstensi (Extensions) > Apps Script
 * 4. Hapus seluruh kode bawaan (myFunction), lalu tempel (Paste) seluruh kode ini.
 * 5. Klik ikon Simpan (Save) (ikon disket 💾 atau Ctrl+S).
 * 6. Klik tombol biru "Terapkan" (Deploy) di kanan atas > "Deployment baru" (New deployment).
 * 7. Pada ikon gerigi "Pilih jenis", pilih "Aplikasi Web" (Web App).
 * 8. Konfigurasi:
 *    - Deskripsi: ChemVirtual Lab API Siswa
 *    - Jalankan sebagai (Execute as): Saya (email Anda)
 *    - Siapa yang memiliki akses (Who has access): Siapa saja (Anyone) -> SANGAT PENTING!
 * 9. Klik "Terapkan" (Deploy) & berikan izin (Authorize access jika diminta).
 * 10. Salin "URL Aplikasi Web" (Web App URL) yang berakhiran "/exec".
 * 11. Buka Dashboard Guru ChemVirtual Lab > Klik "Tautkan Spreadsheet" > Tempel URL tersebut!
 * ======================================================================================
 */

// 1. HANDLER GET (Mengambil Data Siswa & Uji Sambungan)
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "get_students";

  // Uji koneksi / Ping
  if (action === "ping") {
    return createJsonResponse({
      status: "success",
      message: "ChemVirtual Lab Spreadsheet API Aktif & Siap Menerima Data!",
      timestamp: Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss")
    });
  }

  // Simpan data siswa via GET fallback jika POST terhalang jaringan sekolah
  if (action === "save_student" && e.parameter.data) {
    try {
      var studentObj = JSON.parse(e.parameter.data);
      return saveOrUpdateStudent(studentObj);
    } catch (err) {
      return createJsonResponse({ status: "error", message: err.toString() });
    }
  }

  // Default: Ambil seluruh data siswa untuk Dashboard Guru
  return getAllStudents();
}

// 2. HANDLER POST (Menyimpan Data Siswa Login, Kuis, & LKPD)
function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : "";
    if (!raw) {
      return createJsonResponse({ status: "error", message: "Data kosong" });
    }
    
    var payload = JSON.parse(raw);

    // Opsi Unggah Masal (Bulk Upload)
    if (payload.action === "save_students_bulk" && Array.isArray(payload.students)) {
      return saveBulkStudents(payload.students);
    }

    // Opsi Simpan Siswa Individu
    var student = payload.student || payload;
    return saveOrUpdateStudent(student);
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

// 3. FUNGSI INISIALISASI LEMBAR KERJA (SHEET) DENGAN FORMAT RESMI
function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Data Siswa");
  
  if (!sheet) {
    sheet = ss.insertSheet("Data Siswa");
    
    // Header Kolom Resmi Laboratorium Virtual Kimia
    var headers = [
      "No",
      "ID Siswa",
      "Nama Lengkap Siswa",
      "Kelas",
      "Kuis 1 (Alat Lab & K3)",
      "Kuis 2 (Struktur Atom)",
      "Kuis 3 (Sistem Periodik)",
      "Kuis Modul 8 (Evaluasi)",
      "Status LKPD PBL",
      "Status Sertifikat",
      "Waktu Terakhir Aktif",
      "Waktu Login Awal",
      "Modul Selesai",
      "Data Analisis LKPD (Fase 1-5)"
    ];
    
    sheet.appendRow(headers);
    
    // Styling Header Profesional & Mewah
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#0284c7"); // Biru Laboratorium
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    headerRange.setVerticalAlignment("middle");
    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);
    
    // Atur Lebar Kolom yang Nyaman Dibaca
    sheet.setColumnWidth(1, 45);   // No
    sheet.setColumnWidth(2, 110);  // ID
    sheet.setColumnWidth(3, 230);  // Nama
    sheet.setColumnWidth(4, 85);   // Kelas
    sheet.setColumnWidth(5, 120);  // Kuis 1
    sheet.setColumnWidth(6, 120);  // Kuis 2
    sheet.setColumnWidth(7, 120);  // Kuis 3
    sheet.setColumnWidth(8, 120);  // Kuis 8
    sheet.setColumnWidth(9, 110);  // LKPD
    sheet.setColumnWidth(10, 120); // Sertifikat
    sheet.setColumnWidth(11, 160); // Terakhir Aktif
    sheet.setColumnWidth(12, 160); // Login Awal
    sheet.setColumnWidth(13, 95);  // Modul Selesai
    sheet.setColumnWidth(14, 280); // Data LKPD
  }
  return sheet;
}

// 4. SIMPAN ATAU PERBARUI DATA SISWA (Mencegah Duplikasi Akun Siswa)
function saveOrUpdateStudent(student) {
  if (!student || !student.nama || !student.kelas) {
    return createJsonResponse({ status: "error", message: "Nama dan Kelas siswa wajib diisi." });
  }

  var sheet = getOrCreateSheet();
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;

  var targetNama = String(student.nama).trim().toLowerCase();
  var targetKelas = String(student.kelas).trim().toUpperCase();

  // Cari apakah siswa sudah pernah login sebelumnya (berdasarkan Nama & Kelas)
  for (var i = 1; i < data.length; i++) {
    var rowNama = String(data[i][2]).trim().toLowerCase();
    var rowKelas = String(data[i][3]).trim().toUpperCase();
    if (rowNama === targetNama && rowKelas === targetKelas) {
      rowIndex = i + 1; // Baris 1-indexed di Google Sheets
      break;
    }
  }

  var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
  var lkpdJson = "";
  if (student.lkpdData) {
    lkpdJson = typeof student.lkpdData === "string" ? student.lkpdData : JSON.stringify(student.lkpdData);
  }

  if (rowIndex > 0) {
    // Siswa SUDAH ADA: Perbarui progress, nilai, LKPD, dan waktu aktif
    var oldT1 = data[rowIndex - 1][4];
    var oldT2 = data[rowIndex - 1][5];
    var oldT3 = data[rowIndex - 1][6];
    var oldKuis = data[rowIndex - 1][7];

    var nT1 = student.nilaiTopik1 !== undefined ? student.nilaiTopik1 : oldT1;
    var nT2 = student.nilaiTopik2 !== undefined ? student.nilaiTopik2 : oldT2;
    var nT3 = student.nilaiTopik3 !== undefined ? student.nilaiTopik3 : oldT3;
    var nK = student.nilaiKuis !== undefined ? student.nilaiKuis : oldKuis;

    sheet.getRange(rowIndex, 5).setValue(nT1);
    sheet.getRange(rowIndex, 6).setValue(nT2);
    sheet.getRange(rowIndex, 7).setValue(nT3);
    sheet.getRange(rowIndex, 8).setValue(nK);
    sheet.getRange(rowIndex, 9).setValue(student.lkpdStatus || data[rowIndex - 1][8]);
    sheet.getRange(rowIndex, 10).setValue(student.sertifikatStatus || data[rowIndex - 1][9]);
    sheet.getRange(rowIndex, 11).setValue(student.terakhirAktif || now);

    if (student.modulSelesai !== undefined) {
      sheet.getRange(rowIndex, 13).setValue(student.modulSelesai);
    }
    if (lkpdJson) {
      sheet.getRange(rowIndex, 14).setValue(lkpdJson);
    }

    return createJsonResponse({
      status: "success",
      action: "updated",
      message: "Data progress siswa " + student.nama + " berhasil diperbarui di Spreadsheet.",
      student: student
    });
  } else {
    // Siswa BARU: Tambahkan baris baru
    var newNo = data.length; // Baris ke-(data.length)
    var stdId = student.id || ("std-" + targetKelas.toLowerCase().replace(".", "") + "-" + Utilities.formatDate(new Date(), "Asia/Jakarta", "HHmmss"));
    var loginTime = student.loginTime || now;

    var newRow = [
      newNo,
      stdId,
      student.nama,
      student.kelas,
      student.nilaiTopik1 || 0,
      student.nilaiTopik2 || 0,
      student.nilaiTopik3 || 0,
      student.nilaiKuis || 0,
      student.lkpdStatus || "Belum Mulai",
      student.sertifikatStatus || "Belum Memenuhi",
      student.terakhirAktif || now,
      loginTime,
      student.modulSelesai || 1,
      lkpdJson
    ];

    sheet.appendRow(newRow);

    // Format perataan baris baru
    var lastRowIdx = sheet.getLastRow();
    sheet.getRange(lastRowIdx, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRowIdx, 4).setHorizontalAlignment("center");
    sheet.getRange(lastRowIdx, 5, 1, 4).setHorizontalAlignment("center");
    sheet.getRange(lastRowIdx, 9, 1, 2).setHorizontalAlignment("center");

    return createJsonResponse({
      status: "success",
      action: "inserted",
      message: "Siswa baru " + student.nama + " (" + student.kelas + ") berhasil masuk ke Spreadsheet & Dashboard Guru!",
      student: student
    });
  }
}

// 5. UNGGAH MASSAL DATA SISWA
function saveBulkStudents(studentsList) {
  var count = 0;
  for (var i = 0; i < studentsList.length; i++) {
    if (studentsList[i] && studentsList[i].nama) {
      saveOrUpdateStudent(studentsList[i]);
      count++;
    }
  }
  return createJsonResponse({
    status: "success",
    message: count + " data siswa berhasil disinkronkan ke Spreadsheet."
  });
}

// 6. AMBIL SELURUH DATA SISWA (Untuk Dimuat oleh Dashboard Guru)
function getAllStudents() {
  var sheet = getOrCreateSheet();
  var data = sheet.getDataRange().getValues();
  var students = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var namaSiswa = row[2] ? String(row[2]).trim() : "";
    if (!namaSiswa) continue; // Lewati baris kosong

    var lkpdDataParsed = null;
    if (row[13]) {
      try {
        lkpdDataParsed = JSON.parse(row[13]);
      } catch (err) {
        lkpdDataParsed = row[13];
      }
    }

    students.push({
      id: String(row[1] || ("std-" + i)),
      nama: namaSiswa,
      kelas: String(row[3] || "X.1"),
      nilaiTopik1: Number(row[4]) || 0,
      nilaiTopik2: Number(row[5]) || 0,
      nilaiTopik3: Number(row[6]) || 0,
      nilaiKuis: Number(row[7]) || 0,
      hasAttemptedTopik1: Number(row[4]) > 0,
      hasAttemptedTopik2: Number(row[5]) > 0,
      hasAttemptedTopik3: Number(row[6]) > 0,
      lkpdStatus: String(row[8] || "Belum Mulai"),
      sertifikatStatus: String(row[9] || "Belum Memenuhi"),
      terakhirAktif: String(row[10] || "-"),
      loginTime: String(row[11] || "-"),
      modulSelesai: Number(row[12]) || 1,
      lkpdData: lkpdDataParsed
    });
  }

  return createJsonResponse({
    status: "success",
    total: students.length,
    timestamp: Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss"),
    students: students
  });
}

// 7. PEMBANTU OUTPUT JSON DENGAN HEADER CORS
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
