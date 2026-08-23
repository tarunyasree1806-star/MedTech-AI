import React from 'react';
import type { Doctor } from '../types';
import { Stethoscope, Bone, LogOut, Activity, User, ChevronRight, Hospital } from 'lucide-react';

export type ActiveTab = 'oa-analyzer' | 'implant-recommendation';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  doctor: Doctor;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  doctor,
  onLogout,
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 font-sans shadow-sm z-20">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-blue-50/50 to-white">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight tracking-tight">
              MediTech AI
            </h1>
            <p className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">
              Ortho Intelligence
            </p>
          </div>
        </div>

        {/* Control Panel Section Header */}
        <div className="px-5 pt-6 pb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Control Panel Partition
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('oa-analyzer')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'oa-analyzer'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity className={`w-4 h-4 ${activeTab === 'oa-analyzer' ? 'text-white' : 'text-blue-500'}`} />
              <span>OA Analyzer</span>
            </div>
            {activeTab === 'oa-analyzer' && <ChevronRight className="w-4 h-4 text-white/80" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('implant-recommendation')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'implant-recommendation'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bone className={`w-4 h-4 ${activeTab === 'implant-recommendation' ? 'text-white' : 'text-blue-500'}`} />
              <span>Implant Size Recommendation</span>
            </div>
            {activeTab === 'implant-recommendation' && <ChevronRight className="w-4 h-4 text-white/80" />}
          </button>
        </nav>
      </div>

      {/* Doctor Profile & Sign Out Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60">
        <div className="p-3 bg-white border border-slate-200/80 rounded-xl mb-3 shadow-xs">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">{doctor.name}</p>
              <p className="text-[10px] text-blue-600 font-medium truncate flex items-center gap-1">
                <Hospital className="w-3 h-3 text-slate-400 shrink-0" />
                {doctor.role}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 truncate pl-0.5">
            ID: <span className="font-mono text-slate-600">{doctor.username}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold rounded-lg text-xs transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );
};
