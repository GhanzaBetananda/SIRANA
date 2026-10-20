import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, FilterX, ClipboardList, Eye, Check, PlayCircle, CalendarClock, Plus, Inbox,
} from "lucide-react"
import { useApp } from "../app-context.jsx"
import {
  Badge, ConfirmModal, EmptyState, Modal, PageHeader, Pagination, PrioritasBadge, notify,
} from "../components/ui.jsx"
import { formatTanggal, hariIni } from "../utils.js"

const PER_HAL = 5

function DetailDisposisi({ dispo, onClose }) {
  const { aksi } = useApp()
  const [proses, setProses] = useState("")
  if (!dispo) return null

  const mulai = () => {
    setProses("mulai")
    setTimeout(() => {
      aksi.mulaiTindakLanjut(dispo.id)
      setProses("")
      notify.info(`Tindak lanjut disposisi ${dispo.nomorSurat} dimulai.`)
      onClose()
    }, 600)
  }

  const sealesaikan = () => {
    setProses("selesai")
    setTimeout(() => {
      aksi.selesaikanDisposisi(dispo.id)
      setProses("")
      notify.success(`Disposisi ${dispo.nomorSurat} dinyatakan selesai; surat masuk diarsipkan.`)
      onClose()
    }, 650)
  }

  return (
    <Modal open={!!dispo} onClose={onClose} size="wide" title={`Detail Disposisi — ${dispo.nomorSurat}`}>
      <div className="duo" >
        <div>
          <div style={{ background: "#fafbfc", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <strong style={{ fontSize: 13 }}>Informasi Disposisi</strong>
              <Badge status={dispo.status === "Belum Ditindaklanjuti" ? "Baru" : dispo.status} />
            </div>
            {[
              ["Nomor Surat", dispo.nomorSurat],
              ["Pengirim", dispo.pengirim],
              ["Perihal", dispo.perihal],
              ["Tanggal Diterima", formatTanggal(dispo.tanggalDiterima)],
              ["Penerima Disposisi", dispo.penerima],
              ["Prioritas", <PrioritasBadge key="p" value={dispo.prioritas} />],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: "flex", gap: 24, marginBottom: 8, fontSize: 13, alignItems: "center" }}>
                <span style={{ color: "var(--muted)", width: 145, flexShrink: 0 }}>{k}</span>
                <span style={{ fontWeight: k === "Nomor Surat" ? 600 : 400 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 24, marginBottom: 4, fontSize: 13, alignItems: "center" }}>
              <span style={{ color: "var(--muted)", width: 145, flexShrink: 0 }}>Tenggat</span>
              <span style={{ fontWeight: 600, color: new Date(dispo.tenggat) < new Date() && dispo.status !== "Selesai" ? "var(--danger)" : "var(--text)" }}>
                <CalendarClock size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
                {formatTanggal(dispo.tenggat)}
                {new Date(dispo.tenggat) < new Date() && dispo.status !== "Selesai" && " (terlewat)"}
              </span>
            </div>
            <div style={{ marginTop: 12, borderTop: "1px dashed var(--border)", paddingTop: 12 }}>
              <div style={{ color: "var(--muted)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, marginBottom: 5 }}>Instruksi</div>
              <p style={{ fontSize: 13, lineHeight: 1.6 }}>{dispo.instruksi}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 9, marginTop: 16 }}>
            {dispo.status === "Belum Ditindaklanjuti" && (
              <button className="btn btn-outline-primary" style={{ flex: 1 }} onClick={mulai} disabled={!!proses}>
                {proses === "mulai" ? "Memulai…" : <><PlayCircle size={15} /> Mulai Tindak Lanjut</>}
              </button>
            )}
            {dispo.status === "Dalam Tindak Lanjut" && (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={sealesaikan} disabled={!!proses}>
                {proses === "selesai" ? "Memproses…" : <><Check size={15} /> Selesaikan Tindak Lanjut</>}
              </button>
            )}
            {dispo.status !== "Selesai" && (
              <button className="btn btn-outline" onClick={onClose}>Tutup</button>
            )}
            {dispo.status === "Selesai" && (
              <div
                style={{
                  flex: 1, background: "var(--success-soft)", color: "var(--success)",
                  borderRadius: 9, padding: "10px 14px", fontSize: 12.5, fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <Check size={15} /> Tindak lanjut telah selesai — surat diarsipkan
              </div>
            )}
          </div>
        </div>

        <div>
          <strong style={{ fontSize: 13 }}>Riwayat Instruksi</strong>
          <div style={{ marginTop: 10 }}>
            <div className="timeline">
              {dispo.riwayatInstruksi.map((r, i) => (
                <div className="timeline-item" key={i}>
                  <span className={`timeline-dot ${i === dispo.riwayatInstruksi.length - 1 && dispo.status === "Selesai" ? "done" : i === 0 ? "major" : ""}`} />
                  <div className="timeline-body">
                    <div className="timeline-title">{r.pemberi}</div>
                    <div className="timeline-desc" style={{ marginTop: 3 }}>{r.instruksi}</div>
                    <div className="timeline-desc" style={{ color: "#9aa1af" }}>{r.waktu}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default function Disposisi() {
  const { disposisi, suratMasuk, aksi } = useApp()
  const navigate = useNavigate()
  const location = useLocation ? window.location : null
  const [hal, setHal] = useState(1)
  const [cari, setCari] = useState("")
  const [fStatus, setFStatus] = useState("")
  const [detail, setDetail] = useState(null)
  const [formSurat, setFormSurat] = useState(null) // surat masuk yang akan didisposisikan
  const [selesaikanTarget, setSelesaikanTarget] = useState(null)
  const [proses, setProses] = useState(false)

  const suratBelumDisposisi = useMemo(
    () => suratMasuk.filter((s) => s.status === "Baru"),
    [suratMasuk]
  )

  const hasil = useMemo(() => {
    let list = [...disposisi]
    if (cari.trim()) {
      const q = cari.toLowerCase()
      list = list.filter(
        (d) =>
          d.nomorSurat.toLowerCase().includes(q) ||
          d.perihal.toLowerCase().includes(q) ||
          d.penerima.toLowerCase().includes(q) ||
          d.pengirim.toLowerCase().includes(q)
      )
    }
    if (fStatus) list = list.filter((d) => d.status === fStatus)
    /* urut: belum ditindaklanjuti terlebih dahulu */
    const urut = { "Belum Ditindaklanjuti": 0, "Dalam Tindak Lanjut": 1, Selesai: 2 }
    list.sort((a, b) => urut[a.status] - urut[b.status])
    return list
  }, [disposisi, cari, fStatus])

  const total = Math.max(1, Math.ceil(hasil.length / PER_HAL))
  const halaman = Math.min(hal, total)
  const tampil = hasil.slice((halaman - 1) * PER_HAL, halaman * PER_HAL)
  const adaFilter = cari || fStatus

  const tombolStatus = (d) => {
    if (d.status === "Belum Ditindaklanjuti")
      return (
        <button className="btn btn-outline-primary btn-sm" onClick={() => setDetail(d)} title="Buka detail disposisi">
          <PlayCircle size={13} /> Tindak Lanjut
        </button>
      )
    if (d.status === "Dalam Tindak Lanjut")
      return (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setSelesaikanTarget(d)}
          title="Selesaikan disposisi"
        >
          <Check size={13} /> Selesai
        </button>
      )
    return <span className="badge badge-selesai"><Check size={11} /> Selesai</span>
  }

  const konfirmasiSelesaikan = () => {
    if (!selesaikanTarget) return
    setProses(true)
    setTimeout(() => {
      aksi.selesaikanDisposisi(selesaikanTarget.id)
      setProses(false)
      notify.success(`Disposisi ${selesaikanTarget.nomorSurat} selesai. Surat terkait telah masuk ke arsip digital.`)
      setSelesaikanTarget(null)
    }, 650)
  }

  return (
    <>
      <PageHeader
        title="Disposisi"
        desc="Kelola penyaluran surat masuk ke penerima/unit kerja beserta instruksi, prioritas, dan tenggat tindak lanjut."
        actions={
          suratBelumDisposisi.length > 0 && (
            <button className="btn btn-primary" onClick={() => navigate("/surat-masuk")}>
              <Plus size={15} /> Buat Disposisi dari Surat Masuk
            </button>
          )
        }
      />

      {suratBelumDisposisi.length > 0 && (
        <div
          className="card"
          style={{
            marginBottom: 16, padding: "13px 18px",
            display: "flex", gap: 12, alignItems: "center",
            borderLeft: "4px solid var(--accent)",
          }}
        >
          <Inbox size={19} style={{ color: "#90610a", flexShrink: 0 }} />
          <div style={{ fontSize: 13, flex: 1 }}>
            <strong>{suratBelumDisposisi.length} surat masuk baru</strong> belum didisposisikan.
            Buka <span style={{ color: "var(--primary)", fontWeight: 600 }}>Detail</span> pada menu Surat Masuk, lalu
            tekan <span style={{ color: "var(--primary)", fontWeight: 600 }}>Teruskan ke Disposisi</span>.
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/surat-masuk")}>
            Ke Surat Masuk
          </button>
        </div>
      )}

      <div className="card">
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder="Cari nomor surat, perihal, penerima, atau pengirim…"
              value={cari}
              onChange={(e) => { setCari(e.target.value); setHal(1) }}
            />
          </div>
          <select className="select" style={{ width: "auto", minWidth: 190 }} value={fStatus} onChange={(e) => { setFStatus(e.target.value); setHal(1) }}>
            <option value="">Semua Status Tindak Lanjut</option>
            {["Belum Ditindaklanjuti", "Dalam Tindak Lanjut", "Selesai"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {adaFilter && (
            <button className="btn btn-soft btn-sm" onClick={() => { setCari(""); setFStatus(""); setHal(1); notify.info("Filter disposisi direset.") }}>
              <FilterX size={14} /> Reset
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--muted)" }}>
            {hasil.length} disposisi
          </span>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Nomor Surat</th>
                <th>Pengirim</th>
                <th>Perihal</th>
                <th>Tgl Diterima</th>
                <th>Penerima Disposisi</th>
                <th>Tenggat</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((d) => {
                const lewat = new Date(d.tenggat) < new Date() && d.status !== "Selesai"
                return (
                  <tr key={d.id}>
                    <td className="td-strong tno" style={{ whiteSpace: "normal" }}>{d.nomorSurat}</td>
                    <td style={{ maxWidth: 170 }}>
                      <div className="td-sub" style={{ marginTop: 0, whiteSpace: "normal" }}>{d.pengirim}</div>
                    </td>
                    <td style={{ maxWidth: 210 }}>
                      <div style={{ whiteSpace: "normal", lineHeight: 1.4, fontWeight: 500 }}>{d.perihal}</div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatTanggal(d.tanggalDiterima)}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{d.penerima}</td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span style={{ color: lewat ? "var(--danger)" : "inherit", fontWeight: lewat ? 600 : 400 }}>
                        {formatTanggal(d.tenggat)}
                      </span>
                    </td>
                    <td>
                      <Badge status={d.status === "Belum Ditindaklanjuti" ? "Baru" : d.status} />
                      <div style={{ marginTop: 5 }}><PrioritasBadge value={d.prioritas} /></div>
                    </td>
                    <td>
                      <div className="td-actions" style={{ justifyContent: "flex-end" }}>
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setDetail(d)}>
                          <Eye size={13} /> Detail
                        </button>
                        {tombolStatus(d)}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {tampil.length === 0 && (
            <EmptyState
              title="Tidak ada disposisi yang cocok"
              desc="Ubah kata kunci atau filter status tindak lanjut."
            />
          )}
        </div>

        <Pagination page={halaman} total={total} onPage={setHal} />
      </div>

      {/* Detail disposisi */}
      <DetailDisposisi dispo={detail} onClose={() => setDetail(null)} />

      {/* Konfirmasi selesaikan disposisi */}
      <ConfirmModal
        open={!!selesaikanTarget}
        title="Selesaikan disposisi ini?"
        message={`Disposisi ${selesaikanTarget?.nomorSurat || ""} akan dinyatakan selesai, surat masuk terkait otomatis diarsipkan ke menu Arsip Digital.`}
        confirmLabel="Ya, Selesaikan"
        onConfirm={konfirmasiSelesaikan}
        loading={proses}
        onCancel={() => setSelesaikanTarget(null)}
      />
    </>
  )
}
