<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1FaBU5lhuLFq5FQCwjMlBOtpoXNf0MuyB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Secure server-side proxy (Vercel)

1. Deploy to Vercel and set two Environment Variables in the Vercel project settings:
   - `GEMINI_API_KEY` — your server-side Gemini API key
   - `PROXY_KEY` — a secret token used by the frontend when calling `/api/genai`

2. Calls from the frontend should POST to `/api/genai` with header `x-proxy-key: <PROXY_KEY>` and body `{ "placeName": "Place Name" }`.

3. This keeps your API key on the server and prevents exposing it in the browser.

If you want, I can add a small client helper to call the new endpoint and remove any client-side usage of `GEMINI_API_KEY`.

## Security note (important)

- If your API key was ever present in the repository or built assets, rotate it immediately in the Google Cloud Console: delete the exposed key and create a new one.
- Keep the new `GEMINI_API_KEY` only in your Vercel project environment variables (do not commit it).
