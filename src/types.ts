export interface Announcement {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  detectedAt: string;
}

export interface JobSource {
  id: string;
  name: string;
  url: string;
  fetchAnnouncements(): Promise<Announcement[]>;
}

export interface StoredState {
  initialized: boolean;
  announcements: Announcement[];
}
