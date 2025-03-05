import { Card } from "@/components/ui/card";
import { ReservationsTable } from "@/components/dashboard/reservations-table";
import { ReservationFilters } from "@/components/dashboard/reservation-filters";

export default function PendingReservationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Reservas Pendientes</h1>
      </div>

      <Card>
        <div className="p-6 space-y-4">
          <ReservationFilters />
          <ReservationsTable status="pending" />
        </div>
      </Card>
    </div>
  );
}