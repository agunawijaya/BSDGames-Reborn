import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Group, Vector3 } from 'three';

// AnimatedGroup interpolates its position toward `target` every frame.
// While moving, the group also bounces slightly on the Y axis to give
// entities a "walking" feel instead of a chess-piece leap.

type Props = Readonly<{
  target: [number, number, number];
  /** Higher = faster catch-up. 12 ≈ ~90 ms half-life. */
  speed?: number;
  /** Amplitude of the movement bounce (Y offset, world units). */
  bounceHeight?: number;
  /** How rapidly the bounce oscillates. */
  bounceSpeed?: number;
  children: ReactNode;
}>;

const SETTLED_THRESHOLD = 0.02;

export function AnimatedGroup({
  target,
  speed = 12,
  bounceHeight = 0.06,
  bounceSpeed = 14,
  children,
}: Props) {
  const groupRef = useRef<Group>(null);
  const current = useRef(new Vector3(target[0], target[1], target[2]));

  // On mount, snap to initial position so we don't animate from origin.
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(target[0], target[1], target[2]);
      current.current.set(target[0], target[1], target[2]);
    }
    // Intentionally run only on mount — subsequent target changes are
    // handled by the useFrame lerp below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = Math.min(1, delta * speed);
    const dx = target[0] - current.current.x;
    const dz = target[2] - current.current.z;
    current.current.x += dx * t;
    current.current.z += dz * t;

    const distanceSq = dx * dx + dz * dz;
    const isMoving = distanceSq > SETTLED_THRESHOLD * SETTLED_THRESHOLD;
    const bounce = isMoving
      ? Math.abs(Math.sin(state.clock.elapsedTime * bounceSpeed)) * bounceHeight
      : 0;

    current.current.y = target[1] + bounce;
    groupRef.current.position.copy(current.current);
  });

  return <group ref={groupRef}>{children}</group>;
}
