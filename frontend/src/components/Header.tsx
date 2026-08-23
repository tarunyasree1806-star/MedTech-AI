import React from 'react';
import type { Doctor } from '../types';
import { Calendar, Stethoscope } from 'lucide-react';

interface HeaderProps {
  doctor: Doctor;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ doctor, activeTabTitle }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
          <Stethoscope className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {activeTabTitle}
            <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              Clinical Workspace
            </span>
          </h2>
          <p className="text-[11px] text-slate-500">
            MediTech Osteoarthritis Prediction & Bone Dimension Analytics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="hidden sm:flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-blue-500" />
          <span>{currentDate}</span>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px]">Logged in as: <strong className="font-semibold text-emerald-950">{doctor.name}</strong></span>
        </div>
      </div>
    </header>
  );
};
