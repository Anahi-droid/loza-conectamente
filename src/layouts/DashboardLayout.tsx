import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Header, Sider, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Definición dinámica del menú basado en los Roles del Backend (Punto 8)
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    // Solo ADMIN y PSICOLOGO pueden gestionar pacientes (según tus Guards)
    ...(user?.rol === 'ADMIN' || user?.rol === 'PSICOLOGO'
      ? [
          {
            key: '/dashboard/pacientes',
            icon: <UserOutlined />,
            label: 'Pacientes',
          },
        ]
      : []),
    {
      key: '/dashboard/citas',
      icon: <CalendarOutlined />,
      label: 'Mis Citas',
    },
    {
      key: '/dashboard/historial',
      icon: <FileTextOutlined />,
      label: 'Historial Clínico',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} breakpoint="lg" onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
          {collapsed ? 'CM' : 'ConectaMente'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px 0 0', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: '500' }}>
              {user?.nombre} {user?.apellido} ({user?.rol})
            </span>
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
            >
              Salir
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          {/* Aquí se renderizarán las sub-páginas (Dashboard, Pacientes, etc.) */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;