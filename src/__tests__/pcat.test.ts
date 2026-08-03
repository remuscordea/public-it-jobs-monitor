import assert from "node:assert/strict";
import test from "node:test";
import { PcatSource, parsePcatAnnouncements } from "../sources/pcat.js";

const fixture = `
<!doctype html><html><body><main><div class="blog-items">
  <article><h2 class="item-title"><a href="/docs/specialist-it.pdf">Anunț privind postul de specialist IT</a></h2></article>
  <article><h2 class="item-title"><a href="/docs/grefier.pdf">Rezultatele concursului pentru postul de grefier</a></h2></article>
</div></main></body></html>`;

test("parseaza lista de anunturi PCAT", () => {
  const items = parsePcatAnnouncements(fixture, new PcatSource());
  assert.equal(items.length, 2);
  assert.equal(items[0]?.title, "Anunț privind postul de specialist IT");
  assert.equal(items[0]?.url, "https://pcatimisoara.mpublic.ro/docs/specialist-it.pdf");
});
