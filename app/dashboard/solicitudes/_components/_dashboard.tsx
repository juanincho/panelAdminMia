"use client";

import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { ReservationForm } from "./_reservation-form";
import Filters from "@/components/Filters";
import { fetchSolicitudes } from "@/services/solicitudes";
import {
  calcularNoches,
  formatDate,
  formatRoom,
  getPaymentBadge,
  getStageBadge,
  getStatusBadge,
  getWhoCreateBadge,
} from "@/helpers/utils";
import { Table } from "@/components/Table";

const defaultFiltersSolicitudes: TypeFilters = {
  codigo_reservacion: null,
  client: null,
  reservante: null,
  reservationStage: null,
  hotel: null,
  startDate: new Date().toISOString().split("T")[0],
  endDate: null,
  status: "Pendiente",
  traveler: null,
  paymentMethod: null,
  id_client: null,
  statusPagoProveedor: null,
  filterType: "Creacion",
  markup_end: null,
  markup_start: null,
};

function App({ hoteles }: { hoteles: any }) {
  const [allSolicitudes, setAllSolicitudes] = useState<Solicitud[]>([]);
  const [selectedItem, setSelectedItem] = useState<Solicitud | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const handleFilter = (filters: any) => {
    fetchSolicitudes(filters, (data) => {
      setAllSolicitudes(data);
    });
  };

  const handleEdit = (item: Solicitud) => {
    setSelectedItem(item);
  };

  let formatedSolicitudes = allSolicitudes
    .filter(
      (item) =>
        item.hotel.toUpperCase().includes(searchTerm) ||
        item.nombre_agente_completo.toUpperCase().includes(searchTerm) ||
        item.nombre_viajero_completo.toUpperCase().includes(searchTerm)
    )
    .map((item) => ({
      id_cliente: item.id_agente,
      cliente: (item?.razon_social || "").toUpperCase(),
      hotel: item.hotel.toUpperCase(),
      codigo_hotel: item.codigo_reservacion_hotel,
      metodo_de_pago: `${item.id_credito ? "credito" : "contado"}`,
      noches: calcularNoches(item.check_in, item.check_out),
      check_in: item.check_in,
      check_out: item.check_out,
      precio_de_venta: parseFloat(item.total),
      etapa_reservacion: item.estado_reserva,
      viajero: (
        item.nombre_viajero || item.nombre_viajero_completo
      ).toUpperCase(),
      reservante: item.id_usuario_generador ? "Cliente" : "Operaciones",
      habitacion: formatRoom(item.room),
      estado: item.status,
      creado: item.created_at,
      editar: item,
    }));

  let componentes = {
    reservante: ({ value }: { value: string | null }) =>
      getWhoCreateBadge(value),
    etapa_reservacion: ({ value }: { value: string | null }) =>
      getStageBadge(value),
    metodo_de_pago: ({ value }: { value: null | string }) =>
      getPaymentBadge(value),
    id_cliente: ({ value }: { value: null | string }) => (
      <span className="font-semibold text-sm">
        {value ? value.split("-").join("").slice(0, 8) : ""}
      </span>
    ),
    codigo_hotel: (props: any) => (
      <span className="font-semibold">{props.value}</span>
    ),
    editar: (props: any) => (
      <button
        onClick={() => handleEdit(props.value)}
        className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out flex gap-2 items-center"
      >
        <Pencil className="w-4 h-4" />
        Editar
      </button>
    ),
    estado: (props: any) => (
      <span title={props.value}>{getStatusBadge(props.value)}</span>
    ),
    precio_de_venta: (props: any) => (
      <span title={props.value}>${props.value.toFixed(2)}</span>
    ),
    hotel: (props: any) => (
      <span className="font-medium " title={props.value}>
        {props.value}
      </span>
    ),
    viajero: (props: any) => <span title={props.value}>{props.value}</span>,
    habitacion: (props: any) => <span title={props.value}>{props.value}</span>,
    check_in: (props: any) => (
      <span title={props.value}>{formatDate(props.value)}</span>
    ),
    check_out: (props: any) => (
      <span title={props.value}>{formatDate(props.value)}</span>
    ),
    creado: (props: any) => (
      <span title={props.value}>{formatDate(props.value)}</span>
    ),
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <Filters
            defaultFilters={defaultFiltersSolicitudes}
            onFilter={handleFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            defaultOpen={true}
          />
        </div>

        {/* Reservations Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <Table registros={formatedSolicitudes} renderers={componentes} />
          </div>
        </div>
        {selectedItem && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => {
                setSelectedItem(null);
              }}
            ></div>
            <div className="bg-white rounded-lg lg:max-w-[80%] overflow-hidden shadow-xl transform transition-all sm:max-w-4xl sm:w-full">
              <div className="p-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Editar Reserva
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Modifica los detalles de la reserva{" "}
                  {selectedItem?.codigo_reservacion_hotel}.
                </p>
                <button
                  type="button"
                  className="absolute right-2 top-2 p-5 text-lg font-bold"
                  onClick={() => {
                    setSelectedItem(null);
                  }}
                >
                  X
                </button>

                <div className="mt-4">
                  <ReservationForm
                    hotels={hoteles}
                    solicitud={selectedItem}
                    onClose={() => {
                      setSelectedItem(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
