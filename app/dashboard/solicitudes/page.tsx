"use client";

import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { ReservationForm } from "../../../components/structure/_reservation-form";
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
import { fetchHoteles } from "@/services/hoteles";
import Modal from "@/components/structure/Modal";
import { TypeFilters, Solicitud } from "@/types";

function App() {
  const [allSolicitudes, setAllSolicitudes] = useState<Solicitud[]>([]);
  const [selectedItem, setSelectedItem] = useState<Solicitud | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>("");
  const [hoteles, setHoteles] = useState([]);

  const handleFilter = (filters: any) => {
    fetchSolicitudes(filters, { status: "Pendiente" }, (data) => {
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

  useEffect(() => {
    fetchHoteles((data) => {
      setHoteles(data);
    });
  }, []);

  return (
    <div className="h-fit">
      <div className="max-w-7xl mx-auto space-y-3">
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
          <Table
            registros={formatedSolicitudes}
            renderers={componentes}
            defaultSort={defaultSort}
          />
        </div>
        {selectedItem && (
          <Modal
            onClose={() => {
              setSelectedItem(null);
            }}
            title="Crear reserva"
            subtitle="Modifica los detalles de la reserva y creala."
          >
            <ReservationForm
              hotels={hoteles}
              solicitud={selectedItem}
              onClose={() => {
                setSelectedItem(null);
              }}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}

const defaultSort = {
  key: "creado",
  sort: true,
};

const defaultFiltersSolicitudes: TypeFilters = {
  codigo_reservacion: null,
  client: null,
  reservante: null,
  reservationStage: null,
  hotel: null,
  startDate: new Date().toISOString().split("T")[0],
  endDate: null,
  traveler: null,
  paymentMethod: null,
  id_client: null,
  statusPagoProveedor: null,
  filterType: "Creacion",
  markup_end: null,
  markup_start: null,
};

export default App;
