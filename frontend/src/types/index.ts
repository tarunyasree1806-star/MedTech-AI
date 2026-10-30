export interface Doctor {
  id: string;
  name: string;
  username: string;
  password: string;
  role: string;
  hospital: string;
}

export interface PatientInfo {
  name: string;
  patientId: string;
  age: string;
  gender: string;
  bmi: string;
}

export interface CartilageVolume {
  structure: string;
  volume: string;
}

export interface LocalThickness {
  min: string;
  mean: string;
  median: string;
  max: string;
}

export interface LegacyMeniscusAnalysis {
  voxelCount: string;
  volume: string;
  thickness: LocalThickness;
}

export interface ModelMetrics {
  auc: string;
  sensitivity: string;
  specificity: string;
  accuracy: string;
  precision: string;
  oaProbability: string;
}

export interface OAResult {
  meanDiceScore: string;
  femurDimension: string;
  tibiaDimension: string;
  cartilageVolumes: CartilageVolume[];
  medialMeniscus: LegacyMeniscusAnalysis;
  mainResultProbability: string;
  combinedModel: ModelMetrics;
  imageSrc: string;
}

export interface ImplantOption {
  rank: number | string;
  implant: string;
  totalError: string;
  isBest?: boolean;
  femoralError?: string;
  tibialError?: string;
}

export type WorkflowStage =
  | 'overview'
  | 'upload'
  | 'imaging'
  | 'segmentation'
  | 'measurements'
  | 'meniscus'
  | 'oa-assessment'
  | 'implant-planning'
  | 'final-report';

export type StageProcessingStatus =
  | 'not_started'
  | 'upload_required'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'results_unavailable'
  | 'modality_mismatch';

export type ImagingModality = '3D_MRI' | '2D_XRAY';

export interface VoxelSpacing {
  x: number;
  y: number;
  z: number;
  unit: string;
}

export interface AnatomicalStructure {
  id: number;
  name: string;
  color: string;
  voxel_count: number;
  volume_mm3: number;
  x_extent_mm: number;
  y_extent_mm: number;
  z_extent_mm: number;
}

export interface ThicknessPercentile {
  percentile: string;
  value_mm: number;
}

export interface MeniscusThickness3D {
  methodology: string;
  min_mm: number;
  mean_mm: number;
  median_mm: number;
  max_mm: number;
  unpruned_max_mm?: number;
  percentiles: ThicknessPercentile[];
}

export interface SingleAxisThickness {
  methodology: string;
  min_mm: number;
  mean_mm: number;
  median_mm: number;
  max_mm: number;
}

export interface MeniscusAnalysis {
  structure: string;
  voxel_count: number;
  volume_mm3: number;
  thickness_3d: MeniscusThickness3D;
  single_axis_thickness: SingleAxisThickness;
}

export interface OAModelAssessment {
  raw_logit: number;
  oa_probability: number;
  oa_probability_percent: string;
  classification: string;
  threshold_used: number;
  is_elevated: boolean;
  feature_contributions: Record<string, number>;
}

export interface ImplantMatch {
  rank: string;
  implant: string;
  femoral_x: number;
  femoral_y: number;
  tibial_x: number;
  tibial_y: number;
  femoral_error: number;
  tibial_error: number;
  total_error: number;
  is_best: boolean;
}

export interface ImplantPlanning {
  patient_dimensions: {
    femoral_x: number;
    femoral_y: number;
    tibial_x: number;
    tibial_y: number;
  };
  matches: ImplantMatch[];
  rationale: string;
}

export interface BenchmarkEvaluation {
  segmentation: {
    dataset: string;
    mean_dice_score: number;
    mean_dice_percentage: string;
    evaluation_context: string;
    per_structure_dice: Record<string, number>;
  };
  oa_model: {
    model_type: string;
    cohort_size: string;
    auc: number;
    accuracy: number;
    sensitivity: number;
    specificity: number;
    precision: number;
    optimal_threshold: number;
    youden_index: number;
    confusion_matrix: {
      true_negatives: number;
      false_positives: number;
      false_negatives: number;
      true_positives: number;
    };
    odds_ratios: Array<{
      variable: string;
      or: number;
      ci: string;
      p_value: string;
    }>;
  };
}

export interface CaseRecord {
  case_id: string;
  patient_name: string;
  age: number;
  gender: string;
  bmi: number;
  height_cm?: number;
  weight_kg?: number;
  modality: ImagingModality;
  filename: string;
  file_size_bytes: number;
  status: string;
  mri_supported?: boolean;
  error_message?: string;
  created_at?: string;
  voxel_spacing?: VoxelSpacing;
  voxel_volume_mm3?: number;
  image_dimensions?: {
    width: number;
    height: number;
    slices: number;
  };
  structures?: AnatomicalStructure[];
  meniscus_analysis?: MeniscusAnalysis;
  oa_assessment?: OAModelAssessment;
  implant_planning?: ImplantPlanning;
  benchmark?: BenchmarkEvaluation;
  preview_url?: string;
}

export interface CaseSummaryItem {
  case_id: string;
  patient_name: string;
  age?: number;
  gender?: string;
  bmi?: number;
  modality?: ImagingModality;
  status?: string;
  created_at?: string;
  oa_probability?: string;
  recommended_implant?: string;
}
