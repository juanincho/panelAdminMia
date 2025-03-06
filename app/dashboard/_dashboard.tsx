"use client";

export default function DashboardModule({ data }) {
  console.log(data);
  return <h1>veamos</h1>;
}

// import { Card } from "@/components/ui/card";
// import { usePathname } from "next/navigation";
// import { BarChart3, Calendar, CheckCircle2, Clock, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { Badge } from "@/components/ui/badge";

// interface Reservation {
//   confirmation_code: string;
//   id_viajero: number;
//   hotel: string;
//   check_in: string;
//   check_out: string;
//   room: string;
//   total: number;
//   status: string;
// }

// const ReservationsTable = ({
//   reservations,
// }: {
//   reservations: Reservation[];
// }) => {
//   if (!Array.isArray(reservations)) return null;

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-yellow-100 text-yellow-800 border-yellow-200"
//           >
//             <Clock className="w-3 h-3 mr-1" />
//             Pendiente
//           </Badge>
//         );
//       case "completed":
//         return (
//           <Badge
//             variant="outline"
//             className="bg-green-100 text-green-800 border-green-200"
//           >
//             <CheckCircle2 className="w-3 h-3 mr-1" />
//             Completada
//           </Badge>
//         );
//       default:
//         return (
//           <Badge
//             variant="outline"
//             className="bg-gray-100 text-gray-800 border-gray-200"
//           >
//             {status}
//           </Badge>
//         );
//     }
//   };

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Código</TableHead>
//           <TableHead>ID Viajero</TableHead>
//           <TableHead>Hotel</TableHead>
//           <TableHead>Check In</TableHead>
//           <TableHead>Check Out</TableHead>
//           <TableHead>Habitación</TableHead>
//           <TableHead>Total</TableHead>
//           <TableHead>Estado</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {reservations.map((reservation) => (
//           <TableRow key={reservation.confirmation_code}>
//             <TableCell className="font-medium">
//               {reservation.confirmation_code}
//             </TableCell>
//             <TableCell>{reservation.id_viajero}</TableCell>
//             <TableCell>{reservation.hotel}</TableCell>
//             <TableCell>
//               {format(new Date(reservation.check_in), "PPP", { locale: es })}
//             </TableCell>
//             <TableCell>
//               {format(new Date(reservation.check_out), "PPP", { locale: es })}
//             </TableCell>
//             <TableCell>{reservation.room}</TableCell>
//             <TableCell>${reservation.total.toFixed(2)}</TableCell>
//             <TableCell>{getStatusBadge(reservation.status)}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// };

// function DashboardPage() {
//   const [reservations, setReservations] = useState<Reservation[]>([]);
//   const [lastUpdate, setLastUpdate] = useState<string>("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log("Fetching data...");
//         const response = await fetch("/api/solicitudes");
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log(data);
//         setReservations(Array.isArray(data) ? data : []);
//         setLastUpdate(new Date().toLocaleString("es-ES"));
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setReservations([]);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     console.log("Reservations updated:", reservations);
//   }, [reservations]);

//   const pathname = usePathname();

//   const pendingCount = Array.isArray(reservations)
//     ? reservations.filter((r) => r.status === "pending").length
//     : 0;
//   const completedCount = Array.isArray(reservations)
//     ? reservations.filter((r) => r.status === "completed").length
//     : 0;
//   const totalCount = Array.isArray(reservations) ? reservations.length : 0;
//   const uniqueCustomers = Array.isArray(reservations)
//     ? new Set(reservations.map((r) => r.id_viajero)).size
//     : 0;

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm text-muted-foreground">
//             Última actualización: {lastUpdate}
//           </span>
//         </div>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card className="p-6">
//           <div className="flex items-center space-x-4">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <Calendar className="h-6 w-6 text-blue-700" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">
//                 Total Reservas
//               </p>
//               <h3 className="text-2xl font-bold">{totalCount}</h3>
//             </div>
//           </div>
//         </Card>

//         <Card
//           className="p-6 cursor-pointer"
//           onClick={() => (window.location.href = "/dashboard/pending")}
//         >
//           <div className="flex items-center space-x-4">
//             <div className="p-2 bg-yellow-100 rounded-lg">
//               <Clock className="h-6 w-6 text-yellow-700" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">
//                 Pendientes
//               </p>
//               <h3 className="text-2xl font-bold">{pendingCount}</h3>
//             </div>
//           </div>
//         </Card>

//         <Card
//           className="p-6 cursor-pointer"
//           onClick={() => (window.location.href = "/dashboard/completed")}
//         >
//           <div className="flex items-center space-x-4">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <CheckCircle2 className="h-6 w-6 text-green-700" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">
//                 Completadas
//               </p>
//               <h3 className="text-2xl font-bold">{completedCount}</h3>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <div className="flex items-center space-x-4">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <Users className="h-6 w-6 text-purple-700" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">
//                 Viajeros Únicos
//               </p>
//               <h3 className="text-2xl font-bold">{uniqueCustomers}</h3>
//             </div>
//           </div>
//         </Card>
//       </div>

//       <Card className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-medium">Reservas Recientes</h3>
//           <BarChart3 className="h-4 w-4 text-muted-foreground" />
//         </div>
//         <ReservationsTable reservations={reservations} />
//       </Card>
//     </div>
//   );
// }
