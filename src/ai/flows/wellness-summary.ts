
'use server';

/**
 * @fileOverview A wellness summary AI agent.
 *
 * - generateWellnessSummary - A function that handles the wellness summary generation process.
 * - WellnessSummaryInput - The input type for the generateWellnessSummary function.
 * - WellnessSummaryOutput - The return type for the generateWellnessSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const WellnessSummaryInputSchema = z.object({
  vitalSigns: z.any().describe('The vital signs data as a JSON object.'),
});

export type WellnessSummaryInput = z.infer<typeof WellnessSummaryInputSchema>;

const WellnessSummaryOutputSchema = z.object({
  summary: z.string().describe('A user-friendly summary of the patient\'s wellness based on the vital signs.'),
});
export type WellnessSummaryOutput = z.infer<typeof WellnessSummaryOutputSchema>;

export async function generateWellnessSummary(input: WellnessSummaryInput): Promise<WellnessSummaryOutput> {
  return wellnessSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wellnessSummaryPrompt',
  input: { schema: WellnessSummaryInputSchema },
  output: { schema: WellnessSummaryOutputSchema },
  prompt: `You are a medical assistant that provides a daily wellness summary for a patient based on their vital signs.

  Analyze the following vital signs data and provide a brief, easy-to-understand summary of the patient's condition. Highlight any anomalies and suggest whether any action should be taken.

  Vital Signs Data:
  \`\`\`json
  {{{json aniescape="true" vitalSigns}}}
  \`\`\`

  Summary:`,
});

const wellnessSummaryFlow = ai.defineFlow(
  {
    name: 'wellnessSummaryFlow',
    inputSchema: WellnessSummaryInputSchema,
    outputSchema: WellnessSummaryOutputSchema,
  },
  async (input) => {
    if (!input.vitalSigns) {
      return { summary: 'Not enough data to generate a summary. Please wait for vital signs to be updated.' };
    }
    const { output } = await prompt(input);
    return output!;
  }
);
