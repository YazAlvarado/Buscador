// backend/src/rutas/busqueda.js
import express from "express";
import { buscarArticulosGoogleScholar } from "../servicios/googleScholar.js";
import { buscarArticulosOpenAlex } from "../servicios/openalex.js";
import { buscarArticulosPubMed } from "../servicios/pubmed.js";
import { buscarArticulosSemantic } from "../servicios/semantic.js";

const router = express.Router();

const normalizarArticulo = (articulo, fuente) => ({
  titulo: articulo.titulo ? articulo.titulo.toString() : "Sin título",
  autores: articulo.autores ? articulo.autores.toString() : "Sin autores",
  publicacion: articulo.revista || articulo.publicacion || "",
  fecha: articulo.fecha ? articulo.fecha.toString() : "Sin fecha",
  link: articulo.link || articulo.enlace || "",
  doi: articulo.doi || null,
  fuente,
});

/**
 * Elimina duplicados usando DOI o título
 */
const eliminarDuplicados = (articulos) => {
  const vistos = new Set();
  return articulos.filter((art) => {
    const titulo = art.titulo ? art.titulo.toString().toLowerCase() : "";
    const clave = art.doi || titulo;
    if (vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });
};

router.get("/", async (req, res) => {
  const { termino } = req.query;
  if (!termino || termino.trim() === "") {
    return res
      .status(400)
      .json({ error: "Debes proporcionar un término de búsqueda." });
  }

  try {
    const resultados = [];

    // Google Scholar
    try {
      const gs = await buscarArticulosGoogleScholar(termino);
      resultados.push(
        ...gs.map((a) => normalizarArticulo(a, "Google Scholar"))
      );
      console.log(
        `[OK] Servicio Google Scholar retornó ${gs.length} artículos`
      );
    } catch (e) {
      console.error("Error en Google Scholar:", e.message);
    }

    // Semantic Scholar
    try {
      const ss = await buscarArticulosSemantic(termino);
      resultados.push(
        ...ss.map((a) => normalizarArticulo(a, "Semantic Scholar"))
      );
      console.log(
        `[OK] Servicio Semantic Scholar retornó ${ss.length} artículos`
      );
    } catch (e) {
      console.error("Error en Semantic Scholar:", e.message);
    }

    // OpenAlex
    try {
      const oa = await buscarArticulosOpenAlex(termino);
      resultados.push(...oa.map((a) => normalizarArticulo(a, "OpenAlex")));
      console.log(`[OK] Servicio OpenAlex retornó ${oa.length} artículos`);
    } catch (e) {
      console.error("Error en OpenAlex:", e.message);
    }

    // PubMed
    try {
      const pm = await buscarArticulosPubMed(termino);
      resultados.push(...pm.map((a) => normalizarArticulo(a, "PubMed")));
      console.log(`[OK] Servicio PubMed retornó ${pm.length} artículos`);
    } catch (e) {
      console.error("Error en PubMed:", e.message);
    }

    // Eliminar duplicados
    const articulosUnicos = eliminarDuplicados(resultados);

    res.json({ total: articulosUnicos.length, articulos: articulosUnicos });
  } catch (error) {
    console.error("Error en búsqueda académica global:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al buscar los artículos." });
  }
});

export default router;
