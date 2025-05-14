"use client";

import { useEffect, useState } from "react";

import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, User, PencilIcon, Save, CreditCard } from "lucide-react";
import { fetchAgenteById } from "@/services/agentes";
import { createNewEmpresa, updateViajero } from "@/hooks/useDatabase";

interface Company {
  id_empresa: string;
  razon_social: string;
}

interface Agent {
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
  tiene_credito_consolidado: boolean;
  monto_credito: number;
  empresas: Company[];
}

export default function AgentDetailsCard(props) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: agent,
    isLoading,
    error,
  } = useQuery<Agent>({
    queryKey: ["agent", props.agente],
    queryFn: async ({ queryKey }) => {
      const [, agenteId] = queryKey;
      try {
        const response = await fetchAgenteById(agenteId);

        return response;
      } catch (error) {
        console.error("Error fetching agent:", error);
        throw error;
      }
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
  useEffect(() => {
    if (agent) {
      setFormData({
        ...agent,
        fecha_nacimiento: agent.fecha_nacimiento
          ? format(new Date(agent.fecha_nacimiento), "yyyy-MM-dd")
          : null,
        empresas: agent.empresas.map((company) => ({
          ...company,
          razon_social: company.razon_social || "",
        })),
      });
    }
  }, [agent]);

  useEffect(() => {
    if (agent) {
      console.log("Agent data received:", agent); // Debug
      setFormData(agent);
    }
  }, [agent]);



  const [formData, setFormData] = useState<Agent | null>(agent || null);

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

  if (error || !agent) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">
            Error al cargar los datos del agente
          </p>
          <p>Por favor, intente nuevamente más tarde.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Agent
  ) => {
    console.log("Campo cambiado:", field, e.target.value);
    setFormData((prev) => {
      if (!prev) return prev;

      // Manejo especial para campos booleanos (como checkboxes)
      // if (field === "tiene_credito_consolidado") {
      //   return {
      //     ...prev,
      //     [field]: (e as React.ChangeEvent<HTMLInputElement>).target.checked,
      //   };
      // }

      // Manejo especial para campos numéricos
      // if (field === "monto_credito") {
      //   return {
      //     ...prev,
      //     [field]: Number(e.target.value),
      //   };
      // }

      // Para todos los demás campos (strings)
      return {
        ...prev,
        [field]: e.target.value !== "" ? e.target.value : null,
      };
    });
  };

  const handleSave = async () => {
    console.log(formData);
    try {
      const responseCompany = await updateViajero(
        formData,
        formData.empresas.map((company) => company.id_empresa),
        agent.id_viajero
      );
      if (!responseCompany.success) {
        throw new Error("No se pudo actualizar al viajero");
      }
      console.log(responseCompany);
    } catch (error) {
      console.error("Error actualizando viajero", error);
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const [year, month, day] = dateString.split("T")[0].split("-");
    const date = new Date(+year, +month - 1, +day);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getFullName = (agent: Agent) => {
    return [
      agent.primer_nombre,
      agent.segundo_nombre,
      agent.apellido_paterno,
      agent.apellido_materno,
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">
          Detalles del Agente
        </CardTitle>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="icon"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <PencilIcon className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información Personal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2 flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold">{getFullName(agent)}</h2>
              <p className="text-sm text-gray-500">Correo: {agent.correo}</p>
              <p className="text-sm text-gray-500">ID: {agent.id_viajero}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero_empleado">Número de empleado</Label>
            <Input
              id="numero_empleado"
              value={formData?.numero_empleado || ""}
              onChange={(e) => handleInputChange(e, "numero_empleado")}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              value={formData?.telefono || ""}
              onChange={(e) => handleInputChange(e, "telefono")}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nacionalidad">Nacionalidad</Label>
            <select
              name="nacionalidad"
              value={formData?.nacionalidad || ""}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) => handleInputChange(e, "nacionalidad")}
              disabled={!isEditing}
            >
              <option value="">Selecciona una nacionalidad</option>
              <option value="MX">Mexicana</option>
              <option value="US">Estadounidense</option>
              <option value="CA">Canadiense</option>
              <option value="ES">Española</option>
              <option value="AR">Argentina</option>
              <option value="BR">Brasileña</option>
              <option value="FR">Francesa</option>
              <option value="DE">Alemana</option>
              <option value="IT">Italiana</option>
              <option value="JP">Japonesa</option>
              <option value="CN">China</option>
              <option value="IN">India</option>
              <option value="UK">Británica</option>
              <option value="AU">Australiana</option>
              <option value="CL">Chilena</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero_pasaporte">Número de Pasaporte</Label>
            <Input
              id="numero_pasaporte"
              value={formData?.numero_pasaporte || ""}
              onChange={(e) => handleInputChange(e, "numero_pasaporte")}
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Información de Crédito */}
        {/* <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Crédito Consolidado</h3>
            </div>
            <Switch
              checked={formData.tiene_credito_consolidado}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev!,
                  tiene_credito_consolidado: checked,
                  monto_credito: checked ? prev!.monto_credito : 0,
                }))
              }
              disabled={!isEditing}
            />
          </div>
          {Boolean(formData.tiene_credito_consolidado) && (
            <div className="space-y-2">
              <Label htmlFor="monto_credito">Monto de Crédito</Label>
              <Input
                id="monto_credito"
                type="number"
                value={formData.monto_credito}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev!,
                    monto_credito: Number(e.target.value),
                  }))
                }
                disabled={!isEditing}
                className="max-w-[200px]"
              />
            </div>
          )}
        </div> */}

        {/* Empresas Asociadas */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            Empresas Asociadas ({agent.empresas.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agent.empresas.map((company) => (
              <div
                key={company.id_empresa}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{company.razon_social}</div>
                  <div className="text-xs text-gray-500">
                    ID: {company.id_empresa}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fecha de Registro */}
        <div className="text-sm text-gray-500 pt-4 border-t">
          Fecha de registro: {formatDate(agent.created_viajero)}
        </div>
      </CardContent>
    </Card>
  );
}
