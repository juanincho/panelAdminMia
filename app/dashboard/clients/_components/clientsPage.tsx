"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Search, User } from "lucide-react";

// Types
interface Company {
  id_empresa: string;
  razon_social: string;
  tipo_persona: "moral" | "fisica";
  nombre_comercial: string;
  created_at: string;
  updated_at: string;
  tiene_credito: boolean;
  monto_credito: number;
  calle: string;
  colonia: string;
  estado: string;
  municipio: string;
  codigo_postal: string;
}

// Filter Component
function TableFilters({
  searchQuery,
  personType,
  onSearchChange,
  onPersonTypeChange,
}: {
  searchQuery: string;
  personType: string;
  onSearchChange: (value: string) => void;
  onPersonTypeChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por razón social o nombre comercial..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={personType} onValueChange={onPersonTypeChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Tipo de persona" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="moral">Moral</SelectItem>
          <SelectItem value="fisica">Física</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// Table Component
function CompaniesTable({ companies }: { companies: Company[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Razón Social</TableHead>
          <TableHead>Nombre Comercial</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Crédito</TableHead>
          <TableHead className="text-right">Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map((company) => (
          <TableRow key={company.id_empresa}>
            <TableCell>
              <Link
                href={`/dashboard/clients/${company.id_empresa}`}
                className="hover:underline font-medium"
              >
                {company.razon_social}
              </Link>
            </TableCell>
            <TableCell>{company.nombre_comercial}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {company.tipo_persona === "moral" ? (
                  <Building2 className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                {company.tipo_persona.charAt(0).toUpperCase() +
                  company.tipo_persona.slice(1)}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {company.tiene_credito
                ? `$${company.monto_credito.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}`
                : "No"}
            </TableCell>
            <TableCell className="text-right">{company.estado}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// Main Page Component
export default function ClientsPage({
  companies = [],
}: {
  companies: Company[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [personType, setPersonType] = useState("all");

  // Filter logic
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      searchQuery === "" ||
      company.razon_social.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.nombre_comercial
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesType =
      personType === "all" || company.tipo_persona === personType;

    return matchesSearch && matchesType;
  });

  return (
    <Card className="max-w-[1200px] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <TableFilters
          searchQuery={searchQuery}
          personType={personType}
          onSearchChange={setSearchQuery}
          onPersonTypeChange={setPersonType}
        />
        <div className="rounded-md border">
          <CompaniesTable companies={filteredCompanies} />
        </div>
      </CardContent>
    </Card>
  );
}
