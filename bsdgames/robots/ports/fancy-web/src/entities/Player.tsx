import { useContext, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { StepAnimationContext } from './AnimatedGroup';

// Player mesh — a minimalist voxel HUMAN with an animated walk cycle.
// Legs and arms are wrapped in pivot groups at the hip/shoulder so they
// can swing during a step. The wrapper AnimatedGroup provides the step
// progress via context; useFrame here converts that into leg/arm
// rotations that alternate lead across steps.

const COLORS = {
  shirt: '#ff3a95',
  skin: '#f5cba8',
  hair: '#4a2f1c',
  pants: '#3d4a5e',
  shoes: '#1a2540',
  eye: '#0a0a10',
} as const;

const SHIRT_EMISSIVE_INTENSITY = 0.22;
const SKIN_EMISSIVE_INTENSITY = 0.18;

// Peak leg/arm swing angle in radians (~31°).
const MAX_LEG_SWING = 0.55;
// Arms swing less than legs — feels more natural.
const ARM_SWING_RATIO = 0.65;

// Walk-cycle timing — one full cycle (two leg swings) per WALK_CYCLE_SEC.
// Independent of the step's own duration so that (a) interrupted steps
// don't reset the leg phase (which was previously causing the visual
// hitch), and (b) continuous walking looks smooth even when keypress
// timing is irregular.
const WALK_CYCLE_SEC = 0.68;
const WALK_ANGULAR_FREQ = (Math.PI * 2) / WALK_CYCLE_SEC;

export function PlayerMesh() {
  const stepRef = useContext(StepAnimationContext);
  const leftLegRef = useRef<Group>(null);
  const rightLegRef = useRef<Group>(null);
  const leftArmRef = useRef<Group>(null);
  const rightArmRef = useRef<Group>(null);
  const walkPhase = useRef(0);

  useFrame((_, delta) => {
    const isMoving = stepRef.current.isMoving;

    // Advance phase continuously while moving. During pauses the phase
    // freezes; on resume it continues from where it stopped, so rapid
    // successive steps chain smoothly instead of restarting each time.
    if (isMoving) {
      walkPhase.current += delta * WALK_ANGULAR_FREQ;
    }

    // Target rotations. When moving: sinusoidal swing. When idle: 0
    // (the lerp below smoothly returns legs/arms to rest).
    const swing = isMoving ? Math.sin(walkPhase.current) * MAX_LEG_SWING : 0;
    const leftLegTarget = swing;
    const rightLegTarget = -swing;
    const leftArmTarget = -swing * ARM_SWING_RATIO;
    const rightArmTarget = swing * ARM_SWING_RATIO;

    const lerpT = Math.min(1, delta * 16);
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x +=
        (leftLegTarget - leftLegRef.current.rotation.x) * lerpT;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x +=
        (rightLegTarget - rightLegRef.current.rotation.x) * lerpT;
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x +=
        (leftArmTarget - leftArmRef.current.rotation.x) * lerpT;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x +=
        (rightArmTarget - rightArmRef.current.rotation.x) * lerpT;
    }
  });

  return (
    <group>
      {/* Left leg — pivots at the hip (y=0.56); the leg and foot are
          offset downward from the pivot so they swing together as a unit. */}
      <group ref={leftLegRef} position={[-0.09, 0.56, 0]}>
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.48, 12]} />
          <meshStandardMaterial color={COLORS.pants} roughness={0.6} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.51, 0.03]}>
          <boxGeometry args={[0.14, 0.07, 0.22]} />
          <meshStandardMaterial color={COLORS.shoes} roughness={0.55} metalness={0.1} />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.09, 0.56, 0]}>
        <mesh position={[0, -0.24, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.48, 12]} />
          <meshStandardMaterial color={COLORS.pants} roughness={0.6} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.51, 0.03]}>
          <boxGeometry args={[0.14, 0.07, 0.22]} />
          <meshStandardMaterial color={COLORS.shoes} roughness={0.55} metalness={0.1} />
        </mesh>
      </group>

      {/* Torso */}
      <mesh position={[0, 0.76, 0]}>
        <boxGeometry args={[0.34, 0.4, 0.24]} />
        <meshStandardMaterial
          color={COLORS.shirt}
          emissive={COLORS.shirt}
          emissiveIntensity={SHIRT_EMISSIVE_INTENSITY}
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* Left arm — pivots at the shoulder (y=0.93). */}
      <group ref={leftArmRef} position={[-0.22, 0.93, 0]}>
        <mesh position={[0, -0.21, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.42, 10]} />
          <meshStandardMaterial
            color={COLORS.shirt}
            emissive={COLORS.shirt}
            emissiveIntensity={SHIRT_EMISSIVE_INTENSITY}
            roughness={0.4}
            metalness={0.15}
          />
        </mesh>
        <mesh position={[0, -0.43, 0]}>
          <sphereGeometry args={[0.055, 12, 10]} />
          <meshStandardMaterial
            color={COLORS.skin}
            emissive={COLORS.skin}
            emissiveIntensity={SKIN_EMISSIVE_INTENSITY}
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.22, 0.93, 0]}>
        <mesh position={[0, -0.21, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.42, 10]} />
          <meshStandardMaterial
            color={COLORS.shirt}
            emissive={COLORS.shirt}
            emissiveIntensity={SHIRT_EMISSIVE_INTENSITY}
            roughness={0.4}
            metalness={0.15}
          />
        </mesh>
        <mesh position={[0, -0.43, 0]}>
          <sphereGeometry args={[0.055, 12, 10]} />
          <meshStandardMaterial
            color={COLORS.skin}
            emissive={COLORS.skin}
            emissiveIntensity={SKIN_EMISSIVE_INTENSITY}
            roughness={0.5}
            metalness={0.05}
          />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 10]} />
        <meshStandardMaterial
          color={COLORS.skin}
          emissive={COLORS.skin}
          emissiveIntensity={SKIN_EMISSIVE_INTENSITY}
          roughness={0.5}
          metalness={0.05}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.13, 0]}>
        <sphereGeometry args={[0.16, 20, 16]} />
        <meshStandardMaterial
          color={COLORS.skin}
          emissive={COLORS.skin}
          emissiveIntensity={SKIN_EMISSIVE_INTENSITY}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>

      {/* Hair — flattened dome on top of head */}
      <mesh position={[0, 1.19, -0.005]} scale={[1.05, 0.55, 1.1]}>
        <sphereGeometry args={[0.16, 20, 12]} />
        <meshStandardMaterial color={COLORS.hair} roughness={0.75} metalness={0.05} />
      </mesh>

      {/* Eyes on +Z face — makes the facing direction visible. */}
      <mesh position={[-0.055, 1.14, 0.145]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshStandardMaterial color={COLORS.eye} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0.055, 1.14, 0.145]}>
        <sphereGeometry args={[0.018, 8, 6]} />
        <meshStandardMaterial color={COLORS.eye} roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}
