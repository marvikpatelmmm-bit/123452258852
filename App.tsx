import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { Leaderboard } from './components/Leaderboard';
import { DailyReportForm } from './components/DailyReport';
import { Stats } from './components/Stats';
import { User, Page, Task } from './types';
import { getStoredUser, setStoredUser, seedData, getStoredTasks } from './utils/storage';
import { USERS } from './constants';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);

  // Initialize
  useEffect(() => {
    seedData(); // Populate mock data for leaderboard demo
    const storedUsername = getStoredUser();
    if (storedUsername && USERS[storedUsername]) {
      setUser(USERS[storedUsername]);
      setTasks(getStoredTasks());
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setStoredUser(loggedInUser.username);
    setTasks(getStoredTasks());
  };

  const handleLogout = () => {
    setUser(null);
    setStoredUser(null);
    setCurrentPage('dashboard');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-space text-white">
      <Sidebar 
        user={user} 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto">
          {currentPage === 'dashboard' && (
            <Dashboard user={user} tasks={tasks} setTasks={setTasks} />
          )}
          {currentPage === 'leaderboard' && (
            <Leaderboard />
          )}
          {currentPage === 'report' && (
            <DailyReportForm user={user} />
          )}
          {currentPage === 'stats' && (
            <Stats user={user} />
          )}
        </div>
      </main>
    </div>
  );
}