import React, { useMemo, useState } from "react"
import { Search, FilterX, Eye, Check, X, FileText, Clock } from "lucide-react"
import { useApp } from "../app-context.jsx"
import {
  Badge, ConfirmModal, EmptyState, Field, Modal, PageHeader, Pagination, notify,
} from "../components/ui.jsx"
import { SuratAP4 } from "../components/dokumen.jsx"
import { formatTanggal, UNIT_KERJA } from "../utils.js"

const PER_HAL = 5

export default function Persetujuan() {
  const { suratKeluar, aksi, pengguna } = useApp()
  const [hal, setHal] = useState(1)
  const [cari, setCari] = useState("")
  const [fUnit, setFUnit] = useState("")
  const [detail, setDetail] = useState(null)
  const [tolakTarget, setTolakTarget] = useState(null)
  const [alasan, setAlasan] = useState("")
  const [alasanErr, setAlasanErr] = useState("")
  const [proses, setProses] = useState("")

  /* daftar yang menunggu persetujuan + riwayat keputusan */
  const daftarPengajuan = useMemo(
    () => suratKeluar.filter((s) => s.status === "Menunggu Persetujuan"),
    [suratKeluar]
  )

  const riwayat = useMemo(
    () =>
      suratKeluar
        .filter((s) => ["Disetujui", "Ditolak"].includes(s.status))
        .sort((a, b) => (b.tanggalSurat > a.tanggalSurat ? 1 : -1)),
    [suratKeluar]
  )

  const hasil = useMemo(() => {
    let list = [...daftarPengajuan]
    if (cari.trim()) {
      const q = cari.toLowerCase()
      list = list.filter(
        (s) =>
          s.perihal.toLowerCase().includes(q) ||
          s.pembuat.toLowerCase().includes(q) ||
          s.tujuan.toLowerCase().includes(q)
      )
    }
    if (fUnit) list = list.filter((s) => s.unit === fUnit)
    return list
  }, [daftarPengajuan, cari, fUnit])

  const total = Math.max(1, Math.ceil(hasil.length / PER_HAL))
  const halaman = Math.min(hal, total)
  const tampil = hasil.slice((halaman - 1) * PER_HAL, halaman * PER_HAL)

  const setujui = async (s) => {
    setProses(s.id)
    await new Promise((r) => setTimeout(r, 700))
    setProses("")
    aksi.keputusanPersetujuan(s.id, "Disetujui")
    notify.success(`Surat "${s.perihal}" telah Disetujui dan dapat dikirim dari menu Surat Keluar.`)
    setDetail(null)
  }

  const tolakJawab = async () => {
    if (!alasan.trim()) {
      setAlasanErr("Alasan penolakan wajib diisi minimal 10 karakter.")
      notify.warning("Tuliskan alasan penolakan terlebih dahulu.")
      return
    }
    if (alasan.trim().length < 10) {
      setAlasanErr("Alasan penolakan minimal 10 karakter agar jelas bagi pembuat surat.")
      return
    }
    setProses(tolakTarget.id)
    await new Promise((r) => setTimeout(r, 700))
    setProses("")
    aksi.keputusanPersetujuan(tolakTarget.id, "Ditolak", alasan.trim())
    notify.info(`Surat "${tolakTarget.perihal}" Ditolak — catatan dikirim ke pembuat draft.`)
    setTolakTarget(null)
    setAlasan("")
    setAlasanErr("")
    setDetail(null)
  }

  return (
    <>
      <PageHeader
        title="Persetujuan"
        desc="Pemarafan surat keluar: tinjau dokumen lalu Setujui atau Tolak dengan catatan (simulasi tanpa tanda tangan elektronik)."
      />

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="toolbar">
          <div className="search-box">
            <Search size={15} />
            <input
              placeholder="Cari perihal, pembuat surat, atau tujuan…"
              value={cari}
              onChange={(e) => { setCari(e.target.value); setHal(1) }}
            />
          </div>
          <select className="select" style={{ width: "auto", minWidth: 190 }} value={fUnit} onChange={(e) => { setFUnit(e.target.value); setHal(1) }}>
            <option value="">Semua Unit Kerja</option>
            {UNIT_KERJA.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          {(cari || fUnit) && (
            <button className="btn btn-soft btn-sm" onClick={() => { setCari(""); setFUnit(""); notify.info("Filter persetujuan direset.") }}>
              <FilterX size={14} /> Reset
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--muted)" }}>
            {hasil.length} surat menunggu persetujuan
          </span>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Pembuat Surat</th>
                <th>Perihal</th>
                <th>Unit Kerja</th>
                <th>Tgl Pengajuan</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="td-strong">{s.pembuat}</div>
                    <div className="td-sub">Tujuan: {s.tujuan}</div>
                  </td>
                  <td style={{ maxWidth: 260 }}>
                    <div style={{ whiteSpace: "normal", lineHeight: 1.4, fontWeight: 500 }}>{s.perihal}</div>
                    <div className="td-sub">Klasifikasi: {s.klasifikasi}</div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{s.unit}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <Clock size={12} style={{ verticalAlign: -2, marginRight: 4, color: "#9aa1af" }} />
                    {formatTanggal(s.tanggalPengajuan)}
                  </td>
                  <td><Badge status={s.status} /></td>
                  <td>
                    <div className="td-actions" style={{ justifyContent: "flex-end" }}>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => setDetail(s)}>
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
              title="Tidak ada surat menunggu persetujuan"
              desc="Semua pengajuan telah diproses, atau pengajuan belum dibuat dari menu Surat Keluar."
            />
          )}
        </div>
        <Pagination page={halaman} total={total} onPage={setHal} />
      </div>

      {/* Riwayat keputusan */}
      <div className="card">
        <div className="card-head">
          <div className="card-title-ico">
            <FileText size={16} style={{ color: "var(--primary)" }} />
            <h3>Riwayat Keputusan Persetujuan</h3>
          </div>
        </div>
        {riwayat.length === 0 ? (
          <EmptyState title="Belum ada keputusan" desc="Riwayat persetujuan dan penolakan surat akan muncul di sini." />
        ) : (
          <div>
            {riwayat.map((s) => (
              <div className="task-item" key={s.id} style={{ cursor: "default" }}>
                <span
                  className="stat-ico"
                  style={{
                    width: 34, height: 34,
                    background: s.status === "Disetujui" ? "var(--success-soft)" : "var(--danger-soft)",
                    color: s.status === "Disetujui" ? "var(--success)" : "var(--danger)",
                  }}
                >
                  {s.status === "Disetujui" ? <Check size={15} /> : <X size={15} />}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{s.perihal}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
                    {s.status === "Ditolak" && s.alasanPenolakan ? `Alasan: "${s.alasanPenolakan}" • ` : ""}
                    Pembuat: {s.pembuat}
                  </div>
                </div>
                <Badge status={s.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal detail + keputusan */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        size="wide"
        title={`Detail Pengajuan — ${detail?.perihal || ""}`}
      >
        {detail && (
          <>
            <div style={{ display: "grid", gap: 10, marginBottom: 18 }} className="mini-infos">
              {[
                ["Pembuat", detail.pembuat],
                ["Unit", detail.unit],
                ["Tanggal Pengajuan", formatTanggal(detail.tanggalPengajuan)],
                ["Klasifikasi", detail.klasifikasi],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "#fafbfc", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 13px" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{k}</div>
                  <div style={{ fontSize: 12.8, fontWeight: 600, marginTop: 3 }}>{v}</div>
                </div>
              ))}
            </div>
            <SuratAP4 surat={detail} />
            <div style={{ display: "flex", justifyContent: "center", gap: 9, marginTop: 16 }}>
              <button className="btn btn-outline" onClick={() => setDetail(null)}>Tutup</button>
              <button
                className="btn btn-primary"
                disabled={!!proses}
                onClick={() => setujui(detail)}
              >
                {proses === detail.id ? "Menyetujui…" : <><Check size={15} /> Setujui</>}
              </button>
              <button
                className="btn btn-danger-soft"
                disabled={!!proses}
                onClick={() => { setTolakTarget(detail); setAlasan("") }}
              >
                <X size={15} /> Tolak
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Modal formulir alasan penolakan */}
      <Modal open={!!tolakTarget} onClose={() => { setTolakTarget(null); setAlasanErr("") }} title="Formulir Penolakan Surat">
        <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14, lineHeight: 1.6 }}>
          Menolak surat <strong style={{ color: "var(--text)" }}>"{tolakTarget?.perihal}"</strong>. Berikan alasan yang jelas
          agar pembuat draft dapat memperbaiki dan mengajukan ulang.
        </p>
        <Field label="Alasan Penolakan" required error={alasanErr}>
          <textarea
            className={`textarea ${alasanErr ? "invalid" : ""}`}
            rows={4}
            placeholder="cth: Perihal tidak sesuai format standar numor surat instansi…"
            value={alasan}
            onChange={(e) => { setAlasan(e.target.value); setAlasanErr("") }}
            autoFocus
          />
        </Field>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
          <button className="btn btn-outline" onClick={() => { setTolakTarget(null); setAlasanErr("") }}>Batal</button>
          <button
            className="btn btn-danger"
            disabled={!!proses}
            onClick={tolakJawab}
          >
            {proses === tolakTarget?.id ? "Memproses…" : <><X size={15} /> Tolak Surat</>}
          </button>
        </div>
      </Modal>
    </>
  )
}
