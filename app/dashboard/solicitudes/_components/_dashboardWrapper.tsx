"use client";

import { useEffect, useState } from "react";
import DashboardModule from "./_dashboard";
import { API_KEY } from "@/services/constant";

export default function DashboardModuleWrapper({
  hoteles,
}: {
  hoteles: any[];
}) {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  const fetchSolicitudes = async () => {
    try {
      const res = await fetch("https://mianoktos.vercel.app/v1/mia/solicitud", {
        headers: {
          "x-api-key": API_KEY || "",
          "Cache-Control": "no-cache",
        },
      });
      const data = await res.json();
      setSolicitudes(data);
    } catch (err) {
      console.error("Error al actualizar solicitudes:", err);
    }
  };

  useEffect(() => {
    fetchSolicitudes(); // Carga inicial
    const interval = setInterval(fetchSolicitudes, 5 * 60 * 1000); // Cada 5 minutos
    return () => clearInterval(interval); // Limpieza
  }, []);

  return <DashboardModule data={solicitudes} hoteles={hoteles} />;
}
