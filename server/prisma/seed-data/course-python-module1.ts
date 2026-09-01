/**
 * Python Complete Course — Module 1: Python Foundations, lessons 1-3.
 *
 * Audience: a JavaScript/TypeScript developer who needs to become fluent in
 * Python (to maintain an inherited Django/DRF codebase). Every lesson names
 * the JS habit that trips people up and shows the Python way.
 *
 * Lesson 1: running Python, the REPL, print, and why indentation IS the syntax
 *           (no braces, no semicolons). Broken example: a JS-style braced block
 *           / inconsistent indentation -> IndentationError / SyntaxError.
 * Lesson 2: names bind to objects; dynamic typing; everything is an object;
 *           int is arbitrary precision; `/` vs `//` vs `%` vs `**`. Broken:
 *           expecting `const`, expecting integer division from `/`, 0.1 + 0.2.
 * Lesson 3: strings — quotes, immutability, f-strings (the modern way),
 *           `+` vs `.join`, common methods, str vs repr. Broken: `"a" - "b"`,
 *           building a big string with `+=` in a loop.
 *
 * NOTE for future editors: `examples` use `code` + `output` (single language —
 * Python). Escape every inline-code backtick inside the template-literal fields
 * (`content`/`contentHi`/`simple`/`simpleHi`). Single-quoted fields (explain,
 * why, q, a, task, keyTakeaways) need only `\'` for apostrophes, never `\\'`.
 * Run `npx tsc --noEmit -p .` from `server/`, scan for Devanagari/Cyrillic
 * (U+0900-097F, U+0400-04FF), and RUN every code sample with `python` and diff
 * against the claimed `output`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_1: CourseLesson[] = [
  {
    slug: 'py-running-python-and-indentation',
    title: 'Running Python: The REPL, print, and Why Indentation Is the Syntax',
    titleHi: 'Python Chalaana: REPL, print, Aur Indentation Hi Syntax Kyun Hai',
    description: 'Coming from JavaScript and wrapping a block of Python in curly braces and ending each line with a semicolon, the way you always have. Python rejects it before it runs a single line, because in Python the indentation itself is the grammar — the spaces at the start of a line are not decoration, they are how the language knows which statements belong together.',
    descriptionHi: 'JavaScript se aakar Python ke ek block ko curly braces mein lapetna aur har line ko semicolon se khatam karna, jaise aap hamesha karte the. Python ise ek bhi line chalane se pehle reject kar deta hai, kyunki Python mein indentation hi grammar hai — ek line ki shuruaat mein spaces sajaawat nahi hain, wo hai jise language jaanti hai ki kaunse statements saath hain.',
    difficulty: 'EASY',
    duration: 16,
    order: 1,

    analogy: {
      en: '**Two ways of writing a recipe so a reader knows which steps are sub-steps of a bigger step.** One writer wraps every group of sub-steps in brackets: "Make the sauce { chop the garlic; heat the oil; add the tomatoes }". The brackets do all the work; the writer could cram it onto one line and it would still be unambiguous. The other writer uses only the layout of the page: "Make the sauce" on its own line, and then the three sub-steps each indented underneath it, lined up with each other. There are no brackets at all — the fact that those three lines sit further to the right, by the same amount, is the entire signal that they belong to "make the sauce". If one of them drifts left or right by a stray space, the recipe now says something different, and a careful reader stops and asks what you meant. JavaScript is the bracket writer: the braces group statements and the indentation is just for humans. Python is the layout writer: there are no braces, and the indentation is read by the language itself. A colon at the end of a line means "the indented lines below me are my body", and every line in that body must be indented by exactly the same amount.',
      hi: '**Ek recipe likhne ke do tarike taaki ek paathak jaane ki kaunse steps ek bade step ke sub-steps hain.** Ek likhne waala har group of sub-steps ko brackets mein lapetta hai: "Sauce banao { lehsun kaato; tel garam karo; tamaatar daalo }". Brackets saara kaam karte hain; likhne waala ise ek line par thoos sakta hai aur ye phir bhi spasht hoga. Doosra likhne waala sirf page ke layout ka istemal karta hai: "Sauce banao" apni line par, aur phir teen sub-steps har ek uske neeche indented, ek doosre se line mein. Koi brackets nahi hain — ye tathya ki wo teen lines usi maatra se daayen baithi hain poora signal hai ki wo "sauce banao" ki hain. Agar unmein se ek ek awaaraa space se baayen ya daayen khisak jaati hai, recipe ab kuch alag kehti hai, aur ek saavdhaan paathak rukkar poochhta hai aapka kya matlab tha. JavaScript bracket likhne waala hai: braces statements group karte hain aur indentation sirf insaanon ke liye hai. Python layout likhne waala hai: koi braces nahi, aur indentation khud language padhti hai. Ek line ke ant mein ek colon ka matlab hai "mere neeche ki indented lines mera body hain", aur us body ki har line bilkul usi maatra se indented honi chahiye.',
    },

    simple: `**Start broken.** Writing Python the way you write JavaScript — braces and semicolons:

\`\`\`python
# a JS developer's first instinct
def greet(name) {          # SyntaxError: Python has no { after the parameter list
    console.log("hi " + name);   # and no console, and no ; needed
}
\`\`\`

Python does not use \`{ }\` to group statements and does not need \`;\` to end them. Running that file fails immediately with \`SyntaxError\`, before any code executes.

Even after removing the braces, indentation that is not consistent breaks it:

\`\`\`python
def greet(name):
    print("hi", name)
      print("welcome")     # IndentationError: unexpected indent
\`\`\`

The two lines of the function body must start at the same column. The extra spaces before \`print("welcome")\` are a syntax error — Python cannot tell what block that line is supposed to be in.

**The fix: a colon, then a consistently indented block**

\`\`\`python
def greet(name):           # the colon says "a block follows"
    print("hi", name)      # 4 spaces — the body of greet
    print("welcome")       # same 4 spaces — still the body

greet("Sam")               # 0 spaces — back at the top level, this runs
\`\`\`

\`\`\`
hi Sam
welcome
\`\`\`

The rules: a statement that starts a block (\`def\`, \`if\`, \`for\`, \`while\`, \`class\`, \`with\`, \`try\`) ends with \`:\`. The lines belonging to that block are all indented by the same amount — **4 spaces is the universal convention**. You dedent (move back left) to end the block. There are no braces anywhere. You run a file with \`python script.py\`, or type expressions one at a time into the interactive prompt (\`python\` with no arguments — the "REPL").`,

    simpleHi: `**Toote hue se shuru.** Python ko waise likhna jaise aap JavaScript likhte ho — braces aur semicolons:

\`\`\`python
# ek JS developer ki pehli aadat
def greet(name) {          # SyntaxError: Python mein parameter list ke baad koi { nahi
    console.log("hi " + name);   # aur koi console nahi, aur ; ki zaroorat nahi
}
\`\`\`

Python statements group karne ke liye \`{ }\` istemal nahi karta aur unhe khatam karne ke liye \`;\` ki zaroorat nahi. Us file ko chalana turant \`SyntaxError\` se fail hota hai, koi code chalne se pehle.

Braces hataane ke baad bhi, indentation jo consistent nahi hai use todta hai:

\`\`\`python
def greet(name):
    print("hi", name)
      print("welcome")     # IndentationError: unexpected indent
\`\`\`

Function body ki do lines usi column par shuru honi chahiye. \`print("welcome")\` se pehle ke atirikt spaces ek syntax error hain — Python nahi bata sakta ki wo line kaunse block mein honi chahiye.

**Fix: ek colon, phir ek consistently indented block**

\`\`\`python
def greet(name):           # colon kehta hai "ek block aage hai"
    print("hi", name)      # 4 spaces — greet ka body
    print("welcome")       # wahi 4 spaces — abhi bhi body

greet("Sam")               # 0 spaces — wapas top level par, ye chalta hai
\`\`\`

\`\`\`
hi Sam
welcome
\`\`\`

Niyam: ek statement jo ek block shuru karta hai (\`def\`, \`if\`, \`for\`, \`while\`, \`class\`, \`with\`, \`try\`) \`:\` se khatam hota hai. Us block ki lines sab usi maatra se indented hoti hain — **4 spaces universal convention hai**. Aap dedent karte ho (wapas baayen) block khatam karne ko. Kahin koi braces nahi. Aap ek file \`python script.py\` se chalate ho, ya interactive prompt mein ek baar mein ek expression type karte ho (\`python\` bina arguments — "REPL").`,

    content: `## What actually runs when you type \`python script.py\`

\`\`\`
python script.py
   |
   1. CPython reads the whole file as text
   2. compiles it to BYTECODE (a .pyc file may be cached in __pycache__/)
   3. the bytecode runs on the Python Virtual Machine, top to bottom
\`\`\`

There is no separate "compile step" you invoke — step 2 happens automatically every run (or is skipped if an up-to-date \`.pyc\` exists). A \`SyntaxError\` or \`IndentationError\` is caught in step 2, so *none* of the file runs — unlike a runtime error, which runs everything up to the failing line.

## The REPL: your most-used tool

\`\`\`
$ python
>>> 2 + 2
4
>>> name = "Sam"
>>> f"hi {name}"
'hi Sam'
>>> exit()          # or Ctrl-Z then Enter on Windows, Ctrl-D elsewhere
\`\`\`

Type \`python\` with no file and you get an interactive prompt. Every expression is evaluated and its value printed immediately — you do not need \`print()\` in the REPL (but you do in a script). This is where you check "what does this method return", "is this truthy", "what type is that". Django ships a supercharged version: \`python manage.py shell\`.

## Indentation, precisely

\`\`\`python
if today == "Monday":
    print("start of week")      # 4 spaces -> body of the if
    if raining:                 # nested block
        print("bring umbrella") # 8 spaces -> body of the inner if
    print("commute")            # back to 4 -> still the outer if
print("done")                   # 0 spaces -> runs regardless
\`\`\`

\`\`\`
- Pick 4 spaces. Never tabs. Never mix. (Editors set to "insert spaces" for .py.)
- Every line in one block must have the SAME indentation.
- A blank line does not matter; a comment line must still be indent-legal.
- An empty block is a SyntaxError -> use \`pass\` as a placeholder:
      def todo():
          pass
\`\`\`

## The pieces of a Python source file

\`\`\`python
#!/usr/bin/env python3          # optional shebang (Unix "run with python3")
"""Module docstring: what this file is."""   # optional, first statement

import math                    # imports go at the top
from datetime import datetime

TAX_RATE = 0.18                # module-level constant (UPPER_SNAKE by convention)

def total(amount):             # a function definition
    """Return amount plus tax."""
    return amount * (1 + TAX_RATE)

if __name__ == "__main__":      # runs only when executed directly, not on import
    print(total(100))
\`\`\`

Comments start with \`#\` to end of line. There is no \`/* ... */\`. A string literal sitting alone as the first line of a file, function, or class is a **docstring** — documentation the tooling reads, not a comment.

## For a JavaScript developer, the quick list

\`\`\`
JavaScript                          Python
{ }  to group                       indentation (a \`:\` then an indented block)
;    to end a statement             newline (semicolons legal but never used)
//   and  /* */  comments           #  only
console.log(x)                      print(x)
camelCase                           snake_case  (functions, variables)
let / const / var                   just a name:  x = 1   (no keyword)
=== / !==                           ==  /  !=   (already value-and-type aware)
&&  ||  !                           and  or  not
null / undefined                    None  (one thing, not two)
true / false                        True / False   (capital first letter)
\`\`\``,

    contentHi: `## Jab aap \`python script.py\` type karte ho tab asal mein kya chalta hai

\`\`\`
python script.py
   |
   1. CPython poori file ko text ki tarah padhta hai
   2. use BYTECODE mein compile karta hai (ek .pyc file __pycache__/ mein cache ho sakti hai)
   3. bytecode Python Virtual Machine par chalta hai, upar se neeche
\`\`\`

Koi alag "compile step" nahi jise aap invoke karte ho — step 2 har run apne aap hota hai (ya skip hota hai agar ek up-to-date \`.pyc\` maujood hai). Ek \`SyntaxError\` ya \`IndentationError\` step 2 mein pakda jaata hai, isliye file ka *kuch bhi* nahi chalta — ek runtime error ke ulte, jo failing line tak sab kuch chalata hai.

## REPL: aapka sabse istemal hone waala tool

\`\`\`
$ python
>>> 2 + 2
4
>>> name = "Sam"
>>> f"hi {name}"
'hi Sam'
>>> exit()          # ya Windows par Ctrl-Z phir Enter, aur jagah Ctrl-D
\`\`\`

\`python\` bina file type karo aur aapko ek interactive prompt milta hai. Har expression evaluate hota hai aur iski value turant print hoti hai — REPL mein aapko \`print()\` ki zaroorat nahi (par ek script mein hai). Yahaan aap check karte ho "ye method kya lautaata hai", "kya ye truthy hai", "wo kaunsa type hai". Django ek supercharged version deta hai: \`python manage.py shell\`.

## Indentation, thik-thik

\`\`\`python
if today == "Monday":
    print("start of week")      # 4 spaces -> if ka body
    if raining:                 # nested block
        print("bring umbrella") # 8 spaces -> andar ke if ka body
    print("commute")            # wapas 4 -> abhi bhi baahar ka if
print("done")                   # 0 spaces -> chahe kuch bhi ho chalta hai
\`\`\`

\`\`\`
- 4 spaces chuno. Kabhi tabs nahi. Kabhi mix nahi. (Editors ko .py ke liye "insert spaces".)
- Ek block ki har line ki SAME indentation honi chahiye.
- Ek blank line maayne nahi rakhti; ek comment line abhi bhi indent-legal honi chahiye.
- Ek empty block ek SyntaxError hai -> placeholder ke liye \`pass\` istemal karo:
      def todo():
          pass
\`\`\`

## Ek Python source file ke hisse

\`\`\`python
#!/usr/bin/env python3          # optional shebang (Unix "python3 se chalao")
"""Module docstring: ye file kya hai."""   # optional, pehla statement

import math                    # imports upar jaate hain
from datetime import datetime

TAX_RATE = 0.18                # module-level constant (convention se UPPER_SNAKE)

def total(amount):             # ek function definition
    """amount plus tax lautaao."""
    return amount * (1 + TAX_RATE)

if __name__ == "__main__":      # sirf tab chalta hai jab seedhe execute ho, import par nahi
    print(total(100))
\`\`\`

Comments \`#\` se line ke ant tak shuru hote hain. Koi \`/* ... */\` nahi. Ek string literal jo ek file, function, ya class ki pehli line ki tarah akela baitha hai ek **docstring** hai — documentation jo tooling padhti hai, ek comment nahi.

## Ek JavaScript developer ke liye, jaldi list

\`\`\`
JavaScript                          Python
{ }  group karne ko                 indentation (ek \`:\` phir ek indented block)
;    statement khatam karne ko       newline (semicolons legal par kabhi istemal nahi)
//   aur  /* */  comments            #  sirf
console.log(x)                      print(x)
camelCase                           snake_case  (functions, variables)
let / const / var                   sirf ek naam:  x = 1   (koi keyword nahi)
=== / !==                           ==  /  !=   (pehle se value-and-type aware)
&&  ||  !                           and  or  not
null / undefined                    None  (ek cheez, do nahi)
true / false                        True / False   (pehla akshar capital)
\`\`\``,

    examples: [
      {
        title: 'Broken: braces and semicolons',
        titleHi: 'Toota: braces aur semicolons',
        code: `def area(w, h) {
    return w * h;
}
print(area(3, 4));`,
        output: `  File "script.py", line 1
    def area(w, h) {
                   ^
SyntaxError: expected ':'`,
        explain: 'Python expects a ":" after the parameter list, not a "{", so it stops at the brace and nothing in the file runs. The error message names exactly what was missing. The fix is "def area(w, h):" then an indented "return w * h" on the next line, and no semicolons anywhere.',
        explainHi: 'Python { par ruk jaata hai — jahaan ek : ki ummeed hai wahaan wo valid nahi hai. File ka kuch nahi chalta. Fix hai "def area(w, h):" phir agli line par ek indented "return w * h", aur kahin koi semicolons nahi.',
      },
      {
        title: 'Broken: inconsistent indentation',
        titleHi: 'Toota: inconsistent indentation',
        code: `total = 0
for n in [1, 2, 3]:
    total = total + n
   print(total)`,
        output: `  File "script.py", line 4
    print(total)
                ^
IndentationError: unindent does not match any outer indentation level`,
        explain: 'The loop body is indented 4 spaces; the print is indented 3. Python cannot place that line — it is not at 4 (inside the loop) and not at 0 (outside it). Every line of one block must share the exact same indentation.',
        explainHi: 'Loop body 4 spaces indented hai; print 3 indented hai. Python us line ko rakh nahi sakta — wo na 4 par hai (loop ke andar) na 0 par (uske baahar). Ek block ki har line ki bilkul same indentation honi chahiye.',
      },
      {
        title: 'Fixed: colon, 4-space block, dedent to end',
        titleHi: 'Theek: colon, 4-space block, khatam karne ko dedent',
        code: `def area(w, h):
    result = w * h
    return result

for n in [1, 2, 3]:
    print("n is", n)
    if n == 2:
        print("  (found two)")

print("area:", area(3, 4))`,
        output: `n is 1
n is 2
  (found two)
n is 3
area: 12`,
        explain: 'Each block opens with ":" and its body is indented 4 spaces. The nested "if" body goes to 8. Dedenting back to 4 continues the loop; dedenting to 0 ends it. print() is needed here because this is a script, not the REPL.',
        explainHi: 'Har block ":" se khulta hai aur iska body 4 spaces indented hai. Nested "if" body 8 par jaata hai. Wapas 4 par dedent karna loop jaari rakhta hai; 0 par dedent karna use khatam karta hai. print() yahaan chahiye kyunki ye ek script hai, REPL nahi.',
      },
    ],

    mistakes: [
      {
        wrong: `if x > 0:
print("positive")`,
        right: `if x > 0:
    print("positive")`,
        why: 'The line after a colon must be indented — it is the body of the block. Leaving it at column 0 gives "IndentationError: expected an indented block". This is the single most common first-day error coming from a braces language, where the newline after ) did nothing.',
        whyHi: 'Colon ke baad ki line indented honi chahiye — wo block ka body hai. Ise column 0 par chhodna "IndentationError: expected an indented block" deta hai. Ye braces language se aane par sabse aam pehle-din ki galti hai, jahaan ) ke baad newline kuch nahi karti thi.',
      },
      {
        wrong: `def f():
    x = 1
	y = 2      # this line uses a TAB, the line above uses spaces`,
        right: `def f():
    x = 1
    y = 2      # both lines: 4 spaces, no tabs`,
        why: 'Mixing tabs and spaces for indentation is a "TabError" in Python 3 (in Python 2 it silently did the wrong thing). The fix is to configure your editor to insert spaces for .py files. A visible symptom: the code looks aligned but Python rejects it.',
        whyHi: 'Indentation ke liye tabs aur spaces mix karna Python 3 mein ek "TabError" hai (Python 2 mein ye chupchaap galat karta tha). Fix hai apne editor ko .py files ke liye spaces insert karne ko configure karna. Ek dikhne waala lakshan: code aligned dikhta hai par Python ise reject karta hai.',
      },
      {
        wrong: `# in a script:
"hello world"
2 + 2`,
        right: `# in a script:
print("hello world")
print(2 + 2)`,
        why: 'The REPL prints the value of every expression; a script does not. A bare "hello world" or "2 + 2" on its own line in a .py file is evaluated and then thrown away — you see nothing. Wrap anything you want to see in print().',
        whyHi: 'REPL har expression ki value print karta hai; ek script nahi. Ek .py file mein apni line par ek nanga "hello world" ya "2 + 2" evaluate hota hai aur phir phenk diya jaata hai — aapko kuch nahi dikhta. Jo bhi aap dekhna chahte ho use print() mein lapeto.',
      },
    ],

    realWorld: [
      {
        en: '**Django\'s entire codebase and yours** relies on the indentation rule — a view function\'s body, a model\'s fields, a serializer\'s Meta class are all indented blocks under a `:`. Misaligning one line is a syntax error that stops the whole server from starting.',
        hi: '**Django ka poora codebase aur aapka** indentation niyam par nirbhar karta hai — ek view function ka body, ek model ke fields, ek serializer ka Meta class sab ek `:` ke neeche indented blocks hain. Ek line ko misalign karna ek syntax error hai jo poore server ko shuru hone se rok deta hai.',
      },
      {
        en: '**`python manage.py shell`** is where you debug a live Django project — query the database, inspect an object, test a function — using the same REPL behaviour: type an expression, see its value, no `print()` needed.',
        hi: '**`python manage.py shell`** wo jagah hai jahaan aap ek live Django project debug karte ho — database query karo, ek object inspect karo, ek function test karo — usi REPL vyavhaar ka istemal karke: ek expression type karo, iski value dekho, koi `print()` nahi chahiye.',
      },
      {
        en: '**Linters and formatters** (`ruff`, `black`) exist partly because indentation carries meaning — they normalise every block to 4 spaces and catch a stray indent before it reaches code review or CI.',
        hi: '**Linters aur formatters** (`ruff`, `black`) kuch hisse mein isliye maujood hain kyunki indentation matlab rakhti hai — wo har block ko 4 spaces par normalise karte hain aur ek awaaraa indent ko code review ya CI tak pahunchne se pehle pakadte hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between a SyntaxError and a runtime error in Python, and when is each detected?',
        qHi: 'Python mein ek SyntaxError aur ek runtime error mein kya antar hai, aur har ek kab detect hota hai?',
        a: 'When you run a Python file, the interpreter first reads the entire file and compiles it to bytecode, and only then does it start executing that bytecode from the top. A SyntaxError, and its subtypes IndentationError and TabError, are detected during that compile phase, before any statement runs. So if line fifty of your file has a missing colon, nothing on lines one through forty-nine executes either — the whole file is rejected. A runtime error, like dividing by zero, calling a name that was never defined, or indexing past the end of a list, is a different thing entirely: the syntax was valid, so compilation succeeded, and the error only surfaces when execution actually reaches that line. Everything before it has already run and had its effects. This distinction matters in practice because a syntax error is safe in the sense that it never leaves your program half-done, whereas a runtime error can leave a file half-written or a database in an inconsistent state if you were not careful with transactions or cleanup. It also explains a common confusion: people expect a typo deep in a rarely-run function to stay hidden until that function is called, but a syntax error there will stop the program from starting at all, while a NameError there stays dormant until the call happens.',
        aHi: 'Jab aap ek Python file chalate ho, interpreter pehle poori file padhta hai aur use bytecode mein compile karta hai, aur tabhi wo us bytecode ko upar se execute karna shuru karta hai. Ek SyntaxError, aur iske subtypes IndentationError aur TabError, us compile phase ke dauraan detect hote hain, koi statement chalne se pehle. Toh agar aapki file ki line pachaas mein ek missing colon hai, lines ek se unchaas ka bhi kuch execute nahi hota — poori file reject ho jaati hai. Ek runtime error, jaise zero se bhaag karna, ek naam call karna jo kabhi define nahi hua, ya ek list ke end ke aage index karna, ek bilkul alag cheez hai: syntax valid tha, isliye compilation safal hua, aur error tabhi saamne aata hai jab execution asal mein us line par pahunchta hai. Iske pehle sab kuch pehle hi chal chuka hai aur iske asar ho chuke hain. Ye antar vyavhaar mein maayne rakhta hai kyunki ek syntax error is arth mein surakshit hai ki wo aapke program ko kabhi aadha-poora nahi chhodta, jabki ek runtime error ek file ko aadha-likha ya ek database ko ek inconsistent state mein chhod sakta hai agar aap transactions ya cleanup ke saath saavdhaan nahi the.',
      },
      {
        q: 'Why does Python use significant indentation instead of braces, and what practical problems does that solve or create?',
        qHi: 'Python braces ke bajaye significant indentation kyun istemal karta hai, aur wo kaunsi vyavhaarik samasyaayein solve ya banaata hai?',
        a: 'The design idea is that in a braces language the indentation and the braces can disagree — the braces say one thing about which statements are grouped, and the visual layout says another, and the compiler believes the braces while the human believes the layout. That gap is where a class of bugs lives, the classic one being a line that looks like it is inside an if but is actually outside it because someone forgot to add a brace when adding a second statement. Python removes the gap by making the layout the only source of truth: there is nothing for the indentation to disagree with. The practical benefits are that all Python code looks structurally similar regardless of who wrote it, code review has one less thing to nitpick, and you can never have the "dangling else" or "goto fail" style bug where a brace mismatch changes the meaning silently. The costs are real too. Copying and pasting code between different indentation contexts requires re-indenting it. Mixing tabs and spaces, which are visually identical, produces errors that are hard to see. You cannot comment out the first line of a block without also handling its now-orphaned body. And a few constructs that are natural with braces, like a multi-line lambda, are simply not expressible, which pushes you toward named functions. On balance most teams find the trade worth it, and tooling — editors that insert spaces, formatters that normalise everything, linters that flag mixed indentation — has made the costs mostly a non-issue in a modern setup.',
        aHi: 'Design idea ye hai ki ek braces language mein indentation aur braces asahmat ho sakte hain — braces ek cheez kehte hain ki kaunse statements group hain, aur visual layout doosri, aur compiler braces ko maanta hai jabki insaan layout ko. Wo gap jahaan ek class of bugs rehti hai, classic ye ki ek line jo dikhti hai ki ek if ke andar hai par asal mein uske baahar hai kyunki kisi ne ek doosra statement jodte waqt ek brace jodna bhool gaya. Python gap hataata hai layout ko satya ka ekmatra source banaakar: indentation ke asahmat hone ke liye kuch hai hi nahi. Vyavhaarik faayde ye hain ki saara Python code sanrachnaatmak roop se ek jaisa dikhta hai chahe kisne bhi likha, code review mein ek kam cheez nitpick karne ko, aur aapke paas kabhi "dangling else" style bug nahi ho sakta jahaan ek brace mismatch matlab chupchaap badal deta hai. Cost bhi asli hain. Alag indentation contexts ke beech code copy-paste karna use re-indent karne ki zaroorat rakhta hai. Tabs aur spaces mix karna, jo visually samaan hain, aise errors banaata hai jo dekhna mushkil hai. Aur kuch constructs jo braces ke saath swabhaavik hain, jaise ek multi-line lambda, bas express nahi ho sakte.',
      },
    ],

    exercises: [
      {
        task: 'Write a script that defines a function `describe(n)` which prints "n is even" or "n is odd", then calls it for 1, 2, and 3. Run it with `python`. Deliberately un-indent the body of the function by one space and observe the exact error message.',
        taskHi: 'Ek script likho jo ek function `describe(n)` define kare jo "n is even" ya "n is odd" print kare, phir ise 1, 2, aur 3 ke liye call kare. Ise `python` se chalao. Jaan-boojhkar function ke body ko ek space se un-indent karo aur exact error message dekho.',
        hint: 'Use `if n % 2 == 0:` for even. The un-indented version gives "IndentationError: expected an indented block after function definition" (or "unindent does not match" if only partly un-indented).',
        hintHi: 'Even ke liye `if n % 2 == 0:` istemal karo. Un-indented version "IndentationError: expected an indented block after function definition" deta hai (ya "unindent does not match" agar sirf aanshik roop se un-indented).',
      },
      {
        task: 'Open the REPL (`python` with no arguments). Type `3 * 4`, then `"ab" * 3`, then `x = 10`, then `x`, then `type(x)`. Note which lines print something automatically and which produce no output.',
        taskHi: 'REPL kholo (`python` bina arguments). `3 * 4` type karo, phir `"ab" * 3`, phir `x = 10`, phir `x`, phir `type(x)`. Note karo kaunsi lines apne aap kuch print karti hain aur kaunsi koi output nahi deti.',
        hint: 'Expressions (`3 * 4`, `x`, `type(x)`) print their value; the assignment `x = 10` is a statement, not an expression, so it prints nothing. In a script even the expressions would print nothing without `print()`.',
        hintHi: 'Expressions (`3 * 4`, `x`, `type(x)`) apni value print karte hain; assignment `x = 10` ek statement hai, expression nahi, isliye ye kuch print nahi karta. Ek script mein expressions bhi `print()` ke bina kuch print nahi karte.',
      },
      {
        task: 'Write a script with a nested structure: a `for` loop over `["a", "b", "c"]`, and inside it an `if` that prints "  vowel" when the letter is "a". Add a `print("done")` at column 0 after the loop. Verify the output, then move `print("done")` to be indented 4 spaces and explain how the output changes.',
        taskHi: 'Ek nested structure waali script likho: `["a", "b", "c"]` par ek `for` loop, aur iske andar ek `if` jo "  vowel" print kare jab letter "a" ho. Loop ke baad column 0 par ek `print("done")` jodo. Output verify karo, phir `print("done")` ko 4 spaces indented karo aur samjhaao output kaise badalta hai.',
        hint: 'At column 0, "done" prints once after the loop. Indented 4 spaces, it becomes part of the loop body and prints once per letter — three times.',
        hintHi: 'Column 0 par, "done" loop ke baad ek baar print hota hai. 4 spaces indented, ye loop body ka hissa ban jaata hai aur prati letter ek baar print hota hai — teen baar.',
      },
    ],

    keyTakeaways: [
      'Python groups statements by INDENTATION, not braces, and ends them with a NEWLINE, not a semicolon. A block opens with a line ending in `:` and its body is indented (4 spaces, never tabs).',
      'Every line in one block must have identical indentation. A stray space is an IndentationError; mixed tabs/spaces is a TabError.',
      'Running `python script.py` compiles the whole file to bytecode first, then executes. A SyntaxError/IndentationError is caught at compile time — nothing in the file runs.',
      'The REPL (`python` with no file) evaluates and prints every expression automatically. A script does not — wrap anything you want to see in `print()`.',
      'An empty block is a SyntaxError. Use `pass` as a do-nothing placeholder.',
      'JS-to-Python reflexes: no `{ }`, no `;`, `#` comments only, `snake_case`, no `let`/`const` (just `x = 1`), `and`/`or`/`not`, `None` (not null/undefined), `True`/`False` capitalised, `print()` not `console.log()`.',
    ],
    keyTakeawaysHi: [
      'Python statements ko INDENTATION se group karta hai, braces se nahi, aur unhe ek NEWLINE se khatam karta hai, semicolon se nahi. Ek block ek `:` par khatam hone waali line se khulta hai aur iska body indented hota hai (4 spaces, kabhi tabs nahi).',
      'Ek block ki har line ki samaan indentation honi chahiye. Ek awaaraa space ek IndentationError hai; mixed tabs/spaces ek TabError hai.',
      '`python script.py` chalana pehle poori file ko bytecode mein compile karta hai, phir execute karta hai. Ek SyntaxError/IndentationError compile time par pakda jaata hai — file ka kuch nahi chalta.',
      'REPL (`python` bina file) har expression ko apne aap evaluate aur print karta hai. Ek script nahi — jo bhi dekhna ho use `print()` mein lapeto.',
      'Ek empty block ek SyntaxError hai. Ek kuch-na-karne waale placeholder ke liye `pass` istemal karo.',
      'JS-se-Python reflexes: koi `{ }` nahi, koi `;` nahi, sirf `#` comments, `snake_case`, koi `let`/`const` nahi (sirf `x = 1`), `and`/`or`/`not`, `None` (null/undefined nahi), `True`/`False` capitalised, `console.log()` nahi `print()`.',
    ],
  },

  {
    slug: 'py-names-objects-and-dynamic-typing',
    title: 'Names Bind to Objects: Dynamic Typing, int Precision, and Division',
    titleHi: 'Naam Objects Se Bandhte Hain: Dynamic Typing, int Precision, Aur Division',
    description: 'Writing `const total = 0` out of habit and expecting Python to stop you from reassigning it, or writing `10 / 3` and expecting `3` because that is what integer division gave you elsewhere. Python has no `const`, every name can be rebound to a value of any type at any time, and `/` always produces a float — `10 / 3` is `3.333...`, and the integer version is a separate operator.',
    descriptionHi: 'Aadat se `const total = 0` likhna aur ummeed karna ki Python aapko ise reassign karne se roke, ya `10 / 3` likhna aur `3` ki ummeed karna kyunki wahi integer division ne kahin aur diya. Python mein koi `const` nahi, har naam kisi bhi type ki value se kabhi bhi dobara bandh sakta hai, aur `/` hamesha ek float deta hai — `10 / 3` `3.333...` hai, aur integer version ek alag operator hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**Luggage tags versus boxes.** In some languages a variable is like a box of a fixed size and shape: you declare "this box holds an integer", and from then on only integers fit, and the box is a container the value lives inside. A Python name is not a box — it is a paper luggage tag on a string that you can tie to any suitcase in the room. The suitcase (the object — the number 5, the string "hi", the list) exists on its own; the name is just a label pointing at it. You can move the tag to a different suitcase whenever you like, including one of a completely different kind — tie the tag "x" to the number 5 now, to the string "hello" a line later, to a list after that. Nothing checks. Two tags can point at the same suitcase. And when the last tag is untied from a suitcase, the cleaning staff (the garbage collector) eventually takes it away. So "assigning a variable" in Python never copies or converts anything; it just re-points a label. Whether the thing the label points at can itself be changed — whether you can add socks to the suitcase — is a separate property of the suitcase, not the tag.',
      hi: '**Luggage tags versus boxes.** Kuch languages mein ek variable ek fixed size aur shape ke box ki tarah hai: aap ghoshit karte ho "ye box ek integer rakhta hai", aur uske baad sirf integers fit hote hain, aur box ek container hai jiske andar value rehti hai. Ek Python naam ek box nahi hai — ye ek string par ek paper luggage tag hai jise aap kamre mein kisi bhi suitcase se baandh sakte ho. Suitcase (object — number 5, string "hi", list) apne aap maujood hai; naam bas ek label hai jo ispar point karta hai. Aap tag ko jab chaaho ek alag suitcase par le jaa sakte ho, ek bilkul alag kism ke sameet — tag "x" ko abhi number 5 se baandho, ek line baad string "hello" se, uske baad ek list se. Kuch check nahi karta. Do tags ek hi suitcase par point kar sakte hain. Aur jab aakhri tag ek suitcase se khola jaata hai, cleaning staff (garbage collector) aakhirkaar use le jaata hai. Toh Python mein "ek variable assign karna" kabhi kuch copy ya convert nahi karta; ye bas ek label ko dobara point karta hai. Kya jis cheez par label point karta hai wo khud badli jaa sakti hai — kya aap suitcase mein socks daal sakte ho — ye suitcase ka ek alag property hai, tag ka nahi.',
    },

    simple: `**Start broken.** Expecting \`const\`, and expecting \`/\` to do integer division:

\`\`\`python
const total = 0        # SyntaxError: 'const' is not a Python keyword

TAX_RATE = 0.18        # this is a "constant" only by CONVENTION (capitals)
TAX_RATE = 0.20        # ...Python happily lets you rebind it. Nothing stops you.

print(10 / 3)          # 3.3333333333333335   -- NOT 3
print(7 / 7)           # 1.0                  -- always a float, even when exact
\`\`\`

There is no keyword to declare a variable and no keyword to make one read-only. A name written in \`UPPER_SNAKE_CASE\` is a signal to humans that you should not reassign it — the language does not enforce it. And \`/\` is "true division": it always returns a \`float\`.

**The fix: understand names, and use the right division operator**

\`\`\`python
x = 5                  # the name 'x' now points at the int object 5
print(type(x))         # <class 'int'>
x = "hello"            # the SAME name now points at a str — totally fine
print(type(x))         # <class 'str'>

print(10 / 3)          # 3.3333333333333335   float division
print(10 // 3)         # 3                     floor division (the // operator)
print(10 % 3)          # 1                     remainder
print(10 ** 3)         # 1000                  exponent (not ^, which is bitwise XOR)

big = 2 ** 200         # ints are arbitrary precision — no overflow, ever
print(big)             # 1606938044258990275541962092341162602522202993782792835301376
\`\`\`

\`\`\`
- Assignment binds a NAME to an OBJECT. It never copies. \`y = x\` makes y point
  at the same object x points at.
- A name has no type; the OBJECT it points at has a type. \`type(x)\` asks the object.
- \`/\`  -> float division, always.   \`//\` -> floor division.   \`**\` -> power.
- \`int\` has unlimited size. \`float\` is a 64-bit IEEE-754 double (same as JS number),
  so 0.1 + 0.2 == 0.30000000000000004 here too.
\`\`\``,

    simpleHi: `**Toote hue se shuru.** \`const\` ki ummeed, aur \`/\` se integer division ki ummeed:

\`\`\`python
const total = 0        # SyntaxError: 'const' Python keyword nahi hai

TAX_RATE = 0.18        # ye ek "constant" sirf CONVENTION se hai (capitals)
TAX_RATE = 0.20        # ...Python khushi se aapko ise dobara bind karne deta hai. Kuch nahi rokta.

print(10 / 3)          # 3.3333333333333335   -- 3 NAHI
print(7 / 7)           # 1.0                  -- hamesha ek float, exact hone par bhi
\`\`\`

Ek variable declare karne ka koi keyword nahi aur ise read-only banane ka koi keyword nahi. \`UPPER_SNAKE_CASE\` mein likha ek naam insaanon ko ek signal hai ki aapko ise reassign nahi karna — language ise laagu nahi karti. Aur \`/\` "true division" hai: ye hamesha ek \`float\` lautaata hai.

**Fix: naam samjho, aur sahi division operator istemal karo**

\`\`\`python
x = 5                  # naam 'x' ab int object 5 par point karta hai
print(type(x))         # <class 'int'>
x = "hello"            # WAHI naam ab ek str par point karta hai — bilkul theek
print(type(x))         # <class 'str'>

print(10 / 3)          # 3.3333333333333335   float division
print(10 // 3)         # 3                     floor division (// operator)
print(10 % 3)          # 1                     remainder
print(10 ** 3)         # 1000                  exponent (^ nahi, jo bitwise XOR hai)

big = 2 ** 200         # ints arbitrary precision hain — koi overflow nahi, kabhi
print(big)             # 1606938044258990275541962092341162602522202993782792835301376
\`\`\`

\`\`\`
- Assignment ek NAAM ko ek OBJECT se baandhta hai. Ye kabhi copy nahi karta. \`y = x\`
  y ko usi object par point karwaata hai jispar x point karta hai.
- Ek naam ka koi type nahi; jis OBJECT par ye point karta hai uska ek type hai. \`type(x)\` object se poochhta hai.
- \`/\`  -> float division, hamesha.   \`//\` -> floor division.   \`**\` -> power.
- \`int\` ka aseemit size hai. \`float\` ek 64-bit IEEE-754 double hai (JS number jaisa),
  isliye 0.1 + 0.2 == 0.30000000000000004 yahaan bhi.
\`\`\``,

    content: `## Names, objects, and \`=\`

\`\`\`python
a = [1, 2, 3]     # object: the list [1,2,3]. name 'a' points to it.
b = a             # name 'b' points to the SAME list. NO copy was made.
b.append(4)
print(a)          # [1, 2, 3, 4]   -- a and b are two names for one object

c = a[:]          # NOW a copy: c points to a new list with the same contents
c.append(5)
print(a)          # [1, 2, 3, 4]   -- unchanged
\`\`\`

This is the same reference model as JavaScript objects/arrays. The difference from JS is that there is no \`let\`/\`const\` — the name just appears when you first assign it. Assigning to a name that does not exist yet creates it; assigning again rebinds it.

## \`id()\` and \`is\`: object identity

\`\`\`python
x = 1000
y = 1000
print(x == y)     # True  -- same value
print(x is y)     # False -- different objects (CPython does not cache 1000)

a = None
print(a is None)  # True  -- the idiomatic None check (there is only ONE None object)
\`\`\`

\`==\` asks "same value?"; \`is\` asks "literally the same object in memory?". Use \`is\` only for \`None\`, \`True\`, \`False\`, and sentinel objects. For everything else use \`==\`.

## Numbers

\`\`\`
int      arbitrary precision. 2**1000 is exact. No overflow. Literals: 42, 1_000_000
float    64-bit double (like JS). 3.14, 1e-9, float('inf'), float('nan')
complex  1 + 2j   (rarely needed)
bool     True / False -- and bool IS a subclass of int: True == 1, False == 0, sum([True, True]) == 2

/    true division  -> always float:  6 / 2   == 3.0
//   floor division -> toward -inf:   7 // 2  == 3 ,  -7 // 2 == -4
%    modulo         -> sign follows the DIVISOR: -7 % 2 == 1   (differs from JS/C!)
**   power:  2 ** 10 == 1024 ,  2 ** 0.5 == 1.414...
divmod(a, b) -> (a // b, a % b)  in one call
\`\`\`

The float model is identical to JavaScript's \`number\`, so the same rounding surprises apply: \`0.1 + 0.2\` is \`0.30000000000000004\`, and money should use the \`decimal\` module (covered in Module 7), never \`float\`.

## Converting types explicitly

\`\`\`python
int("42")        # 42     -- str to int
int("42", 16)    # 66     -- parse as hex
int(3.9)         # 3      -- truncates toward zero (does NOT round)
float("3.14")    # 3.14
str(42)          # "42"
bool(0)          # False  -- see the truthiness lesson

int("42.0")      # ValueError! -- int() will not parse a decimal string
\`\`\`

Python does **not** auto-convert between strings and numbers in arithmetic. \`"3" + 4\` is a \`TypeError\`, not \`"34"\` and not \`7\`. You convert deliberately.

## The names you cannot use

\`\`\`
Keywords (can't be variable names): False None True and as assert async await
  break class continue def del elif else except finally for from global if
  import in is lambda nonlocal not or pass raise return try while with yield

Built-ins you CAN shadow but shouldn't: list dict str int id type sum min max
  len input file  -- assigning list=[1,2] breaks list() for the rest of the scope
\`\`\``,

    contentHi: `## Naam, objects, aur \`=\`

\`\`\`python
a = [1, 2, 3]     # object: list [1,2,3]. naam 'a' ispar point karta hai.
b = a             # naam 'b' USI list par point karta hai. KOI copy nahi bana.
b.append(4)
print(a)          # [1, 2, 3, 4]   -- a aur b ek object ke do naam hain

c = a[:]          # AB ek copy: c ek nayi list par point karta hai usi content ke saath
c.append(5)
print(a)          # [1, 2, 3, 4]   -- abadalta
\`\`\`

Ye JavaScript objects/arrays jaisa hi reference model hai. JS se antar ye hai ki koi \`let\`/\`const\` nahi — naam bas tab dikhta hai jab aap pehli baar assign karte ho. Ek aise naam ko assign karna jo abhi maujood nahi ise banaata hai; phir assign karna dobara bind karta hai.

## \`id()\` aur \`is\`: object identity

\`\`\`python
x = 1000
y = 1000
print(x == y)     # True  -- same value
print(x is y)     # False -- alag objects (CPython 1000 cache nahi karta)

a = None
print(a is None)  # True  -- idiomatic None check (sirf EK None object hai)
\`\`\`

\`==\` poochhta hai "same value?"; \`is\` poochhta hai "sachmuch memory mein wahi object?". \`is\` sirf \`None\`, \`True\`, \`False\`, aur sentinel objects ke liye istemal karo. Baaki har cheez ke liye \`==\`.

## Numbers

\`\`\`
int      arbitrary precision. 2**1000 exact hai. Koi overflow nahi. Literals: 42, 1_000_000
float    64-bit double (JS jaisa). 3.14, 1e-9, float('inf'), float('nan')
complex  1 + 2j   (kam hi chahiye)
bool     True / False -- aur bool int ka ek subclass HAI: True == 1, False == 0, sum([True, True]) == 2

/    true division  -> hamesha float:  6 / 2   == 3.0
//   floor division -> -inf ki taraf:  7 // 2  == 3 ,  -7 // 2 == -4
%    modulo         -> sign DIVISOR ka follow karta hai: -7 % 2 == 1   (JS/C se alag!)
**   power:  2 ** 10 == 1024 ,  2 ** 0.5 == 1.414...
divmod(a, b) -> (a // b, a % b)  ek call mein
\`\`\`

Float model JavaScript ke \`number\` jaisa hi hai, isliye wahi rounding surprises lagte hain: \`0.1 + 0.2\` \`0.30000000000000004\` hai, aur money ke liye \`decimal\` module istemal karna chahiye (Module 7 mein), kabhi \`float\` nahi.

## Types explicitly convert karna

\`\`\`python
int("42")        # 42     -- str se int
int("42", 16)    # 66     -- hex ki tarah parse
int(3.9)         # 3      -- zero ki taraf truncate (round NAHI karta)
float("3.14")    # 3.14
str(42)          # "42"
bool(0)          # False  -- truthiness lesson dekho

int("42.0")      # ValueError! -- int() ek decimal string parse nahi karega
\`\`\`

Python arithmetic mein strings aur numbers ke beech **auto-convert nahi karta**. \`"3" + 4\` ek \`TypeError\` hai, \`"34"\` nahi aur \`7\` nahi. Aap jaan-boojhkar convert karte ho.

## Wo naam jo aap istemal nahi kar sakte

\`\`\`
Keywords (variable naam nahi ho sakte): False None True and as assert async await
  break class continue def del elif else except finally for from global if
  import in is lambda nonlocal not or pass raise return try while with yield

Built-ins jinhe aap shadow KAR sakte ho par nahi karna chahiye: list dict str int id type
  sum min max len input  -- list=[1,2] assign karna baaki scope ke liye list() todta hai
\`\`\``,

    examples: [
      {
        title: 'Broken: expecting / to floor, and string+number to work',
        titleHi: 'Toota: / se floor ki ummeed, aur string+number ke kaam karne ki',
        code: `pages = 10
per_page = 3
last_page = pages / per_page
print("last page index:", last_page)

label = "page " + last_page`,
        output: `last page index: 3.3333333333333335
Traceback (most recent call last):
  File "script.py", line 6, in <module>
    label = "page " + last_page
            ~~~~~~~~~^~~~~~~~~~~
TypeError: can only concatenate str (not "float") to str`,
        explain: '`/` gave a float, not the page count you wanted. Then concatenating a str and a float is a TypeError — Python never coerces. The fixes are `pages // per_page` for integer division and `str(last_page)` or an f-string to build the label.',
        explainHi: '`/` ne ek float diya, wo page count nahi jo aap chahte the. Phir ek str aur ek float concatenate karna ek TypeError hai — Python kabhi coerce nahi karta. Fixes hain integer division ke liye `pages // per_page` aur label banane ke liye `str(last_page)` ya ek f-string.',
      },
      {
        title: 'Fixed: right operators, explicit conversion, and int precision',
        titleHi: 'Theek: sahi operators, explicit conversion, aur int precision',
        code: `pages = 10
per_page = 3

full_pages = pages // per_page      # 3
leftover = pages % per_page         # 1
total_pages = -(-pages // per_page) # 4  (ceiling division trick)

print(f"{full_pages} full, {leftover} left over, {total_pages} pages total")

# int never overflows
factorial_20 = 1
for n in range(1, 21):
    factorial_20 *= n
print("20! =", factorial_20)
print("2**100 =", 2 ** 100)`,
        output: `3 full, 1 left over, 4 pages total
20! = 2432902008176640000
2**100 = 1267650600228229401496703205376`,
        explain: '`//` and `%` give the integer parts. `-(-a // b)` is the standard ceiling-division idiom (Python has no `//` that rounds up). And `20!` and `2**100` compute exactly — a Python int grows to whatever size it needs, unlike a fixed-width integer in C or Java.',
        explainHi: '`//` aur `%` integer hisse dete hain. `-(-a // b)` standard ceiling-division idiom hai (Python mein koi `//` nahi jo upar round kare). Aur `20!` aur `2**100` exact compute hote hain — ek Python int jitna size chahiye utna badhta hai, C ya Java ke fixed-width integer ke ulte.',
      },
      {
        title: 'Names point at objects: aliasing and rebinding',
        titleHi: 'Naam objects par point karte hain: aliasing aur rebinding',
        code: `x = 5
y = x            # y points at the same int object 5
x = 99           # rebinds x to a NEW object; y is untouched
print(x, y)      # 99 5

a = [1, 2]
b = a            # b points at the SAME list
a.append(3)      # mutates the shared list
print(a, b)      # [1, 2, 3] [1, 2, 3]

a = [9]          # rebinds a to a new list; b still points at the old one
print(a, b)      # [9] [1, 2, 3]`,
        output: `99 5
[1, 2, 3] [1, 2, 3]
[9] [1, 2, 3]`,
        explain: 'Rebinding a name (`x = 99`, `a = [9]`) only moves that one name; other names for the old object are unaffected. Mutating the object (`a.append(3)`) changes what every name pointing at it sees. Numbers are immutable so you only ever see rebinding with them.',
        explainHi: 'Ek naam ko rebind karna (`x = 99`, `a = [9]`) sirf us ek naam ko move karta hai; purane object ke doosre naam achhoote rehte hain. Object ko mutate karna (`a.append(3)`) badalta hai jo har naam ispar point karte hue dekhta hai. Numbers immutable hain isliye unke saath aap sirf rebinding dekhte ho.',
      },
    ],

    mistakes: [
      {
        wrong: `count = "5"
count = count + 1`,
        right: `count = "5"
count = int(count) + 1`,
        why: 'Python does not coerce a str to an int in arithmetic — "5" + 1 is a TypeError. This bites when a value comes from a form, an environment variable, JSON, or `input()`, which all give you strings. Convert at the boundary: `int(request.GET["page"])`.',
        whyHi: 'Python arithmetic mein ek str ko int mein coerce nahi karta — "5" + 1 ek TypeError hai. Ye tab kaatta hai jab ek value ek form, ek environment variable, JSON, ya `input()` se aati hai, jo sab aapko strings dete hain. Boundary par convert karo: `int(request.GET["page"])`.',
      },
      {
        wrong: `if user.role is "admin":
    ...`,
        right: `if user.role == "admin":
    ...`,
        why: '`is` checks object identity, not equality. Two equal strings may or may not be the same object depending on interning, so `is` for strings works by accident sometimes and fails other times. Use `==` for value comparison; reserve `is` for `None`, `True`, `False`.',
        whyHi: '`is` object identity check karta hai, equality nahi. Do barabar strings interning ke hisaab se wahi object ho bhi sakti hain ya nahi, isliye strings ke liye `is` kabhi samyog se kaam karta hai aur kabhi fail hota hai. Value comparison ke liye `==`; `is` ko `None`, `True`, `False` ke liye rakho.',
      },
      {
        wrong: `total = 2 ^ 10   # expecting 1024`,
        right: `total = 2 ** 10  # 1024`,
        why: 'In Python `^` is bitwise XOR (2 ^ 10 == 8), not exponentiation. The power operator is `**`. This is a silent bug — no error, just a wrong number — so it is easy to ship.',
        whyHi: 'Python mein `^` bitwise XOR hai (2 ^ 10 == 8), exponentiation nahi. Power operator `**` hai. Ye ek silent bug hai — koi error nahi, bas ek galat number — isliye ise ship karna aasaan hai.',
      },
    ],

    realWorld: [
      {
        en: '**Django settings and DRF configuration** are just module-level names — `DEBUG = False`, `ALLOWED_HOSTS = [...]`. There is no `const`; the convention (capitals) and code review are what stop someone reassigning `DEBUG` halfway down the file.',
        hi: '**Django settings aur DRF configuration** bas module-level naam hain — `DEBUG = False`, `ALLOWED_HOSTS = [...]`. Koi `const` nahi; convention (capitals) aur code review wo hain jo kisi ko file mein aadhe neeche `DEBUG` reassign karne se rokte hain.',
      },
      {
        en: '**Pagination math** — `total_pages = -(-count // page_size)` — appears in every list API. Using `/` there gives a float and a broken page count; `//` with the negation trick gives the correct ceiling.',
        hi: '**Pagination math** — `total_pages = -(-count // page_size)` — har list API mein dikhta hai. Wahaan `/` istemal karna ek float aur ek toota page count deta hai; negation trick ke saath `//` sahi ceiling deta hai.',
      },
      {
        en: '**Reading request data** — `request.GET["page"]`, `os.environ["PORT"]`, `json.loads(body)["count"]` — always hands you strings (or parsed JSON types). Forgetting to `int()` at that boundary is one of the most common bugs in a new Python backend.',
        hi: '**Request data padhna** — `request.GET["page"]`, `os.environ["PORT"]`, `json.loads(body)["count"]` — hamesha aapko strings deta hai (ya parsed JSON types). Us boundary par `int()` bhoolna ek naye Python backend mein sabse aam bugs mein se ek hai.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain what `y = x` does in Python. Is it a copy? How does it differ for a number versus a list?',
        qHi: 'Python mein `y = x` kya karta hai samjhaao. Kya ye ek copy hai? Ek number versus ek list ke liye ye kaise alag hai?',
        a: 'In Python a variable is a name, and a name is a reference to an object. The statement y equals x does not copy anything and does not care what type x refers to. It simply makes the name y refer to the exact same object that x currently refers to. After that line, x and y are two labels on one object. What happens next depends entirely on whether that object is mutable. If x refers to a number, which is immutable, there is no operation that changes the number five into something else. So the only way x can appear to change is by rebinding — writing x equals something new — and rebinding x moves only the name x; y still points at the original five. You never observe shared state with numbers because you cannot mutate them. If x refers to a list, which is mutable, then a method like append or an item assignment changes the object in place. Because y points at that same object, y sees the change too. If you then write x equals a new list, you have rebound x to a different object, and now x and y diverge — x points at the new list, y still points at the old one. The practical rule is: assignment always shares, never copies; mutation is visible through every name pointing at the object; rebinding affects only the one name. To actually copy, you ask explicitly — a slice for a list, dict of the dict, or copy dot copy and copy dot deepcopy from the copy module for nested structures. This is the same model as JavaScript objects and arrays, so the intuition transfers; the twist is that Python applies it uniformly, including to things JavaScript treats as primitives.',
        aHi: 'Python mein ek variable ek naam hai, aur ek naam ek object ka reference hai. Statement y equals x kuch copy nahi karta aur parwaah nahi karta ki x kis type ko refer karta hai. Ye bas naam y ko us exact object ko refer karwaata hai jise x abhi refer karta hai. Us line ke baad, x aur y ek object par do labels hain. Aage kya hota hai ye poori tarah is par nirbhar karta hai ki wo object mutable hai ya nahi. Agar x ek number ko refer karta hai, jo immutable hai, aisa koi operation nahi jo number paanch ko kuch aur bana de. Toh x ke badalne ka ekmatra tarika rebinding hai — x equals kuch naya likhna — aur x ko rebind karna sirf naam x ko move karta hai; y abhi bhi asli paanch par point karta hai. Agar x ek list ko refer karta hai, jo mutable hai, toh append jaisa ek method object ko jagah par badalta hai. Kyunki y usi object par point karta hai, y bhi badlaav dekhta hai. Vyavhaarik niyam: assignment hamesha share karta hai, kabhi copy nahi; mutation object par point karne waale har naam ke zariye dikhta hai; rebinding sirf us ek naam ko prabhaavit karta hai. Asal mein copy karne ke liye, aap explicitly poochhte ho — ek list ke liye ek slice, dict of the dict, ya nested structures ke liye copy module se copy aur deepcopy.',
      },
      {
        q: 'What are the three division-related operators in Python and how does `%` differ from C or JavaScript?',
        qHi: 'Python mein teen division-sambandhit operators kaunse hain aur `%` C ya JavaScript se kaise alag hai?',
        a: 'There is single slash, double slash, and the modulo percent. Single slash is true division and it always produces a float, even when the result is mathematically an integer — six divided by two is three point zero, not three. Double slash is floor division: it divides and then rounds the result toward negative infinity, and it returns an int when both operands are ints. So seven floor-divided by two is three, and importantly negative seven floor-divided by two is negative four, not negative three, because negative four is the value you get by rounding negative three point five downward. The percent operator gives the remainder, and it is defined to be consistent with floor division, which means the sign of the result follows the sign of the divisor, the right-hand operand. Negative seven percent two is positive one in Python. In C and in JavaScript, the remainder operator instead follows the sign of the dividend, the left-hand operand, so negative seven percent two is negative one there. This difference matters whenever you use modulo to wrap an index or a value into a range, for example mapping any integer into zero through n minus one. In Python, x percent n is always in that range for a positive n even when x is negative, which is usually exactly what you want. In C or JavaScript you have to add n and take the modulo again to normalise. There is also a divmod builtin that returns the floor-division quotient and the remainder together as a pair, which is handy when you need both, such as converting a total number of seconds into minutes and seconds.',
        aHi: 'Ek slash, do slash, aur modulo percent hai. Ek slash true division hai aur ye hamesha ek float deta hai, tab bhi jab nateeja ganitiy roop se ek integer ho — chhah bhaag do teen point zero hai, teen nahi. Do slash floor division hai: ye bhaag karta hai aur phir nateeje ko negative infinity ki taraf round karta hai, aur ye ek int deta hai jab dono operands ints hon. Toh saat floor-divide do teen hai, aur mahatvapurna baat negative saat floor-divide do negative chaar hai, negative teen nahi, kyunki negative chaar wo value hai jo aap negative teen point paanch ko neeche round karke paate ho. Percent operator remainder deta hai, aur ye floor division ke saath consistent hone ko paribhaashit hai, jiska matlab nateeje ka sign divisor ke sign ko follow karta hai, right-hand operand. Negative saat percent do Python mein positive ek hai. C mein aur JavaScript mein, remainder operator iske bajaye dividend ke sign ko follow karta hai, left-hand operand, isliye negative saat percent do wahaan negative ek hai. Ye antar tab maayne rakhta hai jab bhi aap modulo ka istemal ek index ya ek value ko ek range mein wrap karne ke liye karte ho.',
      },
    ],

    exercises: [
      {
        task: 'In the REPL: bind `a = [1, 2, 3]`, then `b = a`, then `b.append(4)`, then print `a`. Now bind `c = a[:]`, `c.append(5)`, and print `a` again. Explain in one sentence why the first append shows in `a` but the second does not.',
        taskHi: 'REPL mein: `a = [1, 2, 3]` bind karo, phir `b = a`, phir `b.append(4)`, phir `a` print karo. Ab `c = a[:]` bind karo, `c.append(5)`, aur `a` phir print karo. Ek vaakya mein samjhaao ki pehla append `a` mein kyun dikhta hai par doosra nahi.',
        hint: '`b = a` makes b another name for the same list, so mutating through b is visible through a. `a[:]` builds a new list, so c is a name for a separate object.',
        hintHi: '`b = a` b ko usi list ka doosra naam banaata hai, isliye b ke zariye mutate karna a ke zariye dikhta hai. `a[:]` ek nayi list banaata hai, isliye c ek alag object ka naam hai.',
      },
      {
        task: 'Predict, then check in the REPL: `10 / 3`, `10 // 3`, `-10 // 3`, `10 % 3`, `-10 % 3`, `2 ** 10`, `2 ^ 10`. Write down which one surprised you and why.',
        taskHi: 'Anumaan lagao, phir REPL mein check karo: `10 / 3`, `10 // 3`, `-10 // 3`, `10 % 3`, `-10 % 3`, `2 ** 10`, `2 ^ 10`. Likho kaunse ne aapko chaunkaaya aur kyun.',
        hint: '`-10 // 3` is `-4` (floor, toward negative infinity). `-10 % 3` is `2` (sign follows the divisor). `2 ^ 10` is `8` (XOR, not power). `2 ** 10` is `1024`.',
        hintHi: '`-10 // 3` `-4` hai (floor, negative infinity ki taraf). `-10 % 3` `2` hai (sign divisor ka follow karta hai). `2 ^ 10` `8` hai (XOR, power nahi). `2 ** 10` `1024` hai.',
      },
      {
        task: 'Write `n = 1`, then a `for` loop that does `n *= i` for `i` in `range(1, 51)`. Print `n` and its number of digits with `len(str(n))`. Confirm it computed 50! exactly with no overflow.',
        taskHi: '`n = 1` likho, phir ek `for` loop jo `range(1, 51)` mein `i` ke liye `n *= i` kare. `n` aur iske digits ki tadaad `len(str(n))` se print karo. Confirm karo ki isne 50! exact compute kiya bina overflow ke.',
        hint: '50! is a 65-digit number: 30414093201713378043612608166064768844377641568960512000000000000. A fixed-width 64-bit integer would have overflowed around 20!; a Python int just grows.',
        hintHi: '50! ek 65-ank ka number hai. Ek fixed-width 64-bit integer 20! ke aas-paas overflow ho jaata; ek Python int bas badhta hai.',
      },
    ],

    keyTakeaways: [
      'A Python variable is a NAME bound to an OBJECT. `=` never copies — `y = x` makes y point at the same object. `y = x[:]` (or `.copy()`, `copy.deepcopy`) makes an actual copy.',
      'Names have no type; objects do. `type(obj)` asks the object. Any name can be rebound to any type at any time — there is no `const`.',
      '`UPPER_SNAKE_CASE` marks a constant by convention only; Python does not enforce immutability of names.',
      '`/` is true division and ALWAYS returns a float (`6 / 2 == 3.0`). `//` is floor division (rounds toward -inf). `**` is power. `^` is bitwise XOR, NOT power.',
      '`%` sign follows the DIVISOR: `-7 % 2 == 1` (unlike C/JS where it follows the dividend). `divmod(a, b)` gives `(a // b, a % b)`.',
      '`int` is arbitrary precision — `2 ** 1000` is exact, no overflow. `float` is a 64-bit double (like JS), so `0.1 + 0.2 == 0.30000000000000004`; use `decimal` for money.',
      'Python never coerces types in arithmetic: `"3" + 4` is a TypeError. Convert explicitly at boundaries: `int(request.GET["page"])`.',
      'Use `is` only for `None`/`True`/`False` (identity). Use `==` for value comparison of everything else.',
    ],
    keyTakeawaysHi: [
      'Ek Python variable ek OBJECT se bandha NAAM hai. `=` kabhi copy nahi karta — `y = x` y ko usi object par point karwaata hai. `y = x[:]` (ya `.copy()`, `copy.deepcopy`) ek asli copy banaata hai.',
      'Naamon ka koi type nahi; objects ka hai. `type(obj)` object se poochhta hai. Koi bhi naam kisi bhi type se kabhi bhi dobara bandh sakta hai — koi `const` nahi.',
      '`UPPER_SNAKE_CASE` ek constant ko sirf convention se mark karta hai; Python naamon ki immutability laagu nahi karta.',
      '`/` true division hai aur HAMESHA ek float lautaata hai (`6 / 2 == 3.0`). `//` floor division hai (-inf ki taraf round). `**` power hai. `^` bitwise XOR hai, power NAHI.',
      '`%` sign DIVISOR ka follow karta hai: `-7 % 2 == 1` (C/JS ke ulte jahaan ye dividend ka follow karta hai). `divmod(a, b)` `(a // b, a % b)` deta hai.',
      '`int` arbitrary precision hai — `2 ** 1000` exact hai, koi overflow nahi. `float` ek 64-bit double hai (JS jaisa), isliye `0.1 + 0.2 == 0.30000000000000004`; money ke liye `decimal`.',
      'Python arithmetic mein kabhi types coerce nahi karta: `"3" + 4` ek TypeError hai. Boundaries par explicitly convert karo: `int(request.GET["page"])`.',
      '`is` sirf `None`/`True`/`False` ke liye istemal karo (identity). Baaki har cheez ke value comparison ke liye `==`.',
    ],
  },

  {
    slug: 'py-strings-and-f-strings',
    title: 'Strings: Immutability, f-strings, and Joining Instead of Adding',
    titleHi: 'Strings: Immutability, f-strings, Aur Jodne Ke Bajaye Join Karna',
    description: 'Building a large string by starting with an empty one and using `+=` inside a loop, the way it is often done in other languages. Every `+=` on a string in Python creates a brand-new string and copies everything so far into it, so a loop that builds an n-character string does work proportional to n squared. And formatting with `+` and `str()` everywhere is verbose where an f-string would read like a sentence.',
    descriptionHi: 'Ek badi string banaana ek khaali se shuru karke aur ek loop ke andar `+=` istemal karke, jaise ye aksar doosri languages mein kiya jaata hai. Python mein ek string par har `+=` ek bilkul nayi string banaata hai aur ab tak sab kuch usmein copy karta hai, isliye ek loop jo ek n-character string banaata hai n squared ke anupaatik kaam karta hai. Aur `+` aur `str()` har jagah se formatting verbose hai jahaan ek f-string ek vaakya ki tarah padhta.',
    difficulty: 'EASY',
    duration: 20,
    order: 3,

    analogy: {
      en: '**Writing a long notice by hand, and the difference between a whiteboard and a stack of index cards.** If you had a whiteboard you could just keep adding words to the end — cheap, in place. But a Python string is a stack of index cards where the whole message is already written across them and glued shut: you are not allowed to add to it. To "append" a word you must take a fresh, larger set of cards and copy the entire existing message onto them plus the new word. Do that once and it is fine. Do it in a loop, adding one word at a time to a message that grows to a thousand words, and you have re-copied the near-complete message hundreds of times — the total writing you did is enormous compared to the thousand words of output. The right approach for building up text piece by piece is to keep the pieces in a list — cheap to append to — and only at the very end glue them all together in a single pass with a joining step. Separately, when you just want to drop a few values into a fixed template, the neat way is a fill-in-the-blank form: write the sentence once with labelled gaps, and the values slot into the gaps. That fill-in form is the f-string.',
      hi: '**Ek lamba notice haath se likhna, aur ek whiteboard aur index cards ke ek stack ka antar.** Agar aapke paas ek whiteboard hota aap bas ant mein shabd jodte reh sakte the — sasta, jagah par. Par ek Python string index cards ka ek stack hai jahaan poora message pehle se unpar likha hai aur chipkaakar band kiya hua: aapko ismein jodne ki ijaazat nahi. Ek shabd "append" karne ke liye aapko ek naya, bada set of cards lena hoga aur poora maujooda message unpar copy karna hoga plus naya shabd. Ise ek baar karo aur theek hai. Ise ek loop mein karo, ek baar mein ek shabd jodte hue ek message mein jo ek hazaar shabd tak badhta hai, aur aapne lagbhag-poore message ko sau baar dobara copy kiya hai. Piece by piece text banane ka sahi approach pieces ko ek list mein rakhna hai — append karne mein sasta — aur sirf bilkul ant mein unhe ek single pass mein ek joining step se saath chipkaao. Alag se, jab aap bas kuch values ko ek fixed template mein daalna chahte ho, saaf tarika ek fill-in-the-blank form hai: vaakya ek baar labelled gaps ke saath likho, aur values gaps mein slot ho jaati hain. Wo fill-in form f-string hai.',
    },

    simple: `**Start broken.** Building a string with \`+=\` in a loop, and formatting the hard way:

\`\`\`python
names = ["Asha", "Bilal", "Chandni", "Deepak"]

# O(n^2): each += allocates a new string and copies the old one
line = ""
for name in names:
    line += name + ", "
print(line)                       # "Asha, Bilal, Chandni, Deepak, "  -- trailing comma too

# verbose formatting
count = 4
msg = "There are " + str(count) + " names: " + line[:-2] + "."
print(msg)
\`\`\`

Strings are **immutable** — \`line += ...\` cannot extend \`line\`, it builds a whole new string. In a loop that is quadratic work. And stitching a message together with \`+\` and \`str()\` is hard to read and easy to get wrong (the stray \`, \`).

**The fix: \`.join()\` a list, and f-strings for templates**

\`\`\`python
names = ["Asha", "Bilal", "Chandni", "Deepak"]

line = ", ".join(names)           # one pass, O(n). No trailing separator.
print(line)                       # "Asha, Bilal, Chandni, Deepak"

count = len(names)
msg = f"There are {count} names: {line}."
print(msg)                        # "There are 4 names: Asha, Bilal, Chandni, Deepak."
\`\`\`

\`\`\`
- str.join(iterable): the string is the SEPARATOR, the argument is the pieces.
      ", ".join(["a", "b"])  -> "a, b"     "".join(["a", "b"]) -> "ab"
  Build text by appending to a LIST, then join once at the end.
- f-string: f"...{expr}..." -- any expression in the braces, evaluated inline.
      f"{name.upper()}"   f"{price:.2f}"   f"{count:,}"   f"{x!r}"
- Strings are immutable: "abc"[0] = "x" is a TypeError. Methods return NEW strings.
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek loop mein \`+=\` se ek string banaana, aur formatting mushkil tarike se:

\`\`\`python
names = ["Asha", "Bilal", "Chandni", "Deepak"]

# O(n^2): har += ek nayi string allocate karta hai aur purani copy karta hai
line = ""
for name in names:
    line += name + ", "
print(line)                       # "Asha, Bilal, Chandni, Deepak, "  -- trailing comma bhi

# verbose formatting
count = 4
msg = "There are " + str(count) + " names: " + line[:-2] + "."
print(msg)
\`\`\`

Strings **immutable** hain — \`line += ...\` \`line\` ko extend nahi kar sakta, ye ek poori nayi string banaata hai. Ek loop mein wo quadratic kaam hai. Aur \`+\` aur \`str()\` se ek message jodna padhna mushkil hai aur galat karna aasaan (awaaraa \`, \`).

**Fix: ek list ko \`.join()\` karo, aur templates ke liye f-strings**

\`\`\`python
names = ["Asha", "Bilal", "Chandni", "Deepak"]

line = ", ".join(names)           # ek pass, O(n). Koi trailing separator nahi.
print(line)                       # "Asha, Bilal, Chandni, Deepak"

count = len(names)
msg = f"There are {count} names: {line}."
print(msg)                        # "There are 4 names: Asha, Bilal, Chandni, Deepak."
\`\`\`

\`\`\`
- str.join(iterable): string SEPARATOR hai, argument pieces hain.
      ", ".join(["a", "b"])  -> "a, b"     "".join(["a", "b"]) -> "ab"
  Ek LIST mein append karke text banao, phir ant mein ek baar join karo.
- f-string: f"...{expr}..." -- braces mein koi bhi expression, inline evaluate.
      f"{name.upper()}"   f"{price:.2f}"   f"{count:,}"   f"{x!r}"
- Strings immutable hain: "abc"[0] = "x" ek TypeError hai. Methods NAYI strings lautaate hain.
\`\`\``,

    content: `## Quotes: four ways, all equivalent (mostly)

\`\`\`python
'single'                       # identical to double
"double"                       # use whichever avoids escaping the quote inside
'She said "hi"'                # no escaping needed
"it's fine"                    # no escaping needed
'it\\'s escaped'                # or escape

"""triple
quoted spans
multiple lines"""              # also used for docstrings

r"C:\\Users\\new"                # raw string: backslashes are literal (regex, Windows paths)
b"bytes not text"              # a bytes object, not a str -- covered in Module 7
\`\`\`

There is no separate "char" type — a single character is just a length-1 string.

## f-strings, the format mini-language

\`\`\`python
name, price, qty = "Widget", 19.5, 1200

f"{name}"              # Widget
f"{name!r}"            # 'Widget'      -- !r calls repr() (adds quotes)
f"{price:.2f}"         # 19.50         -- 2 decimal places
f"{price:>10.2f}"      # "     19.50"  -- right-align in width 10
f"{qty:,}"             # 1,200         -- thousands separator
f"{qty:_}"             # 1_200
f"{0.1875:.1%}"        # 18.8%         -- percentage
f"{255:#x}"            # 0xff          -- hex with prefix
f"{name=}"             # name='Widget' -- debug form (3.8+), prints the expression too

# any expression works inside the braces:
f"{price * qty:,.2f}"  # 23,400.00
f"{'yes' if qty else 'no'}"
\`\`\`

Older code uses \`"{} {}".format(a, b)\` or \`"%s %d" % (a, b)\`. Both still work; f-strings are the current standard and the fastest.

## The string methods you will use constantly

\`\`\`python
s = "  Hello, World  "
s.strip()              # "Hello, World"        -- also lstrip(), rstrip()
s.lower()  s.upper()   # case
s.strip().split(",")   # ['Hello', ' World']   -- split on a substring
"a-b-c".split("-")     # ['a', 'b', 'c']
"a b  c".split()       # ['a', 'b', 'c']       -- no arg: split on ANY whitespace run
"-".join(["a","b"])    # "a-b"
s.replace("l", "L")    # "  HeLLo, WorLd  "    -- returns a NEW string
"Hello".startswith("He")   # True
"file.txt".endswith(".txt")# True
"Hello".find("l")      # 2   (-1 if not found)
"Hello".index("l")     # 2   (ValueError if not found)
"Hello".count("l")     # 2
"abc".zfill(5)         # "00abc"
"%03d" % 7             # "007"   (old style, still handy)
"CamelCase"[0].islower()   # False
"  ".isspace()         # True
\`\`\`

Every one returns a new value — the original string is never modified, because it cannot be.

## Slicing (same as lists, covered next module)

\`\`\`python
s = "Python"
s[0]        # 'P'
s[-1]       # 'n'        -- negative indexes count from the end
s[1:4]      # 'yth'      -- [start:stop), stop is exclusive
s[:3]       # 'Pyt'
s[3:]       # 'hon'
s[::-1]     # 'nohtyP'   -- reverse (step of -1)
s[::2]      # 'Pto'      -- every 2nd char
len(s)      # 6
"y" in s    # True       -- substring test
\`\`\`

## When \`+\` is fine and when it is not

\`\`\`
"hello " + name              FINE  -- a couple of concatenations, readable
f"hello {name}"              BETTER
result = ""
for x in items: result += x  BAD   -- O(n^2). Use "".join(items) or a list + join.

parts = []
for x in items:
    parts.append(process(x))
text = "\\n".join(parts)      GOOD  -- O(n)
\`\`\``,

    contentHi: `## Quotes: chaar tarike, sab equivalent (zyaadatar)

\`\`\`python
'single'                       # double ke samaan
"double"                       # jo bhi andar ke quote ko escape karne se bachaaye
'She said "hi"'                # koi escaping nahi chahiye
"it's fine"                    # koi escaping nahi chahiye
'it\\'s escaped'                # ya escape

"""triple
quoted kayi
lines par failta hai"""        # docstrings ke liye bhi istemal

r"C:\\Users\\new"                # raw string: backslashes literal (regex, Windows paths)
b"bytes not text"              # ek bytes object, str nahi -- Module 7 mein
\`\`\`

Koi alag "char" type nahi — ek akela character bas ek length-1 string hai.

## f-strings, format mini-language

\`\`\`python
name, price, qty = "Widget", 19.5, 1200

f"{name}"              # Widget
f"{name!r}"            # 'Widget'      -- !r repr() call karta hai (quotes jodta hai)
f"{price:.2f}"         # 19.50         -- 2 decimal places
f"{price:>10.2f}"      # "     19.50"  -- width 10 mein right-align
f"{qty:,}"             # 1,200         -- thousands separator
f"{qty:_}"             # 1_200
f"{0.1875:.1%}"        # 18.8%         -- percentage
f"{255:#x}"            # 0xff          -- prefix ke saath hex
f"{name=}"             # name='Widget' -- debug form (3.8+), expression bhi print karta hai

# braces ke andar koi bhi expression kaam karta hai:
f"{price * qty:,.2f}"  # 23,400.00
f"{'yes' if qty else 'no'}"
\`\`\`

Purana code \`"{} {}".format(a, b)\` ya \`"%s %d" % (a, b)\` istemal karta hai. Dono abhi bhi kaam karte hain; f-strings current standard aur sabse tez hain.

## Wo string methods jo aap lagataar istemal karoge

\`\`\`python
s = "  Hello, World  "
s.strip()              # "Hello, World"        -- lstrip(), rstrip() bhi
s.lower()  s.upper()   # case
s.strip().split(",")   # ['Hello', ' World']   -- ek substring par split
"a-b-c".split("-")     # ['a', 'b', 'c']
"a b  c".split()       # ['a', 'b', 'c']       -- koi arg nahi: KISI bhi whitespace run par split
"-".join(["a","b"])    # "a-b"
s.replace("l", "L")    # "  HeLLo, WorLd  "    -- ek NAYI string lautaata hai
"Hello".startswith("He")   # True
"file.txt".endswith(".txt")# True
"Hello".find("l")      # 2   (nahi mila toh -1)
"Hello".index("l")     # 2   (nahi mila toh ValueError)
"Hello".count("l")     # 2
"abc".zfill(5)         # "00abc"
"%03d" % 7             # "007"   (purana style, abhi bhi kaam ka)
\`\`\`

Har ek ek nayi value lautaata hai — asli string kabhi modify nahi hoti, kyunki wo nahi ho sakti.

## Slicing (lists jaisa, agla module)

\`\`\`python
s = "Python"
s[0]        # 'P'
s[-1]       # 'n'        -- negative indexes end se ginte hain
s[1:4]      # 'yth'      -- [start:stop), stop exclusive
s[:3]       # 'Pyt'
s[3:]       # 'hon'
s[::-1]     # 'nohtyP'   -- reverse (step -1)
s[::2]      # 'Pto'      -- har 2nd char
len(s)      # 6
"y" in s    # True       -- substring test
\`\`\`

## Kab \`+\` theek hai aur kab nahi

\`\`\`
"hello " + name              THEEK  -- kuch concatenations, padhne yogya
f"hello {name}"              BEHTAR
result = ""
for x in items: result += x  KHARAB -- O(n^2). "".join(items) ya ek list + join istemal karo.

parts = []
for x in items:
    parts.append(process(x))
text = "\\n".join(parts)      ACHHA  -- O(n)
\`\`\``,

    examples: [
      {
        title: 'Broken: += in a loop, and manual formatting',
        titleHi: 'Toota: loop mein +=, aur manual formatting',
        code: `rows = [["Asha", 92], ["Bilal", 88], ["Chandni", 95]]

report = ""
for name, score in rows:
    report += name + ": " + str(score) + "\\n"

print(report)`,
        output: `Asha: 92
Bilal: 88
Chandni: 95
`,
        explain: 'This produces the right text, but every `report += ...` builds a new string and copies the whole accumulated report. For 3 rows it does not matter; for 100,000 rows it is measurably slow. The formatting with `+ str(score) +` is also noisy.',
        explainHi: 'Ye sahi text banaata hai, par har `report += ...` ek nayi string banaata hai aur poori jama report copy karta hai. 3 rows ke liye maayne nahi rakhta; 100,000 rows ke liye ye maapne yogya dheema hai. `+ str(score) +` se formatting bhi shor-bhari hai.',
      },
      {
        title: 'Fixed: list of f-strings, joined once',
        titleHi: 'Theek: f-strings ki list, ek baar joined',
        code: `rows = [["Asha", 92], ["Bilal", 88], ["Chandni", 95]]

lines = [f"{name}: {score}" for name, score in rows]
report = "\\n".join(lines)
print(report)

# a formatted table
for name, score in rows:
    bar = "#" * (score // 10)
    print(f"{name:<10}{score:>4}  {bar}")`,
        output: `Asha: 92
Bilal: 88
Chandni: 95
Asha        92  #########
Bilal       88  ########
Chandni     95  #########`,
        explain: 'The list comprehension builds each line with an f-string, then a single `"\\n".join(...)` stitches them in one O(n) pass. The table uses `:<10` (left-align in 10) and `:>4` (right-align in 4) from the format mini-language for clean columns.',
        explainHi: 'List comprehension har line ko ek f-string se banaata hai, phir ek akela `"\\n".join(...)` unhe ek O(n) pass mein jodta hai. Table saaf columns ke liye format mini-language se `:<10` (10 mein left-align) aur `:>4` (4 mein right-align) istemal karta hai.',
      },
      {
        title: 'Strings are immutable: methods return new strings',
        titleHi: 'Strings immutable hain: methods nayi strings lautaate hain',
        code: `s = "  Hello, World  "

s.strip()                 # returns a new string...
print(repr(s))            # ...s itself is UNCHANGED

s = s.strip()             # you must rebind to keep the result
print(repr(s))

parts = "a,b,,c".split(",")
print(parts)              # ['a', 'b', '', 'c']  -- empty field preserved

print("Hello"[::-1])      # 'olleH'
print("mississippi".replace("ss", "S"))   # 'miSiSippi'`,
        output: `'  Hello, World  '
'Hello, World'
['a', 'b', '', 'c']
olleH
miSiSippi`,
        explain: 'Calling `s.strip()` computes a new string and discards it if you do not assign it — the original `s` is untouched. You must write `s = s.strip()`. `split(",")` keeps empty fields; `split()` with no argument collapses whitespace runs instead.',
        explainHi: '`s.strip()` call karna ek nayi string compute karta hai aur ise discard karta hai agar aap assign nahi karte — asli `s` achhoota hai. Aapko `s = s.strip()` likhna hoga. `split(",")` empty fields rakhta hai; bina argument `split()` whitespace runs ko collapse karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `s = "hello"
s[0] = "H"`,
        right: `s = "hello"
s = "H" + s[1:]      # or  s.capitalize()  ->  "Hello"`,
        why: 'Strings are immutable — item assignment raises "TypeError: str object does not support item assignment". To change a character you build a new string from slices, or use a method like `.replace()` or `.capitalize()`.',
        whyHi: 'Strings immutable hain — item assignment "TypeError: str object does not support item assignment" deta hai. Ek character badalne ke liye aap slices se ek nayi string banaate ho, ya `.replace()` ya `.capitalize()` jaisa ek method istemal karte ho.',
      },
      {
        wrong: `name = input("name: ")
name.strip()
greet(name)          # still has the trailing newline / spaces`,
        right: `name = input("name: ").strip()
greet(name)`,
        why: 'String methods return a new string; they never mutate in place. `name.strip()` on its own line computes the stripped value and throws it away. You must use the return value: `name = name.strip()` or chain it onto the source.',
        whyHi: 'String methods ek nayi string lautaate hain; wo kabhi jagah par mutate nahi karte. Apni line par `name.strip()` stripped value compute karta hai aur phenk deta hai. Aapko return value istemal karni hogi: `name = name.strip()` ya ise source par chain karo.',
      },
      {
        wrong: `path = "C:\\Users\\name\\data"   # \\n and \\d get interpreted`,
        right: `path = r"C:\\Users\\name\\data"  # raw string -- backslashes are literal`,
        why: 'In a normal string, `\\U`, `\\n`, etc. are escape sequences — `"C:\\Users"` starts a `\\U...` unicode escape and errors, and `"\\name"` contains a newline. Use a raw string `r"..."` for Windows paths and regex patterns, or forward slashes (Python accepts them on Windows).',
        whyHi: 'Ek normal string mein, `\\U`, `\\n`, etc. escape sequences hain — `"C:\\Users"` ek `\\U...` unicode escape shuru karta hai aur error deta hai, aur `"\\name"` mein ek newline hai. Windows paths aur regex patterns ke liye ek raw string `r"..."` istemal karo, ya forward slashes (Python Windows par unhe accept karta hai).',
      },
    ],

    realWorld: [
      {
        en: '**Django and DRF error messages, log lines, and email bodies** are built with f-strings: `f"User {user.id} has no permission for {obj}"`. Building them with `+` and `str()` is how you get `"User 5has no permission"` bugs.',
        hi: '**Django aur DRF error messages, log lines, aur email bodies** f-strings se bante hain: `f"User {user.id} has no permission for {obj}"`. Unhe `+` aur `str()` se banaana aise hai jaise aap `"User 5has no permission"` bugs paate ho.',
      },
      {
        en: '**Generating a CSV or a large text export** row by row must build a list and `"\\n".join()` it at the end. A Django view that does `response += line` in a loop over 50,000 rows will time out; the list-then-join version returns in milliseconds.',
        hi: '**Ek CSV ya ek bada text export row by row generate karna** ko ek list banaani chahiye aur ant mein `"\\n".join()` karni chahiye. Ek Django view jo 50,000 rows par ek loop mein `response += line` karta hai time out hoga; list-phir-join version milliseconds mein lautaata hai.',
      },
      {
        en: '**SQL string building** (when you cannot use the ORM) must use `%` placeholders or parameterised queries, never f-strings — `f"WHERE name = \'{name}\'"` is a SQL injection hole. The f-string is for logs and messages, not for queries.',
        hi: '**SQL string building** (jab aap ORM istemal nahi kar sakte) ko `%` placeholders ya parameterised queries istemal karni chahiye, kabhi f-strings nahi — `f"WHERE name = \'{name}\'"` ek SQL injection chhed hai. F-string logs aur messages ke liye hai, queries ke liye nahi.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is building a string with `+=` in a loop slow in Python, and what is the correct pattern?',
        qHi: 'Python mein ek loop mein `+=` se ek string banaana dheema kyun hai, aur sahi pattern kya hai?',
        a: 'Python strings are immutable, which means there is no operation that lengthens an existing string object in place. When you write result plus-equals piece, Python cannot append piece to the string that result currently points at; instead it allocates a brand-new string large enough to hold both, copies the entire current contents of result into it, copies piece after that, and rebinds result to the new object. The old string is then garbage. A single such operation costs time proportional to the combined length. Now put that in a loop that runs n times, where the accumulated string grows by roughly a constant each iteration. On iteration k the copy costs about k, so the total cost is the sum of one plus two plus three up to n, which is proportional to n squared. For a few dozen pieces this is invisible; for tens of thousands it becomes seconds. The correct pattern is to collect the pieces in a list, which does support cheap in-place appends — appending to a list is amortised constant time — and then call the string join method once at the end. Join walks the list a single time, computes the total size up front, allocates one final string, and copies each piece into place exactly once, so the whole thing is linear in the total output length. The idiom is: separator string dot join of the list of parts. If you genuinely need to build incrementally and cannot collect first, the io module\'s StringIO class gives you a writable buffer with an efficient getvalue at the end, but the list-then-join approach covers almost every real case.',
        aHi: 'Python strings immutable hain, jiska matlab hai koi operation nahi jo ek maujooda string object ko jagah par lamba kare. Jab aap result plus-equals piece likhte ho, Python piece ko us string mein append nahi kar sakta jispar result abhi point karta hai; iske bajaye ye ek bilkul nayi string allocate karta hai dono ko rakhne ke liye kaafi badi, result ke poore current contents usmein copy karta hai, uske baad piece copy karta hai, aur result ko naye object se rebind karta hai. Purani string phir garbage hai. Ek aisa operation combined length ke anupaatik samay kharch karta hai. Ab ise ek loop mein rakho jo n baar chalta hai, jahaan jama string har iteration lagbhag ek constant se badhti hai. Iteration k par copy lagbhag k kharch karta hai, isliye kul cost ek plus do plus teen n tak ka yog hai, jo n squared ke anupaatik hai. Sahi pattern pieces ko ek list mein ikattha karna hai, jo saste in-place appends support karti hai, aur phir ant mein ek baar string join method call karna. Join list ko ek baar walk karta hai, aage se total size compute karta hai, ek antim string allocate karta hai, aur har piece ko jagah par bilkul ek baar copy karta hai.',
      },
      {
        q: 'Compare f-strings, `str.format`, `%`-formatting, and `+` concatenation. When would you use each?',
        qHi: 'f-strings, `str.format`, `%`-formatting, aur `+` concatenation ki tulna karo. Aap har ek kab istemal karoge?',
        a: 'All four produce a string with values substituted in, and all four still work, but they are not equal in practice. F-strings, written with an f prefix before the quote, let you put any Python expression directly inside braces in the string, evaluated at that point. They are the most readable because the values appear where they belong in the sentence, they are the fastest because the compiler turns them into direct concatenation calls with no runtime parsing of a format template, and they support the full format specification after a colon for width, alignment, precision, and thousands separators. They are the default choice for anything you are writing today: log messages, error text, generated output. The format method, called on a template string with placeholders in braces, does the same substitution but the values are passed as arguments rather than embedded, so it is the right tool when the template and the values are separated — for example a template loaded from a config file or a translation catalogue, where you cannot use an f-string because the template is not a literal in your source. Percent formatting, using percent-s and percent-d style placeholders, is the oldest style, still common in older code and in the logging module, which deliberately uses it so that the string is only formatted if the log level is actually enabled. You would not choose it for new code but you must be able to read it. Plain plus concatenation is fine for joining two or three string variables where a template would be overkill, but it forces you to call str on every non-string value and it is easy to miss a separator, so beyond a couple of pieces an f-string is clearer. The one place none of the string-building options belong is constructing SQL or shell commands from user input, where you must use the parameterised interface of the database driver or the argument list of the subprocess call.',
        aHi: 'Chaaron ek string banaate hain values substitute karke, aur chaaron abhi bhi kaam karte hain, par wo vyavhaar mein barabar nahi. F-strings, quote se pehle ek f prefix ke saath likhi, aapko braces ke andar seedhe koi bhi Python expression rakhne dete hain, us bindu par evaluate. Wo sabse padhne yogya hain kyunki values wahaan dikhti hain jahaan wo vaakya mein hain, wo sabse tez hain kyunki compiler unhe seedhe concatenation calls mein badalta hai bina ek format template ki runtime parsing ke, aur wo colon ke baad poori format specification support karte hain width, alignment, precision, aur thousands separators ke liye. Wo aaj aap jo bhi likh rahe ho uske liye default choice hain. Format method, braces mein placeholders waale ek template string par call kiya, wahi substitution karta hai par values arguments ki tarah pass hoti hain embedded ki bajaye, isliye ye sahi tool hai jab template aur values alag hon — udaharan ke liye ek config file se load kiya template. Percent formatting sabse purana style hai, abhi bhi purane code mein aur logging module mein aam. Plain plus concatenation do ya teen string variables jodne ke liye theek hai.',
      },
    ],

    exercises: [
      {
        task: 'Write a function `table(rows)` where `rows` is a list of `(name, score)` tuples. Build each display line as an f-string `f"{name:<12}{score:>5}"`, collect them in a list, and return `"\\n".join(...)`. Test it with 4 rows and print the result.',
        taskHi: 'Ek function `table(rows)` likho jahaan `rows` `(name, score)` tuples ki ek list hai. Har display line ko ek f-string `f"{name:<12}{score:>5}"` ki tarah banao, unhe ek list mein ikattha karo, aur `"\\n".join(...)` return karo. Ise 4 rows ke saath test karo aur result print karo.',
        hint: '`:<12` left-aligns in a 12-wide field; `:>5` right-aligns in 5. The list comprehension `[f"{n:<12}{s:>5}" for n, s in rows]` builds all the lines, then one join.',
        hintHi: '`:<12` ek 12-chaudi field mein left-align karta hai; `:>5` 5 mein right-align. List comprehension `[f"{n:<12}{s:>5}" for n, s in rows]` sab lines banaata hai, phir ek join.',
      },
      {
        task: 'In the REPL, set `s = "  Data-Science-101  "`. Predict then check: `s.strip()`, `s.strip().split("-")`, `s.strip().lower().replace("-", " ")`, `s[::-1]`, `"-" in s`, `s.count("-")`. Confirm `s` itself is unchanged after all of them.',
        taskHi: 'REPL mein, `s = "  Data-Science-101  "` set karo. Anumaan lagao phir check karo: `s.strip()`, `s.strip().split("-")`, `s.strip().lower().replace("-", " ")`, `s[::-1]`, `"-" in s`, `s.count("-")`. Confirm karo ki `s` khud in sab ke baad abadalta hai.',
        hint: 'Each method returns a new string; none touch `s`. `s.strip().split("-")` -> `[\'Data\', \'Science\', \'101\']`. Chaining works because each call returns a string you can call the next method on.',
        hintHi: 'Har method ek nayi string lautaata hai; koi `s` ko nahi chhoota. `s.strip().split("-")` -> `[\'Data\', \'Science\', \'101\']`. Chaining kaam karta hai kyunki har call ek string lautaata hai jispar aap agla method call kar sakte ho.',
      },
      {
        task: 'Time the difference: build a string of 50,000 "x" characters two ways — (a) `s = ""` then `s += "x"` in a loop, (b) `"".join("x" for _ in range(50000))`. Use `import time; t = time.perf_counter(); ...; print(time.perf_counter() - t)` around each. Report the ratio.',
        taskHi: 'Antar time karo: 50,000 "x" characters ki ek string do tarikon se banao — (a) `s = ""` phir loop mein `s += "x"`, (b) `"".join("x" for _ in range(50000))`. Har ek ke aas-paas `import time; t = time.perf_counter(); ...; print(time.perf_counter() - t)` istemal karo. Ratio report karo.',
        hint: 'The `+=` version does ~50,000 allocations copying an ever-growing string — roughly quadratic. The join version is one allocation and one linear copy. Expect the join to be many times faster, and the gap widens with size.',
        hintHi: '`+=` version ~50,000 allocations karta hai ek badhti string copy karte hue — lagbhag quadratic. Join version ek allocation aur ek linear copy hai. Join ke kayi guna tez hone ki ummeed karo, aur gap size ke saath badhta hai.',
      },
    ],

    keyTakeaways: [
      'Strings are IMMUTABLE. `s[0] = "x"` is a TypeError. Every string method returns a NEW string — you must rebind: `s = s.strip()`, not just `s.strip()`.',
      'Building a string with `+=` in a loop is O(n^2) — each `+=` copies the whole accumulated string. Collect pieces in a LIST, then `sep.join(list)` once (O(n)).',
      '`str.join`: the string is the SEPARATOR, the argument is the iterable of pieces. `", ".join(["a","b"])` -> `"a, b"`. `"".join(...)` concatenates with nothing between.',
      'f-strings are the modern default: `f"{expr}"` evaluates any expression inline. Format spec after `:` — `{x:.2f}`, `{n:,}`, `{s:<10}`, `{s:>10}`, `{x!r}`, `{name=}`.',
      'No `char` type — a single character is a length-1 string. Slicing works like lists: `s[1:4]`, `s[::-1]` (reverse), `s[-1]` (last), `"x" in s` (substring test).',
      'Use raw strings `r"..."` for Windows paths and regex — otherwise `\\U`, `\\n` etc. are interpreted as escapes.',
      'Never build SQL or shell commands with f-strings/`+` on user input — that is an injection hole. Use parameterised queries / argument lists.',
      '`split()` with no arg splits on any whitespace run and drops empties; `split(",")` splits on that exact string and keeps empty fields.',
    ],
    keyTakeawaysHi: [
      'Strings IMMUTABLE hain. `s[0] = "x"` ek TypeError hai. Har string method ek NAYI string lautaata hai — aapko rebind karna hoga: `s = s.strip()`, sirf `s.strip()` nahi.',
      'Ek loop mein `+=` se ek string banaana O(n^2) hai — har `+=` poori jama string copy karta hai. Pieces ko ek LIST mein ikattha karo, phir ek baar `sep.join(list)` (O(n)).',
      '`str.join`: string SEPARATOR hai, argument pieces ka iterable hai. `", ".join(["a","b"])` -> `"a, b"`. `"".join(...)` beech mein kuch nahi ke saath concatenate karta hai.',
      'f-strings modern default hain: `f"{expr}"` koi bhi expression inline evaluate karta hai. `:` ke baad format spec — `{x:.2f}`, `{n:,}`, `{s:<10}`, `{s:>10}`, `{x!r}`, `{name=}`.',
      'Koi `char` type nahi — ek akela character ek length-1 string hai. Slicing lists jaisa: `s[1:4]`, `s[::-1]` (reverse), `s[-1]` (last), `"x" in s` (substring test).',
      'Windows paths aur regex ke liye raw strings `r"..."` istemal karo — warna `\\U`, `\\n` etc. escapes ki tarah interpret hote hain.',
      'User input par f-strings/`+` se kabhi SQL ya shell commands mat banao — wo ek injection chhed hai. Parameterised queries / argument lists istemal karo.',
      'Bina arg `split()` kisi bhi whitespace run par split karta hai aur empties drop karta hai; `split(",")` us exact string par split karta hai aur empty fields rakhta hai.',
    ],
  },
];
