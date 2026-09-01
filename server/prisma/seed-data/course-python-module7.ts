/**
 * Python Complete Course — Module 7: Strings, Text & Data Formats, lessons 1-3.
 *
 * Lesson 1: strings deep — immutability, slicing `s[a:b:c]`, the method
 *           toolkit (`strip`/`split`/`partition`/`replace`/`find`/`translate`),
 *           and why `"".join(parts)` beats `+=` in a loop.
 * Lesson 2: f-strings and the format mini-language — `{x!r}`, alignment,
 *           `:.2f`, `:,`, `:%`, `{x=}`, nested `{spec}`, `str.format`, and
 *           where NOT to use an f-string (logging, SQL).
 * Lesson 3: `str` vs `bytes` — text is code points, bytes are bytes;
 *           `.encode`/`.decode`; `UnicodeDecodeError` and `errors=`; text vs
 *           binary file mode; "always UTF-8".
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only where feasible (Windows console mangles
 * non-ASCII on capture) — for the bytes lesson, assert on len/hex/roundtrip
 * rather than printing raw non-ASCII. `examples` use `code` + `output`; run
 * every sample with `python`. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_7: CourseLesson[] = [
  {
    slug: 'py-strings-deep',
    title: 'Strings: Immutability, Slicing, and the Method Toolkit',
    titleHi: 'Strings: Immutability, Slicing, Aur Method Toolkit',
    description: 'Building a string by `result += piece` inside a loop over ten thousand items and watching it crawl — because every `+=` copies the entire string so far into a new one. Strings never change in place; every operation returns a new string. Knowing that, plus slicing and the dozen methods you actually use, covers most day-to-day text work.',
    descriptionHi: 'Das hazaar items par ek loop ke andar `result += piece` se ek string banana aur ise ghिsatte dekhna — kyunki har `+=` ab tak ki poori string ko ek nayi mein copy karता hai. Strings kabhi jagah par nahi badalti; har operation ek nayi string lautaता hai. Ye jaanna, plus slicing aur wo dozen methods jo aap asal mein istemal karते ho, adhikaansh roz-marra text kaam cover karता hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**Chiselling words into stone tablets versus writing on a whiteboard.** A string in Python is a stone tablet: once carved, the text on it cannot be altered. If you want "HELLO" to become "HELLO!", you do not add a chisel-stroke to the existing tablet — you carve a whole new tablet that says "HELLO!". This is why every string method — upper, replace, strip — hands you back a *new* string and leaves the original untouched. It also explains the slow-loop trap: building a long string by repeatedly doing `text = text + piece` is carving a fresh, slightly longer tablet on every step and throwing the previous one away, so joining 10,000 short pieces means carving 10,000 tablets of ever-increasing size. The efficient way is to collect all the pieces on a whiteboard first — an ordinary list — and carve the final tablet once, in a single pass, with `"".join(pieces)`. Slicing is reading a contiguous run of characters off the tablet by position — "give me characters 2 through 5" — and because reading never alters stone, a slice is always a safe new copy.',
      hi: '**Shabdon ko stone tablets mein chisel karna versus ek whiteboard par likhna.** Python mein ek string ek stone tablet hai: ek baar carve hone ke baad, uspar text badla nahi ja sakta. Agar aap chahते ho "HELLO" "HELLO!" ban jाए, aap maujood tablet mein ek chisel-stroke nahi jodते — aap ek poora naya tablet carve karते ho jo "HELLO!" kehta hai. Isliye har string method — upper, replace, strip — aapko ek *nayi* string wapas deta hai aur original ko achhoota chhodता hai. Ye slow-loop jaal bhi samjhाता hai: baar-baar `text = text + piece` karके ek lambi string banana har step par ek fresh, thoda lamba tablet carve karna hai aur pichhla phenk dena hai. Kushal tarika pehle sab tukdे ek whiteboard par ikattha karna hai — ek saamaanya list — aur antim tablet ek baar carve karna, `"".join(pieces)` se.',
    },

    simple: `**Strings are immutable — every operation returns a NEW string**

\`\`\`python
s = "hello"
s.upper()               # 'HELLO'
s                       # 'hello'  -- unchanged
s[0] = "H"              # TypeError: 'str' object does not support item assignment

s = s.replace("l", "L") # rebind s to the new string
s                       # 'heLLo'
\`\`\`

**The \`+=\` in a loop trap**

\`\`\`python
# SLOW: each += builds a whole new string (O(n^2) over the loop)
out = ""
for word in words:
    out += word + " "

# FAST: collect pieces, join once (O(n))
out = " ".join(words)              # if the separator is uniform
out = "".join(f"{w} " for w in words)   # or build pieces then join
\`\`\`

**Slicing: \`s[start:stop:step]\`**

\`\`\`python
s = "abcdefgh"
s[2:5]        # 'cde'      -- start inclusive, stop exclusive
s[:3]         # 'abc'      -- from the start
s[5:]         # 'fgh'      -- to the end
s[-2:]        # 'gh'       -- last two
s[::2]        # 'aceg'     -- every 2nd char
s[::-1]       # 'hgfedcba' -- reversed
s[1:100]      # 'bcdefgh'  -- out-of-range stop is clamped, no error
\`\`\`

**The methods you use every day**

\`\`\`python
"  hi  ".strip()                # 'hi'        (also lstrip / rstrip)
"a,b,c".split(",")             # ['a', 'b', 'c']
"a b  c".split()              # ['a', 'b', 'c']  -- no arg: splits on any whitespace run
"a=1".partition("=")          # ('a', '=', '1')  -- always a 3-tuple, splits ONCE
", ".join(["a", "b", "c"])    # 'a, b, c'
"Hello".lower() / .upper() / .title() / .casefold()
"file.txt".endswith(".txt")   # True     (startswith too)
"abcabc".find("c")            # 2        (-1 if absent; .index raises instead)
"abcabc".count("bc")          # 2
"  x  ".replace(" ", "")      # 'x'
"hello".center(11, "-")       # '---hello---'
"42".zfill(5)                 # '00042'
"HeLLo".swapcase()           # 'hEllO'
\`\`\`

\`\`\`
str is IMMUTABLE. s.method() returns a new str; s is never modified in place.
To "change" s, rebind:  s = s.strip()

BUILD a string:  collect parts in a list, then "".join(parts)  -- NOT += in a loop
SLICE:  s[a:b] copies chars [a, b);  s[a:b:c] with a step;  s[::-1] reverses
SPLIT:  s.split(sep) -> list;  s.split() -> split on whitespace runs, drop empties
        s.partition(sep) -> (before, sep, after), a 3-tuple, first occurrence only
        s.rsplit(sep, maxsplit) -> split from the right
JOIN:   sep.join(iterable_of_strings)  -- the separator's method, not the list's
CHECK:  x in s ;  s.startswith(t) ;  s.endswith(t) ;  s.find(t) ;  s.count(t)
\`\`\``,

    simpleHi: `**Strings immutable hain — har operation ek NAYI string lautaता hai**

\`\`\`python
s = "hello"
s.upper()               # 'HELLO'
s                       # 'hello'  -- abadla
s[0] = "H"              # TypeError: 'str' object does not support item assignment

s = s.replace("l", "L") # s ko nayi string se rebind karो
s                       # 'heLLo'
\`\`\`

**Loop mein \`+=\` jaal**

\`\`\`python
# DHEEMA: har += ek poori nayi string banaता hai (loop par O(n^2))
out = ""
for word in words:
    out += word + " "

# TEZ: tukdे ikattha karो, ek baar join karो (O(n))
out = " ".join(words)              # agar separator ek jaisा hai
out = "".join(f"{w} " for w in words)
\`\`\`

**Slicing: \`s[start:stop:step]\`**

\`\`\`python
s = "abcdefgh"
s[2:5]        # 'cde'      -- start inclusive, stop exclusive
s[:3]         # 'abc'
s[5:]         # 'fgh'
s[-2:]        # 'gh'       -- aakhri do
s[::2]        # 'aceg'     -- har 2nd char
s[::-1]       # 'hgfedcba' -- ulta
s[1:100]      # 'bcdefgh'  -- out-of-range stop clamp hota hai, koi error nahi
\`\`\`

**Wo methods jo aap roz istemal karते ho**

\`\`\`python
"  hi  ".strip()                # 'hi'        (lstrip / rstrip bhi)
"a,b,c".split(",")             # ['a', 'b', 'c']
"a b  c".split()              # ['a', 'b', 'c']  -- bina arg: kisi bhi whitespace run par split
"a=1".partition("=")          # ('a', '=', '1')  -- hamesha ek 3-tuple, EK baar split
", ".join(["a", "b", "c"])    # 'a, b, c'
"file.txt".endswith(".txt")   # True     (startswith bhi)
"abcabc".find("c")            # 2        (nahi hai to -1; .index raise karता hai)
"abcabc".count("bc")          # 2
"42".zfill(5)                 # '00042'
\`\`\`

\`\`\`
str IMMUTABLE hai. s.method() ek nayi str lautaता hai; s kabhi jagah par modify nahi hota.
s ko "badalne" ko, rebind karो:  s = s.strip()

STRING BANAO:  parts ek list mein ikattha karो, phir "".join(parts)  -- loop mein += NAHI
SLICE:  s[a:b] chars [a, b) copy karता hai;  s[a:b:c] ek step ke saath;  s[::-1] ulta
SPLIT:  s.split(sep) -> list;  s.split() -> whitespace runs par split, empties drop
        s.partition(sep) -> (before, sep, after), ek 3-tuple, sirf pehli occurrence
JOIN:   sep.join(iterable_of_strings)  -- separator ki method, list ki nahi
CHECK:  x in s ;  s.startswith(t) ;  s.endswith(t) ;  s.find(t) ;  s.count(t)
\`\`\``,

    content: `## Why immutability matters

\`\`\`python
a = "hello"
b = a                    # b and a point at the SAME string object
a = a + " world"        # a is now a NEW object; b is unchanged
print(b)                # 'hello'
\`\`\`

Because a string can never change, sharing it is always safe — you can pass a string anywhere without worrying that the receiver will mutate it. It also means strings are hashable (usable as dict keys / set members), and small strings are often cached and reused by the interpreter.

## Building strings efficiently

\`\`\`python
# O(n^2): the growing string is copied on every iteration
parts = ""
for i in range(n):
    parts += str(i)

# O(n): append cheap pieces to a list, join once
buf = []
for i in range(n):
    buf.append(str(i))
result = "".join(buf)

# often just a comprehension + join:
result = "".join(str(i) for i in range(n))

# for templated output, an f-string per piece then join, or io.StringIO for streams:
import io
sio = io.StringIO()
for row in rows:
    sio.write(f"{row.id},{row.name}\\n")
csv_text = sio.getvalue()
\`\`\`

## Slicing details

\`\`\`python
s = "abcdefgh"
s[2:5]         # 'cde'
s[2:5:2]       # 'ce'      -- step 2 within the slice
s[::-1]        # reversed
s[10:20]       # ''        -- start past the end -> empty, no error
s[3:1]         # ''        -- stop before start -> empty
len(s[a:b])    # max(0, b - a) for in-range a, b

# a slice is a copy; you cannot slice-assign a str (it is immutable):
s[0:2] = "XY"  # TypeError
\`\`\`

Negative indices count from the end (\`-1\` is the last char). A missing bound means "as far as possible in that direction". A step of \`-1\` (or any negative) walks backward.

## \`split\` vs \`partition\` vs \`rsplit\`

\`\`\`python
"a-b-c-d".split("-")          # ['a', 'b', 'c', 'd']
"a-b-c-d".split("-", 1)       # ['a', 'b-c-d']       -- maxsplit=1
"a-b-c-d".rsplit("-", 1)      # ['a-b-c', 'd']       -- from the right
"a-b-c-d".partition("-")      # ('a', '-', 'b-c-d')  -- (head, sep, tail); sep='' tail='' if absent
"key=val=ue".partition("=")   # ('key', '=', 'val=ue')

"  a  b  ".split()            # ['a', 'b']           -- no arg: any whitespace, no empty strings
"  a  b  ".split(" ")         # ['', '', 'a', '', 'b', '', '']  -- explicit sep keeps empties
\`\`\`

Use \`partition\` when you expect exactly one separator and want a guaranteed 3-tuple (no \`IndexError\` if the separator is missing). Use \`split()\` with no argument for whitespace-delimited tokens.

## \`str.translate\` and \`str.maketrans\` — fast bulk char replacement

\`\`\`python
table = str.maketrans({"a": "4", "e": "3", "o": "0"})
"leet code".translate(table)     # 'l33t c0d3'

drop = str.maketrans("", "", "aeiou")
"disemvowel".translate(drop)     # 'dsmvwl'   -- third arg = chars to delete
\`\`\`

\`translate\` does a single pass and is faster than chained \`.replace()\` calls for many substitutions.

## \`in\`, membership, and case-insensitive checks

\`\`\`python
"ell" in "hello"                 # True   -- substring test
"HELLO".lower() == "hello"       # simple case-insensitive compare
"Straße".casefold() == "strasse".casefold()   # casefold: aggressive, for Unicode-correct compares
\`\`\`

Use \`.lower()\` for ASCII; use \`.casefold()\` when the text may contain non-ASCII and you need a correct caseless match.`,

    contentHi: `## Immutability kyun maayne rakhती hai

\`\`\`python
a = "hello"
b = a                    # b aur a WAHI string object par point karते hain
a = a + " world"        # a ab ek NAYA object hai; b abadla
print(b)                # 'hello'
\`\`\`

Kyunki ek string kabhi nahi badal sakti, ise share karna hamesha surakshit hai — aap ek string kahin bhi pass kar sakte ho bina chinta kiye ki receiver ise mutate karega. Iska matlab strings hashable hain bhi (dict keys / set members ki tarah istemal), aur chhoti strings aksar interpreter dwara cache aur reuse hoती hain.

## Strings kushal roop se banana

\`\`\`python
# O(n^2): badhती string har iteration par copy hoती hai
parts = ""
for i in range(n):
    parts += str(i)

# O(n): saste tukdे ek list mein append karो, ek baar join karो
buf = []
for i in range(n):
    buf.append(str(i))
result = "".join(buf)

# aksar bस ek comprehension + join:
result = "".join(str(i) for i in range(n))
\`\`\`

## Slicing vivaran

\`\`\`python
s = "abcdefgh"
s[2:5]         # 'cde'
s[2:5:2]       # 'ce'      -- slice ke andar step 2
s[::-1]        # ulta
s[10:20]       # ''        -- start end ke aage -> empty, koi error nahi
s[3:1]         # ''        -- stop start se pehle -> empty

# ek slice ek copy hai; aap ek str slice-assign nahi kar sakte:
s[0:2] = "XY"  # TypeError
\`\`\`

Negative indices end se ginte hain (\`-1\` aakhri char hai). Ek missing bound matlab "us disha mein jitna ho sake". Ek \`-1\` (ya koi negative) step peechhe chalता hai.

## \`split\` vs \`partition\` vs \`rsplit\`

\`\`\`python
"a-b-c-d".split("-")          # ['a', 'b', 'c', 'd']
"a-b-c-d".split("-", 1)       # ['a', 'b-c-d']       -- maxsplit=1
"a-b-c-d".rsplit("-", 1)      # ['a-b-c', 'd']       -- right se
"a-b-c-d".partition("-")      # ('a', '-', 'b-c-d')  -- (head, sep, tail)
"key=val=ue".partition("=")   # ('key', '=', 'val=ue')

"  a  b  ".split()            # ['a', 'b']           -- bina arg: koi whitespace, koi empty nahi
"  a  b  ".split(" ")         # ['', '', 'a', '', 'b', '', '']  -- explicit sep empties rakhta hai
\`\`\`

\`partition\` istemal karो jab aap bilkul ek separator ki ummeed karते ho aur ek guaranteed 3-tuple chahте ho. Whitespace-delimited tokens ke liye bina argument \`split()\` istemal karो.

## \`str.translate\` aur \`str.maketrans\` — tez bulk char replacement

\`\`\`python
table = str.maketrans({"a": "4", "e": "3", "o": "0"})
"leet code".translate(table)     # 'l33t c0d3'

drop = str.maketrans("", "", "aeiou")
"disemvowel".translate(drop)     # 'dsmvwl'   -- teesra arg = delete karne ke chars
\`\`\`

\`translate\` ek akela pass karता hai aur kai substitutions ke liye chained \`.replace()\` calls se tez hai.

## \`in\`, membership, aur case-insensitive checks

\`\`\`python
"ell" in "hello"                 # True   -- substring test
"HELLO".lower() == "hello"       # saral case-insensitive compare
"Straße".casefold() == "strasse".casefold()   # casefold: aggressive, Unicode-correct compares ke liye
\`\`\`

ASCII ke liye \`.lower()\` istemal karो; \`.casefold()\` jab text mein non-ASCII ho sakta hai.`,

    examples: [
      {
        title: 'Immutability: methods return new strings, originals unchanged',
        titleHi: 'Immutability: methods nayi strings lautaते hain, originals abadle',
        code: `s = "  Hello, World  "
print(repr(s.strip()))
print(repr(s.strip().lower()))
print(repr(s.strip().replace(",", "")))
print(repr(s))                        # original is untouched

# "changing" a string means rebinding:
name = "ada lovelace"
name = name.title()
print(name)

# item assignment is not allowed:
try:
    name[0] = "X"
except TypeError as e:
    print("error:", e)

# two names, one immutable object -> safe to share:
a = "shared"
b = a
a = a.upper()
print("a =", a, "| b =", b)`,
        output: `'Hello, World'
'hello, world'
'Hello World'
'  Hello, World  '
Ada Lovelace
error: 'str' object does not support item assignment
a = SHARED | b = shared`,
        explain: 'Every method — `strip`, `lower`, `replace`, `title` — returns a new string and leaves the receiver alone, so `s` still has its surrounding spaces after four method calls. To "change" `name` you rebind it (`name = name.title()`). `name[0] = "X"` is a `TypeError` because strings do not support item assignment. Sharing (`b = a`) is safe: `a = a.upper()` rebinds `a` to a new object without affecting `b`.',
        explainHi: 'Har method — `strip`, `lower`, `replace`, `title` — ek nayi string lautaता hai aur receiver ko akela chhodता hai, isliye `s` mein chaar method calls ke baad bhi apni aas-paas ki spaces hain. `name` ko "badalne" ko aap ise rebind karते ho. `name[0] = "X"` ek `TypeError` hai. Sharing surakshit hai: `a = a.upper()` `a` ko ek naye object se rebind karता hai bina `b` ko prabhaavit kiye.',
      },
      {
        title: '+= in a loop vs "".join — the same result, very different cost',
        titleHi: 'Loop mein += vs "".join — wahi result, bahut alag keemat',
        code: `import time

n = 40000
pieces = [str(i) for i in range(n)]

# approach 1: += in a loop
t0 = time.perf_counter()
acc = ""
for p in pieces:
    acc += p
plus_time = time.perf_counter() - t0

# approach 2: join
t0 = time.perf_counter()
joined = "".join(pieces)
join_time = time.perf_counter() - t0

print("same result:", acc == joined)
print("join is faster:", join_time < plus_time)
print("+= is much slower:", plus_time > join_time * 5)`,
        output: `same result: True
join is faster: True
+= is much slower: True
`,
        explain: 'Both produce the identical string, but `+=` in the loop rebuilds the whole accumulator on every iteration — copying an ever-larger string 40,000 times, which is O(n^2) work. `"".join(pieces)` walks the list once, computes the total size, allocates once, and copies each piece in — O(n). The exact ratio varies by machine and CPython version, but `join` is dramatically faster for large builds. (the example prints `plus_time > join_time * 5` rather than a raw ratio, which varies widely by machine and CPython version.)',
        explainHi: 'Dono samaan string banaते hain, par loop mein `+=` har iteration par poore accumulator ko dobara banaता hai — ek badhती string ko 40,000 baar copy karना, jo O(n^2) kaam hai. `"".join(pieces)` list ko ek baar chalता hai, total size compute karता hai, ek baar allocate karता hai, aur har piece copy karता hai — O(n). Exact ratio machine se badalता hai, par bade builds ke liye `join` naaटकीय roop se tez hai.',
      },
      {
        title: 'Slicing and the split/partition/join toolkit',
        titleHi: 'Slicing aur split/partition/join toolkit',
        code: `s = "2026-08-31T14:30:00Z"

# slicing by position:
print("year:", s[:4])
print("time:", s[11:19])
print("no Z:", s[:-1])
print("reversed:", s[::-1])

# split vs partition:
date_part, sep, time_part = s.partition("T")
print("partition:", (date_part, time_part))
print("date fields:", date_part.split("-"))

# rsplit for "last separator":
path = "a/b/c/file.txt"
head, _, tail = path.rpartition("/")
print("dir:", head, "| file:", tail)
print("stem/ext:", tail.rsplit(".", 1))

# join the pieces back:
print("rebuilt:", "/".join(["x", "y", "z"]))

# whitespace split drops empties; explicit sep keeps them:
print("ws split: ", "  a   b  ".split())
print("sep split:", "a,,b".split(","))`,
        output: `year: 2026
time: 14:30:00
no Z: 2026-08-31T14:30:00
reversed: Z00:03:41T13-80-6202
partition: ('2026-08-31', '14:30:00Z')
date fields: ['2026', '08', '31']
dir: a/b/c | file: file.txt
stem/ext: ['file', 'txt']
rebuilt: x/y/z
ws split:  ['a', 'b']
sep split: ['a', '', 'b']`,
        explain: '`s[:4]` and `s[11:19]` pull fixed-position fields; `s[:-1]` drops the trailing `Z`; `s[::-1]` reverses. `partition("T")` splits once into `(before, sep, after)`. `rpartition("/")` gives the directory and filename. `"a,,b".split(",")` keeps the empty string between the two commas, but `"  a   b  ".split()` (no argument) collapses all whitespace runs and drops empties.',
        explainHi: '`s[:4]` aur `s[11:19]` fixed-position fields nikalते hain; `s[:-1]` trailing `Z` girata hai; `s[::-1]` ulta karता hai. `partition("T")` ek baar `(before, sep, after)` mein split karता hai. `rpartition("/")` directory aur filename deता hai. `"a,,b".split(",")` do commas ke beech empty string rakhता hai, par `"  a   b  ".split()` (bina argument) saare whitespace runs samेtता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `html = ""
for row in rows:                     # rows could be thousands
    html += f"<tr><td>{row.name}</td></tr>"`,
        right: `html = "".join(
    f"<tr><td>{row.name}</td></tr>" for row in rows
)`,
        why: 'Each `html += ...` allocates a brand-new string containing everything so far plus the new piece, then discards the old one. Over N rows that is O(N^2) total copying. Build a list (or a generator) of the pieces and `"".join()` them in a single O(N) pass.',
        whyHi: 'Har `html += ...` ek bilkul-nayi string allocate karता hai jismein ab tak sab kuch plus naya piece hai, phir purani phenk deता hai. N rows par wo O(N^2) total copying hai. Tukdon ki ek list (ya generator) banao aur unhe ek O(N) pass mein `"".join()` karो.',
      },
      {
        wrong: `key, value = line.split("=")     # ValueError if the line has 0 or 2+ '='`,
        right: `key, sep, value = line.partition("=")
if not sep:
    raise ValueError(f"no '=' in {line!r}")
# or, if extra '=' belongs in the value:
key, value = line.split("=", 1)`,
        why: 'Unpacking `line.split("=")` into exactly two names raises `ValueError: not enough values` (no `=`) or `too many values` (a value containing `=`). `partition` always returns a 3-tuple so it never raises on shape; `split("=", 1)` caps the split at one so a value with `=` in it stays intact.',
        whyHi: '`line.split("=")` ko bilkul do names mein unpack karna `ValueError` raise karता hai (koi `=` nahi) ya (`=` waali ek value). `partition` hamesha ek 3-tuple lautaता hai isliye ye shape par kabhi raise nahi karता; `split("=", 1)` split ko ek par cap karता hai.',
      },
      {
        wrong: `name = "  Alice  "
name.strip()                     # return value thrown away
print(name)                      # still '  Alice  '`,
        right: `name = name.strip()              # rebind to the stripped result
print(name)                      # 'Alice'`,
        why: 'String methods do not modify in place — `name.strip()` computes a new string and returns it, and if you do not assign that return value, nothing changed. Always `name = name.strip()` (or chain and assign the whole chain).',
        whyHi: 'String methods jagah par modify nahi karते — `name.strip()` ek nayi string compute karता hai aur ise lautaता hai, aur agar aap wo return value assign nahi karते, kuch nahi badla. Hamesha `name = name.strip()`.',
      },
    ],

    realWorld: [
      {
        en: '**`"".join(...)` is the standard way to build any large text output** — an HTML fragment, a CSV body, a generated SQL script, a log dump. Django templates and DRF renderers ultimately join lists of string pieces. For truly streaming output, `io.StringIO` or yielding chunks.',
        hi: '**`"".join(...)` kisi bhi bade text output banane ka standard tarika hai** — ek HTML fragment, ek CSV body, ek generated SQL script. Django templates aur DRF renderers aakhirkar string tukdon ki lists join karते hain.',
      },
      {
        en: '**`partition` / `rpartition` are the safe way to split "key: value" headers, `name=value` pairs, and `path/to/file` strings** — no `IndexError` when the separator is missing, unlike indexing `split(...)[1]`. `str.removeprefix`/`removesuffix` (3.9+) replace fragile `s[len(prefix):]` slicing.',
        hi: '**`partition` / `rpartition` "key: value" headers, `name=value` pairs, aur `path/to/file` strings split karne ka surakshit tarika hain** — separator missing hone par koi `IndexError` nahi. `str.removeprefix`/`removesuffix` (3.9+) nazuk `s[len(prefix):]` slicing ki jagah lete hain.',
      },
      {
        en: '**Slicing appears everywhere in parsing fixed-width data** — log timestamps, ISO datetimes, financial record layouts, protocol headers. `s[::-1]` for reversal, `s[-n:]` for "last N", `s[:n]` for a preview/truncation (with an ellipsis).',
        hi: '**Slicing fixed-width data parse karne mein har jagah dikhता hai** — log timestamps, ISO datetimes, protocol headers. `s[::-1]` reversal ke liye, `s[-n:]` "last N" ke liye, `s[:n]` ek preview/truncation ke liye.',
      },
    ],

    interviewQA: [
      {
        q: 'Why are Python strings immutable, and what are the consequences for how you build strings?',
        qHi: 'Python strings immutable kyun hain, aur aap strings kaise banaते ho iske liye parinaam kya hain?',
        a: 'A string object in Python cannot be changed after it is created — there is no operation that modifies the characters of an existing string in place. Every method that appears to transform a string, like upper, strip, or replace, actually computes and returns a brand-new string and leaves the original exactly as it was. Immutability buys several things. It makes strings safe to share freely: you can pass a string into any function without defensively copying it, because no callee can mutate it out from under you. It makes strings hashable, so they can be dictionary keys and set members, since their hash can never change. And it lets the interpreter cache and reuse common small strings and string literals. The main practical consequence is in how you build up a large string. If you start with an empty string and repeatedly do result equals result plus piece inside a loop, each iteration allocates a completely new string holding everything accumulated so far plus the new piece, and copies all of it. Over N pieces the total work is quadratic in N, because the growing accumulator is copied again and again. For a few concatenations this is irrelevant, but for thousands of pieces it becomes a real performance problem. The idiomatic fix is to collect the pieces in a list — appending to a list is cheap and amortised constant time — and then call join once at the end: the join method computes the total length, allocates the result buffer a single time, and copies each piece into place, which is linear in the total size. Often you skip the explicit list and pass a generator expression straight to join. For output that is genuinely streamed rather than assembled, io.StringIO gives you a writable buffer, or you yield chunks. The rule of thumb: never build a string with plus-equals in a loop; collect and join.',
        aHi: 'Python mein ek string object banaने ke baad badla nahi ja sakta — koi operation nahi jo ek maujood string ke characters ko jagah par modify kare. Har method jo ek string ko transform karता dikhता hai, jaise upper, strip, ya replace, asal mein ek bilkul-nayi string compute aur return karता hai aur original ko bilkul waise chhodता hai jaise wo thi. Immutability kai cheezein deती hai. Ye strings ko swतंत्र roop se share karne ko surakshit banaती hai. Ye strings ko hashable banaती hai. Aur ye interpreter ko chhoti strings cache aur reuse karne deती hai. Mukhya vyavhaarik parinaam ye hai ki aap ek badi string kaise banaते ho. Agar aap ek empty string se shuru karते ho aur baar-baar ek loop ke andar result equals result plus piece karते ho, har iteration ek poori nayi string allocate karता hai jismein ab tak jama sab kuch plus naya piece hai, aur ise sab copy karता hai. N tukdon par total kaam N mein quadratic hai. Idiomatic fix tukdon ko ek list mein ikattha karna hai aur phir ant mein ek baar join call karna hai. Niyam: loop mein plus-equals se ek string kabhi mat banao; ikattha karो aur join karो.',
      },
      {
        q: 'Explain string slicing. What does `s[a:b:c]` do, and what happens at the boundaries?',
        qHi: 'String slicing samjhaao. `s[a:b:c]` kya karता hai, aur boundaries par kya hota hai?',
        a: 'Slicing extracts a subsequence of a string by position and returns it as a new string; the original is never modified because strings are immutable. The full form is s with square brackets containing start, stop, and step separated by colons. Start is the index of the first character included; stop is the index one past the last character included, so the slice is the half-open range from start up to but not including stop. Step is the stride: how many positions to advance between characters taken, defaulting to one. Any of the three can be omitted. A missing start means from the beginning; a missing stop means through the end; a missing step means one. So s colon three is the first three characters, s three colon is everything from index three onward, and a bare colon is a full copy. Negative indices count backward from the end, where minus one is the last character, so s minus two colon is the last two characters. A negative step walks backward through the string: s colon colon minus one is the classic full reversal, and you can combine a negative step with bounds, though the mental model flips because start should then be the higher index. The boundary behaviour is forgiving: indices that fall outside the string are silently clamped to the valid range rather than raising. s ten colon twenty on a short string just gives an empty string; s colon one thousand gives the whole rest of the string. A stop that is less than or equal to start with a positive step gives an empty string. This is different from indexing a single position, s of i, which does raise IndexError when i is out of range. You cannot assign to a slice of a string — that would be mutation — so s zero colon two equals something is a TypeError. Lists, which are mutable, do support slice assignment.',
        aHi: 'Slicing position se ek string ki ek subsequence nikalता hai aur ise ek nayi string ki tarah lautaता hai; original kabhi modify nahi hota kyunki strings immutable hain. Poora roop s square brackets mein start, stop, aur step colons se alag. Start shamil pehle character ka index hai; stop shamil aakhri character se ek aage index hai, isliye slice start se stop tak (par shamil nahi) half-open range hai. Step stride hai: liye characters ke beech kitni positions aage badhना, default ek. Teenों mein se koi bhi chhoda ja sakta hai. Ek missing start matlab shuruaat se; ek missing stop matlab end tak; ek missing step matlab ek. Negative indices end se peechhe ginte hain. Ek negative step string ke through peechhe chalता hai: s colon colon minus one classic poora reversal hai. Boundary behaviour maaf karne waala hai: string ke baahar girne wale indices chupchaap valid range mein clamp hote hain raise karne ke bजाय. Aap ek string ke ek slice ko assign nahi kar sakte.',
      },
    ],

    exercises: [
      {
        task: 'Write `build_table(rows)` where each row is a `(name, score)` tuple, returning a string with one line per row (`f"{name}: {score}"`) joined by newlines. Do it with `"\\n".join(...)` and a generator — NOT `+=`. Then time both approaches on 20,000 rows and print which is faster.',
        taskHi: '`build_table(rows)` likhो jahaan har row ek `(name, score)` tuple hai, ek string lautaते hue jismein prati row ek line (`f"{name}: {score}"`) newlines se joined. Ise `"\\n".join(...)` aur ek generator se karो — `+=` NAHI. Phir 20,000 rows par dono approaches time karो.',
        hint: '`"\\n".join(f"{n}: {s}" for n, s in rows)`. The `+=` version: `out = ""; for n, s in rows: out += f"{n}: {s}\\n"`. Compare `time.perf_counter()` deltas; join wins by a large margin.',
        hintHi: '`"\\n".join(f"{n}: {s}" for n, s in rows)`. `+=` version: `out = ""; for n, s in rows: out += f"{n}: {s}\\n"`. `time.perf_counter()` deltas compare karो.',
      },
      {
        task: 'Write `parse_header(line)` for lines like `"Content-Type: text/html; charset=utf-8"`. Use `partition(": ")` to split the header name from the value (raise `ValueError` if `": "` is absent). Then `partition(";")` the value to get the main part. Return `(name, main_value, params_string)`. Test on a header with and without params, and one with no colon.',
        taskHi: '`parse_header(line)` likhो `"Content-Type: text/html; charset=utf-8"` jaisी lines ke liye. Header name ko value se split karne ko `partition(": ")` istemal karो. Phir value ko `partition(";")` karके main part paओ. `(name, main_value, params_string)` return karो.',
        hint: '`name, sep, rest = line.partition(": ")`; if `not sep: raise ValueError`. `main, _, params = rest.partition(";")`. `partition` never raises on a missing separator — you check `sep` yourself.',
        hintHi: '`name, sep, rest = line.partition(": ")`; agar `not sep: raise ValueError`. `main, _, params = rest.partition(";")`. `partition` ek missing separator par kabhi raise nahi karता.',
      },
      {
        task: 'Write `slug(text)` that lowercases, strips, replaces any run of non-alphanumeric characters with a single `-`, and trims leading/trailing `-`. Do the char filtering with a loop building a list + `"".join`, or `str.translate`. Test: `slug("  Hello, World!  ")` -> `"hello-world"`, `slug("a__b--c")` -> `"a-b-c"`.',
        taskHi: '`slug(text)` likhो jo lowercase kare, strip kare, non-alphanumeric characters ke kisi bhi run ko ek `-` se replace kare, aur leading/trailing `-` trim kare. Char filtering ek loop se list banाकर + `"".join` karो, ya `str.translate`. Test: `slug("  Hello, World!  ")` -> `"hello-world"`.',
        hint: 'One way: `parts = []; prev_dash = False; for ch in text.lower(): if ch.isalnum(): parts.append(ch); prev_dash = False; elif not prev_dash: parts.append("-"); prev_dash = True`. Then `"".join(parts).strip("-")`.',
        hintHi: 'Ek tarika: `parts = []; prev_dash = False; for ch in text.lower(): if ch.isalnum(): parts.append(ch); prev_dash = False; elif not prev_dash: parts.append("-"); prev_dash = True`. Phir `"".join(parts).strip("-")`.',
      },
    ],

    keyTakeaways: [
      'Strings are IMMUTABLE. Every method (`strip`, `upper`, `replace`, ...) returns a NEW string; the original is never modified. To "change" a string, rebind: `s = s.strip()`.',
      '`name.strip()` with the result thrown away does nothing. Always assign the return value.',
      'Never build a string with `+=` in a loop — it copies the whole accumulator each iteration (O(n^2)). Collect pieces in a list and `"".join(pieces)` once (O(n)); or use `io.StringIO` for streams.',
      '`s[a:b:c]`: `a` inclusive, `b` exclusive, `c` step. Missing bounds mean "as far as possible". `s[::-1]` reverses. Out-of-range indices are clamped (empty string), not an error — but `s[i]` on a bad index raises `IndexError`.',
      'You cannot slice-assign a string (`s[0:2] = "XY"` -> `TypeError`). Lists can.',
      '`s.split(sep)` -> list; `s.split()` (no arg) splits on any whitespace run and drops empty strings; `s.split(sep, maxsplit)` caps the number of splits.',
      '`s.partition(sep)` always returns a 3-tuple `(head, sep, tail)` — safe when the separator might be missing (no `IndexError`). `rpartition`/`rsplit` work from the right.',
      '`sep.join(iterable)` is a method of the SEPARATOR string, not the list. `str.translate(str.maketrans(...))` does bulk char replacement/deletion in one pass.',
    ],
    keyTakeawaysHi: [
      'Strings IMMUTABLE hain. Har method (`strip`, `upper`, `replace`, ...) ek NAYI string lautaता hai; original kabhi modify nahi hota. Ek string ko "badalne" ko, rebind karो: `s = s.strip()`.',
      '`name.strip()` result phenkकर kuch nahi karता. Hamesha return value assign karो.',
      'Loop mein `+=` se ek string kabhi mat banao — ye har iteration poore accumulator ko copy karता hai (O(n^2)). Tukdे ek list mein ikattha karो aur ek baar `"".join(pieces)` (O(n)); ya streams ke liye `io.StringIO`.',
      '`s[a:b:c]`: `a` inclusive, `b` exclusive, `c` step. Missing bounds matlab "jitna ho sake". `s[::-1]` ulta karता hai. Out-of-range indices clamp hote hain (empty string), error nahi — par bad index par `s[i]` `IndexError` raise karता hai.',
      'Aap ek string slice-assign nahi kar sakte (`s[0:2] = "XY"` -> `TypeError`). Lists kar sakti hain.',
      '`s.split(sep)` -> list; `s.split()` (bina arg) kisi bhi whitespace run par split karता hai aur empty strings girata hai; `s.split(sep, maxsplit)` splits ki sankhya cap karता hai.',
      '`s.partition(sep)` hamesha ek 3-tuple `(head, sep, tail)` lautaता hai — surakshit jab separator missing ho sakता (koi `IndexError` nahi). `rpartition`/`rsplit` right se kaam karते hain.',
      '`sep.join(iterable)` SEPARATOR string ki method hai, list ki nahi. `str.translate(str.maketrans(...))` ek pass mein bulk char replacement/deletion karता hai.',
    ],
  },

  {
    slug: 'py-fstrings-and-format-spec',
    title: 'f-strings and the Format Mini-Language',
    titleHi: 'f-strings Aur Format Mini-Language',
    description: 'Formatting a price as `f"${amount}"` and getting `$3.1` when you wanted `$3.10`, or logging with `logging.info(f"user {uid} did {action}")` and paying to build that string even when the log level is off. The `:` inside an f-string field opens a compact formatting language — width, alignment, precision, thousands separators, dates — and there are two specific places you should not use an f-string at all.',
    descriptionHi: 'Ek price ko `f"${amount}"` ki tarah format karna aur `$3.1` paना jab aap `$3.10` chahте the, ya `logging.info(f"user {uid} did {action}")` se log karna aur us string ko banane ki keemat chukाना chahे log level band ho. Ek f-string ke andar `:` ek compact formatting language kholता hai — width, alignment, precision, thousands separators, dates — aur do specific jagah hain jahaan aapko ek f-string bilkul istemal nahi karna chahiye.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A label printer with a settings dial next to the text slot.** You type the value you want on the label — a number, a name, a date — and next to it there is a dial with settings: how wide the label should be, whether the text sits left, right, or centred, how many decimal places for a number, whether to group the thousands with commas, what layout for a date. The text slot is the part before the colon in an f-string field; the dial is everything after the colon, the "format spec". `f"{price:.2f}"` is "put price in the slot, set the decimals dial to 2". `f"{total:>12,}"` is "right-align in a 12-wide label, group thousands". You can even set the dial from another value — `f"{n:{width}}"` reads the width off a variable. Two things the printer is wrong for: a logging system that decides *later* whether to print the label at all (you would waste ink printing labels nobody reads — pass the value and the template separately and let the logger decide), and building a database query (gluing user text straight into the label is how injection attacks work — the database needs the value handed to it separately, as a parameter).',
      hi: '**Ek label printer text slot ke bagal mein ek settings dial ke saath.** Aap label par jo value chahте ho type karते ho — ek number, ek naam, ek date — aur iske bagal settings ke saath ek dial hai: label kitna chauda ho, text left, right, ya centred baithe, ek number ke liye kitne decimal places, hazaar commas se group karें ya nahi. Text slot ek f-string field mein colon se pehle ka hissa hai; dial colon ke baad sab kuch hai, "format spec". `f"{price:.2f}"` "price ko slot mein rakho, decimals dial 2 par set karो" hai. `f"{total:>12,}"` "12-chaude label mein right-align, hazaar group karो" hai. Do cheezein jinke liye printer galat hai: ek logging system jo *baad mein* tay karता hai ki label print karें ya nahi, aur ek database query banana (user text ko seedhe label mein chipkana aise injection attacks kaam karते hain).',
    },

    simple: `**Basic interpolation and conversions**

\`\`\`python
name, n = "Ada", 42
f"{name} has {n} items"          # 'Ada has 42 items'
f"{name!r}"                      # "'Ada'"     -- !r calls repr()
f"{name!s}"                      # 'Ada'       -- !s calls str() (the default)
f"{n = }"                        # 'n = 42'    -- the '=' debug specifier
f"{name = }, {n = }"             # "name = 'Ada', n = 42"
f"{{literal braces}}"            # '{literal braces}'
\`\`\`

**The format spec: everything after the \`:\`**

\`\`\`python
price = 3.1
f"{price:.2f}"                   # '3.10'      -- 2 decimal places
f"{price:8.2f}"                  # '    3.10'  -- width 8, right-aligned
f"{price:<8.2f}"                 # '3.10    '  -- left
f"{price:^8.2f}"                 # '  3.10  '  -- centre
f"{price:+.2f}"                  # '+3.10'     -- always show sign
f"{1234567:,}"                   # '1,234,567' -- thousands separator
f"{1234567:_}"                   # '1_234_567'
f"{0.0723:.1%}"                  # '7.2%'      -- percentage
f"{255:#x}"                      # '0xff'      -- hex with prefix; :b :o also
f"{42:04d}"                      # '0042'      -- zero-pad to width 4
f"{'hi':->10}"                   # '--------hi' -- fill char '-', right-align, width 10
\`\`\`

**Dynamic specs and dates**

\`\`\`python
w = 10
f"{name:>{w}}"                   # right-align in a width read from 'w'
f"{n:{'0>5' if pad else ''}}"    # the whole spec can be an expression

from datetime import datetime
dt = datetime(2026, 8, 31, 14, 30)
f"{dt:%Y-%m-%d}"                 # '2026-08-31'
f"{dt:%H:%M on %A}"              # '14:30 on Monday'
\`\`\`

**Where NOT to use an f-string**

\`\`\`python
# 1. logging -- build the string only if the message is actually emitted:
logging.info("user %s did %s", uid, action)     # NOT f"user {uid} did {action}"

# 2. SQL / shell -- f-string interpolation is injection:
cur.execute("SELECT * FROM users WHERE id = %s", (uid,))   # NOT f"... id = {uid}"
\`\`\`

\`\`\`
f"{ EXPR !conv : SPEC }"

EXPR    any expression: f"{a + b}", f"{obj.attr}", f"{d['key']}", f"{fn(x)}"
!conv   !r (repr)  !s (str)  !a (ascii)     -- how to stringify before formatting
:SPEC   [[fill]align][sign][#][0][width][grouping][.precision][type]
        align:  <  left   >  right   ^  centre   =  pad after the sign
        sign:   +  always  -  only negative (default)   (space) space for positive
        group:  ,  or  _
        type:   d int  f fixed  e sci  % percent  x/X/o/b radix  s str  ,  g general
        dates:  any strftime code -- %Y %m %d %H %M %S %A %B %j %z ...

{x = }  debug form: prints  x = <value>   (great for quick tracing)
{n:{w}} nested field: the spec/width/precision can itself be {a variable}
\`\`\``,

    simpleHi: `**Basic interpolation aur conversions**

\`\`\`python
name, n = "Ada", 42
f"{name} has {n} items"          # 'Ada has 42 items'
f"{name!r}"                      # "'Ada'"     -- !r repr() call karता hai
f"{name!s}"                      # 'Ada'       -- !s str() call karता hai (default)
f"{n = }"                        # 'n = 42'    -- '=' debug specifier
f"{name = }, {n = }"             # "name = 'Ada', n = 42"
f"{{literal braces}}"            # '{literal braces}'
\`\`\`

**Format spec: \`:\` ke baad sab kuch**

\`\`\`python
price = 3.1
f"{price:.2f}"                   # '3.10'      -- 2 decimal places
f"{price:8.2f}"                  # '    3.10'  -- width 8, right-aligned
f"{price:<8.2f}"                 # '3.10    '  -- left
f"{price:^8.2f}"                 # '  3.10  '  -- centre
f"{price:+.2f}"                  # '+3.10'     -- hamesha sign dikhाओ
f"{1234567:,}"                   # '1,234,567' -- thousands separator
f"{0.0723:.1%}"                  # '7.2%'      -- percentage
f"{255:#x}"                      # '0xff'      -- prefix ke saath hex; :b :o bhi
f"{42:04d}"                      # '0042'      -- width 4 tak zero-pad
f"{'hi':->10}"                   # '--------hi' -- fill char '-', right-align, width 10
\`\`\`

**Dynamic specs aur dates**

\`\`\`python
w = 10
f"{name:>{w}}"                   # 'w' se padhी width mein right-align

from datetime import datetime
dt = datetime(2026, 8, 31, 14, 30)
f"{dt:%Y-%m-%d}"                 # '2026-08-31'
f"{dt:%H:%M on %A}"              # '14:30 on Monday'
\`\`\`

**Kahaan ek f-string istemal NA karें**

\`\`\`python
# 1. logging -- string sirf tab banao agar message asal mein emit hota hai:
logging.info("user %s did %s", uid, action)     # f"user {uid} did {action}" NAHI

# 2. SQL / shell -- f-string interpolation injection hai:
cur.execute("SELECT * FROM users WHERE id = %s", (uid,))   # f"... id = {uid}" NAHI
\`\`\`

\`\`\`
f"{ EXPR !conv : SPEC }"

EXPR    koi expression: f"{a + b}", f"{obj.attr}", f"{d['key']}", f"{fn(x)}"
!conv   !r (repr)  !s (str)  !a (ascii)     -- format se pehle kaise stringify karें
:SPEC   [[fill]align][sign][#][0][width][grouping][.precision][type]
        align:  <  left   >  right   ^  centre   =  sign ke baad pad
        sign:   +  hamesha  -  sirf negative (default)   (space) positive ke liye space
        group:  ,  ya  _
        type:   d int  f fixed  e sci  % percent  x/X/o/b radix  s str  g general
        dates:  koi strftime code -- %Y %m %d %H %M %S %A %B %j %z ...

{x = }  debug form: prints  x = <value>
{n:{w}} nested field: spec/width/precision khud {ek variable} ho sakta hai
\`\`\``,

    content: `## The field grammar

\`\`\`
{ expression [!conversion] [:format_spec] }
\`\`\`

- **expression** — evaluated normally; can be anything (\`f"{sum(xs)/len(xs):.1f}"\`). Since 3.12, may span multiple lines and reuse the same quote character.
- **!conversion** — \`!s\` (str), \`!r\` (repr), \`!a\` (ascii). Applied before the format spec. \`!r\` is invaluable in logs and errors: \`f"got {value!r}"\` shows \`'abc'\` or \`None\` unambiguously.
- **:format_spec** — the mini-language below.

## The format spec, piece by piece

\`\`\`
[[fill]align] [sign] [#] [0] [width] [grouping] [.precision] [type]
\`\`\`

\`\`\`python
# fill + align (align: < > ^ =)
f"{'x':>5}"       # '    x'
f"{'x':*<5}"      # 'x****'
f"{'x':.^5}"      # '..x..'
f"{-42:=6}"       # '-   42'   -- '=' pads between sign and digits

# sign
f"{42:+}"         # '+42'
f"{42: }"         # ' 42'      -- space for positives, '-' for negatives (aligns columns)

# width and zero-pad
f"{7:5}"          # '    7'
f"{7:05}"         # '00007'
f"{7:<5}"         # '7    '

# grouping
f"{1234567.89:,.2f}"   # '1,234,567.89'
f"{1234567:,}"         # '1,234,567'

# precision (meaning depends on type)
f"{3.14159:.2f}"       # '3.14'    -- digits after the point
f"{3.14159:.3g}"       # '3.14'    -- significant digits
f"{'truncate me':.5}"  # 'trunc'   -- max length for strings

# type
f"{255:b}"       # '11111111'
f"{255:o}"       # '377'
f"{255:x}"       # 'ff'
f"{255:#X}"      # '0XFF'
f"{2500:.2e}"    # '2.50e+03'
f"{0.5:.0%}"     # '50%'
\`\`\`

## Dynamic (nested) fields

\`\`\`python
width = 12
prec = 3
value = 3.14159

f"{value:{width}.{prec}f}"     # '       3.142'
f"{value:>{width}}"            # right-align, width from a variable
f"{label:{align}{width}}"     # align char also from a variable

# a computed spec:
spec = f"{'>' if right else '<'}{w}"
f"{text:{spec}}"
\`\`\`

## The \`=\` debug specifier (3.8+)

\`\`\`python
x = 10
y = 3
print(f"{x=}")            # x=10
print(f"{x=}, {y=}")      # x=10, y=3
print(f"{x + y = }")      # x + y = 13     -- spaces around '=' are preserved
print(f"{x/y=:.3f}")      # x/y=3.333       -- combine with a spec
\`\`\`

Perfect for quick tracing — the expression text and its value, together, with no retyping.

## When NOT to use an f-string

**Logging** — the logging module does lazy \`%\`-style interpolation:

\`\`\`python
# BAD: the f-string is built even when DEBUG is disabled
log.debug(f"processing {expensive_repr(obj)}")

# GOOD: the message is only formatted if the record is actually emitted
log.debug("processing %s", obj)
\`\`\`

**SQL, shell commands, HTML** — f-string interpolation puts raw values into the string, which is exactly how injection vulnerabilities happen:

\`\`\`python
# NEVER
cur.execute(f"SELECT * FROM t WHERE name = '{name}'")   # SQL injection
os.system(f"convert {user_filename} out.png")           # shell injection

# use the API's parameter mechanism
cur.execute("SELECT * FROM t WHERE name = %s", (name,))
subprocess.run(["convert", user_filename, "out.png"])   # no shell, args as a list
\`\`\`

For HTML, use the template engine's autoescaping or \`html.escape\`.

## \`str.format\` and \`%\` — the older forms

\`\`\`python
"{} has {}".format(name, n)            # positional
"{name} has {n}".format(name=name, n=n)   # keyword
"{0} {0} {1}".format("a", "b")         # 'a a b' -- reuse by index
"%s has %d" % (name, n)                # old %-style; still used by logging
\`\`\`

Prefer f-strings for readability. \`str.format\` is useful when the template is stored separately from the values (a config-driven message). \`%\` survives mainly in \`logging\` calls.`,

    contentHi: `## Field grammar

\`\`\`
{ expression [!conversion] [:format_spec] }
\`\`\`

- **expression** — saamaanya roop se evaluate; kuch bhi ho sakta hai (\`f"{sum(xs)/len(xs):.1f}"\`).
- **!conversion** — \`!s\` (str), \`!r\` (repr), \`!a\` (ascii). Format spec se pehle lagaaya. \`!r\` logs aur errors mein anmol hai: \`f"got {value!r}"\` \`'abc'\` ya \`None\` asandigdh dikhाता hai.
- **:format_spec** — neeche mini-language.

## Format spec, tukda tukda

\`\`\`
[[fill]align] [sign] [#] [0] [width] [grouping] [.precision] [type]
\`\`\`

\`\`\`python
# fill + align (align: < > ^ =)
f"{'x':>5}"       # '    x'
f"{'x':*<5}"      # 'x****'
f"{-42:=6}"       # '-   42'   -- '=' sign aur digits ke beech pad karता hai

# sign
f"{42:+}"         # '+42'
f"{42: }"         # ' 42'      -- positives ke liye space

# width aur zero-pad
f"{7:05}"         # '00007'

# grouping
f"{1234567.89:,.2f}"   # '1,234,567.89'

# precision
f"{3.14159:.2f}"       # '3.14'
f"{'truncate me':.5}"  # 'trunc'

# type
f"{255:x}"       # 'ff'
f"{2500:.2e}"    # '2.50e+03'
f"{0.5:.0%}"     # '50%'
\`\`\`

## Dynamic (nested) fields

\`\`\`python
width = 12
prec = 3
value = 3.14159

f"{value:{width}.{prec}f}"     # '       3.142'
f"{value:>{width}}"            # right-align, ek variable se width
\`\`\`

## \`=\` debug specifier (3.8+)

\`\`\`python
x = 10
y = 3
print(f"{x=}")            # x=10
print(f"{x + y = }")      # x + y = 13     -- '=' ke aas-paas spaces bache rehte hain
print(f"{x/y=:.3f}")      # x/y=3.333       -- ek spec ke saath combine
\`\`\`

## Kahaan ek f-string istemal NA karें

**Logging** — logging module lazy \`%\`-style interpolation karता hai:

\`\`\`python
# BURA: f-string tab bhi banता hai jab DEBUG disabled hai
log.debug(f"processing {expensive_repr(obj)}")

# ACHHA: message sirf tab format hota hai agar record asal mein emit hota hai
log.debug("processing %s", obj)
\`\`\`

**SQL, shell commands, HTML** — f-string interpolation raw values ko string mein daalता hai, jo bilkul aise injection vulnerabilities hoती hain:

\`\`\`python
# KABHI NAHI
cur.execute(f"SELECT * FROM t WHERE name = '{name}'")   # SQL injection
os.system(f"convert {user_filename} out.png")           # shell injection

# API ka parameter mechanism istemal karो
cur.execute("SELECT * FROM t WHERE name = %s", (name,))
subprocess.run(["convert", user_filename, "out.png"])   # koi shell nahi, args ek list
\`\`\`

HTML ke liye, template engine ka autoescaping ya \`html.escape\` istemal karो.

## \`str.format\` aur \`%\` — purane roop

\`\`\`python
"{} has {}".format(name, n)            # positional
"{name} has {n}".format(name=name, n=n)   # keyword
"{0} {0} {1}".format("a", "b")         # 'a a b' -- index se reuse
"%s has %d" % (name, n)                # purana %-style; abhi bhi logging dwara istemal
\`\`\`

Readability ke liye f-strings prefer karो. \`str.format\` upyogi hai jab template values se alag store hoता hai. \`%\` mukhya roop se \`logging\` calls mein bacha hai.`,

    examples: [
      {
        title: 'Conversions, the = specifier, and literal braces',
        titleHi: 'Conversions, = specifier, aur literal braces',
        code: `value = None
label = "count"
n = 7

print(f"value is {value}")           # str()
print(f"value is {value!r}")         # repr() -- shows it is None, not empty
print(f"{label!r}: {n}")

# the = debug specifier:
print(f"{n=}")
print(f"{n * 3 = }")                 # spaces around = are preserved in the output
print(f"{n / 3 = :.4f}")             # combine with a format spec

# literal braces need doubling:
print(f"{{ {label}: {n} }}")         # '{ count: 7 }'

# multiline expression (3.12+) and quote reuse:
data = {"a": 1, "b": 2}
print(f"keys: {', '.join(data)}")`,
        output: `value is None
value is None
'count': 7
n=7
n * 3 = 21
n / 3 = 2.3333
{ count: 7 }
keys: a, b`,
        explain: '`{value}` uses `str(None)` = `"None"`; `{value!r}` uses `repr(None)` — here both look the same, but `!r` is what disambiguates an empty string from `None` in logs. `{n=}` prints `n=7`; `{n * 3 = }` keeps the spaces you wrote around `=` and prints the expression text plus its value. `{{` and `}}` produce literal braces.',
        explainHi: '`{value}` `str(None)` = `"None"` istemal karता hai; `{value!r}` `repr(None)` istemal karता hai — yahaan dono ek jaise dikhते hain, par `!r` wo hai jo logs mein ek empty string ko `None` se alag karता hai. `{n=}` `n=7` print karता hai; `{n * 3 = }` aapke `=` ke aas-paas likhी spaces rakhता hai. `{{` aur `}}` literal braces banaते hain.',
      },
      {
        title: 'The format spec: alignment, precision, grouping, radix',
        titleHi: 'Format spec: alignment, precision, grouping, radix',
        code: `rows = [("Widget", 30, 19.99), ("Gadget", 120, 45.0), ("Gizmo", 8, 1999.0)]

# a formatted table with column widths and alignment:
print(f"{'ITEM':<10}{'QTY':>5}{'PRICE':>12}")
for name, qty, price in rows:
    print(f"{name:<10}{qty:>5}{price:>12.2f}")

print("---")
# money, percentages, big numbers:
gross = sum(q * p for _, q, p in rows)
print(f"total: {gross:,.2f}")
print(f"tax (7.5%): {gross * 0.075:,.2f}")
print(f"progress: {37/128:.1%}")

print("---")
# radix and padding:
for b in (7, 42, 255):
    print(f"{b:>3} = {b:08b} = {b:#04x} = {b:>4o}")`,
        output: `ITEM        QTY       PRICE
Widget       30       19.99
Gadget      120       45.00
Gizmo         8     1999.00
---
total: 21,991.70
tax (7.5%): 1,649.38
progress: 28.9%
---
  7 = 00000111 = 0x07 =    7
 42 = 00101010 = 0x2a =   52
255 = 11111111 = 0xff =  377
`,
        explain: '`{name:<10}` left-aligns in a 10-wide field; `{qty:>5}` right-aligns; `{price:>10.2f}` right-aligns a float with exactly 2 decimals — that is how you get aligned numeric columns. `{gross:,.2f}` groups thousands and fixes 2 decimals (`21,991.70`). `{x:.1%}` multiplies by 100 and appends `%`. `{b:08b}` is binary zero-padded to 8; `{b:#04x}` is hex with the `0x` prefix in width 4; `{b:>4o}` is octal RIGHT-ALIGNED in width 4 (not zero-padded).',
        explainHi: '`{name:<10}` ek 10-chaude field mein left-align karता hai; `{qty:>5}` right-align; `{price:>10.2f}` bilkul 2 decimals waale ek float ko right-align karता hai — aise aap aligned numeric columns paते ho. `{...:,.2f}` hazaar group karता hai aur 2 decimals fix karता hai. `{x:.1%}` 100 se guna karता hai aur `%` jodता hai.',
      },
      {
        title: 'Nested specs, dates, and the logging anti-pattern',
        titleHi: 'Nested specs, dates, aur logging anti-pattern',
        code: `import logging
from datetime import datetime

# nested / dynamic spec:
for width in (8, 12, 16):
    print(f"{'right':>{width}}|")

value = 3.14159265
for prec in (2, 4, 6):
    print(f"pi to {prec}: {value:.{prec}f}")

# dates via strftime codes in the spec:
dt = datetime(2026, 8, 31, 14, 30, 5)
print(f"{dt:%Y-%m-%d %H:%M:%S}")
print(f"{dt:%A, %B %d}")
print(f"{dt:%j}")                     # day of year

# logging: pass args, do not pre-format
calls = {"n": 0}
class Obj:
    def __repr__(self):
        calls["n"] += 1
        return "<expensive>"

logging.basicConfig(level=logging.WARNING)   # INFO is disabled
logging.info("processing %s", Obj())         # repr NOT called -- level too low
print("repr calls with lazy logging:", calls["n"])
logging.info(f"processing {Obj()!r}")        # repr IS called -- string built eagerly
print("repr calls with f-string logging:", calls["n"])`,
        output: `   right|
       right|
           right|
pi to 2: 3.14
pi to 4: 3.1416
pi to 6: 3.141593
2026-08-31 14:30:05
Monday, August 31
243
repr calls with lazy logging: 0
repr calls with f-string logging: 1`,
        explain: '`{...:>{width}}` and `{value:.{prec}f}` read the width/precision from variables. `{dt:%Y-%m-%d}` runs `dt.strftime("%Y-%m-%d")`. The logging part shows the cost: `logging.info("processing %s", obj)` does NOT call `repr` when INFO is disabled (0 calls), but `logging.info(f"processing {obj!r}")` builds the f-string immediately (1 call) — wasted work for a message that is never emitted.',
        explainHi: '`{...:>{width}}` aur `{value:.{prec}f}` variables se width/precision padhते hain. `{dt:%Y-%m-%d}` `dt.strftime("%Y-%m-%d")` chalाता hai. Logging part keemat dikhाता hai: `logging.info("processing %s", obj)` INFO disabled hone par `repr` NAHI call karता (0 calls), par `logging.info(f"processing {obj!r}")` f-string turant banाता hai (1 call) — ek message ke liye barbaad kaam jo kabhi emit nahi hota.',
      },
    ],

    mistakes: [
      {
        wrong: `log.debug(f"query result: {json.dumps(rows, indent=2)}")`,
        right: `log.debug("query result: %s", rows)
# json.dumps runs only if DEBUG is on and the handler formats the record`,
        why: 'The f-string (and the `json.dumps` inside it) is evaluated the moment the line runs, regardless of the log level. On a production system with `DEBUG` off, you pay the serialization cost on every call for a string that is discarded. Pass the value as a `%`-arg; logging formats it lazily, only when the record is actually emitted.',
        whyHi: 'F-string (aur iske andar `json.dumps`) us pal evaluate hota hai jab line chalती hai, log level ki parwaah kiye bina. `DEBUG` off waale production system par, aap har call par ek string ke liye serialization keemat chukाते ho jo phenka jाता hai. Value ko ek `%`-arg ki tarah pass karो.',
      },
      {
        wrong: `cur.execute(f"UPDATE users SET name = '{new_name}' WHERE id = {uid}")`,
        right: `cur.execute("UPDATE users SET name = %s WHERE id = %s", (new_name, uid))`,
        why: 'Interpolating `new_name` directly into the SQL string is a textbook SQL injection: a name of `x\'; DROP TABLE users; --` becomes executable SQL. The database driver\'s parameter placeholders (`%s`, `?`, `:name` depending on the driver) send the values separately so they can never be interpreted as SQL.',
        whyHi: '`new_name` ko seedhe SQL string mein interpolate karna ek textbook SQL injection hai: `x\'; DROP TABLE users; --` naam executable SQL ban jाता hai. Database driver ke parameter placeholders values ko alag bhejते hain taaki wo kabhi SQL ki tarah interpret na hon.',
      },
      {
        wrong: `f"{amount}"                       # amount = 3.1  -> '3.1', not '3.10'
f"{ratio}"                        # ratio = 0.6666...  -> '0.6666666666666666'`,
        right: `f"{amount:.2f}"                   # '3.10'
f"{ratio:.1%}"                    # '66.7%'
f"{count:,}"                      # '1,234,567' instead of '1234567'`,
        why: 'A bare `{value}` uses the default `str()`, which for floats shows full repr precision and never pads. For anything user-facing — money, percentages, counts — add an explicit format spec so the output has the intended number of decimals, a sign policy, or thousands grouping.',
        whyHi: 'Ek nanga `{value}` default `str()` istemal karता hai, jo floats ke liye poori repr precision dikhाता hai aur kabhi pad nahi karता. Kisi bhi user-facing cheez ke liye — paise, percentages, counts — ek explicit format spec jodो.',
      },
    ],

    realWorld: [
      {
        en: '**`logging.info("...%s...", value)` (not f-strings) is enforced by linters** — `ruff` rule `G004` / `pylint` `logging-fstring-interpolation` flag f-strings in logging calls precisely because of the eager-evaluation cost and because structured log processors want the template and args separate.',
        hi: '**`logging.info("...%s...", value)` (f-strings nahi) linters dwara enforce hota hai** — `ruff` rule `G004` / `pylint` `logging-fstring-interpolation` logging calls mein f-strings flag karते hain eager-evaluation cost aur structured log processors ki wajah se.',
      },
      {
        en: '**The f-string-in-SQL mistake is the #1 web vulnerability class (injection)** — Django\'s ORM and `cursor.execute(sql, params)` exist to keep values out of the query string. Anytime you see `f"...{user_input}..."` inside `execute`, `os.system`, `subprocess` with `shell=True`, or raw HTML, it is a bug.',
        hi: '**f-string-in-SQL galti #1 web vulnerability class (injection) hai** — Django ka ORM aur `cursor.execute(sql, params)` values ko query string se baahar rakhne ke liye maujood hain. Jab bhi aap `execute`, `os.system` ke andar `f"...{user_input}..."` dekhते ho, ye ek bug hai.',
      },
      {
        en: '**The format mini-language powers report/CLI output everywhere** — aligned tables (`{:<20}{:>10}`), currency (`{:,.2f}`), progress percentages (`{:.1%}`), fixed-width IDs (`{:08d}`), and `{dt:%Y-%m-%d}` for dates. `rich`, `tabulate`, and Django admin all build on it.',
        hi: '**Format mini-language har jagah report/CLI output chalाता hai** — aligned tables, currency (`{:,.2f}`), progress percentages (`{:.1%}`), fixed-width IDs (`{:08d}`), aur dates ke liye `{dt:%Y-%m-%d}`. `rich`, `tabulate`, aur Django admin sab ispar bante hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through the f-string field syntax. What do `!r`, the `=` specifier, and a nested `{width}` do?',
        qHi: 'f-string field syntax samjhaao. `!r`, `=` specifier, aur ek nested `{width}` kya karते hain?',
        a: 'An f-string field is written as an opening brace, then an expression, then optionally an exclamation mark and a conversion letter, then optionally a colon and a format spec, then a closing brace. The expression is evaluated in the current scope like any other expression — it can be arithmetic, an attribute access, a subscript, a function call, anything. The optional conversion is one of three letters: s applies str, r applies repr, and a applies ascii, and this happens before the format spec is applied. r is the useful one in practice: writing brace value exclamation r produces the repr of the value, so an empty string shows as two quote marks and None shows as the word None, which removes ambiguity in log lines and error messages where a bare value could be misread. The equals specifier, written by putting an equals sign right after the expression and before any colon, is a debugging shorthand. Brace x equals produces the text x equals followed by the value of x. It echoes the literal source text of the expression, including any whitespace you put around the equals sign, and then the value, so brace x plus y space equals space prints x plus y equals and the result. It can be combined with a conversion and a spec after the equals. It exists to make quick print-debugging fast: you do not retype the expression as a label. The format spec after the colon is a small language controlling fill character, alignment, sign display, alternate form, zero padding, minimum width, digit grouping, precision, and a type code. Any numeric part of that spec — the width, the precision — can itself be a nested field in braces referring to a variable. So brace value colon brace width dot brace prec f takes the width and precision from variables at runtime, which lets you build tables whose column widths are computed, or vary precision by context. You can even make the entire spec a single nested expression.',
        aHi: 'Ek f-string field ek opening brace, phir ek expression, phir vaikalpik roop se ek exclamation mark aur ek conversion letter, phir vaikalpik roop se ek colon aur ek format spec, phir ek closing brace ki tarah likha jाता hai. Expression current scope mein kisi bhi expression ki tarah evaluate hota hai. Vaikalpik conversion teen letters mein se ek hai: s str lagaता hai, r repr lagाता hai, a ascii. Ye format spec lagाने se pehle hota hai. r vyavhaar mein upyogi hai: brace value exclamation r value ka repr banाता hai, isliye ek empty string do quote marks ki tarah dikhता hai aur None None shabd ki tarah. Equals specifier debugging shorthand hai. Brace x equals text x equals plus x ki value banাता hai. Format spec colon ke baad ek chhoti bhasha hai jo fill character, alignment, sign display, width, grouping, precision, aur ek type code control karती hai. Us spec ka koi bhi numeric hissa khud braces mein ek nested field ho sakта hai.',
      },
      {
        q: 'Why should you not use an f-string in a `logging` call or in an SQL query?',
        qHi: 'Aapko ek `logging` call ya ek SQL query mein ek f-string kyun istemal nahi karna chahiye?',
        a: 'For logging, the reason is eager evaluation. An f-string is computed the instant the line of code executes, before the logging call even begins. If you write logging dot debug of an f-string, the entire f-string — including any function calls, serialization, or expensive repr methods inside it — runs every single time that line is reached, regardless of whether the debug level is actually enabled. On a production system where debug logging is off, that is pure waste: you build a string, hand it to the logger, and the logger immediately discards it because the level is too low. The logging module is designed for lazy formatting: you pass a message template with percent-style placeholders and the arguments separately, as logging dot debug of the template, then the values. The module only interpolates the template with the values if it decides the record will actually be emitted by some handler. So the expensive work is skipped when the log line is filtered out. Linters flag f-strings in logging calls for exactly this reason. For SQL, the reason is injection. An f-string interpolates values directly into the query text as characters. If any of those values comes from user input — a form field, a URL parameter, an API body — a malicious value can contain SQL syntax that changes the meaning of the query: closing a string literal early, adding a semicolon and a second statement, commenting out the rest. This is SQL injection, and it is one of the most serious and common web vulnerabilities. The correct approach is to use the database driver\'s parameter substitution: you write the query with placeholder markers and pass the values as a separate sequence or mapping, and the driver sends them to the database in a way that guarantees they are treated as data, never as SQL. The same principle applies to shell commands — pass an argument list to subprocess rather than building a shell string — and to HTML, where you rely on the template engine\'s autoescaping.',
        aHi: 'Logging ke liye, kaaran eager evaluation hai. Ek f-string us pal compute hota hai jab code ki line execute hoती hai, logging call shuru hone se pehle bhi. Agar aap logging dot debug of an f-string likhते ho, poora f-string — iske andar koi function calls, serialization, ya mehنge repr methods sameth — har baar chalता hai jab wo line pahunchी jाती hai, chahe debug level enabled hai ya nahi. Production system par jahaan debug logging off hai, wo shuddh barbaadi hai. Logging module lazy formatting ke liye design kiya gaya hai: aap ek message template percent-style placeholders ke saath aur arguments alag pass karते ho. Module template ko values ke saath sirf tab interpolate karता hai agar ye tay karता hai ki record asal mein emit hoga. SQL ke liye, kaaran injection hai. Ek f-string values ko seedhe query text mein characters ki tarah interpolate karता hai. Agar unmein se koi value user input se aati hai, ek malicious value mein SQL syntax ho sakta hai jo query ka matlab badalता hai. Sahi tarika database driver ka parameter substitution istemal karna hai.',
      },
    ],

    exercises: [
      {
        task: 'Write `format_row(name, qty, price)` that returns a fixed-width line: name left-aligned in 15, qty right-aligned in 6, price right-aligned in 10 with 2 decimals and a thousands separator. Test `format_row("Deluxe Widget", 1200, 19.5)` and confirm the columns line up when you print several rows plus a header.',
        taskHi: '`format_row(name, qty, price)` likhो jo ek fixed-width line lautaाe: name 15 mein left-aligned, qty 6 mein right-aligned, price 10 mein 2 decimals aur ek thousands separator ke saath right-aligned. `format_row("Deluxe Widget", 1200, 19.5)` test karो.',
        hint: '`f"{name:<15}{qty:>6}{price:>10,.2f}"`. Print a header with the same widths (`f"{\'NAME\':<15}{\'QTY\':>6}{\'PRICE\':>10}"`) and several rows; every column boundary should align.',
        hintHi: '`f"{name:<15}{qty:>6}{price:>10,.2f}"`. Same widths ke saath ek header print karो aur kai rows; har column boundary align honi chahiye.',
      },
      {
        task: 'Write `dbg(**kw)` that prints each keyword as `name=value!r` on its own line (mimicking the `{x=}` specifier for arbitrary names). Then separately, show the real `=` specifier: `a = 5; b = [1,2]; print(f"{a=}, {b=}")`. Compare the outputs.',
        taskHi: '`dbg(**kw)` likhо jo har keyword ko `name=value!r` ki tarah apni line par print kare. Phir alag se, asli `=` specifier dikhाओ: `a = 5; b = [1,2]; print(f"{a=}, {b=}")`. Outputs compare karो.',
        hint: '`for k, v in kw.items(): print(f"{k}={v!r}")`. The built-in `f"{a=}"` gives `a=5` and `f"{b=}"` gives `b=[1, 2]` — same shape, but the specifier echoes the literal expression text so it also works for `f"{a+1=}"`.',
        hintHi: '`for k, v in kw.items(): print(f"{k}={v!r}")`. Built-in `f"{a=}"` `a=5` deता hai — same shape, par specifier literal expression text echo karता hai isliye `f"{a+1=}"` ke liye bhi kaam karता hai.',
      },
      {
        task: 'Write `progress_bar(done, total, width=20)` returning a string like `"[#####-----]  50% (5/10)"`. Use `{filled * "#"}{empty * "-"}` (or a repeated slice), `{pct:>4.0%}` for the percentage, and `{done}/{total}` at the end. Test at 0/10, 5/10, 10/10.',
        taskHi: '`progress_bar(done, total, width=20)` likhо jo `"[#####-----]  50% (5/10)"` jaisी string lautाe. `{filled * "#"}{empty * "-"}`, percentage ke liye `{pct:>4.0%}`, aur ant mein `{done}/{total}` istemal karो. 0/10, 5/10, 10/10 par test karो.',
        hint: '`pct = done / total; filled = round(pct * width); bar = "#" * filled + "-" * (width - filled)`. Then `f"[{bar}] {pct:>4.0%} ({done}/{total})"`.',
        hintHi: '`pct = done / total; filled = round(pct * width); bar = "#" * filled + "-" * (width - filled)`. Phir `f"[{bar}] {pct:>4.0%} ({done}/{total})"`.',
      },
    ],

    keyTakeaways: [
      'f-string field: `{ expression [!conversion] [:format_spec] }`. The expression is evaluated normally; `!r`/`!s`/`!a` stringify before formatting (`!r` disambiguates `""` from `None` in logs).',
      'The format spec: `[[fill]align][sign][#][0][width][grouping][.precision][type]`. `<`/`>`/`^` align; `,`/`_` group thousands; `.2f` = 2 decimals; `.1%` = percentage; `x`/`b`/`o` = radix; `04d` = zero-pad.',
      'A bare `{x}` uses `str()` — no padding, full float precision. Add a spec for anything user-facing (money `:,.2f`, percent `:.1%`, aligned columns `:<20`).',
      'Nested fields: `f"{value:{width}.{prec}f}"` reads width/precision from variables; the whole spec can be a `{nested expression}`.',
      '`f"{x=}"` (the `=` specifier) prints `x=<value>`, echoing the literal expression text (spaces preserved). Great for quick tracing; combine with a spec: `f"{x/y=:.2f}"`.',
      'NEVER use an f-string in a `logging` call — it is built eagerly even when the level is disabled. Pass `log.info("...%s...", value)` so formatting is lazy.',
      'NEVER interpolate values into SQL / shell / HTML with an f-string — that is injection. Use `cursor.execute(sql, params)`, `subprocess.run([args])`, template autoescaping.',
      '`str.format` is for templates stored apart from values; `%`-formatting survives mainly in `logging`. Prefer f-strings elsewhere for readability.',
    ],
    keyTakeawaysHi: [
      'f-string field: `{ expression [!conversion] [:format_spec] }`. Expression saamaanya roop se evaluate hota hai; `!r`/`!s`/`!a` format se pehle stringify karते hain (`!r` logs mein `""` ko `None` se alag karता hai).',
      'Format spec: `[[fill]align][sign][#][0][width][grouping][.precision][type]`. `<`/`>`/`^` align; `,`/`_` hazaar group; `.2f` = 2 decimals; `.1%` = percentage; `x`/`b`/`o` = radix; `04d` = zero-pad.',
      'Ek nanga `{x}` `str()` istemal karता hai — koi padding nahi, poori float precision. Kisi bhi user-facing cheez ke liye ek spec jodो (paise `:,.2f`, percent `:.1%`, aligned columns `:<20`).',
      'Nested fields: `f"{value:{width}.{prec}f}"` variables se width/precision padhता hai; poora spec ek `{nested expression}` ho sakта hai.',
      '`f"{x=}"` (`=` specifier) `x=<value>` print karता hai, literal expression text echo karके (spaces bache). Quick tracing ke liye badhiya; ek spec ke saath combine: `f"{x/y=:.2f}"`.',
      'KABHI ek `logging` call mein ek f-string istemal mat karो — ye eagerly banता hai chahe level disabled ho. `log.info("...%s...", value)` pass karो taaki formatting lazy ho.',
      'KABHI values ko ek f-string se SQL / shell / HTML mein interpolate mat karो — wo injection hai. `cursor.execute(sql, params)`, `subprocess.run([args])`, template autoescaping istemal karो.',
      '`str.format` values se alag store kiye templates ke liye hai; `%`-formatting mukhya roop se `logging` mein bacha hai. Baaki jagah readability ke liye f-strings prefer karो.',
    ],
  },

  {
    slug: 'py-str-vs-bytes-encoding',
    title: 'str vs bytes: Encoding, Decoding, and Unicode',
    titleHi: 'str vs bytes: Encoding, Decoding, Aur Unicode',
    description: 'Reading a file that opens fine on your machine and crashes with `UnicodeDecodeError` on the server, or getting `TypeError: a bytes-like object is required, not \'str\'` when writing to a socket. Text (`str`) and raw bytes (`bytes`) are different types with an explicit conversion between them — `.encode()` to go text→bytes, `.decode()` to go bytes→text — and every conversion needs an encoding, which should almost always be UTF-8.',
    descriptionHi: 'Ek file padhna jo aapki machine par theek khुलती hai aur server par `UnicodeDecodeError` se crash hoती hai, ya ek socket par likhте waqt `TypeError: a bytes-like object is required, not \'str\'` paना. Text (`str`) aur raw bytes (`bytes`) alag types hain unke beech ek explicit conversion ke saath — text→bytes jaane ko `.encode()`, bytes→text jaane ko `.decode()` — aur har conversion ko ek encoding chahiye, jo lagbhag hamesha UTF-8 honi chahiye.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 3,

    analogy: {
      en: '**A written sentence versus the physical ink marks that represent it.** "The word cat" is an idea made of three letters — that is `str`, a sequence of characters (code points), the abstract text. To send that word to someone, it has to become physical: ink on paper, pixels on a wire, a pattern of bytes. That physical form is `bytes`, and turning the abstract letters into a specific physical pattern requires choosing a *scheme* — a handwriting style, a font, an alphabet convention. That scheme is the encoding. `.encode("utf-8")` is "write this text down using the UTF-8 scheme, producing bytes". `.decode("utf-8")` is "read these ink marks back into letters, assuming they were written in UTF-8". The disasters happen when the writer used one scheme and the reader assumes another: bytes written as UTF-8 but read as Latin-1 come back as mojibake — plausible-looking but wrong letters — and bytes that are not valid in the assumed scheme raise `UnicodeDecodeError`, the reader saying "these marks are not letters in the alphabet you told me to use". The fix that removes almost all of this pain is for everyone to agree on one scheme, and that scheme is UTF-8.',
      hi: '**Ek likha vaakya versus wo bhautik ink marks jo ise represent karते hain.** "cat shabd" teen letters se bani ek idea hai — wo `str` hai, characters (code points) ka ek sequence, abstract text. Us shabd ko kisi ko bhejने ko, ise bhautik banna hoga: kaagaz par ink, ek wire par pixels, bytes ka ek pattern. Wo bhautik roop `bytes` hai, aur abstract letters ko ek specific bhautik pattern mein badalne ke liye ek *scheme* chunना chahiye — ek handwriting style, ek font, ek alphabet convention. Wo scheme encoding hai. `.encode("utf-8")` "is text ko UTF-8 scheme istemal karके likhो, bytes banाते hue" hai. `.decode("utf-8")` "in ink marks ko wapas letters mein padhो, ye maankar ki wo UTF-8 mein likhे the" hai. Aapdaayein tab hoती hain jab writer ne ek scheme istemal kiya aur reader doosra maanता hai. Fix jo is dard ka lagbhag saara hataता hai wo sabka ek scheme par sahmat hona hai, aur wo scheme UTF-8 hai.',
    },

    simple: `**Two types, one explicit conversion**

\`\`\`python
text = "café"                    # str -- 4 characters (code points)
data = text.encode("utf-8")     # bytes -- b'caf\\xc3\\xa9', 5 bytes (é is 2 bytes in UTF-8)

len(text)                        # 4
len(data)                        # 5

data.decode("utf-8")            # 'café'  -- back to str
\`\`\`

**\`bytes\` literals and operations**

\`\`\`python
b"hello"                         # bytes literal -- ASCII only in the source
b"\\x00\\xff"                     # arbitrary byte values
bytes([104, 105])               # b'hi'  -- from a list of ints 0..255
data[0]                          # 99    -- indexing bytes gives an INT, not a 1-byte bytes
data[0:1]                        # b'c'  -- slicing bytes gives bytes
\`\`\`

**The errors you will hit**

\`\`\`python
"abc" + b"def"                   # TypeError: can't concat str to bytes
sock.send("hello")               # TypeError: a bytes-like object is required, not 'str'
                                 #   -> sock.send("hello".encode())

b"\\xff\\xfe".decode("utf-8")     # UnicodeDecodeError: invalid start byte
                                 #   -> the bytes are not valid UTF-8

open("data.txt").read()          # uses the platform's default encoding -- may not be UTF-8!
                                 #   -> open("data.txt", encoding="utf-8")
\`\`\`

**Files: text mode vs binary mode**

\`\`\`python
open("f.txt", "r", encoding="utf-8")    # text mode -> read()/write() take/give str
open("f.bin", "rb")                     # binary mode -> read()/write() take/give bytes
                                        #   no encoding argument; you get raw bytes
\`\`\`

\`\`\`
str      a sequence of Unicode code points -- ABSTRACT TEXT. len = number of characters.
bytes    a sequence of integers 0..255 -- RAW OCTETS. len = number of bytes. Immutable.
bytearray is the mutable version of bytes.

str  --.encode(encoding)-->  bytes      (text going OUT: to a file, socket, subprocess)
bytes --.decode(encoding)-->  str        (bytes coming IN: from a file, socket, network)

- ALWAYS pass an explicit encoding. Use "utf-8" unless a spec says otherwise.
- encode/decode with errors=  ->  "strict" (default, raises) | "replace" | "ignore" | "backslashreplace"
- text file mode ('r'/'w') gives str and needs encoding=; binary mode ('rb'/'wb') gives bytes
- b"..." literals are ASCII-only in source; indexing bytes -> int, slicing bytes -> bytes
- do NOT mix: "s" + b"b" is a TypeError; compare/concat only within one type
\`\`\``,

    simpleHi: `**Do types, ek explicit conversion**

\`\`\`python
text = "café"                    # str -- 4 characters (code points)
data = text.encode("utf-8")     # bytes -- b'caf\\xc3\\xa9', 5 bytes (é UTF-8 mein 2 bytes)

len(text)                        # 4
len(data)                        # 5

data.decode("utf-8")            # 'café'  -- wapas str
\`\`\`

**\`bytes\` literals aur operations**

\`\`\`python
b"hello"                         # bytes literal -- source mein sirf ASCII
b"\\x00\\xff"                     # koi bhi byte values
bytes([104, 105])               # b'hi'  -- ints 0..255 ki list se
data[0]                          # 99    -- bytes index karna ek INT deता hai, 1-byte bytes nahi
data[0:1]                        # b'c'  -- bytes slice karna bytes deता hai
\`\`\`

**Wo errors jo aapko milेnge**

\`\`\`python
"abc" + b"def"                   # TypeError: can't concat str to bytes
sock.send("hello")               # TypeError: a bytes-like object is required, not 'str'
                                 #   -> sock.send("hello".encode())

b"\\xff\\xfe".decode("utf-8")     # UnicodeDecodeError: invalid start byte
                                 #   -> bytes valid UTF-8 nahi hain

open("data.txt").read()          # platform ki default encoding istemal karता hai -- UTF-8 na ho!
                                 #   -> open("data.txt", encoding="utf-8")
\`\`\`

**Files: text mode vs binary mode**

\`\`\`python
open("f.txt", "r", encoding="utf-8")    # text mode -> read()/write() str lete/dete hain
open("f.bin", "rb")                     # binary mode -> read()/write() bytes lete/dete hain
\`\`\`

\`\`\`
str      Unicode code points ka ek sequence -- ABSTRACT TEXT. len = characters ki sankhya.
bytes    integers 0..255 ka ek sequence -- RAW OCTETS. len = bytes ki sankhya. Immutable.
bytearray bytes ka mutable version hai.

str  --.encode(encoding)-->  bytes      (text BAAHAR jाता: ek file, socket, subprocess ko)
bytes --.decode(encoding)-->  str        (bytes ANDAR aaते: ek file, socket, network se)

- HAMESHA ek explicit encoding pass karो. "utf-8" istemal karो jab tak ek spec na kahe.
- encode/decode errors= ke saath  ->  "strict" (default, raises) | "replace" | "ignore"
- text file mode ('r'/'w') str deता hai aur encoding= chahiye; binary mode ('rb'/'wb') bytes deता hai
- b"..." literals source mein sirf ASCII; bytes index -> int, bytes slice -> bytes
- MIX mat karो: "s" + b"b" ek TypeError hai
\`\`\``,

    content: `## Code points vs bytes

A \`str\` is a sequence of Unicode *code points* — abstract character numbers. \`"A"\` is code point 65, \`"é"\` is 233, \`"😀"\` is 128512. It has no inherent byte representation.

\`bytes\` is a sequence of integers 0–255. To turn text into bytes you pick an encoding — a rule for mapping code points to byte sequences:

\`\`\`python
"é".encode("utf-8")       # b'\\xc3\\xa9'   -- 2 bytes
"é".encode("latin-1")     # b'\\xe9'       -- 1 byte
"é".encode("utf-16")      # b'\\xff\\xfe\\xe9\\x00'  -- BOM + 2 bytes
"😀".encode("utf-8")       # b'\\xf0\\x9f\\x98\\x80'  -- 4 bytes
"😀".encode("latin-1")     # UnicodeEncodeError -- latin-1 has no code for it
\`\`\`

UTF-8 is the dominant encoding: ASCII-compatible (the first 128 code points are one byte each, identical to ASCII), can represent every Unicode character, and has no byte-order issues.

## Decoding failures

\`\`\`python
raw = b"caf\\xe9"                     # 'café' encoded as latin-1
raw.decode("utf-8")                  # UnicodeDecodeError: invalid continuation byte
raw.decode("latin-1")               # 'café'   -- correct, if you know it is latin-1
raw.decode("utf-8", errors="replace")  # 'caf\\ufffd'  -- the replacement char U+FFFD
raw.decode("utf-8", errors="ignore")   # 'caf'        -- the bad byte dropped
\`\`\`

\`UnicodeDecodeError\` means the bytes are not valid in the encoding you specified. The real fix is to find out what encoding actually produced them (often a config, a spec, or an HTTP \`Content-Type\` header). \`errors="replace"\`/\`"ignore"\` is a lossy fallback for when you cannot control the input and would rather have partial text than a crash.

## \`bytes\` behaves subtly differently from \`str\`

\`\`\`python
b = b"hello"
b[0]                # 104    -- an int
b[0:1]             # b'h'   -- a length-1 bytes
list(b)            # [104, 101, 108, 108, 111]
b.decode()         # 'hello'  -- decode() defaults to utf-8 (since 3.something; be explicit anyway)

# bytes has str-like methods, operating on ASCII:
b"  hi  ".strip()          # b'hi'
b"a,b,c".split(b",")       # [b'a', b'b', b'c']
b"ABC".lower()             # b'abc'
b"%d items" % 5            # b'5 items'   -- %-formatting works on bytes; f-strings do NOT

# bytearray is mutable:
ba = bytearray(b"hello")
ba[0] = 72
bytes(ba)                  # b'Hello'
\`\`\`

## Files and the default-encoding trap

\`\`\`python
# BAD: relies on locale.getpreferredencoding() -- cp1252 on Windows, utf-8 on most Linux
with open("data.json") as f:
    text = f.read()                 # may raise UnicodeDecodeError on a UTF-8 file on Windows

# GOOD: always specify
with open("data.json", encoding="utf-8") as f:
    text = f.read()

# binary mode: no encoding, raw bytes in and out
with open("image.png", "rb") as f:
    header = f.read(8)              # bytes
\`\`\`

Python 3.15 will make UTF-8 the default for \`open()\`, but until then (and for any code that must run on older versions), pass \`encoding="utf-8"\` every time. \`PYTHONUTF8=1\` or the \`-X utf8\` flag forces it process-wide.

## Where the boundary is

\`\`\`
text (str)  <-- your program works here -->  text (str)
     ^                                              |
     | .decode(enc)                                 | .encode(enc)
     |                                              v
bytes  <---- file / socket / subprocess / HTTP body / DB blob ---->  bytes
\`\`\`

Decode at the moment bytes enter your program; encode at the moment text leaves. Everything in between is \`str\`. Do not carry half-decoded bytes around.

## Common real conversions

\`\`\`python
import base64, json, hashlib

base64.b64encode(b"binary").decode("ascii")     # bytes -> base64 str
json.dumps(obj).encode("utf-8")                 # obj -> str -> bytes for a socket
hashlib.sha256("password".encode("utf-8")).hexdigest()   # hash wants bytes
subprocess.run([...], capture_output=True).stdout.decode()   # subprocess gives bytes
requests.get(url).content        # bytes ;  .text  -> str (requests guesses the encoding)
\`\`\``,

    contentHi: `## Code points vs bytes

Ek \`str\` Unicode *code points* ka ek sequence hai — abstract character numbers. \`"A"\` code point 65 hai, \`"é"\` 233 hai, \`"😀"\` 128512 hai. Iska koi antargat byte representation nahi.

\`bytes\` integers 0–255 ka ek sequence hai. Text ko bytes mein badalne ko aap ek encoding chunते ho — code points ko byte sequences se map karne ka ek niyam:

\`\`\`python
"é".encode("utf-8")       # b'\\xc3\\xa9'   -- 2 bytes
"é".encode("latin-1")     # b'\\xe9'       -- 1 byte
"😀".encode("utf-8")       # b'\\xf0\\x9f\\x98\\x80'  -- 4 bytes
"😀".encode("latin-1")     # UnicodeEncodeError -- latin-1 mein iske liye koi code nahi
\`\`\`

UTF-8 pramukh encoding hai: ASCII-compatible, har Unicode character represent kar sakta hai, aur koi byte-order samasya nahi.

## Decoding failures

\`\`\`python
raw = b"caf\\xe9"                     # 'café' latin-1 ki tarah encoded
raw.decode("utf-8")                  # UnicodeDecodeError: invalid continuation byte
raw.decode("latin-1")               # 'café'   -- sahi, agar aap jaanते ho ye latin-1 hai
raw.decode("utf-8", errors="replace")  # 'caf\\ufffd'  -- replacement char U+FFFD
raw.decode("utf-8", errors="ignore")   # 'caf'        -- kharaab byte gira
\`\`\`

\`UnicodeDecodeError\` matlab bytes aapki specified encoding mein valid nahi hain. Asli fix ye pata karna hai ki kaunsi encoding ne asal mein unhe banaya. \`errors="replace"\`/\`"ignore"\` ek lossy fallback hai.

## \`bytes\` \`str\` se sookshm roop se alag vyavhaar karता hai

\`\`\`python
b = b"hello"
b[0]                # 104    -- ek int
b[0:1]             # b'h'   -- ek length-1 bytes
list(b)            # [104, 101, 108, 108, 111]

# bytes mein str-jaisी methods hain, ASCII par operating:
b"  hi  ".strip()          # b'hi'
b"a,b,c".split(b",")       # [b'a', b'b', b'c']
b"%d items" % 5            # b'5 items'   -- %-formatting bytes par kaam karता hai; f-strings NAHI

# bytearray mutable hai:
ba = bytearray(b"hello")
ba[0] = 72
bytes(ba)                  # b'Hello'
\`\`\`

## Files aur default-encoding jaal

\`\`\`python
# BURA: locale.getpreferredencoding() par nirbhar -- Windows par cp1252, adhikaansh Linux par utf-8
with open("data.json") as f:
    text = f.read()                 # Windows par ek UTF-8 file par UnicodeDecodeError raise kar sakta hai

# ACHHA: hamesha specify karो
with open("data.json", encoding="utf-8") as f:
    text = f.read()

# binary mode: koi encoding nahi, raw bytes andar aur baahar
with open("image.png", "rb") as f:
    header = f.read(8)              # bytes
\`\`\`

Python 3.15 \`open()\` ke liye UTF-8 ko default banाएga, par tab tak, har baar \`encoding="utf-8"\` pass karो. \`PYTHONUTF8=1\` ya \`-X utf8\` flag ise process-wide majboor karता hai.

## Boundary kahaan hai

\`\`\`
text (str)  <-- aapka program yahaan kaam karता hai -->  text (str)
     ^                                              |
     | .decode(enc)                                 | .encode(enc)
     |                                              v
bytes  <---- file / socket / subprocess / HTTP body / DB blob ---->  bytes
\`\`\`

Bytes ke aapke program mein aane ke pal decode karो; text ke baahar jaane ke pal encode karो. Beech mein sab kuch \`str\` hai.

## Aam asli conversions

\`\`\`python
import base64, json, hashlib

base64.b64encode(b"binary").decode("ascii")     # bytes -> base64 str
json.dumps(obj).encode("utf-8")                 # obj -> str -> bytes ek socket ke liye
hashlib.sha256("password".encode("utf-8")).hexdigest()   # hash bytes chahता hai
requests.get(url).content        # bytes ;  .text  -> str
\`\`\``,

    examples: [
      {
        title: 'encode/decode, length in characters vs bytes',
        titleHi: 'encode/decode, characters vs bytes mein length',
        code: `samples = ["hello", "café", "naïve", "\\u20ac10", "\\U0001f600"]

for s in samples:
    b = s.encode("utf-8")
    label = s.encode("unicode_escape").decode("ascii")   # ASCII-safe view
    print(f"{label:12} chars={len(s)}  utf8_bytes={len(b)}  hex={b.hex()}  roundtrip={b.decode('utf-8') == s}")

# the same character in different encodings:
euro = "\\u20ac"
print("euro in utf-8:  ", euro.encode("utf-8").hex())
print("euro in utf-16: ", euro.encode("utf-16-le").hex())
print("euro in latin-1:", end=" ")
try:
    euro.encode("latin-1")
except UnicodeEncodeError:
    print("UnicodeEncodeError (latin-1 has no euro sign)")`,
        output: `hello        chars=5  utf8_bytes=5  hex=68656c6c6f  roundtrip=True
caf\\xe9      chars=4  utf8_bytes=5  hex=636166c3a9  roundtrip=True
na\\xefve     chars=5  utf8_bytes=6  hex=6e61c3af7665  roundtrip=True
\\u20ac10     chars=3  utf8_bytes=5  hex=e282ac3130  roundtrip=True
\\U0001f600   chars=1  utf8_bytes=4  hex=f09f9880  roundtrip=True
euro in utf-8:   e282ac
euro in utf-16:  ac20
euro in latin-1: UnicodeEncodeError (latin-1 has no euro sign)
`,
        explain: 'For pure ASCII (`"hello"`) character count equals byte count. `"café"` is 4 characters but 5 UTF-8 bytes because `é` takes 2. `"😀"` is a single character but 4 bytes. The euro sign is 3 bytes in UTF-8, 2 in UTF-16, and cannot be encoded in Latin-1 at all — `UnicodeEncodeError`. `roundtrip=True` confirms UTF-8 is lossless. The text column is shown via `unicode_escape` (`caf\xe9` renders `café`) so the printed output stays ASCII.',
        explainHi: 'Shuddh ASCII (`"hello"`) ke liye character count byte count ke barabar hai. `"café"` 4 characters hai par 5 UTF-8 bytes kyunki `é` 2 leta hai. `"😀"` ek akela character hai par 4 bytes. Euro sign UTF-8 mein 3 bytes hai, UTF-16 mein 2, aur Latin-1 mein bilkul encode nahi ho sakta. `b.decode("utf-8") == s` confirm karता hai ki UTF-8 losslessly round-trip karता hai.',
      },
      {
        title: 'UnicodeDecodeError and the errors= parameter',
        titleHi: 'UnicodeDecodeError aur errors= parameter',
        code: `# "resume" with acute accents, written in latin-1, then wrongly read as utf-8:
latin1_bytes = "r\u00e9sum\u00e9".encode("latin-1")
print("bytes:", latin1_bytes.hex())

try:
    latin1_bytes.decode("utf-8")
except UnicodeDecodeError as e:
    print(f"strict decode failed: {e.reason} at byte {e.start}")

esc = lambda t: t.encode("unicode_escape").decode("ascii")   # ASCII-safe view
print("decode(replace):", esc(latin1_bytes.decode("utf-8", errors="replace")))
print("decode(ignore): ", esc(latin1_bytes.decode("utf-8", errors="ignore")))
print("decode(latin-1):", esc(latin1_bytes.decode("latin-1")))   # the CORRECT encoding

# encoding errors too:
try:
    "\u20ac".encode("ascii")
except UnicodeEncodeError as e:
    print(f"encode failed: {e.reason}")
print("encode(backslashreplace):", "cafe \u20ac".encode("ascii", errors="backslashreplace"))`,
        output: `bytes: 72e973756de9
strict decode failed: invalid continuation byte at byte 1
decode(replace): r\\ufffdsum\\ufffd
decode(ignore):  rsum
decode(latin-1): r\\xe9sum\\xe9
encode failed: ordinal not in range(128)
encode(backslashreplace): b'cafe \\\\u20ac'
`,
        explain: 'The Latin-1 bytes for `é` (`0xe9`) are not a valid UTF-8 sequence, so `decode("utf-8")` raises `UnicodeDecodeError` pointing at the offending byte. `errors="replace"` substitutes U+FFFD (`\\ufffd`) for each bad byte; `errors="ignore"` drops them (losing the `é`s entirely); `decode("latin-1")` — the encoding that actually produced the bytes — recovers the text perfectly. On the encode side, `errors="backslashreplace"` emits `\\xe9`/`\\u20ac` escape text instead of raising.',
        explainHi: '`é` (`0xe9`) ke Latin-1 bytes ek valid UTF-8 sequence nahi hain, isliye `decode("utf-8")` `UnicodeDecodeError` raise karता hai. `errors="replace"` har kharaab byte ke liye U+FFFD substitute karता hai; `errors="ignore"` unhe girata hai; `decode("latin-1")` — wo encoding jisne asal mein bytes banaye — text ko poori tarah recover karता hai.',
      },
      {
        title: 'bytes vs str: indexing, methods, and the file-mode boundary',
        titleHi: 'bytes vs str: indexing, methods, aur file-mode boundary',
        code: `import tempfile, os

data = b"Hello, World"
print("data[0]:", data[0], "(an int)")
print("data[0:1]:", data[0:1], "(bytes)")
print("list(data)[:5]:", list(data)[:5])
print("data.lower():", data.lower())
print("data.split(b', '):", data.split(b", "))

# str + bytes is an error:
try:
    "a" + b"b"
except TypeError as e:
    print("str + bytes:", e)

# write text (encoded) and binary, read both back:
d = tempfile.mkdtemp()
tp = os.path.join(d, "t.txt")
with open(tp, "w", encoding="utf-8", newline="\\n") as f:
    f.write("caf\\u00e9\\n")                  # text mode: give it str
with open(tp, "rb") as f:
    raw = f.read()
print("raw bytes on disk (hex):", raw.hex())
with open(tp, "r", encoding="utf-8") as f:
    print("decoded text matches:", f.read() == "caf\\u00e9\\n")`,
        output: `data[0]: 72 (an int)
data[0:1]: b'H' (bytes)
list(data)[:5]: [72, 101, 108, 108, 111]
data.lower(): b'hello, world'
data.split(b', '): [b'Hello', b'World']
str + bytes: can only concatenate str (not "bytes") to str
raw bytes on disk (hex): 636166c3a90a
decoded text matches: True
`,
        explain: 'Indexing `bytes` gives an `int` (72), but slicing gives `bytes` (`b\'H\'`) — a common surprise. `bytes` has ASCII-oriented `str`-like methods (`lower`, `split` with bytes arguments). `"a" + b"b"` is a `TypeError`. Writing in text mode with `encoding="utf-8"` stores `café` as the 5 bytes `caf\\xc3\\xa9`; reading in binary mode shows those raw bytes, reading in text mode decodes them back to `str`.',
        explainHi: '`bytes` index karna ek `int` (72) deता hai, par slice karna `bytes` (`b\'H\'`) deता hai — ek aam aashcharya. `bytes` mein ASCII-oriented `str`-jaisी methods hain. `"a" + b"b"` ek `TypeError` hai. `encoding="utf-8"` ke saath text mode mein likhna `café` ko 5 bytes `caf\\xc3\\xa9` ki tarah store karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `with open("config.yaml") as f:      # no encoding -> platform default
    data = f.read()
# works on your Mac/Linux (utf-8), UnicodeDecodeError on a Windows box (cp1252)`,
        right: `with open("config.yaml", encoding="utf-8") as f:
    data = f.read()`,
        why: 'Without `encoding=`, `open()` in text mode uses `locale.getpreferredencoding()`, which is UTF-8 on most Linux/macOS but `cp1252` on Windows. A file with any non-ASCII byte then decodes fine on one machine and raises `UnicodeDecodeError` on another. Always pass `encoding="utf-8"` explicitly (until it becomes the default in 3.15).',
        whyHi: '`encoding=` ke bina, text mode mein `open()` `locale.getpreferredencoding()` istemal karता hai, jo adhikaansh Linux/macOS par UTF-8 hai par Windows par `cp1252`. Kisi bhi non-ASCII byte waali ek file phir ek machine par theek decode hoती hai aur doosri par `UnicodeDecodeError` raise karती hai.',
      },
      {
        wrong: `token = hashlib.sha256(password).hexdigest()   # password is a str
# TypeError: Strings must be encoded before hashing`,
        right: `token = hashlib.sha256(password.encode("utf-8")).hexdigest()`,
        why: '`hashlib`, `hmac`, sockets, `zlib`, and most byte-oriented APIs require `bytes`, not `str`. You must `.encode("utf-8")` the text at the boundary. The error message ("must be encoded before hashing", "a bytes-like object is required") is telling you exactly this.',
        whyHi: '`hashlib`, `hmac`, sockets, aur adhikaansh byte-oriented APIs `bytes` chahते hain, `str` nahi. Aapko boundary par text ko `.encode("utf-8")` karna hoga. Error message aapko bilkul ye bata raha hai.',
      },
      {
        wrong: `# trying to "fix" mojibake by re-decoding:
text = raw.decode("utf-8", errors="ignore")   # silently drops characters
# now 'café' is 'caf' and you have lost data with no error`,
        right: `# find the ACTUAL encoding (from a spec, header, or BOM) and decode once:
text = raw.decode("latin-1")     # or "cp1252", "utf-16", per the source
# use errors="replace"/"ignore" only when you truly cannot control the input`,
        why: '`errors="ignore"` and `errors="replace"` are lossy — they silently corrupt or drop data to avoid a crash. That is acceptable only as a last resort for untrusted input you cannot fix. If you know (or can find out) the real encoding, decode with that once and the text is exact.',
        whyHi: '`errors="ignore"` aur `errors="replace"` lossy hain — wo ek crash se bachne ko chupchaap data corrupt ya drop karते hain. Wo sirf untrusted input ke liye ek last resort ke roop mein sweekaarya hai jise aap theek nahi kar sakte. Agar aap asli encoding jaanते ho, us se ek baar decode karो.',
      },
    ],

    realWorld: [
      {
        en: '**`open(path, encoding="utf-8")` everywhere is a hard rule in cross-platform Python** — CI on Linux passes, a Windows developer or a Windows CI runner hits `UnicodeDecodeError` on the same file. `ruff` rule `PLW1514` / `flake8-encodings` flag `open()` calls with no encoding.',
        hi: '**Har jagah `open(path, encoding="utf-8")` cross-platform Python mein ek sakht niyam hai** — Linux par CI pass hota hai, ek Windows developer usi file par `UnicodeDecodeError` hit karता hai. `ruff` rule `PLW1514` bina encoding ke `open()` calls flag karता hai.',
      },
      {
        en: '**Django stores `str` and handles the boundary for you** — request bodies are decoded (using the charset from `Content-Type`), template output is encoded to the response charset, the ORM decodes DB text columns. You work in `str`; the `bytes` boundary is at the WSGI/ASGI layer and the DB driver. But `request.body` is `bytes` (raw), and file uploads are `bytes`.',
        hi: '**Django `str` store karता hai aur boundary aapke liye handle karता hai** — request bodies decode hoती hain, template output response charset mein encode hota hai. Aap `str` mein kaam karते ho. Par `request.body` `bytes` hai (raw), aur file uploads `bytes` hain.',
      },
      {
        en: '**`subprocess`, `requests`, and socket code all hand you `bytes`** — `subprocess.run(..., text=True)` or `.stdout.decode()`, `requests` gives `.content` (bytes) and `.text` (str, with a guessed encoding), `sock.recv()` is bytes. Decode at that boundary; never pass raw bytes deeper into your logic.',
        hi: '**`subprocess`, `requests`, aur socket code sab aapko `bytes` deते hain** — `subprocess.run(..., text=True)` ya `.stdout.decode()`, `requests` `.content` (bytes) aur `.text` (str) deता hai, `sock.recv()` bytes hai. Us boundary par decode karो.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between `str` and `bytes` in Python 3, and how do you convert between them?',
        qHi: 'Python 3 mein `str` aur `bytes` mein kya antar hai, aur aap unke beech kaise convert karते ho?',
        a: 'str is a sequence of Unicode code points — it represents abstract text, a series of characters, with no inherent binary form. Its length is the number of characters. bytes is a sequence of integers each between zero and 255 — it represents raw octets, the actual data that goes over a wire or onto a disk. Its length is the number of bytes. They are distinct types and Python 3 deliberately does not implicitly convert between them: concatenating a str and a bytes, or comparing them, is a TypeError. To convert, you use encode and decode, and every conversion requires naming an encoding, which is the scheme that maps code points to byte sequences. str dot encode of an encoding produces bytes: this is what you do when text is leaving your program — being written to a file opened in binary mode, sent over a socket, passed to a hashing function, handed to a subprocess. bytes dot decode of an encoding produces str: this is what you do when bytes enter your program — read from a binary file, received from the network, returned by a subprocess. The encoding matters enormously. UTF-8 is the one you should use unless a specification says otherwise: it is backwards compatible with ASCII, it can represent every Unicode character, and it has no byte-order ambiguity. The failure modes are: encoding a character the target encoding cannot represent raises UnicodeEncodeError, for example a euro sign into Latin-1; and decoding bytes that are not valid in the assumed encoding raises UnicodeDecodeError, for example Latin-1 bytes decoded as UTF-8. There is an errors parameter on both — strict is the default and raises, replace substitutes a placeholder character, ignore drops the bad bytes, backslashreplace emits escape sequences — but replace and ignore are lossy and should only be used when you genuinely cannot determine or control the correct encoding. The design principle is to decode at the boundary where bytes come in, encode at the boundary where text goes out, and keep everything in between as str.',
        aHi: 'str Unicode code points ka ek sequence hai — ye abstract text represent karता hai, characters ki ek shृंkhला, bina koi antargat binary form. Iski length characters ki sankhya hai. bytes integers ka ek sequence hai har ek shoonya aur 255 ke beech — ye raw octets represent karता hai, wo asal data jo ek wire par ya ek disk par jाता hai. Wo alag types hain aur Python 3 jaan-boojhkar unke beech implicitly convert nahi karता. Convert karne ko, aap encode aur decode istemal karते ho, aur har conversion ko ek encoding naam dena chahiye. str dot encode of an encoding bytes banाता hai: ye aap tab karते ho jab text aapke program se ja raha hai. bytes dot decode of an encoding str banाता hai: ye aap tab karते ho jab bytes aapke program mein aa rahे hain. UTF-8 wo hai jise aapko istemal karna chahiye. Failure modes: ek character encode karna jise target encoding represent nahi kar sakti UnicodeEncodeError raise karता hai; aur bytes decode karna jo maani gayi encoding mein valid nahi hain UnicodeDecodeError raise karता hai. Design siddhaant boundary par decode karna, boundary par encode karna, aur beech mein sab kuch str rakhna hai.',
      },
      {
        q: 'Why do you get `UnicodeDecodeError` on one machine but not another, and how do you fix it properly?',
        qHi: 'Aapko ek machine par `UnicodeDecodeError` kyun milता hai par doosri par nahi, aur aap ise thik se kaise theek karते ho?',
        a: 'The usual cause is that open, in text mode, without an explicit encoding argument, uses the platform default encoding, which is not the same everywhere. On most modern Linux and macOS systems the default is UTF-8. On Windows it has historically been a legacy code page, commonly cp1252 for Western European locales. So the same file — say a JSON or YAML config containing an accented character or a smart quote, encoded as UTF-8 — is read correctly on the Linux machine, because the default matches, and raises UnicodeDecodeError on the Windows machine, because Python tries to interpret the multi-byte UTF-8 sequence as cp1252 and hits a byte that is not valid there. It can also flip the other way, or differ between two developers, or between a developer\'s machine and CI, or between CI and production. The improper fixes are to add errors equals ignore or errors equals replace, which stop the crash but silently corrupt the text, or to guess an encoding that happens to not raise, like Latin-1, which never raises on decode but produces wrong characters for anything non-ASCII. The proper fix is to always pass encoding equals utf-8 explicitly to every open call in text mode, so the behaviour is identical on every platform and matches the encoding the files are actually saved in, which for essentially all modern text files is UTF-8. If a file genuinely is in another encoding, find out which from its source — a spec, an HTTP Content-Type header, a byte-order mark, the tool that produced it — and pass that specific encoding. You can also set PYTHONUTF8 to 1 in the environment or pass the dash X utf8 interpreter flag to force UTF-8 mode process-wide, and Python 3.15 is scheduled to make UTF-8 the default for open, but explicit encoding arguments remain the portable, unambiguous approach and are enforced by linters.',
        aHi: 'Aam kaaran ye hai ki open, text mode mein, bina ek explicit encoding argument ke, platform default encoding istemal karता hai, jo har jagah ek jaisा nahi hai. Adhikaansh modern Linux aur macOS par default UTF-8 hai. Windows par ye aitihaasik roop se ek legacy code page raha hai, aam taur par Western European locales ke liye cp1252. Toh wahi file — maano ek JSON ya YAML config jismein ek accented character hai, UTF-8 ki tarah encoded — Linux machine par sahi padhी jाती hai aur Windows machine par UnicodeDecodeError raise karती hai. Improper fixes errors equals ignore ya replace jodना hain, jo crash rokते hain par chupchaap text corrupt karते hain. Proper fix hamesha har open call ko text mode mein encoding equals utf-8 spasht roop se pass karna hai. Agar ek file sachmuch doosri encoding mein hai, iske source se pata karो aur wo specific encoding pass karो.',
      },
    ],

    exercises: [
      {
        task: 'Write `analyze(s)` that prints `len(s)` (characters), `len(s.encode("utf-8"))` (UTF-8 bytes), `len(s.encode("utf-16-le"))`, and the UTF-8 hex. Run it on `"hi"`, `"café"`, `"日本語"`, `"\\U0001f680"`. Confirm `s.encode("utf-8").decode("utf-8") == s` each time.',
        taskHi: '`analyze(s)` likhо jo `len(s)` (characters), `len(s.encode("utf-8"))` (UTF-8 bytes), `len(s.encode("utf-16-le"))`, aur UTF-8 hex print kare. Ise `"hi"`, `"café"`, `"日本語"`, `"\\U0001f680"` par chalao. Har baar `s.encode("utf-8").decode("utf-8") == s` confirm karो.',
        hint: 'ASCII: chars == utf8 bytes. `"café"`: 4 chars, 5 utf8 bytes. `"日本語"`: 3 chars, 9 utf8 bytes (3 each). The rocket emoji: 1 char, 4 utf8 bytes. UTF-16-LE is 2 or 4 bytes per char.',
        hintHi: 'ASCII: chars == utf8 bytes. `"café"`: 4 chars, 5 utf8 bytes. `"日本語"`: 3 chars, 9 utf8 bytes. Rocket emoji: 1 char, 4 utf8 bytes.',
      },
      {
        task: 'Write `safe_read(path, *encodings)` that tries each encoding in order, returns `(text, encoding_used)` on the first that decodes without error, and raises `ValueError` if none work. Test by writing a file as `latin-1` and calling `safe_read(path, "utf-8", "latin-1")` — it should skip utf-8 and succeed on latin-1.',
        taskHi: '`safe_read(path, *encodings)` likhо jo har encoding ko kram mein try kare, pehli jo bina error decode kare uspar `(text, encoding_used)` lautाe, aur agar koi kaam na kare to `ValueError` raise kare. Ek file ko `latin-1` ki tarah likhकर aur `safe_read(path, "utf-8", "latin-1")` call karके test karो.',
        hint: 'Read the file in binary mode once (`open(path, "rb").read()`), then `for enc in encodings: try: return raw.decode(enc), enc except UnicodeDecodeError: continue`. `latin-1` decodes any byte sequence, so put it last as a fallback.',
        hintHi: 'File ko binary mode mein ek baar padhो (`open(path, "rb").read()`), phir `for enc in encodings: try: return raw.decode(enc), enc except UnicodeDecodeError: continue`. `latin-1` koi bhi byte sequence decode karता hai, isliye ise aakhri rakho.',
      },
      {
        task: 'Write `to_transport(obj)` that turns a dict into UTF-8 bytes ready for a socket (`json.dumps` then `.encode`), and `from_transport(data)` that reverses it (`.decode` then `json.loads`). Round-trip a dict containing a non-ASCII string value and assert it comes back equal. Then show that passing `str` to a function expecting `bytes` (simulate with `len(data) and data[0]` where `data` must be bytes -> int) behaves differently for `str` vs `bytes`.',
        taskHi: '`to_transport(obj)` likhо jo ek dict ko ek socket ke liye taiyaar UTF-8 bytes mein badalे, aur `from_transport(data)` jo ise ulta kare. Ek non-ASCII string value waale dict ko round-trip karो aur assert karो ye barabar wapas aata hai.',
        hint: '`to_transport`: `json.dumps(obj, ensure_ascii=False).encode("utf-8")`. `from_transport`: `json.loads(data.decode("utf-8"))`. `ensure_ascii=False` keeps non-ASCII as real UTF-8 bytes rather than `\\uXXXX` escapes. `data[0]` on bytes is an int; on str it is a 1-char str.',
        hintHi: '`to_transport`: `json.dumps(obj, ensure_ascii=False).encode("utf-8")`. `from_transport`: `json.loads(data.decode("utf-8"))`. `data[0]` bytes par ek int hai; str par ek 1-char str.',
      },
    ],

    keyTakeaways: [
      '`str` = a sequence of Unicode code points (abstract text; `len` = characters). `bytes` = a sequence of ints 0..255 (raw octets; `len` = bytes). Distinct types; Python 3 never converts implicitly.',
      '`str.encode(enc)` → `bytes` (text going OUT). `bytes.decode(enc)` → `str` (bytes coming IN). ALWAYS pass an explicit encoding — use `"utf-8"`.',
      'UTF-8: ASCII-compatible, represents every character, no byte order. A non-ASCII char is 2–4 bytes, so `len(str) != len(str.encode("utf-8"))` for non-ASCII.',
      '`UnicodeDecodeError` = the bytes are not valid in the encoding you named. `UnicodeEncodeError` = the encoding cannot represent that character. The real fix is the CORRECT encoding, not `errors="ignore"`.',
      '`errors=`: `"strict"` (default, raises), `"replace"` (U+FFFD), `"ignore"` (drops), `"backslashreplace"`. `replace`/`ignore` are LOSSY — last resort only.',
      '`open(path)` in text mode uses the PLATFORM default encoding (utf-8 on Linux/mac, cp1252 on Windows) — a portability bug. Always `open(path, encoding="utf-8")`. Binary mode (`"rb"`/`"wb"`) takes no encoding and gives `bytes`.',
      '`bytes` indexing gives an `int` (`b[0]` → `104`); slicing gives `bytes` (`b[0:1]` → `b\'h\'`). `bytes` has ASCII `str`-like methods and `%`-formatting, but NO f-strings.',
      'Decode at the boundary where bytes enter (file/socket/subprocess/HTTP); encode at the boundary where text leaves. `str` everywhere in between.',
    ],
    keyTakeawaysHi: [
      '`str` = Unicode code points ka ek sequence (abstract text; `len` = characters). `bytes` = ints 0..255 ka ek sequence (raw octets; `len` = bytes). Alag types; Python 3 kabhi implicitly convert nahi karता.',
      '`str.encode(enc)` → `bytes` (text BAAHAR jाता). `bytes.decode(enc)` → `str` (bytes ANDAR aaता). HAMESHA ek explicit encoding pass karो — `"utf-8"` istemal karो.',
      'UTF-8: ASCII-compatible, har character represent karता hai, koi byte order nahi. Ek non-ASCII char 2–4 bytes hai, isliye non-ASCII ke liye `len(str) != len(str.encode("utf-8"))`.',
      '`UnicodeDecodeError` = bytes aapki naami encoding mein valid nahi. `UnicodeEncodeError` = encoding us character ko represent nahi kar sakti. Asli fix SAHI encoding hai, `errors="ignore"` nahi.',
      '`errors=`: `"strict"` (default, raises), `"replace"` (U+FFFD), `"ignore"` (drops), `"backslashreplace"`. `replace`/`ignore` LOSSY hain — sirf last resort.',
      '`open(path)` text mode mein PLATFORM default encoding istemal karता hai (Linux/mac par utf-8, Windows par cp1252) — ek portability bug. Hamesha `open(path, encoding="utf-8")`. Binary mode (`"rb"`/`"wb"`) koi encoding nahi leta aur `bytes` deता hai.',
      '`bytes` index karna ek `int` deता hai (`b[0]` → `104`); slice karna `bytes` deता hai (`b[0:1]` → `b\'h\'`). `bytes` mein ASCII `str`-jaisी methods aur `%`-formatting hain, par KOI f-strings nahi.',
      'Us boundary par decode karो jahaan bytes aaते hain; us boundary par encode karो jahaan text jाता hai. Beech mein har jagah `str`.',
    ],
  },
];
