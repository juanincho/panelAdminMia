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
import type { Factura } from "@/app/_types";

export function TravelerTable({ facturas }: { facturas: Factura[] }) {
  const [invoices, setinvoices] = useState<Factura[]>(facturas);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha Pago</TableHead>
          <TableHead>ID Pago</TableHead>
          <TableHead>Metodo de Pago</TableHead>
          <TableHead>Detalles Pago</TableHead>
          <TableHead>Banco</TableHead>
          <TableHead>Número de Referencia</TableHead>
          <TableHead>Concepto</TableHead>
          <TableHead>ID Cliente</TableHead>
          <TableHead>Cliente</TableHead>
          
          <TableHead>ID Factura</TableHead>
          <TableHead>RFC Factura</TableHead>
          <TableHead>Razon Social Factura</TableHead>

          <TableHead>Monto sin Impuestos</TableHead>
          <TableHead>Impuestos</TableHead>
          <TableHead>Monto con Impuestos</TableHead>
          <TableHead>Información de la Reservación</TableHead>
          <TableHead>Estatus Pago</TableHead>
          <TableHead>Comentarios</TableHead>

          {/* <TableHead>Metodo de pago</TableHead>
          <TableHead>Fecha creacion</TableHead>
          <TableHead>Moneda</TableHead>
          <TableHead>Estado solicitud</TableHead> */}
          <TableHead>Acciones</TableHead>
          
          {/* <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((factura) => (
          <TableRow key={factura.id_pago}>
            <TableCell>{new Date(factura.fecha_transaccion).toLocaleDateString()}</TableCell>
            <TableCell>{factura.id_pago}</TableCell>
            <TableCell>{factura.metodo_de_pago}</TableCell>
            <TableCell>({factura.last_digits}) {factura.banco}</TableCell>
            <TableCell> </TableCell>
            <TableCell>{factura.referencia} </TableCell>
            <TableCell>{factura.concepto}</TableCell>
            <TableCell>{factura.id_agente}</TableCell>
            
            
            <TableCell className="font-medium">
              {`${factura.nombre_agente || ""}`}
            </TableCell>

            <TableCell>{factura.id_factura}</TableCell>
            <TableCell>{factura.factura_rfc}</TableCell>
            <TableCell>{factura.razon_social}</TableCell>

            <TableCell>${factura.subtotal_pago}</TableCell>
            <TableCell>${factura.impuestos_pago}</TableCell>
            <TableCell>${factura.total_pago}</TableCell>

            <TableCell></TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  factura.estado_factura === "Confirmada"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : factura.estado_factura === "Cancelada" 
                    ? "bg-red-100 text-red-800 border-red-200"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                }
              >
                {factura.estado_factura}
              </Badge>
            </TableCell>
            <TableCell></TableCell>


            {/* <TableCell className="font-medium">
              {`${factura.total_pago}`}
            </TableCell>
            
            <TableCell>{factura.metodo_de_pago}</TableCell>
            <TableCell>
              {new Date(factura.pago_created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>{factura.currency}</TableCell>
            <TableCell>{factura.status_solicitud}</TableCell> */}
            
            {/* <TableCell>
              <Badge
                variant="outline"
                className={
                  factura.estado_factura === "Confirmada"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : factura.estado_factura === "Cancelada" 
                    ? "bg-red-100 text-red-800 border-red-200"
                    : "bg-blue-100 text-blue-800 border-blue-200"
                }
              >
                {factura.estado_factura}
              </Badge>
            </TableCell> */}
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
                  {/* <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
