import type { Announcement } from "./types.js";

export interface Notifier {
  notify(announcement: Announcement): Promise<void>;
}

export class ConsoleNotifier implements Notifier {
  async notify(announcement: Announcement): Promise<void> {
    console.log(`- ${announcement.title}\n  ${announcement.url}`);
  }
}
