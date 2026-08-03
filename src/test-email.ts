import "dotenv/config";
import { createNotifier } from "./notify.js";
import type { Announcement } from "./types.js";

const sample: Announcement = {
  id: "email-test",
  sourceId: "email-test",
  sourceName: "Test Public IT Jobs Monitor",
  title: "Mesaj de test pentru configurarea Gmail SMTP",
  url: "https://pcatimisoara.mpublic.ro/",
  detectedAt: new Date().toISOString(),
};

async function main(): Promise<void> {
  const notifier = createNotifier({ ...process.env, NOTIFIER: "email" });
  await notifier.notify([sample]);
  console.log("Emailul de test a fost trimis. Istoricul nu a fost modificat.");
}

main().catch((error: unknown) => {
  console.error(`Eroare: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
