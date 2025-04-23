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

interface Booking {
  id_booking: string;
  id_servicio: string | null;
  check_in: string;
  check_out: string;
  total: number;
  subtotal: number;
  impuestos: number;
  estado: string;
  fecha_pago_proveedor: string | null;
  costo_total: number | null;
  costo_subtotal: number | null;
  costo_impuestos: number | null;
  fecha_limite_cancelacion: string;
  created_at: string;
  updated_at: string;
  nombre_hotel: string;
  cadena_hotel: string;
  tipo_cuarto: string;
  noches: string;
  is_rembolsable: string;
  monto_penalizacion: string;
  fecha_limite_pago: string;
}

interface ReservationsMainProps {
  bookings: Booking[];
}

export function ReservationsMain({ bookings }: ReservationsMainProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  console.log(bookings);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "en proceso":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            Pendiente
          </Badge>
        );
      case "completada":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            Completada
          </Badge>
        );
      case "cancelada":
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

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.nombre_hotel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id_booking.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.estado.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
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
                  <SelectItem value="en proceso">Pendientes</SelectItem>
                  <SelectItem value="completada">Completadas</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
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
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id_booking}>
                  <TableCell className="font-medium">
                    {booking.nombre_hotel}
                  </TableCell>
                  <TableCell>{booking.id_booking}</TableCell>
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
                  <TableCell>{booking.tipo_cuarto}</TableCell>
                  <TableCell>${booking.total}</TableCell>
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

const hotelConTarifas = {
  id_hotel: "H001",
  nombre: "Hotel Paraíso del Sol",
  id_cadena: 1,
  correo: "contacto@paraisodelsol.com",
  telefono: "555-123-4567",
  rfc: "HPS123456ABC",
  razon_social: "Hotel Paraíso del Sol S.A. de C.V.",
  direccion: "Av. del Mar 123, Zona Hotelera",
  latitud: "23.2456",
  longitud: "-106.4100",
  convenio: "Tarifas especiales para empresas Noktos",
  descripcion: "Hotel frente al mar con alberca, spa y restaurante.",
  calificacion: 4.5,
  tipo_hospedaje: "hotel",
  cuenta_de_deposito: "1234567890",
  Estado: "Sinaloa",
  Ciudad_Zona: "Mazatlán",
  NoktosQ: 3,
  NoktosQQ: 5,
  MenoresEdad: "Menores de 12 años gratis",
  PaxExtraPersona: "$300 MXN",
  DesayunoIncluido: "Sí",
  DesayunoComentarios: "Buffet de 7:00am a 10:30am",
  DesayunoPrecioPorPersona: "150",
  Transportacion: "Incluida desde el aeropuerto con previa reservación",
  TransportacionComentarios: "Reservar con 24h de anticipación",
  URLImagenHotel: "https://example.com/images/hotel1.jpg",
  URLImagenHotelQ: "https://example.com/images/hotel1_q.jpg",
  URLImagenHotelQQ: "https://example.com/images/hotel1_qq.jpg",
  Activo: 1,
  Comentarios: "Incluye acceso a gimnasio y spa",
  Id_Sepomex: 12345,
  CodigoPostal: "82000",
  Id_hotel_excel: 56789,
  Colonia: "Zona Dorada",
  tipo_negociacion: "Contrato anual",
  vigencia_convenio: "2025-12-31",
  tipo_pago: "Transferencia",
  disponibilidad_precio: "Sujeto a disponibilidad",
  contacto_convenio: "Laura Jiménez",
  contacto_recepcion: "Carlos Gómez",
  impuestos_porcentaje: 16.0,
  impuestos_moneda: 250.0,
  tarifas: [
    {
      id_tarifa: 101,
      precio: 1200.0,
      id_agente: "AG001",
      id_hotel: "H001",
      id_tipos_cuartos: 1,
      costo: 1000.0,
      incluye_desayuno: 1,
      precio_desayuno: 150.0,
      precio_noche_extra: 1100.0,
      comentario_desayuno: "Desayuno buffet incluido",
      precio_persona_extra: 300.0,
      tipo_desayuno: "Buffet",
    },
    {
      id_tarifa: 102,
      precio: 950.0,
      id_agente: "AG002",
      id_hotel: "H001",
      id_tipos_cuartos: 2,
      costo: 850.0,
      incluye_desayuno: 0,
      precio_desayuno: 0.0,
      precio_noche_extra: 900.0,
      comentario_desayuno: "No incluye desayuno",
      precio_persona_extra: 250.0,
      tipo_desayuno: "N/A",
    },
  ],
};
