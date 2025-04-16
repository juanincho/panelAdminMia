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

export type Agente = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    full_name: string;
    phone: string;
    phone_verified: boolean;
    sub: string;
  };
  identities: any; // o null, o un tipo más específico si los llegas a usar
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
};