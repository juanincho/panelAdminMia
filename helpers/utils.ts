export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split("T")[0].split("-");
  const date = new Date(+year, +month - 1, +day);
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const formatRoom = (room: string) => {
  let response = room;
  if (response.toUpperCase() == "SINGLE") {
    response = "SENCILLA";
  } else if (response.toUpperCase() == "DOUBLE") {
    response = "DOBLE";
  }
  return response;
};

function quitarAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
