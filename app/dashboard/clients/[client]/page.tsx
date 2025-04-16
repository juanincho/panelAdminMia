import { Suspense } from "react";
import { API_KEY } from "@/app/constants/constantes";
import DetailsClient from "../_components/DetailsClient";

const Client = async ({ params }: { params: Promise<{ client: string }> }) => {
  try {
    const { client } = await params;
    const responses = await fetch(
      `https://mianoktos.vercel.app/v1/mia/empresas/id?id=${client}`,
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
      console.log(json);
      throw new Error("Error al cargar los datos");
    }
    console.log(json);

    return (
      <Suspense fallback={<h1>Cargando...</h1>}>
        <DetailsClient company={json}></DetailsClient>
      </Suspense>
    );
  } catch (error) {
    console.log(error);
    return <h1>Ocurrio un error...</h1>;
  }
};
export default Client;
