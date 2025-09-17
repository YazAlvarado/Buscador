import React from "react";

export default function TablaResultados({
  datos,
  pagina,
  setPagina,
  totalPaginas,
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Título
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Autores
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Revista
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Año
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Fuente
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">
              Enlace / DOI
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {datos.map((art, i) => (
            <tr
              key={i}
              className="hover:bg-blue-50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-3 text-sm font-medium text-gray-900">
                {art.titulo}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">{art.autores}</td>
              <td className="px-6 py-3 text-sm text-gray-700">
                {art.revista || "—"}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">
                {art.fecha?.slice(0, 4) || "—"}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">{art.fuente}</td>
              <td className="px-6 py-3 text-sm text-blue-600">
                {art.doi && (
                  <a
                    href={art.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline mr-2"
                  >
                    DOI
                  </a>
                )}
                {art.link && (
                  <a
                    href={art.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Enlace
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-center gap-2 mt-4 pb-4">
        <button
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPagina(pagina - 1)}
          disabled={pagina === 1}
        >
          Anterior
        </button>
        <span className="px-3 py-1 font-medium">
          {pagina} / {totalPaginas}
        </span>
        <button
          className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPagina(pagina + 1)}
          disabled={pagina === totalPaginas}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
