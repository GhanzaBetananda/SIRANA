/* ===========================
   Data dummy SIRANA (frontend-only)
   Simulasi data administrasi Kantor SAR
   =========================== */

const y = new Date().getFullYear()
const m = new Date().getMonth()

function iso(monthOffset, day) {
  return new Date(y, m + monthOffset, day).toISOString().slice(0, 10)
}

export const INITIAL_SURAT_MASUK = [
  {
    id: "sm-1",
    noAgenda: "241",
    nomorSurat: "098/SAR-OPS/09/2025",
    tanggalSurat: iso(-1, 18),
    tanggalDiterima: iso(-1, 20),
    pengirim: "Badan Nasional Pencarian dan Pertolongan",
    perihal: "Undangan Rapat Koordinasi Kesiapsiagaan SAR Nasional",
    klasifikasi: "SAR",
    unitTujuan: "Bidang SAR Kesiapsiagaan",
    status: "Disetujui",
    lampiran: "Undangan_Koordinasi_SAR_Nasional.pdf",
    deskripsi:
      "Rapat koordinasi kesiapsiagaan SAR Nasional di Kantor Pusat pada hari Jum'at pukul 09.00 WIB. Aparatur unit terkait diminta hadir tepat waktu.",
    riwayat: [
      { waktu: iso(-1, 20), judul: "Surat diterima dan diagendakan", detail: "No. agenda 241 oleh Sekretariat" },
      { waktu: iso(-1, 20), judul: "Surat didisposisikan", detail: "Kepada Bidang SAR Kesiapsiagaan — Prioritas Sedang" },
      { waktu: iso(-1, 23), judul: "Tindak lanjut selesai", detail: "Pihak unit telah mengirimkan konfirmasi kehadiran" },
    ],
  },
  {
    id: "sm-2",
    noAgenda: "242",
    nomorSurat: "112/BPKAD/09/2025",
    tanggalSurat: iso(-1, 24),
    tanggalDiterima: iso(-1, 25),
    pengirim: "Biro Sarana dan Prasarana Kantor Pusat",
    perihal: "Bantuan Yanma 2025 Tahun Anggaran 2025",
    klasifikasi: "K",
    unitTujuan: "Bidang Sarana dan Prasarana",
    status: "Dalam Tindak Lanjut",
    lampiran: "Sabetan_Bantuan_Yanma.pdf",
    deskripsi: "Pengumuman sabetan pada AK: Sarana SAR 4 titik (Masih belum confirm).",
    riwayat: [
      { waktu: iso(-1, 25), judul: "Surat diterima dan diagendakan", detail: "No. agenda 242 oleh Sekretariat" },
      { waktu: iso(-1, 26), judul: "Surat didisposisikan", detail: "Kepada Bidang Sarana dan Prasarana — Prioritas Tinggi" },
      { waktu: iso(0, 1), judul: "Tindak lanjut dmulai", detail: "Verifikasi kebutuhan unit sedang berjalan" },
    ],
  },
  {
    id: "sm-3",
    noAgenda: "243",
    nomorSurat: "033/DM/Neg.OTG/09/2025",
    tanggalSurat: iso(-1, 28),
    tanggalDiterima: iso(-1, 28),
    pengirim: "Direktorat Mitigasi BNPB",
    perihal: "Sosialisasi Mitigasi Bencana untuk Publik wilayah Kalsel",
    klasifikasi: "U",
    unitTujuan: "Sekretariat",
    status: "Didisposisikan",
    lampiran: "Sosialisasi_Mitigasi_Bencana.pdf",
    deskripsi:
      "Propinsi 15 Kalimantan Selatan melaksanakan Sosialisasi dan Simulasi tanggap bencana di wilayah Kotabaru.",
    riwayat: [
      { waktu: iso(-1, 28), judul: "Surat diterima dan diagendakan", detail: "No. agenda 243 oleh Sekretariat" },
      { waktu: iso(0, 2), judul: "Surat didisposisikan", detail: "Kepada Sekretariat — Prioritas Sedang" },
    ],
  },
  {
    id: "sm-4",
    noAgenda: "244",
    nomorSurat: "075/RDW/D.1/09/2025",
    tanggalSurat: iso(0, 2),
    tanggalDiterima: iso(0, 3),
    pengirim: "PT Radar Data Utama",
    perihal: "Pengdiangan kerjasama pemasangan dish RDW",
    klasifikasi: "T",
    unitTujuan: "Bidang Komunikasi dan Teknis",
    status: "Baru",
    lampiran: null,
    deskripsi: "Surat menginformasikan rebat sigap memberikan pengurangan biaya bagi program SAR.",
    riwayat: [
      { waktu: iso(0, 3), judul: "Surat diterima dan diagendakan", detail: "No. agenda 244 oleh Sekretariat" },
    ],
  },
  {
    id: "sm-5",
    noAgenda: "245",
    nomorSurat: "088/SOPG/09/2025",
    tanggalSurat: iso(0, 4),
    tanggalDiterima: iso(0, 5),
    pengirim: "Kantor Pencarian dan Pertolongan Kelas A Makassar",
    perihal: "Laporan Hasil Operasi SAR Razia Idul Kerzi",
    klasifikasi: "SAR",
    unitTujuan: "Bidang SAR Operasi",
    status: "Baru",
    lampiran: "Laporan_Hasil_Razia_Idul_Kerzi.pdf",
    deskripsi: "Melaporkan hasil operasi SAR, KIP dengan jumlah 6 orang dan pembagian 17 samsun.",
    riwayat: [
      { waktu: iso(0, 5), judul: "Surat diterima dan diagendakan", detail: "No. agenda 245 oleh Sekretariat" },
    ],
  },
  {
    id: "sm-6",
    noAgenda: "246",
    nomorSurat: "134/KP/Sec/09/2025",
    tanggalSurat: iso(0, 6),
    tanggalDiterima: iso(0, 6),
    pengirim: "Kepala Kantor SAR Banjarmasin",
    perihal: "Ajuan dibentuk pengajuan personel untuk pelatihan guideFirst",
    klasifikasi: "KP",
    unitTujuan: "Sekretariat",
    status: "Selesai",
    lampiran: null,
    deskripsi: "Pengajuan usul personel untuk pelatihan guideFirst di pusdiklat.",
    riwayat: [
      { waktu: iso(0, 6), judul: "Surat diterima dan diagendakan", detail: "No. agenda 246 oleh Sekretariat" },
      { waktu: iso(0, 7), judul: "Surat didisposisikan", detail: "Kepala Kantor/Pelatihan — Prioritas Tinggi" },
      { waktu: iso(0, 9), judul: "Tindak lanjut selesai", detail: "Surat persetujuan telah diterbitkan" },
    ],
  },
  {
    id: "sm-7",
    noAgenda: "247",
    nomorSurat: "042/PRT/10/2025",
    tanggalSurat: iso(0, 9),
    tanggalDiterima: iso(0, 10),
    pengirim: "Bidang Perencanaan Kantor Pusat",
    perihal: "Pemantauan realisasi pelaksanaan anggaran triwulan IV",
    klasifikasi: "P",
    unitTujuan: "Kepala Kantor",
    status: "Baru",
    lampiran: "Realisasi_Triwulan_IV.pdf",
    deskripsi: "Monitoring dan evaluasi realisasi pelaksanaan anggaran triwulan",
    riwayat: [
      { waktu: iso(0, 10), judul: "Surat diterima dan diagendakan", detail: "No. agenda 247 oleh Sekretariat" },
    ],
  },
  {
    id: "sm-8",
    noAgenda: "248",
    nomorSurat: "055/SAPE/10/2025",
    tanggalSurat: iso(0, 11),
    tanggalDiterima: iso(0, 12),
    pengirim: "Inspektorat Kantor Pusat BASARNAS",
    perihal: "Pemberitaan pertanggungjawaban SOPN 2025",
    klasifikasi: "U",
    unitTujuan: "Kepala Kantor",
    status: "Baru",
    lampiran: null,
    deskripsi: "Pemberitahuan seputar perampaiam SOPN 2025 terhadap Kantor SAR blanjarmasin",
    riwayat: [
      { waktu: iso(0, 12), judul: "Surat diterima dan diagendakan", detail: "No. agenda 248 oleh Sekretariat" },
    ],
  },
]

export const INITIAL_SURAT_KELUAR = [
  {
    id: "sk-1",
    nomorSurat: "044/SR/2026",
    nomorInternal: 1,
    tanggalSurat: iso(-1, 22),
    tujuan: "Kepala Kantor Pusat BASARNAS",
    perihal: "Laporan Pelaksanaan 1-ku Peran SAR Banjarmasin",
    unit: "Sekretariat",
    klasifikasi: "U",
    status: "Terkirim",
    isi:
      "Menindaklanjuti surat dari Kantor Pusat BASARNAS nomor 051/EV/JV/2025 hari tanggal 12 September 2025, dengan ini adalah bagian laporan pelaksanaan kegiatan permejaan syarif yang dilaksanakan per tanggal 21 September 2025 pada 3. kalimat.",
    pembuat: "Admin Sekretariat",
    tanggalPengajuan: iso(-1, 22),
    lampiran: "Laporan_Pelaksanaan.pdf",
    alasanPenolakan: null,
    nomorSuratHex: "-",
  },
  {
    id: "sk-2",
    nomorSurat: "- (Draft)",
    nomorInternal: 2,
    tanggalSurat: iso(0, 2),
    tujuan: "Anggota Sosialisasi Kota Banjarmasin",
    perihal: "Permohonan izin kegiatan Simulasi Tanggap Bencana",
    unit: "Bidang SAR Kesiapsiagaan",
    klasifikasi: "SAR",
    status: "Draft",
    isi:
      "Dengan hormat, sehubungan dengan akan dilaksanakannya kegiatan simulasi tanggap bencana di wilayah Kota Banjarmasin, kami mohon izin dan dukungan sarana serta para peserta seleksi pelaksanaan Kegiatan.",
    pembuat: "Admin SAR Kesiapsiagaan",
    tanggalPengajuan: null,
    lampiran: null,
    alasanPenolakan: null,
  },
  {
    id: "sk-3",
    nomorSurat: "046/SR/2026",
    nomorInternal: 3,
    tanggalSurat: iso(0, 6),
    tujuan: "Sekretaris Jenderal Basarnas",
    perihal: "Pengaturan Program Pembinaan Organisasi",
    unit: "Bidang Sarana dan Prasarana",
    klasifikasi: "P",
    status: "Menunggu Persetujuan",
    isi:
      "Dengan memperhatikan program dan rencana kerja di atas,-With hormat menyampaikan pengajuan perpendanaan pelaksanaan pembinaan keorganisasian termasuk faktor angled pendukung kegiatan.",
    pembuat: "Admin Sarpras",
    tanggalPengajuan: iso(0, 7),
    lampiran: "Proposal_Program_Pembinaan.pdf",
    alasanPenolakan: null,
  },
  {
    id: "sk-4",
    nomorSurat: "047/SR/2026",
    nomorInternal: 4,
    tanggalSurat: iso(0, 8),
    tujuan: "Kepala Basarnas Kantor Banjarmasin",
    perihal: "Pengajuan anggaran untuk pembelian 1 bahan radio",
    unit: "Bidang Komunikasi dan Teknis",
    klasifikasi: "K",
    status: "Menunggu Persetujuan",
    isi:
      "Sehubungan berakhirnya masa pakai peralatan komunikasi radio di Pos SAR Terpadu, dengan ini kami mengajukan permohonan anggaran untuk pengadaan 1 unit radio HT dan aksesori yang diperlukan.",
    pembuat: "Admin Komtek",
    tanggalPengajuan: iso(0, 9),
    lampiran: null,
    alasanPenolakan: null,
  },
  {
    id: "sk-5",
    nomorSurat: "- (Draft)",
    nomorInternal: 5,
    tanggalSurat: iso(0, 10),
    tujuan: "Kepala Dinas PMK Provinsi Kalimantan Selatan",
    perihal: "Surat Pemberitahuan Kegiatan Kooman Alipan",
    unit: "Bidang SAR Operasi",
    klasifikasi: "SAR",
    status: "Ditolak",
    isi:
      "Dengan hormat kami memberitahukan rencana pelaksanaan kegiatan siap saket widow rirel jurang hari pelaksanaan SAR wilayah batas Alam Kalimantan departemen berambilak.",
    pembuat: "Admin SAR Ops",
    tanggalPengajuan: iso(0, 11),
    lampiran: null,
    alasanPenolakan:
      "Perihal surat belum jelas ditifikasi dan didukung oleh roman surat tindak uji flying C-West komunikasi organisasi.",
  },
]

export const INITIAL_DISPOSISI = [
  {
    id: "dp-1",
    suratId: "sm-1",
    nomorSurat: "098/SAR-OPS/09/2025",
    pengirim: "Badan Nasional Pencarian dan Pertolongan",
    perihal: "Undangan Rapat Koordinasi Kesiapsiagaan SAR Nasional",
    tanggalDiterima: iso(-1, 20),
    penerima: "Bidang SAR Kesiapsiagaan",
    instruksi:
      "Siapkan bahan koordinasi dan koordinasi dengan unit terkait serta pertanggungjawaban pesertanya kepada Kepala Kantor.",
    prioritas: "Sedang",
    tenggat: iso(-1, 23),
    status: "Selesai",
    riwayatInstruksi: [
      { waktu: iso(-1, 20) + " 10.30", pemberi: "Kepala Kantor", instruksi: "Andy unit SAR kesiapsiagaan untuk menyiapkan bahan rapat." },
      { waktu: iso(-1, 23) + " 15.00", pemberi: "Bidang SAR Kesiapsiagaan", instruksi: "Konfirmasi kehadiran telah dikirim ke Kantor Pusat." },
    ],
  },
  {
    id: "dp-2",
    suratId: "sm-2",
    nomorSurat: "112/BPKAD/09/2025",
    pengirim: "Biro Sarana dan Prasarana Kantor Pusat",
    perihal: "Bantuan Yanma 2025 Tahun Anggaran 2025",
    tanggalDiterima: iso(-1, 25),
    penerima: "Bidang Sarana dan Prasarana",
    instruksi:
      "Verifikasi data kebutuhan unit serta siapkan dokumen sambutan sabetan sebelum tenggat berakhir.",
    prioritas: "Tinggi",
    tenggat: iso(0, 14),
    status: "Dalam Tindak Lanjut",
    riwayatInstruksi: [
      { waktu: iso(-1, 26) + " 09.00", pemberi: "Kepala Kantor", instruksi: "Prioritaskan verifikasi kebutuhan 4 titik sarana SAR." },
      { waktu: iso(0, 1) + " 11.20", pemberi: "Bidang Sarana dan Prasarana", instruksi: "Dokumen sabetan sedang disusun, tahap 60%." },
    ],
  },
  {
    id: "dp-3",
    suratId: "sm-3",
    nomorSurat: "033/DM/Neg.OTG/09/2025",
    pengirim: "Direktorat Mitigasi BNPB",
    perihal: "Sosialisasi Mitigasi Bencana untuk Publik wilayah Kalsel",
    tanggalDiterima: iso(-1, 28),
    penerima: "Sekretariat",
    instruksi:
      "Koordinasikan dengan palliative lokal dan siapkan tim sosialisasi termasuk materi bahan publikasi.",
    prioritas: "Sedang",
    tenggat: iso(0, 18),
    status: "Belum Ditindaklanjuti",
    riwayatInstruksi: [
      { waktu: iso(0, 2) + " 08.40", pemberi: "Kepala Kantor", instruksi: "Susun jadwal sosialisasi dengan BNPB wilayah." },
    ],
  },
]

export const DASH_KUNCI = {
  /* minimalist chart data (6 bulan terakhir) */
}
