export interface Tax {
  id_impuesto: number;
  name: string;
  rate: number;
  mount: number;
  base: number;
  total: number;
}

export interface NightCost {
  night: number;
  baseCost: number;
  taxes: Tax[];
  totalWithTaxes: number;
}

export interface PaymentMethod {
  type: "spei" | "credit_card" | "balance";
  paymentDate: string;
  cardLastDigits?: string;
  comments: string;
}

export interface Room {
  id_tipo_cuarto: number;
  nombre_tipo_cuarto: string;
  id_tarifa: number;
  precio: string;
  id_agente: null | string;
}

export interface Hotel {
  id_hotel: string;
  nombre_hotel: string;
  Estado: string;
  Ciudad_Zona: string;
  tipos_cuartos: Room[];
}

export interface Traveler {
  id_viajero: string;
  primer_nombre: string;
  segundo_nombre: string | null;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  fecha_nacimiento: string;
  genero: string;
  telefono: string;
  created_at: string;
  updated_at: string;
  nacionalidad: string | null;
  numero_pasaporte: string | null;
  numero_empleado: string | null;
}
export interface Solicitud {
  id_usuario_generador: any;
  id_servicio: string;
  id_solicitud: string;
  confirmation_code: string;
  id_viajero: number;
  hotel: string;
  check_in: string;
  check_out: string;
  room: string;
  total: number;
  status: string;
  created_at: string;
}

export interface ReservationFormProps {
  solicitud: Solicitud;
  hotels: Hotel[];
  travelers: Traveler[];
  onClose: () => void;
}
