import { API_KEY } from "@/app/constants/constantes";

export const fetchViajeros = async (id, callback) => {
  if (!id) {
    console.log("No hay id de viajero");
    return;
  }
  try {
    const response = await fetch(
      `https://mianoktos.vercel.app/v1/mia/viajeros/id?id=${id}`,
      {
        headers: {
          "x-api-key": API_KEY || "",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        cache: "no-store",
      }
    ).then((res) => res.json());
    callback(response);
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de los viajeros");
  }
};
