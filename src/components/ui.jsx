import React, { useEffect } from "react"
import { toast } from "react-toastify"
import {
  BadgeCheck, CheckCircle2, ChevronDown, X, ChevronRight, ChevronLeft,
  Inbox, FileText, Clock, Database, Send, Info,
} from "lucide-react"
import { STATUS_BADGE } from "../utils.js"

/* ---------- Notifikasi toast (React-Toastify, kanan atas) ---------- */
export const notify = {
  success: (msg) => toast.success(msg, { position: "top-right", autoClose: 3200 }),
  error: (msg) => toast.error(msg, { position: "top-right", autoClose: 3800 }),
  warning: (msg) => toast.warning(msg, { position: "top-right", autoClose: 3400 }),
  info: (msg) => toast.info(msg, { position: "top-right", autoClose: 3000 }),
}

/* ------------------- Badge status ------------------- */
export function Badge({ status }) {
  const cls = STATUS_BADGE[status] || "badge-draft"
  return (
    <span className={`badge ${cls}`}>
      <span className="badge-dot" style={{ background: "currentColor" }} />
      {status}
    </span>
  )
}

export function PrioritasBadge({ value }) {
  const map = { Tinggi: "badge-pri-high", Sedang: "badge-pri-med", Rendah: "badge-pri-low" }
  return <span className={`badge ${map[value] || "badge-pri-low"}`}>{value}</span>
}

/* ------------------- Modal generik ------------------- */
export function Modal({ open, onClose, title, size = "", footer, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      const esc = (e) => e.key === "Escape" && onClose?.()
      window.addEventListener("keydown", esc)
      return () => {
        document.body.style.overflow = ""
        window.removeEventListener("keydown", esc)
      }
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`modal ${size ? "modal-" + size : ""}`}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Tutup">
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

/* ------------------- Modal konfirmasi ------------------- */
export function ConfirmModal({ open, title = "Konfirmasi", message, confirmLabel = "Konfirmasi", cancelLabel = "Batal", danger, onConfirm, onCancel, loading }) {
  if (!open) return null
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel?.()}>
      <div className="modal modal-sm">
        <div className="modal-body" style={{ textAlign: "center", paddingTop: 28 }}>
          <div className="confirm-ico" style={{ background: danger ? "var(--danger-soft)" : "var(--accent-soft)", color: danger ? "var(--danger)" : "#90610a" }}>
            {danger ? <X size={22} /> : <BadgeCheck size={22} />}
          </div>
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>{title}</h3>
          <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.55 }}>{message}</p>
        </div>
        <div className="modal-foot" style={{ justifyContent: "center" }}>
          <button className="btn btn-outline" onClick={onCancel}>{cancelLabel}</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm} disabled={loading}>
            {loading ? "Memproses…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------- Header halaman ------------------- */
export function PageHeader({ title, desc, actions }) {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        {desc && <p className="ph-desc">{desc}</p>}
      </div>
      {actions && <div className="ph-actions">{actions}</div>}
    </div>
  )
}

/* ------------------- Pagination ------------------- */
function pageList(page, total) {
  const out = []
  for (let i = 1; i <= total; i++) out.push(i)
  if (total <= 7) return out
  if (page <= 3) return [1, 2, 3, 4, "…", total]
  if (page >= total - 2) return [1, "…", total - 3, total - 2, total - 1, total]
  return [1, "…", page - 1, page, page + 1, "…", total]
}

export function Pagination({ page, total, onPage }) {
  const info = `Halaman ${page} dari ${total}`
  return (
    <div className="pagination">
      <span className="page-info">{info}</span>
      <div className="page-btns">
        <button className="page-btn" disabled={page === 1} onClick={() => onPage(page - 1)} aria-label="Sebelumnya">
          <ChevronLeft size={14} />
        </button>
        {pageList(page, total).map((p, i) =>
          p === "…" ? (
            <span key={`d${i}`} className="page-dots">…</span>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === page ? "current" : ""}`}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          )
        )}
        <button className="page-btn" disabled={page === total} onClick={() => onPage(page + 1)} aria-label="Berikutnya">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

/* ------------------- Empty & loading state ------------------- */
export function EmptyState({ title = "Tidak ada data", desc = "Belum ada data yang sesuai dengan pencarian atau filter Anda.", action }) {
  return (
    <div className="empty-state">
      <div className="es-ico"><Inbox size={26} /></div>
      <h4>{title}</h4>
      <p>{desc}</p>
      {action}
    </div>
  )
}

export function LoadingBlock({ text = "Memuat data…" }) {
  return (
    <div className="loading-block">
      <div className="spinner" />
      <span style={{ fontSize: 12.5 }}>{text}</span>
    </div>
  )
}

/* ------------------- Field formulir ------------------- */
export function Field({ label, required, error, children, full }) {
  return (
    <div className="field" style={full ? { gridColumn: "1 / -1" } : undefined}>
      {label && (
        <label>
          {label} {required && <span className="req">*</span>}
        </label>
      )}
      {children}
      {error && <span className="input-error">{error}</span>}
    </div>
  )
}

/* ------------------- Dropdown pilihan sederhana ------------------- */
export function TampilkanKosong() {
  return <EmptyState />
}

/* ------------------- Dropdown profil ------------------- */
export function StatCard({ icon, label, value, tone = "primary", trend }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-ico" style={{
          background: tone === "primary" ? "var(--primary-soft)" : tone === "accent" ? "var(--accent-soft)" : tone === "success" ? "var(--success-soft)" : "var(--info-soft)",
          color: tone === "primary" ? "var(--primary)" : tone === "accent" ? "#90610a" : tone === "success" ? "var(--success)" : "var(--primary-dark)",
        }}>{icon}</span>
      </div>
      <div>
        <div className="stat-num">{value}</div>
        {trend && <div className={`stat-trend ${trend.up ? "up" : "warn"}`}>{trend.text}</div>}
      </div>
    </div>
  )
}

export const DASH_ICONS = { Inbox, FileText, Clock, Database, Send, CheckCircle2 }
