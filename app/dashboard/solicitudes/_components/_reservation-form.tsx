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
      subtotal: item.cost - taxTotal,
      taxes: itemTaxes,
      total: item.cost,
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
      // Validar que el total coincida
      if (Math.abs(totals.total - formData.total) > 0.01) {
        throw new Error(
          `El total de los items (${totals.total.toFixed(
            2
          )}) no coincide con el total de la reservación (${formData.total.toFixed(
            2
          )})`
        );
      }

      console.log("Form Data:", formData);
      console.log("Items:", items);
      console.log("Totals:", totals);

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
    if (modalState.success) {
      setFormData({
        registrationDate: new Date().toISOString().split("T")[0],
        check_in: "",
        check_out: "",
        hotel: "",
        reservation_code: "",
        roomType: "",
        rooms: 1,
        mainTraveler: "",
        companions: [""],
        total: 0,
        taxes: [],
        comments: "",
        fecha_pago_proveedor: "",
        is_credito: false,
        status: "pending",
        fecha_limite_cancelacion: "",
        fecha_limite_pago: "",
      });
    }
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
            <Label>Número de habitaciones</Label>
            <Input
              type="number"
              min="1"
              value={formData.rooms}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rooms: parseInt(e.target.value),
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
            <Label>Total de la reservación</Label>
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
