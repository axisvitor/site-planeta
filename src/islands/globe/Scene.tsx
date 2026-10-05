import { useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { STATES, WEDGES, targets, type State } from './targets';
import { useWedgeGeometry, wedgeCenter } from './Wedge';

/** Estado dirigido pelo GSAP (scrub do scroll). O R3F só lê. */
export type Driver = {
  w: Record<State, number>;      // pesos dos estados, somam ~1
  spin: number;                  // rotação extra do globo (rad) dirigida pelo scroll
  cam: { x: number; y: number; z: number; tx: number; ty: number; tz: number };
  mapOpacity: number;
};

export const initialDriver = (): Driver => ({
  w: { globe: 1, cluster: 0, column: 0, map: 0 },
  spin: 0,
  cam: { x: -2.4, y: 0.2, z: 7.2, tx: -1.3, ty: 0, tz: 0 },
  mapOpacity: 0,
});

type Props = { driver: MutableRefObject<Driver>; tier: 'high' | 'medium' };

function WedgeNode({ index, driver }: { index: number; driver: MutableRefObject<Driver> }) {
  const geos = useWedgeGeometry(index, index % 3 === 0);
  const center = wedgeCenter(index);
  const outer = useRef<THREE.Group>(null!);
  const tmp = new THREE.Vector3();

  useFrame(() => {
    const { w } = driver.current;
    const g = outer.current;
    // posição: globo usa o próprio centro; outros estados usam p absoluto
    tmp.set(0, 0, 0);
    let rx = 0, ry = 0, rz = 0, s = 0;
    for (const st of STATES) {
      const k = w[st]; if (k <= 0) continue;
      const t = targets[st][index];
      if (st === 'globe') tmp.addScaledVector(center, k);
      else tmp.add(new THREE.Vector3(t.p[0], t.p[1], t.p[2]).multiplyScalar(k));
      rx += t.r[0] * k; ry += t.r[1] * k; rz += t.r[2] * k; s += t.s * k;
    }
    g.position.copy(tmp);
    g.rotation.set(rx, ry, rz);
    g.scale.setScalar(s || 1);
  });

  return (
    <group ref={outer} position={center}>
      <group position={[-center.x, -center.y, -center.z]}>
        {geos.map((x, i) => <mesh key={i} geometry={x.geo} material={x.mat} castShadow />)}
      </group>
    </group>
  );
}

function Globe({ driver }: { driver: MutableRefObject<Driver> }) {
  const root = useRef<THREE.Group>(null!);
  const idle = useRef(0);
  useFrame((_, dt) => {
    const d = driver.current;
    idle.current += dt * 0.12 * d.w.globe;   // gira devagar só enquanto é globo
    root.current.rotation.y = idle.current + d.spin;
    root.current.rotation.x = 0.18 * d.w.globe;
  });
  return (
    <group ref={root}>
      {Array.from({ length: WEDGES }, (_, i) => <WedgeNode key={i} index={i} driver={driver} />)}
    </group>
  );
}

function MapPlane({ driver }: { driver: MutableRefObject<Driver> }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null!);
  const grid = useRef<THREE.LineSegments>(null!);
  useFrame(() => { const o = driver.current.mapOpacity; mat.current.opacity = o * 0.95; (grid.current.material as THREE.Material).opacity = o * 0.6; });
  return (
    <group position={[0, -0.02, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 6]} />
        <meshBasicMaterial ref={mat} color="#2a2e35" transparent opacity={0} />
      </mesh>
      <lineSegments ref={grid} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(7, 6, 14, 12)]} />
        <lineBasicMaterial color="#b4b9bf" transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

function Rig({ driver }: { driver: MutableRefObject<Driver> }) {
  const { camera } = useThree();
  const look = new THREE.Vector3();
  useFrame(() => {
    const c = driver.current.cam;
    camera.position.lerp(new THREE.Vector3(c.x, c.y, c.z), 0.18);
    look.lerp(new THREE.Vector3(c.tx, c.ty, c.tz), 0.18);
    camera.lookAt(look);
  });
  return null;
}

export default function Scene({ driver, tier }: Props) {
  return (
    <Canvas
      dpr={tier === 'high' ? [1, 2] : [1, 1.5]}
      camera={{ fov: 38, near: 0.1, far: 60, position: [-2.4, 0.2, 7.2] }}
      gl={{ antialias: tier === 'high', powerPreference: 'high-performance', alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      aria-hidden
    >
      <hemisphereLight intensity={0.9} color="#edeae4" groundColor="#2a2e35" />
      <directionalLight position={[4, 6, 5]} intensity={2.6} color="#edeae4" />
      <directionalLight position={[-6, -2, -4]} intensity={0.8} color="#b4b9bf" />
      {/* rim light "faísca": amarelo do logo, lateral */}
      <pointLight position={[-5, 3, 1]} intensity={60} color="#fcc908" distance={16} decay={2} />
      <pointLight position={[3, -3, 4]} intensity={12} color="#214093" distance={12} decay={2} />
      <Globe driver={driver} />
      <MapPlane driver={driver} />
      <Rig driver={driver} />
    </Canvas>
  );
}
