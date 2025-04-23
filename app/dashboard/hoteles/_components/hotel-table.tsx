
export interface FullHotelData {
  id_hotel?: string;
  nombre?: string;
  id_cadena?: number;
  correo?: string;
  telefono?: string;
  rfc?: string;
  razon_social?: string;
  direccion?: string;
  latitud?: string;
  longitud?: string;
  convenio?: string | null;
  descripcion?: string | null;
  calificacion?: number | null;
  tipo_hospedaje?: string;
  cuenta_de_deposito?: string | null;
  estado?: string;
  ciudad_zona?: string;
  NoktosQ?: number;
  NoktosQQ?: number;
  MenoresEdad?: string;
  PaxExtraPersona?: string;
  DesayunoIncluido?: string;
  DesayunoComentarios?: string;
  DesayunoPrecioPorPersona?: string;
  Transportacion?: string;
  TransportacionComentarios?: string;
  URLImagenHotel?: string;
  URLImagenHotelQ?: string;
  URLImagenHotelQQ?: string;
  Activo?: number;
  Comentarios?: string | null;
  Id_Sepomex?: number | null;
  CodigoPostal?: string;
  Id_hotel_excel?: number;
  Colonia?: string;
  precio_sencilla?: number;
  precio_doble?: number;
}


interface HotelTableProps {
  data: FullHotelData[];
  onRowClick: (hotel: FullHotelData) => void;
}

export function HotelTable({ data, onRowClick }: HotelTableProps) {
  const handleRowClick = (hotel: FullHotelData) => {
    console.log("Hotel seleccionado:", hotel);
    onRowClick(hotel);
  };

  return (
    <div className="overflow-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Dirección</th>
            <th className="px-4 py-2 text-left">Estado</th>
            <th className="px-4 py-2 text-left">Ciudad</th>
            <th className="px-4 py-2 text-left">Precios</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((hotel) => (
            <tr
              key={hotel.id_hotel}
              onClick={() => handleRowClick(hotel)}
              className="hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <td className="px-4 py-2">{hotel.nombre}</td>
              <td className="px-4 py-2">{hotel.direccion}</td>
              <td className="px-4 py-2">{hotel.estado}</td>
              <td className="px-4 py-2">{hotel.ciudad_zona}</td>
              <td className="px-4 py-2">
                Sencilla: ${hotel.precio_sencilla || "N/A"} <br />
                Doble: ${hotel.precio_doble || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
