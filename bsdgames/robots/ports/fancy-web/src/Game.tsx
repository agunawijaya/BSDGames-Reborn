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
import {
  loadHighScores,
  qualifiesForLeaderboard,
  saveHighScore,
  type HighScoreEntry,
} from './game/highScores';
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
const DEFAULT_ZOOM = MIN_ZOOM; // Spawn fully zoomed out — "planet from afar"
const ZOOM_STEP = 1.2;

// Halo attenuation — the aura ring's emissive intensity (and thus how much
// bloom it produces) is a function of zoom. At MIN_ZOOM the halo is at
// full strength for the wide "planet view". As the player zooms in, the
// halo fades so it doesn't cause silau at close range.
const HALO_MIN = 0.08; // fraction of full intensity at MAX_ZOOM

function haloIntensityForZoom(zoom: number): number {
  const t = Math.min(1, Math.max(0, (zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)));
  return Math.max(HALO_MIN, 1 - t * (1 - HALO_MIN));
}

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

// Aura + backing plate geometry.
//   - Backing plate: opaque dark rectangle beneath the tiles. Extended
//     several units past the platform edge so that (a) it blocks CSS
//     starfield through tile gaps, and (b) any bloom bleed inward from
//     the aura ring lands on the plate — not on the tiles — keeping the
//     grid crisp. Colored to match the CSS starfield near-center so the
//     visible plate blends invisibly into surrounding space.
//   - Aura: a much larger emissive slab BELOW the backing plate. Only
//     the ring extending past the backing plate reaches the camera,
//     forming the bright halo ring around the platform. Bloom bleed
//     outward from this ring is the wide soft halo the player sees.
const BACKING_PLATE_MARGIN = 3;  // opaque buffer past platform edge
const AURA_RING_WIDTH = 4;       // visible width of aura ring per side

const AURA_BASE_EMISSIVE = 2.2;

type PlatformAuraProps = Readonly<{ intensity: number }>;

function PlatformAura({ intensity }: PlatformAuraProps) {
  const width = GRID_WIDTH + (BACKING_PLATE_MARGIN + AURA_RING_WIDTH) * 2;
  const depth = GRID_HEIGHT + (BACKING_PLATE_MARGIN + AURA_RING_WIDTH) * 2;
  return (
    <mesh position={[0, -0.9, 0]}>
      <boxGeometry args={[width, 0.1, depth]} />
      <meshStandardMaterial
        color={COLORS.tileTop}
        emissive={COLORS.tileTop}
        emissiveIntensity={AURA_BASE_EMISSIVE * intensity}
        roughness={0.6}
        metalness={0.2}
      />
    </mesh>
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
  const halo = haloIntensityForZoom(zoom);
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

      {/* Aura plate — large emissive slab below the backing plate. Its
          center is occluded by the backing plate; only the ring extending
          past the platform edges is visible from above. That ring is a big
          bright bloom source → wide, soft halo bleed into the surrounding
          CSS starfield. Intensity attenuates with zoom (bright when zoomed
          out for "planet view", dims at close-range gameplay to avoid
          silau on the tiles). */}
      <PlatformAura intensity={halo} />

      {/* Backing plate — extended well past the platform edge (3 units per
          side) so it occludes both the CSS starfield through tile gaps
          AND the aura's inward bloom bleed. Colored to match the CSS
          starfield near-center gradient (#0a1428) so the visible buffer
          ring outside the tile grid blends invisibly with surrounding
          space. */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry
          args={[
            GRID_WIDTH + BACKING_PLATE_MARGIN * 2,
            0.6,
            GRID_HEIGHT + BACKING_PLATE_MARGIN * 2,
          ]}
        />
        <meshStandardMaterial
          color="#0a1428"
          roughness={0.9}
          metalness={0.15}
        />
      </mesh>

      {/* No perimeter frame — the aura ring alone provides the halo, and
          keeping tiles free of any bright rim source stops bloom from
          bleeding onto the outermost tiles. */}

      <GridFloor />

      {/* Post-processing: Bloom bleeds emissive surfaces (tiles, LEDs) into
          surrounding pixels. With a transparent Canvas backdrop, the bloom
          composites over the CSS starfield to produce a "planet halo in
          space" — cyan glow that extends past the tile edges into the void. */}
      <EffectComposer>
        <Bloom
          intensity={2.2}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.6}
          radius={0.9}
          mipmapBlur
        />
      </EffectComposer>

      <AnimatedGroup
        target={gridToWorld(state.player)}
        stepDurationMs={340}
        stepHeight={0.12}
        rotationSpeed={18}
      >
        <PlayerMesh />
      </AnimatedGroup>

      {state.robots.map((r) => (
        <AnimatedGroup
          key={`robot-${r.id}`}
          target={gridToWorld(r)}
          stepDurationMs={240}
          stepHeight={0.06}
          rotationSpeed={14}
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
  highScores: readonly HighScoreEntry[];
  isNewBest: boolean;
  onRestart: () => void;
  onAdvance: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onHelp: () => void;
}>;

function Hud({
  state,
  waiting,
  highScores,
  isNewBest,
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
          <p style={{ margin: '0 0 0.75rem 0', opacity: 0.85 }}>
            You were caught on level {state.level}.
          </p>
          <p style={{ margin: '0 0 0.75rem 0', fontSize: '1.5rem' }}>
            Final score: <b>{state.score}</b>
          </p>
          {isNewBest && (
            <p
              style={{
                margin: '0 0 1rem 0',
                color: '#ffbe0b',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              🏆 New high score!
            </p>
          )}
          {highScores.length > 0 && (
            <div style={highScoreListStyle}>
              <div style={highScoreTitleStyle}>Top scores</div>
              {highScores.slice(0, 5).map((entry, i) => {
                const isCurrent =
                  entry.score === state.score && entry.level === state.level;
                return (
                  <div
                    key={`${entry.date}-${i}`}
                    style={{
                      ...highScoreRowStyle,
                      color: isCurrent ? '#ffbe0b' : '#e5eef7',
                      fontWeight: isCurrent ? 700 : 400,
                    }}
                  >
                    <span style={{ opacity: 0.55, width: '2ch' }}>
                      #{i + 1}
                    </span>
                    <span style={{ flex: 1, textAlign: 'left', paddingLeft: '0.5rem' }}>
                      {entry.score}
                    </span>
                    <span style={{ opacity: 0.7 }}>Lv {entry.level}</span>
                  </div>
                );
              })}
            </div>
          )}
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
  const [highScores, setHighScores] = useState<readonly HighScoreEntry[]>(
    () => loadHighScores(),
  );
  const [isNewBest, setIsNewBest] = useState<boolean>(false);

  // Persist the run to the local high-score list once, on transition to
  // the `dead` status. Effect re-fires only when the status ID changes.
  useEffect(() => {
    if (state.status !== 'dead') return;
    const qualifies = qualifiesForLeaderboard(state.score);
    setIsNewBest(qualifies);
    setHighScores(
      saveHighScore({
        score: state.score,
        level: state.level,
        date: new Date().toISOString(),
      }),
    );
    // Intentionally not depending on state.score/state.level — they can't
    // change while status stays 'dead', so status alone triggers this once
    // per death.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

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
    setZoom(DEFAULT_ZOOM); // reset to fully zoomed-out cinematic view
    setIsNewBest(false);   // clear the new-best banner
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
        highScores={highScores}
        isNewBest={isNewBest}
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

const highScoreListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
  margin: '0 0 1.25rem 0',
  padding: '0.6rem 0.8rem',
  background: 'rgba(76, 201, 240, 0.06)',
  border: '1px solid rgba(76, 201, 240, 0.25)',
  borderRadius: '0.4rem',
  fontSize: '0.85rem',
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  textAlign: 'left',
};

const highScoreTitleStyle: CSSProperties = {
  fontSize: '0.7rem',
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: '#adb5bd',
  marginBottom: '0.25rem',
};

const highScoreRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '0.3rem',
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
