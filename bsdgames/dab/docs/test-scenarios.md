# `dab` — Test Scenarios

Manual verification scripts.

---

## Scenario 1: Start a Game

```
$ dab
```

**Expected:** A 3x3 dots-and-boxes board appears; the human cursor is
positioned on the board. Exit with `q`.

## Scenario 2: Human vs Human

```
$ dab -p hh
```

**Expected:** Board appears; both players take turns using the same
keyboard.

## Scenario 3: Draw an Edge

Move the cursor to a gap between two dots with `h/j/k/l` and press
`Space`.

**Expected:** A line appears in that gap. If it completes a box, the
box is marked with the player's symbol and the same player moves
again.

## Scenario 4: Computer vs Computer Demo

```
$ dab -p cc -w -n 3
```

**Expected:** The computer plays three games; pressing a key advances
between games.

## Scenario 5: Larger Board

```
$ dab 5 5
```

**Expected:** A 5x5 box board appears.

## Sign-Off Template

| Date | Tester | Build | Scenarios Passed | Notes |
|---|---|---|---|---|
| | | | | |
