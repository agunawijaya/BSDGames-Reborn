import { describe, expect, it } from 'vitest';
import { fromNotation, toNotation } from '../src/game/coords';
import { BOARD_SIZE } from '../src/game/state';

describe('coords — toNotation', () => {
  it('formats the K10 center point (spec §Rules invariant 8)', () => {
    // K is the 10th letter after skipping I (A=1..H=8, J=9, K=10).
    // Board is 0-indexed so col=9 → "K", row=9 → "10".
    expect(toNotation(9, 9)).toBe('K10');
  });

  it('formats corners', () => {
    expect(toNotation(0, 0)).toBe('A1');
    expect(toNotation(BOARD_SIZE - 1, BOARD_SIZE - 1)).toBe('T19');
  });

  it('skips I (Go/gomoku tradition)', () => {
    // Column index 8 is 'J' (immediately after H), not 'I'.
    expect(toNotation(8, 0)).toBe('J1');
    // No I ever appears in output.
    for (let c = 0; c < BOARD_SIZE; c++) {
      expect(toNotation(c, 0).startsWith('I')).toBe(false);
    }
  });

  it('throws on out-of-bounds coordinates', () => {
    expect(() => toNotation(-1, 0)).toThrow(RangeError);
    expect(() => toNotation(0, BOARD_SIZE)).toThrow(RangeError);
    expect(() => toNotation(BOARD_SIZE, 0)).toThrow(RangeError);
  });
});

describe('coords — fromNotation', () => {
  it('parses K10 as (col=9, row=9)', () => {
    expect(fromNotation('K10')).toEqual({ col: 9, row: 9 });
  });

  it('is case-insensitive', () => {
    expect(fromNotation('k10')).toEqual({ col: 9, row: 9 });
    expect(fromNotation('a1')).toEqual({ col: 0, row: 0 });
    expect(fromNotation('T19')).toEqual({ col: 18, row: 18 });
  });

  it('trims surrounding whitespace', () => {
    expect(fromNotation('  K10  ')).toEqual({ col: 9, row: 9 });
  });

  it('rejects the letter I (skipped in gomoku notation)', () => {
    expect(fromNotation('I10')).toBeNull();
    expect(fromNotation('i10')).toBeNull();
  });

  it('rejects out-of-range rows', () => {
    expect(fromNotation('K0')).toBeNull();
    expect(fromNotation('K20')).toBeNull();
    expect(fromNotation('K99')).toBeNull();
  });

  it('rejects malformed input', () => {
    expect(fromNotation('')).toBeNull();
    expect(fromNotation('K')).toBeNull();
    expect(fromNotation('10K')).toBeNull();
    expect(fromNotation('KK10')).toBeNull();
    expect(fromNotation('K10K')).toBeNull();
    expect(fromNotation('!!')).toBeNull();
  });

  it('round-trips with toNotation for every board cell', () => {
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        const note = toNotation(col, row);
        const parsed = fromNotation(note);
        expect(parsed).toEqual({ col, row });
      }
    }
  });
});
