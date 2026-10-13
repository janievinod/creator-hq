import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Collaborations from './pages/Collaborations';
import BrandsWorkedWith from './pages/BrandsWorkedWith';
import Inbox from './pages/Inbox';
import Money from './pages/Money';
import Content from './pages/Content';
import MonthlyReview from './pages/MonthlyReview';
import Profile from './pages/Profile';
import { StoreProvider } from './context/store';

export default function App() {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      document.body.style.setProperty('--mouse-x', `${xPercent}%`);
      document.body.style.setProperty('--mouse-y', `${yPercent}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <StoreProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-transparent relative overflow-hidden">
          <div className="fixed top-[-100px] left-[-100px] w-96 h-96 bg-purple-600/30 rounded-full anime-glow-orb pointer-events-none" />
          <div className="fixed bottom-[-100px] right-[-100px] w-96 h-96 bg-pink-600/30 rounded-full anime-glow-orb pointer-events-none" style={{ animationDelay: '4s' }} />

          <Sidebar />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collaborations" element={<Collaborations />} />
              <Route path="/brands" element={<BrandsWorkedWith />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/money" element={<Money />} />
              <Route path="/content" element={<Content />} />
              <Route path="/review" element={<MonthlyReview />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}