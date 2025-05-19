import { Hotel } from "@/app/_types/reservas";
import { Viajero } from "@/types";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Dropdown = ({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  disabled?: boolean;
}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-900 font-medium">{label}</label>
    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">Selecciona una opción</option>
        {options.length > 0 ? (
          options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))
        ) : (
          <option value={value}>{value}</option>
        )}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDown size={18} className="text-gray-500" />
      </div>
    </div>
  </div>
);

// Custom date input component
export const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm text-gray-900 font-medium">{label}</label>
    <div className="relative">
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  </div>
);

// Custom text input component
export const NumberInput = ({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: number;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="flex flex-col space-y-1">
    {label && (
      <label className="text-sm text-gray-900 font-medium">{label}</label>
    )}
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <div className="flex flex-col space-y-1">
    {label && (
      <label className="text-sm text-gray-900 font-medium">{label}</label>
    )}
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
);
// Utilidad para soportar opciones como objetos { name, ... }
export type ComboBoxOption = { name: string; content: Hotel | Viajero };

// Si quieres que el ComboBox soporte objetos, cambia la definición así:
export const ComboBox = ({
  label,
  value,
  onChange,
  options = [],
  sublabel,
  placeholderOption = "Selecciona una opción",
  disabled = false,
}: {
  label?: string;
  sublabel?: string;
  value: ComboBoxOption | null;
  onChange: (value: ComboBoxOption | null) => void;
  options?: ComboBoxOption[];
  placeholderOption?: string;
  disabled?: boolean;
}) => {
  const [inputValue, setInputValue] = useState(value?.name || "");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] =
    useState<ComboBoxOption[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    );
  }, [inputValue, options]);

  useEffect(() => {
    setInputValue(value?.name || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: ComboBoxOption) => {
    setInputValue(option.name);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col space-y-1" ref={containerRef}>
      {label && (
        <label className="text-sm text-gray-900 font-medium line-clamp-1">
          {label}{" "}
          <span className="text-gray-500 text-xs">
            {" "}
            - {sublabel.toLowerCase()}
          </span>{" "}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          disabled={disabled}
          value={inputValue}
          placeholder={placeholderOption}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown size={18} className="text-gray-500" />
        </div>
        {isOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto text-sm">
            {filteredOptions.map((option) => (
              <li
                key={option.name}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 cursor-pointer hover:bg-blue-100"
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

type Option = {
  value: string;
  label: string;
};

export const DropdownValues = ({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
}: {
  label: string;
  value: string | Option | null;
  onChange: (value: Option | null) => void;
  options?: Option[];
  disabled?: boolean;
}) => {
  // Si el value es un string, buscamos el objeto correspondiente
  const selectedId = typeof value === "string" ? value : value?.value ?? "";

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-gray-900 font-medium">{label}</label>
      <div className="relative">
        <select
          value={selectedId}
          onChange={(e) => {
            const selectedOption = options.find(
              (opt) => opt.value === e.target.value
            );
            onChange(selectedOption || null);
          }}
          disabled={disabled}
          className="flex w-full rounded-md border appearance-none border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecciona una opción</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown size={18} className="text-gray-500" />
        </div>
      </div>
    </div>
  );
};
