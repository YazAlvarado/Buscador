import React, { useState, useEffect } from "react";
import FormularioBusqueda from "./componentes/FormularioBusqueda.jsx";
import TablaResultados from "./componentes/TablaResultados.jsx";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function App() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [termino, setTermino] = useState(
    "Hospital Regional de Alta Especialidad de Ixtapaluca"
  );
  const [fuenteFiltro, setFuenteFiltro] = useState("Todas");
  const [anioFiltro, setAnioFiltro] = useState("Todos");

  useEffect(() => {
    if (termino.trim() !== "") buscarArticulos(termino);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (termino.trim() !== "") buscarArticulos(termino);
      else setDatos([]);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [termino]);

  const buscarArticulos = async (consulta) => {
    setCargando(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/busqueda?termino=${consulta}`
      );
      setDatos(res.data.articulos);
    } catch (error) {
      console.error("Error al buscar:", error);
      setDatos([]);
    } finally {
      setCargando(false);
    }
  };

  const listaAnios = [
    "Todos",
    ...Array.from(
      new Set(datos.map((a) => (a.fecha ? a.fecha.slice(0, 4) : "Sin año")))
    ).sort((a, b) => b - a),
  ];

  const datosFiltrados = datos
    .filter((a) => fuenteFiltro === "Todas" || a.fuente === fuenteFiltro)
    .filter(
      (a) =>
        anioFiltro === "Todos" ||
        (a.fecha?.slice(0, 4) || "Sin año") === anioFiltro
    );

  const exportarExcel = () => {
    if (!datosFiltrados.length) return;

    const ws = XLSX.utils.json_to_sheet(
      datosFiltrados.map((a) => ({
        Título: a.titulo,
        Autores: a.autores,
        Revista: a.revista,
        Año: a.fecha?.slice(0, 4) || "—",
        Fuente: a.fuente,
        DOI: a.doi || "",
        Enlace: a.link || "",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Artículos");
    const archivo = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([archivo], { type: "application/octet-stream" }),
      "articulos.xlsx"
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md p-6">
        <h1 className="text-3xl font-bold text-center">
          Buscador de Artículos
        </h1>
        <p className="text-center mt-2 text-blue-100">
          Encuentra información al instante
        </p>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <FormularioBusqueda termino={termino} setTermino={setTermino} />

        {cargando && (
          <div className="text-center mt-10">
            <div className="loader mb-2"></div>
            <p className="text-gray-600 font-medium">
              Buscando artículos, por favor espera...
            </p>
          </div>
        )}

        {!cargando && datos.length > 0 && (
          <div className="mt-6 space-y-4">
            {/* Filtros */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <div>
                <span className="font-semibold mr-2">Fuente:</span>
                {[
                  "Todas",
                  "OpenAlex",
                  "PubMed",
                  "Google Scholar",
                  "Semantic Scholar",
                ].map((f) => (
                  <button
                    key={f}
                    className={`px-3 py-1 rounded-full border ${
                      fuenteFiltro === f
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => setFuenteFiltro(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div>
                <span className="font-semibold mr-2">Año:</span>
                <select
                  className="px-3 py-1 border rounded-md"
                  value={anioFiltro}
                  onChange={(e) => setAnioFiltro(e.target.value)}
                >
                  {listaAnios.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="ml-2 px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={exportarExcel}
              >
                Exportar a Excel
              </button>
            </div>

            {/* Tabla de resultados */}
            <TablaResultados datos={datosFiltrados} />
          </div>
        )}

        {!cargando && datos.length === 0 && termino && (
          <p className="text-center mt-10 text-gray-500 animate-fadeIn">
            No se encontraron artículos para "{termino}".
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-4">
        <p>© {new Date().getFullYear()} Todos los derechos. reservados.</p>
      </footer>
    </div>
  );
}
