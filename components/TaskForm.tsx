import React, { useState } from 'react';
import { Subject, TargetExam, Task } from '../types';
import { SUBJECTS_JEE, SUBJECTS_NEET } from '../constants';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  target: TargetExam;
  userId: string;
  onAddTask: (task: Task) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ target, userId, onAddTask }) => {
  const [taskName, setTaskName] = useState('');
  const [subject, setSubject] = useState<Subject>(target === 'JEE' ? 'Physics' : 'Biology');
  const [duration, setDuration] = useState(30);

  const subjects = target === 'JEE' ? SUBJECTS_JEE : SUBJECTS_NEET;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      name: taskName,
      subject,
      estimatedDuration: duration,
      actualDuration: 0,
      status: 'Pending',
      createdAt: Date.now(),
    };

    onAddTask(newTask);
    setTaskName('');
    setDuration(30);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">New Mission</h3>
        <span className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded font-mono">ID: {Math.floor(Math.random() * 9999)}</span>
      </div>
      
      <div>
        <input 
          type="text"
          placeholder="Task Objective (e.g. Thermodynamics Ch. 2)"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full bg-navy/60 border border-gray-700 rounded p-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
          required
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            className="w-full bg-navy/60 border border-gray-700 rounded p-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="w-24">
           <input 
            type="number"
            min="5"
            max="180"
            step="5"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full bg-navy/60 border border-gray-700 rounded p-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
          />
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-white/5 hover:bg-neon-cyan/20 border border-white/10 hover:border-neon-cyan/50 text-neon-cyan transition-all rounded p-2 flex items-center justify-center gap-2 text-sm font-bold"
      >
        <Plus size={16} /> ADD TO QUEUE
      </button>
    </form>
  );
};