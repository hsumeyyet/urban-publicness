
export interface PlatformHistoryEntry {
  year: string;
  publicNature: 'Open' | 'Controlled' | 'Contested';
  tone: string;
  narrativeSummary: string;
  keyKeywords: string[];
}

export interface PlatformRepresentation {
  platform: 'Google Maps' | 'Airbnb' | 'Event Listings' | 'Social Media';
  narrativeSummary: string;
  tone: string;
  keyKeywords: string[];
  publicNature: 'Open' | 'Controlled' | 'Contested';
  history?: PlatformHistoryEntry[];
}

export interface PublicnessTimelinePoint {
  year: string;
  dominantNature: 'Open' | 'Controlled' | 'Contested';
  summary: string;
}

export interface AnalysisResult {
  placeName: string;
  platforms: PlatformRepresentation[];
  overlaps: string[];
  tensions: string[];
  publics: {
    foregrounded: string[];
    marginalized: string[];
  };
  conclusion: {
    type: 'Hybrid' | 'Agonistic' | 'Homogenized';
    assessment: string;
  };
  publicnessTimeline?: PublicnessTimelinePoint[];
  sources: Array<{ title: string; uri: string }>;
}
