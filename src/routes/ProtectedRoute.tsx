import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: Array<'ADMIN' | 'PSICOLOGO' | 'PACIENTE'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // Mientras valida si hay token guardado, muestra un estado de carga
  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>Cargando ConectaMente...</div>;
  }

  // Si no está autenticado, redirige a la página pública de Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere roles específicos y el usuario no lo tiene, lo manda al Dashboard base
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Si todo está bien, renderiza los componentes hijos (la página privada)
  return <Outlet />;
};

export default ProtectedRoute;