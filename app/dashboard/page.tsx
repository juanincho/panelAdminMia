import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users 
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Última actualización: {new Date().toLocaleString('es-ES')}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Reservas
              </p>
              <h3 className="text-2xl font-bold">150</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pendientes
              </p>
              <h3 className="text-2xl font-bold">45</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-green-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Completadas
              </p>
              <h3 className="text-2xl font-bold">89</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Clientes Únicos
              </p>
              <h3 className="text-2xl font-bold">120</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Reservas Recientes</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium">Cliente {i}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('es-ES')}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pendiente
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Actividad Reciente</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium">Reserva #{i} actualizada</p>
                  <p className="text-sm text-muted-foreground">
                    hace {i} {i === 1 ? 'hora' : 'horas'}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                  Actualización
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}