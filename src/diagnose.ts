import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import { PCAT_SOURCE } from "./config.js";
import { fetchPage } from "./fetch-page.js";
import { parsePcatAnnouncements } from "./sources/pcat.js";

async function main(): Promise<void> {
  console.log(`Descarc ${PCAT_SOURCE.url}`);
  const html = await fetchPage(PCAT_SOURCE.url);
  await mkdir(path.resolve("data"), { recursive: true });
  await writeFile(path.resolve("data/last-page.html"), html, "utf8");

  const $ = cheerio.load(html);
  console.log(`HTML: ${html.length} caractere`);
  console.log(`Titlu pagina: ${$("title").text().trim() || "(lipsa)"}`);
  console.log(`Linkuri totale: ${$("a[href]").length}`);

  const announcements = parsePcatAnnouncements(html, PCAT_SOURCE);
  console.log(`Candidati extrasi: ${announcements.length}\n`);
  for (const item of announcements.slice(0, 30)) {
    console.log(`- ${item.title}\n  ${item.url}`);
  }
  console.log("\nHTML-ul complet a fost salvat in data/last-page.html.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
