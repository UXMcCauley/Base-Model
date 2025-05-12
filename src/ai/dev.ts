import { config } from 'dotenv';
config();

import '@/ai/flows/generate-spreadsheet.ts';
import '@/ai/flows/hr-agent.ts';
import '@/ai/flows/main-agent.ts';
import '@/ai/flows/summarize-email.ts';
import '@/ai/flows/workforce-agent.ts';