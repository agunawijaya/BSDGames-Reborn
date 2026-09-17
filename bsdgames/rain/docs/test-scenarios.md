# `rain` — Test Scenarios

> Manual scripts to verify the port behaves like the original.

---

## Scenario 1: Start with Recommended Delay

```sh
rain -d 120
```

**Expected:** Animated raindrops appear; program exits cleanly on Ctrl-C.

## Scenario 2: Default Delay

```sh
rain
```

**Expected:** Animation runs very fast; exits cleanly on Ctrl-C.

## Scenario 3: Invalid Delay

```sh
rain -d 1000
```

**Expected:** Error `Invalid delay '1000' (1-999)`.

## Scenario 4: Signal Handling

Run `rain -d 120` in one terminal and send SIGTERM from another:

```sh
kill -TERM <rain-pid>
```

**Expected:** Program exits and terminal is restored.

## Scenario 5: Visual Smoke Test

Watch for at least 10 seconds and confirm:
- Drops appear as `.`.
- Older positions show `o`, `O`, `-`, `|`, `/`, `\`.
- Erased positions are blank.
- No characters appear outside the bordered area.

## Sign-Off Template

| Tester | Date | Build | Result |
|---|---|---|---|
| | | | |

Notes:
