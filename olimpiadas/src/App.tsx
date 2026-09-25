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
              <Route path="/" element={<Inicio />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/nuevo-reporte" element={<NuevoReporte />} />
              <Route path="/reportar" element={<NuevoReporte />} />
              <Route path="/gestion" element={<Gestion />} />
              <Route path="/admin" element={<Gestion />} />
              <Route path="/acceso" element={<Acceso />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/mis-reportes" element={<Perfil />} />
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
