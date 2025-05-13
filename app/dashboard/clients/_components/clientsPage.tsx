"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronDown,
  ChevronUp,
  User,
  Building2,
  Mail,
  Calendar,
  Search,
  Phone,
} from "lucide-react";
import { fetchAgentes } from "@/services/agentes";
import Link from "next/link";

interface Company {
  id_empresa: string;
  razon_social: string;
}

interface Traveler {
  created_viajero: string;
  id_agente: string;
  id_viajero: string;
  primer_nombre: string;
  segundo_nombre: string | null;
  apellido_paterno: string;
  apellido_materno: string | null;
  correo: string | null;
  genero: string | null;
  fecha_nacimiento: string | null;
  telefono: string | null;
  nacionalidad: string | null;
  numero_pasaporte: string | null;
  numero_empleado: string | null;
  empresas: Company[];
  tiene_credito_consolidado: boolean;
  monto_credito: number;
}

// Mock data for development
const mockTravelers: Traveler[] = [
  {
    created_viajero: "2025-04-07T09:47:23.000Z",
    id_agente: "4c0a8808-400a-47ad-8338-d0f1f550fb8b",
    id_viajero: "via-96c2556e-9a58-4b8c-a459-a678d4a32031",
    primer_nombre: "Juan",
    segundo_nombre: null,
    apellido_paterno: "Alberto",
    apellido_materno: null,
    correo: "sabbaghjuan7@gmail.com",
    genero: null,
    fecha_nacimiento: null,
    telefono: null,
    nacionalidad: null,
    numero_pasaporte: null,
    numero_empleado: null,
    tiene_credito_consolidado: true,
    monto_credito: 4500,
    empresas: [
      {
        id_empresa: "emp-b9d5d9b7-179d-4bb5-9f38-80c4863ff4fc",
        razon_social: "Juan Alberto",
      },
    ],
  },
  {
    created_viajero: "2025-04-09T04:15:13.000Z",
    id_agente: "ce57342e-03e9-440f-b12f-16497f23b8bb",
    id_viajero: "via-4343fa3e-efd9-4e21-8da9-c03c6f67dd66",
    primer_nombre: "Juanincho",
    segundo_nombre: null,
    apellido_paterno: "fefefs",
    apellido_materno: null,
    correo: null,
    genero: null,
    fecha_nacimiento: null,
    telefono: null,
    nacionalidad: null,
    numero_pasaporte: null,
    numero_empleado: null,
    tiene_credito_consolidado: false,
    monto_credito: 0,
    empresas: [
      {
        id_empresa: "emp-3927b7fb-043b-4047-b7dc-ec43caef338d",
        razon_social: "Noktos Alianza",
      },
      {
        id_empresa: "emp-e0816652-e9fc-4961-86d6-749dff8d09fd",
        razon_social: "dedawd dawdwadwa",
      },
      {
        id_empresa: "emp-13f76425-2c18-49cf-a4f7-8e33adf9c6af",
        razon_social: "Noktos Alianza",
      },
    ],
  },
];

export default function TravelersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTraveler, setExpandedTraveler] = useState<string | null>(null);

  const {
    data: travelers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["travelers"],
    queryFn: async () => {
      try {
        const response: Traveler[] = await fetchAgentes();
        return response;
      } catch (error) {
        console.error("Error fetching travelers:", error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-36 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">Error al cargar los viajeros</p>
          <p>Por favor, intente nuevamente más tarde.</p>
        </div>
      </div>
    );
  }

  const filteredTravelers = travelers.filter((traveler) => {
    const fullName = `${traveler.primer_nombre || ""} ${traveler.segundo_nombre || ""
      } ${traveler.apellido_paterno || ""} ${traveler.apellido_materno || ""
      }`.toLowerCase();
    const email = traveler.correo?.toLowerCase() || "";
    const telefono = traveler.telefono?.toString() || "";

    return (
      searchQuery === "" ||
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      telefono.includes(searchQuery.toLowerCase())
    );
  });

  const toggleExpand = (travelerId: string) => {
    setExpandedTraveler(expandedTraveler === travelerId ? null : travelerId);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy", { locale: es });
    } catch (e) {
      return "Fecha inválida";
    }
  };

  const getFullName = (traveler: Traveler) => {
    return [
      traveler.primer_nombre,
      traveler.segundo_nombre,
      traveler.apellido_paterno,
      traveler.apellido_materno,
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-[1200px] mx-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Viajeros</h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative w-full md:w-96 mb-4 md:mb-0">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Registro
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empresas
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefono
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credito
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTravelers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <p className="text-gray-500">
                        No se encontraron viajeros
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTravelers.map((traveler) => (
                    <>
                      <tr
                        key={traveler.id_viajero}
                        className={`hover:bg-gray-50 transition-colors ${expandedTraveler === traveler.id_viajero
                            ? "bg-blue-50"
                            : ""
                          }`}
                      >
                        <td
                          className="py-4 px-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(traveler.id_viajero);
                          }}
                        >
                          <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                            {expandedTraveler === traveler.id_viajero ? (
                              <ChevronUp className="h-5 w-5 text-blue-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            href={`/dashboard/clients/${traveler.id_agente}`}
                            className="hover:underline font-medium"
                          >
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">
                                  {getFullName(traveler)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {traveler.id_agente}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="py-4 px-4">
                          {traveler.correo ? (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 text-gray-400 mr-2" />
                              <span>{traveler.correo}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400">No disponible</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{formatDate(traveler.created_viajero)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                            <span>
                              {traveler.empresas.map((empresa, index) => (
                                <span key={index}>
                                  {empresa.razon_social} {/* Suponiendo que cada empresa tiene una propiedad 'nombre' */}
                                  {index < traveler.empresas.length - 1 && ", "}
                                </span>
                              ))}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{traveler.telefono}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            {traveler.monto_credito > 0 ? (
                              traveler.monto_credito
                            ) : (
                              <div className="p-2 rounded-full text-xs bg-red-300">
                                No hay
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>

                      {expandedTraveler === traveler.id_viajero && (
                        <tr className="bg-sky-50">
                          <td colSpan={6} className="p-0">
                            <div className="p-4 animate-[fadeIn_0.2s_ease-in-out]">
                              <h3 className="font-medium text-gray-700 mb-3">
                                Empresas asociadas
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {traveler.empresas.map((company) => (
                                  <div
                                    key={company.id_empresa}
                                    className="bg-white p-3 rounded border border-gray-200 hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-800">
                                          {company.razon_social}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          ID: {company.id_empresa}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <h3 className="font-medium text-gray-700 mb-3">
                                  Información adicional
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Género
                                    </p>
                                    <p className="font-medium">
                                      {traveler.genero || "No especificado"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Nacionalidad
                                    </p>
                                    <p className="font-medium">
                                      {traveler.nacionalidad ||
                                        "No especificada"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Teléfono
                                    </p>
                                    <p className="font-medium">
                                      {traveler.telefono || "No especificado"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Fecha de nacimiento
                                    </p>
                                    <p className="font-medium">
                                      {traveler.fecha_nacimiento
                                        ? formatDate(traveler.fecha_nacimiento)
                                        : "No especificada"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Número de pasaporte
                                    </p>
                                    <p className="font-medium">
                                      {traveler.numero_pasaporte ||
                                        "No especificado"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Número de empleado
                                    </p>
                                    <p className="font-medium">
                                      {traveler.numero_empleado ||
                                        "No especificado"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
