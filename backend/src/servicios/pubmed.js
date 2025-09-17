import axios from "axios";
import { XMLParser } from "fast-xml-parser";

/**
 * @param {string} termino
 * @param {number} maxResults
 * @returns {Array}
 */

export async function buscarArticulosPubMed(termino, maxResults = 10) {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;
    const searchResp = await axios.get(searchUrl, {
      params: {
        db: "pubmed",
        term: termino,
        retmode: "json",
        retmax: maxResults,
        api_key: process.env.PUBMED_API_KEY, // opcional
      },
    });

    const ids = searchResp.data.esearchresult.idlist;
    if (!ids.length) return [];

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi`;
    const fetchResp = await axios.get(fetchUrl, {
      params: {
        db: "pubmed",
        id: ids.join(","),
        retmode: "xml",
        api_key: process.env.PUBMED_API_KEY, // opcional
      },
    });

    const parser = new XMLParser({ ignoreAttributes: false });
    const jsonData = parser.parse(fetchResp.data);

    const articulosXml = Array.isArray(jsonData.PubmedArticleSet.PubmedArticle)
      ? jsonData.PubmedArticleSet.PubmedArticle
      : [jsonData.PubmedArticleSet.PubmedArticle];

    return articulosXml.map((art) => {
      const info = art.MedlineCitation.Article;
      const autores = info.AuthorList?.Author
        ? (Array.isArray(info.AuthorList.Author)
            ? info.AuthorList.Author.map(
                (a) => `${a.ForeName ?? ""} ${a.LastName ?? ""}`
              )
            : [
                `${info.AuthorList.Author.ForeName ?? ""} ${
                  info.AuthorList.Author.LastName ?? ""
                }`,
              ]
          ).join(", ")
        : "Sin autores";

      const fecha =
        info.Journal?.JournalIssue?.PubDate?.Year ??
        info.Journal?.JournalIssue?.PubDate?.MedlineDate ??
        "Sin fecha";

      return {
        titulo: info.ArticleTitle ?? "Sin título",
        autores,
        revista: info.Journal?.Title ?? "Sin revista",
        fecha,
        enlace: `https://pubmed.ncbi.nlm.nih.gov/${art.MedlineCitation.PMID["#text"]}/`,
      };
    });
  } catch (error) {
    console.error("Error en PubMed:", error.message);
    return [];
  }
}
