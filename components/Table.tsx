import { exportToCSV } from "@/helpers/utils";
import { ArrowDown, FileDown } from "lucide-react";
import { useState, useEffect, useMemo, use } from "react";

type Registro = {
  [key: string]: any;
};

type RendererMap = {
  [key: string]: React.FC<{ value: any }>;
};

interface TableProps {
  registros: Registro[];
  renderers?: RendererMap;
  defaultSort: {
    key: string;
    sort: boolean;
  };
  exportButton?: boolean;
}

export const Table = ({
  registros,
  renderers = {},
  defaultSort,
  exportButton = true,
}: TableProps) => {
  const [displayData, setDisplayData] = useState<Registro[]>(registros);
  const [currentSort, setCurrentSort] = useState<{
    key: string;
    sort: boolean;
  }>(defaultSort);

  useEffect(() => {
    setDisplayData(registros);
    setCurrentSort(defaultSort);
  }, [registros]);

  useEffect(() => {
    handleSort(defaultSort.key);
  }, [currentSort]);

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
      (currentSort.sort ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1
    );
    setDisplayData(sortedData);
  };

  return (
    <div className="relative w-full">
      {exportButton && (
        <div className="flex w-full justify-end mb-2">
          <button
            onClick={() => exportToCSV(displayData, "Solicitudes.csv")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
        </div>
      )}
      <div className="overflow-auto border border-gray-200 rounded-sm w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 absoluteg top-0">
            <tr>
              {columnKeys.map((key) => (
                <th
                  key={key}
                  scope="col"
                  onClick={() =>
                    setCurrentSort({ key, sort: !currentSort.sort })
                  }
                  className="px-6 min-w-fit whitespace-nowrap py-3 text-left cursor-pointer text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  <span className="flex gap-2">
                    {key == (currentSort.key || "") && (
                      <ArrowDown
                        className={`w-4 h-4 ${
                          !currentSort.sort ? "" : "rotate-180"
                        }`}
                      />
                    )}
                    {key.replace(/_/g, " ").toUpperCase()}{" "}
                  </span>
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
                        key={`${
                          item.id !== undefined ? item.id : index
                        }-${colKey}`}
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
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
