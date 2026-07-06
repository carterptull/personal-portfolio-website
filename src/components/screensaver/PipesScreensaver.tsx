"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

const GRID = { x: 11, y: 7, z: 11 };
const STEP_MS = 80;
const UP = new THREE.Vector3(0, 1, 0);
const DIRS: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

type Cell = [number, number, number];
const keyOf = (c: Cell) => `${c[0]},${c[1]},${c[2]}`;
const inBounds = (c: Cell) =>
  c[0] >= 0 && c[0] < GRID.x && c[1] >= 0 && c[1] < GRID.y && c[2] >= 0 && c[2] < GRID.z;

function toWorld(c: Cell): THREE.Vector3 {
  return new THREE.Vector3(
    c[0] - (GRID.x - 1) / 2,
    c[1] - (GRID.y - 1) / 2,
    c[2] - (GRID.z - 1) / 2
  );
}

function PipesScene() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.1;
  });

  useEffect(() => {
    const g = group.current;
    const cylGeo = new THREE.CylinderGeometry(0.16, 0.16, 1, 10, 1);
    const sphGeo = new THREE.SphereGeometry(0.24, 12, 10);
    const mats = [
      new THREE.MeshStandardMaterial({ color: 0xbb0000, roughness: 0.35, metalness: 0.2 }),
      new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.2, metalness: 0.85 }),
      new THREE.MeshStandardMaterial({ color: 0x8f0000, roughness: 0.25, metalness: 0.6 }),
    ];

    const occupied = new Set<string>();
    let pos: Cell | null = null;
    let dir: Cell | null = null;
    let mat = mats[0];
    let segments = 0;

    const addSphere = (cell: Cell) => {
      const m = new THREE.Mesh(sphGeo, mat);
      m.position.copy(toWorld(cell));
      g.add(m);
    };

    const addSegment = (from: Cell, to: Cell, d: Cell) => {
      const m = new THREE.Mesh(cylGeo, mat);
      m.position.copy(toWorld(from).add(toWorld(to)).multiplyScalar(0.5));
      m.quaternion.setFromUnitVectors(UP, new THREE.Vector3(...d));
      g.add(m);
    };

    const resetAll = () => {
      g.clear();
      occupied.clear();
      pos = null;
      dir = null;
      segments = 0;
    };

    const startPipe = () => {
      for (let i = 0; i < 24; i++) {
        const c: Cell = [
          Math.floor(Math.random() * GRID.x),
          Math.floor(Math.random() * GRID.y),
          Math.floor(Math.random() * GRID.z),
        ];
        if (!occupied.has(keyOf(c))) {
          pos = c;
          dir = null;
          mat = mats[Math.floor(Math.random() * mats.length)];
          occupied.add(keyOf(c));
          addSphere(c);
          return;
        }
      }
      resetAll();
    };

    const step = () => {
      if (segments > 400 || occupied.size > GRID.x * GRID.y * GRID.z * 0.5) {
        resetAll();
        return;
      }
      if (!pos) {
        startPipe();
        return;
      }
      const options = DIRS.map((d) => {
        const next: Cell = [pos![0] + d[0], pos![1] + d[1], pos![2] + d[2]];
        return { d, next };
      }).filter(({ next }) => inBounds(next) && !occupied.has(keyOf(next)));

      if (options.length === 0) {
        addSphere(pos);
        pos = null;
        return;
      }

      // Prefer continuing straight (classic sspipes wander).
      let choice = options[Math.floor(Math.random() * options.length)];
      if (dir && Math.random() < 0.6) {
        const straight = options.find(
          ({ d }) => d[0] === dir![0] && d[1] === dir![1] && d[2] === dir![2]
        );
        if (straight) choice = straight;
      }

      const turned =
        !dir ||
        choice.d[0] !== dir[0] ||
        choice.d[1] !== dir[1] ||
        choice.d[2] !== dir[2];
      if (turned && dir) addSphere(pos);

      addSegment(pos, choice.next, choice.d as Cell);
      occupied.add(keyOf(choice.next));
      pos = choice.next;
      dir = choice.d as Cell;
      segments += 1;
    };

    const interval = setInterval(step, STEP_MS);
    return () => {
      clearInterval(interval);
      g.clear();
      cylGeo.dispose();
      sphGeo.dispose();
      mats.forEach((m) => m.dispose());
    };
  }, []);

  return <group ref={group} />;
}

export default function PipesScreensaver({ onExit }: { onExit: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9800] bg-void"
      aria-hidden="true"
      onPointerDown={onExit}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [11, 8, 11], fov: 50 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.5} />
        <hemisphereLight args={[0xffffff, 0x2a2a2e, 0.6]} />
        <directionalLight position={[8, 12, 6]} intensity={1.4} />
        <PipesScene />
      </Canvas>
    </div>
  );
}
