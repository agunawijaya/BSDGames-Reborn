// Notation ↔ (col, row) conversion.
//
// The original spec uses letter-number notation ("K10") where the
// letter is the column (A..T skipping I) and the number is the row
// (1..19). This module bridges that human notation to the port's
// 0-indexed (col, row) tuples.

import { BOARD_SIZE, COLUMN_LETTERS, type Position } from './state';

/** Convert 0-indexed (col, row) into "K10"-style notation. */
export function toNotation(col: number, row: number): string {
  if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) {
    throw new RangeError(`Out of bounds: (${col}, ${row})`);
  }
  return `${COLUMN_LETTERS[col]}${row + 1}`;
}

/**
 * Parse "K10" (or "k10", " K10 ", etc.) into a 0-indexed Position.
 * Returns null if the string cannot be parsed as a legal on-board
 * coordinate. Never throws.
 */
export function fromNotation(input: string): Position | null {
  const trimmed = input.trim().toUpperCase();
  if (trimmed.length < 2 || trimmed.length > 3) return null;

  const letter = trimmed[0];
  const rowPart = trimmed.slice(1);

  const col = COLUMN_LETTERS.indexOf(letter);
  if (col < 0) return null;

  if (!/^\d+$/.test(rowPart)) return null;
  const rowOneIndexed = Number.parseInt(rowPart, 10);
  if (rowOneIndexed < 1 || rowOneIndexed > BOARD_SIZE) return null;

  return { col, row: rowOneIndexed - 1 };
}
