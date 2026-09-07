/**
 * DevOps Complete Course — Module 2: Linux & the Command Line for Operations, lessons 1-3.
 * Part I of the course: Foundations.
 *
 * Lesson 1: The shell — what it actually does (tokenization, quoting, expansion
 *           order, exit codes, chaining, subshells). VERIFIED against real bash.
 * Lesson 2: Processes, signals & job control — the process model, PIDs, jobs,
 *           SIGTERM vs SIGKILL vs SIGHUP, nohup. PARTLY VERIFIED (job control +
 *           signals run; ps output is illustrative).
 * Lesson 3: systemd & service management — units, systemctl, journalctl, timers.
 *           ILLUSTRATIVE (systemd is Linux-only; output is realistic, not run here).
 *
 * Examples whose `code` begins with a "# VERIFY" line are executed against a real
 * bash (scratchpad/verify-bash.mjs) and diffed. The rest show realistic output.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_2: CourseLesson[] = [
  {
    slug: 'ops-the-shell-what-it-actually-does',
    title: 'The Shell: What It Actually Does',
    titleHi: 'Shell: Ye Actually Kya Karta Hai',
    description: 'The shell is a program that reads a line, splits it into words, expands variables, globs, and command substitutions in a fixed order, then runs the result. Almost every "weird bash bug" is a misunderstanding of that pipeline — especially quoting and word-splitting.',
    descriptionHi: 'Shell ek program hai jo ek line padhता hai, ise words mein split karता hai, variables, globs, aur command substitutions ko ek fixed order mein expand karता hai, phir result run karता hai. Lagभag har "weird bash bug" us pipeline ki ek misunderstanding hai — especially quoting aur word-splitting.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 1,

    analogy: {
      en: '**A mail room that takes your handwritten note, rewrites parts of it according to strict rules, cuts it into cards along every gap, and only then acts on the cards.** If you write "send to J Smith" it cuts that into three cards — "send", "to", "J", "Smith" — because a space means "new card". If you want "J Smith" treated as one thing, you put it in a box (quotes) so the mail room does not cut it. Variables are shorthand the mail room looks up and pastes in before cutting — so if your variable contains a space, its contents get cut too, unless the whole lookup is in a box. Every confusing shell result is a case where you thought the mail room would treat something as one card and it made several, or vice versa.',
      hi: '**Ek mail room jo aapका handwritten note leта hai, strict rules ke hisaab se iske parts rewrite karта hai, ise har gap ke saath cards mein cut karта hai, aur sirf tab cards par act karता hai.** Agar aap "send to J Smith" likhते ho ye ise teen cards mein cut karта hai — kyunki ek space matlab "naya card". Agar aap "J Smith" ko ek cheez treat karवाna chahते ho, aap ise ek box (quotes) mein daalте ho. Variables shorthand hain jise mail room look up karता hai aur cutting se pehle paste karता hai — to agar aapка variable ek space rakhता hai, iski contents bhi cut ho jाती hain, jab tak poora lookup ek box mein na ho.',
    },

    simple: `**THE SHELL IS A PROGRAM.** \`bash\` reads a line, transforms it, runs the result.
The transformation happens in a **FIXED ORDER** — knowing it fixes 90% of "bash bugs".

**EXPANSION ORDER (roughly):**
\`\`\`
1. brace expansion       {a,b}.txt  ->  a.txt b.txt
2. tilde expansion       ~  ->  /home/you
3. parameter expansion   $VAR  \${VAR}  \${VAR:-default}  \${VAR##*/}
4. command substitution  $(cmd)   (runs cmd, pastes its output)
5. arithmetic expansion  $((2 + 3))
6. WORD SPLITTING         the result is cut into words on spaces/tabs/newlines (IFS)
7. FILENAME EXPANSION     *.txt  ->  matching files (globbing)
8. quote removal          the quote characters themselves are stripped
\`\`\`

**QUOTING — the single biggest source of shell bugs:**
\`\`\`
echo $x        | x is expanded, THEN word-split, THEN globbed   (dangerous)
echo "$x"      | x is expanded, NOT split, NOT globbed          (almost always what you want)
echo '$x'      | literally the 3 characters  $ x                (no expansion at all)
\`\`\`
RULE: **quote every variable expansion** unless you specifically want splitting.
\`"$var"\`, \`"$@"\`, \`"$(cmd)"\`, \`"\${arr[@]}"\`.

**EXIT CODES: every command returns 0-255. 0 = success, non-zero = failure. \`$?\` = last.**
\`\`\`
cmd && next   | run next only if cmd succeeded (exit 0)
cmd || alt    | run alt only if cmd failed (exit != 0)
cmd ; next    | run next regardless
a | b         | pipeline exit = exit of the LAST command (unless 'set -o pipefail')
\`\`\`

**SUBSHELL vs GROUP:**
\`\`\`
( cd /tmp; work )   | SUBSHELL: cd doesn't affect the parent. state changes are local.
{ cd /tmp; work; }  | GROUP: runs in the CURRENT shell. cd DOES affect it.
\`\`\``,

    simpleHi: `**SHELL EK PROGRAM HAI.** \`bash\` ek line padhता hai, ise transform karता hai, result run karता hai.
Transformation ek **FIXED ORDER** mein hoती hai — ise jaanna 90% "bash bugs" fix karта hai.

**EXPANSION ORDER (roughly):**
\`\`\`
1. brace expansion       {a,b}.txt  ->  a.txt b.txt
2. tilde expansion       ~  ->  /home/you
3. parameter expansion   $VAR  \${VAR:-default}  \${VAR##*/}
4. command substitution  $(cmd)
5. arithmetic expansion  $((2 + 3))
6. WORD SPLITTING         result spaces/tabs/newlines par words mein cut hoता hai (IFS)
7. FILENAME EXPANSION     *.txt  ->  matching files (globbing)
8. quote removal
\`\`\`

**QUOTING — shell bugs ka sabse baड़a source:**
\`\`\`
echo $x        | x expand hoता hai, PHIR word-split, PHIR globbed   (dangerous)
echo "$x"      | x expand hoता hai, split NAHI, globbed NAHI        (lagbhag hamesha jo aap chahте ho)
echo '$x'      | literally 3 characters  $ x                        (koi expansion nahi)
\`\`\`
RULE: **har variable expansion quote karो** jab tak aap specifically splitting nahi chahте.

**EXIT CODES: har command 0-255 return karता hai. 0 = success, non-zero = failure. \`$?\` = last.**
\`\`\`
cmd && next   | next sirf tab run karो agar cmd succeeded
cmd || alt    | alt sirf tab run karो agar cmd failed
a | b         | pipeline exit = LAST command ka exit (jab tak 'set -o pipefail' na ho)
\`\`\`

**SUBSHELL vs GROUP:**
\`\`\`
( cd /tmp; work )   | SUBSHELL: cd parent ko affect nahi karता.
{ cd /tmp; work; }  | GROUP: CURRENT shell mein run hoता hai. cd USE affect KARता hai.
\`\`\``,

    content: `## The shell is a text-processing pipeline

When you type a command line and press Enter, \`bash\` does **not** hand your text straight to a program. It runs your line through a sequence of transformations, in a fixed order, and only the final result is executed. Nearly every surprising shell behaviour is a consequence of this pipeline — most often of **word splitting** and **globbing** happening to an unquoted variable.

## The expansion order

The stages, in the order bash applies them:

1. **Brace expansion.** \`file{1,2,3}.log\` → \`file1.log file2.log file3.log\`. Purely textual, done first.
2. **Tilde expansion.** \`~\` → your home directory, \`~user\` → that user's home.
3. **Parameter (variable) expansion.** \`$VAR\`, \`\${VAR}\`, and the powerful forms: \`\${VAR:-default}\` (use default if unset), \`\${VAR:?msg}\` (error if unset), \`\${VAR##*/}\` (strip longest leading match — basename), \`\${VAR%/*}\` (strip trailing — dirname), \`\${VAR/old/new}\` (substitute), \`\${#VAR}\` (length), \`\${VAR^^}\` (uppercase).
4. **Command substitution.** \`$(command)\` runs \`command\` and replaces the whole \`$(...)\` with its standard output (trailing newlines stripped). The older backtick form \`\` \`command\` \`\` does the same but nests badly — prefer \`$(...)\`.
5. **Arithmetic expansion.** \`$((2 + 3 * 4))\` → \`14\`. Integer only.
6. **Word splitting.** The results of steps 3–5 (but **not** literal text you typed, and **not** quoted expansions) are split into separate words wherever there is a character in **IFS** (by default space, tab, newline). This is where \`for f in $list\` iterates over the *words* of \`$list\`.
7. **Filename expansion (globbing).** Any word still containing an unquoted \`*\`, \`?\`, or \`[...]\` is replaced by the sorted list of matching filenames. If nothing matches, the pattern is left as-is (unless \`shopt -s nullglob\`, which makes it vanish, or \`failglob\`, which errors).
8. **Quote removal.** The quote characters that survived to here are stripped before the command runs.

The key point: **quoting suppresses steps 6 and 7.** A quoted \`"$var"\` is expanded (step 3) but not split (step 6) and not globbed (step 7).

## Quoting rules

- **No quotes** — \`echo $x\`: \`x\` is expanded, then the result is word-split and glob-expanded. If \`x="a b"\` this passes **two** arguments; if \`x="*.txt"\` it expands to filenames. Almost never what you want for a value.
- **Double quotes** — \`echo "$x"\`: \`x\` is expanded, but the result is a **single** argument, not split, not globbed. Variable and command substitution still happen inside. This is the correct default.
- **Single quotes** — \`echo '$x'\`: **nothing** is expanded. The characters \`$\`, \`x\` are passed literally. Use for text that must not be touched (a regex, an awk program, a password prompt string).

The habit to build: **every** \`$var\`, \`$(cmd)\`, \`\${arr[@]}\`, and \`$@\` goes in double quotes, unless you have thought about it and specifically want splitting. \`shellcheck\` (Lesson 6) flags the ones you miss.

## Exit codes and chaining

Every command exits with a status from **0 to 255**. **0 means success**; any non-zero value means failure (and the specific value often carries meaning — \`1\` generic error, \`2\` misuse, \`126\` not executable, \`127\` not found, \`128+N\` killed by signal N). \`$?\` holds the exit status of the most recent command.

Chaining operators use exit codes:

- \`cmd1 && cmd2\` — run \`cmd2\` **only if** \`cmd1\` succeeded (exit 0).
- \`cmd1 || cmd2\` — run \`cmd2\` **only if** \`cmd1\` failed (exit non-zero).
- \`cmd1 ; cmd2\` — run \`cmd2\` regardless.
- \`cmd1 | cmd2\` — pipe \`cmd1\`'s stdout to \`cmd2\`'s stdin. **The pipeline's exit status is that of the last command** — so \`false | true\` succeeds. \`set -o pipefail\` changes this so the pipeline fails if *any* stage fails (Lesson 6).

## Subshells vs command groups

- \`( commands )\` — a **subshell**: a child process with a copy of the current environment. Changes to variables, the working directory, \`umask\`, etc. inside it **do not affect the parent**. Use it to do something with side effects and then "forget" them: \`(cd /some/dir && tar -cf ../a.tar .)\` leaves you where you started.
- \`{ commands ; }\` — a **command group**: runs in the **current** shell. \`cd\` inside it changes your directory for real. Used to apply a redirection or a chain to several commands at once: \`{ echo a; echo b; } > out.txt\`. Note the required semicolon before \`}\` and the spaces.

## Why this matters for ops

Shell is the language of servers, containers, CI pipelines, and glue scripts. A deploy script that does \`rm -rf $BUILD_DIR/*\` when \`$BUILD_DIR\` is empty runs \`rm -rf /*\`. A backup loop \`for f in $FILES\` silently skips filenames with spaces. A health check \`[ $STATUS = ok ]\` breaks when \`$STATUS\` is empty (it becomes \`[ = ok ]\`, a syntax error). Every one of these is the expansion pipeline behaving exactly as specified against an unquoted expansion. Understanding the pipeline is not trivia — it is how you write shell that does not destroy things at 3am.`,

    contentHi: `## Shell ek text-processing pipeline hai

Jab aap ek command line type karके Enter dabाते ho, \`bash\` aapка text seedhе ek program ko hand **nahi** karता. Ye aapki line ko transformations ke ek sequence ke through chalाता hai, ek fixed order mein, aur sirf final result execute hoता hai. Lagभag har surprising shell behaviour is pipeline ka ek consequence hai — sabse aksar **word splitting** aur **globbing** ka jo ek unquoted variable ke saath hoता hai.

## Expansion order

1. **Brace expansion.** \`file{1,2}.log\` → \`file1.log file2.log\`.
2. **Tilde expansion.** \`~\` → home directory.
3. **Parameter expansion.** \`$VAR\`, \`\${VAR:-default}\`, \`\${VAR##*/}\` (basename), \`\${VAR%/*}\` (dirname).
4. **Command substitution.** \`$(command)\`.
5. **Arithmetic expansion.** \`$((2 + 3))\`.
6. **Word splitting.** Steps 3-5 ke results (par literal text NAHI, aur quoted expansions NAHI) IFS par words mein split hoते hain.
7. **Filename expansion (globbing).** \`*\`, \`?\`, \`[...]\` waala koi word matching filenames se replace hoता hai.
8. **Quote removal.**

Key point: **quoting steps 6 aur 7 suppress karता hai.**

## Quoting rules

- **No quotes** — \`echo $x\`: expand, phir word-split aur glob. \`x="a b"\` **do** arguments pass karता hai.
- **Double quotes** — \`echo "$x"\`: expand, par ek **single** argument, split nahi, glob nahi. **Correct default.**
- **Single quotes** — \`echo '$x'\`: **kुछ** expand nahi.

Habit: **har** \`$var\`, \`$(cmd)\`, \`"$@"\` double quotes mein.

## Exit codes aur chaining

Har command **0 se 255** status se exit karता hai. **0 matlab success.** \`$?\` = most recent command ka exit status.

- \`cmd1 && cmd2\` — \`cmd2\` sirf tab run karो agar \`cmd1\` succeeded.
- \`cmd1 || cmd2\` — \`cmd2\` sirf tab agar \`cmd1\` failed.
- \`cmd1 | cmd2\` — **pipeline ka exit status LAST command ka hai** — to \`false | true\` succeeds. \`set -o pipefail\` ise badalता hai.

## Subshells vs command groups

- \`( commands )\` — ek **subshell**: ek child process. Variables/directory ke changes **parent ko affect nahi karते**.
- \`{ commands ; }\` — ek **command group**: **current** shell mein run hoता hai. \`cd\` aapki directory real mein badalता hai.

## Ye ops ke liye kyun matter karता hai

Ek deploy script jo \`rm -rf $BUILD_DIR/*\` karता hai jab \`$BUILD_DIR\` empty hai \`rm -rf /*\` chalाता hai. Ek backup loop \`for f in $FILES\` spaces waali filenames silently skip karता hai. Expansion pipeline ko samajhna trivia nahi hai — ye aisा shell likhने ka tarika hai jo 3am par cheezen destroy nahi karता.`,

    examples: [
      {
        title: 'Word splitting: the same variable, quoted and unquoted',
        titleHi: 'Word splitting: wahi variable, quoted aur unquoted',
        code: `# VERIFY
greet="Hello   World"
echo $greet
echo "$greet"
set -- $greet
echo "arg count: $#"
set -- "$greet"
echo "arg count: $#"`,
        output: `Hello World
Hello   World
arg count: 2
arg count: 1`,
        explain: 'The unquoted `echo $greet` expands the variable and then word-splits the result on runs of whitespace, so `echo` receives two arguments, "Hello" and "World", and prints them separated by a single space — the original spacing is lost. The quoted `echo "$greet"` expands the variable but does not split, so `echo` receives one argument containing the exact string including its internal spacing. The `set -- $greet` form makes the effect countable: unquoted, it sets the positional parameters to two words, so `$#` is 2; quoted, it sets a single parameter, so `$#` is 1. This is the mechanism behind a large fraction of shell bugs — a filename or a value with spaces passed unquoted becomes multiple arguments, and a command that expected one path receives two.',
        explainHi: 'Unquoted `echo $greet` variable expand karता hai aur phir result ko whitespace par word-split karता hai, to `echo` ko do arguments milte hain, "Hello" aur "World", aur ye unhe ek single space se separated print karता hai — original spacing kho jata hai. Quoted `echo "$greet"` variable expand karता hai par split nahi karता. `set -- $greet` form effect ko countable banाता hai: unquoted, `$#` 2 hai; quoted, 1 hai. Ye shell bugs ke ek large fraction ke peeche ka mechanism hai.',
      },
      {
        title: 'Expansion order: parameter, then glob, then command substitution nested',
        titleHi: 'Expansion order: parameter, phir glob, phir command substitution nested',
        code: `# VERIFY
name=report
touch report_2024.csv report_2025.csv report_notes.txt
echo "HOME expands to a path: $([ -d "$HOME" ] && echo yes)"
echo \${name}_202*.csv
echo "arithmetic: $((3 + 4 * 2))"
files=$(ls \${name}_*.csv | wc -l)
echo "csv count via command substitution: $((files))"`,
        output: `HOME expands to a path: yes
report_2024.csv report_2025.csv
arithmetic: 11
csv count via command substitution: 2`,
        explain: 'Each line exercises a different stage of the expansion pipeline. The first uses command substitution — `$(...)` runs a test and substitutes its output — with a nested double-quoted `"$HOME"` so the path is not split even if it contained spaces. The second shows parameter expansion (`${name}` becomes `report`) followed by filename expansion: `report_202*.csv` is unquoted, so after the variable is substituted the glob matches the two CSV files and not the `.txt` file, and they are listed in sorted order. The third is arithmetic expansion, which evaluates `3 + 4 * 2` with normal operator precedence to 11. The fourth combines command substitution (capturing the line count) with arithmetic expansion (to strip the leading whitespace `wc` emits), yielding a clean `2`. The order is fixed: the variable is substituted before the glob runs, and the glob runs before the words are handed to the command.',
        explainHi: 'Har line expansion pipeline ka ek alag stage exercise karती hai. Pehli command substitution istemal karती hai ek nested double-quoted `"$HOME"` ke saath. Doosri parameter expansion dikhाती hai (`${name}` `report` ban jaता hai) phir filename expansion: `report_202*.csv` unquoted hai, to variable substitute hone ke baad glob do CSV files match karता hai aur `.txt` file nahi. Teesri arithmetic expansion hai. Chौthी command substitution ko arithmetic expansion ke saath combine karती hai. Order fixed hai: variable glob run hone se pehle substitute hoता hai.',
      },
      {
        title: 'Exit codes drive control flow: &&, ||, and $?',
        titleHi: 'Exit codes control flow drive karte hain: &&, ||, aur $?',
        code: `# VERIFY
printf 'alice:x:1000\\nbob:x:1001\\n' > users.txt
grep -q '^bob:' users.txt && echo "bob present" || echo "not found (exit $?)"
grep -q '^carol:' users.txt && echo "carol present" || echo "carol missing (grep exit $?)"
ls /no/such/path 2>/dev/null; echo "ls exit: $?"
mkdir out && cd out && echo "in \${PWD##*/}"
false; echo "after false: $?"; true; echo "after true: $?"`,
        output: `bob present
carol missing (grep exit 1)
ls exit: 2
in out
after false: 1
after true: 0`,
        explain: 'Every command reports success or failure through its exit status, and the shell operators branch on it. `grep -q` exits 0 when it finds a match and 1 when it does not, so `grep ... && A || B` runs A for `bob` (found) and B for `carol` (not found), and `$?` inside the B branch is grep\'s 1. `ls` on a missing path exits 2 (a usage-class error distinct from a generic 1), which the following `$?` prints. The `mkdir && cd && echo` chain proceeds only because each step succeeds — a failure at any link would stop it. The last line shows that `$?` always holds the status of the immediately preceding command: `echo "after false: $?"` runs right after `false` and prints 1, then `true` resets the status to 0 and `echo "after true: $?"` prints 0. This is why you must capture `$?` into a variable on the very next line if you need it later — the next command, even a simple `echo`, overwrites it.',
        explainHi: 'Har command apne exit status ke through success ya failure report karता hai, aur shell operators uspar branch karते hain. `grep -q` 0 exit karता hai jab ye ek match dhoondता hai aur 1 jab nahi, to `grep ... && A || B` `bob` ke liye A run karता hai aur `carol` ke liye B. `ls` ek missing path par 2 exit karता hai. `mkdir && cd && echo` chain sirf isliye proceed karता hai kyunki har step succeed karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# an unquoted variable in a destructive command
BUILD_DIR=$(get_build_dir)   # returns "" when the build failed
rm -rf $BUILD_DIR/*
# -> $BUILD_DIR is empty, the line becomes  rm -rf /*  and word-splitting/
#    globbing turn it into every top-level entry. this has wiped production hosts.`,
        right: `BUILD_DIR=$(get_build_dir)
: "\${BUILD_DIR:?build dir is empty, refusing to clean}"   # bail if unset/empty
rm -rf -- "\${BUILD_DIR:?}"/*
# quote the expansion, guard against empty, use -- to end option parsing,
# and consider 'set -u' so an unset variable is an error, not an empty string.`,
        why: 'When a variable used in a path is empty and unquoted, the shell removes it during expansion and what remains is a bare command against whatever the rest of the path resolves to. `rm -rf $DIR/*` with an empty `DIR` becomes `rm -rf /*`, and word splitting plus globbing then expand `/*` into every entry at the filesystem root, which `rm -rf` deletes recursively. The value could also legitimately contain spaces or glob characters that word splitting and filename expansion would act on. The defence has several layers. Quoting the expansion, `"$DIR"`, stops splitting and globbing of the value itself. A guard that aborts when the variable is unset or empty, such as the `${VAR:?message}` form or an explicit test, prevents the command from running at all in the dangerous case. Enabling `set -u` makes any reference to an unset variable an immediate error rather than a silent empty string. And `--` terminates option parsing so a value that happens to start with a dash is treated as a path, not a flag. Destructive commands built from variables need all of these, not one.',
        whyHi: 'Jab ek path mein istemal ki gayी ek variable empty aur unquoted hai, shell ise expansion ke dauran remove kar deता hai aur jo bachta hai wo ek bare command hai. `rm -rf $DIR/*` ek empty `DIR` ke saath `rm -rf /*` ban jата hai, aur word splitting plus globbing phir `/*` ko filesystem root par har entry mein expand karते hain. Defence ki кई layers hain: expansion quote karो (`"$DIR"`); ek guard jo abort karता hai jab variable unset ya empty hai (`${VAR:?message}`); `set -u` enable karो; aur `--` option parsing terminate karता hai.',
      },
      {
        wrong: `# iterating a list by word-splitting an unquoted variable
FILES="report one.txt report two.txt"
for f in $FILES; do
  process "$f"
done
# -> the loop runs FOUR times: "report", "one.txt", "report", "two.txt".
#    filenames with spaces are torn apart by word splitting.`,
        right: `# use an array — the one correct way to hold a list of items in bash
files=( "report one.txt" "report two.txt" )
for f in "\${files[@]}"; do
  process "$f"
done
# "\${files[@]}" expands to exactly the elements, each as one word, spaces intact.
# to build the array from a command, read null-delimited: mapfile -d '' ...`,
        why: 'A shell string is a single value, and putting multiple items in one string separated by spaces does not make it a list — it makes it a string that word splitting will cut on every space, including the spaces inside individual items. Looping over an unquoted `$FILES` therefore iterates over fragments, not over the intended entries, and any entry containing whitespace is split into several iterations. The construct that actually represents an ordered list of items in bash is an array. An array holds each item as a distinct element, and expanding it as `"${arr[@]}"` produces exactly those elements, each as one word with its internal whitespace preserved, regardless of what characters the elements contain. When the list comes from a command whose output could contain spaces or newlines in filenames, the safe pattern is to have that command emit null-delimited output and read it with `mapfile -d ""` or a `read -d ""` loop, because the null byte is the one character that cannot appear in a filename.',
        whyHi: 'Ek shell string ek single value hai, aur ek string mein multiple items spaces se separated rakhna ise ek list nahi banाता — ye ise ek string banाता hai jise word splitting har space par cut karega, individual items ke andar ke spaces sameत. Ek unquoted `$FILES` over looping isliye fragments over iterate karता hai. Wo construct jo actually bash mein items ki ek ordered list represent karता hai wo ek array hai. Ek array har item ko ek distinct element ke roop mein rakhता hai, aur ise `"${arr[@]}"` ke roop mein expand karना theek wo elements produce karता hai.',
      },
      {
        wrong: `# expecting cd inside ( ) to change the shell's directory
process_logs() {
  ( cd /var/log && gzip *.log )
  # ... more work that assumes we're now in /var/log ...
  ls   # <- still lists the ORIGINAL directory, not /var/log
}`,
        right: `process_logs() {
  # option A: command group — cd affects the current shell
  { cd /var/log && gzip *.log ; }
  ls   # now lists /var/log

  # option B (safer): don't rely on cwd — pass explicit paths
  gzip /var/log/*.log
}`,
        why: 'Parentheses run their contents in a subshell, which is a separate child process with its own copy of the shell state. Any change made inside — the working directory, a variable assignment, `umask`, `set` options, an exported variable — applies only within that child and is discarded when it exits. So `( cd /var/log && ... )` does move into that directory for the commands inside the parentheses, but the moment the subshell ends, the parent shell is still wherever it was, and subsequent commands run against the original directory. If the intent is to change the current shell\'s directory, a command group with braces runs in the current shell and `cd` takes effect for real. Often the better design avoids depending on the current directory at all: passing absolute paths to each command makes the code correct regardless of where it runs and removes a class of bug where a `cd` fails silently and the next command operates on the wrong directory.',
        whyHi: 'Parentheses apni contents ko ek subshell mein run karते hain, jo apni khud ki shell state ki copy ke saath ek alag child process hai. Andar kiya gaya koi bhi change — working directory, ek variable assignment — sirf us child ke andar apply hoता hai aur jab ye exit hoता hai discard ho jата hai. To `( cd /var/log && ... )` un commands ke liye us directory mein move karता hai, par jis moment subshell end hoता hai, parent shell abhi bhi jahaan tha wahaan hai. Agar intent current shell ki directory badalne ka hai, braces ke saath ek command group current shell mein run hoता hai.',
      },
    ],

    realWorld: [
      {
        en: '**A CI script that broke on a repo whose path contained a space** — `cd $CI_WORKSPACE` word-split, `cd` got the first fragment, every subsequent step ran in the wrong directory. Fixed by quoting every expansion and adding `shellcheck` to the pipeline.',
        hi: '**Ek CI script jo ek repo par toota jiske path mein ek space tha** — `cd $CI_WORKSPACE` word-split hua. Har expansion quote karके fix kiya.',
      },
      {
        en: '**A cleanup cron that ran `rm -rf "$TMP/"*` where `$TMP` came from a config that a bad deploy left empty** — the `set -u` and `${TMP:?}` guard added afterward stopped the next occurrence from touching `/`.',
        hi: '**Ek cleanup cron jo `rm -rf "$TMP/"*` chalाता tha jahaan `$TMP` ek config se aaya jise ek bad deploy ne empty chhoड़a**.',
      },
      {
        en: '**A deploy step chained as `build && test && push`** so a failing test never pushes a broken image — a one-character discipline (`&&` not `;`) that prevents a whole class of "we shipped the broken build" incidents.',
        hi: '**Ek deploy step `build && test && push` ke roop mein chained** taaki ek failing test kabhi ek broken image push na karे.',
      },
    ],

    interviewQA: [
      {
        q: 'Walk through what bash does to the line `rm $files` and why quoting matters.',
        qHi: '`rm $files` line ke saath bash kya karता hai walk through karो aur quoting kyun matter karता hai.',
        a: 'Bash processes the line through its expansion pipeline in a fixed order. It performs brace and tilde expansion, then parameter expansion, so `$files` is replaced by its value. Then, because the expansion is unquoted, the result undergoes word splitting: it is cut into separate words at every run of characters in IFS, which by default is space, tab, and newline. Then filename expansion runs: any resulting word that still contains an unquoted glob character is replaced by the sorted list of matching filenames. Finally the words are handed to `rm` as separate arguments. So if `files` is `a.txt b.txt` the command deletes two files as intended, but if `files` is `my report.txt` it deletes two files named `my` and `report.txt`, and if `files` is empty the command becomes just `rm` with no arguments, and if `files` contains `*` it deletes everything matching. Quoting the expansion as `rm "$files"` suppresses word splitting and globbing, so `rm` receives the value as a single argument — which is correct when `files` holds one path and wrong when it is meant to be a list, in which case the right structure is a bash array expanded as `"${files[@]}"`. The rule is to quote every expansion by default and use an array when you genuinely need multiple items.',
        aHi: 'Bash line ko iske expansion pipeline ke through ek fixed order mein process karता hai. Ye brace aur tilde expansion perform karता hai, phir parameter expansion, to `$files` iski value se replace hoता hai. Phir, kyunki expansion unquoted hai, result word splitting undergo karता hai: ise IFS mein characters ke har run par separate words mein cut kiya jाता hai. Phir filename expansion run hoता hai. Aakhir mein words `rm` ko separate arguments ke roop mein hand kiye jाते hain. To agar `files` `my report.txt` hai ye `my` aur `report.txt` naam ki do files delete karता hai, aur agar `files` empty hai command sirf `rm` ban jата hai. Expansion ko `rm "$files"` ke roop mein quote karना word splitting aur globbing suppress karता hai.',
      },
      {
        q: 'What is the difference between `( cmds )` and `{ cmds; }`, and when would you use each?',
        qHi: '`( cmds )` aur `{ cmds; }` mein kya antar hai, aur aap har ek kab istemal karोge?',
        a: 'Parentheses run their contents in a subshell, a child process that gets a copy of the current shell\'s environment: variables, working directory, umask, shell options, traps. Changes made inside the subshell apply only to that child and are gone when it exits, so the parent shell is unaffected. Braces run their contents in the current shell itself, so changes such as `cd`, variable assignments, or `set` options persist after the group finishes. You use a subshell when you want to do something with side effects and then discard them, for example `(cd /some/dir && make)` which builds in that directory but leaves you where you started, or `(umask 077; generate_secret > key)` which tightens the umask only for that one command. You use a command group when you want a redirection or a chain to apply to several commands at once while staying in the current shell, for example `{ echo header; cat body; } > out.txt`, or when you genuinely want the `cd` or the variable change to take effect. Two syntax details matter for braces: they need whitespace after `{` and a terminating `;` or newline before `}`, because `{` and `}` are reserved words, not operators.',
        aHi: 'Parentheses apni contents ko ek subshell mein run karते hain, ek child process jo current shell ke environment ki ek copy paता hai. Subshell ke andar kiye gaye changes sirf us child ko apply hoते hain aur jab ye exit hoता hai chale jाते hain. Braces apni contents ko current shell mein hi run karते hain, to `cd`, variable assignments jaisे changes group finish hone ke baad persist karते hain. Aap ek subshell istemal karते ho jab aap kुछ side effects ke saath karना chahते ho aur phir unhe discard karना, jaisे `(cd /some/dir && make)`. Aap ek command group istemal karते ho jab aap chahते ho ki ek redirection several commands par ek saath apply ho.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the expansion pipeline stages in order and, for the line `for f in $dir/*.log; do echo "$f"; done`, state exactly which stages act on `$dir/*.log` and in what order.',
        taskHi: 'Ek comment mein, expansion pipeline stages order mein list karो aur `for f in $dir/*.log` ke liye batao kaunसे stages act karते hain.',
        hint: 'Order: brace → tilde → parameter → command-sub → arithmetic → word-splitting → filename-expansion → quote-removal. On `$dir/*.log`: parameter expansion substitutes `$dir` first, then (unquoted) word splitting could split the value if it had spaces, then filename expansion turns the `*.log` into the sorted list of matching files. `"$f"` inside the loop is quoted, so it is only parameter-expanded, never split/globbed.',
        hintHi: 'Order: brace → tilde → parameter → command-sub → arithmetic → word-splitting → filename-expansion → quote-removal. `$dir/*.log` par: parameter expansion `$dir` substitute karता hai, phir word splitting, phir filename expansion `*.log` ko list mein badalता hai.',
      },
      {
        task: 'Write the three-layer defence for `rm -rf $CACHE_DIR/*` so it can never run against `/`. In a comment, name each layer and what specific failure it stops.',
        taskHi: '`rm -rf $CACHE_DIR/*` ke liye three-layer defence likho taaki ye kabhi `/` ke against na chal sake.',
        hint: '(1) `set -u` at the top → an unset `CACHE_DIR` is an error, not "". (2) A guard: `: "${CACHE_DIR:?cache dir unset}"` or `[[ -n "${CACHE_DIR:-}" ]] || exit 2` → stops the empty-string case. (3) Quote + `--`: `rm -rf -- "${CACHE_DIR:?}"/*` → the value isn\'t word-split/globbed and a leading-dash value isn\'t treated as a flag.',
        hintHi: '(1) `set -u` → unset `CACHE_DIR` ek error hai. (2) Ek guard: `: "${CACHE_DIR:?cache dir unset}"`. (3) Quote + `--`: `rm -rf -- "${CACHE_DIR:?}"/*`.',
      },
      {
        task: 'In a comment, explain why `for f in $(ls *.txt)` is wrong for filenames with spaces, and give two correct alternatives (a glob loop, and a null-delimited read).',
        taskHi: 'Ek comment mein, samjhाओ ki `for f in $(ls *.txt)` spaces waali filenames ke liye kyun galat hai.',
        hint: '`$(ls *.txt)` produces a string; the `for` word-splits it on spaces, so `my file.txt` becomes two iterations. Correct: (a) `for f in *.txt; do ... "$f" ...; done` — the glob yields real filenames as separate words, spaces intact; (b) `while IFS= read -r -d "" f; do ...; done < <(find . -name "*.txt" -print0)` — null bytes can\'t appear in filenames.',
        hintHi: '`$(ls *.txt)` ek string produce karता hai; `for` ise spaces par word-split karता hai. Correct: (a) `for f in *.txt` — glob real filenames deता hai; (b) `find ... -print0` + `read -d ""`.',
      },
    ],

    keyTakeaways: [
      'The shell is a PROGRAM that runs your line through a FIXED-ORDER expansion pipeline before executing: brace → tilde → parameter (`$VAR`, `${VAR:-def}`, `${VAR##*/}`) → command-substitution `$(cmd)` → arithmetic `$((..))` → WORD-SPLITTING (on IFS = space/tab/newline) → FILENAME-EXPANSION (globbing `*` `?` `[..]`) → quote-removal. ~90% of "bash bugs" are a misread of this pipeline.',
      'QUOTING suppresses word-splitting + globbing. `echo $x` = expand THEN split THEN glob (dangerous). `echo "$x"` = expand only, ONE argument (the correct default). `echo \'$x\'` = literal, NO expansion. RULE: quote EVERY expansion — `"$var"`, `"$@"`, `"$(cmd)"`, `"${arr[@]}"` — unless you deliberately want splitting. A bash string with spaces is NOT a list; use an ARRAY and expand `"${arr[@]}"`.',
      'EXIT CODES: every command exits 0–255; 0 = success, non-zero = failure (1 generic, 2 misuse, 126 not executable, 127 not found, 128+N killed by signal N). `$?` = last command\'s status. `A && B` runs B only if A succeeded; `A || B` runs B only if A failed; `A ; B` always; `A | B` exit = LAST stage\'s (so `false | true` succeeds — `set -o pipefail` fixes this).',
      'SUBSHELL `( cmds )` = a child process with a COPY of shell state — `cd`, var assignments, umask, `set` options inside DON\'T affect the parent (use it to do-then-forget: `(cd dir && make)`). COMMAND GROUP `{ cmds; }` = runs in the CURRENT shell — `cd` takes effect for real (needs a space after `{` and a `;`/newline before `}`).',
      'This is ops-critical, not trivia: `rm -rf $DIR/*` with an empty unquoted `$DIR` becomes `rm -rf /*`; `for f in $FILES` silently tears filenames with spaces into multiple iterations; `[ $X = ok ]` with an empty `$X` is a syntax error. Defence: `set -euo pipefail`, quote every expansion, guard with `${VAR:?msg}`, use `--` to end option parsing, and run `shellcheck`.',
    ],
    keyTakeawaysHi: [
      'Shell ek PROGRAM hai jo aapki line ko execute karने se pehle ek FIXED-ORDER expansion pipeline ke through chalाता hai: brace → tilde → parameter → command-substitution `$(cmd)` → arithmetic → WORD-SPLITTING (IFS par) → FILENAME-EXPANSION (globbing) → quote-removal. ~90% "bash bugs" is pipeline ka ek misread hain.',
      'QUOTING word-splitting + globbing suppress karता hai. `echo $x` = expand PHIR split PHIR glob (dangerous). `echo "$x"` = sirf expand, EK argument (correct default). RULE: HAR expansion quote karो. Ek bash string spaces ke saath ek list NAHI hai; ek ARRAY istemal karो aur `"${arr[@]}"` expand karो.',
      'EXIT CODES: har command 0–255 exit karता hai; 0 = success. `$?` = last command ka status. `A && B` B sirf tab agar A succeeded; `A || B` B sirf tab agar A failed; `A | B` exit = LAST stage ka (to `false | true` succeeds — `set -o pipefail` fix karता hai).',
      'SUBSHELL `( cmds )` = shell state ki ek COPY ke saath ek child process — andar `cd`, var assignments parent ko affect NAHI karते. COMMAND GROUP `{ cmds; }` = CURRENT shell mein run hoता hai — `cd` real mein effect karता hai.',
      'Ye ops-critical hai: `rm -rf $DIR/*` ek empty unquoted `$DIR` ke saath `rm -rf /*` ban jата hai; `for f in $FILES` spaces waali filenames ko silently multiple iterations mein tod deता hai. Defence: `set -euo pipefail`, har expansion quote karो, `${VAR:?msg}` se guard karो, `--` istemal karो, aur `shellcheck` chalाओ.',
    ],
  },

  {
    slug: 'ops-processes-signals-and-job-control',
    title: 'Processes, Signals & Job Control',
    titleHi: 'Processes, Signals Aur Job Control',
    description: 'A process has a PID, a parent, an environment, and a state. You control processes with signals — SIGTERM asks politely, SIGKILL cannot be caught, SIGHUP traditionally means "reload". Job control (&, jobs, fg, bg, nohup, disown) manages processes started from a shell.',
    descriptionHi: 'Ek process ka ek PID, ek parent, ek environment, aur ek state hoti hai. Aap processes ko signals se control karте ho — SIGTERM politely poochता hai, SIGKILL catch nahi ho sakta, SIGHUP traditionally matlab "reload". Job control (&, jobs, fg, bg, nohup, disown) shell se start kiye gaye processes manage karта hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**A building manager sending messages to tenants.** SIGTERM is a polite knock: "please wrap up and leave" — a considerate tenant saves their work, packs, and goes; a busy one might ask for a minute. SIGKILL is the manager cutting the power and physically removing the tenant mid-sentence — instant, no chance to save anything, and no tenant can refuse it. SIGHUP was historically "your phone line dropped" and tenants took it to mean "the boss left, re-read the notice board" — which is why so many daemons treat it as "reload your config". Job control is you, standing in the lobby, keeping track of which errands you sent people on: some in the foreground (you wait for them), some in the background (they run while you do other things), and `nohup` is telling someone "keep going even if I leave the building".',
      hi: '**Ek building manager tenants ko messages bhejता hua.** SIGTERM ek polite knock hai: "kripya wrap up karके chale jाओ" — ek considerate tenant apna kaam save karता hai aur jata hai. SIGKILL manager ka power cut karना aur tenant ko physically mid-sentence remove karना hai — instant, kuch save karने ka mौka nahi, aur koi tenant ise refuse nahi kar sakta. SIGHUP historically "aapki phone line drop hui" tha aur tenants ise "boss chala gaya, notice board re-read karो" matlab lेते thे — isliye itne saare daemons ise "config reload" treat karते hain. Job control aap ho, lobby mein khade, track rakhते hue kaunसे errands par aapne logon ko bheja.',
    },

    simple: `**A PROCESS: a running program. Has:**
\`\`\`
PID   | process ID (unique while alive)      PPID | parent's PID
UID   | which user it runs as               state | R running, S sleeping, Z zombie, D uninterruptible
environment (env vars), open file descriptors, a working directory, cgroup
\`\`\`
Every process except PID 1 has a parent. PID 1 (init / systemd) adopts orphans.

**SIGNALS — how you talk to a process. \`kill -SIGNAL pid\` (kill also sends non-lethal signals):**
\`\`\`
SIGTERM (15)  default   | "please terminate" — CATCHABLE. app can clean up + exit. USE THIS FIRST.
SIGKILL (9)             | "die now" — CANNOT be caught/ignored/blocked. no cleanup. LAST RESORT.
SIGINT  (2)             | Ctrl-C. "interrupt" — catchable, usually means stop.
SIGHUP  (1)             | terminal closed / by convention: "reload config" for daemons.
SIGSTOP / SIGCONT      | pause / resume (SIGSTOP also uncatchable). Ctrl-Z sends SIGTSTP.
SIGCHLD                | sent to a parent when a child exits (how 'wait' works).
\`\`\`
**Graceful shutdown = SIGTERM, wait N seconds, then SIGKILL if still alive.** (This
is exactly what \`docker stop\` and Kubernetes do.)

**JOB CONTROL — managing processes started from a shell:**
\`\`\`
cmd &          | run in background, shell keeps going. $! = its PID.
jobs           | list this shell's jobs         fg %1 | bring job 1 to foreground
bg %1          | resume job 1 in background     Ctrl-Z | suspend the foreground job
wait [pid]     | block until child(ren) exit; returns their exit code
nohup cmd &    | immune to SIGHUP — survives the terminal closing. output -> nohup.out
disown %1      | remove a job from the shell's table (won't get SIGHUP on exit)
\`\`\`

**FINDING processes:** \`ps aux\` (all, BSD style) / \`ps -ef\` (System V) ; \`pgrep -af nginx\` ;
\`pkill -TERM -f 'python worker'\` ; \`top\` / \`htop\` (live). Read \`/proc/<pid>/\` for raw detail.

**ZOMBIE (Z):** a dead child whose parent hasn't \`wait\`ed for it — harmless unless
they pile up (a bug in the parent). **ORPHAN:** parent died first — re-parented to PID 1.`,

    simpleHi: `**EK PROCESS: ek running program. Iska hai:**
\`\`\`
PID   | process ID       PPID | parent ka PID       UID | kaunsा user
state | R running, S sleeping, Z zombie, D uninterruptible
environment (env vars), open file descriptors, ek working directory, cgroup
\`\`\`
PID 1 (init / systemd) orphans adopt karता hai.

**SIGNALS — aap ek process se kaise baat karते ho. \`kill -SIGNAL pid\`:**
\`\`\`
SIGTERM (15)  default   | "kripya terminate karो" — CATCHABLE. app cleanup + exit kar sakta hai. PEHLE YE.
SIGKILL (9)             | "abhi maro" — catch/ignore/block NAHI ho sakta. koi cleanup nahi. LAST RESORT.
SIGINT  (2)             | Ctrl-C.
SIGHUP  (1)             | terminal closed / convention: daemons ke liye "reload config".
SIGSTOP / SIGCONT      | pause / resume (SIGSTOP bhi uncatchable).
\`\`\`
**Graceful shutdown = SIGTERM, N seconds wait, phir SIGKILL agar abhi bhi alive.**
(Ye exactly wo hai jo \`docker stop\` aur Kubernetes karте hain.)

**JOB CONTROL:**
\`\`\`
cmd &          | background mein run. $! = iska PID.
jobs           | is shell ke jobs list        fg %1 | job 1 ko foreground mein
bg %1          | job 1 ko background mein resume    Ctrl-Z | foreground job suspend
wait [pid]     | child(ren) exit hone tak block; unka exit code return
nohup cmd &    | SIGHUP se immune — terminal close hone se survive. output -> nohup.out
disown %1      | ek job ko shell ke table se remove
\`\`\`

**Processes DHOONDNA:** \`ps aux\` / \`ps -ef\` ; \`pgrep -af nginx\` ; \`pkill -TERM -f 'python worker'\` ;
\`top\` / \`htop\`. \`/proc/<pid>/\` raw detail ke liye.

**ZOMBIE (Z):** ek dead child jiske parent ne iske liye \`wait\` nahi kiya. **ORPHAN:** parent pehle mara.`,

    content: `## What a process is

A **process** is an instance of a running program, with:

- a **PID** (process ID) — a number unique among live processes;
- a **PPID** — the PID of the process that started it (its parent);
- the **user and group** it runs as, which determine its permissions;
- an **environment** — the set of \`KEY=value\` variables it inherited plus any it set;
- **open file descriptors** — 0 (stdin), 1 (stdout), 2 (stderr), and any files/sockets it opened;
- a **working directory**;
- a **state** — **R** (running or runnable), **S** (sleeping, waiting for an event), **D** (uninterruptible sleep, usually blocked on I/O — cannot be killed until it unblocks), **Z** (zombie), **T** (stopped);
- a **cgroup** — the control group that bounds its CPU, memory, and I/O (Module 5, and how containers are limited).

Every process except **PID 1** has a parent. PID 1 is the **init** process (on modern Linux, **systemd**); it is started by the kernel and never exits while the system runs. When a process's parent exits before it does, the process is **re-parented to PID 1**, which becomes responsible for cleaning it up when it finishes.

## Signals

A **signal** is an asynchronous notification the kernel delivers to a process. You send one with \`kill -SIGNAL pid\` (despite the name, \`kill\` sends any signal, not just lethal ones), or \`pkill\`/\`killall\` by name. A process can, for most signals, install a **handler** to run custom code when the signal arrives, **ignore** it, or let the **default action** happen (which for many signals is "terminate").

The ones that matter operationally:

- **SIGTERM (15)** — the default signal from \`kill\`. Means "please terminate". It is **catchable**: a well-written program installs a handler that stops accepting new work, finishes or safely abandons in-flight work, flushes buffers, closes connections, and exits. **This is what you send first.**
- **SIGKILL (9)** — "terminate immediately". It **cannot be caught, blocked, or ignored** — the kernel destroys the process with no opportunity for cleanup. In-flight work is lost, temp files are left, locks may be orphaned. **Last resort**, after SIGTERM has been given time and failed.
- **SIGINT (2)** — sent by Ctrl-C in a terminal. Catchable; conventionally means "the user wants to stop".
- **SIGHUP (1)** — originally "the terminal (hangup) line was dropped". By long convention, **daemons treat SIGHUP as "re-read your configuration"** without a full restart (nginx, many others). A process not handling it will terminate.
- **SIGSTOP / SIGCONT** — pause a process (SIGSTOP, also uncatchable) and resume it (SIGCONT). Ctrl-Z sends the catchable variant SIGTSTP.
- **SIGCHLD** — sent to a parent when one of its children changes state (exits or stops). The parent's \`wait\` call consumes it and collects the child's exit status.

### Graceful shutdown

The universal pattern for stopping a process cleanly is: **send SIGTERM, wait a grace period, and if the process is still alive, send SIGKILL.** This gives a well-behaved process time to shut down properly while guaranteeing that a hung one is eventually removed. \`docker stop\` does exactly this (default 10-second grace), and Kubernetes does it on pod termination (\`terminationGracePeriodSeconds\`, default 30). A program that does not handle SIGTERM gets no graceful shutdown — every stop is effectively a SIGKILL after the grace period, so **handling SIGTERM is a baseline requirement for any service.**

## Job control

Job control is the shell's mechanism for managing processes you start interactively.

- \`cmd &\` — start \`cmd\` in the **background**; the shell prints a job number and the PID, and immediately returns a prompt. \`$!\` holds the PID of the most recent background command.
- \`jobs\` — list the current shell's jobs with their numbers and states. \`jobs -p\` prints just PIDs.
- \`fg %n\` — bring job \`n\` to the **foreground** (the shell waits for it, Ctrl-C and Ctrl-Z reach it).
- \`bg %n\` — resume a **stopped** job in the background.
- **Ctrl-Z** — suspend the foreground job (sends SIGTSTP); it stops and you get the prompt back. \`fg\` or \`bg\` to continue it.
- \`wait\` — with no argument, block until **all** background children exit; with a PID or \`%n\`, wait for that one and return its exit code. Essential in scripts that fan out work and need to collect results.
- \`kill %n\` — signal a job by job number instead of PID.

### Surviving the terminal

When your shell exits, it sends **SIGHUP** to its jobs, so a background command started with \`&\` normally dies when you log out or close the terminal. Two ways to prevent that:

- \`nohup cmd &\` — runs \`cmd\` **ignoring SIGHUP**, and redirects its output to \`nohup.out\` (since there is no terminal to write to). The classic "start it and walk away".
- \`disown %n\` — removes the job from the shell's job table, so the shell no longer sends it SIGHUP on exit. \`disown -h %n\` keeps it listed but marks it not to be HUP'd.

For anything long-running and important, though, the right answer is **not** a disowned background job — it is a **systemd service** (Lesson 3) or a container, which gives you supervision, restart-on-failure, logging, and a clean lifecycle.

## Finding and inspecting processes

- \`ps aux\` — every process, BSD-style columns (USER, PID, %CPU, %MEM, VSZ, RSS, STAT, START, TIME, COMMAND). \`ps -ef\` — the System V style (UID, PID, PPID, C, STIME, TTY, TIME, CMD), which shows the parent PID.
- \`pgrep -af <pattern>\` — PIDs (and, with \`-a\`, full command lines) matching a pattern. \`pkill -SIGNAL -f <pattern>\` — signal them.
- \`top\` / \`htop\` — a live, sorted view. Key columns: %CPU, %MEM, RES (resident memory), S (state), and the load average at the top.
- \`/proc/<pid>/\` — a directory per process exposing kernel data: \`cmdline\`, \`environ\`, \`status\`, \`fd/\` (open file descriptors), \`limits\`, \`cgroup\`. Reading these is how monitoring tools work.

## Zombies and orphans

- A **zombie** (\`Z\` / \`<defunct>\`) is a process that has exited but whose parent has not yet called \`wait\` to collect its exit status. It holds no resources except a slot in the process table. A few are normal and transient. **Many** zombies means the parent has a bug — it is spawning children and not reaping them — and eventually the process table fills.
- An **orphan** is a process whose parent exited first. It is immediately **re-parented to PID 1**, which will reap it correctly. Orphans are not a problem; this is the system working as designed. (In a container, PID 1 is *your* process, so if it does not reap adopted children you get zombies — which is why container init systems like \`tini\` exist.)`,

    contentHi: `## Ek process kya hai

Ek **process** ek running program ka ek instance hai, iske saath: ek **PID**, ek **PPID** (parent ka PID), wo **user aur group** jaisе ye run karता hai, ek **environment**, **open file descriptors** (0 stdin, 1 stdout, 2 stderr), ek **working directory**, ek **state** (R running, S sleeping, D uninterruptible I/O, Z zombie, T stopped), aur ek **cgroup**.

PID 1 ke alावा har process ka ek parent hai. PID 1 **init** process hai (modern Linux par **systemd**). Jab ek process ka parent isse pehle exit karता hai, process **PID 1 ko re-parented** hoता hai.

## Signals

Ek **signal** ek asynchronous notification hai jo kernel ek process ko deliver karता hai. Aap ek \`kill -SIGNAL pid\` se bhejते ho.

- **SIGTERM (15)** — \`kill\` ka default. "Kripya terminate karो". **Catchable**: ek well-written program ek handler install karता hai jo naya work accept karना band karता hai, in-flight work finish karता hai, aur exit karता hai. **Ye aap pehle bhejते ho.**
- **SIGKILL (9)** — "turant terminate". **Catch, block, ya ignore NAHI ho sakta**. Koi cleanup nahi. **Last resort.**
- **SIGINT (2)** — Ctrl-C.
- **SIGHUP (1)** — originally "terminal line dropped". Convention se, **daemons SIGHUP ko "configuration re-read karो" treat karते hain**.
- **SIGSTOP / SIGCONT** — pause / resume.
- **SIGCHLD** — ek parent ko bheja jab iska ek child state badalता hai.

### Graceful shutdown

Ek process ko cleanly stop karने ka universal pattern: **SIGTERM bhejो, ek grace period wait karो, aur agar process abhi bhi alive hai, SIGKILL bhejो.** \`docker stop\` exactly ye karता hai (default 10-second grace), aur Kubernetes pod termination par (\`terminationGracePeriodSeconds\`, default 30). **SIGTERM handle karना kisi bhi service ke liye ek baseline requirement hai.**

## Job control

- \`cmd &\` — \`cmd\` ko **background** mein start karो. \`$!\` = most recent background command ka PID.
- \`jobs\` — current shell ke jobs list karो.
- \`fg %n\` / \`bg %n\` — foreground / background mein.
- **Ctrl-Z** — foreground job suspend karो.
- \`wait\` — background children exit hone tak block karो.

### Terminal survive karना

Jab aapका shell exit karता hai, ye apne jobs ko **SIGHUP** bhejता hai. \`nohup cmd &\` — SIGHUP ignore karके run karता hai. \`disown %n\` — job ko shell ke table se remove karता hai. Par kisi bhi long-running important cheez ke liye sahi answer ek **systemd service** (Lesson 3) ya ek container hai.

## Zombies aur orphans

- Ek **zombie** (\`Z\`) ek process hai jo exit ho gaya par jiske parent ne abhi tak iska exit status collect nahi kiya. **Bahut** zombies matlab parent mein ek bug hai.
- Ek **orphan** ek process hai jiska parent pehle exit hua. Ye turant **PID 1 ko re-parented** hoता hai. Orphans ek problem nahi hain. (Ek container mein, PID 1 *aapका* process hai, isliye \`tini\` jaisे container init systems exist karते hain.)`,

    examples: [
      {
        title: 'Job control: background, list, signal, reap',
        titleHi: 'Job control: background, list, signal, reap',
        code: `# VERIFY
sleep 20 &
sleep 20 &
echo "background jobs: $(jobs -p | wc -l | tr -d ' ')"
kill %1 %2
wait 2>/dev/null
echo "all jobs reaped"`,
        output: `background jobs: 2
all jobs reaped`,
        explain: 'Appending `&` to a command starts it in the background: the shell records it as a job, prints nothing to stdout for the job itself, and returns control immediately, so the next line runs while the two `sleep` processes are still alive. `jobs -p` lists the PIDs of this shell\'s jobs, and counting the lines confirms two are running. `kill %1 %2` signals them by job number — job numbers are a shell convenience that map to PIDs — sending the default SIGTERM, which for `sleep` (which installs no handler) causes immediate termination. `wait` with no argument then blocks until every background child has exited and been reaped, so the process table is clean, and the final message prints only after that has completed. This is the pattern a script uses when it launches several independent tasks in parallel and must not proceed until all of them are done.',
        explainHi: 'Ek command mein `&` append karना ise background mein start karता hai: shell ise ek job ke roop mein record karता hai, aur turant control return karता hai, to agli line run hoती hai jab do `sleep` processes abhi bhi alive hain. `jobs -p` is shell ke jobs ke PIDs list karता hai. `kill %1 %2` unhe job number se signal karता hai, default SIGTERM bhejте hue, jo `sleep` ke liye immediate termination cause karता hai. `wait` bina argument ke phir block karता hai jab tak har background child exit aur reaped na ho.',
      },
      {
        title: 'Signal handling: SIGHUP reloads, SIGTERM exits cleanly',
        titleHi: 'Signal handling: SIGHUP reload karता hai, SIGTERM cleanly exit karता hai',
        code: `# VERIFY
cat > worker.sh <<'W'
trap 'echo "got SIGTERM, cleaning up"; exit 0' TERM
trap 'echo "got SIGHUP, reloading config"' HUP
echo "worker up (pid $$)" | sed "s/pid [0-9]*/pid <pid>/"
while true; do sleep 0.2; done
W
bash worker.sh &
wpid=$!
sleep 0.4
kill -HUP $wpid
sleep 0.3
kill -TERM $wpid
wait $wpid
echo "worker exited cleanly: $?"`,
        output: `worker up (pid <pid>)
got SIGHUP, reloading config
got SIGTERM, cleaning up
worker exited cleanly: 0`,
        explain: 'The worker script installs two signal handlers with `trap`. The handler for SIGHUP prints a reload message and returns, so the process keeps running — this is the convention daemons follow, treating SIGHUP as "re-read configuration" rather than "terminate". The handler for SIGTERM prints a cleanup message and calls `exit 0`, so the process shuts down deliberately with a success status. The parent script starts the worker in the background, sends it SIGHUP (the worker logs the reload and continues), then sends SIGTERM (the worker logs the cleanup and exits), then `wait`s for it and reads its exit code as 0. Contrast this with a program that installs no SIGTERM handler: the default action for SIGTERM is to terminate, so it would still stop, but abruptly, with no chance to flush buffers, close connections, or finish in-flight requests — which is why every service should handle SIGTERM explicitly.',
        explainHi: 'Worker script `trap` se do signal handlers install karता hai. SIGHUP ka handler ek reload message print karता hai aur return karता hai, to process chalता rehта hai — ye wo convention hai jo daemons follow karते hain. SIGTERM ka handler ek cleanup message print karता hai aur `exit 0` call karता hai. Parent script worker ko background mein start karता hai, ise SIGHUP bhejता hai (worker reload log karता hai aur continue karता hai), phir SIGTERM bhejता hai (worker cleanup log karता hai aur exit karта hai). Ek program jo koi SIGTERM handler install nahi karता ke saath contrast karो: ye abruptly stop hoगा, buffers flush karने ka koi mौka nahi.',
      },
      {
        title: 'SIGKILL cannot be caught — the escalation pattern',
        titleHi: 'SIGKILL catch nahi ho sakta — escalation pattern',
        code: `# VERIFY
cat > stubborn.sh <<'S'
trap '' TERM
echo "ignoring SIGTERM forever"
while true; do sleep 0.2; done
S
bash stubborn.sh & p=$!
sleep 0.3
kill -TERM $p
sleep 0.5
if kill -0 $p 2>/dev/null; then echo "still alive after SIGTERM"; fi
kill -KILL $p
wait $p 2>/dev/null || echo "SIGKILL (9) always wins; exit $?"`,
        output: `ignoring SIGTERM forever
still alive after SIGTERM
SIGKILL (9) always wins; exit 137`,
        explain: 'The stubborn script uses `trap "" TERM` — an empty handler — which tells the kernel to ignore SIGTERM entirely, so the polite request to terminate has no effect and the process keeps looping. `kill -0` sends no signal but succeeds only if the process exists and is signalable, so it works as a liveness check: the script confirms the process is still running after SIGTERM was delivered and ignored. SIGKILL is then sent, and it cannot be trapped, ignored, or blocked — the `trap ""` is powerless against it — so the kernel destroys the process immediately. `wait` reports the exit status as 137, which is 128 plus 9, the encoding the shell uses for "terminated by signal 9". This is exactly why graceful shutdown is a two-step escalation: SIGTERM first to give a cooperative process the chance to clean up, and SIGKILL after a timeout as the guarantee that even an uncooperative or hung process is removed.',
        explainHi: 'Stubborn script `trap "" TERM` istemal karता hai — ek empty handler — jo kernel ko SIGTERM ko poori tarah ignore karने ko kehта hai, to terminate karने ka polite request ka koi effect nahi. `kill -0` koi signal nahi bhejता par sirf tab succeed karता hai agar process exists karता hai, to ye ek liveness check ke roop mein kaam karता hai. SIGKILL phir bheja jाता hai, aur ise trap, ignore, ya block nahi kiya ja sakta. `wait` exit status ko 137 report karता hai, jo 128 plus 9 hai. Isliye graceful shutdown ek two-step escalation hai: pehle SIGTERM, aur ek timeout ke baad SIGKILL as the guarantee.',
      },
    ],

    mistakes: [
      {
        wrong: `# a service that doesn't handle SIGTERM
# main.py: while True: process_one_request()   # no signal handling
# on 'docker stop' / kubectl rollout: SIGTERM is sent, ignored (default = terminate
# for a program with no handler is... to terminate — but ABRUPTLY, mid-request).
# in-flight requests are dropped, DB transactions are left open, the connection
# pool isn't drained. every deploy causes a burst of user-facing errors.`,
        right: `# install a handler that drains, then exits:
import signal, sys
shutting_down = False
def handle_term(*_):
    global shutting_down
    shutting_down = True            # stop accepting new work
signal.signal(signal.SIGTERM, handle_term)
while not shutting_down:
    process_one_request()
drain_in_flight(); close_pool(); sys.exit(0)
# now 'docker stop' (10s grace) / k8s (30s grace) let the service exit cleanly.`,
        why: 'A program that installs no handler for SIGTERM still terminates when it receives one, because that is the signal\'s default action, but it terminates at whatever point the signal is delivered, in the middle of handling a request, with a database transaction open, with responses buffered but unsent, and with connection pools and file handles not closed. Every orchestrated stop — a container being replaced during a deploy, a pod being terminated during a rollout or a scale-down — begins by sending SIGTERM and waiting a grace period before escalating to SIGKILL, so a service that does nothing with SIGTERM turns every routine deployment into an abrupt kill and a burst of dropped requests and half-finished work. Handling SIGTERM means installing a handler that flips the service into a draining state: it stops accepting new connections or pulling new jobs, allows the requests or tasks already in progress to complete, closes its database connections and flushes any buffers, and then exits with a success status, all within the grace period the platform allows. This is a baseline requirement for any long-running service, not an optimisation.',
        whyHi: 'Ek program jo SIGTERM ke liye koi handler install nahi karता abhi bhi terminate hoता hai jab ye ek receive karता hai, kyunki wo signal ka default action hai, par ye us point par terminate hoता hai jahaan signal deliver hoता hai — ek request ke beech mein, ek database transaction open ke saath. Har orchestrated stop SIGTERM bhejकर aur SIGKILL par escalate karने se pehle ek grace period wait karके shuru hoता hai, to ek service jo SIGTERM ke saath kुछ nahi karता har routine deployment ko ek abrupt kill mein badal deता hai. SIGTERM handle karना matlab ek handler install karना jo service ko ek draining state mein flip karता hai.',
      },
      {
        wrong: `# reaching for kill -9 first
# "the process won't die"  ->  kill -9 <pid>
# -> you gave it no chance to shut down. it dropped in-flight work, left temp
#    files and a stale lock file, and now the NEXT start fails because the lock
#    is held by a PID that no longer exists.`,
        right: `# escalate: TERM, wait, THEN KILL
kill -TERM "$pid"
for i in $(seq 1 10); do kill -0 "$pid" 2>/dev/null || break; sleep 1; done
kill -0 "$pid" 2>/dev/null && kill -KILL "$pid"
# only use -9 when -15 has demonstrably failed. and if a process REGULARLY needs
# -9, that's a bug in the process (no SIGTERM handler) — fix that.`,
        why: 'SIGKILL removes a process instantly and unconditionally, with no opportunity for it to run shutdown logic, so anything the process was responsible for finishing or cleaning up is simply abandoned: in-progress work is lost, temporary files and partially-written outputs remain, and lock files or lease records that the process would have released on a clean exit are left behind, referencing a PID that is now gone. The next start of the service then often fails because it finds the stale lock and refuses to run. Sending SIGTERM first, waiting for the process to exit on its own, and only sending SIGKILL if it is still alive after a reasonable timeout gives a well-behaved process the chance to do its cleanup and reserves the forcible kill for the case where the process is genuinely hung or ignoring signals. If a particular process routinely fails to stop on SIGTERM and always needs SIGKILL, that is a defect in the process — it lacks a signal handler — and the fix is to add one, not to normalise starting with SIGKILL.',
        whyHi: 'SIGKILL ek process ko turant aur unconditionally remove karता hai, iske liye shutdown logic run karने ka koi mौka nahi, to jo bhi process finish ya clean up karने ke liye responsible tha wo simply abandon ho jाता hai: in-progress work lost, temporary files remain, aur lock files jo process ek clean exit par release karता piche reh jाते hain, ek PID reference karते hue jo ab chala gaya. Service ka agla start phir aksar fail hoता hai. Pehle SIGTERM bhejना, process ke apne aap exit hone ka wait karना, aur sirf SIGKILL bhejना agar ye ek reasonable timeout ke baad abhi bhi alive hai, ek well-behaved process ko iski cleanup karने ka mौka deता hai.',
      },
      {
        wrong: `# using a disowned background job for a long-running task
nohup ./import-job.sh &
disown
# close laptop / lose SSH.
# -> it MIGHT survive (nohup), but: no restart if it crashes, no log rotation,
//    no resource limits, no way to see its status later, output dumped in
//    nohup.out, and if the box reboots it's just gone.`,
        right: `# a systemd unit (Lesson 3) — or a container. supervision as a first-class thing:
# /etc/systemd/system/import-job.service
#   [Service]
#   ExecStart=/opt/app/import-job.sh
#   Restart=on-failure
#   RestartSec=10
# journalctl -u import-job   # logs.   systemctl status import-job   # state.
# survives reboots, restarts on crash, logs are managed, limits are enforceable.`,
        why: 'Detaching a background job with nohup and disown can keep it running after the terminal closes, but it provides none of the operational properties a long-running task needs. There is no supervision, so if the process crashes it stays dead. There is no defined logging, so its output accumulates in a file with no rotation. There are no resource limits, so a runaway can consume the host. There is no status interface, so checking whether it is still running or what it is doing means hunting through `ps`. And it does not survive a reboot. A service manager such as systemd, or a container platform, treats all of these as first-class concerns: it starts the process, restarts it on failure according to a policy, captures its output into a managed log with querying and retention, can apply CPU and memory limits, exposes its current state and recent history through a command, and brings it back automatically after the machine restarts. Anything that is meant to run continuously belongs under a supervisor, not in a disowned shell job.',
        whyHi: 'Ek background job ko nohup aur disown se detach karना ise terminal close hone ke baad running rakh sakта hai, par ye un operational properties mein se koi provide nahi karता jo ek long-running task ko chahiye. Koi supervision nahi hai, to agar process crash hoता hai ye dead rehта hai. Koi defined logging nahi, koi resource limits nahi, koi status interface nahi, aur ye ek reboot survive nahi karता. Ek service manager jaisा systemd, ya ek container platform, in sabko first-class concerns ke roop mein treat karता hai. Kुछ bhi jo continuously run karने ke liye hai ek supervisor ke under rehта hai.',
      },
    ],

    realWorld: [
      {
        en: '**A rollout that caused a spike of 502s on every deploy** — the service ignored SIGTERM, so Kubernetes SIGKILL\'d it after the 30s grace, dropping in-flight requests. Adding a SIGTERM handler that drained connections removed the spike entirely.',
        hi: '**Ek rollout jo har deploy par 502s ki ek spike cause karता tha** — service SIGTERM ignore karता tha. Ek SIGTERM handler add karके spike poori tarah hataya.',
      },
      {
        en: '**A worker that piled up thousands of zombie processes** — it forked subprocesses and never `wait`ed for them; the process table filled and the host stopped accepting new connections. Fixed by reaping children (and, in the container, using `tini` as PID 1).',
        hi: '**Ek worker jo hazaron zombie processes pile up karता tha** — ye subprocesses fork karता tha aur kabhi `wait` nahi karता tha. Children reap karके fix kiya.',
      },
      {
        en: '**`kill -9` in a restart script that left a stale lock file** — each restart then failed until an operator manually deleted `/var/run/app.lock`. Changing the script to TERM-then-wait-then-KILL, plus making the app clear its own stale lock on start, ended the manual step.',
        hi: '**Ek restart script mein `kill -9` jo ek stale lock file chhoड़ता tha** — har restart phir fail hoता tha. Script ko TERM-then-wait-then-KILL mein badalकर fix kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain the difference between SIGTERM and SIGKILL and how a graceful shutdown works.',
        qHi: 'SIGTERM aur SIGKILL mein antar samjhाओ aur ek graceful shutdown kaise kaam karता hai.',
        a: 'SIGTERM is the default termination signal and it is catchable: a process can install a handler that runs when the signal arrives, and a well-written service uses that handler to shut down cleanly — it stops accepting new requests or jobs, lets work already in progress finish or abandons it safely, flushes buffers, closes database connections and file handles, and then exits with a success status. SIGKILL cannot be caught, blocked, or ignored; the kernel destroys the process immediately with no opportunity to run any cleanup code, so in-flight work is lost and temporary files and lock records are left behind. A graceful shutdown is a two-step escalation that combines them. First SIGTERM is sent, giving a cooperative process the chance to do its cleanup. Then the shutdown logic waits a grace period. If the process has exited on its own within that period, the shutdown is clean and complete. If it is still alive at the end of the grace period — because it is hung, or ignoring the signal, or its cleanup is taking too long — SIGKILL is sent as a guarantee that the process is removed. This is exactly what `docker stop` does with a default ten-second grace, and what Kubernetes does on pod termination with a configurable grace period defaulting to thirty seconds. A service that does not handle SIGTERM gets no graceful shutdown; every stop becomes an abrupt kill after the grace period elapses.',
        aHi: 'SIGTERM default termination signal hai aur ye catchable hai: ek process ek handler install kar sakта hai jo signal aane par run hoता hai, aur ek well-written service us handler ko cleanly shut down karने ke liye istemal karता hai — ye naye requests accept karना band karता hai, in-progress work finish karता hai, buffers flush karता hai, aur exit karता hai. SIGKILL catch, block, ya ignore nahi kiya ja sakta; kernel process ko turant destroy karता hai. Ek graceful shutdown ek two-step escalation hai: pehle SIGTERM bheja jाता hai, phir shutdown logic ek grace period wait karता hai, aur agar process abhi bhi alive hai to SIGKILL bheja jाता hai as a guarantee. Ye exactly wo hai jo `docker stop` aur Kubernetes karте hain.',
      },
      {
        q: 'What are zombie and orphan processes, and which one indicates a bug?',
        qHi: 'Zombie aur orphan processes kya hain, aur kaunसा ek bug indicate karता hai?',
        a: 'When a process exits, it does not disappear entirely until its parent collects its exit status by calling `wait`. In the interval between the child exiting and the parent reaping it, the child is a zombie: it is shown in process listings with a Z state or as defunct, it holds no memory or file handles, and it occupies only an entry in the process table. A small number of transient zombies is normal, because there is always a brief gap between a child exiting and its parent noticing. A large or growing number of zombies indicates a bug in the parent process: it is creating child processes and never calling wait for them, so their table entries are never freed, and eventually the process table fills and the system cannot create new processes. An orphan is different: it is a process whose parent exited first. The kernel immediately re-parents an orphan to PID 1, the init process, which is written to reap any child it inherits, so an orphan is cleaned up correctly when it finishes and is not a problem — this is the system working as designed. The one caveat is inside a container, where PID 1 is the application\'s own main process rather than a real init; if that process does not reap the children it adopts, zombies accumulate, which is why minimal init programs like tini are run as PID 1 in containers that spawn subprocesses.',
        aHi: 'Jab ek process exit karता hai, ye poori tarah disappear nahi hoता jab tak iska parent `wait` call karके iska exit status collect nahi karता. Child ke exit aur parent ke ise reap karने ke beech ke interval mein, child ek zombie hai: ye process listings mein Z state ke saath dikhता hai, koi memory nahi rakhता, aur sirf process table mein ek entry occupy karता hai. Kुछ transient zombies normal hain. Ek large ya growing number of zombies parent process mein ek bug indicate karता hai. Ek orphan alag hai: ye ek process hai jiska parent pehle exit hua. Kernel turant ek orphan ko PID 1 ko re-parent karता hai. Ek caveat ek container ke andar hai, jahaan PID 1 application ka apna main process hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write the SIGTERM/SIGKILL escalation as a shell snippet: send SIGTERM to `$pid`, poll for up to 10 seconds, then SIGKILL if still alive. Explain what each of `docker stop` and Kubernetes contribute (grace periods).',
        taskHi: 'Ek comment mein, SIGTERM/SIGKILL escalation ek shell snippet ke roop mein likho: `$pid` ko SIGTERM bhejो, 10 seconds tak poll karो, phir SIGKILL agar abhi bhi alive.',
        hint: '`kill -TERM "$pid"; for i in $(seq 10); do kill -0 "$pid" 2>/dev/null || break; sleep 1; done; kill -0 "$pid" 2>/dev/null && kill -KILL "$pid"`. `docker stop` = SIGTERM then SIGKILL after a 10s default grace (`--time`); Kubernetes = SIGTERM (+ preStop hook) then SIGKILL after `terminationGracePeriodSeconds` (default 30).',
        hintHi: '`kill -TERM "$pid"; for i in $(seq 10); do kill -0 "$pid" 2>/dev/null || break; sleep 1; done; kill -KILL "$pid"`. `docker stop` = SIGTERM phir 10s grace ke baad SIGKILL; Kubernetes = SIGTERM phir `terminationGracePeriodSeconds` (default 30).',
      },
      {
        task: 'In a comment, describe what happens on `docker stop` to (a) a service with a proper SIGTERM handler that drains for 3s, and (b) a service that ignores SIGTERM — for both the 10s-grace default and a `--time=2` override.',
        taskHi: 'Ek comment mein, batao `docker stop` par kya hota hai (a) ek proper SIGTERM handler waali service jo 3s drain karती hai, aur (b) ek service jo SIGTERM ignore karती hai.',
        hint: '(a) 10s grace: SIGTERM → drains in 3s → exits cleanly, no SIGKILL. `--time=2`: SIGTERM → still draining at 2s → SIGKILL, in-flight work lost. (b) 10s grace: SIGTERM ignored → SIGKILL at 10s, abrupt. `--time=2`: SIGKILL at 2s. A short grace only matters if the service actually uses it.',
        hintHi: '(a) 10s grace: SIGTERM → 3s mein drain → cleanly exit. `--time=2`: 2s par abhi bhi draining → SIGKILL. (b) 10s grace: SIGTERM ignored → 10s par SIGKILL. `--time=2`: 2s par SIGKILL.',
      },
      {
        task: 'In a comment, explain why running a long import as `nohup ./import.sh & disown` is worse than a systemd service, listing at least four operational properties the service manager provides that the disowned job does not.',
        taskHi: 'Ek comment mein, samjhाओ ki ek long import ko `nohup ./import.sh & disown` ke roop mein chalाना ek systemd service se kyun worse hai.',
        hint: 'The disowned job has: no restart-on-crash, no managed/rotated logging (dumps to nohup.out), no resource limits, no status/history interface (hunt through ps), no survival across reboot, no dependency ordering. systemd gives: `Restart=on-failure` + `RestartSec`, journald logging with `journalctl -u`, `MemoryMax`/`CPUQuota`, `systemctl status`, start-on-boot via `WantedBy`, and `After=`/`Requires=` ordering.',
        hintHi: 'Disowned job ke paas: koi restart-on-crash nahi, koi managed logging nahi, koi resource limits nahi, koi status interface nahi, reboot survive nahi. systemd deता hai: `Restart=on-failure`, journald logging, `MemoryMax`, `systemctl status`, start-on-boot.',
      },
    ],

    keyTakeaways: [
      'A PROCESS has: a PID, a PPID (parent), the UID it runs as, an environment, open file descriptors (0/1/2 + more), a working directory, a STATE (R running, S sleeping, D uninterruptible-I/O — can\'t be killed until it unblocks, Z zombie, T stopped), and a cgroup. Every process except PID 1 (init/systemd) has a parent; PID 1 adopts and reaps orphans.',
      'SIGNALS (`kill -SIGNAL pid` — `kill` sends any signal, not just lethal): SIGTERM (15, the default) = "please terminate", CATCHABLE — a good service handles it to drain + exit cleanly; SIGKILL (9) = CANNOT be caught/blocked/ignored, instant, NO cleanup — LAST RESORT; SIGINT (2) = Ctrl-C; SIGHUP (1) = terminal closed / by convention "reload config" for daemons; SIGSTOP/SIGCONT = pause/resume; SIGCHLD = sent to a parent when a child exits.',
      'GRACEFUL SHUTDOWN = send SIGTERM → wait a grace period → SIGKILL if still alive. `docker stop` (10s default) and Kubernetes (`terminationGracePeriodSeconds`, default 30) do exactly this. A service that DOESN\'T handle SIGTERM gets NO graceful shutdown — every stop is an abrupt kill after the grace period, dropping in-flight requests + open transactions. Handling SIGTERM is a BASELINE requirement. Never reach for `kill -9` first — it strands stale lock files that break the next start.',
      'JOB CONTROL: `cmd &` = background (`$!` = its PID); `jobs` = list; `fg %n` / `bg %n`; Ctrl-Z = suspend the foreground job; `wait [pid]` = block until child(ren) exit, returns exit code. On shell exit, jobs get SIGHUP → `nohup cmd &` (ignores SIGHUP, output→nohup.out) or `disown %n` to survive. But for anything long-running + important, use a SYSTEMD SERVICE or a container — supervision, restart-on-failure, managed logs, limits, reboot survival.',
      'FIND processes: `ps aux` (BSD cols) / `ps -ef` (shows PPID); `pgrep -af <pat>` / `pkill -SIGNAL -f <pat>`; `top`/`htop` (live); `/proc/<pid>/` (cmdline, environ, status, fd/, limits, cgroup). ZOMBIE (Z/<defunct>) = a dead child the parent hasn\'t `wait`ed for — a few are normal, MANY = a parent bug (not reaping) that fills the process table. ORPHAN = parent died first → re-parented to PID 1, cleaned up fine (NOT a bug). In a CONTAINER, PID 1 is your app — if it doesn\'t reap adopted children you get zombies, hence `tini`.',
    ],
    keyTakeawaysHi: [
      'Ek PROCESS ka hai: ek PID, ek PPID (parent), UID, ek environment, open file descriptors, ek working directory, ek STATE (R running, S sleeping, D uninterruptible-I/O, Z zombie, T stopped), aur ek cgroup. PID 1 (init/systemd) ke alावा har process ka ek parent hai; PID 1 orphans adopt aur reap karता hai.',
      'SIGNALS (`kill -SIGNAL pid`): SIGTERM (15, default) = "kripya terminate karो", CATCHABLE — ek achhी service ise handle karती hai drain + cleanly exit karने ke liye; SIGKILL (9) = catch/block/ignore NAHI ho sakta, instant, KOI cleanup nahi — LAST RESORT; SIGINT (2) = Ctrl-C; SIGHUP (1) = convention se "reload config"; SIGSTOP/SIGCONT = pause/resume.',
      'GRACEFUL SHUTDOWN = SIGTERM bhejो → ek grace period wait karो → SIGKILL agar abhi bhi alive. `docker stop` (10s default) aur Kubernetes (default 30s) exactly ye karते hain. Ek service jo SIGTERM handle NAHI karती ko KOI graceful shutdown nahi milता. SIGTERM handle karना ek BASELINE requirement hai. Kabhi pehle `kill -9` mat karो.',
      'JOB CONTROL: `cmd &` = background (`$!` = PID); `jobs`; `fg %n` / `bg %n`; Ctrl-Z = suspend; `wait [pid]`. Shell exit par jobs ko SIGHUP milता hai → `nohup cmd &` ya `disown %n`. Par kisi bhi long-running important cheez ke liye ek SYSTEMD SERVICE ya ek container istemal karो.',
      'Processes DHOONDО: `ps aux` / `ps -ef` (PPID dikhता hai); `pgrep -af` / `pkill -SIGNAL -f`; `top`/`htop`; `/proc/<pid>/`. ZOMBIE = ek dead child jiske liye parent ne `wait` nahi kiya — kुछ normal, BAHUT = ek parent bug. ORPHAN = parent pehle mara → PID 1 ko re-parented, theek clean up hoता hai. Ek CONTAINER mein PID 1 aapका app hai — isliye `tini`.',
    ],
  },

  {
    slug: 'ops-systemd-and-service-management',
    title: 'systemd & Service Management',
    titleHi: 'systemd Aur Service Management',
    description: 'systemd is the init system and service manager on almost every modern Linux distribution. It starts services in dependency order, keeps them running, captures their logs into the journal, and runs scheduled work via timers. A unit file is the declarative spec for one managed thing.',
    descriptionHi: 'systemd lagभag har modern Linux distribution par init system aur service manager hai. Ye services ko dependency order mein start karता hai, unhe running rakhता hai, unke logs ko journal mein capture karता hai, aur timers ke through scheduled work chalाता hai. Ek unit file ek managed cheez ke liye declarative spec hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A building operations manager who reads a set of index cards — one per system (heating, lifts, security, the 6am lobby-cleaning crew) — and gets everything running in the right order.** The heating card says "needs power on first"; the lift card says "needs the safety system running"; the manager builds the dependency graph and starts things accordingly. If a system stops, the manager notices and, per that system\'s card, restarts it (or not). Every system\'s output is piped into one central logbook the manager keeps, searchable by system and by time. And some cards are not "run continuously" but "run at 6am daily" — those are timers. `systemctl` is how you talk to the manager; `journalctl` is how you read the logbook.',
      hi: '**Ek building operations manager jo index cards ka ek set padhता hai — prati system ek (heating, lifts, security) — aur sab кुछ sahi order mein running karवाता hai.** Heating card kehта hai "pehle power on chahiye"; lift card kehта hai "safety system running chahiye"; manager dependency graph banाता hai. Agar ek system stop hoता hai, manager notice karता hai aur, us system ke card ke hisaab se, ise restart karता hai (ya nahi). Har system ka output ek central logbook mein piped hoता hai. Aur kुछ cards "6am daily run karो" hain — wo timers hain. `systemctl` aap manager se kaise baat karте ho; `journalctl` aap logbook kaise padhते ho.',
    },

    simple: `**systemd = the init system (PID 1) + service manager on ~all modern Linux
(Ubuntu, Debian, RHEL, Fedora, Arch, ...). It:**
\`\`\`
- starts everything at boot, in DEPENDENCY ORDER, in PARALLEL where possible
- keeps services running (restart policy), tracks their state
- captures every service's stdout/stderr into the JOURNAL (structured logs)
- runs scheduled jobs via TIMERS (cron replacement)
- groups each service's processes in a cgroup (resource limits, clean kill)
\`\`\`

**A UNIT = one managed thing. Types (by file extension):**
\`\`\`
.service  | a process to run (a daemon, a one-shot task)
.socket   | a socket systemd listens on, starting the .service on first connection
.timer    | a schedule that triggers a .service
.target   | a named group / sync point (multi-user.target = "normal boot done")
.mount / .path / .device / .slice
\`\`\`

**A .service FILE (\`/etc/systemd/system/myapp.service\`):**
\`\`\`ini
[Unit]
Description=My App
After=network-online.target postgresql.service
Requires=postgresql.service

[Service]
ExecStart=/opt/myapp/bin/server
Restart=on-failure
RestartSec=5s
User=myapp
Environment=NODE_ENV=production
EnvironmentFile=/etc/myapp/env
MemoryMax=512M

[Install]
WantedBy=multi-user.target        # "start this at normal boot"
\`\`\`

**systemctl — talk to the manager:**
\`\`\`
systemctl start|stop|restart|reload myapp        systemctl status myapp
systemctl enable myapp     (start at boot)       systemctl disable myapp
systemctl enable --now myapp    (enable + start)
systemctl daemon-reload    (after editing a unit file)
systemctl list-units --failed        systemctl cat myapp     systemctl edit myapp  (drop-in override)
\`\`\`

**journalctl — read the logs:**
\`\`\`
journalctl -u myapp              -u myapp -f   (follow, like tail -f)
journalctl -u myapp --since "1 hour ago"       -u myapp -p err   (priority >= error)
journalctl -u myapp -b           (this boot only)     -k   (kernel)
\`\`\`

**TIMER (cron replacement): a .timer + a .service, decoupled.**
\`\`\`ini
# backup.timer                      # backup.service
[Timer]                             [Service]
OnCalendar=*-*-* 02:00:00           Type=oneshot
Persistent=true                     ExecStart=/opt/backup.sh
[Install]
WantedBy=timers.target
\`\`\`
Advantages over cron: logs in the journal, \`Persistent=\` runs a missed job on boot,
runs under a cgroup, \`systemctl list-timers\` shows next/last run.`,

    simpleHi: `**systemd = init system (PID 1) + service manager ~har modern Linux par.** Ye:
\`\`\`
- boot par sab кुछ start karता hai, DEPENDENCY ORDER mein, jahaan possible PARALLEL mein
- services ko running rakhता hai (restart policy)
- har service ka stdout/stderr JOURNAL mein capture karता hai
- TIMERS ke through scheduled jobs chalाता hai (cron replacement)
- har service ke processes ko ek cgroup mein group karता hai
\`\`\`

**Ek UNIT = ek managed cheez. Types:**
\`\`\`
.service  | run karने ke liye ek process       .socket   | ek socket systemd listen karता hai
.timer    | ek schedule jo ek .service trigger karता hai
.target   | ek named group / sync point (multi-user.target = "normal boot done")
\`\`\`

**Ek .service FILE (\`/etc/systemd/system/myapp.service\`):**
\`\`\`ini
[Unit]
Description=My App
After=network-online.target postgresql.service
Requires=postgresql.service
[Service]
ExecStart=/opt/myapp/bin/server
Restart=on-failure
RestartSec=5s
User=myapp
EnvironmentFile=/etc/myapp/env
MemoryMax=512M
[Install]
WantedBy=multi-user.target
\`\`\`

**systemctl:**
\`\`\`
systemctl start|stop|restart|reload myapp        systemctl status myapp
systemctl enable --now myapp    (enable + start)
systemctl daemon-reload    (ek unit file edit karने ke baad)
systemctl list-units --failed        systemctl edit myapp  (drop-in override)
\`\`\`

**journalctl:**
\`\`\`
journalctl -u myapp -f          -u myapp --since "1 hour ago"     -u myapp -p err
journalctl -u myapp -b          (is boot only)
\`\`\`

**TIMER (cron replacement): ek .timer + ek .service.**
\`\`\`ini
[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true
\`\`\`
cron ke upar advantages: journal mein logs, \`Persistent=\` missed job boot par chalाता hai.`,

    content: `## What systemd is

**systemd** is the first process the kernel starts (PID 1) on nearly every current Linux distribution, and it is also the **service manager** — the thing that starts, stops, supervises, and logs every long-running service on the machine. Before systemd, this was done by shell scripts in \`/etc/init.d\` run in a fixed numeric order; systemd replaced that with a **declarative, dependency-aware, parallelised** model.

What systemd gives you over "a script in the background":

- **Dependency ordering.** You declare that your service needs the network and the database; systemd works out the order and starts independent things in parallel.
- **Supervision.** A restart policy (\`Restart=on-failure\`, \`always\`, etc.) with backoff. systemd knows whether your service is running, and brings it back if it dies.
- **Unified logging.** Everything a service writes to stdout/stderr is captured into the **journal**, a structured, indexed, queryable log store — no more each daemon inventing its own logfile.
- **Resource control.** Each service runs in its own cgroup, so you can cap CPU (\`CPUQuota=\`), memory (\`MemoryMax=\`), and I/O, and when systemd stops a service it kills the *whole* cgroup — no stray child processes.
- **Scheduled work.** **Timers** replace cron, with journal logging, missed-run handling, and randomised delays.
- **Security hardening.** Sandboxing options (\`ProtectSystem=\`, \`PrivateTmp=\`, \`NoNewPrivileges=\`, \`ReadOnlyPaths=\`, ...) that confine a service without containers.

## Units

Everything systemd manages is a **unit**, described by a **unit file**. The file's extension is its type:

- **\`.service\`** — a process (or set of processes) to run: a daemon, or a one-shot task.
- **\`.socket\`** — a socket systemd itself listens on; on the first connection it starts the associated \`.service\` and hands over the socket (socket activation — lets services start on demand and start in parallel without racing on ports).
- **\`.timer\`** — a schedule that activates another unit (usually a \`.service\`).
- **\`.target\`** — a named grouping and synchronisation point. \`multi-user.target\` means "a normal multi-user system is up"; \`graphical.target\` adds the GUI; \`network-online.target\` means the network is configured. Targets are roughly the successor to "runlevels".
- **\`.mount\`, \`.path\`, \`.device\`, \`.slice\`, \`.scope\`** — filesystem mounts, path-watchers, devices, and cgroup hierarchy nodes.

Unit files live in three locations, checked in this precedence order (later overrides earlier):

1. \`/usr/lib/systemd/system/\` — units shipped by packages. **Don't edit these.**
2. \`/run/systemd/system/\` — runtime-generated units.
3. \`/etc/systemd/system/\` — **your** units and overrides. This is where you put a custom service.

## A .service file, section by section

\`\`\`ini
[Unit]
Description=My App API
Documentation=https://example.com/runbook
After=network-online.target postgresql.service
Wants=network-online.target
Requires=postgresql.service

[Service]
Type=notify
ExecStart=/opt/myapp/bin/server
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
RestartSec=5s
User=myapp
Group=myapp
WorkingDirectory=/opt/myapp
Environment=NODE_ENV=production
EnvironmentFile=/etc/myapp/env
MemoryMax=512M
CPUQuota=150%
NoNewPrivileges=true
ProtectSystem=strict
PrivateTmp=true
ReadWritePaths=/var/lib/myapp

[Install]
WantedBy=multi-user.target
\`\`\`

- **\`[Unit]\`** — metadata and relationships. \`After=\` / \`Before=\` set *ordering* only. \`Requires=\` / \`Wants=\` set *dependency* (Requires: if the dependency fails to start, so does this; Wants: start it if you can, but proceed anyway). \`After=\` and \`Requires=\` are independent — you usually want both.
- **\`[Service]\`** — how to run it.
  - **\`Type=\`** — \`simple\` (the default; the process ExecStart launches *is* the service), \`forking\` (it daemonises — you must tell systemd the PID file), \`oneshot\` (runs and exits; for tasks), \`notify\` (the service signals systemd via \`sd_notify\` when it is actually ready — the best option for a service with a startup phase).
  - **\`ExecStart=\`** — the command. **\`ExecReload=\`** — what \`systemctl reload\` runs (often \`kill -HUP $MAINPID\`).
  - **\`Restart=\`** — \`no\`, \`on-failure\`, \`on-abnormal\`, \`always\`. **\`RestartSec=\`** — delay before restarting. Combine with \`StartLimitIntervalSec=\` / \`StartLimitBurst=\` to stop a crash-loop from hammering.
  - **\`User=\` / \`Group=\`** — run as an unprivileged account, not root.
  - **\`Environment=\`** (inline) and **\`EnvironmentFile=\`** (a file of \`KEY=value\`, the standard place for per-environment config and secrets — keep it \`chmod 600\`, owned by the service user).
  - **Resource limits** — \`MemoryMax=\`, \`CPUQuota=\`, \`TasksMax=\`.
  - **Hardening** — \`NoNewPrivileges=\`, \`ProtectSystem=strict\` (most of the filesystem read-only), \`PrivateTmp=\`, \`ReadWritePaths=\` (the exceptions).
- **\`[Install]\`** — what \`systemctl enable\` wires up. \`WantedBy=multi-user.target\` means "when the system reaches multi-user, start me" — i.e. start at boot.

## systemctl

\`\`\`
systemctl start | stop | restart | reload <unit>     # lifecycle
systemctl status <unit>                              # state + recent log lines + cgroup tree
systemctl enable <unit>                              # create the [Install] symlink -> start at boot
systemctl disable <unit>
systemctl enable --now <unit>                        # enable AND start now
systemctl is-active <unit> ; systemctl is-enabled <unit>
systemctl daemon-reload                              # re-read unit files AFTER you edit one
systemctl list-units --type=service --state=running
systemctl list-units --failed                        # what's broken
systemctl cat <unit>                                 # show the effective unit file(s)
systemctl edit <unit>                                # create a drop-in override in .../<unit>.d/
systemctl edit --full <unit>                         # copy the whole unit to /etc for editing
systemctl show <unit>                                # every property, machine-readable
\`\`\`

**\`daemon-reload\` is the step everyone forgets:** after changing a unit file on disk, systemd does not pick it up until you run \`systemctl daemon-reload\`. Then \`restart\` the service.

**Drop-ins** are the right way to customise a package-provided unit: \`systemctl edit foo\` creates \`/etc/systemd/system/foo.service.d/override.conf\` with just your changes, leaving the vendor file untouched (so a package update does not clobber your edits, and you do not have to maintain a full copy).

## journalctl

Every service's output goes to the **journal**, queried with \`journalctl\`:

\`\`\`
journalctl -u myapp                      # all logs for the unit
journalctl -u myapp -f                   # follow (like tail -f)
journalctl -u myapp -e                   # jump to the end
journalctl -u myapp --since "2024-01-01" --until "2 hours ago"
journalctl -u myapp -p err               # priority err and above (emerg..err)
journalctl -u myapp -b                   # only this boot ; -b -1 = previous boot
journalctl -u myapp -o json-pretty       # structured output (each line is a record with fields)
journalctl -k                            # kernel messages (dmesg)
journalctl --disk-usage ; journalctl --vacuum-time=7d   # size management
\`\`\`

The journal is structured — each entry has fields (\`_SYSTEMD_UNIT\`, \`PRIORITY\`, \`_PID\`, \`MESSAGE\`, and any custom fields the app emits) — so you can filter precisely. By default it may be volatile (lost on reboot); set \`Storage=persistent\` in \`/etc/systemd/journald.conf\` and create \`/var/log/journal\` to keep it. In production the journal is usually also **forwarded** to a central log system (Module 15/16).

## Timers instead of cron

A scheduled job is **two units**: a \`.service\` that does the work (\`Type=oneshot\`), and a \`.timer\` that triggers it.

\`\`\`ini
# /etc/systemd/system/backup.service
[Unit]
Description=Nightly database backup
[Service]
Type=oneshot
ExecStart=/opt/scripts/backup.sh

# /etc/systemd/system/backup.timer
[Unit]
Description=Run backup nightly
[Timer]
OnCalendar=*-*-* 02:00:00
RandomizedDelaySec=15min
Persistent=true
[Install]
WantedBy=timers.target
\`\`\`

\`systemctl enable --now backup.timer\` schedules it. \`OnCalendar=\` uses a flexible syntax (\`daily\`, \`Mon *-*-* 09:00\`, \`*:0/15\` = every 15 min); \`OnBootSec=\` / \`OnUnitActiveSec=\` schedule relative to boot or last run.

Why timers beat cron:

- **Logs go to the journal** — \`journalctl -u backup.service\` shows every run's full output. (cron mails you, or you redirect to a file.)
- **\`Persistent=true\`** — if the machine was off at 02:00, the job runs once at next boot instead of being silently skipped.
- **\`RandomizedDelaySec=\`** — spread load across a fleet so a thousand machines don't all hit the backup target at exactly 02:00.
- **Runs under a cgroup**, with resource limits and clean termination, as any service.
- **\`systemctl list-timers\`** shows the next and last run of every timer.
- The **job and the schedule are separate** — you can \`systemctl start backup.service\` to run it now, on demand, without touching the timer.`,

    contentHi: `## systemd kya hai

**systemd** wo pehla process hai jo kernel start karता hai (PID 1) lagभag har current Linux distribution par, aur ye **service manager** bhi hai. systemd se pehle ye \`/etc/init.d\` mein shell scripts se hoता tha ek fixed numeric order mein; systemd ne ise ek **declarative, dependency-aware, parallelised** model se replace kiya.

systemd jo deता hai: **dependency ordering**, **supervision** (restart policy), **unified logging** (journal), **resource control** (har service apne cgroup mein), **scheduled work** (timers), **security hardening** (sandboxing options).

## Units

systemd jo bhi manage karता hai wo ek **unit** hai. File ka extension iska type hai:
- **\`.service\`** — run karने ke liye ek process.
- **\`.socket\`** — ek socket systemd khud listen karता hai (socket activation).
- **\`.timer\`** — ek schedule jo ek doosre unit ko activate karता hai.
- **\`.target\`** — ek named grouping aur synchronisation point (\`multi-user.target\`).

Unit files teen locations mein rehते hain (precedence order): \`/usr/lib/systemd/system/\` (packages — **edit mat karो**), \`/run/systemd/system/\`, \`/etc/systemd/system/\` (**aapke** units).

## Ek .service file

- **\`[Unit]\`** — \`After=\`/\`Before=\` sirf *ordering*. \`Requires=\`/\`Wants=\` *dependency*.
- **\`[Service]\`** — \`Type=\` (\`simple\`, \`forking\`, \`oneshot\`, \`notify\`), \`ExecStart=\`, \`Restart=on-failure\` + \`RestartSec=\`, \`User=\`/\`Group=\`, \`Environment=\`/\`EnvironmentFile=\`, resource limits (\`MemoryMax=\`, \`CPUQuota=\`), hardening (\`NoNewPrivileges=\`, \`ProtectSystem=strict\`, \`PrivateTmp=\`).
- **\`[Install]\`** — \`WantedBy=multi-user.target\` matlab "boot par start karो".

## systemctl

\`start|stop|restart|reload\`, \`status\`, \`enable\`/\`disable\`, \`enable --now\`, \`daemon-reload\` (ek unit file edit karने ke BAAD), \`list-units --failed\`, \`cat\`, \`edit\` (drop-in override).

**\`daemon-reload\` wo step hai jo sab bhool jाते hain.**

**Drop-ins** ek package-provided unit customise karने ka sahi tarika hain: \`systemctl edit foo\` sirf aapke changes ke saath ek override.conf banаता hai.

## journalctl

\`journalctl -u myapp\`, \`-f\` (follow), \`--since "1 hour ago"\`, \`-p err\`, \`-b\` (is boot). Journal structured hai. Default se volatile ho sakta hai; \`Storage=persistent\` set karो.

## cron ke bजाy timers

Ek scheduled job **do units** hai: ek \`.service\` (\`Type=oneshot\`) aur ek \`.timer\`.

Timers cron se kyun behtar hain: **logs journal mein jaते hain**, **\`Persistent=true\`** missed job next boot par chalाता hai, **\`RandomizedDelaySec=\`** ek fleet par load spread karता hai, **cgroup ke under runs**, **\`systemctl list-timers\`** next/last run dikhता hai, aur **job aur schedule alag hain**.`,

    examples: [
      {
        title: 'A production-grade .service file',
        titleHi: 'Ek production-grade .service file',
        code: `# /etc/systemd/system/checkout-api.service
[Unit]
Description=Checkout API
After=network-online.target postgresql.service redis.service
Wants=network-online.target
Requires=postgresql.service

[Service]
Type=notify
ExecStart=/opt/checkout/bin/server
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
RestartSec=5s
StartLimitIntervalSec=60
StartLimitBurst=5
User=checkout
Group=checkout
EnvironmentFile=/etc/checkout/env
MemoryMax=1G
CPUQuota=200%
NoNewPrivileges=true
ProtectSystem=strict
PrivateTmp=true
ReadWritePaths=/var/lib/checkout

[Install]
WantedBy=multi-user.target

# then:
#   sudo systemctl daemon-reload
#   sudo systemctl enable --now checkout-api
#   systemctl status checkout-api
#   journalctl -u checkout-api -f`,
        output: `The unit declares ordering + hard dependency on postgres (After + Requires), runs as an unprivileged user with config from an EnvironmentFile, restarts on failure with a crash-loop limiter (5 restarts / 60s then give up), caps memory and CPU via its cgroup, and applies filesystem hardening. WantedBy=multi-user.target makes 'enable' start it at boot.`,
        explain: 'This unit shows the pieces that distinguish a supervised service from a script left running. The Unit section separates ordering from dependency: After lists what must be started first, and Requires makes the database a hard prerequisite so the API is not started, and is stopped, if postgres is not available. Type=notify means the service tells systemd when it has finished its own startup and is actually ready to serve, so anything ordered after it waits for readiness rather than for the process merely to have been launched. Restart=on-failure with the StartLimit settings brings the service back if it crashes but stops trying after five failures in a minute, so a service that cannot start does not consume the machine in a tight restart loop. Running as a dedicated unprivileged user, loading configuration and secrets from a file with restricted permissions rather than baking them in, and applying the memory and CPU limits and the filesystem protections all reduce what a compromise or a bug can do. The Install section is what systemctl enable acts on: creating the symlink that makes multi-user.target pull this service in at boot.',
        explainHi: 'Ye unit un pieces ko dikhता hai jo ek supervised service ko ek script se distinguish karте hain. Unit section ordering ko dependency se separate karता hai: After list karता hai kya pehle start honा chahiye, aur Requires database ko ek hard prerequisite banаता hai. Type=notify matlab service systemd ko bताता hai jab ye apna startup finish kar chuka hai aur actually ready hai. Restart=on-failure StartLimit settings ke saath service ko wapas laता hai agar ye crash hoता hai par ek minute mein paanch failures ke baad try karना band kar deता hai. Ek dedicated unprivileged user ke roop mein running, config aur secrets ko ek file se loading, aur memory aur CPU limits apply karना sab kम karता hai jo ek compromise kar sakta hai.',
      },
      {
        title: 'systemctl and journalctl for a failing service',
        titleHi: 'Ek failing service ke liye systemctl aur journalctl',
        code: `$ systemctl status checkout-api
* checkout-api.service - Checkout API
     Loaded: loaded (/etc/systemd/system/checkout-api.service; enabled)
     Active: failed (Result: exit-code) since Mon 2024-06-10 14:22:03 UTC; 12s ago
   Duration: 431ms
    Process: 48210 ExecStart=/opt/checkout/bin/server (code=exited, status=1/FAILURE)
   Main PID: 48210 (code=exited, status=1/FAILURE)
        CPU: 380ms

Jun 10 14:22:03 host server[48210]: FATAL: could not connect to database: password authentication failed
Jun 10 14:22:03 host systemd[1]: checkout-api.service: Main process exited, code=exited, status=1/FAILURE
Jun 10 14:22:03 host systemd[1]: checkout-api.service: Failed with result 'exit-code'.
Jun 10 14:22:03 host systemd[1]: checkout-api.service: Scheduled restart job, restart counter is at 3.

$ journalctl -u checkout-api -p err --since "5 min ago" --no-pager
Jun 10 14:21:58 host server[48180]: FATAL: could not connect to database: password authentication failed
Jun 10 14:22:00 host server[48195]: FATAL: could not connect to database: password authentication failed
Jun 10 14:22:03 host server[48210]: FATAL: could not connect to database: password authentication failed`,
        output: `systemctl status shows the state (failed), the exact ExecStart exit code (1/FAILURE), the restart counter, and the last log lines inline. journalctl -u <unit> -p err pulls just the error-priority lines across restarts, revealing a repeating DB auth failure - a bad password in the EnvironmentFile, not a code bug.`,
        explain: 'When a service is failing, systemctl status gives an immediate summary: whether the unit is loaded and enabled, its current state, how it exited (here exit code 1, a generic failure, distinct from being killed by a signal), how long it ran before failing, the restart counter showing systemd has already retried, and the most recent journal lines for that unit inline. That last part often contains the answer, as here where the process logs a fatal database authentication error before exiting. journalctl then lets the investigation widen: filtering by the unit and by error priority and by a time window shows the same failure repeating across every restart attempt, which distinguishes a transient problem from a persistent one and points at the cause. The message — password authentication failed — indicates the credentials the service is loading are wrong, so the fix is in the EnvironmentFile or the database, not in the application code. The restart limiter configured in the unit will stop the retries after the burst threshold, leaving the service in a failed state that status will continue to report.',
        explainHi: 'Jab ek service fail ho rahी hai, systemctl status ek immediate summary deता hai: unit loaded aur enabled hai ya nahi, iska current state, ye kaise exit hua (yahaan exit code 1), fail hone se pehle kitni der chala, restart counter, aur us unit ke liye most recent journal lines inline. Wo last part aksar answer contain karता hai. journalctl phir investigation ko widen karता hai: unit se aur error priority se aur ek time window se filter karना same failure ko har restart attempt ke across repeating dikhता hai. Message — password authentication failed — indicate karता hai ki credentials galat hain, to fix EnvironmentFile mein hai, application code mein nahi.',
      },
      {
        title: 'A systemd timer replacing a cron job',
        titleHi: 'Ek cron job ko replace karता ek systemd timer',
        code: `# /etc/systemd/system/cleanup.service
[Unit]
Description=Delete tmp files older than 7 days
[Service]
Type=oneshot
ExecStart=/usr/bin/find /var/app/tmp -type f -mtime +7 -delete
Nice=10
IOSchedulingClass=idle

# /etc/systemd/system/cleanup.timer
[Unit]
Description=Run tmp cleanup daily
[Timer]
OnCalendar=daily
RandomizedDelaySec=30min
Persistent=true
[Install]
WantedBy=timers.target

$ sudo systemctl daemon-reload
$ sudo systemctl enable --now cleanup.timer
$ systemctl list-timers cleanup.timer
NEXT                        LEFT     LAST  PASSED  UNIT           ACTIVATES
Tue 2024-06-11 00:17:44 UTC 9h left  n/a   n/a     cleanup.timer  cleanup.service

$ systemctl start cleanup.service          # run it now, on demand
$ journalctl -u cleanup.service --since today
Jun 10 15:02:11 host systemd[1]: Starting Delete tmp files older than 7 days...
Jun 10 15:02:11 host systemd[1]: cleanup.service: Deactivated successfully.
Jun 10 15:02:11 host systemd[1]: Finished Delete tmp files older than 7 days.`,
        output: `The timer (OnCalendar=daily + a random 0-30min offset + Persistent=true) triggers the oneshot service; list-timers shows the next scheduled run; the service can also be run on demand with systemctl start; and every run's output is in the journal under cleanup.service. cron offers none of the journal integration, missed-run handling, or on-demand running.`,
        explain: 'A scheduled task under systemd is split into two units so that the work and the schedule are independent concerns. The service is Type=oneshot: it runs the command and exits, and systemd records it as having completed rather than as running. It also carries scheduling-class hints so the cleanup does not compete with foreground work for CPU or disk I/O. The timer defines when: OnCalendar=daily fires once a day, RandomizedDelaySec adds a random offset up to thirty minutes so a fleet of machines does not all run at the same instant, and Persistent=true means that if the machine was off when the run was due, systemd runs it once at the next boot instead of skipping it silently. Enabling the timer schedules it; list-timers shows the next and last activation for every timer on the system. Because the service is a normal unit, it can be triggered manually with systemctl start for an immediate run, and every execution, scheduled or manual, has its full output captured in the journal and queryable by unit. None of the journal integration, the missed-run recovery, or the manual-trigger capability is available from cron.',
        explainHi: 'systemd ke under ek scheduled task do units mein split hoता hai taaki work aur schedule independent concerns hon. Service Type=oneshot hai: ye command run karता hai aur exit karता hai. Timer define karता hai kab: OnCalendar=daily din mein ek baar fire karता hai, RandomizedDelaySec ek random offset add karта hai, aur Persistent=true matlab agar machine off thi jab run due tha, systemd ise next boot par ek baar chalाता hai. Timer enable karना ise schedule karता hai; list-timers har timer ke liye next aur last activation dikhता hai. Kyunki service ek normal unit hai, ise systemctl start se manually trigger kiya ja sakta hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# editing a unit file and expecting systemd to notice
$ sudo vim /etc/systemd/system/myapp.service   # change Restart= and MemoryMax=
$ sudo systemctl restart myapp
# -> the service restarts with the OLD unit definition. systemd caches parsed
#    units in memory and does not re-read the file on 'restart'.`,
        right: `$ sudo vim /etc/systemd/system/myapp.service
$ sudo systemctl daemon-reload      # re-parse unit files from disk
$ sudo systemctl restart myapp      # now runs with the new definition
# 'systemctl status myapp' will warn "unit file changed on disk" if you forget.`,
        why: 'systemd parses every unit file once and holds the resulting configuration in memory, and the lifecycle commands like start, stop, and restart operate on that in-memory representation rather than re-reading the file from disk. Editing the file therefore has no effect on a running or restarted service until systemd is told to reload its configuration, which is what daemon-reload does: it re-parses all unit files and updates the in-memory state, after which a restart applies the new definition. Forgetting this step produces a confusing situation where the file on disk clearly contains the intended change but the service continues to behave according to the old settings, and status will note that the unit file has changed on disk without being reloaded. The correct sequence after any unit file edit is daemon-reload followed by restart of the affected service; a reload alone updates systemd\'s knowledge of the unit but does not re-run the service with it.',
        whyHi: 'systemd har unit file ko ek baar parse karता hai aur resulting configuration ko memory mein rakhता hai, aur start, stop, aur restart jaisे lifecycle commands us in-memory representation par operate karते hain file ko disk se re-read karने ke bजaay. File edit karना isliye ek running ya restarted service par koi effect nahi rakhता jab tak systemd ko apni configuration reload karने ko na kaha jaye, jo daemon-reload karता hai. Ise bhoolना ek confusing situation produce karता hai jahaan disk par file clearly intended change contain karती hai par service purane settings ke hisaab se behave karता rehта hai. Correct sequence: daemon-reload phir restart.',
      },
      {
        wrong: `# using Restart=always with no rate limit on a service that crashes on a bad config
[Service]
ExecStart=/opt/app/server
Restart=always
RestartSec=0
# -> the server crashes instantly on the bad config, restarts instantly, crashes
#    again... hundreds of times a second. it pegs a CPU, floods the journal, and
//    masks the actual error under a wall of restart spam.`,
        right: `[Service]
ExecStart=/opt/app/server
Restart=on-failure
RestartSec=5s
StartLimitIntervalSec=60
StartLimitBurst=5
# after 5 failures in 60s, systemd stops trying and leaves the unit 'failed'.
# 'systemctl reset-failed myapp' clears that once you've fixed the cause.`,
        why: 'A restart policy that retries immediately and without limit turns a service that fails deterministically — because of a configuration error, a missing dependency, or a code bug present at startup — into a tight loop: the process starts, fails within milliseconds, is restarted with no delay, and fails again, many times per second. This consumes CPU, fills the journal with thousands of near-identical start and failure records that bury the one line explaining the actual problem, and provides no useful behaviour because the service was never going to start. A delay between restarts via RestartSec slows the loop to a reasonable pace, and a start-limit configuration caps the number of restart attempts within a window: after that many failures systemd stops retrying and leaves the unit in a failed state, which is visible in status and in list-units --failed and does not consume resources. Once the underlying cause is fixed, reset-failed clears the failure state and the service can be started normally. Restart=on-failure rather than always also means a clean exit (exit code 0) is respected rather than treated as something to recover from.',
        whyHi: 'Ek restart policy jo turant aur bina limit ke retry karती hai ek service ko jo deterministically fail hoती hai ek tight loop mein badal deती hai: process start hoता hai, milliseconds ke andar fail hoता hai, bina delay ke restart hoता hai, aur phir fail hoता hai, prati second кई baar. Ye CPU consume karता hai, journal ko bhar deता hai, aur koi useful behaviour provide nahi karता. RestartSec ke through restarts ke beech ek delay loop ko slow karता hai, aur ek start-limit configuration ek window ke andar restart attempts ki sankhya cap karता hai: utne failures ke baad systemd retrying band kar deта hai aur unit ko ek failed state mein chhoड़ता hai.',
      },
      {
        wrong: `# running the service as root because "it needs to bind port 80"
[Service]
User=root
ExecStart=/opt/app/server --port 80
# -> a bug or an RCE in the app is now a bug or an RCE as root: full control of
//    the host. and root was only needed for one thing — binding a low port.`,
        right: `[Service]
User=app
Group=app
AmbientCapabilities=CAP_NET_BIND_SERVICE    # grant JUST the ability to bind <1024
ExecStart=/opt/app/server --port 80
NoNewPrivileges=true
ProtectSystem=strict
# the process runs unprivileged with exactly one extra capability, not as root.
# better still: bind a high port and put a reverse proxy (Module 3) on 80/443.`,
        why: 'Running a service as root gives every line of its code, and every dependency it pulls in, the full authority of the superuser, so any exploitable flaw — a remote code execution, a path traversal, an injection — becomes full control of the host rather than compromise of one unprivileged account. The usual justification is that the service needs to do one specific privileged thing, most often binding a network port below 1024. systemd can grant exactly that one capability, CAP_NET_BIND_SERVICE, to an otherwise unprivileged process through AmbientCapabilities, so the service runs as a dedicated low-privilege user and has only the additional ability it actually requires. Combined with NoNewPrivileges to prevent it gaining more, and the filesystem protections, this limits what a compromise can reach. The cleaner architecture avoids the privileged bind entirely: the service listens on a high port with no special rights, and a reverse proxy that already needs to handle TLS and routing owns ports 80 and 443.',
        whyHi: 'Ek service ko root ke roop mein running karना iske code ki har line ko superuser ki full authority deता hai, to koi bhi exploitable flaw host ka full control ban jата hai. Usual justification ye hai ki service ko ek specific privileged cheez karني chahiye, sabse aksar 1024 se neeche ek network port bind karना. systemd theek wo ek capability, CAP_NET_BIND_SERVICE, ek otherwise unprivileged process ko AmbientCapabilities ke through grant kar sakता hai. Cleaner architecture privileged bind ko poori tarah avoid karта hai: service ek high port par listen karता hai, aur ek reverse proxy ports 80 aur 443 own karता hai.',
      },
    ],

    realWorld: [
      {
        en: '**Every deploy that replaces a binary ends with `systemctl daemon-reload && systemctl restart app`** — and the deploy script asserts `systemctl is-active app` afterward, failing the deploy if the new version does not come up.',
        hi: '**Har deploy jo ek binary replace karता hai `systemctl daemon-reload && systemctl restart app` par khatam hoता hai** — aur deploy script baad mein `systemctl is-active app` assert karता hai.',
      },
      {
        en: '**A cron job that silently stopped running when a server was rebooted at 02:05 every night for a maintenance window** — moving it to a timer with `Persistent=true` meant the missed 02:00 backup ran at 02:06 on the next boot.',
        hi: '**Ek cron job jo silently running band kar diya jab ek server har raat 02:05 par reboot hoता tha** — ise `Persistent=true` waale ek timer mein move karके missed backup next boot par chala.',
      },
      {
        en: '**`systemctl list-units --failed` on every host as the first line of a health dashboard** — a single failed unit anywhere in the fleet shows up immediately, before it becomes an incident.',
        hi: '**Har host par `systemctl list-units --failed` ek health dashboard ki pehli line ke roop mein** — fleet mein kahin bhi ek single failed unit turant dikhता hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What does systemd provide over just running a process with nohup in the background?',
        qHi: 'systemd sirf ek process ko nohup se background mein running karने ke upar kya provide karता hai?',
        a: 'A background process detached with nohup runs, but nothing manages it. systemd provides the management. It orders startup by dependency: a unit declares what it needs, such as the network and the database, and systemd starts prerequisites first and independent units in parallel. It supervises: a restart policy with a delay and a rate limit brings a crashed service back and stops a service that cannot start from looping forever. It unifies logging: everything the service writes to standard output and error is captured into the journal, a structured indexed store queryable by unit, priority, and time, rather than each daemon writing its own file. It controls resources: each service runs in its own cgroup, so memory and CPU can be capped, and stopping a service kills its entire process tree with no strays. It handles scheduled work through timers, which log to the journal, can run a missed job at next boot, and can randomise their start time across a fleet. And it offers sandboxing options that confine a service\'s filesystem and privileges without a container. It also survives reboots, starting enabled units automatically, and exposes state and history through systemctl and journalctl. A disowned nohup job has none of this.',
        aHi: 'Ek background process jo nohup se detached hai chalता hai, par kuch ise manage nahi karता. systemd management provide karता hai. Ye startup ko dependency se order karता hai. Ye supervise karता hai: ek restart policy ek delay aur ek rate limit ke saath ek crashed service ko wapas laता hai. Ye logging unify karта hai: sab кुछ jo service standard output aur error par likhता hai journal mein capture hoता hai. Ye resources control karता hai: har service apne cgroup mein runs. Ye timers ke through scheduled work handle karता hai. Aur ye sandboxing options offer karता hai. Ye reboots bhi survive karता hai.',
      },
      {
        q: 'How do you correctly customise a unit file that came from a package, and why not just edit it?',
        qHi: 'Aap ek unit file ko sahi tarah kaise customise karते ho jo ek package se aayी, aur ise sirf edit kyun nahi?',
        a: 'A unit file shipped by a package lives under /usr/lib/systemd/system, and editing it in place has two problems: the next package update overwrites the file and silently discards your changes, and you now have a modified vendor file that you must reconcile by hand at every upgrade. systemd solves this with drop-ins and with the file precedence order. Files in /etc/systemd/system take precedence over the package copies, so a full override is to copy the unit there and edit it, but that means maintaining the whole file. The better mechanism is a drop-in: systemctl edit <unit> creates a directory /etc/systemd/system/<unit>.d with an override.conf containing only the settings you want to change or add, and systemd merges those on top of the vendor unit. The vendor file stays untouched, so package updates apply cleanly, and your override is small and clearly scoped to just your changes. After creating or changing a drop-in you run systemctl daemon-reload and then restart the service. systemctl cat <unit> shows the effective merged result, and systemctl edit --full copies the entire unit to /etc if you genuinely need to change most of it.',
        aHi: 'Ek package dwara shipped ek unit file /usr/lib/systemd/system ke under rehти hai, aur ise in place edit karने ki do problems hain: agla package update file overwrite karता hai aur silently aapke changes discard karता hai, aur ab aapke paas ek modified vendor file hai jise har upgrade par haath se reconcile karना padता hai. systemd ise drop-ins se solve karता hai. systemctl edit <unit> ek directory /etc/systemd/system/<unit>.d banаता hai ek override.conf ke saath jismें sirf wo settings hain jo aap badalना ya add karना chahते ho, aur systemd unhe vendor unit ke upar merge karता hai. Vendor file untouched rehती hai. Drop-in banane ke baad daemon-reload phir restart.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write a minimal but production-sane `.service` file for a Node app at `/opt/api/server.js` run by `node`, that: depends on postgres, restarts on failure with a crash-loop limit, runs as user `api`, loads env from `/etc/api/env`, caps memory at 512M, and starts at boot. Note the two commands to apply it.',
        taskHi: 'Ek comment mein, `/opt/api/server.js` par ek Node app ke liye ek minimal but production-sane `.service` file likho.',
        hint: '`[Unit]` After=network-online.target postgresql.service / Requires=postgresql.service. `[Service]` ExecStart=/usr/bin/node /opt/api/server.js / Restart=on-failure / RestartSec=5s / StartLimitIntervalSec=60 / StartLimitBurst=5 / User=api / EnvironmentFile=/etc/api/env / MemoryMax=512M. `[Install]` WantedBy=multi-user.target. Apply: `sudo systemctl daemon-reload` then `sudo systemctl enable --now api`.',
        hintHi: '`[Unit]` After= + Requires=postgresql.service. `[Service]` ExecStart=/usr/bin/node ... / Restart=on-failure / RestartSec=5s / StartLimitBurst=5 / User=api / EnvironmentFile= / MemoryMax=512M. `[Install]` WantedBy=multi-user.target. Apply: `daemon-reload` phir `enable --now`.',
      },
      {
        task: 'A service was edited on disk (new `MemoryMax=`) then `systemctl restart`ed, but `systemctl show api | grep MemoryMax` still shows the old value. In a comment, explain why and give the fix, and name the command that would have warned you.',
        taskHi: 'Ek service disk par edit kiya gaya phir `restart` kiya, par `systemctl show` abhi bhi purani value dikhता hai. Ek comment mein, samjhाओ kyun.',
        hint: 'systemd parses unit files once and keeps them in memory; `start`/`stop`/`restart` use the in-memory copy and do NOT re-read the file. Fix: `sudo systemctl daemon-reload` (re-parse from disk) then `sudo systemctl restart api`. `systemctl status api` prints a "unit file changed on disk, run daemon-reload" warning — that\'s the hint you missed.',
        hintHi: 'systemd unit files ek baar parse karता hai aur memory mein rakhता hai; `restart` file re-read NAHI karता. Fix: `daemon-reload` phir `restart`. `systemctl status` "unit file changed on disk" warn karता hai.',
      },
      {
        task: 'In a comment, convert this cron line to a systemd timer + service pair and list four things the timer version does better: `17 3 * * * /opt/scripts/rotate-logs.sh`.',
        taskHi: 'Ek comment mein, is cron line ko ek systemd timer + service pair mein convert karो aur chaar cheezen list karो jo timer version behtar karता hai.',
        hint: '`rotate-logs.service`: `[Service]` Type=oneshot / ExecStart=/opt/scripts/rotate-logs.sh. `rotate-logs.timer`: `[Timer]` OnCalendar=*-*-* 03:17:00 / RandomizedDelaySec=15min / Persistent=true / `[Install]` WantedBy=timers.target. Better: (1) full output in the journal (`journalctl -u rotate-logs.service`); (2) `Persistent=true` runs a missed job at next boot; (3) `RandomizedDelaySec` spreads fleet load; (4) runs in a cgroup with limits + can be triggered on demand via `systemctl start rotate-logs.service`; (5) `systemctl list-timers` shows next/last run.',
        hintHi: '`rotate-logs.service`: Type=oneshot / ExecStart=. `rotate-logs.timer`: OnCalendar=*-*-* 03:17:00 / Persistent=true. Better: journal mein logs, `Persistent=true` missed job chalाता hai, `RandomizedDelaySec` load spread karта hai, cgroup + on-demand `systemctl start`.',
      },
    ],

    keyTakeaways: [
      'systemd is PID 1 (the init system) + the SERVICE MANAGER on ~every modern Linux. Over "a script in the background" it adds: DEPENDENCY-ORDERED parallel startup, SUPERVISION (restart policy + rate limit), UNIFIED LOGGING (the journal — structured, indexed, queryable), RESOURCE CONTROL (each service in its own cgroup — cap CPU/mem, kill the whole tree cleanly), TIMERS (a better cron), and SANDBOXING (confine a service without a container). It also survives reboots and starts enabled units automatically.',
      'A UNIT = one managed thing; the file extension is the type: `.service` (a process), `.socket` (socket activation), `.timer` (a schedule), `.target` (a named group / sync point, e.g. `multi-user.target` = "normal boot done"). Unit files: `/usr/lib/systemd/system/` = package units (DON\'T edit), `/etc/systemd/system/` = YOUR units + overrides (higher precedence).',
      '`.service` anatomy: `[Unit]` After=/Before= (ORDERING only) vs Requires=/Wants= (DEPENDENCY — Requires: fail together; Wants: best-effort) — usually want both. `[Service]` Type= (`simple`/`forking`/`oneshot`/`notify` — notify = the service signals when actually ready), ExecStart=, Restart=on-failure + RestartSec= + StartLimitIntervalSec/Burst (crash-loop guard), User=/Group= (NOT root), Environment=/EnvironmentFile= (config + secrets, chmod 600), MemoryMax=/CPUQuota=, hardening (NoNewPrivileges=, ProtectSystem=strict, PrivateTmp=). `[Install]` WantedBy=multi-user.target = "start at boot".',
      '`systemctl`: start|stop|restart|reload, status (state + exit code + restart counter + recent logs inline), enable/disable, `enable --now` (enable + start), `list-units --failed`, `cat` (effective file), `edit` (drop-in override — the RIGHT way to customise a package unit, leaves the vendor file untouched). **`systemctl daemon-reload` is the step everyone forgets** — after editing a unit file on disk, systemd won\'t pick it up until you run it, THEN restart. `journalctl -u <unit>` (`-f` follow, `--since`, `-p err`, `-b` this boot) reads the logs.',
      'TIMERS replace cron: a `.timer` (`OnCalendar=`, `RandomizedDelaySec=`, `Persistent=true`) triggers a `.service` (`Type=oneshot`). Better than cron: output goes to the JOURNAL, `Persistent=true` runs a MISSED job at next boot (not silently skipped), `RandomizedDelaySec` spreads fleet load, runs under a cgroup with limits, `systemctl list-timers` shows next/last run, and the job + schedule are SEPARATE (run it on demand with `systemctl start <svc>`). Anything long-running belongs under a supervisor (systemd or a container), never a disowned shell job.',
    ],
    keyTakeawaysHi: [
      'systemd PID 1 (init system) + ~har modern Linux par SERVICE MANAGER hai. "Ek script background mein" ke upar ye add karता hai: DEPENDENCY-ORDERED parallel startup, SUPERVISION (restart policy + rate limit), UNIFIED LOGGING (journal), RESOURCE CONTROL (har service apne cgroup mein), TIMERS (ek behtar cron), aur SANDBOXING. Ye reboots bhi survive karता hai.',
      'Ek UNIT = ek managed cheez; file extension type hai: `.service`, `.socket`, `.timer`, `.target` (`multi-user.target` = "normal boot done"). Unit files: `/usr/lib/systemd/system/` = package units (edit MAT karो), `/etc/systemd/system/` = AAPKE units + overrides.',
      '`.service` anatomy: `[Unit]` After=/Before= (sirf ORDERING) vs Requires=/Wants= (DEPENDENCY) — usually dono. `[Service]` Type= (`simple`/`forking`/`oneshot`/`notify`), ExecStart=, Restart=on-failure + RestartSec= + StartLimit (crash-loop guard), User= (NOT root), EnvironmentFile= (config + secrets), MemoryMax=, hardening. `[Install]` WantedBy=multi-user.target = "boot par start".',
      '`systemctl`: start|stop|restart|reload, status, enable/disable, `enable --now`, `list-units --failed`, `cat`, `edit` (drop-in override — package unit customise karने ka SAHI tarika). **`systemctl daemon-reload` wo step hai jo sab bhoolते hain** — ek unit file disk par edit karने ke baad, systemd ise pick nahi karता jab tak aap ise run na karो, PHIR restart. `journalctl -u <unit>` logs padhता hai.',
      'TIMERS cron replace karते hain: ek `.timer` (`OnCalendar=`, `Persistent=true`) ek `.service` (`Type=oneshot`) trigger karता hai. cron se behtar: output JOURNAL mein, `Persistent=true` ek MISSED job next boot par chalाता hai, `RandomizedDelaySec` fleet load spread karता hai, cgroup ke under runs, `systemctl list-timers`, aur job + schedule ALAG hain. Kुछ bhi long-running ek supervisor ke under rehта hai, kabhi ek disowned shell job nahi.',
    ],
  },
];
