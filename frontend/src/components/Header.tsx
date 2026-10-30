import React from 'react';
import type { Doctor, WorkflowStage, CaseRecord } from '../types';

interface HeaderProps {
  doctor: Doctor;
  activeStage: WorkflowStage;
  currentCase: CaseRecord | null;
  backendOnline?: boolean;
  onNavigateStage: (stage: WorkflowStage) => void;
}

const STAGE_STEPS: Array<{ stage: WorkflowStage; label: string }> = [
  { stage: 'upload', label: '1. Ingest' },
  { stage: 'imaging', label: '2. Viewer' },
  { stage: 'segmentation', label: '3. Seg' },
  { stage: 'measurements', label: '4. Extents' },
  { stage: 'meniscus', label: '5. Meniscus' },
  { stage: 'oa-assessment', label: '6. OA' },
  { stage: 'implant-planning', label: '7. Sizing' },
  { stage: 'final-report', label: '8. Report' },
];

export const Header: React.FC<HeaderProps> = ({
  doctor,
  activeStage,
  currentCase,
  onNavigateStage,
}) => {
  const getStageTitle = (stage: WorkflowStage) => {
    switch (stage) {
      case 'overview':
        return 'Overview Dashboard';
      case 'upload':
        return 'New Analysis & Ingestion';
      case 'imaging':
        return 'Imaging Workspace';
      case 'segmentation':
        return 'Multi-Compartment Segmentation';
      case 'measurements':
        return 'Anatomical Measurements';
      case 'meniscus':
        return 'Medial Meniscus Morphometry';
      case 'oa-assessment':
        return 'Osteoarthritis Risk Assessment';
      case 'implant-planning':
        return 'Patient-Specific Implant Planning';
      case 'final-report':
        return 'Comprehensive Clinical Report';
      default:
        return 'Clinical Workspace';
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 select-none">
      {/* Title & Stage Name */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              {getStageTitle(activeStage)}
            </h2>
            <span className="text-[10px] font-semibold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
              Workstation Stage
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {currentCase
              ? `Case: ${currentCase.case_id} • ${currentCase.patient_name} • ${currentCase.age}Y (${currentCase.gender}) • BMI ${currentCase.bmi} kg/m²`
              : 'Select or upload a patient MRI case to begin analysis'}
          </p>
        </div>
      </div>

      {/* Stepper / Stage Flow Pills (Desktop) */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-[11px] font-semibold">
        {STAGE_STEPS.map((step) => {
          const isActive = activeStage === step.stage;

          return (
            <button
              key={step.stage}
              type="button"
              onClick={() => onNavigateStage(step.stage)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Doctor Profile Badge */}
      <div className="flex items-center gap-3 text-xs">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium">
          <span className="text-slate-500">Dr.</span>
          <strong className="font-semibold text-slate-900">{doctor.name.replace('Dr. ', '')}</strong>
        </div>
      </div>
    </header>
  );
};
