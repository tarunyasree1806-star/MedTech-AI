import React from 'react';
import type { CaseRecord } from '../../types';
import {
  Activity,
  AlertTriangle,
  BarChart2,
} from 'lucide-react';

interface MeniscusViewProps {
  currentCase: CaseRecord | null;
}

export const MeniscusView: React.FC<MeniscusViewProps> = ({ currentCase }) => {

  if (!currentCase) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-base font-semibold">No active patient case loaded.</p>
      </div>
    );
  }

  const isXray =
    (currentCase.modality === '2D_XRAY' || currentCase.status === 'MODALITY_MISMATCH') &&
    !currentCase.meniscus_analysis;
  const meniscus = currentCase.meniscus_analysis;
  const th3d = meniscus?.thickness_3d;
  const singleAxis = meniscus?.single_axis_thickness;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Medial Meniscus 3D Morphometry & Thickness Analysis
          </h1>
          <p className="text-xs text-slate-500">
            Quantitative volumetric assessment and continuous 3D Euclidean distance transform thickness distribution.
          </p>
        </div>

        <div className="bg-purple-50/70 border border-purple-200 p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-purple-600 text-white rounded-lg">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
              Medial Meniscus Volume
            </span>
            <span className="text-lg font-black text-purple-950 font-mono">
              {meniscus ? `${meniscus.volume_mm3.toLocaleString()} mm³` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {isXray ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-amber-900">Meniscus Analysis Unavailable for 2D Radiograph</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
            The medial meniscus is radiolucent soft fibrocartilaginous tissue that cannot be segmented or measured in 3D from conventional 2D X-ray projections. Volumetric 3D MRI with cartilage-sensitive sequences is strictly required.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 3D Local Thickness Four Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Minimum 3D Thickness
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {th3d?.min_mm.toFixed(2)} mm
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Peripheral rim boundary</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/30 shadow-xs">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                Mean 3D Thickness
              </span>
              <div className="text-2xl font-black text-purple-950 font-mono mt-1">
                {th3d?.mean_mm.toFixed(2)} mm
              </div>
              <span className="text-[10px] text-purple-600 font-medium">Volumetric average</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Median 3D Thickness
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {th3d?.median_mm.toFixed(2)} mm
              </div>
              <span className="text-[10px] text-slate-400 font-medium">50th percentile robust</span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Maximum 3D Thickness
              </span>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1">
                {th3d?.max_mm.toFixed(2)} mm
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Central wedge body</span>
            </div>
          </div>

          {/* Distribution Percentiles Table & Visual Meter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Percentile Distribution (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Continuous 3D Local Thickness Distribution
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {meniscus?.voxel_count.toLocaleString()} Voxels Evaluated
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">Percentile</th>
                      <th className="px-4 py-2.5">Local Thickness (mm)</th>
                      <th className="px-4 py-2.5">Distribution Visualization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {th3d?.percentiles.map((p, idx) => {
                      const maxVal = th3d.max_mm || 6.16;
                      const pct = Math.min(100, Math.round((p.value_mm / maxVal) * 100));

                      return (
                        <tr key={idx} className="hover:bg-purple-50/20 transition-colors">
                          <td className="px-4 py-2.5 font-bold text-slate-800">{p.percentile}</td>
                          <td className="px-4 py-2.5 font-mono font-bold text-purple-950 text-sm">
                            {p.value_mm.toFixed(2)} mm
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
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

            {/* Separate Single-Axis Z-Span Comparison (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Algorithm Separation: Single-Axis Span
                </h3>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Z-Axis Method
                </span>
              </div>

              <p className="text-xs text-slate-500 leading-normal">
                To prevent algorithmic confusion, the earlier coordinate-span measurement is kept strictly separate from the 3D distance-transform profile:
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Z-Axis Minimum</span>
                  <span className="font-bold text-slate-800">{singleAxis?.min_mm.toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Z-Axis Mean</span>
                  <span className="font-bold text-slate-800">{singleAxis?.mean_mm.toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Z-Axis Median</span>
                  <span className="font-bold text-slate-800">{singleAxis?.median_mm.toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between py-2 font-mono">
                  <span className="text-slate-500">Z-Axis Maximum Span</span>
                  <span className="font-bold text-slate-800">{singleAxis?.max_mm.toFixed(2)} mm</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                <strong>Why values differ:</strong> Single-axis span measures the full bounding extent across slice indices ((Z_max - Z_min + 1) × sz), which includes curvature slope. In contrast, 3D sphere-fitting computes the true orthogonal local thickness.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
