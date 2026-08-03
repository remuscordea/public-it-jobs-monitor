import * as cheerio from "cheerio";
import { announcementId } from "../hash.js";
import { cleanTitle, normalizeText } from "../text.js";
import type { Announcement, SourceDefinition } from "../types.js";

const IGNORED_TEXT = new Set([
  "acasa",
  "contact",
  "posturi vacante",
  "resurse umane",
  "mai mult",
  "detalii",
  "citeste mai mult",
  "read more",
]);

export function parsePcatAnnouncements(html: string, source: SourceDefinition): Announcement[] {
  const $ = cheerio.load(html);
  const candidates = new Map<string, Announcement>();

  // Joomla lists commonly expose article titles in these containers. The generic
  // fallbacks are intentional because public websites often change templates.
  const selectors = [
    ".blog-items a",
    ".blog a",
    ".items-leading a",
    ".item-title a",
    ".page-header a",
    "article a",
    "main a",
    "#content a",
    ".content a",
    "a[href]",
  ];

  for (const selector of selectors) {
    $(selector).each((_, element) => {
      const anchor = $(element);
      const title = cleanTitle(anchor.text());
      const href = anchor.attr("href")?.trim();

      if (!href || !isLikelyAnnouncement(title, href)) return;

      let url: string;
      try {
        url = new URL(href, source.url).toString();
      } catch {
        return;
      }

      // Keep links on the institution domain. Documents may still live in nested paths.
      if (new URL(url).hostname !== new URL(source.url).hostname) return;

      const id = announcementId(source.id, title, url);
      candidates.set(id, {
        id,
        sourceId: source.id,
        sourceName: source.name,
        title,
        url,
        detectedAt: new Date().toISOString(),
      });
    });

    // Prefer the first selector that yields a realistic list, avoiding navigation links.
    if (candidates.size >= 3 && selector !== "a[href]") break;
  }

  const announcements = [...candidates.values()];
  if (announcements.length === 0) {
    throw new Error(
      "Parserul nu a gasit anunturi. Ruleaza `npm run diagnose` si inspecteaza data/last-page.html.",
    );
  }

  return announcements;
}

function isLikelyAnnouncement(title: string, href: string): boolean {
  if (title.length < 8 || title.length > 500) return false;

  const normalized = normalizeText(title);
  if (IGNORED_TEXT.has(normalized)) return false;
  if (/^(facebook|youtube|linkedin|instagram|twitter|x)$/i.test(title)) return false;
  if (/^(javascript:|mailto:|tel:|#)/i.test(href)) return false;

  const looksLikeContent =
    /anunt|concurs|post|rezultat|select|proba|barem|contestat|promov|transfer|recrutar|ocupare|specialist|grefier|vacant/i.test(
      normalized,
    );
  const looksLikeDocument = /\.(pdf|docx?|xlsx?)(?:$|[?#])/i.test(href);
  const looksLikeArticleUrl = /index\.php|article|item|posturi-vacante/i.test(href);

  return looksLikeContent || looksLikeDocument || looksLikeArticleUrl;
}
