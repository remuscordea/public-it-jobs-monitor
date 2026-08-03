import { createHash } from "node:crypto";
import { normalizeText } from "./text.js";

export function announcementId(sourceId: string, title: string, url: string): string {
  const input = `${sourceId}|${normalizeText(title)}|${url.trim()}`;
  return createHash("sha256").update(input).digest("hex");
}
