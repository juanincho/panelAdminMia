"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import type { Traveler } from "@/app/_types";

export function TravelerTable({ viajeros }: { viajeros: Traveler[] }) {
  const [travelers, setTravelers] = useState<Traveler[]>(viajeros);
  console.log(travelers);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Cliente</TableHead>
          <TableHead>Nombre Cliente</TableHead>
          <TableHead>Nombre Viajero</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Género</TableHead>
          <TableHead>Fecha Nacimiento</TableHead>
          <TableHead>Nacionalidad</TableHead>
          <TableHead>Estatus</TableHead>
          <TableHead>Comentarios</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {travelers.map((traveler) => (
          <TableRow key={traveler.id_viajero}>
            <TableCell>{traveler.id_agente}</TableCell>
            <TableCell>{traveler.nombre_agente}</TableCell>
            <TableCell className="font-medium">
              {`${traveler.primer_nombre} ${traveler.segundo_nombre || ""} ${traveler.apellido_paterno} ${traveler.apellido_materno || ""}`}
            </TableCell>
            <TableCell>{traveler.correo}</TableCell>
            <TableCell>{traveler.telefono}</TableCell>
            <TableCell>
              {traveler.genero === "masculino" && "Masculino"}
              {traveler.genero === "femenino" && "Femenino"}
            </TableCell>
            <TableCell>
              {new Date(traveler.fecha_nacimiento).toLocaleDateString()}
            </TableCell>
            
            <TableCell></TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  traveler.status === "active"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }
              >
                {traveler.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell>{traveler.nacionalidad}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
