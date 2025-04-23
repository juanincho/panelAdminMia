"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
interface HotelSearchProps {
  onSearch: (value: string) => void;
  initialValue?: string; // Hacerlo opcional con ?
  isLoading?: boolean;   // Hacerlo opcional con ?
}

export function HotelSearch({ onSearch, initialValue = '', isLoading = false }: HotelSearchProps) {
  const [searchValue, setSearchValue] = useState(initialValue);
  return (
    <Input
      placeholder="Buscar hotel..."
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
