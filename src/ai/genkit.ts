
// src/ai/genkit.ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// It is crucial that process.env.GOOGLE_API_KEY is populated by Next.js
// when this server-side module is loaded.
// Next.js should automatically load .env (or .env.local) for server-side code
// from the project root. Do NOT use dotenv.config() here for Next.js processes.

const apiKey = process.env.GOOGLE_API_KEY;

// Log the key status for debugging during server startup or first import.
// This log will appear in the Next.js server console (when running `npm run dev`).
if (!apiKey) {
  console.error(
    'CLOTHORA_CRITICAL: GOOGLE_API_KEY is UNDEFINED in src/ai/genkit.ts when the module is loaded by Next.js. ' +
    '1. Ensure the `.env` file exists at the project root. ' +
    '2. Ensure GOOGLE_API_KEY is correctly set in `.env`. ' +
    '3. Ensure the Next.js server was fully RESTARTED after .env changes. ' +
    'The Genkit Google AI plugin will FAIL to initialize without the API key.'
  );
} else {
  // Avoid logging the actual key for security.
  console.log('CLOTHORA_LOG: GOOGLE_API_KEY is defined in src/ai/genkit.ts. Length: ' + apiKey.length + '. Proceeding with Genkit GoogleAI plugin setup.');
}

export const ai = genkit({
  plugins: [
    // Explicitly pass the apiKey.
    // If 'apiKey' here is undefined (because process.env.GOOGLE_API_KEY was undefined),
    // the googleAI plugin itself will then try to read process.env.GOOGLE_API_KEY or
    // process.env.GEMINI_API_KEY. If those are also undefined in its execution context,
    // it will throw the FAILED_PRECONDITION error.
    googleAI({ apiKey: apiKey }) // Pass the potentially undefined apiKey
  ],
  // Optionally, set a default model for the genkit() instance.
  // Specific models can be chosen per generate/prompt call.
  // model: 'googleai/gemini-1.5-flash-latest', // Example
});
