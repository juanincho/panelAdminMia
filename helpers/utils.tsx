import {
  Clock,
  CheckCircle2,
  HandCoins,
  CreditCard,
  CalendarClock,
  BedDouble,
  LogOut,
  Headset,
  User,
} from "lucide-react";

export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split("T")[0].split("-");
  const date = new Date(+year, +month - 1, +day);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatRoom = (room: string) => {
  let response = room;
  if (response.toUpperCase() == "SINGLE") {
    response = "SENCILLO";
  } else if (response.toUpperCase() == "DOUBLE") {
    response = "DOBLE";
  }
  return response;
};

export function quitarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function calcularNoches(
  checkIn: string | Date,
  checkOut: string | Date
): number {
  const entrada = new Date(checkIn);
  const salida = new Date(checkOut);

  // Aseguramos que la parte de la hora no afecte el cálculo
  entrada.setHours(0, 0, 0, 0);
  salida.setHours(0, 0, 0, 0);

  const diferenciaMs = salida.getTime() - entrada.getTime();
  const noches = diferenciaMs / (1000 * 60 * 60 * 24);

  return Math.max(0, noches); // Nunca devolver negativo
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pendiente
        </span>
      );
    case "complete":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Check
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};
export const getPaymentBadge = (status: string) => {
  switch (status) {
    case "credito":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <CreditCard className="w-3 h-3 mr-1" />
          Credito
        </span>
      );
    case "contado":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <HandCoins className="w-3 h-3 mr-1" />
          Contado
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};
export const getWhoCreateBadge = (status: string) => {
  switch (status) {
    case "Operaciones":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
          <Headset className="w-3 h-3 mr-1" />
          Operaciones
        </span>
      );
    case "Cliente":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <User className="w-3 h-3 mr-1" />
          Cliente
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};
export const getStageBadge = (status: string) => {
  switch (status) {
    case "Reservado":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <CalendarClock className="w-3 h-3 mr-1" />
          Reservado
        </span>
      );
    case "In house":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <BedDouble className="w-3 h-3 mr-1" />
          In house
        </span>
      );
    case "Check-out":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <LogOut className="w-3 h-3 mr-1" />
          Check out
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
};
export const exportToCSV = (data, filename = "archivo.csv") => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.map((key) => key.replace(/_/g, " ").toUpperCase()).join(","),
    ...data.map((row) =>
      headers
        .map((field) => {
          const val = row[field];
          return `"${(val ?? "").toString().replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
