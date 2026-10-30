import { useState } from 'react';
import type { Doctor, WorkflowStage, CaseRecord, CaseSummaryItem } from './types';
import { INITIAL_DOCTORS, DEMO_CASE } from './data/initialData';
import { fetchCase } from './services/api';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './components/views/OverviewView';
import { NewAnalysisView } from './components/views/NewAnalysisView';
import { ImagingWorkspaceView } from './components/views/ImagingWorkspaceView';
import { SegmentationView } from './components/views/SegmentationView';
import { ThreeDAnatomyView } from './components/views/ThreeDAnatomyView';
import { MeasurementsView } from './components/views/MeasurementsView';
import { MeniscusView } from './components/views/MeniscusView';
import { OAAssessmentView } from './components/views/OAAssessmentView';
import { ImplantPlanningView } from './components/views/ImplantPlanningView';
import { FinalReportView } from './components/views/FinalReportView';

export function App() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(INITIAL_DOCTORS[0]);
  const [activeStage, setActiveStage] = useState<WorkflowStage>('overview');

  // Case State Management
  const [currentCase, setCurrentCase] = useState<CaseRecord | null>(DEMO_CASE);
  const [casesList, setCasesList] = useState<CaseSummaryItem[]>([
    {
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
    },
  ]);



  const handleLogin = (doctor: Doctor) => {
    setCurrentDoctor(doctor);
  };

  const handleSignUp = (newDoctor: Doctor) => {
    setDoctors((prev) => [...prev, newDoctor]);
  };

  const handleLogout = () => {
    setCurrentDoctor(null);
  };

  const handleSelectCase = async (caseId: string) => {
    try {
      const c = await fetchCase(caseId);
      setCurrentCase(c);
    } catch {
      if (caseId === DEMO_CASE.case_id) {
        setCurrentCase(DEMO_CASE);
      }
    }
  };

  const handleCaseCreated = (newCase: CaseRecord) => {
    setCurrentCase(newCase);
    setCasesList((prev) => [
      {
        case_id: newCase.case_id,
        patient_name: newCase.patient_name,
        age: newCase.age,
        gender: newCase.gender,
        bmi: newCase.bmi,
        modality: newCase.modality,
        status: newCase.status,
        created_at: new Date().toISOString(),
        oa_probability: newCase.oa_assessment?.oa_probability_percent,
        recommended_implant: newCase.implant_planning?.matches[0]?.implant,
      },
      ...prev.filter((c) => c.case_id !== newCase.case_id),
    ]);
  };

  if (!currentDoctor) {
    return (
      <Login
        doctors={doctors}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Persistent Desktop Sidebar */}
      <Sidebar
        activeStage={activeStage}
        setActiveStage={setActiveStage}
        doctor={currentDoctor}
        onLogout={handleLogout}
        currentCase={currentCase}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Unified Top Header Bar */}
        <Header
          doctor={currentDoctor}
          activeStage={activeStage}
          currentCase={currentCase}
          onNavigateStage={setActiveStage}
        />

        {/* Dynamic Workflow View Content: Retained in DOM so state/analyzed data is preserved across navigation until page refresh */}
        <main className="flex-1 bg-slate-50 pb-16">
          <div className={activeStage === 'overview' ? 'block' : 'hidden'}>
            <OverviewView
              currentCase={currentCase}
              casesList={casesList}
              onSelectCase={handleSelectCase}
              onNavigate={setActiveStage}
            />
          </div>

          <div className={activeStage === 'upload' ? 'block' : 'hidden'}>
            <NewAnalysisView
              currentCase={currentCase}
              onCaseCreated={handleCaseCreated}
              onNavigate={setActiveStage}
            />
          </div>

          <div className={activeStage === 'imaging' ? 'block' : 'hidden'}>
            <ImagingWorkspaceView currentCase={currentCase} />
          </div>

          <div className={activeStage === 'segmentation' ? 'block' : 'hidden'}>
            <div className="space-y-6">
              <ThreeDAnatomyView currentCase={currentCase} />
              <SegmentationView currentCase={currentCase} />
            </div>
          </div>

          <div className={activeStage === 'measurements' ? 'block' : 'hidden'}>
            <MeasurementsView currentCase={currentCase} />
          </div>

          <div className={activeStage === 'meniscus' ? 'block' : 'hidden'}>
            <MeniscusView currentCase={currentCase} />
          </div>

          <div className={activeStage === 'oa-assessment' ? 'block' : 'hidden'}>
            <OAAssessmentView currentCase={currentCase} />
          </div>

          <div className={activeStage === 'implant-planning' ? 'block' : 'hidden'}>
            <ImplantPlanningView currentCase={currentCase} />
          </div>

          <div className={activeStage === 'final-report' ? 'block' : 'hidden'}>
            <FinalReportView currentCase={currentCase} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
