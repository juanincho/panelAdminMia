"use client";

import { useState, Fragment, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { ReservationForm } from "@/app/dashboard/solicitudes/_components/_reservation-form";
import { Traveler, Tax } from "@/app/_types";

interface Solicitud {
  id_servicio: string;
  id_solicitud: string;
  confirmation_code: string;
  id_viajero: number;
  hotel: string;
  check_in: string;
  check_out: string;
  room: string;
  total: number;
  status: string;
  created_at: string;
}

interface GroupedSolicitudes {
  id_servicio: string;
  solicitudes: Solicitud[];
}

export default function DashboardModule({
  data,
  viajeros,
  impuestos,
}: {
  data: GroupedSolicitudes[];
  viajeros: Traveler[];
  impuestos: Tax[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Solicitud | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Group solicitudes by id_servicio
  const groupedData: GroupedSolicitudes[] = data;

  useEffect(() => {
    setExpandedGroups(
      groupedData
        .filter(
          (servicio) =>
            servicio.solicitudes.filter(
              (solicitud) => solicitud.status != "complete"
            ).length > 0
        )
        .map((servicio) => servicio.id_servicio)
    );
    console.log(groupedData);
  }, []);

  // Estadísticas
  const solicitudes = data.flatMap((servicio) => servicio.solicitudes);
  const totalReservations = solicitudes.length;
  const pendingReservations = solicitudes.filter(
    (r) => r.status === "pending"
  ).length;
  const completedReservations = solicitudes.filter(
    (r) => r.status === "complete"
  ).length;
  const uniqueCustomers = new Set(solicitudes.map((r) => r.id_viajero)).size;

  const changeMonth = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const toggleGroup = (id_servicio: string) => {
    setExpandedGroups((prev) =>
      prev.includes(id_servicio)
        ? prev.filter((id) => id !== id_servicio)
        : [...prev, id_servicio]
    );
  };

  const handleEdit = (item: Solicitud) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Cards de Resumen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Reservas
              </p>
              <h3 className="text-2xl font-bold">{totalReservations}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pendientes
              </p>
              <h3 className="text-2xl font-bold">{pendingReservations}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completadas
              </p>
              <h3 className="text-2xl font-bold">{completedReservations}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Viajeros Únicos
              </p>
              <h3 className="text-2xl font-bold">{uniqueCustomers}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla Agrupada */}
      <Card className="p-6">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID Servicio
                </th>
                <th scope="col" className="px-6 py-3">
                  Fecha de creación
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Solicitudes
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Precio de venta
                </th>
                <th scope="col" className="px-6 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {groupedData.map((group) => (
                <Fragment key={group.id_servicio}>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {group.id_servicio}
                    </td>
                    <td className="px-6 py-4">
                      {group.solicitudes[0].created_at.split("T")[0]}
                    </td>
                    <td className="px-6 py-4">{group.solicitudes.length}</td>
                    <td className="px-6 py-4">
                      $
                      {
                        group.solicitudes.reduce(
                          (sum, sol) => sum + sol.total,
                          0
                        )
                        //
                      }
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        onClick={() => toggleGroup(group.id_servicio)}
                      >
                        {expandedGroups.includes(group.id_servicio) ? (
                          <ChevronUp className="h-4 w-4 mr-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 mr-2" />
                        )}
                        {expandedGroups.includes(group.id_servicio)
                          ? "Ocultar"
                          : "Ver"}{" "}
                        Solicitudes
                      </Button>
                    </td>
                  </tr>
                  {expandedGroups.includes(group.id_servicio) && (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <div className="p-4 bg-gray-50">
                          <table className="w-full">
                            <thead className="text-xs text-gray-700">
                              <tr>
                                <th className="px-4 py-2">Código</th>
                                <th className="px-4 py-2">ID Viajero</th>
                                <th className="px-4 py-2">Hotel</th>
                                <th className="px-4 py-2">Check In</th>
                                <th className="px-4 py-2">Check Out</th>
                                <th className="px-4 py-2">Habitación</th>
                                <th className="px-4 py-2">Precio de venta</th>
                                <th className="px-4 py-2">Estado</th>
                                <th className="px-4 py-2">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.solicitudes.map((item) => (
                                <tr
                                  key={item.confirmation_code}
                                  className="border-b"
                                >
                                  <td className="px-4 py-2">
                                    {item.confirmation_code}
                                  </td>
                                  <td className="px-4 py-2">
                                    {item.id_viajero}
                                  </td>
                                  <td className="px-4 py-2">{item.hotel}</td>
                                  <td className="px-4 py-2">
                                    {format(
                                      parseISO(item.check_in),
                                      "dd/MM/yyyy",
                                      {
                                        locale: es,
                                      }
                                    )}
                                  </td>
                                  <td className="px-4 py-2">
                                    {format(
                                      parseISO(item.check_out),
                                      "dd/MM/yyyy",
                                      {
                                        locale: es,
                                      }
                                    )}
                                  </td>
                                  <td className="px-4 py-2">{item.room}</td>
                                  <td className="px-4 py-2">
                                    {/* ${item.total } */}$
                                  </td>
                                  <td className="px-4 py-2">
                                    {getStatusBadge(item.status)}
                                  </td>
                                  <td className="px-4 py-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEdit(item)}
                                    >
                                      Editar
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Edición */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Editar Reserva</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la reserva a continuación.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto pr-4 -mr-4">
            {selectedItem && (
              <ReservationForm viajeros={viajeros} item={selectedItem} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
