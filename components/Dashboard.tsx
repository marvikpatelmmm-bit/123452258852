import React, { useState, useEffect } from 'react';
import { User, Task, TaskStatus } from '../types';
import { SUBJECT_COLORS, USERS } from '../constants';
import { CircularTimer } from './CircularTimer';
import { TaskForm } from './TaskForm';
import { saveTask } from '../utils/storage';
import { Play, Pause, Square, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  user: User;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, tasks, setTasks }) => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // Mock Partner Data
  const partnerName = user.username === 'Marvik' ? 'Friend' : 'Marvik';
  const partner = USERS[partnerName];
  const [partnerState, setPartnerState] = useState<{status: string, task?: string, subject?: string, timeLeft?: number}>({ status: 'offline' });

  // Load active task from tasks list if exists on mount
  useEffect(() => {
    const ongoing = tasks.find(t => t.status === 'In Progress');
    if (ongoing) {
        setActiveTaskId(ongoing.id);
        setElapsed(ongoing.actualDuration);
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (activeTaskId && !isPaused) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1);
        // Also update task object in memory/storage every 10s roughly to save progress
        if (elapsed % 10 === 0) {
            updateTaskProgress(activeTaskId, elapsed + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTaskId, isPaused, elapsed]);

  // Mock Partner Activity
  useEffect(() => {
    const interval = setInterval(() => {
      const states = ['offline', 'idle', 'grinding'];
      const current = states[Math.floor(Math.random() * states.length)];
      if (current === 'grinding') {
        setPartnerState({
            status: 'grinding',
            task: partner.target === 'NEET' ? 'Botany Diagrams' : 'Calculus III',
            subject: partner.target === 'NEET' ? 'Biology' : 'Mathematics',
            timeLeft: Math.floor(Math.random() * 45)
        });
      } else {
        setPartnerState({ status: current });
      }
    }, 8000); // Update every 8s
    return () => clearInterval(interval);
  }, [partner]);

  const updateTaskProgress = (id: string, duration: number) => {
    const updatedTasks = tasks.map(t => 
        t.id === id ? { ...t, actualDuration: duration } : t
    );
    setTasks(updatedTasks);
    // Persist active task
    const task = updatedTasks.find(t => t.id === id);
    if(task) saveTask(task);
  };

  const handleAddTask = (task: Task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    saveTask(task);
  };

  const handleStartTask = (taskId: string) => {
    if (activeTaskId) return; // Only one at a time
    const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status: 'In Progress' as TaskStatus, start_time: Date.now() } : t
    );
    setTasks(updatedTasks);
    saveTask(updatedTasks.find(t => t.id === taskId)!);
    setActiveTaskId(taskId);
    setElapsed(updatedTasks.find(t => t.id === taskId)?.actualDuration || 0);
    setIsPaused(false);
  };

  const handleCompleteTask = () => {
    if (!activeTaskId) return;
    const updatedTasks = tasks.map(t => 
        t.id === activeTaskId ? { ...t, status: 'Completed' as TaskStatus, actualDuration: elapsed, end_time: Date.now() } : t
    );
    setTasks(updatedTasks);
    saveTask(updatedTasks.find(t => t.id === activeTaskId)!);
    setActiveTaskId(null);
    setElapsed(0);
  };

  const handleAbortTask = () => {
    if (!activeTaskId) return;
    const updatedTasks = tasks.map(t => 
        t.id === activeTaskId ? { ...t, status: 'Aborted' as TaskStatus, actualDuration: elapsed } : t
    );
    setTasks(updatedTasks);
    saveTask(updatedTasks.find(t => t.id === activeTaskId)!);
    setActiveTaskId(null);
    setElapsed(0);
  };

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const pendingTasks = tasks.filter(t => t.status === 'Pending' && t.userId === user.id);
  const completedToday = tasks.filter(t => t.status === 'Completed' && t.userId === user.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: My Controls */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Welcome Header */}
        <div className="glass-card p-6 flex justify-between items-center bg-gradient-to-r from-space to-navy">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Welcome, <span style={{ color: user.themeColor }}>{user.username}</span> {user.avatar}
            </h2>
            <p className="text-gray-400 text-sm mt-1">Target: <span className="text-white font-mono font-bold bg-white/10 px-2 rounded">{user.target}</span></p>
          </div>
          <div className="text-right">
             <p className="text-3xl font-bold text-white">{completedToday.length}</p>
             <p className="text-xs text-gray-500 uppercase tracking-widest">Tasks Done</p>
          </div>
        </div>

        {/* Active Task Display */}
        <div className="glass-card p-8 flex flex-col items-center relative overflow-hidden">
          {activeTask ? (
            <>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent animate-pulse" />
              <h3 className="text-xl font-bold mb-1 text-center">{activeTask.name}</h3>
              <p className="text-sm text-gray-400 mb-8 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/5">
                <span style={{ color: SUBJECT_COLORS[activeTask.subject] }}>●</span> {activeTask.subject}
              </p>
              
              <CircularTimer 
                elapsedSeconds={elapsed} 
                totalSeconds={activeTask.estimatedDuration * 60} 
                color={user.themeColor}
                isActive={!isPaused}
                subject={activeTask.subject}
              />

              <div className="flex gap-4 mt-8">
                 {!isPaused ? (
                   <button onClick={() => setIsPaused(true)} className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 p-4 rounded-full transition-all backdrop-blur-sm border border-yellow-500/50">
                     <Pause fill="currentColor" />
                   </button>
                 ) : (
                   <button onClick={() => setIsPaused(false)} className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-4 rounded-full transition-all backdrop-blur-sm border border-green-500/50">
                     <Play fill="currentColor" />
                   </button>
                 )}
                 <button onClick={handleCompleteTask} className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan p-4 rounded-full transition-all backdrop-blur-sm border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,245,255,0.3)]">
                   <CheckCircle />
                 </button>
                 <button onClick={handleAbortTask} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-4 rounded-full transition-all backdrop-blur-sm border border-red-500/50">
                   <Square fill="currentColor" size={20} />
                 </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="w-20 h-20 rounded-full bg-white/5 mx-auto mb-4 flex items-center justify-center border border-white/10">
                 <Clock size={32} className="text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-300">No Active Mission</h3>
              <p className="text-sm text-gray-500 mt-2">Select a task from the queue or add a new one.</p>
            </div>
          )}
        </div>

        {/* Task Queue & Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TaskForm target={user.target} userId={user.id} onAddTask={handleAddTask} />
            
            <div className="glass-card p-4 h-full max-h-[300px] overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 sticky top-0 bg-space/90 p-2 backdrop-blur z-10">Mission Queue</h3>
                <div className="space-y-3">
                   {pendingTasks.length === 0 && <p className="text-xs text-gray-600 text-center py-4">Queue is empty.</p>}
                   {pendingTasks.map(task => (
                     <div key={task.id} className="bg-white/5 p-3 rounded border border-white/5 hover:border-white/20 transition-all flex justify-between items-center group">
                       <div>
                         <p className="font-bold text-sm text-gray-200">{task.name}</p>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40" style={{ color: SUBJECT_COLORS[task.subject] }}>{task.subject}</span>
                            <span className="text-[10px] text-gray-500">{task.estimatedDuration}m</span>
                         </div>
                       </div>
                       <button 
                         onClick={() => handleStartTask(task.id)}
                         disabled={!!activeTaskId}
                         className="opacity-0 group-hover:opacity-100 disabled:opacity-20 bg-neon-cyan text-black p-2 rounded-full hover:scale-110 transition-all"
                       >
                         <Play size={12} fill="currentColor" />
                       </button>
                     </div>
                   ))}
                </div>
            </div>
        </div>
      </div>

      {/* Right Column: Partner Status */}
      <div className="lg:col-span-5 space-y-6">
        <div className={`glass-card p-6 relative overflow-hidden transition-all duration-500 ${partnerState.status === 'grinding' ? 'border-neon-pink/50 shadow-[0_0_30px_rgba(255,0,110,0.1)]' : ''}`}>
           <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Partner Uplink</h3>
           
           <div className="flex flex-col items-center">
             <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-4xl border-2 border-gray-600 relative z-10">
                   {partner.avatar}
                </div>
                {/* Status Indicator Ring */}
                {partnerState.status === 'grinding' && (
                    <div className="absolute inset-0 rounded-full border-2 border-neon-pink animate-ping" />
                )}
                <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-space ${
                    partnerState.status === 'grinding' ? 'bg-green-500' : 
                    partnerState.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'
                } z-20`} />
             </div>
             
             <h2 className="text-2xl font-bold text-white">{partner.username}</h2>
             <p className="text-neon-pink text-sm font-mono mt-1 mb-6">[{partnerState.status.toUpperCase()}]</p>
             
             {partnerState.status === 'grinding' ? (
                <div className="w-full bg-black/20 rounded-xl p-4 border border-white/5 animate-pulse">
                   <p className="text-center text-gray-300 text-sm mb-1">Currently Studying</p>
                   <p className="text-center text-xl font-bold text-white mb-2">{partnerState.task}</p>
                   <div className="flex justify-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-neon-pink/10 text-neon-pink text-xs rounded border border-neon-pink/30">{partnerState.subject}</span>
                      <span className="px-2 py-1 bg-white/10 text-white text-xs rounded font-mono">~{partnerState.timeLeft}m left</span>
                   </div>
                   <div className="text-center text-xs text-gray-500 font-mono">
                      "{partner.username} is crushing it! 💪"
                   </div>
                </div>
             ) : (
                <div className="text-center text-gray-500 text-sm">
                   {partnerState.status === 'idle' ? 'Taking a short break...' : 'Last seen: 2 hours ago'}
                </div>
             )}
           </div>
        </div>

        {/* Mini Feed */}
        <div className="glass-card p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">System Log</h3>
            <div className="space-y-2 font-mono text-xs">
                <div className="flex gap-2 text-gray-400">
                    <span className="text-gray-600">10:42</span>
                    <span>{partner.username} completed "Organic Chem"</span>
                </div>
                <div className="flex gap-2 text-gray-400">
                    <span className="text-gray-600">09:15</span>
                    <span>{user.username} logged in</span>
                </div>
                 <div className="flex gap-2 text-gray-400">
                    <span className="text-gray-600">Yesterday</span>
                    <span>{partner.username} achieved "The Grinder"</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};