import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Dashboard from '../pages/admin/Dashboard';
import Pacientes from '../pages/admin/Pacientes';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rutas Privadas Protegidas bajo el DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rutas con restricción de rol */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'PSICOLOGO']} />}>
            <Route path="/dashboard/pacientes" element={<Pacientes />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;