
// The directive tells the Next.js runtime to execute this code on the server.
'use server';

/**
 * @fileOverview Provides an AI-powered prompt refinement service for clothing design, suggesting modifications based on common style attributes.
 *
 * - refineClothingPrompt - A function that refines a clothing design prompt using AI suggestions.
 * - RefineClothingPromptInput - The input type for the refineClothingPrompt function.
 * - RefineClothingPromptOutput - The output type for the refineClothingPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the prompt refinement.
const RefineClothingPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe('The original clothing design prompt provided by the user.'),
});
export type RefineClothingPromptInput = z.infer<typeof RefineClothingPromptInputSchema>;

// Define the output schema for the refined prompt.
const RefineClothingPromptOutputSchema = z.object({
  refinedPrompt: z
    .string()
    .describe('The refined clothing design prompt with AI-suggested modifications.'),
});
export type RefineClothingPromptOutput = z.infer<typeof RefineClothingPromptOutputSchema>;

// Exported function to refine the clothing prompt.
export async function refineClothingPrompt(
  input: RefineClothingPromptInput
): Promise<RefineClothingPromptOutput> {
  return refineClothingPromptFlow(input);
}

// Define the AI prompt for refining the clothing design prompt.
const refineClothingPromptPrompt = ai.definePrompt({
  name: 'refineClothingPromptPrompt',
  model: 'googleai/gemini-1.5-flash-latest', // Specify the model here
  input: {schema: RefineClothingPromptInputSchema},
  output: {schema: RefineClothingPromptOutputSchema},
  prompt: `You are an AI-powered fashion design assistant. Your task is to refine user-provided prompts for clothing design generation.

  Consider common style attributes such as material, pattern, and fit. Suggest modifications to the original prompt to improve the design results. Do not mention color or type of clothing unless explicitly asked in the original prompt.

  Original Prompt: {{{prompt}}}

  Refined Prompt:`, // The AI will generate the refined prompt here.
});

// Define the Genkit flow for refining the clothing prompt.
const refineClothingPromptFlow = ai.defineFlow(
  {
    name: 'refineClothingPromptFlow',
    inputSchema: RefineClothingPromptInputSchema,
    outputSchema: RefineClothingPromptOutputSchema,
  },
  async input => {
    const {output} = await refineClothingPromptPrompt(input);
    return output!;
  }
);

