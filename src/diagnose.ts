import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import { fetchPage } from "./fetch-page.js";
import { PcatSource, parsePcatAnnouncements } from "./sources/pcat.js";

async function main(): Promise<void> {
  const source = new PcatSource();
  console.log(`Descarc ${source.url}`);
  const html = await fetchPage(source.url);
  await mkdir(path.resolve("data"), { recursive: true });
  await writeFile(path.resolve("data/last-page.html"), html, "utf8");

  const $ = cheerio.load(html);
  console.log(`HTML: ${html.length} caractere`);
  console.log(`Titlu pagina: ${$("title").text().trim() || "(lipsa)"}`);
  console.log(`Linkuri totale: ${$("a[href]").length}`);

  const announcements = parsePcatAnnouncements(html, source);
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
