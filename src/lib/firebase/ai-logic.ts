/**
 * Firebase AI Logic Integration
 *
 * Uses Firebase's built-in AI Logic SDK (not raw Gemini API calls)
 * per firebase-ai-logic-basics skill requirements.
 *
 * SETUP REQUIRED:
 *   npx -y firebase-tools@latest init ailogic
 *
 * This provisions the Gemini Developer API in the Firebase console.
 * Without this step, all AI calls will return PERMISSION_DENIED.
 *
 * CRITICAL: App Check must be configured before production deployment.
 * See: https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider
 */

import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import app from './config';

// Initialize Firebase AI Logic with Gemini Developer API (free tier for prototyping)
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Use gemini-flash-latest as default per skill guidance
// TODO: Move to Firebase Remote Config for dynamic model swapping without redeploy
// See: https://firebase.google.com/docs/ai-logic/change-model-name-remotely
const DEFAULT_MODEL = 'gemini-flash-latest';

/**
 * Get a Gemini model instance for general text generation
 */
export function getTextModel(modelName?: string) {
  return getGenerativeModel(ai, {
    model: modelName || DEFAULT_MODEL,
  });
}

/**
 * Get a Gemini model configured for multimodal input (images + text)
 * Used for artwork analysis, image recognition, metadata extraction
 */
export function getVisionModel(modelName?: string) {
  return getGenerativeModel(ai, {
    model: modelName || DEFAULT_MODEL,
  });
}

/**
 * Get a model configured for structured JSON output
 * Used for extracting structured data from artwork descriptions
 */
export function getStructuredModel(modelName?: string) {
  return getGenerativeModel(ai, {
    model: modelName || DEFAULT_MODEL,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
}

// ============================================
// Jules AI Assistant - Client-Side Helpers
// ============================================

/**
 * Jules: Generate a product description from an image
 * Used when admin uploads a new product image
 */
export async function julesDescribeArtwork(imageBase64: string, mimeType: string) {
  const model = getVisionModel();

  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
    {
      text: `You are Jules, an expert AI assistant specializing in Black and African heritage art.
Analyze this artwork image and provide:
1. A compelling product description (2-3 sentences) suitable for an e-commerce listing
2. Suggested tags (occasion, theme, type categories)
3. Any identifiable artist style or cultural significance

Respond in JSON format:
{
  "description": "...",
  "suggestedTags": { "occasion": [], "theme": [], "type": [] },
  "culturalContext": "...",
  "estimatedMedium": "..."
}`,
    },
  ]);

  return result.response.text();
}

/**
 * Jules: Chat session for customer assistance
 * Maintains conversation history automatically
 */
export function julesStartChat() {
  const model = getTextModel();

  return model.startChat({
    history: [
      {
        role: 'user',
        parts: [
          {
            text: `You are Jules, the AI art advisor for Black Heritage Gallery. You have deep knowledge of Black and African art, artists, cultural significance, and heritage traditions. You help customers:
- Find the perfect artwork or gift
- Understand the cultural significance of pieces
- Learn about featured artists
- Navigate the shop by occasion, theme, or type
- Answer questions about appraisal services

Be warm, knowledgeable, and passionate about heritage art. Keep responses concise and helpful.`,
          },
        ],
      },
      {
        role: 'model',
        parts: [
          {
            text: `I'm Jules, your heritage art advisor at Black Heritage Gallery. I'd love to help you explore our collection of Black and African art, find meaningful gifts, or learn about the incredible artists we feature. What can I help you with today?`,
          },
        ],
      },
    ],
  });
}

/**
 * Jules: Streaming response for real-time chat display
 * Shows partial results as they arrive (typing effect)
 */
export async function* julesStreamResponse(
  chatSession: ReturnType<typeof julesStartChat>,
  userMessage: string
) {
  const result = await chatSession.sendMessageStream(userMessage);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) yield text;
  }
}

/**
 * Jules: Analyze artwork for appraisal intake
 * Extracts metadata to pre-fill appraisal request form
 */
export async function julesAnalyzeForAppraisal(imageBase64: string, mimeType: string) {
  const model = getStructuredModel();

  const result = await model.generateContent([
    {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    },
    {
      text: `Analyze this artwork image for an appraisal intake. Extract any visible information:

Respond ONLY in this JSON format:
{
  "possibleArtist": "name or 'Unknown'",
  "estimatedMedium": "oil, acrylic, watercolor, mixed media, sculpture, print, etc.",
  "estimatedPeriod": "approximate era or decade",
  "dimensions": "estimated if visible",
  "condition": "any visible condition notes",
  "style": "artistic style classification",
  "culturalSignificance": "any heritage or cultural context",
  "suggestedDescription": "a brief description for the appraisal form"
}`,
    },
  ]);

  return result.response.text();
}
