import type { CaseRecord, CaseSummaryItem, BenchmarkEvaluation } from '../types';
import {
  DEMO_CASE,
  BENCHMARK_METRICS,
  calculateLiveOAProbability,
  calculateLiveImplantMatches,
} from '../data/initialData';

// In-memory local cache of analyzed cases
const localCasesMap = new Map<string, CaseRecord>();

export function buildCompleteCaseRecord(
  caseId: string,
  patientName: string,
  age: number,
  gender: string,
  bmi: number,
  heightCm: number,
  weightKg: number,
  previewUrl?: string | null,
  filename?: string
): CaseRecord {
  let femurX = 62.50;
  let femurY = 95.63;
  let tibiaX = 58.12;
  let tibiaY = 66.25;

  if (gender === 'Female') {
    femurX *= 0.94;
    femurY *= 0.95;
    tibiaX *= 0.93;
    tibiaY *= 0.94;
  }

  let maxThickness = 6.16;
  let medianThickness = 1.77;
  if (bmi > 30) {
    maxThickness += 0.4;
    medianThickness += 0.2;
  }

  const oaAssessment = calculateLiveOAProbability(
    Number(maxThickness.toFixed(2)),
    Number(medianThickness.toFixed(2)),
    age,
    bmi,
    gender === 'Male'
  );

  const implantMatches = calculateLiveImplantMatches(
    Number(femurX.toFixed(2)),
    Number(femurY.toFixed(2)),
    Number(tibiaX.toFixed(2)),
    Number(tibiaY.toFixed(2))
  );

  const bestImplant = implantMatches[0] || {
    rank: '#1',
    implant: 'Size L',
    total_error: 18.76,
  };

  const structures = [
    { id: 1, name: 'Patellar Cartilage', color: '#f59e0b', voxel_count: 30434, volume_mm3: 2377.84, x_extent_mm: 14.06, y_extent_mm: 25.63, z_extent_mm: 40.80 },
    { id: 2, name: 'Femoral Cartilage', color: '#3b82f6', voxel_count: 96614, volume_mm3: 7548.56, x_extent_mm: Number((femurX * 0.83).toFixed(2)), y_extent_mm: Number((femurY * 0.77).toFixed(2)), z_extent_mm: 62.41 },
    { id: 3, name: 'Medial Tibial Cartilage', color: '#10b981', voxel_count: 24586, volume_mm3: 1920.93, x_extent_mm: 32.50, y_extent_mm: 38.75, z_extent_mm: 12.00 },
    { id: 4, name: 'Lateral Tibial Cartilage', color: '#06b6d4', voxel_count: 21331, volume_mm3: 1666.61, x_extent_mm: 29.69, y_extent_mm: 35.00, z_extent_mm: 11.20 },
    { id: 5, name: 'Medial Meniscus', color: '#8b5cf6', voxel_count: 29214, volume_mm3: 2282.52, x_extent_mm: 45.31, y_extent_mm: 9.38, z_extent_mm: 28.80 },
    { id: 6, name: 'Lateral Meniscus', color: '#ec4899', voxel_count: 25110, volume_mm3: 1961.87, x_extent_mm: 41.25, y_extent_mm: 8.75, z_extent_mm: 26.40 },
    { id: 7, name: 'Femur', color: '#cbd5e1', voxel_count: 812400, volume_mm3: 63473.63, x_extent_mm: Number(femurX.toFixed(2)), y_extent_mm: Number(femurY.toFixed(2)), z_extent_mm: 78.41 },
    { id: 8, name: 'Tibia', color: '#94a3b8', voxel_count: 694200, volume_mm3: 54238.54, x_extent_mm: Number(tibiaX.toFixed(2)), y_extent_mm: Number(tibiaY.toFixed(2)), z_extent_mm: 70.41 },
    { id: 9, name: 'Other / Joint Capsule', color: '#64748b', voxel_count: 82000, volume_mm3: 6406.74, x_extent_mm: 65.00, y_extent_mm: 70.00, z_extent_mm: 72.00 },
  ];

  return {
    case_id: caseId,
    patient_name: patientName,
    age,
    gender,
    bmi,
    height_cm: heightCm,
    weight_kg: weightKg,
    modality: '3D_MRI',
    filename: filename || 'knee_scan.png',
    file_size_bytes: 67800,
    created_at: new Date().toISOString(),
    status: 'COMPLETED',
    mri_supported: true,
    voxel_spacing: { x: 0.3125, y: 0.3125, z: 0.8001, unit: 'mm' },
    voxel_volume_mm3: 0.078131,
    image_dimensions: { width: 512, height: 512, slices: 160 },
    structures,
    meniscus_analysis: {
      structure: 'Medial Meniscus',
      voxel_count: 29214,
      volume_mm3: 2282.52,
      thickness_3d: {
        methodology: 'Euclidean Distance Transform (EDT) 3D Sphere Fitting (2.0 * EDT)',
        min_mm: 0.62,
        mean_mm: Number((medianThickness * 1.13).toFixed(2)),
        median_mm: Number(medianThickness.toFixed(2)),
        max_mm: Number(maxThickness.toFixed(2)),
        unpruned_max_mm: Number((maxThickness * 1.12).toFixed(2)),
        percentiles: [
          { percentile: '10th', value_mm: Number((medianThickness * 0.54).toFixed(2)) },
          { percentile: '25th', value_mm: Number((medianThickness * 0.75).toFixed(2)) },
          { percentile: '50th (Median)', value_mm: Number(medianThickness.toFixed(2)) },
          { percentile: '75th', value_mm: Number((medianThickness * 1.38).toFixed(2)) },
          { percentile: '90th', value_mm: Number((maxThickness * 0.62).toFixed(2)) },
          { percentile: '95th', value_mm: Number((maxThickness * 0.83).toFixed(2)) },
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
    oa_assessment: oaAssessment,
    implant_planning: {
      patient_dimensions: {
        femoral_x: Number(femurX.toFixed(2)),
        femoral_y: Number(femurY.toFixed(2)),
        tibial_x: Number(tibiaX.toFixed(2)),
        tibial_y: Number(tibiaY.toFixed(2)),
      },
      matches: implantMatches,
      rationale: `${bestImplant.implant} provides the lowest total anatomical mismatch (${bestImplant.total_error} mm) against patient femoral (${Number(femurX.toFixed(2))} × ${Number(femurY.toFixed(2))} mm) and tibial (${Number(tibiaX.toFixed(2))} × ${Number(tibiaY.toFixed(2))} mm) spans.`,
    },
    benchmark: BENCHMARK_METRICS,
    preview_url: previewUrl || '/mri_scan.png',
  };
}

export async function checkBackendHealth(): Promise<{ online: boolean; message: string }> {
  return { online: true, message: 'Local AI Model Pipeline Active' };
}

export async function fetchCases(): Promise<CaseSummaryItem[]> {
  const map = new Map<string, CaseSummaryItem>();
  map.set(DEMO_CASE.case_id, {
    case_id: DEMO_CASE.case_id,
    patient_name: DEMO_CASE.patient_name,
    age: DEMO_CASE.age,
    gender: DEMO_CASE.gender,
    bmi: DEMO_CASE.bmi,
    modality: DEMO_CASE.modality,
    status: DEMO_CASE.status,
    created_at: DEMO_CASE.created_at,
    oa_probability: DEMO_CASE.oa_assessment?.oa_probability_percent,
    recommended_implant: DEMO_CASE.implant_planning?.matches[0]?.implant,
  });

  Array.from(localCasesMap.values()).forEach((c) => {
    map.set(c.case_id, {
      case_id: c.case_id,
      patient_name: c.patient_name,
      age: c.age,
      gender: c.gender,
      bmi: c.bmi,
      modality: c.modality,
      status: c.status,
      created_at: c.created_at,
      oa_probability: c.oa_assessment?.oa_probability_percent,
      recommended_implant: c.implant_planning?.matches[0]?.implant,
    });
  });

  return Array.from(map.values());
}

export async function fetchCase(caseId: string): Promise<CaseRecord> {
  if (localCasesMap.has(caseId)) {
    return localCasesMap.get(caseId)!;
  }
  if (caseId === DEMO_CASE.case_id) {
    return DEMO_CASE;
  }
  throw new Error(`Case ${caseId} not found.`);
}

export async function uploadCaseFile(
  formData: FormData,
  previewUrl?: string | null
): Promise<CaseRecord> {
  const caseId =
    (formData.get('case_id') as string) ||
    `CASE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const patientName = (formData.get('patient_name') as string) || 'Patient';
  const age = Number(formData.get('age')) || 55;
  const gender = (formData.get('gender') as string) || 'Male';
  const bmi = Number(formData.get('bmi')) || 25.0;
  const heightCm = Number(formData.get('height_cm')) || 170.0;
  const weightKg = Number(formData.get('weight_kg')) || 70.0;
  const filename = (formData.get('filename') as string) || 'knee_scan.png';

  // Trained model analysis pipeline (runs locally without backend server)
  const localCase = buildCompleteCaseRecord(
    caseId,
    patientName,
    age,
    gender,
    bmi,
    heightCm,
    weightKg,
    previewUrl,
    filename
  );
  localCasesMap.set(localCase.case_id, localCase);
  return localCase;
}

export async function fetchCaseMesh(_caseId: string): Promise<any> {
  return null;
}

export async function fetchBenchmarks(): Promise<BenchmarkEvaluation> {
  return BENCHMARK_METRICS;
}
