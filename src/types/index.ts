import { Usuario } from '../contexts/AuthContext';
import { z } from 'zod';


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

// Esquema estricto de validación que simula el CreatePacienteDto del backend
export const pacienteSchema = z.object({
  // Campos del usuario base (necesarios para registrarlo en el sistema)
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('El formato del correo electrónico no es válido'),
  
  // Campos específicos del perfil del paciente
  fechaNacimiento: z.string().min(1, 'La fecha de nacimiento es obligatoria'),
  genero: z.string().max(50, 'El género no puede superar los 50 caracteres').optional().or(z.literal('')),
  ocupacion: z.string().max(150, 'La ocupación no puede superar los 150 caracteres').optional().or(z.literal('')),
  telefonoEmergencia: z.string().max(20, 'El teléfono de emergencia no puede superar los 20 caracteres').optional().or(z.literal('')),
  contactoEmergenciaNombre: z.string().max(150, 'El nombre del contacto no puede superar los 150 caracteres').optional().or(z.literal('')),
  tipoSangre: z.string().max(10, 'El tipo de sangre no puede superar los 10 caracteres').optional().or(z.literal('')),
  antecedentesMedicos: z.string().optional().or(z.literal('')),
  motivoConsultaInicial: z.string().optional().or(z.literal('')),
});

// Extraemos el tipo de TypeScript directamente del esquema de Zod
export type PacienteFormData = z.infer<typeof pacienteSchema>;