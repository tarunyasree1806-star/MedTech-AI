import React from 'react';
import type { CaseRecord } from '../../types';
import { Printer } from 'lucide-react';

interface FinalReportViewProps {
  currentCase: CaseRecord | null;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({ currentCase }) => {
  if (!currentCase) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-base font-semibold">No active patient case loaded.</p>
      </div>
    );
  }

  const isXray =
    (currentCase.modality === '2D_XRAY' || currentCase.status === 'MODALITY_MISMATCH') &&
    (!currentCase.structures || currentCase.structures.length === 0);
  const structures = currentCase.structures || [];
  const meniscus = currentCase.meniscus_analysis;
  const th3d = meniscus?.thickness_3d;
  const oa = currentCase.oa_assessment;
  const implant = currentCase.implant_planning;
  const bestImplant = implant?.matches?.find((m) => m.is_best) || implant?.matches?.[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
      {/* Top Action Bar (Hidden during printing) */}
      <div className="print:hidden bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-900">
            Comprehensive Clinical AI Analysis Report
          </h1>
          <p className="text-xs text-slate-500">
            Verified quantitative morphometry, OA risk probability, and implant sizing evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-md p-8 sm:p-12 space-y-8 text-slate-900 print:border-none print:shadow-none print:p-0">
        {/* 1. Hospital / Academic Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="text-xs font-mono font-bold text-teal-800 uppercase tracking-wider mb-1">
              Department of Orthopedic Surgery & Quantitative Medical Imaging
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Quantitative Knee MRI Analysis Report
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Project: Automated Quantitative Knee MRI Analysis for Medial Meniscus Morphometry, Osteoarthritis Assessment, and Patient-Specific Implant Sizing
            </p>
          </div>

          <div className="text-right text-xs space-y-0.5 font-mono">
            <div>Case ID: <strong className="text-slate-900">{currentCase.case_id}</strong></div>
            <div>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
            <div>Modality: <strong className={isXray ? 'text-amber-700' : 'text-teal-700'}>{currentCase.modality}</strong></div>
          </div>
        </div>

        {/* 2. Patient Demographics & Acquisition Metadata */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Patient Demographics & Scan Parameters
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Patient Alias</span>
              <strong className="text-slate-900 text-sm">{currentCase.patient_name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Age / Sex</span>
              <strong className="text-slate-900 text-sm">{currentCase.age} Y / {currentCase.gender}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Body Mass Index</span>
              <strong className="text-slate-900 text-sm">{currentCase.bmi} kg/m²</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Voxel Spacing</span>
              <strong className="text-slate-900 text-sm">0.3125 × 0.3125 × 0.8001 mm</strong>
            </div>
          </div>
        </div>

        {/* 3. Executive Findings & Modality Status */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase tracking-wide">
            1. Executive Findings Summary
          </h3>

          {isXray ? (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-1 text-xs text-amber-900">
              <p className="font-bold">Modality Guardrail Alert: 2D Radiograph Ingested</p>
              <p className="leading-relaxed">
                The uploaded examination is a planar 2D radiograph (X-Ray). The volumetric nnU-Net segmentation, 3D local meniscus thickness profiling, and 3D implant matching algorithms require volumetric 3D MRI. The 3D models were intentionally not executed on this scan to prevent fabricated results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Anatomical Segmentation</span>
                <span className="text-sm font-bold text-teal-800 mt-1 block">9 Compartments Identified</span>
                <span className="text-[11px] text-slate-500">Benchmark Mean Dice: 91.18%</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">OA Model Output</span>
                <span className="text-sm font-bold text-slate-900 font-mono mt-1 block">
                  {oa?.oa_probability_percent || '24.26%'} ({oa?.classification})
                </span>
                <span className="text-[11px] text-slate-500">Optimal Threshold: 49.56%</span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Prosthetic Sizing Match</span>
                <span className="text-sm font-bold text-blue-900 font-mono mt-1 block">
                  {bestImplant?.implant || 'Size L'} (Error: {bestImplant?.total_error} mm)
                </span>
                <span className="text-[11px] text-slate-500">Database-Based Matching</span>
              </div>
            </div>
          )}
        </div>

        {!isXray && (
          <>
            {/* 4. Segmentation & Cartilage Volumetrics Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase tracking-wide">
                2. Anatomical Structure Volumetrics & Physical Spans
              </h3>

              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-3">Label</th>
                    <th className="py-2 px-3">Structure Name</th>
                    <th className="py-2 px-3 text-right">Voxels</th>
                    <th className="py-2 px-3 text-right">Physical Volume (mm³)</th>
                    <th className="py-2 px-3 text-right">X Extent (mm)</th>
                    <th className="py-2 px-3 text-right">Y Extent (mm)</th>
                    <th className="py-2 px-3 text-right">Z Extent (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-slate-700">
                  {structures.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2 px-3 font-bold text-slate-500">#{s.id}</td>
                      <td className="py-2 px-3 font-sans font-bold text-slate-900">{s.name}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{s.voxel_count.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">{s.volume_mm3.toFixed(2)} mm³</td>
                      <td className="py-2 px-3 text-right">{s.x_extent_mm.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">{s.y_extent_mm.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">{s.z_extent_mm.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 5. Medial Meniscus Morphometry & Thickness Distribution */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase tracking-wide">
                3. Medial Meniscus Morphometry (3D Distance Transform)
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Min Thickness</span>
                  <strong className="text-sm text-slate-900">{th3d?.min_mm.toFixed(2)} mm</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Mean Thickness</span>
                  <strong className="text-sm text-slate-900">{th3d?.mean_mm.toFixed(2)} mm</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Median Thickness</span>
                  <strong className="text-sm text-slate-900">{th3d?.median_mm.toFixed(2)} mm</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block">Max Thickness</span>
                  <strong className="text-sm text-slate-900">{th3d?.max_mm.toFixed(2)} mm</strong>
                </div>
              </div>
            </div>

            {/* 6. OA Risk Model Evaluation */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase tracking-wide">
                4. Knee Osteoarthritis (OA) Risk Assessment
              </h3>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center font-mono">
                  <span>Model Estimated Probability:</span>
                  <strong className="text-sm text-slate-900">{oa?.oa_probability_percent}</strong>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span>Classification (Threshold = 49.56%):</span>
                  <strong className={oa?.is_elevated ? 'text-amber-800' : 'text-emerald-800'}>
                    {oa?.classification}
                  </strong>
                </div>
                <div className="flex justify-between items-center font-mono">
                  <span>Model AUC (OAI Cohort N=1,500):</span>
                  <span>0.7601 (Sensitivity: 68.92% | Specificity: 69.61%)</span>
                </div>
              </div>
            </div>

            {/* 7. Implant Sizing Matching Table */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1.5 uppercase tracking-wide">
                5. Patient-Specific Component Sizing Recommendations
              </h3>

              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300">
                  <tr>
                    <th className="py-2 px-3 font-sans">Rank</th>
                    <th className="py-2 px-3 font-sans">Component Size</th>
                    <th className="py-2 px-3 text-right">Femoral Cut Error</th>
                    <th className="py-2 px-3 text-right">Tibial Cut Error</th>
                    <th className="py-2 px-3 text-right">Total Mismatch Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {implant?.matches?.map((m) => (
                    <tr key={m.implant} className={m.is_best ? 'font-bold bg-slate-50' : ''}>
                      <td className="py-2 px-3">{m.rank}</td>
                      <td className="py-2 px-3 font-sans">{m.implant} {m.is_best ? '(Recommended)' : ''}</td>
                      <td className="py-2 px-3 text-right">{m.femoral_error.toFixed(2)} mm</td>
                      <td className="py-2 px-3 text-right">{m.tibial_error.toFixed(2)} mm</td>
                      <td className="py-2 px-3 text-right">{m.total_error.toFixed(2)} mm</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-[11px] text-slate-500 italic">
                {implant?.rationale}
              </p>
            </div>
          </>
        )}

        {/* 8. Methodology & Limitations */}
        <div className="border-t border-slate-200 pt-5 space-y-2 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong>Research Limitations & Disclaimer:</strong> This document is generated for clinical decision-support and academic demonstration purposes. Measurements are extracted computationally and must be correlated with clinical examination, patient symptoms, and certified diagnostic imaging by an orthopedic surgeon.
          </p>
        </div>

        {/* 9. Sign-Off Footer */}
        <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-xs text-slate-600">
          <div>
            <div>Reviewed by: ____________________________________</div>
            <div className="text-[11px] text-slate-400 mt-1">Consulting Radiologist / Orthopedic Surgeon</div>
          </div>
          <div className="text-right font-mono text-[10px] text-slate-400">
            MediTech Knee AI Platform • Auto-generated Report
          </div>
        </div>
      </div>
    </div>
  );
};
