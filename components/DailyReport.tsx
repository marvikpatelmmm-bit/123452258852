import React, { useState } from 'react';
import { DailyReport, User } from '../types';
import { MOODS } from '../constants';
import { saveReport } from '../utils/storage';
import { Save } from 'lucide-react';

interface DailyReportProps {
  user: User;
}

export const DailyReportForm: React.FC<DailyReportProps> = ({ user }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = useState(5);
  const [questions, setQuestions] = useState(0);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState(MOODS[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const report: DailyReport = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      date,
      focusRating: rating,
      questionsSolved: questions,
      studyHours: 0, // In a real app we'd calc this
      journalNotes: notes,
      moodEmoji: mood
    };
    saveReport(report);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 border-t-4 border-t-neon-teal">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          📝 End of Day Report
        </h2>

        {submitted ? (
          <div className="bg-green-500/20 border border-green-500 text-green-200 p-6 rounded text-center animate-pulse">
            <p className="text-xl font-bold">Report Logged Successfully!</p>
            <p className="text-sm mt-2">Data synced to HQ.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-neon-teal focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Mood</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {MOODS.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`text-2xl p-2 rounded hover:bg-white/10 transition-all ${mood === m ? 'bg-white/20 scale-110' : 'opacity-50'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Focus Rating (1-10)</label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-teal"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                <span>😫 Rough</span>
                <span>🔥 Legendary</span>
              </div>
              <p className="text-center text-neon-teal font-bold text-xl mt-1">{rating}/10</p>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Questions Solved</label>
              <input 
                type="number"
                min="0"
                value={questions}
                onChange={(e) => setQuestions(parseInt(e.target.value))}
                className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-neon-teal focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 uppercase">Journal / Notes</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What went well? What needs improvement?"
                className="w-full bg-black/40 border border-gray-700 rounded p-3 text-white focus:border-neon-teal focus:outline-none h-32 resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-neon-teal to-green-500 text-black font-bold py-4 rounded hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} /> SUBMIT REPORT
            </button>
          </form>
        )}
      </div>
    </div>
  );
};