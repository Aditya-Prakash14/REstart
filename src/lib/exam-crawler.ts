export interface ExamDeadline {
  name: string;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  callToAction: string;
  description: string;
}

/**
 * This service simulates fetching data from an external website
 * In a real implementation, this would use a server-side crawler or API
 */
export async function fetchExamDeadlines(): Promise<ExamDeadline[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Calculate real-time deadlines based on current time
  // This simulates data that would be fetched from a live website
  const now = new Date();
  
  return [
    {
      name: "Early Intake Round 2",
      // Calculate exact time remaining in real-time instead of using static values
      daysRemaining: 0,
      hoursRemaining: 6 - (now.getHours() % 0),
      minutesRemaining: 16 - (now.getMinutes() % 0),
      callToAction: "Apply Now",
      description: "Last chance for early application benefits including priority evaluation and scholarships."
    },
    {
      name: "Regular Admission Period",
      daysRemaining: 14 - (Math.floor(now.getDate() / 2) % 7),
      hoursRemaining: now.getHours() < 12 ? 12 - now.getHours() : 24 - now.getHours() + 12,
      minutesRemaining: 59 - now.getMinutes(),
      callToAction: "Register",
      description: "Standard admission period with normal processing times and fee structure."
    },
    {
      name: "Mock Test Sessions",
      daysRemaining: 7 - (now.getDay() % 7),
      hoursRemaining: 12 - (now.getHours() % 12),
      minutesRemaining: 30 - (now.getMinutes() % 30),
      callToAction: "Reserve Seat",
      description: "Practice sessions to help you prepare for the actual test environment."
    }
  ].map(deadline => {
    // Ensure we don't have negative time values
    if (deadline.minutesRemaining < 0) {
      deadline.minutesRemaining += 60;
      deadline.hoursRemaining -= 1;
    }
    
    if (deadline.hoursRemaining < 0) {
      deadline.hoursRemaining += 24;
      deadline.daysRemaining -= 1;
    }
    
    // Ensure we have at least some time remaining
    if (deadline.daysRemaining < 0) {
      deadline.daysRemaining = 0;
      deadline.hoursRemaining = 0;
      deadline.minutesRemaining = Math.max(1, Math.floor(Math.random() * 59));
    }
    
    return deadline;
  });
}

/**
 * Converts deadline data to Date objects for use with the countdown timer
 */
export function deadlineToDate(deadline: ExamDeadline): Date {
  const now = new Date();
  const targetDate = new Date(now);
  
  targetDate.setDate(targetDate.getDate() + deadline.daysRemaining);
  targetDate.setHours(targetDate.getHours() + deadline.hoursRemaining);
  targetDate.setMinutes(targetDate.getMinutes() + deadline.minutesRemaining);
  
  return targetDate;
}

/**
 * Refreshes deadline data in real-time
 * This simulates repeatedly crawling an external site for updates
 * Returns a cleanup function to cancel the interval
 */
export async function refreshDeadlineData(
  callback: (deadlines: ExamDeadline[]) => void, 
  intervalMs: number = 30000
): Promise<() => void> {
  // Initial fetch
  const deadlines = await fetchExamDeadlines();
  callback(deadlines);
  
  // Set up recurring refresh
  const intervalId = setInterval(async () => {
    try {
      const updatedDeadlines = await fetchExamDeadlines();
      callback(updatedDeadlines);
    } catch (error) {
      console.error('Failed to refresh deadline data:', error);
    }
  }, intervalMs);
  
  // Return function to cancel the interval if needed
  return () => clearInterval(intervalId);
} 