import { Usuario } from '../contexts/AuthContext';

// Interfaz que mapea exactamente lo que tu base de datos y DTOs esperan de un Paciente
export interface Paciente {
  id: string;
  usuarioId: string;
  fechaNacimiento: string;
  genero?: string;
  ocupacion?: string;
  telefonoEmergencia?: string;
  contactoEmergenciaNombre?: string;
  tipoSangre?: string;
  antecedentesMedicos?: string;
  motivoConsultaInicial?: string;
  usuario?: Usuario; // Relación cargada por la base de datos (nombre, apellido, email)
}

// Lo que necesitas enviar al backend para registrar un paciente nuevo
export interface CreatePacienteInput {
  email: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  genero?: string;
  ocupacion?: string;
  telefonoEmergencia?: string;
  contactoEmergenciaNombre?: string;
  tipoSangre?: string;
  antecedentesMedicos?: string;
  motivoConsultaInicial?: string;
}