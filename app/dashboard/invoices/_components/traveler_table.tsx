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
import { MoreHorizontal, Eye, Edit, Trash, Download, DownloadCloud } from "lucide-react";
import type { Factura } from "@/app/_types";
import useApi from "@/hooks/useApi";

export function TravelerTable({ facturas }: { facturas: Factura[] }) {
  const [invoices, setinvoices] = useState<Factura[]>(facturas);
  const { mandarCorreo, descargarFactura } = useApi();



  const handleDownloadPDF = (obj:any) => {
    if (!obj) return;

    const linkSource = `data:application/pdf;base64,${obj.Content}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = "factura.pdf";
    downloadLink.click();
  };

  const handleDescargarFactura = async (id: string) => {
    try {
      const obj = await descargarFactura(id);
      handleDownloadPDF(obj);
    } catch (error) {
      alert("Ha ocurrido un error al descargar la factura");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha de Facturación</TableHead>
          <TableHead>ID Facturación</TableHead>
          <TableHead>Metodo de Pago</TableHead>

          <TableHead>ID Cliente</TableHead>
          <TableHead>Nombre Cliente</TableHead>

          <TableHead>RFC Factura</TableHead>
          <TableHead>Razón Social Factura</TableHead>

          <TableHead>Monto sin Impuestos</TableHead>
          <TableHead>Impuestos</TableHead>
          <TableHead>Monto con Impuestos</TableHead>

          <TableHead>Estatus Factura</TableHead>
          <TableHead>Informacion Reservación</TableHead>
          <TableHead>Comentarios</TableHead>


          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((factura) => (
          <TableRow key={factura.id_factura}>
            <TableCell>
              {new Date(factura.fecha_emision).toLocaleDateString()}
            </TableCell>
            <TableCell className="font-medium">
              {`${factura.id_facturama}`}
            </TableCell>
            <TableCell>{factura.metodo_de_pago}</TableCell>

            <TableCell className="font-medium">
              {`${factura.usuario_creador}`}
            </TableCell>
            <TableCell>{factura.nombre_agente}</TableCell>

            <TableCell>{factura.factura_rfc}</TableCell>
            <TableCell>{factura.razon_social}</TableCell>

            <TableCell>{factura.subtotal_factura}</TableCell>
            <TableCell>{factura.impuestos_factura}</TableCell>
            <TableCell>{factura.total_factura}</TableCell>


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
            <TableCell>{factura.hoteles}</TableCell>
            <TableCell></TableCell>

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
                  <DropdownMenuItem
                    onClick={() => {
                      handleDescargarFactura(factura.id_facturama || "");
                    }}>
                    <DownloadCloud className="mr-2 h-4 w-4" />
                    Descargar
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
