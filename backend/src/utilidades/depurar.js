export function depurarResultados(resultados) {
  const mapa = new Map();
  resultados.forEach((articulo) => {
    if (!mapa.has(articulo.titulo)) {
      mapa.set(articulo.titulo, articulo);
    }
  });
  return Array.from(mapa.values());
}
