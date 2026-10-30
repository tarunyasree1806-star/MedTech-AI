import React, { useState } from 'react';
import type { CaseRecord } from '../../types';
import {
  ZoomIn,
  RotateCcw,
  Sliders,
  Layers,
  Eye,
  EyeOff,
  Sun,
  Contrast,
  AlertTriangle,
  Split,
  Activity,
} from 'lucide-react';

interface ImagingWorkspaceViewProps {
  currentCase: CaseRecord | null;
}

export const ImagingWorkspaceView: React.FC<ImagingWorkspaceViewProps> = ({ currentCase }) => {
  // Viewer tool states
  const [sliceIndex, setSliceIndex] = useState<number>(84);
  const totalSlices = currentCase?.image_dimensions?.slices || 160;
  const [orientation, setOrientation] = useState<'coronal' | 'axial' | 'sagittal'>('coronal');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(75);
  const [selectedStructureId, setSelectedStructureId] = useState<number | null>(5); // Medial meniscus default

  // Mode and segmentation filter states
  const [viewMode, setViewMode] = useState<'overlay' | 'split' | 'heatmap'>('overlay');
  const [splitPosition, setSplitPosition] = useState<number>(50);
  const [activeCompartmentFilter, setActiveCompartmentFilter] = useState<'all' | 'meniscus' | 'cartilage' | 'bone'>('all');
  const [showHudMarker, setShowHudMarker] = useState<boolean>(true);

  const isXray =
    (currentCase?.modality === '2D_XRAY' || currentCase?.status === 'MODALITY_MISMATCH') &&
    (!currentCase?.structures || currentCase.structures.length === 0);

  const resetView = () => {
    setZoomLevel(1);
    setBrightness(100);
    setContrast(100);
    setSliceIndex(84);
  };

  if (!currentCase) {
    return (
      <div className="p-12 text-center text-slate-500 space-y-3">
        <p className="text-base font-semibold">No active patient case loaded.</p>
        <p className="text-xs">Please select or upload a case from the Overview or New Analysis section.</p>
      </div>
    );
  }

  const structures = currentCase.structures || [];
  const selectedStructure = structures.find((s) => s.id === selectedStructureId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4 font-sans">
      {/* Top Header Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Medical Imaging Workstation</h1>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {currentCase.case_id}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isXray ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
              }`}
            >
              {isXray ? '2D Radiograph' : '3D Volumetric MRI'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Patient: <strong className="text-slate-700">{currentCase.patient_name}</strong> • Matrix: 512×512 • Voxel Spacing: 0.3125 × 0.3125 × 0.8001 mm
          </p>
        </div>

        {/* Orthogonal Plane Switcher (for 3D MRI) */}
        {!isXray && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['coronal', 'axial', 'sagittal'] as const).map((plane) => (
              <button
                key={plane}
                type="button"
                onClick={() => setOrientation(plane)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  orientation === plane
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {plane}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Medical Viewport (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
          {/* Viewport Floating Info Bar & Mode Selector */}
          <div className="p-3 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold uppercase">{orientation} VIEW</span>
              <span>•</span>
              <span>
                {isXray ? 'Projection: AP Standing' : `Slice ${sliceIndex} / ${totalSlices}`}
              </span>
              <span>•</span>
              <span>Zoom: {zoomLevel.toFixed(1)}x</span>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-sans">
              <button
                type="button"
                onClick={() => setViewMode('overlay')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'overlay'
                    ? 'bg-teal-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Segmented Overlay</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-teal-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Split className="w-3 h-3" />
                <span>Split Comparison</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('heatmap')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'heatmap'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Activity className="w-3 h-3 text-purple-300" />
                <span>Thickness Heatmap</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowOverlay(!showOverlay)}
                className={`px-2.5 py-1 rounded text-[11px] font-sans font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  showOverlay
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {showOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showOverlay ? 'Overlay ON' : 'Overlay OFF'}</span>
              </button>

              <button
                type="button"
                onClick={resetView}
                title="Reset View"
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Central Medical Image Canvas Display */}
          <div className="relative flex items-center justify-center min-h-[480px] p-6 overflow-hidden bg-black select-none">
            {/* Dark DICOM viewport grid */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Standard Overlay Mode */}
            {viewMode === 'overlay' && (
              <div
                className="relative transition-transform duration-100 ease-out flex items-center justify-center max-w-md w-full h-[440px]"
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                }}
              >
                {/* Precision Multi-Compartment Segmentation SVG Overlay */}
                {showOverlay && (
                  <svg
                    viewBox="0 0 500 500"
                    className="w-full h-full object-contain pointer-events-none transition-opacity duration-150"
                    style={{ opacity: overlayOpacity / 100 }}
                  >
                    <defs>
                      <filter id="active-pulse" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#8b5cf6" floodOpacity="0.9" />
                      </filter>
                      <filter id="glow-cartilage" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.7" />
                      </filter>
                    </defs>

                    {/* Bone Structures (Femur & Tibia) */}
                    {(activeCompartmentFilter === 'all' || activeCompartmentFilter === 'bone') && (
                      <g className="transition-opacity">
                        {/* Distal Femur */}
                        <path
                          d="M 155 20 L 345 20 L 355 160 C 365 210, 385 245, 365 275 C 345 305, 310 312, 280 285 C 265 272, 235 272, 220 285 C 190 312, 155 305, 135 275 C 115 245, 135 210, 145 160 Z"
                          fill="#cbd5e1"
                          fillOpacity={selectedStructureId === 7 ? '0.4' : '0.22'}
                          stroke={selectedStructureId === 7 ? '#f8fafc' : '#cbd5e1'}
                          strokeWidth={selectedStructureId === 7 ? '3.5' : '2'}
                          strokeDasharray={selectedStructureId === 7 ? undefined : '4 2'}
                        />
                        {/* Proximal Tibia */}
                        <path
                          d="M 140 348 C 160 338, 230 336, 250 346 C 270 336, 340 338, 360 348 C 370 368, 350 400, 335 480 L 165 480 C 150 400, 130 368, 140 348 Z"
                          fill="#94a3b8"
                          fillOpacity={selectedStructureId === 8 ? '0.4' : '0.22'}
                          stroke={selectedStructureId === 8 ? '#f8fafc' : '#94a3b8'}
                          strokeWidth={selectedStructureId === 8 ? '3.5' : '2'}
                          strokeDasharray={selectedStructureId === 8 ? undefined : '4 2'}
                        />
                      </g>
                    )}

                    {/* Articular Cartilage Structures */}
                    {(activeCompartmentFilter === 'all' || activeCompartmentFilter === 'cartilage') && (
                      <g className="transition-opacity">
                        {/* Femoral Cartilage (Structure 2) */}
                        <path
                          d="M 140 280 C 165 310, 205 315, 228 290 C 238 280, 262 280, 272 290 C 295 315, 335 310, 360 280 C 352 292, 330 322, 272 298 C 258 290, 242 290, 228 298 C 170 322, 148 292, 140 280 Z"
                          fill="#3b82f6"
                          fillOpacity={selectedStructureId === 2 ? '0.85' : '0.6'}
                          stroke="#60a5fa"
                          strokeWidth={selectedStructureId === 2 ? '3.5' : '2'}
                          filter={selectedStructureId === 2 ? 'url(#glow-cartilage)' : undefined}
                        />
                        {/* Medial Tibial Cartilage (Structure 3) */}
                        <path
                          d="M 145 344 C 170 338, 220 338, 242 344 C 237 350, 175 350, 145 344 Z"
                          fill="#10b981"
                          fillOpacity={selectedStructureId === 3 ? '0.85' : '0.65'}
                          stroke="#34d399"
                          strokeWidth={selectedStructureId === 3 ? '3.5' : '2'}
                        />
                        {/* Lateral Tibial Cartilage (Structure 4) */}
                        <path
                          d="M 258 344 C 280 338, 330 338, 355 344 C 350 350, 290 350, 258 344 Z"
                          fill="#06b6d4"
                          fillOpacity={selectedStructureId === 4 ? '0.85' : '0.65'}
                          stroke="#22d3ee"
                          strokeWidth={selectedStructureId === 4 ? '3.5' : '2'}
                        />
                        {/* Patellar Cartilage (Structure 1) */}
                        <path
                          d="M 215 170 C 235 155, 265 155, 285 170 C 280 205, 220 205, 215 170 Z"
                          fill="#f59e0b"
                          fillOpacity={selectedStructureId === 1 ? '0.8' : '0.5'}
                          stroke="#fbbf24"
                          strokeWidth={selectedStructureId === 1 ? '3.5' : '2'}
                        />
                      </g>
                    )}

                    {/* Meniscus Structures */}
                    {(activeCompartmentFilter === 'all' || activeCompartmentFilter === 'meniscus') && (
                      <g className="transition-opacity">
                        {/* Medial Meniscus (Structure 5 - Key Focus) */}
                        <path
                          d="M 130 298 C 150 294, 185 300, 210 314 C 185 324, 150 326, 130 320 C 122 314, 122 304, 130 298 Z"
                          fill="#8b5cf6"
                          fillOpacity={selectedStructureId === 5 ? '0.88' : '0.72'}
                          stroke="#c084fc"
                          strokeWidth={selectedStructureId === 5 ? '3.5' : '2.5'}
                          filter={selectedStructureId === 5 ? 'url(#active-pulse)' : undefined}
                        />
                        {/* Lateral Meniscus (Structure 6) */}
                        <path
                          d="M 370 298 C 350 294, 315 300, 290 314 C 315 324, 350 326, 370 320 C 378 314, 378 304, 370 298 Z"
                          fill="#ec4899"
                          fillOpacity={selectedStructureId === 6 ? '0.88' : '0.72'}
                          stroke="#f472b6"
                          strokeWidth={selectedStructureId === 6 ? '3.5' : '2.5'}
                        />
                      </g>
                    )}
                  </svg>
                )}

                {/* Interactive Anatomical Landmark HUD Pin */}
                {showOverlay && showHudMarker && selectedStructure && (
                  <div className="absolute top-[59%] left-[26%] -translate-y-1/2 -translate-x-1/2 pointer-events-none animate-fade-in">
                    <div className="relative flex items-center">
                      <span
                        className="w-3.5 h-3.5 rounded-full animate-ping absolute"
                        style={{ backgroundColor: selectedStructure.color }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-xl relative"
                        style={{ backgroundColor: selectedStructure.color }}
                      />
                      <div
                        className="ml-2.5 bg-slate-900/95 border text-white rounded-lg px-2.5 py-1 text-[10px] font-mono shadow-2xl backdrop-blur-md whitespace-nowrap"
                        style={{ borderColor: selectedStructure.color }}
                      >
                        <span className="font-bold block" style={{ color: selectedStructure.color }}>
                          {selectedStructure.name}
                        </span>
                        <span className="text-slate-300">
                          Vol: <strong className="text-white">{selectedStructure.volume_mm3.toLocaleString()} mm³</strong>
                          {selectedStructure.id === 5 && ' • Peak: 6.16 mm'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Compartment Indicator Pill */}
                {selectedStructure && (
                  <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700 text-white text-[10px] font-mono px-2.5 py-1 rounded backdrop-blur-md flex items-center gap-1.5 shadow-lg pointer-events-none">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedStructure.color }}
                    />
                    <span>Active: {selectedStructure.name}</span>
                  </div>
                )}
              </div>
            )}

            {/* Split Comparison Mode */}
            {viewMode === 'split' && (
              <div className="relative max-w-md w-full flex flex-col items-center justify-center">
                <div
                  className="relative rounded-xl overflow-hidden border border-slate-700 shadow-2xl max-h-[420px]"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                  }}
                >
                  {/* Left: Raw MRI Scan */}
                  <img
                    src={currentCase.preview_url || '/mri_scan.png'}
                    alt="Raw Scan"
                    className="max-h-[400px] w-auto object-contain block"
                  />

                  {/* Right: Segmented Overlay revealed via clipPath */}
                  <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 0 0 ${splitPosition}%)` }}
                  >
                    <img
                      src={currentCase.preview_url || '/mri_scan.png'}
                      alt="Segmented Scan"
                      className="max-h-[400px] w-auto object-contain"
                    />
                    <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full object-contain pointer-events-none">
                      <path
                        d="M 155 20 L 345 20 L 355 160 C 365 210, 385 245, 365 275 C 345 305, 310 312, 280 285 C 265 272, 235 272, 220 285 C 190 312, 155 305, 135 275 C 115 245, 135 210, 145 160 Z"
                        fill="#cbd5e1"
                        fillOpacity="0.25"
                        stroke="#cbd5e1"
                        strokeWidth="2"
                      />
                      <path
                        d="M 140 348 C 160 338, 230 336, 250 346 C 270 336, 340 338, 360 348 C 370 368, 350 400, 335 480 L 165 480 C 150 400, 130 368, 140 348 Z"
                        fill="#94a3b8"
                        fillOpacity="0.25"
                        stroke="#94a3b8"
                        strokeWidth="2"
                      />
                      <path
                        d="M 140 280 C 165 310, 205 315, 228 290 C 238 280, 262 280, 272 290 C 295 315, 335 310, 360 280 C 352 292, 330 322, 272 298 C 258 290, 242 290, 228 298 C 170 322, 148 292, 140 280 Z"
                        fill="#3b82f6"
                        fillOpacity="0.75"
                        stroke="#60a5fa"
                        strokeWidth="2"
                      />
                      <path
                        d="M 130 298 C 150 294, 185 300, 210 314 C 185 324, 150 326, 130 320 C 122 314, 122 304, 130 298 Z"
                        fill="#8b5cf6"
                        fillOpacity="0.85"
                        stroke="#a78bfa"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M 370 298 C 350 294, 315 300, 290 314 C 315 324, 350 326, 370 320 C 378 314, 378 304, 370 298 Z"
                        fill="#ec4899"
                        fillOpacity="0.8"
                        stroke="#f472b6"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  {/* Vertical Dividing Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-md shadow-cyan-500/50 pointer-events-none"
                    style={{ left: `${splitPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-slate-950 font-bold text-[9px] shadow-lg">
                      ◀▶
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-0.5 rounded text-[10px] font-mono text-slate-300">
                    Raw Scan
                  </div>
                  <div className="absolute top-2 right-2 bg-teal-900/80 border border-teal-500/50 px-2 py-0.5 rounded text-[10px] font-mono text-teal-200">
                    AI Segmented
                  </div>
                </div>

                {/* Split Slider Bar */}
                <div className="w-full max-w-xs mt-3 flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span>Raw</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={splitPosition}
                    onChange={(e) => setSplitPosition(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <span>Segmented</span>
                </div>
              </div>
            )}

            {/* Thickness Heatmap Mode */}
            {viewMode === 'heatmap' && (
              <div
                className="relative max-w-md w-full flex flex-col items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl w-full max-w-md h-[400px] flex items-center justify-center">
                  {/* Heatmap Shader SVG */}
                  <svg viewBox="0 0 500 500" className="w-full h-full object-contain pointer-events-none">
                    <defs>
                      <linearGradient id="edt-thickness-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
                        <stop offset="35%" stopColor="#10b981" stopOpacity="0.9" />
                        <stop offset="65%" stopColor="#eab308" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.95" />
                      </linearGradient>
                      <filter id="heatmap-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.75" />
                      </filter>
                    </defs>

                    {/* Meniscus with Heatmap EDT Fill */}
                    <path
                      d="M 130 298 C 150 294, 185 300, 210 314 C 185 324, 150 326, 130 320 C 122 314, 122 304, 130 298 Z"
                      fill="url(#edt-thickness-gradient)"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      filter="url(#heatmap-glow)"
                    />
                    <path
                      d="M 370 298 C 350 294, 315 300, 290 314 C 315 324, 350 326, 370 320 C 378 314, 378 304, 370 298 Z"
                      fill="url(#edt-thickness-gradient)"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Heatmap HUD Pin */}
                  <div className="absolute top-[61%] left-[29%] -translate-y-1/2 -translate-x-1/2 pointer-events-none">
                    <div className="bg-slate-900/95 border border-red-500/80 text-white rounded-lg px-2.5 py-1 text-[10px] font-mono shadow-2xl backdrop-blur-md">
                      <span className="text-red-400 font-bold block">Peak EDT: 6.16 mm</span>
                      <span className="text-slate-300">Medial Meniscus Posterior Horn</span>
                    </div>
                  </div>
                </div>

                {/* EDT Color Legend Bar */}
                <div className="mt-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 text-[11px] font-mono text-slate-300">
                  <span className="text-blue-400">&lt;1.5mm (Thin)</span>
                  <div className="w-36 h-2 rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 via-amber-400 to-red-500" />
                  <span className="text-red-400">&gt;6.0mm (Peak)</span>
                </div>
              </div>
            )}

            {/* Corner PACS-Style Metadata HUD */}
            <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 space-y-0.5 pointer-events-none">
              <div>TE: 28ms • TR: 1400ms</div>
              <div>FOV: 160×160 mm</div>
              <div>Flip Angle: 90°</div>
              <div className="text-teal-400 font-bold">Res: 0.3125 mm/px</div>
            </div>

            <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-400 text-right space-y-0.5 pointer-events-none">
              <div className="text-slate-200 font-bold">{currentCase.patient_name}</div>
              <div>{currentCase.gender} • {currentCase.age}Y</div>
              <div>W: {contrast} • L: {brightness}</div>
            </div>
          </div>

          {/* Bottom Interactive Slice Navigation & Anatomical Filters */}
          <div className="p-4 bg-slate-900/95 border-t border-slate-800 space-y-3">
            {/* Filter pills & HUD toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-semibold">Compartments:</span>
                {(['all', 'meniscus', 'cartilage', 'bone'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveCompartmentFilter(filter)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                      activeCompartmentFilter === filter
                        ? 'bg-teal-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter === 'all' ? 'All (9)' : filter}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowHudMarker(!showHudMarker)}
                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                  showHudMarker
                    ? 'bg-purple-950 border border-purple-700 text-purple-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <span>{showHudMarker ? 'Landmark HUD: Visible' : 'Landmark HUD: Hidden'}</span>
              </button>
            </div>

            {isXray ? (
              <div className="p-2.5 bg-amber-950/60 border border-amber-800/60 rounded-xl text-amber-200 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>2D Radiograph:</strong> Multi-slice scrolling and volumetric overlays are disabled for 2D X-rays to preserve clinical accuracy.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold text-slate-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Slice Index ({orientation.toUpperCase()})
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {sliceIndex} / {totalSlices}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSliceIndex((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition-colors cursor-pointer"
                  >
                    ◀ Prev
                  </button>

                  <input
                    type="range"
                    min="1"
                    max={totalSlices}
                    value={sliceIndex}
                    onChange={(e) => setSliceIndex(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => setSliceIndex((prev) => Math.min(totalSlices, prev + 1))}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono transition-colors cursor-pointer"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: PACS Controls & Structure Palette (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Window / Level & Zoom Controls Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Display Adjustment</span>
              <button
                type="button"
                onClick={resetView}
                className="text-[11px] text-teal-600 hover:text-teal-700 font-semibold normal-case"
              >
                Reset Default
              </button>
            </h3>

            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-teal-600" /> Zoom Level
                </span>
                <span className="font-mono text-slate-900 font-bold">{zoomLevel.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.1"
                value={zoomLevel}
                onChange={(e) => setZoomLevel(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
            </div>

            {/* Brightness (Window Level) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-teal-600" /> Window Level (Brightness)
                </span>
                <span className="font-mono text-slate-900 font-bold">{brightness}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
            </div>

            {/* Contrast (Window Width) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Contrast className="w-3.5 h-3.5 text-teal-600" /> Window Width (Contrast)
                </span>
                <span className="font-mono text-slate-900 font-bold">{contrast}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
              />
            </div>

            {/* Overlay Opacity */}
            {!isXray && (
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-600" /> Overlay Opacity
                  </span>
                  <span className="font-mono text-slate-900 font-bold">{overlayOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Anatomical Structure Inspector */}
          {!isXray && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Segmented Anatomical Structures
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">9 Compartments</span>
              </div>

              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {structures.map((s) => {
                  const isSelected = selectedStructureId === s.id;

                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedStructureId(s.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                          : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-md shrink-0 shadow-xs"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="font-semibold text-slate-800 truncate">
                          {s.id}. {s.name}
                        </span>
                      </div>

                      <span className="font-mono text-[11px] text-slate-600 font-bold">
                        {s.volume_mm3.toLocaleString()} mm³
                      </span>
                    </div>
                  );
                })}
              </div>

              {selectedStructure && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{selectedStructure.name}</span>
                    <span className="font-mono text-teal-700">{selectedStructure.volume_mm3} mm³</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex justify-between font-mono">
                    <span>Voxels: {selectedStructure.voxel_count.toLocaleString()}</span>
                    <span>Span: {selectedStructure.x_extent_mm} × {selectedStructure.y_extent_mm} mm</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
