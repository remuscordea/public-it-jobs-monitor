import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StoredState } from "./types.js";

const DATA_DIR = path.resolve("data");
const STATE_FILE = path.join(DATA_DIR, "seen.json");

const EMPTY_STATE: StoredState = {
  initialized: false,
  announcements: [],
};

export async function loadState(): Promise<StoredState> {
  try {
    const raw = await readFile(STATE_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoredState;

    if (!Array.isArray(parsed.announcements) || typeof parsed.initialized !== "boolean") {
      throw new Error("Structura JSON nu este valida.");
    }

    return parsed;
  } catch (error) {
    if (isMissingFile(error)) return structuredClone(EMPTY_STATE);
    throw new Error(`Nu pot citi ${STATE_FILE}: ${formatError(error)}`);
  }
}

export async function saveState(state: StoredState): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const temporaryFile = `${STATE_FILE}.tmp`;
  const data = `${JSON.stringify(state, null, 2)}\n`;

  try {
    await writeFile(temporaryFile, data, "utf8");
    await rename(temporaryFile, STATE_FILE);
  } catch (error) {
    throw new Error(`Nu pot scrie ${STATE_FILE}: ${formatError(error)}`);
  }
}

function isMissingFile(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
