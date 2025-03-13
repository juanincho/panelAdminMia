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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X, Plus, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Traveler, Tax } from "@/app/_types";
import { differenceInDays, parseISO } from "date-fns";

// Mock data - Replace with actual data when available
const MOCK_HOTELS = ["Hotel A", "Hotel B", "Hotel C", "Hotel D"];

interface CompanionSelectProps {
  value: string;
  onChange: (value: string) => void;
  selectedTravelers: string[];
  travelers: Traveler[];
}

interface ReservationItem {
  id: string;
  type: "night" | "extra";
  description: string;
  cost: number;
  taxes: string[];
}

interface ItemTotal {
  subtotal: number;
  taxes: {
    id: string;
    name: string;
    amount: number;
  }[];
  total: number;
}

const CompanionSelect: React.FC<CompanionSelectProps> = ({
  value,
  onChange,
  travelers,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar acompañante" />
      </SelectTrigger>
      <SelectContent>
        {travelers.map((traveler) => (
          <SelectItem key={traveler.id_viajero} value={traveler.id_viajero}>
            {`${traveler.primer_nombre} ${traveler.segundo_nombre} ${traveler.apellido_paterno} ${traveler.apellido_materno}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface TaxSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  impuestos: Tax[];
}

const TaxSelect: React.FC<TaxSelectProps> = ({
  value,
  onChange,
  impuestos,
}) => (
  <Select
    value={value[0]}
    onValueChange={(newValue) => onChange([...value, newValue])}
  >
    <SelectTrigger>
      <SelectValue placeholder="Seleccionar impuesto" />
    </SelectTrigger>
    <SelectContent>
      {impuestos.map((tax) => (
        <SelectItem key={tax.id_impuesto} value={tax.id_impuesto.toString()}>
          {tax.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  success: boolean;
  message: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  success,
  message,
}) => (
  <AlertDialog open={isOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {success ? "Operación Exitosa" : "Error"}
        </AlertDialogTitle>
        <AlertDialogDescription>{message}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction onClick={onClose}>Confirmar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

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

export function ReservationForm({
  item,
  viajeros,
  impuestos,
}: {
  item: Reservation;
  viajeros: Traveler[];
  impuestos: Tax[];
}) {
  const [formData, setFormData] = useState({
    registrationDate: new Date().toISOString().split("T")[0],
    check_in: item.check_in ? item.check_in.split("T")[0] : "",
    check_out: item.check_out ? item.check_out.split("T")[0] : "",
    hotel: "",
    reservation_code: "",
    roomType: "",
    rooms: 1,
    mainTraveler: "",
    companions: [""],
    total: item.total,
    taxes: [""],
    comments: "",
    fecha_pago_proveedor: "",
    is_credito: false,
    status: "pending",
    fecha_limite_cancelacion: "",
    fecha_limite_pago: "",
    numero_habitacion: "",
    is_rembolsable: false,
    monto_penalizacion: 0,
    costo_total: 0,
    costo_impuestos: 0,
    costo_subtotal: 0,
    cadena_hotel: "",
  });

  const [items, setItems] = useState<ReservationItem[]>([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    success: false,
    message: "",
  });

  // Calcular noches cuando cambian las fechas
  useEffect(() => {
    if (formData.check_in && formData.check_out) {
      const nights = differenceInDays(
        parseISO(formData.check_out),
        parseISO(formData.check_in)
      );

      if (nights > 0) {
        const nightItems: ReservationItem[] = Array.from(
          { length: nights },
          (_, index) => ({
            id: `night-${index}`,
            type: "night",
            description: `Noche ${index + 1}`,
            cost: formData.total / nights,
            taxes: [],
          })
        );
        setItems(nightItems);
      }
    }
  }, [formData.check_in, formData.check_out, formData.total]);

  // Calcular totales
  const calculateItemTotal = (item: ReservationItem): ItemTotal => {
    const itemTaxes = item.taxes.map((taxId) => {
      const tax = impuestos.find((t) => t.id_impuesto.toString() === taxId);
      if (!tax) return { id: taxId, name: "Unknown", amount: 0 };
      return {
        id: taxId,
        name: tax.name,
        amount: item.cost * (tax.rate / 100),
      };
    });

    const taxTotal = itemTaxes.reduce((sum, tax) => sum + tax.amount, 0);

    return {
      subtotal: item.cost,
      taxes: itemTaxes,
      total: item.cost + taxTotal,
    };
  };

  const totals = items.reduce(
    (acc, item) => {
      const itemTotal = calculateItemTotal(item);
      return {
        subtotal: acc.subtotal + itemTotal.subtotal,
        taxes: acc.taxes.concat(itemTotal.taxes),
        total: acc.total + itemTotal.total,
      };
    },
    {
      subtotal: 0,
      taxes: [] as { id: string; name: string; amount: number }[],
      total: 0,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (Math.abs(formData.total - totals.total) >= 0.1) {
        throw new Error("No concuerdan los precios");
      }
      console.log("entramos");
      const nights = differenceInDays(
        parseISO(formData.check_out),
        parseISO(formData.check_in)
      );

      const response = {
        total: totals.total,
        impuestos: totals.taxes.reduce((sum, tax) => sum + tax.amount, 0),
        is_credito: formData.is_credito,
        fecha_limite_pago: formData.fecha_limite_pago,
        booking: {
          check_in: formData.check_in,
          check_out: formData.check_out,
          total: totals.total,
          nombre_hotel: formData.hotel,
          cadena_hotel: formData.cadena_hotel,
          tipo_cuarto: formData.roomType,
          numero_habitacion: formData.numero_habitacion,
          noches: nights.toString(),
          is_rembolsable: formData.is_rembolsable,
          monto_penalizacion: formData.monto_penalizacion,
          conciliado: false,
          credito: formData.is_credito,
          codigo_reservacion_hotel: formData.reservation_code,
          estado: formData.status,
          costo_total: formData.costo_total,
          costo_impuestos: formData.costo_impuestos,
          costo_subtotal: formData.costo_subtotal,
          fecha_limite_pago: formData.fecha_limite_pago,
          fecha_limite_cancelacion: formData.fecha_limite_cancelacion,
          impuestos: totals.taxes.map((tax) => ({
            id_impuesto: parseInt(tax.id),
            name: tax.name,
            total: tax.amount,
            base: totals.subtotal,
          })),
          items,
          viajeros: [
            {
              id_viajero: parseInt(formData.mainTraveler),
              is_principal: true,
            },
            ...formData.companions.map((companion) => ({
              id_viajero: parseInt(companion),
              is_principal: false,
            })),
          ],
        },
      };
      console.log(formData);
      // console.log(items);
      console.log("Response:", response);

      setModalState({
        isOpen: true,
        success: true,
        message: "La reservación se ha guardado exitosamente",
      });
    } catch (error: any) {
      setModalState({
        isOpen: true,
        success: false,
        message:
          error.message || "Ha ocurrido un error al guardar la reservación",
      });
    }
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const addCompanion = () => {
    setFormData((prev) => ({
      ...prev,
      companions: [...prev.companions, ""],
    }));
  };

  const removeCompanion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      companions: prev.companions.filter((_, i) => i !== index),
    }));
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `extra-${Date.now()}`,
        type: "extra",
        description: "",
        cost: 0,
        taxes: [],
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ReservationItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Campos existentes */}
          <div className="space-y-2">
            <Label htmlFor="registrationDate">Fecha de registro</Label>
            <Input
              id="registrationDate"
              type="date"
              value={formData.registrationDate}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Check-in / Check-out</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={formData.check_in}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, check_in: e.target.value }))
                }
              />
              <Input
                type="date"
                value={formData.check_out}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    check_out: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hotel</Label>
            <Select
              value={formData.hotel}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, hotel: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar hotel" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_HOTELS.map((hotel) => (
                  <SelectItem key={hotel} value={hotel}>
                    {hotel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cadena hotelera</Label>
            <Input
              value={formData.cadena_hotel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cadena_hotel: e.target.value,
                }))
              }
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Código de reservación</Label>
            <Input
              value={formData.reservation_code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reservation_code: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de habitación</Label>
            <Select
              value={formData.roomType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, roomType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sencilla">Sencilla</SelectItem>
                <SelectItem value="doble">Doble</SelectItem>
                <SelectItem value="penthouse">Pent House</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Número de habitación</Label>
            <Input
              value={formData.numero_habitacion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  numero_habitacion: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Viajero principal</Label>
            <Select
              value={formData.mainTraveler}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, mainTraveler: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar viajero" />
              </SelectTrigger>
              <SelectContent>
                {viajeros.map((traveler) => (
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

          <div className="space-y-2">
            <Label>Estado de la solicitud</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nuevos campos */}
          <div className="space-y-2">
            <Label>Costo total (hotel)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.costo_total}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  costo_total: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Costo subtotal (hotel)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.costo_subtotal}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  costo_subtotal: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Costo impuestos (hotel)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.costo_impuestos}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  costo_impuestos: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Monto penalización</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.monto_penalizacion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  monto_penalizacion: parseFloat(e.target.value),
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_rembolsable"
                checked={formData.is_rembolsable}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_rembolsable: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="is_rembolsable">¿Es reembolsable?</Label>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_credito"
                checked={formData.is_credito}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_credito: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="is_credito">¿Es crédito?</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fecha pago proveedor</Label>
            <Input
              type="date"
              value={formData.fecha_pago_proveedor}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fecha_pago_proveedor: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha límite cancelación</Label>
            <Input
              type="date"
              value={formData.fecha_limite_cancelacion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fecha_limite_cancelacion: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha límite pago</Label>
            <Input
              type="date"
              value={formData.fecha_limite_pago}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  fecha_limite_pago: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Total de la reservación (cliente)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.total}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  total: parseFloat(e.target.value),
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Viajeros acompañantes</Label>
          {formData.companions.map((companion, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <CompanionSelect
                travelers={viajeros}
                value={companion}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    companions: prev.companions.map((c, i) =>
                      i === index ? value : c
                    ),
                  }))
                }
                selectedTravelers={[
                  formData.mainTraveler,
                  ...formData.companions.filter((_, i) => i !== index),
                ]}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeCompanion(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={addCompanion}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar acompañante
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Items de la reservación</Label>
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar item
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descripción</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Impuestos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const itemTotal = calculateItemTotal(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.type === "night" ? (
                        item.description
                      ) : (
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="Descripción del cargo"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.cost}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "cost",
                            parseFloat(e.target.value)
                          )
                        }
                        placeholder="Costo"
                      />
                    </TableCell>
                    <TableCell>
                      <TaxSelect
                        value={item.taxes}
                        onChange={(value) =>
                          updateItem(item.id, "taxes", value)
                        }
                        impuestos={impuestos}
                      />
                      {item.taxes.map((taxId, index) => {
                        const tax = impuestos.find(
                          (t) => t.id_impuesto.toString() === taxId
                        );
                        const taxAmount =
                          itemTotal.taxes.find((t) => t.id === taxId)?.amount ||
                          0;
                        return tax ? (
                          <div
                            key={index}
                            className="flex items-center gap-2 mt-1"
                          >
                            <span className="text-sm">
                              {tax.name} (${taxAmount.toFixed(2)})
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateItem(
                                  item.id,
                                  "taxes",
                                  item.taxes.filter((_, i) => i !== index)
                                )
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </TableCell>
                    <TableCell>${itemTotal.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell colSpan={2} className="font-bold">
                  Totales
                </TableCell>
                <TableCell>
                  {totals.taxes
                    .reduce((acc, tax) => {
                      const existingTax = acc.find((t) => t.id === tax.id);
                      if (existingTax) {
                        existingTax.amount += tax.amount;
                      } else {
                        acc.push({ ...tax });
                      }
                      return acc;
                    }, [] as typeof totals.taxes)
                    .map((tax, index) => (
                      <div key={index} className="text-sm">
                        {tax.name}: ${tax.amount.toFixed(2)}
                      </div>
                    ))}
                </TableCell>
                <TableCell className="font-bold">
                  ${totals.total.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="space-y-2">
          <Label>Comentarios</Label>
          <Textarea
            value={formData.comments}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, comments: e.target.value }))
            }
            placeholder="Agregar comentarios sobre la reserva..."
          />
        </div>

        <Button type="submit" className="w-full">
          Guardar Reserva
        </Button>
      </form>

      <StatusModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        success={modalState.success}
        message={modalState.message}
      />
    </>
  );
}
