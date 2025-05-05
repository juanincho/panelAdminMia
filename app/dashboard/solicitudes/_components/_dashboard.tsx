"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { ReservationForm } from "./_reservation-form";

interface Traveler {
  id: string;
  name: string;
}

interface Tax {
  id: string;
  name: string;
  percentage: number;
}

interface Solicitud {
  id_solicitud: string;
  id_servicio: string;
  confirmation_code: string;
  id_viajero: string;
  hotel: string;
  check_in: string;
  check_out: string;
  room: string;
  total: string;
  status: string;
  id_usuario_generador: string;
  solicitud_total: string;
  created_at: string;
}

interface GroupedSolicitudes {
  id_servicio: string;
  solicitudes: Solicitud[];
}

function App({
  data,
  viajeros,
  impuestos,
  hoteles,
}: {
  data: GroupedSolicitudes[];
  viajeros: Traveler[];
  impuestos: Tax[];
  hoteles: any;
}) {
  const [allSolicitudes, setAllSolicitudes] = useState<Solicitud[]>([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState<Solicitud[]>(
    []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Solicitud | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "pending",
    hotel: "",
    room: "",
    checkInDateStart: "",
    checkInDateEnd: "",
    checkOutDateStart: "",
    checkOutDateEnd: "",
    createdAtStart: "",
    createdAtEnd: "",
    minTotal: "",
    maxTotal: "",
    servicioId: "",
  });

  console.log(data);

  // Extract unique values for filter dropdowns
  const [uniqueHotels, setUniqueHotels] = useState<string[]>([]);
  const [uniqueRooms, setUniqueRooms] = useState<string[]>([]);
  const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
  const [uniqueServicios, setUniqueServicios] = useState<string[]>([]);

  useEffect(() => {
    // Flatten the data structure to get all solicitudes
    const flattenedData = data.flatMap((servicio) =>
      servicio.solicitudes.map((solicitud) => ({
        ...solicitud,
        id_servicio: servicio.id_servicio,
      }))
    );

    setAllSolicitudes(flattenedData);
    setFilteredSolicitudes(flattenedData);

    // Extract unique values for filters
    setUniqueHotels([...new Set(flattenedData.map((item) => item.hotel))]);
    setUniqueRooms([...new Set(flattenedData.map((item) => item.room))]);
    setUniqueStatuses([...new Set(flattenedData.map((item) => item.status))]);
    setUniqueServicios([
      ...new Set(flattenedData.map((item) => item.id_servicio)),
    ]);
  }, [data]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, allSolicitudes]);
  useEffect(() => {
    console.log(selectedItem);
  }, [selectedItem]);

  const applyFilters = () => {
    let result = [...allSolicitudes];

    // Apply search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.confirmation_code.toLowerCase().includes(term) ||
          item.id_solicitud.toLowerCase().includes(term) ||
          item.id_servicio.toLowerCase().includes(term) ||
          item.id_viajero.toLowerCase().includes(term) ||
          item.hotel.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    // Apply hotel filter
    if (filters.hotel) {
      result = result.filter((item) => item.hotel === filters.hotel);
    }

    // Apply room filter
    if (filters.room) {
      result = result.filter((item) => item.room === filters.room);
    }

    // Apply servicio filter
    if (filters.servicioId) {
      result = result.filter((item) => item.id_servicio === filters.servicioId);
    }

    // Apply check-in date range filters
    if (filters.checkInDateStart) {
      result = result.filter(
        (item) => new Date(item.check_in) >= new Date(filters.checkInDateStart)
      );
    }

    if (filters.checkInDateEnd) {
      result = result.filter(
        (item) => new Date(item.check_in) <= new Date(filters.checkInDateEnd)
      );
    }

    // Apply check-out date range filters
    if (filters.checkOutDateStart) {
      result = result.filter(
        (item) =>
          new Date(item.check_out) >= new Date(filters.checkOutDateStart)
      );
    }

    if (filters.checkOutDateEnd) {
      result = result.filter(
        (item) => new Date(item.check_out) <= new Date(filters.checkOutDateEnd)
      );
    }

    // Apply created at date range filters
    if (filters.createdAtStart) {
      result = result.filter(
        (item) => new Date(item.created_at) >= new Date(filters.createdAtStart)
      );
    }

    if (filters.createdAtEnd) {
      result = result.filter(
        (item) => new Date(item.created_at) <= new Date(filters.createdAtEnd)
      );
    }

    // Apply total price range filters
    if (filters.minTotal) {
      result = result.filter(
        (item) => parseFloat(item.total) >= parseFloat(filters.minTotal)
      );
    }

    if (filters.maxTotal) {
      result = result.filter(
        (item) => parseFloat(item.total) <= parseFloat(filters.maxTotal)
      );
    }

    setFilteredSolicitudes(result);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({
      status: "",
      hotel: "",
      room: "",
      checkInDateStart: "",
      checkInDateEnd: "",
      checkOutDateStart: "",
      checkOutDateEnd: "",
      createdAtStart: "",
      createdAtEnd: "",
      minTotal: "",
      maxTotal: "",
      servicioId: "",
    });
  };

  const handleEdit = (item: Solicitud) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Statistics calculations
  const totalReservations = filteredSolicitudes.length;
  const pendingReservations = filteredSolicitudes.filter(
    (r) => r.status === "pending"
  ).length;
  const completedReservations = filteredSolicitudes.filter(
    (r) => r.status === "complete"
  ).length;
  const uniqueCustomers = new Set(filteredSolicitudes.map((r) => r.id_viajero))
    .size;

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("T")[0].split("-");
    const date = new Date(+year, +month - 1, +day);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Reservas
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {totalReservations}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {pendingReservations}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completadas</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {completedReservations}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Viajeros Únicos
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {uniqueCustomers}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Buscar por código, ID, hotel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Toggle Button */}
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {showFilters ? (
                  <ChevronUp className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </button>

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 pb-4 border-b border-gray-200 animate-fadeIn">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estado
                </label>
                <select
                  id="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "pending"
                        ? "Pendiente"
                        : status === "complete"
                        ? "Completada"
                        : status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="hotel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hotel
                </label>
                <select
                  id="hotel"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.hotel}
                  onChange={(e) =>
                    setFilters({ ...filters, hotel: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  {uniqueHotels.map((hotel) => (
                    <option key={hotel} value={hotel}>
                      {hotel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="room"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Habitación
                </label>
                <select
                  id="room"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.room}
                  onChange={(e) =>
                    setFilters({ ...filters, room: e.target.value })
                  }
                >
                  <option value="">Todas</option>
                  {uniqueRooms.map((room) => (
                    <option key={room} value={room}>
                      {room === "single"
                        ? "Individual"
                        : room === "double"
                        ? "Doble"
                        : room}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="servicio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ID Servicio
                </label>
                <select
                  id="servicio"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.servicioId}
                  onChange={(e) =>
                    setFilters({ ...filters, servicioId: e.target.value })
                  }
                >
                  <option value="">Todos</option>
                  {uniqueServicios.map((id) => (
                    <option key={id} value={id}>
                      {id.substring(0, 15)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="checkin-start"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Check-in desde
                </label>
                <input
                  type="date"
                  id="checkin-start"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.checkInDateStart}
                  onChange={(e) =>
                    setFilters({ ...filters, checkInDateStart: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="checkin-end"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Check-in hasta
                </label>
                <input
                  type="date"
                  id="checkin-end"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.checkInDateEnd}
                  onChange={(e) =>
                    setFilters({ ...filters, checkInDateEnd: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-start"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Check-out desde
                </label>
                <input
                  type="date"
                  id="checkout-start"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.checkOutDateStart}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      checkOutDateStart: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-end"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Check-out hasta
                </label>
                <input
                  type="date"
                  id="checkout-end"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.checkOutDateEnd}
                  onChange={(e) =>
                    setFilters({ ...filters, checkOutDateEnd: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="min-total"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Precio mínimo
                </label>
                <input
                  type="number"
                  id="min-total"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  placeholder="0"
                  min="0"
                  value={filters.minTotal}
                  onChange={(e) =>
                    setFilters({ ...filters, minTotal: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="max-total"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Precio máximo
                </label>
                <input
                  type="number"
                  id="max-total"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  placeholder="10000"
                  min="0"
                  value={filters.maxTotal}
                  onChange={(e) =>
                    setFilters({ ...filters, maxTotal: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="created-start"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Creado desde
                </label>
                <input
                  type="date"
                  id="created-start"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.createdAtStart}
                  onChange={(e) =>
                    setFilters({ ...filters, createdAtStart: e.target.value })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="created-end"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Creado hasta
                </label>
                <input
                  type="date"
                  id="created-end"
                  className="mt-1 block w-full pl-3 pr-3 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filters.createdAtEnd}
                  onChange={(e) =>
                    setFilters({ ...filters, createdAtEnd: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          {/* Applied filters summary */}
          {Object.values(filters).some((value) => value !== "") && (
            <div className="flex flex-wrap gap-2 mt-4">
              {filters.status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Estado:{" "}
                  {filters.status === "pending"
                    ? "Pendiente"
                    : filters.status === "complete"
                    ? "Completada"
                    : filters.status}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, status: "" })}
                  />
                </span>
              )}

              {filters.hotel && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Hotel: {filters.hotel}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, hotel: "" })}
                  />
                </span>
              )}

              {filters.room && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Habitación:{" "}
                  {filters.room === "single"
                    ? "Individual"
                    : filters.room === "double"
                    ? "Doble"
                    : filters.room}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, room: "" })}
                  />
                </span>
              )}

              {filters.servicioId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ID Servicio: {filters.servicioId.substring(4, 14)}...
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => setFilters({ ...filters, servicioId: "" })}
                  />
                </span>
              )}

              {(filters.checkInDateStart || filters.checkInDateEnd) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Check-in:{" "}
                  {filters.checkInDateStart
                    ? formatDate(filters.checkInDateStart)
                    : ""}
                  {filters.checkInDateStart && filters.checkInDateEnd
                    ? " - "
                    : ""}
                  {filters.checkInDateEnd
                    ? formatDate(filters.checkInDateEnd)
                    : ""}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        checkInDateStart: "",
                        checkInDateEnd: "",
                      })
                    }
                  />
                </span>
              )}

              {(filters.checkOutDateStart || filters.checkOutDateEnd) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Check-out:{" "}
                  {filters.checkOutDateStart
                    ? formatDate(filters.checkOutDateStart)
                    : ""}
                  {filters.checkOutDateStart && filters.checkOutDateEnd
                    ? " - "
                    : ""}
                  {filters.checkOutDateEnd
                    ? formatDate(filters.checkOutDateEnd)
                    : ""}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        checkOutDateStart: "",
                        checkOutDateEnd: "",
                      })
                    }
                  />
                </span>
              )}

              {(filters.minTotal || filters.maxTotal) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Precio: {filters.minTotal ? `$${filters.minTotal}` : "$0"}
                  {" - "}
                  {filters.maxTotal ? `$${filters.maxTotal}` : "Sin límite"}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setFilters({ ...filters, minTotal: "", maxTotal: "" })
                    }
                  />
                </span>
              )}
            </div>
          )}
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
                {filteredSolicitudes.length > 0 ? (
                  filteredSolicitudes.map((item, index) => (
                    <tr
                      key={item.id_solicitud}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex flex-col text-center gap-2">
                        {item.confirmation_code}
                        <span
                          className={`p-1 rounded-full text-xs font-medium ${
                            item.pendiente_por_cobrar > 0
                              ? "bg-yellow-300"
                              : "bg-green-300"
                          }`}
                        >
                          {item.pendiente_por_cobrar > 0
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
                          {item.primer_nombre || ""}{" "}
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

          {/* Pagination Placeholder - Could be implemented if needed */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando{" "}
                  <span className="font-medium">
                    {filteredSolicitudes.length}
                  </span>{" "}
                  resultados
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => {
                setSelectedItem(null);
                setIsModalOpen(false);
              }}
            ></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-4xl sm:w-full">
              <div className="p-6">
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
                    setIsModalOpen(false);
                  }}
                >
                  X
                </button>

                <div className="mt-4">
                  {selectedItem && (
                    <ReservationForm
                      hotels={hoteles}
                      solicitud={selectedItem}
                    />
                  )}
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
