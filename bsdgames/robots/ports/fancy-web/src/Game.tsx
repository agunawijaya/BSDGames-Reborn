import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { OrthographicCamera, Vector3 } from 'three';

import {
  DIRECTIONS,
  GRID_HEIGHT,
  GRID_WIDTH,
  type GameState,
  type Position,
} from './game/state';
import {
  initGame,
  movePlayer,
  nextLevel,
  safeWaitStep,
  teleport,
} from './game/engine';
import { RNG } from './game/rng';
import { attachKeyboard, type KeyAction } from './input/keyboard';
import { PlayerMesh } from './entities/Player';
import { RobotMesh } from './entities/Robot';
import { PileMesh } from './entities/Pile';
import { AnimatedGroup } from './entities/AnimatedGroup';
import { HelpPanel } from './ui/HelpPanel';

// Palette — Monument Valley / Into the Breach inspired. See ADR-001.
const COLORS = {
  bg: '#050912',
  tileTop: '#4cc9f0',
  tileEdgeTint: '#3a86a8',
  ambientLight: '#eef4ff',
  keyLight: '#ffffff',
  underglow: '#4cc9f0',
} as const;

// World-space constants.
const TILE_SIZE = 1;
const TILE_GAP = 0.1;
const TILE_HEIGHT = 0.25;

// Grid center → world origin.
const OFFSET_X = -(GRID_WIDTH - 1) / 2;
const OFFSET_Z = -(GRID_HEIGHT - 1) / 2;
const ENTITY_Y = TILE_HEIGHT / 2;

// Zoom bounds (orthographic camera zoom factor).
const MIN_ZOOM = 8;
const MAX_ZOOM = 55;
const DEFAULT_ZOOM = 14;
const ZOOM_STEP = 1.2;

// When zoom exceeds FOLLOW_BLEND_START, the camera begins interpolating from
// grid-center to player-centered; by FOLLOW_BLEND_END, the camera fully
// follows the player.
const FOLLOW_BLEND_START = 20;
const FOLLOW_BLEND_END = 30;

function gridToWorld(pos: Position): [number, number, number] {
  return [pos.x + OFFSET_X, ENTITY_Y, pos.y + OFFSET_Z];
}

// -----------------------------------------------------------------------------
// CSS starfield (guaranteed to render behind the Canvas).

function generateStarSvg(): string {
  const circles: string[] = [];
  const rand = mulberry(2026);
  for (let i = 0; i < 350; i++) {
    const cx = rand() * 1000;
    const cy = rand() * 1000;
    const r = 0.4 + rand() * 1.2;
    const opacity = 0.35 + rand() * 0.55;
    circles.push(
      `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(2)}" fill="white" opacity="${opacity.toFixed(2)}"/>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">${circles.join('')}</svg>`;
}

function mulberry(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    let t = (s += 0x6d2b79f5) >>> 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR_BG_URL = `url("data:image/svg+xml;utf8,${encodeURIComponent(generateStarSvg())}")`;

// -----------------------------------------------------------------------------
// Static grid — luminous cyan platform.

type TileProps = Readonly<{ x: number; z: number }>;

function Tile({ x, z }: TileProps) {
  return (
    <mesh position={[x, 0, z]}>
      <boxGeometry
        args={[TILE_SIZE - TILE_GAP, TILE_HEIGHT, TILE_SIZE - TILE_GAP]}
      />
      <meshStandardMaterial
        color={COLORS.tileTop}
        roughness={0.5}
        metalness={0.15}
        emissive={COLORS.tileTop}
        emissiveIntensity={0.12}
      />
    </mesh>
  );
}

const GridFloor = (() => {
  function Component() {
    const tiles: ReactNode[] = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        tiles.push(<Tile key={`${x},${y}`} x={x + OFFSET_X} z={y + OFFSET_Z} />);
      }
    }
    return <group>{tiles}</group>;
  }
  return Component;
})();

// -----------------------------------------------------------------------------
// Perimeter frame — four thin emissive bars around the platform edge.
// This is the primary bloom source: its outward glow produces the "planet
// halo" halo effect against the surrounding starfield.

const FRAME_HALF_X = GRID_WIDTH / 2 + 0.5; // just outside tile edges
const FRAME_HALF_Z = GRID_HEIGHT / 2 + 0.5;
const FRAME_THICKNESS = 0.4;
const FRAME_HEIGHT = 0.35;
const FRAME_Y = 0.05; // slight lift above the tile plane

function FrameBar({
  position,
  size,
}: Readonly<{
  position: [number, number, number];
  size: [number, number, number];
}>) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={COLORS.tileTop}
        emissive={COLORS.tileTop}
        emissiveIntensity={1.4}
        roughness={0.3}
        metalness={0.5}
      />
    </mesh>
  );
}

function PlatformFrame() {
  return (
    <group>
      {/* North bar (−z edge) */}
      <FrameBar
        position={[0, FRAME_Y, -FRAME_HALF_Z]}
        size={[FRAME_HALF_X * 2 + FRAME_THICKNESS, FRAME_HEIGHT, FRAME_THICKNESS]}
      />
      {/* South bar (+z edge) */}
      <FrameBar
        position={[0, FRAME_Y, FRAME_HALF_Z]}
        size={[FRAME_HALF_X * 2 + FRAME_THICKNESS, FRAME_HEIGHT, FRAME_THICKNESS]}
      />
      {/* West bar (−x edge) */}
      <FrameBar
        position={[-FRAME_HALF_X, FRAME_Y, 0]}
        size={[FRAME_THICKNESS, FRAME_HEIGHT, FRAME_HALF_Z * 2]}
      />
      {/* East bar (+x edge) */}
      <FrameBar
        position={[FRAME_HALF_X, FRAME_Y, 0]}
        size={[FRAME_THICKNESS, FRAME_HEIGHT, FRAME_HALF_Z * 2]}
      />
    </group>
  );
}

// -----------------------------------------------------------------------------
// Camera controller — smoothly lerps zoom and (at high zoom) follows the
// player. useFrame runs every frame so both changes animate rather than snap.

type CameraControllerProps = Readonly<{
  zoom: number;
  playerWorld: [number, number, number];
}>;

const CAMERA_OFFSET = new Vector3(40, 40, 40);

function CameraController({ zoom, playerWorld }: CameraControllerProps) {
  const { camera } = useThree();
  const smoothedZoom = useRef(zoom);
  const smoothedTarget = useRef(new Vector3(0, 0, 0));

  useFrame((_, delta) => {
    if (!(camera instanceof OrthographicCamera)) return;

    // Smooth zoom
    const zoomLerpT = Math.min(1, delta * 9);
    smoothedZoom.current += (zoom - smoothedZoom.current) * zoomLerpT;
    if (Math.abs(camera.zoom - smoothedZoom.current) > 0.001) {
      camera.zoom = smoothedZoom.current;
      camera.updateProjectionMatrix();
    }

    // Follow blend: 0 at low zoom (grid center), 1 at high zoom (player center)
    const blend = Math.max(
      0,
      Math.min(
        1,
        (zoom - FOLLOW_BLEND_START) / (FOLLOW_BLEND_END - FOLLOW_BLEND_START),
      ),
    );
    const desiredX = playerWorld[0] * blend;
    const desiredY = playerWorld[1] * blend;
    const desiredZ = playerWorld[2] * blend;

    // Smooth target
    const posLerpT = Math.min(1, delta * 6);
    smoothedTarget.current.x += (desiredX - smoothedTarget.current.x) * posLerpT;
    smoothedTarget.current.y += (desiredY - smoothedTarget.current.y) * posLerpT;
    smoothedTarget.current.z += (desiredZ - smoothedTarget.current.z) * posLerpT;

    camera.position.set(
      smoothedTarget.current.x + CAMERA_OFFSET.x,
      smoothedTarget.current.y + CAMERA_OFFSET.y,
      smoothedTarget.current.z + CAMERA_OFFSET.z,
    );
    camera.lookAt(smoothedTarget.current);
  });

  return null;
}

// -----------------------------------------------------------------------------
// Scene: starfield, lights, grid, entities.

type SceneProps = Readonly<{
  state: GameState;
  zoom: number;
  playerWorld: [number, number, number];
}>;

function Scene({ state, zoom, playerWorld }: SceneProps) {
  return (
    <>
      <CameraController zoom={zoom} playerWorld={playerWorld} />

      {/* Stars are drawn by the CSS layer behind a transparent Canvas — see
          `rootStyle`. No Three.js starfield here (previous attempts caused
          points to render in front of the platform due to depth ordering
          with orthographic camera). */}

      {/* Ambient light — kept low so the emissive platform reads as glowing */}
      <ambientLight color={COLORS.ambientLight} intensity={0.2} />

      {/* Key light — main directional source, upper-right */}
      <directionalLight
        color={COLORS.keyLight}
        position={[20, 30, 15]}
        intensity={0.85}
      />

      {/* Fill light — cool blue rim on opposite side */}
      <directionalLight
        color={COLORS.tileEdgeTint}
        position={[-18, 8, -22]}
        intensity={0.35}
      />

      {/* Underglow — point light beneath the platform */}
      <pointLight
        position={[0, -4, 0]}
        color={COLORS.underglow}
        intensity={2.5}
        distance={40}
        decay={1}
      />

      {/* Backing plate — solid opaque box beneath the tile grid, extending
          past its edges. Since Canvas is transparent, this plate is what
          blocks the CSS starfield from showing through the gaps between
          tiles. Slightly lighter than space so it reads as "planet surface"
          rather than blending with the void. */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[GRID_WIDTH + 2, 0.6, GRID_HEIGHT + 2]} />
        <meshStandardMaterial
          color="#08152a"
          roughness={0.9}
          metalness={0.2}
        />
      </mesh>

      {/* Perimeter frame — the sole strong bloom source. Emits halo
          outward (into surrounding transparent space + CSS starfield).
          Tiles themselves have only faint emissive so the grid pattern
          stays crisp instead of being washed out by inward bloom bleed. */}
      <PlatformFrame />

      <GridFloor />

      {/* Post-processing: Bloom bleeds emissive surfaces (tiles, LEDs) into
          surrounding pixels. With a transparent Canvas backdrop, the bloom
          composites over the CSS starfield to produce a "planet halo in
          space" — cyan glow that extends past the tile edges into the void. */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.5}
          luminanceSmoothing={0.55}
          radius={0.8}
          mipmapBlur
        />
      </EffectComposer>

      <AnimatedGroup target={gridToWorld(state.player)}>
        <PlayerMesh />
      </AnimatedGroup>

      {state.robots.map((r) => (
        <AnimatedGroup
          key={`robot-${r.id}`}
          target={gridToWorld(r)}
          speed={10}
          bounceHeight={0.08}
          bounceSpeed={12}
        >
          <RobotMesh />
        </AnimatedGroup>
      ))}

      {state.piles.map((p) => (
        <PileMesh
          key={`pile-${p.x}-${p.y}`}
          position={gridToWorld(p)}
          seed={p.x * 1000 + p.y + 1}
        />
      ))}
    </>
  );
}

// -----------------------------------------------------------------------------
// HUD (React DOM overlay).

type HudProps = Readonly<{
  state: GameState;
  waiting: boolean;
  onRestart: () => void;
  onAdvance: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onHelp: () => void;
}>;

function Hud({
  state,
  waiting,
  onRestart,
  onAdvance,
  onZoomIn,
  onZoomOut,
  onHelp,
}: HudProps) {
  return (
    <>
      <div style={hudTopLeftStyle}>
        <div style={hudTitleStyle}>Robots — fancy-web</div>
        <div style={hudSubtitleStyle}>
          hjkl / arrows: move · yubn: diagonal · t: teleport · w: wait ·
          <button style={inlineHelpButtonStyle} onClick={onHelp}>? help</button>
        </div>
      </div>

      <div style={hudTopRightStyle}>
        <div>Level <b>{state.level}</b></div>
        <div>Score <b>{state.score}</b></div>
        <div>Robots left <b>{state.robots.length}</b></div>
        {state.waitBonus > 0 && (
          <div style={{ color: '#ffbe0b' }}>
            Wait bonus <b>+{state.waitBonus}</b>
          </div>
        )}
      </div>

      <div style={zoomButtonsStyle}>
        <button style={zoomButtonStyle} onClick={onZoomIn} title="Zoom in (+)">
          +
        </button>
        <button style={zoomButtonStyle} onClick={onZoomOut} title="Zoom out (−)">
          −
        </button>
      </div>

      {waiting && (
        <div style={waitingIndicatorStyle}>
          <span style={{ opacity: 0.9 }}>⏳ Auto-waiting…</span>
          <span style={{ opacity: 0.6, fontSize: '0.75rem', marginLeft: '0.5rem' }}>
            press any key to interrupt
          </span>
        </div>
      )}

      {state.status === 'dead' && (
        <Modal>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#ff006e' }}>
            AARRrrgghhhh…
          </h2>
          <p style={{ margin: '0 0 1rem 0', opacity: 0.85 }}>
            You were caught on level {state.level}.
          </p>
          <p style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
            Final score: <b>{state.score}</b>
          </p>
          <button style={primaryButtonStyle} onClick={onRestart} autoFocus>
            Play again
          </button>
        </Modal>
      )}

      {state.status === 'level-clear' && (
        <Modal>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#4cc9f0' }}>
            Level {state.level} cleared!
          </h2>
          <p style={{ margin: '0 0 1.5rem 0', fontSize: '1.5rem' }}>
            Score: <b>{state.score}</b>
          </p>
          <button style={primaryButtonStyle} onClick={onAdvance} autoFocus>
            Continue to level {state.level + 1}
          </button>
        </Modal>
      )}
    </>
  );
}

function Modal({ children }: { children: ReactNode }) {
  return (
    <div style={modalBackdropStyle}>
      <div style={modalPanelStyle}>{children}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Root component.

// Auto-wait step interval — long enough for movement lerp to visibly settle,
// short enough to feel responsive. ~180 ms ≈ 3 lerp half-lives at speed=10.
const WAIT_STEP_MS = 180;

export function Game() {
  const rngRef = useRef<RNG>(new RNG(Date.now()));
  const [state, setState] = useState<GameState>(() =>
    initGame(1, rngRef.current),
  );
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [waiting, setWaiting] = useState<boolean>(false);

  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(MAX_ZOOM, z * ZOOM_STEP)),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(MIN_ZOOM, z / ZOOM_STEP)),
    [],
  );
  const toggleHelp = useCallback(() => setShowHelp((s) => !s), []);

  // Auto-wait animation loop — plays one safe-wait turn every WAIT_STEP_MS
  // while the `waiting` flag is set. Halts on level-clear, death, safe-stop,
  // or any other player action (see handleAction).
  useEffect(() => {
    if (!waiting) return;
    const timer = setInterval(() => {
      let shouldStop = false;
      setState((prev) => {
        const result = safeWaitStep(prev);
        shouldStop =
          result.state === prev ||
          result.state.status !== 'playing' ||
          result.state.robots.length === 0;
        return result.state;
      });
      if (shouldStop) {
        setWaiting(false);
      }
    }, WAIT_STEP_MS);
    return () => clearInterval(timer);
  }, [waiting]);

  const handleAction = useCallback((action: KeyAction) => {
    if (action.kind === 'help') {
      toggleHelp();
      return;
    }
    if (action.kind === 'zoom-in') {
      zoomIn();
      return;
    }
    if (action.kind === 'zoom-out') {
      zoomOut();
      return;
    }
    if (action.kind === 'wait') {
      setWaiting((w) => !w); // toggle: press w while waiting = stop wait
      return;
    }
    // Any other gameplay action interrupts an active wait.
    setWaiting(false);
    setState((prev) => {
      if (prev.status !== 'playing') return prev;
      if (action.kind === 'move') {
        return movePlayer(prev, DIRECTIONS[action.direction]).state;
      }
      if (action.kind === 'teleport') {
        return teleport(prev, rngRef.current).state;
      }
      return prev;
    });
  }, [toggleHelp, zoomIn, zoomOut]);

  useEffect(() => attachKeyboard(handleAction), [handleAction]);

  // Wheel-based zoom.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else if (e.deltaY > 0) zoomOut();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [zoomIn, zoomOut]);

  const handleRestart = useCallback(() => {
    setWaiting(false);
    setState(initGame(1, rngRef.current));
  }, []);

  const handleAdvance = useCallback(() => {
    setWaiting(false);
    setState((prev) => nextLevel(prev, rngRef.current));
  }, []);

  const initialCamera = useMemo(
    () => ({
      position: [40, 40, 40] as [number, number, number],
      zoom: DEFAULT_ZOOM,
      near: -200,
      far: 400,
    }),
    [],
  );

  const playerWorld = useMemo<[number, number, number]>(
    () => gridToWorld(state.player),
    [state.player],
  );

  return (
    <div style={rootStyle}>
      <Canvas
        dpr={[1, 2]}
        orthographic
        camera={initialCamera}
        gl={{ alpha: true, antialias: true }}
      >
        {/* No scene background — Canvas is transparent so the CSS starfield
            (rootStyle background) shows through everywhere Three.js doesn't
            render an opaque pixel. Bloom bleeds emissive tiles into those
            transparent surrounding pixels, producing the planet-halo look. */}
        <Scene state={state} zoom={zoom} playerWorld={playerWorld} />
      </Canvas>
      <Hud
        state={state}
        waiting={waiting}
        onRestart={handleRestart}
        onAdvance={handleAdvance}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onHelp={toggleHelp}
      />
      {showHelp && <HelpPanel onClose={toggleHelp} />}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Styles

const rootStyle: CSSProperties = {
  width: '100dvw',
  height: '100dvh',
  background: `${STAR_BG_URL}, radial-gradient(ellipse at center, #0a1428 0%, #050912 70%)`,
  backgroundBlendMode: 'screen',
  color: '#f8f9fa',
  fontFamily:
    '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  overflow: 'hidden',
  position: 'relative',
};

const hudTopLeftStyle: CSSProperties = {
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  pointerEvents: 'none',
  maxWidth: '60%',
  zIndex: 5,
};

const hudTitleStyle: CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 600,
  letterSpacing: '0.02em',
};

const hudSubtitleStyle: CSSProperties = {
  fontSize: '0.75rem',
  opacity: 0.75,
  marginTop: '0.25rem',
  lineHeight: 1.4,
};

const inlineHelpButtonStyle: CSSProperties = {
  pointerEvents: 'auto',
  background: 'transparent',
  border: 'none',
  color: '#4cc9f0',
  cursor: 'pointer',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  padding: '0 0.25rem',
  textDecoration: 'underline',
  marginLeft: '0.4rem',
};

const hudTopRightStyle: CSSProperties = {
  position: 'absolute',
  top: '1rem',
  right: '1rem',
  textAlign: 'right',
  fontSize: '0.85rem',
  lineHeight: 1.6,
  pointerEvents: 'none',
  background: 'rgba(5, 9, 18, 0.6)',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.4rem',
  backdropFilter: 'blur(6px)',
  zIndex: 5,
};

const zoomButtonsStyle: CSSProperties = {
  position: 'absolute',
  bottom: '1rem',
  right: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  zIndex: 5,
};

const waitingIndicatorStyle: CSSProperties = {
  position: 'absolute',
  bottom: '1.5rem',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '0.6rem 1.1rem',
  background: 'rgba(76, 201, 240, 0.15)',
  border: '1px solid rgba(76, 201, 240, 0.55)',
  borderRadius: '999px',
  color: '#e5eef7',
  fontSize: '0.95rem',
  pointerEvents: 'none',
  zIndex: 5,
  backdropFilter: 'blur(6px)',
  boxShadow: '0 0 24px rgba(76, 201, 240, 0.25)',
};

const zoomButtonStyle: CSSProperties = {
  fontFamily: 'inherit',
  fontSize: '1.2rem',
  fontWeight: 600,
  color: '#4cc9f0',
  background: 'rgba(13, 27, 42, 0.85)',
  border: '1px solid #3a86a8',
  borderRadius: '0.4rem',
  width: '2.5rem',
  height: '2.5rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  lineHeight: 1,
};

const modalBackdropStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(5, 9, 18, 0.72)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  zIndex: 5,
};

const modalPanelStyle: CSSProperties = {
  background: '#0d1b2a',
  border: '1px solid #3a86a8',
  borderRadius: '0.75rem',
  padding: '2rem 2.5rem',
  textAlign: 'center',
  minWidth: '260px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
};

const primaryButtonStyle: CSSProperties = {
  fontFamily: 'inherit',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#0d1b2a',
  background: '#4cc9f0',
  border: 'none',
  borderRadius: '0.4rem',
  padding: '0.6rem 1.2rem',
  cursor: 'pointer',
};
