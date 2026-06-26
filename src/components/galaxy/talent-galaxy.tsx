'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import { useRef, useMemo, Suspense, useState } from 'react';
import * as THREE from 'three';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ScoreRing } from '@/components/shared/score-ring';

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 65) return '#eab308';
  if (score >= 45) return '#f97316';
  return '#ef4444';
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function OrbitalRing({ radius, color, opacity }: { radius: number; color: string; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = Math.PI / 2 + Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
      ref.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={ref}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CandidatePlanet({
  name,
  size,
  color,
  distance,
  speed,
  startAngle,
  onClick,
  score,
}: {
  name: string;
  size: number;
  color: string;
  distance: number;
  speed: number;
  startAngle: number;
  onClick: () => void;
  score: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(startAngle);

  useFrame(() => {
    if (groupRef.current) {
      angleRef.current += speed * 0.003;
      groupRef.current.position.x = Math.cos(angleRef.current) * distance;
      groupRef.current.position.z = Math.sin(angleRef.current) * distance;
      groupRef.current.position.y = Math.sin(angleRef.current * 0.5) * 0.3;
    }
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x += 0.005;
    }
  });

  const glowIntensity = hovered ? 1.2 : 0.4;
  const planetScale = hovered ? 1.4 : 1;

  return (
    <group ref={groupRef}>
      <mesh
        ref={ref}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerEnter={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        scale={planetScale}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={glowIntensity}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      <mesh scale={planetScale}>
        <sphereGeometry args={[size * 1.3, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.15 : 0.05} />
      </mesh>

      <pointLight color={color} intensity={hovered ? 3 : 0.8} distance={6} />

      <Html distanceFactor={10} style={{ pointerEvents: 'none' }}>
        <div className="text-center whitespace-nowrap">
          <div className={`px-3 py-1 rounded-full text-white text-[11px] font-semibold backdrop-blur-md transition-all duration-300 ${
            hovered ? 'bg-black/80 shadow-lg shadow-violet-500/20 scale-110' : 'bg-black/60'
          }`}>
            {name}
            {hovered && <span className="ml-2 text-violet-300">{score}%</span>}
          </div>
        </div>
      </Html>
    </group>
  );
}

function CenterStar() {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.5;
      ref.current.rotation.x = Math.sin(t * 0.3) * 0.2;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.1;
      ringRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[0.9, 16, 16]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.08} />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.03} />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 8, 128]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.015, 8, 128]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
      </mesh>

      <pointLight color="#7c3aed" intensity={5} distance={15} />
      <pointLight color="#06b6d4" intensity={2} distance={10} />
    </group>
  );
}

function ParticleNebula() {
  const ref = useRef<THREE.Points>(null);
  const count = 500;

  const geo = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = seededRandom(i * 3) * Math.PI * 2;
      const radius = 1 + seededRandom(i * 7) * 8;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = (seededRandom(i * 11) - 0.5) * 3;
      arr[i * 3 + 2] = Math.sin(angle) * radius;

      const colorChoice = seededRandom(i * 13);
      if (colorChoice < 0.4) {
        colors[i * 3] = 0.486; colors[i * 3 + 1] = 0.337; colors[i * 3 + 2] = 0.945;
      } else if (colorChoice < 0.7) {
        colors[i * 3] = 0.024; colors[i * 3 + 1] = 0.714; colors[i * 3 + 2] = 0.831;
      } else {
        colors[i * 3] = 0.733; colors[i * 3 + 1] = 0.545; colors[i * 3 + 2] = 0.980;
      }

      sizes[i] = 0.02 + seededRandom(i * 17) * 0.06;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial vertexColors size={0.04} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function GalaxyScene({ onSelect }: { onSelect: (id: string) => void }) {
  const { scores, resumes } = useAppStore();
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0008;
    }
  });

  const planets = useMemo(() => {
    return scores.map((s, i) => {
      const resume = resumes.find((r) => r.id === s.candidateId);
      const expTotals = resumes.map((r) => r.experience.reduce((sum, e) => sum + e.years, 0));
      const maxExp = Math.max(...expTotals, 1);
      const totalExp = resume?.experience.reduce((sum, e) => sum + e.years, 0) || 1;
      return {
        id: s.candidateId,
        name: resume?.name || 'Unknown',
        score: s.overallScore,
        size: 0.15 + (totalExp / maxExp) * 0.45,
        color: getScoreColor(s.skillMatch),
        distance: 2.5 + ((100 - s.overallScore) / 100) * 4,
        speed: 0.3 + (s.overallScore / 100) * 1.2,
        startAngle: seededRandom(i * 7 + 3) * Math.PI * 2,
      };
    });
  }, [scores, resumes]);

  return (
    <>
      <ambientLight intensity={0.15} />

      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0.5} fade speed={1} />

      <group ref={ref}>
        <CenterStar />

        <OrbitalRing radius={2.5} color="#8b5cf6" opacity={0.1} />
        <OrbitalRing radius={4.0} color="#06b6d4" opacity={0.08} />
        <OrbitalRing radius={5.5} color="#a78bfa" opacity={0.06} />
        <OrbitalRing radius={7.0} color="#8b5cf6" opacity={0.04} />

        {planets.map((planet) => (
          <CandidatePlanet
            key={planet.id}
            name={planet.name}
            size={planet.size}
            color={planet.color}
            distance={planet.distance}
            speed={planet.speed}
            startAngle={planet.startAngle}
            score={planet.score}
            onClick={() => onSelect(planet.id)}
          />
        ))}
      </group>

      <ParticleNebula />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={3}
        maxDistance={18}
        autoRotate={false}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

function CandidateDetailPanel({
  candidateId,
  onClose,
}: {
  candidateId: string;
  onClose: () => void;
}) {
  const { scores, resumes, shortlistedCandidates, toggleShortlist } = useAppStore();
  const score = scores.find((s) => s.candidateId === candidateId);
  const resume = resumes.find((r) => r.id === candidateId);
  const isShortlisted = shortlistedCandidates.includes(candidateId);

  if (!score || !resume) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 bottom-0 w-[420px] max-w-[90vw] z-50 overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, rgba(10,10,30,0.95) 0%, rgba(20,10,40,0.95) 100%)',
        backdropFilter: 'blur(40px)',
        borderLeft: '1px solid rgba(139, 92, 246, 0.2)',
        boxShadow: '-20px 0 60px rgba(139, 92, 246, 0.1)',
      }}
    >
      <div className="sticky top-0 p-6 backdrop-blur-xl border-b border-white/10 flex items-center justify-between"
        style={{ background: 'rgba(10,10,30,0.8)' }}>
        <h3 className="font-bold text-lg">Candidate Profile</h3>
        <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-500/30">
            {resume.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{resume.name}</h2>
            <p className="text-sm text-muted-foreground">{resume.email}</p>
            <p className="text-xs text-muted-foreground">{resume.experience[0]?.title} at {resume.experience[0]?.company}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <ScoreRing score={score.overallScore} size={130} strokeWidth={8} label="Overall" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Skill Match', value: score.skillMatch, color: 'text-violet-400', bg: 'from-violet-500/20 to-purple-500/10' },
            { label: 'Experience', value: score.experienceMatch, color: 'text-cyan-400', bg: 'from-cyan-500/20 to-blue-500/10' },
            { label: 'Education', value: score.educationMatch, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-green-500/10' },
            { label: 'Interview Ready', value: score.interviewReadiness, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-amber-500/10' },
          ].map((item) => (
            <div key={item.label} className={`p-3 rounded-xl bg-gradient-to-br ${item.bg} border border-white/10`}>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className={`text-lg font-bold ${item.color}`}>{item.value}%</p>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />
            Strengths
          </h4>
          {score.strengths.map((s, i) => (
            <p key={i} className="text-xs text-gray-400 mb-1 ml-4">• {s}</p>
          ))}
        </div>

        {score.weaknesses.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-yellow-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50" />
              Areas for Growth
            </h4>
            {score.weaknesses.map((w, i) => (
              <p key={i} className="text-xs text-gray-400 mb-1 ml-4">• {w}</p>
            ))}
          </div>
        )}

        {score.missingSkills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-red-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 shadow-sm shadow-red-400/50" />
              Missing Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              {score.missingSkills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold mb-2 text-violet-400">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {resume.skills.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs">{s}</span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2 text-cyan-400">Experience</h4>
          {resume.experience.map((exp, i) => (
            <div key={i} className="ml-4 mb-2 border-l-2 border-violet-500/30 pl-3">
              <p className="text-sm font-medium">{exp.title}</p>
              <p className="text-xs text-muted-foreground">{exp.company} • {exp.duration}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => toggleShortlist(candidateId)}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            isShortlisted
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-violet-500/30'
          }`}
        >
          {isShortlisted ? '✓ Shortlisted' : 'Shortlist Candidate'}
        </button>
      </div>
    </motion.div>
  );
}

export function TalentGalaxy() {
  const { selectedCandidate, setSelectedCandidate } = useAppStore();
  const { scores } = useAppStore();

  return (
    <div className="relative h-[calc(100vh-80px)] w-full rounded-2xl overflow-hidden border border-white/10"
      style={{ background: 'radial-gradient(ellipse at center, rgba(15,5,30,1) 0%, rgba(5,2,15,1) 100%)' }}>
      {scores.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-center p-8">
          <div>
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
            </div>
            <p className="text-xl font-bold mb-2">No candidates analyzed yet</p>
            <p className="text-sm text-muted-foreground">Complete the workflow first to explore candidates in the galaxy</p>
          </div>
        </div>
      ) : (
        <Canvas
          camera={{ position: [0, 5, 10], fov: 60 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          style={{ background: 'radial-gradient(ellipse at center, #0f0520 0%, #050210 100%)' }}
        >
          <Suspense fallback={null}>
            <GalaxyScene onSelect={setSelectedCandidate} />
          </Suspense>
        </Canvas>
      )}

      <div className="absolute top-4 left-4 z-10">
        <div className="px-4 py-2.5 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10">
          <p className="text-xs text-gray-400">
            Click a planet to view candidate · Drag to rotate · Scroll to zoom
          </p>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="px-4 py-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 space-y-1.5">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Legend</p>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-500/50" /> High Match
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm shadow-yellow-500/50" /> Medium Match
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" /> Low Match
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span className="w-2 h-2" /> Size = Experience
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <span className="w-2 h-2" /> Distance = Score
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCandidate && (
          <CandidateDetailPanel
            candidateId={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
