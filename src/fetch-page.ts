import { FETCH_TIMEOUT_MS, USER_AGENT } from "./config.js";

export async function fetchPage(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "ro-RO,ro;q=0.9,en;q=0.7",
        "cache-control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Cererea HTTP a esuat: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    if (html.trim().length < 200) {
      throw new Error(`Pagina returnata pare goala (${html.length} caractere).`);
    }

    return html;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Pagina nu a raspuns in ${FETCH_TIMEOUT_MS} ms.`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
