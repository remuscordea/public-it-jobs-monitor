import assert from "node:assert/strict";
import test from "node:test";
import { ConsoleNotifier, EmailNotifier, createNotifier } from "../notify.js";
import type { Announcement } from "../types.js";

const announcements: Announcement[] = [
  {
    id: "1",
    sourceId: "source",
    sourceName: "Institutia A",
    title: "Specialist IT",
    url: "https://example.com/1",
    detectedAt: "2026-08-03T09:00:00.000Z",
  },
  {
    id: "2",
    sourceId: "source",
    sourceName: "Institutia A",
    title: "Administrator de sistem",
    url: "https://example.com/2",
    detectedAt: "2026-08-03T09:00:00.000Z",
  },
];

test("selecteaza implicit notifierul console", () => {
  assert.ok(createNotifier({}) instanceof ConsoleNotifier);
  assert.ok(createNotifier({ NOTIFIER: "console" }) instanceof ConsoleNotifier);
});

test("selecteaza notifierul email cand configuratia este completa", () => {
  const notifier = createNotifier({
    NOTIFIER: "email",
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: "465",
    SMTP_SECURE: "true",
    SMTP_USER: "sender@example.com",
    SMTP_PASSWORD: "secret",
    NOTIFICATION_EMAIL: "recipient@example.com",
  });
  assert.ok(notifier instanceof EmailNotifier);
});

test("raporteaza configuratia email lipsa fara a include secrete", () => {
  assert.throws(
    () => createNotifier({ NOTIFIER: "email", SMTP_PASSWORD: "do-not-log" }),
    (error: Error) => {
      assert.match(error.message, /Configuratie email incompleta/);
      assert.doesNotMatch(error.message, /do-not-log/);
      return true;
    },
  );
});

test("console notifier afiseaza toate anunturile din batch", async () => {
  const messages: string[] = [];
  const originalLog = console.log;
  console.log = (message?: unknown) => messages.push(String(message));

  try {
    await new ConsoleNotifier().notify(announcements);
  } finally {
    console.log = originalLog;
  }

  assert.equal(messages.length, 2);
  assert.match(messages[0]!, /Specialist IT/);
  assert.match(messages[1]!, /Administrator de sistem/);
});
