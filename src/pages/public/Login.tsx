import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd'; 
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Función que se ejecuta cuando el usuario pasa las validaciones visuales de Antd
  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      // Consumo real acoplado a nuestro AuthContext
      await login(values.email, values.password);
      message.success('¡Inicio de sesión exitoso! Bienvenido al sistema.');
      
      // Redirección inmediata al área privada protegida
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      // Manejo de errores dinámico según la respuesta del backend
      if (error.response && error.response.status === 401) {
        message.error('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
      } else {
        message.error('Error de conexión con el servidor. Inténtalo más tarde.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f0f2f5' 
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>ConectaMente</Title>
          <Text type="secondary">Plataforma de Gestión Integral de Transportes y Salud</Text>
        </div>

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          {/* Campo Email con validaciones integradas de Antd */}
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: 'Por favor, ingresa tu correo electrónico.' },
              { type: 'email', message: 'El formato del correo no es válido.' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} 
              placeholder="ejemplo@ute.edu.ec" 
              size="large"
            />
          </Form.Item>

          {/* Campo Contraseña */}
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'Por favor, ingresa tu contraseña.' },
              { min: 8, message: 'La contraseña debe tener al menos 8 caracteres.' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="••••••••••••"
              size="large"
            />
          </Form.Item>

          {/* Botón de Envío con indicador de carga */}
          <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large" 
              loading={submitting}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;