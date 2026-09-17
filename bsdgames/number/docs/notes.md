# Working Notes — `number`

- Three lookup tables drive conversion: `name1` (0–19), `name2` (tens), `name3` (scale names up to vigintillion).
- `MAXNUM` is 65 digits for both integer and fractional parts.
- `-l` mode removes sentence punctuation and separators.
- Negative numbers handled by printing "minus" and skipping the sign.
- Decimal fractions use `pfract()` with singular/plural suffix logic.
