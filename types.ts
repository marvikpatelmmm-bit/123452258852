export type UserType = 'Marvik' | 'Friend';
export type TargetExam = 'JEE' | 'NEET';

export interface User {
  id: string;
  username: UserType;
  target: TargetExam;
  avatar: string;
  themeColor: string;
  secondaryColor: string;
}

export type Subject = 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology';

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Aborted';

export interface Task {
  id: string;
  userId: string;
  name: string;
  subject: Subject;
  estimatedDuration: number; // minutes
  actualDuration: number; // seconds
  status: TaskStatus;
  createdAt: number;
}

export interface DailyReport {
  id: string;
  userId: string;
  date: string;
  focusRating: number;
  questionsSolved: number;
  studyHours: number;
  journalNotes: string;
  moodEmoji: string;
}

export type Page = 'dashboard' | 'history' | 'leaderboard' | 'report' | 'stats';