import React, { useMemo, useState } from "react"
import {
  Plus, Search, Eye, FilterX, FileText, ClipboardList, ChevronDown,
} from "lucide-react"
import { useApp } from "../app-context.jsx"
import { notify } from "../components/ui.jsx"
import { Badge, EmptyState, Field, Modal, PageHeader, Pagination, PrioritasBadge, LoadingBlock, ConfirmModal } from "../components/ui.jsx"
import { PDFPreview, UnduhSimulasi } from "../components/dokumen.jsx"
import {
  KLASIFIKASI, UNIT_KERJA, PRIORITAS,
  formatTanggal, hariIni,
} from "../utils.js"

const PER_HAL = 5

export function FormulirDisposisi({ surat, onSubmit, onCancel }) {
  const [penerima, setPenerima] = useState("")
  const [instruksi, setInstruksi] = useState("")
  const [prioritas, setPrioritas] = useState("Sedang")
  const [tenggat, setTenggat] = useState(hariIni())
  const [err, setErr] = useState({})
  const [proses, setProses] = useState(false)

  const simpan = async () => {
    const e = {}
    if (!penerima) e.penerima = "Pilih penerima disposisi."
    if (!instruksi.trim()) e.instruksi = "Instruksi wajib diisi."
    if (!tenggat) e.tenggat = "Tentukan tenggat tindak lanjut."
    setErr(e)
    if (Object.keys(e).length) {
      notify.warning("Lengkapi formulir disposisi terlebih dahulu.")
      return
    }
    setProses(true)
    await new Promise((r) => setTimeout(r, 650))
    setProses(false)
    onSubmit({ penerima, instruksi: instruksi.trim(), prioritas, tenggat })
  }

  return (
    <>
      <div className="form-grid">
        <Field label="Nomor Surat Terpilih" required>
          <input className="input" value={surat?.nomorSurat || "-"} disabled />
        </Field>
        <Field label="Penerima Disposisi / Unit Kerja" required error={err.penerima}>
          <div>
            <select className={`select ${err.penerima ? "invalid" : ""}`} value={penerima} onChange={(e) => setPenerima(e.target.value)}>
              <option value="">— Pilih penerima —</option>
              {UNIT_KERJA.filter((u) => u !== "Kepala Kantor").map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </Field>
        <Field label="Prioritas" required>
          <select className="select" value={prioritas} onChange={(e) => setPrioritas(e.target.value)}>
            {PRIORITAS.map((p) => <option key={p.value} value={p.value}>{p.value}</option>)}
          </select>
        </Field>
        <Field label="Tenggat Tindak Lanjut" required error={err.tenggat}>
          <input className={`input ${err.tenggat ? "invalid" : ""}`} type="date" value={tenggat} onChange={(e) => setTenggat(e.target.value)} />
        </Field>
        <Field label="Instruksi Disposisi" required error={err.instruksi} full>
          <textarea
            className={`textarea ${err.instruksi ? "invalid" : ""}`}
            rows={3}
            placeholder="Tulis instruksi disposisi untuk penerima…"
            value={instruksi}
            onChange={(e) => setInstruksi(e.target.value)}
          />
        </Field>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 4 }}>
        <button className="btn btn-outline" onClick={onCancel}>Batal</button>
        <button className="btn btn-primary" onClick={simpan} disabled={proses}>
          {proses ? "Meneruskan…" : <><ClipboardList size={15} /> Teruskan ke Disposisi</>}
        </button>
      </div>
    </>
  )
}

function FormulirSuratMasuk({ onClose }) {
  const { aksi } = useApp()
  const kosong = {
    nomorSurat: "", tanggalSurat: hariIni(), tanggalDiterima: hariIni(),
    pengirim: "", perihal: "", klasifikasi: "U", unitTujuan: "Sekretariat",
    deskripsi: "", lampiran: null,
  }
  const [f, setF] = useState(kosong)
  const [err, setErr] = useState({})
  const [proses, setProses] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const setFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      notify.error("Lampiran harus berupa berkas PDF.")
      return
    }
    setF({ ...f, lampiran: file.name })
    notify.info(`Lampiran "${file.name}" dilampirkan (simulasi).`)
  }

  const simpan = async (langsungDisposisi) => {
    const e = {}
    if (!f.nomorSurat.trim()) e.nomorSurat = "Nomor surat wajib diisi."
    if (!f.pengirim.trim()) e.pengirim = "Pengirim wajib diisi."
    if (!f.perihal.trim()) e.perihal = "Perihal wajib diisi."
    if (!f.tanggalSurat) e.tanggalSurat = "Tanggal surat wajib diisi."
    if (!f.tanggalDiterima) e.tanggalDiterima = "Tanggal diterima wajib diisi."
    if (!f.unitTujuan) e.unitTujuan = "Unit tujuan wajib dipilih."
    setErr(e)
    if (Object.keys(e).length) {
      notify.warning("Periksa kembali isian formulir yang bertanda merah.")
      return
    }
    setProses(true)
    await new Promise((r) => setTimeout(r, 700))
    setProses(false)
    const baru = aksi.tambahSuratMasuk(f)
    if (langsungDisposisi) {
      onClose(baru)
      // form disposisi akan dibuka oleh pemanggil lewat detail
    } else {
      onClose(baru)
    }
    notify.success("Surat masuk berhasil ditambahkan dan diagendakan.")
  }

  return (
    <>
      <div className="form-grid">
        <Field label="Nomor Surat" required error={err.nomorSurat}>
          <input className={`input ${err.nomorSurat ? "invalid" : ""}`} placeholder="cth: 098/SAR-OPS/10/2026" value={f.nomorSurat} onChange={set("nomorSurat")} />
        </Field>
        <Field label="Klasifikasi" required>
          <select className="select" value={f.klasifikasi} onChange={set("klasifikasi")}>
            {KLASIFIKASI.map((k) => <option key={k.kode} value={k.kode}>{k.kode} — {k.label}</option>)}
          </select>
        </Field>
        <Field label="Tanggal Surat" required error={err.tanggalSurat}>
          <input className={`input ${err.tanggalSurat ? "invalid" : ""}`} type="date" value={f.tanggalSurat} onChange={set("tanggalSurat")} />
        </Field>
        <Field label="Tanggal Diterima" required error={err.tanggalDiterima}>
          <input className={`input ${err.tanggalDiterima ? "invalid" : ""}`} type="date" value={f.tanggalDiterima} onChange={set("tanggalDiterima")} />
        </Field>
        <Field label="Pengirim" required error={err.pengirim}>
          <input className={`input ${err.pengirim ? "invalid" : ""}`} placeholder="Nama instansi / pengirim" value={f.pengirim} onChange={set("pengirim")} />
        </Field>
        <Field label="Unit Tujuan" required error={err.unitTujuan}>
          <select className={`select ${err.unitTujuan ? "invalid" : ""}`} value={f.unitTujuan} onChange={set("unitTujuan")}>
            {UNIT_KERJA.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="Perihal" required error={err.perihal} full>
          <input className={`input ${err.perihal ? "invalid" : ""}`} placeholder="Perihal surat" value={f.perihal} onChange={set("perihal")} />
        </Field>
        <Field label="Deskripsi" full>
          <textarea className="textarea" rows={3} placeholder="Ringkasan isi surat (opsional)" value={f.deskripsi} onChange={set("deskripsi")} />
        </Field>
        <Field label="Unggah Lampiran (PDF)" full>
          <label className="file-drop">
            <FileText size={20} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <span className="fd-text">
              {f.lampiran ? f.lampiran : "Pilih berkas PDF untuk dilampirkan…"}
              {f.lampiran && <span className="fd-badge">PDF terlampir</span>}
            </span>
            <input type="file" accept=".pdf" style={{ display: "none" }} onChange={setFile} />
          </label>
        </Field>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
        <button className="btn btn-outline" onClick={() => onClose()}>Batalkan</button>
        <button className="btn btn-primary" onClick={() => simpan(false)} disabled={proses}>
          {proses ? "Menyimpan…" : "Simpan Surat Masuk"}
        </button>
      </div>
    </>
  )
}

function DetailSurat({ surat, onClose }) {
  const [tahap, setTahap] = useState("detail") // detail | disposisi
  const { aksi } = useApp()

  if (!surat) return null
  return (
    <Modal
      open={!!surat}
      onClose={onClose}
      size="wide"
      title={`Detail Surat Masuk — ${surat.nomorSurat}`}
    >
      {tahap === "detail" ? (
        <div className="duo-wide">
          <div>
            <div style={{ background: "#fafbfc", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <strong style={{ fontSize: 13 }}>Informasi Surat</strong>
                <Badge status={surat.status} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, fontSize: 13 }}>
                {[
                  ["No. Agenda", surat.noAgenda],
                  ["Nomor Surat", surat.nomorSurat],
                  ["Tanggal Surat", formatTanggal(surat.tanggalSurat)],
                  ["Tanggal Diterima", formatTanggal(surat.tanggalDiterima)],
                  ["Pengirim", surat.pengirim],
                  ["Klasifikasi", surat.klasifikasi],
                  ["Unit Tujuan", surat.unitTujuan],
                  ["Lampiran", surat.lampiran || "—"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 26 }}>
                    <span style={{ color: "var(--muted)", width: 130, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontWeight: k === "Nomor Surat" ? 600 : 400 }}>{v}</span>
                  </div>
                ))}
              </div>
              {surat.deskripsi && (
                <p style={{ marginTop: 12, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, borderTop: "1px dashed var(--border)", paddingTop: 10 }}>
                  <strong style={{ color: "var(--text)" }}>Deskripsi: </strong>{surat.deskripsi}
                </p>
              )}
            </div>

            <div style={{ marginTop: 16 }}>
              <strong style={{ fontSize: 13 }}>Riwayat Status</strong>
              <div style={{ marginTop: 10 }}>
                <div className="timeline">
                  {surat.riwayat.map((r, i) => {
                    const terakhir = i === surat.riwayat.length - 1
                    const selesai = /selesai/i.test(r.judul)
                    const didisposisi = /disposisi/i.test(r.judul)
                    return (
                      <div className="timeline-item" key={i}>
                        <span className={`timeline-dot ${selesai ? "done" : didisposisi ? "major" : ""}`} />
                        <div className="timeline-body">
                          <div className="timeline-title">{r.judul}</div>
                          <div className="timeline-desc">{r.detail} • {formatTanggal(r.waktu)}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div>
            <strong style={{ fontSize: 13 }}>Pratinjau Lampiran</strong>
            <div style={{ marginTop: 10 }}>
              {surat.lampiran ? (
                <>
                  <PDFPreview nama={surat.lampiran} />
                  <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                    <UnduhSimulasi namaFile={surat.lampiran} />
                  </div>
                </>
              ) : (
                <EmptyState title="Tidak ada lampiran" desc="Surat ini tidak memiliki lampiran PDF." />
              )}
            </div>

            {surat.status === "Baru" && (
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 16 }}
                onClick={() => setTahap("disposisi")}
              >
                <ClipboardList size={15} /> Teruskan Surat ke Disposisi
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            Buat disposisi untuk surat <strong style={{ color: "var(--text)" }}>{surat.nomorSurat}</strong>.
          </p>
          <FormulirDisposisi
            surat={surat}
            onCancel={() => setTahap("detail")}
            onSubmit={(payload) => {
              aksi.buatDisposisi(surat.id, payload)
              notify.success(`Surat ${surat.nomorSurat} berhasil didisposisikan kepada ${payload.penerima}.`)
              onClose()
            }}
          />
        </>
      )}
    </Modal>
  )
}

export default function SuratMasuk() {
  const { suratMasuk, disposisi } = useApp()
  const [hal, setHal] = useState(1)
  const [cari, setCari] = useState("")
  const [fStatus, setFStatus] = useState("")
  const [fUnit, setFUnit] = useState("")
  const [fTanggal, setFTanggal] = useState("")
  const [detail, setDetail] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [memuat, setMemuat] = useState(false)

  /* filter + pencarian */
  const hasil = useMemo(() => {
    let list = [...suratMasuk]
    if (cari.trim()) {
      const q = cari.toLowerCase()
      list = list.filter(
        (s) =>
          s.nomorSurat.toLowerCase().includes(q) ||
          s.pengirim.toLowerCase().includes(q) ||
          s.perihal.toLowerCase().includes(q) ||
          s.noAgenda.includes(q)
      )
    }
    if (fStatus) list = list.filter((s) => s.status === fStatus)
    if (fUnit) list = list.filter((s) => s.unitTujuan === fUnit)
    if (fTanggal) list = list.filter((s) => s.tanggalDiterima === fTanggal)
    return list
  }, [suratMasuk, cari, fStatus, fUnit, fTanggal])

  const total = Math.max(1, Math.ceil(hasil.length / PER_HAL))
  const halaman = Math.min(hal, total)
  const tampil = hasil.slice((halaman - 1) * PER_HAL, halaman * PER_HAL)

  const resetFilter = () => {
    setCari(""); setFStatus(""); setFUnit(""); setFTanggal(""); setHal(1)
    notify.info("Filter surat masuk direset.")
  }

  const adaFilter = cari || fStatus || fUnit || fTanggal

  return (
    <>
      <PageHeader
        title="Surat Masuk"
        desc="Daftar surat masuk yang diterima, diagendakan, dan didisposisikan ke unit kerja."
        actions={
          <button className="btn btn-primary" onClick={() => setFormOpen(true)}>
            <Plus size={15} /> Tambah Surat Masuk
          </button>
        }
      />

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder="Cari nomor surat, pengirim, perihal, atau no. agenda…"
              value={cari}
              onChange={(e) => { setCari(e.target.value); setHal(1) }}
            />
          </div>
          <select className="select" style={{ width: "auto", minWidth: 150 }} value={fStatus} onChange={(e) => { setFStatus(e.target.value); setHal(1) }}>
            <option value="">Semua Status</option>
            {["Baru", "Didisposisikan", "Dalam Tindak Lanjut", "Selesai"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="select" style={{ width: "auto", minWidth: 185 }} value={fUnit} onChange={(e) => { setFUnit(e.target.value); setHal(1) }}>
            <option value="">Semua Unit Kerja</option>
            {UNIT_KERJA.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <input className="input" style={{ width: "auto", minWidth: 140 }} type="date" value={fTanggal} onChange={(e) => { setFTanggal(e.target.value); setHal(1) }} />
          {adaFilter && (
            <button className="btn btn-soft btn-sm" onClick={resetFilter}>
              <FilterX size={14} /> Reset
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--muted)" }}>
            {hasil.length} surat ditemukan
          </span>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>No. Agenda</th>
                <th>Nomor Surat</th>
                <th>Tgl Diterima</th>
                <th>Pengirim</th>
                <th>Perihal</th>
                <th>Unit Tujuan</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((s) => {
                const sudahDisposisi = disposisi.some((d) => d.suratId === s.id)
                return (
                  <tr key={s.id}>
                    <td className="td-strong">{s.noAgenda}</td>
                    <td className="tno">{s.nomorSurat}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatTanggal(s.tanggalDiterima)}</td>
                    <td style={{ maxWidth: 180 }}><div className="td-sub" style={{ marginTop: 0 }}>{s.pengirim}</div></td>
                    <td style={{ maxWidth: 220 }}>
                      <div className="td-strong" style={{ fontWeight: 500, whiteSpace: "normal", lineHeight: 1.4 }}>{s.perihal}</div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{s.unitTujuan}</td>
                    <td><Badge status={s.status} /></td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setDetail(s)} title="Lihat detail">
                          <Eye size={13} /> Detail
                        </button>
                        {sudahDisposisi ? (
                          <span className="badge badge-disposisi" style={{ alignSelf: "center" }} title="Sudah pernah didisposisikan">
                            <ClipboardList size={11} /> Didisposisi
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {tampil.length === 0 && (
            <EmptyState
              title="Tidak ada surat masuk yang cocok"
              desc="Ubah kata kunci pencarian atau coba filter status / unit yang berbeda."
            />
          )}
        </div>

        <Pagination page={halaman} total={total} onPage={setHal} />
      </div>

      {/* Detail surat */}
      <DetailSurat surat={detail} onClose={() => setDetail(null)} />

      {/* Form tambah */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Tambah Surat Masuk"
        size="wide"
        footer={null}
      >
        <FormulirSuratMasuk onClose={() => setFormOpen(false)} />
      </Modal>
    </>
  )
}
