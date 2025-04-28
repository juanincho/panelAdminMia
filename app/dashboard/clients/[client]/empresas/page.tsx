"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchEmpresasByAgente } from "@/services/agentes";
import { useParams } from "next/navigation";

// Types
interface Company {
  id_empresa: string;
  razon_social: string;
  tipo_persona: "fisica" | "moral";
  nombre_comercial: string;
  empresa_direccion: string | null;
  empresa_municipio: string | null;
  empresa_estado: string | null;
  empresa_cp: string | null;
  empresa_colonia: string | null;
  id_datos_fiscales: string | null;
  rfc: string | null;
  calle: string | null;
  colonia: string | null;
  estado: string | null;
  municipio: string | null;
  codigo_postal_fiscal: number | null;
  regimen_fiscal: string | null;
  datos_fiscales_created_at: string | null;
  datos_fiscales_updated_at: string | null;
  id_agente: string;
  empresa_agente_created_at: string;
  empresa_agente_updated_at: string;
}

interface FilterState {
  search: string;
  tipoPersona: string;
  estado: string;
}

type SortDirection = "asc" | "desc";
interface SortState {
  column: keyof Company | null;
  direction: SortDirection;
}

const createCompany = async (company: Partial<Company>): Promise<Company> => {
  // Replace with actual API call
  const response = await fetch("/api/companies", {
    method: "POST",
    body: JSON.stringify(company),
  });
  return response.json();
};

const updateCompany = async (company: Company): Promise<Company> => {
  // Replace with actual API call
  const response = await fetch(`/api/companies/${company.id_empresa}`, {
    method: "PUT",
    body: JSON.stringify(company),
  });
  return response.json();
};

const deleteCompany = async (id: string): Promise<void> => {
  // Replace with actual API call
  await fetch(`/api/companies/${id}`, {
    method: "DELETE",
  });
};

const Page = () => {
  const queryClient = useQueryClient();
  const { client } = useParams();

  // Queries and Mutations
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      try {
        const response = fetchEmpresasByAgente(client);

        return response;
      } catch (error) {
        console.error("Error fetching agent:", error);
        throw error;
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateCompany,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["companies"] }),
  });

  // State
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    tipoPersona: "",
    estado: "",
  });

  const [sort, setSort] = useState<SortState>({
    column: "razon_social",
    direction: "asc",
  });

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">(
    "view"
  );
  const [formData, setFormData] = useState<Partial<Company>>({});

  // Computed values
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch =
        !filters.search ||
        company.razon_social.toLowerCase().includes(searchTerm) ||
        company.nombre_comercial.toLowerCase().includes(searchTerm) ||
        (company.rfc?.toLowerCase().includes(searchTerm) ?? false);

      const matchesTipoPersona =
        !filters.tipoPersona || company.tipo_persona === filters.tipoPersona;

      const matchesEstado =
        !filters.estado || company.empresa_estado === filters.estado;

      return matchesSearch && matchesTipoPersona && matchesEstado;
    });
  }, [companies, filters]);

  const sortedCompanies = useMemo(() => {
    if (!sort.column) return filteredCompanies;

    return [...filteredCompanies].sort((a, b) => {
      const aValue = a[sort.column!];
      const bValue = b[sort.column!];

      if (!aValue && !bValue) return 0;
      if (!aValue) return 1;
      if (!bValue) return -1;

      const comparison = String(aValue).localeCompare(String(bValue));
      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredCompanies, sort]);

  const availableEstados = useMemo(() => {
    const estados = new Set<string>(
      companies
        .map((c) => c.empresa_estado)
        .filter((estado): estado is string => !!estado)
    );
    return Array.from(estados).sort();
  }, [companies]);

  // Handlers
  const handleSort = (column: keyof Company) => {
    setSort((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (
    mode: "view" | "edit" | "create",
    company?: Company
  ) => {
    setModalMode(mode);
    setSelectedCompany(company || null);
    setFormData(company || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompany(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modalMode === "create") {
        await createMutation.mutateAsync(formData);
      } else if (modalMode === "edit" && selectedCompany) {
        await updateMutation.mutateAsync({ ...selectedCompany, ...formData });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta empresa?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-fit bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Empresas</h1>
          <button
            onClick={() => handleOpenModal("create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Empresa
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Buscar por nombre o RFC..."
                value={filters.search}
                onChange={handleFilterChange}
                className="pl-10 w-full h-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              name="tipoPersona"
              value={filters.tipoPersona}
              onChange={handleFilterChange}
              className="h-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tipo de Persona</option>
              <option value="moral">Moral</option>
              <option value="fisica">Física</option>
            </select>

            <select
              name="estado"
              value={filters.estado}
              onChange={handleFilterChange}
              className="h-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Estado</option>
              {availableEstados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Razón Social", "Tipo", "RFC", "Estado", "Acciones"].map(
                    (header, index) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        onClick={() => {
                          const columns: (keyof Company)[] = [
                            "razon_social",
                            "tipo_persona",
                            "rfc",
                            "empresa_estado",
                          ];
                          if (index < columns.length)
                            handleSort(columns[index]);
                        }}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{header}</span>
                          {index < 4 &&
                            sort.column ===
                              [
                                "razon_social",
                                "tipo_persona",
                                "rfc",
                                "empresa_estado",
                              ][index] &&
                            (sort.direction === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </div>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCompanies.map((company) => (
                  <tr key={company.id_empresa} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {company.razon_social}
                        </div>
                        <div className="text-sm text-gray-500">
                          {company.nombre_comercial}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          company.tipo_persona === "moral"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        )}
                      >
                        {company.tipo_persona === "moral" ? "Moral" : "Física"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.rfc || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {company.empresa_estado || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenModal("view", company)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal("edit", company)}
                          className="text-blue-400 hover:text-blue-500"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id_empresa)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">
                {modalMode === "view"
                  ? "Detalles de la Empresa"
                  : modalMode === "edit"
                  ? "Editar Empresa"
                  : "Nueva Empresa"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalMode === "view" && selectedCompany ? (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Información General
                    </h3>
                    <dl className="mt-2 space-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Razón Social</dt>
                        <dd className="text-sm font-medium">
                          {selectedCompany.razon_social}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">
                          Nombre Comercial
                        </dt>
                        <dd className="text-sm font-medium">
                          {selectedCompany.nombre_comercial}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">RFC</dt>
                        <dd className="text-sm font-medium">
                          {selectedCompany.rfc || "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Dirección
                    </h3>
                    <dl className="mt-2 space-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Dirección</dt>
                        <dd className="text-sm font-medium">
                          {selectedCompany.empresa_direccion || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Estado</dt>
                        <dd className="text-sm font-medium">
                          {selectedCompany.empresa_estado || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Municipio</dt>
                        <dd className="text-sm font-medium">
                          {selectedCompany.empresa_municipio || "—"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      name="razon_social"
                      value={formData.razon_social || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          razon_social: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre Comercial
                    </label>
                    <input
                      type="text"
                      name="nombre_comercial"
                      value={formData.nombre_comercial || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_comercial: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de Persona
                    </label>
                    <select
                      name="tipo_persona"
                      value={formData.tipo_persona || "moral"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipo_persona: e.target.value as "moral" | "fisica",
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="moral">Moral</option>
                      <option value="fisica">Física</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      RFC
                    </label>
                    <input
                      type="text"
                      name="rfc"
                      value={formData.rfc || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, rfc: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Dirección
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="empresa_direccion"
                        value={formData.empresa_direccion || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            empresa_direccion: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <input
                        type="text"
                        name="empresa_estado"
                        value={formData.empresa_estado || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            empresa_estado: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Municipio
                      </label>
                      <input
                        type="text"
                        name="empresa_municipio"
                        value={formData.empresa_municipio || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            empresa_municipio: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="empresa_cp"
                        value={formData.empresa_cp || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            empresa_cp: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    {modalMode === "create" ? "Crear" : "Guardar"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
