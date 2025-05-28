interface Empresa {
  id_empresa: string;
  razon_social: string;
}

interface Agente {
  created_viajero: string;
  id_agente: string;
  id_viajero: string;
  primer_nombre: string;
  segundo_nombre: string | null;
  apellido_paterno: string;
  apellido_materno: string | null;
  correo: string;
  genero: string | null;
  fecha_nacimiento: string | null;
  telefono: string | null;
  nacionalidad: string | null;
  numero_pasaporte: string | null;
  numero_empleado: string | null;
  empresas: Empresa[];
  nombre_agente_completo: string;
  created_at: string;
  updated_at: string;
  tiene_credito_consolidado: number;
  monto_credito: number | null;
  nombre: string;
  notas: string | null;
  vendedor: string | null;
}
