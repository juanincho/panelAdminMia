import { addDays } from "date-fns";

// Helper function to create dates
const createDate = (day: number, month: number = 2) => {
  // month 2 = March (0-based)
  const date = new Date(2024, month, day);
  return date.toISOString();
};

export const TEST_RESERVATIONS = [
  {
    confirmation_code: "MAR-001",
    id_viajero: 1001,
    hotel: "Hotel Riviera Maya",
    check_in: createDate(5),
    check_out: createDate(10),
    room: "Sencilla",
    total: 1500.0,
    status: "completed",
  },
  {
    confirmation_code: "MAR-002",
    id_viajero: 1002,
    hotel: "Hotel Cancún Palace",
    check_in: createDate(8),
    check_out: createDate(15),
    room: "Doble",
    total: 2800.0,
    status: "pending",
  },
  {
    confirmation_code: "MAR-003",
    id_viajero: 1003,
    hotel: "Resort Los Cabos",
    check_in: createDate(12),
    check_out: createDate(18),
    room: "Pent House",
    total: 5200.0,
    status: "pending",
  },
  {
    confirmation_code: "MAR-004",
    id_viajero: 1004,
    hotel: "Hotel Acapulco",
    check_in: createDate(15),
    check_out: createDate(20),
    room: "Doble",
    total: 2200.0,
    status: "completed",
  },
  {
    confirmation_code: "MAR-005",
    id_viajero: 1005,
    hotel: "Resort Puerto Vallarta",
    check_in: createDate(20),
    check_out: createDate(25),
    room: "Sencilla",
    total: 1800.0,
    status: "pending",
  },
];

export const TEST_TRAVELERS = [
  {
    id: 1001,
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@email.com",
    phone: "+52 555 123 4567",
  },
  {
    id: 1002,
    name: "Ana García",
    email: "ana.garcia@email.com",
    phone: "+52 555 234 5678",
  },
  {
    id: 1003,
    name: "Roberto Méndez",
    email: "roberto.mendez@email.com",
    phone: "+52 555 345 6789",
  },
  {
    id: 1004,
    name: "María López",
    email: "maria.lopez@email.com",
    phone: "+52 555 456 7890",
  },
  {
    id: 1005,
    name: "Juan Torres",
    email: "juan.torres@email.com",
    phone: "+52 555 567 8901",
  },
];

export const TEST_HOTELS = [
  {
    id: "RIV001",
    name: "Hotel Riviera Maya",
    location: "Riviera Maya, Quintana Roo",
    categories: ["Sencilla", "Doble", "Pent House"],
  },
  {
    id: "CAN001",
    name: "Hotel Cancún Palace",
    location: "Cancún, Quintana Roo",
    categories: ["Sencilla", "Doble", "Pent House"],
  },
  {
    id: "CAB001",
    name: "Resort Los Cabos",
    location: "Los Cabos, Baja California Sur",
    categories: ["Sencilla", "Doble", "Pent House"],
  },
  {
    id: "ACA001",
    name: "Hotel Acapulco",
    location: "Acapulco, Guerrero",
    categories: ["Sencilla", "Doble"],
  },
  {
    id: "PVR001",
    name: "Resort Puerto Vallarta",
    location: "Puerto Vallarta, Jalisco",
    categories: ["Sencilla", "Doble", "Pent House"],
  },
];

export const TEST_TAXES = [
  {
    id: "IVA",
    name: "IVA",
    percentage: 16,
  },
  {
    id: "ISH",
    name: "Impuesto Sobre Hospedaje",
    percentage: 3,
  },
  {
    id: "ST",
    name: "Servicios Turísticos",
    percentage: 2,
  },
];
