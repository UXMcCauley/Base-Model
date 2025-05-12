// src/ai/flows/hr-agent.ts
'use server';

/**
 * @fileOverview An HR-related question answering AI agent.
 *
 * - hrAgent - A function that handles HR-related questions.
 * - HrAgentInput - The input type for the hrAgent function.
 * - HrAgentOutput - The return type for the hrAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HrAgentInputSchema = z.object({
  query: z.string().describe('The HR-related question to answer.'),
});
export type HrAgentInput = z.infer<typeof HrAgentInputSchema>;

const HrAgentOutputSchema = z.object({
  answer: z.string().describe('The answer to the HR-related question.'),
});
export type HrAgentOutput = z.infer<typeof HrAgentOutputSchema>;

export async function hrAgent(input: HrAgentInput): Promise<HrAgentOutput> {
  return hrAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hrAgentPrompt',
  input: {schema: HrAgentInputSchema},
  output: {schema: HrAgentOutputSchema},
  prompt: `You are an AI-powered HR agent. Use your knowledge of HR policies and procedures to answer the following question:

{{{query}}}`,
});

const hrAgentFlow = ai.defineFlow(
  {
    name: 'hrAgentFlow',
    inputSchema: HrAgentInputSchema,
    outputSchema: HrAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
