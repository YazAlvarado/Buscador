import React from "react";

export default function FormularioBusqueda({ termino, setTermino }) {
  return (
    <div className="flex justify-center mb-6 animate-fadeIn">
      <input
        type="text"
        value={termino}
        onChange={(e) => setTermino(e.target.value)}
        placeholder="Buscar artículos académicos..."
        className="w-full max-w-xl px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
      />
      <button
        onClick={() => {}}
        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        🔍
      </button>
    </div>
  );
}
