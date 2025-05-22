export interface TypeFilters {
  codigo_reservacion?: string | null;
  client?: string | null;
  traveler?: string | null;
  hotel?: string | null;
  nombre?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  recordCount?: string | null;
  empresa?: string | null;
  status?: "Confirmada" | "Pendiente" | "Cancelada" | "Todos" | null;
  reservationStage?: "Reservado" | "In house" | "Check-out" | null;
  paymentMethod?: "Credito" | "Contado" | null;
  filterType?: "Check-in" | "Check-out" | "Transaccion" | "Creacion" | null;
  active?: "Activo" | "Inactivo" | null;
  hay_convenio?: "SI" | "NO";
  tipo_negociacion?: string | null;
  estado?: string | null;
  ciudad?: string | null;
  precioMin?: number | null;
  precioMax?: number | null;
  costoMin?: number | null;
  costoMax?: number | null;
  incluye_desayuno?: boolean | "SI" | "NO" | null;
  acepta_mascotas?: "SI" | "NO";
  tiene_transportacion?: "SI" | "NO";
  tipo_pago?: "CREDITO" | "PREPAGO";
  rfc?: string | null;
  razon_social?: string | null;
  tipo_hospedaje?: string | null;
  correo?: string | null;
  infoCompleta?: string | null;
  activo?: boolean | "ACTIVO" | "INACTIVO" | null;
  pais?: string | null;
  reservante?: "Operaciones" | "Cliente";
  markUp?: number;
  id_client?: string | null;
  statusPagoProveedor?: null | string;
  markup_start?: null | number;
  markup_end?: null | number;
}

export type Solicitud = {
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
  status: "pending" | "confirmed" | "cancelled" | string;
  id_usuario_generador: string;
  nombre_viajero: string | null;
  id_booking: string | null;
  id_hospedaje: string | null; // <--- Propiedad añadida
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
  telefono: string | null; // <--- Tipo corregido para permitir null
  razon_social: string;
  rfc: string | null;
  tipo_persona: string;
};
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

export interface Tax {
  name: string;
  porcentaje?: string;
  monto?: string;
}

export interface ReservationFormProps {
  solicitud: Solicitud;
  hotels: Hotel[];
  travelers: Traveler[];
  onClose: () => void;
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

// Interfaz para los impuestos dentro de la entidad Hotel
export interface HotelTax {
  name: string;
  porcentaje?: string; // El JSON muestra strings, ej "16.00"
  monto?: string; // El JSON muestra strings, ej "0.00"
}

// Interfaz para los tipos de cuartos dentro de Hotel
export interface Room {
  id_tipo_cuarto: number;
  nombre_tipo_cuarto: string;
  id_tarifa: number;
  precio: string; // El JSON muestra string, ej "1513.80"
  costo: string | null; // AJUSTADO: El JSON muestra string "1249.50" o podría ser null
  id_agente: null | string;
}

// Interfaz para la entidad Hotel (usada en ReservaForm)
export interface Hotel {
  id_hotel: string;
  nombre_hotel: string;
  Estado: string;
  Ciudad_Zona: string;
  impuestos: HotelTax[]; // Usando la HotelTax definida arriba
  imagenes: (string | null)[]; // El JSON muestra "" que puede ser string vacío o null
  tipos_cuartos: Room[];
}

// Tipo para Viajero (usado en ReservaForm)
export type Viajero = {
  nombre_completo?: string;
  id_viajero?: string;
  correo?: string;
  genero?: string | null; // AJUSTADO: para permitir null como en el JSON
  fecha_nacimiento?: string | null; // AJUSTADO: para permitir null
  telefono?: string | null; // AJUSTADO: para permitir null
  nacionalidad?: string | null;
  numero_pasaporte?: string | null;
  numero_empleado?: string | null;
};

// Interfaz para los impuestos dentro de cada item de ReservaForm.items
export interface ItemLevelTax {
  name: string;
  rate: number;
  tipo_impuesto: string;
  monto: number;
  base: number;
  total: number;
}

export interface ReservaForm {
  codigo_reservacion_hotel?: string;
  hotel: {
    name: string; // Nombre del hotel, ej. "CHN MONTERREY NORTE"
    content?: Hotel; // Objeto Hotel detallado, opcional si a veces solo viene el nombre
  };
  habitacion: string;
  check_in: string; // Formato YYYY-MM-DD
  check_out: string; // Formato YYYY-MM-DD
  viajero?: Viajero; // Usando el tipo Viajero ajustado
  estado_reserva: "Confirmada" | "En proceso" | "Cancelada";
  comments: string;
  proveedor: {
    total: number | null;
    subtotal: number;
    impuestos: number;
  };
  impuestos: {
    // Impuestos generales a nivel de reserva
    iva: number;
    ish: number;
    otros_impuestos: number;
    otros_impuestos_porcentaje: number;
  };
  venta: {
    markup?: number;
    total: number;
    subtotal: number;
    impuestos: number;
  };
  items?: {
    id_item?: string;
    noche: number;
    costo: {
      total: number;
      subtotal: number;
      impuestos: number;
    };
    venta: {
      total: number;
      subtotal: number;
      impuestos: number;
    };
    impuestos?: ItemLevelTax[]; // Usando la ItemLevelTax definida arriba
  }[];
  noches: number;
  solicitud: Solicitud;
}

/* ESTA ES LA FUNCIÖN DEL INSERT */
// const uuidv4 = () => {
//   return Math.random().toString(36).substring(2, 15);
// };
// const insertarReserva = async ({ reserva }: { reserva: ReservaForm }) => {
//   try {
//     const id_booking = `boo-${uuidv4()}`;

//     const { solicitud, venta, proveedor, hotel, items } = reserva;

//     const query = `INSERT INTO bookings (id_booking, id_servicio, check_in, check_out, total, subtotal, impuestos, estado, costo_total, costo_subtotal, costo_impuestos, fecha_pago_proveedor, fecha_limite_cancelacion, id_solicitud ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
//     const params = [
//       id_booking,
//       solicitud.id_servicio,
//       reserva.check_in,
//       reserva.check_out,
//       venta.total,
//       venta.subtotal,
//       venta.impuestos,
//       reserva.estado_reserva,
//       proveedor.total,
//       proveedor.subtotal,
//       proveedor.impuestos,
//       null,
//       null,
//       solicitud.id_solicitud,
//     ];

//     const response = await executeTransaction(
//       query,
//       params,
//       async (results, connection) => {
//         try {
//           const id_hospedaje = `hos-${uuidv4()}`;
//           const query_hospedaje = `INSERT INTO hospedajes (id_hospedaje, id_booking, nombre_hotel, cadena_hotel, codigo_reservacion_hotel, tipo_cuarto, noches, is_rembolsable, monto_penalizacion, conciliado, credito, comments, id_hotel) VALUES (?,?,?,?,?,?,?,?,?,?,?, ?,?);`;
//           const params_hospedaje = [
//             id_hospedaje,
//             id_booking,
//             hotel.content.nombre_hotel,
//             null,
//             reserva.codigo_reservacion_hotel,
//             reserva.habitacion,
//             reserva.noches,
//             null,
//             null,
//             null,
//             null,
//             reserva.comments,
//             hotel.content.id_hotel,
//           ];

//           const response_hospedaje = await connection.execute(
//             query_hospedaje,
//             params_hospedaje
//           );

//           const query_pago = `SELECT id_pago FROM pagos WHERE id_servicio = ? LIMIT 1;`;
//           const [rows] = await connection.execute(query_pago, [
//             solicitud.id_servicio,
//           ]);

//           if (rows.length === 0) {
//             const query_pago = `SELECT id_credito FROM pagos_credito WHERE id_servicio = ? LIMIT 1;`;
//             const [rowss] = await connection.execute(query_pago, [
//               solicitud.id_servicio,
//             ]);
//             if (rowss.length === 0) {
//               console.log("errrror");
//               throw new Error(
//                 `No se encontró un pago para el servicio ${solicitud.id_servicio}`
//               );
//             }
//             console.log("credito");

//             const itemsConId = items.map((item) => ({
//               ...item,
//               id_item: `ite-${uuidv4()}`,
//             }));
//             const query_items = `INSERT INTO items (id_item, id_catalogo_item, id_factura, total, subtotal, impuestos, is_facturado, fecha_uso, id_hospedaje, costo_total, costo_subtotal, costo_impuestos, costo_iva,saldo) VALUES ${itemsConId
//               .map((item) => "(?, ?,?,?,?,?,?,?,?, ?, ?, ?, ?, ?)")
//               .join(",")};`;

//             const params_items = itemsConId.flatMap((item) => [
//               item.id_item,
//               null,
//               null,
//               item.venta.total.toFixed(2),
//               item.venta.subtotal.toFixed(2),
//               item.venta.impuestos.toFixed(2),
//               null,
//               new Date().toISOString().split("T")[0],
//               id_hospedaje,
//               item.costo.total.toFixed(2),
//               item.costo.subtotal.toFixed(2),
//               item.costo.impuestos.toFixed(2),
//               (item.costo.total * 0.16).toFixed(2),
//               0,
//             ]);

//             const response_items = await connection.execute(
//               query_items,
//               params_items
//             );

//             const taxesData = [];

//             itemsConId.forEach((item) => {
//               if (item.impuestos && item.impuestos.length > 0) {
//                 item.impuestos.forEach((tax) => {
//                   taxesData.push({
//                     id_item: item.id_item,
//                     base: tax.base,
//                     total: tax.total,
//                     porcentaje: tax.rate ? tax.rate : 0,
//                     monto: tax.monto ? tax.monto : 0,
//                     name: tax.name,
//                     tipo_impuestos: tax.tipo_impuesto,
//                   });
//                 });
//               }
//             });
//             // console.log(taxesData);

//             if (taxesData.length > 0) {
//               const query_impuestos_items = `
//             INSERT INTO impuestos_items (id_item, base, total, porcentaje, monto, nombre_impuesto, tipo_impuesto)
//             VALUES ${taxesData.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ")};
//           `;

//               const params_impuestos_items = taxesData.flatMap((t) => [
//                 t.id_item,
//                 t.base,
//                 t.total,
//                 t.porcentaje,
//                 t.monto,
//                 t.name,
//                 t.tipo_impuestos,
//               ]);

//               const response_impuestos_items = await connection.execute(
//                 query_impuestos_items,
//                 params_impuestos_items
//               );
//             }

//             const response_solicitud = await connection.execute(
//               `UPDATE solicitudes SET status = "complete" WHERE id_solicitud = ?;`,
//               [solicitud.id_solicitud]
//             );

//             return { response_hospedaje, response_items, response_solicitud };
//           } else {
//             //pago de contado
//             const id_pago = rows[0].id_pago;

//             console.log("gola");
//             const itemsConId = items.map((item) => ({
//               ...item,
//               id_item: `ite-${uuidv4()}`,
//               costo_total: item.total,
//               costo_subtotal: parseFloat(item.subtotal.toFixed(2)),
//               costo_impuestos: parseFloat(item.impuestos.toFixed(2)),
//               costo_iva: parseFloat(item.total.toFixed(2)),
//             }));
//             const query_items = `INSERT INTO items (id_item, id_catalogo_item, id_factura, total, subtotal, impuestos, is_facturado, fecha_uso, id_hospedaje, costo_total, costo_subtotal, costo_impuestos, costo_iva) VALUES ${itemsConId
//               .map((item) => "(?, ?,?,?,?,?,?,?,?, ?, ?, ?, ?)")
//               .join(",")};`;

//             const params_items = itemsConId.flatMap((item) => [
//               item.id_item,
//               null,
//               null,
//               item.total,
//               item.subtotal,
//               item.impuestos,
//               null,
//               new Date().toISOString().split("T")[0],
//               id_hospedaje,
//               item.costo_total,
//               item.costo_subtotal,
//               item.costo_impuestos,
//               item.costo_iva,
//             ]);

//             const response_items = await connection.execute(
//               query_items,
//               params_items
//             );

//             // Insertar en items_pagos
//             const query_items_pagos = `
//             INSERT INTO items_pagos (id_item, id_pago, monto)
//             VALUES ${itemsConId.map(() => "(?, ?, ?)").join(",")};
//           `;

//             const params_items_pagos = itemsConId.flatMap((item) => [
//               item.id_item,
//               id_pago,
//               item.total,
//             ]);

//             await connection.execute(query_items_pagos, params_items_pagos);

//             const taxesData = [];

//             itemsConId.forEach((item) => {
//               if (item.taxes && item.taxes.length > 0) {
//                 item.taxes.forEach((tax) => {
//                   taxesData.push({
//                     id_item: item.id_item,
//                     id_impuesto: tax.id_impuesto, //Checar bien el cambio
//                     base: tax.base,
//                     total: tax.total,
//                   });
//                 });
//               }
//             });
//             console.log(taxesData);

//             if (taxesData.length > 0) {
//               const query_impuestos_items = `
//             INSERT INTO impuestos_items (id_impuesto, id_item, base, total)
//             VALUES ${taxesData.map(() => "(?, ?, ?, ?)").join(", ")};
//           `;

//               const params_impuestos_items = taxesData.flatMap((t) => [
//                 t.id_impuesto,
//                 t.id_item,
//                 t.base,
//                 t.total,
//               ]);

//               const response_impuestos_items = await connection.execute(
//                 query_impuestos_items,
//                 params_impuestos_items
//               );
//             }

//             const response_solicitud = await connection.execute(
//               `UPDATE solicitudes SET status = "complete" WHERE id_solicitud = ?;`,
//               [id_solicitud]
//             );

//             return { response_hospedaje, response_items, response_solicitud };
//           }
//         } catch (error) {
//           throw error;
//         }
//       }
//     );

//     return response;
//   } catch (error) {
//     throw error; // Lanza el error para que puedas manejarlo donde llames la función
//   }
// };

// const insertarReserva = async ({ reserva }: { reserva: ReservaForm }) => {
//   try {
//     const id_booking = `boo-${uuidv4()}`;
//     const { solicitud, venta, proveedor, hotel, items } = reserva; // 'items' aquí es ReservaForm['items']

//     // Query y parámetros para la inserción inicial en 'bookings'
//     // Asegúrate de que estas columnas coincidan con tu tabla 'bookings'
//     const query_bookings = `
//       INSERT INTO bookings (
//         id_booking, id_servicio, check_in, check_out,
//         total, subtotal, impuestos, estado,
//         costo_total, costo_subtotal, costo_impuestos,
//         fecha_pago_proveedor, fecha_limite_cancelacion, id_solicitud
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//     `;
//     const params_bookings = [
//       id_booking,
//       solicitud.id_servicio,
//       reserva.check_in,
//       reserva.check_out,
//       venta.total,
//       venta.subtotal,
//       venta.impuestos,
//       reserva.estado_reserva,
//       proveedor.total,
//       proveedor.subtotal,
//       proveedor.impuestos,
//       null, // fecha_pago_proveedor - Ajusta si lo tienes
//       null, // fecha_limite_cancelacion - Ajusta si lo tienes
//       solicitud.id_solicitud,
//     ];

//     // La función executeTransaction debería tomar la primera query y sus params,
//     // y luego el callback con la conexión para las siguientes operaciones.
//     const response = await executeTransaction(
//       query_bookings,
//       params_bookings,
//       async (results, connection) => {
//         // 'results' es de la inserción en bookings
//         try {
//           // 1. Insertar Hospedaje
//           const id_hospedaje = `hos-${uuidv4()}`;
//           // Asegúrate de que estas columnas coincidan con tu tabla 'hospedajes'
//           const query_hospedaje = `
//             INSERT INTO hospedajes (
//               id_hospedaje, id_booking, nombre_hotel, cadena_hotel,
//               codigo_reservacion_hotel, tipo_cuarto, noches,
//               is_rembolsable, monto_penalizacion, conciliado,
//               credito, comments, id_hotel
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
//           `;
//           const params_hospedaje = [
//             id_hospedaje,
//             id_booking,
//             hotel.content?.nombre_hotel, // Usar optional chaining por si content no viene
//             null, // cadena_hotel - Ajusta si lo tienes
//             reserva.codigo_reservacion_hotel,
//             reserva.habitacion,
//             reserva.noches,
//             null, // is_rembolsable
//             null, // monto_penalizacion
//             null, // conciliado
//             null, // credito (¿se refiere al método de pago o a una línea de crédito del hotel?)
//             reserva.comments,
//             hotel.content?.id_hotel,
//           ];
//           await connection.execute(query_hospedaje, params_hospedaje);

//           // Preparar items con ID (común para ambos casos: crédito o contado)
//           // 'items' es el array original de ReservaForm['items']
//           const itemsConIdAnadido =
//             items && items.length > 0
//               ? items.map((item) => ({
//                   ...item, // Esto incluye item.costo, item.venta, item.impuestos originales
//                   id_item: `ite-${uuidv4()}`,
//                 }))
//               : [];

//           // 2. Insertar Items en la tabla 'items' (común si hay items)
//           if (itemsConIdAnadido.length > 0) {
//             const query_items_insert = `
//               INSERT INTO items (
//                 id_item, id_catalogo_item, id_factura,
//                 total, subtotal, impuestos,
//                 is_facturado, fecha_uso, id_hospedaje,
//                 costo_total, costo_subtotal, costo_impuestos, costo_iva, saldo
//               ) VALUES ${itemsConIdAnadido
//                 .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
//                 .join(",")};
//             `;
//             const params_items_insert = itemsConIdAnadido.flatMap(
//               (itemConId) => [
//                 itemConId.id_item,
//                 null, // id_catalogo_item - Ajusta si lo tienes
//                 null, // id_factura - Ajusta si lo tienes
//                 itemConId.venta.total.toFixed(2),
//                 itemConId.venta.subtotal.toFixed(2),
//                 itemConId.venta.impuestos.toFixed(2),
//                 null, // is_facturado - Ajusta si lo tienes
//                 new Date().toISOString().split("T")[0], // fecha_uso
//                 id_hospedaje,
//                 itemConId.costo.total.toFixed(2),
//                 itemConId.costo.subtotal.toFixed(2),
//                 itemConId.costo.impuestos.toFixed(2),
//                 // Asumimos IVA del 16% sobre el costo total del item. ¡VERIFICA ESTA LÓGICA!
//                 (itemConId.costo.total * 0.16).toFixed(2),
//                 0, // saldo inicial - Ajusta si es diferente
//               ]
//             );
//             await connection.execute(query_items_insert, params_items_insert);
//           }

//           // 3. Insertar Impuestos de Items en 'impuestos_items' (común si hay items con impuestos)
//           const taxesDataParaDb: any[] = []; // Puedes crear un tipo para esto
//           if (itemsConIdAnadido.length > 0) {
//             itemsConIdAnadido.forEach((itemConId) => {
//               // itemConId.impuestos debe ser ItemLevelTax[] según ReservaForm
//               if (itemConId.impuestos && itemConId.impuestos.length > 0) {
//                 itemConId.impuestos.forEach((tax: ItemLevelTax) => {
//                   taxesDataParaDb.push({
//                     id_item: itemConId.id_item,
//                     base: tax.base,
//                     total: tax.total,
//                     porcentaje: tax.rate ?? 0,
//                     monto: tax.monto ?? 0,
//                     name: tax.name,
//                     tipo_impuestos: tax.tipo_impuesto,
//                   });
//                 });
//               }
//             });

//             if (taxesDataParaDb.length > 0) {
//               const query_impuestos_items = `
//                 INSERT INTO impuestos_items (id_item, base, total, porcentaje, monto, nombre_impuesto, tipo_impuesto)
//                 VALUES ${taxesDataParaDb
//                   .map(() => "(?, ?, ?, ?, ?, ?, ?)")
//                   .join(", ")};
//               `;
//               const params_impuestos_items = taxesDataParaDb.flatMap((t) => [
//                 t.id_item,
//                 t.base,
//                 t.total,
//                 t.porcentaje,
//                 t.monto,
//                 t.name,
//                 t.tipo_impuestos,
//               ]);
//               await connection.execute(
//                 query_impuestos_items,
//                 params_impuestos_items
//               );
//             }
//           }

//           // 4. Lógica Específica de Pago (Contado vs Crédito)
//           const query_pago_contado = `SELECT id_pago FROM pagos WHERE id_servicio = ? LIMIT 1;`;
//           const [rowsContado] = await connection.execute(query_pago_contado, [
//             solicitud.id_servicio,
//           ]);

//           if (rowsContado.length > 0) {
//             // --- Bloque de PAGO DE CONTADO ---
//             const id_pago = rowsContado[0].id_pago;
//             console.log("Procesando pago de contado:", id_pago);

//             if (itemsConIdAnadido.length > 0) {
//               const query_items_pagos = `
//                 INSERT INTO items_pagos (id_item, id_pago, monto)
//                 VALUES ${itemsConIdAnadido.map(() => "(?, ?, ?)").join(",")};
//               `;
//               // El monto asociado al pago del item suele ser el total de la venta del item
//               const params_items_pagos = itemsConIdAnadido.flatMap(
//                 (itemConId) => [
//                   itemConId.id_item,
//                   id_pago,
//                   itemConId.venta.total.toFixed(2),
//                 ]
//               );
//               await connection.execute(query_items_pagos, params_items_pagos);
//             }
//           } else {
//             // --- Bloque de PAGO A CRÉDITO (o no se encontró pago de contado) ---
//             const query_pago_credito = `SELECT id_credito FROM pagos_credito WHERE id_servicio = ? LIMIT 1;`;
//             const [rowsCredito] = await connection.execute(query_pago_credito, [
//               solicitud.id_servicio,
//             ]);

//             if (rowsCredito.length === 0) {
//               console.error(
//                 "Error: No se encontró un pago (contado o crédito) para el servicio",
//                 solicitud.id_servicio
//               );
//               throw new Error(
//                 `No se encontró un pago para el servicio ${solicitud.id_servicio}`
//               );
//             }
//             const id_credito = rowsCredito[0].id_credito;
//             console.log("Procesando pago a crédito:", id_credito);
//             // La lógica original no asociaba el id_credito directamente a los items en una tabla similar a items_pagos.
//             // Si necesitas hacerlo, aquí sería el lugar.
//           }

//           // 5. Actualizar Solicitud (común para ambos casos)
//           await connection.execute(
//             `UPDATE solicitudes SET status = "complete" WHERE id_solicitud = ?;`,
//             [solicitud.id_solicitud] // Asegúrate que solicitud.id_solicitud está disponible
//           );

//           return {
//             message: "Reserva procesada exitosamente",
//             id_booking: id_booking,
//             // puedes añadir más datos al objeto de respuesta si es necesario
//           };
//         } catch (errorInTransaction) {
//           console.error("Error dentro de la transacción:", errorInTransaction);
//           throw errorInTransaction; // Es crucial para que executeTransaction pueda hacer rollback
//         }
//       }
//     );

//     return response; // Esto será lo que devuelva el callback de executeTransaction
//   } catch (error) {
//     console.error("Error al insertar reserva:", error);
//     throw error; // Lanza el error para que puedas manejarlo donde llames la función
//   }
// };
