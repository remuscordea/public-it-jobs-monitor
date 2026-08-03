import "dotenv/config";
import { emailConfirmation, formatDiscovery, formatElapsed, readMode } from "./cli.js";
import { SOURCES } from "./config/sources.js";
import { ConsoleNotifier, EmailNotifier, createNotifier } from "./notify.js";
import { isItRelevant } from "./relevance.js";
import { loadState, saveState } from "./storage.js";
import type { Announcement } from "./types.js";

async function main(): Promise<void> {
  const startedAt = Date.now();
  const mode = readMode(process.argv);
  const manual = mode === "manual";
  const dryRun = process.argv.includes("--dry-run");
  const notifier = dryRun ? new ConsoleNotifier() : createNotifier();
  const current: Announcement[] = [];

  if (manual) {
    console.log("==========================================");
    console.log(" Public IT Jobs Monitor");
    console.log("==========================================\n");
    console.log("Checking sources...\n");
  }

  for (const source of SOURCES) {
    if (!manual) console.log(`[${new Date().toISOString()}] Verific ${source.name}...`);
    const announcements = await source.fetchAnnouncements();
    current.push(...announcements);
    if (manual) {
      console.log(`${source.name}\n  Announcements: ${announcements.length}\n`);
    } else {
      console.log(`Anunturi extrase din ${source.name}: ${announcements.length}`);
    }
  }

  const state = await loadState();
  const seenIds = new Set(state.announcements.map((item) => item.id));
  const newAnnouncements = current.filter((item) => !seenIds.has(item.id));
  const relevant = newAnnouncements.filter((item) => isItRelevant(item.title));

  if (manual) {
    console.log("------------------------------------------\n");
    console.log(`New announcements: ${newAnnouncements.length}`);
    console.log(`New IT announcements: ${relevant.length}\n`);
  } else {
    console.log(`Anunturi noi: ${newAnnouncements.length}`);
    console.log(`Anunturi IT noi: ${relevant.length}`);
  }

  if (!state.initialized) {
    console.log(
      manual
        ? "First run: initializing history without notifications."
        : "Prima rulare: initializez istoricul fara notificari.",
    );
  } else if (relevant.length > 0 && !dryRun) {
    if (manual) {
      console.log(`${formatDiscovery(relevant.length, mode)}\n`);
      if (notifier instanceof EmailNotifier) printManualAnnouncements(relevant);
    } else {
      console.log(`\n${formatDiscovery(relevant.length, mode)}`);
    }

    await notifier.notify(relevant);
    const confirmation = emailConfirmation(mode, notifier instanceof EmailNotifier);
    if (confirmation) console.log(confirmation);
  } else if (relevant.length > 0) {
    await notifier.notify(relevant);
    console.log("Dry-run: notificarea nu a fost trimisa.");
  } else {
    console.log(manual ? "No new IT announcements." : "Nu exista anunturi IT noi.");
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
  if (manual) {
    console.log(`\nFinished in ${formatElapsed(Date.now() - startedAt)}`);
  } else {
    console.log("Istoricul a fost salvat in data/seen.json.");
  }
}

function printManualAnnouncements(announcements: Announcement[]): void {
  for (const announcement of announcements) {
    console.log(`${announcement.sourceName}\n${announcement.title}\n${announcement.url}\n`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Eroare: ${message}`);
  process.exitCode = 1;
});
