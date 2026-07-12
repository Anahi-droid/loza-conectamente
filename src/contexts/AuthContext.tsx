import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axiosConfig';

// Interfaz del Usuario según los roles de tu backend
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'ADMIN' | 'PSICOLOGO' | 'PACIENTE';
}

// Interfaz de las funciones y estados que expone el contexto
interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Persistencia de sesión leyendo del almacenamiento local
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser) as Usuario);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const { data } = await api.post<{ accessToken: string; usuario: Usuario }>('/auth/login', { email, password });
    
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.usuario));
    setUser(data.usuario);
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};