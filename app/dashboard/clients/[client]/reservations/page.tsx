"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { fetchReservations } from "@/services/reservas";

interface Reservation {
  id_servicio: string;
  created_at: string;
  is_credito: boolean | null;
  id_solicitud: string;
  confirmation_code: string;
  hotel: string;
  id_viajero: string;
  check_in: string;
  check_out: string;
  room: string;
  total: string;
  id_usuario_generador: string;
  id_booking: string | null;
  primer_nombre: string | null;
  apellido_paterno: string | null;
}

export default function ReservationsPage({
  params,
}: {
  params: { client: string };
}) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    try {
      fetchReservations(params.client, (data) => {
        setReservations(data);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [params.client]);

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch = reservation.hotel
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "pending")
      return matchesSearch && !reservation.id_booking;
    if (filterStatus === "completed")
      return matchesSearch && reservation.id_booking;

    return matchesSearch;
  });
  console.log(filteredReservations);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-4 p-4 py-8 bg-white rounded-sm shadow-lg">
      <div className="flex justify-between items-center mb-8 w-full">
        <h1 className="text-3xl font-bold">Reservaciones</h1>
        <Link
          href={`/dashboard/clients/${params.client}/reservations/create`}
          className="flex items-center gap-2 bg-sky-700 rounded-sm p-2 text-gray-100"
        >
          <Plus className="h-4 w-4" />
          Nueva Reservación
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por hotel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Solicitud</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Viajero</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Facturar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation) => (
              <TableRow
                key={reservation.id_solicitud}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium hover:underline">
                  <Link
                    href={`/dashboard/clients/${params.client}/reservations/edit?id=${reservation.id_solicitud}`}
                  >
                    {reservation.id_solicitud.slice(4, 12)}
                  </Link>
                </TableCell>
                <TableCell>{reservation.hotel}</TableCell>
                <TableCell>{`${reservation.primer_nombre} ${reservation.apellido_paterno}`}</TableCell>
                <TableCell>
                  {format(new Date(reservation.check_in), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(reservation.check_out), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="capitalize">{reservation.room}</TableCell>
                <TableCell>${reservation.total}</TableCell>
                <TableCell>
                  <Badge
                    variant={reservation.id_booking ? "default" : "secondary"}
                  >
                    {reservation.id_booking ? "Completada" : "Pendiente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button>Facturar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
