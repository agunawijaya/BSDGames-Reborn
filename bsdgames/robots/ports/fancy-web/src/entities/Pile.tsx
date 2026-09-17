// Pile mesh — a jumble of small steel-gray boxes at deterministic
// pseudo-random rotations. Position-derived seed keeps each pile
// visually stable across re-renders (so the pile doesn't "shuffle"
// every frame).

import { useMemo } from 'react';

type Props = Readonly<{
  position: [number, number, number];
  seed: number;
}>;

// Local Mulberry32 — same algorithm as `src/game/rng.ts` but standalone
// so we don't tangle rendering with game RNG. Deterministic given seed.
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    let t = (state += 0x6d2b79f5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PIECE_COUNT = 5;

export function PileMesh({ position, seed }: Props) {
  const pieces = useMemo(() => {
    const r = mulberry32(seed);
    const arr: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      rotY: number;
      rotZ: number;
    }> = [];
    for (let i = 0; i < PIECE_COUNT; i++) {
      const size = 0.14 + r() * 0.16;
      arr.push({
        x: (r() - 0.5) * 0.35,
        y: r() * 0.15,
        z: (r() - 0.5) * 0.35,
        size,
        rotY: r() * Math.PI * 2,
        rotZ: (r() - 0.5) * 0.4,
      });
    }
    return arr;
  }, [seed]);

  return (
    <group position={position}>
      {pieces.map((p, i) => (
        <mesh
          key={i}
          position={[p.x, p.y + p.size / 2, p.z]}
          rotation={[0, p.rotY, p.rotZ]}
        >
          <boxGeometry args={[p.size, p.size, p.size]} />
          <meshStandardMaterial
            color="#7c8894"
            roughness={0.75}
            metalness={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}
