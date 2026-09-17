# `arithmetic` — Port Ideas

`arithmetic` is a simple but proven educational game. Modernisation
means making it more engaging, accessible, and analytically useful.

---

## Gameplay Modernisation

- **Difficulty levels:** Easy / Medium / Hard presets with different
  ranges and operator sets.
- **Timed mode:** Answer as many as possible in 60 seconds.
- **Streaks and combos:** Reward consecutive correct answers.
- **Hints:** Optional reveal of the correct answer after N wrong
  attempts (overriding the original's tough-love rule).
- **Progressive unlocks:** Start with `+`, unlock `-`, `x`, `/` as the
  player demonstrates mastery.

## UI/UX Design Ideas

- **Web UI:** Big buttons for numeric input, clear score display,
  responsive layout.
- **Terminal colour:** Green for Right!, red for What?.
- **Sound:** Optional positive/negative feedback tones.
- **Accessibility:** Keyboard navigation, screen-reader announcements,
  high-contrast mode.

## Internet Multiplayer Design

- **Classroom mode:** A teacher hosts a room; students compete on the
  same problem set.
- **Leaderboards:** Fastest average time per problem, highest streak.
- **Head-to-head:** Two players race through 20 problems.

## Persistence / Cloud / Cross-Device

- Save per-user statistics and mistake history.
- Sync progress across devices.
- Generate reports for parents/teachers (e.g. "most-missed facts").

## Other Modernisation Angles

- **Adaptive algorithm upgrade:** Replace the penalty list with a
  spaced-repetition model (SM-2).
- **Fractions/decimals:** Extend beyond integer arithmetic.
- **Localisation:** Number format and operator symbols for different
  locales.

## What NOT to Change

- Keep the core loop: ask → answer → immediate feedback.
- Do not remove the adaptive bias entirely; it is the game's identity.

## Open Questions

- Should the port preserve the original's refusal to show the right
  answer, or add an optional hint mode?
- Should division problems include remainders, or switch to exact
  division only?
