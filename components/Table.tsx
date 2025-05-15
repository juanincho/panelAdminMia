import { useState, useEffect, useMemo } from "react";

type Registro = {
  [key: string]: any;
};

type RendererMap = {
  [key: string]: React.FC<{ value: any }>;
};

interface TableProps {
  registros: Registro[];
  renderers?: RendererMap;
}

export const Table = ({ registros, renderers = {} }: TableProps) => {
  const [displayData, setDisplayData] = useState<Registro[]>(registros);

  useEffect(() => {
    setDisplayData(registros);
  }, [registros]);

  const columnKeys = useMemo(() => {
    if (
      registros &&
      registros.length > 0 &&
      typeof registros[0] === "object" &&
      registros[0] !== null
    ) {
      return Object.keys(registros[0]);
    }
    return [];
  }, [registros]);

  const handleSort = (key: string) => {
    const sortedData = displayData.toSorted((a, b) =>
      a[key] > b[key] ? 1 : -1
    );
    setDisplayData(sortedData);
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columnKeys.map((key) => (
            <th
              key={key}
              scope="col"
              onClick={() => handleSort(key)}
              className="px-6 min-w-fit whitespace-nowrap py-3 text-left cursor-pointer text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              {key.replace(/_/g, " ").toUpperCase()}{" "}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {displayData.length > 0 ? (
          displayData.map((item, index) => (
            <tr
              key={item.id !== undefined ? item.id : index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {columnKeys.map((colKey) => {
                const Renderer = renderers[colKey];
                const value = item[colKey];

                return (
                  <td
                    key={`${item.id !== undefined ? item.id : index}-${colKey}`}
                    className="px-6 py-4 whitespace-nowrap text-xs text-gray-900"
                  >
                    {Renderer ? (
                      <Renderer value={value} />
                    ) : (
                      String(value || "")
                    )}
                  </td>
                );
              })}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columnKeys.length || 1}
              className="px-6 py-4 text-center text-sm text-gray-500"
            >
              No se encontraron registros con los filtros aplicados
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
