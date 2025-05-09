"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { HotelTable } from "./hotel-table";
import { HotelSearch } from "./hotel-search";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HotelDialog } from "./hotel-dialog";
import { AddHotelDialog } from "./addHotelDialog";
import { API_KEY } from "@/app/constants/constantes";

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
  Estado?: string;
  Ciudad_Zona?: string;
  NoktosQ?: number;
  NoktosQQ?: number;
  MenoresEdad?: string;
  PaxExtraPersona?: string;
  PaxExtraPersona2?: string;
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

export function HotelContainer() {
  const [hotelData, setHotelData] = useState<FullHotelData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<FullHotelData | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handleRowClick = (hotel: FullHotelData) => {
    setSelectedHotel(hotel);
    setDialogOpen(true);
  };

  const fetchHotels = async (page: number, search: string = "") => {
    console.log(page)
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.set("termino", search);
      } else {
        params.set("pagina", page.toString());
      }

      const url = search
        ? `https://mianoktos.vercel.app/v1/mia/hoteles/Consulta-Hoteles-por-termino?${params.toString()}`
        : `https://mianoktos.vercel.app/v1/mia/hoteles/Paginacion?${params.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al cargar hoteles");

      const result = await response.json();
      console.log("revisando estructura",result)
      const raw = result.hoteles;
      const hotels = Array.isArray(raw) ? Array.isArray(raw[0]) ? raw[0] : raw  : [];
      const info_pag = result.info || [];
      console.log("revisando el acceso a la segunda query",info_pag)
      setHotelData(hotels);
      setTotalPages(info_pag.total_paginas || 1);
      setTotalItems(info_pag.total_registros || hotels.length);
      setCurrentPage(page);
      setSearchTerm(search);
    } catch (error) {
      console.error("Error:", error);
      setHotelData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("pagina", newPage.toString());
    if (searchTerm) params.set("termino", searchTerm);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams();
    params.set("pagina", "1");
    router.push(`${pathname}?${params.toString()}`);
    setSearchTerm("")
    fetchHotels(1, "");
  };

  useEffect(() => {
    const page = parseInt(searchParams.get("pagina") || "1", 10);
    const term = searchParams.get("termino") || "";
    fetchHotels(page, term);
  }, [searchParams.toString()]);

  return (
    <div className="space-y-8">
      <Card>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HotelSearch
                onSearch={(term) => {
                  const params = new URLSearchParams();
                  params.set("pagina", "1");
                  params.set("termino", term);
                  router.push(`${pathname}?${params.toString()}`);
                  setSearchTerm(term)
                }}
                initialValue={searchTerm}
                isLoading={isLoading}
              />
              {searchTerm && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Limpiar búsqueda
                </Button>
              )}
            </div>

            <Button
              onClick={() => setAddDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Agregar hotel
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Cargando hoteles...</p>
            </div>
          ) : (
            <>
              <HotelTable data={hotelData} onRowClick={handleRowClick} />

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    variant="outline"
                    disabled={!hasPrev || isLoading}
                  >
                    Anterior
                  </Button>

                  <span className="text-sm">
                    Página {currentPage} de {totalPages}
                  </span>

                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    variant="outline"
                    disabled={!hasNext || isLoading}
                  >
                    Siguiente
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Ir a:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(1, parseInt(e.target.value) || 1),
                        totalPages
                      );
                      setCurrentPage(value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handlePageChange(currentPage);
                      }
                    }}
                    className="w-16 px-2 py-1 border rounded text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => handlePageChange(currentPage)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    disabled={isLoading}
                  >
                    Ir
                  </Button>
                </div>

                <span className="text-sm text-gray-600">
                  Total: {totalItems} hoteles
                </span>
              </div>
            </>
          )}
        </div>
      </Card>

      <HotelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        hotel={selectedHotel}
        onSuccess={() => {
          fetchHotels(currentPage, searchTerm);
        }}
      />

      <AddHotelDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={() => {
          fetchHotels(currentPage, searchTerm);
        }}
      />
    </div>
  );
}
