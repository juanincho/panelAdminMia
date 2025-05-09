import { Suspense } from "react";
import DashboardModuleWrapper from "./_components/_dashboardWrapper";
import { API_KEY } from "../../constants/constantes";

export default async function Dashboard() {
  try {
    const endpoints = [
      "https://mianoktos.vercel.app/v1/mia/viajeros",
      "https://mianoktos.vercel.app/v1/mia/impuestos",
      "https://mianoktos.vercel.app/v1/mia/hoteles",
    ];

    const [viajeros, impuestos, hoteles] = await Promise.all(
      endpoints.map((endpoint) =>
        fetch(endpoint, {
          headers: {
            "x-api-key": API_KEY || "",
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        }).then((res) => res.json())
      )
    );

    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <DashboardModuleWrapper
          viajeros={viajeros}
          impuestos={impuestos}
          hoteles={hoteles}
        />
      </Suspense>
    );
  } catch (error) {
    console.log("error en el dashboard: ", error);
    return <div>Ocurrió un error al obtener los datos.</div>;
  }
}
