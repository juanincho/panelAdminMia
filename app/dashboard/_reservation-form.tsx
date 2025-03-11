import React, { useState } from "react";
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
import { X, Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock data - Replace with actual data when available
const MOCK_HOTELS = ["Hotel A", "Hotel B", "Hotel C", "Hotel D"];
const MOCK_TRAVELERS = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Brown"];
const MOCK_TAXES = ["IVA 16%", "Impuesto Hotelero 3%", "Impuesto Municipal 2%"];

interface CompanionSelectProps {
  value: string;
  onChange: (value: string) => void;
  selectedTravelers: string[];
}

const CompanionSelect: React.FC<CompanionSelectProps> = ({
  value,
  onChange,
  selectedTravelers,
}) => {
  const availableTravelers = MOCK_TRAVELERS.filter(
    (t) => !selectedTravelers.includes(t)
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Seleccionar acompañante" />
      </SelectTrigger>
      <SelectContent>
        {availableTravelers.map((traveler) => (
          <SelectItem key={traveler} value={traveler}>
            {traveler}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface TaxSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const TaxSelect: React.FC<TaxSelectProps> = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger>
      <SelectValue placeholder="Seleccionar impuesto" />
    </SelectTrigger>
    <SelectContent>
      {MOCK_TAXES.map((tax) => (
        <SelectItem key={tax} value={tax}>
          {tax}
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

export function ReservationForm() {
  const [formData, setFormData] = useState({
    registrationDate: new Date().toISOString().split("T")[0],
    checkIn: "",
    checkOut: "",
    hotel: "",
    reservationCode: "",
    roomType: "",
    rooms: 1,
    mainTraveler: "",
    companions: [""],
    roomCost: 0,
    taxes: [""],
    comments: "",
  });

  const [modalState, setModalState] = useState({
    isOpen: false,
    success: false,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    try {
      /*
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la reservación');
      }*/
      throw new Error("error");

      setModalState({
        isOpen: true,
        success: true,
        message: "La reservación se ha guardado exitosamente",
      });
    } catch (error) {
      setModalState({
        isOpen: true,
        success: false,
        message: "Ha ocurrido un error al guardar la reservación",
      });
    }
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (modalState.success) {
      // Reset form or close dialog if needed
      setFormData({
        registrationDate: new Date().toISOString().split("T")[0],
        checkIn: "",
        checkOut: "",
        hotel: "",
        reservationCode: "",
        roomType: "",
        rooms: 1,
        mainTraveler: "",
        companions: [""],
        roomCost: 0,
        taxes: [""],
        comments: "",
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

  const addTax = () => {
    setFormData((prev) => ({
      ...prev,
      taxes: [...prev.taxes, ""],
    }));
  };

  const removeTax = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      taxes: prev.taxes.filter((_, i) => i !== index),
    }));
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
                value={formData.checkIn}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, checkIn: e.target.value }))
                }
              />
              <Input
                type="date"
                value={formData.checkOut}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, checkOut: e.target.value }))
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
              value={formData.reservationCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reservationCode: e.target.value,
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
                {MOCK_TRAVELERS.map((traveler) => (
                  <SelectItem key={traveler} value={traveler}>
                    {traveler}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Costo de habitación</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={formData.roomCost}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  roomCost: parseFloat(e.target.value),
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

        <div className="space-y-2">
          <Label>Impuestos</Label>
          {formData.taxes.map((tax, index) => (
            <div key={index} className="flex gap-2 mt-2">
              <TaxSelect
                value={tax}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    taxes: prev.taxes.map((t, i) => (i === index ? value : t)),
                  }))
                }
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeTax(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={addTax}
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar impuesto
          </Button>
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
