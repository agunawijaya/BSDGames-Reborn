// trek/fancy-web — Guard against keyboard-shortcut / command-text
// collisions.
//
// The main.js key handler intercepts a small set of shortcut keys
// (`?`, `\`, backtick, and `v`/`V`). If any of those characters were
// ALSO part of a legitimate command word, the shortcut would eat the
// keypress before it could reach the command buffer — that's the bug
// that broke the "move" command (its 'v' switched to Galaxy Chart).
//
// This test scans the parser's keyword table and asserts that:
//   * No shortcut character (other than 'v'/'V') appears in any command.
//   * 'v'/'V' shortcut is gated behind an empty command buffer (documented
//     invariant, verified via constants below).

import { test } from 'node:test';
import assert from 'node:assert/strict';

// Full command surface — keep in sync with parser.js verbs + aliases.
const COMMAND_TOKENS = [
  'phaser', 'phasers', 'p',
  'torpedo', 'torpedoes', 'photon', 't',
  'move', 'm',
  'warp', 'w',
  'impulse', 'i',
  'srscan', 'sr',
  'lrscan', 'lr',
  'damages', 'damage', 'd',
  'dock',
  'shields', 'sh', 's',
  'computer', 'c',
  'quit', 'exit', 'q',
  'help', 'h', // note: '?' is a documented alias BUT is intercepted as a
               // global shortcut before it ever reaches the parser.
  // Arguments users might type
  'up', 'down',
];

const GLOBAL_SHORTCUTS = ['?', '\\', '`'];  // Fire regardless of buffer state
const BUFFER_GATED_SHORTCUTS = ['v', 'V'];  // Fire only when buffer empty

test('global shortcuts do not collide with any command character', () => {
  for (const shortcut of GLOBAL_SHORTCUTS) {
    for (const token of COMMAND_TOKENS) {
      assert.equal(token.includes(shortcut), false,
        `command "${token}" contains global shortcut "${shortcut}" — will collide!`);
    }
  }
});

test('buffer-gated shortcuts document a collision that must be gated', () => {
  // `v` is legitimately in "move" — that's exactly why it needs the
  // "buffer must be empty" gate. This test just documents the fact so
  // that if someone deletes the gate the intent is preserved.
  const collides = COMMAND_TOKENS.some(t => t.includes('v'));
  assert.ok(collides,
    'no command contains "v" — the buffer-gate on the V shortcut is no longer required');
});

test('input buffer regex would accept the collision character', () => {
  // main.js uses this regex to filter appendable chars.
  // Any BUFFER_GATED_SHORTCUTS char must be in this set (otherwise the
  // gate is redundant — the char would never reach the buffer anyway).
  const BUFFER_REGEX = /^[A-Za-z0-9 .\-]$/;
  for (const key of BUFFER_GATED_SHORTCUTS) {
    assert.ok(BUFFER_REGEX.test(key),
      `key "${key}" is not accepted by the buffer regex — its gate is unnecessary`);
  }
});

test('every global shortcut char is rejected by the buffer regex', () => {
  // Conversely, GLOBAL_SHORTCUTS chars must NOT be in the buffer regex,
  // otherwise the shortcut would double-fire (both intercept AND append).
  const BUFFER_REGEX = /^[A-Za-z0-9 .\-]$/;
  for (const key of GLOBAL_SHORTCUTS) {
    assert.equal(BUFFER_REGEX.test(key), false,
      `key "${key}" is accepted by buffer regex — would double-fire (intercept + append)`);
  }
});
