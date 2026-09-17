# `rain` — Man Page Mirror + Annotation

> Mirror of the original `.6` man page with modern commentary.

---

## Name

`rain` — animated raindrops display.

## Synopsis

```sh
rain [-d delay]
```

## Description

The output of `rain` is modelled after the VAX/VMS program of the same name. To obtain the proper effect, either the terminal must be set for 9600 baud or the `-d` option must be used to specify a delay, in milliseconds, between each update. A reasonable delay is `120`; the default is `0`.

## Options

- `-d delay` — Set frame delay in milliseconds (`1`–`999`).

## Author

Eric P. Scott.

## Annotation

The man page correctly notes the VAX/VMS inspiration and the need for a delay on fast terminals. It does not describe the circular buffer animation technique or the exact signal set for exiting; those are covered in [`architecture.md`](./architecture.md).

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
