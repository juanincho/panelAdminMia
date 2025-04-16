import { Suspense } from "react";
import ClientsTable from "./_components/clientsPage";
import { API_KEY } from "@/app/constants/constantes";

export default async function PageClient() {
  try {
    const responses = await fetch(
      "https://mianoktos.vercel.app/v1/mia/empresas",
      {
        headers: {
          "x-api-key": API_KEY || "",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      }
    );
    const json = await responses.json();
    if (json.error) {
      throw new Error("Error al cargar los datos");
    }

    console.log(json);

    return (
      <Suspense fallback={<h1>Cargando...</h1>}>
        <ClientsTable companies={json || []}></ClientsTable>
      </Suspense>
    );
  } catch (error) {
    console.log(error);
    return <h1>Ocurrio un error...</h1>;
  }
}
