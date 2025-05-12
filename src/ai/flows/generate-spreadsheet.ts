// src/ai/flows/generate-spreadsheet.ts
'use server';

/**
 * @fileOverview A flow to generate a spreadsheet based on a natural language description.
 *
 * - generateSpreadsheet - A function that handles the spreadsheet generation process.
 * - GenerateSpreadsheetInput - The input type for the generateSpreadsheet function.
 * - GenerateSpreadsheetOutput - The return type for the generateSpreadsheet function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSpreadsheetInputSchema = z.object({
  description: z.string().describe('A description of the desired spreadsheet content and format.'),
});
export type GenerateSpreadsheetInput = z.infer<typeof GenerateSpreadsheetInputSchema>;

const GenerateSpreadsheetOutputSchema = z.object({
  spreadsheetData: z.string().describe('The spreadsheet data in CSV format.'),
});
export type GenerateSpreadsheetOutput = z.infer<typeof GenerateSpreadsheetOutputSchema>;

export async function generateSpreadsheet(input: GenerateSpreadsheetInput): Promise<GenerateSpreadsheetOutput> {
  return generateSpreadsheetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSpreadsheetPrompt',
  input: {schema: GenerateSpreadsheetInputSchema},
  output: {schema: GenerateSpreadsheetOutputSchema},
  prompt: `You are an expert at generating spreadsheets in CSV format.

  Based on the user's description, create a spreadsheet in CSV format that fulfills their requirements.
  The CSV should be properly formatted, with headers in the first row, and each subsequent row representing a data row.
  Ensure that the data is consistent and accurate based on the description.

  Description: {{{description}}}
  `,
});

const generateSpreadsheetFlow = ai.defineFlow(
  {
    name: 'generateSpreadsheetFlow',
    inputSchema: GenerateSpreadsheetInputSchema,
    outputSchema: GenerateSpreadsheetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
