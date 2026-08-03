import { SOURCES } from "./config/sources.js";
import { ConsoleNotifier } from "./notify.js";
import { isItRelevant } from "./relevance.js";
import { loadState, saveState } from "./storage.js";
import type { Announcement } from "./types.js";

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const notifier = new ConsoleNotifier();
  const current: Announcement[] = [];

  for (const source of SOURCES) {
    console.log(`[${new Date().toISOString()}] Verific ${source.name}...`);
    const announcements = await source.fetchAnnouncements();
    current.push(...announcements);
    console.log(`Anunturi extrase din ${source.name}: ${announcements.length}`);
  }

  const state = await loadState();
  const seenIds = new Set(state.announcements.map((item) => item.id));
  const newAnnouncements = current.filter((item) => !seenIds.has(item.id));
  const relevant = newAnnouncements.filter((item) => isItRelevant(item.title));

  console.log(`Anunturi noi: ${newAnnouncements.length}`);
  console.log(`Anunturi IT noi: ${relevant.length}`);

  if (!state.initialized) {
    console.log("Prima rulare: initializez istoricul fara notificari.");
  } else if (relevant.length > 0) {
    console.log("\n=== ANUNTURI IT NOI ===");
    for (const item of relevant) {
      await notifier.notify(item);
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
