// Player mesh — futuristic voxel character. Rendered at origin;
// positioning is done by the wrapper (AnimatedGroup) in Game.tsx.
//
// Silhouette from ground up: two narrow legs, torso with glowing
// cyan chest emblem, shoulder pads, rounded helmet with a visor arc
// and a small antenna orb on top. Palette magenta with cyan accents.

export function PlayerMesh() {
  return (
    <group>
      {/* Left leg */}
      <mesh position={[-0.1, 0.2, 0]}>
        <boxGeometry args={[0.11, 0.4, 0.14]} />
        <meshStandardMaterial color="#8f1c48" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.1, 0.2, 0]}>
        <boxGeometry args={[0.11, 0.4, 0.14]} />
        <meshStandardMaterial color="#8f1c48" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.42, 0.5, 0.35]} />
        <meshStandardMaterial color="#f72585" roughness={0.3} metalness={0.55} />
      </mesh>

      {/* Chest emblem — glowing cyan square */}
      <mesh position={[0, 0.66, 0.185]}>
        <boxGeometry args={[0.14, 0.14, 0.025]} />
        <meshStandardMaterial
          color="#4cc9f0"
          emissive="#4cc9f0"
          emissiveIntensity={1.4}
        />
      </mesh>

      {/* Shoulder pads — angular armor pieces */}
      <mesh position={[0.24, 0.79, 0]}>
        <boxGeometry args={[0.12, 0.14, 0.3]} />
        <meshStandardMaterial color="#f72585" roughness={0.3} metalness={0.55} />
      </mesh>
      <mesh position={[-0.24, 0.79, 0]}>
        <boxGeometry args={[0.12, 0.14, 0.3]} />
        <meshStandardMaterial color="#f72585" roughness={0.3} metalness={0.55} />
      </mesh>

      {/* Helmet — rounded (sphere) */}
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.2, 24, 20]} />
        <meshStandardMaterial color="#f72585" roughness={0.3} metalness={0.55} />
      </mesh>

      {/* Visor — arc of glowing cyan across the front of the helmet */}
      <mesh position={[0, 1.03, 0.155]}>
        <boxGeometry args={[0.3, 0.09, 0.05]} />
        <meshStandardMaterial
          color="#0d1b2a"
          emissive="#4cc9f0"
          emissiveIntensity={1.1}
        />
      </mesh>

      {/* Antenna orb on top */}
      <mesh position={[0, 1.28, 0]}>
        <sphereGeometry args={[0.045, 12, 10]} />
        <meshStandardMaterial
          color="#4cc9f0"
          emissive="#4cc9f0"
          emissiveIntensity={1.4}
        />
      </mesh>
    </group>
  );
}
