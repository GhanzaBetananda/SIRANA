# SIRANA — Sistem Informasi Persuratan dan Kearsipan BASARNAS

Prototype **frontend** aplikasi persuratan digital internal BASARNAS, terinspirasi dari alur kerja SRIKANDI. 100% frontend-only: seluruh data adalah **dummy** dan scana hidup di state aplikasi, tanpa backend, database, atau autentikasi nyata.

> Tagline: **"Persuratan Digital yang Terintegrasi, Tertib, dan Efisien"**

## Menjalankan

```bash
npm install   # hanya sekali di awal
npm run dev   # buka http://localhost:5173
```

Build produksi: `npm run build`, preview hasil build: `npm run preview`.

## Halaman

| Menu | Isi |
| --- | --- |
| **Login simulasi** | Masuk dengan sandi apa pun (tidak ada backend) |
| **Dashboard** | 5 kartu statistik, grafik 6 bulan (Recharts), surat terbaru, daftar tugas, aktivitas |
| **Surat Masuk** | Tabel + pencarian + filter status/unit/tanggal + pagination, tambah surat (dengan lampiran PDF), detail + pratinjau lampiran + riwayat + teruskan ke disposisi |
| **Surat Keluar** | Tabel + filter + pagination, buat/edit draft (editor teks sederhana), pratinjau dokumen resmi A4, hapus draft, ajukan persetujuan, tandai terkirim |
| **Disposisi** | Daftar, detail, mulai/selesaikan tindak lanjut, prioritas, tenggat, riwayat instruksi |
| **Persetujuan** | Pengajuan surat, pratinjau A4, Setujui / Tolak dengan formulir alasan, riwayat keputusan |
| **Arsip Digital** | Arsip united surat masuk & keluar, pencarian multi-kriteria, detail + pratinjau PDF dummy + unduh simulasi, empty state |
| **Pengaturan** | Profil pengguna, unit kerja, preferensi tampilan (toggle), informasi aplikasi |

## Alur simulasi

- **Surat Masuk**: Tambah/terima → teruskan ke **Disposisi** → Mulai Tindak Lanjut → Selesaikan → otomatis masuk **Arsip Digital**.
- **Surat Keluar**: Draft → **Ajukan Persetujuan** → Disetujui (nomor surat otomatis ditetapkan) → Tandai Terkirim → otomatis masuk **Arsip Digital**. Tolak dengan alasan → draft kembali bisa diedit.

## Notifikasi

Semua toast memakai **React-Toastify** (kanan atas, limit 4). Konfirmasi penting (hapus draft, tolak surat, selesaikan disposisi, logout) memakai **modal konfirmasi kustom** yang selaras tema.

## Teknologi

Vite • React 18 • React Router 6 • React-Toastify 10 • Recharts 2 • lucide-react • CSS kustom (tanpa Tailwind)

## Desain

Gaya dashboard pemerintahan: dominan putih, aksen utama oranye `#FCAD38`, sekunder biru `#1F06AC`, border abu tipis, bayangan lembut. Sidebar dapat diciutkan/dijadikan drawer di mobile. Logo simbol di `src/components/dokumen.jsx` (komponen `LogoMark`) mudah diganti logo BASARNAS asli.
