import { normalizeText } from "./text.js";

const IT_PATTERNS: RegExp[] = [
  /\bspecialist\s+(?:i\.?\s*t\.?|informatic)\b/,
  /\bspecialist\b.*\b(?:hardware|software|informatica|informatic)\b/,
  /\bspecialist\s+(?:in\s+)?tehnologia\s+informatiei\b/,
  /\binformatician\b/,
  /\badministrator\s+(?:de\s+)?(?:sistem|sisteme|retea|retele)\b/,
  /\binginer\s+(?:de\s+)?sistem\b/,
  /\bexpert\s+(?:i\.?\s*t\.?|informatic)\b/,
  /\bconsilier\b.*\b(?:informatica|informatic|it)\b/,
  /\btehnologia\s+informatiei\b/,
];

export function isItRelevant(title: string): boolean {
  const normalized = normalizeText(title);
  return IT_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function explainRelevance(title: string): string | null {
  const normalized = normalizeText(title);
  const match = IT_PATTERNS.find((pattern) => pattern.test(normalized));
  return match?.source ?? null;
}
