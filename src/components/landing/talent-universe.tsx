'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function NetworkNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeCount = 60;

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => ({
      pos: new THREE.Vector3(
        (seededRandom(i * 3) - 0.5) * 14,
        (seededRandom(i * 3 + 1) - 0.5) * 10,
        (seededRandom(i * 3 + 2) - 0.5) * 10
      ),
      scale: 0.02 + seededRandom(i * 7) * 0.05,
      speed: 0.2 + seededRandom(i * 11) * 0.3,
      offset: seededRandom(i * 13) * Math.PI * 2,
    }));
  }, []);

  const linesData = useMemo(() => {
    const result: { from: THREE.Vector3; to: THREE.Vector3 }[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 3.2) {
          result.push({ from: nodes[i].pos, to: nodes[j].pos });
        }
      }
    }
    return result;
  }, [nodes]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.rotation.y = t * 0.04;
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.15;
    }
  });

  const linesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(linesData.length * 6);
    linesData.forEach((line, i) => {
      positions[i * 6] = line.from.x;
      positions[i * 6 + 1] = line.from.y;
      positions[i * 6 + 2] = line.from.z;
      positions[i * 6 + 3] = line.to.x;
      positions[i * 6 + 4] = line.to.y;
      positions[i * 6 + 5] = line.to.z;
    });
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [linesData]);

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node.pos}>
            <sphereGeometry args={[node.scale, 8, 8]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.9} />
          </mesh>
          <mesh position={node.pos}>
            <sphereGeometry args={[node.scale * 3, 8, 8]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.08} />
          </mesh>
        </group>
      ))}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#7c3aed" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
}

function Globe() {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.12;
      ref.current.rotation.x = Math.sin(t * 0.06) * 0.15;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(t * 1.5) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.15) * 0.2;
      ringRef1.current.rotation.z = t * 0.08;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.x = Math.PI / 3 + Math.cos(t * 0.12) * 0.15;
      ringRef2.current.rotation.y = t * 0.06;
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[2, 3]} />
        <meshBasicMaterial color="#7c3aed" wireframe transparent opacity={0.25} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[2.3, 16, 16]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.04} />
      </mesh>
      <mesh ref={ringRef1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.015, 8, 128]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ringRef2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.2, 0.01, 8, 128]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;

  const geo = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (seededRandom(i * 13 + 41) - 0.5) * 20;
      arr[i * 3 + 1] = (seededRandom(i * 17 + 53) - 0.5) * 15;
      arr[i * 3 + 2] = (seededRandom(i * 19 + 67) - 0.5) * 15;

      const c = seededRandom(i * 23);
      if (c < 0.5) {
        colors[i * 3] = 0.545; colors[i * 3 + 1] = 0.361; colors[i * 3 + 2] = 0.965;
      } else if (c < 0.8) {
        colors[i * 3] = 0.024; colors[i * 3 + 1] = 0.714; colors[i * 3 + 2] = 0.831;
      } else {
        colors[i * 3] = 0.733; colors[i * 3 + 1] = 0.545; colors[i * 3 + 2] = 0.980;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.025;
      ref.current.rotation.x = clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial vertexColors size={0.035} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.6} color="#8b5cf6" />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#06b6d4" />
      <pointLight position={[0, 5, -10]} intensity={0.2} color="#a78bfa" />
      <NetworkNodes />
      <Globe />
      <FloatingParticles />
    </>
  );
}

export function TalentUniverse() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
