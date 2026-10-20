import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ShieldCheck, KeyRound, User, Landmark, FileClock, FileCheck2, Inbox } from "lucide-react"
import { useApp } from "../app-context.jsx"
import { notify } from "../components/ui.jsx"

export function LogoLogin() {
  return (
    <div className="login-logo">
      <Landmark size={30} strokeWidth={2} />
    </div>
  )
}

export default function Login() {
  const { setLoggedIn } = useApp()
  const navigate = useNavigate()
  const [nama, setNama] = useState("")
  const [kataSandi, setKataSandi] = useState("")
  const [proses, setProses] = useState(false)
  const [error, setError] = useState("")

  const masuk = (e) => {
    e.preventDefault()
    if (!nama.trim() || !kataSandi.trim()) {
      setError("Nama pengguna dan kata sandi wajib diisi.")
      notify.warning("Masukkan nama pengguna dan kata sandi untuk masuk (simulasi).")
      return
    }
    setError("")
    setProses(true)
    setTimeout(() => {
      setProses(false)
      setLoggedIn(true)
      notify.success(`Selamat datang di SIRANA, ${nama.trim()}! (sesi simulasi)`)
      navigate("/", { replace: true })
    }, 850)
  }

  return (
    <div className="login-screen login">
      <div className="login-left">
        <div style={{ maxWidth: 400, width: "100%" }}>
          <LogoLogin />
          <div style={{ marginBottom: 30 }}>
            <h1 style={{ fontSize: 27, color: "var(--primary)", letterSpacing: "0.04em" }}>SIRANA</h1>
            <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 6, lineHeight: 1.6 }}>
              Sistem Informasi Persuratan dan Kearsipan <strong>BASARNAS</strong>
            </p>
          </div>

          <div className="demo-hint">
            <strong>Mode simulasi:</strong> gunakan nama pengguna dan kata sandi apa pun untuk masuk. Belum ada backend pada tahap prototype ini.
          </div>

          <form onSubmit={masuk}>
            <div className="field">
              <label>Nama Pengguna</label>
              <div style={{ position: "relative" }}>
                <User size={16} style={{ position: "absolute", left: 12, top: 11, color: "#9aa1af" }} />
                <input
                  className="input"
                  style={{ paddingLeft: 36, height: 40 }}
                  placeholder="cth: sekarat admin"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="field">
              <label>Kata Sandi</label>
              <div style={{ position: "relative" }}>
                <KeyRound size={16} style={{ position: "absolute", left: 12, top: 11, color: "#9aa1af" }} />
                <input
                  className="input"
                  type="password"
                  style={{ paddingLeft: 36, height: 40 }}
                  placeholder="••••••••"
                  value={kataSandi}
                  onChange={(e) => setKataSandi(e.target.value)}
                />
              </div>
              {error && <span className="input-error">{error}</span>}
            </div>
            <button className="btn btn-primary" style={{ width: "100%", padding: 11, marginTop: 4 }} disabled={proses}>
              {proses ? "Memverifikasi…" : <span className="d-flex"><ShieldCheck size={16} /> &nbsp;Masuk ke SIRANA</span>}
            </button>
          </form>

          <p style={{ marginTop: 22, fontSize: 11.5, color: "#9aa1af", textAlign: "center", lineHeight: 1.6 }}>
            Tagline aplikasi: "Persuratan Digital yang Terintegrasi, Tertib, dan Efisien"
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="accent-deco" />
        <div className="accent-deco2" />
        <h2 className="tagline">
          Persuratan Digital yang <em>Terintegrasi, Tertib, dan Efisien</em>
        </h2>
        <div className="login-points">
          <div className="login-point">
            <span className="lp-ico"><Inbox size={16} /></span>
            Kelola surat masuk dan agenda secara rapi dan cepat
          </div>
          <div className="login-point">
            <span className="lp-ico"><FileClock size={16} /></span>
            Alur disposisi dan tindak lanjut yang jelas dengan tenggat
          </div>
          <div className="login-point">
            <span className="lp-ico"><FileCheck2 size={16} /></span>
            Persetujuan kepala kantor dan arsip digital satu pintu
          </div>
        </div>
        <div style={{ marginTop: 56, fontSize: 12.5, color: "#b8b3dd" }}>
          Prototype frontend — data dummy sesi simulasi
        </div>
      </div>
    </div>
  )
}
