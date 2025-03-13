export interface Company {
  id_empresa: string;
  razon_social: string;
  rfc: string;
  nombre_comercial: string;
  direccion: string;
  direccion_fiscal: string;
  codigo_postal_fiscal: string;
  regimen_fiscal: string;
  status: "active" | "inactive";
}

export interface Traveler {
  id_viajero: string;
  id_empresa: string;
  primer_nombre: string;
  segundo_nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  fecha_nacimiento: string;
  genero: "m" | "f";
  telefono: number;
  status: "active" | "inactive";
}

export interface Tax {
  id_impuesto: number;
  name: string;
  rate: number;
}
