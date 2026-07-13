import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Input, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { pacientesService } from '../../services/pacientesService';
import { useAuth } from '../../hooks/useAuth';
import { Paciente } from '../../types';

const { Title } = Typography;

const Pacientes: React.FC = () => {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');

  // 1. Consumo real de la API NestJS al cargar el módulo
  const cargarPacientes = async () => {
    setLoading(true);
    try {
      const data = await pacientesService.getAll();
      setPacientes(data);
    } catch (error) {
      console.error(error);
      message.error('Error al cargar el listado de pacientes desde el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPacientes();
  }, []);

  // 2. Lógica para eliminar registros conectada al backend
  const handleEliminar = async (id: string) => {
    try {
      await pacientesService.remove(id);
      message.success('Paciente eliminado correctamente.');
      // Refrescar la tabla localmente
      setPacientes(pacientes.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      message.error('No se pudo eliminar el registro.');
    }
  };

  // 3. Control de Roles (Punto 8 de la guía)
  const esAdmin = user?.rol === 'ADMIN';

  // 4. Configuración de Columnas para Ant Design Table
  const columns = [
    {
      title: 'Nombre Completo',
      key: 'nombreCompleto',
      render: (_: any, record: Paciente) => 
        `${record.usuario?.nombre || 'Sin'} ${record.usuario?.apellido || 'Nombre'}`,
    },
    {
      title: 'Correo Electrónico',
      dataIndex: ['usuario', 'email'],
      key: 'email',
    },
    {
      title: 'Género',
      dataIndex: 'genero',
      key: 'genero',
      render: (text: string) => text || 'No especificado',
    },
    {
      title: 'Motivo de Consulta',
      dataIndex: 'motivoConsultaInicial',
      key: 'motivoConsultaInicial',
      ellipsis: true,
    },
    // Condición de permisos: Solo si es ADMIN se renderiza la columna de acciones CRUD
    ...(esAdmin
      ? [
          {
            title: 'Acciones',
            key: 'acciones',
            render: (_: any, record: Paciente) => (
              <Space size="middle">
                <Button 
                  type="text" 
                  icon={<EditOutlined style={{ color: '#1890ff' }} />} 
                  onClick={() => message.info(`Editar paciente ID: ${record.id} (Próximo paso: Modal)`)}
                />
                <Popconfirm
                  title="¿Estás seguro de eliminar este paciente?"
                  description="Esta acción no se puede deshacer."
                  onConfirm={() => handleEliminar(record.id)}
                  okText="Sí, eliminar"
                  cancelText="Cancelar"
                  okButtonProps={{ danger: true }}
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                  />
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  // Filtro de búsqueda en tiempo real en memoria sobre los datos del backend
  const datosFiltrados = pacientes.filter(p => {
    const nombreCompleto = `${p.usuario?.nombre || ''} ${p.usuario?.apellido || ''}`.toLowerCase();
    const email = (p.usuario?.email || '').toLowerCase();
    return nombreCompleto.includes(searchText.toLowerCase()) || email.includes(searchText.toLowerCase());
  });

  return (
    <Card bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Gestión de Pacientes Clínicos</Title>
        </div>
        {/* El botón de crear solo aparece visualmente si el rol es ADMIN */}
        {esAdmin && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={() => message.info('Próximo paso: Abrir Modal con formulario Zod')}
          >
            Nuevo Paciente
          </Button>
        )}
      </div>

      {/* Barra de Búsqueda y Herramientas */}
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Buscar por nombre o correo..."
          prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      {/* Tabla Principal Responsiva con Paginación Integrada de Antd */}
      <Table 
        columns={columns} 
        dataSource={datosFiltrados} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: true }} // Hace la tabla responsive en dispositivos móviles (Punto 9)
      />
    </Card>
  );
};

export default Pacientes;