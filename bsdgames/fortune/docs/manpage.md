# fortune(6) & strfile(8) — BSD Reference Manual

An annotated mirror of the classic `fortune(6)` and `strfile(8)` manual pages from 4.4BSD / NetBSD.

---

```man
FORTUNE(6)                       Games Manual                       FORTUNE(6)

NAME
     fortune – print a random, hopefully interesting, adage

SYNOPSIS
     fortune [-aefilosw] [-m pattern] [[N%] file/dir/all]

DESCRIPTION
     When fortune is run with no arguments it prints out a random epigram.
     Epigrams are divided into several categories, where each category is
     subdivided into those which are potentially offensive and those which
     are not.

OPTIONS
     -a       Choose from all lists of maxims, both offensive and not.
     -e       Consider all fortune files to be of equal size.
     -f       Print out the list of files which would be searched, but do not
              print a fortune.
     -i       Ignore case for -m patterns.
     -l       Long dictums only (>= 160 characters).
     -m pattern
              Print out all fortunes which match the regular expression
              pattern.
     -o       Choose only from potentially offensive maxims.
     -s       Short dictums only (< 160 characters).
     -w       Wait after printing, with duration based on length of fortune.

FILES
     /usr/share/games/fortune/fortunes       Standard clean fortunes.
     /usr/share/games/fortune/fortunes.dat   Binary index table for fortunes.
     /usr/share/games/fortune/fortunes-o     ROT13-obfuscated offensive fortunes.
     /usr/share/games/fortune/fortunes-o.dat Binary index for fortunes-o.

AUTHORS
     Ken Arnold
     University of California, Berkeley

==============================================================================

STRFILE(8)                System Manager's Manual                    STRFILE(8)

NAME
     strfile – create a random access file for storing strings
     unstr – dump strings in pointer order

SYNOPSIS
     strfile [-iorsx] [-c char] sourcefile [datafile]
     unstr [-c char] datafile[.dat] [outputfile]

DESCRIPTION
     strfile reads a file containing strings separated by a line containing a
     single delimiter character (default '%') and creates a data file
     containing a header structure and an array of 32-bit seek offsets to each
     string.  This allows programs like fortune to access strings randomly in
     constant time without sequential scanning.

OPTIONS
     -c char  Change the delimiting character from '%' to char.
     -i       Ignore case when ordering strings.
     -o       Order strings in alphabetical order.
     -r       Randomize the pointers in the index table.
     -s       Silent mode.
     -x       Rotate each alphabetic character by 13 positions (ROT13) for
              sensitive or offensive content.

4th Berkeley Distribution         May 31, 1993         4th Berkeley Distribution
```
