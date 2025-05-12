// src/ai/flows/workforce-agent.ts
'use server';

/**
 * @fileOverview Workforce agent to provide schedule data, personnel overviews, and substitutions.
 *
 * - workforceAgent - A function that processes workforce related queries.
 * - WorkforceAgentInput - The input type for the workforceAgent function.
 * - WorkforceAgentOutput - The return type for the workforceAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WorkforceAgentInputSchema = z.object({
  query: z.string().describe('The query about workforce schedules, personnel, or substitutions.'),
});
export type WorkforceAgentInput = z.infer<typeof WorkforceAgentInputSchema>;

const WorkforceAgentOutputSchema = z.object({
  response: z.string().describe('The response to the workforce related query.'),
});
export type WorkforceAgentOutput = z.infer<typeof WorkforceAgentOutputSchema>;

export async function workforceAgent(input: WorkforceAgentInput): Promise<WorkforceAgentOutput> {
  return workforceAgentFlow(input);
}

const workforceAgentPrompt = ai.definePrompt({
  name: 'workforceAgentPrompt',
  input: {schema: WorkforceAgentInputSchema},
  output: {schema: WorkforceAgentOutputSchema},
  prompt: `You are a helpful workforce management assistant. Respond to the following query about workforce schedules, personnel overviews, and potential substitutions.

Query: {{{query}}}

Response:`,
});

const workforceAgentFlow = ai.defineFlow(
  {
    name: 'workforceAgentFlow',
    inputSchema: WorkforceAgentInputSchema,
    outputSchema: WorkforceAgentOutputSchema,
  },
  async input => {
    const {output} = await workforceAgentPrompt(input);
    return output!;
  }
);
