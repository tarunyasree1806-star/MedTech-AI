import React from 'react';
import type { CaseRecord } from '../../types';
import {
  Ruler,
  Box,
  AlertTriangle,
  Info,
  FileSpreadsheet,
} from 'lucide-react';

interface MeasurementsViewProps {
  currentCase: CaseRecord | null;
}

export const MeasurementsView: React.FC<MeasurementsViewProps> = ({ currentCase }) => {
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
  const spacing = currentCase.voxel_spacing || { x: 0.3125, y: 0.3125, z: 0.8001, unit: 'mm' };
  const voxelVol = currentCase.voxel_volume_mm3 || 0.078131;

  const femur = structures.find((s) => s.id === 7);
  const tibia = structures.find((s) => s.id === 8);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md mb-1.5 border border-teal-200">
            <Ruler className="w-3.5 h-3.5" />
            <span>Quantitative Morphometric Extraction</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Physical Anatomical Dimensions & Volumetrics
          </h1>
          <p className="text-xs text-slate-500">
            Automated extraction of true spatial spans (mm) and volumes (mm³) calibrated by MRI voxel spacing.
          </p>
        </div>

        {/* Voxel Spacing Specification Box */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Voxel Spacing (Physical Resolution)
            </span>
            <span className="text-xs font-mono font-bold text-slate-900">
              {spacing.x.toFixed(4)} × {spacing.y.toFixed(4)} × {spacing.z.toFixed(4)} mm
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              Voxel Volume: {voxelVol.toFixed(6)} mm³
            </span>
          </div>
        </div>
      </div>

      {isXray ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-amber-900">Physical 3D Volumetrics Unavailable for 2D Radiograph</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
            The ingested scan is a 2D radiograph. Accurate physical volume extraction (mm³) and three-dimensional coordinate extents require calibrated volumetric 3D MRI scans with spatial spacing headers.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Major Bone Dimension Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Femur Dimension Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Femur Spatial Extent</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">Label #7</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">X (Mediolateral)</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                    {femur?.x_extent_mm.toFixed(2)} mm
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Y (Anteroposterior)</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                    {femur?.y_extent_mm.toFixed(2)} mm
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Z (Cranial-Caudal)</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                    {femur?.z_extent_mm.toFixed(2)} mm
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
                <span>Voxel Count: {femur?.voxel_count.toLocaleString()}</span>
                <span>Volume: <strong className="text-slate-800">{femur?.volume_mm3.toLocaleString()} mm³</strong></span>
              </div>
            </div>

            {/* Tibia Dimension Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-600" />
                  <h3 className="text-sm font-bold text-slate-900">Tibia Spatial Extent</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">Label #8</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">X (Mediolateral)</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                    {tibia?.x_extent_mm.toFixed(2)} mm
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Y (Anteroposterior)</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                    {tibia?.y_extent_mm.toFixed(2)} mm
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Z (Cranial-Caudal)</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono mt-0.5 block">
                    {tibia?.z_extent_mm.toFixed(2)} mm
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-mono">
                <span>Voxel Count: {tibia?.voxel_count.toLocaleString()}</span>
                <span>Volume: <strong className="text-slate-800">{tibia?.volume_mm3.toLocaleString()} mm³</strong></span>
              </div>
            </div>
          </div>

          {/* Full Anatomical Measurements Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-teal-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Anatomical Compartment Measurements Table
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Formula: Extent (mm) = (Max - Min + 1) × Voxel Spacing
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/60 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Label</th>
                    <th className="px-5 py-3">Structure Name</th>
                    <th className="px-5 py-3 text-right">Voxel Count</th>
                    <th className="px-5 py-3 text-right">Physical Volume (mm³)</th>
                    <th className="px-5 py-3 text-right">X Extent (mm)</th>
                    <th className="px-5 py-3 text-right">Y Extent (mm)</th>
                    <th className="px-5 py-3 text-right">Z Extent (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {structures.map((s) => (
                    <tr key={s.id} className="hover:bg-teal-50/20 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-slate-500">#{s.id}</td>
                      <td className="px-5 py-3 font-bold text-slate-900 flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-md shrink-0 shadow-xs"
                          style={{ backgroundColor: s.color }}
                        />
                        <span>{s.name}</span>
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-slate-600">
                        {s.voxel_count.toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-slate-900">
                        {s.volume_mm3.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mm³
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-slate-700">
                        {s.x_extent_mm.toFixed(2)} mm
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-slate-700">
                        {s.y_extent_mm.toFixed(2)} mm
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-slate-700">
                        {s.z_extent_mm.toFixed(2)} mm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Methodology Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-600">
            <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Measurement Methodology:</strong> All reported values represent physical anatomical dimensions converted using orientation-aware voxel zooms (sx = 0.3125 mm, sy = 0.3125 mm, sz = 0.8001 mm). Bounding extents are computed from the extreme coordinates of the segmented binary masks. Volumetric integration is calculated as Volume = N_voxels × (sx · sy · sz) = N × 0.078131 mm³.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
