# `wargames` — Test Scenarios

Manual verification scripts.

---

## Scenario 1 — Invalid Game Name (Quote Path)

1. Run `wargames`.
2. At the prompt, type `global thermonuclear war` and press Enter.
3. **Expected:** the program prints
   ```
   A strange game.
   The only winning move is
   not to play.
   ```
   and exits with status `0`.

## Scenario 2 — Empty Input

1. Run `wargames`.
2. Press Enter without typing anything.
3. **Expected:** the quote is printed and the program exits with
   status `0`.

## Scenario 3 — Valid Game Launch (if available)

1. Ensure a game such as `robots` or `ppt` is installed in
   `/usr/games/`.
2. Run `wargames`.
3. Type the name and press Enter.
4. **Expected:** the screen clears and the requested game starts.

## Scenario 4 — Input Sanitisation

1. Run `wargames`.
2. Type `R@b ots!` and press Enter.
3. **Expected:** the sanitized lookup name is `Rbots`; because it is
   unlikely to exist, the quote is printed.

## Sign-Off Template

- [ ] Scenario 1 passes
- [ ] Scenario 2 passes
- [ ] Scenario 3 passes (or noted why unavailable)
- [ ] Scenario 4 passes
- [ ] No local filesystem paths appear in generated outputs
- [ ] Screenshots embedded in `about.md`
