"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface Reservation {
  confirmation_code: string;
  id_viajero: number;
  hotel: string;
  check_in: string;
  check_out: string;
  room: string;
  total: number;
  status: string;
}

export default function DashboardModule({ data }: { data: Reservation[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Reservation | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  console.log(data);

  // Estadísticas
  const totalReservations = data.length;
  const pendingReservations = data.filter((r) => r.status === "pending").length;
  const completedReservations = data.filter(
    (r) => r.status === "completed"
  ).length;
  const uniqueCustomers = new Set(data.map((r) => r.id_viajero)).size;

  // Función para cambiar de mes
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

  // Filtrar datos por mes actual
  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.check_in);
    return (
      itemDate.getMonth() === currentDate.getMonth() &&
      itemDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const handleEdit = (item: Reservation) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    try {
      // Aquí implementarías la lógica para guardar los cambios
      await fetch(`/api/solicitudes/${selectedItem.confirmation_code}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedItem),
      });

      setIsModalOpen(false);
      window.location.reload(); // Recargar para obtener datos actualizados
    } catch (error) {
      console.error("Error al guardar:", error);
    }
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
      </div>

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

      {/* Filtro de Mes */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeMonth("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => changeMonth("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabla */}
      <Card className="p-6">
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Código
                </th>
                <th scope="col" className="px-6 py-3">
                  ID Viajero
                </th>
                <th scope="col" className="px-6 py-3">
                  Hotel
                </th>
                <th scope="col" className="px-6 py-3">
                  Check In
                </th>
                <th scope="col" className="px-6 py-3">
                  Check Out
                </th>
                <th scope="col" className="px-6 py-3">
                  Habitación
                </th>
                <th scope="col" className="px-6 py-3">
                  Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.confirmation_code} className="bg-white border-b">
                  <td className="px-6 py-4">{item.confirmation_code}</td>
                  <td className="px-6 py-4">{item.id_viajero}</td>
                  <td className="px-6 py-4">{item.hotel}</td>
                  <td className="px-6 py-4">
                    {format(parseISO(item.check_in), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </td>
                  <td className="px-6 py-4">
                    {format(parseISO(item.check_out), "dd/MM/yyyy", {
                      locale: es,
                    })}
                  </td>
                  <td className="px-6 py-4">{item.room}</td>
                  <td className="px-6 py-4">${item.total.toFixed(2)}</td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4">
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
      </Card>

      {/* Modal de Edición */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Reserva</DialogTitle>
            <DialogDescription>
              Realiza los cambios necesarios en la reserva. Haz clic en guardar
              cuando termines.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hotel" className="text-right">
                Hotel
              </Label>
              <Input
                id="hotel"
                value={selectedItem?.hotel || ""}
                onChange={(e) =>
                  setSelectedItem(
                    selectedItem
                      ? {
                          ...selectedItem,
                          hotel: e.target.value,
                        }
                      : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Habitación
              </Label>
              <Input
                id="room"
                value={selectedItem?.room || ""}
                onChange={(e) =>
                  setSelectedItem(
                    selectedItem
                      ? {
                          ...selectedItem,
                          room: e.target.value,
                        }
                      : null
                  )
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total" className="text-right">
                Total
              </Label>
              <Input
                id="total"
                type="number"
                value={selectedItem?.total || ""}
                onChange={(e) =>
                  setSelectedItem(
                    selectedItem
                      ? {
                          ...selectedItem,
                          total: parseFloat(e.target.value),
                        }
                      : null
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSave}>
              Guardar cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
