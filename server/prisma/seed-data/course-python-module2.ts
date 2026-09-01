/**
 * Python Complete Course — Module 2: Collections & Iteration, lessons 1-3.
 *
 * Lesson 1: lists — indexing, the full slice `[start:stop:step]`, mutation
 *           (append/extend/insert/pop/remove/del), `+` vs extend, sort vs
 *           sorted, the `[[]] * 3` shared-reference trap, and not mutating a
 *           list while iterating it.
 * Lesson 2: tuples & unpacking — immutability and why it matters (dict keys,
 *           records, return values), the single-element `(x,)`, `a, b = ...`,
 *           star unpacking `first, *rest = ...`, the swap idiom, nested
 *           unpacking. Broken: `(x)` is not a tuple; trying to mutate.
 * Lesson 3: dicts — `[]` vs `.get`, KeyError, `.setdefault`, iteration,
 *           insertion order, merging (`|`, update, `{**a, **b}`),
 *           `defaultdict` and `Counter`, dict comprehensions. Broken:
 *           `d[missing]`, mutating during iteration.
 *
 * NOTE for future editors: `examples` use `code` + `output` (Python). EVERY
 * backtick inside `simple`/`simpleHi`/`content`/`contentHi` must be `\`` —
 * including inline-code spans inside the ``` ascii blocks. Run every sample
 * with `python`. Scan for Devanagari/Cyrillic. `npx tsc --noEmit -p .`.
 */

import type { CourseLesson } from './course-js-module1';

export const PYTHON_MODULE_2: CourseLesson[] = [
  {
    slug: 'py-lists-slicing-and-mutation',
    title: 'Lists: Slicing, Mutation, and the Shared-Reference Trap',
    titleHi: 'Lists: Slicing, Mutation, Aur Shared-Reference Jaal',
    description: 'Creating a grid of empty rows by writing `[[]] * 3` — a natural-looking way to make three empty lists. It does make a list of length three, but all three elements are the same list object, so appending to one row appears in all three. And calling `sorted()` where you meant `.sort()` (or the reverse) leaves you with `None` or an unsorted original.',
    descriptionHi: 'Ek grid of empty rows banaana `[[]] * 3` likhkar — teen empty lists banane ka ek swabhaavik dikhne waala tarika. Ye teen lambaayi ki ek list banaata hai, par teenon elements ek hi list object hain, isliye ek row mein append karna teenon mein dikhta hai. Aur `sorted()` call karna jahaan aapka matlab `.sort()` tha (ya ulta) aapko `None` ya ek unsorted original ke saath chhod deta hai.',
    difficulty: 'EASY',
    duration: 22,
    order: 1,

    analogy: {
      en: '**Handing out copies of a form, versus handing out the address of one form.** You need three teams to each keep their own sign-up sheet. If you photocopy a blank sheet three times, each team writes on their own paper and the three lists stay separate. But if instead you pin one blank sheet to a board and give all three teams the location of that board, every team is writing on the same physical sheet — team one adds a name and team two sees it, because there was only ever one sheet. Python\'s `[[]] * 3` is the second thing: it does not make three lists, it makes a list holding three references to the one inner list you wrote. To get three genuinely separate lists you must create a fresh one for each slot, which a comprehension does. Separately: some tools do their job and hand you a finished result, and some tools rearrange the thing you gave them and hand you nothing back. `sorted(x)` is the first kind — it returns a new sorted list and leaves `x` alone. `x.sort()` is the second kind — it reorders `x` in place and returns `None`. Assigning the result of the in-place one, `y = x.sort()`, gives you `None`; forgetting to assign the result of the returning one throws the sorted list away.',
      hi: '**Ek form ki copies baantna, versus ek form ka pata baantna.** Aapko teen teams chahiye jo har ek apni sign-up sheet rakhein. Agar aap ek blank sheet ki teen baar photocopy karte ho, har team apne kaagaz par likhti hai aur teen lists alag rehti hain. Par agar iske bajaye aap ek blank sheet ek board par pin karte ho aur teenon teams ko us board ka pata dete ho, har team usi bhautik sheet par likh rahi hai — team ek ek naam jodti hai aur team do use dekhti hai, kyunki sirf ek sheet thi. Python ka `[[]] * 3` doosri cheez hai: ye teen lists nahi banaata, ye ek list banaata hai jo ek inner list ke teen references rakhti hai. Teen sachmuch alag lists paane ke liye aapko har slot ke liye ek naya banana hoga, jo ek comprehension karta hai. Alag se: kuch tools apna kaam karte hain aur aapko ek poora result dete hain, aur kuch tools jo aapne diya use punarvyavasthit karke aapko kuch nahi wapas dete. `sorted(x)` pehli kism hai — ye ek nayi sorted list lautaata hai aur `x` ko akela chhodta hai. `x.sort()` doosri kism hai — ye `x` ko jagah par reorder karta hai aur `None` lautaata hai.',
    },

    simple: `**Start broken.** \`[[]] * 3\` for a grid, and confusing \`sort\` with \`sorted\`:

\`\`\`python
grid = [[]] * 3               # looks like three empty lists
grid[0].append("x")
print(grid)                   # [['x'], ['x'], ['x']]   <-- all three! one shared list

scores = [3, 1, 2]
top = scores.sort()           # .sort() mutates and returns None
print(top)                    # None
print(scores)                 # [1, 2, 3]  -- scores was reordered

names = ["Bo", "Al", "Cy"]
sorted(names)                  # returns a new list... which is discarded
print(names)                  # ['Bo', 'Al', 'Cy']  -- unchanged
\`\`\`

\`[x] * n\` repeats the *same reference* n times. \`.sort()\` / \`.reverse()\` mutate in place and return \`None\`. \`sorted()\` / \`reversed()\` return a new sequence and leave the original alone.

**The fix: a comprehension for independent rows; pick the right sort call**

\`\`\`python
grid = [[] for _ in range(3)]     # a FRESH list per slot
grid[0].append("x")
print(grid)                       # [['x'], [], []]

scores = [3, 1, 2]
scores.sort()                     # in place -- now use 'scores'
print(scores)                     # [1, 2, 3]

names = ["Bo", "Al", "Cy"]
ordered = sorted(names)           # new list -- keep the return value
print(ordered, names)             # ['Al', 'Bo', 'Cy'] ['Bo', 'Al', 'Cy']
\`\`\`

\`\`\`
CREATE      [1, 2, 3]        list(range(3))        [f(x) for x in xs]
ACCESS      xs[0]  xs[-1]    (negative = from the end; xs[-1] is the last)
SLICE       xs[1:4]  xs[:3]  xs[3:]  xs[::-1] (reverse)  xs[::2] (every other)
LENGTH      len(xs)          "x" in xs (membership -- O(n) scan for a list)
ADD         xs.append(v)     one item, in place
            xs.extend(other) or  xs += other   -- many items, in place
            xs + other       -- a NEW list (does not mutate)
            xs.insert(i, v)  -- at position i (O(n))
REMOVE      xs.pop()  xs.pop(i)   -- remove & return
            xs.remove(v)          -- remove first matching value (ValueError if none)
            del xs[i]   del xs[1:3]
SORT        xs.sort()  -> in place, returns None
            sorted(xs) -> new list       both take key=... and reverse=True
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek grid ke liye \`[[]] * 3\`, aur \`sort\` ko \`sorted\` se confuse karna:

\`\`\`python
grid = [[]] * 3               # teen empty lists dikhta hai
grid[0].append("x")
print(grid)                   # [['x'], ['x'], ['x']]   <-- teenon! ek shared list

scores = [3, 1, 2]
top = scores.sort()           # .sort() mutate karta hai aur None lautaata hai
print(top)                    # None
print(scores)                 # [1, 2, 3]  -- scores reorder ho gaya

names = ["Bo", "Al", "Cy"]
sorted(names)                  # ek nayi list lautaata hai... jo discard ho jaati hai
print(names)                  # ['Bo', 'Al', 'Cy']  -- abadalta
\`\`\`

\`[x] * n\` *usi reference* ko n baar dohraata hai. \`.sort()\` / \`.reverse()\` jagah par mutate karte hain aur \`None\` lautaate hain. \`sorted()\` / \`reversed()\` ek nayi sequence lautaate hain aur original ko akela chhodte hain.

**Fix: independent rows ke liye ek comprehension; sahi sort call chuno**

\`\`\`python
grid = [[] for _ in range(3)]     # prati slot ek NAYI list
grid[0].append("x")
print(grid)                       # [['x'], [], []]

scores = [3, 1, 2]
scores.sort()                     # jagah par -- ab 'scores' istemal karo
print(scores)                     # [1, 2, 3]

names = ["Bo", "Al", "Cy"]
ordered = sorted(names)           # nayi list -- return value rakho
print(ordered, names)             # ['Al', 'Bo', 'Cy'] ['Bo', 'Al', 'Cy']
\`\`\`

\`\`\`
CREATE      [1, 2, 3]        list(range(3))        [f(x) for x in xs]
ACCESS      xs[0]  xs[-1]    (negative = end se; xs[-1] aakhri hai)
SLICE       xs[1:4]  xs[:3]  xs[3:]  xs[::-1] (reverse)  xs[::2] (har doosra)
LENGTH      len(xs)          "x" in xs (membership -- ek list ke liye O(n) scan)
ADD         xs.append(v)     ek item, jagah par
            xs.extend(other) ya  xs += other   -- kayi items, jagah par
            xs + other       -- ek NAYI list (mutate nahi karta)
            xs.insert(i, v)  -- position i par (O(n))
REMOVE      xs.pop()  xs.pop(i)   -- hataao aur return karo
            xs.remove(v)          -- pehli matching value hataao (koi nahi to ValueError)
            del xs[i]   del xs[1:3]
SORT        xs.sort()  -> jagah par, None lautaata hai
            sorted(xs) -> nayi list       dono key=... aur reverse=True lete hain
\`\`\``,

    content: `## Slicing, the full form

\`\`\`python
xs = [10, 20, 30, 40, 50]

xs[1:4]      # [20, 30, 40]   -- [start : stop)  stop is EXCLUSIVE
xs[:3]       # [10, 20, 30]   -- start defaults to 0
xs[3:]       # [40, 50]       -- stop defaults to len
xs[:]        # a shallow COPY of the whole list
xs[::2]      # [10, 30, 50]   -- step 2
xs[::-1]     # [50, 40, 30, 20, 10]   -- step -1 => reversed
xs[-2:]      # [40, 50]       -- last two
xs[1:4] = [99]          # slice ASSIGNMENT: replace those 3 items with 1
print(xs)              # [10, 99, 50]
xs[1:1] = [1, 2]        # insert without replacing
print(xs)              # [10, 1, 2, 99, 50]
del xs[1:3]            # delete a slice
\`\`\`

A slice never raises for out-of-range bounds — \`xs[2:999]\` just stops at the end, \`xs[10:20]\` is \`[]\`. Indexing (\`xs[10]\`) does raise \`IndexError\`.

## Copy semantics: assignment shares, slicing shallow-copies

\`\`\`python
a = [1, 2, 3]
b = a            # b is another name for the SAME list
b.append(4)
print(a)         # [1, 2, 3, 4]

c = a[:]         # shallow copy -- c is a new list
c = a.copy()     # same thing
c = list(a)      # same thing
c.append(5)
print(a)         # [1, 2, 3, 4]  -- untouched

# "shallow" means nested objects are still shared:
nested = [[1, 2], [3, 4]]
shallow = nested[:]
shallow[0].append(99)
print(nested)    # [[1, 2, 99], [3, 4]]  -- the inner list was shared!

import copy
deep = copy.deepcopy(nested)   # fully independent
\`\`\`

## \`sort\` / \`sorted\` with \`key\` and \`reverse\`

\`\`\`python
words = ["banana", "kiwi", "apple", "fig"]

sorted(words)                       # ['apple', 'banana', 'fig', 'kiwi']  -- alphabetical
sorted(words, key=len)              # ['fig', 'kiwi', 'apple', 'banana']  -- by length
sorted(words, key=len, reverse=True)# longest first
sorted(words, key=str.lower)        # case-insensitive

people = [("Al", 30), ("Bo", 25), ("Cy", 30)]
sorted(people, key=lambda p: p[1])              # by age
sorted(people, key=lambda p: (-p[1], p[0]))     # age desc, then name asc

# sort is STABLE: equal keys keep their original relative order
\`\`\`

## Common list operations

\`\`\`python
xs.count(v)              # how many v
xs.index(v)              # first position of v (ValueError if absent) -- xs.index(v, start)
xs.reverse()             # in place
list(reversed(xs))       # new list
min(xs)  max(xs)  sum(xs)
any(xs)  all(xs)         # truthiness of the elements
"-".join(str(x) for x in xs)   # to a string
[*xs, 99]                # a new list with 99 appended (unpacking)
[*a, *b]                 # concatenate a and b into a new list
\`\`\`

## Do not mutate a list while iterating it

\`\`\`python
# WRONG -- skips elements as the list shrinks under the loop
for x in nums:
    if x < 0:
        nums.remove(x)

# RIGHT -- build a new list
nums = [x for x in nums if x >= 0]

# RIGHT -- iterate a copy, mutate the original
for x in nums[:]:
    if x < 0:
        nums.remove(x)
\`\`\``,

    contentHi: `## Slicing, poora roop

\`\`\`python
xs = [10, 20, 30, 40, 50]

xs[1:4]      # [20, 30, 40]   -- [start : stop)  stop EXCLUSIVE hai
xs[:3]       # [10, 20, 30]   -- start default 0
xs[3:]       # [40, 50]       -- stop default len
xs[:]        # poori list ki ek shallow COPY
xs[::2]      # [10, 30, 50]   -- step 2
xs[::-1]     # [50, 40, 30, 20, 10]   -- step -1 => reversed
xs[-2:]      # [40, 50]       -- aakhri do
xs[1:4] = [99]          # slice ASSIGNMENT: un 3 items ko 1 se replace karo
print(xs)              # [10, 99, 50]
xs[1:1] = [1, 2]        # replace kiye bina insert
print(xs)              # [10, 1, 2, 99, 50]
del xs[1:3]            # ek slice delete karo
\`\`\`

Ek slice out-of-range bounds ke liye kabhi error nahi deta — \`xs[2:999]\` bas end par rukta hai, \`xs[10:20]\` \`[]\` hai. Indexing (\`xs[10]\`) \`IndexError\` deta hai.

## Copy semantics: assignment share karta hai, slicing shallow-copy karta hai

\`\`\`python
a = [1, 2, 3]
b = a            # b usi list ka doosra naam hai
b.append(4)
print(a)         # [1, 2, 3, 4]

c = a[:]         # shallow copy -- c ek nayi list hai
c = a.copy()     # wahi cheez
c = list(a)      # wahi cheez
c.append(5)
print(a)         # [1, 2, 3, 4]  -- achhoota

# "shallow" ka matlab nested objects abhi bhi share hote hain:
nested = [[1, 2], [3, 4]]
shallow = nested[:]
shallow[0].append(99)
print(nested)    # [[1, 2, 99], [3, 4]]  -- inner list share hui thi!

import copy
deep = copy.deepcopy(nested)   # poori tarah independent
\`\`\`

## \`sort\` / \`sorted\` \`key\` aur \`reverse\` ke saath

\`\`\`python
words = ["banana", "kiwi", "apple", "fig"]

sorted(words)                       # ['apple', 'banana', 'fig', 'kiwi']  -- alphabetical
sorted(words, key=len)              # ['fig', 'kiwi', 'apple', 'banana']  -- length se
sorted(words, key=len, reverse=True)# sabse lamba pehle
sorted(words, key=str.lower)        # case-insensitive

people = [("Al", 30), ("Bo", 25), ("Cy", 30)]
sorted(people, key=lambda p: p[1])              # age se
sorted(people, key=lambda p: (-p[1], p[0]))     # age desc, phir name asc

# sort STABLE hai: barabar keys apna original relative order rakhti hain
\`\`\`

## Aam list operations

\`\`\`python
xs.count(v)              # kitne v
xs.index(v)              # v ki pehli position (absent to ValueError) -- xs.index(v, start)
xs.reverse()             # jagah par
list(reversed(xs))       # nayi list
min(xs)  max(xs)  sum(xs)
any(xs)  all(xs)         # elements ki truthiness
"-".join(str(x) for x in xs)   # ek string mein
[*xs, 99]                # ek nayi list 99 appended ke saath (unpacking)
[*a, *b]                 # a aur b ko ek nayi list mein concatenate karo
\`\`\`

## Ek list ko iterate karte hue mutate mat karo

\`\`\`python
# GALAT -- list loop ke neeche sikudti hai to elements skip hote hain
for x in nums:
    if x < 0:
        nums.remove(x)

# SAHI -- ek nayi list banao
nums = [x for x in nums if x >= 0]

# SAHI -- ek copy iterate karo, original mutate karo
for x in nums[:]:
    if x < 0:
        nums.remove(x)
\`\`\``,

    examples: [
      {
        title: 'Broken: [[]] * 3 and sort/sorted confusion',
        titleHi: 'Toota: [[]] * 3 aur sort/sorted confusion',
        code: `rows = [[0]] * 3
rows[0][0] = 99
print("rows:", rows)

data = [5, 2, 8, 1]
result = data.sort()
print("result:", result)
print("data:", data)

more = [3, 1, 2]
sorted(more)
print("more:", more)`,
        output: `rows: [[99], [99], [99]]
result: None
data: [1, 2, 5, 8]
more: [3, 1, 2]`,
        explain: '`[[0]] * 3` stores three references to one inner list, so `rows[0][0] = 99` shows in all three. `data.sort()` reorders `data` in place and returns `None`, so `result` is `None`. `sorted(more)` returns a new sorted list that is never assigned, so `more` is unchanged.',
        explainHi: '`[[0]] * 3` ek inner list ke teen references store karta hai, isliye `rows[0][0] = 99` teenon mein dikhta hai. `data.sort()` `data` ko jagah par reorder karta hai aur `None` lautaata hai, isliye `result` `None` hai. `sorted(more)` ek nayi sorted list lautaata hai jo kabhi assign nahi hoti, isliye `more` abadalta hai.',
      },
      {
        title: 'Fixed: comprehension rows, right sort call, slicing',
        titleHi: 'Theek: comprehension rows, sahi sort call, slicing',
        code: `rows = [[0] for _ in range(3)]
rows[0][0] = 99
print("rows:", rows)

data = [5, 2, 8, 1]
data.sort()
print("data:", data)

more = [3, 1, 2]
ordered = sorted(more, reverse=True)
print("ordered:", ordered, "| more:", more)

xs = [10, 20, 30, 40, 50]
print(xs[1:4], xs[::-1], xs[::2])
xs[1:4] = ["a", "b"]
print(xs)`,
        output: `rows: [[99], [0], [0]]
data: [1, 2, 5, 8]
ordered: [3, 2, 1] | more: [3, 1, 2]
[20, 30, 40] [50, 40, 30, 20, 10] [10, 30, 50]
[10, 'a', 'b', 50]`,
        explain: '`[[0] for _ in range(3)]` makes three independent lists. `data.sort()` then use `data`. `sorted(more, reverse=True)` returns a new list; `more` is untouched. Slice assignment `xs[1:4] = ["a", "b"]` replaces three items with two.',
        explainHi: '`[[0] for _ in range(3)]` teen independent lists banaata hai. `data.sort()` phir `data` istemal karo. `sorted(more, reverse=True)` ek nayi list lautaata hai; `more` achhoota hai. Slice assignment `xs[1:4] = ["a", "b"]` teen items ko do se replace karta hai.',
      },
      {
        title: 'Shallow copy vs deep copy, and sorting by a key',
        titleHi: 'Shallow copy vs deep copy, aur ek key se sorting',
        code: `import copy

matrix = [[1, 2], [3, 4]]
shallow = matrix[:]
deep = copy.deepcopy(matrix)

shallow[0].append(9)          # mutates the shared inner list
print("matrix:", matrix)       # inner list changed
print("deep:", deep)           # deep is independent

people = [("Al", 30, "NY"), ("Bo", 25, "LA"), ("Cy", 30, "SF")]
by_age_then_name = sorted(people, key=lambda p: (-p[1], p[0]))
for p in by_age_then_name:
    print(p)`,
        output: `matrix: [[1, 2, 9], [3, 4]]
deep: [[1, 2], [3, 4]]
('Al', 30, 'NY')
('Cy', 30, 'SF')
('Bo', 25, 'LA')
`,
        explain: 'A shallow copy (`matrix[:]`) copies the outer list but the inner lists are shared, so `shallow[0].append(9)` changes `matrix` too. `copy.deepcopy` copies everything. The `key=lambda p: (-p[1], p[0])` sorts by age descending (negation) then name ascending — a tuple key sorts field by field.',
        explainHi: 'Ek shallow copy (`matrix[:]`) outer list copy karti hai par inner lists share hoti hain, isliye `shallow[0].append(9)` `matrix` bhi badalta hai. `copy.deepcopy` sab kuch copy karta hai. `key=lambda p: (-p[1], p[0])` age descending (negation) phir name ascending se sort karta hai — ek tuple key field dar field sort karta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `board = [[0] * 3] * 3   # a 3x3 grid?
board[0][0] = 1
# board is now [[1, 0, 0], [1, 0, 0], [1, 0, 0]]`,
        right: `board = [[0] * 3 for _ in range(3)]
board[0][0] = 1
# board is [[1, 0, 0], [0, 0, 0], [0, 0, 0]]`,
        why: 'The inner `[0] * 3` is fine (integers are immutable, no sharing to worry about). But the outer `[...] * 3` makes three references to that one inner list. Use a comprehension for the outer dimension so each row is a distinct list.',
        whyHi: 'Inner `[0] * 3` theek hai (integers immutable hain, sharing ki chinta nahi). Par outer `[...] * 3` us ek inner list ke teen references banaata hai. Outer dimension ke liye ek comprehension istemal karo taaki har row ek alag list ho.',
      },
      {
        wrong: `queue = [1, 2, 3, 4, 5]
for item in queue:
    if item % 2 == 0:
        queue.remove(item)
# result: [1, 3, 5] here by luck, but [1, 3, 4, 5] on [1,2,4,5]`,
        right: `queue = [item for item in queue if item % 2 != 0]`,
        why: 'Removing from a list while a `for` loop iterates it shifts every later element left, so the loop\'s internal counter skips the element that moved into the vacated slot. Filter with a comprehension into a new list, or iterate `queue[:]` (a copy) and mutate the original.',
        whyHi: 'Ek `for` loop ke iterate karte hue ek list se hataana har baad ke element ko baayen shift karta hai, isliye loop ka internal counter us element ko skip karta hai jo khaali slot mein aaya. Ek comprehension se ek nayi list mein filter karo, ya `queue[:]` (ek copy) iterate karo aur original mutate karo.',
      },
      {
        wrong: `all_items = base_items
all_items.append("extra")
# base_items now also has "extra" -- they are the same list`,
        right: `all_items = base_items[:]      # or list(base_items) or base_items.copy()
all_items.append("extra")`,
        why: '`all_items = base_items` does not copy — it makes a second name for the same list, so mutating one mutates both. This is a frequent bug when a function receives a list argument, appends to it "locally", and the caller\'s list changes. Copy at the boundary if you need independence.',
        whyHi: '`all_items = base_items` copy nahi karta — ye usi list ka doosra naam banaata hai, isliye ek ko mutate karna dono ko mutate karta hai. Ye ek aam bug hai jab ek function ek list argument leta hai, ise "locally" append karta hai, aur caller ki list badal jaati hai. Agar independence chahiye to boundary par copy karo.',
      },
    ],

    realWorld: [
      {
        en: '**Django querysets are list-like but lazy** — `list(queryset)` forces the DB query and gives you a real list. Slicing a queryset (`qs[:10]`) adds a `LIMIT` to the SQL rather than fetching all rows and slicing in Python.',
        hi: '**Django querysets list-jaise par lazy hain** — `list(queryset)` DB query force karta hai aur aapko ek asli list deta hai. Ek queryset ko slice karna (`qs[:10]`) saari rows fetch karke Python mein slice karne ke bajaye SQL mein ek `LIMIT` jodta hai.',
      },
      {
        en: '**The `key=` argument to `sorted`** is everywhere in real code — sorting API results by a field (`sorted(items, key=lambda x: x["created"])`), ordering a report, ranking search hits. A tuple key does multi-level sort in one call.',
        hi: '**`sorted` ka `key=` argument** asli code mein har jagah hai — API results ko ek field se sort karna (`sorted(items, key=lambda x: x["created"])`), ek report order karna, search hits rank karna. Ek tuple key ek call mein multi-level sort karta hai.',
      },
      {
        en: '**The shared-mutable-default bug and the shared-list-copy bug are the same family** — a serializer built with `fields = []`, a helper that returns `self._cache` directly, a view that appends to a class attribute. `ruff` rule B006/B008 and code review catch the first; the second needs a `.copy()` at the return.',
        hi: '**Shared-mutable-default bug aur shared-list-copy bug ek hi family hain** — `fields = []` se bana ek serializer, ek helper jo `self._cache` seedhe lautaata hai, ek view jo ek class attribute mein append karta hai. `ruff` rule B006/B008 aur code review pehla pakadte hain; doosre ko return par ek `.copy()` chahiye.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `[[]] * 3` create, and why is it usually not what you want?',
        qHi: '`[[]] * 3` kya banaata hai, aur ye aam taur par wo kyun nahi hai jo aap chahte ho?',
        a: 'The multiplication operator on a list produces a new list whose contents are the original elements repeated. Crucially, it repeats the element references, not copies of the elements. So the left operand here is a one-element list containing a single empty list object, and multiplying by three gives you a three-element list where all three slots point at that same one empty list. If you then append to what you think of as the first row, the append happens to the shared inner list, and because the other two slots refer to the same object, the new item appears in all three positions. People reach for this when building a grid or a list of buckets and expect three independent empty lists, and they get one list observed through three windows. The distinction only matters when the repeated element is mutable. Writing zero times three or the string x times three is completely fine, because integers and strings are immutable, so sharing a reference is indistinguishable from having copies. The fix for the mutable case is a list comprehension: open-bracket, empty list, for underscore in range of three, close-bracket. The comprehension evaluates its expression fresh on every iteration, so each slot gets its own newly constructed empty list. For a two-dimensional grid you nest it: the inner dimension can safely use multiplication if it holds immutables, but the outer dimension must be a comprehension. The general rule is: list multiplication is safe for immutable elements and dangerous for mutable ones; when in doubt, use a comprehension.',
        aHi: 'Ek list par multiplication operator ek nayi list banaata hai jiske contents original elements dohraaye gaye hain. Mahatvapurna baat, ye element references dohraata hai, elements ki copies nahi. Toh yahaan left operand ek one-element list hai jismein ek akela empty list object hai, aur teen se guna karna aapko ek three-element list deta hai jahaan teenon slots us hi ek empty list par point karte hain. Agar aap phir jise aap pehli row samajhte ho usmein append karte ho, append shared inner list mein hota hai, aur kyunki baaki do slots usi object ko refer karte hain, naya item teenon positions mein dikhta hai. Ye antar sirf tab maayne rakhta hai jab dohraaya gaya element mutable ho. Zero times teen likhna ya string x times teen bilkul theek hai, kyunki integers aur strings immutable hain. Mutable case ke liye fix ek list comprehension hai: open-bracket, empty list, for underscore in range of teen, close-bracket. Comprehension apna expression har iteration par naya evaluate karta hai, isliye har slot ko apni newly constructed empty list milti hai. Ek do-dimensional grid ke liye aap ise nest karte ho: inner dimension surakshit roop se multiplication istemal kar sakta hai agar wo immutables rakhta hai, par outer dimension ek comprehension hona chahiye.',
      },
      {
        q: 'Compare `list.sort()` with `sorted(list)`, and shallow copy with deep copy.',
        qHi: '`list.sort()` ko `sorted(list)` se, aur shallow copy ko deep copy se compare karo.',
        a: 'These are two instances of the same broader pattern in Python\'s standard library: a method that mutates the receiver in place and returns None, versus a function that leaves its argument untouched and returns a new object. The sort method, called as list dot sort, reorders the elements of that exact list object and returns None, so you use it when you own the list and want it reordered, and you keep using the same variable afterward. Assigning its result, writing x equals x dot sort, is a classic bug that leaves x as None. The sorted builtin takes any iterable, produces a brand new list with the elements in order, and does not modify the input at all, so you use it when you need a sorted view but must preserve the original, or when the input is not even a list, such as a set or a dictionary\'s keys. Both accept the same two keyword arguments: key, a function applied to each element to derive the value to sort by, and reverse, a boolean. Both sorts are stable, meaning elements that compare equal retain their original relative order, which is what makes multi-pass sorting and tuple keys work predictably. Copying is the same shape. A shallow copy, made by slicing the whole list, calling the copy method, or passing the list to the list constructor, creates a new outer list but the elements inside it are the same objects as in the original. If those elements are themselves mutable, like nested lists or dictionaries, mutating one through the copy is visible through the original, because they share those inner objects. A deep copy, from copy dot deepcopy, recursively copies every level, producing a structure that is completely independent. Shallow is cheaper and is what you want most of the time; deep is for when you must guarantee that no mutation anywhere in a nested structure can leak.',
        aHi: 'Ye Python ki standard library mein ek vyaapak pattern ke do udaharan hain: ek method jo receiver ko jagah par mutate karta hai aur None lautaata hai, versus ek function jo apne argument ko achhoota chhodta hai aur ek naya object lautaata hai. Sort method, list dot sort ki tarah call kiya, us exact list object ke elements ko reorder karta hai aur None lautaata hai, isliye aap ise tab istemal karte ho jab aap list ke maalik ho aur ise reordered chahte ho. Iska result assign karna, x equals x dot sort likhna, ek classic bug hai jo x ko None chhod deta hai. Sorted builtin koi bhi iterable leta hai, elements ke saath ek bilkul nayi list order mein banaata hai, aur input ko bilkul modify nahi karta, isliye aap ise tab istemal karte ho jab aapko ek sorted view chahiye par original preserve karna hai. Dono wahi do keyword arguments accept karte hain: key aur reverse. Dono sorts stable hain. Copying wahi shape hai. Ek shallow copy ek naya outer list banaati hai par iske andar ke elements original ke wahi objects hain. Agar wo elements khud mutable hain, jaise nested lists, unmein se ek ko copy ke zariye mutate karna original ke zariye dikhta hai. Ek deep copy har level ko recursively copy karti hai.',
      },
    ],

    exercises: [
      {
        task: 'In the REPL: `g = [[]] * 3`, then `g[0].append(1)`, then print `g`. Now `g = [[] for _ in range(3)]`, `g[0].append(1)`, print `g`. Explain the difference in one sentence.',
        taskHi: 'REPL mein: `g = [[]] * 3`, phir `g[0].append(1)`, phir `g` print karo. Ab `g = [[] for _ in range(3)]`, `g[0].append(1)`, `g` print karo. Antar ek vaakya mein samjhaao.',
        hint: '`[[]] * 3` -> `[[1], [1], [1]]` (one shared list). `[[] for _ in range(3)]` -> `[[1], [], []]` (three independent lists, comprehension runs `[]` fresh each time).',
        hintHi: '`[[]] * 3` -> `[[1], [1], [1]]` (ek shared list). `[[] for _ in range(3)]` -> `[[1], [], []]` (teen independent lists, comprehension har baar `[]` naya chalaata hai).',
      },
      {
        task: 'Write `dedup_keep_order(xs)` that returns a new list with duplicates removed but the first occurrence of each item kept in place. Then write `rotate(xs, k)` that returns `xs` rotated left by `k` using slicing (`xs[k:] + xs[:k]`). Test both.',
        taskHi: '`dedup_keep_order(xs)` likho jo ek nayi list lautaata hai jismein duplicates hataaye gaye par har item ka pehla occurrence jagah par rakha. Phir `rotate(xs, k)` likho jo `xs` ko `k` se left rotate karke slicing se lautaata hai (`xs[k:] + xs[:k]`). Dono test karo.',
        hint: 'dedup: `seen = set(); out = []; for x in xs: if x not in seen: seen.add(x); out.append(x)`. rotate: `k %= len(xs)` first to handle k larger than the list, then `return xs[k:] + xs[:k]`.',
        hintHi: 'dedup: `seen = set(); out = []; for x in xs: if x not in seen: seen.add(x); out.append(x)`. rotate: pehle `k %= len(xs)` k ke list se bade hone ko handle karne ko, phir `return xs[k:] + xs[:k]`.',
      },
      {
        task: 'Given `records = [("Al", 30), ("Bo", 25), ("Cy", 30), ("Di", 25)]`, produce a list sorted by age ascending, and within the same age by name descending, in ONE `sorted()` call. Then verify the sort is stable by checking the relative order of the two age-25 entries.',
        taskHi: '`records = [("Al", 30), ("Bo", 25), ("Cy", 30), ("Di", 25)]` diya, ek list banao jo age ascending se sorted ho, aur usi age ke andar name descending se, EK `sorted()` call mein. Phir stable sort verify karo do age-25 entries ke relative order check karke.',
        hint: '`sorted(records, key=lambda r: (r[1], [-ord(c) for c in r[0]]))` is awkward; simpler is two passes: `sorted(sorted(records, key=lambda r: r[0], reverse=True), key=lambda r: r[1])` — sort by name desc first, then a stable sort by age keeps that order within ties.',
        hintHi: '`sorted` mein ek tuple key jismein name ko reverse karna awkward hai; saral do passes hai: `sorted(sorted(records, key=lambda r: r[0], reverse=True), key=lambda r: r[1])` — pehle name desc se sort, phir age se ek stable sort ties ke andar wo order rakhta hai.',
      },
    ],

    keyTakeaways: [
      '`[x] * n` repeats the SAME reference n times. Safe for immutables (`[0] * 3`), a bug for mutables (`[[]] * 3` = one shared list). Use `[[] for _ in range(n)]`.',
      '`.sort()` / `.reverse()` mutate in place and return `None`. `sorted()` / `reversed()` return a new sequence. `y = x.sort()` sets `y` to `None`.',
      'Slicing: `xs[start:stop:step]`, `stop` exclusive, negative indexes from the end, `xs[::-1]` reverses, `xs[:]` shallow-copies. Slices never raise for out-of-range bounds.',
      'Slice assignment (`xs[1:4] = [...]`) replaces that span with any number of items; `xs[i:i] = [...]` inserts.',
      '`b = a` shares the list; `b = a[:]` / `a.copy()` / `list(a)` shallow-copies (nested objects still shared); `copy.deepcopy(a)` fully copies.',
      '`sorted(x, key=fn, reverse=True)` — `key` derives the sort value, a tuple key does multi-level sort, the sort is STABLE (equal keys keep order).',
      'Never mutate a list while iterating it — filter into a new list with a comprehension, or iterate `xs[:]` and mutate the original.',
      '`[*a, *b]` concatenates into a new list; `xs += other` and `xs.extend(other)` mutate in place; `xs + other` builds a new list.',
    ],
    keyTakeawaysHi: [
      '`[x] * n` USI reference ko n baar dohraata hai. Immutables ke liye surakshit (`[0] * 3`), mutables ke liye ek bug (`[[]] * 3` = ek shared list). `[[] for _ in range(n)]` istemal karo.',
      '`.sort()` / `.reverse()` jagah par mutate karte hain aur `None` lautaate hain. `sorted()` / `reversed()` ek nayi sequence lautaate hain. `y = x.sort()` `y` ko `None` set karta hai.',
      'Slicing: `xs[start:stop:step]`, `stop` exclusive, negative indexes end se, `xs[::-1]` reverse karta hai, `xs[:]` shallow-copy karta hai. Slices out-of-range bounds ke liye kabhi error nahi dete.',
      'Slice assignment (`xs[1:4] = [...]`) us span ko kitne bhi items se replace karta hai; `xs[i:i] = [...]` insert karta hai.',
      '`b = a` list share karta hai; `b = a[:]` / `a.copy()` / `list(a)` shallow-copy karta hai (nested objects abhi bhi share); `copy.deepcopy(a)` poori tarah copy karta hai.',
      '`sorted(x, key=fn, reverse=True)` — `key` sort value nikaalta hai, ek tuple key multi-level sort karta hai, sort STABLE hai (barabar keys order rakhti hain).',
      'Ek list ko iterate karte hue kabhi mutate mat karo — ek comprehension se ek nayi list mein filter karo, ya `xs[:]` iterate karo aur original mutate karo.',
      '`[*a, *b]` ek nayi list mein concatenate karta hai; `xs += other` aur `xs.extend(other)` jagah par mutate karte hain; `xs + other` ek nayi list banaata hai.',
    ],
  },

  {
    slug: 'py-tuples-and-unpacking',
    title: 'Tuples and Unpacking: (x,) Is a Tuple, (x) Is Not',
    titleHi: 'Tuples Aur Unpacking: (x,) Ek Tuple Hai, (x) Nahi',
    description: 'Writing `point = (3)` to make a one-element tuple and getting the integer `3` instead, because in Python the parentheses do not make a tuple — the comma does. And returning several values from a function, then reaching into the result with `result[0]` and `result[1]` instead of unpacking them into named variables the way Python code is written.',
    descriptionHi: 'Ek one-element tuple banane ke liye `point = (3)` likhna aur iske bajaye integer `3` paana, kyunki Python mein parentheses ek tuple nahi banaate — comma banaata hai. Aur ek function se kayi values return karna, phir result mein `result[0]` aur `result[1]` se pahunchna unhe named variables mein unpack karne ke bajaye jaise Python code likha jaata hai.',
    difficulty: 'EASY',
    duration: 20,
    order: 2,

    analogy: {
      en: '**A sealed display case versus a shelf, and the difference a single comma makes.** A tuple is a small sealed display case: you can look at what is inside and count the items, but the lid is glued — you cannot add, remove, or swap anything once it is made. That sealed-ness is exactly why a tuple can be used as a label on a filing cabinet drawer (a dictionary key) while a list cannot: a label that could change its own text would be useless. It is also why a function that hands back "the quotient and the remainder" hands back a sealed case with two compartments rather than two separate deliveries. Now the comma. When you write something in parentheses, the parentheses are just grouping, the way they are in arithmetic — three in parentheses is still just three. What actually builds the sealed case is putting a comma in it. Three-comma is a one-item case. Three-comma-four is a two-item case. The parentheses around it are optional except where they prevent ambiguity. So the beginner\'s "one-element tuple" written as three-in-parens is not a tuple at all; it needs the trailing comma, three-comma, to become one.',
      hi: '**Ek sealed display case versus ek shelf, aur ek akela comma jo antar banaata hai.** Ek tuple ek chhota sealed display case hai: aap dekh sakte ho andar kya hai aur items gin sakte ho, par dhakkan chipka hua hai — ek baar banne ke baad aap kuch jod, hata, ya badal nahi sakte. Wo sealed-ness bilkul wajah hai ki ek tuple ek filing cabinet drawer par ek label (ek dictionary key) ki tarah istemal ho sakta hai jabki ek list nahi: ek label jo apna text badal sakta hai bekaar hoga. Ye bhi wajah hai ki ek function jo "quotient aur remainder" wapas deta hai do alag deliveries ke bajaye do compartments waala ek sealed case wapas deta hai. Ab comma. Jab aap kuch parentheses mein likhte ho, parentheses bas grouping hain, jaise wo arithmetic mein hain — teen parentheses mein abhi bhi bas teen hai. Jo asal mein sealed case banaata hai wo usmein ek comma daalna hai. Teen-comma ek one-item case hai. Iske charon or parentheses optional hain sivaay jahaan wo ambiguity rokte hain.',
    },

    simple: `**Start broken.** \`(3)\` is not a tuple; indexing a returned tuple instead of unpacking:

\`\`\`python
point = (3)
print(type(point))        # <class 'int'>   -- the parens just grouped 3

def min_max(nums):
    return min(nums), max(nums)

result = min_max([4, 1, 7, 2])
lowest = result[0]        # works, but not how Python is written
highest = result[1]
print(lowest, highest)    # 1 7
\`\`\`

Parentheses group; the **comma** makes a tuple. And when a function returns a tuple, you unpack it into names, not index into it.

**The fix: trailing comma for a 1-tuple; unpack multiple return values**

\`\`\`python
point = (3,)              # the comma is what matters -- parens optional
print(type(point))        # <class 'tuple'>
single = 3,               # also a 1-tuple
empty = ()                # the one case where you need the parens

def min_max(nums):
    return min(nums), max(nums)

lowest, highest = min_max([4, 1, 7, 2])   # unpack directly into names
print(lowest, highest)                     # 1 7

a, b = 1, 2
a, b = b, a               # swap -- no temp variable
print(a, b)               # 2 1

first, *middle, last = [10, 20, 30, 40, 50]
print(first, middle, last)   # 10 [20, 30, 40] 50
\`\`\`

\`\`\`
CREATE   ()   (1,)   (1, 2)   1, 2   tuple([1, 2])   tuple("abc")
1-tuple  (1,)  or  1,          -- (1) is just 1
IMMUTABLE  t[0] = 9  -> TypeError. t.append(9) -> AttributeError.
           (but a tuple CAN contain mutable things: ([1,2], 3) -- the list stays mutable)
USE FOR  fixed-size records, multiple return values, dict KEYS, set elements,
         "this should not change" data
UNPACK   a, b = t                       exact count must match
         a, b, *rest = t                * absorbs the middle/end (a list)
         a, (b, c) = (1, (2, 3))         nested
         for name, score in pairs: ...   unpack in a loop
         first, _, third = triple        _ = "I don't need this one"
\`\`\``,

    simpleHi: `**Toote hue se shuru.** \`(3)\` ek tuple nahi hai; ek returned tuple ko unpack karne ke bajaye index karna:

\`\`\`python
point = (3)
print(type(point))        # <class 'int'>   -- parens ne bas 3 group kiya

def min_max(nums):
    return min(nums), max(nums)

result = min_max([4, 1, 7, 2])
lowest = result[0]        # kaam karta hai, par Python aise nahi likha jaata
highest = result[1]
print(lowest, highest)    # 1 7
\`\`\`

Parentheses group karte hain; **comma** ek tuple banaata hai. Aur jab ek function ek tuple lautaata hai, aap ise names mein unpack karte ho, ismein index nahi karte.

**Fix: 1-tuple ke liye trailing comma; multiple return values unpack karo**

\`\`\`python
point = (3,)              # comma jo maayne rakhta hai -- parens optional
print(type(point))        # <class 'tuple'>
single = 3,               # ye bhi ek 1-tuple
empty = ()                # ek case jahaan aapko parens chahiye

def min_max(nums):
    return min(nums), max(nums)

lowest, highest = min_max([4, 1, 7, 2])   # seedhe names mein unpack
print(lowest, highest)                     # 1 7

a, b = 1, 2
a, b = b, a               # swap -- koi temp variable nahi
print(a, b)               # 2 1

first, *middle, last = [10, 20, 30, 40, 50]
print(first, middle, last)   # 10 [20, 30, 40] 50
\`\`\`

\`\`\`
CREATE   ()   (1,)   (1, 2)   1, 2   tuple([1, 2])   tuple("abc")
1-tuple  (1,)  ya  1,          -- (1) bas 1 hai
IMMUTABLE  t[0] = 9  -> TypeError. t.append(9) -> AttributeError.
           (par ek tuple mutable cheezein rakh SAKTA hai: ([1,2], 3) -- list mutable rehti hai)
USE FOR  fixed-size records, multiple return values, dict KEYS, set elements,
         "ye badalna nahi chahiye" data
UNPACK   a, b = t                       exact count match hona chahiye
         a, b, *rest = t                * middle/end sokhta hai (ek list)
         a, (b, c) = (1, (2, 3))         nested
         for name, score in pairs: ...   ek loop mein unpack
         first, _, third = triple        _ = "mujhe ye nahi chahiye"
\`\`\``,

    content: `## Why tuples exist: immutability buys you things

\`\`\`
1. Dict keys and set elements MUST be hashable, and mutable containers are not.
   A tuple of immutables is hashable, so you can do:
       cache = {}
       cache[(user_id, page)] = result      # a compound key
       visited = {(0, 0), (1, 2)}            # a set of coordinates

2. A tuple signals "fixed record" -- (name, age, city) has a known shape.
   A list signals "a variable number of similar things".

3. Multiple return values are a tuple:
       return value, error       # caller: value, error = f()

4. Slightly less memory and slightly faster to build than a list.
\`\`\`

## Unpacking, all the forms

\`\`\`python
a, b, c = [1, 2, 3]             # from any iterable, exact count
a, b = b, a                    # swap
a, *rest = [1, 2, 3, 4]        # a=1, rest=[2,3,4]
*init, last = [1, 2, 3, 4]     # init=[1,2,3], last=4
a, *mid, z = [1, 2, 3, 4, 5]   # a=1, mid=[2,3,4], z=5
(a, b), c = (1, 2), 3          # nested
a, b, *_ = big_tuple           # a, b, ignore the rest
for i, (name, score) in enumerate(rows):   # unpack inside a for
    ...
first, second, *others = "python"   # works on strings: 'p', 'y', ['t','h','o','n']
\`\`\`

\`\`\`python
# a wrong count raises:
a, b = [1, 2, 3]          # ValueError: too many values to unpack (expected 2)
a, b, c = [1, 2]          # ValueError: not enough values to unpack (expected 3, got 2)
# a starred target absorbs any surplus (including zero):
a, *rest = [1]           # a=1, rest=[]
\`\`\`

## Tuples in function signatures and calls

\`\`\`python
def f(*args):            # args is a TUPLE of the extra positional arguments
    print(args)          # (1, 2, 3)
f(1, 2, 3)

numbers = [4, 5, 6]
print(*numbers)          # 4 5 6   -- unpack a list into separate arguments
first, *others = numbers # * on the left = collect; * in a call = spread
point = (1, 2)
distance(*point)         # same as distance(1, 2)
\`\`\`

## \`namedtuple\` and beyond (preview — full in Module 4)

\`\`\`python
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
p.x, p.y          # 3 4   -- named access, still a real tuple
p[0]              # 3     -- indexing still works
x, y = p          # unpacking still works

# for anything with behaviour, use a @dataclass (Module 4).
\`\`\`

## Tuple vs list: the decision

\`\`\`
Use a TUPLE when:
  - the collection has a fixed size and each position means something
    (a coordinate, an RGB colour, a database row, a (key, value) pair)
  - you need it as a dict key or a set element (must be immutable)
  - you are returning multiple values from a function
  - you want to signal "callers must not modify this"

Use a LIST when:
  - the collection grows or shrinks
  - all elements are the same kind of thing and order/count varies
  - you need to sort, append, or mutate it
\`\`\``,

    contentHi: `## Tuples kyun maujood hain: immutability aapko cheezein khareedti hai

\`\`\`
1. Dict keys aur set elements HASHABLE hone CHAHIYE, aur mutable containers nahi hain.
   Immutables ka ek tuple hashable hai, isliye aap kar sakte ho:
       cache = {}
       cache[(user_id, page)] = result      # ek compound key
       visited = {(0, 0), (1, 2)}            # coordinates ka ek set

2. Ek tuple "fixed record" signal karta hai -- (name, age, city) ka ek known shape hai.
   Ek list "similar cheezon ki ek variable tadaad" signal karta hai.

3. Multiple return values ek tuple hain:
       return value, error       # caller: value, error = f()

4. Ek list se thoda kam memory aur banane mein thoda tez.
\`\`\`

## Unpacking, sab roop

\`\`\`python
a, b, c = [1, 2, 3]             # kisi bhi iterable se, exact count
a, b = b, a                    # swap
a, *rest = [1, 2, 3, 4]        # a=1, rest=[2,3,4]
*init, last = [1, 2, 3, 4]     # init=[1,2,3], last=4
a, *mid, z = [1, 2, 3, 4, 5]   # a=1, mid=[2,3,4], z=5
(a, b), c = (1, 2), 3          # nested
a, b, *_ = big_tuple           # a, b, baaki ignore
for i, (name, score) in enumerate(rows):   # ek for ke andar unpack
    ...
first, second, *others = "python"   # strings par kaam karta hai: 'p', 'y', ['t','h','o','n']
\`\`\`

\`\`\`python
# ek galat count error deta hai:
a, b = [1, 2, 3]          # ValueError: too many values to unpack (expected 2)
a, b, c = [1, 2]          # ValueError: not enough values to unpack (expected 3, got 2)
# ek starred target koi bhi surplus sokhta hai (zero sameet):
a, *rest = [1]           # a=1, rest=[]
\`\`\`

## Function signatures aur calls mein tuples

\`\`\`python
def f(*args):            # args extra positional arguments ka ek TUPLE hai
    print(args)          # (1, 2, 3)
f(1, 2, 3)

numbers = [4, 5, 6]
print(*numbers)          # 4 5 6   -- ek list ko alag arguments mein unpack karo
first, *others = numbers # left par * = collect; ek call mein * = spread
point = (1, 2)
distance(*point)         # distance(1, 2) jaisa
\`\`\`

## \`namedtuple\` aur aage (preview — poora Module 4 mein)

\`\`\`python
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
p.x, p.y          # 3 4   -- named access, abhi bhi ek asli tuple
p[0]              # 3     -- indexing abhi bhi kaam karta hai
x, y = p          # unpacking abhi bhi kaam karta hai

# behaviour waali kisi bhi cheez ke liye, ek @dataclass istemal karo (Module 4).
\`\`\`

## Tuple vs list: faisla

\`\`\`
TUPLE istemal karo jab:
  - collection ka ek fixed size hai aur har position kuch matlab rakhti hai
    (ek coordinate, ek RGB colour, ek database row, ek (key, value) pair)
  - aapko ise ek dict key ya ek set element ki tarah chahiye (immutable hona chahiye)
  - aap ek function se multiple values return kar rahe ho
  - aap signal karna chahte ho "callers ko ise modify nahi karna"

LIST istemal karo jab:
  - collection badhta ya sikudta hai
  - sab elements ek hi kism ki cheez hain aur order/count badalta hai
  - aapko ise sort, append, ya mutate karna hai
\`\`\``,

    examples: [
      {
        title: 'Broken: (x) is not a tuple; indexing a returned pair',
        titleHi: 'Toota: (x) ek tuple nahi; ek returned pair index karna',
        code: `size = (5)
colours = ("red")
print(type(size), type(colours))

def split_name(full):
    parts = full.split()
    return parts[0], parts[-1]

r = split_name("Ada Lovelace")
first = r[0]
last = r[1]
print(first, last)`,
        output: `<class 'int'> <class 'str'>
Ada Lovelace`,
        explain: '`(5)` is just `5` in parentheses; `("red")` is just the string. Neither is a tuple — no comma. The `split_name` function does return a real tuple (the `return a, b` form), but pulling values out with `r[0]`/`r[1]` is verbose where `first, last = split_name(...)` reads far better.',
        explainHi: '`(5)` bas `5` parentheses mein hai; `("red")` bas string hai. Koi tuple nahi — koi comma nahi. `split_name` function ek asli tuple lautaata hai (`return a, b` form), par `r[0]`/`r[1]` se values nikaalna verbose hai jahaan `first, last = split_name(...)` kaafi behtar padhta hai.',
      },
      {
        title: 'Fixed: trailing comma, unpacking, star, swap',
        titleHi: 'Theek: trailing comma, unpacking, star, swap',
        code: `size = (5,)
print(type(size), size)

def split_name(full):
    parts = full.split()
    return parts[0], parts[-1]

first, last = split_name("Ada Lovelace")
print(f"{last}, {first}")

scores = [88, 91, 77, 95, 82]
top, *rest = sorted(scores, reverse=True)
print("winner:", top, "| others:", rest)

a, b = 10, 20
a, b = b, a
print(a, b)

for rank, (name, pts) in enumerate([("Al", 9), ("Bo", 7)], start=1):
    print(rank, name, pts)`,
        output: `<class 'tuple'> (5,)
Lovelace, Ada
winner: 95 | others: [91, 88, 82, 77]
20 10
1 Al 9
2 Bo 7`,
        explain: '`(5,)` — the comma makes the tuple. `first, last = split_name(...)` unpacks the returned pair. `top, *rest = ...` binds the first element and collects the remainder into a list. `a, b = b, a` swaps via a temporary tuple. `enumerate` + nested unpacking pulls apart `(name, pts)` inside the loop.',
        explainHi: '`(5,)` — comma tuple banaata hai. `first, last = split_name(...)` returned pair unpack karta hai. `top, *rest = ...` pehla element bind karta hai aur baaki ek list mein collect karta hai. `a, b = b, a` ek temporary tuple ke zariye swap karta hai. `enumerate` + nested unpacking loop ke andar `(name, pts)` alag karta hai.',
      },
      {
        title: 'Tuples as dict keys and set elements',
        titleHi: 'Dict keys aur set elements ki tarah tuples',
        code: `# a grid of visited cells
visited = set()
visited.add((0, 0))
visited.add((1, 2))
visited.add((0, 0))          # already there -- no effect
print(len(visited), (1, 2) in visited)

# a compound cache key
prices = {}
prices[("AAPL", "2024-01-02")] = 185.64
prices[("AAPL", "2024-01-03")] = 184.25
print(prices[("AAPL", "2024-01-02")])

# a list is NOT hashable -- this would fail:
try:
    visited.add([3, 4])
except TypeError as e:
    print("error:", "unhashable" in str(e))`,
        output: `2 True
185.64
error: True`,
        explain: 'A tuple of immutable values is hashable, so it can be a set element or a dict key — this is how you track visited coordinates or cache a result keyed by several parameters. A list is mutable and therefore unhashable; trying to add one to a set raises `TypeError: unhashable type: \'list\'`.',
        explainHi: 'Immutable values ka ek tuple hashable hai, isliye ye ek set element ya ek dict key ho sakta hai — aise aap visited coordinates track karte ho ya kayi parameters se keyed ek result cache karte ho. Ek list mutable hai isliye unhashable; ek ko ek set mein add karne ki koshish `TypeError: unhashable type: \'list\'` deti hai.',
      },
    ],

    mistakes: [
      {
        wrong: `singleton = (item)          # meant a 1-element tuple
for x in singleton:          # iterating... a string char by char, or crashing on an int
    process(x)`,
        right: `singleton = (item,)         # the trailing comma makes it a tuple`,
        why: '`(item)` is just `item` — the parentheses are grouping, not tuple syntax. If `item` is a string you then iterate its characters; if it is an int you get "TypeError: int object is not iterable". A 1-element tuple needs the trailing comma: `(item,)` or just `item,`.',
        whyHi: '`(item)` bas `item` hai — parentheses grouping hain, tuple syntax nahi. Agar `item` ek string hai to aap iske characters iterate karte ho; agar ek int hai to "TypeError: int object is not iterable". Ek 1-element tuple ko trailing comma chahiye: `(item,)` ya bas `item,`.',
      },
      {
        wrong: `config = ("localhost", 5432)
config[1] = 5433            # change the port`,
        right: `config = ("localhost", 5433)   # rebuild
# or use a list if it genuinely needs to change:  config = ["localhost", 5432]`,
        why: 'Tuples are immutable — `config[1] = 5433` raises "TypeError: object does not support item assignment". If the value should change, either build a new tuple or use a list. If it should NOT change (a config record, a coordinate), the tuple\'s immutability is the point.',
        whyHi: 'Tuples immutable hain — `config[1] = 5433` "TypeError: object does not support item assignment" deta hai. Agar value badalni chahiye, ya ek naya tuple banao ya ek list istemal karo. Agar ise badalna NAHI chahiye (ek config record, ek coordinate), tuple ki immutability hi point hai.',
      },
      {
        wrong: `a, b = get_values()         # get_values() returns 3 things
# ValueError: too many values to unpack (expected 2)`,
        right: `a, b, *_ = get_values()     # take the first two, ignore the rest
# or:  a, b, c = get_values()   if you want all three`,
        why: 'Plain unpacking requires the left side count to match exactly. If a function\'s return shape changes (a third value added), every `a, b = f()` call breaks with a ValueError. Use `a, b, *rest` (or `*_`) to tolerate extra values, or update the call.',
        whyHi: 'Plain unpacking ko left side count exactly match karna chahiye. Agar ek function ka return shape badalta hai (ek teesri value jodi), har `a, b = f()` call ek ValueError se tootta hai. Extra values sehne ke liye `a, b, *rest` (ya `*_`) istemal karo, ya call update karo.',
      },
    ],

    realWorld: [
      {
        en: '**Django `get_or_create` returns `(obj, created)`** — you always write `obj, created = Model.objects.get_or_create(...)`. Same for `update_or_create`. Indexing the result instead of unpacking it is a code smell reviewers flag.',
        hi: '**Django `get_or_create` `(obj, created)` lautaata hai** — aap hamesha `obj, created = Model.objects.get_or_create(...)` likhte ho. `update_or_create` ke liye bhi. Result ko unpack karne ke bajaye index karna ek code smell hai jise reviewers flag karte hain.',
      },
      {
        en: '**`choices` in Django models and DRF are lists of 2-tuples** — `STATUS_CHOICES = [("draft", "Draft"), ("published", "Published")]`. Iterating them with `for value, label in STATUS_CHOICES` is the standard pattern.',
        hi: '**Django models aur DRF mein `choices` 2-tuples ki lists hain** — `STATUS_CHOICES = [("draft", "Draft"), ("published", "Published")]`. Unhe `for value, label in STATUS_CHOICES` se iterate karna standard pattern hai.',
      },
      {
        en: '**A compound cache key or a set of seen (user, resource) pairs** uses tuples — `if (request.user.id, obj.id) in already_notified:`. Coordinates in grid/graph problems (`visited.add((r, c))`) are the same.',
        hi: '**Ek compound cache key ya seen (user, resource) pairs ka ek set** tuples istemal karta hai — `if (request.user.id, obj.id) in already_notified:`. Grid/graph problems mein coordinates (`visited.add((r, c))`) wahi hain.',
      },
    ],

    interviewQA: [
      {
        q: 'What makes a value a tuple in Python, and why can a tuple be a dictionary key when a list cannot?',
        qHi: 'Python mein ek value ko tuple kya banaata hai, aur ek tuple ek dictionary key kyun ho sakta hai jab ek list nahi ho sakti?',
        a: 'The thing that creates a tuple is the comma, not the parentheses. When you write an expression inside parentheses, the parentheses only group, exactly as they do in arithmetic, so three in parentheses evaluates to the integer three. It becomes a tuple the moment there is a comma: three-comma is a one-element tuple, three-comma-four is a two-element tuple. The parentheses are usually optional and are written for readability or to resolve ambiguity, for example around a tuple passed as a single function argument. The one case that genuinely needs parentheses is the empty tuple, written as an empty pair of parens, because there is no comma to write. As for dictionary keys: a dictionary is a hash table, so every key must be hashable, meaning it can produce a stable integer hash value that does not change over the key\'s lifetime, and it must support equality comparison consistently with that hash. Immutable built-in types like integers, strings, and tuples of immutables satisfy this. A list cannot, because it is mutable: if a list were allowed as a key and you then appended to it, its contents and therefore its logical hash would change, and the dictionary would look for it in the wrong bucket and effectively lose the entry. To prevent that class of silent corruption, lists simply do not implement hashing, and attempting to use one as a key or a set element raises a TypeError about an unhashable type. A tuple is hashable only if everything inside it is also hashable, so a tuple containing a list is itself unhashable. This is why coordinate pairs, compound cache keys, and sets of seen items are always tuples, never lists.',
        aHi: 'Jo cheez ek tuple banaati hai wo comma hai, parentheses nahi. Jab aap ek expression parentheses ke andar likhte ho, parentheses sirf group karte hain, bilkul jaise wo arithmetic mein karte hain, isliye teen parentheses mein integer teen evaluate hota hai. Ye ek tuple us pal ban jaata hai jab ek comma hota hai: teen-comma ek one-element tuple hai, teen-comma-chaar ek two-element tuple hai. Parentheses aam taur par optional hain. Ek case jise sachmuch parentheses chahiye wo empty tuple hai. Dictionary keys ke baare mein: ek dictionary ek hash table hai, isliye har key hashable honi chahiye, matlab wo ek stable integer hash value bana sakti hai jo key ke jeevan mein nahi badalti. Integers, strings, aur immutables ke tuples jaise immutable built-in types ise poora karte hain. Ek list nahi kar sakti, kyunki wo mutable hai: agar ek list ko ek key ki tarah allow kiya jaata aur aap phir usmein append karte, iske contents aur isliye iska logical hash badal jaata, aur dictionary use galat bucket mein dhoondhta. Us tarah ke silent corruption ko rokne ke liye, lists bas hashing implement nahi karti. Ek tuple hashable hai sirf agar iske andar sab kuch bhi hashable hai.',
      },
      {
        q: 'Explain star unpacking (`a, *rest = ...`) and how `*` on the left of `=` differs from `*` in a function call.',
        qHi: 'Star unpacking (`a, *rest = ...`) samjhaao aur `=` ke left par `*` ek function call mein `*` se kaise alag hai.',
        a: 'Star unpacking is a way to assign from an iterable when you want to name some of the elements individually and gather the rest into a list. On the left-hand side of an assignment you can mark exactly one target with a star, and that target absorbs however many elements are left over after the plain targets are satisfied, always as a list, even if that list ends up empty or has a single element. So a-comma-star-rest applied to a five-element list binds a to the first element and rest to a three-element list of the remaining ones. The star can be in the middle: first-comma-star-middle-comma-last takes the ends and puts everything between them in middle. The plain targets are matched greedily from both ends and the star gets whatever is in the gap. If there are fewer elements than plain targets, you get a ValueError; if there are exactly enough, the starred target is an empty list. Now the two uses of star are actually mirror images of each other. On the left of an assignment, or as a parameter in a function definition written as star-args, the star collects multiple values into one sequence. In a function call, or inside a list or tuple display, the star does the opposite: it spreads one iterable out into multiple separate items. So if you have a list of three numbers and call a function with star-numbers, the function receives three separate positional arguments, not one list. And star-a-comma-star-b inside square brackets builds a new list that is the concatenation of a and b. The double star is the same idea for dictionaries and keyword arguments: it collects into or spreads out of a dict. The mental shorthand is: star on the receiving side gathers, star on the giving side scatters.',
        aHi: 'Star unpacking ek iterable se assign karne ka ek tarika hai jab aap kuch elements ko alag-alag naam dena chahte ho aur baaki ko ek list mein ikattha karna. Ek assignment ke left-hand side par aap bilkul ek target ko ek star se mark kar sakte ho, aur wo target jitne bhi elements plain targets ke poore hone ke baad bache absorb karta hai, hamesha ek list ki tarah, chahe wo list empty ho ya ek akela element ho. Toh a-comma-star-rest ek five-element list par lagaaya a ko pehle element se bind karta hai aur rest ko baaki teen ki ek list se. Star beech mein ho sakta hai. Ab star ke do istemal asal mein ek doosre ki darpan chhaviyaan hain. Ek assignment ke left par, ya ek function definition mein star-args ki tarah ek parameter ki tarah, star kayi values ko ek sequence mein collect karta hai. Ek function call mein, ya ek list ya tuple display ke andar, star ulta karta hai: ye ek iterable ko kayi alag items mein failaata hai. Toh agar aapke paas teen numbers ki ek list hai aur aap ek function ko star-numbers se call karte ho, function ko teen alag positional arguments milte hain. Double star dictionaries aur keyword arguments ke liye wahi idea hai.',
      },
    ],

    exercises: [
      {
        task: 'In the REPL: `type((1))`, `type((1,))`, `type(())`, `type((1, 2))`, `type(1, 2)` (predict the last one errors — why?). Then build a 1-tuple two ways and a 2-tuple without parentheses.',
        taskHi: 'REPL mein: `type((1))`, `type((1,))`, `type(())`, `type((1, 2))`, `type(1, 2)` (anumaan lagao aakhri error deta hai — kyun?). Phir ek 1-tuple do tarikon se banao aur ek 2-tuple bina parentheses.',
        hint: '`type((1))` is `int`. `type(1, 2)` errors because `type` with two arguments has a different meaning (it introspects a type) and here it gets the wrong argument types. `x = 1,` and `x = (1,)` are both 1-tuples; `x = 1, 2` is a 2-tuple.',
        hintHi: '`type((1))` `int` hai. `type(1, 2)` error deta hai kyunki do arguments waala `type` ka ek alag matlab hai. `x = 1,` aur `x = (1,)` dono 1-tuples hain; `x = 1, 2` ek 2-tuple hai.',
      },
      {
        task: 'Write `partition(xs, predicate)` that returns `(matches, non_matches)` as a tuple of two lists. Call it as `evens, odds = partition(range(10), lambda n: n % 2 == 0)` and print both.',
        taskHi: '`partition(xs, predicate)` likho jo `(matches, non_matches)` ko do lists ke ek tuple ki tarah lautaata hai. Ise `evens, odds = partition(range(10), lambda n: n % 2 == 0)` ki tarah call karo aur dono print karo.',
        hint: '`matches, non_matches = [], []`, loop and `.append` to the right one, then `return matches, non_matches`. The caller unpacks the returned 2-tuple into `evens, odds`.',
        hintHi: '`matches, non_matches = [], []`, loop karo aur sahi mein `.append` karo, phir `return matches, non_matches`. Caller returned 2-tuple ko `evens, odds` mein unpack karta hai.',
      },
      {
        task: 'Build a dict `counts` that maps each `(word_length, first_letter)` tuple to how many words in a list have that shape. Use `counts[key] = counts.get(key, 0) + 1`. Test on `["apple", "ant", "bat", "bee", "cat"]` and print the dict.',
        taskHi: 'Ek dict `counts` banao jo har `(word_length, first_letter)` tuple ko map kare ki ek list mein kitne words ka wo shape hai. `counts[key] = counts.get(key, 0) + 1` istemal karo. `["apple", "ant", "bat", "bee", "cat"]` par test karo aur dict print karo.',
        hint: '`for w in words: key = (len(w), w[0]); counts[key] = counts.get(key, 0) + 1`. The tuple `(len(w), w[0])` is hashable so it works as a dict key. `("ant", "bat", "cat")` all map to `(3, ...)` with different first letters.',
        hintHi: '`for w in words: key = (len(w), w[0]); counts[key] = counts.get(key, 0) + 1`. Tuple `(len(w), w[0])` hashable hai isliye ye ek dict key ki tarah kaam karta hai.',
      },
    ],

    keyTakeaways: [
      'The COMMA makes a tuple, not the parentheses. `(3)` is `3`; `(3,)` and `3,` are 1-tuples. `()` is the empty tuple (the one case that needs parens).',
      'Tuples are immutable: `t[0] = x` and `t.append(x)` both raise. (But a tuple can hold mutable objects — `([1,2], 3)` — and those stay mutable.)',
      'Use a tuple for fixed-size records, multiple return values, dict keys, and set elements. Use a list when the collection grows/shrinks or you need to sort/mutate.',
      'A tuple of immutables is hashable, so it works as a dict key or set element. A list is unhashable — `d[[1,2]]` and `s.add([1,2])` raise `TypeError`.',
      'Unpack instead of indexing: `lo, hi = min_max(xs)`, `for name, score in rows:`, `a, b = b, a` (swap).',
      'Star unpacking on the left GATHERS into a list: `first, *rest = xs`, `*init, last = xs`, `a, *mid, z = xs`. A wrong plain count raises `ValueError`; a star absorbs any surplus (including none).',
      '`*` on the receiving side gathers (`def f(*args)`, `a, *rest = ...`); `*` on the giving side scatters (`f(*args)`, `[*a, *b]`). `**` is the same for dicts/kwargs.',
      'For records with behaviour, prefer a `@dataclass` (Module 4) over a bare tuple; `namedtuple` gives named fields while staying a real tuple.',
    ],
    keyTakeawaysHi: [
      'COMMA ek tuple banaata hai, parentheses nahi. `(3)` `3` hai; `(3,)` aur `3,` 1-tuples hain. `()` empty tuple hai (ek case jise parens chahiye).',
      'Tuples immutable hain: `t[0] = x` aur `t.append(x)` dono error dete hain. (Par ek tuple mutable objects rakh sakta hai — `([1,2], 3)` — aur wo mutable rehte hain.)',
      'Ek tuple fixed-size records, multiple return values, dict keys, aur set elements ke liye istemal karo. Ek list jab collection badhta/sikudta hai ya aapko sort/mutate karna hai.',
      'Immutables ka ek tuple hashable hai, isliye ye ek dict key ya set element ki tarah kaam karta hai. Ek list unhashable hai — `d[[1,2]]` aur `s.add([1,2])` `TypeError` dete hain.',
      'Index karne ke bajaye unpack karo: `lo, hi = min_max(xs)`, `for name, score in rows:`, `a, b = b, a` (swap).',
      'Left par star unpacking ek list mein IKATTHA karta hai: `first, *rest = xs`, `*init, last = xs`, `a, *mid, z = xs`. Ek galat plain count `ValueError` deta hai; ek star koi bhi surplus sokhta hai.',
      'Receiving side par `*` ikattha karta hai (`def f(*args)`, `a, *rest = ...`); giving side par `*` failaata hai (`f(*args)`, `[*a, *b]`). `**` dicts/kwargs ke liye wahi hai.',
      'Behaviour waale records ke liye, ek nange tuple par ek `@dataclass` (Module 4) prefer karo; `namedtuple` named fields deta hai jabki ek asli tuple rehta hai.',
    ],
  },

  {
    slug: 'py-dicts-get-setdefault-and-order',
    title: 'Dicts: [] vs .get, KeyError, Insertion Order, and Merging',
    titleHi: 'Dicts: [] vs .get, KeyError, Insertion Order, Aur Merging',
    description: 'Reading a value out of a dict with `config["timeout"]` and having the whole request crash with a `KeyError` the day a config file omits that key. Square brackets on a dict raise if the key is missing; `.get()` returns `None` (or a default you supply) instead. And merging two dicts by mutating one of them in place, when you wanted a new dict and both originals untouched.',
    descriptionHi: 'Ek dict se ek value `config["timeout"]` se padhna aur poori request ka ek `KeyError` se crash hona jis din ek config file wo key chhod deti hai. Ek dict par square brackets error dete hain agar key missing hai; `.get()` iske bajaye `None` (ya ek default jo aap dete ho) lautaata hai. Aur do dicts ko ek ko jagah par mutate karke merge karna, jab aap ek naya dict aur dono originals achhoote chahte the.',
    difficulty: 'EASY',
    duration: 22,
    order: 3,

    analogy: {
      en: '**Asking a receptionist for someone by name, and the difference between "they are not here" and slamming the door.** With square-bracket access, asking for a name that is not on the list is treated as a fatal error: the receptionist stops everything and refuses to continue. With `.get`, asking for an absent name gets you a calm "no one by that name" — you can ask, and handle the absence yourself. Which behaviour you want depends on the situation: if the key genuinely must be present and its absence means the whole system is misconfigured, you want the loud failure so a bug is not silently swallowed. If the key is optional and a missing one just means "use the default", you want the calm answer. There is also a middle option — `setdefault` — which is "if this name is not on the list, add them with this starting record, and either way give me their record so I can update it". As for merging two guest lists: you can either photocopy both onto a fresh sheet (a new dict, originals untouched) or write the second list onto the bottom of the first (mutating the first). They look similar but one changes the original and one does not, and picking the wrong one is a subtle bug.',
      hi: '**Ek receptionist se kisi ko naam se poochhna, aur "wo yahaan nahi hain" aur darwaaza patakne ke antar.** Square-bracket access ke saath, ek naam poochhna jo list par nahi hai ek fatal error maana jaata hai: receptionist sab kuch rok deta hai aur jaari rakhne se mana karta hai. `.get` ke saath, ek absent naam poochhna aapko ek shaant "us naam ka koi nahi" deta hai — aap poochh sakte ho, aur absence khud handle kar sakte ho. Aap kaunsa vyavhaar chahte ho ye sthiti par nirbhar karta hai: agar key sachmuch maujood honi chahiye aur iski absence ka matlab poora system misconfigured hai, aap zor se failure chahte ho taaki ek bug chupchaap na nigal jaaye. Agar key optional hai aur ek missing ka matlab bas "default istemal karo", aap shaant jawaab chahte ho. Ek beech ka vikalp bhi hai — `setdefault` — jo hai "agar ye naam list par nahi hai, unhe is starting record ke saath add karo, aur kisi bhi tarah mujhe unka record do taaki main use update kar sakoon".',
    },

    simple: `**Start broken.** \`[]\` access on a maybe-missing key; merging by mutating:

\`\`\`python
config = {"host": "localhost", "port": 5432}

timeout = config["timeout"]          # KeyError: 'timeout'   -- crashes here

defaults = {"port": 5432, "timeout": 30}
overrides = {"port": 8080, "host": "db.example.com"}

merged = defaults.update(overrides)  # .update() mutates 'defaults' and returns None
print(merged)                        # None
print(defaults)                      # {'port': 8080, 'timeout': 30, 'host': 'db.example.com'}  -- defaults changed!
\`\`\`

\`config["timeout"]\` raises \`KeyError\` when the key is absent. \`.update()\` mutates the dict it is called on and returns \`None\`.

**The fix: \`.get()\` with a default; merge into a new dict**

\`\`\`python
config = {"host": "localhost", "port": 5432}

timeout = config.get("timeout")          # None if absent
timeout = config.get("timeout", 30)      # 30 if absent
port = config["port"]                    # [] is fine when the key MUST exist

defaults = {"port": 5432, "timeout": 30}
overrides = {"port": 8080, "host": "db.example.com"}

merged = {**defaults, **overrides}       # NEW dict; later keys win; originals untouched
merged = defaults | overrides            # same, Python 3.9+
print(merged)                            # {'port': 8080, 'timeout': 30, 'host': 'db.example.com'}
print(defaults)                          # {'port': 5432, 'timeout': 30}  -- unchanged
\`\`\`

\`\`\`
ACCESS   d[k]              raises KeyError if missing -- use when k MUST be there
         d.get(k)          -> None if missing
         d.get(k, default) -> default if missing (default is NOT stored)
         d.setdefault(k, v)-> if missing, store d[k]=v; either way return d[k]
CHECK    k in d            tests KEYS (fast, O(1))       -- not values
ADD/SET  d[k] = v          add or overwrite
UPDATE   d.update(other)   in place, other's keys win, returns None
         d1 | d2           NEW dict (3.9+)               d1 |= d2  in place
         {**d1, **d2}      NEW dict (any version)
REMOVE   del d[k]          KeyError if missing
         d.pop(k)          remove & return; d.pop(k, default) is safe
         d.popitem()       remove & return the LAST inserted (k, v)
ITERATE  for k in d              keys
         for k, v in d.items()   pairs
         for v in d.values()     values
LENGTH   len(d)
\`\`\``,

    simpleHi: `**Toote hue se shuru.** Ek maybe-missing key par \`[]\` access; mutate karke merge karna:

\`\`\`python
config = {"host": "localhost", "port": 5432}

timeout = config["timeout"]          # KeyError: 'timeout'   -- yahaan crash

defaults = {"port": 5432, "timeout": 30}
overrides = {"port": 8080, "host": "db.example.com"}

merged = defaults.update(overrides)  # .update() 'defaults' mutate karta hai aur None lautaata hai
print(merged)                        # None
print(defaults)                      # {'port': 8080, ...}  -- defaults badal gaya!
\`\`\`

\`config["timeout"]\` \`KeyError\` deta hai jab key absent hai. \`.update()\` jis dict par call ho use mutate karta hai aur \`None\` lautaata hai.

**Fix: ek default ke saath \`.get()\`; ek naye dict mein merge**

\`\`\`python
config = {"host": "localhost", "port": 5432}

timeout = config.get("timeout")          # absent to None
timeout = config.get("timeout", 30)      # absent to 30
port = config["port"]                    # [] theek hai jab key HONI CHAHIYE

defaults = {"port": 5432, "timeout": 30}
overrides = {"port": 8080, "host": "db.example.com"}

merged = {**defaults, **overrides}       # NAYA dict; baad ki keys jeetati hain; originals achhoote
merged = defaults | overrides            # wahi, Python 3.9+
print(merged)                            # {'port': 8080, 'timeout': 30, 'host': 'db.example.com'}
print(defaults)                          # {'port': 5432, 'timeout': 30}  -- abadalta
\`\`\`

\`\`\`
ACCESS   d[k]              missing to KeyError -- jab k HONI CHAHIYE tab istemal
         d.get(k)          -> missing to None
         d.get(k, default) -> missing to default (default STORE nahi hota)
         d.setdefault(k, v)-> missing to d[k]=v store; kisi bhi tarah d[k] return
CHECK    k in d            KEYS test karta hai (tez, O(1))   -- values nahi
ADD/SET  d[k] = v          add ya overwrite
UPDATE   d.update(other)   jagah par, other ki keys jeetati hain, None lautaata hai
         d1 | d2           NAYA dict (3.9+)               d1 |= d2  jagah par
         {**d1, **d2}      NAYA dict (koi bhi version)
REMOVE   del d[k]          missing to KeyError
         d.pop(k)          remove aur return; d.pop(k, default) surakshit hai
         d.popitem()       aakhri insert kiya (k, v) remove aur return
ITERATE  for k in d              keys
         for k, v in d.items()   pairs
         for v in d.values()     values
LENGTH   len(d)
\`\`\``,

    content: `## \`.get\`, \`.setdefault\`, and the grouping pattern

\`\`\`python
# .get -- read with a fallback, do NOT store anything
count = tally.get(word, 0)

# .setdefault -- read, and store the default if absent (returns the value either way)
groups = {}
for name, dept in employees:
    groups.setdefault(dept, []).append(name)
# groups is now {"eng": ["Al", "Cy"], "sales": ["Bo"]}

# the same with collections.defaultdict (cleaner for heavy use):
from collections import defaultdict
groups = defaultdict(list)
for name, dept in employees:
    groups[dept].append(name)     # missing key auto-creates an empty list
\`\`\`

The \`setdefault(k, []).append(...)\` idiom builds a dict-of-lists in one pass — the standard "group by" pattern before you reach for \`itertools.groupby\` or the ORM.

## Counting: \`get\` vs \`defaultdict\` vs \`Counter\`

\`\`\`python
text = "the quick brown fox the lazy the"

# manual with .get
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1

# collections.Counter -- purpose-built
from collections import Counter
counts = Counter(text.split())
print(counts)                # Counter({'the': 3, 'quick': 1, 'brown': 1, 'fox': 1, 'lazy': 1})
print(counts["the"])         # 3
print(counts["missing"])     # 0    -- Counter returns 0, never raises
print(counts.most_common(2)) # [('the', 3), ('quick', 1)]
\`\`\`

## Insertion order (guaranteed since Python 3.7)

\`\`\`python
d = {}
d["z"] = 1
d["a"] = 2
d["m"] = 3
list(d)              # ['z', 'a', 'm']   -- insertion order, NOT sorted
list(d.items())      # [('z', 1), ('a', 2), ('m', 3)]

# to iterate in sorted-key order:
for k in sorted(d):
    print(k, d[k])

# reassigning an existing key keeps its original position:
d["z"] = 99          # 'z' stays first
\`\`\`

Before 3.7, dict order was an implementation detail. Now it is part of the language — you can rely on "keys come out in the order they were first inserted".

## Merging, precisely

\`\`\`python
a = {"x": 1, "y": 2}
b = {"y": 20, "z": 30}

{**a, **b}       # {'x': 1, 'y': 20, 'z': 30}   -- b's y wins (rightmost wins)
a | b            # same (Python 3.9+)
a.update(b)      # MUTATES a to {'x': 1, 'y': 20, 'z': 30}, returns None
a |= b           # same in-place merge (3.9+)

# deep merge (nested dicts) is NOT built in -- you write it or use a library
\`\`\`

## Do not mutate a dict while iterating its keys

\`\`\`python
# RuntimeError: dictionary changed size during iteration
for k in d:
    if should_remove(k):
        del d[k]

# fix: iterate a snapshot of the keys
for k in list(d):
    if should_remove(k):
        del d[k]

# or build a new dict
d = {k: v for k, v in d.items() if not should_remove(k)}
\`\`\`

## Dict comprehensions

\`\`\`python
squares = {n: n * n for n in range(5)}          # {0:0, 1:1, 2:4, 3:9, 4:16}
inverted = {v: k for k, v in d.items()}          # swap keys and values
filtered = {k: v for k, v in d.items() if v > 0} # keep positive values
from_pairs = dict(zip(keys, values))             # two lists -> one dict
\`\`\``,

    contentHi: `## \`.get\`, \`.setdefault\`, aur grouping pattern

\`\`\`python
# .get -- ek fallback ke saath padho, kuch STORE mat karo
count = tally.get(word, 0)

# .setdefault -- padho, aur default store karo agar absent (kisi bhi tarah value return)
groups = {}
for name, dept in employees:
    groups.setdefault(dept, []).append(name)
# groups ab {"eng": ["Al", "Cy"], "sales": ["Bo"]} hai

# wahi collections.defaultdict ke saath (bhaari istemal ke liye saaf):
from collections import defaultdict
groups = defaultdict(list)
for name, dept in employees:
    groups[dept].append(name)     # missing key apne aap ek empty list banaata hai
\`\`\`

\`setdefault(k, []).append(...)\` idiom ek pass mein ek dict-of-lists banaata hai — standard "group by" pattern isse pehle ki aap \`itertools.groupby\` ya ORM ki taraf pahuncho.

## Counting: \`get\` vs \`defaultdict\` vs \`Counter\`

\`\`\`python
text = "the quick brown fox the lazy the"

# manual .get ke saath
counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1

# collections.Counter -- iske liye hi banaya gaya
from collections import Counter
counts = Counter(text.split())
print(counts)                # Counter({'the': 3, 'quick': 1, 'brown': 1, 'fox': 1, 'lazy': 1})
print(counts["the"])         # 3
print(counts["missing"])     # 0    -- Counter 0 lautaata hai, kabhi error nahi
print(counts.most_common(2)) # [('the', 3), ('quick', 1)]
\`\`\`

## Insertion order (Python 3.7 se guaranteed)

\`\`\`python
d = {}
d["z"] = 1
d["a"] = 2
d["m"] = 3
list(d)              # ['z', 'a', 'm']   -- insertion order, sorted NAHI
list(d.items())      # [('z', 1), ('a', 2), ('m', 3)]

# sorted-key order mein iterate karne ko:
for k in sorted(d):
    print(k, d[k])

# ek maujooda key ko dobara assign karna iski original position rakhta hai:
d["z"] = 99          # 'z' pehla rehta hai
\`\`\`

3.7 se pehle, dict order ek implementation detail thi. Ab ye language ka hissa hai — aap "keys us kram mein aati hain jismein wo pehli baar insert hui" par bharosa kar sakte ho.

## Merging, thik-thik

\`\`\`python
a = {"x": 1, "y": 2}
b = {"y": 20, "z": 30}

{**a, **b}       # {'x': 1, 'y': 20, 'z': 30}   -- b ka y jeetta hai (rightmost jeetta hai)
a | b            # wahi (Python 3.9+)
a.update(b)      # a ko {'x': 1, 'y': 20, 'z': 30} MUTATE karta hai, None lautaata hai
a |= b           # wahi in-place merge (3.9+)

# deep merge (nested dicts) built in NAHI hai -- aap likhte ho ya ek library istemal
\`\`\`

## Ek dict ko iske keys iterate karte hue mutate mat karo

\`\`\`python
# RuntimeError: dictionary changed size during iteration
for k in d:
    if should_remove(k):
        del d[k]

# fix: keys ka ek snapshot iterate karo
for k in list(d):
    if should_remove(k):
        del d[k]

# ya ek naya dict banao
d = {k: v for k, v in d.items() if not should_remove(k)}
\`\`\`

## Dict comprehensions

\`\`\`python
squares = {n: n * n for n in range(5)}          # {0:0, 1:1, 2:4, 3:9, 4:16}
inverted = {v: k for k, v in d.items()}          # keys aur values swap
filtered = {k: v for k, v in d.items() if v > 0} # positive values rakho
from_pairs = dict(zip(keys, values))             # do lists -> ek dict
\`\`\``,

    examples: [
      {
        title: 'Broken: [] on a missing key, and .update returning None',
        titleHi: 'Toota: ek missing key par [], aur .update None lautaana',
        code: `settings = {"theme": "dark"}

font_size = settings["font_size"]
print(font_size)`,
        output: `Traceback (most recent call last):
  File "script.py", line 3, in <module>
    font_size = settings["font_size"]
                ~~~~~~~~^^^^^^^^^^^^^
KeyError: 'font_size'`,
        explain: 'Square-bracket access raises `KeyError` the instant the key is missing, aborting the function. For an optional setting you want `settings.get("font_size", 14)` — returns the default, no crash. Reserve `settings["key"]` for keys that are guaranteed present (and where a missing one really is a bug).',
        explainHi: 'Square-bracket access `KeyError` deta hai jaise hi key missing hai, function abort karte hue. Ek optional setting ke liye aap `settings.get("font_size", 14)` chahte ho — default lautaata hai, koi crash nahi. `settings["key"]` ko un keys ke liye rakho jo guaranteed maujood hain.',
      },
      {
        title: 'Fixed: .get, .setdefault grouping, merge into a new dict',
        titleHi: 'Theek: .get, .setdefault grouping, ek naye dict mein merge',
        code: `settings = {"theme": "dark"}
print(settings.get("font_size", 14))          # 14, no crash
print(settings.get("theme"))                  # dark

employees = [("Al", "eng"), ("Bo", "sales"), ("Cy", "eng"), ("Di", "sales")]
by_dept = {}
for name, dept in employees:
    by_dept.setdefault(dept, []).append(name)
print(by_dept)

base = {"port": 5432, "ssl": True}
env = {"port": 8080, "host": "prod.db"}
final = {**base, **env}
print("final:", final)
print("base unchanged:", base)`,
        output: `14
dark
{'eng': ['Al', 'Cy'], 'sales': ['Bo', 'Di']}
final: {'port': 8080, 'ssl': True, 'host': 'prod.db'}
base unchanged: {'port': 5432, 'ssl': True}`,
        explain: '`.get(key, default)` never raises. `setdefault(dept, []).append(name)` creates the list on first sight of a department and appends on every sighting — a group-by in one pass. `{**base, **env}` builds a new dict where `env` wins ties; `base` and `env` are both untouched.',
        explainHi: '`.get(key, default)` kabhi error nahi deta. `setdefault(dept, []).append(name)` ek department pehli baar dekhne par list banaata hai aur har dekhne par append karta hai — ek pass mein group-by. `{**base, **env}` ek naya dict banaata hai jahaan `env` ties jeetta hai; `base` aur `env` dono achhoote hain.',
      },
      {
        title: 'Counter, insertion order, and safe key deletion',
        titleHi: 'Counter, insertion order, aur surakshit key deletion',
        code: `from collections import Counter

votes = ["A", "B", "A", "C", "A", "B"]
tally = Counter(votes)
print(tally.most_common())
print(tally["Z"])                  # 0, not a KeyError

d = {"z": 1, "a": 2, "m": 3}
print(list(d))                     # insertion order
print([k for k in sorted(d)])      # sorted order

for k in list(d):                  # iterate a snapshot
    if d[k] % 2 == 0:
        del d[k]
print(d)`,
        output: `[('A', 3), ('B', 2), ('C', 1)]
0
['z', 'a', 'm']
['a', 'm', 'z']
{'z': 1, 'm': 3}`,
        explain: '`Counter` counts in one call, returns 0 for unseen keys, and `.most_common()` ranks them. `list(d)` yields keys in insertion order; `sorted(d)` sorts them. Deleting keys during iteration requires `for k in list(d)` (a snapshot) — iterating `d` directly while deleting raises `RuntimeError`.',
        explainHi: '`Counter` ek call mein count karta hai, unseen keys ke liye 0 lautaata hai, aur `.most_common()` unhe rank karta hai. `list(d)` keys ko insertion order mein deta hai; `sorted(d)` unhe sort karta hai. Iteration ke dauraan keys delete karne ko `for k in list(d)` (ek snapshot) chahiye.',
      },
    ],

    mistakes: [
      {
        wrong: `user_prefs = get_prefs()      # a dict
lang = user_prefs["language"]  # KeyError if the user never set a language`,
        right: `lang = user_prefs.get("language", "en")`,
        why: 'Any key that comes from user input, an optional config, or an external payload might be absent. `d["key"]` turns that into a crash; `d.get("key", default)` turns it into a sensible fallback. Use `[]` only for keys your own code guarantees it put there.',
        whyHi: 'Koi bhi key jo user input, ek optional config, ya ek external payload se aati hai absent ho sakti hai. `d["key"]` use ek crash mein badalta hai; `d.get("key", default)` use ek samajhdaar fallback mein badalta hai. `[]` sirf un keys ke liye jinhe aapka apna code guarantee karta hai ki usne rakha.',
      },
      {
        wrong: `combined = dict_a
combined.update(dict_b)       # this mutates dict_a`,
        right: `combined = {**dict_a, **dict_b}   # or dict_a | dict_b (3.9+)`,
        why: '`combined = dict_a` shares the reference, then `.update()` mutates it — so `dict_a` silently changes. If you want a merged result with both originals intact, build a new dict with `{**a, **b}` or `a | b`. Use `.update()` only when you deliberately want to mutate the target.',
        whyHi: '`combined = dict_a` reference share karta hai, phir `.update()` use mutate karta hai — isliye `dict_a` chupchaap badal jaata hai. Agar aap dono originals intact ke saath ek merged result chahte ho, `{**a, **b}` ya `a | b` se ek naya dict banao. `.update()` sirf tab jab aap jaan-boojhkar target mutate karna chahte ho.',
      },
      {
        wrong: `if "admin" in user_roles.values():   # checking values with 'in' -- O(n)
    ...
if some_key in my_dict.keys():        # redundant .keys()`,
        right: `if "admin" in set(user_roles.values()):   # if checked repeatedly
    ...
if some_key in my_dict:               # 'in' on a dict already checks keys`,
        why: '`key in d` checks keys in O(1) and needs no `.keys()`. `value in d.values()` is an O(n) linear scan — fine once, wasteful in a loop (convert to a set first). Writing `d.keys()` explicitly for a membership test is redundant noise.',
        whyHi: '`key in d` keys ko O(1) mein check karta hai aur `.keys()` ki zaroorat nahi. `value in d.values()` ek O(n) linear scan hai — ek baar theek, ek loop mein fizool (pehle ek set mein convert karo). Ek membership test ke liye `d.keys()` explicitly likhna fizool shor hai.',
      },
    ],

    realWorld: [
      {
        en: '**`request.data.get("field")` and `serializer.validated_data.get("field", default)`** are everywhere in DRF — request payloads are dicts with optional keys, and `[]` access on a missing field is a 500 error instead of a clean 400.',
        hi: '**`request.data.get("field")` aur `serializer.validated_data.get("field", default)`** DRF mein har jagah hain — request payloads optional keys waale dicts hain, aur ek missing field par `[]` access ek saaf 400 ke bajaye ek 500 error hai.',
      },
      {
        en: '**Django `**kwargs` and settings merges** rely on dict unpacking — `Model.objects.filter(**filter_kwargs)`, `{**BASE_SETTINGS, **ENV_SETTINGS}`. The rightmost dict wins, which is how environment-specific settings override defaults.',
        hi: '**Django `**kwargs` aur settings merges** dict unpacking par nirbhar karte hain — `Model.objects.filter(**filter_kwargs)`, `{**BASE_SETTINGS, **ENV_SETTINGS}`. Rightmost dict jeetta hai, aise environment-specific settings defaults ko override karti hain.',
      },
      {
        en: '**`Counter` and `defaultdict(list)`** show up in analytics endpoints, log processors, and report generators — counting events by type, grouping records by a key, tallying by day. `Counter(qs.values_list("status", flat=True))` counts statuses in one line.',
        hi: '**`Counter` aur `defaultdict(list)`** analytics endpoints, log processors, aur report generators mein dikhte hain — events ko type se ginna, records ko ek key se group karna, din se tally karna. `Counter(qs.values_list("status", flat=True))` ek line mein statuses ginta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'When would you use `d[key]`, `d.get(key)`, and `d.setdefault(key, default)`?',
        qHi: 'Aap `d[key]`, `d.get(key)`, aur `d.setdefault(key, default)` kab istemal karoge?',
        a: 'These three are about what happens when the key might not be present. Square-bracket access is the strict form: if the key is there you get its value, and if it is not there you get a KeyError exception that propagates and, unless caught, crashes the current operation. You use this deliberately when the key is a precondition — your own code put it there, or the data contract guarantees it — and a missing key genuinely indicates a bug you want to hear about loudly rather than paper over. The get method is the lenient form: if the key is present you get its value, and if it is absent you get None, or a default value if you pass a second argument. Crucially, get does not modify the dictionary — if the key was absent, it stays absent. You use get for optional data: a setting that may or may not be configured, a field that may or may not be in a request payload, a lookup where "not found" is a normal outcome you will handle. The setdefault method is a combination: it looks up the key, and if the key is absent it inserts it with the provided default and then returns that default; if the key is present it just returns the existing value and inserts nothing. The distinguishing feature is that it mutates the dict on a miss. The canonical use is building a dictionary of lists in a single loop: for each item you call setdefault of the group key and an empty list, which gives you the list whether it already existed or was just created, and you append to it. For that specific pattern many people prefer collections dot defaultdict, which pushes the default-construction into the dict itself so you can just write d of key dot append, but setdefault is fine and needs no import.',
        aHi: 'Ye teen is baare mein hain ki kya hota hai jab key maujood na ho. Square-bracket access strict form hai: agar key hai to aapko iski value milti hai, aur agar nahi hai to aapko ek KeyError exception milti hai jo propagate hoti hai aur, jab tak catch na ho, current operation ko crash karti hai. Aap ise jaan-boojhkar tab istemal karte ho jab key ek precondition hai — aapke apne code ne use rakha, ya data contract ise guarantee karta hai — aur ek missing key sachmuch ek bug batata hai jise aap zor se sunna chahte ho. Get method lenient form hai: agar key maujood hai to aapko iski value milti hai, aur agar absent hai to aapko None milta hai, ya ek default value agar aap ek doosra argument pass karte ho. Mahatvapurna baat, get dictionary ko modify nahi karta. Aap get optional data ke liye istemal karte ho. Setdefault method ek combination hai: ye key dhoondhta hai, aur agar key absent hai to ise diye gaye default ke saath insert karta hai aur phir wo default lautaata hai; agar key maujood hai to ye bas maujooda value lautaata hai. Distinguishing feature ye hai ki ye ek miss par dict mutate karta hai. Canonical use ek single loop mein lists ka ek dictionary banaana hai.',
      },
      {
        q: 'How do you merge two dicts, and what is the difference between `{**a, **b}`, `a | b`, and `a.update(b)`?',
        qHi: 'Aap do dicts kaise merge karte ho, aur `{**a, **b}`, `a | b`, aur `a.update(b)` mein kya antar hai?',
        a: 'All three combine the entries of two dicts with the rule that when the same key appears in both, the value from the second dict wins. The difference is whether they create a new dict or modify an existing one. The double-star form inside curly braces, star-star-a comma star-star-b, spreads both dicts into a fresh dict literal, so you get a brand new dictionary and both a and b are left exactly as they were. This form works in every version of Python 3 and is the one to reach for when you want an immutable-feeling merge. The pipe operator between two dicts does the same thing — a new dict, originals untouched — and reads more cleanly, but it was only added in Python 3.9, so in code that must support older versions you fall back to the double-star form. The update method is fundamentally different: it is a mutating operation. a dot update of b walks through b\'s entries and writes each one into a, overwriting any keys that collide, and it returns None. So after this call, a has changed and b is unchanged. You use update when you specifically want to modify a dict in place, for example accumulating into a running result or applying overrides onto a config object you own. The bug people hit is writing combined equals a, then combined dot update of b, expecting combined to be a separate merged dict — but combined and a are the same object, so a gets mutated as a side effect. There is also an in-place pipe-equals operator, a pipe-equals b, which is the mutating form of the pipe operator and is equivalent to a dot update of b. None of these do a deep or recursive merge; if a and b both have a key whose value is itself a dict, the nested dict from b simply replaces the one from a. Deep merging you write yourself or pull from a library.',
        aHi: 'Teenon do dicts ki entries ko is niyam ke saath jodte hain ki jab wahi key dono mein aati hai, doosre dict ki value jeetati hai. Antar ye hai ki wo ek naya dict banate hain ya ek maujooda ko modify karte hain. Curly braces ke andar double-star form, star-star-a comma star-star-b, dono dicts ko ek naye dict literal mein failaata hai, isliye aapko ek bilkul nayi dictionary milti hai aur a aur b dono bilkul waise chhod diye jaate hain jaise wo the. Ye form Python 3 ke har version mein kaam karta hai. Do dicts ke beech pipe operator wahi cheez karta hai — ek naya dict, originals achhoote — aur zyaada saaf padhta hai, par ye sirf Python 3.9 mein joda gaya. Update method mool roop se alag hai: ye ek mutating operation hai. a dot update of b, b ki entries ke through chalta hai aur har ek ko a mein likhta hai, koi bhi collide karne waali keys overwrite karte hue, aur ye None lautaata hai. Toh is call ke baad, a badal gaya aur b abadalta. Jo bug log pahunchte hain wo combined equals a likhna hai, phir combined dot update of b. In mein se koi deep ya recursive merge nahi karta.',
      },
    ],

    exercises: [
      {
        task: 'Write `word_count(text)` that returns a dict of word -> count, three ways: (1) with `d.get(w, 0) + 1`, (2) with `collections.defaultdict(int)`, (3) with `collections.Counter`. Confirm all three give the same result on `"a b a c b a"`.',
        taskHi: '`word_count(text)` likho jo word -> count ka ek dict lautaata hai, teen tarikon se: (1) `d.get(w, 0) + 1` se, (2) `collections.defaultdict(int)` se, (3) `collections.Counter` se. Confirm karo ki teenon `"a b a c b a"` par same result dete hain.',
        hint: 'All three should give `{"a": 3, "b": 2, "c": 1}`. `Counter(text.split())` is the shortest. `defaultdict(int)` lets you write `d[w] += 1` because a missing key defaults to `0`.',
        hintHi: 'Teenon ko `{"a": 3, "b": 2, "c": 1}` dena chahiye. `Counter(text.split())` sabse chhota hai. `defaultdict(int)` aapko `d[w] += 1` likhne deta hai kyunki ek missing key default `0` hoti hai.',
      },
      {
        task: 'Write `deep_get(d, *keys, default=None)` that walks a nested dict — `deep_get(data, "user", "address", "city", default="?")` returns `data["user"]["address"]["city"]` or `"?"` if any level is missing. Use `.get` at each step.',
        taskHi: '`deep_get(d, *keys, default=None)` likho jo ek nested dict walk kare — `deep_get(data, "user", "address", "city", default="?")` `data["user"]["address"]["city"]` ya `"?"` lautaaye agar koi level missing hai. Har step par `.get` istemal karo.',
        hint: '`cur = d; for k in keys: if not isinstance(cur, dict): return default; cur = cur.get(k, default) ... ` — actually simpler: `for k in keys: cur = cur.get(k) if isinstance(cur, dict) else None; if cur is None: return default` then `return cur`.',
        hintHi: '`cur = d`; har key par `cur = cur.get(k)` agar `cur` ek dict hai warna `None`; agar `cur is None` to `default` return karo; loop ke baad `cur` return karo.',
      },
      {
        task: 'Given `a = {"x": 1, "y": 2}` and `b = {"y": 99, "z": 3}`, produce the merged dict `{"x": 1, "y": 99, "z": 3}` in three ways (`{**a, **b}`, `a | b`, and a copy-then-update). After each, print `a` and `b` to confirm which approaches leave them untouched.',
        taskHi: '`a = {"x": 1, "y": 2}` aur `b = {"y": 99, "z": 3}` diye, merged dict `{"x": 1, "y": 99, "z": 3}` teen tarikon se banao (`{**a, **b}`, `a | b`, aur ek copy-phir-update). Har ek ke baad, `a` aur `b` print karo confirm karne ko kaunse approaches unhe achhoota chhodte hain.',
        hint: '`{**a, **b}` and `a | b` both leave `a` and `b` untouched. The safe copy-then-update is `c = a.copy(); c.update(b)`. Doing `c = a; c.update(b)` would mutate `a`.',
        hintHi: '`{**a, **b}` aur `a | b` dono `a` aur `b` ko achhoota chhodte hain. Surakshit copy-phir-update `c = a.copy(); c.update(b)` hai. `c = a; c.update(b)` karna `a` ko mutate karega.',
      },
    ],

    keyTakeaways: [
      '`d[key]` raises `KeyError` when the key is missing — use it only when the key MUST be present. `d.get(key)` returns `None`; `d.get(key, default)` returns the default (and does NOT store it).',
      '`d.setdefault(key, default)` returns `d[key]`, inserting `default` first if the key was absent. The `setdefault(k, []).append(...)` idiom is the one-pass "group by".',
      '`collections.defaultdict(list/int/set)` auto-creates the default on a missing key; `collections.Counter` counts in one call and returns `0` for unseen keys.',
      'Dicts preserve INSERTION order (guaranteed since Python 3.7). Reassigning an existing key keeps its position. Iterate `sorted(d)` for sorted-key order.',
      'Merge into a NEW dict with `{**a, **b}` (any version) or `a | b` (3.9+) — rightmost key wins, originals untouched. `a.update(b)` / `a |= b` MUTATE `a` and return `None`.',
      '`key in d` tests keys in O(1) (no `.keys()` needed). `value in d.values()` is an O(n) scan.',
      'Never delete keys while iterating `d` directly — `RuntimeError`. Iterate `list(d)` (a snapshot) or build a new dict with a comprehension.',
      'Dict comprehension: `{k: v for k, v in d.items() if ...}`. `dict(zip(keys, values))` builds a dict from two parallel lists.',
    ],
    keyTakeawaysHi: [
      '`d[key]` `KeyError` deta hai jab key missing hai — ise sirf tab istemal karo jab key HONI CHAHIYE. `d.get(key)` `None` lautaata hai; `d.get(key, default)` default lautaata hai (aur ise STORE NAHI karta).',
      '`d.setdefault(key, default)` `d[key]` lautaata hai, agar key absent thi to pehle `default` insert karke. `setdefault(k, []).append(...)` idiom one-pass "group by" hai.',
      '`collections.defaultdict(list/int/set)` ek missing key par default apne aap banaata hai; `collections.Counter` ek call mein count karta hai aur unseen keys ke liye `0` lautaata hai.',
      'Dicts INSERTION order preserve karte hain (Python 3.7 se guaranteed). Ek maujooda key ko dobara assign karna iski position rakhta hai. Sorted-key order ke liye `sorted(d)` iterate karo.',
      'Ek NAYE dict mein merge karo `{**a, **b}` (koi bhi version) ya `a | b` (3.9+) se — rightmost key jeetati hai, originals achhoote. `a.update(b)` / `a |= b` `a` ko MUTATE karte hain aur `None` lautaate hain.',
      '`key in d` keys ko O(1) mein test karta hai (`.keys()` ki zaroorat nahi). `value in d.values()` ek O(n) scan hai.',
      'Kabhi `d` ko seedhe iterate karte hue keys delete mat karo — `RuntimeError`. `list(d)` (ek snapshot) iterate karo ya ek comprehension se ek naya dict banao.',
      'Dict comprehension: `{k: v for k, v in d.items() if ...}`. `dict(zip(keys, values))` do parallel lists se ek dict banaata hai.',
    ],
  },
];
