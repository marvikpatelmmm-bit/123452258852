import React from 'react';
import { User, Task } from '../types';
import { getStoredTasks } from '../utils/storage';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SUBJECT_COLORS } from '../constants';

export const Stats: React.FC<{ user: User }> = ({ user }) => {
  const tasks = getStoredTasks().filter(t => t.userId === user.id && t.status === 'Completed');
  
  // Aggregate data by subject
  const data = Object.keys(SUBJECT_COLORS)
    .filter(subject => user.target === 'JEE' ? !['Biology'].includes(subject) : !['Mathematics'].includes(subject))
    .map(subject => {
      const subjectTasks = tasks.filter(t => t.subject === subject);
      const totalHours = subjectTasks.reduce((acc, t) => acc + (t.actualDuration / 3600), 0);
      return {
        name: subject,
        hours: Math.round(totalHours * 10) / 10,
        color: SUBJECT_COLORS[subject as keyof typeof SUBJECT_COLORS]
      };
    });

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Weekly Breakdown</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} unit="h" />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: '#1a1a2e', borderColor: '#333', color: '#fff' }}
              />
              <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
            <p className="text-gray-500 text-xs uppercase mb-1">Total Hours</p>
            <p className="text-2xl font-bold text-white">
                {Math.round(tasks.reduce((acc, t) => acc + t.actualDuration, 0) / 3600 * 10) / 10}
            </p>
        </div>
        <div className="glass-card p-4 text-center">
            <p className="text-gray-500 text-xs uppercase mb-1">Tasks Done</p>
            <p className="text-2xl font-bold text-white">{tasks.length}</p>
        </div>
        <div className="glass-card p-4 text-center">
            <p className="text-gray-500 text-xs uppercase mb-1">Avg Session</p>
            <p className="text-2xl font-bold text-white">
               {tasks.length > 0 ? Math.round((tasks.reduce((acc, t) => acc + t.actualDuration, 0) / 60 / tasks.length)) : 0}m
            </p>
        </div>
         <div className="glass-card p-4 text-center">
            <p className="text-gray-500 text-xs uppercase mb-1">Current Streak</p>
            <p className="text-2xl font-bold text-neon-green">5 Days 🔥</p>
        </div>
      </div>
    </div>
  );
};