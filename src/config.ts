import type { SourceDefinition } from "./types.js";

export const PCAT_SOURCE: SourceDefinition = {
  id: "pcat-timisoara",
  name: "PCAT Timisoara",
  url: "https://pcatimisoara.mpublic.ro/index.php/ro/resurse-umane/posturi-vacante",
};

export const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT_MS ?? 30_000);

export const USER_AGENT =
  process.env.USER_AGENT ??
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/150 Safari/537.36 PublicITJobsMonitor/0.1";
