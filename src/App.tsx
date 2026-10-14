import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
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
import { ThemeProvider } from './context/ThemeContext';
import SeasonalMotionBg from './components/ui/SeasonalMotionBg';

function HomeWithNavigation() {
  const navigate = useNavigate();

  const handleNavigate = (tab: string) => {
    if (tab === 'collaborations') navigate('/collaborations');
    else if (tab === 'inbox') navigate('/inbox');
    else if (tab === 'brands') navigate('/brands');
    else if (tab === 'money') navigate('/money');
    else if (tab === 'content') navigate('/content');
    else if (tab === 'review') navigate('/review');
    else if (tab === 'profile') navigate('/profile');
  };

  return <Home onNavigate={handleNavigate} />;
}

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
      <ThemeProvider>
        <BrowserRouter>
          <div className="flex min-h-screen bg-transparent relative overflow-hidden text-white">
            <SeasonalMotionBg />

            <Sidebar />
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative z-10">
              <Routes>
                <Route path="/" element={<HomeWithNavigation />} />
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
      </ThemeProvider>
    </StoreProvider>
  );
}