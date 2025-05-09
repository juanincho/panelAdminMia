"use client";

import React from "react";

export interface FullHotelData {
  id_hotel?: string;
  id_excel?: string;
  id_cadena?: number;
  activo?: number;
  nombre?: string;
  correo?: string;
  telefono?: string;
  codigoPostal?: string;
  calle?: string;
  numero?: string;
  colonia?: string;
  Estado?: string;
  Ciudad_Zona?: string;
  municipio?: string;
  tipo_negociacion?: string;
  vigencia_convenio?: string;
  urlImagenHotel?: string;
  urlImagenHotelQ?: string;
  urlImagenHotelQQ?: string;
  tipo_pago?: string;
  disponibilidad_precio?: string;
  contacto_convenio?: string;
  contacto_recepcion?: string;
  iva?: string;
  ish?: string;
  otros_impuestos?: string;
  menoresEdad?: string;
  transportacion?: string;
  transportacionComentarios?: string;
  rfc?: string;
  razon_social?: string;
  calificacion?: number;
  tipo_hospedaje?: string;
  id_sepomex?: string;
  notas?: string;
  latitud?: string;
  longitud?: string;
  cuenta_de_deposito?: string;
  solicitud_disponibilidad?: string;
  comentario_pago?: string;
  costo_q?: string;
  precio_q?: string;
  costo_qq?: string;
  precio_qq?: string;
  precio_persona_extra?: string;
  precio_sencilla?: number;
  precio_doble?: number;
}

export interface HotelTableProps {
  data: FullHotelData[];
  onRowClick?: (hotel: FullHotelData) => void;
}

export function HotelTable({ data, onRowClick }: HotelTableProps) {
  // Determina si todos los campos (excepto opcionales) están completos
  const isHotelComplete = (hotel: FullHotelData): boolean => {
    return Object.entries(hotel)
      // Excluir campos opcionales que no bloquean la completitud
      .filter(([key]) => key !== "id_excel" && key !== "id_sepomex")
      .every(([, value]) => {
        if (typeof value === "string") {
          return value.trim() !== "";
        }
        return value !== null && value !== undefined;
      });
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
    if (
      date.getFullYear() === 1899 &&
      date.getMonth() === 10 && 
      date.getDate() === 30
    ) {
      return "SIN CONVENIO";
    }
    const today = new Date();
    // Comparar sin hora
    if (new Date(date.toDateString()) < new Date(today.toDateString())) {
      return "CONVENIO VENCIDO";
    }
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
              <td className="px-4 py-2">{getVigenciaLabel(hotel.vigencia_convenio)}</td>
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
