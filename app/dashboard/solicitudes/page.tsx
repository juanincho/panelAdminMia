import { Suspense } from "react";
import DashboardModule from "./_components/_dashboard";
import { API_KEY } from "../../constants/constantes";

export default async function Dashboard() {
  try {
    const apiEndpoints = [
      "http://localhost:3001/v1/mia/solicitud",
      "http://localhost:3001/v1/mia/viajeros",
      "http://localhost:3001/v1/mia/impuestos",
    ];
    const responses = await Promise.all(
      apiEndpoints.map((endpoint) =>
        fetch(endpoint, {
          headers: {
            "x-api-key": API_KEY || "",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          cache: "no-store",
        }).then((res) => res.json())
      )
    );
    console.log(responses);
    const [solicitudes, viajeros, impuestos] = responses;

    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <DashboardModule
          data={solicitudes || []}
          viajeros={viajeros || []}
          impuestos={impuestos || []}
        ></DashboardModule>
      </Suspense>
    );
  } catch (error) {
    console.log(error);
    return (
      <div>
        <h1>Ocurrió un error al obtener los registros.</h1>
      </div>
    );
  }
}
