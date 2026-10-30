import React from 'react';
import type { CaseRecord, CaseSummaryItem, WorkflowStage } from '../../types';
import {
  BrainCircuit,
  Activity,
  Layers,
  Bone,
  ArrowRight,
  FolderPlus,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface OverviewViewProps {
  currentCase: CaseRecord | null;
  casesList: CaseSummaryItem[];
  onSelectCase: (caseId: string) => void;
  onNavigate: (stage: WorkflowStage) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currentCase,
  casesList,
  onSelectCase,
  onNavigate,
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Hero Banner with Medical Clinical Aesthetic */}
      <div className="bg-gradient-to-br from-white via-white to-teal-50/40 rounded-2xl p-8 border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI-Assisted Orthopedic Decision-Support Platform</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Automated Quantitative Knee MRI Analysis for Medial Meniscus Morphometry, Osteoarthritis Assessment, and Patient-Specific Implant Sizing
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            A validated clinical research platform utilizing high-resolution 3D nnU-Net deep segmentation,
            Euclidean distance transform 3D local meniscus thickness profiling, multivariate logistic OA risk estimation,
            and automated femoral/tibial anatomical matching for patient-specific implant sizing.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('upload')}
              className="px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Start New Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {currentCase && (
              <button
                type="button"
                onClick={() => onNavigate('imaging')}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Continue Active Case ({currentCase.case_id})</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Benchmark Badges / Clinical Core Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Segmentation Benchmark
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">91.18%</div>
            <span className="text-[11px] text-teal-700 font-medium">Mean Dice on Dataset500</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              OA Model AUC
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">0.7601</div>
            <span className="text-[11px] text-cyan-700 font-medium">Sensitivity: 68.9% | Spec: 69.6%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center">
            <BrainCircuit className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Meniscus 3D Thickness
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">0.62–6.16 mm</div>
            <span className="text-[11px] text-purple-700 font-medium">Euclidean Distance Transform</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Anatomical Sizing
            </span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-1">Sizes S–XL</div>
            <span className="text-[11px] text-blue-700 font-medium">Bicompartmental Cut Matching</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
            <Bone className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analysis Pipeline Steps Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Supported AI Imaging Pipeline</h2>
            <p className="text-xs text-slate-500">
              Six sequential computational phases performed on high-resolution knee MRI acquisitions.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
            Pipeline v2.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              step: '01',
              title: 'MRI Volume Upload',
              desc: 'Volumetric NIfTI (.nii, .nii.gz) or DICOM series orientation & voxel calibration.',
            },
            {
              step: '02',
              title: 'nnU-Net Segmentation',
              desc: 'Automated 9-structure identification: cartilage, menisci, femur, and tibia.',
            },
            {
              step: '03',
              title: 'Physical Extents',
              desc: 'Voxel-spacing-aware spatial span (0.3125×0.3125×0.8001 mm) & volume in mm³.',
            },
            {
              step: '04',
              title: '3D Meniscus Profiling',
              desc: 'Local thickness derived via 3D sphere-fitting Euclidean distance transform.',
            },
            {
              step: '05',
              title: 'OA Risk Estimation',
              desc: 'Multivariate logistic regression evaluating meniscal thickness, age, BMI, sex.',
            },
            {
              step: '06',
              title: 'Implant Matching',
              desc: 'Femoral & tibial cut surface mismatch minimization against component catalog.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {item.step}
                </span>
                <h3 className="font-bold text-xs text-slate-900 mt-2">{item.title}</h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Cases Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Session Patient Cases</h2>
              <p className="text-xs text-slate-500">
                In-memory clinical analyses recorded in this research session.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Upload New Patient</span>
          </button>
        </div>

        {casesList.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No Patient Cases Uploaded Yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create a new patient analysis to ingest volumetric knee MRI data and compute automated morphometry.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('upload')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs"
            >
              Create First Analysis
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Case ID</th>
                  <th className="px-4 py-3">Patient Name</th>
                  <th className="px-4 py-3">Demographics</th>
                  <th className="px-4 py-3">Modality</th>
                  <th className="px-4 py-3">OA Probability</th>
                  <th className="px-4 py-3">Recommended Implant</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {casesList.map((c) => {
                  const isCurrent = currentCase?.case_id === c.case_id;
                  const isMismatch =
                    (c.modality === '2D_XRAY' || c.status === 'MODALITY_MISMATCH') &&
                    c.status !== 'COMPLETED';

                  return (
                    <tr
                      key={c.case_id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isCurrent ? 'bg-cyan-50/50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        {c.case_id}
                        {isCurrent && (
                          <span className="ml-2 text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded font-sans font-bold">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-semibold">
                        {c.patient_name || 'Anonymous Patient'}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {c.age ? `${c.age} yrs` : '—'} • {c.gender || '—'} • BMI {c.bmi || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.modality === '2D_XRAY'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-teal-50 text-teal-800 border border-teal-200'
                          }`}
                        >
                          {c.modality === '2D_XRAY' ? (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              2D X-Ray (Guardrail)
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-teal-600" />
                              3D MRI Volumetric
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">
                        {isMismatch ? 'N/A (MRI Required)' : c.oa_probability || 'Pending'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {isMismatch ? 'N/A' : c.recommended_implant || 'Size L'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isMismatch
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isMismatch ? 'Modality Mismatch' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCase(c.case_id);
                            onNavigate('imaging');
                          }}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded text-[11px] font-semibold text-slate-700 transition-colors"
                        >
                          Open Workspace
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCase(c.case_id);
                            onNavigate('final-report');
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-semibold text-slate-800 transition-colors"
                        >
                          Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modality Disclaimer Note */}
      <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <p>
          <strong>Scientific & Regulatory Guardrail:</strong> This software is a clinical decision-support and research platform developed for faculty reviews and research demonstration. It maintains strict modality verification: 3D nnU-Net segmentation and 3D meniscus thickness calculation strictly require volumetric 3D MRI scans. Conventional 2D radiographs (X-rays) are automatically detected and prevented from being passed to MRI-only pipelines to prevent inaccurate or fabricated diagnostic measurements.
        </p>
      </div>
    </div>
  );
};
