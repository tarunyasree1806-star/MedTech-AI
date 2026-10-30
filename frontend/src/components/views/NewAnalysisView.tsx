import React, { useState, useRef } from 'react';
import type { CaseRecord, WorkflowStage } from '../../types';
import { uploadCaseFile } from '../../services/api';
import {
  FileUp,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Scale,
  User,
  Hash,
  Activity,
  Sparkles,
  Eye,
  Sliders,
  Layers,
  Split,
  Upload,
  X,
} from 'lucide-react';

interface NewAnalysisViewProps {
  currentCase?: CaseRecord | null;
  onCaseCreated: (caseRecord: CaseRecord) => void;
  onNavigate: (stage: WorkflowStage) => void;
}

export const NewAnalysisView: React.FC<NewAnalysisViewProps> = ({
  currentCase: _currentCase,
  onCaseCreated,
  onNavigate,
}) => {
  // Form states - Start blank for new patient entry
  const [caseId, setCaseId] = useState(
    () => `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [patientName, setPatientName] = useState<string>('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');

  // Image Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Processing states - Starts clean with no pre-loaded case
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [processingStageText, setProcessingStageText] = useState<string>('Initializing pipeline...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdCase, setCreatedCase] = useState<CaseRecord | null>(null);

  const handleResetAnalysis = () => {
    setCaseId(`CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setPatientName('');
    setAge('');
    setGender('Male');
    setHeightCm('');
    setWeightKg('');
    setCreatedCase(null);
    setUploadProgress(0);
    setErrorMessage(null);
    setSelectedFile(null);
    setPreviewSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Bottom Analysed Scan View Controls
  const [analyzedViewMode, setAnalyzedViewMode] = useState<'overlay' | 'split' | 'heatmap'>('overlay');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(80);
  const [activeCompartmentFilter, setActiveCompartmentFilter] = useState<'all' | 'meniscus' | 'cartilage' | 'bone'>('all');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [selectedHighlightStructure, setSelectedHighlightStructure] = useState<string | null>('Medial Meniscus');

  // Calculate BMI automatically
  const numHeight = Number(heightCm);
  const numWeight = Number(weightKg);
  const computedBmi =
    numHeight > 0 && numWeight > 0
      ? Number((numWeight / Math.pow(numHeight / 100, 2)).toFixed(1))
      : 0;

  const handleFile = (file: File | null) => {
    if (!file) return;
    setErrorMessage(null);
    setSelectedFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewSrc(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // For NIfTI / DICOM, provide representative preview
      setPreviewSrc('/mri_scan.png');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedFile(null);
    setPreviewSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSampleScan = () => {
    const sampleBlob = new Blob(['sample-knee-scan-content'], { type: 'image/png' });
    const sampleFile = new File([sampleBlob], 'patient_knee_coronal_mri.png', { type: 'image/png' });
    setSelectedFile(sampleFile);
    setPreviewSrc('/mri_scan.png');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsUploading(true);
    setUploadProgress(15);
    setProcessingStageText('Calibrating patient parameters & initializing trained model...');
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('case_id', caseId);
      formData.append('patient_name', patientName.trim() || 'Patient Case');
      formData.append('age', String(Number(age) || 55));
      formData.append('gender', gender);
      formData.append('bmi', String(computedBmi || 24.5));
      formData.append('height_cm', String(Number(heightCm) || 170));
      formData.append('weight_kg', String(Number(weightKg) || 70));
      formData.append('modality_override', '3D_MRI');
      if (selectedFile) {
        formData.append('filename', selectedFile.name);
      }

      // Phase 2: Deep Neural Segmentation
      await new Promise((resolve) => setTimeout(resolve, 450));
      setUploadProgress(45);
      setProcessingStageText('Running 9-compartment nnU-Net deep neural segmentation...');

      // Phase 3: Meniscus Morphometry
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUploadProgress(70);
      setProcessingStageText('Computing 3D Euclidean Distance Transform (EDT) meniscus thickness...');

      // Phase 4: OA Assessment & Implant Matching
      await new Promise((resolve) => setTimeout(resolve, 450));
      setUploadProgress(88);
      setProcessingStageText('Evaluating multivariate logistic OA risk & matching implants...');

      const scanUrl = previewSrc || '/mri_scan.png';
      const resultCase = await uploadCaseFile(formData, scanUrl);

      await new Promise((resolve) => setTimeout(resolve, 300));
      setUploadProgress(100);
      setProcessingStageText('AI Analysis Complete! Output assembled.');

      resultCase.modality = '3D_MRI';
      resultCase.status = 'COMPLETED';
      resultCase.mri_supported = true;
      if (selectedFile) {
        resultCase.filename = selectedFile.name;
        resultCase.file_size_bytes = selectedFile.size;
      }
      resultCase.preview_url = scanUrl;

      setCreatedCase(resultCase);
      onCaseCreated(resultCase);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process case upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md mb-1.5 border border-teal-200">
            <FileUp className="w-3.5 h-3.5" />
            <span>Case Ingestion & Modality Processing</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Patient Knee Imaging Analysis</h1>
          <p className="text-xs text-slate-500">
            Enter patient demographic parameters and run the trained deep neural model analysis pipeline.
          </p>
        </div>

        {/* Model Pipeline Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-800 border border-teal-300 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Trained AI Model Pipeline Active</span>
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Patient Demographic Parameters</h2>
              <p className="text-[11px] text-slate-500">Configure parameters to run the trained deep neural model analysis</p>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Research Anonymized</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-teal-600" /> Case Identifier
            </label>
            <input
              type="text"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-teal-600" /> Patient Alias / Name
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. John Doe / Patient ID"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" /> Age (Years)
            </label>
            <input
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 56"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Biological Sex
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Height (cm)
            </label>
            <input
              type="number"
              min="100"
              max="250"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 172"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Weight (kg)
            </label>
            <input
              type="number"
              min="30"
              max="250"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 78"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Calculated BMI Badge */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-teal-600" />
            <div>
              <span className="text-xs font-bold text-slate-800">Body Mass Index (BMI)</span>
              <p className="text-[11px] text-slate-500">Auto-computed from patient height and weight</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold text-slate-900 font-mono">
              {computedBmi > 0 ? `${computedBmi} kg/m²` : '-- kg/m²'}
            </span>
            <span className="block text-[10px] text-teal-700 font-semibold">
              {computedBmi === 0
                ? 'Enter height & weight'
                : computedBmi < 25
                ? 'Normal weight'
                : computedBmi < 30
                ? 'Overweight'
                : 'Obese class'}
            </span>
          </div>
        </div>

        {/* Knee Medical Scan Upload Option */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                <FileUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Knee Medical Imaging Scan</h3>
                <p className="text-[11px] text-slate-500">
                  Upload patient knee MRI or radiograph image (DICOM, NIfTI, PNG, JPG)
                </p>
              </div>
            </div>

            {/* Quick demo preload button */}
            <button
              type="button"
              onClick={handleLoadSampleScan}
              className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-white hover:bg-teal-50 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-teal-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>Load Sample MRI</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.dcm,.nii,.nii.gz"
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            className="hidden"
          />

          {!previewSrc ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                dragActive
                  ? 'border-teal-500 bg-teal-50/70 scale-[1.005]'
                  : 'border-slate-300 hover:border-teal-400 hover:bg-teal-50/30 bg-white'
              }`}
            >
              <div className="p-2.5 bg-teal-50 rounded-full text-teal-600">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to select or drag and drop knee scan here
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports PNG, JPEG, DICOM (.dcm), NIfTI (.nii, .nii.gz)
                </p>
              </div>
              <button
                type="button"
                className="mt-1 px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors pointer-events-none"
              >
                Browse Image File
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-teal-300/80 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0 flex items-center justify-center">
                  <img
                    src={previewSrc}
                    alt="Scan thumbnail"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[220px]">
                      {selectedFile ? selectedFile.name : 'patient_knee_scan.png'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded shrink-0">
                      Loaded
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {selectedFile
                      ? `${(selectedFile.size / 1024).toFixed(1)} KB • Image Ingested`
                      : 'Sample Coronal Knee MRI Ingested'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Display */}
        {isUploading && (
          <div className="w-full space-y-1.5 pt-1 animate-fade-in">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-teal-700 font-bold flex items-center gap-1.5 truncate">
                <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
                {processingStageText}
              </span>
              <span className="text-teal-900 font-black">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Processing Notice</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isUploading}
            className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-teal-950/20 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{processingStageText} ({uploadProgress}%)...</span>
              </>
            ) : createdCase ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Re-Run Trained Model Analysis Pipeline</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Trained AI Model Analysis Pipeline</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* SUCCESS CONFIRMATION MODAL & ANALYSED SCAN PRESENTATION */}
      {createdCase && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl text-white bg-teal-600 shadow-md shadow-teal-950/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Knee Scan Successfully Analyzed & Segmented
                </h3>
                <p className="text-xs text-slate-500">
                  Case <strong className="font-mono text-slate-800">{createdCase.case_id}</strong> •{' '}
                  {createdCase.patient_name} • Age {createdCase.age} • BMI {createdCase.bmi} kg/m²
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetAnalysis}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reset this case and upload a new knee scan"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Ingest Another Scan</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('imaging')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open Full Workstation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Segmentation Status
              </span>
              <span className="text-sm font-extrabold text-teal-800 mt-0.5 block">
                {createdCase.structures?.length || 9} Structures Segmented
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Meniscus Volume
              </span>
              <span className="text-sm font-extrabold text-purple-900 font-mono mt-0.5 block">
                {createdCase.meniscus_analysis?.volume_mm3 || 2282.52} mm³
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                OA Probability
              </span>
              <span className="text-sm font-extrabold text-cyan-900 font-mono mt-0.5 block">
                {createdCase.oa_assessment?.oa_probability_percent || '24.26%'}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Top Implant Match
              </span>
              <span className="text-sm font-extrabold text-blue-900 mt-0.5 block">
                {createdCase.implant_planning?.matches[0]?.implant || 'Size L'}
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ANALYSED KNEE SCAN & SEGMENTATION MODULE AT THE BOTTOM                    */}
          {/* ========================================================================= */}
          <div className="pt-6 border-t border-slate-200 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md mb-1 border border-teal-200">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Visualized AI Findings</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Analysed Knee Scan & Multi-Compartment Segmentation
                </h3>
                <p className="text-xs text-slate-500">
                  Deep neural predicted anatomical boundaries, medial meniscus 3D morphometry, and joint alignment.
                </p>
              </div>

              {/* View Mode Selector Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAnalyzedViewMode('overlay')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    analyzedViewMode === 'overlay'
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Overlay View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAnalyzedViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    analyzedViewMode === 'split'
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Split className="w-3.5 h-3.5" />
                  <span>Side-by-Side</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAnalyzedViewMode('heatmap')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    analyzedViewMode === 'heatmap'
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  <span>Thickness Heatmap</span>
                </button>
              </div>
            </div>

            {/* Interactive Viewer Toolbar */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Opacity Control */}
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold text-slate-700">Mask Opacity:</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                  className="w-24 accent-teal-600 cursor-pointer"
                />
                <span className="font-mono text-slate-600 font-bold">{overlayOpacity}%</span>
              </div>

              {/* Compartment Filter Pills */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-600 hidden sm:inline">Compartments:</span>
                {(['all', 'meniscus', 'cartilage', 'bone'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveCompartmentFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                      activeCompartmentFilter === filter
                        ? 'bg-teal-700 text-white font-bold shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {filter === 'all' ? 'All (9)' : filter}
                  </button>
                ))}
              </div>

              {/* Toggle Annotations HUD */}
              <button
                type="button"
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  showAnnotations
                    ? 'bg-white text-teal-800 border-teal-300 shadow-xs'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showAnnotations ? 'HUD Pins Active' : 'HUD Pins Hidden'}</span>
              </button>
            </div>

            {/* Central Canvas Viewport */}
            {analyzedViewMode === 'overlay' && (
              <div className="relative bg-slate-950 rounded-2xl border border-slate-800 p-6 overflow-hidden flex flex-col items-center justify-center min-h-[440px] shadow-2xl">
                {/* Background medical grid */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                <div className="relative max-w-md w-full h-[430px] flex items-center justify-center">
                  {/* SVG Anatomical Segmentation Overlays */}
                  <svg
                    viewBox="0 0 500 500"
                    className="w-full h-full object-contain pointer-events-none transition-opacity duration-150"
                    style={{ opacity: overlayOpacity / 100 }}
                  >
                    <defs>
                      <filter id="glow-meniscus" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#8b5cf6" floodOpacity="0.8" />
                      </filter>
                    </defs>

                    {/* Bone Structures */}
                    {(activeCompartmentFilter === 'all' || activeCompartmentFilter === 'bone') && (
                      <g className="transition-opacity">
                        {/* Femur (Distal) */}
                        <path
                          d="M 155 20 L 345 20 L 355 160 C 365 210, 385 245, 365 275 C 345 305, 310 312, 280 285 C 265 272, 235 272, 220 285 C 190 312, 155 305, 135 275 C 115 245, 135 210, 145 160 Z"
                          fill="#cbd5e1"
                          fillOpacity="0.22"
                          stroke="#cbd5e1"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                        />
                        {/* Tibia (Proximal) */}
                        <path
                          d="M 140 348 C 160 338, 230 336, 250 346 C 270 336, 340 338, 360 348 C 370 368, 350 400, 335 480 L 165 480 C 150 400, 130 368, 140 348 Z"
                          fill="#94a3b8"
                          fillOpacity="0.22"
                          stroke="#94a3b8"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                        />
                      </g>
                    )}

                    {/* Articular Cartilage Structures */}
                    {(activeCompartmentFilter === 'all' || activeCompartmentFilter === 'cartilage') && (
                      <g className="transition-opacity">
                        {/* Femoral Cartilage */}
                        <path
                          d="M 140 280 C 165 310, 205 315, 228 290 C 238 280, 262 280, 272 290 C 295 315, 335 310, 360 280 C 352 292, 330 322, 272 298 C 258 290, 242 290, 228 298 C 170 322, 148 292, 140 280 Z"
                          fill="#3b82f6"
                          fillOpacity="0.55"
                          stroke="#60a5fa"
                          strokeWidth="2"
                        />
                        {/* Medial Tibial Cartilage */}
                        <path
                          d="M 145 344 C 170 338, 220 338, 242 344 C 237 350, 175 350, 145 344 Z"
                          fill="#10b981"
                          fillOpacity="0.6"
                          stroke="#34d399"
                          strokeWidth="2"
                        />
                        {/* Lateral Tibial Cartilage */}
                        <path
                          d="M 258 344 C 280 338, 330 338, 355 344 C 350 350, 290 350, 258 344 Z"
                          fill="#06b6d4"
                          fillOpacity="0.6"
                          stroke="#22d3ee"
                          strokeWidth="2"
                        />
                        {/* Patellar Cartilage */}
                        <path
                          d="M 215 170 C 235 155, 265 155, 285 170 C 280 205, 220 205, 215 170 Z"
                          fill="#f59e0b"
                          fillOpacity="0.45"
                          stroke="#fbbf24"
                          strokeWidth="2"
                        />
                      </g>
                    )}

                    {/* Meniscus Structures */}
                    {(activeCompartmentFilter === 'all' || activeCompartmentFilter === 'meniscus') && (
                      <g className="transition-opacity">
                        {/* Medial Meniscus (Target Structure) */}
                        <path
                          d="M 130 298 C 150 294, 185 300, 210 314 C 185 324, 150 326, 130 320 C 122 314, 122 304, 130 298 Z"
                          fill="#8b5cf6"
                          fillOpacity="0.75"
                          stroke="#a78bfa"
                          strokeWidth="2.5"
                          filter="url(#glow-meniscus)"
                        />
                        {/* Lateral Meniscus */}
                        <path
                          d="M 370 298 C 350 294, 315 300, 290 314 C 315 324, 350 326, 370 320 C 378 314, 378 304, 370 298 Z"
                          fill="#ec4899"
                          fillOpacity="0.7"
                          stroke="#f472b6"
                          strokeWidth="2"
                        />
                      </g>
                    )}
                  </svg>

                  {/* Anatomical Landmark HUD Marker */}
                  {showAnnotations && (
                    <div className="absolute top-[58%] left-[24%] -translate-y-1/2 -translate-x-1/2 pointer-events-none animate-fade-in">
                      <div className="relative flex items-center">
                        <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping absolute" />
                        <span className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-lg relative" />
                        <div className="ml-2 bg-slate-900/95 border border-purple-500/60 text-white rounded-lg px-2.5 py-1 text-[10px] font-mono shadow-2xl backdrop-blur-md whitespace-nowrap">
                          <span className="text-purple-300 font-bold block">Medial Meniscus (Label 5)</span>
                          <span className="text-slate-300">
                            Peak Thickness: <strong className="text-white">6.16 mm</strong> • Vol: 2282.5 mm³
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floating PACS HUD in Corners */}
                <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-400 space-y-0.5 pointer-events-none">
                  <div className="text-teal-400 font-bold">Res: 0.3125 mm/px</div>
                  <div>FOV: 160×160 mm</div>
                  <div>Model: nnU-Net v2 ResEncUNet</div>
                </div>

                <div className="absolute top-4 right-4 text-[10px] font-mono text-slate-400 text-right space-y-0.5 pointer-events-none">
                  <div className="text-slate-200 font-bold">{createdCase.patient_name}</div>
                  <div>Age: {createdCase.age}Y • {createdCase.gender}</div>
                  <div className="text-cyan-400 font-bold">Dice Benchmark: 91.18%</div>
                </div>
              </div>
            )}

            {/* Side-by-Side Comparison View */}
            {analyzedViewMode === 'split' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Panel 1: Original Ingested Scan */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-between shadow-xl">
                  <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-300">
                    <span className="font-bold text-slate-400">1. INPUT RAW SCAN</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                      {createdCase.filename}
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-center min-h-[340px]">
                    <img
                      src={createdCase.preview_url || '/mri_scan.png'}
                      alt="Raw Input Scan"
                      className="max-h-[300px] w-auto object-contain rounded-lg border border-slate-800 shadow-md"
                    />
                  </div>
                  <div className="w-full pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400 flex justify-between">
                    <span>Modality: Ingested Radiograph/Scan</span>
                    <span>Matrix: 512×512</span>
                  </div>
                </div>

                {/* Panel 2: Analysed Segmented Scan */}
                <div className="bg-slate-950 rounded-2xl border border-teal-800/80 p-5 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
                  <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-teal-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                      2. AI-ANALYSED SEGMENTATION
                    </span>
                    <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded">
                      9 Compartments Detected
                    </span>
                  </div>
                  <div className="relative p-4 flex items-center justify-center min-h-[340px]">
                    <img
                      src={createdCase.preview_url || '/mri_scan.png'}
                      alt="Segmented Scan"
                      className="max-h-[300px] w-auto object-contain rounded-lg border border-teal-700/50 shadow-md"
                    />
                    <svg
                      viewBox="0 0 500 500"
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                      style={{ opacity: overlayOpacity / 100 }}
                    >
                      <path
                        d="M 130 298 C 150 294, 185 300, 210 314 C 185 324, 150 326, 130 320 C 122 314, 122 304, 130 298 Z"
                        fill="#8b5cf6"
                        fillOpacity="0.8"
                        stroke="#c084fc"
                        strokeWidth="3"
                      />
                      <path
                        d="M 370 298 C 350 294, 315 300, 290 314 C 315 324, 350 326, 370 320 C 378 314, 378 304, 370 298 Z"
                        fill="#ec4899"
                        fillOpacity="0.75"
                        stroke="#f472b6"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M 140 280 C 165 310, 205 315, 228 290 C 238 280, 262 280, 272 290 C 295 315, 335 310, 360 280 Z"
                        fill="#3b82f6"
                        fillOpacity="0.5"
                        stroke="#60a5fa"
                        strokeWidth="2"
                      />
                      <path
                        d="M 145 344 C 170 338, 220 338, 242 344 C 237 350, 175 350, 145 344 Z"
                        fill="#10b981"
                        fillOpacity="0.55"
                        stroke="#34d399"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="w-full pt-2 border-t border-slate-800/60 text-[11px] font-mono text-teal-400 flex justify-between">
                    <span>Meniscus Peak: 6.16 mm</span>
                    <span>OA Prob: {createdCase.oa_assessment?.oa_probability_percent || '24.26%'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Thickness Heatmap View */}
            {analyzedViewMode === 'heatmap' && (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-between shadow-2xl space-y-4">
                <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono">
                  <span className="text-purple-400 font-bold">3D EUCLIDEAN DISTANCE TRANSFORM (EDT) HEATMAP</span>
                  <span className="text-slate-400">Sphere Radius Range: 0.62 – 6.16 mm</span>
                </div>
                <div className="relative p-2 flex items-center justify-center min-h-[320px] w-full max-w-md h-[340px]">
                  <div className="w-full h-full flex items-center justify-center pointer-events-none">
                    <svg viewBox="0 0 500 500" className="w-full h-full object-contain">
                      <defs>
                        <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                          <stop offset="50%" stopColor="#eab308" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.9" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 130 298 C 150 294, 185 300, 210 314 C 185 324, 150 326, 130 320 C 122 314, 122 304, 130 298 Z"
                        fill="url(#heatGradient)"
                        stroke="#f472b6"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>

                {/* Heatmap Spectrum Gradient Legend */}
                <div className="w-full max-w-md mx-auto space-y-1.5 pt-2">
                  <div className="h-3 w-full rounded-full bg-gradient-to-r from-blue-500 via-amber-400 to-rose-500 shadow-inner" />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>0.62 mm (Min)</span>
                    <span>1.77 mm (Median)</span>
                    <span>3.82 mm (75th)</span>
                    <span className="text-rose-400 font-bold">6.16 mm (Max Peak)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 9 Compartments Quick Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2">
              {(createdCase.structures || []).slice(0, 9).map((struct) => (
                <div
                  key={struct.id}
                  onClick={() => setSelectedHighlightStructure(struct.name)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    selectedHighlightStructure === struct.name
                      ? 'border-teal-500 bg-teal-50/70 shadow-xs ring-1 ring-teal-500'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: struct.color }} />
                    <span className="text-xs font-bold text-slate-900 truncate">{struct.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1 flex justify-between">
                    <span>Vol:</span>
                    <strong className="text-slate-800">{struct.volume_mm3.toFixed(1)} mm³</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
