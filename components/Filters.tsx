import React, { use, useEffect, useState } from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { on } from "node:events";

const Filters: React.FC<{
  onFilter: (filters: TypeFilters) => void;
  defaultOpen?: boolean;
  defaultFilters?: TypeFilters;
}> = ({ onFilter, defaultOpen = false, defaultFilters }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-full mx-auto relative flex flex-col md:flex-row md:items-center md:flex-wrap justify-between gap-4 p-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Buscar por código, ID, hotel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center gap-4">
        <button
          onClick={toggleModal}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </button>
      </div>
      <FiltersModal
        onClose={toggleModal}
        isOpen={isOpen}
        onFilter={onFilter}
        defaultFilter={defaultFilters}
      />
    </div>
  );
};

const FiltersModal: React.FC<{
  onClose: () => void;
  isOpen: boolean;
  onFilter: (filters: TypeFilters) => void;
  defaultFilter?: TypeFilters;
}> = ({ onClose, isOpen, onFilter, defaultFilter }) => {
  const [filters, setFilters] = useState<TypeFilters>(defaultFilter || {});

  const handleFilter = () => {
    onFilter(filters);
    onClose();
  };

  const handleResetFilters = () => {
    const updateFilters: TypeFilters = filters;
    Object.keys(filters).forEach((key) => {
      updateFilters[key] = null;
    });
    setFilters(defaultFilter || updateFilters);
  };

  const handleDeleteFilter = (key: string) => {
    const updatedFilters = { ...filters };
    updatedFilters[key] = null;

    setFilters((prev) => ({
      ...prev,
      [key]: null,
    }));
    onFilter(updatedFilters);
  };

  return (
    <>
      <div>
        <button
          onClick={handleResetFilters}
          className="inline-flex sm:w-full items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50 "
          onClick={onClose}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[80vh] w-full max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* First row of filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {"codigo_reservacion" in filters && (
                <TextInput
                  label="Código de Reservación"
                  value={filters.codigo_reservacion || ""}
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      codigo_reservacion: value,
                    }))
                  }
                />
              )}

              {"startDate" in filters && (
                <DateInput
                  label="Fecha de inicio"
                  value={filters.startDate || ""}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, startDate: value }))
                  }
                />
              )}

              {"endDate" in filters && (
                <DateInput
                  label="Fecha de fin"
                  value={filters.endDate || ""}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, endDate: value }))
                  }
                />
              )}

              {"recordCount" in filters && (
                <Dropdown
                  label="Cantidad de Registros"
                  value={filters.recordCount}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, recordCount: value }))
                  }
                  options={[
                    "100 registros",
                    "1,000 registros",
                    "5,000 registros",
                    "10,000 registros",
                  ]}
                />
              )}

              {"client" in filters && (
                <TextInput
                  label="Nombre del cliente"
                  value={filters.client}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, client: value }))
                  }
                />
              )}

              {"traveler" in filters && (
                <TextInput
                  label="Nombre del viajero"
                  value={filters.traveler}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, traveler: value }))
                  }
                />
              )}

              {"hotel" in filters && (
                <TextInput
                  label="Hotel"
                  value={filters.hotel}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, hotel: value }))
                  }
                />
              )}

              {"status" in filters && (
                <Dropdown
                  label="Estatus de Reservación"
                  value={filters.status}
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      status: value as "Confirmada" | "Pendiente" | "Cancelada",
                    }))
                  }
                  options={["Confirmada", "Pendiente", "Cancelada"]}
                />
              )}

              {"active" in filters && (
                <Dropdown
                  label="Estatus de Reservación"
                  value={filters.active}
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      active: value as "Activo" | "Inactivo",
                    }))
                  }
                  options={["Confirmada", "Pendiente", "Cancelada"]}
                />
              )}

              {"reservationStage" in filters && (
                <Dropdown
                  label="Etapa Reservación"
                  value={filters.reservationStage}
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      reservationStage: value as
                        | "Reservado"
                        | "In house"
                        | "Check out",
                    }))
                  }
                  options={["Reservado", "In house", "Check out"]}
                />
              )}

              {"paymentMethod" in filters && (
                <Dropdown
                  label="Método de pago"
                  value={filters.paymentMethod}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, paymenthMethod: value }))
                  }
                  options={["Contado", "Credito"]}
                />
              )}
            </div>
            <div className="w-full max-w-sm mx-auto mb-4">
              <Dropdown
                label="Filtrar fecha por:"
                value={filters.filterType}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    filterType: value as
                      | "Check-in"
                      | "Check-out"
                      | "Transaccion"
                      | "Creacion",
                  }))
                }
                options={[
                  "Check-in",
                  "Check-out",
                  "Transaccion",
                  "Creacion",
                  "Actualizacion",
                ]}
              />
            </div>

            {/* Filter button */}
            <div className="flex justify-center gap-10">
              <button
                onClick={handleFilter}
                className="px-10 py-2 bg-gradient-to-r from-[#00C0FF] to-[#0080FF] text-white font-medium rounded-md hover:opacity-90 transition-opacity duration-200 shadow-md"
              >
                Filtrar
              </button>
              <button
                onClick={onClose}
                className="px-10 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-md hover:opacity-90 transition-opacity duration-200 shadow-md"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full">
        {Object.entries(filters).map(([key, value]) => {
          if (!value) return null; // Skip if value is empty
          return (
            <label
              className="text-xs font-medium text-sky-900 rounded-full bg-sky-200 px-2 pl-3 py-1 mr-2 mb-2 inline-flex items-center"
              key={key}
            >
              {key.toLowerCase()} : {value.toLowerCase()}
              <X
                onClick={() => handleDeleteFilter(key)}
                className="w-3 h-3 ml-1 cursor-pointer text-gray-500 hover:text-gray-700"
              />
            </label>
          );
        })}
      </div>
    </>
  );
};

// Custom dropdown component to reduce repetition
const Dropdown = ({
  label,
  value,
  onChange,
  options = [],
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-600">{label}</label>
    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
      >
        <option value="">Selecciona una opción</option>
        {options.length > 0 ? (
          options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))
        ) : (
          <option value={value}>{value}</option>
        )}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDown size={18} className="text-gray-500" />
      </div>
    </div>
  </div>
);

// Custom date input component
const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-600">{label}</label>
    <div className="relative">
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

// Custom text input component
const TextInput = ({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="flex flex-col space-y-1">
    {label && <label className="text-sm text-gray-600">{label}</label>}
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default Filters;
