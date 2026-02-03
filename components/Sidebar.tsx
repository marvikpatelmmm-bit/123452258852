import React from 'react';
import { User, Page } from '../types';
import { LogOut, LayoutDashboard, Trophy, FileText, PieChart, Activity } from 'lucide-react';

interface SidebarProps {
  user: User;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, onNavigate, onLogout }) => {
  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
    { id: 'report', label: 'Daily Report', icon: <FileText size={20} /> },
    { id: 'stats', label: 'Analytics', icon: <PieChart size={20} /> },
  ];

  return (
    <div className="w-full md:w-64 bg-navy border-r border-white/5 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-bold text-white tracking-widest flex items-center gap-2">
           <Activity className="text-neon-cyan" /> STUDY HQ
        </h1>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10">
             {user.avatar}
           </div>
           <div>
             <p className="font-bold text-white">{user.username}</p>
             <p className="text-xs text-gray-400">{user.target} Aspirant</p>
           </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === item.id 
                  ? 'bg-white/10 text-white border-l-4 border-neon-cyan' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-mono text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-mono"
        >
          <LogOut size={16} /> Disconnect
        </button>
      </div>
    </div>
  );
};