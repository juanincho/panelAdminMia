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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus } from "lucide-react";
import { Traveler } from "@/app/_types";
import { differenceInDays, parseISO } from "date-fns";
import { API_KEY } from "../../../constants/constantes";

interface NightCost {
  night: number;
  baseCost: number;
  taxes: {
    base: number;
    total: number;
    name: string;
    rate: number;
    mount: number;
  }[];
  totalWithTaxes: number;
}

interface PaymentMethod {
  type: "spei" | "credit_card" | "balance";
  paymentDate: string;
  cardLastDigits?: string;
  comments: string;
}

interface ReservationFormProps {
  item: any;
  viajeros: Traveler[];
}

const estados = ["Confirmada", "Cancelada", "En proceso"];
const taxes = [
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

export function ReservationForm({ item, viajeros }: ReservationFormProps) {
  const [activeTab, setActiveTab] = useState("cliente");
  const [selectedTraveler, setSelectedTraveler] = useState<string>("");
  const [companions, setCompanions] = useState<string[]>([]);
  const [totalSalePrice, setTotalSalePrice] = useState<number>(item.total);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalCostImpuestos, setTotalCostImpuestos] = useState<number>(0);
  const [nights, setNights] = useState<NightCost[]>([]);
  const [client, setClient] = useState({
    estado: "Confirmada",
  });
  const [proveedor, setProveedor] = useState({
    codigo_reservacion_hotel: "",
  });
  const [enabledTaxes, setEnabledTaxes] = useState(taxes);
  const [customTaxes, setCustomTaxes] = useState<
    { name: string; rate: number }[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: "spei",
    paymentDate: "",
    comments: "",
  });

  useEffect(() => {
    if (item.check_in && item.check_out) {
      const nightsCount = differenceInDays(
        parseISO(item.check_out),
        parseISO(item.check_in)
      );

      if (nightsCount > 0 && totalCost > 0) {
        const costPerNight = totalCost / nightsCount;
        const taxFilter = enabledTaxes.filter((tax) => tax.selected);
        const newNights: NightCost[] = Array.from(
          { length: nightsCount },
          (_, index) => ({
            night: index + 1,
            baseCost: costPerNight,
            taxes: taxFilter.map(({ id, name, rate, mount }) => ({
              id_impuesto: id,
              name,
              rate,
              mount,
              base: costPerNight,
              total: costPerNight * rate + mount,
            })),
            totalWithTaxes: taxFilter.reduce(
              (prev, current) =>
                prev + (costPerNight * current.rate + current.mount),
              costPerNight
            ),
          })
        );
        setNights(newNights);

        const costoTotal = newNights.reduce(
          (prev, current) => prev + current.totalWithTaxes,
          0
        );
        setTotalCostImpuestos(costoTotal);
      }
    }
  }, [item.check_in, item.check_out, totalCost, enabledTaxes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nightsCount = differenceInDays(
      parseISO(item.check_out),
      parseISO(item.check_in)
    );

    console.log(nights);
    const objeto = {
      id_solicitud: item.id_solicitud,
      id_servicio: item.id_servicio,
      estado: client.estado,
      check_in: item.check_in.split("T")[0],
      check_out: item.check_out.split("T")[0],
      id_viajero: item.id_viajero,
      nombre_hotel: item.hotel,
      total: item.total,
      subtotal: parseFloat((item.total * 0.84).toString()),
      impuestos: parseFloat((item.total * 0.16).toString()),
      tipo_cuarto: item.room,
      noches: nightsCount,
      costo_subtotal: totalCost,
      costo_total: totalCostImpuestos,
      costo_impuestos: totalCostImpuestos - totalCost,
      codigo_reservacion_hotel: proveedor.codigo_reservacion_hotel,
      items: nights.map((item_booking) => ({
        total: totalSalePrice / nightsCount,
        subtotal: (totalSalePrice / nightsCount) * 0.84,
        impuestos: (totalSalePrice / nightsCount) * 0.16,
        costo_total: item_booking.totalWithTaxes,
        costo_subtotal: item_booking.baseCost,
        costo_impuestos:
          item_booking.totalWithTaxes -
          item_booking.baseCost +
          item_booking.totalWithTaxes * 0.16,
        costo_iva: item_booking.totalWithTaxes - item_booking.baseCost,
        taxes: item_booking.taxes,
      })),
    };

    try {
      console.log(objeto);
      const response = await fetch(
        "http://mianoktos.vercel.app/v1/mia/reservas",
        {
          method: "POST",
          headers: {
            "x-api-key": API_KEY || "",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          cache: "no-store",
          body: JSON.stringify(objeto),
        }
      ).then((res) => res.json());
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    // Implementation for form submission
  };

  const addCustomTax = () => {
    setCustomTaxes([...customTaxes, { name: "", rate: 0 }]);
  };

  const removeCustomTax = (index: number) => {
    setCustomTaxes(customTaxes.filter((_, i) => i !== index));
  };

  const generateCoupon = () => {};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="proveedor">Proveedor</TabsTrigger>
          <TabsTrigger value="pago">Pago a Proveedor</TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="space-y-4">
          <div className="grid  md:grid-cols-2 gap-4 sm:grid-cols-1">
            <div>
              <Label>Check-in</Label>
              <Input type="date" disabled value={item.check_in.split("T")[0]} />
            </div>
            <div>
              <Label>Check-out</Label>
              <Input
                type="date"
                disabled
                value={item.check_out.split("T")[0]}
              />
            </div>

            {/* <div>
              <Label>Viajero Principal</Label>
              <Select
                value={selectedTraveler}
                onValueChange={setSelectedTraveler}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar viajero" />
                </SelectTrigger>
                <SelectContent>
                  {viajeros.map((viajero) => (
                    <SelectItem
                      key={viajero.id_viajero}
                      value={viajero.id_viajero}
                    >
                      {`${viajero.primer_nombre} ${viajero.apellido_paterno}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
            <div>
              <Label>#ID viajero</Label>
              <Input value={item.id_viajero} disabled />
            </div>

            <div>
              <Label>Hotel</Label>
              <Input value={item.hotel} disabled />
            </div>

            {/* <div>
              <Label>Tipo de Habitación</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                  </SelectContent>
                  </Select>
                </div> */}
            <div>
              <Label>Habitación</Label>
              <Input value={item.room} disabled />
            </div>

            <div>
              <Label>Precio de Venta Total (con impuestos)</Label>
              <Input
                type="number"
                value={totalSalePrice}
                onChange={(e) => setTotalSalePrice(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label>Estado</Label>
            <Select
              value={client.estado}
              onValueChange={(e) => {
                setClient((prev) => ({ ...prev, estado: e }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {`${estado}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="proveedor" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Código de Reserva</Label>
                <Input
                  value={proveedor.codigo_reservacion_hotel}
                  onChange={(e) =>
                    setProveedor((prev) => ({
                      ...prev,
                      codigo_reservacion_hotel: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label>Costo Total (sin impuestos)</Label>
                <Input
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              {enabledTaxes.map((tax, id) => {
                return (
                  <Label key={tax.name + id}>
                    <Checkbox
                      checked={tax.selected}
                      onCheckedChange={(checked) => {
                        const arrayUpdate = enabledTaxes.map((obj) => ({
                          ...obj,
                          selected:
                            obj.id == tax.id
                              ? (checked as boolean)
                              : obj.selected,
                        }));
                        setEnabledTaxes(arrayUpdate);
                      }}
                    />
                    {` ${tax.descripcion}`}
                  </Label>
                );
              })}

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
                  placeholder="Porcentaje"
                  value={tax.rate}
                  onChange={(e) => {
                    const newTaxes = [...customTaxes];
                    newTaxes[index].rate = Number(e.target.value);
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

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Noche</TableHead>
                  <TableHead>Costo Base</TableHead>
                  {enabledTaxes
                    .filter((tax) => tax.selected)
                    .map((tax, id) => (
                      <TableHead key={tax.name + tax.rate + id}>
                        {tax.descripcion}
                      </TableHead>
                    ))}
                  {customTaxes.map((tax, id) => (
                    <TableHead key={tax.name + id}>{tax.name}</TableHead>
                  ))}
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nights.map((night, id) => (
                  <TableRow key={night.night + id}>
                    <TableCell>{night.night}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={night.baseCost}
                        onChange={(e) => {
                          // Implement cost update logic
                        }}
                      />
                    </TableCell>
                    {night.taxes.map((tax) => (
                      <TableCell key={tax.name}>${tax.total}</TableCell>
                    ))}
                    <TableCell>${night.totalWithTaxes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Table>
              <TableBody>
                <TableRow className="bg-gray-100">
                  <TableCell>Venta:</TableCell>
                  <TableCell>{totalSalePrice}</TableCell>
                  <TableCell>Costo:</TableCell>
                  <TableCell>{totalCostImpuestos}</TableCell>
                </TableRow>
                {totalCost > 0 && (
                  <TableRow className="bg-gray-200">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Markup: </TableCell>
                    <TableCell>
                      {((totalSalePrice - totalCostImpuestos) /
                        totalCostImpuestos) *
                        100}
                      %
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="pago" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label>Método de Pago</Label>
              <Select
                value={paymentMethod.type}
                onValueChange={(value: "spei" | "credit_card" | "balance") =>
                  setPaymentMethod({ ...paymentMethod, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar método" />
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

            <div>
              <Label>Fecha de Pago</Label>
              <Input
                type="date"
                value={paymentMethod.paymentDate}
                onChange={(e) =>
                  setPaymentMethod({
                    ...paymentMethod,
                    paymentDate: e.target.value,
                  })
                }
              />
            </div>

            {paymentMethod.type === "credit_card" && (
              <div>
                <Label>Últimos 4 dígitos</Label>
                <Input
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
            )}

            <div>
              <Label>Comentarios</Label>
              <Textarea
                value={paymentMethod.comments}
                onChange={(e) =>
                  setPaymentMethod({
                    ...paymentMethod,
                    comments: e.target.value,
                  })
                }
              />
            </div>

            {(paymentMethod.type === "spei" ||
              paymentMethod.type === "balance") && (
              <Button type="button" onClick={generateCoupon}>
                Generar Cupón
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button type="submit">Guardar Reserva</Button>
      </DialogFooter>
    </form>
  );
}
