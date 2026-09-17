# Fortune & Strfile — User Manual & Guide

A comprehensive command reference, database creation tutorial, and integration guide for
BSD Fortune, Strfile, and Unstr.

---

## 1. Overview of the Utilities

The Fortune suite consists of three complementary command-line programs:
1. **`fortune`:** Selects, filters, and prints random adages from pre-indexed databases.
2. **`strfile`:** Compiles a raw delimited text file into an $O(1)$ random-access binary index (`.dat`).
3. **`unstr`:** Reverses a binary `.dat` file back into an unindexed text file.

---

## 2. Command Line Flags for `fortune`

```bash
fortune [-aefilosw] [-m pattern] [[N%] file/dir/all]
```

| Flag | Name | Function & Behavior |
|:---:|---|---|
| **`-a`** | **All Fortunes** | Selects from both clean and potentially offensive databases. |
| **`-o`** | **Offensive Only** | Selects exclusively from ROT13-obfuscated offensive databases. |
| **`-s`** | **Short Only** | Limits selection to adages strictly shorter than **160 characters**. |
| **`-l`** | **Long Only** | Limits selection to maxims of **160 characters or longer**. |
| **`-m pattern`**| **Match Regex** | Searches and prints all fortunes matching the regular expression `pattern`. |
| **`-i`** | **Ignore Case** | Case-insensitive matching when used with `-m`. |
| **`-f`** | **List Files** | Lists all database files that would be searched and their probabilities, without printing a quote. |
| **`-e`** | **Equal Weight** | Treats all files as having equal probability, regardless of the number of quotes they contain. |
| **`-w`** | **Wait Delay** | Pauses execution before exiting, calculating wait duration based on quote length. |

---

## 3. Weighted Probability Selection

By default, the probability of selecting a particular fortune file is proportional to the number
of quotes it contains. Users can override this behavior by specifying explicit percentage weights:

```bash
# Allocate 80% chance to literature, 20% to computing humor
fortune 80% literature 20% fortunes

# Select only from a custom user directory
fortune ~/.fortunes/

# Inspect search probabilities across all available files
fortune -f
```

---

## 4. Creating Custom Fortune Databases with `strfile`

To create your own fortune cookie collection, you format quotations into a plain text file,
separating each quote with a single line containing only a percent sign (`%`).

### Step 1: Create the Source Text File (`quotes.txt`)
```text
Simplicity is prerequisite for reliability.
	-- Edsger W. Dijkstra
%
There are only two hard things in Computer Science: cache invalidation and naming things.
	-- Phil Karlton
%
Walking on water and developing software from a specification are easy if both are frozen.
	-- Edward V. Berard
%
```

### Step 2: Compile the Binary Index with `strfile`
```bash
strfile quotes.txt quotes.dat
```
`strfile` parses the text file and generates `quotes.dat`, reporting:
```text
"quotes.dat" created
3 strings
Longest string: 88 bytes
Shortest string: 43 bytes
```

### Options for `strfile`
```bash
strfile [-iorsx] [-c char] sourcefile [datafile]
```
- **`-c char`:** Changes the quote delimiter character from `%` to `char`.
- **`-i`:** Ignores case when ordering strings.
- **`-o`:** Orders strings alphabetically in the index table.
- **`-r`:** Randomizes the pointer order in the index table.
- **`-s`:** Silent mode; suppresses the generation summary.
- **`-x`:** Rotates each character by 13 positions (ROT13) for sensitive/offensive storage.

---

## 5. Decompiling Databases with `unstr`

If you possess a compiled binary `.dat` file and want to reconstruct the original text:
```bash
unstr quotes.dat
```
`unstr` reads the offset table from `quotes.dat`, seeks into `quotes.txt`, and outputs the quotes
separated by the appropriate delimiter character to standard output.

---

## 6. Shell Integration & Fun Combinations

### Daily Login Greeting (`~/.bashrc` or `~/.zshrc`)
Append the following line to your shell configuration:
```bash
# Greet each new terminal session with a short fortune
fortune -s
```

### The Legendary Cowsay Combination
Piping `fortune` into `cowsay` and `lolcat`:
```bash
fortune | cowsay
```
```
 _________________________________________
/ You will be recognized and honored as a \
\ fitting leader.                         /
 -----------------------------------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
