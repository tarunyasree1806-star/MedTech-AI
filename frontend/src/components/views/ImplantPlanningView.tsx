import React from 'react';
import type { CaseRecord } from '../../types';
import {
  Bone,
  Ruler,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ImplantPlanningViewProps {
  currentCase: CaseRecord | null;
}

export const ImplantPlanningView: React.FC<ImplantPlanningViewProps> = ({ currentCase }) => {
  if (!currentCase) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-base font-semibold">No active patient case loaded.</p>
      </div>
    );
  }

  const isXray =
    (currentCase.modality === '2D_XRAY' || currentCase.status === 'MODALITY_MISMATCH') &&
    !currentCase.implant_planning;
  const implantData = currentCase.implant_planning;
  const matches = implantData?.matches || [];
  const dims = implantData?.patient_dimensions || {
    femoral_x: 62.50,
    femoral_y: 95.63,
    tibial_x: 58.12,
    tibial_y: 66.25,
  };
  const bestMatch = matches.find((m) => m.is_best) || matches[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md mb-1.5 border border-blue-200">
            <Bone className="w-3.5 h-3.5" />
            <span>Database-Based Anatomical Sizing Engine</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Patient-Specific Knee Implant Component Matching
          </h1>
          <p className="text-xs text-slate-500">
            Minimizes combined femoral and tibial dimensional error across standardized prototype prosthetic geometries.
          </p>
        </div>

        {/* Selected Best Match Pill */}
        {bestMatch && !isXray && (
          <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">
                Rank #1 Recommendation
              </span>
              <span className="text-base font-black text-slate-900 font-mono">
                {bestMatch.implant} ({bestMatch.total_error} mm Error)
              </span>
            </div>
          </div>
        )}
      </div>

      {isXray ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-amber-900">Implant Matching Disabled for 2D Radiograph</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
            Component sizing matching requires calibrated 3D orthogonal mediolateral (X) and anteroposterior (Y) bounding spans from volumetric MRI segmentations. Planar 2D radiographs cannot provide calibrated 3D cut-surface dimensions without magnifications errors.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Patient Anatomical Spans Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Patient Femoral Span
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                  X = {dims.femoral_x.toFixed(2)} mm <span className="text-slate-300">|</span> Y = {dims.femoral_y.toFixed(2)} mm
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mediolateral (X) & Anteroposterior (Y) femoral condylar dimensions
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Patient Tibial Span
                </span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                  X = {dims.tibial_x.toFixed(2)} mm <span className="text-slate-300">|</span> Y = {dims.tibial_y.toFixed(2)} mm
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mediolateral (X) & Anteroposterior (Y) tibial plateau dimensions
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Sizing Ranking Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Prototype Component Sizing Catalog & Mismatch Error Ranking
                </h3>
                <p className="text-xs text-slate-500">
                  Total Error = |Femoral_X - P_X| + |Femoral_Y - P_Y| + |Tibial_X - P_X| + |Tibial_Y - P_Y|
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                4 Sizes Evaluated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/60 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Rank</th>
                    <th className="px-5 py-3">Component Size</th>
                    <th className="px-5 py-3 text-right">Femoral Specs (X × Y)</th>
                    <th className="px-5 py-3 text-right">Tibial Specs (X × Y)</th>
                    <th className="px-5 py-3 text-right">Femoral Mismatch</th>
                    <th className="px-5 py-3 text-right">Tibial Mismatch</th>
                    <th className="px-5 py-3 text-right">Total Mismatch Error</th>
                    <th className="px-5 py-3 text-center">Fit Visualizer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {matches.map((item) => {
                    // Maximum possible error scale for visualization (e.g. 50 mm)
                    const errorPct = Math.min(100, Math.round((item.total_error / 50) * 100));

                    return (
                      <tr
                        key={item.implant}
                        className={`transition-colors ${
                          item.is_best ? 'bg-blue-50/40 font-bold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="px-5 py-3 font-mono">
                          {item.is_best ? (
                            <span className="inline-flex items-center gap-1 text-blue-700 font-black">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              {item.rank}
                            </span>
                          ) : (
                            <span className="text-slate-500">{item.rank}</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-slate-900 font-bold">
                          {item.implant}
                          {item.is_best && (
                            <span className="ml-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-sans font-bold">
                              Best Fit
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-slate-600">
                          {item.femoral_x} × {item.femoral_y} mm
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-slate-600">
                          {item.tibial_x} × {item.tibial_y} mm
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-slate-700">
                          {item.femoral_error.toFixed(2)} mm
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-slate-700">
                          {item.tibial_error.toFixed(2)} mm
                        </td>
                        <td className="px-5 py-3 text-right font-mono font-extrabold text-sm">
                          <span className={item.is_best ? 'text-blue-900' : 'text-slate-800'}>
                            {item.total_error.toFixed(2)} mm
                          </span>
                        </td>
                        <td className="px-5 py-3 w-40">
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.is_best ? 'bg-blue-600' : 'bg-slate-400'
                              }`}
                              style={{ width: `${errorPct}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Explanation & Rationale Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Selection Rationale & Error Analysis</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {implantData?.rationale ||
                'The first-ranked component minimizes combined multiplanar dimensional mismatch across both femoral and tibial cut surfaces.'}
            </p>
          </div>

          {/* Research Guardrail Disclaimer */}
          <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Academic Sizing Notice:</strong> This algorithm implements database-based geometric matching against standardized research component dimensions (Sizes S, M, L, XL). It does not represent an AI-predicted surgical implant recommendation or proprietary medical device manufacturer guidelines. Final intraoperative implant sizing requires orthopedic surgical templating, ligamentous balancing, and clinical surgeon judgment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
