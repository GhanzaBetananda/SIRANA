/* SIRANA — util & format Indonesia */

export const KLASIFIKASI = [
  { kode: "U", label: "Umum" },
  { kode: "KP", label: "Kepegawaian" },
  { kode: "K", label: "Keuangan" },
  { kode: "P", label: "Perencanaan & Anggaran" },
  { kode: "SAR", label: "Kegiatan SAR Operasi" },
  { kode: "T", label: "Teknis & Telekomunikasi" },
]

export const UNIT_KERJA = [
  "Kepala Kantor",
  "Sekretariat",
  "Bidang SAR Operasi",
  "Bidang SAR Kesiapsiagaan",
  "Bidang Komunikasi dan Teknis",
  "Bidang Sarana dan Prasarana",
  "Bidang Administrasi Endowment Fund",
]

export const PRIORITAS = [
  { value: "Tinggi", cls: "badge-pri-high" },
  { value: "Sedang", cls: "badge-pri-med" },
  { value: "Rendah", cls: "badge-pri-low" },
]

/* status -> kelas badge */
export const STATUS_BADGE = {
  Baru: "badge-baru",
  Draft: "badge-draft",
  "Menunggu Persetujuan": "badge-menunggu",
  Disetujui: "badge-disetujui",
  Ditolak: "badge-ditolak",
  Terkirim: "badge-terkirim",
  Didisposisikan: "badge-disposisi",
  "Dalam Tindak Lanjut": "badge-tln",
  Selesai: "badge-selesai",
}

export function formatTanggal(iso) {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}

export function formatTanggalPendek(iso) {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function formatJam(ts) {
  const d = ts ? new Date(ts) : new Date()
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }) + " • " +
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
}

export function hariIni() {
  return new Date().toISOString().slice(0, 10)
}

export function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

/* nomor agenda berikut, dsb */
export function nextNoAgenda(list) {
  const n = list.reduce((m, s) => Math.max(m, parseInt(String(s.noAgenda).replace(/\D/g, ""), 10) || 0), 249)
  return String(n + 1).padStart(4, "0")
}

export function nextNomorSuratKeluar(list) {
  const tahun = new Date().getFullYear()
  const n = list.reduce((m, s) => {
    const c = Number(s.nomorInternal)
    return c > m ? c : m
  }, 4)
  return {
    nomorInternal: n + 1,
    nomorSurat: `${String(n + 1).padStart(3, "0")}/SRN/${tahun}`,
  }
}

export function klasifikasiLabel(kode) {
  const k = KLASIFIKASI.find((x) => x.kode === kode)
  return k ? k.label : kode || "-"
}

export function tanggalIndoUntukSurat(iso) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
}
