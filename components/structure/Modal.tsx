import React, { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  title?: string;
  children: ReactNode;
  subtitle?: string;
}

const Modal: React.FC<ModalProps> = ({
  onClose,
  title,
  children,
  subtitle,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      {/* Contenido del modal */}
      <div
        className="relative bg-white rounded-lg lg:max-w-[80%] overflow-hidden shadow-xl transform transition-all sm:max-w-4xl sm:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cerrar */}
        <button
          type="button"
          className="absolute right-2 top-2 p-2 text-lg font-bold"
          aria-label="Cerrar"
          onClick={onClose}
        >
          ×
        </button>
        <div className="p-4 space-y-2">
          {title && (
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          <div className="w-full max-h-[600px] h-fit overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
