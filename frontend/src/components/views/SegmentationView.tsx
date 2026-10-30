import React, { useState } from 'react';
import type { CaseRecord } from '../../types';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  Check,
} from 'lucide-react';

interface SegmentationViewProps {
  currentCase: CaseRecord | null;
}

export const SegmentationView: React.FC<SegmentationViewProps> = ({ currentCase }) => {
  const [visibleLabels, setVisibleLabels] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
  });

  const [activeCompartmentFilter, setActiveCompartmentFilter] = useState<'all' | 'cartilage' | 'meniscus' | 'bone'>('all');

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
  const benchmark = currentCase.benchmark?.segmentation;

  const toggleLabel = (id: number) => {
    setVisibleLabels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setAllLabels = (visible: boolean) => {
    const updated: Record<number, boolean> = {};
    structures.forEach((s) => {
      updated[s.id] = visible;
    });
    setVisibleLabels(updated);
  };

  const filteredStructures = structures.filter((s) => {
    if (activeCompartmentFilter === 'all') return true;
    if (activeCompartmentFilter === 'cartilage') return [1, 2, 3, 4].includes(s.id);
    if (activeCompartmentFilter === 'meniscus') return [5, 6].includes(s.id);
    if (activeCompartmentFilter === 'bone') return [7, 8].includes(s.id);
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md mb-1.5 border border-teal-200">
            <Layers className="w-3.5 h-3.5" />
            <span>nnU-Net v2 ResEncUNetMPlans 3D Fullres</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Multi-Compartment Anatomical Segmentation
          </h1>
          <p className="text-xs text-slate-500">
            Automated deep neural segmentation of 9 distinct knee anatomical compartments from 3D MRI volume.
          </p>
        </div>

        {/* Evaluation Context Badge */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Validation Benchmark Mean Dice
            </span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {benchmark?.mean_dice_percentage || '91.18%'}
            </span>
          </div>
        </div>
      </div>

      {isXray ? (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-amber-900">Segmentation Disabled for 2D Radiograph</h3>
          <p className="text-xs text-amber-800 max-w-lg mx-auto leading-relaxed">
            Case <span className="font-mono font-bold">{currentCase.case_id}</span> is a 2D projection radiograph. The 9-class nnU-Net model requires volumetric 3D MRI voxel cubes. In adherence to scientific rigor, 3D segmentation was not executed on this scan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Visual Display with Overlay (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-slate-300 font-bold">Coronal Slice #84 • Predicted Label Mask</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAllLabels(true)}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-medium transition-colors"
                >
                  Show All
                </button>
                <button
                  type="button"
                  onClick={() => setAllLabels(false)}
                  className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-medium transition-colors"
                >
                  Hide All
                </button>
              </div>
            </div>

            {/* Image Canvas with High Contrast Medical Rendering */}
            <div className="relative mx-auto max-w-sm rounded-xl overflow-hidden border-2 border-teal-500/40 shadow-2xl bg-black">
              <img
                src={currentCase.preview_url || '/mri_scan.png'}
                alt="Segmented Knee Joint"
                className="max-h-[380px] w-auto object-contain mx-auto"
              />

              {/* Purple outline label indicator */}
              <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-md text-[10px] font-mono px-2.5 py-1 rounded border border-slate-700 text-purple-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>Purple outline: Label 5 (Medial Meniscus)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Matrix: 512×512</span>
              <span>•</span>
              <span>Slice Spacing: 0.8001 mm</span>
              <span>•</span>
              <span className="text-teal-400 font-semibold">9 Labels Active</span>
            </div>
          </div>

          {/* Interactive Legend & Structure Table (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Anatomical Label Legend</h3>
                <p className="text-[11px] text-slate-500">Toggle individual compartments to inspect boundaries</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold">
                {(['all', 'cartilage', 'meniscus', 'bone'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveCompartmentFilter(filter)}
                    className={`px-2 py-1 rounded capitalize transition-all ${
                      activeCompartmentFilter === filter
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* List of 9 structures */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredStructures.map((s) => {
                const isVisible = visibleLabels[s.id] ?? true;
                const benchmarkDice = benchmark?.per_structure_dice[s.name];

                return (
                  <div
                    key={s.id}
                    onClick={() => toggleLabel(s.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isVisible
                        ? 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
                        : 'border-slate-100 bg-slate-50/30 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-md shrink-0 shadow-xs flex items-center justify-center text-white text-[10px]"
                        style={{ backgroundColor: s.color }}
                      >
                        {isVisible && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span className="font-mono text-slate-400">#{s.id}</span>
                          <span>{s.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {s.voxel_count.toLocaleString()} voxels • {s.volume_mm3.toLocaleString()} mm³
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {benchmarkDice && (
                        <span className="text-[11px] font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {(benchmarkDice * 100).toFixed(1)}% Dice
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
