"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { da, es } from "date-fns/locale";
import { fetchReservationsAll } from "@/services/reservas";
import Link from "next/link";
import { fetchEmpresasDatosFiscales } from "@/hooks/useFetch";

// Types
interface Reservation {
  id_servicio: string;
  created_at: string;
  is_credito: boolean | null;
  id_solicitud: string;
  confirmation_code: string;
  nombre: string;
  hotel: string;
  check_in: string;
  check_out: string;
  room: string;
  total: string;
  id_usuario_generador: string;
  id_booking: string | null;
  codigo_reservacion_hotel: string | null;
  id_pago: string;
  pendiente_por_cobrar: number;
  monto_a_credito: string;
  id_factura: string | null;
  primer_nombre: string | null;
  apellido_paterno: string | null;
}

interface FiscalData {
  id_datos_fiscales: number;
  rfc: string;
  razon_social_df: string;
  calle: string;
  colonia: string;
  estado: string;
  municipio: string;
  codigo_postal_fiscal: string;
  regimen_fiscal: string;
}

type ReservationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "all";

interface FilterOptions {
  searchTerm: string;
  statusFilter: ReservationStatus;
  dateRangeFilter: {
    startDate: Date | null;
    endDate: Date | null;
  };
  priceRangeFilter: {
    min: number | null;
    max: number | null;
  };
}

// Status Badge Component
const StatusBadge: React.FC<{ status: ReservationStatus }> = ({ status }) => {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-yellow-600" />
          Pendiente
        </span>
      );
    case "confirmed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-blue-600" />
          Confirmada
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-green-600" />
          Completada
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <span className="w-2 h-2 mr-1.5 rounded-full bg-red-600" />
          Cancelada
        </span>
      );
    default:
      return null;
  }
};

// Loader Component
const Loader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    <span className="ml-3 text-gray-700">Cargando reservaciones...</span>
  </div>
);

// Facturación Modal Component
const FacturacionModal: React.FC<{
  selectedReservations: Reservation[];
  onClose: () => void;
  onConfirm: (fiscalData: FiscalData) => void;
}> = ({ selectedReservations, onClose, onConfirm }) => {
  const [fiscalDataList, setFiscalDataList] = useState<FiscalData[]>([]);
  const [selectedFiscalData, setSelectedFiscalData] = useState<FiscalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = selectedReservations.reduce(
    (sum, res) => sum + parseFloat(res.total),
    0
  );

  useEffect(() => {
    const fetchFiscalData = async () => {
      try {
        setLoading(true);
        const data = await fetchEmpresasDatosFiscales(selectedReservations[0].id_usuario_generador)
      
        setFiscalDataList(data);
        if (data.length > 0) {
          setSelectedFiscalData(data[0]);
        }
      } catch (err) {
        setError('Error al cargar los datos fiscales');
        console.error('Error fetching fiscal data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedReservations[0].id_usuario_generador) {
      fetchFiscalData();
    }
  }, [selectedReservations[0].id_usuario_generador]);

  const handleConfirm = () => {
    if (!selectedFiscalData) {
      setError('Debes seleccionar unos datos fiscales');
      return;
    }
    onConfirm(selectedFiscalData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Facturar Reservaciones
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Cerrar</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-4">
              Estás a punto de generar una factura para las siguientes reservaciones:
            </p>

            <div className="max-h-60 overflow-y-auto border rounded-md mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hotel
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedReservations.map((reservation) => (
                    <tr key={reservation.id_servicio}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {reservation.hotel}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {reservation.codigo_reservacion_hotel || "N/A"}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Intl.NumberFormat("es-MX", {
                          style: "currency",
                          currency: "MXN",
                        }).format(parseFloat(reservation.total))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Datos Fiscales
              </h4>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Cargando datos fiscales...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              ) : fiscalDataList.length === 0 ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">No se encontraron datos fiscales registrados.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {fiscalDataList.map((data) => (
                    data.id_datos_fiscales != null && (<div 
                      key={data.id_datos_fiscales} 
                      className={`border rounded-md p-4 cursor-pointer ${selectedFiscalData?.id_datos_fiscales === data.id_datos_fiscales ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setSelectedFiscalData(data)}
                    >
                      <div className="flex justify-between">
                        <h5 className="font-medium text-gray-900">{data.razon_social_df}</h5>
                        <span className="text-sm text-gray-500">RFC: {data.rfc}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Regimen Fiscal: {data.regimen_fiscal}</p>
                      <p className="text-sm text-gray-600 mt-1">{data.estado}, {data.municipio}, {data.colonia} {data.codigo_postal_fiscal}, {data.calle}</p>
                    </div>)
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Total a facturar:
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  }).format(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedFiscalData || loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${!selectedFiscalData || loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'Cargando...' : 'Confirmar Facturación'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ReservationsMain() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    searchTerm: "",
    statusFilter: "all",
    dateRangeFilter: {
      startDate: null,
      endDate: null,
    },
    priceRangeFilter: {
      min: null,
      max: null,
    },
  });
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [localDateRange, setLocalDateRange] = useState({
    start: "",
    end: "",
  });
  const [localPriceRange, setLocalPriceRange] = useState({
    min: "",
    max: "",
  });
  const [selectedReservations, setSelectedReservations] = useState<string[]>([]);
  const [showFacturacionModal, setShowFacturacionModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchReservationsAll((data) => {
      console.log(data);
      setReservations(data);
      setLoading(false);
    }).catch((err) => {
      setError("Error al cargar las reservaciones");
      setLoading(false);
      console.error(err);
    });
  }, []);

  const getReservationStatus = (
    reservation: Reservation
  ): ReservationStatus => {
    if (reservation.pendiente_por_cobrar > 0) return "pending";
    if (reservation.id_booking) return "confirmed";
    return "completed";
  };

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(parseFloat(value));
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilterOptions((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const toggleReservationSelection = (id: string) => {
    setSelectedReservations((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReservations.length === filteredReservations.length) {
      setSelectedReservations([]);
    } else {
      setSelectedReservations(filteredReservations.map((r) => r.id_servicio));
    }
  };

  const handleFacturar = () => {
    setShowFacturacionModal(true);
  };

  const confirmFacturacion = () => {
    // Aquí iría la lógica para facturar las reservaciones seleccionadas
    console.log("Facturando reservaciones:", selectedReservations);
    setShowFacturacionModal(false);
    setSelectedReservations([]);
    // Aquí podrías agregar una llamada a tu API para procesar la facturación
  };

  const applyFilters = (reservations: Reservation[]): Reservation[] => {
    return reservations.filter((reservation) => {
      // Search term filter
      const searchLower = filterOptions.searchTerm.toLowerCase();
      const matchesSearch =
        !filterOptions.searchTerm ||
        reservation.hotel.toLowerCase().includes(searchLower) ||
        reservation.confirmation_code.toLowerCase().includes(searchLower) ||
        `${reservation.primer_nombre} ${reservation.apellido_paterno}`
          .toLowerCase()
          .includes(searchLower);

      // Status filter
      const status = getReservationStatus(reservation);
      const matchesStatus =
        filterOptions.statusFilter === "all" ||
        status === filterOptions.statusFilter;

      // Date range filter
      const checkIn = new Date(reservation.check_in);
      const checkOut = new Date(reservation.check_out);
      const matchesDateRange =
        (!filterOptions.dateRangeFilter.startDate ||
          checkIn >= filterOptions.dateRangeFilter.startDate) &&
        (!filterOptions.dateRangeFilter.endDate ||
          checkOut <= filterOptions.dateRangeFilter.endDate);

      // Price range filter
      const price = parseFloat(reservation.total);
      const matchesPriceRange =
        (filterOptions.priceRangeFilter.min === null ||
          price >= filterOptions.priceRangeFilter.min) &&
        (filterOptions.priceRangeFilter.max === null ||
          price <= filterOptions.priceRangeFilter.max);

      return (
        matchesSearch && matchesStatus && matchesDateRange && matchesPriceRange
      );
    });
  };

  const filteredReservations = applyFilters(reservations);

  return (
    <div className="min-h-screen">
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Selection Bar */}
        {selectedReservations.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-blue-800 font-medium">
                {selectedReservations.length} reservación(es) seleccionada(s)
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedReservations([])}
                className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-100"
              >
                Deseleccionar todo
              </button>
              <button
                onClick={handleFacturar}
                className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                disabled={selectedReservations.length === 0}
              >
                Facturar seleccionadas
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="space-y-4">
              {/* Basic Filters */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Buscar por hotel, código o viajero..."
                    value={filterOptions.searchTerm}
                    onChange={(e) =>
                      handleFilterChange({ searchTerm: e.target.value })
                    }
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                </div>

                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterOptions.statusFilter}
                  onChange={(e) =>
                    handleFilterChange({
                      statusFilter: e.target.value as ReservationStatus,
                    })
                  }
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="confirmed">Confirmadas</option>
                  <option value="completed">Completadas</option>
                  <option value="cancelled">Canceladas</option>
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <div>
                <button
                  onClick={() =>
                    setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)
                  }
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isAdvancedFiltersOpen
                    ? "Ocultar filtros avanzados"
                    : "Mostrar filtros avanzados"}
                  <span
                    className={`ml-2 transition-transform duration-200 ${isAdvancedFiltersOpen ? "rotate-180" : ""
                      }`}
                  >
                    ▼
                  </span>
                </button>
              </div>

              {/* Advanced Filters */}
              {isAdvancedFiltersOpen && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rango de fechas
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={localDateRange.start}
                          onChange={(e) => {
                            setLocalDateRange((prev) => ({
                              ...prev,
                              start: e.target.value,
                            }));
                            handleFilterChange({
                              dateRangeFilter: {
                                ...filterOptions.dateRangeFilter,
                                startDate: e.target.value
                                  ? new Date(e.target.value)
                                  : null,
                              },
                            });
                          }}
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={localDateRange.end}
                          onChange={(e) => {
                            setLocalDateRange((prev) => ({
                              ...prev,
                              end: e.target.value,
                            }));
                            handleFilterChange({
                              dateRangeFilter: {
                                ...filterOptions.dateRangeFilter,
                                endDate: e.target.value
                                  ? new Date(e.target.value)
                                  : null,
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rango de precio
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Mínimo"
                          value={localPriceRange.min}
                          onChange={(e) => {
                            setLocalPriceRange((prev) => ({
                              ...prev,
                              min: e.target.value,
                            }));
                            handleFilterChange({
                              priceRangeFilter: {
                                ...filterOptions.priceRangeFilter,
                                min: e.target.value
                                  ? parseFloat(e.target.value)
                                  : null,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Máximo"
                          value={localPriceRange.max}
                          onChange={(e) => {
                            setLocalPriceRange((prev) => ({
                              ...prev,
                              max: e.target.value,
                            }));
                            handleFilterChange({
                              priceRangeFilter: {
                                ...filterOptions.priceRangeFilter,
                                max: e.target.value
                                  ? parseFloat(e.target.value)
                                  : null,
                              },
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Table */}
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="p-6 bg-red-50 border-t border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative px-6 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={
                          selectedReservations.length > 0 &&
                          selectedReservations.length === filteredReservations.length
                        }
                        onChange={toggleSelectAll}
                      />
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
                      Código
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Cliente
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      id Cliente
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Check-in / Check-out
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
                      Estado de pago
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No se encontraron reservaciones con los filtros
                        actuales.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((reservation) => (
                      reservation.id_factura == null && (<tr
                        key={reservation.id_servicio}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={selectedReservations.includes(
                              reservation.id_servicio
                            )}
                            onChange={() =>
                              toggleReservationSelection(reservation.id_servicio)
                            }
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reservation.hotel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.codigo_reservacion_hotel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {reservation.id_usuario_generador}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col">
                            <span>
                              {format(
                                new Date(reservation.check_in),
                                "dd MMM yyyy",
                                { locale: es }
                              )}
                            </span>
                            <span className="text-xs text-gray-400">al</span>
                            <span>
                              {format(
                                new Date(reservation.check_out),
                                "dd MMM yyyy",
                                { locale: es }
                              )}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {calculateNights(
                                reservation.check_in,
                                reservation.check_out
                              )}{" "}
                              noche(s)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {reservation.room}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(reservation.total)}
                          {reservation.pendiente_por_cobrar > 0 && (
                            <div className="text-xs text-amber-600 mt-1">
                              Pendiente:{" "}
                              {formatCurrency(
                                reservation.pendiente_por_cobrar.toString()
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge
                            status={getReservationStatus(reservation)}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col space-y-1 text-xs">
                            <div>
                              <span className="font-medium">ID servicio:</span>{" "}
                              {reservation.id_servicio.substring(0, 8)}...
                            </div>
                            {reservation.id_booking && (
                              <div>
                                <span className="font-medium">ID booking:</span>{" "}
                                {reservation.id_booking}
                              </div>
                            )}
                            {reservation.codigo_reservacion_hotel && (
                              <div>
                                <span className="font-medium">
                                  Código hotel:
                                </span>{" "}
                                {reservation.codigo_reservacion_hotel}
                              </div>
                            )}
                            {reservation.is_credito && (
                              <div className="text-blue-600">A crédito</div>
                            )}
                          </div>
                        </td>
                      </tr>)
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Facturación Modal */}
      {showFacturacionModal && (
        <FacturacionModal
          selectedReservations={filteredReservations.filter((r) =>
            selectedReservations.includes(r.id_servicio)
          )}
          onClose={() => setShowFacturacionModal(false)}
          onConfirm={confirmFacturacion}
        />
      )}
    </div>
  );
}