import { Subject, User } from './types';

export const USERS: Record<string, User> = {
  Marvik: {
    id: 'user_marvik',
    username: 'Marvik',
    target: 'JEE',
    avatar: '👨‍💻',
    themeColor: '#00f5ff', // Neon Cyan
    secondaryColor: '#00d4aa',
  },
  Friend: {
    id: 'user_friend',
    username: 'Friend',
    target: 'NEET',
    avatar: '👩‍⚕️',
    themeColor: '#ff006e', // Neon Pink
    secondaryColor: '#8338ec',
  }
};

export const SUBJECTS_JEE: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
export const SUBJECTS_NEET: Subject[] = ['Physics', 'Chemistry', 'Biology'];

export const SUBJECT_COLORS: Record<Subject, string> = {
  Physics: '#3b82f6', // Blue
  Chemistry: '#eab308', // Yellow
  Mathematics: '#ef4444', // Red
  Biology: '#22c55e', // Green
};

export const MOODS = ['😊', '😎', '🤓', '😤', '😴', '🔥', '💪', '🎯'];