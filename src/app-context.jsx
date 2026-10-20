import React, { createContext, useContext, useMemo, useState } from "react"
import {
  INITIAL_SURAT_MASUK,
  INITIAL_SURAT_KELUAR,
  INITIAL_DISPOSISI,
} from "./data.js"
import { uid, formatJam, nextNoAgenda, nextNomorSuratKeluar } from "./utils.js"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [pengguna, setPengguna] = useState({
    nama: "Nur Hikmawan, S.AP.",
    jabatan: "Administrator Persuratan",
    unit: "Sekretariat",
    nip: "19880512 201012 1 004",
    pangkat: "Penata (III/c)",
    email: "nur.hikmawan@basarnas.go.id",
  })

  const [ loggedIn, setLoggedIn ] = useState(false)

  const [suratMasuk, setSuratMasuk] = useState(INITIAL_SURAT_MASUK)
  const [suratKeluar, setSuratKeluar] = useState(INITIAL_SURAT_KELUAR)
  const [disposisi, setDisposisi] = useState(INITIAL_DISPOSISI)
  const [aktivitas, setAktivitas] = useState([
    { id: uid("ac"), judul: "Surat masuk baru diagendakan No. 248 dari Inspektorat Kantor Pusat", ts: new Date(new Date().getTime() - 25 * 60000).getTime() },
    { id: uid("ac"), judul: 'Draft surat "Permohonan izin kegiatan Simulasi Tanggap Bencana" dibuat oleh Bidang SAR Kesiapsiagaan', ts: new Date(new Date().getTime() - 2 * 3600e3).getTime() },
    { id: uid("ac"), judul: 'Surat "Pengajuan anggaran pembelian radio HT" diajukan untuk persetujuan', ts: new Date(new Date().getTime() - 5 * 3600e3).getTime() },
    { id: uid("ac"), judul: "Disposisi No. 112/BPKAD/09/2025 dinyatakan dalam tindak lanjut", ts: new Date(new Date().getTime() - 24 * 3600e3).getTime() },
    { id: uid("ac"), judul: 'Surat keluar "Laporan Pelaksanaan 1-ku Peran SAR" terkirim', ts: new Date(new Date().getTime() - 46 * 3600e3).getTime() },
  ])

  const catatAktivitas = (judul) => {
    setAktivitas((list) => [
      { id: uid("ac"), judul, ts: Date.now() },
      ...list,
    ])
  }

  /* ---------------- Aksi Surat Masuk ---------------- */
  const tambahSuratMasuk = (data) => {
    const no = nextNoAgenda(suratMasuk)
    const baru = {
      ...data,
      id: uid("sm"),
      noAgenda: no,
      status: "Baru",
      riwayat: [{ waktu: data.tanggalDiterima, judul: "Surat diterima dan diagendakan", detail: `No. agenda ${no} oleh ${pengguna.unit}` }],
    }
    setSuratMasuk((l) => [baru, ...l])
    catatAktivitas(`Surat masuk baru diagendakan No. ${no} dari ${data.pengirim}`)
    return baru
  }

  /* Teruskan surat masuk -> disposisi */
  const buatDisposisi = (suratId, { penerima, instruksi, prioritas, tenggat }) => {
    const surat = suratMasuk.find((s) => s.id === suratId)
    if (!surat) return null
    const dispo = {
      id: uid("dp"),
      suratId,
      nomorSurat: surat.nomorSurat,
      pengirim: surat.pengirim,
      perihal: surat.perihal,
      tanggalDiterima: surat.tanggalDiterima,
      penerima,
      instruksi,
      prioritas,
      tenggat,
      status: "Belum Ditindaklanjuti",
      riwayatInstruksi: [
        { waktu: `${surat.tanggalDiterima} (hari ini)`, pemberi: pengguna.nama, instruksi },
      ],
    }
    setDisposisi((l) => [dispo, ...l])
    setSuratMasuk((l) =>
      l.map((s) =>
        s.id === suratId
          ? {
              ...s,
              status: "Didisposisikan",
              riwayat: [
                ...s.riwayat,
                { waktu: new Date().toISOString().slice(0, 10), judul: "Surat didisposisikan", detail: `Kepada ${penerima} — Prioritas ${prioritas}` },
              ],
            }
          : s
      )
    )
    catatAktivitas(`Surat ${surat.nomorSurat} didisposisikan kepada ${penerima}`)
    return dispo
  }

  const mulaiTindakLanjut = (id) => {
    setDisposisi((l) =>
      l.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "Dalam Tindak Lanjut",
              riwayatInstruksi: [
                ...d.riwayatInstruksi,
                { waktu: formatJam(), pemberi: d.penerima, instruksi: "Tindak lanjut disposisi dimulai." },
              ],
            }
          : d
      )
    )
    const d = disposisi.find((x) => x.id === id)
    if (d) {
      setSuratMasuk((l) => l.map((s) => (s.id === d.suratId ? { ...s, status: "Dalam Tindak Lanjut" } : s)))
      catatAktivitas(`Tindak lanjut disposisi surat ${d.nomorSurat} dimulai oleh ${d.penerima}`)
    }
  }

  const selesaikanDisposisi = (id) => {
    setDisposisi((l) =>
      l.map((d) =>
        d.id === id
          ? {
              ...d,
              status: "Selesai",
              riwayatInstruksi: [
                ...d.riwayatInstruksi,
                { waktu: formatJam(), pemberi: d.penerima, instruksi: "Tindak lanjut dinyatakan selesai oleh unit." },
              ],
            }
          : d
      )
    )
    const d = disposisi.find((x) => x.id === id)
    if (d) {
      setSuratMasuk((l) =>
        l.map((s) =>
          s.id === d.suratId
            ? {
                ...s,
                status: "Selesai",
                riwayat: [
                  ...s.riwayat,
                  { waktu: new Date().toISOString().slice(0, 10), judul: "Tindak lanjut selesai", detail: "Dinyatakan selesai dan diarsipkan" },
                ],
              }
            : s
        )
      )
      catatAktivitas(`Disposisi surat ${d.nomorSurat} selesai dan diarsipkan`)
    }
  }

  /* ---------------- Aksi Surat Keluar ---------------- */
  const tambahSuratKeluar = (data) => {
    const nomor = nextNomorSuratKeluar(suratKeluar)
    const baru = {
      ...data,
      id: uid("sk"),
      nomorSurat: "- (Draft)",
      nomorInternal: nomor.nomorInternal,
      status: "Draft",
      pembuat: pengguna.nama,
      tanggalPengajuan: null,
      alasanPenolakan: null,
    }
    setSuratKeluar((l) => [baru, ...l])
    catatAktivitas(`Draft surat "${data.perihal}" dibuat oleh ${data.unit || pengguna.unit}`)
    return baru
  }

  const updateSuratKeluar = (id, data) => {
    setSuratKeluar((l) => l.map((s) => (s.id === id ? { ...s, ...data, status: "Draft" } : s)))
    catatAktivitas('Draft surat "' + (data.perihal || "") + '" diperbarui')
  }

  const hapusSuratKeluar = (id) => {
    const s = suratKeluar.find((x) => x.id === id)
    setSuratKeluar((l) => l.filter((x) => x.id !== id))
    if (s) catatAktivitas('Draft surat "' + s.perihal + '" dihapus')
    return s
  }

  const ajukanPersetujuan = (id) => {
    setSuratKeluar((l) =>
      l.map((s) =>
        s.id === id ? { ...s, status: "Menunggu Persetujuan", tanggalPengajuan: new Date().toISOString().slice(0, 10) } : s
      )
    )
    const s = suratKeluar.find((x) => x.id === id)
    if (s) catatAktivitas(`Surat "${s.perihal}" diajukan untuk persetujuan`)
  }

  const keputusanPersetujuan = (id, keputusan, alasan = null) => {
    const s = suratKeluar.find((x) => x.id === id)
    setSuratKeluar((l) =>
      l.map((x) =>
        x.id === id
          ? {
              ...x,
              status: keputusan,
              alasanPenolakan: keputusan === "Ditolak" ? alasan : null,
              nomorSurat: keputusan === "Disetujui" && x.nomorSurat.startsWith("-") ? `${String(x.nomorInternal).padStart(3, "0")}/SRN/${new Date().getFullYear()}` : x.nomorSurat,
            }
          : x
      )
    )
    if (s) {
      catatAktivitas(
        keputusan === "Disetujui"
          ? `Surat "${s.perihal}" disetujui oleh pemaraf`
          : `Surat "${s.perihal}" ditolak dengan catatan`
      )
    }
  }

  const kirimSurat = (id) => {
    setSuratKeluar((l) => l.map((x) => (x.id === id ? { ...x, status: "Terkirim" } : x)))
    const s = suratKeluar.find((x) => x.id === id)
    if (s) catatAktivitas(`Surat "${s.perihal}" terkirim kepada ${s.tujuan}`)
  }

  /* ---------------- Pengaturan ---------------- */
  const simpanProfil = (data) => {
    setPengguna((p) => ({ ...p, ...data }))
    catatAktivitas("Profil pengguna diperbarui melalui pengaturan")
  }

  /* ---------------- Derivasi ---------------- */
  const suratMenungguPersetujuan = useMemo(
    () => suratKeluar.filter((s) => s.status === "Menunggu Persetujuan"),
    [suratKeluar]
  )

  const arsip = useMemo(() => {
    const masukArsip = suratMasuk
      .filter((s) => s.status === "Selesai")
      .map((s) => ({
        id: s.id,
        jenis: "Surat Masuk",
        nomorSurat: s.nomorSurat,
        noAgenda: s.noAgenda,
        tanggal: s.tanggalDiterima,
        perihal: s.perihal,
        klasifikasi: s.klasifikasi,
        unit: s.unitTujuan,
        pihak: s.pengirim,
        lampiran: s.lampiran,
      }))
    const keluarArsip = suratKeluar
      .filter((s) => s.status === "Terkirim")
      .map((s) => ({
        id: s.id,
        jenis: "Surat Keluar",
        nomorSurat: s.nomorSurat,
        noAgenda: "-",
        tanggal: s.tanggalSurat,
        perihal: s.perihal,
        klasifikasi: s.klasifikasi,
        unit: s.unit,
        pihak: s.tujuan,
        lampiran: s.lampiran,
      }))
    return [...masukArsip, ...keluarArsip]
  }, [suratMasuk, suratKeluar])

  const notifikasi = useMemo(() => {
    const items = []
    disposisi
      .filter((d) => d.status === "Belum Ditindaklanjuti")
      .forEach((d) =>
        items.push({
          tipe: "disposisi",
          judul: `Disposisi menunggu tindak lanjut — ${d.nomorSurat}`,
          detail: `Penerima: ${d.penerima} • Tenggat: ${d.tenggat}`,
          ts: Date.now(),
        })
      )
    suratMenungguPersetujuan.forEach((s) =>
      items.push({
        tipe: "persetujuan",
        judul: `Surat menunggu persetujuan — ${s.perihal}`,
        detail: `Pembuat: ${s.pembuat}`,
        ts: Date.now(),
      })
    )
    disposisi
      .filter((d) => d.status === "Dalam Tindak Lanjut")
      .forEach((d) =>
        items.push({
          tipe: "tln",
          judul: `Tindak lanjut berjalan — ${d.nomorSurat}`,
          detail: `${d.penerima} • Tenggat: ${d.tenggat}`,
          ts: Date.now(),
        })
      )
    return items
  }, [disposisi, suratMenungguPersetujuan])

  const data = {
    pengguna,
    loggedIn,
    setLoggedIn,
    suratMasuk,
    suratKeluar,
    disposisi,
    aktivitas,
    arsip,
    notifikasi,
    suratMenungguPersetujuan,
    aksi: {
      tambahSuratMasuk,
      buatDisposisi,
      mulaiTindakLanjut,
      selesaikanDisposisi,
      tambahSuratKeluar,
      updateSuratKeluar,
      hapusSuratKeluar,
      ajukanPersetujuan,
      keputusanPersetujuan,
      kirimSurat,
      simpanProfil,
    },
  }

  return <AppContext.Provider value={data}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
