import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import { StoreProvider } from './context/store';
import Collaborations from './pages/Collaborations';
import Content from './pages/Content';
import Home from './pages/Home';
import Inbox from './pages/Inbox';
import Money from './pages/Money';
import MonthlyReview from './pages/MonthlyReview';
import Profile from './pages/Profile';

export default function App() {
  const [tab, setTab] = useState('home');
  const [showSplash, setShowSplash] = useState(true);

  // 2-second splash screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StoreProvider>
      {/* 2-Second Anime Splash Screen */}
      {showSplash ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d021a] text-purple-100 transition-opacity duration-700">
          <div className="relative flex flex-col items-center">
            {/* Glowing Anime Emblem */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 flex items-center justify-center text-3xl font-black shadow-2xl shadow-pink-500/50 animate-bounce mb-6">
              ✨
            </div>
            <h1 className="text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-300 mb-2">
              CREATOR HQ
            </h1>
            <p className="text-xs text-pink-400 font-medium tracking-widest uppercase mb-6">
              Anime Night Studio OS
            </p>

            {/* Loading Bar */}
            <div className="w-48 h-1.5 bg-purple-950 rounded-full overflow-hidden border border-purple-500/30">
              <div className="h-full bg-gradient-to-r from-pink-500 to-purple-400 animate-[pulse_1s_infinite] w-full" />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen relative overflow-hidden flex text-purple-100">
          {/* Animated Background Motion Orbs & Silhouettes */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Glowing Nebula Orbs */}
            <div className="anime-glow-orb absolute top-10 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
            <div className="anime-glow-orb absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-pink-600/20 blur-3xl" />

            {/* Flying Crows / Silhouettes */}
            <svg className="floating-crow crow-1 w-8 h-8" viewBox="0 0 24 24"><path d="M12 2c0 4-4 6-8 8 4 0 8 4 8 8 0-4 4-6 8-8-4 0-8-4-8-8z" /></svg>
            <svg className="floating-crow crow-2 w-6 h-6" viewBox="0 0 24 24"><path d="M12 2c0 4-4 6-8 8 4 0 8 4 8 8 0-4 4-6 8-8-4 0-8-4-8-8z" /></svg>
            <svg className="floating-crow crow-3 w-7 h-7" viewBox="0 0 24 24"><path d="M12 2c0 4-4 6-8 8 4 0 8 4 8 8 0-4 4-6 8-8-4 0-8-4-8-8z" /></svg>
          </div>

          {/* Sidebar */}
          <div className="relative z-10">
            <Sidebar activeTab={tab} onTabChange={setTab} />
          </div>

          {/* Main Dashboard Pages */}
          <main className="flex-1 relative z-10 overflow-y-auto min-h-screen p-6">
            {tab === 'home' && <Home onNavigate={setTab} />}
            {tab === 'collaborations' && <Collaborations />}
            {tab === 'inbox' && <Inbox />}
            {tab === 'money' && <Money />}
            {tab === 'content' && <Content />}
            {tab === 'review' && <MonthlyReview />}
            {tab === 'profile' && <Profile />}
          </main>
        </div>
      )}
    </StoreProvider>
  );
}