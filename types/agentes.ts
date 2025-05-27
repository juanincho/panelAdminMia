interface Empresa {
  id_empresa: string;
  razon_social: string;
}

interface Agente {
  id_agente: string;
  id_viajero: string;
  primer_nombre: string;
  segundo_nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  genero: string;
  telefono: string;
  created_viajero: Date;
  fecha_nacimiento: Date;
  nacionalidad: string;
  numero_pasaporte: string;
  numero_empleado: string;
  empresas: Empresa[];
  nombre_agente_completo: string;
  tiene_credito_consolidado: number;
  monto_credito: number | null;
}
