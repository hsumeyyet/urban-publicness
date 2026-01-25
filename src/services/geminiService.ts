import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCAOm2B1p_U7edlo9S_JyqndUaER2JThrI';

export const analyzePlaceNarratives = async (placeName: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    Analyze how the place "${placeName}" is represented across four digital platforms:
    1. Google Maps reviews (utility, friction, complaints, accessibility).
    2. Airbnb neighborhood descriptions (curated lifestyle, safety, "local" charm).
    3. Event listings (e.g., Eventbrite, RA - temporal community, niche interests).
    4. Social media captions (Instagram/TikTok - aestheticized, performative).

    Identify:
    - Overlaps in narratives.
    - Contradictions or tensions.
    - Which publics are foregrounded or marginalized.
    - Whether the place appears more open, controlled, or contested on each platform.

    Temporal dimension (5 years, yearly buckets):
    - For each platform, provide a history array with entries per year for the last 5 years (YYYY) including publicNature, tone, narrativeSummary, keyKeywords.
    - Provide a top-level publicnessTimeline summarizing the dominant publicness per year (Open/Controlled/Contested) with a 1-2 sentence summary of the shift.

    Conclude with an assessment of its publicness:
    - "Hybrid": Seamless blend of digital and physical norms.
    - "Agonistic": A site of productive conflict and visible diversity.
    - "Homogenized": Uniformly commercialized or flattened narrative.

    Ensure you use Google Search grounding to find real, specific details about current and historical reviews, listings, and descriptions for ${placeName}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          placeName: { type: Type.STRING },
          platforms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                platform: { type: Type.STRING },
                narrativeSummary: { type: Type.STRING },
                tone: { type: Type.STRING },
                publicNature: { type: Type.STRING },
                keyKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                history: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      year: { type: Type.STRING },
                      publicNature: { type: Type.STRING },
                      tone: { type: Type.STRING },
                      narrativeSummary: { type: Type.STRING },
                      keyKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["year", "publicNature", "tone", "narrativeSummary", "keyKeywords"]
                  }
                }
              },
              required: ["platform", "narrativeSummary", "tone", "publicNature", "keyKeywords"]
            }
          },
          publicnessTimeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                dominantNature: { type: Type.STRING },
                summary: { type: Type.STRING }
              },
              required: ["year", "dominantNature", "summary"]
            }
          },
          overlaps: { type: Type.ARRAY, items: { type: Type.STRING } },
          tensions: { type: Type.ARRAY, items: { type: Type.STRING } },
          publics: {
            type: Type.OBJECT,
            properties: {
              foregrounded: { type: Type.ARRAY, items: { type: Type.STRING } },
              marginalized: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["foregrounded", "marginalized"]
          },
          conclusion: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              assessment: { type: Type.STRING }
            },
            required: ["type", "assessment"]
          },
          sources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                uri: { type: Type.STRING },
                title: { type: Type.STRING }
              },
              required: ["uri", "title"]
            }
          }
        },
        required: ["placeName", "platforms", "overlaps", "tensions", "publics", "conclusion", "sources"]
      }
    }
  });

  return response.data as AnalysisResult;
};
