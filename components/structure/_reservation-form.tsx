import React, { useState, useEffect, FormEvent } from "react";
import { differenceInDays, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { fetchCreateReservaFromSolicitud } from "@/services/reservas";
import {
  ComboBox,
  DateInput,
  Dropdown,
  DropdownValues,
  NumberInput,
  TextInput,
} from "@/components/atom/Input";
import { fetchViajerosFromAgent } from "@/services/viajeros";
import { Hotel, Solicitud, ReservaForm, Viajero } from "@/types";
import { Table } from "../Table";

interface ReservationFormProps {
  solicitud: Solicitud;
  hotels: Hotel[];
  onClose: () => void;
}

export function ReservationForm({
  solicitud,
  hotels,
  onClose,
}: ReservationFormProps) {
  const currentHotel = hotels.filter(
    (item) => item.nombre_hotel == solicitud.hotel
  )[0];
  const currentNoches = differenceInDays(
    parseISO(solicitud.check_out),
    parseISO(solicitud.check_in)
  );

  const [form, setData] = useState<ReservaForm>({
    hotel: {
      name: solicitud.hotel || "",
      content: currentHotel || null,
    },
    habitacion: updateRoom(solicitud.room) || "",
    check_in: solicitud.check_in.split("T")[0] || "",
    check_out: solicitud.check_out.split("T")[0] || "",
    codigo_reservacion_hotel: "",
    viajero: {
      nombre_completo: "",
    },
    noches: currentNoches,
    venta: {
      total: Number(solicitud.total) || 0,
      subtotal: Number(solicitud.total) * 0.84 || 0,
      impuestos: Number(solicitud.total) * 0.16 || 0,
      markup: 0,
    },
    estado_reserva: "Confirmada",
    comments: "",
    proveedor: {
      total:
        Number(
          Number(
            currentHotel?.tipos_cuartos.find(
              (item) => item.nombre_tipo_cuarto == updateRoom(solicitud.room)
            )?.costo ?? 0
          ) * currentNoches
        ) || 0,
      subtotal: 0,
      impuestos: 0,
    },
    impuestos: {
      iva:
        Number(
          currentHotel?.impuestos.find((item) => item.name == "iva")?.porcentaje
        ) || 0,
      ish:
        Number(
          currentHotel?.impuestos.find((item) => item.name == "ish")?.porcentaje
        ) || 0,
      otros_impuestos:
        Number(
          currentHotel?.impuestos.find((item) => item.name == "otros_impuestos")
            .monto
        ) || 0,
      otros_impuestos_porcentaje:
        Number(
          currentHotel?.impuestos.find(
            (item) => item.name == "otros_impuestos_porcentaje"
          )?.porcentaje
        ) || 0,
    },
    items: [],
    solicitud,
  });
  const [habitaciones, setHabitaciones] = useState(
    hotels.filter((item) => item.nombre_hotel == solicitud.hotel)[0]
      .tipos_cuartos
  );
  const [travelers, setTravelers] = useState<Viajero[]>([]);
  const [activeTab, setActiveTab] = useState("cliente");

  console.log(hotels);

  /* ESTe es el nuevo, si afecta */
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

  useEffect(() => {
    if (
      form.hotel.content &&
      form.check_in &&
      form.check_out &&
      form.habitacion
    ) {
      const nights = differenceInDays(
        //Obtenemos las noches para poder dividir el costo total entre las noches y obtener los items
        parseISO(form.check_out),
        parseISO(form.check_in)
      );

      const roomPrice = Number(
        form.hotel.content.tipos_cuartos.find(
          (item) => item.nombre_tipo_cuarto == form.habitacion
        ).precio
      );

      const costoBase =
        form.proveedor.total - form.impuestos.otros_impuestos * nights;
      const { subtotal, impuestos } = Object.keys(form.impuestos).reduce(
        (acc, key) => {
          //Sacamos el valor de los impuestos y el subtotal del costo total
          const value = form.impuestos[key as keyof ReservaForm["impuestos"]];
          if (key == "otros_impuestos") {
            return acc;
          } else {
            console.log(acc);
            return {
              subtotal: acc.subtotal - (costoBase * value) / 100,
              impuestos: acc.impuestos + (costoBase * value) / 100,
            };
          }
        },
        { subtotal: costoBase || 0, impuestos: 0 }
      );

      const items = Array.from({ length: nights }, (_, index) => ({
        noche: index + 1,
        costo: {
          total: Number((form.proveedor.total / nights || 0).toFixed(2)),
          subtotal: Number((subtotal / nights || 0).toFixed(2)),
          impuestos: Number((impuestos / nights || 0).toFixed(2)),
        },
        venta: {
          total: Number(roomPrice),
          subtotal: Number((roomPrice * 0.84).toFixed(2)),
          impuestos: Number((roomPrice * 0.16).toFixed(2)),
        },
        impuestos: Object.keys(form.impuestos)
          .map((key) => {
            const value = Number(
              form.impuestos[key as keyof ReservaForm["impuestos"]]
            );
            if (value <= 0) return null;
            const base = Number(
              (
                form.proveedor.total / nights -
                form.impuestos.otros_impuestos
              ).toFixed(2)
            );
            const total =
              key !== "otros_impuestos"
                ? Number(((base * value) / 100).toFixed(2))
                : value;
            return {
              name: key,
              rate: key !== "otros_impuestos" ? value : 0,
              tipo_impuesto: "c",
              monto: key === "otros_impuestos" ? value : 0,
              base: key === "otros_impuestos" ? base + value : base,
              total,
            };
          })
          .filter(Boolean),
      }));

      setData((prev) => ({
        ...prev,
        proveedor: {
          ...prev.proveedor,
          subtotal: subtotal,
          impuestos: impuestos,
        },
        venta: {
          total: Number((roomPrice * nights).toFixed(2) || 0),
          subtotal: Number((roomPrice * nights * 0.84).toFixed(2) || 0),
          impuestos: Number((roomPrice * nights * 0.16).toFixed(2) || 0),
          markup: Number(
            (
              ((roomPrice * nights - form.proveedor.total) /
                form.proveedor.total) *
              100
            ).toFixed(2)
          ),
        },
        items: form.proveedor.total > 0 ? items : [],
        noches: Number(nights),
      }));
    }
  }, [
    form.check_in,
    form.check_out,
    form.impuestos,
    form.proveedor.total,
    form.habitacion,
    form.hotel,
  ]); //Se ejecuta cuando cambian las fechas de check-in y check-out, los impuestos o el costo total

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(form);
    fetchCreateReservaFromSolicitud(form, (data) => {
      console.log(data);
      if (data.error) {
        alert("Error al crear la reserva");
        return;
      }
      alert("Reserva creada correctamente");
      onClose();
    });
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

              {Object.keys(form.impuestos).map((key) => (
                <NumberInput
                  value={form.impuestos[key as keyof ReservaForm["impuestos"]]}
                  key={key}
                  onChange={(value) => {
                    setData((prev) => ({
                      ...prev,
                      impuestos: { ...prev.impuestos, [key]: Number(value) },
                    }));
                  }}
                  label={key.replace(/_/g, " ").toUpperCase()}
                />
              ))}
            </div>
            <div className="w-xl overflow-auto">
              <Table
                registros={
                  form.items.map((item) => ({
                    noche: item.noche,
                    ...item.impuestos.reduce((acc, tax) => {
                      acc[tax.name] = tax.total;
                      return acc;
                    }, {}),
                    costo_impuestos: item.costo.impuestos,
                    costo_subtotal: item.costo.subtotal,
                    costo: item.costo.total,
                    venta: item.venta.total,
                  })) || []
                }
                exportButton={false}
                renderers={{
                  noche: (props: any) => (
                    <span title={props.value}>{props.value}</span>
                  ),
                  costo: (props: any) => (
                    <span title={props.value}>${props.value}</span>
                  ),
                  venta: (props: any) => (
                    <span title={props.value}>${props.value}</span>
                  ),
                  iva: (props: any) => (
                    <span title={props.value}>${props.value}</span>
                  ),
                  ish: (props: any) => (
                    <span title={props.value}>${props.value}</span>
                  ),
                  otros_impuestos: (props: any) => (
                    <span title={props.value}>${props.value}</span>
                  ),
                  otros_impuestos_porcentaje: (props: any) => (
                    <span title={props.value}>${props.value}</span>
                  ),
                  total_impuestos_costo: (props: any) => (
                    <span title={props.value}>${props.value}</span>
                  ),
                }}
                defaultSort={{ key: "noche", sort: true }}
              />
            </div>
            {form.items.length > 0 && (
              <div className="w-full p-4 border border-gray-200 rounded-md bg-white shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">
                  Resumen:
                </h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Total venta:</span>
                    <span className="text-gray-900 font-semibold">
                      ${form.venta.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Costo base:</span>
                    <span className="text-gray-900 font-semibold">
                      ${form.proveedor.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2 font-medium text-gray-700">
                    <span>Ganancia:</span>
                    <span className="text-gray-900">
                      ${(form.venta.total - form.proveedor.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2 font-medium text-gray-700">
                    <span>Markup:</span>
                    <span className="text-gray-900">
                      {form.venta.markup.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pago" className="space-y-4">
          {/*     <div className="grid gap-4">
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
           */}
          <p>Proximamente...</p>
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
