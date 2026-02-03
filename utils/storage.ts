import { DailyReport, Task, TaskStatus } from '../types';

const KEYS = {
  TASKS: 'study_hq_tasks',
  REPORTS: 'study_hq_reports',
  USER: 'study_hq_current_user',
};

export const getStoredTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTask = (task: Task) => {
  const tasks = getStoredTasks();
  // Update if exists, else add
  const index = tasks.findIndex(t => t.id === task.id);
  if (index >= 0) {
    tasks[index] = task;
  } else {
    tasks.push(task);
  }
  localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
};

export const getStoredReports = (): DailyReport[] => {
  try {
    const data = localStorage.getItem(KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveReport = (report: DailyReport) => {
  const reports = getStoredReports();
  // Check for existing report on same day for user
  const index = reports.findIndex(r => r.userId === report.userId && r.date === report.date);
  if (index >= 0) {
    reports[index] = report;
  } else {
    reports.push(report);
  }
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
};

export const getStoredUser = () => {
  return localStorage.getItem(KEYS.USER);
};

export const setStoredUser = (username: string | null) => {
  if (username) {
    localStorage.setItem(KEYS.USER, username);
  } else {
    localStorage.removeItem(KEYS.USER);
  }
};

// Seeding some dummy data for the Leaderboard to look good
export const seedData = () => {
  if (getStoredTasks().length === 0) {
    const tasks: Task[] = [
      { id: '1', userId: 'user_marvik', name: 'Mechanics Review', subject: 'Physics', estimatedDuration: 60, actualDuration: 3400, status: 'Completed', createdAt: Date.now() - 86400000 },
      { id: '2', userId: 'user_marvik', name: 'Calculus Problems', subject: 'Mathematics', estimatedDuration: 45, actualDuration: 2700, status: 'Completed', createdAt: Date.now() - 43200000 },
      { id: '3', userId: 'user_friend', name: 'Botany Diagrams', subject: 'Biology', estimatedDuration: 90, actualDuration: 5400, status: 'Completed', createdAt: Date.now() - 90000000 },
      { id: '4', userId: 'user_friend', name: 'Organic Chem', subject: 'Chemistry', estimatedDuration: 60, actualDuration: 3500, status: 'Completed', createdAt: Date.now() - 36000000 },
    ];
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
    
    const reports: DailyReport[] = [
       { id: '1', userId: 'user_marvik', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], focusRating: 8, questionsSolved: 45, studyHours: 4, journalNotes: 'Good flow', moodEmoji: '🔥' },
       { id: '2', userId: 'user_friend', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], focusRating: 9, questionsSolved: 60, studyHours: 5, journalNotes: 'Crushed it', moodEmoji: '🎯' }
    ];
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(reports));
  }
};