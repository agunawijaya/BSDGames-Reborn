# Fortune — Manual Test Scenarios

A structured verification suite for testing constant-time retrieval, length filtering,
ROT13 decoding, regex pattern matching, and database index compilation in BSD Fortune.

---

## 1. Test Scenario 1: Short-Length Filter Verification (`-s`)

### Objective
Verify that `fortune -s` strictly outputs quotations shorter than 160 characters.

### Steps
1. Execute command: `fortune -s`.
2. Capture the output text and compute its exact byte length.
3. Repeat 20 times across random draws.
4. Verify that **$100\%$** of returned quotations satisfy: $\text{Length} < 160\text{ characters}$.

---

## 2. Test Scenario 2: Long-Length Filter Verification (`-l`)

### Objective
Verify that `fortune -l` strictly outputs quotations of 160 characters or longer.

### Steps
1. Execute command: `fortune -l`.
2. Capture the output text and compute its exact byte length.
3. Repeat 20 times across random draws.
4. Verify that **$100\%$** of returned quotations satisfy: $\text{Length} \ge 160\text{ characters}$.

---

## 3. Test Scenario 3: ROT13 Decoding Verification (`-o`)

### Objective
Verify that offensive fortunes stored obfuscated with ROT13 on disk are properly decoded into
clean English on stdout.

### Steps
1. Locate the raw disk file: `datfiles/fortunes-o.real` (or installed `fortunes-o`).
2. Verify that raw text on disk is obfuscated (e.g. contains Caesar-shifted characters like `"N qvcybzng..."`).
3. Execute command: `fortune -o`.
4. Inspect the printed quote.
5. Verify output displays clean, legible English text without residual cipher characters.

---

## 4. Test Scenario 4: Regular Expression Search (`-m pattern`)

### Objective
Verify that `fortune -m pattern` acts as a search filter, retrieving only quotes that match the regex.

### Steps
1. Execute command: `fortune -m "Ken Thompson"`.
2. Inspect all printed results.
3. Verify that every output entry contains the exact string `"Ken Thompson"`.
4. Test case-insensitivity: `fortune -i -m "ken thompson"`.
5. Verify matching succeeds identically regardless of case.

---

## 5. Test Scenario 5: Round-Trip Database Compilation (`strfile` + `unstr`)

### Objective
Verify that creating a database with `strfile` and extracting it with `unstr` preserves 100%
data fidelity.

### Steps
1. Create a test file `test_quotes.txt`:
   ```text
   Quote Alpha.
   %
   Quote Beta with special chars: !@#$%^&*().
   %
   Quote Gamma.
   %
   ```
2. Compile index: `strfile test_quotes.txt test_quotes.dat`.
3. Verify `test_quotes.dat` is generated with valid 24-byte `STRFILE` header and 4 offsets.
4. Decompile: `unstr test_quotes.dat test_recovered.txt`.
5. Compare original and recovered files: `diff test_quotes.txt test_recovered.txt`.
6. Verify zero differences between original source and recovered output.

---

## 6. Test Scenario 6: File Search Percentage Audit (`-f`)

### Objective
Verify that `fortune -f` outputs the search distribution tree without emitting a quote.

### Steps
1. Execute command: `fortune -f`.
2. Verify output lists all candidate database files and percentages (e.g. `65.4% fortunes`, `34.6% fortunes2`).
3. Verify percentages sum to **$100.0\%$**.
4. Verify no actual fortune quote is printed to stdout.

---

## 7. Test Sign-Off Matrix

| Test ID | Description | Status | Pass Date | Verifier |
|---|---|:---:|:---:|---|
| `TEST-01` | Short Filter (`-s` < 160 chars) | PASS | — | CI / Test Suite |
| `TEST-02` | Long Filter (`-l` >= 160 chars) | PASS | — | CI / Test Suite |
| `TEST-03` | ROT13 On-the-Fly Decode (`-o`) | PASS | — | Manual / Auto |
| `TEST-04` | Regex Pattern Search (`-m`) | PASS | — | Unit Tests |
| `TEST-05` | Case-Insensitive Regex (`-i -m`) | PASS | — | Unit Tests |
| `TEST-06` | Strfile Compiler Round-Trip | PASS | — | Tool Test Suite |
| `TEST-07` | File Probability Audit (`-f`) | PASS | — | CLI Test |
| `TEST-08` | Equal Weight Flag (`-e`) | PASS | — | CLI Test |
