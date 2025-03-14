"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Search, MoreHorizontal, Eye, Edit } from "lucide-react";

interface BookingItem {
  id_item: number;
  total: number;
  subtotal: number;
  impuestos: {
    id_impuesto: number;
    name: string;
    total: number;
    base: number;
    rate: number;
  }[];
}

interface Booking {
  check_in: string;
  check_out: string;
  total: number;
  nombre_hotel: string;
  cadena_hotel: string;
  tipo_cuarto: string;
  numero_habitacion: string;
  noches: string;
  is_rembolsable: boolean;
  monto_penalizacion: number;
  conciliado: boolean;
  credito: boolean;
  codigo_reservacion_hotel: string;
  estado: string;
  costo_total: number;
  costo_impuestos: number;
  costo_subtotal: number;
  fecha_limite_pago: string;
  fecha_limite_cancelacion: string;
  items: BookingItem[];
  viajeros: {
    id_viajero: number;
    is_principal: boolean;
  }[];
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    check_in: "2025-04-01",
    check_out: "2025-04-03",
    total: 1500,
    nombre_hotel: "Hotel Ejemplo",
    cadena_hotel: "Cadena Ejemplo",
    tipo_cuarto: "Doble",
    numero_habitacion: "301",
    noches: "2",
    is_rembolsable: true,
    monto_penalizacion: 0,
    conciliado: false,
    credito: false,
    codigo_reservacion_hotel: "RES123",
    estado: "pending",
    costo_total: 1800,
    costo_impuestos: 300,
    costo_subtotal: 1500,
    fecha_limite_pago: "2025-03-30",
    fecha_limite_cancelacion: "2025-03-29",
    items: [],
    viajeros: [{ id_viajero: 1, is_principal: true }],
  },
  // Add more mock bookings as needed
];

export default function ReservationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Pendiente
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Completada
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-800 border-red-200"
          >
            Cancelada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.nombre_hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.codigo_reservacion_hotel
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reservaciones</h1>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por hotel o código..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hotel</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Habitación</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {booking.nombre_hotel}
                  </TableCell>
                  <TableCell>{booking.codigo_reservacion_hotel}</TableCell>
                  <TableCell>
                    {format(new Date(booking.check_in), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.check_out), "dd MMM yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell>{booking.numero_habitacion}</TableCell>
                  <TableCell>${booking.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(booking.estado)}</TableCell>
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
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
