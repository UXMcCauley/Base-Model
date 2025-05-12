// src/ai/flows/workforce-agent.ts
'use server';

/**
 * @fileOverview Workforce agent to provide schedule data, personnel overviews, and substitutions.
 *
 * - workforceAgent - A function that processes workforce related queries.
 * - WorkforceAgentInput - The input type for the workforceAgent function.
 * - WorkforceAgentOutput - The return type for the workforceAgent function.
 */

import { ai } from '@/ai/genkit';
import {
  countActiveUsers,
  countUsersByRace,
  countUsersByEducationLevel,
  countUsersByTradeSpecialty,
  countUsersByOrgRole,
  countUsersByGender,
  calculateTotalHoursWorked,
  calculateAverageHoursWorked,
  calculateAverageEfficiency,
  calculateAverageSalary,
  calculateAverageWage,
  findUsersByHoursWorked,
  calculateAverageYearsExperience,
  findUsersByEfficiency} from '../tools/statistics-tool';
import {z} from 'genkit';
import { Json } from '@genkit-ai/core';

const WorkforceAgentInputSchema = z.object({
  query: z.string().describe('The query about workforce schedules, personnel, or substitutions.'),
  apiData: z.any().optional().describe('Optional API data related to workforce.'),
});
export type WorkforceAgentInput = z.infer<typeof WorkforceAgentInputSchema>;


const WorkforceAgentOutputSchema = z.object({
  response: z.string().describe('The response to the workforce related query.'),
});
export type WorkforceAgentOutput = z.infer<typeof WorkforceAgentOutputSchema>;

export async function workforceAgent(input: WorkforceAgentInput): Promise<WorkforceAgentOutput> {
  const query = input.query.toLowerCase();

  const listUsersKeywords = ['list all users', 'show me all employees', 'list users', 'list employees'];
  const countActiveUsersKeywords = ['how many active users', 'number of active users', 'count active employees', 'how many active employees'];
  const totalHoursKeywords = ['total hours worked', 'sum of hours'];
  const averageHoursKeywords = ['average hours worked', 'mean hours'];
  const averageEfficiencyKeywords = ['average efficiency', 'mean efficiency'];
  const usersByHoursKeywords = ['users who worked more than', 'users who worked less than'];
  const averageSalaryKeywords = ['average salary', 'mean salary'];
  const averageWageKeywords = ['average wage', 'mean wage'];
  const averageYearsExperienceKeywords = ['average years of experience', 'mean years of experience', 'average experience'];
  const usersByEfficiencyKeywords = ['users with efficiency above', 'users with efficiency below'];

  const countByRaceKeywords = ['how many users of each race', 'count users by race', 'racial breakdown'];
  const countByEducationKeywords = ['how many users by education level', 'count users by education', 'educational breakdown'];
  const countByTradeKeywords = ['how many users by trade specialty', 'count users by trade', 'trade breakdown'];
  const countByGenderKeywords = ['how many users by gender', 'count users by gender', 'gender breakdown'];

  const countByRoleKeywords = ['how many users in each role', 'count users by role', 'users per role', 'role breakdown'];

  if (input.apiData && countActiveUsersKeywords.some(keyword => query.includes(keyword))) {
    const activeCount = countActiveUsers(input.apiData);
    return { response: `There are ${activeCount} active users.` };
  }

  if (input.apiData && countByRoleKeywords.some(keyword => query.includes(keyword))) {
    const roleCounts = countUsersByOrgRole(input.apiData);
    let response = 'Here is the breakdown of users by organization role: ';
    for (const role in roleCounts) {
      if (roleCounts.hasOwnProperty(role)) {
        response += `${role}: ${roleCounts[role]}, `;
      }
    }
    return { response: response.slice(0, -2) + '.' }; // Remove trailing comma and space, add a period
  }

  if (input.apiData && countByRaceKeywords.some(keyword => query.includes(keyword))) {
    const raceCounts = countUsersByRace(input.apiData);
    let response = 'Here is the racial breakdown of users: ';
    for (const race in raceCounts) {
      if (raceCounts.hasOwnProperty(race)) {
        response += `${race}: ${raceCounts[race]}, `;
      }
    }
    return { response: response.slice(0, -2) + '.' };
  }

  if (input.apiData && countByEducationKeywords.some(keyword => query.includes(keyword))) {
    const educationCounts = countUsersByEducationLevel(input.apiData);
    let response = 'Here is the breakdown of users by education level: ';
    for (const level in educationCounts) {
      if (educationCounts.hasOwnProperty(level)) {
        response += `${level}: ${educationCounts[level]}, `;
      }
    }
    return { response: response.slice(0, -2) + '.' };
  }

  if (input.apiData && countByTradeKeywords.some(keyword => query.includes(keyword))) {
    const tradeCounts = countUsersByTradeSpecialty(input.apiData);
    let response = 'Here is the breakdown of users by trade specialty: ';
    for (const trade in tradeCounts) {
      if (tradeCounts.hasOwnProperty(trade)) {
        response += `${trade}: ${tradeCounts[trade]}, `;
      }
    }
    return { response: response.slice(0, -2) + '.' };
  }

  if (input.apiData && countByGenderKeywords.some(keyword => query.includes(keyword))) {
    const genderCounts = countUsersByGender(input.apiData);
    let response = 'Here is the breakdown of users by gender: ';
    for (const gender in genderCounts) { if (genderCounts.hasOwnProperty(gender)) { response += `${gender}: ${genderCounts[gender]}, `; } }
 return { response: response.slice(0, -2) + '.' };
  }

  if (input.apiData && input.apiData.data && listUsersKeywords.some(keyword => query.includes(keyword))) {    const fullNames: string[] = [];    for (const userId in input.apiData.data) {
      if (input.apiData.data.hasOwnProperty(userId) && input.apiData.data[userId].Full_Name) {
        fullNames.push(input.apiData.data[userId].Full_Name);
      }
    }
    return { response: `Here is a list of all users: ${fullNames.join(', ')}.`};
  }

  if (input.apiData && totalHoursKeywords.some(keyword => query.includes(keyword))) {
    const totalHours = calculateTotalHoursWorked(input.apiData);
    return { response: `The total hours worked by the workforce is ${totalHours}.` };
  }

  if (input.apiData && averageHoursKeywords.some(keyword => query.includes(keyword))) {
    const averageHours = calculateAverageHoursWorked(input.apiData);
    return { response: `The average hours worked per user is ${averageHours.toFixed(2)}.` };
  }

  if (input.apiData && averageEfficiencyKeywords.some(keyword => query.includes(keyword))) {
    const averageEfficiency = calculateAverageEfficiency(input.apiData);
    return { response: `The average efficiency score is ${averageEfficiency.toFixed(2)}.` };
  }

  if (input.apiData && averageSalaryKeywords.some(keyword => query.includes(keyword))) {
    const averageSalary = calculateAverageSalary(input.apiData);
    return { response: `The average salary is ${averageSalary.toFixed(2)}.` };
  }

  if (input.apiData && averageWageKeywords.some(keyword => query.includes(keyword))) {
    const averageWage = calculateAverageWage(input.apiData);
    return { response: `The average wage is ${averageWage.toFixed(2)}.` };
  }

  if (input.apiData && averageYearsExperienceKeywords.some(keyword => query.includes(keyword))) {
    const averageYearsExperience = calculateAverageYearsExperience(input.apiData);
    return { response: `The average years of experience is ${averageYearsExperience.toFixed(2)}.` };
  }

  if (input.apiData && usersByHoursKeywords.some(keyword => query.includes(keyword))) {
    const parts = query.split(' ');
    let threshold: number | undefined;
    let comparison: 'greater' | 'less' | undefined;

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === 'more' && parts[i + 1] === 'than') {
        comparison = 'greater';
        threshold = parseInt(parts[i + 2]);
        break;
      }
      if (parts[i] === 'less' && parts[i + 1] === 'than') {
        comparison = 'less';
        threshold = parseInt(parts[i + 2]);
        break;
      }
    }

    if (threshold !== undefined && comparison) {
      const users = findUsersByHoursWorked(input.apiData, threshold, comparison);
      const userNames = users.map(user => user.Full_Name).join(', ');
      return { response: `Users who worked ${comparison === 'greater' ? 'more' : 'less'} than ${threshold} hours: ${userNames || 'None'}.` };
    }
  }

  if (input.apiData && usersByEfficiencyKeywords.some(keyword => query.includes(keyword))) {
    const parts = query.split(' ');
    let threshold: number | undefined;
    const aboveIndex = parts.indexOf('above');
    const belowIndex = parts.indexOf('below');

    if (aboveIndex !== -1) { comparison = 'greater'; threshold = parseInt(parts[aboveIndex + 1]); }
    if (belowIndex !== -1) { comparison = 'less'; threshold = parseInt(parts[belowIndex + 1]); }

    if (threshold !== undefined && comparison) { const users = findUsersByEfficiency(input.apiData, threshold, comparison); const userNames = users.map(user => user.Full_Name).join(', '); return { response: `Users with efficiency ${comparison === 'greater' ? 'above' : 'below'} ${threshold}%: ${userNames || 'None'}.` }; }
 }
  return { response: "I can help with listing users if the API data is provided. For now, I can only list all users with the current data." };
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
