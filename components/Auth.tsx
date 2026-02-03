import React, { useState } from 'react';
import { User, UserType } from '../types';
import { USERS } from '../constants';
import { Terminal, Shield, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<UserType>('Marvik');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = selectedUser === 'Marvik' ? 'marvik123' : 'friend123';
    
    if (password === correctPassword) {
      onLogin(USERS[selectedUser]);
    } else {
      setError('ACCESS DENIED: Invalid Credentials');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-space">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-neon-cyan/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-neon-pink/20 blur-[120px] rounded-full" />

      <div className="glass-card p-8 md:p-12 w-full max-w-md relative z-10 border-t border-white/20">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
             <div className="p-4 rounded-full bg-navy border border-neon-cyan/30 shadow-[0_0_30px_rgba(0,245,255,0.3)]">
               <Terminal size={48} className="text-neon-cyan animate-pulse-slow" />
             </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-wider text-white">JOINT STUDY HQ</h1>
          <p className="text-gray-400 font-mono text-sm">SECURE TERMINAL ACCESS v2.4</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-neon-cyan mb-2 tracking-widest uppercase">Select Operative</label>
            <div className="relative">
              <select 
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value as UserType)}
                className="w-full bg-navy/50 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all appearance-none cursor-pointer"
              >
                <option value="Marvik">Marvik [JEE]</option>
                <option value="Friend">Friend [NEET]</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-xs font-mono text-neon-cyan mb-2 tracking-widest uppercase">Passcode</label>
             <div className="relative">
               <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy/50 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                  placeholder="••••••••"
               />
               <Shield className="absolute right-3 top-3 text-gray-500" size={18} />
             </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-3 rounded flex items-center gap-2 animate-bounce">
              <span>⚠️</span> {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full group relative bg-gradient-to-r from-neon-cyan to-neon-teal text-black font-bold py-3 rounded-lg overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(0,245,255,0.4)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              ENTER THE ARENA <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </form>
        
        <div className="mt-6 text-center">
            <p className="text-[10px] text-gray-600 font-mono">
                SYSTEM STATUS: <span className="text-neon-green">ONLINE</span>
            </p>
        </div>
      </div>
    </div>
  );
};