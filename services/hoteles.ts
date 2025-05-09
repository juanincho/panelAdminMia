import { API_KEY } from "./constant";

export const fetchHoteles = async (callback: (data) => void = (data) => {}) => {
  try {
    const response = await fetch(
      "https://mianoktos.vercel.app/v1/mia/hoteles",
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
    if (response.error) {
      console.log("Error en la respuesta de hoteles: ", response.error);
      throw new Error("Error al cargar los datos de los hoteles");
    }
    callback(response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Error al cargar los datos de los hoteles");
  }
};
