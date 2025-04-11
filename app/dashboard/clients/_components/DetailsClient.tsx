"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Building2, User, PencilIcon, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Company {
  id_empresa: string;
  razon_social: string;
  tipo_persona: "moral" | "fisica";
  nombre_comercial: string;
  created_at: string;
  updated_at: string;
  tiene_credito: number;
  monto_credito: number | null;
  calle: string | null;
  colonia: string | null;
  estado: string | null;
  municipio: string | null;
  codigo_postal: string | null;
}

interface CompanyDetailsCardProps {
  company: Company;
}

export default function CompanyDetailsCard({
  company,
}: CompanyDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Company>(company);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Company
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log(formData);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold">
          Detalles de la Empresa
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="razon_social">Razón Social</Label>
            <Input
              id="razon_social"
              value={formData.razon_social}
              onChange={(e) => handleInputChange(e, "razon_social")}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre_comercial">Nombre Comercial</Label>
            <Input
              id="nombre_comercial"
              value={formData.nombre_comercial}
              onChange={(e) => handleInputChange(e, "nombre_comercial")}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Persona</Label>
            <div className="flex items-center space-x-2">
              {formData.tipo_persona === "moral" ? (
                <Building2 className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
              <Select
                value={formData.tipo_persona}
                onValueChange={(value: "moral" | "fisica") =>
                  setFormData((prev) => ({ ...prev, tipo_persona: value }))
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moral">Moral</SelectItem>
                  <SelectItem value="fisica">Física</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Crédito</Label>
            <div className="flex items-center space-x-4">
              <Switch
                checked={formData.tiene_credito === 1}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    tiene_credito: checked ? 1 : 0,
                    monto_credito: checked ? prev.monto_credito : null,
                  }))
                }
                disabled={!isEditing}
              />
              <Input
                type="number"
                value={formData.monto_credito || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    monto_credito: e.target.value
                      ? Number(e.target.value)
                      : null,
                  }))
                }
                disabled={!isEditing || formData.tiene_credito === 0}
                placeholder="Monto de crédito"
                className="max-w-[200px]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dirección</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calle">Calle</Label>
              <Input
                id="calle"
                value={formData.calle || ""}
                onChange={(e) => handleInputChange(e, "calle")}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="colonia">Colonia</Label>
              <Input
                id="colonia"
                value={formData.colonia || ""}
                onChange={(e) => handleInputChange(e, "colonia")}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado || ""}
                onChange={(e) => handleInputChange(e, "estado")}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="municipio">Municipio</Label>
              <Input
                id="municipio"
                value={formData.municipio || ""}
                onChange={(e) => handleInputChange(e, "municipio")}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo_postal">Código Postal</Label>
              <Input
                id="codigo_postal"
                value={formData.codigo_postal || ""}
                onChange={(e) => handleInputChange(e, "codigo_postal")}
                disabled={!isEditing}
                className="max-w-[200px]"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>Creado: {formatDate(formData.created_at)}</div>
        <div>Última actualización: {formatDate(formData.updated_at)}</div>
      </CardFooter>
    </Card>
  );
}
