type Solicitud = {
  status: "pending" | "confirmed" | "cancelled" | string;
  id_servicio: string;
  estado_reserva: string;
  created_at: string; // o Date si lo vas a convertir
  is_credito: boolean | null;
  id_solicitud: string;
  id_viajero: string;
  hotel: string;
  check_in: string; // o Date
  check_out: string; // o Date
  room: string;
  total: string; // puede ser number si lo vas a convertir
  id_usuario_generador: string;
  nombre_viajero: string | null;
  id_booking: string | null;
  codigo_reservacion_hotel: string | null;
  id_pago: string | null;
  metodo_de_pago: string | null;
  tipo_de_pago: string | null;
  id_credito: string | null;
  pendiente_por_cobrar: string | null;
  monto_a_credito: string | null;
  id_agente: string;
  nombre_viajero_completo: string;
  nombre_agente_completo: string;
  correo: string;
  telefono: string;
  razon_social: string;
  rfc: string | null;
  tipo_persona: string;
};
