# `caesar` — Working Notes

---

## Source quick facts

- Single file `caesar.c`, 161 lines.
- Uses frequency analysis when no rotation is given.
- Explicit rotation via `printit()`.

## Decisions pending

- Target language pending root ADR.
- Whether to support multiple languages / frequency tables.

## Interesting observations

- `ROTATE` macro preserves case.
- `stdf` is log-scaled before dot product.
- `rot13.in` documents the historical ROT13 symlink.
