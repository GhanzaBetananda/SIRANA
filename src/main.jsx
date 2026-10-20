import React from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import { AppProvider, useApp } from "./app-context.jsx"
import { AppLayout } from "./layout/AppLayout.jsx"
import Login from "./pages/Login.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import SuratMasuk from "./pages/SuratMasuk.jsx"
import SuratKeluar from "./pages/SuratKeluar.jsx"
import Disposisi from "./pages/Disposisi.jsx"
import Persetujuan from "./pages/Persetujuan.jsx"
import ArsipDigital from "./pages/ArsipDigital.jsx"
import Pengaturan from "./pages/Pengaturan.jsx"
import "./styles.css"

function Terlindungi({ children }) {
  const { loggedIn } = useApp()
  const location = useLocation()
  if (!loggedIn) {
    return <Navigate to="/login" state={{ dari: location.pathname }} replace />
  }
  return <AppLayout>{children}</AppLayout>
}

function Aplikasi() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastContainer
          position="top-right"
          newestOnTop
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          limit={4}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <Terlindungi>
                <Dashboard />
              </Terlindungi>
            }
          />
          <Route
            path="/surat-masuk"
            element={
              <Terlindungi>
                <SuratMasuk />
              </Terlindungi>
            }
          />
          <Route
            path="/surat-keluar"
            element={
              <Terlindungi>
                <SuratKeluar />
              </Terlindungi>
            }
          />
          <Route
            path="/disposisi"
            element={
              <Terlindungi>
                <Disposisi />
              </Terlindungi>
            }
          />
          <Route
            path="/persetujuan"
            element={
              <Terlindungi>
                <Persetujuan />
              </Terlindungi>
            }
          />
          <Route
            path="/arsip"
            element={
              <Terlindungi>
                <ArsipDigital />
              </Terlindungi>
            }
          />
          <Route
            path="/pengaturan"
            element={
              <Terlindungi>
                <Pengaturan />
              </Terlindungi>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

createRoot(document.getElementById("root")).render(<Aplikasi />)
