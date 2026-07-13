import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Card, Input, Typography, Modal } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { pacientesService } from '../../services/pacientesService';
import { useAuth } from '../../hooks/useAuth';
import { Paciente, PacienteFormData } from '../../types';
import FormPaciente from '../../components/FormPaciente';

const { Title } = Typography;

const Pacientes: React.FC = () => {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  
  // Estados para el Modal y el paciente en edición
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);

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

  // Abrir modal en modo edición cargando los datos correspondientes
  const abrirEditar = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setIsModalOpen(true);
  };

  // Abrir modal en modo creación
  const abrirCrear = () => {
    setPacienteSeleccionado(null);
    setIsModalOpen(true);
  };

  // Procesar tanto Creación como Edición de forma dinámica
  const handleFormSubmit = async (data: PacienteFormData) => {
    setFormLoading(true);
    try {
      if (pacienteSeleccionado) {
        // MODO EDICIÓN: PATCH /pacientes/:id
        await pacientesService.update(pacienteSeleccionado.id, data);
        message.success('Paciente actualizado de manera exitosa.');
      } else {
        // MODO CREACIÓN: POST /pacientes
        await pacientesService.create(data);
        message.success('Paciente registrado de manera exitosa.');
      }
      
      setIsModalOpen(false);
      setPacienteSeleccionado(null);
      cargarPacientes();
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        message.error('El correo electrónico ya se encuentra registrado.');
      } else {
        message.error('Hubo un problema al guardar el registro en el servidor.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await pacientesService.remove(id);
      message.success('Paciente eliminado correctamente.');
      setPacientes(pacientes.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
      message.error('No se pudo eliminar el registro.');
    }
  };

  const esAdmin = user?.rol === 'ADMIN';

  const columns = [
    {
      title: 'Nombre Completo',
      key: 'nombreCompleto',
      render: (_: any, record: Paciente) => 
        `${record.usuario?.nombre || ''} ${record.usuario?.apellido || ''}`,
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
    ...(esAdmin
      ? [
          {
            title: 'Acciones',
            key: 'acciones',
            render: (_: any, record: Paciente) => (
              <Space size="middle">
                {/* Botón de edición conectado al estado */}
                <Button 
                  type="text" 
                  icon={<EditOutlined style={{ color: '#1890ff' }} />} 
                  onClick={() => abrirEditar(record)}
                />
                <Popconfirm
                  title="¿Estás seguro de eliminar este paciente?"
                  description="Esta acción no se puede deshacer."
                  onConfirm={() => handleEliminar(record.id)}
                  okText="Sí, eliminar"
                  cancelText="Cancelar"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  const datosFiltrados = pacientes.filter(p => {
    const nombreCompleto = `${p.usuario?.nombre || ''} ${p.usuario?.apellido || ''}`.toLowerCase();
    const email = (p.usuario?.email || '').toLowerCase();
    return nombreCompleto.includes(searchText.toLowerCase()) || email.includes(searchText.toLowerCase());
  });

  // Mapeamos los valores iniciales para React Hook Form si estamos editando
  const obtenerValoresIniciales = (): Partial<PacienteFormData> | undefined => {
    if (!pacienteSeleccionado) return undefined;
    return {
      nombre: pacienteSeleccionado.usuario?.nombre || '',
      apellido: pacienteSeleccionado.usuario?.apellido || '',
      email: pacienteSeleccionado.usuario?.email || '',
      fechaNacimiento: pacienteSeleccionado.fechaNacimiento,
      genero: pacienteSeleccionado.genero || '',
      ocupacion: pacienteSeleccionado.ocupacion || '',
      telefonoEmergencia: pacienteSeleccionado.telefonoEmergencia || '',
      contactoEmergenciaNombre: pacienteSeleccionado.contactoEmergenciaNombre || '',
      tipoSangre: pacienteSeleccionado.tipoSangre || '',
      antecedentesMedicos: pacienteSeleccionado.antecedentesMedicos || '',
      motivoConsultaInicial: pacienteSeleccionado.motivoConsultaInicial || '',
    };
  };

  return (
    <Card bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Gestión de Pacientes Clínicos</Title>
        </div>
        {esAdmin && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large"
            onClick={abrirCrear}
          >
            Nuevo Paciente
          </Button>
        )}
      </div>

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

      <Table 
        columns={columns} 
        dataSource={datosFiltrados} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 8 }}
        scroll={{ x: true }}
      />

      <Modal
        title={pacienteSeleccionado ? "Modificar Registro de Paciente" : "Registrar Nuevo Paciente Médico"}
        open={isModalOpen}
        onCancel={() => !formLoading && setIsModalOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <div style={{ marginTop: 20 }}>
          {/* Inyectamos dinámicamente los valores si existen */}
          <FormPaciente 
            onSubmit={handleFormSubmit} 
            loading={formLoading} 
            initialValues={obtenerValoresIniciales()} 
          />
        </div>
      </Modal>
    </Card>
  );
};

export default Pacientes;