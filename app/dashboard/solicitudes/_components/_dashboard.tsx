"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { ReservationForm } from "./_reservation-form";
import Filters from "@/components/Filters";
import { fetchSolicitudes } from "@/services/solicitudes";
import { formatDate } from "@/helpers/utils";

const defaultFiltersSolicitudes: TypeFilters = {
  client: null,
  proveedor: null,
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
            Completada
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
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Código
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID Servicio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Viajero
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hotel
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check In
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Check Out
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Habitación
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Creado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allSolicitudes.length > 0 ? (
                  allSolicitudes.map((item, index) => (
                    <tr
                      key={item.id_solicitud}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex flex-col text-center gap-2">
                        {item.confirmation_code}
                        <span
                          className={`p-1 rounded-full text-xs font-medium ${
                            Boolean(item.pendiente_por_cobrar)
                              ? "bg-yellow-300"
                              : "bg-green-300"
                          }`}
                        >
                          {Boolean(item.pendiente_por_cobrar)
                            ? "Credito"
                            : "Contado"}{" "}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className="truncate max-w-[120px] inline-block"
                          title={item.id_servicio}
                        >
                          {item.id_servicio.substring(0, 10)}...
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className="truncate max-w-[120px] inline-block"
                          title={item.id_viajero}
                        >
                          {item.nombre_viajero || ""} {item.primer_nombre || ""}{" "}
                          {item.apellido_paterno || ""}{" "}
                          {item.primer_nombre ||
                            item.id_viajero.substring(0, 10)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.hotel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.check_in)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.check_out)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.room === "single"
                          ? "Individual"
                          : item.room === "double"
                          ? "Doble"
                          : item.room}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${parseFloat(item.total).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No se encontraron reservas con los filtros aplicados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
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

const Table = ({}) => {
  return <></>;
};
