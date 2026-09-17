# `fish` — Test Scenarios

Manual verification scripts.

---

## Scenario 1: Start a Game

```
$ printf 'n\n' | fish
Would you like instructions (y or n)?
```

**Expected:** Instructions declined; game deals hands and prompts
for the first move. Exit with `quit` or EOF.

## Scenario 2: Ask for a Rank You Hold

```
$ printf 'n\nA\nquit\n' | fish
```

**Expected:** The program accepts or rejects the ask based on the
computer's hand; no "You don't have any" error because the user holds
an Ace.

## Scenario 3: Invalid Ask

```
$ printf 'n\nQ\nquit\n' | fish
```

**Expected:** If the user's starting hand contains no Queens, the
program prints "You don't have any Q's! Guess again."

## Scenario 4: Enable Pro Mode

```
$ printf 'n\np\nA\nquit\n' | fish
```

**Expected:** After typing `p`, the message "Entering pro mode."
appears.

## Scenario 5: Show Status

```
$ printf 'n\n\nquit\n' | fish
```

**Expected:** Empty line prints the computer's hand size, deck size,
and books.

## Sign-Off Template

| Date | Tester | Build | Scenarios Passed | Notes |
|---|---|---|---|---|
| | | | | |
