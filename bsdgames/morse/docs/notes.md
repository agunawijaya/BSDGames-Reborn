# `morse` — Working Notes

---

## Source quick facts

- Single file `morse.c`, 266 lines.
- Encode/decode International Morse code.
- No original man page in BSDGames source.

## Decisions pending

- Target language pending root ADR.
- Whether to add audio output or visual flashing.

## Interesting observations

- Tables `alph[]` and `digit[]` are reused for encoding and decoding.
- Encoding always ends with the SK prosign `...-.-`.
- Unknown decoded tokens print `x`.
