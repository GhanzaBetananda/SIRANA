import React, { useState } from "react"
import {
  User, Save, RotateCcw, Info, Layers, Monitor, BellRing, Palette, FileText, Database, Clock,
} from "lucide-react"
import { useApp } from "../app-context.jsx"
import {
  Field, Modal, PageHeader, notify,
} from "../components/ui.jsx"
import { LogoMark } from "../components/dokumen.jsx"
import { UNIT_KERJA } from "../utils.js"

export default function Pengaturan() {
  const { pengguna, simpanProfil, arsip, suratMasuk, suratKeluar, disposisi } = useApp()
  const [f, setF] = useState({ nama: pengguna.nama, nip: pengguna.nip, pangkat: pengguna.pangkat, unit: pengguna.unit, email: pengguna.email })
  const [err, setErr] = useState({})
  const [proses, setProses] = useState(false)
  const [confTampilan, setConfTampilan] = useState(false)
  const [preferensiTampilan, setPreferensiTampilan] = useState({
    tabelPadat: false,
    notifikasiToast: true,
    tampilkanBadge: true,
  })

  const set = (k) => (e) => {
    setF({ ...f, [k]: e.target.value })
    setErr({ ...err, [k]: undefined })
  }

  const simpan = async () => {
    const e = {}
    if (!f.nama.trim()) e.nama = "Nama wajib diisi."
    if (!f.nip.trim()) e.nip = "NIP wajib diisi."
    if (!f.unit) e.unit = "Unit kerja wajib dipilih."
    if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = "Format email tidak valid."
    setErr(e)
    if (Object.keys(e).length) {
      notify.warning("Periksa kembali isian profil yang belum lengkap.")
      return
    }
    setProses(true)
    await new Promise((r) => setTimeout(r, 650))
    setProses(false)
    simpanProfil(f)
    notify.success("Profil pengguna diperbarui (disimpan pada sesi simulasi).")
  }

  const togglePref = (k) => {
    const next = { ...preferensiTampilan, [k]: !preferensiTampilan[k] }
    setPreferensiTampilan(next)
    if (k === "notifikasiToast") {
      if (next.notifikasiToast) notify.info("Notifikasi toast diaktifkan.")
      else {
        notify.warning("Notifikasi toast dimatikan (contoh ini tetap muncul sebagai pembuktian).")
      }
    } else {
      notify.success("Preferensi tampilan diperbarui (hanya sesi simulasi).")
    }
  }

  const StatistikMini = ({ label, nilai }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px dashed var(--border)", fontSize: 13 }}>
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{nilai}</span>
    </div>
  )

  return (
    <>
      <PageHeader
        title="Pengaturan"
        desc="Kelola profil pengguna dummy, informasi unit kerja, preferensi tampilan, dan informasi aplikasi SIRANA."
      />

      <div className="pengaturan-grid">
        {/* Kolom kiri */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <div className="card-title-ico">
                <User size={17} style={{ color: "var(--primary)" }} />
                <h3>Profil Pengguna</h3>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div
                  style={{
                    width: 58, height: 58, borderRadius: 14,
                    background: "var(--primary)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 21, fontWeight: 800,
                  }}
                >
                  {f.nama.replace(/,.*$/, "").split(" ").map((w) => w[0]).filter((_, i) => i < 2).join("").toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5 }}>{f.nama || "—"}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{pengguna.jabatan} • {f.unit}</div>
                </div>
              </div>

              <div className="form-grid">
                <Field label="Nama Lengkap" required error={err.nama}>
                  <input className={`input ${err.nama ? "invalid" : ""}`} value={f.nama} onChange={set("nama")} />
                </Field>
                <Field label="Email Pengguna" error={err.email}>
                  <input className={`input ${err.email ? "invalid" : ""}`} placeholder="nama@basarnas.go.id" value={f.email} onChange={set("email")} />
                </Field>
                <Field label="NIP" required error={err.nip}>
                  <input className={`input ${err.nip ? "invalid" : ""}`} value={f.nip} onChange={set("nip")} />
                </Field>
                <Field label="Pangkat / Golongan">
                  <input className="input" value={f.pangkat} onChange={set("pangkat")} />
                </Field>
                <Field label="Unit Kerja" required error={err.unit} full>
                  <select className={`select ${err.unit ? "invalid" : ""}`} value={f.unit} onChange={set("unit")}>
                    {UNIT_KERJA.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Field>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
                <button className="btn btn-outline" onClick={() => { setF({ nama: pengguna.nama, nip: pengguna.nip, pangkat: pengguna.pangkat, unit: pengguna.unit, email: pengguna.email }); setErr({}); notify.info("Formulir profil dikembalikan ke nilai semula.") }}>
                  <RotateCcw size={14} /> Kembalikan
                </button>
                <button className="btn btn-primary" onClick={simpan} disabled={proses}>
                  {proses ? "Menyimpan…" : <><Save size={15} /> Simpan Profil</>}
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title-ico">
                <Monitor size={17} style={{ color: "#90610a" }} />
                <h3>Preferensi Tampilan</h3>
              </div>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                ["tabelPadat", "Tabel dengan baris padat", "Mengurangi tinggi baris tabel agar lebih banyak data terlihat (simulasi visual)."],
                ["notifikasiToast", "Notifikasi toast kanan atas", "Aktifkan/mematikan pemberitahuan React-Toastify (simulasi)."],
                ["tampilkanBadge", "Indikator jumlah pada sidebar", "Menampilkan penghitung disposisi dan persetujuan pada menu (simulasi)."],
              ].map(([k, judul, desc]) => (
                <div
                  key={k}
                  style={{ display: "flex", gap: 14, alignItems: "center", padding: "11px 4px", borderBottom: "1px dashed var(--border)", cursor: "pointer" }}
                  onClick={() => togglePref(k)}
                >
                  <span
                    style={{
                      width: 40, height: 22, borderRadius: 999,
                      background: preferensiTampilan[k] ? "var(--primary)" : "#d8dbe3",
                      position: "relative",
                      transition: "background 0.18s",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute", top: 2,
                        left: preferensiTampilan[k] ? 20 : 2,
                        width: 18, height: 18, borderRadius: "50%",
                        background: "#fff",
                        transition: "left 0.18s",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      }}
                    />
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{judul}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
              <button className="btn btn-soft btn-sm" style={{ alignSelf: "flex-end", marginTop: 12 }} onClick={() => { setConfTampilan(true); }}>
                <IkonReset /> Reset Preferensi
              </button>
            </div>
          </div>
        </div>

        {/* Kolom kanan */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <div className="card-title-ico">
                <Layers size={17} style={{ color: "var(--primary)" }} />
                <h3>Informasi Unit Kerja</h3>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <LogoMark size={46} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>Kantor Pencarian dan Pertolongan Kelas B Banjarmasin</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Badan Nasional Pencarian dan Pertolongan (BASARNAS)</div>
                </div>
              </div>
              <StatistikMini label="Nama Pengguna Aktif" nilai={pengguna.nama} />
              <StatistikMini label="Unit Pengguna" nilai={pengguna.unit} />
              <StatistikMini label="Total Surat Masuk Tercatat" nilai={suratMasuk.length} />
              <StatistikMini label="Total Surat Keluar Tercatat" nilai={suratKeluar.length} />
              <StatistikMini label="Total Disposisi" nilai={disposisi.length} />
              <StatistikMini label="Total Dokumen Arsip" nilai={arsip.length} />
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div className="card-title-ico">
                <Info size={17} style={{ color: "var(--primary)" }} />
                <h3>Tentang SIRANA</h3>
              </div>
            </div>
            <div className="card-body" style={{ fontSize: 12.7, lineHeight: 1.7 }}>
              <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: 15, letterSpacing: "0.04em" }}>SIRANA</p>
              <p style={{ color: "var(--muted)", marginTop: 2 }}>
                Sistem Informasi Persuratan dan Kearsipan BASARNAS.
              </p>
              <p style={{ marginTop: 10, color: "var(--muted)" }}>
                Terinspirasi dari alur kerja SRIKANDI, mendukung pengelolaan surat masuk, surat keluar,
                disposisi, persetujuan, dan arsip digital di lingkungan Kantor SAR.
              </p>
              <div style={{ marginTop: 14, padding: "11px 13px", background: "var(--accent-soft)", border: "1px solid #f7ddaf", borderRadius: 9, display: "flex", gap: 9, alignItems: "flex-start" }}>
                <Palette size={15} style={{ color: "#90610a", flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: "#7c5606", fontSize: 12 }}>
                  Tagline aplikasi: <strong>"Persuratan Digital yang Terintegrasi, Tertib, dan Efisien"</strong>
                </span>
              </div>
              <div style={{ marginTop: 12, fontSize: 11.5, color: "#9aa1af", display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
                <span>Versi: 1.0.0-prototype</span>
                <span>Mode: Frontend only (data dummy)</span>
                <span>© {new Date().getFullYear()} BASARNAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmTampilan
        open={confTampilan}
        onClose={() => setConfTampilan(false)}
        onYa={() => {
          setPreferensiTampilan({ tabelPadat: false, notifikasiToast: true, tampilkanBadge: true })
          setConfTampilan(false)
          notify.success("Preferensi tampilan dikembalikan ke pengaturan awal.")
        }}
      />
    </>
  )
}

/* Icon helper dan modal konfirmasi kecil */
import { ConfirmModal as ConfirmTampilan } from "../components/ui.jsx"
function IkonReset() {
  return <RotateCcw size={14} />
}
