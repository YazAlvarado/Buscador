import React, { useState, useEffect } from "react";
import axios from "axios";

const FormularioBusqueda = ({ termino, setTermino, onBuscar }) => {
  return (
    <div className="flex justify-center mb-6 animate-fadeIn">
      <input
        type="text"
        placeholder="Escribe tu término de búsqueda..."
        className="w-2/3 p-3 border rounded-l-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onBuscar()}
      />
      <button
        onClick={onBuscar}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg font-semibold shadow"
      >
        Buscar
      </button>
    </div>
  );
};

const TablaResultados = ({ datos, pagina, setPagina, totalPaginas }) => {
  return (
    <div className="overflow-x-auto animate-fadeIn">
      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Título</th>
            <th className="py-2 px-4 text-left">Autores</th>
            <th className="py-2 px-4 text-left">Revista</th>
            <th className="py-2 px-4 text-left">Fecha</th>
            <th className="py-2 px-4 text-left">Enlace</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((art, i) => (
            <tr
              key={i}
              className="hover:bg-blue-50 border-b transition-colors duration-200"
            >
              <td className="py-2 px-4">{art.titulo}</td>
              <td className="py-2 px-4">{art.autores}</td>
              <td className="py-2 px-4">{art.revista}</td>
              <td className="py-2 px-4">{art.fecha}</td>
              <td className="py-2 px-4">
                {art.link ? (
                  <a
                    href={art.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Ver
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          disabled={pagina === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-3 py-1">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          disabled={pagina === totalPaginas}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

// Componente principal App
export default function App() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [termino, setTermino] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const ITEMS_POR_PAGINA = 10;

  const buscarArticulos = async () => {
    if (!termino.trim()) return;
    setCargando(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/busqueda?termino=${encodeURIComponent(
          termino
        )}`
      );
      setDatos(res.data.articulos);
      setTotalPaginas(Math.ceil(res.data.articulos.length / ITEMS_POR_PAGINA));
      setPagina(1);
    } catch (error) {
      console.error("Error al buscar:", error);
      setDatos([]);
      setTotalPaginas(1);
    } finally {
      setCargando(false);
    }
  };

  const paginaActual = datos.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center mb-6 animate-fadeIn text-blue-700">
        Buscador de Artículos Académicos
      </h1>

      <FormularioBusqueda
        termino={termino}
        setTermino={setTermino}
        onBuscar={buscarArticulos}
      />

      {cargando && (
        <div className="text-center mt-10">
          <div className="loader mb-2 border-t-4 border-blue-500 border-r-4 border-green-500 border-b-4 border-yellow-500 border-l-4 border-red-500 animate-spin w-12 h-12 rounded-full mx-auto"></div>
          <p className="text-gray-600 mt-2">
            Buscando artículos, por favor espera...
          </p>
        </div>
      )}

      {!cargando && datos.length === 0 && termino && (
        <p className="text-center mt-10 text-gray-500 animate-fadeIn">
          No se encontraron artículos para "{termino}".
        </p>
      )}

      {!cargando && datos.length > 0 && (
        <TablaResultados
          datos={paginaActual}
          pagina={pagina}
          setPagina={setPagina}
          totalPaginas={totalPaginas}
        />
      )}
    </div>
  );
}
