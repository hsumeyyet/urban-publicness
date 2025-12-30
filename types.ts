
export interface PlatformRepresentation {
  platform: 'Google Maps' | 'Airbnb' | 'Event Listings' | 'Social Media';
  narrativeSummary: string;
  tone: string;
  keyKeywords: string[];
  publicNature: 'Open' | 'Controlled' | 'Contested';
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
  sources: Array<{ title: string; uri: string }>;
}
