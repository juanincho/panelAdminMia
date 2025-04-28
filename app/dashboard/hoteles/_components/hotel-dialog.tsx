"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
  noktosq?: number;
  noktosqq?: number;
  menoresedad?: string;
  paxextrapersona?: string;
  desayunoincluido?: string;
  desayunocomentarios?: string;
  desayunoprecioporpersona?: string;
  transportacion?: string;
  transportacioncomentarios?: string;
  urlimagenhotel?: string;
  urlimagenhotelq?: string;
  urlimagenhotelqq?: string;
  activo?: number;
  comentarios?: string | null;
  id_sepomex?: number | null;
  codigopostal?: string;
  Id_hotel_excel?: number;
  colonia?: string;
  precio_sencilla?: number | string;
  precio_doble?: number | string;
  costo_q?: string;
  precio_q?: string;
  costo_qq?: string;
  precio_qq?: string;
}

interface HotelRate {
  id_tarifa?: string;
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
  id_excel?: string;
  id_cadena: string;
  activo: number;
  nombre: string;
  correo: string;
  telefono: string;
  codigoPostal: string;
  calle: string;
  numero: string;
  colonia: string;
  estado: string;
  ciudad_zona: string;
  municipio: string;
  tipo_negociacion: string;
  vigencia_convenio: string;
  urlImagenHotel: string;
  urlImagenHotelQ: string;
  urlImagenHotelQQ: string;
  tipo_pago: string;
  disponibilidad_precio: string;
  contacto_convenio: string;
  contacto_recepcion: string;
  impuestos_porcentaje: string;
  impuestos_moneda: string;
  menoresEdad: string;
  transportacion: string;
  transportacionComentarios: string;
  rfc: string;
  razon_social: string;
  calificacion: string;
  tipo_hospedaje: string;
  notas: string;
  latitud: string;
  longitud: string;
  cuenta_de_deposito: string;
  solicitud_disponibilidad: string;
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

// Convierte 'DD-MM-YYYY' a 'YYYY-MM-DD' para el campo date
const convertToDateInputFormat = (dateString?: string): string => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return "";
  return `${parts[2]}-${parts[1]}-${parts[0]}`; // Devuelve 'YYYY-MM-DD'
};

// Convierte 'YYYY-MM-DD' a 'DD-MM-YYYY' para almacenarlo en el estado
const convertToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return "";
  return `${parts[2]}-${parts[1]}-${parts[0]}`; // Devuelve 'DD-MM-YYYY'
};

// API Functions
const buscarCodigoPostal = async (codigo: string) => {
  try {
    const response = await fetch(
      `https://mianoktos.vercel.app/v1/sepoMex/buscar-codigo-postal?d_codigo=${codigo}`,
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
    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error al buscar código postal:", error);
    return [];
  }
};

const buscarAgentes = async (nombre: string, correo: string) => {
  try {
    const response = await fetch(
      `https://mianoktos.vercel.app/v1/mia/agentes/get-agente-id?nombre=${encodeURIComponent(
        nombre
      )}&correo=${encodeURIComponent(correo)}`,
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
  const defaultData = { calle: "", numero: "" };
  if (!direccion) return defaultData;

  // Try to parse the address - this is a simple approach, might need adjusting
  const match = direccion.match(/^([^,]+),([^,]+)/);
  if (match) {
    return {
      calle: match[1].trim(),
      numero: match[2].trim(),
    };
  }
  return defaultData;
};

export function HotelDialog({
  open,
  onOpenChange,
  hotel,
  onSuccess,
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
  const [tarifasPreferenciales, setTarifasPreferenciales] = useState<
    TarifaPreferencial[]
  >([]);
  const [hotelRates, setHotelRates] = useState<HotelRate | null>(null);

  // Initialize default form data
  const defaultFormData: FormData = {
    id_cadena: "",
    activo: 1,
    nombre: "",
    correo: "",
    telefono: "",
    codigoPostal: "",
    calle: "",
    numero: "",
    colonia: "",
    estado: "",
    ciudad_zona: "",
    municipio: "",
    tipo_negociacion: "",
    vigencia_convenio: "",
    urlImagenHotel: "",
    urlImagenHotelQ: "",
    urlImagenHotelQQ: "",
    tipo_pago: "",
    disponibilidad_precio: "",
    contacto_convenio: "",
    contacto_recepcion: "",
    impuestos_porcentaje: "",
    impuestos_moneda: "",
    menoresEdad: "",
    transportacion: "",
    transportacionComentarios: "",
    rfc: "",
    razon_social: "",
    calificacion: "",
    tipo_hospedaje: "hotel",
    notas: "",
    latitud: "",
    longitud: "",
    cuenta_de_deposito: "",
    solicitud_disponibilidad: "",
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
  };
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  // Track if we've already fetched rates for this hotel
  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    if (open && hotel?.id_hotel && hasFetched.current !== hotel.id_hotel) {
      fetchHotelRates(hotel.id_hotel);
      hasFetched.current = hotel.id_hotel;
    }

    if (!open) {
      // Clean up state when modal closes
      hasFetched.current = null;
      setHotelRates(null);
      setFormData(defaultFormData);
      setTarifasPreferenciales([]);
      setMode("view");
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [open, hotel?.id_hotel]);

  // Populate form data when hotel changes
  useEffect(() => {
    if (hotel) {
      const direccionData = extractDireccionData(hotel.direccion);

      setFormData({
        id_excel: hotel.Id_hotel_excel?.toString() || "",
        id_cadena: hotel.id_cadena?.toString() || "",
        activo: hotel.activo ?? 1,
        nombre: hotel.nombre || "",
        correo: hotel.correo || "",
        telefono: hotel.telefono || "",
        codigoPostal: hotel.codigopostal || "",
        calle: direccionData.calle,
        numero: direccionData.numero,
        colonia: hotel.colonia || "",
        estado: hotel.estado || "",
        ciudad_zona: hotel.ciudad_zona || "",
        municipio: "", // To be populated from CP search
        tipo_negociacion: hotel.convenio || "",
        vigencia_convenio: "", // May need conversion if available
        urlImagenHotel: hotel.urlimagenhotel || "",
        urlImagenHotelQ: hotel.urlimagenhotelq || "",
        urlImagenHotelQQ: hotel.urlimagenhotelqq || "",
        tipo_pago: "", // Need to populate from API
        disponibilidad_precio: "",
        contacto_convenio: "",
        contacto_recepcion: "",
        impuestos_porcentaje: "",
        impuestos_moneda: "",
        menoresEdad: hotel.menoresedad || "",
        transportacion: hotel.transportacion || "",
        transportacionComentarios: hotel.transportacioncomentarios || "",
        rfc: hotel.rfc || "",
        razon_social: hotel.razon_social || "",
        calificacion: hotel.calificacion?.toString() || "",
        tipo_hospedaje: hotel.tipo_hospedaje || "hotel",
        notas: hotel.comentarios || "",
        latitud: hotel.latitud || "",
        longitud: hotel.longitud || "",
        cuenta_de_deposito: hotel.cuenta_de_deposito || "",
        solicitud_disponibilidad: "",
        comentario_pago: "",
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

      // If we have a postal code, search for details
      if (hotel.codigopostal && hotel.codigopostal.length === 5) {
        handleCodigoPostalChange(hotel.codigopostal);
      }
    }
  }, [hotel]);

  // Update form data when hotel rates are fetched
  useEffect(() => {
    if (!hotelRates || !hotel?.id_hotel) return;

    setFormData((prev) => {
      const newFormData = {
        ...prev,
        costo_q: hotelRates.costo_q || prev.costo_q,
        precio_q: hotelRates.precio_q || prev.precio_q,
        costo_qq: hotelRates.costo_qq || prev.costo_qq,
        precio_qq: hotelRates.precio_qq || prev.precio_qq,
        precio_persona_extra:
          hotelRates.precio_persona_extra || prev.precio_persona_extra,
      };

      // Update single room data if exists
      if (hotelRates.sencilla) {
        newFormData.sencilla = {
          ...prev.sencilla,
          incluye: hotelRates.sencilla.incluye ?? prev.sencilla.incluye,
          tipo_desayuno:
            hotelRates.sencilla.tipo_desayuno || prev.sencilla.tipo_desayuno,
          precio: hotelRates.sencilla.precio || prev.sencilla.precio,
          comentarios:
            hotelRates.sencilla.comentarios || prev.sencilla.comentarios,
          precio_noche_extra:
            hotelRates.sencilla.precio_noche_extra ||
            prev.sencilla.precio_noche_extra,
        };
      }

      // Update double room data if exists
      if (hotelRates.doble) {
        newFormData.doble = {
          ...prev.doble,
          incluye: hotelRates.doble.incluye ?? prev.doble.incluye,
          tipo_desayuno:
            hotelRates.doble.tipo_desayuno || prev.doble.tipo_desayuno,
          precio: hotelRates.doble.precio || prev.doble.precio,
          comentarios: hotelRates.doble.comentarios || prev.doble.comentarios,
          precio_noche_extra:
            hotelRates.doble.precio_noche_extra ||
            prev.doble.precio_noche_extra,
          precio_persona_extra:
            hotelRates.doble.precio_persona_extra ||
            prev.doble.precio_persona_extra,
        };
      }

      return newFormData;
    });
  }, [hotelRates, hotel?.id_hotel]);

  // Fetch hotel rates from API
  const fetchHotelRates = async (idHotel: string) => {
    try {
      setIsFetchingRates(true);
      const response = await fetch(
        `https://mianoktos.vercel.app/v1/mia/hoteles/Consultar-tarifas-por-hotel/${idHotel}`,
        {
          method: "GET",
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.tarifas && Array.isArray(result.tarifas)) {
        console.log("Tarifas recibidas:", result.tarifas);

        // Procesar tarifas estándar
        const standardRates: TarifaData[] = result.tarifas.filter(
          (t: TarifaData) => t.id_agente === null
        );

        // Procesar tarifas preferenciales
        const preferentialRates: TarifaData[] = result.tarifas.filter(
          (t: TarifaData) => t.id_agente !== null
        );

        // Agrupar tarifas preferenciales por agente
        const agentRatesMap = new Map<string, TarifaData[]>();

        preferentialRates.forEach((rate: TarifaData) => {
          if (!rate.id_agente) return;

          if (!agentRatesMap.has(rate.id_agente)) {
            agentRatesMap.set(rate.id_agente, []);
          }

          const agentRates = agentRatesMap.get(rate.id_agente);
          if (agentRates) {
            agentRates.push(rate);
          }
        });

        // Procesar tarifas estándar
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
          const tipo = tarifa.id_tipos_cuartos;

          if (tipo === 1) {
            // Sencilla
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

          if (tipo === 2) {
            // Doble
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
            processedRates.precio_persona_extra =
              tarifa.precio_persona_extra || "";
          }
        });

        setHotelRates(processedRates);

        // Procesar tarifas preferenciales
        const preferentialRatesArray: TarifaPreferencial[] = [];

        preferentialRates.forEach((rate: TarifaData) => {
          const tipo = rate.id_tipos_cuartos;

          const tarifaPreferencial: TarifaPreferencial = {
            id_agente: rate.id_agente || "",
            nombre_agente: "",
            correo_agente: "",
            costo_q: rate.costo || "",
            precio_q: rate.precio || "",
            costo_qq: rate.costo || "",
            precio_qq: rate.precio || "",
            sencilla: {
              incluye: rate.incluye_desayuno === 1,
              tipo_desayuno: rate.tipo_desayuno || "",
              precio: rate.precio_desayuno || "",
              comentarios: rate.comentario_desayuno || "",
              precio_noche_extra: rate.precio_noche_extra || "",
            },
            doble: {
              incluye: rate.incluye_desayuno === 1,
              tipo_desayuno: rate.tipo_desayuno || "",
              precio: rate.precio_desayuno || "",
              comentarios: rate.comentario_desayuno || "",
              precio_noche_extra: rate.precio_noche_extra || "",
              precio_persona_extra: rate.precio_persona_extra || "",
            },
            busqueda: {
              nombre: "",
              correo: "",
              resultados: [],
              buscando: false,
            },
          };

          // Extraer la información del agente directamente de la propiedad 'info_agente'
          if (rate.info_agente) {
            const [nombreAgente, correoAgente] = rate.info_agente.split(" ");
            tarifaPreferencial.nombre_agente =
              nombreAgente || "Agente sin nombre";
            tarifaPreferencial.correo_agente = correoAgente || "";
          }

          preferentialRatesArray.push(tarifaPreferencial);
        });

        setTarifasPreferenciales(preferentialRatesArray);
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
    setFormData((prev) => ({ ...prev, codigoPostal: codigo }));

    if (codigo.length === 5) {
      setBuscandoCP(true);
      try {
        const data = await buscarCodigoPostal(codigo);
        setColonias(data);

        if (data.length > 0) {
          const primerResultado = data[0];
          setFormData((prev) => ({
            ...prev,
            estado: primerResultado.d_estado,
            ciudad_zona: primerResultado.d_ciudad,
            municipio: primerResultado.D_mnpio,
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

  // Handler for colonia selection
  const handleColoniaChange = (coloniaId: string) => {
    const coloniaSeleccionada = colonias.find(
      (c) => c.id.toString() === coloniaId
    );
    if (coloniaSeleccionada) {
      setFormData((prev) => ({
        ...prev,
        colonia: coloniaSeleccionada.d_asenta,
      }));
    }
  };

  // Generic form field change handler
  const handleChange = (field: string, value: any) => {
    if (mode === "view") return;

    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as object),
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
    if (
      tarifa.busqueda.nombre.trim() === "" &&
      tarifa.busqueda.correo.trim() === ""
    ) {
      const newTarifas = [...tarifasPreferenciales];
      newTarifas[index].busqueda.resultados = [];
      setTarifasPreferenciales(newTarifas);
      return;
    }

    const newTarifas = [...tarifasPreferenciales];
    newTarifas[index].busqueda.buscando = true;
    setTarifasPreferenciales(newTarifas);

    try {
      const agentes = await buscarAgentes(
        tarifa.busqueda.nombre,
        tarifa.busqueda.correo
      );
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
  const handleSearchInputChange = (
    index: number,
    field: "nombre" | "correo",
    value: string
  ) => {
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

    if (field.includes(".")) {
      const [parent, child] = field.split(".") as [
        keyof TarifaPreferencial,
        string
      ];
      if (parent === "sencilla" || parent === "doble") {
        newTarifas[index][parent] = {
          ...newTarifas[index][parent],
          [child]: value,
        };
      } else if (parent === "busqueda") {
        newTarifas[index].busqueda = {
          ...newTarifas[index].busqueda,
          [child]: value,
        };
      }
    } else {
      // For top-level properties
      newTarifas[index] = {
        ...newTarifas[index],
        [field]: value,
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
          buscando: false,
        },
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
        `https://mianoktos.vercel.app/v1/mia/hoteles/Eliminar-hotel/`,
        {
          method: "PATCH",
          headers: {
            "x-api-key": API_KEY || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_hotel }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
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

    try {
      const formatNumber = (value: any) => {
        if (value === null || value === undefined || value === "") return null;
        const num = Number(value);
        return isNaN(num) ? null : num.toFixed(2);
      };

      // Construir la dirección completa
      const direccionCompleta = `${formData.calle || ""},${
        formData.numero || ""
      } ,${formData.colonia}, ${formData.municipio}, ${formData.estado}, CP ${
        formData.codigoPostal
      }`;

      const payload = {
        id_hotel: hotel.id_hotel,
        id_excel: formData.id_excel ? Number(formData.id_excel) : null,
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
        estado: formData.estado,
        ciudad_zona: formData.ciudad_zona,
        codigoPostal: formData.codigoPostal,
        colonia: formData.colonia,
        municipio: formData.municipio,
        tipo_hospedaje: formData.tipo_hospedaje || "hotel",
        cuenta_de_deposito: formData.cuenta_de_deposito || null,
        tipo_pago: formData.tipo_pago || null,
        disponibilidad_precio: formData.disponibilidad_precio || null,
        contacto_convenio: formData.contacto_convenio || null,
        contacto_recepcion: formData.contacto_recepcion || null,
        impuestos_porcentaje: formData.impuestos_porcentaje
          ? Number(formData.impuestos_porcentaje)
          : null,
        impuestos_moneda: formData.impuestos_moneda
          ? Number(formData.impuestos_moneda)
          : null,
        menoresEdad: formData.menoresEdad || null,
        paxExtraPersona: formData.precio_persona_extra || null,
        transportacion: formData.transportacion || null,
        transportacionComentarios: formData.transportacionComentarios || null,
        urlImagenHotel: formData.urlImagenHotel || null,
        urlImagenHotelQ: formData.urlImagenHotelQ || null,
        urlImagenHotelQQ: formData.urlImagenHotelQQ || null,
        calificacion: formData.calificacion
          ? Number(formData.calificacion)
          : null,
        activo: formData.activo !== undefined ? formData.activo : 1,
        notas: formData.notas || null,
        tarifas: {
          general: {
            costo_q: formatNumber(formData.costo_q) || "0.00",
            precio_q: formatNumber(formData.precio_q) || "0.00",
            costo_qq: formatNumber(formData.costo_qq) || "0.00",
            precio_qq: formatNumber(formData.precio_qq) || "0.00",
            precio_persona_extra: formatNumber(formData.precio_persona_extra),
            sencilla: {
              incluye: formData.sencilla.incluye,
              tipo_desayuno: formData.sencilla.tipo_desayuno,
              precio: formatNumber(formData.sencilla.precio),
              comentarios: formData.sencilla.comentarios,
              precio_noche_extra: formatNumber(
                formData.sencilla.precio_noche_extra
              ),
            },
            doble: {
              incluye: formData.doble.incluye,
              tipo_desayuno: formData.doble.tipo_desayuno,
              precio: formatNumber(formData.doble.precio),
              comentarios: formData.doble.comentarios,
              precio_persona_extra: formatNumber(
                formData.doble.precio_persona_extra
              ),
              precio_noche_extra: formatNumber(
                formData.doble.precio_noche_extra
              ),
            },
          },
          preferenciales: tarifasPreferenciales.map((t) => ({
            id_agente: t.id_agente || null,
            costo_q: formatNumber(t.costo_q) || "0.00",
            precio_q: formatNumber(t.precio_q) || "0.00",
            costo_qq: formatNumber(t.costo_qq) || "0.00",
            precio_qq: formatNumber(t.precio_qq) || "0.00",
            sencilla: {
              incluye: t.sencilla.incluye,
              tipo_desayuno: t.sencilla.tipo_desayuno,
              precio: formatNumber(t.sencilla.precio),
              comentarios: t.sencilla.comentarios,
              precio_noche_extra: formatNumber(t.sencilla.precio_noche_extra),
            },
            doble: {
              incluye: t.doble.incluye,
              tipo_desayuno: t.doble.tipo_desayuno,
              precio: formatNumber(t.doble.precio),
              comentarios: t.doble.comentarios,
              precio_persona_extra: formatNumber(t.doble.precio_persona_extra),
              precio_noche_extra: formatNumber(t.doble.precio_noche_extra),
            },
          })),
        },
      };

      const response = await fetch(
        `https://mianoktos.vercel.app/v1/mia/hoteles/Editar-hotel/`,
        {
          method: "PATCH",
          headers: {
            "x-api-key": API_KEY || "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      setSuccessMessage("Hotel actualizado exitosamente");
      setMode("view");

      if (onSuccess) onSuccess();
    } catch (error: any) {
      setErrorMessage(error.message || "Error al actualizar el hotel");
    } finally {
      setIsLoading(false);
    }
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
            <TabsContent
              value="datosBasicos"
              className="space-y-6 min-h-[400px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="id_excel">ID Excel (Seguimiento)</Label>
                  <Input
                    id="id_excel"
                    value={formData.id_excel || ""}
                    onChange={(e) => handleChange("id_excel", e.target.value)}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="nombre">
                    Nombre <span className="text-red-500">*</span>
                  </Label>
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
                  <Label htmlFor="codigoPostal">
                    Código Postal <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={(e) =>
                      mode === "edit" &&
                      handleCodigoPostalChange(e.target.value)
                    }
                    maxLength={5}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    required
                  />
                  {buscandoCP && (
                    <span className="text-xs text-blue-600">
                      Buscando código postal...
                    </span>
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
                    <Label htmlFor="colonia">
                      Colonia <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={handleColoniaChange}
                      disabled={currentMode === "view"}
                    >
                      <SelectTrigger
                        id="colonia"
                        className={`w-full ${
                          currentMode === "view" ? "bg-gray-100" : ""
                        }`}
                      >
                        <SelectValue
                          placeholder={
                            formData.colonia || "Selecciona una colonia"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {colonias.map((colonia) => (
                          <SelectItem
                            key={colonia.id}
                            value={colonia.id.toString()}
                          >
                            {colonia.d_asenta}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="colonia">Colonia</Label>
                    <Input
                      id="colonia"
                      value={formData.colonia}
                      onChange={(e) => handleChange("colonia", e.target.value)}
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                    />
                  </div>
                )}

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="estado">
                    Estado <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) => handleChange("estado", e.target.value)}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="ciudad_zona">
                    Ciudad <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ciudad_zona"
                    value={formData.ciudad_zona}
                    onChange={(e) =>
                      handleChange("ciudad_zona", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleChange("tipo_negociacion", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="vigencia_convenio">Vigencia Convenio</Label>
                  <Input
                    id="vigencia_convenio"
                    type="date"
                    value={
                      formData.vigencia_convenio
                        ? convertToDateInputFormat(formData.vigencia_convenio)
                        : ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "vigencia_convenio",
                        convertToDDMMYYYY(e.target.value)
                      )
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="urlImagenHotel">Imagen Hotel (URL)</Label>
                  <Input
                    id="urlImagenHotel"
                    value={formData.urlImagenHotel}
                    onChange={(e) =>
                      handleChange("urlImagenHotel", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="urlImagenHotelQ">
                    Imagen Habitación Sencilla (URL)
                  </Label>
                  <Input
                    id="urlImagenHotelQ"
                    value={formData.urlImagenHotelQ}
                    onChange={(e) =>
                      handleChange("urlImagenHotelQ", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="urlImagenHotelQQ">
                    Imagen Habitación Doble (URL)
                  </Label>
                  <Input
                    id="urlImagenHotelQQ"
                    value={formData.urlImagenHotelQQ}
                    onChange={(e) =>
                      handleChange("urlImagenHotelQQ", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                {formData.urlImagenHotel && (
                  <div className="flex flex-col space-y-1 col-span-2">
                    <Label>Vista previa de la imagen</Label>
                    <div className="h-40 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={getValidImageUrl(hotel.urlimagenhotel)}
                        alt="Imagen del hotel"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (
                            target.src !==
                            "https://via.placeholder.com/600x400?text=Sin+imagen"
                          ) {
                            target.src =
                              "https://via.placeholder.com/600x400?text=Sin+imagen";
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
            <TabsContent
              value="tarifasServicios"
              className="space-y-6 min-h-[400px]"
            >
              <div>
                <h3 className="text-lg font-semibold mb-4">Tarifa General</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="costo_q">
                      Costo Q <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="precio_q">
                      Precio Q <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="costo_qq">
                      Costo QQ <span className="text-red-500">*</span>
                    </Label>
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
                    <Label htmlFor="precio_qq">
                      Precio QQ <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="precio_qq"
                      placeholder="0.00"
                      value={formData.precio_qq}
                      onChange={(e) =>
                        handleChange("precio_qq", e.target.value)
                      }
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="precio_persona_extra">
                      Precio por persona extra
                    </Label>
                    <Input
                      id="precio_persona_extra"
                      type="number"
                      placeholder="0.00"
                      value={formData.precio_persona_extra}
                      onChange={(e) =>
                        handleChange("precio_persona_extra", e.target.value)
                      }
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                    />
                    <span className="text-xs text-gray-500">
                      Solo aplica para habitación doble
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="sencilla_precio_noche_extra">
                      Precio noche extra (Sencilla)
                    </Label>
                    <Input
                      id="sencilla_precio_noche_extra"
                      type="number"
                      placeholder="0.00"
                      value={formData.sencilla.precio_noche_extra}
                      onChange={(e) =>
                        handleChange(
                          "sencilla.precio_noche_extra",
                          e.target.value
                        )
                      }
                      disabled={mode === "view"}
                      className={mode === "view" ? "bg-gray-100" : ""}
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Label htmlFor="doble_precio_noche_extra">
                      Precio noche extra (Doble)
                    </Label>
                    <Input
                      id="doble_precio_noche_extra"
                      type="number"
                      placeholder="0.00"
                      value={formData.doble.precio_noche_extra}
                      onChange={(e) =>
                        handleChange("doble.precio_noche_extra", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleChange("sencilla.incluye", e.target.checked)
                      }
                      disabled={mode === "view"}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="incluye-sencilla-general">
                      ¿Incluye desayuno en habitación sencilla?
                    </Label>
                  </div>

                  {formData.sencilla.incluye && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="sencilla_tipo_desayuno">
                          Tipo de desayuno
                        </Label>
                        <Input
                          id="sencilla_tipo_desayuno"
                          value={formData.sencilla.tipo_desayuno}
                          onChange={(e) =>
                            handleChange(
                              "sencilla.tipo_desayuno",
                              e.target.value
                            )
                          }
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
                          onChange={(e) =>
                            handleChange("sencilla.precio", e.target.value)
                          }
                          disabled={mode === "view"}
                          className={mode === "view" ? "bg-gray-100" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="sencilla_comentarios">Comentario</Label>
                        <Input
                          id="sencilla_comentarios"
                          value={formData.sencilla.comentarios}
                          onChange={(e) =>
                            handleChange("sencilla.comentarios", e.target.value)
                          }
                          disabled={mode === "view"}
                          className={mode === "view" ? "bg-gray-100" : ""}
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
                      onChange={(e) =>
                        handleChange("doble.incluye", e.target.checked)
                      }
                      disabled={mode === "view"}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="incluye-doble-general">
                      ¿Incluye desayuno en habitación doble?
                    </Label>
                  </div>

                  {formData.doble.incluye && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="doble_tipo_desayuno">
                          Tipo de desayuno
                        </Label>
                        <Input
                          id="doble_tipo_desayuno"
                          value={formData.doble.tipo_desayuno}
                          onChange={(e) =>
                            handleChange("doble.tipo_desayuno", e.target.value)
                          }
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
                          onChange={(e) =>
                            handleChange("doble.precio", e.target.value)
                          }
                          disabled={mode === "view"}
                          className={mode === "view" ? "bg-gray-100" : ""}
                        />
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Label htmlFor="doble_comentarios">Comentario</Label>
                        <Input
                          id="doble_comentarios"
                          value={formData.doble.comentarios}
                          onChange={(e) =>
                            handleChange("doble.comentarios", e.target.value)
                          }
                          disabled={mode === "view"}
                          className={mode === "view" ? "bg-gray-100" : ""}
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
                  <h3 className="text-lg font-semibold">
                    Tarifas Preferenciales
                  </h3>
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
                      <div
                        key={index}
                        className="border rounded-md p-4 mb-4 space-y-4"
                      >
                        {/* Búsqueda de agente */}
                        {mode === "edit" ? (
                          <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                              <Label className="mb-2 block">
                                Buscar Agente
                              </Label>
                              <div className="flex gap-2 items-start">
                                <div className="flex-1">
                                  <Label
                                    htmlFor={`nombre-agente-${index}`}
                                    className="sr-only"
                                  >
                                    Nombre del agente
                                  </Label>
                                  <Input
                                    id={`nombre-agente-${index}`}
                                    placeholder="Nombre del agente"
                                    value={tarifa.busqueda.nombre}
                                    onChange={(e) =>
                                      handleSearchInputChange(
                                        index,
                                        "nombre",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex-1">
                                  <Label
                                    htmlFor={`correo-agente-${index}`}
                                    className="sr-only"
                                  >
                                    Correo del agente
                                  </Label>
                                  <Input
                                    id={`correo-agente-${index}`}
                                    placeholder="Correo del agente"
                                    value={tarifa.busqueda.correo}
                                    onChange={(e) =>
                                      handleSearchInputChange(
                                        index,
                                        "correo",
                                        e.target.value
                                      )
                                    }
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
                                      onClick={() =>
                                        handleSelectAgente(index, agente)
                                      }
                                    >
                                      <div className="font-medium">
                                        {agente.primer_nombre}
                                      </div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {agente.correo}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {tarifa.busqueda.buscando && (
                                <div className="text-sm text-blue-500 mt-1">
                                  Buscando agentes...
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm p-2 rounded border border-gray-200 bg-gray-50">
                            <span className="font-semibold">Agente:</span>{" "}
                            {tarifa.nombre_agente || "No especificado"}{" "}
                            {tarifa.correo_agente
                              ? `(${tarifa.correo_agente})`
                              : ""}
                          </div>
                        )}

                        {tarifa.id_agente && mode === "edit" && (
                          <div className="text-sm bg-blue-50 dark:bg-blue-900 p-2 rounded border border-blue-200 dark:border-blue-800">
                            <span className="font-semibold">
                              Agente seleccionado:
                            </span>{" "}
                            {tarifa.nombre_agente} ({tarifa.correo_agente})
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
                              onChange={(e) =>
                                handleTarifaPreferencialChange(
                                  index,
                                  "costo_q",
                                  e.target.value
                                )
                              }
                              disabled={mode === "view"}
                              className={mode === "view" ? "bg-gray-100" : ""}
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Label htmlFor={`precio_q_${index}`}>
                              Precio Q
                            </Label>
                            <Input
                              id={`precio_q_${index}`}
                              placeholder="0.00"
                              value={tarifa.precio_q}
                              onChange={(e) =>
                                handleTarifaPreferencialChange(
                                  index,
                                  "precio_q",
                                  e.target.value
                                )
                              }
                              disabled={mode === "view"}
                              className={mode === "view" ? "bg-gray-100" : ""}
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Label htmlFor={`costo_qq_${index}`}>
                              Costo QQ
                            </Label>
                            <Input
                              id={`costo_qq_${index}`}
                              placeholder="0.00"
                              value={tarifa.costo_qq}
                              onChange={(e) =>
                                handleTarifaPreferencialChange(
                                  index,
                                  "costo_qq",
                                  e.target.value
                                )
                              }
                              disabled={mode === "view"}
                              className={mode === "view" ? "bg-gray-100" : ""}
                            />
                          </div>
                          <div className="flex flex-col space-y-1">
                            <Label htmlFor={`precio_qq_${index}`}>
                              Precio QQ
                            </Label>
                            <Input
                              id={`precio_qq_${index}`}
                              placeholder="0.00"
                              value={tarifa.precio_qq}
                              onChange={(e) =>
                                handleTarifaPreferencialChange(
                                  index,
                                  "precio_qq",
                                  e.target.value
                                )
                              }
                              disabled={mode === "view"}
                              className={mode === "view" ? "bg-gray-100" : ""}
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
                                handleTarifaPreferencialChange(
                                  index,
                                  "sencilla.incluye",
                                  e.target.checked
                                )
                              }
                              disabled={mode === "view"}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`pref-sencilla-${index}`}>
                              ¿Incluye desayuno en habitación sencilla?
                            </Label>
                          </div>

                          {tarifa.sencilla.incluye && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                              <div className="flex flex-col space-y-1">
                                <Label
                                  htmlFor={`sencilla_tipo_desayuno_${index}`}
                                >
                                  Tipo de desayuno
                                </Label>
                                <Input
                                  id={`sencilla_tipo_desayuno_${index}`}
                                  value={tarifa.sencilla.tipo_desayuno}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(
                                      index,
                                      "sencilla.tipo_desayuno",
                                      e.target.value
                                    )
                                  }
                                  disabled={mode === "view"}
                                  className={
                                    mode === "view" ? "bg-gray-100" : ""
                                  }
                                  placeholder="Continental, Americano, etc."
                                />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`sencilla_precio_${index}`}>
                                  Precio desayuno
                                </Label>
                                <Input
                                  id={`sencilla_precio_${index}`}
                                  type="number"
                                  placeholder="0.00"
                                  value={tarifa.sencilla.precio}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(
                                      index,
                                      "sencilla.precio",
                                      e.target.value
                                    )
                                  }
                                  disabled={mode === "view"}
                                  className={
                                    mode === "view" ? "bg-gray-100" : ""
                                  }
                                />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Label
                                  htmlFor={`sencilla_comentarios_${index}`}
                                >
                                  Comentario
                                </Label>
                                <Input
                                  id={`sencilla_comentarios_${index}`}
                                  value={tarifa.sencilla.comentarios}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(
                                      index,
                                      "sencilla.comentarios",
                                      e.target.value
                                    )
                                  }
                                  disabled={mode === "view"}
                                  className={
                                    mode === "view" ? "bg-gray-100" : ""
                                  }
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
                                handleTarifaPreferencialChange(
                                  index,
                                  "doble.incluye",
                                  e.target.checked
                                )
                              }
                              disabled={mode === "view"}
                              className="h-4 w-4"
                            />
                            <Label htmlFor={`pref-doble-${index}`}>
                              ¿Incluye desayuno en habitación doble?
                            </Label>
                          </div>

                          {tarifa.doble.incluye && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`doble_tipo_desayuno_${index}`}>
                                  Tipo de desayuno
                                </Label>
                                <Input
                                  id={`doble_tipo_desayuno_${index}`}
                                  value={tarifa.doble.tipo_desayuno}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(
                                      index,
                                      "doble.tipo_desayuno",
                                      e.target.value
                                    )
                                  }
                                  disabled={mode === "view"}
                                  className={
                                    mode === "view" ? "bg-gray-100" : ""
                                  }
                                  placeholder="Continental, Americano, etc."
                                />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`doble_precio_${index}`}>
                                  Precio desayuno
                                </Label>
                                <Input
                                  id={`doble_precio_${index}`}
                                  type="number"
                                  placeholder="0.00"
                                  value={tarifa.doble.precio}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(
                                      index,
                                      "doble.precio",
                                      e.target.value
                                    )
                                  }
                                  disabled={mode === "view"}
                                  className={
                                    mode === "view" ? "bg-gray-100" : ""
                                  }
                                />
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Label htmlFor={`doble_comentarios_${index}`}>
                                  Comentario
                                </Label>
                                <Input
                                  id={`doble_comentarios_${index}`}
                                  value={tarifa.doble.comentarios}
                                  onChange={(e) =>
                                    handleTarifaPreferencialChange(
                                      index,
                                      "doble.comentarios",
                                      e.target.value
                                    )
                                  }
                                  disabled={mode === "view"}
                                  className={
                                    mode === "view" ? "bg-gray-100" : ""
                                  }
                                  placeholder="Detalles adicionales"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {mode === "edit" && (
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              className="text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => removeTarifaPreferencial(index)}
                              size="sm"
                            >
                              <Trash2 size={16} className="mr-1" /> Eliminar
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Tab: Información de Pagos */}
            <TabsContent
              value="informacionPagos"
              className="space-y-6 min-h-[400px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="tipo_pago">Tipo de Pago</Label>
                  <Select
                    value={formData.tipo_pago}
                    onValueChange={(value) => handleChange("tipo_pago", value)}
                    disabled={mode === "view"}
                  >
                    <SelectTrigger
                      id="tipo_pago"
                      className={mode === "view" ? "bg-gray-100" : ""}
                    >
                      <SelectValue placeholder="Selecciona el tipo de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tarjeta">Tarjeta</SelectItem>
                      <SelectItem value="transferencia">
                        Transferencia
                      </SelectItem>
                      <SelectItem value="credito">Crédito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="comentario_pago">Comentario de Pago</Label>
                  <Input
                    id="comentario_pago"
                    value={formData.comentario_pago || ""}
                    onChange={(e) =>
                      handleChange("comentario_pago", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Información adicional sobre el pago"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="solicitud_disponibilidad">
                    ¿Cómo se solicita la disponibilidad?
                  </Label>
                  <Input
                    id="solicitud_disponibilidad"
                    value={formData.solicitud_disponibilidad || ""}
                    onChange={(e) =>
                      handleChange("solicitud_disponibilidad", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Email, teléfono, etc."
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="contacto_convenio">Contacto Convenio</Label>
                  <Input
                    id="contacto_convenio"
                    value={formData.contacto_convenio}
                    onChange={(e) =>
                      handleChange("contacto_convenio", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Nombre y datos de contacto"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="cuenta_de_deposito">Cuenta de Depósito</Label>
                  <Input
                    id="cuenta_de_deposito"
                    value={formData.cuenta_de_deposito || ""}
                    onChange={(e) =>
                      handleChange("cuenta_de_deposito", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Datos para realizar depósitos"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="contacto_recepcion">Contacto Recepción</Label>
                  <Input
                    id="contacto_recepcion"
                    value={formData.contacto_recepcion}
                    onChange={(e) =>
                      handleChange("contacto_recepcion", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Nombre y datos de contacto"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label>Impuestos</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="impuestos_porcentaje">Impuesto (%)</Label>
                      <Input
                        id="impuestos_porcentaje"
                        type="number"
                        value={formData.impuestos_porcentaje}
                        onChange={(e) =>
                          handleChange("impuestos_porcentaje", e.target.value)
                        }
                        disabled={mode === "view"}
                        className={mode === "view" ? "bg-gray-100" : ""}
                        placeholder="Ej: 16"
                      />
                    </div>

                    <div className="flex flex-col space-y-1">
                      <Label htmlFor="impuestos_moneda">
                        Impuesto (Moneda)
                      </Label>
                      <Input
                        id="impuestos_moneda"
                        type="number"
                        value={formData.impuestos_moneda}
                        onChange={(e) =>
                          handleChange("impuestos_moneda", e.target.value)
                        }
                        disabled={mode === "view"}
                        className={mode === "view" ? "bg-gray-100" : ""}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="menoresEdad">
                    Política para Menores de Edad
                  </Label>
                  <Input
                    id="menoresEdad"
                    value={formData.menoresEdad}
                    onChange={(e) =>
                      handleChange("menoresEdad", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Información sobre estadía de menores"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="transportacion">Transportación</Label>
                  <Input
                    id="transportacion"
                    value={formData.transportacion}
                    onChange={(e) =>
                      handleChange("transportacion", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Detalles de transportación"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <Label htmlFor="transportacionComentarios">
                    Comentarios sobre Transportación
                  </Label>
                  <Input
                    id="transportacionComentarios"
                    value={formData.transportacionComentarios}
                    onChange={(e) =>
                      handleChange("transportacionComentarios", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
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
                    onChange={(e) =>
                      handleChange("razon_social", e.target.value)
                    }
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
                    placeholder="Nombre legal de la empresa"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab: Información Adicional */}
            <TabsContent
              value="informacionAdicional"
              className="space-y-6 min-h-[400px]"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="id_cadena">
                    Cadena Hotelera <span className="text-red-500">*</span>
                  </Label>
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
                    onValueChange={(value) =>
                      handleChange("tipo_hospedaje", value)
                    }
                    disabled={mode === "view"}
                  >
                    <SelectTrigger
                      id="tipo_hospedaje"
                      className={mode === "view" ? "bg-gray-100" : ""}
                    >
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
                    onValueChange={(value) =>
                      handleChange("calificacion", value)
                    }
                    disabled={mode === "view"}
                  >
                    <SelectTrigger
                      id="calificacion"
                      className={mode === "view" ? "bg-gray-100" : ""}
                    >
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
                  <Label htmlFor="activo">Estado</Label>
                  <Select
                    value={formData.activo.toString()}
                    onValueChange={(value) =>
                      handleChange("activo", parseInt(value))
                    }
                    disabled={mode === "view"}
                  >
                    <SelectTrigger
                      id="activo"
                      className={mode === "view" ? "bg-gray-100" : ""}
                    >
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Activo</SelectItem>
                      <SelectItem value="0">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1 md:col-span-2 flex flex-col space-y-1">
                  <Label htmlFor="notas">Notas Adicionales</Label>
                  <Input
                    id="notas"
                    value={formData.notas}
                    onChange={(e) => handleChange("notas", e.target.value)}
                    disabled={mode === "view"}
                    className={mode === "view" ? "bg-gray-100" : ""}
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
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              hotel <strong>{hotel.nombre}</strong> y todos sus datos asociados.
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
    </>
  );
}
