import React, { useState, useEffect } from "react";
import { differenceInDays, parseISO, format } from "date-fns";
import { useParams } from "next/navigation";
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
  Room,
  Solicitud,
  Tax,
  Traveler,
} from "@/app/_types/reservas";

interface ReservationFormProps {
  solicitud: Solicitud;
  hotels: Hotel[];
  travelers: Traveler[];
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

export function ReservationForm({
  solicitud,
  hotels,
  onClose,
}: ReservationFormProps) {
  const [travelers, setTravelers] = useState([]);
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
  const [reservationStatus, setReservationStatus] = useState("Confirmada");
  const [hotelReservationCode, setHotelReservationCode] = useState("");
  const [enabledTaxes, setEnabledTaxes] = useState(DEFAULT_TAXES);
  const [customTaxes, setCustomTaxes] = useState<
    { name: string; rate: number }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "spei",
    paymentDate: format(new Date(), "yyyy-MM-dd"),
    comments: "",
  });

  // UI state for original hotel display
  const [isChangingHotel, setIsChangingHotel] = useState(false);
  const [originalHotel, setOriginalHotel] = useState<string>("");

  const selectedHotelData = hotels.find((h) => h.id_hotel === selectedHotel);
  const selectedRoomData = selectedHotelData?.tipos_cuartos.find(
    (r) => r.id_tipo_cuarto.toString() === selectedRoom
  );

  useEffect(() => {
    const fetchViajero = async () => {
      try {
        const response = await fetch(
          `https://mianoktos.vercel.app/v1/mia/viajeros/id?id=${solicitud.id_usuario_generador}`,
          {
            headers: {
              "x-api-key": API_KEY || "",
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
            cache: "no-store",
          }
        ).then((res) => res.json());
        if (response.error) {
          throw new Error("Error al buscar los viajeros");
        }
        console.log(response);
        setTravelers(response);
      } catch (error) {
        console.log(error);
        setTravelers([]);
      }
    };
    console.log(solicitud);
    fetchViajero();
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
      setTotalSalePrice(solicitud.total);
      setReservationStatus(
        solicitud.status === "complete" ? "Confirmada" : solicitud.status
      );

      // Set confirmation code if available
      if (solicitud.confirmation_code) {
        setHotelReservationCode(solicitud.confirmation_code);
      }
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
      nombre_hotel: selectedHotelData?.nombre_hotel || originalHotel,
      total: totalSalePrice,
      subtotal: totalSalePrice / 1.16,
      impuestos: totalSalePrice - totalSalePrice / 1.16,
      tipo_cuarto: selectedRoomData?.nombre_tipo_cuarto || solicitud.room,
      noches: nightsCount,
      costo_subtotal: totalCost,
      costo_total: totalCostWithTaxes,
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

    console.log(reservation);
    try {
      const response = await fetchCreateReservaFromSolicitud(reservation);
      alert("Actualizado con éxito");
      console.log(response);
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
      className="space-y-6 mx-5 rounded-md shadow-md bg-white p-4"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="proveedor">Proveedor</TabsTrigger>
          <TabsTrigger value="pago">Pago a Proveedor</TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hotel</Label>

              {/* Custom hotel selection UI */}
              <div className="rounded-md border border-input bg-background">
                {/* Original hotel display */}
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span
                      className={
                        isChangingHotel
                          ? "text-muted-foreground line-through"
                          : ""
                      }
                    >
                      {originalHotel || "Hotel sin nombre"}
                    </span>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChangingHotel(!isChangingHotel)}
                    className="h-8 px-2"
                  >
                    {isChangingHotel ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Edit className="h-4 w-4 mr-1" />
                    )}
                    {isChangingHotel ? "Confirmar" : "Cambiar"}
                  </Button>
                </div>

                {/* Hotel selection dropdown */}
                {isChangingHotel && (
                  <div className="px-3 py-2 border-t">
                    <Select
                      value={selectedHotel}
                      onValueChange={setSelectedHotel}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nuevo hotel" />
                      </SelectTrigger>
                      <SelectContent>
                        {hotels.map((hotel) => (
                          <SelectItem
                            key={hotel.id_hotel}
                            value={hotel.id_hotel}
                          >
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              {hotel.nombre_hotel || "Hotel sin nombre"} -{" "}
                              {hotel.Ciudad_Zona}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Habitación</Label>
              <Select
                value={selectedRoom}
                onValueChange={setSelectedRoom}
                disabled={!selectedHotel}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      updateRoom(solicitud.room) || "Seleccionar habitación"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {selectedHotelData?.tipos_cuartos.map((room) => (
                    <SelectItem
                      key={room.id_tipo_cuarto}
                      value={room.id_tipo_cuarto.toString()}
                    >
                      {room.nombre_tipo_cuarto} - ${room.precio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Check-in</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-8"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Check-out</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  className="pl-8"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 bg-gray-100 p-4 rounded-sm">
              <div className="space-y-2">
                <Label>Datos viajero seleccionado</Label>
                <div className="relative">
                  <Input
                    type="text"
                    disabled
                    value={[
                      solicitud.nombre_viajero,
                      solicitud.primer_nombre,
                      solicitud.apellido_paterno,
                      solicitud.id_viajero.includes("via-")
                        ? solicitud.id_viajero
                        : null,
                    ]
                      .filter((item) => !!item)
                      .join(" ")}
                  />
                </div>
              </div>
              <Label>Viajero</Label>
              <Select
                value={selectedTraveler}
                onValueChange={setSelectedTraveler}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar viajero" />
                </SelectTrigger>
                <SelectContent>
                  {travelers.map((traveler) => (
                    <SelectItem
                      key={traveler.id_viajero}
                      value={traveler.id_viajero}
                    >
                      {`${traveler.primer_nombre} ${traveler.apellido_paterno} ${traveler.apellido_materno} - ${traveler.id_viajero}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado de la Reserva</Label>
              <Select
                value={reservationStatus}
                onValueChange={setReservationStatus}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmada">Confirmada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                  <SelectItem value="En proceso">En proceso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="proveedor" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Código de Reserva del Hotel</Label>
                <Input
                  value={hotelReservationCode}
                  onChange={(e) => setHotelReservationCode(e.target.value)}
                  placeholder={solicitud.confirmation_code || "Ej: RES123456"}
                />
              </div>
              <div className="space-y-2">
                <Label>Costo Subtotal</Label>
                <Input
                  type="number"
                  value={totalCost > 0 ? totalCost : ""}
                  onChange={(e) => {
                    const totalCost = Number(e.target.value);
                    const nightsCount = nights.length;
                    setTotalCost(totalCost);
                    calculateNightlyCosts(nightsCount, totalCost);
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {enabledTaxes.map((tax) => (
                <Label key={tax.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={tax.selected}
                    onCheckedChange={(checked) => {
                      setEnabledTaxes(
                        enabledTaxes.map((t) =>
                          t.id === tax.id ? { ...t, selected: !!checked } : t
                        )
                      );
                    }}
                  />
                  <span>{tax.descripcion}</span>
                </Label>
              ))}
              <Button type="button" variant="outline" onClick={addCustomTax}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Impuesto
              </Button>
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
    updated = "Sencilla";
  }
  if (updated.toUpperCase() == "DOUBLE") {
    updated = "Doble";
  }
  return updated;
}
