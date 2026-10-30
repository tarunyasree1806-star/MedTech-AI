import React from 'react';
import type { Doctor, WorkflowStage, CaseRecord } from '../types';
import {
  LayoutDashboard,
  FolderPlus,
  Scan,
  Layers,
  Ruler,
  Activity,
  BrainCircuit,
  Bone,
  FileText,
  LogOut,
  User,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';

interface SidebarProps {
  activeStage: WorkflowStage;
  setActiveStage: (stage: WorkflowStage) => void;
  doctor: Doctor;
  onLogout: () => void;
  currentCase: CaseRecord | null;
}

interface NavItem {
  stage: WorkflowStage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category?: string;
}

const NAV_ITEMS: NavItem[] = [
  { stage: 'overview', label: 'Overview', icon: LayoutDashboard },
  { stage: 'upload', label: 'New Analysis', icon: FolderPlus },
  { stage: 'imaging', label: 'Imaging Workspace', icon: Scan },
  { stage: 'segmentation', label: 'Segmentation', icon: Layers },
  { stage: 'measurements', label: 'Anatomical Measurements', icon: Ruler },
  { stage: 'meniscus', label: 'Meniscus Analysis', icon: Activity },
  { stage: 'oa-assessment', label: 'OA Assessment', icon: BrainCircuit },
  { stage: 'implant-planning', label: 'Implant Planning', icon: Bone },
  { stage: 'final-report', label: 'Final Report', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeStage,
  setActiveStage,
  doctor,
  onLogout,
  currentCase,
}) => {
  const isXray =
    (currentCase?.modality === '2D_XRAY' || currentCase?.status === 'MODALITY_MISMATCH') &&
    (!currentCase?.structures || currentCase.structures.length === 0);

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 h-screen sticky top-0 font-sans shadow-xl z-20 select-none">
      <div className="flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl text-white shadow-md shadow-teal-950/30">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm tracking-tight leading-tight">
              MediTech AI
            </h1>
            <p className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">
              Knee MRI Workstation
            </p>
          </div>
        </div>

        {/* Current Case Badge Card */}
        <div className="p-3 mx-3 mt-4 mb-2 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Active Case
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                isXray
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-teal-950 text-teal-300 border border-teal-800'
              }`}
            >
              {currentCase ? currentCase.modality : 'No Case'}
            </span>
          </div>

          {currentCase ? (
            <div>
              <div className="text-xs font-bold text-white font-mono truncate">
                {currentCase.case_id}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {currentCase.patient_name} • {currentCase.age}Y • {currentCase.gender}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 italic">No case loaded</div>
          )}
        </div>

        {/* Stage Navigation Section */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Analysis Workflow Stages
          </p>
        </div>

        <nav className="px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeStage === item.stage;

            // Highlight disabled stages if X-ray and stage requires 3D MRI
            const isRestrictedForXray =
              isXray && ['segmentation', 'meniscus', 'oa-assessment', 'implant-planning'].includes(item.stage);

            return (
              <button
                key={item.stage}
                type="button"
                onClick={() => setActiveStage(item.stage)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-950/20 font-bold'
                    : isRestrictedForXray
                    ? 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-400'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : isRestrictedForXray ? 'text-amber-500' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-white/90 shrink-0" />
                ) : isRestrictedForXray ? (
                  <span className="text-[9px] bg-amber-950 text-amber-400 px-1 rounded font-mono shrink-0">
                    X-Ray
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Doctor Profile & Sign Out Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80">
        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl mb-2 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-800 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="overflow-hidden text-xs">
            <p className="font-bold text-white truncate leading-tight">{doctor.name}</p>
            <p className="text-[10px] text-teal-400 truncate">{doctor.role}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2 px-3 bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-300 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
