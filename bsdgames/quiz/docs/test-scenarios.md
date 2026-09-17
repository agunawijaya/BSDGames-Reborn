# `quiz` — Test Scenarios

Manual verification scripts.

---

## Scenario 1: List Subjects

```
$ quiz
Subjects:
...
```

**Expected:** A paginated list of available subjects.

## Scenario 2: Start a Drill

```
$ quiz victim killer
Lincoln?
Booth
Right!
```

**Expected:** Question printed, correct answer accepted, next question
shown.

## Scenario 3: Wrong Answer and Reveal

```
$ quiz victim killer
Lincoln?
foo
What?

Booth
```

**Expected:** Wrong guess prints `What?`; blank line reveals `Booth`
and counts as a wrong.

## Scenario 4: Tutorial Mode

```
$ quiz -t victim killer
```

**Expected:** Missed questions reappear more often.

## Scenario 5: Invalid Categories

```
$ quiz foo bar
quiz: invalid categories
```

**Expected:** Error message, exit `1`.

## Sign-Off Template

| Date | Tester | Build | Scenarios Passed | Notes |
|---|---|---|---|---|
| | | | | |
