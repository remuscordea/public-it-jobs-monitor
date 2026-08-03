export interface Announcement {
  id: string;
  sourceId: string;
  sourceName: string;
  title: string;
  url: string;
  detectedAt: string;
}

export interface StoredState {
  initialized: boolean;
  announcements: Announcement[];
}

export interface SourceDefinition {
  id: string;
  name: string;
  url: string;
}
