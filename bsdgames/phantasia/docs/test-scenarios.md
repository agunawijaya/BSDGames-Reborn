# `phantasia` — Manual Test Scenarios

> Human-executable playthrough scripts.

---

## Test Environment

- **Terminal:** 80×24 minimum.
- **Platform:** Linux / WSL2. Requires `phantasia` compiled from
  source with proper setup (not shipped in default Debian
  bsdgames).
- **Setup**: character file, void file, MOTD, scoreboard, monster
  file must exist.

## Smoke & Regression Suite

### T-01 — First-time startup

**Setup:** Fresh install, empty character file.
**Steps:**
1. Launch `phantasia`.
2. Observe welcome and MOTD.
3. At character name prompt, type `newcharacter`.

**Expected:** Character creation menu appears.

### T-02 — Character creation flow (Magic User)

**Steps:**
1. Type `newcharacter`.
2. Enter name (e.g., "Gandalf").
3. Enter password.
4. Choose type: Magic User.
5. Observe rolled stats.

**Expected:** Stats within Magic User range (Strength 10-15,
etc.). Character saved to file.

### T-03 — Re-login

**Steps:**
1. Quit game.
2. Relaunch `phantasia`.
3. Enter existing character name.
4. Enter password.

**Expected:** Character loads with all stats preserved.

### T-04 — Movement

**Steps:**
1. Login.
2. Press `E` (east).
3. Observe coordinate change.

**Expected:** X coordinate increases by (1 + 1.5 × level).

### T-05 — Rest and mana regen

**Steps:**
1. Move around and expend mana.
2. Press `7` (rest).

**Expected:** Mana increases; energy restored to max.

### T-06 — Call monster

**Steps:**
1. Press `9` or `C`.

**Expected:** Monster appears; combat menu shown.

### T-07 — Melee combat

**Setup:** In monster combat.
**Steps:**
1. Choose `melee`.

**Expected:** Damage dealt based on strength; monster counter-
attacks.

### T-08 — Luckout

**Setup:** In monster combat.
**Steps:**
1. Choose `luckout`.

**Expected:** Brains contest resolved; instant kill on success or
lost chance on failure.

### T-09 — All or nothing spell

**Setup:** In monster combat with mana ≥ 1.
**Steps:**
1. Choose `spell` → `all or nothing`.

**Expected:** 25% instant kill, 75% double monster stats.

### T-10 — Cloak spell

**Setup:** Magic level ≥ 20, character level ≥ 7, mana ≥ 35.
**Steps:**
1. Press `6` (cloak).

**Expected:** Cloak on; player shows as `?` to others; can't
collect mana.

### T-11 — See other players

**Setup:** Multi-player session with 2+ players.
**Steps:**
1. Press `2` (players).

**Expected:** List of visible players (those closer to origin).

### T-12 — Talk to player

**Setup:** Multi-player session.
**Steps:**
1. Press `3` (talk).
2. Select target.
3. Enter message.

**Expected:** Message delivered to target's next turn.

### T-13 — Inter-terminal battle

**Setup:** Multi-player session, encounter another player.
**Steps:**
1. Press `1` (fight).
2. Opponent accepts.

**Expected:** Both processes enter PvP loop; alternating turns.

### T-14 — Power blast

**Setup:** In PvP.
**Steps:**
1. Choose `spell` → `power blast`.

**Expected:** Damage = 5 × level; high damage.

### T-15 — Character death and scoreboard

**Setup:** Reduce energy to 0.
**Expected:** Death message; character removed from file; entry
added to scoreboard.

### T-16 — Wizard mode

**Setup:** Running as root.
**Steps:**
1. Launch `phantasia -S`.

**Expected:** Wizard menu; can modify any character.

### T-17 — Purge old characters

**Steps:**
1. Launch `phantasia -p`.

**Expected:** Characters idle beyond threshold removed. Report
printed.

### T-18 — Scoreboard

**Steps:**
1. Launch `phantasia -b`.

**Expected:** Ranked list of dead characters by login.

### T-19 — All character listing

**Steps:**
1. Launch `phantasia -a`.

**Expected:** Names of all current characters.

### T-20 — Monster listing

**Steps:**
1. Launch `phantasia -m`.

**Expected:** All 100 monsters listed.

## Sign-off Template

```
- [ ] T-01 first-time startup
- [ ] T-02 character creation (Magic User)
- [ ] T-03 re-login
- [ ] T-04 movement
- [ ] T-05 rest and regen
- [ ] T-06 call monster
- [ ] T-07 melee combat
- [ ] T-08 luckout
- [ ] T-09 all or nothing spell
- [ ] T-10 cloak spell
- [ ] T-11 see other players
- [ ] T-12 talk to player
- [ ] T-13 inter-terminal battle
- [ ] T-14 power blast
- [ ] T-15 death and scoreboard
- [ ] T-16 wizard mode (root)
- [ ] T-17 purge
- [ ] T-18 scoreboard
- [ ] T-19 all character listing
- [ ] T-20 monster listing

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
Character types tested: [list]
```

## Regression from Bugs

*(None yet — port not started.)*
