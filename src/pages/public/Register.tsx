import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Petición real al endpoint de registro de usuarios del backend
      await api.post('/usuarios', {
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        password: values.password,
        rol: 'PACIENTE', // Se registra automáticamente como PACIENTE
      });

      message.success('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
      navigate('/login'); // Lo redirigimos al login
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        message.error('El correo electrónico ya está registrado en la plataforma.');
      } else {
        message.error('Error al comunicarse con el servidor. Inténtalo más tarde.');
      }
    } finally {
      setLoading(false);
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
      <Card style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>Crear Cuenta</Title>
          <Text type="secondary">Regístrate en ConectaMente como Paciente</Text>
        </div>

        <Form name="register_form" onFinish={onFinish} layout="vertical" requiredMark={false}>
          <Form.Item
            name="nombre"
            label="Nombre"
            rules={[{ required: true, message: 'Por favor, ingresa tu nombre.' }]}
          >
            <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} placeholder="Andrés" size="large" />
          </Form.Item>

          <Form.Item
            name="apellido"
            label="Apellido"
            rules={[{ required: true, message: 'Por favor, ingresa tu apellido.' }]}
          >
            <Input prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} placeholder="Jurado" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
              { required: true, message: 'Por favor, ingresa tu correo.' },
              { type: 'email', message: 'El formato de correo no es válido.' }
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} placeholder="ejemplo@ute.edu.ec" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: 'Por favor, ingresa tu contraseña.' },
              { min: 8, message: 'La contraseña debe tener al menos 8 caracteres.' }
            ]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />} placeholder="••••••••••••" size="large" />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Registrarse
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;