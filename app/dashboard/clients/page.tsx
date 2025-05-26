"use client";

import React, { useEffect, useState } from "react";
import Filters from "@/components/Filters";
import { formatDate } from "@/helpers/utils";
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

  let formatedSolicitudes = clients.filter((item) => true).map((item) => ({}));

  let componentes = {
    creado: (props: any) => (
      <span title={props.value}>{formatDate(props.value)}</span>
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
            <Loader></Loader>
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
  sort: false,
};

const defaultFiltersSolicitudes: TypeFilters = {};

export default App;
