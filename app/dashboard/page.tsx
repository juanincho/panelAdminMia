import { Suspense } from "react";
import DashboardModule from "./_dashboard";
// import { TEST_RESERVATIONS } from "../../constants/mockData.ts";

export default async function Dashboard() {
  try {
    // Realiza la petición desde el servidor
    const res = await fetch("http://localhost:3001/v1/mia/solicitud", {
      headers: {
        "x-api-key": API_KEY || "",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
      cache: "no-store",
    });

    // Convierte la respuesta a JSON
    const json = await res.json();

    console.log(json);

    return (
      <Suspense fallback={<div>Cargando...</div>}>
        <DashboardModule data={json || []}></DashboardModule>
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

const API_KEY: string =
  "nkt-U9TdZU63UENrblg1WI9I1Ln9NcGrOyaCANcpoS2PJT3BlbkFJ1KW2NIGUYF87cuvgUF3Q976fv4fPrnWQroZf0RzXTZTA942H3AMTKFKJHV6cTi8c6dd6tybUD65fybhPJT3BlbkFJ1KW2NIGPrnWQroZf0RzXTZTA942H3AMTKFy15whckAGSSRSTDvsvfHsrtbXhdrT";
