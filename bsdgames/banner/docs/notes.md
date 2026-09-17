# Working Notes — `banner`

- Glyph data is stored in data_table (~9 KB) with asc_ptr offsets.
- Encoding: 128+n repeat line, 64+n end char, else put m chars at column n.
- Default width 132 columns; -w scales by skipping rows/columns.
- MAXMSG 1024 characters.
- Some ASCII chars undefined: < > [ ] \ ^ _ { } | ~
