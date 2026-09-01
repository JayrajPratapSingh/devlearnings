/**
 * Python Complete Course — Module 9: Typing, Testing & Tooling, lessons 4-6.
 *
 * Lesson 4: pytest fundamentals — plain `assert` + introspection, test
 *           discovery, `pytest.raises`, `pytest.mark.parametrize`, `-v`/`-x`/
 *           `-k`, `pytest.approx`.
 * Lesson 5: pytest fixtures & organization — `@pytest.fixture`, `conftest.py`,
 *           scope, `yield` fixtures (setup/teardown), `tmp_path`, `monkeypatch`,
 *           `capsys`, `autouse`, markers.
 * Lesson 6: tooling — `ruff` (lint + format, replacing black/isort/flake8),
 *           `black` philosophy, `pdb` / `breakpoint()`, `logging` proper setup
 *           (`getLogger(__name__)`, levels, handlers, formatters, `dictConfig`,
 *           never `print`).
 *
 * NOTE for future editors: same rules as the rest of this course. Every
 * backtick inside simple/simpleHi/content/contentHi is `\`` (inline code inside
 * ``` blocks included). Escape `$` before `{` inside template literals as `\${`.
 * Keep example OUTPUT ASCII-only. `examples` use `code` + `output`; run every
 * sample with `python`. The pytest examples write a fixed `test_x.py` to a temp
 * dir and run `python -m pytest -q` via subprocess, then normalise the timing
 * line (`in 0.05s` -> `in Ns`) and the progress-line trailing whitespace so the
 * output is deterministic. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_9_PART2: CourseLesson[] = [
  {
    slug: 'py-pytest-fundamentals',
    title: 'pytest Fundamentals: assert, Discovery, raises, parametrize',
    titleHi: 'pytest Fundamentals: assert, Discovery, raises, parametrize',
    description: 'Coming from a framework where every test needs `self.assertEqual(a, b)` and a class, and finding pytest lets you write `assert a == b` in a plain function — and still get a detailed diff when it fails. pytest\'s conventions (file names, function names) and its three or four core features cover most of what you write.',
    descriptionHi: 'Ek framework se aana jahaan har test ko `self.assertEqual(a, b)` aur ek class chahiye, aur paana ki pytest aapko ek plain function mein `assert a == b` likhne deta hai — aur fail hone par ek vistृत diff bhi deता hai. pytest ke conventions (file names, function names) aur iske teen-chaar core features adhikaansh cover karते hain jo aap likhते ho.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 4,

    analogy: {
      en: '**A checklist that reads itself and circles what went wrong.** A weak checklist just has boxes; when an inspection fails you get a bare "FAIL" and have to work out which line and why. pytest is a checklist that, when a line fails, shows you the exact statement, the actual values on both sides, and how they differ — "expected 5, got 4, where 4 = add(2, 2)". You write each check as one plain sentence: `assert the_total == 5`. pytest finds your checklists by name (files starting `test_`, functions starting `test_`), runs each check, and for the ones that fail rewrites the assertion into a readable report. Three power tools sit on top: `raises` is a check that a specific alarm *did* go off ("this must throw a permission error"); `parametrize` is one check run against a table of inputs so you write the logic once and get a row per case; and the command-line flags let you run just the failing one, stop at the first failure, or run only checks whose name matches a keyword.',
      hi: '**Ek checklist jo khud padhती hai aur circle karती hai kya galat hua.** Ek kamzor checklist mein bस boxes hote hain; jab ek inspection fail hoती hai aapko ek nanga "FAIL" milता hai. pytest ek checklist hai jo, jab ek line fail hoती hai, aapko exact statement dikhाती hai, dono taraf ki actual values, aur wo kaise alag hain — "expected 5, got 4, where 4 = add(2, 2)". Aap har check ko ek plain vaakya ki tarah likhते ho: `assert the_total == 5`. pytest aapki checklists ko naam se dhoondhता hai (`test_` se shuru files, `test_` se shuru functions). Teen power tools upar baithते hain: `raises` ek check hai ki ek specific alarm *baja*; `parametrize` ek check hai jo inputs ke ek table ke khilaaf chalता hai; aur command-line flags aapko sirf failing wala chalाने dete hain.',
    },

    simple: `**A test is a plain function whose name starts with \`test_\`**

\`\`\`python
# file: test_math.py

def add(a, b):
    return a + b

def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2

def test_add_types():
    assert add("a", "b") == "ab"
\`\`\`

\`\`\`bash
pytest                    # discovers and runs every test_*.py / *_test.py
pytest test_math.py       # one file
pytest test_math.py::test_add_positive   # one test
pytest -v                 # verbose: one line per test with PASS/FAIL
pytest -x                 # stop at the first failure
pytest -k "add and not negative"   # run tests whose name matches the expression
pytest -q                 # quiet: dots only + summary
\`\`\`

**\`assert\` gets rewritten to show WHY it failed**

\`\`\`python
def test_it():
    result = add(2, 2)
    assert result == 5

# pytest output:
#   >       assert result == 5
#   E       assert 4 == 5
#   E        +  where 4 = add(2, 2)
\`\`\`

You write a bare \`assert\`; pytest introspects the expression and prints both sides.

**\`pytest.raises\` — assert that an exception is raised**

\`\`\`python
import pytest

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0

def test_bad_input_message():
    with pytest.raises(ValueError, match="must be positive"):
        set_age(-5)                     # match= checks the exception message (regex)

def test_capture_the_exception():
    with pytest.raises(KeyError) as exc_info:
        {}["missing"]
    assert exc_info.value.args[0] == "missing"
\`\`\`

**\`@pytest.mark.parametrize\` — one test, many cases**

\`\`\`python
@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (100, 200, 300),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
# -> runs as 4 separate tests: test_add[2-3-5], test_add[-1-1-0], ...
\`\`\`

**\`pytest.approx\` — compare floats**

\`\`\`python
def test_float():
    assert 0.1 + 0.2 == pytest.approx(0.3)     # exact == would FAIL (0.30000000000000004)
\`\`\`

\`\`\`
DISCOVERY:   files  test_*.py  or  *_test.py     functions/methods  test_*
             classes  Test*  (no __init__)       run from the project root

ASSERT:      plain  assert expr  ->  pytest rewrites it to show operands on failure
             assert a == b   assert x in lst   assert obj.attr   assert not flag

pytest.raises(ExcType[, match="regex"])   as exc_info  ->  exc_info.value / .type / .traceback
pytest.warns(Warning)                     same for warnings
pytest.approx(value[, rel=..., abs=...])  float / nested-structure comparison

@pytest.mark.parametrize("names", [cases...])   one test body, N cases, N reported results
@pytest.mark.skip(reason=...) / .skipif(cond, reason=...) / .xfail(reason=...)

CLI:  pytest [path]   -v (verbose)   -x (stop on first fail)   -q (quiet)
      -k EXPR (name filter)   -s (don't capture stdout)   --lf (last failed)
      -m MARKER (run marked tests)   --tb=short|long|line (traceback style)
\`\`\``,

    simpleHi: `**Ek test ek plain function hai jiska naam \`test_\` se shuru hoता hai**

\`\`\`python
# file: test_math.py

def add(a, b):
    return a + b

def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2
\`\`\`

\`\`\`bash
pytest                    # har test_*.py / *_test.py discover aur run karता hai
pytest test_math.py::test_add_positive   # ek test
pytest -v                 # verbose: prati test ek line PASS/FAIL ke saath
pytest -x                 # pehle failure par ruko
pytest -k "add and not negative"   # naam expression se match karne waale tests
\`\`\`

**\`assert\` rewrite hoता hai KYUN fail hua dikhाने ko**

\`\`\`python
def test_it():
    result = add(2, 2)
    assert result == 5

# pytest output:
#   >       assert result == 5
#   E       assert 4 == 5
#   E        +  where 4 = add(2, 2)
\`\`\`

Aap ek nanga \`assert\` likhते ho; pytest expression introspect karता hai aur dono taraf print karता hai.

**\`pytest.raises\` — assert ki ek exception raise hoता hai**

\`\`\`python
import pytest

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0

def test_bad_input_message():
    with pytest.raises(ValueError, match="must be positive"):
        set_age(-5)                     # match= exception message check karता hai (regex)
\`\`\`

**\`@pytest.mark.parametrize\` — ek test, kai cases**

\`\`\`python
@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
])
def test_add(a, b, expected):
    assert add(a, b) == expected
# -> 3 alag tests ki tarah chalता hai: test_add[2-3-5], test_add[-1-1-0], ...
\`\`\`

**\`pytest.approx\` — floats compare karो**

\`\`\`python
def test_float():
    assert 0.1 + 0.2 == pytest.approx(0.3)     # exact == FAIL hoता (0.30000000000000004)
\`\`\`

\`\`\`
DISCOVERY:   files  test_*.py  ya  *_test.py     functions/methods  test_*
             classes  Test*  (koi __init__ nahi)   project root se run karो

ASSERT:      plain  assert expr  ->  pytest ise operands dikhाने ko rewrite karता hai
pytest.raises(ExcType[, match="regex"])   as exc_info  ->  exc_info.value / .type
pytest.approx(value[, rel=..., abs=...])  float comparison

@pytest.mark.parametrize("names", [cases...])   ek test body, N cases, N results
@pytest.mark.skip / .skipif(cond) / .xfail(reason)

CLI:  pytest [path]   -v   -x   -q   -k EXPR   -s   --lf (last failed)   -m MARKER
\`\`\``,

    content: `## Discovery rules

pytest collects tests by convention, from the current directory down:

- **Files:** \`test_*.py\` or \`*_test.py\`
- **Functions:** names starting \`test\`
- **Classes:** names starting \`Test\` (and they must NOT have an \`__init__\` method)
- **Methods** in those classes: names starting \`test\`

\`\`\`python
class TestCalculator:              # collected -- no __init__
    def test_add(self):
        assert 1 + 1 == 2
    def test_sub(self):
        assert 3 - 1 == 2
\`\`\`

A \`conftest.py\` at any level holds fixtures and hooks shared by tests in that directory tree (next lesson).

## Assertion introspection

pytest rewrites \`assert\` statements at import time so a failure shows the operands:

\`\`\`
assert user.age == 18
E   assert 25 == 18
E    +  where 25 = <User id=1>.age

assert "admin" in roles
E   assert 'admin' in ['user', 'editor']

assert result == expected
E   assert {'a': 1, 'b': 3} == {'a': 1, 'b': 2}
E     Differing items:
E     {'b': 3} != {'b': 2}
\`\`\`

You do not need \`assertEqual\`, \`assertIn\`, \`assertTrue\` — a plain \`assert\` with the right expression gives a better message. Add a custom message with \`assert x == y, "context"\` only when the expression alone is not clear.

## \`pytest.raises\` in depth

\`\`\`python
# the block MUST raise the given type (or a subclass) or the test fails:
with pytest.raises(ValueError):
    int("not a number")

# match= applies a regex to str(exception):
with pytest.raises(ValueError, match=r"invalid literal"):
    int("x")

# capture and inspect the exception:
with pytest.raises(CustomError) as exc_info:
    do_thing()
assert exc_info.value.code == 42
assert exc_info.type is CustomError

# assert something does NOT raise -> just call it (no wrapper needed):
result = should_not_raise()          # a stray exception fails the test naturally
\`\`\`

## \`parametrize\` — patterns

\`\`\`python
# multiple params:
@pytest.mark.parametrize("text, expected", [
    ("hello world", 2),
    ("", 0),
    ("one", 1),
    ("  spaced  out  ", 2),
])
def test_word_count(text, expected):
    assert word_count(text) == expected

# stacked parametrize -> Cartesian product (2 x 3 = 6 tests):
@pytest.mark.parametrize("base", [2, 10])
@pytest.mark.parametrize("exp", [0, 1, 2])
def test_pow(base, exp):
    assert pow(base, exp) == base ** exp

# ids for readable test names:
@pytest.mark.parametrize("value, ok", [
    ("a@b.com", True),
    ("no-at-sign", False),
], ids=["valid", "missing-@"])
def test_email(value, ok):
    assert is_valid_email(value) is ok

# mark one case as expected-fail:
@pytest.mark.parametrize("n", [1, 2, pytest.param(0, marks=pytest.mark.xfail)])
def test_reciprocal(n):
    assert 1 / n > 0
\`\`\`

## Markers: skip, skipif, xfail

\`\`\`python
@pytest.mark.skip(reason="not implemented yet")
def test_future(): ...

@pytest.mark.skipif(sys.platform == "win32", reason="POSIX only")
def test_posix_thing(): ...

@pytest.mark.xfail(reason="known bug #123", strict=True)
def test_known_bug(): ...        # PASSES if it fails; FAILS if it unexpectedly passes (strict)
\`\`\`

Custom markers (e.g. \`@pytest.mark.slow\`) must be registered in \`pyproject.toml\` under \`[tool.pytest.ini_options] markers = [...]\` and are run/excluded with \`-m slow\` / \`-m "not slow"\`.

## \`pytest.approx\`

\`\`\`python
assert 0.1 + 0.2 == pytest.approx(0.3)
assert [0.1 + 0.2, 0.2 + 0.1] == pytest.approx([0.3, 0.3])
assert {"x": 0.1 + 0.2} == pytest.approx({"x": 0.3})
assert value == pytest.approx(expected, rel=1e-3)      # relative tolerance
assert value == pytest.approx(expected, abs=1e-9)      # absolute tolerance
\`\`\`

Never compare computed floats with \`==\` — use \`approx\`.

## Config

\`\`\`toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-ra -q --strict-markers"    # -ra = show reasons for skips/xfails; strict-markers = typo'd markers error
markers = [
    "slow: marks tests as slow",
    "integration: hits a real service",
]
\`\`\``,

    contentHi: `## Discovery niyam

pytest convention se tests collect karता hai, current directory se neeche:

- **Files:** \`test_*.py\` ya \`*_test.py\`
- **Functions:** \`test\` se shuru names
- **Classes:** \`Test\` se shuru names (aur unmein \`__init__\` method NAHI hona chahiye)
- **Methods:** un classes mein \`test\` se shuru names

\`\`\`python
class TestCalculator:              # collected -- koi __init__ nahi
    def test_add(self):
        assert 1 + 1 == 2
\`\`\`

Kisi bhi level par ek \`conftest.py\` us directory tree mein tests dwara share kiye fixtures aur hooks rakhता hai (agla lesson).

## Assertion introspection

pytest import time par \`assert\` statements rewrite karता hai taaki ek failure operands dikhाe:

\`\`\`
assert user.age == 18
E   assert 25 == 18
E    +  where 25 = <User id=1>.age

assert result == expected
E   assert {'a': 1, 'b': 3} == {'a': 1, 'b': 2}
\`\`\`

Aapko \`assertEqual\`, \`assertIn\`, \`assertTrue\` ki zaroorat nahi — sahi expression ke saath ek plain \`assert\` ek behtar message deta hai.

## \`pytest.raises\` gehraai mein

\`\`\`python
with pytest.raises(ValueError):
    int("not a number")

with pytest.raises(ValueError, match=r"invalid literal"):
    int("x")

with pytest.raises(CustomError) as exc_info:
    do_thing()
assert exc_info.value.code == 42

# assert ki kuch raise NAHI hoता -> bस ise call karो
result = should_not_raise()
\`\`\`

## \`parametrize\` — patterns

\`\`\`python
@pytest.mark.parametrize("text, expected", [
    ("hello world", 2),
    ("", 0),
    ("one", 1),
])
def test_word_count(text, expected):
    assert word_count(text) == expected

# stacked parametrize -> Cartesian product (2 x 3 = 6 tests):
@pytest.mark.parametrize("base", [2, 10])
@pytest.mark.parametrize("exp", [0, 1, 2])
def test_pow(base, exp):
    assert pow(base, exp) == base ** exp

# readable test names ke liye ids:
@pytest.mark.parametrize("value, ok", [
    ("a@b.com", True),
    ("no-at-sign", False),
], ids=["valid", "missing-at"])
def test_email(value, ok):
    assert is_valid_email(value) is ok
\`\`\`

## Markers: skip, skipif, xfail

\`\`\`python
@pytest.mark.skip(reason="not implemented yet")
def test_future(): ...

@pytest.mark.skipif(sys.platform == "win32", reason="POSIX only")
def test_posix_thing(): ...

@pytest.mark.xfail(reason="known bug #123", strict=True)
def test_known_bug(): ...        # PASS agar fail; FAIL agar anhonahi pass (strict)
\`\`\`

## \`pytest.approx\`

\`\`\`python
assert 0.1 + 0.2 == pytest.approx(0.3)
assert [0.1 + 0.2] == pytest.approx([0.3])
assert value == pytest.approx(expected, rel=1e-3)
\`\`\`

Computed floats ko kabhi \`==\` se compare mat karो — \`approx\` istemal karो.

## Config

\`\`\`toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-ra -q --strict-markers"
markers = [
    "slow: marks tests as slow",
    "integration: hits a real service",
]
\`\`\``,

    examples: [
      {
        title: 'Discovery, assertion introspection, and a failing test',
        titleHi: 'Discovery, assertion introspection, aur ek failing test',
        code: `import subprocess, sys, textwrap, tempfile, os, re

d = tempfile.mkdtemp()
open(os.path.join(d, "test_calc.py"), "w").write(textwrap.dedent('''
    def add(a, b):
        return a + b

    def test_add_ok():
        assert add(2, 3) == 5

    def test_add_fails():
        result = add(2, 2)
        assert result == 5

    def test_membership_fails():
        roles = ["user", "editor"]
        assert "admin" in roles
'''))

r = subprocess.run([sys.executable, "-m", "pytest", "-q", "test_calc.py"],
                   cwd=d, capture_output=True, text=True)
out = re.sub(r"in \\d+\\.\\d+s", "in Ns", r.stdout)     # normalise the timing
out = re.sub(r"\\s+\\[100%\\]", " [100%]", out)          # normalise progress padding
print(out, end="")`,
        output: `.FF [100%]
================================== FAILURES ===================================
_______________________________ test_add_fails ________________________________

    def test_add_fails():
        result = add(2, 2)
>       assert result == 5
E       assert 4 == 5

test_calc.py:10: AssertionError
____________________________ test_membership_fails ____________________________

    def test_membership_fails():
        roles = ["user", "editor"]
>       assert "admin" in roles
E       AssertionError: assert 'admin' in ['user', 'editor']

test_calc.py:14: AssertionError
=========================== short test summary info ===========================
FAILED test_calc.py::test_add_fails - assert 4 == 5
FAILED test_calc.py::test_membership_fails - AssertionError: assert 'admin' i...
2 failed, 1 passed in Ns
`,
        explain: 'pytest discovers `test_calc.py` and its three `test_*` functions automatically. The progress line `.FF` shows one pass then two fails (the `[100%]` padding is trimmed here). For each failure it reprints the assertion with a `>` marker and, on the `E` line, the introspected result — `assert 4 == 5` (both operands shown, no `assertEqual` needed) and `assert \'admin\' in [\'user\', \'editor\']` (the actual list; pytest prefixes `AssertionError:` for membership checks). The summary lists each failure with its short reason and the pass/fail counts.',
        explainHi: 'pytest `test_calc.py` aur iske teen `test_*` functions apne aap discover karता hai. Progress line `.FF` ek pass phir do fails dikhाती hai. Har failure ke liye ye assertion ko ek `>` marker ke saath aur `E` line par introspected result reprint karता hai — `assert 4 == 5` (dono operands dikhाe, koi `assertEqual` nahi chahiye).',
      },
      {
        title: 'pytest.raises, parametrize, and approx',
        titleHi: 'pytest.raises, parametrize, aur approx',
        code: `import subprocess, sys, textwrap, tempfile, os, re

d = tempfile.mkdtemp()
open(os.path.join(d, "test_features.py"), "w").write(textwrap.dedent('''
    import pytest

    def set_age(age):
        if age < 0:
            raise ValueError("age must be non-negative")
        return age

    def test_raises_type():
        with pytest.raises(ValueError):
            set_age(-1)

    def test_raises_message():
        with pytest.raises(ValueError, match="non-negative"):
            set_age(-5)

    def test_raises_capture():
        with pytest.raises(ValueError) as exc:
            set_age(-3)
        assert "non-negative" in str(exc.value)

    @pytest.mark.parametrize("a, b, expected", [
        (2, 3, 5), (-1, 1, 0), (0, 0, 0), (10, 20, 30),
    ])
    def test_add(a, b, expected):
        assert a + b == expected

    def test_float_approx():
        assert 0.1 + 0.2 == pytest.approx(0.3)

    @pytest.mark.parametrize("n", [1, 2, 5])
    def test_reciprocal_positive(n):
        assert 1 / n > 0
'''))

r = subprocess.run([sys.executable, "-m", "pytest", "-v", "test_features.py"],
                   cwd=d, capture_output=True, text=True)
out = re.sub(r"in \\d+\\.\\d+s", "in Ns", r.stdout)
out = re.sub(r" +\\[ *\\d+%\\]", "", out)
# keep just the test-result lines and the summary (stripping the "===" banner):
lines = [re.sub(r"^=+ | =+$", "", ln) for ln in out.splitlines()
         if "::" in ln or "passed" in ln]
print("\\n".join(lines))`,
        output: `test_features.py::test_raises_type PASSED
test_features.py::test_raises_message PASSED
test_features.py::test_raises_capture PASSED
test_features.py::test_add[2-3-5] PASSED
test_features.py::test_add[-1-1-0] PASSED
test_features.py::test_add[0-0-0] PASSED
test_features.py::test_add[10-20-30] PASSED
test_features.py::test_float_approx PASSED
test_features.py::test_reciprocal_positive[1] PASSED
test_features.py::test_reciprocal_positive[2] PASSED
test_features.py::test_reciprocal_positive[5] PASSED
11 passed in Ns`,
        explain: '`pytest.raises(ValueError)` passes only if the block raises that type; `match="non-negative"` additionally regex-checks the message; `as exc` captures the exception for further assertions on `exc.value`. `@parametrize("a, b, expected", [...])` turns one `test_add` body into four reported tests named `test_add[2-3-5]` etc. `pytest.approx(0.3)` makes the float comparison tolerate binary rounding. `-v` shows one line per test with its full id.',
        explainHi: '`pytest.raises(ValueError)` sirf tab pass hoता hai agar block us type ko raise kare; `match="non-negative"` atirikt roop se message regex-check karता hai; `as exc` exception capture karता hai. `@parametrize` ek `test_add` body ko chaar reported tests mein badalता hai. `pytest.approx(0.3)` float comparison ko binary rounding sehne deta hai.',
      },
      {
        title: 'skip, skipif, xfail, and -k / -x flags',
        titleHi: 'skip, skipif, xfail, aur -k / -x flags',
        code: `import subprocess, sys, textwrap, tempfile, os, re

d = tempfile.mkdtemp()
open(os.path.join(d, "test_marks.py"), "w").write(textwrap.dedent('''
    import pytest, sys

    def test_normal():
        assert 1 == 1

    @pytest.mark.skip(reason="not built yet")
    def test_future():
        assert False

    @pytest.mark.skipif(sys.version_info < (3, 99), reason="needs Python 3.99")
    def test_needs_future_python():
        assert False

    @pytest.mark.xfail(reason="known bug #42")
    def test_known_bug():
        assert 1 == 2

    @pytest.mark.xfail(reason="should be fixed", strict=False)
    def test_maybe_fixed():
        assert 1 == 1     # xpass -- passed unexpectedly (non-strict -> not a failure)
'''))

r = subprocess.run([sys.executable, "-m", "pytest", "-rsxX", "-q", "test_marks.py"],
                   cwd=d, capture_output=True, text=True)
out = re.sub(r"in \\d+\\.\\d+s", "in Ns", r.stdout)
out = re.sub(r"\\s+\\[100%\\]", " [100%]", out)
# drop the SKIPPED/XFAIL detail paths (machine-specific), keep the shape:
out = re.sub(r"(SKIPPED|XFAIL|XPASS) \\[\\d+\\][^\\n]*", r"\\1", out)
out = re.sub(r"(?<= )reason: ", "", out)                   # older pytest prefixed "reason: "
out = re.sub(r"^=+ XPASSES =+\\n", "", out, flags=re.M)    # drop the empty XPASSES banner
print(out, end="")`,
        output: `.ssxX [100%]
=========================== short test summary info ===========================
SKIPPED
SKIPPED
XFAIL test_marks.py::test_known_bug - known bug #42
XPASS test_marks.py::test_maybe_fixed - should be fixed
1 passed, 2 skipped, 1 xfailed, 1 xpassed in Ns
`,
        explain: 'The progress line `.ssxX` reads: pass, skip, skip, xfail, xpass (the five tests in file order). `@skip` and a false `@skipif` both skip (the body never runs). `@xfail` on a genuinely failing test reports `xfailed` (expected — not a failure). `@xfail(strict=False)` on a test that actually passes reports `xpassed` (a warning, not a failure — with `strict=True` it would fail). `-rsxX` makes the summary list the skipped and xfail/xpass tests.',
        explainHi: 'Progress line `.ssxX` padhती hai: pass, skip, skip, xfail, xpass (file kram mein paanch tests). `@skip` aur ek false `@skipif` dono skip karते hain. Ek sachmuch failing test par `@xfail` `xfailed` report karता hai (expected — ek failure nahi). Ek test par `@xfail(strict=False)` jo asal mein pass hoता hai `xpassed` report karता hai. `-rsxX` summary mein skipped aur xfail/xpass tests list karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `import unittest

class TestThing(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(2, 3), 5)
        self.assertIn("x", ["x", "y"])
        self.assertTrue(is_valid(v))`,
        right: `def test_add():
    assert add(2, 3) == 5
    assert "x" in ["x", "y"]
    assert is_valid(v)`,
        why: 'With pytest you do not need `unittest.TestCase`, `self`, or the `assertXxx` family. A plain function with plain `assert` statements is shorter, and pytest\'s assertion rewriting gives a *better* failure message than `assertEqual` (it shows both operands and how they differ). Use pytest style unless you are stuck maintaining a `unittest` suite.',
        whyHi: 'pytest ke saath aapko `unittest.TestCase`, `self`, ya `assertXxx` family ki zaroorat nahi. Plain `assert` statements waala ek plain function chhota hai, aur pytest ki assertion rewriting `assertEqual` se ek *behtar* failure message deती hai.',
      },
      {
        wrong: `def test_computed_average():
    assert compute_average([1, 2, 3]) == 2.0      # sometimes 1.9999999999999998
    assert 0.1 + 0.2 == 0.3                       # always False`,
        right: `import pytest

def test_computed_average():
    assert compute_average([1, 2, 3]) == pytest.approx(2.0)
    assert 0.1 + 0.2 == pytest.approx(0.3)`,
        why: 'Comparing computed floating-point results with `==` is fragile — binary rounding means `0.1 + 0.2` is not exactly `0.3`, and division/accumulation introduce tiny errors. `pytest.approx(value)` compares within a sensible relative tolerance (customisable with `rel=`/`abs=`), and works on lists and dicts of floats too.',
        whyHi: 'Computed floating-point results ko `==` se compare karna nazuk hai — binary rounding matlab `0.1 + 0.2` bilkul `0.3` nahi hai. `pytest.approx(value)` ek समझदार relative tolerance ke andar compare karता hai.',
      },
      {
        wrong: `def test_raises():
    try:
        risky()
    except ValueError:
        pass                     # test PASSES even if risky() does NOT raise
    # or worse: no assertion at all -> a green test that checks nothing`,
        right: `import pytest

def test_raises():
    with pytest.raises(ValueError):
        risky()                  # test FAILS if risky() does not raise ValueError`,
        why: 'A hand-rolled `try/except: pass` around the code under test passes whether or not the exception is raised — a test that always goes green regardless of behaviour. `pytest.raises(ExcType)` as a context manager fails the test if the block does *not* raise the expected type, which is what you actually want to assert.',
        whyHi: 'Test ke code ke aas-paas ek haath-se-bana `try/except: pass` pass hoता hai chahe exception raise ho ya nahi. `pytest.raises(ExcType)` ek context manager ki tarah test fail karता hai agar block expected type *nahi* raise karता.',
      },
    ],

    realWorld: [
      {
        en: '**pytest is the de-facto standard for Python testing** — Django (`pytest-django`), FastAPI, Flask, libraries, and internal codebases nearly all use it. `unittest` is stdlib and still seen in older code, but new suites are pytest. The plain-`assert` + `parametrize` + fixtures combination is what you write day to day.',
        hi: '**pytest Python testing ke liye de-facto standard hai** — Django (`pytest-django`), FastAPI, Flask, libraries sab ise istemal karते hain. `unittest` stdlib hai aur purane code mein dikhता hai, par naye suites pytest hain.',
      },
      {
        en: '**`@pytest.mark.parametrize` is how you test validation, parsing, and edge cases without copy-pasting test bodies** — a table of `(input, expected)` rows, each becoming a named test. A regression is added as one more row. `ids=` gives readable names in the output and in `-k` filters.',
        hi: '**`@pytest.mark.parametrize` aise aap validation, parsing, aur edge cases test karते ho bina test bodies copy-paste kiye** — `(input, expected)` rows ka ek table. Ek regression ek aur row ki tarah joda jाता hai.',
      },
      {
        en: '**`pytest.raises(SpecificError, match="...")` is the standard way to test error paths** — that a validator rejects bad input with the right message, that an API returns the right exception, that a parser fails loudly on malformed data. Testing the *message* (with `match=`) keeps error text stable for users.',
        hi: '**`pytest.raises(SpecificError, match="...")` error paths test karne ka standard tarika hai** — ki ek validator bad input ko sahi message ke saath reject karता hai. *Message* test karna users ke liye error text stable rakhता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'How does pytest differ from `unittest`, and how does its assertion introspection work?',
        qHi: 'pytest `unittest` se kaise alag hai, aur iski assertion introspection kaise kaam karती hai?',
        a: 'unittest is the standard library testing framework, modelled on Java-style xUnit: tests are methods on a class that inherits from TestCase, and you check conditions with a family of methods like assertEqual, assertTrue, assertIn, assertRaises. pytest takes a lighter approach. A test is just a function whose name starts with test, in a file whose name starts or ends with test; no class or base class is required, though you can group tests in a class whose name starts with Test if you want. Instead of the assert-method family, you write a plain assert statement with any boolean expression. The key feature that makes this work as well as it does is assertion introspection, also called assertion rewriting. When pytest imports a test module, it rewrites the abstract syntax tree, replacing each assert statement with instrumented code that, if the assertion fails, evaluates and captures the sub-expressions and produces a detailed failure message. So assert result equals five, when result is four, does not just say "assertion failed" — it prints "assert 4 equals 5", showing both operands, and if the four came from a function call it adds a line like "where 4 = add(2, 2)". For a dict or list comparison it shows which items differ. This is strictly more information than assertEqual gives you, with less code. pytest also brings parametrize, a decorator that runs one test body against a table of input rows, each reported as a separate named test; fixtures, a dependency-injection system for setup and teardown that is more composable than setUp and tearDown methods; and a rich plugin ecosystem. It can also run existing unittest test cases unchanged, so migration is incremental. The practical summary: pytest tests are plain functions with plain asserts, and you almost never need the assert-method vocabulary.',
        aHi: 'unittest standard library testing framework hai, Java-style xUnit par modelled: tests ek class par methods hain jo TestCase se inherit karती hai, aur aap assertEqual, assertTrue jaisी methods se conditions check karते ho. pytest ek halka approach leta hai. Ek test bस ek function hai jiska naam test se shuru hoता hai, ek file mein jiska naam test se shuru ya khatam hoता hai; koi class zaroori nahi. assert-method family ke bजaay, aap kisi bhi boolean expression ke saath ek plain assert statement likhते ho. Mukhya feature assertion introspection hai. Jab pytest ek test module import karता hai, ye abstract syntax tree rewrite karता hai, har assert statement ko instrumented code se badalते hue jo, agar assertion fail hoती hai, sub-expressions capture karता hai aur ek vistृत failure message banाता hai. Toh assert result equals five, jab result four hai, sirf "assertion failed" nahi kahta — ye "assert 4 equals 5" print karता hai. pytest parametrize aur fixtures bhi laता hai.',
      },
      {
        q: 'What does `@pytest.mark.parametrize` do, and why is it better than a loop inside one test?',
        qHi: '`@pytest.mark.parametrize` kya karता hai, aur ye ek test ke andar ek loop se behtar kyun hai?',
        a: 'parametrize is a decorator that takes the names of some parameters and a list of value tuples, and runs the decorated test function once per tuple, injecting the values as arguments. Each run is collected and reported as its own separate test, with a generated name that includes the parameter values, like test_add with square brackets 2 dash 3 dash 5. So one test body written once produces N independent test results. The alternative — writing a for loop inside a single test that iterates over the cases and asserts each — has several disadvantages. If one case fails, the loop stops at the first failed assertion, so you do not learn whether the other cases also fail; with parametrize, every case runs and you see the full picture. The single looping test reports as one pass or one fail, so you lose granularity in the output and in metrics. You cannot select or skip an individual case; parametrize lets you filter with the k flag by the generated name, mark a single case as expected-fail with pytest dot param and a marks argument, or give cases readable ids. And a failure in the loop names the whole test, not the specific input, so you have to read the traceback to find which row broke, whereas parametrize puts the failing input right in the test id and the failure header. There is also a composition benefit: stacking multiple parametrize decorators produces the Cartesian product of their value lists automatically, which is tedious to write as nested loops. The practical rule is that whenever you find yourself testing the same logic against several inputs, parametrize it: adding a regression case later is then a one-line change, adding a row to the table.',
        aHi: 'parametrize ek decorator hai jo kuch parameters ke names aur value tuples ki ek list leta hai, aur decorated test function ko prati tuple ek baar chalाता hai, values ko arguments ki tarah inject karते hue. Har run apne alag test ki tarah collect aur report hoता hai, ek generated naam ke saath jismein parameter values shaamil hain. Toh ek baar likha ek test body N swतंत्r test results banाता hai. Vikalp — ek single test ke andar ek for loop likhna jo cases par iterate karता hai — ke kai nuksaan hain. Agar ek case fail hoता hai, loop pehle failed assertion par ruk jाता hai. Single looping test ek pass ya ek fail ki tarah report hoता hai. Aap ek individual case ko select ya skip nahi kar sakte. Aur loop mein ek failure poore test ko naam deता hai, specific input ko nahi. Ek composition faayda bhi hai: kai parametrize decorators stack karna unki value lists ka Cartesian product banाता hai. Niyam: jab bhi aap khud ko wahi logic kai inputs ke khilaaf test karते paate ho, ise parametrize karो.',
      },
    ],

    exercises: [
      {
        task: 'Write `test_slugify.py` with a `slugify(s)` function (lowercase, spaces -> `-`, strip non-alphanumerics) and a `@pytest.mark.parametrize` test covering: `"Hello World"` -> `"hello-world"`, `"  Trim  Me  "` -> `"trim-me"`, `""` -> `""`, `"a!!!b"` -> `"a-b"`. Run it with `pytest -v` via subprocess and confirm 4 named results, all PASSED.',
        taskHi: '`test_slugify.py` likhо ek `slugify(s)` function aur ek `@pytest.mark.parametrize` test ke saath jo cover kare: `"Hello World"` -> `"hello-world"` etc. Ise subprocess se `pytest -v` se chalाओ aur 4 named results confirm karो.',
        hint: '`@pytest.mark.parametrize("raw, expected", [("Hello World", "hello-world"), ...])`. Run `[sys.executable, "-m", "pytest", "-v", "test_slugify.py"]` and grep the output for lines with `::` — you should see `test_slugify[Hello World-hello-world] PASSED` etc.',
        hintHi: '`@pytest.mark.parametrize("raw, expected", [...])`. `[sys.executable, "-m", "pytest", "-v", "test_slugify.py"]` chalाओ aur `::` waali lines grep karो.',
      },
      {
        task: 'Write `test_validate.py` testing a `validate_age(age)` that raises `ValueError("age must be 0-150")` for out-of-range and `TypeError` for non-int. Use `pytest.raises` three ways: bare type, `match=` on the message, and `as exc` capturing the exception to assert on `exc.value.args`. Run and confirm all pass.',
        taskHi: '`test_validate.py` likhо jo ek `validate_age(age)` test kare jo out-of-range ke liye `ValueError("age must be 0-150")` aur non-int ke liye `TypeError` raise kare. `pytest.raises` teen tarikon se istemal karो.',
        hint: '`with pytest.raises(ValueError): validate_age(-1)`. `with pytest.raises(ValueError, match="0-150"): validate_age(200)`. `with pytest.raises(TypeError) as exc: validate_age("x")` then `assert exc.type is TypeError`.',
        hintHi: '`with pytest.raises(ValueError): validate_age(-1)`. `with pytest.raises(ValueError, match="0-150"): validate_age(200)`. `with pytest.raises(TypeError) as exc: validate_age("x")`.',
      },
      {
        task: 'Write `test_stats.py` with a `mean(nums)` function. Test: (a) `mean([1, 2, 3]) == 2.0` with `pytest.approx`; (b) `mean([0.1, 0.2])` approx `0.15`; (c) `@pytest.mark.xfail(reason="empty list not handled")` a test that calls `mean([])` (which raises `ZeroDivisionError`). Run with `pytest -rx` and confirm 2 passed, 1 xfailed.',
        taskHi: '`test_stats.py` likhо ek `mean(nums)` function ke saath. Test: (a) `pytest.approx` ke saath, (b) approx `0.15`, (c) `@pytest.mark.xfail` ek test jo `mean([])` call kare. `pytest -rx` se chalाओ aur 2 passed, 1 xfailed confirm karो.',
        hint: '`mean = lambda nums: sum(nums) / len(nums)`. The xfail test: `@pytest.mark.xfail(reason="..."); def test_empty(): mean([])` — it raises `ZeroDivisionError`, so xfail reports it as `xfailed`, not a failure. `-rx` shows the xfail reason in the summary.',
        hintHi: '`mean = lambda nums: sum(nums) / len(nums)`. xfail test: `@pytest.mark.xfail(reason="..."); def test_empty(): mean([])` — ye `ZeroDivisionError` raise karता hai.',
      },
    ],

    keyTakeaways: [
      'A pytest test is a PLAIN FUNCTION named `test_*` in a file named `test_*.py` (or `*_test.py`). No class, no `self`, no `assertEqual` — just `assert expr`.',
      'Assertion introspection: pytest rewrites `assert` at import time, so a failure prints both operands and how they differ (`assert 4 == 5`, `assert \'admin\' in [...]`) — a better message than `assertEqual`.',
      'Discovery: files `test_*.py`/`*_test.py`, functions `test_*`, classes `Test*` (NO `__init__`), methods `test_*`. Run from the project root; `conftest.py` holds shared fixtures per directory tree.',
      '`with pytest.raises(ExcType):` fails the test if the block does NOT raise that type. `match="regex"` also checks the message; `as exc_info` captures it (`exc_info.value`, `.type`).',
      '`@pytest.mark.parametrize("a, b, expected", [cases])` runs one test body as N separate named tests (`test_x[2-3-5]`). Stacked parametrize = Cartesian product. `ids=[...]` for readable names.',
      '`pytest.approx(value[, rel=, abs=])` for comparing computed floats (and lists/dicts of floats). NEVER `assert computed_float == expected`.',
      'Markers: `@pytest.mark.skip(reason=)`, `.skipif(cond, reason=)`, `.xfail(reason=, strict=)`. `xfail` PASSES when the test fails; `strict=True` fails if it unexpectedly passes.',
      'CLI: `-v` (verbose), `-x` (stop on first fail), `-q` (quiet), `-k "expr"` (name filter), `-s` (show prints), `--lf` (last failed), `-m marker`, `--tb=short`.',
    ],
    keyTakeawaysHi: [
      'Ek pytest test ek PLAIN FUNCTION hai `test_*` naam ka ek file mein `test_*.py` naam ke. Koi class, koi `self`, koi `assertEqual` — bस `assert expr`.',
      'Assertion introspection: pytest import time par `assert` rewrite karता hai, isliye ek failure dono operands aur wo kaise alag hain print karता hai (`assert 4 == 5`) — `assertEqual` se ek behtar message.',
      'Discovery: files `test_*.py`/`*_test.py`, functions `test_*`, classes `Test*` (koi `__init__` NAHI), methods `test_*`. Project root se run karो; `conftest.py` prati directory tree shared fixtures rakhता hai.',
      '`with pytest.raises(ExcType):` test fail karता hai agar block us type ko NAHI raise karता. `match="regex"` message bhi check karता hai; `as exc_info` ise capture karता hai.',
      '`@pytest.mark.parametrize("a, b, expected", [cases])` ek test body ko N alag named tests ki tarah chalाता hai (`test_x[2-3-5]`). Stacked parametrize = Cartesian product.',
      '`pytest.approx(value[, rel=, abs=])` computed floats compare karne ke liye. KABHI `assert computed_float == expected` nahi.',
      'Markers: `@pytest.mark.skip(reason=)`, `.skipif(cond, reason=)`, `.xfail(reason=, strict=)`. `xfail` PASS hoता hai jab test fail hoता hai; `strict=True` fail karता hai agar ye anhonahi pass ho.',
      'CLI: `-v`, `-x`, `-q`, `-k "expr"`, `-s`, `--lf`, `-m marker`, `--tb=short`.',
    ],
  },

  {
    slug: 'py-pytest-fixtures',
    title: 'pytest Fixtures, conftest.py, and Test Organisation',
    titleHi: 'pytest Fixtures, conftest.py, Aur Test Organisation',
    description: 'Copy-pasting the same "create a temp database, seed three users, tear it down" block into forty tests, then changing the schema and editing forty tests. A pytest fixture is that setup written once, requested by name in any test that needs it, with teardown handled automatically — and `conftest.py` shares fixtures across a whole directory.',
    descriptionHi: 'Wahi "ek temp database banao, teen users seed karo, ise tear down karo" block chalis tests mein copy-paste karna, phir schema badalna aur chalis tests edit karna. Ek pytest fixture wo setup ek baar likha hai, kisi bhi test mein naam se request kiya jise iski zaroorat hai, teardown apne aap handle kiya — aur `conftest.py` ek poori directory mein fixtures share karता hai.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 5,

    analogy: {
      en: '**A stage crew that sets up exactly the props each scene asks for.** An actor does not haul furniture on stage themselves; they arrive, and the set they need is already there because the script listed it. When the scene ends, the crew strikes the set. A pytest fixture is a stage-crew instruction: a function that builds something a test needs — a temp directory, a database connection, a logged-in client, a frozen clock — and a test that wants it just names it as a parameter. pytest sees the name, runs the fixture, and hands the result in. If the fixture is written with a `yield`, everything after the `yield` is the strike: it runs after the test, pass or fail, to clean up. Fixtures can depend on other fixtures (the "database" fixture asks for the "temp directory" fixture), and their *scope* controls how often the crew rebuilds: per test, per file, per session. `conftest.py` is the crew\'s shared instructions for a whole wing of the theatre — put a fixture there and every test in that directory and below can request it without importing anything.',
      hi: '**Ek stage crew jo har scene jo maangे wo props set karता hai.** Ek actor khud furniture stage par nahi khींchता; wo aate hain, aur jo set unhe chahiye pehle se wahaan hai. Jab scene khatam hoता hai, crew set hataता hai. Ek pytest fixture ek stage-crew instruction hai: ek function jo kuch banाता hai jo ek test ko chahiye — ek temp directory, ek database connection — aur ek test jo ise chahता hai bस ise ek parameter ki tarah naam deता hai. pytest naam dekhता hai, fixture chalाता hai, aur result de deता hai. Agar fixture ek `yield` ke saath likha hai, `yield` ke baad sab kuch strike hai. Fixtures doosre fixtures par nirbhar kar sakte hain, aur unka *scope* control karता hai kितनी baar crew rebuild karता hai. `conftest.py` theatre ke ek poore wing ke liye crew ke shared instructions hain.',
    },

    simple: `**A fixture: setup a test asks for by name**

\`\`\`python
import pytest

@pytest.fixture
def sample_user():
    return {"id": 1, "name": "Ada", "roles": ["admin"]}

def test_user_is_admin(sample_user):        # request the fixture by parameter name
    assert "admin" in sample_user["roles"]

def test_user_name(sample_user):            # a FRESH one per test (default scope)
    assert sample_user["name"] == "Ada"
\`\`\`

**\`yield\` fixture: setup + guaranteed teardown**

\`\`\`python
@pytest.fixture
def temp_db():
    db = create_test_database()             # setup
    yield db                                # the test runs here, with 'db'
    db.drop()                               # teardown -- runs after the test, pass OR fail

@pytest.fixture
def client(temp_db):                        # fixtures can depend on other fixtures
    return APIClient(db=temp_db)
\`\`\`

**Scope: how often the fixture is rebuilt**

\`\`\`python
@pytest.fixture                       # scope="function" (default) -- new per test
@pytest.fixture(scope="module")       # once per test file
@pytest.fixture(scope="session")      # once per whole test run
@pytest.fixture(scope="class")        # once per test class
\`\`\`

**\`conftest.py\` — fixtures shared without importing**

\`\`\`
tests/
    conftest.py          # fixtures here are available to EVERY test below
    test_users.py
    api/
        conftest.py      # fixtures here: only tests under api/
        test_endpoints.py
\`\`\`

**Built-in fixtures you get for free**

\`\`\`python
def test_writes_a_file(tmp_path):              # a fresh temp directory (pathlib.Path)
    (tmp_path / "out.txt").write_text("hi")
    assert (tmp_path / "out.txt").read_text() == "hi"

def test_env(monkeypatch):                     # patch env vars, attributes, dict items
    monkeypatch.setenv("API_KEY", "test-key")
    monkeypatch.setattr("mymod.now", lambda: FIXED_TIME)

def test_output(capsys):                       # capture stdout/stderr
    print("hello")
    assert capsys.readouterr().out == "hello\\n"
\`\`\`

\`\`\`
@pytest.fixture           a function that provides a value; a test REQUESTS it by
                          naming it as a parameter. pytest runs it and injects the result.
  return X                -> the test gets X
  ... yield X ...         -> the test gets X; code AFTER yield is teardown (runs on pass OR fail)
  scope="function"|"class"|"module"|"package"|"session"
  autouse=True            -> applied to every test in scope WITHOUT being requested
  params=[...]            -> the fixture (and every test using it) runs once per param

conftest.py               fixtures/hooks shared by all tests in that dir and below.
                          NOT imported -- pytest finds it automatically. No __init__.py needed.

BUILT-IN FIXTURES:
  tmp_path        a unique temp directory as a pathlib.Path (auto-cleaned)
  tmp_path_factory  make more temp dirs (session-scoped base)
  monkeypatch     setenv/delenv, setattr/delattr, setitem/delitem, chdir, syspath_prepend
                  -- ALL auto-undone after the test
  capsys / capfd  capture stdout+stderr (capsys = Python level, capfd = fd level)
  caplog          capture log records; assert on caplog.records / caplog.text
  request         metadata about the running test (request.param, request.node.name, ...)

FIXTURE RESOLUTION ORDER: a test's fixtures run outermost-scope first; teardowns reverse.
\`\`\``,

    simpleHi: `**Ek fixture: ek test jo naam se maangता hai**

\`\`\`python
import pytest

@pytest.fixture
def sample_user():
    return {"id": 1, "name": "Ada", "roles": ["admin"]}

def test_user_is_admin(sample_user):        # fixture ko parameter name se request karो
    assert "admin" in sample_user["roles"]

def test_user_name(sample_user):            # prati test ek FRESH (default scope)
    assert sample_user["name"] == "Ada"
\`\`\`

**\`yield\` fixture: setup + guaranteed teardown**

\`\`\`python
@pytest.fixture
def temp_db():
    db = create_test_database()             # setup
    yield db                                # test yahaan chalता hai, 'db' ke saath
    db.drop()                               # teardown -- test ke baad chalता hai, pass YA fail

@pytest.fixture
def client(temp_db):                        # fixtures doosre fixtures par nirbhar kar sakte hain
    return APIClient(db=temp_db)
\`\`\`

**Scope: fixture kitni baar rebuild hoता hai**

\`\`\`python
@pytest.fixture                       # scope="function" (default) -- prati test naya
@pytest.fixture(scope="module")       # prati test file ek baar
@pytest.fixture(scope="session")      # prati poore test run ek baar
\`\`\`

**\`conftest.py\` — bina import kiye shared fixtures**

\`\`\`
tests/
    conftest.py          # yahaan fixtures HAR neeche test ko available
    test_users.py
    api/
        conftest.py      # yahaan fixtures: sirf api/ ke tahat tests
        test_endpoints.py
\`\`\`

**Built-in fixtures jo aapko muft milते hain**

\`\`\`python
def test_writes_a_file(tmp_path):              # ek fresh temp directory (pathlib.Path)
    (tmp_path / "out.txt").write_text("hi")
    assert (tmp_path / "out.txt").read_text() == "hi"

def test_env(monkeypatch):                     # env vars, attributes, dict items patch karो
    monkeypatch.setenv("API_KEY", "test-key")

def test_output(capsys):                       # stdout/stderr capture karो
    print("hello")
    assert capsys.readouterr().out == "hello\\n"
\`\`\`

\`\`\`
@pytest.fixture           ek function jo ek value provide karता hai; ek test ise
                          ek parameter ki tarah naam deकर REQUEST karता hai.
  return X                -> test ko X milता hai
  ... yield X ...         -> test ko X milता hai; yield ke BAAD code teardown hai
  scope="function"|"class"|"module"|"package"|"session"
  autouse=True            -> scope mein har test par bina request kiye lागू
  params=[...]            -> fixture (aur ise istemal karta har test) prati param ek baar chalता hai

conftest.py               us dir aur neeche saare tests dwara share kiye fixtures/hooks.
                          Import NAHI -- pytest ise apne aap dhoondhता hai.

BUILT-IN FIXTURES:
  tmp_path        ek unique temp directory ek pathlib.Path ki tarah (auto-cleaned)
  monkeypatch     setenv/delenv, setattr/delattr, setitem, chdir -- SAB test ke baad auto-undone
  capsys / capfd  stdout+stderr capture
  caplog          log records capture; caplog.records / caplog.text par assert
  request         chalte test ke baare mein metadata (request.param, request.node.name)
\`\`\``,

    content: `## Why fixtures (not \`setUp\`/\`tearDown\`)

\`unittest\` has one \`setUp\` and one \`tearDown\` per class, run before/after *every* method — a single shared blob. pytest fixtures are composable and à la carte: each test requests exactly the fixtures it needs by name, fixtures can depend on other fixtures forming a graph, and each has its own scope. You do not pay for setup a test does not use.

\`\`\`python
@pytest.fixture
def db():
    conn = connect(":memory:")
    conn.executescript(SCHEMA)
    yield conn
    conn.close()

@pytest.fixture
def user(db):                    # depends on db
    db.execute("INSERT INTO users (name) VALUES ('Ada')")
    return db.execute("SELECT * FROM users").fetchone()

def test_only_needs_db(db): ...          # user fixture is not built
def test_needs_user(user): ...           # db built first, then user
\`\`\`

## \`yield\` fixtures — setup and teardown

\`\`\`python
@pytest.fixture
def running_server():
    server = start_server(port=0)
    server.wait_until_ready()
    yield server                 # <-- the test body runs here
    server.stop()                # <-- teardown, ALWAYS runs (test passed, failed, or errored)
\`\`\`

The code before \`yield\` is setup; the value yielded is what the test receives; the code after \`yield\` is teardown. Teardown runs even if the test raises. Multiple \`yield\` fixtures tear down in reverse order of setup (LIFO). For pure setup with no teardown, just \`return\` the value.

## Scope

\`\`\`python
@pytest.fixture(scope="session")
def api_credentials():           # expensive: fetched once for the whole run
    return login_to_test_account()

@pytest.fixture(scope="module")
def loaded_dataset():            # once per test file
    return load_large_fixture_file()

@pytest.fixture                  # scope="function" -- default, fresh per test
def cart():
    return ShoppingCart()
\`\`\`

Wider scope = fewer rebuilds = faster, but the fixture value is *shared* across tests in that scope, so it must not carry state between tests. Use \`function\` scope (the default) unless the setup is genuinely expensive and the value is safe to share (or you reset it).

## \`conftest.py\`

A \`conftest.py\` file is auto-discovered by pytest — you never import it. Fixtures, hooks, and plugin config in it apply to every test in its directory and all subdirectories. This is where shared fixtures live:

\`\`\`python
# tests/conftest.py
import pytest

@pytest.fixture
def app():
    app = create_app(testing=True)
    yield app
    app.cleanup()

@pytest.fixture
def client(app):
    return app.test_client()
\`\`\`

Now every test file under \`tests/\` can request \`app\` or \`client\` as a parameter. A nested \`tests/api/conftest.py\` can add fixtures scoped to just \`tests/api/\`, and can override a parent fixture of the same name.

## \`autouse\` — a fixture applied without being requested

\`\`\`python
@pytest.fixture(autouse=True)
def reset_singleton():
    Registry.clear()
    yield
    Registry.clear()
\`\`\`

An \`autouse=True\` fixture runs for every test in its scope whether or not the test names it. Use it sparingly — for a genuine cross-cutting concern like resetting global state or freezing time — because it makes tests depend on setup that is not visible in their signature.

## Parametrised fixtures

\`\`\`python
@pytest.fixture(params=["sqlite", "postgres"])
def db_backend(request):
    backend = request.param
    conn = connect(backend)
    yield conn
    conn.close()

def test_query(db_backend):      # runs TWICE: once with sqlite, once with postgres
    ...
\`\`\`

Every test that uses \`db_backend\` runs once per param. \`request.param\` is the current value.

## Key built-in fixtures

\`\`\`python
def test_tmp(tmp_path):                 # pathlib.Path to a unique dir, cleaned up after
    (tmp_path / "cfg.json").write_text("{}")

def test_patch(monkeypatch):
    monkeypatch.setenv("MODE", "test")           # undone after the test
    monkeypatch.setattr(mymod, "CONSTANT", 42)
    monkeypatch.setitem(config, "debug", True)
    monkeypatch.chdir(tmp_path)

def test_stdout(capsys):
    print("out"); print("err", file=sys.stderr)
    captured = capsys.readouterr()
    assert captured.out == "out\\n"
    assert captured.err == "err\\n"

def test_logs(caplog):
    with caplog.at_level(logging.WARNING):
        do_thing()
    assert "disk full" in caplog.text
    assert caplog.records[0].levelname == "WARNING"
\`\`\`

\`monkeypatch\` auto-undoes every change after the test — never patch \`os.environ\` or module globals by hand in a test.`,

    contentHi: `## Fixtures kyun (\`setUp\`/\`tearDown\` nahi)

\`unittest\` mein prati class ek \`setUp\` aur ek \`tearDown\` hoता hai, *har* method se pehle/baad chalता hai — ek akela shared blob. pytest fixtures composable aur à la carte hain: har test bilkul un fixtures ko naam se request karता hai jinki use zaroorat hai, fixtures doosre fixtures par nirbhar kar sakte hain, aur har ek ka apna scope hai.

\`\`\`python
@pytest.fixture
def db():
    conn = connect(":memory:")
    conn.executescript(SCHEMA)
    yield conn
    conn.close()

@pytest.fixture
def user(db):                    # db par nirbhar
    db.execute("INSERT INTO users (name) VALUES ('Ada')")
    return db.execute("SELECT * FROM users").fetchone()
\`\`\`

## \`yield\` fixtures — setup aur teardown

\`\`\`python
@pytest.fixture
def running_server():
    server = start_server(port=0)
    yield server                 # <-- test body yahaan chalता hai
    server.stop()                # <-- teardown, HAMESHA chalता hai
\`\`\`

\`yield\` se pehle code setup hai; yielded value wo hai jo test paता hai; \`yield\` ke baad code teardown hai. Teardown chalता hai chahe test raise kare. Kai \`yield\` fixtures setup ke ulte kram mein tear down hote hain (LIFO).

## Scope

\`\`\`python
@pytest.fixture(scope="session")
def api_credentials():           # mehnga: poore run ke liye ek baar fetch
    return login_to_test_account()

@pytest.fixture                  # scope="function" -- default, prati test fresh
def cart():
    return ShoppingCart()
\`\`\`

Chauda scope = kam rebuilds = tez, par fixture value us scope mein tests ke beech *shared* hoती hai, isliye ye tests ke beech state nahi le jाना chahiye.

## \`conftest.py\`

Ek \`conftest.py\` file pytest dwara auto-discovered hoती hai — aap ise kabhi import nahi karते. Ismein fixtures, hooks, aur plugin config iski directory aur saari subdirectories mein har test par lागू hote hain:

\`\`\`python
# tests/conftest.py
import pytest

@pytest.fixture
def app():
    app = create_app(testing=True)
    yield app
    app.cleanup()

@pytest.fixture
def client(app):
    return app.test_client()
\`\`\`

Ek nested \`tests/api/conftest.py\` sirf \`tests/api/\` tak scoped fixtures jod sakta hai, aur usi naam ke ek parent fixture ko override kar sakta hai.

## \`autouse\`

\`\`\`python
@pytest.fixture(autouse=True)
def reset_singleton():
    Registry.clear()
    yield
    Registry.clear()
\`\`\`

Ek \`autouse=True\` fixture iske scope mein har test ke liye chalता hai chahe test ise naam de ya nahi. Ise kamdी se istemal karो.

## Parametrised fixtures

\`\`\`python
@pytest.fixture(params=["sqlite", "postgres"])
def db_backend(request):
    backend = request.param
    conn = connect(backend)
    yield conn
    conn.close()

def test_query(db_backend):      # DO baar chalता hai
    ...
\`\`\`

## Mukhya built-in fixtures

\`\`\`python
def test_tmp(tmp_path):                 # ek unique dir ka pathlib.Path
    (tmp_path / "cfg.json").write_text("{}")

def test_patch(monkeypatch):
    monkeypatch.setenv("MODE", "test")           # test ke baad undone
    monkeypatch.setattr(mymod, "CONSTANT", 42)

def test_logs(caplog):
    with caplog.at_level(logging.WARNING):
        do_thing()
    assert "disk full" in caplog.text
\`\`\`

\`monkeypatch\` test ke baad har badlaav auto-undo karता hai — kabhi ek test mein \`os.environ\` haath se patch mat karो.`,

    examples: [
      {
        title: 'A fixture, a yield fixture with teardown, and dependency',
        titleHi: 'Ek fixture, teardown waali ek yield fixture, aur dependency',
        code: `import subprocess, sys, textwrap, tempfile, os, re

d = tempfile.mkdtemp()
open(os.path.join(d, "test_fixtures.py"), "w").write(textwrap.dedent('''
    import pytest

    events = []

    @pytest.fixture
    def numbers():
        return [1, 2, 3]

    @pytest.fixture
    def resource():
        events.append("setup")
        yield "the-resource"
        events.append("teardown")

    @pytest.fixture
    def wrapper(resource):
        return f"[{resource}]"

    def test_uses_numbers(numbers):
        assert sum(numbers) == 6

    def test_fresh_each_time(numbers):
        numbers.append(99)
        assert numbers == [1, 2, 3, 99]

    def test_still_fresh(numbers):
        assert numbers == [1, 2, 3]     # the append above did NOT leak

    def test_resource(resource):
        assert resource == "the-resource"

    def test_wrapper(wrapper):
        assert wrapper == "[the-resource]"

    def test_event_order():
        assert events == ["setup", "teardown", "setup", "teardown"]
'''))

r = subprocess.run([sys.executable, "-m", "pytest", "-q", "test_fixtures.py"],
                   cwd=d, capture_output=True, text=True)
out = re.sub(r"in \\d+\\.\\d+s", "in Ns", r.stdout)
out = re.sub(r"\\s+\\[100%\\]", " [100%]", out)
print(out, end="")`,
        output: `...... [100%]
6 passed in Ns`,
        explain: 'Every test that names `numbers` gets a fresh `[1, 2, 3]` — `test_fresh_each_time` appends `99` and `test_still_fresh` still sees `[1, 2, 3]`, proving function-scoped fixtures do not leak. The `resource` fixture appends `"setup"` before `yield` and `"teardown"` after, so by the time `test_event_order` runs, `events` is `["setup", "teardown", "setup", "teardown"]` (once for `test_resource`, once for `test_wrapper` via its `resource` dependency). `wrapper` depends on `resource`, so pytest builds `resource` first.',
        explainHi: 'Har test jo `numbers` ko naam deता hai ek fresh `[1, 2, 3]` paता hai — `test_fresh_each_time` `99` append karता hai aur `test_still_fresh` abhi bhi `[1, 2, 3]` dekhता hai. `resource` fixture `yield` se pehle `"setup"` aur baad mein `"teardown"` append karता hai. `wrapper` `resource` par nirbhar karता hai.',
      },
      {
        title: 'tmp_path, monkeypatch, and capsys built-in fixtures',
        titleHi: 'tmp_path, monkeypatch, aur capsys built-in fixtures',
        code: `import subprocess, sys, textwrap, tempfile, os, re

d = tempfile.mkdtemp()
open(os.path.join(d, "app.py"), "w").write(textwrap.dedent('''
    import os
    GREETING = "Hello"
    def greet(name):
        prefix = os.environ.get("PREFIX", "")
        print(f"{prefix}{GREETING}, {name}!")
    def save(path, text):
        path.write_text(text, encoding="utf-8")
'''))
open(os.path.join(d, "test_builtins.py"), "w").write(textwrap.dedent('''
    import app

    def test_tmp_path(tmp_path):
        f = tmp_path / "note.txt"
        app.save(f, "remember this")
        assert f.read_text(encoding="utf-8") == "remember this"
        assert f.parent == tmp_path

    def test_monkeypatch_env(monkeypatch, capsys):
        monkeypatch.setenv("PREFIX", ">> ")
        app.greet("Ada")
        assert capsys.readouterr().out.strip() == ">> Hello, Ada!"

    def test_monkeypatch_attr(monkeypatch, capsys):
        monkeypatch.setattr(app, "GREETING", "Hi")
        app.greet("Bo")
        assert capsys.readouterr().out.strip() == "Hi, Bo!"

    def test_env_is_restored(capsys):
        app.greet("Cy")                       # PREFIX was unset again after the test above
        assert capsys.readouterr().out.strip() == "Hello, Cy!"
'''))

r = subprocess.run([sys.executable, "-m", "pytest", "-q", "test_builtins.py"],
                   cwd=d, capture_output=True, text=True)
out = re.sub(r"in \\d+\\.\\d+s", "in Ns", r.stdout)
out = re.sub(r"\\s+\\[100%\\]", " [100%]", out)
print(out, end="")`,
        output: `.... [100%]
4 passed in Ns`,
        explain: '`tmp_path` gives each test a unique, auto-cleaned directory as a `pathlib.Path`. `monkeypatch.setenv("PREFIX", ">> ")` sets an env var *for this test only* — `test_env_is_restored` confirms it is gone afterward. `monkeypatch.setattr(app, "GREETING", "Hi")` swaps a module global and restores it automatically. `capsys.readouterr().out` captures everything printed. All undone after each test with zero manual cleanup.',
        explainHi: '`tmp_path` har test ko ek unique, auto-cleaned directory ek `pathlib.Path` ki tarah deता hai. `monkeypatch.setenv("PREFIX", ">> ")` ek env var *sirf is test ke liye* set karता hai — `test_env_is_restored` confirm karता hai ye baad mein gaya. `monkeypatch.setattr(app, "GREETING", "Hi")` ek module global swap karता hai aur ise apne aap restore karता hai.',
      },
      {
        title: 'conftest.py, scope, autouse, and parametrised fixtures',
        titleHi: 'conftest.py, scope, autouse, aur parametrised fixtures',
        code: `import subprocess, sys, textwrap, tempfile, os, re

d = tempfile.mkdtemp()
os.makedirs(os.path.join(d, "tests"))
open(os.path.join(d, "tests", "conftest.py"), "w").write(textwrap.dedent('''
    import pytest

    _log = []

    @pytest.fixture(scope="session")
    def session_id():
        _log.append("session setup")
        return "S1"

    @pytest.fixture(autouse=True)
    def per_test_marker():
        _log.append("test start")
        yield
        _log.append("test end")

    @pytest.fixture(params=["json", "xml"])
    def fmt(request):
        return request.param

    @pytest.fixture
    def get_log():
        return _log
'''))
open(os.path.join(d, "tests", "test_scope.py"), "w").write(textwrap.dedent('''
    def test_a(session_id):
        assert session_id == "S1"

    def test_b(session_id):
        assert session_id == "S1"       # SAME object -- session scope, built once

    def test_format(fmt):
        assert fmt in ("json", "xml")   # runs twice: test_format[json], test_format[xml]

    def test_autouse_ran(get_log):
        # per_test_marker is autouse -> "test start"/"test end" bracket every test
        assert get_log.count("test start") == get_log.count("test end") + 1
        assert get_log.count("session setup") == 1   # session fixture built exactly once
'''))

r = subprocess.run([sys.executable, "-m", "pytest", "-v", "tests/"],
                   cwd=d, capture_output=True, text=True)
out = re.sub(r"in \\d+\\.\\d+s", "in Ns", r.stdout)
out = re.sub(r" +\\[ *\\d+%\\]", "", out)            # strip the -v progress percentage
lines = [re.sub(r"^=+ | =+$", "", ln) for ln in out.splitlines()
         if "::" in ln or "passed" in ln]           # keep results + summary, drop "===" banner
print("\\n".join(lines))`,
        output: `tests/test_scope.py::test_a PASSED
tests/test_scope.py::test_b PASSED
tests/test_scope.py::test_format[json] PASSED
tests/test_scope.py::test_format[xml] PASSED
tests/test_scope.py::test_autouse_ran PASSED
5 passed in Ns`,
        explain: 'The `conftest.py` fixtures need no import — every test under `tests/` can use them. `session_id` is `scope="session"`, so it is built once and `test_a`/`test_b` get the same value. `per_test_marker` is `autouse=True`, so it brackets every test with "test start"/"test end" without being named. `fmt` has `params=["json", "xml"]`, so `test_format` runs twice, reported as `test_format[json]` and `test_format[xml]`.',
        explainHi: '`conftest.py` fixtures ko import nahi chahiye — `tests/` ke tahat har test unhe istemal kar sakta hai. `session_id` `scope="session"` hai, isliye ye ek baar bana aur `test_a`/`test_b` ko wahi value milती hai. `per_test_marker` `autouse=True` hai. `fmt` mein `params=["json", "xml"]` hai, isliye `test_format` do baar chalता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `import os

def test_reads_config():
    os.environ["CONFIG_PATH"] = "/tmp/test.cfg"   # never undone -> leaks to other tests
    result = load_config()
    assert result["debug"] is True
    # if this test fails, CONFIG_PATH stays set for the rest of the run`,
        right: `def test_reads_config(monkeypatch, tmp_path):
    cfg = tmp_path / "test.cfg"
    cfg.write_text("debug = true")
    monkeypatch.setenv("CONFIG_PATH", str(cfg))   # auto-undone after the test
    assert load_config()["debug"] is True`,
        why: 'Setting `os.environ` (or a module global, or a dict key) directly in a test leaks that change into every subsequent test in the run — a classic source of order-dependent flaky tests. `monkeypatch` records every change and undoes it in teardown, even if the test fails. Also use `tmp_path` instead of a hard-coded `/tmp/...` path.',
        whyHi: 'Ek test mein `os.environ` (ya ek module global) seedhe set karna us badlaav ko run mein har agle test mein leak karता hai — order-dependent flaky tests ka ek classic source. `monkeypatch` har badlaav record karता hai aur ise teardown mein undo karता hai, test fail hone par bhi.',
      },
      {
        wrong: `@pytest.fixture(scope="session")
def cart():
    return ShoppingCart()          # ONE cart shared by every test in the session!

def test_add(cart):
    cart.add("apple")
    assert len(cart) == 1

def test_empty(cart):
    assert len(cart) == 0          # FAILS -- the apple from test_add is still there`,
        right: `@pytest.fixture               # scope="function" (default) -- a fresh cart per test
def cart():
    return ShoppingCart()`,
        why: 'A wider fixture scope means the SAME object is reused across tests in that scope, so any state a test adds is visible to the next one — tests become order-dependent and non-isolated. Use `scope="function"` (the default) for anything mutable. Reserve `session`/`module` scope for genuinely expensive, immutable, or explicitly-reset setup.',
        whyHi: 'Ek chauda fixture scope matlab WAHI object us scope mein tests ke beech reuse hoता hai, isliye jo state ek test jodता hai wo agle ko dikhता hai — tests order-dependent ban jाते hain. Kisi bhi mutable cheez ke liye `scope="function"` (default) istemal karो.',
      },
      {
        wrong: `# in test_helpers.py, imported by every test file:
import test_helpers

def test_x():
    user = test_helpers.make_user()   # a plain helper module + explicit import`,
        right: `# tests/conftest.py -- auto-discovered, no import
@pytest.fixture
def user():
    return make_user()

def test_x(user):                      # requested by name; teardown handled; overridable
    ...`,
        why: 'A plain helper module works but you lose what fixtures give you: automatic discovery (no import), automatic teardown (`yield`), scoping, dependency injection between fixtures, parametrisation, and the ability for a nested `conftest.py` to override a fixture for a subtree. Put shared setup in `conftest.py` as fixtures.',
        whyHi: 'Ek plain helper module kaam karता hai par aap wo kho dete ho jo fixtures deते hain: automatic discovery (koi import nahi), automatic teardown, scoping, fixtures ke beech dependency injection, parametrisation. Shared setup ko `conftest.py` mein fixtures ki tarah rakhो.',
      },
    ],

    realWorld: [
      {
        en: '**`pytest-django` provides `db`, `client`, `admin_client`, `settings`, `rf` fixtures** — `def test_view(client, db): resp = client.get("/users/")`. The `db` fixture wraps each test in a transaction that rolls back, so tests are isolated and fast. `settings` lets you override Django settings per test with auto-restore.',
        hi: '**`pytest-django` `db`, `client`, `admin_client`, `settings` fixtures deता hai** — `def test_view(client, db): ...`. `db` fixture har test ko ek transaction mein wrap karता hai jो roll back hoती hai. `settings` prati test Django settings override karne deता hai.',
      },
      {
        en: '**`conftest.py` at the test-suite root holds the app factory, a test client, seeded data, and a frozen clock** — every test file requests what it needs by name. Nested `conftest.py` files add fixtures for a subsystem (e.g. `tests/payments/conftest.py` with a fake payment gateway).',
        hi: '**Test-suite root par `conftest.py` app factory, ek test client, seeded data rakhता hai** — har test file jo chahiye naam se request karता hai. Nested `conftest.py` files ek subsystem ke liye fixtures jodती hain.',
      },
      {
        en: '**`monkeypatch` and `tmp_path` replace manual patching and `/tmp` juggling in almost every test that touches the environment or filesystem** — patch `datetime.now`, an API client, an env var, `sys.argv`; write test files to `tmp_path`. Both clean up automatically, which is why flaky order-dependent tests are rare in well-written pytest suites.',
        hi: '**`monkeypatch` aur `tmp_path` lagbhag har test mein manual patching aur `/tmp` juggling ki jagah lete hain** jo environment ya filesystem ko chhoota hai — `datetime.now` patch karो, test files `tmp_path` mein likhो. Dono apne aap clean up karते hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is a pytest fixture, how does a test get one, and what does a `yield` fixture do?',
        qHi: 'Ek pytest fixture kya hai, ek test ise kaise paता hai, aur ek `yield` fixture kya karता hai?',
        a: 'A fixture is a function, decorated with pytest dot fixture, that provides something a test needs — a value, an object, a configured resource, a piece of set-up state. A test gets a fixture by declaring a parameter whose name matches the fixture function\'s name. When pytest is about to run that test, it sees the parameter, looks up the fixture by name, executes it, and passes the result in as that argument. The test never calls the fixture itself and never imports it if it lives in a conftest file. Fixtures compose: a fixture can itself request other fixtures as parameters, so pytest builds a dependency graph and runs them in order, outermost dependency first. A plain fixture just returns a value, and that value is what the test receives. A yield fixture is how you attach teardown. The code before the yield is setup; it runs when the fixture is first needed. The value after yield is what the test receives. Then execution pauses at the yield while the test body runs. When the test finishes — whether it passed, failed, or raised an error — execution resumes after the yield, and everything from there to the end of the fixture function is teardown, guaranteed to run. If several yield fixtures are active for one test, their teardowns run in reverse order of their setup, last-in-first-out, which is the correct order for nested resources. Fixtures also have a scope — function by default, meaning a fresh instance per test, but it can be class, module, package, or session, which reuses one instance across all tests in that scope. Wider scope is faster because setup happens less often, but the instance is shared, so it must not accumulate state between tests. And an autouse fixture runs for every test in its scope without being named, which is useful for cross-cutting setup like resetting a global or freezing time, but should be used sparingly because it hides a dependency from the test signature.',
        aHi: 'Ek fixture ek function hai, pytest dot fixture se decorated, jo kuch provide karता hai jo ek test ko chahiye — ek value, ek object, ek configured resource. Ek test ek fixture ek parameter declare karके paता hai jiska naam fixture function ke naam se match karता hai. Jab pytest us test ko chalाने waala hoता hai, ye parameter dekhता hai, fixture ko naam se lookup karता hai, ise execute karता hai, aur result us argument ki tarah pass karता hai. Test kabhi fixture ko khud call nahi karता. Fixtures compose hote hain: ek fixture khud doosre fixtures request kar sakta hai. Ek plain fixture bस ek value return karता hai. Ek yield fixture aise aap teardown attach karते ho. yield se pehle code setup hai. yield ke baad value wo hai jo test paता hai. Phir execution yield par pause hoता hai jabki test body chalती hai. Jab test khatam hoती hai — chahe pass, fail, ya error — execution yield ke baad resume hoता hai, aur wahaan se fixture function ke ant tak sab kuch teardown hai, chalne ki guarantee. Fixtures ka ek scope bhi hai.',
      },
      {
        q: 'What is `conftest.py` and why should you use `monkeypatch` instead of setting `os.environ` directly in a test?',
        qHi: '`conftest.py` kya hai aur aapko ek test mein `os.environ` seedhe set karne ke bजaay `monkeypatch` kyun istemal karna chahiye?',
        a: 'conftest dot py is a special file that pytest discovers automatically — you never import it. Any fixtures, hooks, or plugin configuration defined in a conftest file are available to every test in that file\'s directory and all subdirectories, without the test doing anything to get them. So it is where shared setup lives: the application factory, a test client, seeded data, common fixtures. You can have conftest files at multiple levels — one at the suite root for truly global fixtures, and nested ones that add fixtures scoped to a subtree, or that override a parent fixture of the same name for the tests below them. This gives you a clean layering of test infrastructure without import statements or helper modules. As for monkeypatch versus direct mutation: when a test sets os dot environ of some key equals a value directly, that change persists after the test ends. Every subsequent test in the same run now sees the modified environment. If tests happen to run in an order where that leakage does not matter, everything is green; change the order, run one test in isolation, or add a new test, and something breaks in a way that is hard to trace, because the cause is in a different test file. The same problem applies to patching a module global, a dict entry, the current working directory, or sys dot path by hand. The monkeypatch fixture solves this by recording every change you make through it — setenv, delenv, setattr, delattr, setitem, delitem, chdir, syspath_prepend — and automatically undoing all of them in teardown, even if the test fails or raises. So the environment, the globals, and the working directory are exactly as they were before the test, every time. The rule is: never mutate shared state directly in a test; always go through monkeypatch so the change is scoped to that one test and reversed afterward.',
        aHi: 'conftest dot py ek vishesh file hai jise pytest apne aap discover karता hai — aap ise kabhi import nahi karते. Ek conftest file mein define kiye koi bhi fixtures, hooks, ya plugin configuration us file ki directory aur saari subdirectories mein har test ko available hain, bina test ko unhe paने ke liye kuch kiye. Toh ye jahaan shared setup rehता hai. Aapke paas kai levels par conftest files ho sakti hain. monkeypatch versus direct mutation: jab ek test os dot environ of some key equals a value seedhe set karता hai, wo badlaav test khatam hone ke baad bana rehता hai. Usi run mein har agla test ab modified environment dekhता hai. Agar tests ऐसे kram mein chalте hain jahaan wo leakage maayne nahi rakhता, sab green hai; kram badlो, ek test ko isolation mein chalाओ, ya ek naya test jodो, aur kuch tootता hai ऐसे jise trace karna mushkil hai. monkeypatch fixture ise har badlaav record karके aur ise teardown mein apne aap undo karके hal karता hai. Niyam: kabhi ek test mein shared state seedhe mutate mat karो.',
      },
    ],

    exercises: [
      {
        task: 'Write `test_bank.py` with a `BankAccount` class (`deposit`, `withdraw` raising `ValueError` on overdraft) and a `@pytest.fixture` `account` returning a fresh `BankAccount(balance=100)`. Write three tests using `account`; in one, deposit and check the balance changed; in another, confirm the balance is still 100 (proving isolation). Run with `pytest -q` and confirm all pass.',
        taskHi: '`test_bank.py` likhо ek `BankAccount` class aur ek `@pytest.fixture` `account` ke saath jo ek fresh `BankAccount(balance=100)` lautае. Teen tests likhо jo `account` istemal karें; ek mein deposit karके balance check karो, doosre mein confirm karो balance abhi bhi 100 hai.',
        hint: '`@pytest.fixture; def account(): return BankAccount(balance=100)`. `test_deposit` does `account.deposit(50); assert account.balance == 150`. `test_isolation` does `assert account.balance == 100` — the deposit above did not leak because the fixture is function-scoped.',
        hintHi: '`@pytest.fixture; def account(): return BankAccount(balance=100)`. `test_deposit` `account.deposit(50); assert account.balance == 150`. `test_isolation` `assert account.balance == 100`.',
      },
      {
        task: 'Write a `yield` fixture `temp_file` that creates a file in `tmp_path` with some content, yields its `Path`, and (after yield) asserts the file still exists then deletes it. Use it in two tests. Also add an `autouse` fixture that appends to a module-level `calls` list before and after each test; a final test asserts `calls` has the expected setup/teardown pairs.',
        taskHi: 'Ek `yield` fixture `temp_file` likhо jo `tmp_path` mein ek file banае, iski `Path` yield kare, aur (yield ke baad) delete kare. Ise do tests mein istemal karो. Ek `autouse` fixture bhi jodो.',
        hint: '`@pytest.fixture; def temp_file(tmp_path): p = tmp_path / "f.txt"; p.write_text("data"); yield p; p.unlink()`. Autouse: `@pytest.fixture(autouse=True); def track(): calls.append("in"); yield; calls.append("out")`. Fixtures can request other fixtures (`temp_file` requests `tmp_path`).',
        hintHi: '`@pytest.fixture; def temp_file(tmp_path): p = tmp_path / "f.txt"; p.write_text("data"); yield p; p.unlink()`. Autouse: `@pytest.fixture(autouse=True); def track(): calls.append("in"); yield; calls.append("out")`.',
      },
      {
        task: 'Set up `tests/conftest.py` with a `session`-scoped `config` fixture (returns a dict, logs "built" once) and a `function`-scoped `db` fixture. In `tests/test_a.py` and `tests/test_b.py`, each request `config` and assert it is the SAME object across files (session scope), and request `db` and mutate it, asserting the next test gets a fresh one. Run `pytest -v tests/`.',
        taskHi: '`tests/conftest.py` set up karो ek `session`-scoped `config` fixture aur ek `function`-scoped `db` fixture ke saath. `tests/test_a.py` aur `tests/test_b.py` mein, har ek `config` request kare aur assert kare ki ye files ke beech WAHI object hai.',
        hint: 'Session fixture: `@pytest.fixture(scope="session"); def config(): _built.append(1); return {"env": "test"}`. Assert `len(_built) == 1` across all tests. `db` fixture returns a fresh `{}` each function; mutate it in one test, assert it is `{}` in the next.',
        hintHi: 'Session fixture: `@pytest.fixture(scope="session"); def config(): _built.append(1); return {"env": "test"}`. Saare tests mein `len(_built) == 1` assert karो.',
      },
    ],

    keyTakeaways: [
      'A fixture is a `@pytest.fixture`-decorated function providing something a test needs. A test REQUESTS it by declaring a parameter with the fixture\'s name — pytest runs the fixture and injects the result. The test never calls or imports it.',
      'Fixtures compose: a fixture can request other fixtures as parameters. pytest builds the dependency graph and runs them in order.',
      '`yield` fixture: code before `yield` = setup, the yielded value = what the test gets, code after `yield` = teardown (runs on pass, fail, OR error). Multiple fixtures tear down LIFO. Pure setup: just `return`.',
      'Scope: `function` (default, fresh per test), `class`, `module`, `package`, `session` (one instance shared across that scope). Wider = faster but SHARED — never use a wide scope for mutable state.',
      '`conftest.py` is auto-discovered (never imported). Its fixtures/hooks apply to every test in its directory and below. Nested `conftest.py` adds or overrides fixtures for a subtree.',
      '`autouse=True` runs a fixture for every test in scope without being named — use sparingly, for cross-cutting setup (reset globals, freeze time).',
      '`params=[...]` on a fixture runs it (and every test using it) once per param; `request.param` is the current value.',
      'Built-ins: `tmp_path` (unique temp dir Path), `monkeypatch` (setenv/setattr/setitem/chdir — ALL auto-undone), `capsys`/`capfd` (capture stdout/stderr), `caplog` (capture log records). NEVER set `os.environ` or module globals by hand in a test — use `monkeypatch`.',
    ],
    keyTakeawaysHi: [
      'Ek fixture ek `@pytest.fixture`-decorated function hai jो kuch provide karता hai jो ek test ko chahiye. Ek test ise fixture ke naam waala ek parameter declare karके REQUEST karता hai — pytest fixture chalाता hai aur result inject karता hai.',
      'Fixtures compose hote hain: ek fixture doosre fixtures ko parameters ki tarah request kar sakta hai.',
      '`yield` fixture: `yield` se pehle code = setup, yielded value = jо test paता hai, `yield` ke baad code = teardown (pass, fail, YA error par chalता hai). Kai fixtures LIFO tear down hote hain.',
      'Scope: `function` (default, prati test fresh), `class`, `module`, `package`, `session` (us scope mein ek instance shared). Chauda = tez par SHARED — mutable state ke liye kabhi chauda scope nahi.',
      '`conftest.py` auto-discovered hai (kabhi import nahi). Iske fixtures/hooks iski directory aur neeche har test par lागू hote hain.',
      '`autouse=True` ek fixture ko scope mein har test ke liye bina naam diye chalाता hai — kamdी se istemal karो.',
      '`params=[...]` ek fixture par ise (aur ise istemal karता har test) prati param ek baar chalाता hai; `request.param` current value hai.',
      'Built-ins: `tmp_path`, `monkeypatch` (setenv/setattr/setitem — SAB auto-undone), `capsys`, `caplog`. KABHI ek test mein `os.environ` haath se set mat karो — `monkeypatch` istemal karो.',
    ],
  },

  {
    slug: 'py-tooling-ruff-pdb-logging',
    title: 'Tooling: ruff, breakpoint(), and logging Done Right',
    titleHi: 'Tooling: ruff, breakpoint(), Aur logging Sahi Se',
    description: 'Debugging with `print()` statements you then have to remember to delete, formatting arguments about tabs and quote styles, and using `print()` for what should be structured logs with levels. `ruff` formats and lints in one fast tool, `breakpoint()` drops you into an interactive debugger, and the `logging` module gives you levelled, configurable, redirectable output.',
    descriptionHi: '`print()` statements se debug karna jinhe aapko phir delete karna yaad rakhना padता hai, tabs aur quote styles par formatting arguments, aur `print()` istemal karna us cheez ke liye jо levels waale structured logs hone chahiye. `ruff` ek tez tool mein format aur lint karता hai, `breakpoint()` aapko ek interactive debugger mein chhodता hai, aur `logging` module aapko levelled, configurable, redirectable output deता hai.',
    difficulty: 'MEDIUM',
    duration: 20,
    order: 6,

    analogy: {
      en: '**Three upgrades to the workshop.** First, replace the three separate quality-control machines (one checks measurements, one checks alignment, one checks finish) with a single fast unit that does all of it and also fixes what it can automatically — that is `ruff`, one tool that replaces the old lint/import-sort/format stack and runs in milliseconds. Second, stop debugging by taping a note that says "check here" onto the machine and reading it later — instead install a pause button that stops the line exactly where you press it and lets you walk around and inspect everything in place. That is `breakpoint()`: one call drops you into an interactive debugger at that line, with the full local state, and you never have to remember to remove a print. Third, replace the habit of shouting observations across the floor (which nobody can filter, record, or redirect) with a proper intercom that has channels and priority levels: routine updates on one channel, warnings on another, emergencies broadcast everywhere, and a recorder that keeps it all with timestamps. That is `logging`: instead of `print`, you emit records at a level (debug, info, warning, error), and a central configuration decides where they go, in what format, and which levels are loud enough to show.',
      hi: '**Workshop ke teen upgrades.** Pehla, teen alag quality-control machines ki jagah ek single fast unit lo jо sab karता hai aur jо ye theek kar sakta hai apne aap bhi — wo `ruff` hai, ek tool jо purane lint/import-sort/format stack ki jagah leता hai aur milliseconds mein chalता hai. Doosra, machine par "yahaan check karo" note tape karके aur baad mein padhकर debug karna band karो — iske bजaay ek pause button lagाओ jо line ko bilkul wahaan rokता hai jahaan aap dabाते ho. Wo `breakpoint()` hai. Teesra, floor par observations chillane ki aadat ki jagah ek proper intercom lो jismein channels aur priority levels hain: ek channel par routine updates, doosre par warnings, emergencies har jagah broadcast. Wo `logging` hai: `print` ke bजaay, aap ek level par records emit karते ho.',
    },

    simple: `**\`ruff\` — one tool for linting AND formatting**

\`\`\`bash
pip install ruff

ruff check .            # lint (find problems)
ruff check --fix .      # lint + auto-fix what it safely can
ruff format .           # format (like black)
ruff check --watch .    # re-run on save
\`\`\`

\`\`\`toml
# pyproject.toml
[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM"]   # error, pyflakes, isort, pyupgrade, bugbear, simplify
ignore = ["E501"]                            # (or just set line-length)
\`\`\`

\`ruff\` replaces \`flake8\` + \`isort\` + \`pyupgrade\` + \`black\` (via \`ruff format\`) + dozens of plugins, and runs ~100x faster.

**\`breakpoint()\` — the interactive debugger**

\`\`\`python
def process(items):
    total = 0
    for item in items:
        breakpoint()            # execution stops HERE, drops into pdb
        total += item.value
    return total
\`\`\`

\`\`\`
(Pdb) item            # inspect any variable
(Pdb) item.value
(Pdb) total
(Pdb) p [i.value for i in items]   # run arbitrary Python
(Pdb) n               # next line (step over)
(Pdb) s               # step into a call
(Pdb) c               # continue to the next breakpoint / end
(Pdb) l               # list source around here
(Pdb) w               # where -- the call stack
(Pdb) q               # quit
\`\`\`

\`PYTHONBREAKPOINT=0\` disables all \`breakpoint()\` calls (for CI). \`PYTHONBREAKPOINT=ipdb.set_trace\` uses a different debugger.

**\`logging\` — instead of \`print\`**

\`\`\`python
import logging

logger = logging.getLogger(__name__)         # one logger per module, by name

def charge(amount):
    logger.debug("charging %s", amount)      # lazy %-formatting -- NOT an f-string
    if amount <= 0:
        logger.warning("non-positive amount: %s", amount)
        return
    try:
        gateway.charge(amount)
    except GatewayError:
        logger.exception("charge failed")    # ERROR + full traceback (inside except only)
        raise
    logger.info("charged %s successfully", amount)
\`\`\`

\`\`\`python
# configure ONCE, at program startup (not in library code):
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
\`\`\`

\`\`\`
LEVELS (low -> high):  DEBUG  INFO  WARNING  ERROR  CRITICAL
  set the threshold once; anything below it is dropped cheaply (args not even formatted)

logger = logging.getLogger(__name__)   # per-module; loggers form a tree by dotted name
logger.debug/info/warning/error/critical("msg %s", arg)   # %-style, lazy
logger.exception("msg")                 # ERROR level + traceback; ONLY inside an except block

logging.basicConfig(level=, format=, handlers=, filename=)   # simple, call ONCE at startup
logging.config.dictConfig({...})        # full config: multiple handlers, formatters, per-logger levels

NEVER:  print() for anything that is not direct CLI output to the user
        f-strings in log calls (built even when the level is off -> wasted work)
        configuring logging inside a library / imported module

pdb / breakpoint():  n(ext) s(tep) c(ontinue) r(eturn) l(ist) w(here) p/pp <expr> q(uit)
                     b <line> (set breakpoint)   !<stmt> (run a statement)
\`\`\``,

    simpleHi: `**\`ruff\` — linting AUR formatting ke liye ek tool**

\`\`\`bash
pip install ruff

ruff check .            # lint (problems dhoondho)
ruff check --fix .      # lint + jо surakshit roop se ho sake auto-fix
ruff format .           # format (black ki tarah)
\`\`\`

\`\`\`toml
# pyproject.toml
[tool.ruff]
line-length = 100
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM"]
\`\`\`

\`ruff\` \`flake8\` + \`isort\` + \`pyupgrade\` + \`black\` (\`ruff format\` ke zariye) + dozens plugins ki jagah leता hai, aur ~100x tez chalता hai.

**\`breakpoint()\` — interactive debugger**

\`\`\`python
def process(items):
    total = 0
    for item in items:
        breakpoint()            # execution YAHAN rukता hai, pdb mein
        total += item.value
    return total
\`\`\`

\`\`\`
(Pdb) item            # koi bhi variable inspect karो
(Pdb) p [i.value for i in items]   # arbitrary Python chalाओ
(Pdb) n               # agli line (step over)
(Pdb) s               # ek call mein step
(Pdb) c               # agle breakpoint / end tak continue
(Pdb) w               # where -- call stack
(Pdb) q               # quit
\`\`\`

\`PYTHONBREAKPOINT=0\` saare \`breakpoint()\` calls disable karता hai (CI ke liye).

**\`logging\` — \`print\` ke bजaay**

\`\`\`python
import logging

logger = logging.getLogger(__name__)         # prati module ek logger, naam se

def charge(amount):
    logger.debug("charging %s", amount)      # lazy %-formatting -- ek f-string NAHI
    if amount <= 0:
        logger.warning("non-positive amount: %s", amount)
        return
    try:
        gateway.charge(amount)
    except GatewayError:
        logger.exception("charge failed")    # ERROR + poora traceback (sirf except ke andar)
        raise
    logger.info("charged %s successfully", amount)
\`\`\`

\`\`\`python
# EK BAAR configure karो, program startup par (library code mein nahi):
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
\`\`\`

\`\`\`
LEVELS (low -> high):  DEBUG  INFO  WARNING  ERROR  CRITICAL
  threshold ek baar set karो; iske neeche kuch bhi saste mein drop hoता hai

logger = logging.getLogger(__name__)   # prati-module; loggers dotted naam se ek tree banाते hain
logger.debug/info/warning/error/critical("msg %s", arg)   # %-style, lazy
logger.exception("msg")                 # ERROR level + traceback; SIRF ek except block ke andar

logging.basicConfig(level=, format=, handlers=, filename=)   # saral, startup par EK BAAR call
logging.config.dictConfig({...})        # poora config: kai handlers, formatters, per-logger levels

KABHI NAHI:  print() kisi bhi cheez ke liye jо user ko seedha CLI output nahi hai
             log calls mein f-strings (level off hone par bhi banे -> barbaad kaam)
             ek library / imported module ke andar logging configure karna
\`\`\``,

    content: `## \`ruff\` — the modern lint + format tool

\`ruff\` is a single Rust-based tool that subsumes almost the entire historical Python linting/formatting stack:

\`\`\`
ruff check      = flake8 + isort + pyupgrade + pydocstyle + flake8-bugbear + ~50 plugins
ruff format     = black (near-identical output)
\`\`\`

\`\`\`bash
ruff check .                 # report issues
ruff check --fix .           # apply safe auto-fixes (unused imports, sorted imports, f-string upgrades, ...)
ruff check --fix --unsafe-fixes .   # also apply riskier fixes
ruff format .                # reformat
ruff check --select ALL .    # enable every rule, then narrow with ignore
\`\`\`

Typical CI step: \`ruff check . && ruff format --check .\` (the \`--check\` fails if anything is unformatted without changing files). Because it is so fast, teams run it as a pre-commit hook and on every save.

## \`breakpoint()\` and \`pdb\`

\`breakpoint()\` (Python 3.7+) is the idiomatic way to enter the debugger — it calls \`sys.breakpointhook()\`, which defaults to \`pdb.set_trace()\` but is configurable:

\`\`\`bash
PYTHONBREAKPOINT=0                    # breakpoint() becomes a no-op (set this in CI)
PYTHONBREAKPOINT=ipdb.set_trace       # use ipdb instead
PYTHONBREAKPOINT=web_pdb.set_trace    # a browser-based debugger
\`\`\`

Core \`pdb\` commands:

\`\`\`
n   next line (step over calls)          s   step into the next call
c   continue until the next breakpoint   r   continue until the current function returns
l   list source around the current line  ll  list the whole current function
w   where: print the call stack          u / d   move up / down the stack
p expr    print the value of expr        pp expr   pretty-print it
!stmt     execute a statement            b file:line   set a new breakpoint
q   quit the debugger and the program    h   help
\`\`\`

You can also run a script under the debugger from the start: \`python -m pdb myscript.py\`, or drop into pdb on an uncaught exception: \`python -m pdb -c continue myscript.py\`.

## \`logging\` — the model

\`\`\`python
import logging
logger = logging.getLogger(__name__)     # "myapp.services.email"
\`\`\`

- **Loggers** form a tree by dotted name. \`getLogger("a.b.c")\` is a child of \`"a.b"\`. A message propagates up the tree to the root, where handlers usually live.
- **Levels** (\`DEBUG < INFO < WARNING < ERROR < CRITICAL\`): each logger and handler has a threshold; a record below the effective threshold is discarded — and if the logger is disabled for that level, the message string is *not even formatted*, so \`logger.debug("expensive %s", compute())\` still calls \`compute()\` (pass it lazily where possible) but \`logger.debug("x %s", x)\` costs almost nothing when DEBUG is off.
- **Handlers** decide *where* records go: \`StreamHandler\` (stderr), \`FileHandler\`, \`RotatingFileHandler\`, \`SysLogHandler\`, a network handler, etc.
- **Formatters** decide the *layout*: \`"%(asctime)s %(levelname)s %(name)s %(message)s"\`.

## Configuring logging — once, at the top

\`\`\`python
# in your app's entry point (main.py / manage.py / wsgi.py) -- NOT in library modules:
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
\`\`\`

\`\`\`python
# for anything real -- multiple handlers, per-logger levels, JSON output:
import logging.config
logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"default": {"format": "%(asctime)s %(levelname)s %(name)s %(message)s"}},
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "default"},
        "file": {"class": "logging.handlers.RotatingFileHandler",
                 "filename": "app.log", "maxBytes": 10_000_000, "backupCount": 3,
                 "formatter": "default"},
    },
    "root": {"level": "INFO", "handlers": ["console", "file"]},
    "loggers": {"myapp.noisy": {"level": "WARNING"}},   # quiet one subtree
})
\`\`\`

Library code should only ever do \`logger = logging.getLogger(__name__)\` and call \`logger.info(...)\` etc. — never \`basicConfig\`, never add handlers. The *application* configures; libraries emit.

## \`logger.exception\` and structured logging

\`\`\`python
try:
    risky()
except SomeError:
    logger.exception("risky failed for user %s", user_id)   # message + traceback, ERROR level
    raise

# structured / contextual logging:
logger.info("order placed", extra={"order_id": oid, "amount": amt})   # fields for JSON logs
\`\`\`

\`logger.exception(...)\` is \`logger.error(..., exc_info=True)\` and must be called from inside an \`except\` block — it reads the current exception. For production, a JSON formatter (\`python-json-logger\`, \`structlog\`) turns each record into a machine-parseable line for your log aggregator.

## Why not \`print\`

\`\`\`
print()                                logging
-------                                -------
always goes to stdout                  routed by handlers (file, syslog, network, ...)
no levels -- always shown              filtered by level; DEBUG off in prod
no timestamp, no source                asctime, levelname, name, lineno, process, thread
no structure                           extra={...} fields for JSON aggregation
can't be turned off without editing    one config change silences or redirects everything
\`\`\`

\`print\` is for a CLI tool's actual output (what the user asked to see). Everything diagnostic — "started", "processing X", "failed", "slow query" — is a log call.`,

    contentHi: `## \`ruff\` — modern lint + format tool

\`ruff\` ek single Rust-based tool hai jо lagbhag poore aitihaasik Python linting/formatting stack ko samेtता hai:

\`\`\`
ruff check      = flake8 + isort + pyupgrade + flake8-bugbear + ~50 plugins
ruff format     = black
\`\`\`

\`\`\`bash
ruff check .                 # issues report karो
ruff check --fix .           # safe auto-fixes lagाओ
ruff format .                # reformat
\`\`\`

Typical CI step: \`ruff check . && ruff format --check .\`. Kyunki ye itna tez hai, teams ise ek pre-commit hook ki tarah aur har save par chalाते hain.

## \`breakpoint()\` aur \`pdb\`

\`breakpoint()\` (Python 3.7+) debugger mein pravesh karne ka idiomatic tarika hai:

\`\`\`bash
PYTHONBREAKPOINT=0                    # breakpoint() ek no-op ban jाता hai (CI mein set karो)
PYTHONBREAKPOINT=ipdb.set_trace       # iske bजaay ipdb istemal karो
\`\`\`

Core \`pdb\` commands:

\`\`\`
n   agli line (calls ke upar step)       s   agle call mein step
c   agle breakpoint tak continue         r   current function return tak continue
l   current line ke aas-paas source      w   where: call stack print karो
p expr    expr ki value print karो        pp expr   pretty-print
!stmt     ek statement execute karो       b file:line   ek naya breakpoint set karो
q   debugger aur program quit karो        h   help
\`\`\`

Aap ek script ko shuruaat se debugger ke tahat bhi chalा sakte ho: \`python -m pdb myscript.py\`.

## \`logging\` — model

\`\`\`python
import logging
logger = logging.getLogger(__name__)     # "myapp.services.email"
\`\`\`

- **Loggers** dotted naam se ek tree banाते hain. Ek message tree mein upar root tak propagate hoता hai.
- **Levels** (\`DEBUG < INFO < WARNING < ERROR < CRITICAL\`): har logger aur handler ka ek threshold hai; iske neeche ek record discard hoता hai — aur agar logger us level ke liye disabled hai, message string *format bhi nahi hoती*.
- **Handlers** tay karते hain records *kahaan* jाते hain: \`StreamHandler\`, \`FileHandler\`, \`RotatingFileHandler\`.
- **Formatters** *layout* tay karते hain.

## Logging configure karna — ek baar, top par

\`\`\`python
# aapke app ke entry point mein (main.py / manage.py) -- library modules mein NAHI:
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
\`\`\`

\`\`\`python
# kisi bhi asli cheez ke liye -- kai handlers, per-logger levels:
import logging.config
logging.config.dictConfig({
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {"default": {"format": "%(asctime)s %(levelname)s %(name)s %(message)s"}},
    "handlers": {"console": {"class": "logging.StreamHandler", "formatter": "default"}},
    "root": {"level": "INFO", "handlers": ["console"]},
})
\`\`\`

Library code ko sirf \`logger = logging.getLogger(__name__)\` karna chahiye aur \`logger.info(...)\` call karna chahiye — kabhi \`basicConfig\` nahi.

## \`logger.exception\` aur structured logging

\`\`\`python
try:
    risky()
except SomeError:
    logger.exception("risky failed for user %s", user_id)   # message + traceback, ERROR level
    raise

logger.info("order placed", extra={"order_id": oid, "amount": amt})   # JSON logs ke liye fields
\`\`\`

\`logger.exception(...)\` \`logger.error(..., exc_info=True)\` hai aur ek \`except\` block ke andar se call hona chahiye.

## \`print\` kyun nahi

\`\`\`
print()                                logging
-------                                -------
hamesha stdout par jाता hai            handlers dwara routed (file, syslog, network)
koi levels nahi -- hamesha dikhता hai   level se filtered; prod mein DEBUG off
koi timestamp, koi source nahi          asctime, levelname, name, lineno, process
band karne ke liye edit karna padta hai  ek config change sab silence ya redirect karता hai
\`\`\`

\`print\` ek CLI tool ke asli output ke liye hai. Sab kuch diagnostic ek log call hai.`,

    examples: [
      {
        title: 'ruff check --fix: unused imports, unsorted imports, upgradeable code',
        titleHi: 'ruff check --fix: unused imports, unsorted imports, upgradeable code',
        code: `import subprocess, sys, textwrap, tempfile, os, re

d = tempfile.mkdtemp()
open(os.path.join(d, "messy.py"), "w").write(textwrap.dedent('''
    import os
    import sys
    import json
    from typing import List, Optional

    def totals(items: List[int]) -> Optional[int]:
        result = sys.maxsize
        return sum(items)
''').lstrip())

# what ruff finds:
r1 = subprocess.run([sys.executable, "-m", "ruff", "check", "--select", "F,I,UP",
                     "--output-format", "concise", "messy.py"],
                    cwd=d, capture_output=True, text=True)
print("=== ruff check ===")
print(re.sub(r"^.*messy\\.py", "messy.py", r1.stdout, flags=re.M), end="")

# apply the safe fixes:
subprocess.run([sys.executable, "-m", "ruff", "check", "--select", "F,I,UP", "--fix",
                "messy.py"], cwd=d, capture_output=True, text=True)
print("=== messy.py after --fix ===")
print(open(os.path.join(d, "messy.py")).read(), end="")`,
        output: `=== ruff check ===
messy.py:1:1: I001 [*] Import block is un-sorted or un-formatted
messy.py:1:8: F401 [*] \`os\` imported but unused
messy.py:3:8: F401 [*] \`json\` imported but unused
messy.py:4:1: UP035 \`typing.List\` is deprecated, use \`list\` instead
messy.py:6:19: UP006 [*] Use \`list\` instead of \`List\` for type annotation
messy.py:6:33: UP045 [*] Use \`X | None\` for type annotations
messy.py:7:5: F841 Local variable \`result\` is assigned to but never used
Found 7 errors.
[*] 5 fixable with the \`--fix\` option (1 hidden fix can be enabled with the \`--unsafe-fixes\` option).
=== messy.py after --fix ===
import sys


def totals(items: list[int]) -> int | None:
    result = sys.maxsize
    return sum(items)
`,
        explain: '`ruff check` reports each issue as `file:line:col: CODE message`, with `[*]` marking auto-fixable ones: `F401` unused imports (`os`, `json`), `I001` unsorted import block, `UP035`/`UP006`/`UP045` modernisations (`List` -> `list`, `Optional[X]` -> `X | None`), `F841` an unused local. `--fix` removes the unused imports, sorts what remains, and upgrades the annotations in one pass. (Note: exact rule codes/messages can shift between ruff versions.)',
        explainHi: '`ruff check` har issue ko `file:line:col: CODE message` ki tarah report karता hai, `[*]` auto-fixable ones ko mark karता hai: `F401` unused imports, `I001` unsorted imports, `UP035`/`UP006`/`UP045` modernisations, `F841` ek unused local. `--fix` unused imports hataता hai aur annotations upgrade karता hai.',
      },
      {
        title: 'ruff format vs unformatted; and PYTHONBREAKPOINT=0',
        titleHi: 'ruff format vs unformatted; aur PYTHONBREAKPOINT=0',
        code: `import subprocess, sys, textwrap, tempfile, os

d = tempfile.mkdtemp()
open(os.path.join(d, "ugly.py"), "w").write(
    "x={'a':1,'b':2,'c':3}\\n"
    "def f( a,b ):\\n"
    "    return   a+b\\n"
    "result=[i*2 for i in range(10) if i%2==0]\\n"
)

print("=== before ===")
print(open(os.path.join(d, "ugly.py")).read(), end="")

subprocess.run([sys.executable, "-m", "ruff", "format", "ugly.py"], cwd=d,
               capture_output=True, text=True)
print("=== after ruff format ===")
print(open(os.path.join(d, "ugly.py")).read(), end="")

# breakpoint() is a no-op when PYTHONBREAKPOINT=0 -- safe for CI / scripts:
open(os.path.join(d, "dbg.py"), "w").write(textwrap.dedent('''
    def run():
        total = 0
        for i in range(3):
            breakpoint()          # would open pdb -- but disabled via env
            total += i
        return total
    print("result:", run())
'''))
env = {**os.environ, "PYTHONBREAKPOINT": "0"}
r = subprocess.run([sys.executable, "dbg.py"], cwd=d, capture_output=True, text=True, env=env)
print("=== dbg.py with PYTHONBREAKPOINT=0 ===")
print(r.stdout, end="")`,
        output: `=== before ===
x={'a':1,'b':2,'c':3}
def f( a,b ):
    return   a+b
result=[i*2 for i in range(10) if i%2==0]
=== after ruff format ===
x = {"a": 1, "b": 2, "c": 3}


def f(a, b):
    return a + b


result = [i * 2 for i in range(10) if i % 2 == 0]
=== dbg.py with PYTHONBREAKPOINT=0 ===
result: 3
`,
        explain: '`ruff format` normalises quotes (`\'` -> `"`), spacing (`f( a,b )` -> `f(a, b)`, `a+b` -> `a + b`), and blank lines around top-level defs — deterministic, non-configurable style (like black). Separately, `PYTHONBREAKPOINT=0` turns every `breakpoint()` call into a no-op, so `dbg.py` runs straight through and prints `result: 3` without ever opening the debugger — set this in CI so a stray `breakpoint()` cannot hang the build.',
        explainHi: '`ruff format` quotes normalise karता hai (`\'` -> `"`), spacing (`f( a,b )` -> `f(a, b)`), aur top-level defs ke aas-paas blank lines — deterministic, non-configurable style (black ki tarah). Alag se, `PYTHONBREAKPOINT=0` har `breakpoint()` call ko ek no-op banाता hai — ise CI mein set karो taaki ek stray `breakpoint()` build ko hang na kar sake.',
      },
      {
        title: 'logging: levels, per-logger config, and lazy formatting',
        titleHi: 'logging: levels, per-logger config, aur lazy formatting',
        code: `import logging, sys, io

# capture logs into a string so we can assert on them:
stream = io.StringIO()
logging.basicConfig(
    stream=stream,
    level=logging.INFO,
    format="%(levelname)s %(name)s: %(message)s",
    force=True,
)

app_logger = logging.getLogger("myapp")
noisy = logging.getLogger("myapp.noisy")
noisy.setLevel(logging.WARNING)          # quiet one subtree

# lazy %-formatting: the arg is only formatted if the record is emitted
expensive_calls = {"n": 0}
def expensive():
    expensive_calls["n"] += 1
    return "DATA"

app_logger.debug("debug %s", expensive())    # DEBUG < INFO -> dropped, BUT expensive() still ran
app_logger.info("processing %s items", 42)   # emitted
app_logger.warning("low disk: %d%%", 95)     # emitted
noisy.info("noisy info")                     # dropped -- noisy is WARNING+
noisy.warning("noisy warning")               # emitted

try:
    1 / 0
except ZeroDivisionError:
    app_logger.exception("math failed")      # ERROR + traceback

print("--- captured log ---")
for line in stream.getvalue().splitlines():
    if "Traceback" in line or line.startswith(("  ", "ZeroDiv")):
        continue                             # skip the traceback body for a stable printout
    print(line)
print("expensive() was called", expensive_calls["n"], "time(s)")`,
        output: `--- captured log ---
INFO myapp: processing 42 items
WARNING myapp: low disk: 95%
WARNING myapp.noisy: noisy warning
ERROR myapp: math failed
expensive() was called 1 time(s)`,
        explain: '`basicConfig(level=INFO)` sets the root threshold, so `DEBUG` records are dropped — but note `expensive()` in `app_logger.debug("debug %s", expensive())` STILL ran, because the argument is evaluated before the logging call; pass genuinely lazy work differently. `noisy.setLevel(WARNING)` silences `myapp.noisy` below WARNING while `myapp` stays at INFO — per-logger levels. `logger.exception("math failed")` (inside `except`) logs at ERROR with the traceback attached.',
        explainHi: '`basicConfig(level=INFO)` root threshold set karता hai, isliye `DEBUG` records drop hote hain — par `app_logger.debug("debug %s", expensive())` mein `expensive()` PHIR BHI chala, kyunki argument logging call se pehle evaluate hoता hai. `noisy.setLevel(WARNING)` `myapp.noisy` ko WARNING ke neeche silence karта hai jabki `myapp` INFO par rehта hai. `logger.exception(...)` ERROR par traceback ke saath log karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `def process(order):
    print(f"processing order {order.id}")      # goes to stdout, always, no level
    print(f"  items: {order.items}")           # noise in production; can't filter or redirect`,
        right: `logger = logging.getLogger(__name__)

def process(order):
    logger.info("processing order %s", order.id)
    logger.debug("order items: %s", order.items)   # only shown when DEBUG is on`,
        why: '`print` has no level, no timestamp, no source location, always writes to stdout, and can only be turned off by deleting it. `logging` gives you level filtering (DEBUG off in prod), routing to files/syslog/aggregators via handlers, and a consistent format — all controlled from one config, not by editing code. Reserve `print` for a CLI tool\'s actual user-facing output.',
        whyHi: '`print` ka koi level, koi timestamp, koi source location nahi, hamesha stdout par likhता hai. `logging` aapko level filtering, files/syslog/aggregators ko routing, aur ek consistent format deता hai — sab ek config se control. `print` ko ek CLI tool ke asli user-facing output ke liye rakhो.',
      },
      {
        wrong: `logger.info(f"user {user.id} did {action} on {resource}")   # f-string in a log call`,
        right: `logger.info("user %s did %s on %s", user.id, action, resource)   # lazy %-args`,
        why: 'An f-string is built the instant the line executes, before `logger.info` decides whether the record will be emitted. If INFO is disabled (or later filtered), you paid to format a string that gets discarded. The `%`-style form passes the args separately; `logging` interpolates them only if a handler actually emits the record. Linters (`ruff` rule `G004`) flag f-strings in logging calls.',
        whyHi: 'Ek f-string us pal banता hai jab line execute hoती hai, `logger.info` ke ye tay karne se pehle ki record emit hoga ya nahi. Agar INFO disabled hai, aapne ek string format karne ki keemat chukाई jо discard hoती hai. `%`-style form args alag pass karता hai. Linters (`ruff` rule `G004`) log calls mein f-strings flag karते hain.',
      },
      {
        wrong: `# in myapp/utils.py (a library module):
import logging
logging.basicConfig(level=logging.DEBUG)      # a library configuring logging!
logger = logging.getLogger(__name__)`,
        right: `# in myapp/utils.py -- just get a logger, nothing else:
import logging
logger = logging.getLogger(__name__)

# configuration goes ONCE in the application entry point (main.py / manage.py):
#   logging.basicConfig(level=logging.INFO, ...)`,
        why: 'A library or imported module must never call `basicConfig`, add handlers, or set the root level — that hijacks logging for every application that imports it, overriding the application\'s own choices (and `basicConfig` only takes effect on the first call, so it is a race). Libraries do exactly one thing: `logger = logging.getLogger(__name__)` and emit records. The application configures.',
        whyHi: 'Ek library ya imported module ko kabhi `basicConfig` call nahi karna chahiye, handlers add nahi karne chahiye, ya root level set nahi karna chahiye — ye har application ke liye logging hijack karता hai jо ise import karता hai. Libraries bilkul ek cheez karती hain: `logger = logging.getLogger(__name__)`. Application configure karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**`ruff` has largely replaced `flake8` + `isort` + `black` + `pyupgrade` on new Python projects** — one `pyproject.toml` section, one pre-commit hook, sub-second runs on a large codebase. `ruff check --fix` + `ruff format` in CI (with `--check` variants that fail without modifying) is the standard gate.',
        hi: '**`ruff` ne naye Python projects par `flake8` + `isort` + `black` + `pyupgrade` ki jagah lे li hai** — ek `pyproject.toml` section, ek pre-commit hook. CI mein `ruff check --fix` + `ruff format` standard gate hai.',
      },
      {
        en: '**`breakpoint()` + `PYTHONBREAKPOINT` is how teams debug without committing `pdb` calls** — drop `breakpoint()` where you need it, and set `PYTHONBREAKPOINT=0` in CI so a forgotten one is a no-op instead of a hung build. `python -m pdb -c continue script.py` gives a post-mortem on any uncaught exception.',
        hi: '**`breakpoint()` + `PYTHONBREAKPOINT` aise teams `pdb` calls commit kiye bina debug karती hain** — `breakpoint()` jahaan chahiye chhodो, aur CI mein `PYTHONBREAKPOINT=0` set karो.',
      },
      {
        en: '**Django configures logging via `settings.LOGGING` (a `dictConfig`)**; app code just does `logger = logging.getLogger(__name__)` and `logger.info/warning/exception`. Production ships a JSON formatter (`python-json-logger`) so CloudWatch/Datadog/ELK can index the `extra={...}` fields. `logger.exception` in every `except` that logs.',
        hi: '**Django `settings.LOGGING` (ek `dictConfig`) ke zariye logging configure karता hai**; app code bस `logger = logging.getLogger(__name__)` karता hai. Production ek JSON formatter ship karता hai. Har `except` mein jо log karता hai `logger.exception`.',
      },
    ],

    interviewQA: [
      {
        q: 'Why use the `logging` module instead of `print`, and what is the model (loggers, levels, handlers, formatters)?',
        qHi: '`print` ke bजaay `logging` module kyun istemal karें, aur model kya hai (loggers, levels, handlers, formatters)?',
        a: 'print writes a string to standard output, unconditionally, with no metadata and no way to control it short of deleting the line. logging separates the act of emitting a diagnostic message from the decisions about whether, where, and how it is recorded, and centralises those decisions in one configuration. The model has four parts. A logger is the object your code calls; you get one per module with getLogger of double-underscore name, and loggers form a tree by their dotted names, so a logger named a dot b dot c is a child of a dot b, and a message flows up the tree. A level is a severity — debug, info, warning, error, critical, in increasing order. Each logger and each handler has a threshold; a record below the effective threshold is discarded, and importantly, if the logger is disabled for that level the message is not even formatted, so a debug call with cheap arguments costs almost nothing in production where debug is off. A handler decides where records go — a stream handler to stderr, a file handler, a rotating file handler, a syslog or network handler — and you can attach several so one record goes to both the console and a file. A formatter decides the layout of each record — timestamp, level name, logger name, the message, and optionally the source file and line, the process and thread. The practical advantages over print are: you filter by level, so debug and info are silent in production but available when you raise the level to investigate; you route by handler, so logs can go to a file or a log aggregator without touching the code; you get consistent structured metadata on every line; and you change all of this from one config call at startup rather than editing scattered print statements. print is appropriate only for a command-line tool\'s actual output — the thing the user ran the command to see. Everything diagnostic is a log call.',
        aHi: 'print ek string ko standard output par likhता hai, bina shart, bina metadata. logging ek diagnostic message emit karne ke act ko ye faislon se alag karता hai ki ise record kiya jाए ya nahi, kahaan, aur kaise, aur un faislon ko ek configuration mein centralise karता hai. Model mein chaar hisse hain. Ek logger wo object hai jise aapka code call karता hai; aap prati module ek paate ho, aur loggers apne dotted names se ek tree banाते hain. Ek level ek severity hai — debug, info, warning, error, critical. Har logger aur handler ka ek threshold hai. Ek handler tay karता hai records kahaan jाते hain. Ek formatter har record ka layout tay karता hai. print par vyavhaarik faayde: aap level se filter karते ho; aap handler se route karते ho; aap har line par consistent structured metadata paate ho; aur aap ise sab ek config call se badalते ho.',
      },
      {
        q: 'Why should log calls use `%`-style arguments instead of f-strings, and why should a library never call `basicConfig`?',
        qHi: 'Log calls ko f-strings ke bजaय `%`-style arguments kyun istemal karne chahiye, aur ek library ko kabhi `basicConfig` kyun nahi call karna chahiye?',
        a: 'The f-string question is about when the string gets built. An f-string is evaluated immediately, as part of executing the line, before the logging call even begins. So if you write logger dot info of an f-string, the entire string — including any method calls, formatting, or repr computations inside it — is constructed every single time that line runs, regardless of whether info is enabled. On a production system with info-level logging off, or with that logger filtered, you have paid the full formatting cost for a string that is then discarded. The percent-style form is lazy: you pass the format template and the arguments separately, as logger dot info of the template comma the args, and the logging module only interpolates the template with the arguments if a handler actually decides to emit the record. When the level is disabled, the interpolation never happens. This can be a significant saving for debug logging that serialises objects or formats large structures. Linters flag f-strings in logging calls for exactly this reason. The basicConfig question is about ownership. basicConfig, adding handlers to the root logger, and setting the root level are application-wide decisions — they determine how logging behaves for every module in the process, including code the application author did not write. A library is imported into applications the library author does not control. If the library calls basicConfig, it hijacks logging configuration for every one of those applications, overriding whatever the application chose, and since basicConfig only has an effect on its first call, whether the library or the application wins becomes a race depending on import order. So a library must do exactly one logging thing: call getLogger of double-underscore name at module level to obtain a logger, and then emit records on it. It attaches no handlers, sets no levels, calls no config function. The application — and only the application, in its entry point — configures logging, once, and the library\'s records then flow through whatever the application set up.',
        aHi: 'f-string sawaal is baare mein hai ki string kab banती hai. Ek f-string turant evaluate hoती hai, line execute karne ke hisse ki tarah, logging call shuru hone se pehle bhi. Toh agar aap logger dot info of an f-string likhते ho, poori string har baar banती hai jab wo line chalती hai, chahe info enabled hai ya nahi. Info-level logging off waale production system par, aapne ek string ke liye poori formatting keemat chukाई jо phir discard hoती hai. Percent-style form lazy hai: aap format template aur arguments alag pass karते ho, aur logging module template ko sirf tab interpolate karता hai agar ek handler asal mein record emit karne ka faisla karता hai. basicConfig sawaal ownership ke baare mein hai. basicConfig, root logger mein handlers add karna, aur root level set karna application-wide faisle hain. Ek library applications mein import hoती hai jinhe library author control nahi karता. Agar library basicConfig call karती hai, ye un har application ke liye logging configuration hijack karती hai. Ek library ko bilkul ek logging cheez karni chahiye: getLogger call karो.',
      },
    ],

    exercises: [
      {
        task: 'Write a `messy.py` with an unused import, an unsorted import block, `List[int]` in an annotation, and an unused local variable. Run `python -m ruff check --select F,I,UP` on it via subprocess and print the findings. Then run `--fix` and print the cleaned file. Confirm the fixes removed the unused import and modernised `List` -> `list`.',
        taskHi: 'Ek `messy.py` likhо ek unused import, ek unsorted import block, ek annotation mein `List[int]`, aur ek unused local variable ke saath. Ispar subprocess se `python -m ruff check --select F,I,UP` chalाओ. Phir `--fix` chalाओ.',
        hint: 'ruff codes: `F401` unused import, `I001` unsorted imports, `UP006`/`UP035` `List` -> `list` / `from collections.abc`, `F841` unused local. `subprocess.run([sys.executable, "-m", "ruff", "check", "--select", "F,I,UP", "--fix", "messy.py"], cwd=d, ...)`.',
        hintHi: 'ruff codes: `F401`, `I001`, `UP006`/`UP035`, `F841`. `subprocess.run([sys.executable, "-m", "ruff", "check", "--select", "F,I,UP", "--fix", "messy.py"], cwd=d, ...)`.',
      },
      {
        task: 'Write `log_demo.py` that: creates `logger = logging.getLogger("demo")`, configures `basicConfig(stream=<StringIO>, level=INFO, format="%(levelname)s: %(message)s", force=True)`, then logs one `debug` (dropped), one `info`, one `warning`, and one `exception` (inside an `except`). Print the captured stream and assert the `debug` line is absent and the `exception` line is present with `ERROR`.',
        taskHi: '`log_demo.py` likhо jо: `logger = logging.getLogger("demo")` banае, `basicConfig` configure kare, phir ek `debug` (dropped), ek `info`, ek `warning`, aur ek `exception` log kare. Captured stream print karो.',
        hint: '`import io; stream = io.StringIO(); logging.basicConfig(stream=stream, level=logging.INFO, format="%(levelname)s: %(message)s", force=True)`. `logger.debug("x")` produces nothing (INFO threshold). `try: 1/0 except: logger.exception("boom")` -> `ERROR: boom` + traceback.',
        hintHi: '`import io; stream = io.StringIO(); logging.basicConfig(stream=stream, level=logging.INFO, ..., force=True)`. `logger.debug("x")` kuch nahi banाता. `try: 1/0 except: logger.exception("boom")` -> `ERROR: boom`.',
      },
      {
        task: 'Demonstrate the lazy-logging cost: write a function `expensive()` that increments a counter and returns a string. Call `logger.debug("val: %s", expensive())` with the level at INFO (record dropped). Then call `logger.info("val: %s", expensive())` (record kept). Print the counter — it should be 2 (the arg is evaluated BEFORE the logging call regardless), and explain why passing a callable or restructuring is the real lazy fix.',
        taskHi: 'Lazy-logging keemat dikhाओ: ek function `expensive()` likhо jо ek counter badhाe. `logger.debug("val: %s", expensive())` call karो level INFO par (record dropped). Phir `logger.info("val: %s", expensive())`. Counter print karो.',
        hint: 'The counter is 2, not 1 — `expensive()` runs before `logger.debug` is even called, because Python evaluates arguments first. The `%`-style laziness only saves the *string interpolation*, not argument evaluation. True laziness: guard with `if logger.isEnabledFor(logging.DEBUG):` or pass a lazy wrapper object.',
        hintHi: 'Counter 2 hai, 1 nahi — `expensive()` `logger.debug` call hone se pehle chalता hai. `%`-style laziness sirf *string interpolation* bachaती hai. Asli laziness: `if logger.isEnabledFor(logging.DEBUG):` se guard karो.',
      },
    ],

    keyTakeaways: [
      '`ruff` is one fast tool replacing `flake8` + `isort` + `pyupgrade` + `black` (`ruff format`) + ~50 plugins. `ruff check --fix` auto-fixes; `ruff format` reformats. CI: `ruff check . && ruff format --check .`.',
      '`breakpoint()` (3.7+) enters the debugger — configurable via `PYTHONBREAKPOINT` (`=0` disables all, for CI; `=ipdb.set_trace` swaps debuggers). Core pdb: `n` next, `s` step in, `c` continue, `r` return, `l` list, `w` where, `p`/`pp` print, `q` quit.',
      '`logging` model: LOGGERS (one per module via `getLogger(__name__)`, a tree by dotted name) -> LEVELS (`DEBUG<INFO<WARNING<ERROR<CRITICAL`, filter threshold) -> HANDLERS (where: stream/file/syslog) -> FORMATTERS (layout).',
      'Configure logging ONCE at the application entry point (`basicConfig` or `dictConfig`). Library/imported code does ONLY `logger = logging.getLogger(__name__)` and emits — NEVER `basicConfig`, never adds handlers.',
      'Use `%`-style args in log calls (`logger.info("x %s", val)`), NOT f-strings — the f-string is built even when the level is disabled. (Argument *evaluation* still happens; guard with `isEnabledFor` for truly expensive args.)',
      '`logger.exception("msg")` = `logger.error("msg", exc_info=True)` — logs the message AND the traceback at ERROR level. Call it ONLY inside an `except` block.',
      'Per-logger levels (`logging.getLogger("noisy.subtree").setLevel(WARNING)`) quiet part of the tree. `extra={...}` adds structured fields for JSON log aggregation.',
      'NEVER use `print` for diagnostics ("started", "processing X", "failed") — that is a log call. `print` is only for a CLI tool\'s actual user-facing output.',
    ],
    keyTakeawaysHi: [
      '`ruff` ek tez tool hai jо `flake8` + `isort` + `pyupgrade` + `black` (`ruff format`) + ~50 plugins ki jagah leता hai. `ruff check --fix` auto-fix karता hai; `ruff format` reformat. CI: `ruff check . && ruff format --check .`.',
      '`breakpoint()` (3.7+) debugger mein pravesh karता hai — `PYTHONBREAKPOINT` ke zariये configurable (`=0` sab disable, CI ke liye). Core pdb: `n`, `s`, `c`, `r`, `l`, `w`, `p`/`pp`, `q`.',
      '`logging` model: LOGGERS (`getLogger(__name__)` se prati module, dotted naam se ek tree) -> LEVELS (`DEBUG<INFO<WARNING<ERROR<CRITICAL`) -> HANDLERS (kahaan: stream/file/syslog) -> FORMATTERS (layout).',
      'Logging ko application entry point par EK BAAR configure karो. Library/imported code SIRF `logger = logging.getLogger(__name__)` karता hai aur emit karता hai — KABHI `basicConfig` nahi.',
      'Log calls mein `%`-style args istemal karो (`logger.info("x %s", val)`), f-strings NAHI — f-string level disabled hone par bhi banता hai. (Argument *evaluation* phir bhi hoती hai.)',
      '`logger.exception("msg")` = `logger.error("msg", exc_info=True)` — message AUR traceback ERROR level par log karता hai. Ise SIRF ek `except` block ke andar call karो.',
      'Per-logger levels tree ka hissa quiet karते hain. `extra={...}` JSON log aggregation ke liye structured fields jodता hai.',
      'Diagnostics ke liye KABHI `print` istemal mat karो — wo ek log call hai. `print` sirf ek CLI tool ke asli user-facing output ke liye hai.',
    ],
  },
];
