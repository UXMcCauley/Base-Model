// src/ai/flows/main-agent.ts
'use server';

/**
 * @fileOverview Main agent to understand user queries and delegate to specialized agents or provide general responses.
 *
 * - mainAgent - A function that processes general user queries.
 * - MainAgentInput - The input type for the mainAgent function.
 * - MainAgentOutput - The return type for the mainAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MainAgentInputSchema = z.object({
  query: z.string().describe('The user\'s natural language query.'),
});
export type MainAgentInput = z.infer<typeof MainAgentInputSchema>;

export const MainAgentOutputSchema = z.object({
  actionType: z.enum(['hr', 'workforce', 'summarize_email', 'generate_spreadsheet', 'generate_document_outline', 'general_response'])
    .describe('The type of action identified by the agent.'),
  processedQuery: z.string().describe('The query, rephrased or extracted data for the specific tool, or the direct answer for general queries. For summarize_email, this should be the email content if provided, or a request for it. For generate_document_outline, this should be the topic or description.'),
  originalQuery: z.string().describe('The original user query for context.'),
  filename: z.string().optional().describe('Suggested filename, e.g., for spreadsheets.'),
});
export type MainAgentOutput = z.infer<typeof MainAgentOutputSchema>;


export async function mainAgent(input: MainAgentInput): Promise<MainAgentOutput> {
  return mainAgentFlow(input);
}

const mainAgentPrompt = ai.definePrompt({
  name: 'mainAgentPrompt',
  input: {schema: MainAgentInputSchema},
  output: {schema: MainAgentOutputSchema},
  prompt: `You are an AI assistant named AgentFlow. Your goal is to understand a user's query and determine the best course of action.
You have access to specialized tools:
1.  An HR Agent: For questions about HR policies, employee benefits, leave requests, etc.
2.  A Workforce Agent: For queries about work schedules, personnel overviews, team assignments, and substitutions.
3.  An Email Summarizer: To summarize email content. If the user asks to summarize an email but doesn't provide it, ask them to paste the email content.
4.  A Spreadsheet Generator: To create spreadsheets from descriptions (e.g., "create a spreadsheet of sales data"). Output should be suitable for CSV.
5.  A Document Outliner: To generate outlines or content for documents (e.g., "help me start a Google Doc about project planning").

Based on the user's query: "{{query}}", determine the appropriate 'actionType'.
- If it's an HR question, set actionType to 'hr'. 'processedQuery' should be the user's HR question.
- If it's a workforce management question, set actionType to 'workforce'. 'processedQuery' should be the user's workforce question.
- If the user asks to summarize an email:
    - If the email content is clearly part of the query, set actionType to 'summarize_email' and 'processedQuery' to the email content.
    - If the email content is NOT provided, set actionType to 'general_response' and 'processedQuery' to a message asking the user to paste the email content.
- If the user asks to create a spreadsheet (e.g., "make a table of...", "spreadsheet for..."), set actionType to 'generate_spreadsheet'. 'processedQuery' should be the description of the spreadsheet. Suggest a filename like "spreadsheet.csv".
- If the user asks to create a document, outline, or "start a Google Doc about X", set actionType to 'generate_document_outline'. 'processedQuery' should be the topic or description of the document.
- For any other query, or if unsure, set actionType to 'general_response' and provide a helpful answer in 'processedQuery'.

'originalQuery' should always be the exact user query: "{{query}}".
Ensure 'processedQuery' is tailored for the chosen actionType. For example, if asking for a spreadsheet, 'processedQuery' is the description.
If generating a spreadsheet, suggest a filename like "topic_spreadsheet.csv".
If generating a document outline, suggest a filename like "topic_outline.txt".
`,
});

const mainAgentFlow = ai.defineFlow(
  {
    name: 'mainAgentFlow',
    inputSchema: MainAgentInputSchema,
    outputSchema: MainAgentOutputSchema,
  },
  async (input: MainAgentInput) => {
    const {output} = await mainAgentPrompt(input);
    if (!output) {
      // Fallback or error handling if prompt fails
      return {
        actionType: 'general_response',
        processedQuery: "I'm sorry, I couldn't process your request. Please try again.",
        originalQuery: input.query,
      };
    }
    // Ensure filename is set if actionType is spreadsheet or document outline
    if (output.actionType === 'generate_spreadsheet' && !output.filename) {
      output.filename = 'spreadsheet.csv';
    }
    if (output.actionType === 'generate_document_outline' && !output.filename) {
      output.filename = 'document_outline.txt';
    }
    return output;
  }
);
