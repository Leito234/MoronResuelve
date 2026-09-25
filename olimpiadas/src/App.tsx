import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { IncidentProvider } from './context/IncidentContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Inicio } from './pages/Inicio';
import { Catalogo } from './pages/Catalogo';
import { NuevoReporte } from './pages/NuevoReporte';
import { Gestion } from './pages/Gestion';
import { Acceso } from './pages/Acceso';
import { Perfil } from './pages/Perfil';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

// Desplaza al inicio al cambiar de ruta
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <IncidentProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="app-container">
          <Header />
          <div className="main-content">
            <Routes>
              {/* Rutas Públicas (Modo Anónimo / Solo Lectura) */}
              <Route path="/" element={<Inicio />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/acceso" element={<Acceso />} />

              {/* Rutas Protegidas: Requieren Sesión Activa */}
              <Route
                path="/nuevo-reporte"
                element={
                  <ProtectedRoute>
                    <NuevoReporte />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reportar"
                element={
                  <ProtectedRoute>
                    <NuevoReporte />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mis-reportes"
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                }
              />

              {/* Rutas Protegidas Administrativas: Requieren Rol Admin/Inspector */}
              <Route
                path="/gestion"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Gestion />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Gestion />
                  </ProtectedRoute>
                }
              />

              {/* Ruta comodín */}
              <Route path="*" element={<Inicio />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </BrowserRouter>
    </IncidentProvider>
  );
};

export default App;
