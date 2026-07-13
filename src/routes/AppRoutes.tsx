import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Dashboard from '../pages/admin/Dashboard';
import Pacientes from '../pages/admin/Pacientes';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- RUTAS PRIVADAS COMPARTIDAS --- */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>

      {/* --- RUTAS PRIVADAS EXCLUSIVAS (ADMIN / PSICOLOGO) --- */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'PSICOLOGO']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/pacientes" element={<Pacientes />} />
        </Route>
      </Route>

      {/* Redirección por defecto si entran a una ruta inexistente */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;