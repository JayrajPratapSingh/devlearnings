/**
 * Python Complete Course — Module 7: Strings, Text & Data Formats, lessons 4-6.
 *
 * Lesson 4: regular expressions with `re` — raw strings, `search`/`match`/
 *           `fullmatch`, groups + named groups, `findall` vs `finditer`, `sub`
 *           with a function, `compile`, flags, greedy vs lazy, and the pitfalls
 *           (`.` and newlines, anchors, catastrophic backtracking, when NOT to
 *           use regex at all).
 * Lesson 5: `json` — `dumps`/`loads`, `indent`/`sort_keys`/`ensure_ascii`, the
 *           type mapping (no tuples/sets/dates), `default=` for custom types,
 *           `object_hook`, `parse_float=Decimal`, `dump`/`load` for files, and
 *           why `json` is safe where `pickle`/`eval` are not.
 * Lesson 6: dates, times, and paths — `datetime`/`date`/`timedelta`, naive vs
 *           aware, `timezone.utc` / `zoneinfo`, `isoformat`/`fromisoformat` vs
 *           `strftime`/`strptime`, `time.time` vs `perf_counter` vs
 *           `monotonic`, and `pathlib.Path`.
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only. `examples` use `code` + `output`; run every
 * sample with `python`. Date examples pin explicit datetimes so output is
 * deterministic. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_7_PART2: CourseLesson[] = [
  {
    slug: 'py-regex-with-re',
    title: 'Regular Expressions with the re Module',
    titleHi: 're Module Ke Saath Regular Expressions',
    description: 'Writing a pattern like `"\\d+\\.\\d+"` as a normal string and finding the backslashes silently eaten before `re` ever sees them, or using `re.match` to look for a pattern in the middle of a line and getting `None` because `match` only anchors at the start. Regex is a small language for describing text shapes; `re` is Python\'s engine for it, and a handful of rules cover almost all real use.',
    descriptionHi: '`"\\d+\\.\\d+"` jaisा ek pattern ek normal string ki tarah likhna aur backslashes ko `re` ke dekhne se pehle hi chupchaap khaते dekhna, ya ek line ke beech mein ek pattern dhoondhne ko `re.match` istemal karna aur `None` paना kyunki `match` sirf shuruaat par anchor karता hai. Regex text shapes describe karne ki ek chhoti bhasha hai; `re` iske liye Python ka engine hai, aur mुthee bhar niyam lagbhag saara asli istemal cover karते hain.',
    difficulty: 'HARD',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A search request written in a stencil language, handed to a machine that reads stencils literally.** You want to find every "a date like 2026-08-31" in a document. You describe the shape with a stencil: "four digits, a dash, two digits, a dash, two digits". The stencil language has special marks — a dot means "any character", a plus means "one or more of the previous", brackets mean "any one from this set". Two things trip people up. First, the stencil has to reach the machine intact: if you write it as an ordinary Python string, Python interprets the backslashes first (turning `\\d` into something else or a warning) before the regex engine ever sees it — so you write the stencil as a *raw* string, `r"\\d+"`, which tells Python "hands off, pass these characters through untouched". Second, the machine has two modes of applying the stencil: `match` presses it against the very beginning of the text only, while `search` slides it along looking for the first spot it fits anywhere. Reaching for `match` when you mean `search` is the most common early mistake. Beyond that: parentheses in the stencil mark pieces you want to keep (capture groups), and the whole tool is worth reaching for only when the shape is genuinely irregular — for splitting on a fixed character or checking a prefix, the plain string methods are clearer and faster.',
      hi: '**Ek stencil bhasha mein likhi ek search request, ek machine ko di jo stencils ko literally padhती hai.** Aap ek document mein har "2026-08-31 jaisी date" dhoondhna chahте ho. Aap shape ko ek stencil se describe karते ho: "chaar digits, ek dash, do digits, ek dash, do digits". Stencil bhasha mein special marks hain — ek dot matlab "koi bhi character", ek plus matlab "pichhle ka ek ya zyaada". Do cheezein logon ko phasaती hain. Pehli, stencil machine tak intact pahunchना chahiye: agar aap ise ek saamaanya Python string ki tarah likhते ho, Python pehle backslashes interpret karता hai — isliye aap stencil ko ek *raw* string, `r"\\d+"` ki tarah likhते ho. Doosri, machine ke stencil lagaने ke do modes hain: `match` ise text ki bilkul shuruaat par dabाता hai, jabki `search` ise saraकर pehli jagah dhoondhता hai jahaan ye fit ho.',
    },

    simple: `**Always use a raw string for the pattern**

\`\`\`python
import re

re.search("\\d+", "abc123")       # works by luck (\\d is not a valid escape, kept as-is)
                                   # but "\\n", "\\t", "\\b" WOULD be mangled -> always r"..."
re.search(r"\\d+", "abc123")       # <re.Match object; span=(3, 6), match='123'>
\`\`\`

**\`search\` vs \`match\` vs \`fullmatch\`**

\`\`\`python
re.match(r"\\d+", "abc123")        # None  -- match anchors at the START of the string
re.match(r"\\d+", "123abc")        # matches '123'
re.search(r"\\d+", "abc123")       # matches '123'  -- search looks ANYWHERE
re.fullmatch(r"\\d+", "123")       # matches  -- the WHOLE string must match
re.fullmatch(r"\\d+", "123abc")    # None
\`\`\`

**Extracting: groups and named groups**

\`\`\`python
m = re.search(r"(\\d{4})-(\\d{2})-(\\d{2})", "date: 2026-08-31 ok")
m.group(0)            # '2026-08-31'  -- the whole match
m.group(1)            # '2026'
m.groups()            # ('2026', '08', '31')

m = re.search(r"(?P<y>\\d{4})-(?P<m>\\d{2})-(?P<d>\\d{2})", "2026-08-31")
m.group("y")          # '2026'
m.groupdict()         # {'y': '2026', 'm': '08', 'd': '31'}
\`\`\`

**Finding all matches; replacing**

\`\`\`python
re.findall(r"\\d+", "a1b22c333")            # ['1', '22', '333']   -- list of strings
re.findall(r"(\\w)=(\\d)", "a=1 b=2")       # [('a', '1'), ('b', '2')]  -- list of TUPLES if 2+ groups

for m in re.finditer(r"\\d+", "a1b22"):     # iterator of Match objects (with positions)
    print(m.group(), m.start())

re.sub(r"\\s+", " ", "a   b\\t c")          # 'a b c'   -- collapse whitespace
re.sub(r"(\\d+)", lambda m: str(int(m[1]) * 2), "a1 b2")   # 'a2 b4'  -- replace via function
\`\`\`

\`\`\`
r"..."          RAW STRING for every pattern. Python must not touch the backslashes.

re.search(p, s)     first match ANYWHERE   -> Match or None
re.match(p, s)      match only at the START -> Match or None
re.fullmatch(p, s)  the WHOLE string       -> Match or None
re.findall(p, s)    all matches as a list of strings (or tuples if 2+ groups)
re.finditer(p, s)   all matches as an iterator of Match objects (has .start()/.end())
re.sub(p, repl, s)  replace matches; repl can be a string (with \\1, \\g<name>) or a function
re.split(p, s)      split on the pattern
re.compile(p)       precompile a pattern used many times -> a Pattern object with the same methods

Match:  m.group(0) whole  |  m.group(n) / m.group("name")  |  m.groups()  |  m.groupdict()
        m.start() / m.end() / m.span()   |   m[1] is m.group(1)

FLAGS (2nd arg or (?i) inline): re.I ignorecase  re.M ^/$ per line  re.S . matches \\n
        re.X verbose (whitespace/comments in pattern ignored)

METACHARACTERS:  . any (not \\n)   \\d digit  \\w word  \\s space  (uppercase = negation)
        * 0+   + 1+   ? 0/1   {n} {n,} {n,m}   *? +? ?? = lazy (as few as possible)
        ^ start   $ end   \\b word boundary   [abc] set   [^abc] not-set   a|b alt
        (...) capture group   (?:...) non-capturing   (?P<name>...) named
\`\`\``,

    simpleHi: `**Pattern ke liye hamesha ek raw string istemal karो**

\`\`\`python
import re

re.search("\\d+", "abc123")       # kismat se kaam karता hai
re.search(r"\\d+", "abc123")       # <re.Match object; span=(3, 6), match='123'>
\`\`\`

**\`search\` vs \`match\` vs \`fullmatch\`**

\`\`\`python
re.match(r"\\d+", "abc123")        # None  -- match string ki SHURUAAT par anchor karता hai
re.match(r"\\d+", "123abc")        # '123' match karता hai
re.search(r"\\d+", "abc123")       # '123' match karता hai  -- search KAHIN BHI dekhता hai
re.fullmatch(r"\\d+", "123")       # match  -- POORI string match honi chahiye
re.fullmatch(r"\\d+", "123abc")    # None
\`\`\`

**Nikaalna: groups aur named groups**

\`\`\`python
m = re.search(r"(\\d{4})-(\\d{2})-(\\d{2})", "date: 2026-08-31 ok")
m.group(0)            # '2026-08-31'  -- poora match
m.group(1)            # '2026'
m.groups()            # ('2026', '08', '31')

m = re.search(r"(?P<y>\\d{4})-(?P<m>\\d{2})-(?P<d>\\d{2})", "2026-08-31")
m.group("y")          # '2026'
m.groupdict()         # {'y': '2026', 'm': '08', 'd': '31'}
\`\`\`

**Saare matches dhoondhna; replace**

\`\`\`python
re.findall(r"\\d+", "a1b22c333")            # ['1', '22', '333']   -- strings ki list
re.findall(r"(\\w)=(\\d)", "a=1 b=2")       # [('a', '1'), ('b', '2')]  -- 2+ groups to TUPLES ki list

for m in re.finditer(r"\\d+", "a1b22"):     # Match objects ka iterator
    print(m.group(), m.start())

re.sub(r"\\s+", " ", "a   b\\t c")          # 'a b c'   -- whitespace samेtो
re.sub(r"(\\d+)", lambda m: str(int(m[1]) * 2), "a1 b2")   # 'a2 b4'  -- function ke zariye replace
\`\`\`

\`\`\`
r"..."          har pattern ke liye RAW STRING. Python backslashes ko chhoona nahi chahiye.

re.search(p, s)     KAHIN BHI pehla match   -> Match ya None
re.match(p, s)      sirf SHURUAAT par match -> Match ya None
re.fullmatch(p, s)  POORI string           -> Match ya None
re.findall(p, s)    saare matches strings ki ek list ki tarah (ya tuples agar 2+ groups)
re.finditer(p, s)   saare matches Match objects ke iterator ki tarah
re.sub(p, repl, s)  matches replace karो; repl ek string (\\1, \\g<name> ke saath) ya ek function
re.split(p, s)      pattern par split
re.compile(p)       kai baar istemal hone waala pattern precompile karो

Match:  m.group(0) poora  |  m.group(n) / m.group("name")  |  m.groups()  |  m.groupdict()
        m.start() / m.end() / m.span()   |   m[1] is m.group(1)

FLAGS: re.I ignorecase  re.M ^/$ prati line  re.S . \\n match karता hai  re.X verbose

METACHARACTERS:  . koi bhi (\\n nahi)   \\d digit  \\w word  \\s space  (uppercase = negation)
        * 0+   + 1+   ? 0/1   {n} {n,} {n,m}   *? +? ?? = lazy
        ^ start   $ end   \\b word boundary   [abc] set   [^abc] not-set   a|b alt
        (...) capture group   (?:...) non-capturing   (?P<name>...) named
\`\`\``,

    content: `## Why raw strings

A regex uses backslashes for its own metacharacters (\`\\d\`, \`\\b\`, \`\\w\`, \`\\s\`, \`\\.\`). Python string literals *also* use backslashes for escapes (\`\\n\`, \`\\t\`, \`\\\\\`). Without a raw string, Python processes the escapes first and the regex engine gets the wrong thing:

\`\`\`python
"\\b"       # a backspace character (0x08), NOT a word boundary
r"\\b"      # the two characters backslash-b -> a word boundary to the regex engine
"\\d"       # kept as \\d today, but emits a SyntaxWarning (invalid escape sequence)
r"\\d"      # unambiguous
\`\`\`

**Rule: every regex pattern is \`r"..."\`.** No exceptions.

## Greedy vs lazy quantifiers

\`\`\`python
re.search(r"<.*>", "<a><b>").group()      # '<a><b>'  -- greedy: as much as possible
re.search(r"<.*?>", "<a><b>").group()     # '<a>'     -- lazy: as little as possible
re.findall(r"<.*?>", "<a><b>")            # ['<a>', '<b>']
\`\`\`

\`*\`, \`+\`, \`?\`, \`{n,m}\` are greedy by default — they grab the longest match, then back off only if the rest of the pattern fails. Add \`?\` (\`*?\`, \`+?\`) to make them lazy. For "everything up to the first X", lazy is usually what you want.

## The metacharacters that bite

\`\`\`python
# '.' does NOT match a newline by default:
re.search(r"a.b", "a\\nb")                 # None
re.search(r"a.b", "a\\nb", re.S)           # matches -- re.S makes '.' match everything

# '^' and '$' anchor the whole string by default; re.M makes them per-line:
re.findall(r"^\\d+", "1\\n2\\n3")            # ['1']
re.findall(r"^\\d+", "1\\n2\\n3", re.M)      # ['1', '2', '3']

# '$' also matches just before a trailing newline -- use \\Z for "absolute end":
re.search(r"abc$", "abc\\n")               # matches
re.search(r"abc\\Z", "abc\\n")             # None

# character classes: '-' is literal at the ends, special in the middle:
r"[a-z]"     # a range
r"[-az]"     # literal '-', 'a', 'z'
r"[.\\]]"    # inside [], most metacharacters are literal; still escape ] and \\
\`\`\`

## Compiling and reusing

\`\`\`python
DATE_RE = re.compile(r"(?P<y>\\d{4})-(?P<m>\\d{2})-(?P<d>\\d{2})")

for line in lines:
    m = DATE_RE.search(line)              # compiled pattern, same methods
    if m:
        ...
\`\`\`

Compile a pattern once at module load if you use it in a loop or across a codebase. \`re\` caches recent patterns internally, so for a one-off the difference is negligible, but a named compiled constant also documents intent.

## \`re.sub\` with a replacement function

\`\`\`python
def redact(m):
    return m.group(0)[:2] + "*" * (len(m.group(0)) - 2)

re.sub(r"\\b\\w{4,}\\b", redact, "the quick brown fox")   # 'the qu*** br*** fox'

# string replacements can reference groups:
re.sub(r"(\\d{4})-(\\d{2})-(\\d{2})", r"\\3/\\2/\\1", "2026-08-31")   # '31/08/2026'
re.sub(r"(?P<n>\\d+)", r"[\\g<n>]", "a1 b22")                        # 'a[1] b[22]'
\`\`\`

## Verbose mode for readable patterns

\`\`\`python
PHONE = re.compile(r"""
    (\\+\\d{1,3})?      # optional country code
    [\\s.-]?            # optional separator
    (\\d{3})            # area code
    [\\s.-]?
    (\\d{3,4})          # rest
""", re.X)
\`\`\`

\`re.X\` (verbose) ignores whitespace and \`#\` comments *in the pattern* (not in character classes or when escaped), so a complex pattern can be laid out and annotated.

## Catastrophic backtracking

\`\`\`python
# DANGEROUS: nested quantifiers over overlapping alternatives
re.match(r"(a+)+$", "aaaaaaaaaaaaaaaaaaaaaaaa!")   # can take exponential time
\`\`\`

Patterns like \`(a+)+\`, \`(a|a)*\`, \`(.*)*\` create ambiguity the engine explores by backtracking, and on a non-matching input the number of paths explodes. Keep quantifiers unambiguous, avoid nesting them, anchor where possible, and never run untrusted patterns against untrusted input.

## When NOT to use regex

\`\`\`python
# splitting on a fixed string:
"a,b,c".split(",")               # NOT re.split(r",", ...)
# checking a prefix/suffix:
name.startswith("test_")         # NOT re.match(r"test_", name)
# a fixed substring:
"error" in line                  # NOT re.search(r"error", line)
# parsing HTML/JSON/CSV/URLs:
# use html.parser / json / csv / urllib.parse -- regex cannot correctly parse nested structures
\`\`\`

Regex is for *irregular* text with a describable shape. For structured formats, use the real parser.`,

    contentHi: `## Raw strings kyun

Ek regex apne metacharacters ke liye backslashes istemal karता hai (\`\\d\`, \`\\b\`, \`\\w\`, \`\\s\`, \`\\.\`). Python string literals *bhi* escapes ke liye backslashes istemal karते hain (\`\\n\`, \`\\t\`, \`\\\\\`). Ek raw string ke bina, Python pehle escapes process karता hai:

\`\`\`python
"\\b"       # ek backspace character (0x08), ek word boundary NAHI
r"\\b"      # do characters backslash-b -> regex engine ko ek word boundary
"\\d"       # aaj \\d rakhा jाता hai, par ek SyntaxWarning emit karता hai
r"\\d"      # asandigdh nahi
\`\`\`

**Niyam: har regex pattern \`r"..."\` hai.** Koi apवाद nahi.

## Greedy vs lazy quantifiers

\`\`\`python
re.search(r"<.*>", "<a><b>").group()      # '<a><b>'  -- greedy: jitna ho sake zyaada
re.search(r"<.*?>", "<a><b>").group()     # '<a>'     -- lazy: jitna ho sake kam
re.findall(r"<.*?>", "<a><b>")            # ['<a>', '<b>']
\`\`\`

\`*\`, \`+\`, \`?\`, \`{n,m}\` default se greedy hain. Unhe lazy banane ko \`?\` (\`*?\`, \`+?\`) jodो. "Pehle X tak sab kuch" ke liye, lazy aam taur par jo aap chahте ho.

## Metacharacters jo kaatते hain

\`\`\`python
# '.' default se ek newline match NAHI karता:
re.search(r"a.b", "a\\nb")                 # None
re.search(r"a.b", "a\\nb", re.S)           # match -- re.S '.' ko sab kuch match karता hai

# '^' aur '$' default se poori string anchor karते hain; re.M unhe prati-line banाता hai:
re.findall(r"^\\d+", "1\\n2\\n3")            # ['1']
re.findall(r"^\\d+", "1\\n2\\n3", re.M)      # ['1', '2', '3']

# character classes: '-' ends par literal hai, beech mein special:
r"[a-z]"     # ek range
r"[-az]"     # literal '-', 'a', 'z'
\`\`\`

## Compile aur reuse

\`\`\`python
DATE_RE = re.compile(r"(?P<y>\\d{4})-(?P<m>\\d{2})-(?P<d>\\d{2})")

for line in lines:
    m = DATE_RE.search(line)              # compiled pattern, wahi methods
    if m:
        ...
\`\`\`

Ek pattern ek baar module load par compile karो agar aap ise ek loop mein istemal karते ho. \`re\` recent patterns internally cache karता hai.

## Replacement function ke saath \`re.sub\`

\`\`\`python
def redact(m):
    return m.group(0)[:2] + "*" * (len(m.group(0)) - 2)

re.sub(r"\\b\\w{4,}\\b", redact, "the quick brown fox")   # 'the qu*** br*** fox'

# string replacements groups reference kar sakte hain:
re.sub(r"(\\d{4})-(\\d{2})-(\\d{2})", r"\\3/\\2/\\1", "2026-08-31")   # '31/08/2026'
\`\`\`

## Padhne yogya patterns ke liye verbose mode

\`\`\`python
PHONE = re.compile(r"""
    (\\+\\d{1,3})?      # vaikalpik country code
    [\\s.-]?            # vaikalpik separator
    (\\d{3})            # area code
    [\\s.-]?
    (\\d{3,4})          # baaki
""", re.X)
\`\`\`

\`re.X\` (verbose) *pattern mein* whitespace aur \`#\` comments ignore karता hai.

## Catastrophic backtracking

\`\`\`python
# KHATARNAK: overlapping alternatives par nested quantifiers
re.match(r"(a+)+$", "aaaaaaaaaaaaaaaaaaaaaaaa!")   # exponential samay le sakta hai
\`\`\`

\`(a+)+\`, \`(a|a)*\`, \`(.*)*\` jaise patterns ambiguity banaते hain jise engine backtracking se explore karता hai. Quantifiers asandigdh rakho, unhe nest karne se bचो, jahaan ho sake anchor karो, aur kabhi untrusted patterns untrusted input ke khilaaf mat chalao.

## Regex kab istemal NA karें

\`\`\`python
# ek fixed string par splitting:
"a,b,c".split(",")               # re.split(r",", ...) NAHI
# ek prefix/suffix check karna:
name.startswith("test_")         # re.match(r"test_", name) NAHI
# ek fixed substring:
"error" in line                  # re.search(r"error", line) NAHI
# HTML/JSON/CSV/URLs parse karna:
# html.parser / json / csv / urllib.parse istemal karो -- regex nested structures sahi parse nahi kar sakta
\`\`\`

Regex *irregular* text ke liye hai jiska ek describable shape hai. Structured formats ke liye, asli parser istemal karो.`,

    examples: [
      {
        title: 'search vs match vs fullmatch, and raw strings',
        titleHi: 'search vs match vs fullmatch, aur raw strings',
        code: `import re

text = "order 42 shipped on 2026-08-31"

print("search:   ", re.search(r"\\d+", text).group())        # first digits anywhere
print("match:    ", re.match(r"\\d+", text))                  # None -- 'order' is first
print("match2:   ", re.match(r"\\w+", text).group())          # 'order' -- anchored at start
print("fullmatch:", re.fullmatch(r"[\\w\\s:-]+", text) is not None)  # whole string?

# raw string vs not:
print("plain '\\\\b' is:", repr("\\b"))                        # a backspace char
print("raw   r'\\\\b' is:", repr(r"\\b"))                       # backslash + b
print("word boundary works:", re.findall(r"\\bcat\\b", "cat category cat.")) # ['cat', 'cat']`,
        output: `search:    42
match:     None
match2:    order
fullmatch: True
plain '\\b' is: '\\x08'
raw   r'\\b' is: '\\\\b'
word boundary works: ['cat', 'cat']`,
        explain: '`re.search` finds `42` anywhere; `re.match(r"\\d+", ...)` returns `None` because the string starts with `order`, not a digit; `re.match(r"\\w+", ...)` matches `order` because `\\w+` fits at position 0. `re.fullmatch` requires the entire string to match. `"\\b"` is a backspace control character (`\\x08`); only `r"\\b"` gives the regex engine the word-boundary metacharacter, which is why `\\bcat\\b` correctly skips `category`.',
        explainHi: '`re.search` `42` ko kahin bhi dhoondhता hai; `re.match(r"\\d+", ...)` `None` lautaता hai kyunki string `order` se shuru hoती hai; `re.match(r"\\w+", ...)` `order` match karता hai. `re.fullmatch` ko poori string match honi chahiye. `"\\b"` ek backspace control character (`\\x08`) hai; sirf `r"\\b"` regex engine ko word-boundary metacharacter deता hai.',
      },
      {
        title: 'Groups, named groups, findall vs finditer',
        titleHi: 'Groups, named groups, findall vs finditer',
        code: `import re

log = "2026-08-31 14:30:05 ERROR db timeout | 2026-08-31 14:30:07 WARN retry"

pat = re.compile(
    r"(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<time>\\d{2}:\\d{2}:\\d{2}) (?P<level>\\w+) (?P<msg>[^|]+)"
)

for m in pat.finditer(log):
    print(f"[{m['level']:5}] {m['time']} -> {m['msg'].strip()}")
    print("   groupdict:", {k: v.strip() if isinstance(v, str) else v
                            for k, v in m.groupdict().items() if k != 'msg'})

print("---")
# findall: strings if 0-1 groups, tuples if 2+
print("no groups:  ", re.findall(r"\\d{2}:\\d{2}", log))
print("one group:  ", re.findall(r"(\\d{4})-\\d{2}-\\d{2}", log))
print("two groups: ", re.findall(r"(\\w+) (retry|timeout)", log))`,
        output: `[ERROR] 14:30:05 -> db timeout
   groupdict: {'date': '2026-08-31', 'time': '14:30:05', 'level': 'ERROR'}
[WARN ] 14:30:07 -> retry
   groupdict: {'date': '2026-08-31', 'time': '14:30:07', 'level': 'WARN'}
---
no groups:   ['14:30', '14:30']
one group:   ['2026', '2026']
two groups:  [('db', 'timeout'), ('WARN', 'retry')]`,
        explain: '`finditer` yields `Match` objects you can index by group name (`m["level"]`) and call `.groupdict()` on. `findall` behaves by group count: no groups returns the full matches; one group returns that group\'s text; two or more groups returns a list of tuples. Named groups make the pattern self-documenting and the extraction readable.',
        explainHi: '`finditer` `Match` objects yield karता hai jinhe aap group name se index kar sakte ho (`m["level"]`). `findall` group count se vyavhaar karता hai: koi groups nahi to poore matches; ek group to us group ka text; do ya zyaada groups to tuples ki list. Named groups pattern ko self-documenting banaते hain.',
      },
      {
        title: 'sub with a function, greedy vs lazy, and re.M / re.S',
        titleHi: 'function ke saath sub, greedy vs lazy, aur re.M / re.S',
        code: `import re

# sub with a function: mask digits, keep last 4
def mask(m):
    d = m.group(0)
    return "*" * (len(d) - 4) + d[-4:]

print(re.sub(r"\\d{6,}", mask, "card 1234567890123456 exp 1226"))

# greedy vs lazy:
tag = "<b>bold</b> and <i>italic</i>"
print("greedy:", re.findall(r"<.*>", tag))
print("lazy:  ", re.findall(r"<.*?>", tag))

# re.M: ^ and $ per line
text = "10 apples\\n20 pears\\n30 plums"
print("no M:", re.findall(r"^\\d+", text))
print("re.M:", re.findall(r"^\\d+", text, re.M))

# re.S: . matches newline
block = "start\\nmiddle\\nend"
print("no S:", re.search(r"start.*end", block))
print("re.S:", re.search(r"start.*end", block, re.S).group().replace(chr(10), "|"))`,
        output: `card ************3456 exp 1226
greedy: ['<b>bold</b> and <i>italic</i>']
lazy:   ['<b>', '</b>', '<i>', '</i>']
no M: ['10']
re.M: ['10', '20', '30']
no S: None
re.S: start|middle|end`,
        explain: '`re.sub(r"\\d{6,}", mask, ...)` calls `mask` on each 6+ digit run; `exp 1226` is only 4 digits so it is untouched. `<.*>` greedily matches from the first `<` to the last `>` (the whole string); `<.*?>` lazily stops at the first `>`, giving each tag separately. `re.M` makes `^` match after each newline. `re.S` makes `.` match newlines too, so `start.*end` spans the block.',
        explainHi: '`re.sub(r"\\d{6,}", mask, ...)` har 6+ digit run par `mask` call karता hai; `exp 1226` sirf 4 digits hai isliye achhoota hai. `<.*>` greedily pehle `<` se aakhri `>` tak match karता hai; `<.*?>` lazily pehle `>` par ruकता hai. `re.M` `^` ko har newline ke baad match karता hai. `re.S` `.` ko newlines bhi match karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `pat = "\\d{3}-\\d{4}"          # plain string -> SyntaxWarning, fragile
re.search(pat, phone)`,
        right: `pat = r"\\d{3}-\\d{4}"         # raw string -- always
re.search(pat, phone)`,
        why: 'In a non-raw string, `\\d` currently survives (with a `SyntaxWarning: invalid escape sequence`), but `\\b`, `\\t`, `\\n`, `\\1` do not — they become control characters before `re` sees them, silently breaking the pattern. Making every pattern a raw string removes the entire class of bug.',
        whyHi: 'Ek non-raw string mein, `\\d` abhi bacha rehta hai (ek `SyntaxWarning` ke saath), par `\\b`, `\\t`, `\\n`, `\\1` nahi — wo `re` ke dekhne se pehle control characters ban jाते hain, chupchaap pattern todते hue. Har pattern ko ek raw string banana poore bug class ko hataता hai.',
      },
      {
        wrong: `if re.match(r"error", log_line):     # only matches if the line STARTS with 'error'
    handle_error()`,
        right: `if re.search(r"error", log_line):    # matches 'error' anywhere in the line
    handle_error()
# or, for a literal substring, no regex at all:
if "error" in log_line:
    handle_error()`,
        why: '`re.match` anchors at the start of the string — `re.match(r"error", "an error occurred")` is `None`. Use `re.search` to find a pattern anywhere. And for a fixed substring with no regex features, `"error" in line` is clearer and faster than any regex.',
        whyHi: '`re.match` string ki shuruaat par anchor karता hai — `re.match(r"error", "an error occurred")` `None` hai. Ek pattern ko kahin bhi dhoondhne ko `re.search` istemal karो. Aur bina regex features ke ek fixed substring ke liye, `"error" in line` kisi bhi regex se saaf aur tez hai.',
      },
      {
        wrong: `# "get the text between the first < and the first >"
re.search(r"<(.*)>", "<a> plain <b>").group(1)   # 'a> plain <b'  -- greedy!`,
        right: `re.search(r"<(.*?)>", "<a> plain <b>").group(1)   # 'a'  -- lazy, stops at first >`,
        why: 'Quantifiers (`*`, `+`) are greedy: `.*` matches as much as it can, so `<(.*)>` grabs from the first `<` all the way to the LAST `>`. Add `?` to make it lazy (`.*?`) so it stops at the first `>`. This is the single most common regex surprise.',
        whyHi: 'Quantifiers (`*`, `+`) greedy hain: `.*` jitna ho sake match karता hai, isliye `<(.*)>` pehle `<` se AAKHRI `>` tak pakadता hai. Ise lazy banane ko `?` jodो (`.*?`) taaki ye pehle `>` par ruके. Ye sabse aam regex aashcharya hai.',
      },
    ],

    realWorld: [
      {
        en: '**Django URL routing, `re_path`, form field validators, and `settings.ALLOWED_HOSTS` patterns are all regex** — compiled once at startup. A greedy `.*` in a URL pattern is a classic bug that swallows path segments you meant to capture separately.',
        hi: '**Django URL routing, `re_path`, form field validators, aur `settings.ALLOWED_HOSTS` patterns sab regex hain** — startup par ek baar compiled. Ek URL pattern mein ek greedy `.*` ek classic bug hai jo path segments nigal leता hai.',
      },
      {
        en: '**Log parsing, scraping semi-structured text, and validating formats (emails, phone numbers, SKUs, ISO dates) are the bread-and-butter uses** — always `re.compile` the pattern as a module constant, use named groups, and test against real messy samples including the ones that should NOT match.',
        hi: '**Log parsing, semi-structured text scraping, aur formats validate karna (emails, phone numbers, SKUs, ISO dates) roz-marra istemal hain** — hamesha pattern ko ek module constant ki tarah `re.compile` karो, named groups istemal karो, aur asli messy samples ke khilaaf test karो.',
      },
      {
        en: '**Catastrophic backtracking is a real DoS vector (ReDoS)** — a user-supplied string matched against a vulnerable pattern (`(a+)+`, `(\\w+\\s?)*`) can hang a request thread for seconds. Security scanners flag these; the `regex` third-party module and Go/Rust engines avoid it, but stdlib `re` does not.',
        hi: '**Catastrophic backtracking ek asli DoS vector (ReDoS) hai** — ek user-supplied string ek vulnerable pattern ke khilaaf matched ek request thread ko seconds ke liye hang kar sakti hai. Security scanners inhe flag karते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'Why must regex patterns be raw strings, and what is the difference between `re.match`, `re.search`, and `re.fullmatch`?',
        qHi: 'Regex patterns raw strings kyun hone chahiye, aur `re.match`, `re.search`, aur `re.fullmatch` mein kya antar hai?',
        a: 'Regular expressions use the backslash as their own escape and metacharacter introducer — backslash d for a digit, backslash b for a word boundary, backslash w for a word character, backslash dot for a literal dot, backslash one for a backreference. Python string literals also use the backslash for their own escape sequences — backslash n for newline, backslash t for tab, backslash backslash for a literal backslash. When you write a pattern as an ordinary string literal, Python processes its escape sequences first, before the string is ever handed to the re module. For some sequences that happen not to be valid Python escapes, like backslash d, the backslash currently survives but Python emits a SyntaxWarning and this is slated to become an error. For sequences that are valid Python escapes, like backslash b, backslash n, backslash t, Python converts them — backslash b becomes a single backspace control character, not the two characters the regex engine needs for a word boundary — and the pattern silently means something different from what you wrote. A raw string, written with an r prefix, tells Python to leave the backslashes completely alone, so the re module receives exactly the characters you typed. The rule is simply: every regex pattern is a raw string, no exceptions. As for the three matching functions: re dot match tries to match the pattern only at the very beginning of the string; if the string does not start with something the pattern matches, it returns None, even if the pattern would match later in the string. re dot search scans through the string and returns the first place the pattern matches anywhere. re dot fullmatch requires the entire string, from start to end, to be consumed by the pattern. The common mistake is using match when you mean search — match is only appropriate when you specifically want an anchored-at-start check, and even then, search with an explicit caret anchor is often clearer.',
        aHi: 'Regular expressions backslash ko apne escape aur metacharacter introducer ki tarah istemal karते hain — backslash d ek digit ke liye, backslash b ek word boundary ke liye. Python string literals bhi backslash ko apne escape sequences ke liye istemal karते hain — backslash n newline ke liye. Jab aap ek pattern ek saamaanya string literal ki tarah likhते ho, Python pehle iske escape sequences process karता hai. Backslash b jaise valid Python escapes ke liye, Python unhe convert karता hai — backslash b ek akela backspace control character ban jाता hai — aur pattern chupchaap kuch alag matlab rakhता hai. Ek raw string, r prefix ke saath, Python ko backslashes bilkul akela chhodne ko kehta hai. Niyam: har regex pattern ek raw string hai. Teen matching functions: re dot match sirf string ki bilkul shuruaat par match try karता hai; re dot search string ke through scan karता hai aur pehli jagah lautaता hai jahaan pattern kahin bhi match karता hai; re dot fullmatch ko poori string chahiye.',
      },
      {
        q: 'What is greedy vs lazy matching, and what is catastrophic backtracking?',
        qHi: 'Greedy vs lazy matching kya hai, aur catastrophic backtracking kya hai?',
        a: 'The repetition quantifiers — star for zero or more, plus for one or more, question mark for zero or one, and the brace forms — are greedy by default. A greedy quantifier consumes as many characters as it possibly can while still allowing the overall pattern to match. It grabs the maximum, then, if the rest of the pattern cannot match at that point, it gives characters back one at a time and retries. So the pattern less-than dot-star greater-than applied to a string with several angle-bracket tags matches from the first less-than all the way to the last greater-than, because dot-star greedily takes everything and only backs off the minimum needed to let the final greater-than match. Adding a question mark after the quantifier makes it lazy: it consumes as few characters as possible, matching the minimum first and only expanding if the rest of the pattern forces it. Less-than dot-star-question-mark greater-than stops at the first greater-than, which is what you usually want for "everything up to the first delimiter". Catastrophic backtracking is a pathological performance problem that arises when a pattern contains ambiguity that the backtracking engine must explore exhaustively. The classic shapes are a quantified group that itself contains a quantifier over the same characters, like open-paren a-plus close-paren plus, or alternation where both branches can match the same text, like open-paren a-or-a close-paren star. On input that ultimately fails to match — for example a long run of a characters followed by a character that breaks the pattern — the engine tries every possible way of partitioning the run between the inner and outer quantifiers, and the number of partitions grows exponentially with the length of the run. A pattern that matches instantly on valid input can hang for seconds or minutes on a crafted near-miss. This is exploitable: if user input is matched against a vulnerable pattern, an attacker can freeze a request thread, which is called ReDoS. The defenses are to keep quantifiers unambiguous, never nest a quantifier inside another quantified group over overlapping characters, anchor the pattern so failure is detected early, prefer possessive-style constructs or the third-party regex module which has protections, and never run a pattern you do not control against input you do not control.',
        aHi: 'Repetition quantifiers — star zero ya zyaada ke liye, plus ek ya zyaada ke liye, question mark zero ya ek ke liye — default se greedy hain. Ek greedy quantifier jitne characters ho sake consume karता hai jab tak overall pattern abhi bhi match kar sake. Ye maximum grab karता hai, phir, agar baaki pattern us bindu par match nahi kar sakta, ye ek-ek karके characters wapas deता hai. Ek question mark jodना ise lazy banाता hai: ye jitne kam characters ho sake consume karता hai. Catastrophic backtracking ek pathological performance samasya hai jo tab uthти hai jab ek pattern mein ambiguity hai jise backtracking engine ko exhaustively explore karna hoga. Classic shapes ek quantified group hain jismein khud usi characters par ek quantifier hai, jaise open-paren a-plus close-paren plus. Input par jo aakhirkar match nahi karता, engine run ko baantne ka har sambhav tarika try karता hai, aur partitions ki sankhya run ki lambaई ke saath exponentially badhती hai. Ye exploitable hai: agar user input ek vulnerable pattern ke khilaaf matched hai, ek attacker ek request thread freeze kar sakta hai, jise ReDoS kehte hain.',
      },
    ],

    exercises: [
      {
        task: 'Write `parse_kv(text)` for lines like `key1=val1; key2=val2; key3=val3`. Use `re.finditer` with named groups `(?P<k>\\w+)=(?P<v>[^;]+)` to return a dict. Test on the example (3 pairs), a single pair, and a line with spaces around the `=` and `;` (make the pattern tolerate optional whitespace).',
        taskHi: '`parse_kv(text)` likhо `key1=val1; key2=val2; key3=val3` jaisी lines ke liye. Named groups `(?P<k>\\w+)=(?P<v>[^;]+)` ke saath `re.finditer` istemal karके ek dict lautाओ. Example par test karो.',
        hint: 'Pattern: `r"(?P<k>\\w+)\\s*=\\s*(?P<v>[^;]+?)\\s*(?:;|$)"`. `\\s*` absorbs whitespace; `[^;]+?` is lazy so it does not swallow trailing spaces; `(?:;|$)` ends the pair. `{m["k"]: m["v"] for m in re.finditer(pat, text)}`.',
        hintHi: 'Pattern: `r"(?P<k>\\w+)\\s*=\\s*(?P<v>[^;]+?)\\s*(?:;|$)"`. `\\s*` whitespace absorb karता hai; `[^;]+?` lazy hai; `(?:;|$)` pair khatam karता hai.',
      },
      {
        task: 'Write `redact_emails(text)` that replaces every email with the first character, `***`, `@`, and the domain (`a***@example.com`). Use `re.sub` with a function and the pattern `r"\\b[\\w.+-]+@[\\w.-]+\\.\\w+\\b"`. Test on a paragraph with 2-3 emails and confirm non-email text is untouched.',
        taskHi: '`redact_emails(text)` likhо jo har email ko pehle character, `***`, `@`, aur domain (`a***@example.com`) se replace kare. Ek function aur pattern `r"\\b[\\w.+-]+@[\\w.-]+\\.\\w+\\b"` ke saath `re.sub` istemal karो.',
        hint: '`def r(m): local, _, domain = m.group(0).partition("@"); return f"{local[0]}***@{domain}"`. Then `re.sub(EMAIL_RE, r, text)`. The `\\b` anchors keep it from matching inside longer tokens.',
        hintHi: '`def r(m): local, _, domain = m.group(0).partition("@"); return f"{local[0]}***@{domain}"`. Phir `re.sub(EMAIL_RE, r, text)`.',
      },
      {
        task: 'Demonstrate greedy vs lazy AND `re.match` vs `re.search`: given `s = "[first] middle [last]"`, extract `"first"` (not `"first] middle [last"`) with a lazy group, then show `re.match(r"\\w+", s)` is `None` (starts with `[`) while `re.search(r"\\w+", s).group()` is `"first"`. Print all four results.',
        taskHi: 'Greedy vs lazy AUR `re.match` vs `re.search` dikhाओ: `s = "[first] middle [last]"` diya, ek lazy group se `"first"` nikaalो, phir dikhाओ `re.match(r"\\w+", s)` `None` hai jabki `re.search(r"\\w+", s).group()` `"first"` hai.',
        hint: '`re.search(r"\\[(.+?)\\]", s).group(1)` -> `"first"` (lazy). `re.search(r"\\[(.+)\\]", s).group(1)` -> `"first] middle [last"` (greedy). `re.match(r"\\w+", s)` is `None` because `s[0]` is `[`.',
        hintHi: '`re.search(r"\\[(.+?)\\]", s).group(1)` -> `"first"` (lazy). `re.search(r"\\[(.+)\\]", s).group(1)` -> `"first] middle [last"` (greedy). `re.match(r"\\w+", s)` `None` hai.',
      },
    ],

    keyTakeaways: [
      'Every regex pattern is a RAW string `r"..."`. Otherwise Python processes `\\b`, `\\n`, `\\t`, `\\1` as escapes before `re` sees them, silently changing the pattern.',
      '`re.search` matches ANYWHERE; `re.match` only at the START; `re.fullmatch` the WHOLE string. Using `match` when you mean `search` is the most common mistake.',
      'Quantifiers (`*` `+` `?` `{n,m}`) are GREEDY by default — they grab the longest match. Add `?` (`*?` `+?`) for LAZY (shortest). "Up to the first X" wants lazy.',
      '`findall`: returns a list of strings with 0-1 groups, a list of TUPLES with 2+ groups. `finditer`: returns an iterator of `Match` objects with `.start()`/`.end()`/`.groupdict()`.',
      'Groups: `m.group(0)` = whole match, `m.group(n)` / `m.group("name")` / `m[n]`, `m.groups()`, `m.groupdict()`. Use `(?P<name>...)` named groups for readability.',
      '`.` does NOT match newline (use `re.S`). `^`/`$` anchor the whole string (use `re.M` for per-line). `re.I` = ignorecase, `re.X` = verbose (whitespace/comments in pattern).',
      '`re.sub(pattern, repl, s)` — `repl` can be a string with `\\1`/`\\g<name>` backreferences OR a function taking the `Match`. `re.compile` a pattern used repeatedly.',
      'Do NOT use regex for: fixed splits (`str.split`), prefix checks (`str.startswith`), literal substrings (`in`), or parsing HTML/JSON/CSV/URLs (use the real parser). Avoid nested quantifiers (`(a+)+`) — catastrophic backtracking / ReDoS.',
    ],
    keyTakeawaysHi: [
      'Har regex pattern ek RAW string `r"..."` hai. Warna Python `\\b`, `\\n`, `\\t`, `\\1` ko `re` ke dekhne se pehle escapes ki tarah process karता hai, chupchaap pattern badalते hue.',
      '`re.search` KAHIN BHI match karता hai; `re.match` sirf SHURUAAT par; `re.fullmatch` POORI string. `search` ke matlab par `match` istemal karna sabse aam galti hai.',
      'Quantifiers (`*` `+` `?` `{n,m}`) default se GREEDY hain — wo sabse lamba match pakadते hain. LAZY (sabse chhota) ke liye `?` (`*?` `+?`) jodो. "Pehle X tak" lazy chahता hai.',
      '`findall`: 0-1 groups ke saath strings ki list, 2+ groups ke saath TUPLES ki list. `finditer`: `Match` objects ka iterator `.start()`/`.end()`/`.groupdict()` ke saath.',
      'Groups: `m.group(0)` = poora match, `m.group(n)` / `m.group("name")` / `m[n]`, `m.groups()`, `m.groupdict()`. Readability ke liye `(?P<name>...)` named groups istemal karो.',
      '`.` newline match NAHI karता (`re.S` istemal karो). `^`/`$` poori string anchor karते hain (`re.M` prati-line ke liye). `re.I` = ignorecase, `re.X` = verbose.',
      '`re.sub(pattern, repl, s)` — `repl` `\\1`/`\\g<name>` backreferences waali ek string YA `Match` lene waala ek function ho sakta hai. Baar-baar istemal hone waala pattern `re.compile` karो.',
      'Regex ISKE liye istemal MAT karो: fixed splits (`str.split`), prefix checks (`str.startswith`), literal substrings (`in`), ya HTML/JSON/CSV/URLs parse karna. Nested quantifiers (`(a+)+`) se bचो — catastrophic backtracking / ReDoS.',
    ],
  },

  {
    slug: 'py-json',
    title: 'JSON: dumps, loads, and the Type Mapping',
    titleHi: 'JSON: dumps, loads, Aur Type Mapping',
    description: 'Calling `json.dumps(data)` on a dict that contains a `datetime` or a `set` and getting `TypeError: Object of type datetime is not JSON serializable`, or loading a config and finding every number came back as `float` when you needed exact decimals. JSON has a fixed, small set of types; Python\'s `json` module maps to and from them, and the mismatches are predictable once you know the table.',
    descriptionHi: 'Ek dict par `json.dumps(data)` call karna jismein ek `datetime` ya ek `set` hai aur `TypeError: Object of type datetime is not JSON serializable` paना, ya ek config load karna aur paना ki har number `float` ki tarah wapas aaya jab aapko exact decimals chahiye the. JSON mein ek fixed, chhota types ka set hai; Python ka `json` module unke aur unse map karता hai, aur mismatches ek baar table jaanne par predictable hain.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 5,

    analogy: {
      en: '**Shipping goods through a customs system that only recognises six categories.** Your warehouse holds all sorts of things — dated documents, unique-item sets, precise-weight measurements, tuples of coordinates — but the international shipping form has exactly six boxes to tick: text, number, true/false, nothing, a list, or a labelled bundle (object). Anything that does not fit one of those six cannot cross the border as-is. A date has to be declared *as text* in an agreed format; a set of unique items has to be declared *as a list*; a precise decimal weight becomes *a number* and loses its exactness unless you specially arrange for it to be read back as a decimal. `json.dumps` is filling out the export form: for the standard six it is automatic, and for anything else you must supply a `default` function that says "when you hit one of these, here is how to write it as one of the six". `json.loads` is the import side: it reads the six categories back into Python types, and if you want a bundle to come back as something richer than a plain dict, you hook in an `object_hook` to reconstruct it. The border is also a trust boundary: `json` only ever produces those six inert types, so parsing hostile JSON is safe — unlike `pickle` or `eval`, which can execute code on the way in.',
      hi: '**Ek customs system ke through goods bhejना jo sirf chhah categories pehchaanता hai.** Aapke warehouse mein har tarah ki cheezein hain — dated documents, unique-item sets, precise-weight measurements — par international shipping form mein tick karne ke liye bilkul chhah boxes hain: text, number, true/false, kuch nahi, ek list, ya ek labelled bundle (object). Jo kuch un chhah mein se ek mein fit nahi hota border paar nahi kar sakta. Ek date ko ek sahmat format mein *text ki tarah* declare karna hoga; unique items ka ek set ek *list ki tarah* declare hoga; ek precise decimal weight *ek number* ban jाता hai aur apni exactness kho deता hai. `json.dumps` export form bharna hai: standard chhah ke liye ye automatic hai, aur baaki kisi bhi cheez ke liye aapko ek `default` function dena hoga. Border ek trust boundary bhi hai: `json` sirf wo chhah inert types banाता hai, isliye hostile JSON parse karna surakshit hai — `pickle` ya `eval` ke ulte.',
    },

    simple: `**The type mapping**

\`\`\`
Python              JSON            Python (after loads)
------              ----            --------------------
dict                object          dict
list, tuple         array           list        (tuples become lists!)
str                 string          str
int                 number          int
float               number          float
True / False        true / false    bool
None                null            None

set, frozenset      -- NOT serializable -- TypeError
bytes               -- NOT serializable -- TypeError
datetime, Decimal   -- NOT serializable -- TypeError
dict with non-str keys -> keys are coerced to strings
\`\`\`

**Basic use**

\`\`\`python
import json

data = {"name": "Ada", "tags": ["a", "b"], "active": True, "score": None}

s = json.dumps(data)                       # '{"name": "Ada", "tags": ["a", "b"], ...}'
s = json.dumps(data, indent=2)             # pretty-printed
s = json.dumps(data, sort_keys=True)       # keys in sorted order (stable output)
s = json.dumps(data, ensure_ascii=False)   # keep non-ASCII as real chars, not \\uXXXX

back = json.loads(s)                       # -> dict

# files:
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
with open("data.json", encoding="utf-8") as f:
    data = json.load(f)
\`\`\`

**Non-serializable types: \`default=\`**

\`\`\`python
from datetime import datetime, date
from decimal import Decimal

def to_json(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return str(obj)          # or float(obj) if you accept the precision loss
    if isinstance(obj, set):
        return sorted(obj)
    raise TypeError(f"not serializable: {type(obj).__name__}")

json.dumps({"when": datetime(2026, 8, 31), "amt": Decimal("9.99")}, default=to_json)
# '{"when": "2026-08-31T00:00:00", "amt": "9.99"}'
\`\`\`

**Reading numbers as Decimal**

\`\`\`python
json.loads('{"price": 9.99}')                          # {'price': 9.99}   (float)
json.loads('{"price": 9.99}', parse_float=Decimal)     # {'price': Decimal('9.99')}  (exact)
\`\`\`

\`\`\`
json.dumps(obj, ...)   Python obj  -> JSON str
    indent=N            pretty-print with N-space indent
    sort_keys=True      deterministic key order
    ensure_ascii=False  non-ASCII stays as characters (needs utf-8 output)
    default=fn          fn(obj) is called for any type json cannot handle; return
                        something json CAN handle, or raise TypeError
    separators=(",", ":")   compact output, no spaces

json.loads(s, ...)     JSON str -> Python obj
    parse_float=Decimal    numbers with a '.' become Decimal, not float
    parse_int=...           likewise for integers
    object_hook=fn          fn(dict) is called for every JSON object; return the
                            (possibly transformed) value to use

json.dump(obj, file) / json.load(file)   -- same, straight to/from a file object

SECURITY: json parses ONLY the 6 inert types -> safe on untrusted input.
          NEVER use pickle.loads or eval() on data you did not create.
\`\`\``,

    simpleHi: `**Type mapping**

\`\`\`
Python              JSON            Python (loads ke baad)
------              ----            ----------------------
dict                object          dict
list, tuple         array           list        (tuples lists ban jaते hain!)
str                 string          str
int                 number          int
float               number          float
True / False        true / false    bool
None                null            None

set, frozenset      -- serializable NAHI -- TypeError
bytes               -- serializable NAHI -- TypeError
datetime, Decimal   -- serializable NAHI -- TypeError
non-str keys waala dict -> keys strings mein coerce hoती hain
\`\`\`

**Basic istemal**

\`\`\`python
import json

data = {"name": "Ada", "tags": ["a", "b"], "active": True, "score": None}

s = json.dumps(data)                       # '{"name": "Ada", "tags": ["a", "b"], ...}'
s = json.dumps(data, indent=2)             # pretty-printed
s = json.dumps(data, sort_keys=True)       # sorted kram mein keys
s = json.dumps(data, ensure_ascii=False)   # non-ASCII asli chars ki tarah, \\uXXXX nahi

back = json.loads(s)                       # -> dict

# files:
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
with open("data.json", encoding="utf-8") as f:
    data = json.load(f)
\`\`\`

**Non-serializable types: \`default=\`**

\`\`\`python
from datetime import datetime, date
from decimal import Decimal

def to_json(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return str(obj)
    if isinstance(obj, set):
        return sorted(obj)
    raise TypeError(f"not serializable: {type(obj).__name__}")

json.dumps({"when": datetime(2026, 8, 31), "amt": Decimal("9.99")}, default=to_json)
# '{"when": "2026-08-31T00:00:00", "amt": "9.99"}'
\`\`\`

**Numbers ko Decimal ki tarah padhna**

\`\`\`python
json.loads('{"price": 9.99}')                          # {'price': 9.99}   (float)
json.loads('{"price": 9.99}', parse_float=Decimal)     # {'price': Decimal('9.99')}  (exact)
\`\`\`

\`\`\`
json.dumps(obj, ...)   Python obj  -> JSON str
    indent=N            N-space indent ke saath pretty-print
    sort_keys=True      deterministic key kram
    ensure_ascii=False  non-ASCII characters ki tarah rehta hai
    default=fn          fn(obj) kisi bhi type ke liye call jise json handle nahi kar sakta

json.loads(s, ...)     JSON str -> Python obj
    parse_float=Decimal    '.' waale numbers Decimal ban jाते hain, float nahi
    object_hook=fn          fn(dict) har JSON object ke liye call

json.dump(obj, file) / json.load(file)   -- same, seedhe ek file object se/ko

SECURITY: json sirf 6 inert types parse karता hai -> untrusted input par surakshit.
          KABHI pickle.loads ya eval() us data par istemal mat karो jo aapne nahi banaya.
\`\`\``,

    content: `## Serializing: \`dumps\` options that matter

\`\`\`python
data = {"b": 2, "a": 1, "note": "café"}

json.dumps(data)
# '{"b": 2, "a": 1, "note": "caf\\u00e9"}'          -- insertion order, non-ASCII escaped

json.dumps(data, sort_keys=True, indent=2)
# {
#   "a": 1,
#   "b": 2,
#   "note": "caf\\u00e9"
# }

json.dumps(data, ensure_ascii=False)
# '{"b": 2, "a": 1, "note": "café"}'                -- write with encoding="utf-8"

json.dumps(data, separators=(",", ":"))
# '{"b":2,"a":1,"note":"caf\\u00e9"}'                -- smallest output, for wire/storage
\`\`\`

- **\`sort_keys=True\`** makes output deterministic — essential for diffing, caching keys, or test snapshots.
- **\`ensure_ascii=False\`** keeps text readable and smaller, but the output must be written as UTF-8.
- **\`separators=(",", ":")\`** drops the default spaces for compact payloads.

## The tuple / set / key gotchas

\`\`\`python
json.loads(json.dumps((1, 2, 3)))        # [1, 2, 3]   -- tuple round-trips as a LIST
json.dumps({1: "a", 2: "b"})            # '{"1": "a", "2": "b"}'  -- int keys become str
json.loads('{"1": "a"}')                # {'1': 'a'}   -- and they stay str on the way back
json.dumps({(1, 2): "x"})              # TypeError -- tuple keys are not allowed at all
json.dumps({1, 2, 3})                  # TypeError -- sets need default=
\`\`\`

If your data structure relies on tuples-as-values or non-string dict keys, JSON will quietly change its shape. Decide on a canonical form before serializing.

## \`default=\` for custom / library types

\`\`\`python
import json
from dataclasses import dataclass, asdict, is_dataclass

@dataclass
class Point:
    x: int
    y: int

def encode(obj):
    if is_dataclass(obj):
        return asdict(obj)
    if hasattr(obj, "__dict__"):
        return vars(obj)
    raise TypeError(f"cannot serialize {type(obj).__name__}")

json.dumps({"p": Point(1, 2)}, default=encode)   # '{"p": {"x": 1, "y": 2}}'
\`\`\`

\`default\` is called only for values \`json\` cannot handle natively. Return a JSON-compatible value (usually a dict or list) or raise \`TypeError\` for anything you still cannot handle.

## \`object_hook\` for reconstructing on load

\`\`\`python
from datetime import datetime

def decode(d):
    if "__type__" in d and d["__type__"] == "datetime":
        return datetime.fromisoformat(d["value"])
    return d

raw = '{"created": {"__type__": "datetime", "value": "2026-08-31T14:30:00"}}'
json.loads(raw, object_hook=decode)   # {'created': datetime(2026, 8, 31, 14, 30)}
\`\`\`

\`object_hook\` runs for every JSON object (from the inside out). Pair it with a \`default\` that tags custom types so the round-trip is symmetric.

## \`parse_float\` / \`parse_int\` for numeric precision

\`\`\`python
from decimal import Decimal

# money must not go through binary float:
order = json.loads('{"total": 19.99, "qty": 3}', parse_float=Decimal)
order["total"]           # Decimal('19.99')  -- exact
order["qty"]             # 3                  -- parse_int not set, stays int

# and to write it back exactly:
json.dumps({"total": Decimal("19.99")}, default=str)   # '{"total": "19.99"}'
\`\`\`

## Security: \`json\` is safe, \`pickle\`/\`eval\` are not

\`\`\`python
json.loads(untrusted_string)     # SAFE -- only ever produces dict/list/str/int/float/bool/None

pickle.loads(untrusted_bytes)    # DANGEROUS -- can execute arbitrary code during unpickling
eval(untrusted_string)           # DANGEROUS -- runs the string as Python
yaml.load(untrusted, Loader=yaml.FullLoader)   # use yaml.safe_load instead
\`\`\`

For data that crosses a trust boundary (API bodies, config from users, message queues), use \`json\`. Never \`pickle\` or \`eval\` data you did not produce yourself.

## Errors

\`\`\`python
json.loads("{bad}")              # json.JSONDecodeError: Expecting property name ...
                                 #   -> e.pos, e.lineno, e.colno tell you where
json.dumps({1, 2})              # TypeError: Object of type set is not JSON serializable
\`\`\`

Catch \`json.JSONDecodeError\` (a subclass of \`ValueError\`) around \`loads\` of external input.`,

    contentHi: `## Serializing: \`dumps\` options jo maayne rakhती hain

\`\`\`python
data = {"b": 2, "a": 1, "note": "café"}

json.dumps(data)
# '{"b": 2, "a": 1, "note": "caf\\u00e9"}'          -- insertion kram, non-ASCII escaped

json.dumps(data, sort_keys=True, indent=2)
# a, b, note kram mein, indented

json.dumps(data, ensure_ascii=False)
# '{"b": 2, "a": 1, "note": "café"}'                -- encoding="utf-8" ke saath likhо

json.dumps(data, separators=(",", ":"))
# '{"b":2,"a":1,"note":"caf\\u00e9"}'                -- sabse chhota output
\`\`\`

- **\`sort_keys=True\`** output ko deterministic banाता hai — diffing, caching keys, ya test snapshots ke liye zaroori.
- **\`ensure_ascii=False\`** text ko readable aur chhota rakhता hai, par output UTF-8 ki tarah likha jाना chahiye.
- **\`separators=(",", ":")\`** compact payloads ke liye default spaces girata hai.

## tuple / set / key gotchas

\`\`\`python
json.loads(json.dumps((1, 2, 3)))        # [1, 2, 3]   -- tuple ek LIST ki tarah round-trip
json.dumps({1: "a", 2: "b"})            # '{"1": "a", "2": "b"}'  -- int keys str ban jाते hain
json.dumps({(1, 2): "x"})              # TypeError -- tuple keys bilkul allowed nahi
json.dumps({1, 2, 3})                  # TypeError -- sets ko default= chahiye
\`\`\`

Agar aapki data structure tuples-as-values ya non-string dict keys par nirbhar karती hai, JSON chupchaap iska shape badal dega.

## Custom / library types ke liye \`default=\`

\`\`\`python
import json
from dataclasses import asdict, is_dataclass

def encode(obj):
    if is_dataclass(obj):
        return asdict(obj)
    if hasattr(obj, "__dict__"):
        return vars(obj)
    raise TypeError(f"cannot serialize {type(obj).__name__}")

json.dumps({"p": Point(1, 2)}, default=encode)   # '{"p": {"x": 1, "y": 2}}'
\`\`\`

\`default\` sirf un values ke liye call hota hai jinhe \`json\` natively handle nahi kar sakta. Ek JSON-compatible value lautाओ ya \`TypeError\` raise karो.

## Load par reconstruct karne ko \`object_hook\`

\`\`\`python
from datetime import datetime

def decode(d):
    if d.get("__type__") == "datetime":
        return datetime.fromisoformat(d["value"])
    return d

raw = '{"created": {"__type__": "datetime", "value": "2026-08-31T14:30:00"}}'
json.loads(raw, object_hook=decode)   # {'created': datetime(2026, 8, 31, 14, 30)}
\`\`\`

\`object_hook\` har JSON object ke liye chalता hai. Ise ek \`default\` ke saath jodो jo custom types ko tag kare.

## Numeric precision ke liye \`parse_float\` / \`parse_int\`

\`\`\`python
from decimal import Decimal

# paise ko binary float se nahi guzarna chahiye:
order = json.loads('{"total": 19.99, "qty": 3}', parse_float=Decimal)
order["total"]           # Decimal('19.99')  -- exact
\`\`\`

## Security: \`json\` surakshit hai, \`pickle\`/\`eval\` nahi

\`\`\`python
json.loads(untrusted_string)     # SURAKSHIT -- sirf dict/list/str/int/float/bool/None banाता hai

pickle.loads(untrusted_bytes)    # KHATARNAK -- unpickling ke dauraan arbitrary code chalा sakta hai
eval(untrusted_string)           # KHATARNAK -- string ko Python ki tarah chalाता hai
yaml.load(...)                   # yaml.safe_load istemal karो
\`\`\`

Ek trust boundary paar karne waale data ke liye, \`json\` istemal karो. Kabhi \`pickle\` ya \`eval\` us data par nahi jo aapne khud nahi banaya.

## Errors

\`\`\`python
json.loads("{bad}")              # json.JSONDecodeError: Expecting property name ...
json.dumps({1, 2})              # TypeError: Object of type set is not JSON serializable
\`\`\`

External input ke \`loads\` ke aas-paas \`json.JSONDecodeError\` (\`ValueError\` ka ek subclass) pakdो.`,

    examples: [
      {
        title: 'The type mapping and the tuple/set/key gotchas',
        titleHi: 'Type mapping aur tuple/set/key gotchas',
        code: `import json

original = {
    "list": [1, 2, 3],
    "tuple": (4, 5, 6),
    "nested": {"a": True, "b": None},
    "int": 7,
    "float": 3.14,
}

s = json.dumps(original)
back = json.loads(s)

print("tuple became:", type(back["tuple"]).__name__, back["tuple"])
print("equal?", original == back)      # False -- tuple != list

# non-string keys are coerced:
print(json.dumps({1: "a", True: "b", 2.5: "c"}))

# these raise:
for bad in [{1, 2, 3}, b"bytes", {(1, 2): "k"}]:
    try:
        json.dumps({"x": bad})
    except TypeError:
        print(f"{type(bad).__name__:10} -> TypeError")`,
        output: `tuple became: list [4, 5, 6]
equal? False
{"1": "b", "2.5": "c"}
set        -> TypeError
bytes      -> TypeError
dict       -> TypeError
`,
        explain: 'JSON has no tuple type, so `(4, 5, 6)` round-trips as a list and `original == back` is `False`. Non-string dict keys are coerced to strings. `{1: "a", True: "b", 2.5: "c"}` is really `{1: "b", 2.5: "c"}` before serialization — Python treats `1` and `True` as the same key and the later value wins — so the JSON is `{"1": "b", "2.5": "c"}`, no duplicate. `set` and `bytes` values, and a *tuple used as a dict key*, all raise `TypeError` from `dumps`. (A tuple used as a *value* serializes fine, as a JSON array.)',
        explainHi: 'JSON mein koi tuple type nahi, isliye `(4, 5, 6)` ek list ki tarah round-trip karता hai aur `original == back` `False` hai. Non-string dict keys strings mein coerce hoती hain — `1` aur `True` dono `"1"` ban jाते hain. `set` aur `bytes` bina `default=` ke reliably fail hote hain.',
      },
      {
        title: 'default= for datetime/Decimal/set, and round-tripping with object_hook',
        titleHi: 'datetime/Decimal/set ke liye default=, aur object_hook ke saath round-tripping',
        code: `import json
from datetime import datetime
from decimal import Decimal

def encode(obj):
    if isinstance(obj, datetime):
        return {"__t__": "dt", "v": obj.isoformat()}
    if isinstance(obj, Decimal):
        return {"__t__": "dec", "v": str(obj)}
    if isinstance(obj, set):
        return {"__t__": "set", "v": sorted(obj)}
    raise TypeError(type(obj).__name__)

def decode(d):
    t = d.get("__t__")
    if t == "dt":  return datetime.fromisoformat(d["v"])
    if t == "dec": return Decimal(d["v"])
    if t == "set": return set(d["v"])
    return d

data = {
    "created": datetime(2026, 8, 31, 14, 30),
    "price": Decimal("19.99"),
    "tags": {"python", "json"},
}

wire = json.dumps(data, default=encode)
print("wire:", wire)

restored = json.loads(wire, object_hook=decode)
print("created:", restored["created"], type(restored["created"]).__name__)
print("price:  ", restored["price"], type(restored["price"]).__name__)
print("tags:   ", restored["tags"] == data["tags"])`,
        output: `wire: {"created": {"__t__": "dt", "v": "2026-08-31T14:30:00"}, "price": {"__t__": "dec", "v": "19.99"}, "tags": {"__t__": "set", "v": ["json", "python"]}}
created: 2026-08-31 14:30:00 datetime
price:   19.99 Decimal
tags:    True`,
        explain: '`default=encode` is called for each non-JSON type and returns a tagged dict (`{"__t__": ..., "v": ...}`). On load, `object_hook=decode` sees every dict and reconstructs the original type when it recognises the tag. The tag makes the round-trip symmetric — `datetime` comes back as `datetime`, `Decimal` as `Decimal`, `set` as `set`.',
        explainHi: '`default=encode` har non-JSON type ke liye call hota hai aur ek tagged dict lautaता hai. Load par, `object_hook=decode` har dict dekhता hai aur tag pehchaanने par original type reconstruct karता hai. Tag round-trip ko symmetric banाता hai.',
      },
      {
        title: 'parse_float=Decimal, JSONDecodeError, and compact/pretty output',
        titleHi: 'parse_float=Decimal, JSONDecodeError, aur compact/pretty output',
        code: `import json
from decimal import Decimal

# float precision:
plain = json.loads('{"total": 0.1, "tax": 0.2}')
exact = json.loads('{"total": 0.1, "tax": 0.2}', parse_float=Decimal)
print("float sum: ", plain["total"] + plain["tax"])           # 0.30000000000000004
print("Decimal sum:", exact["total"] + exact["tax"])          # 0.3

# decode errors point at the location:
try:
    json.loads('{"a": 1, "b": }')
except json.JSONDecodeError as e:
    print(f"decode error at line {e.lineno} col {e.colno}: {e.msg}")

# output shapes:
obj = {"z": 1, "a": [1, 2], "m": {"k": "v"}}
print("compact:", json.dumps(obj, separators=(",", ":"), sort_keys=True))
print("pretty:")
print(json.dumps(obj, indent=2, sort_keys=True))`,
        output: `float sum:  0.30000000000000004
Decimal sum: 0.3
decode error at line 1 col 15: Expecting value
compact: {"a":[1,2],"m":{"k":"v"},"z":1}
pretty:
{
  "a": [
    1,
    2
  ],
  "m": {
    "k": "v"
  },
  "z": 1
}
`,
        explain: 'Default parsing turns `0.1` into a binary float, so `0.1 + 0.2` is `0.30000000000000004`; `parse_float=Decimal` keeps the exact decimal and the sum is `0.3`. `JSONDecodeError` (a `ValueError` subclass) carries `.lineno`, `.colno`, `.pos`, and `.msg` pointing at the syntax error. `separators=(",", ":")` gives the smallest output; `indent=2` gives readable output; `sort_keys=True` makes both deterministic.',
        explainHi: 'Default parsing `0.1` ko ek binary float banाता hai, isliye `0.1 + 0.2` `0.30000000000000004` hai; `parse_float=Decimal` exact decimal rakhता hai. `JSONDecodeError` mein `.lineno`, `.colno`, `.pos`, aur `.msg` hain. `separators=(",", ":")` sabse chhota output deता hai; `indent=2` readable; `sort_keys=True` dono ko deterministic banाता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `json.dumps({"created": datetime.now(), "amount": Decimal("9.99")})
# TypeError: Object of type datetime is not JSON serializable`,
        right: `def default(o):
    if isinstance(o, (datetime, date)):
        return o.isoformat()
    if isinstance(o, Decimal):
        return str(o)
    raise TypeError(type(o).__name__)

json.dumps(data, default=default)`,
        why: 'JSON only knows six types. `datetime`, `date`, `Decimal`, `set`, `bytes`, `UUID`, and every custom class raise `TypeError` from `dumps`. Supply a `default=` function that converts each to a JSON-native form (ISO string for dates, string for `Decimal`, list for `set`).',
        whyHi: 'JSON sirf chhah types jaanता hai. `datetime`, `Decimal`, `set`, `bytes`, `UUID`, aur har custom class `dumps` se `TypeError` raise karते hain. Ek `default=` function do jo har ek ko ek JSON-native form mein convert kare.',
      },
      {
        wrong: `config = json.load(open("prices.json"))
total = config["item"] * config["qty"]     # config["item"] is a float -> rounding errors on money`,
        right: `config = json.load(open("prices.json"), parse_float=Decimal)
total = config["item"] * config["qty"]     # Decimal arithmetic -- exact`,
        why: 'By default every JSON number with a decimal point becomes a binary `float`, which cannot represent most decimal fractions exactly — a problem for money and any exact-arithmetic domain. `parse_float=Decimal` makes those numbers `Decimal` instead. (Write them back with `default=str` or `default=float` deliberately.)',
        whyHi: 'Default se ek decimal point waala har JSON number ek binary `float` ban jाता hai, jo adhikaansh decimal fractions ko exactly represent nahi kar sakta — paison ke liye ek samasya. `parse_float=Decimal` un numbers ko `Decimal` banाता hai.',
      },
      {
        wrong: `data = pickle.loads(message_from_queue)     # or eval(payload) / yaml.load(...)`,
        right: `data = json.loads(message_from_queue)       # json only produces inert data
# or yaml.safe_load(...) if it must be YAML`,
        why: '`pickle.loads` can execute arbitrary code embedded in the byte stream, `eval` runs its argument as Python, and `yaml.load` (without `safe_load`) can instantiate arbitrary objects. Any of these on data from a queue, an API, a file a user can edit, or the network is a remote-code-execution vulnerability. `json.loads` can only ever produce dicts, lists, strings, numbers, booleans, and `None`.',
        whyHi: '`pickle.loads` byte stream mein embedded arbitrary code chalा sakta hai, `eval` apne argument ko Python ki tarah chalाता hai, aur `yaml.load` (bina `safe_load`) arbitrary objects instantiate kar sakta hai. Inmein se koi bhi ek queue, ek API, ya network se data par ek remote-code-execution vulnerability hai.',
      },
    ],

    realWorld: [
      {
        en: '**DRF serializers are `json` + validation + a type registry** — they convert `datetime` to ISO strings, `Decimal` to strings or numbers (configurable), model instances to dicts, exactly the `default=` pattern, plus the reverse on input. `JSONField` on a model stores `json.dumps` output.',
        hi: '**DRF serializers `json` + validation + ek type registry hain** — wo `datetime` ko ISO strings, `Decimal` ko strings ya numbers, model instances ko dicts mein convert karते hain, bilkul `default=` pattern, plus input par ulta.',
      },
      {
        en: '**`json.dumps(..., sort_keys=True, separators=(",", ":"))` is the canonical form for cache keys, ETags, webhook signatures, and idempotency keys** — you need the exact same bytes for the same logical payload, which insertion order and default spacing do not guarantee.',
        hi: '**`json.dumps(..., sort_keys=True, separators=(",", ":"))` cache keys, ETags, webhook signatures ke liye canonical form hai** — aapko usi logical payload ke liye bilkul wahi bytes chahiye.',
      },
      {
        en: '**The `pickle`/`eval` warning is real: `pickle` deserialization RCE is a recurring CVE class** — Celery with the pickle serializer, cached objects, session stores. The fix is always "use JSON (or msgpack) for anything that crosses a process or trust boundary".',
        hi: '**`pickle`/`eval` chetaavni asli hai: `pickle` deserialization RCE ek baar-baar aane waala CVE class hai** — pickle serializer waala Celery, cached objects, session stores. Fix hamesha "process ya trust boundary paar karne waali kisi bhi cheez ke liye JSON istemal karो".',
      },
    ],

    interviewQA: [
      {
        q: 'What types does JSON support, and how does Python\'s `json` module handle types that are not in that set?',
        qHi: 'JSON kaunse types support karता hai, aur Python ka `json` module us set mein na hone waale types kaise handle karता hai?',
        a: 'JSON has exactly six value types: object, which maps to a Python dict; array, which maps to a Python list; string, mapping to str; number, mapping to int or float depending on whether it has a decimal point or exponent; the literals true and false, mapping to bool; and null, mapping to None. That is the entire type system. When you call json dot dumps, Python types outside this set cause problems. Tuples are quietly serialized as arrays, so a tuple becomes a list and does not round-trip as a tuple. Dictionary keys that are not strings — integers, floats, booleans — are coerced to strings, which can silently collapse distinct keys, for example the integer one and the boolean true both becoming the string one. And types with no JSON representation at all — set, frozenset, bytes, datetime, date, Decimal, UUID, and every user-defined class — raise a TypeError from dumps. The mechanism for handling those is the default parameter: you pass a function that json calls with any object it cannot serialize natively. Your function inspects the object and returns something json can serialize — an ISO 8601 string for a datetime, the string form for a Decimal to preserve precision, a sorted list for a set, a dict from a dataclass — or raises TypeError if it also does not know what to do. On the loading side, json dot loads gives you back only the six native types. If you want richer objects reconstructed, you provide an object_hook function that json calls for every JSON object it parses; typically you tag your custom types on the way out with a marker key so the hook can recognise and rebuild them on the way in, making the round-trip symmetric. There is also parse_float, commonly set to Decimal, so that numbers with a decimal point are parsed as exact decimals rather than binary floats, which matters for money.',
        aHi: 'JSON mein bilkul chhah value types hain: object, jo ek Python dict se map hota hai; array, jo ek Python list se; string, str se; number, int ya float se; literals true aur false, bool se; aur null, None se. Wo poora type system hai. Jab aap json dot dumps call karते ho, is set ke baahar Python types samasyaayein banाते hain. Tuples chupchaap arrays ki tarah serialize hote hain. Non-string dictionary keys strings mein coerce hoती hain. Aur bina koi JSON representation waale types — set, bytes, datetime, Decimal, UUID, aur har user-defined class — dumps se ek TypeError raise karते hain. Unhe handle karne ka tantr default parameter hai: aap ek function pass karते ho jise json kisi bhi object ke saath call karता hai jise ye natively serialize nahi kar sakta. Loading side par, json dot loads sirf chhah native types wapas deता hai. Agar aap richer objects chahते ho, aap ek object_hook function deते ho.',
      },
      {
        q: 'Why is `json.loads` safe on untrusted input but `pickle.loads` and `eval` are not?',
        qHi: '`json.loads` untrusted input par surakshit kyun hai par `pickle.loads` aur `eval` nahi?',
        a: 'json dot loads is a pure parser for a data-only format. It reads the JSON text and constructs, from it, only the six inert value types — dictionaries, lists, strings, numbers, booleans, and None. None of those can hold code, none of them execute anything when created, and the parser never calls arbitrary functions or instantiates arbitrary classes. The worst a malicious JSON string can do is be very large or deeply nested, causing a denial of service through memory or recursion, and even that is bounded and can be mitigated with size limits. So parsing JSON you received from a network, a queue, a user, or a file is safe from code execution. pickle is the opposite: it is a serialization format designed to reconstruct arbitrary Python objects, and its wire format includes opcodes that the unpickler executes, including opcodes that import modules and call callables with arguments taken from the stream. A crafted pickle payload can therefore run any code available in the target environment the moment it is unpickled — it is a straightforward remote code execution primitive. pickle dot loads must only ever be used on data your own process produced and stored somewhere only you control. eval is even more direct: it takes a string and executes it as Python source in the current scope, so eval of an untrusted string is literally running attacker-supplied code. The same caution applies to yaml dot load without the safe loader, which can instantiate arbitrary Python objects, and to any format or library that blurs the line between data and behaviour. The rule is that anything crossing a trust boundary — an API request body, a message from a broker, a config file a user can edit, a cache another service writes — must be exchanged in a pure data format, which in practice means JSON, or something like msgpack or protobuf, and never pickle, never eval, never unsafe YAML.',
        aHi: 'json dot loads ek data-only format ke liye ek shuddh parser hai. Ye JSON text padhता hai aur, isse, sirf chhah inert value types banाता hai — dictionaries, lists, strings, numbers, booleans, aur None. Unmein se koi bhi code nahi rakh sakta, koi bhi banaने par kuch execute nahi karता, aur parser kabhi arbitrary functions call ya arbitrary classes instantiate nahi karता. Ek malicious JSON string sabse bura ye kar sakti hai ki bahut badi ya gehri nested ho. pickle iske ulta hai: ye ek serialization format hai jo arbitrary Python objects reconstruct karne ko design kiya gaya, aur iske wire format mein opcodes hain jo unpickler execute karता hai, modules import aur callables call karne waale opcodes sameth. Ek crafted pickle payload isliye koi bhi code chalा sakta hai jis pal ise unpickle kiya jाता hai. eval aur bhi seedha hai: ye ek string leता hai aur ise Python source ki tarah execute karता hai. Niyam ye hai ki ek trust boundary paar karne waali koi bhi cheez ek shuddh data format mein exchange honi chahiye, jo vyavhaar mein JSON matlab hai.',
      },
    ],

    exercises: [
      {
        task: 'Write `to_wire(obj)` and `from_wire(s)` that round-trip a dict containing a `datetime`, a `Decimal`, and a `set`. Use `default=` (tag each with a `{"_t": ..., "v": ...}` dict) and `object_hook=`. Assert the restored dict equals the original for all three value types.',
        taskHi: '`to_wire(obj)` aur `from_wire(s)` likhо jo ek dict ko round-trip karें jismein ek `datetime`, ek `Decimal`, aur ek `set` hai. `default=` aur `object_hook=` istemal karो. Assert karो restored dict teenों value types ke liye original ke barabar hai.',
        hint: '`default`: `{"_t": "dt", "v": o.isoformat()}` / `{"_t": "dec", "v": str(o)}` / `{"_t": "set", "v": sorted(o)}`. `object_hook`: check `d.get("_t")` and rebuild. `set` restore: `set(d["v"])`.',
        hintHi: '`default`: `{"_t": "dt", "v": o.isoformat()}` etc. `object_hook`: `d.get("_t")` check karो aur rebuild karो.',
      },
      {
        task: 'Write `canonical(obj)` returning the deterministic compact JSON string for `obj` (`sort_keys=True`, `separators=(",", ":")`, `ensure_ascii=False`). Show that two dicts with keys inserted in different orders produce the identical string, and that it is suitable as a cache key (hash it with `hashlib.sha256`).',
        taskHi: '`canonical(obj)` likhо jo `obj` ke liye deterministic compact JSON string lautाe. Dikhाओ ki alag kram mein keys inserted do dicts samaan string banाते hain.',
        hint: '`json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)`. `{"a": 1, "b": 2}` and `{"b": 2, "a": 1}` both give `{"a":1,"b":2}`. `hashlib.sha256(canonical(obj).encode()).hexdigest()` is a stable cache key.',
        hintHi: '`json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)`. `{"a": 1, "b": 2}` aur `{"b": 2, "a": 1}` dono `{"a":1,"b":2}` deते hain.',
      },
      {
        task: 'Write `load_prices(json_text)` that parses money as `Decimal` (`parse_float=Decimal`), and raises a clear `ValueError` (wrapping `json.JSONDecodeError`) if the text is malformed, including the line and column. Test on valid JSON, on `{"a": 0.1}` (confirm `Decimal`), and on `{"a": }` (confirm the error message has a position).',
        taskHi: '`load_prices(json_text)` likhо jo paise ko `Decimal` ki tarah parse kare, aur agar text malformed hai to ek saaf `ValueError` raise kare, line aur column sameth. Test karो.',
        hint: '`try: return json.loads(json_text, parse_float=Decimal) except json.JSONDecodeError as e: raise ValueError(f"bad JSON at line {e.lineno} col {e.colno}: {e.msg}") from e`.',
        hintHi: '`try: return json.loads(json_text, parse_float=Decimal) except json.JSONDecodeError as e: raise ValueError(f"bad JSON at line {e.lineno} col {e.colno}: {e.msg}") from e`.',
      },
    ],

    keyTakeaways: [
      'JSON has exactly 6 types: object↔dict, array↔list, string↔str, number↔int/float, true/false↔bool, null↔None. Nothing else.',
      'Tuples serialize as arrays and come back as LISTS. Non-string dict keys are coerced to strings (and can collide). `set`, `bytes`, `datetime`, `Decimal`, `UUID`, custom classes → `TypeError` from `dumps`.',
      '`json.dumps(obj, default=fn)`: `fn(obj)` is called for any unhandled type — return a JSON-native value (ISO string, `str(Decimal)`, `sorted(set)`) or raise `TypeError`.',
      '`json.loads(s, object_hook=fn)`: `fn(dict)` runs for every JSON object — use it (with tagged types from `default=`) to reconstruct `datetime`/`Decimal`/custom types symmetrically.',
      '`parse_float=Decimal` parses decimal numbers as exact `Decimal`, not binary `float` — essential for money. Default `float` gives `0.1 + 0.2 == 0.30000000000000004`.',
      '`dumps` options: `indent=N` (pretty), `sort_keys=True` (deterministic — for cache keys/signatures/snapshots), `ensure_ascii=False` (readable UTF-8), `separators=(",", ":")` (compact).',
      '`json.JSONDecodeError` (subclass of `ValueError`) carries `.lineno`/`.colno`/`.pos`/`.msg`. Catch it around `loads` of external input.',
      '`json.loads` is SAFE on untrusted input (only inert types). NEVER `pickle.loads`, `eval`, or `yaml.load` (use `yaml.safe_load`) on data you did not produce — RCE risk.',
    ],
    keyTakeawaysHi: [
      'JSON mein bilkul 6 types hain: object↔dict, array↔list, string↔str, number↔int/float, true/false↔bool, null↔None. Aur kuch nahi.',
      'Tuples arrays ki tarah serialize hote hain aur LISTS ki tarah wapas aaते hain. Non-string dict keys strings mein coerce hoती hain. `set`, `bytes`, `datetime`, `Decimal`, `UUID`, custom classes → `dumps` se `TypeError`.',
      '`json.dumps(obj, default=fn)`: `fn(obj)` kisi bhi unhandled type ke liye call hota hai — ek JSON-native value lautाओ ya `TypeError` raise karो.',
      '`json.loads(s, object_hook=fn)`: `fn(dict)` har JSON object ke liye chalता hai — ise `datetime`/`Decimal`/custom types ko symmetrically reconstruct karne ko istemal karो.',
      '`parse_float=Decimal` decimal numbers ko exact `Decimal` ki tarah parse karता hai, binary `float` nahi — paison ke liye zaroori.',
      '`dumps` options: `indent=N` (pretty), `sort_keys=True` (deterministic — cache keys/signatures/snapshots ke liye), `ensure_ascii=False` (readable UTF-8), `separators=(",", ":")` (compact).',
      '`json.JSONDecodeError` (`ValueError` ka subclass) mein `.lineno`/`.colno`/`.pos`/`.msg` hain. External input ke `loads` ke aas-paas ise pakdो.',
      '`json.loads` untrusted input par SURAKSHIT hai (sirf inert types). KABHI `pickle.loads`, `eval`, ya `yaml.load` (`yaml.safe_load` istemal karो) us data par nahi jo aapne nahi banaya — RCE risk.',
    ],
  },

  {
    slug: 'py-dates-times-paths',
    title: 'Dates, Times, Timezones, and Paths',
    titleHi: 'Dates, Times, Timezones, Aur Paths',
    description: 'Subtracting two `datetime`s and getting `TypeError: can\'t subtract offset-naive and offset-aware datetimes`, or storing "now" as a naive local time and having it shift by hours when the server runs in a different timezone. And building file paths with `"dir" + "/" + name` that break on Windows. `datetime` with explicit timezones and `pathlib.Path` remove almost all of this pain.',
    descriptionHi: 'Do `datetime`s ghatाna aur `TypeError: can\'t subtract offset-naive and offset-aware datetimes` paना, ya "now" ko ek naive local time ki tarah store karna aur ise ghanton se shift hote dekhna jab server ek alag timezone mein chalता hai. Aur `"dir" + "/" + name` se file paths banana jo Windows par tootते hain. Explicit timezones ke saath `datetime` aur `pathlib.Path` is dard ka lagbhag saara hataते hain.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**A timestamp is only meaningful with the timezone attached, like a photo caption is only useful with the location.** "Taken at 3 o\'clock" tells you almost nothing — 3 o\'clock where? A *naive* datetime is exactly that caption with no place: a wall-clock reading with no indication of which wall\'s clock. It seems fine while everyone is in the same room, then someone opens it in another country and it is silently wrong by hours. An *aware* datetime carries the timezone with it, so "3 PM UTC" or "3 PM in Tokyo" is an unambiguous instant that everyone agrees on. The discipline that removes the whole class of bugs: store and compute in UTC (aware), convert to a local timezone only at the very edge, when showing a human. Python enforces the distinction by refusing to subtract a naive datetime from an aware one — it is telling you the question is undefined. For paths, `pathlib.Path` is the equivalent fix: instead of gluing strings with slashes and hoping the separator is right for the operating system, you build paths with the `/` operator on `Path` objects, which produces the correct separator everywhere and gives you `.name`, `.stem`, `.suffix`, `.parent`, `.exists()`, and `.read_text()` for free.',
      hi: '**Ek timestamp sirf timezone attached ke saath maani rakhता hai, jaise ek photo caption sirf location ke saath upyogi hai.** "3 baje liya" aapko lagbhag kuch nahi bataता — 3 baje kahaan? Ek *naive* datetime bilkul wo caption hai bina jagah: ek wall-clock reading bina sanket ki kaunsi deewaar ki clock. Ek *aware* datetime timezone apne saath le jाता hai, isliye "3 PM UTC" ya "3 PM Tokyo mein" ek asandigdh pal hai jispar sab sahmat hain. Wo anushaasan jo poora bug class hataता hai: UTC mein store aur compute karो (aware), sirf bilkul edge par ek local timezone mein convert karो, jab ek insaan ko dikhाते ho. Python is antar ko enforce karता hai ek naive datetime ko ek aware se ghatाने se mana karके. Paths ke liye, `pathlib.Path` samतुल्य fix hai: strings ko slashes se chipkाने ke bजाय, aap `Path` objects par `/` operator se paths banाते ho.',
    },

    simple: `**Naive vs aware datetimes**

\`\`\`python
from datetime import datetime, timezone, timedelta

naive = datetime(2026, 8, 31, 14, 30)                 # no tzinfo -- ambiguous instant
aware = datetime(2026, 8, 31, 14, 30, tzinfo=timezone.utc)   # unambiguous

naive.tzinfo                    # None
aware.tzinfo                    # datetime.timezone.utc

# mixing them is an error:
aware - naive                  # TypeError: can't subtract offset-naive and offset-aware

# "now":
datetime.now()                 # naive local time -- avoid for anything stored
datetime.now(timezone.utc)     # aware UTC -- prefer this
\`\`\`

**Timezones with zoneinfo (stdlib, 3.9+)**

\`\`\`python
from zoneinfo import ZoneInfo

utc_now = datetime(2026, 8, 31, 18, 0, tzinfo=timezone.utc)
tokyo = utc_now.astimezone(ZoneInfo("Asia/Tokyo"))     # same instant, Tokyo wall clock
ny = utc_now.astimezone(ZoneInfo("America/New_York"))

print(utc_now.isoformat())     # '2026-08-31T18:00:00+00:00'
print(tokyo.isoformat())       # '2026-09-01T03:00:00+09:00'
\`\`\`

**Parsing and formatting**

\`\`\`python
# ISO 8601 -- use these when you control both ends:
dt.isoformat()                             # '2026-08-31T14:30:00+00:00'
datetime.fromisoformat("2026-08-31T14:30:00+00:00")

# strftime / strptime -- for non-ISO formats:
dt.strftime("%Y-%m-%d %H:%M")              # '2026-08-31 14:30'
datetime.strptime("31/08/2026", "%d/%m/%Y")   # note: strptime result is NAIVE

# timedelta arithmetic:
dt + timedelta(days=7, hours=3)
(dt2 - dt1).total_seconds()
\`\`\`

**Measuring elapsed time -- NOT datetime**

\`\`\`python
import time
time.time()          # wall clock seconds since epoch -- can jump (NTP, DST) -> not for durations
time.perf_counter()  # highest-resolution monotonic clock -> USE THIS for "how long did X take"
time.monotonic()     # monotonic, lower resolution -> for timeouts
\`\`\`

**Paths with pathlib**

\`\`\`python
from pathlib import Path

p = Path("data") / "reports" / "2026.csv"   # correct separator on every OS
p.name        # '2026.csv'
p.stem        # '2026'
p.suffix      # '.csv'
p.parent      # Path('data/reports')
p.exists()    # bool
p.read_text(encoding="utf-8")               # read the whole file
list(Path("logs").glob("*.log"))            # matching files
Path("out").mkdir(parents=True, exist_ok=True)
\`\`\`

\`\`\`
NAIVE datetime   = no tzinfo. An abstract wall-clock reading. Do NOT store or compare
                   across systems. datetime.now() and strptime() give naive results.
AWARE datetime   = has tzinfo. A real instant. datetime.now(timezone.utc) gives this.
                   You cannot mix naive and aware in arithmetic/comparison -> TypeError.

DISCIPLINE:  store/compute in UTC (aware) -> convert to a local zone only when displaying.

ISO 8601:   dt.isoformat()  <->  datetime.fromisoformat(s)   -- use when you control both sides
strftime/strptime:  for legacy/custom formats.  strptime returns NAIVE.
timedelta:  dt + timedelta(...) ;  (a - b).total_seconds() / .days

DURATIONS:  time.perf_counter() for measuring; time.monotonic() for timeouts.
            NEVER use time.time() or datetime.now() to measure elapsed time.

pathlib.Path:  Path("a") / "b" / "c"  ;  .name .stem .suffix .parent .parts
               .exists() .is_file() .is_dir() .read_text() .write_text() .glob() .iterdir()
               .mkdir(parents=True, exist_ok=True) .resolve() .with_suffix(".json")
\`\`\``,

    simpleHi: `**Naive vs aware datetimes**

\`\`\`python
from datetime import datetime, timezone, timedelta

naive = datetime(2026, 8, 31, 14, 30)                 # koi tzinfo nahi -- ambiguous pal
aware = datetime(2026, 8, 31, 14, 30, tzinfo=timezone.utc)   # asandigdh

naive.tzinfo                    # None
aware.tzinfo                    # datetime.timezone.utc

# unhe mix karna ek error hai:
aware - naive                  # TypeError: can't subtract offset-naive and offset-aware

# "now":
datetime.now()                 # naive local time -- store ki gayi kisi bhi cheez ke liye bचो
datetime.now(timezone.utc)     # aware UTC -- ise prefer karो
\`\`\`

**zoneinfo ke saath timezones (stdlib, 3.9+)**

\`\`\`python
from zoneinfo import ZoneInfo

utc_now = datetime(2026, 8, 31, 18, 0, tzinfo=timezone.utc)
tokyo = utc_now.astimezone(ZoneInfo("Asia/Tokyo"))     # wahi pal, Tokyo wall clock
ny = utc_now.astimezone(ZoneInfo("America/New_York"))

print(utc_now.isoformat())     # '2026-08-31T18:00:00+00:00'
print(tokyo.isoformat())       # '2026-09-01T03:00:00+09:00'
\`\`\`

**Parsing aur formatting**

\`\`\`python
# ISO 8601 -- inhe istemal karो jab aap dono ends control karते ho:
dt.isoformat()                             # '2026-08-31T14:30:00+00:00'
datetime.fromisoformat("2026-08-31T14:30:00+00:00")

# strftime / strptime -- non-ISO formats ke liye:
dt.strftime("%Y-%m-%d %H:%M")              # '2026-08-31 14:30'
datetime.strptime("31/08/2026", "%d/%m/%Y")   # note: strptime result NAIVE hai

# timedelta arithmetic:
dt + timedelta(days=7, hours=3)
(dt2 - dt1).total_seconds()
\`\`\`

**Elapsed time maapna -- datetime NAHI**

\`\`\`python
import time
time.time()          # epoch se wall clock seconds -- jump kar sakta hai -> durations ke liye nahi
time.perf_counter()  # sabse zyaada-resolution monotonic clock -> "X kitna samay liya" ke liye ISE ISTEMAL KARO
time.monotonic()     # monotonic, kam resolution -> timeouts ke liye
\`\`\`

**pathlib ke saath paths**

\`\`\`python
from pathlib import Path

p = Path("data") / "reports" / "2026.csv"   # har OS par sahi separator
p.name        # '2026.csv'
p.stem        # '2026'
p.suffix      # '.csv'
p.parent      # Path('data/reports')
p.exists()    # bool
p.read_text(encoding="utf-8")
list(Path("logs").glob("*.log"))
Path("out").mkdir(parents=True, exist_ok=True)
\`\`\`

\`\`\`
NAIVE datetime   = koi tzinfo nahi. Ek abstract wall-clock reading. Systems ke beech store
                   ya compare mat karो. datetime.now() aur strptime() naive results deते hain.
AWARE datetime   = tzinfo hai. Ek asli pal. datetime.now(timezone.utc) ye deता hai.
                   Aap arithmetic/comparison mein naive aur aware mix nahi kar sakte -> TypeError.

ANUSHAASAN:  UTC mein store/compute karो (aware) -> sirf display karте waqt ek local zone mein convert.

ISO 8601:   dt.isoformat()  <->  datetime.fromisoformat(s)
strftime/strptime:  legacy/custom formats ke liye.  strptime NAIVE lautaता hai.
timedelta:  dt + timedelta(...) ;  (a - b).total_seconds() / .days

DURATIONS:  maapne ke liye time.perf_counter(); timeouts ke liye time.monotonic().
            elapsed time maapne ke liye KABHI time.time() ya datetime.now() nahi.

pathlib.Path:  Path("a") / "b" / "c"  ;  .name .stem .suffix .parent .parts
               .exists() .is_file() .read_text() .write_text() .glob() .iterdir()
               .mkdir(parents=True, exist_ok=True) .resolve() .with_suffix(".json")
\`\`\``,

    content: `## The naive/aware split, precisely

A \`datetime\` is **aware** if \`.tzinfo\` is set and \`.tzinfo.utcoffset(dt)\` is not \`None\`; otherwise it is **naive**. Naive means "a date and time with no reference frame" — it could be any timezone. You cannot compare or subtract a naive and an aware datetime; Python raises \`TypeError\` because the operation has no defined answer.

\`\`\`python
from datetime import datetime, timezone

datetime.now()                       # naive -- local wall clock, no tzinfo
datetime.now(timezone.utc)           # aware -- the current instant in UTC
datetime.utcnow()                    # DEPRECATED -- returns a NAIVE datetime of UTC time (a trap)
datetime.now(timezone.utc).replace(tzinfo=None)   # deliberately strip tz (rarely what you want)
\`\`\`

**Rule:** every stored or transmitted datetime is aware and in UTC. Convert to a local zone only for display.

## Converting zones

\`\`\`python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

instant = datetime(2026, 3, 8, 7, 30, tzinfo=timezone.utc)

instant.astimezone(ZoneInfo("America/Los_Angeles"))   # same instant, LA clock
# handles DST automatically: PST (-08:00) or PDT (-07:00) depending on the date

# attaching a zone to a naive datetime (only if you KNOW what zone it was in):
naive = datetime(2026, 3, 8, 7, 30)
aware = naive.replace(tzinfo=ZoneInfo("America/Los_Angeles"))   # interpret AS LA time
\`\`\`

\`.astimezone(zone)\` keeps the same instant and changes the wall-clock representation. \`.replace(tzinfo=zone)\` keeps the wall-clock numbers and asserts a zone — only correct when you actually know the source zone.

## Parsing: \`fromisoformat\` vs \`strptime\`

\`\`\`python
from datetime import datetime

# ISO 8601 (since 3.11 fromisoformat is quite permissive):
datetime.fromisoformat("2026-08-31T14:30:00+00:00")   # aware
datetime.fromisoformat("2026-08-31")                  # naive date-only
datetime.fromisoformat("2026-08-31T14:30:00Z")        # 'Z' accepted since 3.11

# arbitrary formats:
datetime.strptime("Aug 31 2026 2:30 PM", "%b %d %Y %I:%M %p")   # NAIVE
datetime.strptime("2026-08-31 +0530", "%Y-%m-%d %z")            # aware (has %z)
\`\`\`

\`strptime\` returns a naive datetime unless the format string includes \`%z\` (a UTC offset) or \`%Z\`. Prefer \`fromisoformat\` when both sides speak ISO 8601 — it is faster and unambiguous.

## \`timedelta\`

\`\`\`python
from datetime import timedelta

d = timedelta(days=2, hours=6, minutes=30)
d.total_seconds()          # 196200.0   -- always use this, not d.seconds (which is < 86400)
d.days                     # 2

deadline = datetime.now(timezone.utc) + timedelta(hours=48)
overdue = datetime.now(timezone.utc) > deadline

# NOTE: d.seconds is the seconds-part (0..86399), NOT the total. d.total_seconds() is the total.
\`\`\`

## Measuring durations — the right clock

\`\`\`python
import time

# WRONG: time.time() and datetime.now() follow the wall clock, which can jump
#        backward (NTP correction, DST, manual change) -> negative or wrong durations
start = time.time()
...
elapsed = time.time() - start        # could be negative!

# RIGHT: perf_counter is monotonic and high-resolution
start = time.perf_counter()
...
elapsed = time.perf_counter() - start   # seconds, always >= 0, sub-microsecond precision

# for timeouts / rate limiting, monotonic is enough:
deadline = time.monotonic() + 5.0
while time.monotonic() < deadline:
    ...
\`\`\`

## \`pathlib.Path\` — the whole toolkit

\`\`\`python
from pathlib import Path

p = Path("/var/log") / "app" / "server.log"
p.parts                    # ('/', 'var', 'log', 'app', 'server.log')
p.name / p.stem / p.suffix # 'server.log' / 'server' / '.log'
p.parent                   # Path('/var/log/app')
p.with_suffix(".txt")      # Path('/var/log/app/server.txt')
p.with_name("error.log")   # Path('/var/log/app/error.log')

p.exists() / p.is_file() / p.is_dir()
p.read_text(encoding="utf-8") / p.read_bytes()
p.write_text("data", encoding="utf-8")
p.mkdir(parents=True, exist_ok=True)
p.unlink(missing_ok=True)                  # delete a file
list(p.parent.glob("*.log"))              # non-recursive
list(p.parent.rglob("*.log"))             # recursive
Path.cwd() / Path.home()
p.resolve()                               # absolute, symlinks resolved
p.relative_to("/var/log")                # Path('app/server.log')

# interop: most stdlib and libraries accept Path directly; if one needs a str:
str(p)  /  open(p)  /  os.fspath(p)
\`\`\`

Use \`Path\` from the start of any file handling. Never build paths with string concatenation or hard-coded \`/\` or \`\\\\\`.`,

    contentHi: `## Naive/aware split, thik-thik

Ek \`datetime\` **aware** hai agar \`.tzinfo\` set hai aur \`.tzinfo.utcoffset(dt)\` \`None\` nahi hai; warna ye **naive** hai. Naive matlab "ek date aur time bina reference frame" — ye koi bhi timezone ho sakta hai. Aap ek naive aur ek aware datetime compare ya ghatा nahi sakte; Python \`TypeError\` raise karता hai.

\`\`\`python
from datetime import datetime, timezone

datetime.now()                       # naive -- local wall clock, koi tzinfo nahi
datetime.now(timezone.utc)           # aware -- UTC mein current pal
datetime.utcnow()                    # DEPRECATED -- UTC time ka ek NAIVE datetime lautaता hai (ek jaal)
\`\`\`

**Niyam:** har stored ya transmitted datetime aware aur UTC mein hai. Sirf display ke liye ek local zone mein convert karो.

## Zones convert karna

\`\`\`python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

instant = datetime(2026, 3, 8, 7, 30, tzinfo=timezone.utc)

instant.astimezone(ZoneInfo("America/Los_Angeles"))   # wahi pal, LA clock
# DST apne aap handle karта hai

# ek naive datetime ko ek zone attach karna (sirf agar aap JAANते ho ye kaunse zone mein tha):
naive = datetime(2026, 3, 8, 7, 30)
aware = naive.replace(tzinfo=ZoneInfo("America/Los_Angeles"))   # LA time KI TARAH interpret karो
\`\`\`

\`.astimezone(zone)\` wahi pal rakhता hai aur wall-clock representation badalता hai. \`.replace(tzinfo=zone)\` wall-clock numbers rakhता hai aur ek zone assert karता hai — sirf tab sahi jab aap asal mein source zone jaanते ho.

## Parsing: \`fromisoformat\` vs \`strptime\`

\`\`\`python
from datetime import datetime

datetime.fromisoformat("2026-08-31T14:30:00+00:00")   # aware
datetime.fromisoformat("2026-08-31")                  # naive date-only
datetime.fromisoformat("2026-08-31T14:30:00Z")        # 'Z' 3.11 se accepted

datetime.strptime("Aug 31 2026 2:30 PM", "%b %d %Y %I:%M %p")   # NAIVE
datetime.strptime("2026-08-31 +0530", "%Y-%m-%d %z")            # aware (%z hai)
\`\`\`

\`strptime\` ek naive datetime lautaता hai jab tak format string mein \`%z\` ya \`%Z\` na ho. \`fromisoformat\` prefer karो jab dono sides ISO 8601 bolте hain.

## \`timedelta\`

\`\`\`python
from datetime import timedelta

d = timedelta(days=2, hours=6, minutes=30)
d.total_seconds()          # 196200.0   -- hamesha ise istemal karो, d.seconds nahi
d.days                     # 2

# NOTE: d.seconds seconds-part hai (0..86399), total NAHI. d.total_seconds() total hai.
\`\`\`

## Durations maapna — sahi clock

\`\`\`python
import time

# GALAT: time.time() aur datetime.now() wall clock follow karते hain, jo jump kar sakta hai
start = time.time()
elapsed = time.time() - start        # negative ho sakta hai!

# SAHI: perf_counter monotonic aur high-resolution hai
start = time.perf_counter()
elapsed = time.perf_counter() - start   # seconds, hamesha >= 0

# timeouts / rate limiting ke liye, monotonic kaafi hai:
deadline = time.monotonic() + 5.0
\`\`\`

## \`pathlib.Path\` — poora toolkit

\`\`\`python
from pathlib import Path

p = Path("/var/log") / "app" / "server.log"
p.parts                    # ('/', 'var', 'log', 'app', 'server.log')
p.name / p.stem / p.suffix # 'server.log' / 'server' / '.log'
p.parent                   # Path('/var/log/app')
p.with_suffix(".txt")
p.with_name("error.log")

p.exists() / p.is_file() / p.is_dir()
p.read_text(encoding="utf-8") / p.read_bytes()
p.write_text("data", encoding="utf-8")
p.mkdir(parents=True, exist_ok=True)
p.unlink(missing_ok=True)
list(p.parent.glob("*.log"))              # non-recursive
list(p.parent.rglob("*.log"))             # recursive
Path.cwd() / Path.home()
p.resolve()                               # absolute, symlinks resolved
p.relative_to("/var/log")

str(p)  /  open(p)  /  os.fspath(p)
\`\`\`

Kisi bhi file handling ki shuruaat se \`Path\` istemal karो. Kabhi string concatenation ya hard-coded \`/\` ya \`\\\\\` se paths mat banao.`,

    examples: [
      {
        title: 'Naive vs aware, the TypeError, and converting zones',
        titleHi: 'Naive vs aware, TypeError, aur zones convert karna',
        code: `from datetime import datetime, timezone, timedelta

naive = datetime(2026, 8, 31, 14, 30)
aware = datetime(2026, 8, 31, 14, 30, tzinfo=timezone.utc)

print("naive.tzinfo:", naive.tzinfo)
print("aware.tzinfo:", aware.tzinfo)

try:
    aware - naive
except TypeError as e:
    print("mix error:", e)

# the SAME instant, at four fixed UTC offsets.
# (in real code use ZoneInfo("Asia/Tokyo") etc -- it also applies DST for the date.)
instant = datetime(2026, 8, 31, 18, 0, tzinfo=timezone.utc)
for label, hours in [("UTC", 0), ("Tokyo +09", 9), ("New York -04", -4), ("London +01", 1)]:
    local = instant.astimezone(timezone(timedelta(hours=hours)))
    print(f"{label:14} {local.isoformat()}")

# arithmetic works when both are aware:
later = aware + timedelta(hours=36)
print("36h later:", later.isoformat())
print("diff seconds:", (later - aware).total_seconds())`,
        output: `naive.tzinfo: None
aware.tzinfo: UTC
mix error: can't subtract offset-naive and offset-aware datetimes
UTC            2026-08-31T18:00:00+00:00
Tokyo +09      2026-09-01T03:00:00+09:00
New York -04   2026-08-31T14:00:00-04:00
London +01     2026-08-31T19:00:00+01:00
36h later: 2026-09-02T02:30:00+00:00
diff seconds: 129600.0
`,
        explain: '`naive.tzinfo` is `None`; `aware.tzinfo` is UTC. Subtracting one from the other raises `TypeError` — the operation is undefined without a common reference. `astimezone` shows the *same instant* (18:00 UTC) as different wall-clock times: 03:00 the next day at +09, 14:00 at -04, 19:00 at +01. The offsets here are hard-coded with `timezone(timedelta(hours=n))` so the example runs anywhere; real code passes `ZoneInfo("Asia/Tokyo")`, which also applies the correct DST offset for the date. `timedelta` arithmetic works cleanly once both operands are aware.',
        explainHi: '`naive.tzinfo` `None` hai; `aware.tzinfo` UTC hai. Ek ko doosre se ghatाना `TypeError` raise karता hai. `astimezone` *wahi pal* (18:00 UTC) ko alag wall-clock times ki tarah dikhाता hai: Tokyo mein agle din 03:00, New York mein 14:00, London mein 19:00. `timedelta` ke saath arithmetic saaf kaam karता hai jab dono operands aware hain.',
      },
      {
        title: 'Parsing, formatting, and the perf_counter vs time.time distinction',
        titleHi: 'Parsing, formatting, aur perf_counter vs time.time antar',
        code: `from datetime import datetime, timezone
import time

# fromisoformat vs strptime:
iso = datetime.fromisoformat("2026-08-31T14:30:00+00:00")
print("iso aware:", iso.tzinfo is not None)

legacy = datetime.strptime("31/08/2026 14:30", "%d/%m/%Y %H:%M")
print("strptime naive:", legacy.tzinfo is None)      # True -- no %z in the format

with_tz = datetime.strptime("2026-08-31 14:30 +0000", "%Y-%m-%d %H:%M %z")
print("strptime+%z aware:", with_tz.tzinfo is not None)

# formatting:
dt = datetime(2026, 8, 31, 14, 30, 5, tzinfo=timezone.utc)
print(dt.isoformat())
print(dt.strftime("%A %d %B %Y, %H:%M UTC"))
print(dt.strftime("%Y%m%d_%H%M%S"))                   # filename-safe

# measuring elapsed time:
start = time.perf_counter()
total = sum(range(2_000_000))
elapsed = time.perf_counter() - start
print(f"summed 2M ints, elapsed >= 0: {elapsed >= 0}, precise: {elapsed < 1.0}")

print("perf_counter is monotonic:", time.perf_counter() >= start)`,
        output: `iso aware: True
strptime naive: True
strptime+%z aware: True
2026-08-31T14:30:05+00:00
Monday 31 August 2026, 14:30 UTC
20260831_143005
summed 2M ints, elapsed >= 0: True, precise: True
perf_counter is monotonic: True`,
        explain: '`fromisoformat` on a string with an offset gives an aware datetime. `strptime` gives a naive one unless the format includes `%z` (then it is aware). `isoformat()` is the machine format; `strftime` with codes builds human or filename-safe formats. For timing, `perf_counter()` deltas are always non-negative and high-resolution — unlike `time.time()`, which can jump backward on a clock correction.',
        explainHi: 'Ek offset waali string par `fromisoformat` ek aware datetime deता hai. `strptime` ek naive deता hai jab tak format mein `%z` na ho. `isoformat()` machine format hai; codes waala `strftime` human ya filename-safe formats banाता hai. Timing ke liye, `perf_counter()` deltas hamesha non-negative aur high-resolution hain.',
      },
      {
        title: 'pathlib: building, inspecting, reading, and globbing paths',
        titleHi: 'pathlib: paths banana, inspect, read, aur glob',
        code: `from pathlib import Path
import tempfile

root = Path(tempfile.mkdtemp())

# build a small tree:
(root / "logs").mkdir()
(root / "data").mkdir()
(root / "logs" / "app.log").write_text("line 1\\nline 2\\n", encoding="utf-8")
(root / "logs" / "error.log").write_text("boom\\n", encoding="utf-8")
(root / "data" / "report.csv").write_text("a,b\\n1,2\\n", encoding="utf-8")

# inspect a path (no filesystem access needed for these):
p = root / "logs" / "app.log"
print("name:  ", p.name)
print("stem:  ", p.stem)
print("suffix:", p.suffix)
print("parent:", p.parent.name)
print("with_suffix:", p.with_suffix(".txt").name)

# filesystem queries:
print("exists:", p.exists(), "| is_file:", p.is_file())
print("content:", repr(p.read_text(encoding="utf-8")))
print("lines:", p.read_text(encoding="utf-8").splitlines())

# globbing:
print("*.log in logs:", sorted(f.name for f in (root / "logs").glob("*.log")))
print("all files (rglob):", sorted(f.name for f in root.rglob("*.*")))

# the / operator vs string concat -- one is portable, one is not:
print("joined:", (Path("a") / "b" / "c.txt").as_posix())`,
        output: `name:   app.log
stem:   app
suffix: .log
parent: logs
with_suffix: app.txt
exists: True | is_file: True
content: 'line 1\\nline 2\\n'
lines: ['line 1', 'line 2']
*.log in logs: ['app.log', 'error.log']
all files (rglob): ['app.log', 'error.log', 'report.csv']
joined: a/b/c.txt`,
        explain: '`Path("a") / "b" / "c.txt"` uses the `/` operator to join path components with the OS-correct separator. `.name`/`.stem`/`.suffix`/`.parent` decompose a path without touching the disk. `.exists()`/`.is_file()`/`.read_text()` are filesystem operations. `.glob("*.log")` matches in one directory; `.rglob("*.*")` recurses. All of this replaces `os.path.join`, `os.path.splitext`, `os.listdir`, and manual string work.',
        explainHi: '`Path("a") / "b" / "c.txt"` `/` operator istemal karके path components ko OS-sahi separator se join karता hai. `.name`/`.stem`/`.suffix`/`.parent` disk chhue bina ek path decompose karते hain. `.glob("*.log")` ek directory mein match karता hai; `.rglob("*.*")` recurse karта hai. Ye sab `os.path.join`, `os.path.splitext`, `os.listdir` ki jagah leта hai.',
      },
    ],

    mistakes: [
      {
        wrong: `created = datetime.now()              # naive local time
# stored in DB / sent in JSON / compared later on a server in another timezone
if datetime.now() - created > timedelta(hours=1):   # both naive, but of WHAT zone?`,
        right: `created = datetime.now(timezone.utc)   # aware UTC
if datetime.now(timezone.utc) - created > timedelta(hours=1):
    ...`,
        why: '`datetime.now()` returns a naive datetime in the machine\'s local timezone, with no record of which zone that is. Store it, move the code to a server in another timezone, or compare it to a value created elsewhere, and it is silently wrong by the offset difference. Always `datetime.now(timezone.utc)` for anything persisted, transmitted, or compared.',
        whyHi: '`datetime.now()` machine ke local timezone mein ek naive datetime lautaता hai, bina record ki wo kaunsa zone hai. Ise store karो, code ko doosre timezone ke server par le jाओ, aur ye chupchaap offset antar se galat hai. Kisi bhi persisted, transmitted, ya compared cheez ke liye hamesha `datetime.now(timezone.utc)`.',
      },
      {
        wrong: `start = time.time()
result = do_work()
print(f"took {time.time() - start:.3f}s")   # can be negative if the clock was corrected`,
        right: `start = time.perf_counter()
result = do_work()
print(f"took {time.perf_counter() - start:.3f}s")`,
        why: '`time.time()` and `datetime.now()` track the wall clock, which the OS can adjust backward (NTP sync, DST transition, manual change) — producing a negative or wildly wrong elapsed time. `time.perf_counter()` is monotonic (never goes backward) and the highest resolution available; it is the correct clock for measuring how long something took.',
        whyHi: '`time.time()` aur `datetime.now()` wall clock track karते hain, jise OS peechhe adjust kar sakta hai — ek negative ya bahut galat elapsed time banाते hue. `time.perf_counter()` monotonic hai (kabhi peechhe nahi jाता) aur sabse zyaada resolution.',
      },
      {
        wrong: `path = base_dir + "/" + subdir + "/" + filename    # breaks on Windows; double slashes; no validation
with open(path) as f: ...`,
        right: `from pathlib import Path
path = Path(base_dir) / subdir / filename
with path.open(encoding="utf-8") as f: ...`,
        why: 'String concatenation with `/` produces wrong separators on Windows, can create `//` or miss separators, and gives you none of the path helpers. `Path(base) / sub / name` uses the correct separator on every OS, normalises, and gives you `.exists()`, `.suffix`, `.parent`, `.glob()`, and safe `.open()`.',
        whyHi: '`/` ke saath string concatenation Windows par galat separators banाता hai, `//` bana sakta hai, aur aapko koi path helpers nahi deता. `Path(base) / sub / name` har OS par sahi separator istemal karता hai aur aapko `.exists()`, `.suffix`, `.parent`, `.glob()` deта hai.',
      },
    ],

    realWorld: [
      {
        en: '**Django with `USE_TZ = True` stores every datetime as aware UTC** — `timezone.now()` returns aware UTC, the ORM stores UTC, templates convert to the active timezone for display. `datetime.now()` (naive) in Django code triggers a `RuntimeWarning` about naive datetimes and is a bug.',
        hi: '**`USE_TZ = True` waala Django har datetime ko aware UTC ki tarah store karта hai** — `timezone.now()` aware UTC lautaता hai, ORM UTC store karta hai. Django code mein `datetime.now()` (naive) ek `RuntimeWarning` trigger karता hai aur ek bug hai.',
      },
      {
        en: '**`zoneinfo` (stdlib since 3.9) replaced `pytz`** — no more `pytz.timezone(...).localize(...)` dance; `dt.replace(tzinfo=ZoneInfo("Europe/Paris"))` and `dt.astimezone(ZoneInfo(...))` just work, with correct DST handling. On Windows you may need `pip install tzdata`.',
        hi: '**`zoneinfo` (3.9 se stdlib) ne `pytz` ki jagah li** — ab `pytz.timezone(...).localize(...)` nahi; `dt.astimezone(ZoneInfo(...))` bस kaam karता hai, sahi DST handling ke saath. Windows par aapko `pip install tzdata` chahiye ho sakta hai.',
      },
      {
        en: '**`pathlib.Path` is the modern default across new Python code** — `open(path)`, `json.load(path.open())`, most libraries accept `Path` directly. `Path(__file__).parent` for "the directory this script is in", `Path.home() / ".config" / "myapp"` for user config, `for p in Path("src").rglob("*.py")` for tooling.',
        hi: '**`pathlib.Path` naye Python code mein modern default hai** — `open(path)`, adhikaansh libraries `Path` seedhe accept karती hain. "Is script ki directory" ke liye `Path(__file__).parent`, user config ke liye `Path.home() / ".config" / "myapp"`.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a naive and an aware datetime, and how should you handle timezones in an application?',
        qHi: 'Ek naive aur ek aware datetime mein kya antar hai, aur aapko ek application mein timezones kaise handle karna chahiye?',
        a: 'A datetime object is aware if it has timezone information attached — a tzinfo whose offset from UTC is defined — and naive if it does not. A naive datetime is just a set of calendar and clock fields with no reference frame: the year, month, day, hour, minute, second, but no indication of which timezone those numbers are relative to. It could mean two-thirty in the afternoon anywhere on Earth. An aware datetime pins those fields to an actual instant by carrying the offset, so it identifies one unambiguous moment. Python enforces the distinction: you cannot subtract or compare a naive and an aware datetime, because the answer would be undefined — it raises TypeError. The functions that produce naive datetimes are the ones to be careful with: datetime dot now with no argument gives the local wall-clock time with no tzinfo, and strptime gives a naive result unless the format string includes a percent-z offset directive. The recommended discipline for an application is: work entirely in aware datetimes, store and compute everything in UTC, and convert to a local timezone only at the boundary where you display a time to a human. To get the current instant you call datetime dot now passing timezone dot utc, which gives an aware UTC datetime. To display it you call astimezone with the target zone, which you get from zoneinfo dot ZoneInfo of an IANA name like America slash New_York; astimezone keeps the same instant and just changes the wall-clock representation, and it handles daylight saving transitions correctly. If you receive a naive datetime from an external source and you happen to know which zone it was recorded in, you attach that zone with replace tzinfo, but only when you genuinely know the source zone. The old datetime dot utcnow is a trap because it returns a naive datetime holding UTC field values, which then gets misinterpreted as local time downstream; it is deprecated in favour of datetime dot now of timezone dot utc.',
        aHi: 'Ek datetime object aware hai agar iske paas timezone information attached hai — ek tzinfo jiska UTC se offset defined hai — aur naive hai agar nahi. Ek naive datetime bस calendar aur clock fields ka ek set hai bina reference frame. Ek aware datetime un fields ko offset lekar ek asli pal se pin karता hai. Python is antar ko enforce karta hai: aap ek naive aur ek aware datetime ghatा ya compare nahi kar sakte, ye TypeError raise karता hai. Naive datetimes banaने waali functions se saavdhaan raho: datetime dot now bina argument local wall-clock time deता hai, aur strptime ek naive result deта hai jab tak format string mein percent-z na ho. Recommended anushaasan: poori tarah aware datetimes mein kaam karो, sab kuch UTC mein store aur compute karो, aur sirf us boundary par ek local timezone mein convert karो jahaan aap ek insaan ko ek time dikhाते ho.',
      },
      {
        q: 'When should you use `time.time()`, `time.perf_counter()`, and `time.monotonic()`?',
        qHi: 'Aapko `time.time()`, `time.perf_counter()`, aur `time.monotonic()` kab istemal karna chahiye?',
        a: 'They answer different questions. time dot time returns the current wall-clock time as seconds since the Unix epoch. It is the right choice when you need an actual calendar timestamp — recording when an event happened, comparing against a stored time, anything that has to correspond to real-world time. Its defining property is that it follows the system clock, which means it can jump: forward or backward when NTP corrects drift, at a daylight-saving transition, or if someone sets the clock manually. That makes it wrong for measuring how long an operation took, because subtracting two readings can give you a negative number or a value that is off by the size of a clock adjustment. time dot perf_counter is a monotonic clock — it only ever moves forward — with the highest resolution the platform can provide, typically sub-microsecond. It has no defined relationship to wall-clock time; only differences between two readings are meaningful. It is the correct tool for benchmarking and for measuring elapsed time precisely: take a reading before, a reading after, subtract. time dot monotonic is also monotonic and also immune to clock jumps, but with coarser resolution and lower overhead. It is intended for timeouts, scheduling, and rate limiting — cases where you need "has enough time passed" rather than a precise duration, and where you might call it frequently. The rule of thumb: time dot time for timestamps that mean something on a calendar, perf_counter for measuring durations accurately, monotonic for timeout and interval logic. And never use time dot time or datetime dot now to measure how long code ran.',
        aHi: 'Wo alag sawaalों ka jawaab deते hain. time dot time current wall-clock time Unix epoch se seconds ki tarah lautaता hai. Ye sahi chunaav hai jab aapko ek asli calendar timestamp chahiye — record karna kab ek event hua. Iski defining property ye hai ki ye system clock follow karता hai, jiska matlab ye jump kar sakta hai. Ye ek operation kitna samay liya maapne ke liye galat hai, kyunki do readings ghatाना aapko ek negative number de sakta hai. time dot perf_counter ek monotonic clock hai — ye sirf aage badhता hai — platform ki sabse zyaada resolution ke saath. Ye benchmarking aur elapsed time precisely maapne ke liye sahi tool hai. time dot monotonic bhi monotonic hai par coarser resolution ke saath. Ye timeouts, scheduling, aur rate limiting ke liye hai. Niyam: calendar par kuch matlab rakhne waale timestamps ke liye time dot time, durations accurately maapne ke liye perf_counter, timeout logic ke liye monotonic.',
      },
    ],

    exercises: [
      {
        task: 'Write `age_in(dob_iso, at_iso)` taking two ISO strings; parse with `fromisoformat`, and if either is naive, raise `ValueError("datetime must be timezone-aware")`. Return the difference in whole days. Test with two aware datetimes, and confirm a naive input is rejected.',
        taskHi: '`age_in(dob_iso, at_iso)` likhо jo do ISO strings le; `fromisoformat` se parse karो, aur agar koi naive hai, `ValueError("datetime must be timezone-aware")` raise karो. Poore days mein antar lautाओ.',
        hint: '`a = datetime.fromisoformat(dob_iso)`; `if a.tzinfo is None or a.tzinfo.utcoffset(a) is None: raise ValueError(...)`. Then `(b - a).days`.',
        hintHi: '`a = datetime.fromisoformat(dob_iso)`; `if a.tzinfo is None: raise ValueError(...)`. Phir `(b - a).days`.',
      },
      {
        task: 'Write `meeting_times(utc_iso, *zones)` that takes an aware UTC ISO string and a list of IANA zone names, and returns a dict mapping each zone to the local `isoformat()` string. Test with `"2026-08-31T15:00:00+00:00"` and `["Asia/Kolkata", "America/Los_Angeles", "Europe/London"]` — confirm each is the same instant.',
        taskHi: '`meeting_times(utc_iso, *zones)` likhо jo ek aware UTC ISO string aur IANA zone names ki ek list le, aur ek dict lautाe jo har zone ko local `isoformat()` string se map kare.',
        hint: '`dt = datetime.fromisoformat(utc_iso)`; `{z: dt.astimezone(ZoneInfo(z)).isoformat() for z in zones}`. All results represent the same UTC instant; `.astimezone(...).astimezone(timezone.utc)` would give back the original.',
        hintHi: '`dt = datetime.fromisoformat(utc_iso)`; `{z: dt.astimezone(ZoneInfo(z)).isoformat() for z in zones}`.',
      },
      {
        task: 'Write `find_large_files(root, min_kb)` using `pathlib`: recursively walk `root` with `rglob("*")`, filter to files (`is_file()`) whose `stat().st_size >= min_kb * 1024`, and return a list of `(relative_path_str, size_kb)` sorted by size descending. Build a temp tree with a few files of known sizes and verify.',
        taskHi: '`find_large_files(root, min_kb)` likhо `pathlib` istemal karके: `root` ko `rglob("*")` se recursively walk karो, files (`is_file()`) jinka `stat().st_size >= min_kb * 1024` hai unpar filter karो, aur size descending se sorted `(relative_path_str, size_kb)` ki list lautाओ.',
        hint: '`for p in Path(root).rglob("*"): if p.is_file() and p.stat().st_size >= min_kb * 1024: results.append((str(p.relative_to(root)), p.stat().st_size / 1024))`. Then `sorted(results, key=lambda t: -t[1])`.',
        hintHi: '`for p in Path(root).rglob("*"): if p.is_file() and p.stat().st_size >= min_kb * 1024: ...`. Phir `sorted(results, key=lambda t: -t[1])`.',
      },
    ],

    keyTakeaways: [
      'A datetime is AWARE if it has `tzinfo` (a defined UTC offset), NAIVE otherwise. You CANNOT subtract or compare a naive and an aware datetime — `TypeError`.',
      '`datetime.now()` and `datetime.strptime(...)` (without `%z`) return NAIVE datetimes. `datetime.now(timezone.utc)` returns AWARE. `datetime.utcnow()` is deprecated (returns naive — a trap).',
      'Discipline: store and compute in aware UTC; convert to a local zone (`dt.astimezone(ZoneInfo("Area/City"))`) only when displaying to a human. `zoneinfo` (stdlib 3.9+) replaced `pytz`.',
      '`.astimezone(zone)` keeps the same instant, changes the wall-clock view. `.replace(tzinfo=zone)` keeps the numbers, asserts a zone — only correct if you know the source zone.',
      '`dt.isoformat()` ↔ `datetime.fromisoformat(s)` for machine formats (both ends speak ISO 8601). `strftime`/`strptime` for custom/legacy formats.',
      '`timedelta.total_seconds()` is the full duration; `timedelta.seconds` is only the sub-day remainder (0..86399) — a common bug.',
      'Measure elapsed time with `time.perf_counter()` (monotonic, high-res). Use `time.monotonic()` for timeouts. NEVER `time.time()` / `datetime.now()` for durations — the wall clock can jump backward.',
      '`pathlib.Path`: `Path("a") / "b" / "c"` (OS-correct separator), `.name`/`.stem`/`.suffix`/`.parent`, `.exists()`/`.is_file()`, `.read_text(encoding="utf-8")`, `.glob()`/`.rglob()`, `.mkdir(parents=True, exist_ok=True)`. Never build paths by string concatenation.',
    ],
    keyTakeawaysHi: [
      'Ek datetime AWARE hai agar iske paas `tzinfo` hai (ek defined UTC offset), warna NAIVE. Aap ek naive aur ek aware datetime ghatा ya compare NAHI kar sakte — `TypeError`.',
      '`datetime.now()` aur `datetime.strptime(...)` (bina `%z`) NAIVE datetimes lautaते hain. `datetime.now(timezone.utc)` AWARE lautaता hai. `datetime.utcnow()` deprecated hai (naive lautaता hai — ek jaal).',
      'Anushaasan: aware UTC mein store aur compute karो; sirf ek insaan ko dikhाते waqt ek local zone mein convert karो (`dt.astimezone(ZoneInfo("Area/City"))`). `zoneinfo` (stdlib 3.9+) ne `pytz` ki jagah li.',
      '`.astimezone(zone)` wahi pal rakhता hai, wall-clock view badalता hai. `.replace(tzinfo=zone)` numbers rakhता hai, ek zone assert karता hai — sirf tab sahi agar aap source zone jaanते ho.',
      '`dt.isoformat()` ↔ `datetime.fromisoformat(s)` machine formats ke liye. `strftime`/`strptime` custom/legacy formats ke liye.',
      '`timedelta.total_seconds()` poori duration hai; `timedelta.seconds` sirf sub-day remainder hai (0..86399) — ek aam bug.',
      'Elapsed time `time.perf_counter()` se maapो (monotonic, high-res). Timeouts ke liye `time.monotonic()`. Durations ke liye KABHI `time.time()` / `datetime.now()` nahi.',
      '`pathlib.Path`: `Path("a") / "b" / "c"` (OS-sahi separator), `.name`/`.stem`/`.suffix`/`.parent`, `.exists()`/`.is_file()`, `.read_text(encoding="utf-8")`, `.glob()`/`.rglob()`. Kabhi string concatenation se paths mat banao.',
    ],
  },
];
