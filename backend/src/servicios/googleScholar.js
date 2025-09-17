import axios from "axios";
import "dotenv/config";

const SERPAPI_KEY = process.env.SERPAPI_KEY;

export async function buscarArticulosGoogleScholar(consulta, cantidad = 20) {
  try {
    const url = "https://serpapi.com/search.json";
    const params = {
      q: consulta,
      engine: "google_scholar",
      api_key: SERPAPI_KEY,
      num: cantidad,
    };

    const respuesta = await axios.get(url, { params });
    const resultados = respuesta.data.scholar_results || [];

    return resultados.map((r) => ({
      titulo: r.title || "",
      autores: r.authors?.map((a) => a.name).join(", ") || "",
      publicacion: r.publication_info?.summary || "",
      año: r.publication_info?.year || "",
      link: r.link || "",
    }));
  } catch (error) {
    console.error("Error Google Scholar:", error.message);
    return [];
  }
}
