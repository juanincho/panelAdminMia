"use client";

import React from "react";

export interface FullHotelData {
  id_hotel?: string;
  id_hotel_excel?: number | null;
  nombre?: string;
  id_cadena?: number;
  correo?: string | null;
  telefono?: string | null;
  rfc?: string;
  razon_social?: string;
  direccion?: string;
  latitud?: string | null;
  longitud?: string | null;
  convenio?: string | null;
  descripcion?: string | null;
  calificacion?: number | null;
  tipo_hospedaje?: string;
  cuenta_de_deposito?: string | null;
  Estado?: string;
  Ciudad_Zona?: string;
  NoktosQ?: number | null;
  NoktosQQ?: number | null;
  MenoresEdad?: string;
  PaxExtraPersona?: string;
  DesayunoIncluido?: string | null;
  DesayunoComentarios?: string | null;
  DesayunoPrecioPorPersona?: string | null;
  Transportacion?: string;
  TransportacionComentarios?: string | null;
  mascotas?: string;
  salones?: string;
  URLImagenHotel?: string;
  URLImagenHotelQ?: string;
  URLImagenHotelQQ?: string;
  Activo?: number;
  Comentarios?: string;
  Id_Sepomex?: number | null;
  CodigoPostal?: string;
  Colonia?: string;
  tipo_negociacion?: string;
  vigencia_convenio?: string | null;
  comentario_vigencia?: string | null;
  tipo_pago?: string;
  disponibilidad_precio?: string;
  contacto_convenio?: string;
  contacto_recepcion?: string;
  iva?: string | number;
  ish?: string | number;
  otros_impuestos?: string | number;
  otros_impuestos_porcentaje?: string | number | null;
  comentario_pago?: string;
  precio_sencilla?: number | string;
  precio_doble?: number | string;
  costo_sencilla?: number | string;
  costo_doble?: number | string;
}

export interface HotelTableProps {
  data: FullHotelData[];
  onRowClick?: (hotel: FullHotelData) => void;
}

export function HotelTable({ data, onRowClick }: HotelTableProps) {
  // Función revisada para verificar si un hotel tiene toda la información requerida
  const isHotelComplete = (hotel: FullHotelData): boolean => {
    // Campos que siempre se excluyen de la verificación (campos opcionales, notas y datos en desuso)
    const keysToExclude = [
      'id_hotel_excel', 'id_sepomex', 'latitud', 'longitud', 'calificacion',
      'noktosq', 'noktosqq',
      'convenio', 'descripcion',
      'desayunoincluido', 'desayunocomentarios', 'desayunoprecioporpersona',
      'paxextrapersona',
      'transportacion', 'transportacioncomentarios',
      'mascotas', 'salones',
      'urlimagenhotel', 'urlimagenhotelq', 'urlimagenhotelqq',
      'cuenta_de_deposito', 'correo', 'telefono', 'rfc', 'razon_social',
      'codigopostal', 'colonia',
      'tipo_negociacion', 'disponibilidad_precio',
      'vigencia_convenio', // Comentario_vigencia se filtra por 'comentario'
      'otros_impuestos_porcentaje'
    ].map(k => k.toLowerCase());

    // Filtrar todas las entradas que NO sean comentarios ni estén en la lista de exclusión
    const entriesToCheck = Object.entries(hotel).filter(([rawKey]) => {
      const key = rawKey.toLowerCase();
      return !key.includes('comentario') && !keysToExclude.includes(key);
    });

    // Contar cuántos de esos campos tienen un valor válido
    const nonNullCount = entriesToCheck.reduce((count, [, value]) => {
      const hasValue =
        typeof value === 'string'
          ? value.trim() !== ''
          : value !== null && value !== undefined;
      return hasValue ? count + 1 : count;
    }, 0);

    // Debug: mostrar cuántos campos se evaluaron y cuántos no están vacíos
    console.log(
      `isHotelComplete → campos evaluados: ${entriesToCheck.length}, ` +
      `no nulos/vacíos: ${nonNullCount}`
    );

    // Solo marcamos como completo si TODOS los campos evaluados tienen valor
    return nonNullCount === entriesToCheck.length;
  };

  const formatDate = (rawDate: string): string => {
    if (!rawDate) return "";
    const date = new Date(rawDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

const getVigenciaLabel = (rawDate: string): string => {
  if (!rawDate) return "SIN CONVENIO";

  const date = new Date(rawDate);

  // Manejar explícitamente la fecha por defecto (MySQL o Excel a veces mandan esto)
  const isDefault = date.toISOString().startsWith("1899-11-30");
  if (isDefault) return "SIN CONVENIO";

  const today = new Date();
  const onlyDate = new Date(date.toDateString());
  const todayOnly = new Date(today.toDateString());

  if (onlyDate < todayOnly) return "CONVENIO VENCIDO";

  return formatDate(rawDate);
};


  const handleRowClick = (hotel: FullHotelData) => {
    console.log("Hotel seleccionado:", hotel);
    onRowClick?.(hotel);
  };

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Tipo Negociación</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Ciudad</th>
            <th className="px-4 py-2 text-left">Vigencia</th>
            <th className="px-4 py-2 text-left">Precios (Con impuestos)</th>
            <th className="px-4 py-2 text-left">Tipo pago</th>
            <th className="px-4 py-2 text-left">Info Completa</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((hotel) => (
            <tr
              key={hotel.id_hotel}
              onClick={() => handleRowClick(hotel)}
              className="hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <td className="px-4 py-2">{hotel.tipo_negociacion}</td>
              <td className="px-4 py-2">{hotel.nombre}</td>
              <td className="px-4 py-2">{hotel.Estado}</td>
              <td className="px-4 py-2">{hotel.Ciudad_Zona}</td>
              <td className="px-4 py-2">{getVigenciaLabel(hotel.vigencia_convenio || '')}</td>
              <td className="px-4 py-2">
                Sencilla: ${hotel.precio_sencilla || "N/A"} <br />
                Doble: ${hotel.precio_doble || "N/A"}
              </td>
              <td className="px-4 py-2">{hotel.tipo_pago}</td>
              <td className="px-4 py-2">
                {isHotelComplete(hotel) ? (
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full font-bold">
                    COMPLETO
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-red-200 text-red-800 rounded-full font-bold">
                    INCOMPLETO
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
