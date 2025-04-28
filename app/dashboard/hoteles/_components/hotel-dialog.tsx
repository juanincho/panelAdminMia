"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { API_KEY } from "@/app/constants/constantes";
import { Pencil, Trash2, ArrowLeft, Plus, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const sanitizeUrl = (url: string) => {
  return url.replace(/^httpss:\/\//, "https://");
};

const getValidImageUrl = (url: string | null | undefined) => {
  if (!url || !url.startsWith("http")) {
    return "https://via.placeholder.com/600x400?text=Sin+imagen";
  }
  return sanitizeUrl(url);
};

// Interfaces
interface CodigoPostalData {
  id: number;
  d_codigo: string;
  d_asenta: string;
  d_tipo_asenta: string;
  D_mnpio: string;
  d_estado: string;
  d_ciudad: string;
  c_estado: number;
  c_mnpio: number;
  c_cve_ciudad: number;
}

interface Agente {
  id_agente: string;
  primer_nombre: string;
  correo: string;
  [key: string]: any;
}

interface HabitacionData {
  incluye: boolean;
  tipo_desayuno: string;
  precio: string;
  comentarios: string;
  precio_noche_extra: string;
  precio_persona_extra?: string;
}

interface TarifaData {
  info_agente: string;
  id_tarifa?: number;
  precio?: string;
  id_agente?: string | null;
  id_hotel?: string;
  id_tipos_cuartos?: number; // 1 = sencilla, 2 = doble
  costo?: string;
  incluye_desayuno?: number;
  precio_desayuno?: string | null;
  precio_noche_extra?: string | null;
  comentario_desayuno?: string | null;
  precio_persona_extra?: string | null;
  tipo_desayuno?: string | null;
}

interface TarifaPreferencial {
  id_tarifa_sencilla?: number; // ID for the single room rate (type 1)
  id_tarifa_doble?: number; // ID for the double room rate (type 2)
  id_agente: string;
  nombre_agente: string;
  correo_agente: string;
  costo_q: string;
  precio_q: string;
  costo_qq: string;
  precio_qq: string;
  sencilla: HabitacionData;
  doble: HabitacionData;
  
  busqueda: {
    nombre: string;
    correo: string;
    resultados: Agente[];
    buscando: boolean;
  };
}

export interface FullHotelData {
  Id_hotel_excel?: number;
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
  Estado?: string;
  Cuidad_Zona?: string;
  noktosq?: number;
  noktosqq?: number;
  MenoresEdad?: string;
  paxextrapersona?: string;
  desayunoincluido?: string;
  desayunocomentarios?: string;
  desayunoprecioporpersona?: string;
  Transportacion?: string;
  TransportacionComentarios?: string;
  URLImagenHotel?: string;
  URLImagenHotelQ?: string;
  URLImagenHotelQQ?: string;
  activo?: number;
  Comentarios?: string | null;
  id_sepomex?: number | null;
  CodigoPostal?: string;
  contacto_convenio?: string | null;
  contacto_recepcion?: string | null;
  Colonia?: string;
  precio_sencilla?: number | string;
  precio_doble?: number | string;
  costo_q?: string;
  precio_q?: string;
  costo_qq?: string;
  precio_qq?: string;
  iva?: string;
  ish?: string | null;
  otros_impuestos?: string;
  tipo_negociacion?: string;
  disponibilidad_precio?: string;
  comentario_pago?: string;
  vigencia_convenio?: string;
  tipo_pago?: string;
}

interface HotelRate {
  id_tarifa_sencilla?: number; // ID for the single room rate (type 1)
  id_tarifa_doble?: number; // ID for the double room rate (type 2)
  id_hotel?: string;
  id_agente?: string | null;
  costo_q?: string;
  precio_q?: string;
  costo_qq?: string;
  precio_qq?: string;
  precio_persona_extra?: string;
  sencilla?: {
    incluye: boolean;
    tipo_desayuno: string;
    precio: string;
    comentarios: string;
    precio_noche_extra: string;
  };
  doble?: {
    incluye: boolean;
    tipo_desayuno: string;
    precio: string;
    comentarios: string;
    precio_noche_extra: string;
    precio_persona_extra: string;
  };
}

interface FormData {
  Id_hotel_excel?: string;
  idSepomex ?: number;
  id_cadena: string;
  activo: number;
  nombre: string;
  correo: string;
  telefono: string;
  CodigoPostal: string;
  calle: string;
  numero: string;
  Colonia: string;
  Estado: string;
  Cuidad_Zona: string;
  municipio: string;
  tipo_negociacion: string;
  vigencia_convenio: string;
  URLImagenHotel: string;
  URLImagenHotelQ: string;
  URLImagenHotelQQ: string;
  tipo_pago: string;
  disponibilidad_precio: string;
  contacto_convenio: string;
  contacto_recepcion: string;
  iva: string;
  ish: string;
  otros_impuestos: string;
  MenoresEdad: string;
  Transportacion: string;
  TransportacionComentarios: string;
  rfc: string;
  razon_social: string;
  calificacion: string;
  tipo_hospedaje: string;
  Comentarios: string;
  latitud: string;
  longitud: string;
  cuenta_de_deposito: string;
  comentario_pago: string;
  costo_q: string;
  precio_q: string;
  costo_qq: string;
  precio_qq: string;
  precio_persona_extra: string;
  sencilla: HabitacionData;
  doble: HabitacionData;
}

interface HotelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotel: FullHotelData | null;
  onSuccess?: () => void;
}

// Interface for preferential rate deletion (updated for both IDs)
interface DeleteTarifaPreferencialProps {
  id_tarifa_preferencial_sencilla?: number | null;
  id_tarifa_preferencial_doble?: number | null;
}

// Reemplaza las funciones actuales con estas versiones mejoradas
const convertToDateInputFormat = (dateString?: string | null): string => {
  if (!dateString) return '';
  
  // Si ya está en formato YYYY-MM-DD, devolverlo directamente
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Si es una fecha ISO, extraer la parte YYYY-MM-DD
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }
  
  // Si está en formato DD-MM-YYYY, convertirlo
  const parts = dateString.split('-');
  if (parts.length === 3 && parts[0].length === 2) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  
  return '';
};

const convertToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  
  // Si ya está en formato DD-MM-YYYY, devolverlo directamente
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return dateString;
  }
  
  // Si es una fecha ISO o YYYY-MM-DD, convertirla
  const cleanDate = dateString.split('T')[0];
  const parts = cleanDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  
  return '';
};
// API Functions
const buscarCodigoPostal = async (CodigoPostal: string) => {
  
  try {
    console.log("Veamos si estamos pasado algo", CodigoPostal)
    const response = await fetch(
      `http://localhost:5173/v1/sepoMex/buscar-codigo-postal?d_codigo=${CodigoPostal}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY || "",
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("revisemos el objeto de colonias: ",data)

    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error al buscar código postal:", error);
    return [];
  }
};

const buscarAgentes = async (nombre: string, correo: string) => {
  try {
    const response = await fetch(
      `http://localhost:5173/v1/mia/agentes/get-agente-id?nombre=${encodeURIComponent(nombre)}&correo=${encodeURIComponent(correo)}`,
      {
        method: "GET",
        headers: {
          "x-api-key": API_KEY || "",
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      console.error("Error en la respuesta:", response.status);
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error al buscar agentes:", error);
    return [];
  }
};

// Extract components from direccion (simple parsing)
const extractDireccionData = (direccion?: string) => {
  const defaultData = { calle: '', numero: '' };
  if (!direccion) return defaultData;
  
  // Try to parse the address - this is a simple approach, might need adjusting
  const match = direccion.match(/^([^,]+),([^,]+)/);
  if (match) {
    return {
      calle: match[1].trim(),
      numero: match[2].trim()
    };
  }
  return defaultData;
};

export function HotelDialog({
  open,
  onOpenChange,
  hotel,
  onSuccess
}: HotelDialogProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingRates, setIsFetchingRates] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("datosBasicos");
  const [colonias, setColonias] = useState<CodigoPostalData[]>([]);
  const [buscandoCP, setBuscandoCP] = useState(false);
  const [tarifasPreferenciales, setTarifasPreferenciales] = useState<TarifaPreferencial[]>([]);
  const [hotelRates, setHotelRates] = useState<HotelRate | null>(null);
  const [editingTarifaId, setEditingTarifaId] = useState<number | null>(null);
  const [deleteTarifaDialogOpen, setDeleteTarifaDialogOpen] = useState(false);
  const [selectedTarifaToDelete, setSelectedTarifaToDelete] = useState<DeleteTarifaPreferencialProps | null>(null);

  const defaultFormData: FormData = {
    id_cadena: "",
    activo: 1,
    nombre: "",
    correo: "",
    telefono: "",
    CodigoPostal: "",
    calle: "",
    numero: "",
    Colonia: "",
    Estado: "",
    Cuidad_Zona: "",
    municipio: "",
    tipo_negociacion: "",
    vigencia_convenio: "",
    URLImagenHotel: "",
    URLImagenHotelQ: "",
    URLImagenHotelQQ: "",
    tipo_pago: "",
    disponibilidad_precio: "",
    contacto_convenio: "",
    contacto_recepcion: "",
    iva: "",
    ish: "",
    otros_impuestos: "",
    MenoresEdad: "",
    Transportacion: "",
    TransportacionComentarios: "",
    rfc: "",
    razon_social: "",
    calificacion: "",
    tipo_hospedaje: "hotel",
    Comentarios: "",
    latitud: "",
    longitud: "",
    cuenta_de_deposito: "",
    comentario_pago: "",
    costo_q: "",
    precio_q: "",
    costo_qq: "",
    precio_qq: "",
    precio_persona_extra: "",
    sencilla: {
      incluye: false,
      tipo_desayuno: "",
      precio: "",
      comentarios: "",
      precio_noche_extra: "",
    },
    doble: {
      incluye: false,
      tipo_desayuno: "",
      precio: "",
      comentarios: "",
      precio_noche_extra: "",
      precio_persona_extra: "",
    },
  }
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    if (open && hotel?.id_hotel && hasFetched.current !== hotel.id_hotel) {
      fetchHotelRates(hotel.id_hotel);
      hasFetched.current = hotel.id_hotel;
    }

    if (!open) {
      hasFetched.current = null;
      setHotelRates(null);
      setFormData(defaultFormData);
      setTarifasPreferenciales([]);
      setMode("view");
      setErrorMessage("");
      setSuccessMessage("");
      setEditingTarifaId(null);
      setSelectedTarifaToDelete(null);
    }
  }, [open, hotel?.id_hotel]);
  
  useEffect(() => {
    if (hotel) {
      const direccionData = extractDireccionData(hotel.direccion);
      
      setFormData({
        Id_hotel_excel: hotel.Id_hotel_excel?.toString() || "",
        id_cadena: hotel.id_cadena?.toString() || "",
        activo: hotel.activo ?? 1,
        nombre: hotel.nombre || "",
        correo: hotel.correo || "",
        telefono: hotel.telefono || "",
        CodigoPostal: hotel.CodigoPostal || "",
        calle: direccionData.calle,
        numero: direccionData.numero,
        Colonia: hotel.Colonia || "",
        Estado: hotel.Estado || "",
        Cuidad_Zona: hotel.Cuidad_Zona || "",
        municipio: "",
        tipo_negociacion: hotel.tipo_negociacion || "",
        vigencia_convenio:convertToDDMMYYYY(hotel.vigencia_convenio),
        URLImagenHotel: hotel.URLImagenHotel || "",
        URLImagenHotelQ: hotel.URLImagenHotelQ || "",
        URLImagenHotelQQ: hotel.URLImagenHotelQQ || "",
        tipo_pago: hotel.tipo_pago || "", 
        disponibilidad_precio: hotel.disponibilidad_precio || "",
        contacto_convenio: hotel.contacto_convenio || "",
        contacto_recepcion: hotel.contacto_recepcion || "",
        iva: hotel.iva || "",
        ish: hotel.ish || "",
        otros_impuestos: hotel.otros_impuestos || "",
        MenoresEdad: hotel.MenoresEdad || "",
        Transportacion: hotel.Transportacion || "",
        TransportacionComentarios: hotel.TransportacionComentarios || "",
        rfc: hotel.rfc || "",
        razon_social: hotel.razon_social || "",
        calificacion: hotel.calificacion?.toString() || "",
        tipo_hospedaje: hotel.tipo_hospedaje || "hotel",
        Comentarios: hotel.Comentarios || "",
        latitud: hotel.latitud || "",
        longitud: hotel.longitud || "",
        cuenta_de_deposito: hotel.cuenta_de_deposito || "",
        comentario_pago: hotel.comentario_pago || "",
        costo_q: hotel.costo_q || "",
        precio_q: hotel.precio_sencilla?.toString() || "",
        costo_qq: hotel.costo_qq || "",
        precio_qq: hotel.precio_doble?.toString() || "",
        precio_persona_extra: hotel.paxextrapersona || "",
        sencilla: {
          incluye: hotel.desayunoincluido === "SI",
          tipo_desayuno: "",
          precio: hotel.desayunoprecioporpersona || "",
          comentarios: hotel.desayunocomentarios || "",
          precio_noche_extra: "",
        },
        doble: {
          incluye: hotel.desayunoincluido === "SI",
          tipo_desayuno: "",
          precio: hotel.desayunoprecioporpersona || "",
          comentarios: hotel.desayunocomentarios || "",
          precio_noche_extra: "",
          precio_persona_extra: hotel.paxextrapersona || "",
        },
      });

      if (hotel.CodigoPostal && hotel.CodigoPostal.length === 5) {
        handleCodigoPostalChange(hotel.CodigoPostal);

      }
    }
  }, [hotel]);

  useEffect(() => {
    if (!hotelRates || !hotel?.id_hotel) return;

    setFormData(prev => {
      const newFormData = {
        ...prev,
        costo_q: hotelRates.costo_q || prev.costo_q,
        precio_q: hotelRates.precio_q || prev.precio_q,
        costo_qq: hotelRates.costo_qq || prev.costo_qq,
        precio_qq: hotelRates.precio_qq || prev.precio_qq,
        precio_persona_extra: hotelRates.precio_persona_extra || prev.precio_persona_extra,
      };

      if (hotelRates.sencilla) {
        newFormData.sencilla = {
          ...prev.sencilla,
          incluye: hotelRates.sencilla.incluye ?? prev.sencilla.incluye,
          tipo_desayuno: hotelRates.sencilla.tipo_desayuno || prev.sencilla.tipo_desayuno,
          precio: hotelRates.sencilla.precio || prev.sencilla.precio,
          comentarios: hotelRates.sencilla.comentarios || prev.sencilla.comentarios,
          precio_noche_extra: hotelRates.sencilla.precio_noche_extra || prev.sencilla.precio_noche_extra,
        };
      }

      if (hotelRates.doble) {
        newFormData.doble = {
          ...prev.doble,
          incluye: hotelRates.doble.incluye ?? prev.doble.incluye,
          tipo_desayuno: hotelRates.doble.tipo_desayuno || prev.doble.tipo_desayuno,
          precio: hotelRates.doble.precio || prev.doble.precio,
          comentarios: hotelRates.doble.comentarios || prev.doble.comentarios,
          precio_noche_extra: hotelRates.doble.precio_noche_extra || prev.doble.precio_noche_extra,
          precio_persona_extra: hotelRates.doble.precio_persona_extra || prev.doble.precio_persona_extra,
        };
      }

      return newFormData;
    });
  }, [hotelRates, hotel?.id_hotel]);

  const fetchHotelRates = async (idHotel: string) => {
    try {
      setIsFetchingRates(true);
      const response = await fetch(`http://localhost:5173/v1/mia/hoteles/Consultar-tarifas-por-hotel/${idHotel}`, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.tarifas && Array.isArray(result.tarifas)) {
        const standardRates = result.tarifas.filter((t: TarifaData) => t.id_agente === null);
        const preferentialRates = result.tarifas.filter((t: TarifaData) => t.id_agente !== null);

        const processedRates: HotelRate = {
          costo_q: "",
          precio_q: "",
          costo_qq: "",
          precio_qq: "",
          precio_persona_extra: "",
          sencilla: {
            incluye: false,
            tipo_desayuno: "",
            precio: "",
            comentarios: "",
            precio_noche_extra: "",
          },
          doble: {
            incluye: false,
            tipo_desayuno: "",
            precio: "",
            comentarios: "",
            precio_noche_extra: "",
            precio_persona_extra: "",
          },
        };

        standardRates.forEach((tarifa: TarifaData) => {
          if (tarifa.id_tipos_cuartos === 1) {
            processedRates.id_tarifa_sencilla = tarifa.id_tarifa;
            processedRates.sencilla = {
              incluye: tarifa.incluye_desayuno === 1,
              tipo_desayuno: tarifa.tipo_desayuno || "",
              precio: tarifa.precio_desayuno || "",
              comentarios: tarifa.comentario_desayuno || "",
              precio_noche_extra: tarifa.precio_noche_extra || "",
            };
            processedRates.costo_q = tarifa.costo || "";
            processedRates.precio_q = tarifa.precio || "";
          }

          if (tarifa.id_tipos_cuartos === 2) {
            processedRates.id_tarifa_doble = tarifa.id_tarifa;
            processedRates.doble = {
              incluye: tarifa.incluye_desayuno === 1,
              tipo_desayuno: tarifa.tipo_desayuno || "",
              precio: tarifa.precio_desayuno || "",
              comentarios: tarifa.comentario_desayuno || "",
              precio_noche_extra: tarifa.precio_noche_extra || "",
              precio_persona_extra: tarifa.precio_persona_extra || "",
            };
            processedRates.costo_qq = tarifa.costo || "";
            processedRates.precio_qq = tarifa.precio || "";
          }
        });

        setHotelRates(processedRates);

        const groupedRates = new Map<string, { sencilla?: TarifaData; doble?: TarifaData }>();

        preferentialRates.forEach((rate: TarifaData) => {
          if (!rate.id_agente) return;

          if (!groupedRates.has(rate.id_agente)) {
            groupedRates.set(rate.id_agente, {});
          }

          const agentRates = groupedRates.get(rate.id_agente);
          if (agentRates) {
            if (rate.id_tipos_cuartos === 1) {
              agentRates.sencilla = rate;
            } else if (rate.id_tipos_cuartos === 2) {
              agentRates.doble = rate;
            }
          }
        });

        const tarifasArray: TarifaPreferencial[] = [];

        groupedRates.forEach((rates, agentId) => {
          const { sencilla, doble } = rates;
          
          const tarifaPreferencial: TarifaPreferencial = {
            id_agente: agentId,
            nombre_agente: "",
            correo_agente: "",
            costo_q: sencilla?.costo || "",
            precio_q: sencilla?.precio || "",
            costo_qq: doble?.costo || "",
            precio_qq: doble?.precio || "",
            sencilla: {
              incluye: sencilla?.incluye_desayuno === 1,
              tipo_desayuno: sencilla?.tipo_desayuno || "",
              precio: sencilla?.precio_desayuno || "",
              comentarios: sencilla?.comentario_desayuno || "",
              precio_noche_extra: sencilla?.precio_noche_extra || "",
            },
            doble: {
              incluye: doble?.incluye_desayuno === 1,
              tipo_desayuno: doble?.tipo_desayuno || "",
              precio: doble?.precio_desayuno || "",
              comentarios: doble?.comentario_desayuno || "",
              precio_noche_extra: doble?.precio_noche_extra || "",
              precio_persona_extra: doble?.precio_persona_extra || "",
            },
            busqueda: {
              nombre: "",
              correo: "",
              resultados: [],
              buscando: false,
            },
          };

          if (sencilla?.id_tarifa) {
            tarifaPreferencial.id_tarifa_sencilla = sencilla.id_tarifa;
          }
          if (doble?.id_tarifa) {
            tarifaPreferencial.id_tarifa_doble = doble.id_tarifa;
          }

          const rateWithInfo = sencilla || doble;
          if (rateWithInfo?.info_agente) {
            const [nombre = "", correo = ""] = rateWithInfo.info_agente.split(' ');
            tarifaPreferencial.nombre_agente = nombre;
            tarifaPreferencial.correo_agente = correo;
            tarifaPreferencial.busqueda.nombre = nombre;
            tarifaPreferencial.busqueda.correo = correo;
          }

          tarifasArray.push(tarifaPreferencial);
        });

        setTarifasPreferenciales(tarifasArray);
      }
    } catch (error) {
      console.error("Error al consultar tarifas:", error);
      setErrorMessage("Error al cargar las tarifas del hotel");
    } finally {
      setIsFetchingRates(false);
    }
  };
  
  
  // Handler for código postal search
  const handleCodigoPostalChange = async (codigo: string) => {
    setFormData(prev => ({ ...prev, CodigoPostal: codigo }));
    
    if (codigo.length === 5) {
      setBuscandoCP(true);
      try {
        const data = await buscarCodigoPostal(codigo);
        setColonias(data);
        
        if (data.length > 0) {
          const primerResultado = data[0];
          setFormData(prev => ({
            ...prev,
            Estado: primerResultado.d_estado,
            Ciudad_Zona: primerResultado.d_ciudad,
            municipio: primerResultado.D_mnpio,
            idSepomex: primerResultado.id
          }));
        }
      } catch (error) {
        console.error("Error al buscar código postal:", error);
      } finally {
        setBuscandoCP(false);
      }
    } else {
      setColonias([]);
    }
  };

  // Handler for Colonia selection
  const handleColoniaChange = (coloniaId: string) => {
    const coloniaSeleccionada = colonias.find(
      (c) => c.id.toString() === coloniaId
    );
    if (coloniaSeleccionada) {
      setFormData((prev) => ({
        ...prev,
        colonia: coloniaSeleccionada.d_asenta,
        id_sepomex: coloniaSeleccionada.id
      }));
    }
  };
  // Generic form field change handler
  const handleChange = (field: string, value: any) => {
    if (mode === "view") return;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData] as object,
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handler for agent search within preferential rates
  const handleSearch = async (index: number) => {
    const tarifa = tarifasPreferenciales[index];
    if (tarifa.busqueda.nombre.trim() === "" && tarifa.busqueda.correo.trim() === "") {
      const newTarifas = [...tarifasPreferenciales];
      newTarifas[index].busqueda.resultados = [];
      setTarifasPreferenciales(newTarifas);
      return;
    }
    
    const newTarifas = [...tarifasPreferenciales];
    newTarifas[index].busqueda.buscando = true;
    setTarifasPreferenciales(newTarifas);
    
    try {
      const agentes = await buscarAgentes(tarifa.busqueda.nombre, tarifa.busqueda.correo);
      newTarifas[index].busqueda.resultados = agentes;
      newTarifas[index].busqueda.buscando = false;
      setTarifasPreferenciales(newTarifas);
    } catch (error) {
      console.error("Error al buscar agentes:", error);
      newTarifas[index].busqueda.buscando = false;
      setTarifasPreferenciales(newTarifas);
    }
  };

  // Handle search input change
  const handleSearchInputChange = (index: number, field: 'nombre' | 'correo', value: string) => {
    const newTarifas = [...tarifasPreferenciales];
    newTarifas[index].busqueda[field] = value;
    setTarifasPreferenciales(newTarifas);
  };

  // Handle agent selection
  const handleSelectAgente = (index: number, agente: Agente) => {
    const newTarifas = [...tarifasPreferenciales];
    newTarifas[index].id_agente = agente.id_agente;
    newTarifas[index].nombre_agente = agente.primer_nombre;
    newTarifas[index].correo_agente = agente.correo;
    newTarifas[index].busqueda.nombre = agente.primer_nombre;
    newTarifas[index].busqueda.correo = agente.correo;
    newTarifas[index].busqueda.resultados = [];
    setTarifasPreferenciales(newTarifas);
  };

  // Handle preferential rate change
  const handleTarifaPreferencialChange = (
    index: number,
    field: string,
    value: any
  ) => {
    if (mode === "view") return;
    
    const newTarifas = [...tarifasPreferenciales];
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.') as [keyof TarifaPreferencial, string];
      if (parent === 'sencilla' || parent === 'doble') {
        newTarifas[index][parent] = {
          ...newTarifas[index][parent],
          [child]: value
        };
      } else if (parent === 'busqueda') {
        newTarifas[index].busqueda = {
          ...newTarifas[index].busqueda,
          [child]: value
        };
      }
    } else {
      // For top-level properties
      newTarifas[index] = {
        ...newTarifas[index],
        [field]: value
      };
    }
    
    setTarifasPreferenciales(newTarifas);
  };

  // Add a new preferential rate
  const addTarifaPreferencial = () => {
    if (mode === "view") return;
    
    setTarifasPreferenciales([
      ...tarifasPreferenciales,
      {
        id_agente: "",
        nombre_agente: "",
        correo_agente: "",
        costo_q: "",
        precio_q: "",
        costo_qq: "",
        precio_qq: "",
        sencilla: {
          incluye: false,
          tipo_desayuno: "",
          precio: "",
          comentarios: "",
          precio_noche_extra: "",
        },
        doble: {
          incluye: false,
          tipo_desayuno: "",
          precio: "",
          comentarios: "",
          precio_persona_extra: "",
          precio_noche_extra: "",
        },
        busqueda: {
          nombre: "",
          correo: "",
          resultados: [],
          buscando: false
        }
      },
    ]);
  };

  // Remove a preferential rate
  const removeTarifaPreferencial = (index: number) => {
    if (mode === "view") return;
    
    const newTarifas = tarifasPreferenciales.filter((_, i) => i !== index);
    setTarifasPreferenciales(newTarifas);
  };

  // Handle delete hotel
  const handleDelete = async () => {
    const id_hotel = hotel?.id_hotel;

    if (!id_hotel) {
      setErrorMessage("ID de hotel no encontrado");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5173/v1/mia/hoteles/Eliminar-hotel/`,
        {
          method: "PATCH",
          headers: {
            "x-api-key": API_KEY || "",
            "Content-Type": "application/json",
          },
          body:JSON.stringify({id_hotel}),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      setSuccessMessage("Hotel eliminado exitosamente");
      
      setTimeout(() => {
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || "Error al eliminar el hotel");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Handle update hotel
  const handleUpdate = async () => {
    if (!hotel?.id_hotel) {
      setErrorMessage("ID de hotel no encontrado");
      return;
    }
  
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      // First, get the current rates to obtain the IDs
      const response = await fetch(
        `http://localhost:5173/v1/mia/hoteles/Consultar-tarifas-por-hotel/${hotel.id_hotel}`,
        {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Error al obtener las tarifas actuales");
      }
  
      const result = await response.json();
      const currentRates = result.tarifas || [];
  
      // Helper function to find rate ID
      const findRateId = (agentId: string | null, roomType: number) => {
        return currentRates.find((rate: TarifaData) => 
          rate.id_agente === agentId && rate.id_tipos_cuartos === roomType
        )?.id_tarifa;
      };
  
      // Get IDs for standard rates
      const sencillaId = findRateId(null, 1);
      const dobleId = findRateId(null, 2);
  
      // Construir la dirección completa
      const direccionCompleta = `${formData.calle || ""},${formData.numero || ""} ,${formData.Colonia}, ${formData.municipio}, ${formData.Estado}, CP ${formData.CodigoPostal}`;
      
      // 1. Actualizar información del hotel
      const hotelPayload = {
        id_hotel: hotel.id_hotel,
        Id_hotel_excel: formData.Id_hotel_excel ? Number(formData.Id_hotel_excel) : null,
        tipo_negociacion: formData.tipo_negociacion || null,
        vigencia_convenio: formData.vigencia_convenio || null,
        nombre: formData.nombre,
        id_cadena: Number(formData.id_cadena),
        correo: formData.correo || null,
        telefono: formData.telefono || null,
        rfc: formData.rfc || null,
        razon_social: formData.razon_social || null,
        direccion: direccionCompleta,
        latitud: formData.latitud || null,
        longitud: formData.longitud || null,
        Estado: formData.Estado,
        Cuidad_Zona: formData.Cuidad_Zona,
        CodigoPostal: formData.CodigoPostal,
        Colonia: formData.Colonia,
        municipio: formData.municipio,
        tipo_hospedaje: formData.tipo_hospedaje || 'hotel',
        cuenta_de_deposito: formData.cuenta_de_deposito || null,
        tipo_pago: formData.tipo_pago || null,
        disponibilidad_precio: formData.disponibilidad_precio || null,
        contacto_convenio: formData.contacto_convenio || null,
        contacto_recepcion: formData.contacto_recepcion || null,
        iva: formData.iva || null,
        ish: formData.ish || null,
        otros_impuestos: formData.otros_impuestos || null,
        MenoresEdad: formData.MenoresEdad || null,
        paxExtraPersona: formData.precio_persona_extra || null,
        Transportacion: formData.Transportacion || null,
        TransportacionComentarios: formData.TransportacionComentarios || null,
        URLImagenHotel: formData.URLImagenHotel || null,
        URLImagenHotelQ: formData.URLImagenHotelQ || null,
        URLImagenHotelQQ: formData.URLImagenHotelQQ || null,
        calificacion: formData.calificacion ? Number(formData.calificacion) : null,
        activo: formData.activo !== undefined ? formData.activo : 1,
        Comentarios: formData.Comentarios || null,
        idSepomex : formData.idSepomex ? Number(formData.idSepomex): null,
        comentario_pago: formData.comentario_pago || ""
      };
  
      const hotelResponse = await fetch(
        `http://localhost:5173/v1/mia/hoteles/Editar-hotel/`,
        {
          method: "PATCH",
          headers: {
            "x-api-key": API_KEY || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hotelPayload),
        }
      );
      console.log("exploremos la response",hotelResponse)
      if (!hotelResponse.ok) {
        const errorData = await hotelResponse.json();
        throw new Error(errorData.message || `Error ${hotelResponse.status}: ${hotelResponse.statusText}`);
      }
  
      // 2. Update standard rates
      const formatNumber = (value: any) => {
        if (value === null || value === undefined || value === '') return "0.00";
        const num = Number(value);
        return isNaN(num) ? "0.00" : num.toFixed(2);
      };
  
      // Standard rate - Single room (type 1)
      const sencillaPayload = {
        id_tarifa: sencillaId,
        id_hotel: hotel.id_hotel,
        id_tipos_cuartos: 1,
        precio: formatNumber(formData.precio_q),
        costo: formatNumber(formData.costo_q),
        incluye_desayuno: formData.sencilla.incluye ? 1 : 0,
        precio_desayuno: formatNumber(formData.sencilla.precio),
        precio_noche_extra: formatNumber(formData.sencilla.precio_noche_extra),
        comentario_desayuno: formData.sencilla.comentarios,
        tipo_desayuno: formData.sencilla.tipo_desayuno,
        precio_persona_extra: null
      };
  
      // Standard rate - Double room (type 2)
      const doblePayload = {
        id_tarifa: dobleId,
        id_hotel: hotel.id_hotel,
        id_tipos_cuartos: 2,
        precio: formatNumber(formData.precio_qq),
        costo: formatNumber(formData.costo_qq),
        incluye_desayuno: formData.doble.incluye ? 1 : 0,
        precio_desayuno: formatNumber(formData.doble.precio),
        precio_noche_extra: formatNumber(formData.doble.precio_noche_extra),
        comentario_desayuno: formData.doble.comentarios,
        tipo_desayuno: formData.doble.tipo_desayuno,
        precio_persona_extra: formatNumber(formData.doble.precio_persona_extra)
      };
  
      // 3. Update preferential rates
      const tarifasPreferencialesPayloads = tarifasPreferenciales.flatMap(tarifa => {
        if (!tarifa.id_agente) return [];
  
        // Use the stored tarifa IDs if available
        const sencillaPreferencialId = tarifa.id_tarifa_sencilla || findRateId(tarifa.id_agente, 1);
        const doblePreferencialId = tarifa.id_tarifa_doble || findRateId(tarifa.id_agente, 2);
  
        return [
          // Single room
          {
            id_tarifa: sencillaPreferencialId,
            id_hotel: hotel.id_hotel,
            id_agente: tarifa.id_agente,
            id_tipos_cuartos: 1,
            precio: formatNumber(tarifa.precio_q),
            costo: formatNumber(tarifa.costo_q),
            incluye_desayuno: tarifa.sencilla.incluye ? 1 : 0,
            precio_desayuno: formatNumber(tarifa.sencilla.precio),
            precio_noche_extra: formatNumber(tarifa.sencilla.precio_noche_extra),
            comentario_desayuno: tarifa.sencilla.comentarios,
            tipo_desayuno: tarifa.sencilla.tipo_desayuno,
            precio_persona_extra: null
          },
          // Double room
          {
            id_tarifa: doblePreferencialId,
            id_hotel: hotel.id_hotel,
            id_agente: tarifa.id_agente,
            id_tipos_cuartos: 2,
            precio: formatNumber(tarifa.precio_qq),
            costo: formatNumber(tarifa.costo_qq),
            incluye_desayuno: tarifa.doble.incluye ? 1 : 0,
            precio_desayuno: formatNumber(tarifa.doble.precio),
            precio_noche_extra: formatNumber(tarifa.doble.precio_noche_extra),
            comentario_desayuno: tarifa.doble.comentarios,
            tipo_desayuno: tarifa.doble.tipo_desayuno,
            precio_persona_extra: formatNumber(tarifa.doble.precio_persona_extra)
          }
        ];
      });
  
      // 4. Execute all rate updates
      const allTarifasPayloads = [sencillaPayload, doblePayload, ...tarifasPreferencialesPayloads];
      
      const tarifasPromises = allTarifasPayloads.map(payload => 
        fetch(`http://localhost:5173/v1/mia/hoteles/Actualiza-tarifa`, {
          method: "PATCH",
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
      );
  
      const tarifasResults = await Promise.all(tarifasPromises);
      const tarifasErrors = tarifasResults.filter(r => !r.ok);
  
      if (tarifasErrors.length > 0) {
        throw new Error("Error al actualizar algunas tarifas");
      }
  
      setSuccessMessage("Hotel y tarifas actualizados correctamente");
      setMode("view");
      
      // Refresh data
      if (onSuccess) onSuccess();
      await fetchHotelRates(hotel.id_hotel);
  
    } catch (error: any) {
      setErrorMessage(error.message || "Error en la actualización");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logical delete of tarifa preferential (updated to handle both IDs)
  const handleDeleteTarifa = async () => {
    if (!selectedTarifaToDelete) {
      setErrorMessage("IDs de tarifa no encontrados");
      return;
    }
  
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      // Call the endpoint for logical deletion with both IDs
      const response = await fetch(
        `http://localhost:5173/v1/mia/hoteles/Eliminar-tarifa-preferencial`,
        {
          method: "PATCH",
          headers: {
            "x-api-key": API_KEY || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_tarifa_preferencial_sencilla: selectedTarifaToDelete.id_tarifa_preferencial_sencilla,
            id_tarifa_preferencial_doble: selectedTarifaToDelete.id_tarifa_preferencial_doble
          }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
  
      setSuccessMessage("Tarifa preferencial inactivada correctamente");
      
      // Refresh the hotel rates to reflect the changes
      if (hotel?.id_hotel) {
        await fetchHotelRates(hotel.id_hotel);
      }
      
      // Close the dialog
      setDeleteTarifaDialogOpen(false);
      setSelectedTarifaToDelete(null);
      
    } catch (error: any) {
      setErrorMessage(error.message || "Error al inactivar la tarifa preferencial");
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing a specific tarifa
  const startEditingTarifa = (index: number) => {
    setEditingTarifaId(index);
  };

  // Cancel editing a tarifa
  const cancelEditingTarifa = () => {
    setEditingTarifaId(null);
  };

  // Open delete confirmation for a tarifa preferencial (updated to send both IDs)
  const openDeleteTarifaDialog = (index: number) => {
    const tarifa = tarifasPreferenciales[index];
    
    if (!tarifa.id_tarifa_sencilla && !tarifa.id_tarifa_doble) {
      setErrorMessage("No se encontraron tarifas preferenciales para eliminar");
      return;
    }
    
    setSelectedTarifaToDelete({
      id_tarifa_preferencial_sencilla: tarifa.id_tarifa_sencilla || null,
      id_tarifa_preferencial_doble: tarifa.id_tarifa_doble || null
    });
    
    setDeleteTarifaDialogOpen(true);
  };

  if (!hotel) return null;
  const currentMode = mode as "view" | "edit";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {mode === "view" ? "Detalle del hotel" : "Editar hotel"}
            </DialogTitle>
            
            {mode === "view" && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setMode("edit")}
                >
                  <Pencil size={16} className="mr-1" /> Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 size={16} className="mr-1" /> Eliminar
                </Button>
              </div>
            )}
            
            {mode === "edit" && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setMode("view")}
                >
                  <ArrowLeft size={16} className="mr-1" /> Cancelar
                </Button>
                <Button 
                  variant="default"
                  size="sm"
                  onClick={handleUpdate}
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            )}
          </DialogHeader>

          {/* Loading, Success and Error Messages */}
          {(isLoading || isFetchingRates) && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-3">
                {isLoading ? "Procesando..." : "Cargando tarifas..."}
              </span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Tabs Navigation */}
          <Tabs 
            defaultValue="datosBasicos" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="datosBasicos" className="text-sm">
                Datos Básicos
              </TabsTrigger>
              <TabsTrigger value="tarifasServicios" className="text-sm">
                Tarifas y Servicios
              </TabsTrigger>
              <TabsTrigger value="informacionPagos" className="text-sm">
                Información de Pagos
              </TabsTrigger>
              <TabsTrigger value="informacionAdicional" className="text-sm">
                Información Adicional
              </TabsTrigger>
            </TabsList>

            {/* Tab: Datos Básicos */}
            <TabsContent value="datosBasicos" className="space-y-6 min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="Id_hotel_excel">ID Excel (Seguimiento)</Label>
                  <Input 
                    id="Id_hotel_excel"
                    value={formData.Id_hotel_excel || ""} 
                    onChange={(e) => handleChange("Id_hotel_excel", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="nombre">Nombre <span className="text-red-500">*</span></Label>
                  <Input 
                    id="nombre"
                    value={formData.nombre} 
                    onChange={(e) => handleChange("nombre", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    required 
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="correo">Correo Electrónico</Label>
                  <Input 
                    id="correo"
                    type="email"
                    value={formData.correo} 
                    onChange={(e) => handleChange("correo", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input 
                    id="telefono"
                    value={formData.telefono} 
                    onChange={(e) => handleChange("telefono", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="CodigoPostal">Código Postal <span className="text-red-500">*</span></Label>
                  <Input 
                    id="CodigoPostal"
                    value={formData.CodigoPostal}
                    onChange={(e) => mode === "edit" && handleCodigoPostalChange(e.target.value)}
                    maxLength={5}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    required
                  />
                  {buscandoCP && (
                    <span className="text-xs text-blue-600">Buscando código postal...</span>
                  )}
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="calle">Calle</Label>
                  <Input 
                    id="calle"
                    value={formData.calle || ""}
                    onChange={(e) => handleChange("calle", e.target.value)}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="numero">Número</Label>
                  <Input 
                    id="numero"
                    value={formData.numero || ""}
                    onChange={(e) => handleChange("numero", e.target.value)}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>

                {mode === "edit" && colonias.length > 0 ? (
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="Colonia">Colonia <span className="text-red-500">*</span></Label>
                    <Select onValueChange={handleColoniaChange} disabled={currentMode === "view"}>
                      <SelectTrigger id="Colonia" className={`w-full ${currentMode === "view" ? "bg-gray-100" : ""}`}>
                        <SelectValue placeholder={formData.Colonia || "Selecciona una Colonia"} />
                      </SelectTrigger>
                      <SelectContent>
                        {colonias.map((Colonia) => (
                          <SelectItem key={Colonia.id} value={Colonia.id.toString()}>
                            {Colonia.d_asenta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="Colonia">Colonia</Label>
                    <Input 
                      id="Colonia"
                      value={formData.Colonia}
                      onChange={(e) => handleChange("Colonia", e.target.value)}
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                    />
                  </div>
                )}

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="Estado">Estado <span className="text-red-500">*</span></Label>
                  <Input 
                    id="Estado"
                    value={formData.Estado}
                    onChange={(e) => handleChange("Estado", e.target.value)}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="Cuidad_Zona">Ciudad <span className="text-red-500">*</span></Label>
                  <Input 
                    id="Cuidad_Zona"
                    value={formData.Cuidad_Zona}
                    onChange={(e) => handleChange("Cuidad_Zona", e.target.value)}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="municipio">Municipio</Label>
                  <Input 
                    id="municipio"
                    value={formData.municipio}
                    onChange={(e) => handleChange("municipio", e.target.value)}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="tipo_negociacion">Tipo de Negociación</Label>
                  <Input 
                    id="tipo_negociacion"
                    value={formData.tipo_negociacion} 
                    onChange={(e) => handleChange("tipo_negociacion", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="vigencia_convenio">Vigencia Convenio</Label>
                  <Input 
                    id="vigencia_convenio"
                    type="date"
                    value={formData.vigencia_convenio ? convertToDateInputFormat(formData.vigencia_convenio) : ''} 
                    onChange={(e) => handleChange("vigencia_convenio", convertToDDMMYYYY(e.target.value))} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="URLImagenHotel">Imagen Hotel (URL)</Label>
                  <Input 
                    id="URLImagenHotel"
                    value={formData.URLImagenHotel} 
                    onChange={(e) => handleChange("URLImagenHotel", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="URLImagenHotelQ">Imagen Habitación Sencilla (URL)</Label>
                  <Input 
                    id="URLImagenHotelQ"
                    value={formData.URLImagenHotelQ} 
                    onChange={(e) => handleChange("URLImagenHotelQ", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="URLImagenHotelQQ">Imagen Habitación Doble (URL)</Label>
                  <Input 
                    id="URLImagenHotelQQ"
                    value={formData.URLImagenHotelQQ} 
                    onChange={(e) => handleChange("URLImagenHotelQQ", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                {formData.URLImagenHotel && (
                  <div className="flex flex-col space-y-1 col-span-2">
                    <Label>Vista previa de la imagen</Label>
                    <div className="h-40 bg-gray-100 rounded-md overflow-hidden">
                    <img
                        src={getValidImageUrl(hotel.URLImagenHotel)}
                        alt="Imagen del hotel"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== "https://via.placeholder.com/600x400?text=Sin+imagen") {
                            target.src = "https://via.placeholder.com/600x400?text=Sin+imagen";
                          }
                        }}
                        className="rounded w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Tab: Tarifas y Servicios */}
            <TabsContent value="tarifasServicios" className="space-y-6 min-h-[400px]">
              <div>
                <h3 className="text-lg font-semibold mb-4">Tarifa General</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="costo_q">Costo Q <span className="text-red-500">*</span></Label>
                    <Input 
                      id="costo_q"
                      placeholder="0.00" 
                      value={formData.costo_q} 
                      onChange={(e) => handleChange("costo_q", e.target.value)} 
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                      required 
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="precio_q">Precio Q <span className="text-red-500">*</span></Label>
                    <Input 
                      id="precio_q"
                      placeholder="0.00" 
                      value={formData.precio_q} 
                      onChange={(e) => handleChange("precio_q", e.target.value)} 
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                      required 
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="costo_qq">Costo QQ <span className="text-red-500">*</span></Label>
                    <Input 
                      id="costo_qq"
                      placeholder="0.00" 
                      value={formData.costo_qq} 
                      onChange={(e) => handleChange("costo_qq", e.target.value)} 
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                      required 
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="precio_qq">Precio QQ <span className="text-red-500">*</span></Label>
                    <Input 
                      id="precio_qq"
                      placeholder="0.00" 
                      value={formData.precio_qq} 
                      onChange={(e) => handleChange("precio_qq", e.target.value)} 
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="precio_persona_extra">Precio por persona extra</Label>
                    <Input 
                      id="precio_persona_extra"
                      type="number" 
                      placeholder="0.00"
                      value={formData.precio_persona_extra} 
                      onChange={(e) => handleChange("precio_persona_extra", e.target.value)} 
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                    />
                    <span className="text-xs text-gray-500">Solo aplica para habitación doble</span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="sencilla_precio_noche_extra">Precio noche extra (Sencilla)</Label>
                    <Input 
                      id="sencilla_precio_noche_extra"
                      type="number" 
                      placeholder="0.00"
                      value={formData.sencilla.precio_noche_extra} 
                      onChange={(e) => handleChange("sencilla.precio_noche_extra", e.target.value)} 
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="doble_precio_noche_extra">Precio noche extra (Doble)</Label>
                    <Input 
                      id="doble_precio_noche_extra"
                      type="number" 
                      placeholder="0.00"
                      value={formData.doble.precio_noche_extra} 
                      onChange={(e) => handleChange("doble.precio_noche_extra", e.target.value)} 
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                    />
                  </div>
                </div>

                {/* Opciones de desayuno para habitación sencilla */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input 
                      type="checkbox" 
                      id="incluye-sencilla-general"
                      checked={formData.sencilla.incluye} 
                      onChange={(e) => handleChange("sencilla.incluye", e.target.checked)} 
                      disabled={mode === "view"}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="incluye-sencilla-general">¿Incluye desayuno en habitación sencilla?</Label>
                  </div>
                  
                  {formData.sencilla.incluye && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="sencilla_tipo_desayuno">Tipo de desayuno</Label>
                        <Input 
                          id="sencilla_tipo_desayuno"
                          value={formData.sencilla.tipo_desayuno} 
                          onChange={(e) => handleChange("sencilla.tipo_desayuno", e.target.value)} 
                          disabled={mode === "view"}
                          className={mode === "view" ? "bg-gray-100" : ""}
                          placeholder="Continental, Americano, etc."
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="sencilla_precio">Precio desayuno</Label>
                        <Input 
                          id="sencilla_precio"
                          type="number" 
                          placeholder="0.00"
                          value={formData.sencilla.precio} 
                          onChange={(e) => handleChange("sencilla.precio", e.target.value)} 
                          disabled={mode === "view"}
                          className={mode === "view" ? "bg-gray-100" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="sencilla_comentarios">Comentario</Label>
                        <Textarea 
                          id="sencilla_comentarios"
                          value={formData.sencilla.comentarios} 
                          onChange={(e) => handleChange("sencilla.comentarios", e.target.value)} 
                          disabled={mode === "view"}
                          className={`min-h-[80px] ${mode === "view" ? "bg-gray-100" : ""}`}
                          placeholder="Detalles adicionales"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Opciones de desayuno para habitación doble */}
                <div className="mt-6 border-t pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input 
                      type="checkbox" 
                      id="incluye-doble-general"
                      checked={formData.doble.incluye} 
                      onChange={(e) => handleChange("doble.incluye", e.target.checked)} 
                      disabled={mode === "view"}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="incluye-doble-general">¿Incluye desayuno en habitación doble?</Label>
                  </div>
                  
                  {formData.doble.incluye && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="doble_tipo_desayuno">Tipo de desayuno</Label>
                        <Input 
                          id="doble_tipo_desayuno"
                          value={formData.doble.tipo_desayuno} 
                          onChange={(e) => handleChange("doble.tipo_desayuno", e.target.value)} 
                          disabled={mode === "view"}
                          className={mode === "view" ? "bg-gray-100" : ""}
                          placeholder="Continental, Americano, etc."
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="doble_precio">Precio desayuno</Label>
                        <Input 
                          id="doble_precio"
                          type="number" 
                          placeholder="0.00"
                          value={formData.doble.precio} 
                          onChange={(e) => handleChange("doble.precio", e.target.value)} 
                          disabled={mode === "view"}
                          className={mode === "view" ? "bg-gray-100" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="doble_comentarios">Comentario</Label>
                        <Textarea 
                          id="doble_comentarios"
                          value={formData.doble.comentarios} 
                          onChange={(e) => handleChange("doble.comentarios", e.target.value)} 
                          disabled={mode === "view"}
                          className={`min-h-[80px] ${mode === "view" ? "bg-gray-100" : ""}`}
                          placeholder="Detalles adicionales"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tarifas preferenciales */}
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Tarifas Preferenciales</h3>
                  {mode === "edit" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={addTarifaPreferencial}
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} /> Agregar
                    </Button>
                  )}
                </div>
                
                <div className="max-h-[400px] overflow-y-auto pr-2">
                  {tarifasPreferenciales.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-md">
                      No hay tarifas preferenciales.
                      {mode === "edit" && " Agrega una para comenzar."}
                    </div>
                  ) : (
                    tarifasPreferenciales.map((tarifa, index) => (
                      <div key={index} className="border rounded-md p-4 mb-4 space-y-4">
                        {/* Header de tarifa con botones de edición/eliminación */}
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Tarifa {index + 1}</h4>
                          {mode === "view" && editingTarifaId !== index && (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => startEditingTarifa(index)}
                              >
                                <Pencil size={16} className="mr-1" /> Editar
                              </Button>
                              {/* Botón para eliminar ambas tarifas en un solo click */}
                              {(tarifa.id_tarifa_sencilla || tarifa.id_tarifa_doble) && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => openDeleteTarifaDialog(index)}
                                >
                                  <Trash2 size={16} className="mr-1" /> Eliminar Tarifa
                                </Button>
                              )}
                            </div>
                          )}
                          {editingTarifaId === index && (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={cancelEditingTarifa}
                              >
                                <ArrowLeft size={16} className="mr-1" /> Cancelar
                              </Button>
                              <Button 
                                variant="default"
                                size="sm"
                                onClick={() => handleUpdate()}
                                disabled={isLoading}
                              >
                                {isLoading ? "Guardando..." : "Guardar cambios"}
                              </Button>
                              {/* Botón para eliminar ambas tarifas en un solo click (en modo edición) */}
                              {(tarifa.id_tarifa_sencilla || tarifa.id_tarifa_doble) && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                  onClick={() => openDeleteTarifaDialog(index)}
                                >
                                  <Trash2 size={16} className="mr-1" /> Eliminar Tarifa
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Búsqueda de agente */}
                        {(mode === "edit" || editingTarifaId === index) ? (
                          <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                              <Label className="mb-2 block">Buscar Agente</Label>
                              <div className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <Label htmlFor={`nombre-agente-${index}`} className="sr-only">Nombre del agente</Label>
                                  <Input
                                    id={`nombre-agente-${index}`}
                                    placeholder="Nombre del agente"
                                    value={tarifa.busqueda.nombre}
                                    onChange={(e) => handleSearchInputChange(index, 'nombre', e.target.value)}
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label htmlFor={`correo-agente-${index}`} className="sr-only">Correo del agente</Label>
                                  <Input
                                    id={`correo-agente-${index}`}
                                    placeholder="Correo del agente"
                                    value={tarifa.busqueda.correo}
                                    onChange={(e) => handleSearchInputChange(index, 'correo', e.target.value)}
                                  />
                                </div>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="icon"
                                  onClick={() => handleSearch(index)}
                                  className="flex-shrink-0"
                                >
                                  <Search size={18} />
                                </Button>
                              </div>
                              
                              {tarifa.busqueda.resultados.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 border bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-[150px] overflow-y-auto">
                                  {tarifa.busqueda.resultados.map((agente) => (
                                    <div
                                      key={agente.id_agente}
                                      className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                      onClick={() => handleSelectAgente(index, agente)}
                                    >
                                      <div className="font-medium">{agente.primer_nombre}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{agente.correo}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {tarifa.busqueda.buscando && (
                                <div className="text-sm text-blue-500 mt-1">Buscando agentes...</div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm p-2 rounded border border-gray-200 bg-gray-50">
                            <span className="font-semibold">Agente:</span> {tarifa.nombre_agente || "No especificado"} {tarifa.correo_agente ? `(${tarifa.correo_agente})` : ""}
                          </div>
                        )}
                        
                        {tarifa.id_agente && (mode === "edit" || editingTarifaId === index) && (
                          <div className="text-sm bg-blue-50 dark:bg-blue-900 p-2 rounded border border-blue-200 dark:border-blue-800">
                            <span className="font-semibold">Agente seleccionado:</span> {tarifa.nombre_agente} ({tarifa.correo_agente})
                          </div>
                        )}

                        {/* Tarifas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="flex flex-col space-y-1">
                            <Label htmlFor={`costo_q_${index}`}>Costo Q</Label>
                            <Input
                              id={`costo_q_${index}`}
                              placeholder="0.00"
                              value={tarifa.costo_q}
                              onChange={(e) => handleTarifaPreferencialChange(index, "costo_q", e.target.value)}
                              disabled={mode === "view" && editingTarifaId !== index}
                              className={mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Label htmlFor={`precio_q_${index}`}>Precio Q</Label>
                            <Input
                              id={`precio_q_${index}`}
                              placeholder="0.00"
                              value={tarifa.precio_q}
                              onChange={(e) => handleTarifaPreferencialChange(index, "precio_q", e.target.value)}
                              disabled={mode === "view" && editingTarifaId !== index}
                              className={mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Label htmlFor={`costo_qq_${index}`}>Costo QQ</Label>
                            <Input
                              id={`costo_qq_${index}`}
                              placeholder="0.00"
                              value={tarifa.costo_qq}
                              onChange={(e) => handleTarifaPreferencialChange(index, "costo_qq", e.target.value)}
                              disabled={mode === "view" && editingTarifaId !== index}
                              className={mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Label htmlFor={`precio_qq_${index}`}>Precio QQ</Label>
                            <Input
                              id={`precio_qq_${index}`}
                              placeholder="0.00"
                              value={tarifa.precio_qq}
                              onChange={(e) => handleTarifaPreferencialChange(index, "precio_qq", e.target.value)}
                              disabled={mode === "view" && editingTarifaId !== index}
                              className={mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}
                            />
                          </div>
                        </div>

                        {/* Opciones de desayuno para habitación sencilla (tarifa preferencial) */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <input
                              type="checkbox"
                              id={`pref-sencilla-${index}`}
                              checked={tarifa.sencilla.incluye}
                              onChange={(e) =>
                                handleTarifaPreferencialChange(index, "sencilla.incluye", e.target.checked)
                              }
                              disabled={mode === "view" && editingTarifaId !== index}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`pref-sencilla-${index}`}>¿Incluye desayuno en habitación sencilla?</Label>
                          </div>
                          
                          {tarifa.sencilla.incluye && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`sencilla_tipo_desayuno_${index}`}>Tipo de desayuno</Label>
                                <Input
                                  id={`sencilla_tipo_desayuno_${index}`}
                                  value={tarifa.sencilla.tipo_desayuno}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(index, "sencilla.tipo_desayuno", e.target.value)
                                  }
                                  disabled={mode === "view" && editingTarifaId !== index}
                                  className={mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}
                                  placeholder="Continental, Americano, etc."
                                />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`sencilla_precio_${index}`}>Precio desayuno</Label>
                                <Input
                                  id={`sencilla_precio_${index}`}
                                  type="number"
                                  placeholder="0.00"
                                  value={tarifa.sencilla.precio}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(index, "sencilla.precio", e.target.value)
                                  }
                                  disabled={mode === "view" && editingTarifaId !== index}
                                  className={mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}
                                />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`sencilla_comentarios_${index}`}>Comentario</Label>
                                <Textarea
                                  id={`sencilla_comentarios_${index}`}
                                  value={tarifa.sencilla.comentarios}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(index, "sencilla.comentarios", e.target.value)
                                  }
                                  disabled={mode === "view" && editingTarifaId !== index}
                                  className={`min-h-[80px] ${mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}`}
                                  placeholder="Detalles adicionales"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Opciones de desayuno para habitación doble (tarifa preferencial) */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <input
                              type="checkbox"
                              id={`pref-doble-${index}`}
                              checked={tarifa.doble.incluye}
                              onChange={(e) =>
                                handleTarifaPreferencialChange(index, "doble.incluye", e.target.checked)
                              }
                              disabled={mode === "view" && editingTarifaId !== index}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`pref-doble-${index}`}>¿Incluye desayuno en habitación doble?</Label>
                          </div>
                          
                          {tarifa.doble.incluye && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`doble_tipo_desayuno_${index}`}>Tipo de desayuno</Label>
                                <Input
                                  id={`doble_tipo_desayuno_${index}`}
                                  value={tarifa.doble.tipo_desayuno}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(index, "doble.tipo_desayuno", e.target.value)
                                  }
                                  disabled={mode === "view" && editingTarifaId !== index}
                                  className={mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}
                                  placeholder="Continental, Americano, etc."
                                />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`doble_precio_${index}`}>Precio desayuno</Label>
                                <Input
                                  id={`doble_precio_${index}`}
                                  type="number"
                                  placeholder="0.00"
                                  value={tarifa.doble.precio}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(index, "doble.precio", e.target.value)
                                  }
                                  disabled={mode === "view" && editingTarifaId !== index}
                                  className={mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}
                                />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`doble_comentarios_${index}`}>Comentario</Label>
                                <Textarea
                                  id={`doble_comentarios_${index}`}
                                  value={tarifa.doble.comentarios}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(index, "doble.comentarios", e.target.value)
                                  }
                                  disabled={mode === "view" && editingTarifaId !== index}
                                  className={`min-h-[80px] ${mode === "view" && editingTarifaId !== index ? "bg-gray-100" : ""}`}
                                  placeholder="Detalles adicionales"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Botones de acción específicos para tarifas */}
                        <div className="flex justify-end mt-4 gap-2">
                          {mode === "edit" && (
                            <Button 
                              variant="outline" 
                              className="text-red-500 hover:bg-red-50 hover:text-red-600" 
                              onClick={() => removeTarifaPreferencial(index)}
                              size="sm"
                            >
                              <Trash2 size={16} className="mr-1" /> Eliminar
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab: Información de Pagos */}
            <TabsContent value="informacionPagos" className="space-y-6 min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="tipo_pago">Tipo de Pago</Label>
                  <Select 
                    value={formData.tipo_pago} 
                    onValueChange={(value) => handleChange("tipo_pago", value)}
                    disabled={mode === "view"}
                  >
                    <SelectTrigger id="tipo_pago" className={mode === "view" ? "bg-gray-100" : ""}>
                      <SelectValue placeholder="Selecciona el tipo de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">Transferencia</SelectItem>
                      <SelectItem value="credito">Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="comentario_pago">Comentario de Pago</Label>
                  <Textarea 
                    id="comentario_pago"
                    value={formData.comentario_pago || ""} 
                    onChange={(e) => handleChange("comentario_pago", e.target.value)} 
                    disabled={mode === "view"}
                    className={`min-h-[80px] ${mode === "view" ? "bg-gray-100" : ""}`}
                    placeholder="Información adicional sobre el pago"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="disponibilidad_precio">¿Cómo se solicita la disponibilidad?</Label>
                  <Textarea 
                    id="disponibilidad_precio"
                    value={formData.disponibilidad_precio || ""} 
                    onChange={(e) => handleChange("disponibilidad_precio", e.target.value)} 
                    disabled={mode === "view"}
                    className={`min-h-[80px] ${mode === "view" ? "bg-gray-100" : ""}`}
                    placeholder="Email, teléfono, etc."
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="contacto_convenio">Contacto Convenio</Label>
                  <Textarea 
                    id="contacto_convenio"
                    value={formData.contacto_convenio} 
                    onChange={(e) => handleChange("contacto_convenio", e.target.value)} 
                    disabled={mode === "view"}
                    className={`min-h-[80px] ${mode === "view" ? "bg-gray-100" : ""}`}
                    placeholder="Nombre y datos de contacto"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="cuenta_de_deposito">Cuenta de Depósito</Label>
                  <Input 
                    id="cuenta_de_deposito"
                    value={formData.cuenta_de_deposito || ""} 
                    onChange={(e) => handleChange("cuenta_de_deposito", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Datos para realizar depósitos"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="contacto_recepcion">Contacto Recepción</Label>
                  <Textarea 
                    id="contacto_recepcion"
                    value={formData.contacto_recepcion} 
                    onChange={(e) => handleChange("contacto_recepcion", e.target.value)} 
                    disabled={mode === "view"}
                    className={`min-h-[80px] ${mode === "view" ? "bg-gray-100" : ""}`}
                    placeholder="Nombre y datos de contacto"
                  />
                </div>

                {/* Sección de impuestos separada y mejorada */}
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-md font-medium mb-3">Información de Impuestos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg p-4 bg-gray-50">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="iva">IVA (%)</Label>
                      <Input 
                        id="iva"
                        value={formData.iva} 
                        onChange={(e) => handleChange("iva", e.target.value)} 
                        disabled={mode === "view"}
                        className={mode === "view" ? "bg-gray-100" : ""}
                        placeholder="Ej: 16.00"
                      />
                      <span className="text-xs text-gray-500">Impuesto al valor agregado</span>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="ish">ISH</Label>
                      <Input 
                        id="ish"
                        value={formData.ish} 
                        onChange={(e) => handleChange("ish", e.target.value)} 
                        disabled={mode === "view"}
                        className={mode === "view" ? "bg-gray-100" : ""}
                        placeholder="Ej: 3.00"
                      />
                      <span className="text-xs text-gray-500">Impuesto sobre hospedaje</span>
                    </div>

                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="otros_impuestos">Otros Impuestos</Label>
                      <Input 
                        id="otros_impuestos"
                        value={formData.otros_impuestos} 
                        onChange={(e) => handleChange("otros_impuestos", e.target.value)} 
                        disabled={mode === "view"}
                        className={mode === "view" ? "bg-gray-100" : ""}
                        placeholder="Ej: 320.00"
                      />
                      <span className="text-xs text-gray-500">Impuestos adicionales</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="MenoresEdad">Política para Menores de Edad</Label>
                  <Textarea 
                    id="menoresEdad"
                    value={formData.MenoresEdad} 
                    onChange={(e) => handleChange("MenoresEdad", e.target.value)} 
                    disabled={mode === "view"}
                    className={`min-h-[80px] ${mode === "view" ? "bg-gray-100" : ""}`}
                    placeholder="Información sobre estadía de menores"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="transportacion">Transportación</Label>
                  <Input 
                    id="transportacion"
                    value={formData.Transportacion} 
                    onChange={(e) => handleChange("Transportacion", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Detalles de transportación"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="TransportacionComentarios">Comentarios sobre Transportación</Label>
                  <Textarea 
                    id="TransportacionComentarios"
                    value={formData.TransportacionComentarios} 
                    onChange={(e) => handleChange("TransportacionComentarios", e.target.value)} 
                    disabled={mode === "view"}
                    className={`min-h-[80px] ${mode === "view" ? "bg-gray-100" : ""}`}
                    placeholder="Información adicional"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="rfc">RFC</Label>
                  <Input 
                    id="rfc"
                    value={formData.rfc} 
                    onChange={(e) => handleChange("rfc", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Registro Federal de Contribuyentes"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="razon_social">Razón Social</Label>
                  <Input 
                    id="razon_social"
                    value={formData.razon_social} 
                    onChange={(e) => handleChange("razon_social", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Nombre legal de la empresa"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab: Información Adicional */}
            <TabsContent value="informacionAdicional" className="space-y-6 min-h-[400px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="id_cadena">Cadena Hotelera <span className="text-red-500">*</span></Label>
                  <Input 
                    id="id_cadena"
                    value={formData.id_cadena} 
                    onChange={(e) => handleChange("id_cadena", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    required
                    placeholder="ID de la cadena hotelera"
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="tipo_hospedaje">Tipo de Hospedaje</Label>
                  <Select 
                    value={formData.tipo_hospedaje} 
                    onValueChange={(value) => handleChange("tipo_hospedaje", value)}
                    disabled={mode === "view"}
                  >
                    <SelectTrigger id="tipo_hospedaje" className={mode === "view" ? "bg-gray-100" : ""}>
                      <SelectValue placeholder="Selecciona el tipo de hospedaje" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="motel">Motel</SelectItem>
                      <SelectItem value="resort">Resort</SelectItem>
                      <SelectItem value="hostal">Hostal</SelectItem>
                      <SelectItem value="apartamento">Apartamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="longitud">Longitud</Label>
                  <Input 
                    id="longitud"
                    value={formData.longitud} 
                    onChange={(e) => handleChange("longitud", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Ej: -99.1332"
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="latitud">Latitud</Label>
                  <Input 
                    id="latitud"
                    value={formData.latitud} 
                    onChange={(e) => handleChange("latitud", e.target.value)} 
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Ej: 19.4326"
                  />
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="calificacion">Calificación</Label>
                  <Select 
                    value={formData.calificacion} 
                    onValueChange={(value) => handleChange("calificacion", value)}
                    disabled={mode === "view"}
                  >
                    <SelectTrigger id="calificacion" className={mode === "view" ? "bg-gray-100" : ""}>
                      <SelectValue placeholder="Selecciona calificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Estrella</SelectItem>
                      <SelectItem value="2">2 Estrellas</SelectItem>
                      <SelectItem value="3">3 Estrellas</SelectItem>
                      <SelectItem value="4">4 Estrellas</SelectItem>
                      <SelectItem value="5">5 Estrellas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="activo">Estatus</Label>
                  <Select 
                    value={formData.activo.toString()} 
                    onValueChange={(value) => handleChange("activo", parseInt(value))}
                    disabled={mode === "view"}
                  >
                    <SelectTrigger id="activo" className={mode === "view" ? "bg-gray-100" : ""}>
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Activo</SelectItem>
                      <SelectItem value="0">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-1 md:col-span-2 flex flex-col space-y-1">
                  <Label htmlFor="Comentarios">Comentarios Adicionales</Label>
                  <Textarea 
                    id="Comentarios"
                    value={formData.Comentarios} 
                    onChange={(e) => handleChange("Comentarios", e.target.value)} 
                    disabled={mode === "view"}
                    className={`min-h-[120px] ${mode === "view" ? "bg-gray-100" : ""}`}
                    placeholder="Información adicional relevante"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el hotel <strong>{hotel.nombre}</strong> y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-4 w-4 text-white border-b-2 rounded-full"></div>
                  <span>Eliminando...</span>
                </div>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Tarifa Confirmation Dialog */}
      <AlertDialog open={deleteTarifaDialogOpen} onOpenChange={setDeleteTarifaDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Inactivar tarifa preferencial?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará ambas tarifas preferenciales (sencilla y doble) como inactivas en el sistema. 
              Se realizará una eliminación lógica de la tarifa preferencial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTarifa}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin -ml-1 mr-3 h-4 w-4 text-white border-b-2 rounded-full"></div>
                  <span>Inactivando...</span>
                </div>
              ) : (
                "Inactivar Tarifa Preferencial"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}