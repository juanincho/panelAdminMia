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
    name: string;
    rate: number;
    amount: number;
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

export function ReservationForm({ item, viajeros }: ReservationFormProps) {
  const [activeTab, setActiveTab] = useState("cliente");
  const [selectedTraveler, setSelectedTraveler] = useState<string>("");
  const [companions, setCompanions] = useState<string[]>([]);
  const [totalSalePrice, setTotalSalePrice] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [nights, setNights] = useState<NightCost[]>([]);
  const [enabledTaxes, setEnabledTaxes] = useState({
    iva: true,
    ish: true,
    saneamiento: true,
  });
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
        const newNights: NightCost[] = Array.from(
          { length: nightsCount },
          (_, index) => ({
            night: index + 1,
            baseCost: costPerNight,
            taxes: [
              { name: "IVA", rate: 0.16, amount: costPerNight * 0.16 },
              { name: "ISH", rate: 0.03, amount: costPerNight * 0.03 },
              { name: "Saneamiento", rate: 0, amount: 32 },
            ],
            totalWithTaxes: costPerNight + costPerNight * 0.19 + 32,
          })
        );
        setNights(newNights);
      }
    }
  }, [item.check_in, item.check_out, totalCost]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for form submission
  };

  const addCustomTax = () => {
    setCustomTaxes([...customTaxes, { name: "", rate: 0 }]);
  };

  const removeCustomTax = (index: number) => {
    setCustomTaxes(customTaxes.filter((_, i) => i !== index));
  };

  const generateCoupon = () => {
    // Implementation for coupon generation
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="proveedor">Proveedor</TabsTrigger>
          <TabsTrigger value="pago">Pago a Proveedor</TabsTrigger>
        </TabsList>

        <TabsContent value="cliente" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check-in</Label>
              <Input type="date" value={item.check_in} />
            </div>
            <div>
              <Label>Check-out</Label>
              <Input type="date" value={item.check_out} />
            </div>

            <div>
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
            </div>

            <div>
              <Label>Hotel</Label>
              <Input value={item.hotel} disabled />
            </div>

            <div>
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
        </TabsContent>

        <TabsContent value="proveedor" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Código de Reserva</Label>
                <Input />
              </div>
              <div>
                <Label>Costo Total (con impuestos)</Label>
                <Input
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <Checkbox
                checked={enabledTaxes.iva}
                onCheckedChange={(checked) =>
                  setEnabledTaxes({ ...enabledTaxes, iva: checked as boolean })
                }
              />
              <Label>IVA (16%)</Label>

              <Checkbox
                checked={enabledTaxes.ish}
                onCheckedChange={(checked) =>
                  setEnabledTaxes({ ...enabledTaxes, ish: checked as boolean })
                }
              />
              <Label>ISH (3%)</Label>

              <Checkbox
                checked={enabledTaxes.saneamiento}
                onCheckedChange={(checked) =>
                  setEnabledTaxes({
                    ...enabledTaxes,
                    saneamiento: checked as boolean,
                  })
                }
              />
              <Label>Saneamiento ($32)</Label>

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
                  <TableHead>IVA</TableHead>
                  <TableHead>ISH</TableHead>
                  <TableHead>Saneamiento</TableHead>
                  {customTaxes.map((tax) => (
                    <TableHead key={tax.name}>{tax.name}</TableHead>
                  ))}
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nights.map((night) => (
                  <TableRow key={night.night}>
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
                      <TableCell key={tax.name}>
                        ${tax.amount.toFixed(2)}
                      </TableCell>
                    ))}
                    <TableCell>${night.totalWithTaxes.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
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
