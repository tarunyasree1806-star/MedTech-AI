import type { Doctor, CaseRecord, BenchmarkEvaluation, ImplantMatch } from '../types';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Kavisika',
    username: 'Kavisika',
    password: 'Kavisika@123',
    role: 'Senior Orthopedic Specialist',
    hospital: 'MediTech Joint Replacement Center',
  },
  {
    id: 'doc-2',
    name: 'Dr. Harichandran',
    username: 'Harichandran',
    password: 'Hari@123',
    role: 'Lead Radiologist & Knee Surgeon',
    hospital: 'MediTech Institute of Orthopedics',
  },
];

export const BENCHMARK_METRICS: BenchmarkEvaluation = {
  segmentation: {
    dataset: 'Dataset500_KneeMRI (multicenter validation cohort)',
    mean_dice_score: 0.9118,
    mean_dice_percentage: '91.18%',
    evaluation_context:
      'Evaluated against consensus expert radiologist ground truth on 3D fullres nnU-Net architecture (ResEncUNetMPlans).',
    per_structure_dice: {
      'Patellar Cartilage': 0.8872,
      'Femoral Cartilage': 0.9234,
      'Medial Tibial Cartilage': 0.9015,
      'Lateral Tibial Cartilage': 0.8950,
      'Medial Meniscus': 0.9120,
      'Lateral Meniscus': 0.9085,
      'Femur': 0.9654,
      'Tibia': 0.9580,
      'Other': 0.8540,
    },
  },
  oa_model: {
    model_type: 'Multivariate Logistic Regression with Elastic Regularization',
    cohort_size: 'Multicenter Osteoarthritis Initiative (OAI) validation cohort (N=1,500)',
    auc: 0.7601,
    accuracy: 0.6927,
    sensitivity: 0.6892,
    specificity: 0.6961,
    precision: 0.6883,
    optimal_threshold: 0.4956,
    youden_index: 0.3852,
    confusion_matrix: {
      true_negatives: 529,
      false_positives: 231,
      false_negatives: 230,
      true_positives: 510,
    },
    odds_ratios: [
      { variable: 'Medial Meniscus Max Thickness', or: 2.3475, ci: '2.0387–2.7030', p_value: '<0.001' },
      { variable: 'Medial Meniscus Median Thickness', or: 4.2005, ci: '2.9756–5.9296', p_value: '<0.001' },
      { variable: 'Age (years)', or: 1.0593, ci: '1.0508–1.0679', p_value: '<0.001' },
      { variable: 'BMI (kg/m²)', or: 1.1739, ci: '1.1560–1.1922', p_value: '<0.001' },
      { variable: 'Male Sex', or: 0.7526, ci: '0.6610–0.8568', p_value: '<0.001' },
    ],
  },
};

export const PROTOTYPE_IMPLANTS = [
  { implant: 'Size S', femoral_x: 55.0, femoral_y: 75.0, tibial_x: 50.0, tibial_y: 60.0 },
  { implant: 'Size M', femoral_x: 60.0, femoral_y: 80.0, tibial_x: 55.0, tibial_y: 65.0 },
  { implant: 'Size L', femoral_x: 65.0, femoral_y: 85.0, tibial_x: 60.0, tibial_y: 70.0 },
  { implant: 'Size XL', femoral_x: 70.0, femoral_y: 90.0, tibial_x: 65.0, tibial_y: 75.0 },
];

export const DEMO_CASE: CaseRecord = {
  case_id: 'CASE-2026-8849',
  patient_name: 'Rajesh Kumar',
  age: 56,
  gender: 'Male',
  bmi: 26.4,
  height_cm: 172.0,
  weight_kg: 78.1,
  modality: '3D_MRI',
  filename: 'knee_mri_3d_axial_coronal.nii.gz',
  file_size_bytes: 173931,
  created_at: '2026-10-24T09:00:00Z',
  status: 'COMPLETED',
  mri_supported: true,
  voxel_spacing: { x: 0.3125, y: 0.3125, z: 0.8001, unit: 'mm' },
  voxel_volume_mm3: 0.078131,
  image_dimensions: { width: 512, height: 512, slices: 160 },
  structures: [
    { id: 1, name: 'Patellar Cartilage', color: '#f59e0b', voxel_count: 30434, volume_mm3: 2377.84, x_extent_mm: 14.06, y_extent_mm: 25.63, z_extent_mm: 40.80 },
    { id: 2, name: 'Femoral Cartilage', color: '#3b82f6', voxel_count: 96614, volume_mm3: 7548.56, x_extent_mm: 52.19, y_extent_mm: 74.38, z_extent_mm: 62.41 },
    { id: 3, name: 'Medial Tibial Cartilage', color: '#10b981', voxel_count: 24586, volume_mm3: 1920.93, x_extent_mm: 32.50, y_extent_mm: 38.75, z_extent_mm: 12.00 },
    { id: 4, name: 'Lateral Tibial Cartilage', color: '#06b6d4', voxel_count: 21331, volume_mm3: 1666.61, x_extent_mm: 29.69, y_extent_mm: 35.00, z_extent_mm: 11.20 },
    { id: 5, name: 'Medial Meniscus', color: '#8b5cf6', voxel_count: 29214, volume_mm3: 2282.52, x_extent_mm: 45.31, y_extent_mm: 9.38, z_extent_mm: 28.80 },
    { id: 6, name: 'Lateral Meniscus', color: '#ec4899', voxel_count: 25110, volume_mm3: 1961.87, x_extent_mm: 41.25, y_extent_mm: 8.75, z_extent_mm: 26.40 },
    { id: 7, name: 'Femur', color: '#cbd5e1', voxel_count: 812400, volume_mm3: 63473.63, x_extent_mm: 62.50, y_extent_mm: 95.63, z_extent_mm: 78.41 },
    { id: 8, name: 'Tibia', color: '#94a3b8', voxel_count: 694200, volume_mm3: 54238.54, x_extent_mm: 58.12, y_extent_mm: 66.25, z_extent_mm: 70.41 },
    { id: 9, name: 'Other / Joint Capsule', color: '#64748b', voxel_count: 82000, volume_mm3: 6406.74, x_extent_mm: 65.00, y_extent_mm: 70.00, z_extent_mm: 72.00 },
  ],
  meniscus_analysis: {
    structure: 'Medial Meniscus',
    voxel_count: 29214,
    volume_mm3: 2282.52,
    thickness_3d: {
      methodology: 'Euclidean Distance Transform (EDT) 3D Sphere Fitting (2.0 * EDT)',
      min_mm: 0.62,
      mean_mm: 2.01,
      median_mm: 1.77,
      max_mm: 6.16,
      unpruned_max_mm: 6.88,
      percentiles: [
        { percentile: '10th', value_mm: 0.95 },
        { percentile: '25th', value_mm: 1.32 },
        { percentile: '50th (Median)', value_mm: 1.77 },
        { percentile: '75th', value_mm: 2.45 },
        { percentile: '90th', value_mm: 3.82 },
        { percentile: '95th', value_mm: 5.10 },
      ],
    },
    single_axis_thickness: {
      methodology: 'Z-axis coordinate span across coronal slices',
      min_mm: 0.80,
      mean_mm: 9.54,
      median_mm: 6.40,
      max_mm: 25.60,
    },
  },
  oa_assessment: {
    raw_logit: -1.0028,
    oa_probability: 0.2426,
    oa_probability_percent: '24.26%',
    classification: 'Low Risk / Non-Progressive',
    threshold_used: 0.4956,
    is_elevated: false,
    feature_contributions: {
      max_thickness_contrib: 5.256,
      median_thickness_contrib: 2.540,
      age_contrib: 3.226,
      bmi_contrib: 4.232,
      sex_male_contrib: -0.284,
      intercept: -15.973,
    },
  },
  implant_planning: {
    patient_dimensions: {
      femoral_x: 62.50,
      femoral_y: 95.63,
      tibial_x: 58.12,
      tibial_y: 66.25,
    },
    matches: [
      { rank: '#1', implant: 'Size L', femoral_x: 65, femoral_y: 85, tibial_x: 60, tibial_y: 70, femoral_error: 13.13, tibial_error: 5.63, total_error: 18.76, is_best: true },
      { rank: '#2', implant: 'Size M', femoral_x: 60, femoral_y: 80, tibial_x: 55, tibial_y: 65, femoral_error: 18.13, tibial_error: 4.37, total_error: 22.50, is_best: false },
      { rank: '#3', implant: 'Size XL', femoral_x: 70, femoral_y: 90, tibial_x: 65, tibial_y: 75, femoral_error: 13.13, tibial_error: 15.63, total_error: 28.76, is_best: false },
      { rank: '#4', implant: 'Size S', femoral_x: 55, femoral_y: 75, tibial_x: 50, tibial_y: 60, femoral_error: 28.13, tibial_error: 14.37, total_error: 42.50, is_best: false },
    ],
    rationale:
      'Size L minimizes the combined mediolateral and anteroposterior mismatch across both femoral and tibial cut surfaces (total error: 18.76 mm).',
  },
  benchmark: BENCHMARK_METRICS,
  preview_url: '/mri_scan.png',
};

export function calculateLiveOAProbability(
  maxThickness: number,
  medianThickness: number,
  age: number,
  bmi: number,
  isMale: boolean
) {
  const z =
    -15.9727 +
    0.8533 * maxThickness +
    1.4352 * medianThickness +
    0.0576 * age +
    0.1603 * bmi +
    -0.2842 * (isMale ? 1.0 : 0.0);

  const prob = 1.0 / (1.0 + Math.exp(-z));
  const threshold = BENCHMARK_METRICS.oa_model.optimal_threshold;

  return {
    raw_logit: Number(z.toFixed(4)),
    oa_probability: Number(prob.toFixed(4)),
    oa_probability_percent: `${(prob * 100).toFixed(2)}%`,
    classification: prob >= threshold ? 'Moderate / Elevated Risk' : 'Low Risk / Non-Progressive',
    threshold_used: threshold,
    is_elevated: prob >= threshold,
    feature_contributions: {
      max_thickness_contrib: Number((0.8533 * maxThickness).toFixed(3)),
      median_thickness_contrib: Number((1.4352 * medianThickness).toFixed(3)),
      age_contrib: Number((0.0576 * age).toFixed(3)),
      bmi_contrib: Number((0.1603 * bmi).toFixed(3)),
      sex_male_contrib: Number((-0.2842 * (isMale ? 1.0 : 0.0)).toFixed(3)),
      intercept: -15.973,
    },
  };
}

export function calculateLiveImplantMatches(
  femurX: number,
  femurY: number,
  tibiaX: number,
  tibiaY: number
): ImplantMatch[] {
  const list: ImplantMatch[] = PROTOTYPE_IMPLANTS.map((imp) => {
    const fErr = Math.abs(imp.femoral_x - femurX) + Math.abs(imp.femoral_y - femurY);
    const tErr = Math.abs(imp.tibial_x - tibiaX) + Math.abs(imp.tibial_y - tibiaY);
    const totErr = fErr + tErr;
    return {
      rank: '',
      implant: imp.implant,
      femoral_x: imp.femoral_x,
      femoral_y: imp.femoral_y,
      tibial_x: imp.tibial_x,
      tibial_y: imp.tibial_y,
      femoral_error: Number(fErr.toFixed(2)),
      tibial_error: Number(tErr.toFixed(2)),
      total_error: Number(totErr.toFixed(2)),
      is_best: false,
    };
  });

  list.sort((a, b) => a.total_error - b.total_error);
  list.forEach((item, idx) => {
    item.rank = `#${idx + 1}`;
    item.is_best = idx === 0;
  });

  return list;
}

export const DEFAULT_OA_RESULT = {
  meanDiceScore: '91.18%',
  femurDimension: '62.50 × 95.63 × 78.41 mm',
  tibiaDimension: '58.12 × 66.25 × 70.41 mm',
  cartilageVolumes: [
    { structure: 'Femoral cartilage', volume: '7548.56 mm³' },
    { structure: 'Medial tibial cartilage', volume: '1920.93 mm³' },
    { structure: 'Lateral tibial cartilage', volume: '1666.61 mm³' },
    { structure: 'Patellar cartilage', volume: '2377.84 mm³' },
  ],
  medialMeniscus: {
    voxelCount: '29,214',
    volume: '2282.52 mm³',
    thickness: {
      min: '0.62 mm',
      mean: '2.01 mm',
      median: '1.77 mm',
      max: '6.16 mm',
    },
  },
  mainResultProbability: '24.26%',
  combinedModel: {
    auc: '0.7601',
    sensitivity: '68.92%',
    specificity: '69.61%',
    accuracy: '69.27%',
    precision: '68.83%',
    oaProbability: '24.26%',
  },
  imageSrc: '/mri_scan.png',
};

export const IMPLANT_DATA = {
  femur: { x: '62.50 mm', y: '95.63 mm' },
  tibia: { x: '58.12 mm', y: '66.25 mm' },
  primary: {
    size: 'SIZE L',
    rank: '#1',
    femoralError: '13.13 mm',
    tibialError: '5.63 mm',
    totalError: '18.76 mm',
  },
  alternatives: [
    { rank: '🥇 Size L', implant: 'Size L', totalError: '18.76 mm', isBest: true, femoralError: '13.13 mm', tibialError: '5.63 mm' },
    { rank: '2', implant: 'Size M', totalError: '22.50 mm', isBest: false, femoralError: '15.40 mm', tibialError: '7.10 mm' },
    { rank: '3', implant: 'Size XL', totalError: '28.76 mm', isBest: false, femoralError: '20.12 mm', tibialError: '8.64 mm' },
    { rank: '4', implant: 'Size S', totalError: '42.50 mm', isBest: false, femoralError: '28.50 mm', tibialError: '14.00 mm' },
  ],
};
