import React, { useState, useRef, useEffect } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard, Inbox, Send, ClipboardList, BadgeCheck, Archive,
  Settings, PanelLeftClose, PanelLeftOpen, Bell, LogOut, Menu, User,
  ChevronRight, Layers, Clock3, ClipboardCheck,
} from "lucide-react"
import { useApp } from "../app-context.jsx"
import { LogoMark } from "../components/dokumen.jsx"
import { ConfirmModal, notify } from "../components/ui.jsx"

const MENU = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, desc: "Dashboard" },
  { to: "/surat-masuk", label: "Surat Masuk", icon: Inbox, desc: "Surat Masuk" },
  { to: "/surat-keluar", label: "Surat Keluar", icon: Send, desc: "Surat Keluar" },
  { to: "/disposisi", label: "Disposisi", icon: ClipboardList, desc: "Disposisi", badgeKey: "disposisiBaru" },
  { to: "/persetujuan", label: "Persetujuan", icon: BadgeCheck, desc: "Persetujuan", badgeKey: "persetujuan" },
  { to: "/arsip", label: "Arsip Digital", icon: Archive, desc: "Arsip Digital" },
  { to: "/pengaturan", label: "Pengaturan", icon: Settings, desc: "Pengaturan" },
]

export function AppLayout({ children }) {
  const { pengguna, notifikasi, setLoggedIn } = useApp()
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const notifRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => { setDrawerOpen(false) }, [location.pathname])

  const jumlahBadge = {
    disposisiBaru: notifikasi.filter((n) => n.tipe === "disposisi").length,
    persetujuan: notifikasi.filter((n) => n.tipe === "persetujuan").length,
  }

  /* breadcrumb: label menu dari path; index juga terkandung */
  const current = MENU.find((m) => m.to === location.pathname)
  const bcLabel = current ? current.label : "SIRANA"

  const doLogout = () => {
    setLogoutOpen(false)
    setLoggedIn(false)
    notify.info("Berhasil keluar dari akun (simulasi). Sampai jumpa!")
    navigate("/login")
  }

  const initials = pengguna.nama
    .replace(/,.*$/, "")
    .split(" ")
    .map((w) => w[0])
    .filter((_, i) => i < 2)
    .join("")
    .toUpperCase()

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${drawerOpen ? "sidebar-open" : ""}`}>
        <NavLink to="/" className="sidebar-brand">
          <LogoMark />
          <div className="sidebar-text">
            <div className="brand-name">SIRANA</div>
            <div className="brand-sub">Persuratan &amp; Kearsipan BASARNAS</div>
          </div>
        </NavLink>

        <nav className="sidebar-nav">
          <div className="sidebar-section sidebar-text">Menu Utama</div>
          {MENU.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <m.icon size={19} className="nav-icon" strokeWidth={2} />
              <span className="sidebar-text">{m.label}</span>
              {m.badgeKey && jumlahBadge[m.badgeKey] > 0 && (
                <span className="sidebar-badge">{jumlahBadge[m.badgeKey]}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            <span className="sidebar-text">Ciutkan Sidebar</span>
          </button>
        </div>
      </aside>

      {drawerOpen && <div className="sidebar-overlay" onClick={() => setDrawerOpen(false)} />}

      <div className={`main-area ${collapsed ? "collapsed" : ""}`}>
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-btn topbar-menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Buka menu"
            >
              <Menu size={17} />
            </button>
            <NavLink to="/" className="topbar-brand-mini">
              <span className="dot"><Layers size={14} /></span>
              SIRANA
            </NavLink>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <span>Beranda</span>
              <ChevronRight size={13} className="sep" />
              <span className="bc-current">{bcLabel}</span>
            </nav>
          </div>

          <div className="topbar-right">
            {/* Notifikasi */}
            <div style={{ position: "relative" }} ref={notifRef}>
              <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)} aria-label="Notifikasi">
                <Bell size={17} />
                {notifikasi.length > 0 && <span className="notif-dot" />}
              </button>
              {notifOpen && (
                <div className="notif-pop">
                  <header>Notifikasi</header>
                  <div className="notif-list">
                    {notifikasi.length === 0 ? (
                      <div className="notif-empty">
                        Tidak ada notifikasi. Semua persuratan telah ditindaklanjuti!
                      </div>
                    ) : (
                      notifikasi.map((n, i) => (
                        <div
                          className="notif-item"
                          key={i}
                          onClick={() => {
                            setNotifOpen(false)
                            navigate(n.tipe === "persetujuan" ? "/persetujuan" : "/disposisi")
                          }}
                        >
                          <span
                            className="n-ico"
                            style={{
                              background: n.tipe === "persetujuan" ? "var(--accent-soft)" : "var(--primary-soft)",
                              color: n.tipe === "persetujuan" ? "#90610a" : "var(--primary)",
                            }}
                          >
                            {n.tipe === "persetujuan" ? <ClipboardCheck size={15} /> : n.tipe === "tln" ? <Clock3 size={15} /> : <ClipboardList size={15} />}
                          </span>
                          <div>
                            <div style={{ fontWeight: 600, lineHeight: 1.4 }}>{n.judul}</div>
                            <div className="n-time">{n.detail}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profil */}
            <button className="profile-chip" onClick={() => navigate("/pengaturan")}>
              <span className="avatar">{initials}</span>
              <span className="p-info">
                <div className="p-name">{pengguna.nama}</div>
                <div className="p-role">{pengguna.jabatan}</div>
              </span>
            </button>

            <button className="icon-btn" onClick={() => setLogoutOpen(true)} title="Keluar" aria-label="Keluar">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Konten halaman */}
        <main className="page content-fade">{children}</main>
      </div>

      {/* Konfirmasi logout */}
      <ConfirmModal
        open={logoutOpen}
        title="Keluar dari SIRANA?"
        message="Anda akan keluar dari akun sesi simulasi. Data dummy aplikasi akan tetap tersimpan selama browser terbuka pada sesi ini."
        confirmLabel="Ya, Keluar"
        danger
        onConfirm={doLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  )
}
