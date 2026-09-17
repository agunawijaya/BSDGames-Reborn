# `countmail` — Test Scenarios

Manual verification scripts. Because `countmail` depends on `from(1)`,
tests use a fake `from` that returns a known number of lines.

---

## Scenario 1: Zero Messages

Create a fake `from` that prints nothing:

```
$ printf '#!/bin/sh\n' > /tmp/from && chmod +x /tmp/from
$ PATH=/tmp:$PATH countmail
ZERO!

ZERO MAIL MESSAGES!

HAHAHAHAHA!
```

**Expected:** Singular handling not triggered; exit code `0`.

## Scenario 2: One Message

```
$ printf '#!/bin/sh\necho "From user@host"\n' > /tmp/from && chmod +x /tmp/from
$ PATH=/tmp:$PATH countmail
ONE!

ONE MAIL MESSAGE!

HAHAHAHAHA!
```

**Expected:** Singular form, exit code `0`.

## Scenario 3: Twelve Messages

```
$ cat > /tmp/from <<'EOF'
#!/bin/sh
for i in $(seq 12); do echo "From user@host"; done
EOF
$ chmod +x /tmp/from
$ PATH=/tmp:$PATH countmail
TWELVE!

TWELVE MAIL MESSAGES!

HAHAHAHAHA!
```

**Expected:** Tens/units word, plural suffix, exit code `0`.

## Scenario 4: Large Number with Scales

```
$ cat > /tmp/from <<'EOF'
#!/bin/sh
for i in $(seq 1234567); do echo "From user@host"; done
EOF
$ chmod +x /tmp/from
$ PATH=/tmp:$PATH countmail
```

**Expected:** Output includes `ONE MILLION`, `TWO HUNDRED THIRTY-FOUR
THOUSAND`, `FIVE HUNDRED SIXTY-SEVEN`, exit code `0`.

## Scenario 5: Too Much Mail

```
$ cat > /tmp/from <<'EOF'
#!/bin/sh
for i in $(seq 100000000000000000000000000); do echo "From"; done
EOF
$ chmod +x /tmp/from
$ PATH=/tmp:$PATH countmail
YOU HAVE TOO MUCH MAIL!
```

**Expected:** Error on stderr, exit code `1`.

## Sign-Off Template

| Date | Tester | Build | Scenarios Passed | Notes |
|---|---|---|---|---|
| | | | | |
