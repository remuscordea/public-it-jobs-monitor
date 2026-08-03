import { PCAT_SOURCE } from "./config.js";
import { fetchPage } from "./fetch-page.js";
import { isItRelevant } from "./relevance.js";
import { loadState, saveState } from "./storage.js";
import { parsePcatAnnouncements } from "./sources/pcat.js";

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  console.log(`[${new Date().toISOString()}] Verific ${PCAT_SOURCE.name}...`);

  const html = await fetchPage(PCAT_SOURCE.url);
  const current = parsePcatAnnouncements(html, PCAT_SOURCE);
  const state = await loadState();
  const seenIds = new Set(state.announcements.map((item) => item.id));
  const newAnnouncements = current.filter((item) => !seenIds.has(item.id));
  const relevant = newAnnouncements.filter((item) => isItRelevant(item.title));

  console.log(`Anunturi extrase: ${current.length}`);
  console.log(`Anunturi noi: ${newAnnouncements.length}`);
  console.log(`Anunturi IT noi: ${relevant.length}`);

  if (!state.initialized) {
    console.log("Prima rulare: initializez istoricul fara notificari.");
  } else if (relevant.length > 0) {
    console.log("\n=== ANUNTURI IT NOI ===");
    for (const item of relevant) {
      console.log(`- ${item.title}\n  ${item.url}`);
    }
  } else {
    console.log("Nu exista anunturi IT noi.");
  }

  if (dryRun) {
    console.log("Dry-run: seen.json nu a fost modificat.");
    return;
  }

  const merged = new Map(state.announcements.map((item) => [item.id, item]));
  for (const item of current) merged.set(item.id, item);

  await saveState({
    initialized: true,
    announcements: [...merged.values()],
  });
  console.log("Istoricul a fost salvat in data/seen.json.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Eroare: ${message}`);
  process.exitCode = 1;
});
