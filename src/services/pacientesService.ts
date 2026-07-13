import api from '../api/axiosConfig';
import { Paciente, CreatePacienteInput } from '../types';

export const pacientesService = {
  // GET /pacientes - Listar todos los pacientes
  getAll: async () => {
    const { data } = await api.get<Paciente[]>('/pacientes');
    return data;
  },

  // GET /pacientes/:id - Obtener detalle
  getById: async (id: string) => {
    const { data } = await api.get<Paciente>(`/pacientes/${id}`);
    return data;
  },

  // POST /pacientes - Crear nuevo paciente
  create: async (pacienteData: CreatePacienteInput) => {
    const { data } = await api.post<Paciente>('/pacientes', pacienteData);
    return data;
  },

  // PATCH /pacientes/:id - Actualizar
  update: async (id: string, pacienteData: Partial<CreatePacienteInput>) => {
    const { data } = await api.patch<Paciente>(`/pacientes/${id}`, pacienteData);
    return data;
  },

  // DELETE /pacientes/:id - Eliminar
  remove: async (id: string) => {
    const { data } = await api.delete<{ message: string }>(`/pacientes/${id}`);
    return data;
  }
};