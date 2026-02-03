import React from 'react';
import { User, Task, DailyReport } from '../types';
import { USERS } from '../constants';
import { Trophy, Zap, Target } from 'lucide-react';
import { getStoredTasks, getStoredReports } from '../utils/storage';

export const Leaderboard: React.FC = () => {
  const tasks = getStoredTasks();
  const reports = getStoredReports();

  const calculateStats = (userId: string) => {
    const userTasks = tasks.filter(t => t.userId === userId && t.status === 'Completed');
    const userReports = reports.filter(r => r.userId === userId);

    const totalMinutes = userTasks.reduce((acc, curr) => acc + (curr.actualDuration / 60), 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    const totalQuestions = userReports.reduce((acc, curr) => acc + curr.questionsSolved, 0);
    const completedCount = userTasks.length;

    return { totalHours, totalQuestions, completedCount };
  };

  const marvikStats = calculateStats(USERS.Marvik.id);
  const friendStats = calculateStats(USERS.Friend.id);

  const renderCard = (
    title: string, 
    icon: React.ReactNode, 
    marvikVal: number, 
    friendVal: number, 
    unit: string,
    colorFrom: string,
    colorTo: string
  ) => {
    const winner = marvikVal > friendVal ? 'Marvik' : friendVal > marvikVal ? 'Friend' : 'Tie';
    
    return (
      <div className={`glass-card p-6 relative overflow-hidden group`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${colorFrom} ${colorTo} opacity-10 group-hover:opacity-20 transition-opacity`} />
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colorFrom} ${colorTo} text-black shadow-lg`}>
            {icon}
          </div>
          <h3 className="font-bold text-lg text-white uppercase tracking-wider">{title}</h3>
        </div>

        <div className="space-y-6 relative z-10">
          {/* Marvik Row */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={`font-bold ${winner === 'Marvik' ? 'text-neon-gold animate-pulse' : 'text-gray-400'}`}>
                {winner === 'Marvik' && '👑 '} Marvik
              </span>
              <span className="font-mono text-white">{marvikVal} {unit}</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-neon-cyan transition-all duration-1000" 
                 style={{ width: `${(marvikVal / (Math.max(marvikVal, friendVal) || 1)) * 100}%` }}
               />
            </div>
          </div>

          {/* Friend Row */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className={`font-bold ${winner === 'Friend' ? 'text-neon-gold animate-pulse' : 'text-gray-400'}`}>
                {winner === 'Friend' && '👑 '} Friend
              </span>
              <span className="font-mono text-white">{friendVal} {unit}</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-neon-pink transition-all duration-1000" 
                 style={{ width: `${(friendVal / (Math.max(marvikVal, friendVal) || 1)) * 100}%` }}
               />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2 text-shadow-glow">LEADERBOARD</h2>
        <p className="text-gray-400 font-mono">Real-time Performance Metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderCard(
          "The Grinder", 
          <Zap size={24} />, 
          marvikStats.totalHours, 
          friendStats.totalHours, 
          "hrs",
          "from-yellow-400",
          "to-orange-500"
        )}
        {renderCard(
          "The Solver", 
          <Target size={24} />, 
          marvikStats.totalQuestions, 
          friendStats.totalQuestions, 
          "Q's",
          "from-purple-400",
          "to-indigo-500"
        )}
        {renderCard(
          "The Finisher", 
          <Trophy size={24} />, 
          marvikStats.completedCount, 
          friendStats.completedCount, 
          "Tasks",
          "from-cyan-400",
          "to-blue-500"
        )}
      </div>
    </div>
  );
};