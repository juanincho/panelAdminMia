"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, Pencil } from "lucide-react";
import { ReservationForm } from "./_reservation-form";
import Filters from "@/components/Filters";
import { fetchSolicitudes } from "@/services/solicitudes";
import { formatDate, formatRoom } from "@/helpers/utils";
import { Table } from "@/components/Table";

const defaultFiltersSolicitudes: TypeFilters = {
  codigo_reservacion: null, //Falta editar
  client: null, //No se maneja id
  empresa: null, //Falta jalarlo
  markUp: null, //Igual falta
  reservante: null, //Aun no hay
  reservationStage: null,
  hotel: null,
  startDate: new Date().toISOString().split("T")[0],
  endDate: null,
  status: "Pendiente",
  traveler: null,
  paymentMethod: null,
  filterType: "Creacion",
};

function App({ hoteles }: { hoteles: any }) {
  const [allSolicitudes, setAllSolicitudes] = useState<Solicitud[]>([]);
  const [selectedItem, setSelectedItem] = useState<Solicitud | null>(null);

  const handleFilter = (filters: any) => {
    fetchSolicitudes(filters, (data) => {
      setAllSolicitudes(data);
    });
  };

  const handleEdit = (item: Solicitud) => {
    setSelectedItem(item);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </span>
        );
      case "complete":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Check
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  let formatedSolicitudes = allSolicitudes.map((item) => ({
    hotel: item.hotel.toUpperCase(),
    viajero: (item.nombre_viajero || item.id_viajero).toUpperCase(),
    habitacion: formatRoom(item.room),
    check_in: item.check_in,
    check_out: item.check_out,
    total: item.total,
    estado: item.status,
    creado: item.created_at,
    editar: item,
  }));

  let componentes = {
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
    total: (props: any) => (
      <span title={props.value}>${parseFloat(props.value).toFixed(2)}</span>
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
                  {selectedItem?.confirmation_code}.
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
