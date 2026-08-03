import assert from "node:assert/strict";
import test from "node:test";
import { emailConfirmation, formatDiscovery, formatElapsed } from "../cli.js";

const ANSI_PATTERN = /\u001b\[[0-9;]*m/g;

test("manual mode colors only the relevant announcement discovery", () => {
  const output = formatDiscovery(1, "manual");
  assert.match(output, ANSI_PATTERN);
  assert.equal(output.replaceAll(ANSI_PATTERN, ""), "NEW IT ANNOUNCEMENT FOUND!");
});

test("scheduled discovery output never contains ANSI colors", () => {
  const output = formatDiscovery(2, "scheduled");
  assert.doesNotMatch(output, ANSI_PATTERN);
  assert.equal(output, "=== ANUNTURI IT NOI ===");
});

test("manual discovery uses correct singular and plural wording", () => {
  const singular = formatDiscovery(1, "manual").replaceAll(ANSI_PATTERN, "");
  const plural = formatDiscovery(2, "manual").replaceAll(ANSI_PATTERN, "");
  assert.equal(singular, "NEW IT ANNOUNCEMENT FOUND!");
  assert.equal(plural, "2 NEW IT ANNOUNCEMENTS FOUND!");
});

test("elapsed time uses milliseconds below one second and seconds otherwise", () => {
  assert.equal(formatElapsed(842), "842 ms");
  assert.equal(formatElapsed(1_251), "1.3 s");
});

test("email confirmation is not shown for ConsoleNotifier", () => {
  assert.equal(emailConfirmation("manual", false), null);
  assert.equal(emailConfirmation("scheduled", true), null);
  assert.equal(emailConfirmation("manual", true), "Email notification sent.");
});
