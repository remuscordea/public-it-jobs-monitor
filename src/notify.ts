import nodemailer from "nodemailer";
import type { Announcement } from "./types.js";

export interface Notifier {
  notify(announcements: Announcement[]): Promise<void>;
}

export class ConsoleNotifier implements Notifier {
  async notify(announcements: Announcement[]): Promise<void> {
    for (const announcement of announcements) {
      console.log(`- ${announcement.title}\n  ${announcement.url}`);
    }
  }
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  recipient: string;
}

export class EmailNotifier implements Notifier {
  constructor(private readonly config: EmailConfig) {}

  async notify(announcements: Announcement[]): Promise<void> {
    if (announcements.length === 0) return;

    const transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.user,
        pass: this.config.password,
      },
    });

    await transporter.sendMail({
      from: this.config.user,
      to: this.config.recipient,
      subject: `${announcements.length} anunturi IT noi`,
      text: announcements.map(formatTextAnnouncement).join("\n\n"),
      html: `<h1>Anunturi IT noi</h1>${announcements.map(formatHtmlAnnouncement).join("")}`,
    });
  }
}

export function createNotifier(env: NodeJS.ProcessEnv = process.env): Notifier {
  const type = env.NOTIFIER?.trim().toLowerCase() || "console";

  if (type === "console") return new ConsoleNotifier();
  if (type !== "email") {
    throw new Error(`NOTIFIER trebuie sa fie "console" sau "email", nu "${type}".`);
  }

  return new EmailNotifier(readEmailConfig(env));
}

function readEmailConfig(env: NodeJS.ProcessEnv): EmailConfig {
  const required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "NOTIFICATION_EMAIL",
  ] as const;
  const missing = required.filter((name) => !env[name]?.trim());

  if (missing.length > 0) {
    throw new Error(`Configuratie email incompleta. Lipsesc: ${missing.join(", ")}.`);
  }

  const port = Number(env.SMTP_PORT);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("Configuratie email invalida: SMTP_PORT trebuie sa fie un numar pozitiv.");
  }

  if (env.SMTP_SECURE !== "true" && env.SMTP_SECURE !== "false") {
    throw new Error('Configuratie email invalida: SMTP_SECURE trebuie sa fie "true" sau "false".');
  }

  return {
    host: env.SMTP_HOST!,
    port,
    secure: env.SMTP_SECURE === "true",
    user: env.SMTP_USER!,
    password: env.SMTP_PASSWORD!,
    recipient: env.NOTIFICATION_EMAIL!,
  };
}

function formatTextAnnouncement(announcement: Announcement): string {
  return `${announcement.sourceName}\n${announcement.title}\n${announcement.url}`;
}

function formatHtmlAnnouncement(announcement: Announcement): string {
  return `<p><strong>${escapeHtml(announcement.sourceName)}</strong><br>${escapeHtml(announcement.title)}<br><a href="${escapeHtml(announcement.url)}">${escapeHtml(announcement.url)}</a></p>`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character]!;
  });
}
