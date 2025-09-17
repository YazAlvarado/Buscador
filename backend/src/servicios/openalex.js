import axios from "axios";
/**
 * @param {string} termino
 * @param {number} maxResults
 * @returns {Array}
 */
export async function buscarArticulosOpenAlex(termino, maxResults = 20) {
  try {
    const url = `https://api.openalex.org/works`;
    const respuesta = await axios.get(url, {
      params: {
        search: termino,
        per_page: maxResults,
        mailto: "yazminaa12@gmail.com",
      },
    });

    if (!respuesta.data.results || respuesta.data.results.length === 0) {
      return [];
    }
    const articulos = respuesta.data.results.map((art) => {
      const autores = art.authorships
        ? art.authorships.map((a) => a.author.display_name).join(", ")
        : "Sin autores";

      return {
        titulo: art.title ?? "Sin título",
        autores,
        revista: art.host_venue?.display_name ?? "Sin revista",
        fecha: art.publication_date ?? "Sin fecha",
        doi: art.doi ?? null,
        enlace: art.id ?? null,
      };
    });

    return articulos;
  } catch (error) {
    console.error("Error en OpenAlex:", error.message);
    return [];
  }
}
