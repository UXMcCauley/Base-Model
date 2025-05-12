// src/ai/tools/statistics-tool.ts

export function countActiveUsers(apiData: any): number {
  if (!apiData || !apiData.data) {
    return 0;
  }

  let activeCount = 0;
  for (const userId in apiData.data) {
    if (apiData.data[userId].Individual_Active === "true") {
      activeCount++;
    }
  }

  return activeCount;
}

export function countUsersByOrgRole(apiData: any): { [key: string]: number } {
  if (!apiData || !apiData.data) {
    return {};
  }

  const roleCounts: { [key: string]: number } = {};
  for (const userId in apiData.data) {
    const orgRole = apiData.data[userId].Org_Role;
    if (orgRole) {
      roleCounts[orgRole] = (roleCounts[orgRole] || 0) + 1;
    }
  }

  return roleCounts;
}

export function countUsersByRace(apiData: any): { [key: string]: number } {
  if (!apiData || !apiData.data) {
    return {};
  }

  const raceCounts: { [key: string]: number } = {};
  for (const userId in apiData.data) {
    const race = apiData.data[userId].race;
    if (race) {
      raceCounts[race] = (raceCounts[race] || 0) + 1;
    }
  }

  return raceCounts;
}

export function countUsersByEducationLevel(apiData: any): { [key: string]: number } {
  if (!apiData || !apiData.data) {
    return {};
  }

  const educationCounts: { [key: string]: number } = {};
  for (const userId in apiData.data) {
    const educationLevel = apiData.data[userId].education_level;
    if (educationLevel) {
      educationCounts[educationLevel] = (educationCounts[educationLevel] || 0) + 1;
    }
  }

  return educationCounts;
}

export function countUsersByTradeSpecialty(apiData: any): { [key: string]: number } {
  if (!apiData || !apiData.data) {
    return {};
  }

  const specialtyCounts: { [key: string]: number } = {};
  for (const userId in apiData.data) {
    const tradeSpecialty = apiData.data[userId].trade_specialty;
    if (tradeSpecialty) {
      specialtyCounts[tradeSpecialty] = (specialtyCounts[tradeSpecialty] || 0) + 1;
    }
  }

  return specialtyCounts;
}

export function countUsersByGender(apiData: any): { [key: string]: number } {
  if (!apiData || !apiData.data) {
    return {};
  }

  const genderCounts: { [key: string]: number } = {};
  for (const userId in apiData.data) {
    const gender = apiData.data[userId].gender;
    if (gender) {
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    }
  }
  return genderCounts;
}
export function calculateTotalHoursWorked(apiData: any): number {
  if (!apiData || !apiData.data) {
    return 0;
  }

  let totalHours = 0;
  for (const userId in apiData.data) {
    const hoursWorked = parseFloat(apiData.data[userId].Hours_Worked);
    if (!isNaN(hoursWorked)) {
      totalHours += hoursWorked;
    }
  }

  return totalHours;
}

export function calculateAverageHoursWorked(apiData: any): number {
  if (!apiData || !apiData.data) {
    return 0;
  }

  let totalHours = 0;
  let userCount = 0;
  for (const userId in apiData.data) {
    const hoursWorked = parseFloat(apiData.data[userId].Hours_Worked);
    if (!isNaN(hoursWorked)) {
      totalHours += hoursWorked;
      userCount++;
    }
  }

  return userCount === 0 ? 0 : totalHours / userCount;
}

export function calculateAverageEfficiency(apiData: any): number {
  if (!apiData || !apiData.data) {
    return 0;
  }

  let totalEfficiency = 0;
  let userCount = 0;
  for (const userId in apiData.data) {
    const efficiencyScore = parseFloat(apiData.data[userId].Efficiency_Score);
    if (!isNaN(efficiencyScore)) {
      totalEfficiency += efficiencyScore;
      userCount++;
    }
  }

  return userCount === 0 ? 0 : totalEfficiency / userCount;
}

export function findUsersByHoursWorked(apiData: any, threshold: number, comparison: 'greater' | 'less'): any[] {
  if (!apiData || !apiData.data || isNaN(threshold)) {
    return [];
  }

  const matchingUsers: any[] = [];
  for (const userId in apiData.data) {
    const hoursWorked = parseFloat(apiData.data[userId].Hours_Worked);
    if (!isNaN(hoursWorked)) {
      if (comparison === 'greater' && hoursWorked > threshold) {
        matchingUsers.push(apiData.data[userId]);
      } else if (comparison === 'less' && hoursWorked < threshold) {
        matchingUsers.push(apiData.data[userId]);
      }
    }
  }

  return matchingUsers;
}

export function calculateAverageSalary(apiData: any): number {
  if (!apiData || !apiData.data) {
    return 0;
  }

  let totalSalary = 0;
  let userCount = 0;
  for (const userId in apiData.data) {
    const salary = parseFloat(apiData.data[userId].salary);
    if (!isNaN(salary)) {
      totalSalary += salary;
      userCount++;
    }
  }

  return userCount === 0 ? 0 : totalSalary / userCount;
}

export function calculateAverageWage(apiData: any): number {
  if (!apiData || !apiData.data) {
    return 0;
  }

  let totalWage = 0;
  let userCount = 0;
  for (const userId in apiData.data) {
    const wage = parseFloat(apiData.data[userId].wage);
    if (!isNaN(wage)) {
      totalWage += wage;
      userCount++;
    }
  }

  return userCount === 0 ? 0 : totalWage / userCount;
}

export function calculateAverageYearsExperience(apiData: any): number {
  if (!apiData || !apiData.data) {
    return 0;
  }

  let totalYearsExperience = 0;
  let userCount = 0;
  for (const userId in apiData.data) {
    const yearsExperience = parseFloat(apiData.data[userId].years_experience);
    if (!isNaN(yearsExperience)) {
      totalYearsExperience += yearsExperience;
      userCount++;
    }
  }

  return userCount === 0 ? 0 : totalYearsExperience / userCount;
}




export function findUsersByEfficiency(apiData: any, threshold: number, comparison: 'greater' | 'less'): any[] {
  if (!apiData || !apiData.data || isNaN(threshold)) {
    return [];
  }

  const matchingUsers: any[] = [];
  for (const userId in apiData.data) {
    const efficiencyScore = parseFloat(apiData.data[userId].Efficiency_Score);
    if (!isNaN(efficiencyScore)) {
      if (comparison === 'greater' && efficiencyScore > threshold) {
        matchingUsers.push(apiData.data[userId]);
      } else if (comparison === 'less' && efficiencyScore < threshold) {
        matchingUsers.push(apiData.data[userId]);
      }
    }
  }

  return matchingUsers;
}
