interface TypeFilters {
  codigo_reservacion?: string | null;
  client?: string | null;
  traveler?: string | null;
  hotel?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  recordCount?: string | null;
  empresa?: string | null;
  status?: "Confirmada" | "Pendiente" | "Cancelada" | "Todos" | null;
  reservationStage?: "Reservado" | "In house" | "Check-out" | null;
  paymentMethod?: "Credito" | "Contado" | null;
  filterType?: "Check-in" | "Check-out" | "Transaccion" | "Creacion" | null;
  active?: "Activo" | "Inactivo" | null;
  reservante?: "Operaciones" | "Cliente";
  markUp?: number;
  id_client?: string | null;
  statusPagoProveedor?: null | string;
  markup_start?: null | number;
  markup_end?: null | number;
}
