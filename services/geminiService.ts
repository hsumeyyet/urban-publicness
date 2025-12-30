
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY;

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
    
    Conclude with an assessment of its publicness:
    - "Hybrid": Seamless blend of digital and physical norms.
    - "Agonistic": A site of productive conflict and visible diversity.
    - "Homogenized": Uniformly commercialized or flattened narrative.

    Ensure you use Google Search grounding to find real, specific details about current reviews, listings, and descriptions for ${placeName}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
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
                keyKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                publicNature: { type: Type.STRING, enum: ['Open', 'Controlled', 'Contested'] }
              },
              required: ['platform', 'narrativeSummary', 'tone', 'keyKeywords', 'publicNature']
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
            required: ['foregrounded', 'marginalized']
          },
          conclusion: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              assessment: { type: Type.STRING }
            },
            required: ['type', 'assessment']
          }
        },
        required: ['placeName', 'platforms', 'overlaps', 'tensions', 'publics', 'conclusion']
      }
    }
  });

  const result = JSON.parse(response.text);
  
  // Extract sources from grounding metadata
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || 'Source',
    uri: chunk.web?.uri || '#'
  })) || [];

  return { ...result, sources };
};
