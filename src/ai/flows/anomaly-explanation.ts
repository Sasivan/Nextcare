'use server';

/**
 * @fileOverview Anomaly explanation AI agent.
 *
 * - explainAnomaly - A function that handles the anomaly explanation process.
 * - ExplainAnomalyInput - The input type for the explainAnomaly function.
 * - ExplainAnomalyOutput - The return type for the explainAnomaly function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ExplainAnomalyInputSchema = z.object({
  vitalSign: z.string().describe('The name of the vital sign that is anomalous.'),
  value: z.number().describe('The value of the vital sign.'),
  thresholdLow: z.number().optional().describe('The lower bound of the normal range for the vital sign, if applicable.'),
  thresholdHigh: z.number().optional().describe('The upper bound of the normal range for the vital sign, if applicable.'),
});
export type ExplainAnomalyInput = z.infer<typeof ExplainAnomalyInputSchema>;

const ExplainAnomalyOutputSchema = z.object({
  explanation: z.string().describe('A user-friendly explanation of why the vital sign is considered anomalous.'),
});
export type ExplainAnomalyOutput = z.infer<typeof ExplainAnomalyOutputSchema>;

export async function explainAnomaly(input: ExplainAnomalyInput): Promise<ExplainAnomalyOutput> {
  return explainAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAnomalyPrompt',
  input: {schema: ExplainAnomalyInputSchema},
  output: {schema: ExplainAnomalyOutputSchema},
  prompt: `You are a medical assistant that explains anomalies in vital signs in a user-friendly way.

  Given the vital sign, its value, and its normal range, provide a brief explanation of why the vital sign is considered anomalous.

  Vital Sign: {{{vitalSign}}}
  Value: {{{value}}}
  Normal Range: {{#if thresholdLow}}{{{thresholdLow}}} - {{{thresholdHigh}}}{{else}}N/A{{/if}}

  Explanation: `,
});

const explainAnomalyFlow = ai.defineFlow(
  {
    name: 'explainAnomalyFlow',
    inputSchema: ExplainAnomalyInputSchema,
    outputSchema: ExplainAnomalyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
