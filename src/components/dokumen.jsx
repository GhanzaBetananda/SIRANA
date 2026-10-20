import React from "react"
import { Landmark, FileText, Download } from "lucide-react"

/* Logo SIRANA — placeholder mudah diganti dengan logo BASARNAS asli */
export function LogoMark({ size = 38 }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }}>
      <Landmark size={size * 0.55} strokeWidth={2.1} />
    </span>
  )
}

/* Beranda simbol untuk kop surat / preview */
export function LogoBulat({ size = 72 }) {
  return (
    <div className="a4-logo" style={{ width: size, height: size }}>
      <Landmark size={size * 0.5} strokeWidth={1.6} />
    </div>
  )
}

/* Preview surat resmi A4 — placeholder kop BASARNAS */
export function SuratAP4({ surat, pemeriksaNama }) {
  return (
    <div className="a4-page">
      <div className="a4-kop">
        <LogoBulat />
        <div className="kop-lines">
          <div className="kop-l1">PANGKALAN NASIONAL PENCARIAN DAN PERTOLONGAN</div>
          <div className="kop-l2">KANTOR PENCARIAN DAN PERTOLONGAN KELAS B</div>
          <div className="kop-l3">Lokasi Kantor SAR, Banjarmasin, Kalimantan Selatan, 70245</div>
          <div className="kop-l4 kapan">Representasi Banjarmasin / Imaginary Sistem Persuratan Satu Data — [LOGO BASARNAS]</div>
        </div>
      </div>

      <div className="a4-title">{surat.perihal?.toUpperCase() || "PERIHAL SURAT"}</div>
      <div className="a4-nomer">
        Nomor: {surat.nomorSurat || "- (Draft)"} <br />
        Klasifikasi: {surat.klasifikasi || "-"} • {new Date(surat.tanggalSurat || Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
      </div>

      <p style={{ marginBottom: 10 }}>Yth. {surat.tujuan || "instansi terkait"}</p>
      <p style={{ marginBottom: 14 }}>Dengan hormat,</p>
      <div
        style={{ whiteSpace: "pre-wrap", marginBottom: 20, textAlign: "justify" }}
      >
        {surat.isi || "— Isi surat belum ditulis —"}
      </div>

      <div className="a4-sig">
        <div className="sig-box">
          <div>
            {surat.status === "Terkirim" || surat.status === "Disetujui" ? (
              <div style={{ marginBottom: 4, color: "#067647", fontWeight: 700, fontSize: 11 }}>
              </div>
            ) : null}
          </div>
          <div style={{ fontSize: 12.5 }}>Kepala Kantor,</div>
          <div className="sig-line">ISKA A. NURDIN, S.T., M.M.</div>
          <div className="sig-nip">NIP. 19690412 199303 1 001</div>
          <div style={{ fontSize: 10.5, color: "#999", marginTop: 6 }}>
            (Area penandatangan — dokumentasi simulasi tanda tangan elektronik)
          </div>
        </div>
      </div>
      {surat.lampiran && (
        <div style={{ marginTop: 26, fontSize: 12 }}>
          Lampiran: {surat.lampiran}
        </div>
      )}
    </div>
  )
}

/* Preview lampiran PDF dummy */
export function PDFPreview({ nama }) {
  return (
    <div className="pdf-preview">
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#5b6270", fontSize: 12, fontWeight: 600 }}>
        <FileText size={16} />
        {nama || "Dokumen.pdf"}
        <span style={{ marginLeft: "auto", fontSize: 10.5, color: "#9aa1af", fontWeight: 400 }}>
          Pratinjau lampiran (simulasi)
        </span>
      </div>
      <div className="pdf-page">
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div className="pdf-line w40" />
          <div className="pdf-line w95" />
          <div className="pdf-line w85" />
          <div className="pdf-line w60" />
          <div style={{ height: 8 }} />
          <div className="pdf-line w95" />
          <div className="pdf-line w95" />
          <div className="pdf-line w85" />
          <div className="pdf-line w40" />
        </div>
      </div>
      <div className="pdf-page" style={{ opacity: 0.5 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          <div className="pdf-line w60" />
          <div className="pdf-line w95" />
          <div className="pdf-line w85" />
        </div>
      </div>
    </div>
  )
}

/* Tombol unduh simulasi */
export function UnduhSimulasi({ namaFile }) {
  const handle = () => {
    // Simulasi unduh dokumen (menghasilkan berkas teks placeholder di sisi klien)
    const blob = new Blob(
      [`SIRANA — dokument kontrak simulasi\n\nDokumen simulasi: ${namaFile}\n\nBerkas ini adalah simulasi unduhan lampiran pada prototype SIRANA.\n`],
      { type: "text/plain;charset=utf-8" }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = (namaFile || "dokumen-sirana").replace(/\.pdf$/i, "") + "-simulasi.txt"
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <button className="btn btn-outline-primary btn-sm" onClick={handle}>
      <Download size={13} /> Unduh Dokumen
    </button>
  )
}
