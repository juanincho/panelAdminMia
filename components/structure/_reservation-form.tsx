import React, { useState, useEffect } from "react";
import { differenceInDays, parseISO, format } from "date-fns";
import {
  X,
  Plus,
  Building2,
  Calendar,
  CreditCard,
  Check,
  Edit,
} from "lucide-react";

// Mock imports for UI components (replace with actual imports)
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
import { DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchCreateReserva,
  fetchCreateReservaFromSolicitud,
} from "@/services/reservas";
import { API_KEY } from "@/services/constant";
import {
  Hotel,
  NightCost,
  PaymentMethod,
  Traveler,
} from "@/app/_types/reservas";
import {
  ComboBox,
  DateInput,
  Dropdown,
  DropdownValues,
  NumberInput,
  TextInput,
} from "@/components/atom/Input";
import { fetchViajerosFromAgent } from "@/services/viajeros";
import { Viajero } from "@/types";

interface ReservationFormProps {
  solicitud: Solicitud;
  hotels: Hotel[];
  onClose: () => void;
}

const DEFAULT_TAXES = [
  {
    id: 1,
    selected: false,
    descripcion: "IVA (16%)",
    name: "IVA",
    rate: 0.16,
    mount: 0,
  },
  {
    id: 2,
    selected: false,
    descripcion: "ISH (3%)",
    name: "ISH",
    rate: 0.03,
    mount: 0,
  },
  {
    id: 3,
    selected: false,
    descripcion: "Saneamiento ($32)",
    name: "Saneamiento",
    rate: 0,
    mount: 32,
  },
];

interface ReservaForm {
  codigo_reservacion_hotel?: string;
  hotel: { name: string; content?: Hotel };
  habitacion: string;
  check_in: string;
  check_out: string;
  viajero?: Viajero;
  estado_reserva: "Confirmada" | "En proceso" | "Cancelada";
  comments: string;
  proveedor: {
    total: number | null;
  };
}

export function ReservationForm({
  solicitud,
  hotels,
  onClose,
}: ReservationFormProps) {
  const [form, setData] = useState<ReservaForm>({
    hotel: {
      name: solicitud.hotel || "",
      content: hotels.filter((item) => item.nombre_hotel == solicitud.hotel)[0],
    },
    habitacion: updateRoom(solicitud.room) || "",
    check_in: solicitud.check_in.split("T")[0] || "",
    check_out: solicitud.check_out.split("T")[0] || "",
    codigo_reservacion_hotel: "",
    viajero: {
      nombre_completo: "",
    },
    estado_reserva: "Confirmada",
    comments: "",
    proveedor: {
      total: null,
    },
  });
  const [habitaciones, setHabitaciones] = useState(
    hotels.filter((item) => item.nombre_hotel == solicitud.hotel)[0]
      .tipos_cuartos
  );
  const [travelers, setTravelers] = useState<Viajero[]>([]);

  console.log(hotels);

  const [activeTab, setActiveTab] = useState("cliente");
  const [selectedHotel, setSelectedHotel] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedTraveler, setSelectedTraveler] = useState<string>("");
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [totalSalePrice, setTotalSalePrice] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalCostWithTaxes, setTotalCostWithTaxes] = useState<number>(0);
  const [nights, setNights] = useState<NightCost[]>([]);
  const [enabledTaxes, setEnabledTaxes] = useState(DEFAULT_TAXES);
  const [customTaxes, setCustomTaxes] = useState<
    { name: string; rate: number }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "spei",
    paymentDate: format(new Date(), "yyyy-MM-dd"),
    comments: "",
  });

  const [originalHotel, setOriginalHotel] = useState<string>("");

  const selectedHotelData = hotels.find((h) => h.id_hotel === selectedHotel);
  const selectedRoomData = selectedHotelData?.tipos_cuartos.find(
    (r) => r.id_tipo_cuarto.toString() === selectedRoom
  );

  /*ESTE SE QUITA, NO AFECTA */
  useEffect(() => {
    console.log(form);
  }, [form]);

  useEffect(() => {
    try {
      fetchViajerosFromAgent(solicitud.id_agente, (data) => {
        const viajeroFiltrado = data.filter(
          (viajero) => viajero.id_viajero == solicitud.id_viajero
        );
        if (viajeroFiltrado.length > 0) {
          setData((prev) => ({ ...prev, viajero: viajeroFiltrado[0] }));
        }
        setTravelers(data);
      });
    } catch (error) {
      console.log(error);
      setTravelers([]);
    }
  }, []);

  // Initialize form with solicitud data
  useEffect(() => {
    if (solicitud) {
      // Store original hotel name
      setOriginalHotel(solicitud.hotel);

      // Find matching hotel in hotels array if possible
      const matchingHotel = hotels.find(
        (h) => h.nombre_hotel === solicitud.hotel
      );
      if (matchingHotel) {
        setSelectedHotel(matchingHotel.id_hotel);

        // Find matching room if possible
        const matchingRoom = matchingHotel.tipos_cuartos.find(
          (r) => r.nombre_tipo_cuarto === solicitud.room
        );
        if (matchingRoom) {
          setSelectedRoom(matchingRoom.id_tipo_cuarto.toString());
        }
      }

      // Set other form values from solicitud
      setSelectedTraveler(solicitud.id_viajero.toString());
      setCheckIn(solicitud.check_in.split("T")[0]);
      setCheckOut(solicitud.check_out.split("T")[0]);
      setTotalSalePrice(Number(solicitud.total));

      // Set confirmation code if available
    }
  }, [solicitud, hotels]);

  // Calculate nights and costs when relevant data changes
  useEffect(() => {
    if (checkIn && checkOut && selectedRoomData) {
      const nightsCount = differenceInDays(
        parseISO(checkOut),
        parseISO(checkIn)
      );
      const roomPrice = parseFloat(selectedRoomData.precio);
      setTotalSalePrice(roomPrice * nightsCount);
      calculateNightlyCosts(nightsCount, roomPrice);
    }
  }, [checkIn, checkOut, selectedRoomData, enabledTaxes]);

  // Recalculate when taxes change
  useEffect(() => {
    calculateNightlyCosts(nights.length, totalCost);
  }, [enabledTaxes]);

  const calculateNightlyCosts = (nightsCount: number, baseCost: number) => {
    if (nightsCount > 0 && baseCost > 0) {
      const taxFilter = enabledTaxes.filter((tax) => tax.selected);
      const newNights: NightCost[] = Array.from(
        { length: nightsCount },
        (_, index) => ({
          night: index + 1,
          baseCost: baseCost / nightsCount,
          taxes: taxFilter.map(({ id, name, rate, mount }) => ({
            id_impuesto: id,
            name,
            rate,
            mount,
            base: baseCost / nightsCount,
            total: (baseCost / nightsCount) * rate + mount,
          })),
          totalWithTaxes: taxFilter.reduce(
            (prev, current) =>
              prev + ((baseCost / nightsCount) * current.rate + current.mount),
            baseCost / nightsCount
          ),
        })
      );

      setNights(newNights);
      const totalWithTaxes = newNights.reduce(
        (sum, night) => sum + night.totalWithTaxes,
        0
      );
      setTotalCost(baseCost);
      setTotalCostWithTaxes(totalWithTaxes);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(selectedHotelData);

    const nightsCount = differenceInDays(parseISO(checkOut), parseISO(checkIn));
    const reservation = {
      solicitud: {
        id_solicitud: solicitud.id_solicitud, // Preserve original ID
        id_servicio: solicitud.id_servicio, // Preserve original service ID
        confirmation_code: hotelReservationCode || solicitud.confirmation_code,
        id_viajero: selectedTraveler,
        hotel: selectedHotelData?.nombre_hotel || originalHotel,
        check_in: checkIn,
        check_out: checkOut,
        room: selectedRoomData?.nombre_tipo_cuarto || solicitud.room,
        total: totalSalePrice,
        status:
          reservationStatus === "Confirmada" ? "complete" : reservationStatus,
        created_at: solicitud.created_at, // Preserve original creation date
      },
      estado: reservationStatus,
      check_in: checkIn,
      check_out: checkOut,
      id_viajero: selectedTraveler,
      id_hotel: selectedHotelData.id_hotel,
      nombre_hotel: selectedHotelData?.nombre_hotel || originalHotel,
      total: totalSalePrice,
      subtotal: totalSalePrice / 1.16,
      impuestos: totalSalePrice - totalSalePrice / 1.16,
      tipo_cuarto: selectedRoomData?.nombre_tipo_cuarto || solicitud.room,
      noches: nightsCount,
      costo_subtotal: totalCost,
      costo_total: totalCostWithTaxes,
      comments: comments,
      costo_impuestos: totalCostWithTaxes - totalCost,
      codigo_reservacion_hotel:
        hotelReservationCode || solicitud.confirmation_code,
      id_usuario_generador: solicitud.id_usuario_generador,
      items: nights.map((night) => ({
        total: totalSalePrice / nightsCount,
        subtotal: (totalSalePrice / nightsCount) * 0.84,
        impuestos: (totalSalePrice / nightsCount) * 0.16,
        costo_total: night.totalWithTaxes,
        costo_subtotal: night.baseCost,
        costo_impuestos: night.totalWithTaxes - night.baseCost,
        costo_iva: night.taxes.find((tax) => tax.name === "IVA")?.total || 0,
        taxes: night.taxes,
      })),
    };

    // console.log(reservation);
    try {
      const response = await fetchCreateReservaFromSolicitud(reservation);
      alert("Actualizado con éxito");
      onClose();
      // console.log(response);
    } catch (error) {
      alert("Hubo un error");
    }
  };

  const addCustomTax = () => {
    setCustomTaxes([...customTaxes, { name: "", rate: 0 }]);
  };

  const removeCustomTax = (index: number) => {
    setCustomTaxes(customTaxes.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 mx-5 overflow-y-auto rounded-md bg-white p-4"
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="shadow-none"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="proveedor">Proveedor</TabsTrigger>
          <TabsTrigger value="pago">Pago a Proveedor</TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <ComboBox
                label={`Hotel`}
                sublabel={`(${solicitud.hotel})`}
                onChange={(value) => {
                  if ("tipos_cuartos" in value.content) {
                    setHabitaciones((value.content as Hotel).tipos_cuartos);
                  }
                  setData((prev) => ({
                    ...prev,
                    hotel: {
                      name: value.name,
                      content: value.content as Hotel,
                    },
                  }));
                }}
                value={{
                  name: form.hotel.name,
                  content: form.hotel.content as Hotel,
                }}
                options={hotels.map((item) => ({
                  name: item.nombre_hotel,
                  content: item,
                }))}
                placeholderOption={solicitud.hotel}
              />
              <DropdownValues
                label="Tipo de Habitación"
                onChange={(value) => {
                  setData((prev) => ({ ...prev, habitacion: value.value }));
                }}
                options={
                  habitaciones.map((item) => ({
                    value: item.nombre_tipo_cuarto,
                    label: `${item.nombre_tipo_cuarto} $${item.precio}`,
                  })) || []
                }
                value={form.habitacion}
              />
            </div>
            <div className="space-y-2">
              <Dropdown
                label="Estado de la reserva"
                onChange={(value) => {
                  setData((prev) => ({
                    ...prev,
                    estado_reserva: value as
                      | "Confirmada"
                      | "Cancelada"
                      | "En proceso",
                  }));
                }}
                options={["Confirmada", "Cancelada", "En proceso"]}
                value={form.estado_reserva}
              />
              <TextInput
                onChange={(value) => {
                  setData((prev) => ({
                    ...prev,
                    codigo_reservacion_hotel: value,
                  }));
                }}
                value={form.codigo_reservacion_hotel}
                label="Codigo reservación de hotel"
                placeholder="Ingresa el codigo de reservación del hotel"
              />
            </div>

            <div className="space-y-2">
              <DateInput
                label="Check-in"
                value={form.check_in}
                onChange={(value) => {
                  setData((prev) => ({ ...prev, check_in: value }));
                }}
              />
              <DateInput
                label="Check-out"
                value={form.check_out}
                onChange={(value) => {
                  setData((prev) => ({ ...prev, check_out: value }));
                }}
              />
            </div>

            <div className="space-y-2">
              <ComboBox
                label={`Viajeros`}
                sublabel={`(${
                  solicitud.nombre_viajero || solicitud.nombre_viajero_completo
                } - ${solicitud.id_viajero})`}
                onChange={(value) => {
                  setData((prev) => ({
                    ...prev,
                    viajero: value.content as Viajero,
                  }));
                }}
                value={{
                  name: form.viajero.nombre_completo || "",
                  content: form.viajero || null,
                }}
                options={travelers.map((item) => ({
                  name: item.nombre_completo,
                  content: item,
                }))}
              />
              <div className="space-y-2">
                <Label>Comentarios de la reserva</Label>
                <Textarea
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, comments: e.target.value }))
                  }
                  value={form.comments}
                ></Textarea>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="proveedor" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-4">
                <NumberInput
                  value={form.proveedor.total}
                  onChange={(value) => {
                    setData((prev) => ({
                      ...prev,
                      proveedor: { ...prev.proveedor, total: Number(value) },
                    }));
                  }}
                  label="Costo total"
                />
              </div>

              <NumberInput
                value={form.proveedor.total}
                onChange={(value) => {
                  setData((prev) => ({
                    ...prev,
                    proveedor: { ...prev.proveedor, total: Number(value) },
                  }));
                }}
                label="Costo total"
              />
            </div>

            {customTaxes.map((tax, index) => (
              <div key={index} className="flex gap-4 items-center">
                <Input
                  placeholder="Nombre del impuesto"
                  value={tax.name}
                  onChange={(e) => {
                    const newTaxes = [...customTaxes];
                    newTaxes[index].name = e.target.value;
                    setCustomTaxes(newTaxes);
                  }}
                />
                <Input
                  type="number"
                  placeholder="Tasa (%)"
                  value={tax.rate}
                  onChange={(e) => {
                    const newTaxes = [...customTaxes];
                    newTaxes[index].rate = Number(e.target.value) / 100;
                    setCustomTaxes(newTaxes);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeCustomTax(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {nights.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Noche</TableHead>
                    <TableHead>Costo Base</TableHead>
                    {enabledTaxes
                      .filter((tax) => tax.selected)
                      .map((tax) => (
                        <TableHead key={tax.id}>{tax.descripcion}</TableHead>
                      ))}
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nights.map((night) => (
                    <TableRow key={night.night}>
                      <TableCell>{night.night}</TableCell>
                      <TableCell>${night.baseCost}</TableCell>
                      {night.taxes.map((tax) => (
                        <TableCell key={tax.id_impuesto}>
                          ${tax.total}
                        </TableCell>
                      ))}
                      <TableCell>${night.totalWithTaxes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Venta Total:</span>
                <span>${totalSalePrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Costo Total:</span>
                <span>${totalCostWithTaxes}</span>
              </div>
              {totalCost > 0 && (
                <div className="flex justify-between font-medium">
                  <span>Markup:</span>
                  <span>
                    {((totalSalePrice - totalCostWithTaxes) /
                      totalCostWithTaxes) *
                      100}
                    %
                  </span>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pago" className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Método de Pago</Label>
              <Select
                value={paymentMethod.type}
                onValueChange={(value: "spei" | "credit_card" | "balance") =>
                  setPaymentMethod({ ...paymentMethod, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spei">SPEI</SelectItem>
                  <SelectItem value="credit_card">
                    Tarjeta de Crédito
                  </SelectItem>
                  <SelectItem value="balance">Saldo a Favor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Pago</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-8"
                  value={paymentMethod.paymentDate}
                  onChange={(e) =>
                    setPaymentMethod({
                      ...paymentMethod,
                      paymentDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {paymentMethod.type === "credit_card" && (
              <div className="space-y-2">
                <Label>Últimos 4 dígitos</Label>
                <div className="relative">
                  <CreditCard className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    maxLength={4}
                    value={paymentMethod.cardLastDigits}
                    onChange={(e) =>
                      setPaymentMethod({
                        ...paymentMethod,
                        cardLastDigits: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Comentarios</Label>
              <Textarea
                value={paymentMethod.comments}
                onChange={(e) =>
                  setPaymentMethod({
                    ...paymentMethod,
                    comments: e.target.value,
                  })
                }
                placeholder="Agregar comentarios sobre el pago..."
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button type="submit">Actualizar Reserva</Button>
      </DialogFooter>
    </form>
  );
}

function updateRoom(room: string) {
  let updated = room;
  if (updated.toUpperCase() == "SINGLE") {
    updated = "SENCILLO";
  }
  if (updated.toUpperCase() == "DOUBLE") {
    updated = "DOBLE";
  }
  return updated;
}
