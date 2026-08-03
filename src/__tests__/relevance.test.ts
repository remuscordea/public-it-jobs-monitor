import assert from "node:assert/strict";
import test from "node:test";
import { isItRelevant } from "../relevance.js";

test("detecteaza titluri IT", () => {
  assert.equal(isItRelevant("Rezultatele concursului pentru două posturi de specialist IT"), true);
  assert.equal(isItRelevant("Anunț pentru ocuparea postului de specialist informatic"), true);
  assert.equal(isItRelevant("Concurs pentru administrator de sistem"), true);
  assert.equal(isItRelevant("Post vacant de informatician"), true);
});

test("respinge titluri non-IT", () => {
  assert.equal(isItRelevant("Rezultatele probei scrise pentru postul de grefier"), false);
  assert.equal(isItRelevant("Anunț privind promovarea în funcție"), false);
  assert.equal(isItRelevant("Concurs pentru ocuparea unui post de șofer"), false);
});
