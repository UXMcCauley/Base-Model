'use server';

/**
 * @fileOverview Summarizes emails using AI.
 *
 * - summarizeEmail - A function that summarizes an email.
 * - SummarizeEmailInput - The input type for the summarizeEmail function.
 * - SummarizeEmailOutput - The return type for the summarizeEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmailInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email to be summarized.'),
});
export type SummarizeEmailInput = z.infer<typeof SummarizeEmailInputSchema>;

const SummarizeEmailOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the email.'),
});
export type SummarizeEmailOutput = z.infer<typeof SummarizeEmailOutputSchema>;

export async function summarizeEmail(input: SummarizeEmailInput): Promise<SummarizeEmailOutput> {
  return summarizeEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmailPrompt',
  input: {schema: SummarizeEmailInputSchema},
  output: {schema: SummarizeEmailOutputSchema},
  prompt: `Summarize the following email content:\n\n{{{emailContent}}}`,
});

const summarizeEmailFlow = ai.defineFlow(
  {
    name: 'summarizeEmailFlow',
    inputSchema: SummarizeEmailInputSchema,
    outputSchema: SummarizeEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
