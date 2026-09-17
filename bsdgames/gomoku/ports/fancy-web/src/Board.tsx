import { useMemo } from 'react';
import {
  BOARD_SIZE,
  COLUMN_LETTERS,
  HOSHI_POINTS,
  type GameState,
  type Position,
  type Stone,
} from './game/state';
import { toNotation } from './game/coords';

// SVG coordinate system — units chosen so intersection spacing is 30
// and there's 40 units of padding around the grid for labels.
const PADDING = 40;
const SPACING = 30;
const BOARD_PX = PADDING * 2 + (BOARD_SIZE - 1) * SPACING; // 620
const STONE_RADIUS = 13;
const HOSHI_RADIUS = 3.5;
const LAST_MOVE_INDICATOR_RADIUS = 5;

// Palette: traditional Japanese gomoku board (kaya wood + black ink).
// Mirrored in AGENTS.md port constraints.
const COLORS = {
  board: '#e8c184',   // kaya honey wood
  grid: '#2a1e10',    // black ink grid
  hoshi: '#1a1210',   // near-black hoshi dots
  label: '#5a4530',   // warm brown label ink
  lastMove: '#c23b22', // vermillion / cinnabar seal
  winLine: '#c23b22', // vermillion winning line
} as const;

const toSvgX = (col: number): number => PADDING + col * SPACING;
const toSvgY = (row: number): number => PADDING + row * SPACING;

// -----------------------------------------------------------------------------
// Sub-components

function Grid() {
  const lines = useMemo(() => {
    const items: React.ReactElement[] = [];
    const start = PADDING;
    const end = PADDING + (BOARD_SIZE - 1) * SPACING;

    for (let i = 0; i < BOARD_SIZE; i++) {
      const p = PADDING + i * SPACING;
      // Vertical line
      items.push(
        <line
          key={`v${i}`}
          x1={p}
          y1={start}
          x2={p}
          y2={end}
          stroke={COLORS.grid}
          strokeWidth={1}
        />,
      );
      // Horizontal line
      items.push(
        <line
          key={`h${i}`}
          x1={start}
          y1={p}
          x2={end}
          y2={p}
          stroke={COLORS.grid}
          strokeWidth={1}
        />,
      );
    }
    return items;
  }, []);
  return <g aria-hidden="true">{lines}</g>;
}

function Hoshi() {
  return (
    <g aria-hidden="true">
      {HOSHI_POINTS.map((p, i) => (
        <circle
          key={i}
          cx={toSvgX(p.col)}
          cy={toSvgY(p.row)}
          r={HOSHI_RADIUS}
          fill={COLORS.hoshi}
        />
      ))}
    </g>
  );
}

function Labels() {
  const items: React.ReactElement[] = [];
  const cols = COLUMN_LETTERS.length;
  for (let c = 0; c < cols; c++) {
    const x = toSvgX(c);
    items.push(
      <text
        key={`ct${c}`}
        x={x}
        y={PADDING - 15}
        fontSize={13}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fill={COLORS.label}
        textAnchor="middle"
      >
        {COLUMN_LETTERS[c]}
      </text>,
    );
    items.push(
      <text
        key={`cb${c}`}
        x={x}
        y={PADDING + (BOARD_SIZE - 1) * SPACING + 25}
        fontSize={13}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fill={COLORS.label}
        textAnchor="middle"
      >
        {COLUMN_LETTERS[c]}
      </text>,
    );
  }
  for (let r = 0; r < BOARD_SIZE; r++) {
    const y = toSvgY(r) + 4;
    items.push(
      <text
        key={`rl${r}`}
        x={PADDING - 15}
        y={y}
        fontSize={13}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fill={COLORS.label}
        textAnchor="middle"
      >
        {r + 1}
      </text>,
    );
    items.push(
      <text
        key={`rr${r}`}
        x={PADDING + (BOARD_SIZE - 1) * SPACING + 15}
        y={y}
        fontSize={13}
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fill={COLORS.label}
        textAnchor="middle"
      >
        {r + 1}
      </text>,
    );
  }
  return <g aria-hidden="true">{items}</g>;
}

type StoneProps = Readonly<{
  col: number;
  row: number;
  stone: Stone;
  isLastMove: boolean;
  isNewMove: boolean;
}>;

function StoneMesh({ col, row, stone, isLastMove, isNewMove }: StoneProps) {
  const cx = toSvgX(col);
  const cy = toSvgY(row);
  const label = `${stone === 'black' ? 'Black' : 'White'} stone at ${toNotation(col, row)}`;
  const gradientId = stone === 'black' ? 'black-stone' : 'white-stone';
  return (
    <g>
      <circle
        className={`stone${isNewMove ? ' new' : ''}`}
        cx={cx}
        cy={cy}
        r={STONE_RADIUS}
        fill={`url(#${gradientId})`}
      >
        <title>{label}</title>
      </circle>
      {isLastMove && (
        <circle
          cx={cx}
          cy={cy}
          r={LAST_MOVE_INDICATOR_RADIUS}
          fill="none"
          stroke={COLORS.lastMove}
          strokeWidth={2}
          pointerEvents="none"
          aria-hidden="true"
        />
      )}
    </g>
  );
}

function WinLine({ positions }: { positions: readonly Position[] }) {
  if (positions.length < 2) return null;
  const start = positions[0];
  const end = positions[positions.length - 1];
  return (
    <line
      className="win-line"
      x1={toSvgX(start.col)}
      y1={toSvgY(start.row)}
      x2={toSvgX(end.col)}
      y2={toSvgY(end.row)}
      stroke={COLORS.winLine}
      strokeWidth={5}
      strokeLinecap="round"
      pointerEvents="none"
    />
  );
}

// -----------------------------------------------------------------------------
// Public component

type Props = Readonly<{
  state: GameState;
  onPlace: (at: Position) => void;
}>;

export function Board({ state, onPlace }: Props) {
  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (state.status !== 'playing') return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scale = BOARD_PX / rect.width;
    const svgX = (e.clientX - rect.left) * scale;
    const svgY = (e.clientY - rect.top) * scale;
    const col = Math.round((svgX - PADDING) / SPACING);
    const row = Math.round((svgY - PADDING) / SPACING);
    if (col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE) {
      onPlace({ col, row });
    }
  }

  return (
    <div className="board-wrapper">
      <svg
        className={`board${state.status !== 'playing' ? ' game-over' : ''}`}
        viewBox={`0 0 ${BOARD_PX} ${BOARD_PX}`}
        role="grid"
        aria-label={`${BOARD_SIZE} by ${BOARD_SIZE} gomoku board. ${
          state.moves.length
        } move${state.moves.length === 1 ? '' : 's'} played.`}
        onPointerDown={handlePointerDown}
      >
        <defs>
          {/* Black slate (mikage) stone — matte with a soft highlight. */}
          <radialGradient id="black-stone" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="55%" stopColor="#141410" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          {/* White shell (hamaguri) stone — warm cream with a subtle shadow. */}
          <radialGradient id="white-stone" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f2eddb" />
            <stop offset="100%" stopColor="#d0c6a6" />
          </radialGradient>
        </defs>

        <rect
          x={0}
          y={0}
          width={BOARD_PX}
          height={BOARD_PX}
          fill={COLORS.board}
          rx={4}
        />

        <Grid />
        <Hoshi />
        <Labels />

        {state.moves.map((m, i) => (
          <StoneMesh
            key={`${m.col},${m.row}`}
            col={m.col}
            row={m.row}
            stone={m.stone}
            isLastMove={i === state.moves.length - 1}
            isNewMove={i === state.moves.length - 1}
          />
        ))}

        {state.winner && <WinLine positions={state.winner.line} />}
      </svg>
    </div>
  );
}
