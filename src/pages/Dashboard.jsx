import React from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import {
  Inbox, Send, ClipboardCheck, CheckCircle2, Archive, ArrowUpRight, ArrowRight,
  ClipboardList, BadgeCheck, FileText,
} from "lucide-react"
import { useApp } from "../app-context.jsx"
import { PageHeader, StatCard, Badge, EmptyState, LoadingBlock } from "../components/ui.jsx"
import { formatJam, formatTanggalPendek } from "../utils.js"

const DATA_GRAFIK = [
  { bulan: "Mei", masuk: 26, keluar: 19 },
  { bulan: "Juni", masuk: 31, keluar: 24 },
  { bulan: "Juli", masuk: 28, keluar: 22 },
  { bulan: "Agustus", masuk: 34, keluar: 27 },
  { bulan: "September", masuk: 29, keluar: 26 },
  { bulan: "Oktober", masuk: 8, keluar: 5 },
]

export default function Dashboard() {
  const { suratMasuk, suratKeluar, disposisi, suratMenungguPersetujuan, arsip, aktivitas } = useApp()
  const navigate = useNavigate()
  const [memuat, setMemuat] = React.useState(true)

  React.useEffect(() => {
    const t = setTimeout(() => setMemuat(false), 550)
    return () => clearTimeout(t)
  }, [])

  if (memuat) return <LoadingBlock text="Memuat dashboard persuratan…" />

  const totalMasuk = suratMasuk.length
  const totalKeluar = suratKeluar.length
  const diproses =
    suratMasuk.filter((s) => s.status === "Selesai").length +
    suratKeluar.filter((s) => ["Disetujui", "Terkirim"].includes(s.status)).length

  /* Surat terbaru: gabungan */
  const terbaru = [
    ...suratMasuk.slice(0, 3).map((s) => ({
      jenis: "Surat Masuk", tipe: "in",
      nomor: s.nomorSurat, perihal: s.perihal, tanggal: s.tanggalDiterima, status: s.status,
    })),
    ...suratKeluar.slice(0, 2).map((s) => ({
      jenis: "Surat Keluar", tipe: "out",
      nomor: s.nomorSurat, perihal: s.perihal, tanggal: s.tanggalSurat, status: s.status,
    })),
  ]

  /* Daftar tugas: disposisi belum/tln + persetujuan */
  const tugas = [
    ...disposisi
      .filter((d) => d.status !== "Selesai")
      .map((d) => ({
        tipe: "disposisi",
        judul: `Tindak lanjut disposisi — ${d.perihal}`,
        sub: `No. ${d.nomorSurat} • Untuk: ${d.penerima}`,
        tenggat: d.tenggat,
        status: d.status,
        to: "/disposisi",
      })),
    ...suratMenungguPersetujuan.map((s) => ({
      tipe: "persetujuan",
      judul: `Persetujuan surat — ${s.perihal}`,
      sub: `No. ${s.nomorSurat.replace("- (Draft)", "Draft")} • Pembuat: ${s.pembuat}`,
      tenggat: null,
      status: s.status,
      to: "/persetujuan",
    })),
  ].slice(0, 6)

  return (
    <>
      <PageHeader
        title="Dashboard"
        desc="Ringkasan aktivitas persuratan dan kearsipan Kantor SAR — Persuratan Digital yang Terintegrasi, Tertib, dan Efisien."
        actions={
          <>
            <Link to="/surat-masuk">
              <button className="btn btn-outline">
                <Inbox size={15} /> Surat Masuk
              </button>
            </Link>
            <Link to="/surat-keluar">
              <button className="btn btn-primary">
                <Send size={15} /> Buat Surat Keluar
              </button>
            </Link>
          </>
        }
      />

      {/* Kartu statistik */}
      <div className="stat-grid">
        <StatCard icon={<Inbox size={19} />} label="Total Surat Masuk" value={totalMasuk} tone="primary" trend={{ up: true, text: "+14% bulan ini" }} />
        <StatCard icon={<Send size={19} />} label="Total Surat Keluar" value={totalKeluar} tone="accent" trend={{ up: true, text: "+9% bulan ini" }} />
        <StatCard icon={<ClipboardCheck size={19} />} label="Menunggu Persetujuan" value={suratMenungguPersetujuan.length} tone="info" trend={{ up: false, text: "perlu pemaraf" }} />
        <StatCard icon={<CheckCircle2 size={19} />} label="Surat Diproses" value={diproses} tone="success" trend={{ up: true, text: "+6% bulan ini" }} />
        <StatCard icon={<Archive size={19} />} label="Total Arsip" value={arsip.length} tone="primary" trend={{ up: true, text: "+4% bulan ini" }} />
      </div>

      {/* Grafik + tugas */}
      <div className="dash-row">
        <div className="card">
          <div className="card-head">
            <div className="card-title-ico">
              <FileText size={17} style={{ color: "var(--primary)" }} />
              <h3>Statistik Persuratan (6 Bulan Terakhir)</h3>
            </div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={268}>
              <BarChart data={DATA_GRAFIK} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef4" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(31,6,172,0.04)" }}
                  contentStyle={{ borderRadius: 10, border: "1px solid #e6e8ee", fontSize: 12.5, fontFamily: "inherit" }}
                />
                <Legend wrapperStyle={{ fontSize: 12.5 }} />
                <Bar dataKey="masuk" name="Surat Masuk" fill="#1F06AC" radius={[5, 5, 0, 0]} maxBarSize={30} />
                <Bar dataKey="keluar" name="Surat Keluar" fill="#FCAD38" radius={[5, 5, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div className="card-title-ico">
              <BadgeCheck size={17} style={{ color: "#90610a" }} />
              <h3>Tugas Membutuhkan Tindak Lanjut</h3>
            </div>
          </div>
          <div>
            {tugas.length === 0 ? (
              <EmptyState title="Tidak ada tugas tertunda" desc="Semua disposisi dan persetujuan telah ditindaklanjuti dengan baik." />
            ) : (
              tugas.map((t, i) => (
                <div className="task-item" key={i} onClick={() => navigate(t.to)}>
                  <span
                    className="stat-ico"
                    style={{
                      width: 36, height: 36,
                      background: t.tipe === "persetujuan" ? "var(--accent-soft)" : "var(--primary-soft)",
                      color: t.tipe === "persetujuan" ? "#90610a" : "var(--primary)",
                    }}
                  >
                    {t.tipe === "persetujuan" ? <BadgeCheck size={16} /> : <ClipboardList size={16} />}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{t.judul}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>
                      {t.sub}
                      {t.tenggat && <> • Tenggat: {formatTanggalPendek(t.tenggat)}</>}
                    </div>
                  </div>
                  <ArrowUpRight size={16} style={{ color: "var(--muted)", flexShrink: 0 }} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Surat terbaru + aktivitas */}
      <div className="dash-row dash-row-terbaru">
        <div className="card">
          <div className="card-head" style={{ padding: "15px 18px" }}>
            <h3>Surat Terbaru</h3>
            <Link to="/arsip" style={{ color: "var(--primary)", fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="tbl-wrap">
            <table className="tbl" style={{ minWidth: 520 }}>
              <thead>
                <tr>
                  <th>Nomor Surat</th>
                  <th>Jenis</th>
                  <th>Perihal</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {terbaru.map((s, i) => (
                  <tr key={i}>
                    <td className="td-strong tno">{s.nomor}</td>
                    <td>
                      <span className={`badge ${s.tipe === "in" ? "badge-disposisi" : "badge-terkirim"}`} style={{ gap: 4 }}>
                        {s.jenis}
                      </span>
                    </td>
                    <td style={{ maxWidth: 210 }}>
                      <div className="td-strong" style={{ fontWeight: 500 }}>{s.perihal}</div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>{formatTanggalPendek(s.tanggal)}</td>
                    <td><Badge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Aktivitas Terbaru</h3>
          </div>
          <div className="card-body" style={{ paddingTop: 6 }}>
            {aktivitas.slice(0, 6).map((a) => (
              <div className="activity-item" key={a.id}>
                <span className="a-dot" />
                <div>
                  <div className="a-title">{a.judul}</div>
                  <div className="a-time">{formatJam(a.ts)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
