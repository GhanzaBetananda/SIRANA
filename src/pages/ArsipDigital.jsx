import React, { useMemo, useState } from "react"
import {
  Search, Eye, FilterX, Archive, FileText, Download as DlIcon, Inbox,
} from "lucide-react"
import { useApp } from "../app-context.jsx"
import {
  Badge, EmptyState, Modal, PageHeader, Pagination, notify,
} from "../components/ui.jsx"
import { PDFPreview, UnduhSimulasi } from "../components/dokumen.jsx"
import { KLASIFIKASI, UNIT_KERJA, formatTanggal, klasifikasiLabel } from "../utils.js"

const PER_HAL = 5

export default function ArsipDigital() {
  const { arsip } = useApp()
  const [hal, setHal] = useState(1)
  const [cari, setCari] = useState("")
  const [fJenis, setFJenis] = useState("")
  const [fKlas, setFKlas] = useState("")
  const [fUnit, setFUnit] = useState("")
  const [detail, setDetail] = useState(null)

  const hasil = useMemo(() => {
    let list = [...arsip]
    if (cari.trim()) {
      const q = cari.toLowerCase()
      list = list.filter(
        (a) =>
          a.nomorSurat.toLowerCase().includes(q) ||
          a.perihal.toLowerCase().includes(q) ||
          a.pihak.toLowerCase().includes(q) ||
          String(a.noAgenda).includes(q)
      )
    }
    if (fJenis) list = list.filter((a) => a.jenis === fJenis)
    if (fKlas) list = list.filter((a) => a.klasifikasi === fKlas)
    if (fUnit) list = list.filter((a) => a.unit === fUnit)
    return list
  }, [arsip, cari, fJenis, fKlas, fUnit])

  const total = Math.max(1, Math.ceil(hasil.length / PER_HAL))
  const halaman = Math.min(hal, total)
  const tampil = hasil.slice((halaman - 1) * PER_HAL, halaman * PER_HAL)
  const adaFilter = cari || fJenis || fKlas || fUnit

  const resetFilter = () => {
    setCari(""); setFJenis(""); setFKlas(""); setFUnit(""); setHal(1)
    notify.info("Pencarian arsip direset.")
  }

  return (
    <>
      <PageHeader
        title="Arsip Digital"
        desc="Wadah tunggal arsip surat masuk dan surat keluar yang telah selesai diproses."
        actions={
          <span className="badge badge-disposisi" style={{ fontSize: 12, padding: "6px 12px" }}>
            <Archive size={13} /> {arsip.length} dokumen terarsip
          </span>
        }
      />

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder="Cari nomor surat, perihal, tanggal, atau instansi…"
              value={cari}
              onChange={(e) => { setCari(e.target.value); setHal(1) }}
            />
          </div>
          <select className="select" style={{ width: "auto", minWidth: 140 }} value={fJenis} onChange={(e) => { setFJenis(e.target.value); setHal(1) }}>
            <option value="">Semua Jenis</option>
            <option value="Surat Masuk">Surat Masuk</option>
            <option value="Surat Keluar">Surat Keluar</option>
          </select>
          <select className="select" style={{ width: "auto", minWidth: 160 }} value={fKlas} onChange={(e) => { setFKlas(e.target.value); setHal(1) }}>
            <option value="">Semua Klasifikasi</option>
            {KLASIFIKASI.map((k) => <option key={k.kode} value={k.kode}>{k.kode} — {k.label}</option>)}
          </select>
          <select className="select" style={{ width: "auto", minWidth: 185 }} value={fUnit} onChange={(e) => { setFUnit(e.target.value); setHal(1) }}>
            <option value="">Semua Unit Kerja</option>
            {UNIT_KERJA.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          {adaFilter && (
            <button className="btn btn-soft btn-sm" onClick={resetFilter}>
              <FilterX size={14} /> Reset
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--muted)" }}>
            {hasil.length} dokumen ditemukan
          </span>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Nomor Surat</th>
                <th>Jenis</th>
                <th>Perihal</th>
                <th>Tanggal</th>
                <th>Klasifikasi</th>
                <th>Unit Kerja</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((a) => (
                <tr key={a.id + a.jenis}>
                  <td className="td-strong tno" style={{ whiteSpace: "normal" }}>
                    {a.nomorSurat}
                    {a.noAgenda !== "-" && <div className="td-sub">No. agenda {a.noAgenda}</div>}
                  </td>
                  <td>
                    <span className={`badge ${a.jenis === "Surat Masuk" ? "badge-disposisi" : "badge-terkirim"}`}>
                      {a.jenis}
                    </span>
                  </td>
                  <td style={{ maxWidth: 250 }}>
                    <div style={{ whiteSpace: "normal", lineHeight: 1.4, fontWeight: 500 }}>{a.perihal}</div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{formatTanggal(a.tanggal)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{a.klasifikasi} — {klasifikasiLabel(a.klasifikasi)}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{a.unit}</td>
                  <td>
                    <div className="td-actions" style={{ justifyContent: "flex-end" }}>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => setDetail(a)}>
                        <Eye size={13} /> Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tampil.length === 0 && (
            <EmptyState
              title="Arsip tidak ditemukan"
              desc={
                adaFilter
                  ? "Tidak ada dokumen arsip yang sesuai dengan pencarian atau filter. Coba ubah kata kunci atau reset filter."
                  : "Belum ada surat yang selesai diproses dan diarsipkan."
              }
              action={
                adaFilter && (
                  <button className="btn btn-outline-primary btn-sm" onClick={resetFilter}>
                    <FilterX size={14} /> Reset Pencarian
                  </button>
                )
              }
            />
          )}
        </div>

        <Pagination page={halaman} total={total} onPage={setHal} />
      </div>

      {/* Detail arsip */}
      <Modal open={!!detail} onClose={() => setDetail(null)} size="wide" title={`Detail Arsip — ${detail?.nomorSurat || ""}`}>
        {detail && (
          <div className="duo">
            <div>
              <div style={{ background: "#fafbfc", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <strong style={{ fontSize: 13 }}>Metadata Dokumen</strong>
                  <span className={`badge ${detail.jenis === "Surat Masuk" ? "badge-disposisi" : "badge-terkirim"}`}>
                    {detail.jenis}
                  </span>
                </div>
                {[
                  ["Nomor Surat", detail.nomorSurat],
                  ["No. Agenda", detail.noAgenda],
                  ["Tanggal", formatTanggal(detail.tanggal)],
                  ["Perihal", detail.perihal],
                  [detail.jenis === "Surat Masuk" ? "Pengirim" : "Tujuan", detail.pihak],
                  ["Klasifikasi", `${detail.klasifikasi} — ${klasifikasiLabel(detail.klasifikasi)}`],
                  ["Unit Kerja", detail.unit],
                  ["Lampiran", detail.lampiran || "—"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", gap: 20, marginBottom: 7, fontSize: 13 }}>
                    <span style={{ color: "var(--muted)", width: 100, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontWeight: k === "Nomor Surat" ? 600 : 400 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                {detail.lampiran ? (
                  <UnduhSimulasi namaFile={detail.lampiran} />
                ) : (
                  <span style={{ fontSize: 11.5, color: "var(--muted)", alignSelf: "center" }}>
                    Dokumen simulasi tidak tersedia untuk diunduh
                  </span>
                )}
              </div>
            </div>
            <div>
              <strong style={{ fontSize: 13 }}>Pratinjau Dokumen</strong>
              <div style={{ marginTop: 10 }}>
                {detail.lampiran ? (
                  <PDFPreview nama={detail.lampiran} />
                ) : (
                  <EmptyState title="Tidak ada berkas" desc="Metadata tersimpan tanpa lampiran PDF simulasi." />
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
