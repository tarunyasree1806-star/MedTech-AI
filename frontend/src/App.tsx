import { useState } from 'react';
import type { Doctor } from './types';
import { INITIAL_DOCTORS } from './data/initialData';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import type { ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OAAnalyzer } from './components/OAAnalyzer';
import { ImplantRecommendation } from './components/ImplantRecommendation';

export function App() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(INITIAL_DOCTORS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('oa-analyzer');

  const handleLogin = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
  };

  const handleSignUp = (newDoctor: Doctor) => {
    setDoctors((prev) => [...prev, newDoctor]);
  };

  const handleLogout = () => {
    setCurrentDoctor(null);
  };

  if (!currentDoctor) {
    return (
      <Login
        doctors={doctors}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        doctor={currentDoctor}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header
          doctor={currentDoctor}
          activeTabTitle={
            activeTab === 'oa-analyzer'
              ? 'OA Analyzer'
              : 'Implant Size Recommendation'
          }
        />

        <main className="flex-1 bg-slate-50 pb-12">
          {activeTab === 'oa-analyzer' ? (
            <OAAnalyzer />
          ) : (
            <ImplantRecommendation />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
