import { createColors } from "picocolors";

export type CliMode = "manual" | "scheduled";

export function readMode(args: string[]): CliMode {
  const value = args.find((argument) => argument.startsWith("--mode="))?.slice(7);
  if (value === undefined || value === "scheduled") return "scheduled";
  if (value === "manual") return "manual";
  throw new Error(`Mod de executie invalid: ${value}. Foloseste manual sau scheduled.`);
}

export function formatDiscovery(count: number, mode: CliMode): string {
  if (mode === "scheduled") return "=== ANUNTURI IT NOI ===";

  const label =
    count === 1 ? "NEW IT ANNOUNCEMENT FOUND!" : `${count} NEW IT ANNOUNCEMENTS FOUND!`;
  return createColors(true).green(label);
}

export function formatElapsed(milliseconds: number): string {
  return milliseconds < 1_000 ? `${milliseconds} ms` : `${(milliseconds / 1_000).toFixed(1)} s`;
}

export function emailConfirmation(mode: CliMode, emailWasSent: boolean): string | null {
  return mode === "manual" && emailWasSent ? "Email notification sent." : null;
}
