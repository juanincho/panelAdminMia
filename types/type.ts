type Solicitud = {
  id_servicio: string;
  created_at: string; // ISO date string
  is_credito: boolean | null;
  id_solicitud: string;
  confirmation_code: string;
  id_viajero: string;
  hotel: string;
  check_in: string; // ISO date string
  check_out: string; // ISO date string
  room: string;
  total: string; // puede convertirse a number si se desea
  status: "pending" | "confirmed" | "cancelled" | string;
  id_usuario_generador: string;
  nombre_viajero: string;
  id_booking: string | null;
  id_pago: string;
  id_credito: string | null;
  pendiente_por_cobrar: boolean;
  monto_a_credito: string;
  primer_nombre: string | null;
  apellido_paterno: string | null;
};
