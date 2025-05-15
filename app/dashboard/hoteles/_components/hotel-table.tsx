"use client";

import React from "react";
import { quitarAcentos } from "./hotel-dialog";

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
  iva?: string ;
  ish?: string ;
  otros_impuestos?: string ;
  otros_impuestos_porcentaje?: string | null;
  comentario_pago?: string;
  precio_sencilla?: number | string;
  precio_doble?: number | string;
  costo_sencilla?: number | string;
  costo_doble?: number | string;
}

export interface HotelTableProps {
  data: FullHotelData[];
  onRowClick?: (hotel: FullHotelData) => void;
  onSort?: (field: string) => void;
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
}

export function isHotelComplete(hotel: FullHotelData): string {
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
    'vigencia_convenio',
    'otros_impuestos_porcentaje'
  ].map(k => k.toLowerCase());

  const entriesToCheck = Object.entries(hotel).filter(([rawKey]) => {
    const key = rawKey.toLowerCase();
    return !key.includes('comentario') && !keysToExclude.includes(key);
  });

  const nonNullCount = entriesToCheck.reduce((count, [, value]) => {
    const hasValue =
      typeof value === 'string'
        ? value.trim() !== ''
        : value !== null && value !== undefined;
    return hasValue ? count + 1 : count;
  }, 0);

  return nonNullCount === entriesToCheck.length ? "COMPLETA" : "INCOMPLETA";
}

export function HotelTable({ data, onRowClick, onSort, sortField, sortDirection }: HotelTableProps) {
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
    const isDefault = date.toISOString().startsWith("1899-11-30");
    if (isDefault) return "SIN CONVENIO";
    const today = new Date();
    const onlyDate = new Date(date.toDateString());
    const todayOnly = new Date(today.toDateString());
    if (onlyDate < todayOnly) return "CONVENIO VENCIDO";
    return formatDate(rawDate);
  };

  const handleRowClick = (hotel: FullHotelData) => {
    onRowClick?.(hotel);
  };

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort?.("tipo_negociacion")}>Tipo Negociación {sortField === "tipo_negociacion" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort?.("nombre")}>Nombre {sortField === "nombre" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort?.("Estado")}>Estado {sortField === "Estado" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort?.("Ciudad_Zona")}>Ciudad {sortField === "Ciudad_Zona" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</th>
            <th className="px-4 py-2 text-left">Vigencia</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort?.("precio_sencilla")}>Precio sencilla (Con impuestos) {sortField === "precio_sencilla" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort?.("precio_doble")}>Precio doble (Con impuestos) {sortField === "precio_doble" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</th>
            <th className="px-4 py-2 text-left cursor-pointer" onClick={() => onSort?.("tipo_pago")}>Tipo pago {sortField === "tipo_pago" ? (sortDirection === "asc" ? "↑" : "↓") : ""}</th>
            <th className="px-4 py-2 text-left">Info Completa</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                No se encontraron hoteles
              </td>
            </tr>
          ) : (
            data.map((hotel) => (
              <tr
                key={hotel.id_hotel}
                onClick={() => handleRowClick(hotel)}
                className={`hover:bg-gray-100 cursor-pointer transition-colors ${
                  hotel.Activo === 0 ? 'bg-red-100 text-red-800 font-semibold' : ''
                }`}
              >
                <td className="px-4 py-2">{quitarAcentos((hotel.tipo_negociacion || "").toUpperCase())}</td>
                <td className="px-4 py-2">{quitarAcentos((hotel.nombre || "").toUpperCase())}</td>
                <td className="px-4 py-2">{quitarAcentos((hotel.Estado || "").toUpperCase())}</td>
                <td className="px-4 py-2">{quitarAcentos((hotel.Ciudad_Zona || "").toUpperCase())}</td>
                <td className="px-4 py-2">{getVigenciaLabel(hotel.vigencia_convenio || '')}</td>
                <td className="px-4 py-2">{hotel.precio_sencilla}</td>
                <td className="px-4 py-2">{hotel.precio_doble}</td>
                <td className="px-4 py-2">{quitarAcentos(hotel.tipo_pago.toUpperCase())}</td>
                <td className="px-4 py-2">
                  {isHotelComplete(hotel) === "COMPLETA" ? (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
