interface Servicio {
  // id_servicio: string; //Lo creo en backend
  // total: number; //Se agrega al hacer la reservación
  // subtotal: number; //Se saca al quitar los impuestos al total
  // impuestos: number; //iva
  // otros_impuestos: null; //Hasta que lo cambien o algo
  // is_credito: boolean; //Depende de la forma en que se pague
  // fecha_limite_pago: null; //Se usara despues
}

interface Solicitud {
  // id_solicitud: string; //backend
  // id_servicio: string; //backend al crearlo
  // confirmation_code: string; //Codigo de confirmacion de mia
  // id_viajero: string; //Viajero principal
  // hotel: string; // nombre de hotel
  // check_in: string; // fecha de entrada
  // check_out: string; // fecha de salida
  // room: string; //Tipo de cuarto
  // total: number; //pagado
  // status: "pending" | "complete" | "canceled";
}

interface Booking {
  id_booking: string; //create Backend
  // id_servicio: string; //recibir admin
  // check_in: string; //solicitud
  // check_out: string; //solicitud
  // total: number; //solicitud
  // subtotal: number; //solicitud
  // impuestos: number; //solicitud
  // estado: "Confirmada" | "Cancelada" | "En proceso"; //Cambiar en admin
  // fecha_pago_proveedor: null; //Lo usaremos despues
  // costo_total: number; //recibir admin
  // costo_subtotal: number; //admin
  // costo_impuestos: number; //admin
  // fecha_limite_cancelacion: null; //Lo usaremos despues
}

interface Hospedaje {
  id_hospedaje: string; //backend
  id_booking: string; //backend despues de crearlo
  // id_hotel: null; //lo conectaremos despues
  // nombre_hotel: string; //solicitud
  // cadena_hotel: null; //Lo usaremos despues
  // codigo_reservacion_hotel: string; //admin
  // tipo_cuarto: string; //solicitud
  // noches: number; //items (admin)
  // is_rembolsable: null; //Lo usaremos despues
  // monto_penalizacion: null; //Lo usaremos despues
  // conciliado: null; //Lo usaremos despues
  // credito: null; //Lo usaremos despues
}

interface Item {
  id_item: string; //backend
  // id_catalogo_item: null; //Lo ocuparemos despues
  // id_factura: null; //Lo ocuparemos despues
  id_hospedaje: string; //creando el hospedaje backend
  // fecha_uso: null; //Lo usaremos despues
  // is_facturado: null; //Lo usaremos despues
  // total: number; //admin
  // subtotal: number; //admin
  // impuestos: number; //admin
}
