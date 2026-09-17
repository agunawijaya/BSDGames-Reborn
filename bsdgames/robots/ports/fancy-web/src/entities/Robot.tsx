// Robot mesh — futuristic hover-bot. Rendered at origin; positioning
// is done by the wrapper (AnimatedGroup) in Game.tsx.
//
// Silhouette: metallic hover disc (with red under-glow) instead of
// legs, boxy torso with a glowing red chest indicator and shoulder
// pauldrons, cubic head with a horizontal visor slit, thin antenna
// with a small emissive orb. Palette warm yellow body, red glow,
// steel-gray accents.

export function RobotMesh() {
  return (
    <group>
      {/* Hover disc — flat cylinder with emissive red rim */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.08, 16]} />
        <meshStandardMaterial
          color="#3a3a48"
          roughness={0.35}
          metalness={0.85}
          emissive="#ff006e"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.46, 0.5, 0.42]} />
        <meshStandardMaterial color="#ffbe0b" roughness={0.28} metalness={0.7} />
      </mesh>

      {/* Chest indicator — glowing red square */}
      <mesh position={[0, 0.5, 0.22]}>
        <boxGeometry args={[0.13, 0.13, 0.02]} />
        <meshStandardMaterial
          color="#ff006e"
          emissive="#ff006e"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Shoulder pauldrons */}
      <mesh position={[0.28, 0.66, 0]}>
        <boxGeometry args={[0.13, 0.14, 0.36]} />
        <meshStandardMaterial color="#ffbe0b" roughness={0.28} metalness={0.7} />
      </mesh>
      <mesh position={[-0.28, 0.66, 0]}>
        <boxGeometry args={[0.13, 0.14, 0.36]} />
        <meshStandardMaterial color="#ffbe0b" roughness={0.28} metalness={0.7} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.92, 0]}>
        <boxGeometry args={[0.38, 0.3, 0.38]} />
        <meshStandardMaterial color="#ffbe0b" roughness={0.28} metalness={0.7} />
      </mesh>

      {/* Visor slit — thin horizontal glowing bar */}
      <mesh position={[0, 0.93, 0.2]}>
        <boxGeometry args={[0.3, 0.06, 0.02]} />
        <meshStandardMaterial
          color="#ff006e"
          emissive="#ff006e"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Antenna base — thin rod */}
      <mesh position={[0.12, 1.15, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.24, 8]} />
        <meshStandardMaterial color="#7c8894" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Antenna tip — glowing orb */}
      <mesh position={[0.12, 1.3, 0]}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshStandardMaterial
          color="#ff006e"
          emissive="#ff006e"
          emissiveIntensity={1.7}
        />
      </mesh>
    </group>
  );
}
