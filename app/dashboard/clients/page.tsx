"use client";

import React, { useEffect, useState } from "react";
import Filters from "@/components/Filters";
import {
  formatDate,
  getCreditoBadge,
  getRoleBadge,
  getStatusCreditBadge,
} from "@/helpers/utils";
import { Table } from "@/components/Table";
import { TypeFilters } from "@/types";
import { Loader } from "@/components/atom/Loader";
import { fetchAgentes } from "@/services/agentes";

function App() {
  const [clients, setClient] = useState<Agente[]>([]);
  const [selectedItem, setSelectedItem] = useState<Agente | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<TypeFilters>(
    defaultFiltersSolicitudes
  );

  const handleEdit = (item: Agente) => {
    setSelectedItem(item);
  };

  let formatedSolicitudes = clients
    .filter((item) => true)
    .map((item) => ({
      creado: item.created_viajero,
      id: item.id_agente,
      cliente: item.nombre_agente_completo,
      correo: item.correo,
      telefono: item.telefono,
      estado_verificacion: "",
      estado_credito: Boolean(item.tiene_credito_consolidado),
      credito: item.monto_credito ? Number(item.monto_credito) : 0,
      categoria: "Administrador",
      notas_internas: "",
      vendedor: "",
    }));

  let componentes = {
    creado: (props: any) => (
      <span title={props.value}>{formatDate(props.value)}</span>
    ),
    id: (props: { value: string }) => (
      <span className="font-semibold text-sm" title={props.value}>
        {props.value.split("-").join("").slice(0, 10)}
      </span>
    ),
    cliente: ({ value }: { value: string }) => (
      <span className="relative group cursor-pointer font-semibold text-xs max-w-[200px] inline-block">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {value.toUpperCase()}
        </div>

        <div className="absolute z-10 right-0 top-full mt-1 w-64 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg hidden group-hover:block pointer-events-none whitespace-pre-wrap break-words">
          {value.toUpperCase()}
        </div>
      </span>
    ),
    estado_credito: (props) => getStatusCreditBadge(props.value),
    credito: (props: { value: number }) => getCreditoBadge(props.value),
    categoria: (props: { value: string }) => getRoleBadge(props.value),
    notas_internas: ({ value }: { value: string }) => (
      <span className="relative group cursor-pointer text-xs max-w-[150px] inline-block">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {value.toUpperCase()}
        </div>

        <div className="absolute z-10 right-0 top-full mt-1 w-64 px-3 py-2 bg-gray-800 text-white text-xs rounded shadow-lg hidden group-hover:block pointer-events-none whitespace-pre-wrap break-words">
          {value.toUpperCase()}
        </div>
      </span>
    ),
  };

  const handleFetchSolicitudes = () => {
    setLoading(true);
    fetchAgentes((data) => {
      console.log("Agentes fetched:", data);
      setClient(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    handleFetchSolicitudes();
  }, [filters]);

  return (
    <div className="h-fit">
      <div className="max-w-7xl mx-auto bg-white p-4 rounded-lg shadow">
        <div>
          <Filters
            defaultFilters={filters}
            onFilter={setFilters}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Reservations Table */}
        <div className="overflow-hidden0">
          {loading ? (
            <Loader />
          ) : (
            <Table
              registros={formatedSolicitudes}
              renderers={componentes}
              defaultSort={defaultSort}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const defaultSort = {
  key: "creado",
  sort: true,
};

const defaultFiltersSolicitudes: TypeFilters = {};

export default App;
