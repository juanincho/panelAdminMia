import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Traveler, Tax } from "@/app/_types";
import { differenceInDays, parseISO } from "date-fns";
import { API_KEY } from "../../../constants/constantes";

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

interface BookingData {
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

interface ReservationData {
  total: number;
  impuestos: number;
  is_credito: boolean;
  fecha_limite_pago: string;
  booking: BookingData;
}

interface CompanionSelectProps {
  value: string;
  onChange: (value: string) => void;
  travelers: Traveler[];
}

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
}

interface CustomTax {
  id: string;
  name: string;
  rate: number;
}

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

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  success,
  message,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{success ? "Operación Exitosa" : "Error"}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose}>Aceptar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ReservationForm({
  item,
  viajeros,
  impuestos,
}: {
  item: Reservation;
  viajeros: Traveler[];
  impuestos: Tax[];
}) {
  const [customTaxes, setCustomTaxes] = useState<CustomTax[]>([]);
  const [newTaxName, setNewTaxName] = useState("");
  const [newTaxRate, setNewTaxRate] = useState("");

  const [formData, setFormData] = useState<ReservationData>({
    total: item.total,
    impuestos: 0,
    is_credito: false,
    fecha_limite_pago: new Date().toISOString().split("T")[0],
    booking: {
      check_in: item.check_in.split("T")[0],
      check_out: item.check_out.split("T")[0],
      total: item.total,
      nombre_hotel: item.hotel,
      cadena_hotel: "",
      tipo_cuarto: item.room,
      numero_habitacion: "",
      noches: "0",
      is_rembolsable: false,
      monto_penalizacion: 0,
      conciliado: false,
      credito: false,
      codigo_reservacion_hotel: "",
      estado: "pending",
      costo_total: 0,
      costo_impuestos: 0,
      costo_subtotal: 0,
      fecha_limite_pago: new Date().toISOString().split("T")[0],
      fecha_limite_cancelacion: new Date().toISOString().split("T")[0],
      items: [],
      viajeros: [
        {
          id_viajero: item.id_viajero,
          is_principal: true,
        },
      ],
    },
  });

  const [selectedTaxes, setSelectedTaxes] = useState<Tax[]>([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    if (formData.booking.check_in && formData.booking.check_out) {
      const nights = differenceInDays(
        parseISO(formData.booking.check_out),
        parseISO(formData.booking.check_in)
      );

      if (nights > 0) {
        const costPerNight = formData.total / nights;
        const newItems: BookingItem[] = Array.from(
          { length: nights },
          (_, index) => ({
            id_item: index,
            total: costPerNight,
            subtotal: costPerNight,
            impuestos: selectedTaxes.map((tax) => ({
              id_impuesto: tax.id_impuesto,
              name: tax.name,
              total: costPerNight * tax.rate,
              base: costPerNight,
              rate: tax.rate,
            })),
          })
        );

        const totalImpuestos = selectedTaxes.reduce(
          (sum, tax) => sum + formData.total * tax.rate,
          0
        );

        setFormData((prev) => ({
          ...prev,
          impuestos: totalImpuestos,
          booking: {
            ...prev.booking,
            noches: nights.toString(),
            items: newItems,
          },
        }));
      }
    }
  }, [
    formData.booking.check_in,
    formData.booking.check_out,
    formData.total,
    selectedTaxes,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let objeto = {
      ...formData,
      booking: {
        ...formData.booking,
        subtotal: formData.total * 0.84,
        impuestos: formData.total * 0.16,
        estado: "Confirmada",
      },
    };
    console.log(objeto);
    try {
      const response = await fetch("http://localhost:3001/v1/mia/reservas", {
        method: "POST",
        headers: {
          "x-api-key": API_KEY || "",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Content-type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(objeto),
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }

    console.log("Datos de la reservación:", objeto);
  };

  const addCompanion = (id_viajero: number) => {
    setFormData((prev) => ({
      ...prev,
      booking: {
        ...prev.booking,
        viajeros: [
          ...prev.booking.viajeros,
          {
            id_viajero,
            is_principal: false,
          },
        ],
      },
    }));
  };

  const removeCompanion = (id_viajero: number) => {
    setFormData((prev) => ({
      ...prev,
      booking: {
        ...prev.booking,
        viajeros: prev.booking.viajeros.filter(
          (v) => v.id_viajero !== id_viajero || v.is_principal
        ),
      },
    }));
  };

  const updateItemCost = (id_item: number, newCost: number) => {
    setFormData((prev) => {
      const updatedItems = prev.booking.items.map((item) => {
        if (item.id_item === id_item) {
          const subtotal = newCost;
          const impuestos = selectedTaxes.map((tax) => ({
            id_impuesto: tax.id_impuesto,
            name: tax.name,
            total: subtotal * tax.rate,
            base: subtotal,
            rate: tax.rate,
          }));

          const total =
            subtotal + impuestos.reduce((sum, tax) => sum + tax.total, 0);

          return {
            ...item,
            subtotal,
            total,
            impuestos,
          };
        }
        return item;
      });

      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );
      const totalImpuestos = selectedTaxes.reduce(
        (sum, tax) => sum + newTotal * tax.rate,
        0
      );

      return {
        ...prev,
        total: newTotal,
        impuestos: totalImpuestos,
        booking: {
          ...prev.booking,
          items: updatedItems,
          total: newTotal + totalImpuestos,
        },
      };
    });
  };

  const addCustomTax = () => {
    if (newTaxName && newTaxRate) {
      const newTax: CustomTax = {
        id: `custom-${Date.now()}`,
        name: newTaxName,
        rate: parseFloat(newTaxRate) / 100,
      };
      setCustomTaxes([...customTaxes, newTax]);
      setNewTaxName("");
      setNewTaxRate("");
    }
  };

  const handleTaxSelect = (tax: Tax | CustomTax) => {
    const taxToAdd = {
      id_impuesto: "id" in tax ? parseInt(tax.id) : tax.id_impuesto,
      name: tax.name,
      rate: tax.rate,
    };

    setSelectedTaxes((prev) =>
      prev.find((t) => t.id_impuesto === taxToAdd.id_impuesto)
        ? prev.filter((t) => t.id_impuesto !== taxToAdd.id_impuesto)
        : [...prev, taxToAdd as Tax]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Hotel</Label>
          <Input value={formData.booking.nombre_hotel} disabled />
        </div>

        <div>
          <Label>Tipo de habitación</Label>
          <Input value={formData.booking.tipo_cuarto} disabled />
        </div>

        <div>
          <Label>Check-in</Label>
          <Input type="date" value={formData.booking.check_in} disabled />
        </div>

        <div>
          <Label>Check-out</Label>
          <Input type="date" value={formData.booking.check_out} disabled />
        </div>

        <div>
          <Label>Número de habitación</Label>
          <Input
            value={formData.booking.numero_habitacion}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                booking: {
                  ...prev.booking,
                  numero_habitacion: e.target.value,
                },
              }))
            }
          />
        </div>

        <div>
          <Label>Código de reservación</Label>
          <Input
            value={formData.booking.codigo_reservacion_hotel}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                booking: {
                  ...prev.booking,
                  codigo_reservacion_hotel: e.target.value,
                },
              }))
            }
          />
        </div>

        <div>
          <Label>Costo total (hotel)</Label>
          <Input
            type="number"
            value={formData.booking.costo_total}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                booking: {
                  ...prev.booking,
                  costo_total: parseFloat(e.target.value),
                },
              }))
            }
          />
        </div>

        <div>
          <Label>Costo subtotal (hotel)</Label>
          <Input
            type="number"
            value={formData.booking.costo_subtotal}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                booking: {
                  ...prev.booking,
                  costo_subtotal: parseFloat(e.target.value),
                },
              }))
            }
          />
        </div>

        <div>
          <Label>Costo impuestos (hotel)</Label>
          <Input
            type="number"
            value={formData.booking.costo_impuestos}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                booking: {
                  ...prev.booking,
                  costo_impuestos: parseFloat(e.target.value),
                },
              }))
            }
          />
        </div>

        <div>
          <Label>Monto penalización</Label>
          <Input
            type="number"
            value={formData.booking.monto_penalizacion}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                booking: {
                  ...prev.booking,
                  monto_penalizacion: parseFloat(e.target.value),
                },
              }))
            }
          />
        </div>

        <div>
          <Label>Fecha límite de pago</Label>
          <Input
            type="date"
            value={formData.booking.fecha_limite_pago}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                booking: {
                  ...prev.booking,
                  fecha_limite_pago: e.target.value,
                },
              }))
            }
          />
        </div>

        <div>
          <Label>Fecha límite de cancelación</Label>
          <Input
            type="date"
            value={formData.booking.fecha_limite_cancelacion}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                booking: {
                  ...prev.booking,
                  fecha_limite_cancelacion: e.target.value,
                },
              }))
            }
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_rembolsable"
            checked={formData.booking.is_rembolsable}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                booking: {
                  ...prev.booking,
                  is_rembolsable: checked as boolean,
                },
              }))
            }
          />
          <Label htmlFor="is_rembolsable">¿Es reembolsable?</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_credito"
            checked={formData.is_credito}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                is_credito: checked as boolean,
                booking: {
                  ...prev.booking,
                  credito: checked as boolean,
                },
              }))
            }
          />
          <Label htmlFor="is_credito">¿Es crédito?</Label>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Impuestos aplicables</Label>

        <div className="flex gap-4 items-end mb-4">
          <div className="flex-1">
            <Label>Nombre del impuesto</Label>
            <Input
              value={newTaxName}
              onChange={(e) => setNewTaxName(e.target.value)}
              placeholder="Ej: IVA Especial"
            />
          </div>
          <div className="flex-1">
            <Label>Tasa (%)</Label>
            <Input
              type="number"
              value={newTaxRate}
              onChange={(e) => setNewTaxRate(e.target.value)}
              placeholder="Ej: 16"
            />
          </div>
          <Button type="button" onClick={addCustomTax}>
            Agregar
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {impuestos.map((tax) => (
            <div key={tax.id_impuesto} className="flex items-center space-x-2">
              <Checkbox
                id={`tax-${tax.id_impuesto}`}
                checked={selectedTaxes.some(
                  (t) => t.id_impuesto === tax.id_impuesto
                )}
                onCheckedChange={() => handleTaxSelect(tax)}
              />
              <Label htmlFor={`tax-${tax.id_impuesto}`}>
                {tax.name} ({tax.rate * 100}%)
              </Label>
            </div>
          ))}

          {customTaxes.map((tax) => (
            <div key={tax.id} className="flex items-center space-x-2">
              <Checkbox
                id={tax.id}
                checked={selectedTaxes.some((t) => t.name === tax.name)}
                onCheckedChange={() => handleTaxSelect(tax)}
              />
              <Label htmlFor={tax.id}>
                {tax.name} ({tax.rate * 100}%)
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCustomTaxes(customTaxes.filter((t) => t.id !== tax.id))
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Viajeros</Label>
        <div className="space-y-2">
          {formData.booking.viajeros.map((viajero) => {
            const travelerData = viajeros.find(
              (t) => t.id_viajero === viajero.id_viajero.toString()
            );
            return (
              <div key={viajero.id_viajero} className="flex items-center gap-2">
                <Input
                  value={
                    travelerData
                      ? `${travelerData.primer_nombre} ${travelerData.segundo_nombre} ${travelerData.apellido_paterno} ${travelerData.apellido_materno}`
                      : ""
                  }
                  disabled
                />
                {!viajero.is_principal && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeCompanion(viajero.id_viajero)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
          <Select onValueChange={(value) => addCompanion(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Agregar acompañante" />
            </SelectTrigger>
            <SelectContent>
              {viajeros
                .filter(
                  (t) =>
                    !formData.booking.viajeros.some(
                      (v) => v.id_viajero.toString() === t.id_viajero
                    )
                )
                .map((traveler) => (
                  <SelectItem
                    key={traveler.id_viajero}
                    value={traveler.id_viajero}
                  >
                    {`${traveler.primer_nombre} ${traveler.segundo_nombre} ${traveler.apellido_paterno} ${traveler.apellido_materno}`}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Items de la reservación</Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Subtotal</TableHead>
              {selectedTaxes.map((tax) => (
                <TableHead key={tax.id_impuesto}>
                  {tax.name} ({(tax.rate * 100).toFixed(0)}%)
                </TableHead>
              ))}
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formData.booking.items.map((item, index) => (
              <TableRow key={item.id_item}>
                <TableCell>Noche {index + 1}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.subtotal}
                    onChange={(e) =>
                      updateItemCost(item.id_item, parseFloat(e.target.value))
                    }
                  />
                </TableCell>
                {selectedTaxes.map((tax) => {
                  const itemTax = item.impuestos.find(
                    (t) => t.id_impuesto === tax.id_impuesto
                  );
                  return (
                    <TableCell key={tax.id_impuesto}>
                      ${itemTax ? itemTax.total.toFixed(2) : "0.00"}
                    </TableCell>
                  );
                })}
                <TableCell>${item.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-bold">Totales</TableCell>
              <TableCell className="font-bold">
                ${formData.total.toFixed(2)}
              </TableCell>
              {selectedTaxes.map((tax) => {
                const totalTax = formData.total * tax.rate;
                return (
                  <TableCell key={tax.id_impuesto} className="font-bold">
                    ${totalTax.toFixed(2)}
                  </TableCell>
                );
              })}
              <TableCell className="font-bold">
                ${(formData.total + formData.impuestos).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Button type="submit" className="w-full">
        Guardar Reserva
      </Button>

      <StatusModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        success={modalState.success}
        message={modalState.message}
      />
    </form>
  );
}
