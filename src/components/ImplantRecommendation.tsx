import React, { useState } from 'react';
import { IMPLANT_DATA } from '../data/initialData';
import {
  Bone,
  Ruler,
  CheckCircle2,
  Trophy,
  Sparkles,
  Sliders,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const ImplantRecommendation: React.FC = () => {
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(true); // Display by default or on button click
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleAnalyzeClick = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 600);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Top Banner with ANALYZE BUTTON IN THE TOP RIGHT CORNER */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Bone className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5">
              <Sparkles className="w-3.5 h-3.5" /> Orthopedic Prosthetic Sizing
            </div>
            <h1 className="text-xl font-bold text-slate-900">Knee Implant Size Recommendation Engine</h1>
            <p className="text-xs text-slate-500">
              Matches patient femoral and tibial anatomical geometry to optimal component sizes.
            </p>
          </div>
        </div>

        {/* ANALYZE BUTTON IN TOP RIGHT CORNER */}
        <button
          type="button"
          onClick={handleAnalyzeClick}
          disabled={isAnalyzing}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-70"
        >
          {isAnalyzing ? (
            <>
              <Sliders className="w-4 h-4 animate-spin text-sky-200" />
              <span>Analyzing Sizing Match...</span>
            </>
          ) : (
            <>
              <Sliders className="w-4 h-4" />
              <span>Analyze Implant Recommendation</span>
            </>
          )}
        </button>
      </div>

      {hasAnalyzed && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Anatomical Measurements Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Femur Dimension Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Femur Dimension
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono pt-1">
                  X = {IMPLANT_DATA.femur.x} <span className="text-slate-400 font-normal">|</span> Y = {IMPLANT_DATA.femur.y}
                </div>
                <p className="text-[11px] text-slate-500">Anteroposterior & Mediolateral femoral spans</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Ruler className="w-6 h-6" />
              </div>
            </div>

            {/* Tibia Dimension Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Tibia Dimension
                  </span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono pt-1">
                  X = {IMPLANT_DATA.tibia.x} <span className="text-slate-400 font-normal">|</span> Y = {IMPLANT_DATA.tibia.y}
                </div>
                <p className="text-[11px] text-slate-500">Tibial plateau resection surface dimensions</p>
              </div>
              <div className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                <Ruler className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* PRIMARY RECOMMENDATION CARD: 🟢 SIZE L Rank: #1 */}
          <div className="bg-gradient-to-r from-emerald-50 via-white to-blue-50 border-2 border-emerald-400/80 rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Top Recommended Component Match
                  </span>
                  <span className="bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    Rank: #1
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    🟢 {IMPLANT_DATA.primary.size}
                  </h2>
                  <span className="text-sm font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">
                    Rank: {IMPLANT_DATA.primary.rank}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Lowest anatomical misfit error calculated across femoral resection and tibial tray profiles.
                </p>
              </div>

              {/* Matching Errors Grid */}
              <div className="w-full lg:w-auto bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Component Matching Errors
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="px-3 py-1.5 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-medium block">Femoral Error</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">{IMPLANT_DATA.primary.femoralError}</span>
                  </div>

                  <div className="px-3 py-1.5 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-500 font-medium block">Tibial Error</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">{IMPLANT_DATA.primary.tibialError}</span>
                  </div>

                  <div className="px-3 py-1.5 bg-emerald-100/70 text-emerald-950 rounded-lg border border-emerald-200">
                    <span className="text-[10px] font-semibold text-emerald-800 block">Total Error</span>
                    <span className="text-sm font-extrabold text-emerald-900 font-mono">{IMPLANT_DATA.primary.totalError}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ALTERNATIVES TABLE & CARDS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Implant Size Alternatives & Error Ranking</h3>
                  <p className="text-xs text-slate-500">Comparative anatomical matching error score across available size variants.</p>
                </div>
              </div>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                4 Sizes Evaluated
              </span>
            </div>

            {/* Alternatives Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Rank</th>
                    <th className="px-5 py-3">Implant</th>
                    <th className="px-5 py-3">Total Error</th>
                    <th className="px-5 py-3">Fit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {IMPLANT_DATA.alternatives.map((opt, idx) => (
                    <tr
                      key={idx}
                      className={`transition-colors ${
                        opt.isBest ? 'bg-emerald-50/50 hover:bg-emerald-50 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="px-5 py-3.5 text-slate-900 font-bold text-sm">
                        {opt.rank}
                      </td>
                      <td className="px-5 py-3.5 text-slate-900 font-semibold text-sm">
                        {opt.implant}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900 text-sm">
                        {opt.totalError}
                      </td>
                      <td className="px-5 py-3.5">
                        {opt.isBest ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Optimal Match (#1)
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">Alternative Option</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual Error Margin Bar Comparison */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 mt-4">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600" /> Total Matching Error Margin Comparison
              </h4>
              <div className="space-y-2">
                {IMPLANT_DATA.alternatives.map((opt, idx) => {
                  const numericError = parseFloat(opt.totalError);
                  const barPercentage = Math.min(100, (numericError / 45) * 100);
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <span className="w-16 font-bold text-slate-700 shrink-0">{opt.implant}</span>
                      <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            opt.isBest ? 'bg-emerald-500' : 'bg-blue-400'
                          }`}
                          style={{ width: `${barPercentage}%` }}
                        />
                      </div>
                      <span className="w-20 font-mono text-right font-semibold text-slate-800">{opt.totalError}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
