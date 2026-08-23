import type { Doctor, OAResult, ImplantOption } from '../types';

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

export const DEFAULT_OA_RESULT: OAResult = {
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
  ] as ImplantOption[],
};
