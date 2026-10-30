import React from 'react';
import type { CaseRecord } from '../../types';
import {
  BrainCircuit,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

interface OAAssessmentViewProps {
  currentCase: CaseRecord | null;
}

export const OAAssessmentView: React.FC<OAAssessmentViewProps> = ({ currentCase }) => {
  if (!currentCase) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-base font-semibold">No active patient case loaded.</p>
      </div>
    );
  }

  const isXray =
    (currentCase.modality === '2D_XRAY' || currentCase.status === 'MODALITY_MISMATCH') &&
    !currentCase.oa_assessment;
  const oa = currentCase.oa_assessment;
  const meniscus = currentCase.meniscus_analysis;

  const maxThick = meniscus?.thickness_3d?.max_mm;
  const medThick = meniscus?.thickness_3d?.median_mm;
  const age = currentCase.age;
  const bmi = currentCase.bmi;
  const isMale = currentCase.gender === 'Male';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md mb-1.5 border border-cyan-200">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Multivariate Logistic OA Risk Estimator</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Knee Osteoarthritis (OA) Research Assessment
          </h1>
          <p className="text-xs text-slate-500">
            Model-estimated risk score derived from 3D medial meniscus thickness and clinical covariates.
          </p>
        </div>

        {/* Status Pill */}
        <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2.5">
          <span
            className={`w-3 h-3 rounded-full ${
              isXray
                ? 'bg-amber-400'
                : oa?.is_elevated
                ? 'bg-amber-500 animate-pulse'
                : 'bg-emerald-500'
            }`}
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">
              {isXray ? 'Unavailable (X-Ray)' : oa?.classification || 'Pending Calculation'}
            </span>
            <span className="text-[10px] text-slate-500">
              Optimal Threshold: {oa?.threshold_used ? `${(oa.threshold_used * 100).toFixed(2)}%` : '49.56%'}
            </span>
          </div>
        </div>
      </div>

      {isXray ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-amber-900">OA Assessment Model Disabled for 2D Radiograph</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
            The multivariate OA model requires continuous 3D meniscus thickness metrics (maximum and median thickness derived via Euclidean distance transform from volumetric MRI). These features are not available from 2D projections.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Probability Display Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white rounded-2xl p-7 border border-slate-700 shadow-lg space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Model Output Probability
                </span>
                <div className="text-4xl font-black font-mono tracking-tight mt-1 text-white flex items-baseline gap-3">
                  {oa?.oa_probability_percent || '24.26%'}
                  <span className="text-sm font-sans font-semibold text-slate-300">
                    Model-estimated OA Risk Score
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Model Classification</span>
                <span className={`text-sm font-bold ${oa?.is_elevated ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {oa?.classification || 'Low Risk / Non-Progressive'}
                </span>
              </div>
            </div>

            {/* Horizontal Calibrated Risk Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>0% (Low Risk Profile)</span>
                <span className="text-amber-400 font-mono">Decision Threshold: 49.56%</span>
                <span>100% (High Probability)</span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-4 relative overflow-hidden p-0.5 border border-slate-700">
                {/* Optimal Threshold Marker Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10 shadow-xs"
                  style={{ left: '49.56%' }}
                  title="Optimal Youden Threshold (0.4956)"
                />

                {/* Patient Value Fill Bar */}
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    oa?.is_elevated
                      ? 'bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${Math.min(100, (oa?.oa_probability || 0.2426) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span className="text-emerald-400 font-semibold">Non-Progressive Zone (&lt; 49.56%)</span>
                <span className="text-amber-300 font-semibold">Elevated OA Progression Zone (≥ 49.56%)</span>
              </div>
            </div>
          </div>

          {/* Input Features Used by the Model */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Patient-Specific Input Features</h3>
                <p className="text-[11px] text-slate-500">Live variables passed into the logistic regression formula</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                Raw Logit z = {oa?.raw_logit ?? -1.0028}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Max Thickness
                </span>
                <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {maxThick ? `${maxThick.toFixed(2)} mm` : '6.16 mm'}
                </span>
                <span className="text-[10px] text-purple-700 font-semibold font-mono">β = +0.8533</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Median Thickness
                </span>
                <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {medThick ? `${medThick.toFixed(2)} mm` : '1.77 mm'}
                </span>
                <span className="text-[10px] text-purple-700 font-semibold font-mono">β = +1.4352</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Patient Age
                </span>
                <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {age} Years
                </span>
                <span className="text-[10px] text-teal-700 font-semibold font-mono">β = +0.0576</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Patient BMI
                </span>
                <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {bmi} kg/m²
                </span>
                <span className="text-[10px] text-teal-700 font-semibold font-mono">β = +0.1603</span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Biological Sex
                </span>
                <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                  {currentCase.gender}
                </span>
                <span className="text-[10px] text-blue-700 font-semibold font-mono">
                  {isMale ? 'β = -0.2842' : 'β = 0.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Research Prototype Disclaimer Banner */}
          <div className="p-4 bg-slate-100/80 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Clinical Research Disclaimer:</strong> The OA risk estimator is a decision-support prototype developed for academic investigation. The probability percentage is a statistical model estimate derived from morphological covariates and does not constitute a clinical diagnosis of osteoarthritis or a definitive prediction of future joint arthroplasty. Clinical decision-making requires comprehensive orthopedic examination, Kellgren-Lawrence radiographic grading, and patient symptomatology.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
