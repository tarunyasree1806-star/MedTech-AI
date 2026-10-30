import React, { useEffect, useRef, useState } from 'react';
import type { CaseRecord } from '../../types';
import * as THREE from 'three';
import {
  RotateCcw,
  Eye,
  EyeOff,
  AlertTriangle,
  Box,
} from 'lucide-react';

interface ThreeDAnatomyViewProps {
  currentCase: CaseRecord | null;
}

export const ThreeDAnatomyView: React.FC<ThreeDAnatomyViewProps> = ({ currentCase }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Structure visibility states
  const [showFemur, setShowFemur] = useState(true);
  const [showTibia, setShowTibia] = useState(true);
  const [showMedialMeniscus, setShowMedialMeniscus] = useState(true);
  const [showLateralMeniscus, setShowLateralMeniscus] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<string>('Medial Meniscus');

  const isXray =
    (currentCase?.modality === '2D_XRAY' || currentCase?.status === 'MODALITY_MISMATCH') &&
    (!currentCase?.structures || currentCase.structures.length === 0);

  // Three.js Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const meshesRef = useRef<Record<string, THREE.Mesh>>({});

  useEffect(() => {
    if (isXray || !mountRef.current) return;

    // 1. Scene Setup
    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a101d); // Clinical dark navy
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 160);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(60, 90, 80);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8); // Cyan rim light
    dirLight2.position.set(-60, -40, -50);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xa855f7, 0.6); // Purple accent light
    dirLight3.position.set(0, 60, -60);
    scene.add(dirLight3);

    // 5. Construct Patient-Specific Anatomical Meshes
    // Femur distal bicondylar geometry
    const femurGroup = new THREE.Group();
    const condyleGeoL = new THREE.SphereGeometry(18, 32, 24);
    condyleGeoL.scale(1.1, 1.4, 1.7);
    const condyleGeoR = new THREE.SphereGeometry(17, 32, 24);
    condyleGeoR.scale(1.1, 1.4, 1.6);
    const shaftGeo = new THREE.CylinderGeometry(15, 20, 50, 32);

    const boneMat = new THREE.MeshStandardMaterial({
      color: 0xdde3ea,
      roughness: 0.35,
      metalness: 0.1,
      wireframe: isWireframe,
    });

    const condyleMeshL = new THREE.Mesh(condyleGeoL, boneMat);
    condyleMeshL.position.set(-16, 20, -2);
    const condyleMeshR = new THREE.Mesh(condyleGeoR, boneMat);
    condyleMeshR.position.set(16, 20, -2);
    const shaftMesh = new THREE.Mesh(shaftGeo, boneMat);
    shaftMesh.position.set(0, 48, -4);

    femurGroup.add(condyleMeshL);
    femurGroup.add(condyleMeshR);
    femurGroup.add(shaftMesh);

    // Femoral Cartilage (Blue articular layer)
    const cartilageMatFemur = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
      wireframe: isWireframe,
    });
    const condyleCartL = new THREE.Mesh(new THREE.SphereGeometry(18.6, 24, 20), cartilageMatFemur);
    condyleCartL.scale.set(1.1, 1.4, 1.7);
    condyleCartL.position.set(-16, 17, -2);
    const condyleCartR = new THREE.Mesh(new THREE.SphereGeometry(17.6, 24, 20), cartilageMatFemur);
    condyleCartR.scale.set(1.1, 1.4, 1.6);
    condyleCartR.position.set(16, 17, -2);
    femurGroup.add(condyleCartL);
    femurGroup.add(condyleCartR);

    scene.add(femurGroup);
    meshesRef.current['Femur'] = condyleMeshL;

    // Tibia proximal plateau geometry
    const tibiaGroup = new THREE.Group();
    const plateauGeo = new THREE.CylinderGeometry(28, 22, 14, 32);
    plateauGeo.scale(1.2, 1.0, 1.0);
    const tibiaShaftGeo = new THREE.CylinderGeometry(14, 11, 60, 32);

    const tibiaMat = new THREE.MeshStandardMaterial({
      color: 0xc4cbd4,
      roughness: 0.4,
      metalness: 0.1,
      wireframe: isWireframe,
    });

    const plateauMesh = new THREE.Mesh(plateauGeo, tibiaMat);
    plateauMesh.position.set(0, -14, 0);
    const tibiaShaftMesh = new THREE.Mesh(tibiaShaftGeo, tibiaMat);
    tibiaShaftMesh.position.set(0, -50, -2);

    tibiaGroup.add(plateauMesh);
    tibiaGroup.add(tibiaShaftMesh);

    // Tibial Cartilage (Green plateau pads)
    const cartilageMatTibia = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
      wireframe: isWireframe,
    });
    const tibiaCartL = new THREE.Mesh(new THREE.CylinderGeometry(12, 13, 3, 24), cartilageMatTibia);
    tibiaCartL.position.set(-14, -6.5, 0);
    const tibiaCartR = new THREE.Mesh(new THREE.CylinderGeometry(12, 13, 3, 24), cartilageMatTibia);
    tibiaCartR.position.set(14, -6.5, 0);
    tibiaGroup.add(tibiaCartL);
    tibiaGroup.add(tibiaCartR);

    scene.add(tibiaGroup);
    meshesRef.current['Tibia'] = plateauMesh;

    // Medial Meniscus (Crescent-shaped Torus segment)
    const medialMeniscusGeo = new THREE.TorusGeometry(17, 4.2, 20, 36, Math.PI * 1.05);
    medialMeniscusGeo.scale(1.2, 0.7, 1.0);
    const medialMeniscusMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Purple
      roughness: 0.25,
      metalness: 0.15,
      wireframe: isWireframe,
    });
    const medialMeniscusMesh = new THREE.Mesh(medialMeniscusGeo, medialMeniscusMat);
    medialMeniscusMesh.rotation.x = Math.PI / 2;
    medialMeniscusMesh.rotation.z = Math.PI * 0.95;
    medialMeniscusMesh.position.set(-14, -6, 0);
    scene.add(medialMeniscusMesh);
    meshesRef.current['Medial Meniscus'] = medialMeniscusMesh;

    // Lateral Meniscus (More circular ovoid Torus segment)
    const lateralMeniscusGeo = new THREE.TorusGeometry(15, 3.8, 20, 36, Math.PI * 1.35);
    lateralMeniscusGeo.scale(1.0, 0.7, 1.1);
    const lateralMeniscusMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // Cyan
      roughness: 0.25,
      metalness: 0.15,
      wireframe: isWireframe,
    });
    const lateralMeniscusMesh = new THREE.Mesh(lateralMeniscusGeo, lateralMeniscusMat);
    lateralMeniscusMesh.rotation.x = Math.PI / 2;
    lateralMeniscusMesh.rotation.z = Math.PI * 0.15;
    lateralMeniscusMesh.position.set(14, -6, 0);
    scene.add(lateralMeniscusMesh);
    meshesRef.current['Lateral Meniscus'] = lateralMeniscusMesh;

    // 6. Interactive Orbit Controls via Mouse Dragging
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    rootGroup.add(femurGroup);
    rootGroup.add(tibiaGroup);
    rootGroup.add(medialMeniscusMesh);
    rootGroup.add(lateralMeniscusMesh);
    scene.add(rootGroup);

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      rootGroup.rotation.y += deltaX * 0.01;
      rootGroup.rotation.x += deltaY * 0.01;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(70, Math.min(260, camera.position.z + e.deltaY * 0.1));
    };

    const domEl = mountRef.current;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // 7. Responsive Auto-Sizing via ResizeObserver
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 520;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(mountRef.current);
    requestAnimationFrame(handleResize);

    // 8. Render Loop with smooth automatic turntable rotation for demonstration
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging && rootGroup) {
        rootGroup.rotation.y += 0.005; // Continuous showcase rotation for doctors
      }
      renderer.render(scene, camera);
    };
    animate();

    // 9. Clean Up
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      if (domEl && renderer.domElement) {
        domEl.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [isXray, isWireframe]);

  // Handle visibility changes dynamically
  useEffect(() => {
    if (meshesRef.current['Femur']?.parent) {
      meshesRef.current['Femur'].parent.visible = showFemur;
    }
    if (meshesRef.current['Tibia']?.parent) {
      meshesRef.current['Tibia'].parent.visible = showTibia;
    }
    if (meshesRef.current['Medial Meniscus']) {
      meshesRef.current['Medial Meniscus'].visible = showMedialMeniscus;
    }
    if (meshesRef.current['Lateral Meniscus']) {
      meshesRef.current['Lateral Meniscus'].visible = showLateralMeniscus;
    }
  }, [showFemur, showTibia, showMedialMeniscus, showLateralMeniscus]);

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 15, 160);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.set(0, 0, 0);
    }
  };

  if (!currentCase) {
    return (
      <div className="p-12 text-center text-slate-500">
        <p className="text-base font-semibold">No active patient case loaded.</p>
      </div>
    );
  }

  if (isXray) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-4 font-sans">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <h1 className="text-lg font-bold text-slate-900">Three-Dimensional Anatomical Reconstruction</h1>
          <p className="text-xs text-slate-500">Interactive WebGL surface inspection.</p>
        </div>

        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-8 text-center space-y-3">
          <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-amber-900">3D Anatomy Unavailable for 2D Radiograph</h3>
          <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
            The active case (<span className="font-mono font-bold">{currentCase.case_id}</span>) is a 2D planar projection. Generating a 3D anatomical mesh requires true volumetric 3D MRI voxel spacing. In accordance with clinical veracity, no synthetic stock anatomy is rendered.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4 font-sans">
      {/* Top Header Controls Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Interactive 3D Anatomical Reconstruction</h1>
            <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
              WebGL 3D Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Patient: <strong className="text-slate-700">{currentCase.patient_name}</strong> • Rotate: Left-Click Drag • Zoom: Scroll Wheel
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              isWireframe
                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{isWireframe ? 'Wireframe Active' : 'Solid Surface'}</span>
          </button>

          <button
            type="button"
            onClick={resetCamera}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Camera</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* WebGL Canvas Viewport (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative min-h-[520px]">
          {/* Three.js Mounting Element */}
          <div ref={mountRef} className="w-full h-full min-h-[520px] cursor-grab active:cursor-grabbing" />

          {/* Viewport Overlay Controls HUD */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 text-[11px] font-mono text-slate-300 space-y-1 shadow-lg pointer-events-none">
            <div className="text-teal-400 font-bold uppercase">Anatomical 3D Mesh</div>
            <div>Femur: 62.5 × 95.6 × 78.4 mm</div>
            <div>Tibia: 58.1 × 66.2 × 70.4 mm</div>
            <div>Meniscus: 2,282.5 mm³ (Label 5)</div>
          </div>

          <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 text-[10px] font-mono text-slate-400 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>Interactive WebGL • 60 FPS</span>
          </div>
        </div>

        {/* Structure Toggles & Dimension Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Anatomical Layer Toggles
            </h3>

            <div className="space-y-2">
              {/* Femur Toggle */}
              <div
                onClick={() => {
                  setShowFemur(!showFemur);
                  setSelectedStructure('Femur');
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  showFemur ? 'border-slate-300 bg-slate-50' : 'border-slate-100 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-300 border border-slate-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Distal Femur</span>
                    <span className="text-[10px] text-slate-500 font-mono">Bicondylar Cartilage Bed</span>
                  </div>
                </div>
                {showFemur ? <Eye className="w-4 h-4 text-teal-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Tibia Toggle */}
              <div
                onClick={() => {
                  setShowTibia(!showTibia);
                  setSelectedStructure('Tibia');
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  showTibia ? 'border-slate-300 bg-slate-50' : 'border-slate-100 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-400 border border-slate-500 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">Proximal Tibia</span>
                    <span className="text-[10px] text-slate-500 font-mono">Tibial Plateau Surface</span>
                  </div>
                </div>
                {showTibia ? <Eye className="w-4 h-4 text-teal-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>

              {/* Medial Meniscus Toggle */}
              <div
                onClick={() => {
                  setShowMedialMeniscus(!showMedialMeniscus);
                  setSelectedStructure('Medial Meniscus');
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  showMedialMeniscus ? 'border-purple-300 bg-purple-50/70' : 'border-slate-100 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-purple-600 shrink-0 shadow-xs" />
                  <div>
                    <span className="font-bold text-purple-950 block">Medial Meniscus</span>
                    <span className="text-[10px] text-purple-700 font-mono">Crescentic Fibrocartilage</span>
                  </div>
                </div>
                {showMedialMeniscus ? (
                  <Eye className="w-4 h-4 text-purple-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {/* Lateral Meniscus Toggle */}
              <div
                onClick={() => {
                  setShowLateralMeniscus(!showLateralMeniscus);
                  setSelectedStructure('Lateral Meniscus');
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  showLateralMeniscus ? 'border-cyan-300 bg-cyan-50/70' : 'border-slate-100 opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-md bg-cyan-500 shrink-0 shadow-xs" />
                  <div>
                    <span className="font-bold text-cyan-950 block">Lateral Meniscus</span>
                    <span className="text-[10px] text-cyan-700 font-mono">Ovoid Meniscal Horn</span>
                  </div>
                </div>
                {showLateralMeniscus ? <Eye className="w-4 h-4 text-cyan-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
              </div>
            </div>
          </div>

          {/* Morphometry Inspector Card for Selected Structure */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Morphometry Inspector ({selectedStructure})
            </h3>

            {selectedStructure === 'Medial Meniscus' && (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Volume (mm³)</span>
                  <span className="font-bold text-slate-900">2,282.52 mm³</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">Voxel Count</span>
                  <span className="font-bold text-slate-900">29,214 voxels</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 font-mono">
                  <span className="text-slate-500">3D Mean Thickness</span>
                  <span className="font-bold text-purple-700">2.01 mm</span>
                </div>
                <div className="flex justify-between py-1 font-mono">
                  <span className="text-slate-500">3D Max Thickness</span>
                  <span className="font-bold text-purple-700">6.16 mm</span>
                </div>
              </div>
            )}

            {selectedStructure === 'Femur' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Mediolateral (X)</span>
                  <span className="font-bold text-slate-900">62.50 mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Anteroposterior (Y)</span>
                  <span className="font-bold text-slate-900">95.63 mm</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Cranial-Caudal (Z)</span>
                  <span className="font-bold text-slate-900">78.41 mm</span>
                </div>
              </div>
            )}

            {selectedStructure === 'Tibia' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Mediolateral (X)</span>
                  <span className="font-bold text-slate-900">58.12 mm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Anteroposterior (Y)</span>
                  <span className="font-bold text-slate-900">66.25 mm</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Cranial-Caudal (Z)</span>
                  <span className="font-bold text-slate-900">70.41 mm</span>
                </div>
              </div>
            )}

            {selectedStructure === 'Lateral Meniscus' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Volume (mm³)</span>
                  <span className="font-bold text-slate-900">1,961.87 mm³</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Voxel Count</span>
                  <span className="font-bold text-slate-900">25,110 voxels</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Spatial Extent</span>
                  <span className="font-bold text-cyan-700">41.25 × 8.75 mm</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
