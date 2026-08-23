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

export interface MeniscusAnalysis {
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
  medialMeniscus: MeniscusAnalysis;
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
