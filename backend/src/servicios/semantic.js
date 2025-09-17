import axios from "axios";
/**
 * @param {string} termino
 * @param {number} maxResults
 * @returns {Array}
 */

export async function buscarArticulosSemantic(termino, maxResults = 20) {
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search`;

    const respuesta = await axios.get(url, {
      params: {
        query: termino,
        limit: maxResults,
        fields: "title,authors,venue,year,url,doi",
      },
      headers: {
        "x-api-key": process.env.SEMANTIC_SCHOLAR_API_KEY || "", //pendiente c:
      },
    });

    if (!respuesta.data.data || respuesta.data.data.length === 0) return [];

    const articulos = respuesta.data.data.map((art) => {
      const autores = art.authors
        ? art.authors.map((a) => a.name).join(", ")
        : "Sin autores";

      return {
        titulo: art.title ?? "Sin título",
        autores,
        revista: art.venue ?? "Sin revista",
        fecha: art.year ?? "Sin fecha",
        doi: art.doi ?? null,
        enlace: art.url ?? null,
      };
    });

    return articulos;
  } catch (error) {
    console.error("Error en Semantic Scholar:", error.message);
    return [];
  }
}
