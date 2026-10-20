import React, { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Plus, Search, Eye, Pencil, Trash2, FilterX, Send, FileText, Paperclip, Upload,
  Bold, Italic, Underline, RotateCcw, Mail,
} from "lucide-react"
import { useApp } from "../app-context.jsx"
import {
  Badge, ConfirmModal, EmptyState, Field, Modal, PageHeader, Pagination, notify,
} from "../components/ui.jsx"
import { SuratAP4, PDFPreview } from "../components/dokumen.jsx"
import { KLASIFIKASI, UNIT_KERJA, formatTanggal, hariIni } from "../utils.js"

const PER_HAL = 5

/* ------------------- Editor teks sederhana ------------------- */
function EditorTeks({ valueRef, initial }) {
  const ref = useRef(null)
  const [aktif, setAktif] = useState({})

  const jalankan = (perintah, nilai) => {
    ref.current?.focus()
    document.execCommand(perintah, false, nilai)
    setAkhir()
  }

  const setAkhir = () => {
    try {
      setAktif({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
      })
    } catch { /* abaikan */ }
  }

  React.useEffect(() => {
    if (ref.current && initial) ref.current.innerText = initial
  }, [])

  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <label>Isi Surat <span className="req">*</span></label>
      <div className="editor-wrap">
        <div className="editor-toolbar">
          <button type="button" className={`editor-btn ${aktif.bold ? "on" : ""}`} onMouseDown={(e) => { e.preventDefault(); jalankan("bold") }} title="Tebal"><Bold size={14} /></button>
          <button type="button" className={`editor-btn ${aktif.italic ? "on" : ""}`} onMouseDown={(e) => { e.preventDefault(); jalankan("italic") }} title="Miring"><Italic size={14} /></button>
          <button type="button" className={`editor-btn ${aktif.underline ? "on" : ""}`} onMouseDown={(e) => { e.preventDefault(); jalankan("underline") }} title="Garis bawah"><Underline size={14} /></button>
          <button type="button" className="editor-btn" onMouseDown={(e) => { e.preventDefault(); jalankan("removeFormat") }} title="Bersihkan format"><RotateCcw size={14} /></button>
          <span style={{ fontSize: 10.5, color: "#9aa1af", alignSelf: "center", marginLeft: 4 }}>Editor sederhana</span>
        </div>
        <div
          ref={ref}
          className="editor-area"
          contentEditable
          suppressContentEditableWarning
          onKeyUp={setAkhir}
          onMouseUp={setAkhir}
          onBlur={() => { if (valueRef) valueRef.current = ref.current?.innerText ?? "" }}
          onInput={() => { if (valueRef) valueRef.current = ref.current?.innerText ?? "" }}
        />
      </div>
    </div>
  )
}

/* ------------------- Formulir buat / edit surat ------------------- */
function FormulirSuratKeluar({ awal, onClose, mode }) {
  const { aksi } = useApp()
  const kosong = {
    tujuan: "", perihal: "", klasifikasi: "U", tanggalSurat: hariIni(), unit: "Sekretariat", lampiran: null,
  }
  const [f, setF] = useState(awal ? { ...kosong, ...awal, isi: undefined } : kosong)
  const isiRef = useRef(awal?.isi ?? "")
  const [err, setErr] = useState({})
  const [proses, setProses] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const setFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setF({ ...f, lampiran: file.name })
    notify.info(`Lampiran "${file.name}" dilampirkan (simulasi).`)
  }

  const nilaiIsi = () => isiRef.current ?? ""

  const simpan = async (ajukan) => {
    const isi = nilaiIsi()
    const e = {}
    if (!f.tujuan.trim()) e.tujuan = "Tujuan surat wajib diisi."
    if (!f.perihal.trim()) e.perihal = "Perihal wajib diisi."
    if (!f.tanggalSurat) e.tanggalSurat = "Tanggal surat wajib diisi."
    if (!f.unit) e.unit = "Unit kerja wajib dipilih."
    if (!isi.trim() || isi.trim() === "") e.isi = "Isi surat wajib ditulis."
    setErr(e)
    if (Object.keys(e).length) {
      notify.warning("Lengkapi formulir surat keluar terlebih dahulu.")
      return
    }
    setProses(true)
    await new Promise((r) => setTimeout(r, 750))
    setProses(false)

    const data = { ...f, isi }
    if (mode === "edit") {
      aksi.updateSuratKeluar(awal.id, data)
      if (ajukan) {
        aksi.ajukanPersetujuan(awal.id)
        notify.success(`Draft diperbarui dan surat diajukan untuk persetujuan.`)
      } else {
        notify.success(`Draft surat berhasil diperbarui.`)
      }
    } else {
      const baru = aksi.tambahSuratKeluar(data)
      if (ajukan) {
        aksi.ajukanPersetujuan(baru.id)
        notify.success(`Surat berhasil dibuat dan diajukan untuk persetujuan.`)
      } else {
        notify.success(`Surat berhasil disimpan sebagai draft.`)
      }
    }
    onClose()
  }

  return (
    <>
      <div className="form-grid">
        <Field label="Tujuan" required error={err.tujuan}>
          <input className={`input ${err.tujuan ? "invalid" : ""}`} placeholder="Kepada siapa surat ditujukan" defaultValue={f.tujuan} onChange={set("tujuan")} />
        </Field>
        <Field label="Klasifikasi" required>
          <select className="select" defaultValue={f.klasifikasi} onChange={set("klasifikasi")}>
            {KLASIFIKASI.map((k) => <option key={k.kode} value={k.kode}>{k.kode} — {k.label}</option>)}
          </select>
        </Field>
        <Field label="Tanggal Surat" required error={err.tanggalSurat}>
          <input className={`input ${err.tanggalSurat ? "invalid" : ""}`} type="date" value={f.tanggalSurat} onChange={set("tanggalSurat")} />
        </Field>
        <Field label="Unit Kerja Pembuat" required>
          <select className="select" defaultValue={f.unit} onChange={set("unit")}>
            {UNIT_KERJA.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="Perihal" required error={err.perihal} full>
          <input className={`input ${err.perihal ? "invalid" : ""}`} placeholder="Perihal surat" defaultValue={f.perihal} onChange={set("perihal")} />
        </Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <EditorTeks valueRef={isiRef} initial={awal?.isi} />
          {err.isi && <span className="input-error">{err.isi}</span>}
        </div>
        <Field label="Lampiran" full>
          <label className="file-drop">
            <Paperclip size={18} style={{ color: "var(--primary)", flexShrink: 0 }} />
            <span className="fd-text">
              {f.lampiran ? f.lampiran : "Lampirkan berkas pendukung (opsional)…"}
              {f.lampiran && <span className="fd-badge">Terlampir</span>}
            </span>
            <input type="file" style={{ display: "none" }} onChange={setFile} />
          </label>
        </Field>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginTop: 8 }}>
        <button className="btn btn-outline" onClick={onClose}>Batalkan</button>
        <button className="btn btn-soft" onClick={() => simpan(false)} disabled={proses}>
          {proses ? "Menyimpan…" : <><FileText size={15} /> Simpan Draft</>}
        </button>
        <button className="btn btn-primary" onClick={() => simpan(true)} disabled={proses}>
          {proses ? "Mengajukan…" : <><Send size={15} /> Ajukan Persetujuan</>}
        </button>
      </div>
    </>
  )
}

/* ------------------- Pratinjau A4 ------------------- */
function PratinjauSurat({ surat, onClose, bisaKirim, onKirim, alasan }) {
  return (
    <Modal open={!!surat} onClose={onClose} size="wide" title="Pratinjau Surat (Dokumen Resmi A4)">
      <SuratAP4 surat={surat} />
      {alasan && (
        <div
          style={{
            maxWidth: 660, margin: "16px auto 0",
            background: "var(--danger-soft)", border: "1px solid #f6c6c2",
            color: "var(--danger)", borderRadius: 10, padding: "12px 16px", fontSize: 12.5,
            lineHeight: 1.55, display: "flex", gap: 10,
          }}
        >
          <strong>Catatan Penolakan:</strong>
          <span style={{ color: "var(--text)" }}>{alasan}</span>
        </div>
      )}
      {bisaKirim && (
        <div style={{ display: "flex", justifyContent: "center", gap: 9, marginTop: 16 }}>
          <button className="btn btn-outline" onClick={onClose}>Tutup</button>
          <button className="btn btn-accent" onClick={onKirim}><Mail size={15} /> Tandai Terkirim</button>
        </div>
      )}
    </Modal>
  )
}

/* ------------------- Halaman utama ------------------- */
export default function SuratKeluar() {
  const { suratKeluar, aksi } = useApp()
  const navigate = useNavigate()
  const [hal, setHal] = useState(1)
  const [cari, setCari] = useState("")
  const [fStatus, setFStatus] = useState("")
  const [fUnit, setFUnit] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [edit, setEdit] = useState(null)
  const [preview, setPreview] = useState(null)
  const [hapus, setHapus] = useState(null)
  const [prosesHapus, setProsesHapus] = useState(false)

  const hasil = useMemo(() => {
    let list = [...suratKeluar]
    if (cari.trim()) {
      const q = cari.toLowerCase()
      list = list.filter(
        (s) =>
          s.nomorSurat.toLowerCase().includes(q) ||
          s.tujuan.toLowerCase().includes(q) ||
          s.perihal.toLowerCase().includes(q)
      )
    }
    if (fStatus) list = list.filter((s) => s.status === fStatus)
    if (fUnit) list = list.filter((s) => s.unit === fUnit)
    return list
  }, [suratKeluar, cari, fStatus, fUnit])

  const total = Math.max(1, Math.ceil(hasil.length / PER_HAL))
  const halaman = Math.min(hal, total)
  const tampil = hasil.slice((halaman - 1) * PER_HAL, halaman * PER_HAL)
  const adaFilter = cari || fStatus || fUnit

  const konfirmasiHapus = async () => {
    if (!hapus) return
    setProsesHapus(true)
    await new Promise((r) => setTimeout(r, 550))
    setProsesHapus(false)
    aksi.hapusSuratKeluar(hapus.id)
    notify.success(`Draft "${hapus.perihal}" telah dihapus.`)
    setHapus(null)
  }

  const kirim = (s) => {
    aksi.kirimSurat(s.id)
    notify.success(`Surat "${s.perihal}" ditandai terkirim dan masuk ke arsip digital.`)
    setPreview(null)
  }

  return (
    <>
      <PageHeader
        title="Surat Keluar"
        desc="Kelola draf surat, pengajuan persetujuan, dan pengiriman surat keluar unit kerja."
        actions={
          <button className="btn btn-primary" onClick={() => setFormOpen(true)}>
            <Plus size={15} /> Buat Surat
          </button>
        }
      />

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder="Cari nomor surat, tujuan, atau perihal…"
              value={cari}
              onChange={(e) => { setCari(e.target.value); setHal(1) }}
            />
          </div>
          <select className="select" style={{ width: "auto", minWidth: 175 }} value={fStatus} onChange={(e) => { setFStatus(e.target.value); setHal(1) }}>
            <option value="">Semua Status</option>
            {["Draft", "Menunggu Persetujuan", "Disetujui", "Ditolak", "Terkirim"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="select" style={{ width: "auto", minWidth: 185 }} value={fUnit} onChange={(e) => { setFUnit(e.target.value); setHal(1) }}>
            <option value="">Semua Unit Kerja</option>
            {UNIT_KERJA.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          {adaFilter && (
            <button className="btn btn-soft btn-sm" onClick={() => { setCari(""); setFStatus(""); setFUnit(""); setHal(1); notify.info("Filter surat keluar direset.") }}>
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
                <th>Nomor Surat</th>
                <th>Tanggal</th>
                <th>Tujuan</th>
                <th>Perihal</th>
                <th>Unit Kerja</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((s) => (
                <tr key={s.id}>
                  <td className="td-strong tno" style={{ whiteSpace: "normal" }}>{s.nomorSurat}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{formatTanggal(s.tanggalSurat)}</td>
                  <td style={{ maxWidth: 190 }}>
                    <div className="td-sub" style={{ marginTop: 0, whiteSpace: "normal" }}>{s.tujuan}</div>
                  </td>
                  <td style={{ maxWidth: 230 }}>
                    <div style={{ whiteSpace: "normal", lineHeight: 1.4, fontWeight: 500 }}>{s.perihal}</div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{s.unit}</td>
                  <td><Badge status={s.status} /></td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => setPreview(s)} title="Pratinjau surat">
                        <Eye size={13} /> Pratinjau
                      </button>
                      {(s.status === "Draft" || s.status === "Ditolak") && (
                        <>
                          <button
                            className="btn btn-soft btn-sm"
                            title="Edit draft"
                            disabled={prosesHapus}
                            onClick={() => setEdit(s)}
                          >
                            <Pencil size={13} />
                          </button>
                          <button className="btn btn-danger-soft btn-sm" title="Hapus draft" onClick={() => setHapus(s)}>
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                      {s.status === "Disetujui" && (
                        <button className="btn btn-accent btn-sm" onClick={() => kirim(s)} title="Tandai terkirim">
                          <Mail size={13} /> Kirim
                        </button>
                      )}
                      {s.status === "Menunggu Persetujuan" && (
                        <button
                          className="btn btn-soft btn-sm"
                          title="Lihat pada menu Persetujuan"
                          onClick={() => navigate("/persetujuan")}
                        >
                          <Send size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tampil.length === 0 && (
            <EmptyState
              title="Tidak ada surat keluar yang cocok"
              desc="Ubah kata kunci pencarian atau filter status / unit kerja."
              action={
                <button className="btn btn-outline-primary btn-sm" onClick={() => setFormOpen(true)}>
                  <Plus size={14} /> Buat Surat Baru
                </button>
              }
            />
          )}
        </div>

        <Pagination page={halaman} total={total} onPage={setHal} />
      </div>

      {/* Buat surat */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Buat Surat Keluar" size="wide" footer={null}>
        <FormulirSuratKeluar mode="tambah" onClose={() => setFormOpen(false)} />
      </Modal>

      {/* Edit draft */}
      <Modal open={!!edit} onClose={() => setEdit(null)} title={`Edit Draft Surat — ${edit?.perihal || ""}`} size="wide" footer={null}>
        {edit && (
          <FormulirSuratKeluar
            mode="edit"
            awal={{ ...edit }}
            onClose={() => { setEdit(null); }}
          />
        )}
      </Modal>

      {/* Pratinjau A4 */}
      <PratinjauSurat
        surat={preview}
        onClose={() => setPreview(null)}
        bisaKirim={preview?.status === "Disetujui"}
        onKirim={() => preview && kirim(preview)}
        alasan={preview?.status === "Ditolak" ? preview?.alasanPenolakan : null}
      />

      {/* Konfirmasi hapus draft */}
      <ConfirmModal
        open={!!hapus}
        title="Hapus draft surat?"
        message={`Draft "${hapus?.perihal || ""}" akan dihapus dan tidak dapat dipulihkan. Lanjutkan?`}
        confirmLabel="Ya, Hapus Draft"
        danger
        loading={prosesHapus}
        onConfirm={konfirmasiHapus}
        onCancel={() => setHapus(null)}
      />
    </>
  )
}
