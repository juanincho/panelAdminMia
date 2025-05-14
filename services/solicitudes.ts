import { API_KEY } from "./constant";

export const fetchSolicitudes = async (
  filters: TypeFilters,
  callback: (data: Solicitud[]) => void
) => {
  try {
    console.log("filters:", filters);

    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const url = `https://mianoktos.vercel.app/v1/mia/solicitud?${queryParams.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        "Cache-Control": "no-cache",
      },
    });

    const data = await res.json();
    console.log(data);
    callback(data);
    return data;
  } catch (err) {
    console.error("Error al actualizar solicitudes:", err);
  }
};
