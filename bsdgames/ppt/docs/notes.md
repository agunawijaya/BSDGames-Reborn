# Working Notes — `ppt`

- Each byte encoded as row: | b7 b6 b5 . b4 b3 b2 b1 b0 |
- Feed hole is '.' between bits 5 and 4.
- Set bits printed as 'o', unset as space.
- Decode mode reads rows, finds '.', reconstructs byte.
- Decode mode does not accept CLI arguments.
