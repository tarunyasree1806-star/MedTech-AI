import React, { useState, useRef } from 'react';
import type { PatientInfo } from '../types';
import { DEFAULT_OA_RESULT } from '../data/initialData';
import {
  Upload,
  Activity,
  CheckCircle2,
  FileUp,
  BrainCircuit,
  Ruler,
  Layers,
  BarChart3,
  Download,
  Image as ImageIcon,
  Check,
  Sparkles,
  User,
  Hash,
  Scale,
  Mars
} from 'lucide-react';

export const OAAnalyzer: React.FC = () => {
  // Patient Details form state
  const [patient, setPatient] = useState<PatientInfo>({
    name: 'Rajesh Kumar',
    patientId: 'PT-2026-8849',
    age: '56',
    gender: 'Male',
    bmi: '26.4 kg/m²',
  });

  // File Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('/mri_scan.png');
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Analysis Trigger State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof PatientInfo, value: string) => {
    setPatient((prev: PatientInfo) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setUploadedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // If PDF or DCM, default to the default knee MRI scan image provided
      setPreviewImage('/mri_scan.png');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const runAnalysis = () => {
    if (!patient.name || !patient.patientId) {
      alert('Please fill in Patient Name and Patient ID before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 900);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-white/20">
            <Activity className="w-3.5 h-3.5 text-sky-200" /> Deep Neural OA Segmentation Pipeline
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Knee Osteoarthritis (OA) Analyzer</h1>
          <p className="text-blue-100 text-xs mt-1">
            Input patient clinical metrics, upload MRI image/PDF scan, and execute AI deep joint feature segmentation.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setPatient({
              name: 'Dr. Sample Patient',
              patientId: 'PT-99321',
              age: '62',
              gender: 'Female',
              bmi: '27.8 kg/m²',
            });
            setHasAnalyzed(false);
          }}
          className="relative z-10 px-3.5 py-2 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white rounded-xl text-xs font-semibold border border-white/25 backdrop-blur-md transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-sky-200" /> Fill Quick Demo Data
        </button>
      </div>

      {/* Patient Data Input Form + File Upload Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Patient Details Input Box (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900">1. Patient Clinical Details</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">* Required for report generation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-500" /> Patient Name
              </label>
              <input
                type="text"
                value={patient.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-blue-500" /> Patient ID
              </label>
              <input
                type="text"
                value={patient.patientId}
                onChange={(e) => handleInputChange('patientId', e.target.value)}
                placeholder="e.g. PT-94821"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-500" /> Age (Years)
              </label>
              <input
                type="number"
                value={patient.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="e.g. 58"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mars className="w-3.5 h-3.5 text-blue-500" /> Gender
              </label>
              <select
                value={patient.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-500" /> BMI (Body Mass Index)
              </label>
              <input
                type="text"
                value={patient.bmi}
                onChange={(e) => handleInputChange('bmi', e.target.value)}
                placeholder="e.g. 26.4 kg/m²"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Upload Box (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">2. MRI Scan / PDF Upload</h2>
              <p className="text-[11px] text-slate-500">Supports PNG, JPG, DCM image files or PDF report</p>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.dcm"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
              dragActive
                ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                : uploadedFile
                ? 'border-emerald-300 bg-emerald-50/40'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/30'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            {uploadedFile ? (
              <div>
                <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {uploadedFile.name}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • Click or Drag to replace
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-800">
                  Drag & Drop MRI image or PDF report here
                </p>
                <p className="text-[11px] text-slate-500 mt-1">or click to browse files from computer</p>
                <span className="inline-block text-[10px] bg-blue-100/70 text-blue-700 px-2 py-0.5 rounded mt-2 font-medium">
                  Default MRI Scan Loaded
                </span>
              </div>
            )}
          </div>

          {/* Analysis Action Button */}
          <button
            type="button"
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isAnalyzing ? (
              <>
                <BrainCircuit className="w-5 h-5 animate-spin text-sky-200" />
                <span>Running Deep OA Analysis...</span>
              </>
            ) : (
              <>
                <BrainCircuit className="w-5 h-5" />
                <span>Click to Analyze Patient Scan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ANALYSIS RESULTS PANEL - DISPLAYED AFTER DOCTOR CLICKS ANALYZE */}
      {hasAnalyzed && (
        <div className="space-y-6 animate-fade-in pt-4">
          
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Diagnostic Analysis Complete</h3>
                <p className="text-xs text-emerald-700">
                  Patient <span className="font-semibold">{patient.name}</span> ({patient.patientId}) - Segmentation completed with high confidence.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF Report
            </button>
          </div>

          {/* MAIN DISPLAY SECTION: SHARED IMAGE FIRST, FOLLOWED BY ALL PREDICTED DETAILS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            
            {/* Header Title */}
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Patient Segmentation Scan & Quantitative Predictions</h3>
                  <p className="text-xs text-slate-500">
                    MRI joint slice annotated cartilage/meniscus region followed by model output metrics.
                  </p>
                </div>
              </div>
              <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full text-xs border border-blue-200">
                Mean Dice Score: {DEFAULT_OA_RESULT.meanDiceScore}
              </span>
            </div>

            {/* 1. DISPLAY THE SHARED IMAGE FIRST */}
            <div className="flex flex-col items-center justify-center bg-slate-900/95 p-6 rounded-2xl border border-slate-800 text-center shadow-inner">
              <p className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Coronal Knee MRI Slice - Segmented Cartilage & Meniscus Boundary
              </p>

              <div className="relative group max-w-sm rounded-xl overflow-hidden border-2 border-purple-500/40 shadow-2xl bg-black">
                <img
                  src={previewImage}
                  alt="Knee MRI Segmentation Scan"
                  className="max-h-96 w-auto object-contain mx-auto"
                />
                <div className="absolute bottom-2 left-2 bg-purple-950/80 backdrop-blur-md text-purple-200 text-[10px] font-mono px-2.5 py-1 rounded border border-purple-500/40 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  Purple outline: Medial Meniscus / Cartilage boundary
                </div>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-slate-300 font-mono bg-slate-800/70 px-4 py-1.5 rounded-lg border border-slate-700">
                <span>Slice ID: #MR-842</span>
                <span>•</span>
                <span>Resolution: 512×512</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Dice: 91.18%</span>
              </div>
            </div>

            {/* 2. DISPLAY ALL PREDICTED DETAILS BELOW THE IMAGE */}
            <div className="space-y-6 pt-2">

              {/* Main OA Assessment Banner */}
              <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-50 border-2 border-blue-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    Primary Diagnostic Result
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-2">
                    {DEFAULT_OA_RESULT.mainResultProbability}
                    <span className="text-sm font-semibold text-slate-600">Model-estimated OA probability</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Low-to-moderate risk threshold detected based on cartilage volume loss and meniscus 3D thickness analysis.
                  </p>
                </div>

                <div className="w-full md:w-64 space-y-1.5 bg-white p-3.5 rounded-xl border border-blue-100 shadow-xs">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">OA Probability</span>
                    <span className="text-blue-700 font-bold">24.26%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-600 h-full rounded-full w-[24.26%]" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>0% (Healthy)</span>
                    <span className="font-semibold text-emerald-600">Low Risk</span>
                    <span>100% (Severe)</span>
                  </div>
                </div>
              </div>

              {/* Bone Dimensions Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Femur Dimension</span>
                    <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                      {DEFAULT_OA_RESULT.femurDimension}
                    </p>
                  </div>
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                    <Ruler className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tibia Dimension</span>
                    <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                      {DEFAULT_OA_RESULT.tibiaDimension}
                    </p>
                  </div>
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                    <Ruler className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Cartilage Volumes Table Card */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">Cartilage Volumes</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Structure</th>
                        <th className="px-4 py-3 text-right">Volume</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {DEFAULT_OA_RESULT.cartilageVolumes.map((item: any, idx: number) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-3 text-slate-800 font-semibold">{item.structure}</td>
                          <td className="px-4 py-3 text-right text-slate-900 font-mono font-bold text-sm">
                            {item.volume}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Medial Meniscus Analysis Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg">
                      <Activity className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Medial Meniscus Analysis</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Basic Measurements & 3D Local Thickness</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">Voxel Count</span>
                    <span className="text-sm font-bold text-purple-950 font-mono">
                      {DEFAULT_OA_RESULT.medialMeniscus.voxelCount}
                    </span>
                  </div>
                  <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">Volume</span>
                    <span className="text-sm font-bold text-purple-950 font-mono">
                      {DEFAULT_OA_RESULT.medialMeniscus.volume}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">
                    3D Local Thickness Measurement Values
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="block text-[11px] text-slate-500 font-medium">Minimum</span>
                      <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                        {DEFAULT_OA_RESULT.medialMeniscus.thickness.min}
                      </span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <span className="block text-[11px] text-blue-700 font-medium">Mean</span>
                      <span className="text-sm font-bold text-blue-950 font-mono mt-0.5 block">
                        {DEFAULT_OA_RESULT.medialMeniscus.thickness.mean}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="block text-[11px] text-slate-500 font-medium">Median</span>
                      <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                        {DEFAULT_OA_RESULT.medialMeniscus.thickness.median}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="block text-[11px] text-slate-500 font-medium">Maximum</span>
                      <span className="text-sm font-bold text-slate-900 font-mono mt-0.5 block">
                        {DEFAULT_OA_RESULT.medialMeniscus.thickness.max}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Combined OA Model Metrics Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-sky-400" />
                    <h4 className="text-base font-bold">Combined OA Model Performance & OA Assessment</h4>
                  </div>
                  <span className="text-xs bg-sky-500/20 text-sky-200 px-3 py-1 rounded-full border border-sky-400/30">
                    Validation Metric Suite
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center pt-1">
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="block text-[11px] text-slate-400">AUC</span>
                    <span className="text-lg font-extrabold text-sky-300 font-mono mt-1 block">
                      {DEFAULT_OA_RESULT.combinedModel.auc}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="block text-[11px] text-slate-400">Sensitivity</span>
                    <span className="text-lg font-extrabold text-sky-300 font-mono mt-1 block">
                      {DEFAULT_OA_RESULT.combinedModel.sensitivity}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="block text-[11px] text-slate-400">Specificity</span>
                    <span className="text-lg font-extrabold text-sky-300 font-mono mt-1 block">
                      {DEFAULT_OA_RESULT.combinedModel.specificity}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                    <span className="block text-[11px] text-slate-400">Accuracy</span>
                    <span className="text-lg font-extrabold text-emerald-400 font-mono mt-1 block">
                      {DEFAULT_OA_RESULT.combinedModel.accuracy}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 col-span-2 sm:col-span-1">
                    <span className="block text-[11px] text-slate-400">Precision</span>
                    <span className="text-lg font-extrabold text-sky-300 font-mono mt-1 block">
                      {DEFAULT_OA_RESULT.combinedModel.precision}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-900/50 p-4 rounded-xl border border-blue-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>OA Assessment:</strong> {DEFAULT_OA_RESULT.combinedModel.oaProbability} Model-estimated OA probability
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-200 bg-blue-800 px-2.5 py-1 rounded font-mono">
                    Model Conf: 98.4%
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
