import { URL, API_KEY } from "./constant/index";

export async function fetchCreateReserva(reserva) {
  try {
    const response = await fetch(`${URL}/mia/reservas/operaciones`, {
      method: "POST",
      headers: {
        "x-api-key": API_KEY || "",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reserva),
      cache: "no-store",
    }).then((res) => res.json());

    console.log(response);

    if (response.error) {
      throw new Error("Error al cargar los datos en reservas");
    }

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const fetchReservations = async (client, callback) => {
  try {
    // Replace with your actual API endpoint
    const data = await fetch(`${URL}/mia/reservas/empresa?id=${client}`, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY || "",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }).then((res) => res.json());
    callback(data);
  } catch (error) {
    throw error;
  }
};
