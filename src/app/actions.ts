// src/app/actions.ts
'use server';

import { mainAgent, MainAgentInput, MainAgentOutput } from '@/ai/flows/main-agent';
import { hrAgent, HrAgentInput, HrAgentOutput } from '@/ai/flows/hr-agent';
import { workforceAgent, WorkforceAgentInput, WorkforceAgentOutput } from '@/ai/flows/workforce-agent';
import { summarizeEmail, SummarizeEmailInput, SummarizeEmailOutput } from '@/ai/flows/summarize-email';
import { generateSpreadsheet, GenerateSpreadsheetInput, GenerateSpreadsheetOutput } from '@/ai/flows/generate-spreadsheet';
import { z } from 'zod';
import cache from '../lib/server-cache'; // Import the cache

export interface AgentResponse {
  id: string;
  userQuery: string;
  type: 'text' | 'csv' | 'documentOutline' | 'error' | 'loading';
  content: string;
  filename?: string;
  error?: string;
}

const querySchema = z.object({
  query: z.string().min(1, "Query cannot be empty."),
});

export async function processUserQuery(prevState: AgentResponse | null, formData: FormData): Promise<AgentResponse> {
  const rawQuery = formData.get('query');
  const validatedQuery = querySchema.safeParse({ query: rawQuery });

  const uniqueId = Date.now().toString();

  if (!validatedQuery.success) {
    return {
      id: uniqueId,
      userQuery: typeof rawQuery === 'string' ? rawQuery : '',
      type: 'error',
      content: validatedQuery.error.errors.map(e => e.message).join(', '),
      error: validatedQuery.error.errors.map(e => e.message).join(', '),
    };
  }

  const userQuery = validatedQuery.data.query;

  // --- Logging ---
  console.log("Received user query:", userQuery);
  // -------------

  // Retrieve the user's session ID (Replace with your actual session ID retrieval logic)
  // This is a placeholder and needs to be replaced with your actual session management logic
  // to get a unique session ID for the current user.
  const sessionId = 'your_session_id'; // Placeholder
  const cachedData = cache[sessionId]; // Retrieve data and tone from cache

  // Destructure retrieved data to get apiData and selectedTone
  const apiData = cachedData ? cachedData.apiData : undefined;
  const selectedTone = cachedData ? cachedData.selectedTone : undefined;

  // Define keywords that trigger dataset name recognition
  const datasetKeywords = ["information", "data", "knowledge", "details", "report"];

  let datasetName: string | undefined;
  let processedQueryWithoutDatasetName = userQuery;

  // Attempt to extract dataset name from the query
  for (const keyword of datasetKeywords) {
    const keywordIndex = userQuery.toLowerCase().indexOf(keyword);
    if (keywordIndex !== -1) {
      // Assume the dataset name follows the keyword
      const potentialDatasetName = userQuery.substring(keywordIndex + keyword.length).trim();
      if (potentialDatasetName) {
        // For simplicity, take the rest of the string as the dataset name.
        // More sophisticated parsing might be needed for complex queries.
        datasetName = potentialDatasetName;
        processedQueryWithoutDatasetName = userQuery.substring(0, keywordIndex).trim();
        break; // Stop after finding the first keyword and potential dataset name
      }
    }
  }

  // --- Logging ---
  console.log("Attempting to retrieve data for session ID:", sessionId, "and dataset name:", datasetName);
  // -------------


  try {
    // Step 1: Call the main agent to determine action type
    const mainAgentInput: MainAgentInput = { query: userQuery };
    const mainAgentDecision = await mainAgent(mainAgentInput); // Consider passing selectedTone to mainAgent if it influences routing

    // Step 2: Based on decision, call the appropriate specialized agent or return general response
    switch (mainAgentDecision.actionType) {
      case 'hr':
        const hrInput: HrAgentInput = { query: mainAgentDecision.processedQuery };
        const hrOutput = await hrAgent(hrInput);
        return {
          id: uniqueId,
          userQuery,
          type: 'text',
          content: hrOutput.answer,
        };
      case 'workforce':
        // Retrieve the specific dataset by name if a name was extracted
        let specificApiData = undefined;
        if (datasetName) {
            specificApiData = cache[sessionId]?.[datasetName]?.apiData;
        } else if (apiData) {
            // If no dataset name was specified, use the default data if available
            specificApiData = apiData;
        }


        if (!specificApiData) {
            // If no dataset is found for the extracted name or if no name was extracted and no default data exists
            // --- Logging ---
            console.log("Data not found for session ID:", sessionId, "and dataset name:", datasetName);
            // -------------
            return {
                content: `I couldn't find the data you're referring to. Please specify which dataset you'd like to use (e.g., "Analyze the information from the Q1 Report").`,
            };
        }

        // Use the extracted dataset name in the query passed to the workforce agent if needed for context
        const wfInput: WorkforceAgentInput = { query: processedQueryWithoutDatasetName || userQuery }; // Pass the query without the dataset name part if extracted
        const wfOutput = await workforceAgent({ ...wfInput, apiData, selectedTone }); // Pass apiData and selectedTone to the workforce agent
        // --- Logging ---
        // Log that data was found and agent is processing
        console.log("Data found for session ID:", sessionId, "and dataset name:", datasetName || 'default');
        // -------------
        return {
          id: uniqueId,
          userQuery,
          type: 'text',
          content: wfOutput.response,
        };
      case 'summarize_email':
        // This case assumes mainAgentPrompt would have made processedQuery the email content
        // or mainAgentDecision.actionType would be 'general_response' to ask for content.
        // If mainAgent returns 'summarize_email', it means it found the email content.
        const emailInput: SummarizeEmailInput = { emailContent: mainAgentDecision.processedQuery };
        const summaryOutput = await summarizeEmail(emailInput);
        return {
          id: uniqueId,
          userQuery,
          type: 'text',
          content: `Summary: ${summaryOutput.summary}`,
        };
      case 'generate_spreadsheet':
        const ssInput: GenerateSpreadsheetInput = { description: mainAgentDecision.processedQuery };
        const ssOutput = await generateSpreadsheet(ssInput);
        return {
          id: uniqueId,
          userQuery,
          type: 'csv',
          content: ssOutput.spreadsheetData,
          filename: mainAgentDecision.filename || 'spreadsheet.csv',
        };
      case 'generate_document_outline':
         // For document outline, we'll treat it as text content for now.
         // The prompt for mainAgent should ensure processedQuery is the outline.
        return {
          id: uniqueId,
          userQuery,
          type: 'documentOutline',
          content: mainAgentDecision.processedQuery, // This should be the outline generated by the mainAgent's prompt logic
          filename: mainAgentDecision.filename || 'document_outline.txt',
        };
      case 'general_response':
      default:
        return {
          id: uniqueId,
          userQuery,
          type: 'text',
          content: mainAgentDecision.processedQuery,
        };
    }
  } catch (error) {
    console.error("Error processing query:", error);
    return {
      id: uniqueId,
      userQuery,
      type: 'error',
      content: error instanceof Error ? error.message : 'An unexpected error occurred.',
      error: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}
