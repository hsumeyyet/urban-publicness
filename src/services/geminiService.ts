import { AnalysisResult } from '../types';
import { API_ENDPOINTS } from '../config';

export const analyzePlaceNarratives = async (placeName: string): Promise<AnalysisResult> => {
  const response = await fetch(API_ENDPOINTS.genai, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important for cookies in cross-origin requests
    body: JSON.stringify({ placeName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze narratives');
  }

  return response.json();
};
