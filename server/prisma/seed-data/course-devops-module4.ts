/**
 * DevOps Complete Course — Module 4: Version Control & Trunk-Based Delivery, lessons 1-3.
 *
 * Lesson 1: The git object model in practice — blobs, trees, commits, refs, the
 *           index; what a commit actually is. VERIFIED against a real git.
 * Lesson 2: Branching strategies & why trunk-based enables continuous delivery —
 *           trunk-based vs GitHub Flow vs GitFlow; branch lifetime, batch size,
 *           integration frequency. Merge/squash demo VERIFIED; the rest prose.
 * Lesson 3: Short-lived branches, feature flags & decoupling deploy from release —
 *           merging incomplete work safely, keeping main releasable, expand/contract.
 *           PROSE.
 *
 * Verified examples' `code` begins with "# VERIFY" and runs in a temp git repo
 * with fixed identity + dates so hashes are deterministic (hashes are still
 * sed-normalised in expected output to survive git-version changes).
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_4: CourseLesson[] = [
  {
    slug: 'ops-the-git-object-model-in-practice',
    title: 'The Git Object Model in Practice',
    titleHi: 'Practice Mein Git Object Model',
    description: 'Git is a content-addressed store of four object types — blob, tree, commit, tag — plus refs that point into it. Almost every confusing git situation becomes obvious once you can see that a commit is a snapshot with a parent pointer, a branch is a file containing one hash, and HEAD is a pointer to a branch.',
    descriptionHi: 'Git chaar object types ka ek content-addressed store hai — blob, tree, commit, tag — plus refs jo ismें point karте hain. Lagभag har confusing git situation obvious ban jата hai jab aap dekh sakते ho ki ek commit ek parent pointer ke saath ek snapshot hai, ek branch ek file hai jismें ek hash hai, aur HEAD ek branch ka ek pointer hai.',
    difficulty: 'MEDIUM',
    duration: 26,
    order: 1,

    analogy: {
      en: '**A library where every version of every document is filed by a fingerprint of its exact contents.** Each individual file\'s bytes get a fingerprint and go on a shelf (a **blob**). A **tree** is an index card listing "these filenames map to these fingerprints" — a snapshot of one folder. A **commit** is a cover sheet stapled to one tree: "here is the whole project as of this moment, the previous cover sheet was X, written by Y at time Z". Because the fingerprint is of the contents, identical content is filed once no matter how many versions reference it, and nothing can be altered without its fingerprint changing. A **branch** is just a sticky note on the wall reading "latest = <fingerprint>", and moving a branch forward means writing a new sticky note. **HEAD** is a single arrow pointing at whichever sticky note you are currently working from.',
      hi: '**Ek library jahaan har document ke har version ko iske exact contents ke ek fingerprint se file kiya jाता hai.** Har individual file ke bytes ko ek fingerprint milता hai aur ek shelf par jाते hain (ek **blob**). Ek **tree** ek index card hai jo "ye filenames in fingerprints par map karते hain" list karता hai — ek folder ka snapshot. Ek **commit** ek cover sheet hai jo ek tree se staple hai: "is moment tak poora project, pichli cover sheet X thi, Y dwara time Z par likhी". Kyunki fingerprint contents ka hai, identical content ek baar file hoता hai chahे kitne bhi versions ise reference karें. Ek **branch** bस wall par ek sticky note hai jo "latest = <fingerprint>" padhता hai. **HEAD** ek single arrow hai jo us sticky note par point karта hai jisse aap abhi kaam kar rahे ho.',
    },

    simple: `**FOUR OBJECT TYPES, each named by the SHA of its own contents (content-addressed):**
\`\`\`
BLOB     the bytes of ONE file. no name, no metadata — just content.
TREE     a directory snapshot: a list of (mode, type, sha, name) entries.
         entries point at blobs (files) and other trees (subdirs).
COMMIT   a snapshot + history: -> one tree, -> parent commit(s), author, committer,
         message, timestamps. THE hash of a commit covers all of that.
TAG      (annotated) a named, signed pointer to one object + a message.
\`\`\`
Same content -> same SHA -> stored once. Change one byte -> new SHA everywhere up the chain.

**REFS — human-readable names that point at commits:**
\`\`\`
.git/refs/heads/main        a BRANCH = a file containing ONE commit sha
.git/refs/tags/v1.2.0       a lightweight TAG = a file with one sha (doesn't move)
.git/HEAD                   usually "ref: refs/heads/main" — a pointer to a branch
                            (detached HEAD = it holds a raw sha instead)
\`\`\`
"Move the branch" = write a new sha into that one file. That's all a commit/reset/merge does to a ref.

**THE THREE TREES you interact with:**
\`\`\`
WORKING TREE   the actual files on disk you edit
INDEX / STAGE  a proposed next commit. 'git add' copies working-tree -> index.
HEAD commit    the last commit. 'git commit' turns the index into a new commit.
\`\`\`
\`git status\` = diff(HEAD, index) + diff(index, working tree). \`git diff\` = index vs working.
\`git diff --staged\` = HEAD vs index.

**THE HISTORY IS A DAG** (directed acyclic graph) of commits linked by parent pointers.
A normal commit has 1 parent; a merge commit has 2+; the first commit has 0.
Branches and tags are just labels ON this graph — cheap to make, cheap to move.

**KEY CONSEQUENCES:**
\`\`\`
- a commit is IMMUTABLE. "amending" / "rebasing" CREATES NEW commits with new hashes;
  the old ones are orphaned (and garbage-collected later).
- branching is O(1): it writes 41 bytes. there is no copying.
- 'git' almost never deletes data immediately — reflog keeps moved refs for ~90 days.
- if you can name an object (sha, branch, tag, HEAD~3, reflog entry) you can get back to it.
\`\`\`

**INSPECT:  git cat-file -t <obj>  (type)  ·  git cat-file -p <obj>  (pretty-print)  ·
git rev-parse <rev>  ·  git log --graph --oneline --all  ·  git reflog**`,

    simpleHi: `**CHAAR OBJECT TYPES, har ek apne contents ke SHA se named (content-addressed):**
\`\`\`
BLOB     ONE file ke bytes. koi naam nahi, koi metadata nahi — sirf content.
TREE     ek directory snapshot: (mode, type, sha, name) entries ki ek list.
COMMIT   ek snapshot + history: -> ek tree, -> parent commit(s), author, committer,
         message, timestamps.
TAG      (annotated) ek named, signed pointer ek object + ek message ke saath.
\`\`\`
Same content -> same SHA -> ek baar stored. Ek byte change -> chain ke upar har jagah naya SHA.

**REFS — human-readable names jo commits par point karте hain:**
\`\`\`
.git/refs/heads/main        ek BRANCH = ek file jismें ONE commit sha
.git/refs/tags/v1.2.0       ek lightweight TAG = ek file ek sha ke saath
.git/HEAD                   usually "ref: refs/heads/main" — ek branch ka pointer
                            (detached HEAD = ye ek raw sha rakhता hai)
\`\`\`
"Branch move karो" = us ek file mein ek naya sha likhо.

**TEEN TREES jinse aap interact karте ho:**
\`\`\`
WORKING TREE   disk par actual files jo aap edit karते ho
INDEX / STAGE  ek proposed next commit. 'git add' working-tree -> index copy karता hai.
HEAD commit    last commit. 'git commit' index ko ek naye commit mein badalता hai.
\`\`\`

**HISTORY EK DAG HAI** commits ka parent pointers se linked. Ek normal commit ka 1 parent;
ek merge commit ka 2+; pehla commit ka 0. Branches aur tags is graph par sirf labels hain.

**KEY CONSEQUENCES:**
\`\`\`
- ek commit IMMUTABLE hai. "amending" / "rebasing" NAYE commits banाता hai naye hashes ke saath.
- branching O(1) hai: ye 41 bytes likhता hai.
- 'git' lagभag kabhi data turant delete nahi karता — reflog moved refs ~90 days rakhता hai.
- agar aap ek object name kar sakते ho (sha, branch, tag, HEAD~3, reflog) aap ise wapas pa sakते ho.
\`\`\`

**INSPECT:  git cat-file -t <obj>  ·  git cat-file -p <obj>  ·  git rev-parse <rev>  ·
git log --graph --oneline --all  ·  git reflog**`,

    content: `## Content addressing

Git stores everything in \`.git/objects/\`, and every object's name **is the SHA-1 (or SHA-256) hash of its contents**. This has two immediate consequences: identical content is stored exactly once regardless of how many commits or branches reference it, and any change to any byte changes that object's hash and therefore the hash of every object that references it up the chain. This is what makes git history tamper-evident — you cannot alter an old commit without every later commit's hash changing.

## The four object types

### blob

A **blob** is the raw bytes of a single file. It has no filename, no permissions, no timestamp — just content. Two files with identical content anywhere in the repo, in any commit, are the same blob.

### tree

A **tree** represents one directory. It is a list of entries, each being \`(mode, type, sha, name)\`:

\`\`\`
100644 blob a1b2c3...  README.md
100755 blob d4e5f6...  build.sh
040000 tree 789abc...  src
\`\`\`

Entries point at blobs (files) or other trees (subdirectories), so a tree is a complete recursive snapshot of a directory's contents. The mode encodes file type and the executable bit (\`100644\` normal, \`100755\` executable, \`040000\` directory, \`120000\` symlink).

### commit

A **commit** is a snapshot plus its place in history. It contains:

- a pointer to **one tree** — the complete state of the project at this commit;
- pointers to **zero or more parent commits** — zero for the first commit, one normally, two or more for a merge;
- an **author** (who wrote the change) and a **committer** (who created this commit — different after a rebase or a cherry-pick or an applied patch), each with a name, email, and timestamp;
- the **commit message**.

The commit's hash covers *all* of that, so the same tree committed with a different message, parent, or timestamp is a different commit.

### tag (annotated)

An **annotated tag** is an object: a pointer to another object (usually a commit), plus a tagger, a date, a message, and optionally a GPG signature. A **lightweight tag** is not an object at all — it is just a ref file containing a sha, like a branch that never moves.

## Refs: branches, tags, HEAD

A **ref** is a human-readable name for a commit, stored as a tiny file under \`.git/refs/\`:

- \`.git/refs/heads/main\` — the branch \`main\`. The file contains **one commit sha**, 41 bytes. That is the entire branch.
- \`.git/refs/tags/v1.2.0\` — a tag. Same idea, but by convention it never moves.
- \`.git/HEAD\` — normally contains \`ref: refs/heads/main\`, meaning "I am on branch main". This is an **attached** HEAD. A **detached** HEAD contains a raw sha instead — you are looking at a commit directly, not on any branch, and new commits will be orphaned when you leave unless you make a branch.

"Moving a branch" — what \`git commit\`, \`git reset\`, \`git merge\`, \`git rebase\` all do to the branch ref — is literally overwriting that one small file with a different sha. Branch creation writes a new such file. This is why branching in git is instantaneous and free: there is no copying of files, ever.

## The three trees

You work with three representations of the project at once:

| "Tree" | What it is | Moved by |
|---|---|---|
| **HEAD** | the last commit on the current branch | \`git commit\`, \`git reset\`, switching branches |
| **Index** (staging area) | a proposed *next* commit, stored in \`.git/index\` | \`git add\` (copies working tree → index), \`git reset <path>\` (copies HEAD → index) |
| **Working tree** | the actual files on disk that you edit | you, your editor, build tools |

- \`git status\` shows two diffs: **HEAD vs index** ("Changes to be committed") and **index vs working tree** ("Changes not staged").
- \`git diff\` = index vs working tree. \`git diff --staged\` (or \`--cached\`) = HEAD vs index. \`git diff HEAD\` = HEAD vs working tree (both).
- \`git add\` stages a snapshot of the file **as it is right now** — edit again after \`git add\` and you have two versions: staged and unstaged.
- \`git commit\` writes the index out as a new tree, wraps it in a commit object pointing at the old HEAD as parent, and moves the branch ref to the new commit.

## The history is a DAG

Commits linked by parent pointers form a **directed acyclic graph**. Time flows from parent to child; a commit knows its parents but not its children. Branches and tags are labels placed on nodes of this graph. \`main\`, \`HEAD~1\` (HEAD's first parent), \`HEAD~3\` (three first-parents back), \`HEAD^2\` (HEAD's second parent — the merged-in side), \`v1.0..HEAD\` (commits reachable from HEAD but not from v1.0) are all ways of naming nodes and ranges.

Operations in these terms:

- **commit** — add a child node, move the branch label to it.
- **merge** — create a node with two parents whose tree combines both sides; move the branch label to it. A **fast-forward** merge happens when one side is already an ancestor of the other, so no merge commit is needed — the label just slides forward.
- **rebase** — take a range of commits and *re-create* them (new hashes, new committer, new parent) on top of a different base, then move the branch label. The originals are orphaned.
- **reset** — move the branch label to a different existing commit; \`--soft\` leaves index and working tree, \`--mixed\` (default) resets the index too, \`--hard\` resets the working tree as well (this is the one that discards changes).
- **cherry-pick** — re-create one commit's *changes* as a new commit on the current branch.

## Consequences worth internalising

- **Commits are immutable.** "Editing history" — amend, rebase, squash — never modifies an object; it creates new objects and moves refs. The old commits remain in \`.git/objects\` until garbage collection, reachable via the reflog.
- **The reflog is a safety net.** \`.git/logs/\` records every position each ref (and HEAD) has held, with timestamps, for ~90 days by default. \`git reflog\` shows HEAD's history; \`git reflog show <branch>\` a branch's. A "lost" commit after a bad reset or rebase is almost always sitting in the reflog: \`git reset --hard HEAD@{1}\`.
- **If you can name it, you can recover it.** A sha, a branch, a tag, \`HEAD@{2}\`, \`main@{yesterday}\` — any name for an object lets you branch from it or reset to it.
- **\`git gc\`** eventually deletes objects that no ref and no reflog entry can reach. Until then, "deleted" work is dangling, not gone.`,

    contentHi: `## Content addressing

Git sab кुछ \`.git/objects/\` mein store karता hai, aur har object ka naam **iske contents ka SHA-1 (ya SHA-256) hash HAI**. Do consequences: identical content exactly ek baar stored hoता hai, aur kisi bhi byte mein koi bhi change us object ka hash badalता hai aur isliye har object ka hash jo ise reference karта hai chain ke upar. Ye git history ko tamper-evident banаता hai.

## Chaar object types

**blob** — ek single file ke raw bytes. Koi filename nahi, koi permissions nahi, koi timestamp nahi.

**tree** — ek directory. Ek list of entries, har ek \`(mode, type, sha, name)\`. Entries blobs (files) ya doosre trees (subdirectories) par point karते hain.

**commit** — ek snapshot plus history mein iski jagah: **ek tree** ka ek pointer; **zero ya zyada parent commits** ke pointers; ek **author** aur ek **committer**; **commit message**. Commit ka hash *ye sab* cover karता hai.

**annotated tag** — ek object: ek doosre object ka ek pointer, plus ek tagger, ek date, ek message, aur optionally ek signature.

## Refs: branches, tags, HEAD

Ek **ref** ek commit ke liye ek human-readable naam hai, \`.git/refs/\` ke under ek tiny file ke roop mein stored:
- \`.git/refs/heads/main\` — branch \`main\`. File mein **ek commit sha** hai, 41 bytes. Wo poora branch hai.
- \`.git/HEAD\` — normally \`ref: refs/heads/main\` (ek **attached** HEAD). Ek **detached** HEAD ek raw sha rakhता hai.

"Ek branch move karना" — jo \`git commit\`, \`git reset\`, \`git merge\`, \`git rebase\` sab branch ref ko karते hain — literally us ek chhoटी file ko ek alag sha se overwrite karना hai.

## Teen trees

| "Tree" | Kya hai | Kisse move hoता hai |
|---|---|---|
| **HEAD** | current branch par last commit | \`git commit\`, \`git reset\`, branches switch karna |
| **Index** (staging area) | ek proposed *next* commit | \`git add\`, \`git reset <path>\` |
| **Working tree** | disk par actual files | aap, aapका editor |

\`git status\` do diffs dikhता hai: **HEAD vs index** aur **index vs working tree**. \`git diff\` = index vs working tree. \`git diff --staged\` = HEAD vs index.

## History ek DAG hai

Parent pointers se linked commits ek **directed acyclic graph** banाते hain. Branches aur tags is graph ke nodes par labels hain. \`HEAD~1\`, \`HEAD^2\`, \`v1.0..HEAD\` sab nodes aur ranges name karने ke tarike hain.

- **commit** — ek child node add karो, branch label ise move karो.
- **merge** — do parents ke saath ek node banаओ. Ek **fast-forward** merge tab hoता hai jab ek side already doosरे ka ancestor hai.
- **rebase** — commits ki ek range ko ek alag base par *re-create* karो (naye hashes), phir branch label move karो.
- **reset** — branch label ko ek alag existing commit par move karो. \`--hard\` working tree bhi reset karता hai.

## Consequences

- **Commits immutable hain.** "History editing" naye objects banाता hai aur refs move karता hai. Purane commits reflog ke through reachable rehते hain.
- **Reflog ek safety net hai.** \`git reflog\` HEAD ki history dikhता hai. Ek bad reset ke baad ek "lost" commit lagभag hamesha reflog mein hai: \`git reset --hard HEAD@{1}\`.
- **Agar aap ise name kar sakते ho, aap ise recover kar sakते ho.**`,

    examples: [
      {
        title: 'Walking the object graph: commit -> tree -> blob',
        titleHi: 'Object graph walk karna: commit -> tree -> blob',
        code: `# VERIFY
exec 2>&1
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
export GIT_AUTHOR_NAME=dev GIT_AUTHOR_EMAIL=dev@example.com
export GIT_COMMITTER_NAME=dev GIT_COMMITTER_EMAIL=dev@example.com
export GIT_AUTHOR_DATE='2024-01-01T00:00:00Z' GIT_COMMITTER_DATE='2024-01-01T00:00:00Z'
git init -b main -q
printf 'hello\\n' > greeting.txt
git add greeting.txt
git commit -qm "add greeting"

echo "--- the commit object (tree + author + committer + message) ---"
git cat-file -p HEAD | sed -E 's/[0-9a-f]{40}/<sha>/g'
echo "--- its tree lists the files ---"
git cat-file -p 'HEAD^{tree}' | sed -E 's/[0-9a-f]{40}/<sha>/g'
echo "--- the blob is exactly the file bytes ---"
git cat-file -p HEAD:greeting.txt
echo "--- object types ---"
git cat-file -t HEAD; git cat-file -t 'HEAD^{tree}'; git cat-file -t HEAD:greeting.txt

printf 'hello\\nworld\\n' > greeting.txt
git commit -qam "append world"
echo "--- the second commit links its parent ---"
git cat-file -p HEAD | grep -E '^(tree|parent)' | sed -E 's/[0-9a-f]{40}/<sha>/g'
echo "--- HEAD -> a branch -> the tip commit ---"
cat .git/HEAD
git log --oneline | sed -E 's/^[0-9a-f]+/<sha>/'`,
        output: `--- the commit object (tree + author + committer + message) ---
tree <sha>
author dev <dev@example.com> 1704067200 +0000
committer dev <dev@example.com> 1704067200 +0000

add greeting
--- its tree lists the files ---
100644 blob <sha>	greeting.txt
--- the blob is exactly the file bytes ---
hello
--- object types ---
commit
tree
blob
--- the second commit links its parent ---
tree <sha>
parent <sha>
--- HEAD -> a branch -> the tip commit ---
ref: refs/heads/main
<sha> append world
<sha> add greeting`,
        explain: 'Every git command that shows history is a view over this graph, and cat-file lets you read the raw objects directly. The commit object is small: a single line naming its tree, a line each for author and committer with a unix timestamp and offset, a blank line, and the message. It does not contain the file contents — it points to a tree. Printing the tree shows one entry per path at that level: a mode, the word blob or tree, the object hash, and the name. Following the entry for the file reaches the blob, whose entire content is the exact bytes of the file with nothing added. The type of each object is exactly what you would expect from its position: the thing HEAD names is a commit, the thing its tree reference names is a tree, the thing the path names is a blob. After a second commit, the new commit object carries both a tree line and a parent line pointing at the previous commit, which is how history is chained — each commit references backwards, never forwards. Finally, HEAD is shown to be an indirection: it does not hold a commit hash, it holds the name of a branch, and the branch is what holds the tip commit. Understanding that these are the only moving parts makes reset, merge, and rebase legible: they rewrite objects and move refs, nothing more.',
        explainHi: 'Har git command jo history dikhता hai is graph ke upar ek view hai, aur cat-file aapको raw objects directly padhने deता hai. Commit object chhoटा hai: ek single line jo iska tree name karती hai, author aur committer ke liye ek-ek line ek unix timestamp ke saath, ek blank line, aur message. Ismें file contents nahi hain — ye ek tree par point karता hai. Tree print karना us level par har path ke liye ek entry dikhता hai. File ke liye entry follow karना blob tak pahunchता hai, jiska poora content file ke exact bytes hain. Ek doosरे commit ke baad, naya commit object ek tree line aur ek parent line dono carry karता hai jo pichle commit par point karती hai — har commit peeche reference karता hai, kabhi aage nahi. Aakhir mein, HEAD ek indirection hai: ye ek commit hash nahi rakhता, ye ek branch ka naam rakhता hai.',
      },
      {
        title: 'The three trees: working tree, index, HEAD',
        titleHi: 'Teen trees: working tree, index, HEAD',
        code: `# VERIFY
exec 2>&1
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
export GIT_AUTHOR_NAME=dev GIT_AUTHOR_EMAIL=dev@example.com
export GIT_COMMITTER_NAME=dev GIT_COMMITTER_EMAIL=dev@example.com
export GIT_AUTHOR_DATE='2024-01-01T00:00:00Z' GIT_COMMITTER_DATE='2024-01-01T00:00:00Z'
git init -b main -q
printf 'v1\\n' > file.txt
git add file.txt && git commit -qm "commit v1"

# edit, then stage, then edit AGAIN — three different versions now exist:
printf 'v2\\n' > file.txt
git add file.txt                 # index now has v2
printf 'v3\\n' > file.txt         # working tree now has v3; index still v2; HEAD still v1

echo "--- git status: HEAD..index (staged) and index..working (not staged) ---"
git status --short
echo "--- git diff  (index vs working tree) ---"
git diff | grep -E '^[+-][^+-]'
echo "--- git diff --staged  (HEAD vs index) ---"
git diff --staged | grep -E '^[+-][^+-]'
echo "--- what each tree holds ---"
echo "HEAD:    $(git show HEAD:file.txt)"
echo "index:   $(git show :file.txt)"
echo "working: $(cat file.txt)"`,
        output: `--- git status: HEAD..index (staged) and index..working (not staged) ---
MM file.txt
--- git diff  (index vs working tree) ---
-v2
+v3
--- git diff --staged  (HEAD vs index) ---
-v1
+v2
--- what each tree holds ---
HEAD:    v1
index:   v2
working: v3`,
        explain: 'The staging area is a real, separate snapshot, not just a list of filenames, and this example makes that concrete by putting a different version of one file into each of the three trees at once. After the first commit, HEAD holds version one. Editing the file to version two and staging it copies version two into the index; the working tree and index now agree. Editing again to version three changes only the working tree, so all three trees now differ. The short status output shows two status letters for the file: the first column is the difference between HEAD and the index, the second is the difference between the index and the working tree, and here both are M for modified. The plain diff compares the index to the working tree and therefore shows version two being replaced by version three. The staged diff compares HEAD to the index and shows version one being replaced by version two. Reading the actual content out of each tree confirms it: the commit has version one, the staging area has version two, the file on disk has version three. This is why staging a file and then continuing to edit it produces a commit that does not match what is currently on disk — the commit is built from the index, which froze at the moment you ran add.',
        explainHi: 'Staging area ek real, separate snapshot hai, sirf filenames ki ek list nahi, aur ye example ise concrete banаता hai ek file ke ek alag version ko teenों trees mein ek saath daal kar. Pehle commit ke baad, HEAD version ek rakhता hai. File ko version do mein edit karके stage karna version do ko index mein copy karता hai. Phir se version teen mein edit karना sirf working tree badalता hai, to ab teenों trees differ karते hain. Short status output file ke liye do status letters dikhता hai: pehla column HEAD aur index ke beech ka difference hai, doosरा index aur working tree ke beech. Plain diff index ko working tree se compare karता hai. Staged diff HEAD ko index se compare karता hai. Isliye ek file stage karके phir ise edit karते rehना ek commit produce karता hai jo disk par jo hai usse match nahi karता.',
      },
      {
        title: 'Nothing is really lost: recovering a bad reset with the reflog',
        titleHi: 'Kuch really lost nahi: reflog se ek bad reset recover karna',
        code: `# VERIFY
exec 2>&1
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
export GIT_AUTHOR_NAME=dev GIT_AUTHOR_EMAIL=dev@example.com
export GIT_COMMITTER_NAME=dev GIT_COMMITTER_EMAIL=dev@example.com
export GIT_AUTHOR_DATE='2024-01-01T00:00:00Z' GIT_COMMITTER_DATE='2024-01-01T00:00:00Z'
git init -b main -q
echo one >> log.txt && git add log.txt && git commit -qm "add one"
for m in two three four; do echo $m >> log.txt; git commit -qam "add $m"; done
echo "--- history: 4 commits ---"
git log --oneline | sed -E 's/^[0-9a-f]+/<sha>/'

echo "--- OOPS: hard reset back 3, 'losing' three/four ---"
git reset --hard HEAD~3 -q
git log --oneline | sed -E 's/^[0-9a-f]+/<sha>/'

echo "--- the reflog still has every position HEAD held ---"
git reflog | sed -E 's/^[0-9a-f]+/<sha>/'

echo "--- recover: point main back at where HEAD was 1 move ago ---"
git reset --hard 'HEAD@{1}' -q
git log --oneline | sed -E 's/^[0-9a-f]+/<sha>/'
echo "recovered: $(cat log.txt | tr '\\n' ' ')"`,
        output: `--- history: 4 commits ---
<sha> add four
<sha> add three
<sha> add two
<sha> add one
--- OOPS: hard reset back 3, 'losing' three/four ---
<sha> add one
--- the reflog still has every position HEAD held ---
<sha> HEAD@{0}: reset: moving to HEAD~3
<sha> HEAD@{1}: commit: add four
<sha> HEAD@{2}: commit: add three
<sha> HEAD@{3}: commit: add two
<sha> HEAD@{4}: commit (initial): add one
--- recover: point main back at where HEAD was 1 move ago ---
<sha> add four
<sha> add three
<sha> add two
<sha> add one
recovered: one two three four`,
        explain: 'A hard reset moves the current branch to another commit and makes the working tree match it, so after resetting three commits back, git log shows only the first commit and the other three appear to be gone. They are not gone. Every time HEAD moves — by commit, reset, checkout, merge, rebase — git appends a line to the reflog recording where it was, what operation moved it, and when. The reflog listing shows the reset as the most recent entry and, directly below it, the three commits that were the branch tip just before. Those commits still exist as objects because the reflog entry keeps them reachable. Naming the position HEAD held one move ago and hard-resetting to it moves the branch back to the tip commit, and the working tree is restored along with it. The reflog is local and per-repository, it is not pushed, and entries expire after about ninety days by default, but within that window essentially any state the repository has passed through can be returned to by finding it in the reflog and resetting or branching to it.',
        explainHi: 'Ek hard reset current branch ko ek doosरे commit par move karता hai aur working tree ko ise match karवाता hai, to teen commits peeche reset karने ke baad, git log sirf pehla commit dikhता hai aur baaki teen gaye hue lagते hain. Wo gaye nahi hain. Har baar HEAD move karта hai — commit, reset, checkout, merge, rebase se — git reflog mein ek line append karता hai jo record karती hai ye kahaan tha, kaunसे operation ne ise move kiya, aur kab. Reflog listing reset ko most recent entry ke roop mein dikhता hai aur, iske theek neeche, wo teen commits jo just pehle branch tip thे. Wo commits abhi bhi objects ke roop mein exist karते hain kyunki reflog entry unhe reachable rakhती hai. Us position ko name karना jo HEAD ne ek move pehle rakhी aur ise hard-reset karना branch ko wapas move karता hai. Reflog local hai aur push nahi hoता.',
      },
    ],

    mistakes: [
      {
        wrong: `# thinking 'git commit --amend' and 'git rebase' EDIT existing commits
$ git commit --amend -m "better message"
# "I changed that commit."  -> NO. you created a NEW commit with a new hash;
# the branch now points at the new one; the old commit is orphaned (still in
# .git/objects, reachable via reflog). if you'd already PUSHED the old commit,
# your local history and the remote's have now diverged and a plain 'git push'
# is rejected — you'd need --force-with-lease, which rewrites shared history.`,
        right: `# amend/rebase/squash CREATE NEW commits and MOVE the branch ref. that's fine
# for LOCAL, unpushed work. once a commit is pushed and others may have it:
#   - don't rewrite it. add a new commit on top instead.
#   - if you MUST (e.g. a secret leaked), coordinate: everyone re-clones or
#     resets, and you rotate the secret regardless (it's in the reflog + clones).
# 'git push --force-with-lease' (not plain --force) at least refuses if the
# remote moved since you last fetched.`,
        why: 'Git commits are immutable objects identified by a hash of their content, so there is no operation that changes a commit in place. Amend, rebase, squash, and filter all work by building new commit objects with new hashes and then moving the branch reference to point at the new tip, leaving the original commits in the object store but no longer on any branch. For work that exists only in the local repository this is completely safe and is the normal way to tidy history before sharing it. The problem arises once a commit has been pushed, because other clones may now have that exact commit hash in their history and may have built on top of it. Rewriting it locally creates a parallel version with a different hash, so the local branch and the remote branch now disagree about history, a normal push is refused as non-fast-forward, and forcing the push replaces the shared history — which breaks every other clone that had the old commits and requires everyone to recover manually. The rule that follows is to freely rewrite local unpushed commits and to never rewrite pushed ones; if a rewrite of shared history is genuinely unavoidable, such as removing a leaked credential, it has to be coordinated across everyone with a clone, and the credential must be rotated anyway because it still exists in reflogs and existing clones.',
        whyHi: 'Git commits immutable objects hain jo unke content ke ek hash se identified hain, to koi operation nahi hai jo ek commit ko in place change karता hai. Amend, rebase, squash sab naye commit objects banaकर kaam karते hain naye hashes ke saath aur phir branch reference ko naye tip par point karवाते hain, original commits ko object store mein chhoड़ते hain par kisi branch par nahi. Sirf local repository mein exist karने wale kaam ke liye ye completely safe hai. Problem tab aati hai jab ek commit push ho chuka hai, kyunki doosre clones ke paas ab wo exact commit hash ho sakта hai. Ise locally rewrite karना ek parallel version banаता hai ek alag hash ke saath, to local branch aur remote branch history ke baare mein disagree karते hain, ek normal push refuse hoता hai, aur push force karना shared history replace karता hai. Rule: local unpushed commits freely rewrite karो, pushed ones kabhi nahi.',
      },
      {
        wrong: `# staging a file, then editing more, then being surprised by the commit
$ vim config.yaml          # fix a typo
$ git add config.yaml
$ vim config.yaml          # also bump the version while I'm here
$ git commit -m "fix typo"
# -> the commit contains ONLY the typo fix (what was in the INDEX at 'git add').
#    the version bump is still unstaged. you shipped half of what you see on disk.`,
        right: `# 'git add' snapshots the file AS IT IS AT THAT MOMENT into the index.
# after any further edit, re-add, or check first:
$ git status              # "Changes to be committed" vs "Changes not staged"
$ git diff --staged      # EXACTLY what will be committed (HEAD vs index)
$ git add -p             # stage specific hunks deliberately
# commit reflects the INDEX, never the working tree directly.`,
        why: 'The staging area holds a snapshot of file content captured at the instant the add command ran, not a live reference to the file. When a file is staged and then edited again, the index still contains the earlier version, and a commit made afterward is built from the index, so it includes only the changes that were present when add was run and omits everything edited since. The result is a commit that does not match the current state of the working tree: what was committed is a subset of what the developer sees on disk, and the remaining changes stay uncommitted, easy to overlook. The habit that prevents this is to treat the index as the thing being committed and to inspect it directly before committing, using the status output to see which changes are staged versus unstaged and the staged diff to see exactly the content that will go into the commit. When a file has been edited after staging, it must be added again to capture the later version. Staging changes in explicit hunks rather than whole files makes the contents of the index a deliberate choice rather than an accident of timing.',
        whyHi: 'Staging area file content ka ek snapshot rakhता hai jo add command chalने ke instant par capture hua, file ka ek live reference nahi. Jab ek file stage hoती hai aur phir se edit hoती hai, index abhi bhi pehla version rakhता hai, aur baad mein banाya gaya ek commit index se banता hai, to ismें sirf wo changes hain jo add chalने par present thे. Result ek commit hai jo working tree ki current state se match nahi karता. Jo habit ise prevent karती hai wo index ko wo cheez treat karना hai jo commit ho rahी hai aur committing se pehle ise directly inspect karना, status output aur staged diff istemal karके. Jab ek file staging ke baad edit hui hai, ise capture karने ke liye phir se add karना chahiye.',
      },
      {
        wrong: `# panicking after 'git reset --hard' and assuming the work is gone
$ git reset --hard HEAD~5
# "I just destroyed 5 commits of work. they're gone forever."
# -> starts rewriting them from memory, or restores from a days-old backup,
//    losing everything since.`,
        right: `# they're in the reflog for ~90 days. FIND them, then reset/branch back:
$ git reflog                              # HEAD's full move history
0a1b2c3 HEAD@{1}: commit: the work you 'lost'
$ git reset --hard HEAD@{1}               # or: git branch recover 0a1b2c3
# also works for: bad rebase (reflog HEAD@{n} before the rebase), deleted branch
# (git reflog show <branch>, or search 'git fsck --lost-found'), detached-HEAD
# commits you walked away from. rule: if you can NAME it, you can RECOVER it.`,
        why: 'A hard reset and many other history operations move a branch reference and update the working tree, but they do not delete the commit objects that were previously referenced. Git records every movement of HEAD and of each branch in the reflog, a local log with a timestamped entry for each position and the operation that caused it, retained for about ninety days by default. Because a reflog entry counts as making a commit reachable, the objects survive garbage collection for that period. So after an operation that appears to have destroyed work, the correct first step is to consult the reflog, locate the entry describing the state just before the destructive operation, and either reset the branch back to that position or create a new branch pointing at it. The same approach recovers from a botched rebase by resetting to the HEAD position recorded before the rebase started, from an accidentally deleted branch by finding its last position in its own reflog or via the lost-and-found scan, and from commits made on a detached HEAD that was then abandoned. Rewriting lost work from memory or restoring an old backup discards everything done since that backup and is almost never necessary, because the reflog makes the recent history of the repository navigable.',
        whyHi: 'Ek hard reset aur bahut sी doosri history operations ek branch reference move karती hain aur working tree update karती hain, par wo commit objects delete nahi karती jo pehle referenced thे. Git reflog mein HEAD aur har branch ke har movement ko record karता hai, ek local log ek timestamped entry ke saath har position aur us operation ke liye jisne ise cause kiya, ~90 days ke liye retained. Kyunki ek reflog entry ek commit ko reachable banाने ke roop mein count hoती hai, objects us period ke liye garbage collection se survive karते hain. To ek operation ke baad jo kaam destroy kiya lagता hai, correct pehla step reflog consult karना hai, us entry ko locate karना jo destructive operation se just pehle ki state describe karती hai, aur ya to branch ko us position par reset karना ya us par point karता ek naya branch banाना.',
      },
    ],

    realWorld: [
      {
        en: '**A junior dev\'s "I lost a day of work" recovered in 30 seconds** with `git reflog` + `git reset --hard HEAD@{4}` after a bad `git reset --hard`. It became the team\'s first onboarding lesson: reflog before panic.',
        hi: '**Ek junior dev ka "maine ek din ka kaam kho diya" 30 seconds mein recover** `git reflog` + `git reset --hard HEAD@{4}` se ek bad reset ke baad.',
      },
      {
        en: '**A "fix typo" commit that shipped a broken config** because the author `git add`-ed, then edited more, then committed — the commit had only the typo fix, and the actual (broken) change on disk went out in the *next* unrelated commit. Team added `git diff --staged` to the pre-commit checklist.',
        hi: '**Ek "fix typo" commit jo ek broken config ship kiya** kyunki author ne `git add` kiya, phir aur edit kiya, phir commit kiya.',
      },
      {
        en: '**A force-push that erased two teammates\' commits** — someone rebased a shared branch and `git push --force`-d. Switched the team to `--force-with-lease` only, and protected `main`/`develop` against force-push entirely.',
        hi: '**Ek force-push jo do teammates ke commits mita diya** — kisi ne ek shared branch rebase kiya aur `git push --force` kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'What actually is a commit, and what happens to the repository when you run `git commit`?',
        qHi: 'Ek commit actually kya hai, aur jab aap `git commit` chalाते ho to repository ka kya hoता hai?',
        a: 'A commit is an immutable object, named by a hash of its own contents, that records a snapshot of the whole project plus its position in history. Concretely it contains a pointer to exactly one tree object, which is the complete recursive listing of every file and directory at that commit; pointers to zero or more parent commits, zero for the first commit, one for an ordinary commit, two or more for a merge; an author with a name, email, and timestamp; a committer, which differs from the author after operations like rebase or cherry-pick; and the commit message. It does not store diffs — each commit has a full snapshot, and diffs are computed on demand by comparing two trees. When you run git commit, git takes the current index, which is the staging area holding the proposed next snapshot, and writes it out as one or more tree objects. It then creates a new commit object pointing at that top tree, with the current commit as parent and the configured author and committer identity and the message. Finally it updates the current branch reference — the small file under refs/heads — to contain the new commit\'s hash, and updates the reflog. The working tree is not touched; it was already the source of what you staged. Nothing else moves.',
        aHi: 'Ek commit ek immutable object hai, apne contents ke ek hash se named, jo poore project ka ek snapshot plus history mein iski position record karता hai. Concretely ismें exactly ek tree object ka ek pointer hai, jo us commit par har file aur directory ki complete recursive listing hai; zero ya zyada parent commits ke pointers; ek author; ek committer; aur commit message. Ye diffs store nahi karता — har commit ka ek full snapshot hai. Jab aap git commit chalाते ho, git current index leता hai, aur ise ek ya zyada tree objects ke roop mein likhता hai. Phir ye ek naya commit object banаता hai jo us top tree par point karता hai, current commit ke saath parent ke roop mein. Aakhir mein ye current branch reference update karता hai naye commit ka hash contain karने ke liye, aur reflog update karता hai.',
      },
      {
        q: 'Someone ran `git reset --hard` and lost commits. Walk through recovering them and explain why it works.',
        qHi: 'Kisi ne `git reset --hard` chalाya aur commits kho diye. Unhe recover karना walk through karो.',
        a: 'The commits are almost certainly still there. A hard reset moves the current branch reference to a different commit and makes the working tree match that commit, but it does not delete any objects. Git maintains a reflog, a local per-repository log that records every position HEAD and each branch has held, with the operation and a timestamp, kept for about ninety days by default. Each reflog entry keeps the commit it references reachable, so those commits are not eligible for garbage collection during that window. To recover, run git reflog to see HEAD\'s movement history; the entry just before the reset will describe the previous tip, for example "HEAD@{1}: commit: ..." with its hash. Then either reset the branch back with git reset --hard HEAD@{1}, or more cautiously create a branch at that commit with git branch recovered <hash> and inspect it first. The same technique recovers a bad rebase by resetting to the HEAD position from before the rebase, and a deleted branch by checking git reflog show for that branch or scanning with git fsck --lost-found. The key principle is that if you can name a commit — by hash, by a reflog expression, by a tag — you can get back to it, so the response to apparent data loss in git is to look in the reflog before doing anything drastic.',
        aHi: 'Commits lagभag zaroor abhi bhi wahaan hain. Ek hard reset current branch reference ko ek alag commit par move karता hai aur working tree ko us commit se match karवाता hai, par ye koi objects delete nahi karता. Git ek reflog maintain karता hai, ek local per-repository log jo har position record karता hai jo HEAD aur har branch ne rakhी, operation aur ek timestamp ke saath, ~90 days ke liye. Har reflog entry us commit ko reachable rakhती hai jise ye reference karती hai. Recover karने ke liye, git reflog chalाओ; reset se just pehle wali entry previous tip describe karेgi. Phir ya to git reset --hard HEAD@{1} se branch wapas reset karो, ya zyada cautiously us commit par ek branch banाओ. Key principle: agar aap ek commit ko name kar sakते ho, aap ise wapas pa sakते ho.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define blob, tree, commit, and (annotated) tag, and state what a branch and HEAD each physically are (contents of which file).',
        taskHi: 'Ek comment mein, blob, tree, commit, aur tag define karो.',
        hint: 'BLOB = the raw bytes of one file (no name/metadata). TREE = one directory snapshot: a list of (mode, type, sha, name) entries pointing at blobs and sub-trees. COMMIT = a pointer to ONE tree + zero-or-more PARENT commits + author + committer + message; the hash covers all of it; stores a full snapshot, not a diff. ANNOTATED TAG = an object: a pointer to another object + tagger + date + message (+ optional signature). BRANCH = `.git/refs/heads/<name>`, a ~41-byte file containing ONE commit sha. HEAD = `.git/HEAD`, normally `ref: refs/heads/<name>` (attached) or a raw sha (detached).',
        hintHi: 'BLOB = ek file ke raw bytes. TREE = ek directory snapshot: (mode, type, sha, name) entries. COMMIT = ONE tree + zero-or-more PARENT commits + author + committer + message; full snapshot, diff nahi. ANNOTATED TAG = ek object: ek pointer + tagger + date + message. BRANCH = `.git/refs/heads/<name>`, ek ~41-byte file ek commit sha ke saath. HEAD = `.git/HEAD`, normally `ref: refs/heads/<name>`.',
      },
      {
        task: 'You run `git add file.txt`, then edit `file.txt` again, then `git commit -m "x"`. In a comment, say exactly what ends up in the commit and why, and the two commands that would have shown you before committing.',
        taskHi: 'Aap `git add file.txt` chalाते ho, phir `file.txt` phir se edit karते ho, phir commit. Commit mein kya jата hai?',
        hint: 'The commit contains the version of `file.txt` that was on disk AT THE MOMENT you ran `git add` — because `git add` snapshots content into the INDEX, and `git commit` builds the commit from the index, not the working tree. The edits made after `git add` are still unstaged and NOT in the commit. Before committing: `git status` (shows "Changes to be committed" vs "Changes not staged" — the file appears in both) and `git diff --staged` (shows exactly HEAD-vs-index, i.e. what will be committed).',
        hintHi: 'Commit mein `file.txt` ka wo version hai jo disk par tha JAB aapne `git add` chalाya — kyunki `git add` content ko INDEX mein snapshot karता hai, aur `git commit` index se commit banаता hai, working tree se nahi. `git add` ke baad ke edits abhi bhi unstaged hain. Pehle: `git status` aur `git diff --staged`.',
      },
      {
        task: 'In a comment, explain why `git commit --amend` on an already-pushed commit causes a rejected push, what `--force-with-lease` does that `--force` does not, and the rule for rewriting history.',
        taskHi: 'Ek comment mein, samjhाओ kyun ek already-pushed commit par `git commit --amend` ek rejected push cause karता hai.',
        hint: '`--amend` does not edit the commit — it creates a NEW commit (new hash) and moves the branch ref to it; the old commit is orphaned. If the old commit was pushed, your local branch and the remote now have different histories, so `git push` is rejected as non-fast-forward. `--force` overwrites the remote regardless (clobbering any commits others pushed since). `--force-with-lease` refuses unless the remote is still exactly where you last saw it — so it won\'t silently erase a teammate\'s push. RULE: rewrite local unpushed history freely; never rewrite pushed/shared history (add a new commit instead); if truly unavoidable, coordinate with everyone and rotate any leaked secret anyway.',
        hintHi: '`--amend` commit edit nahi karता — ye ek NAYA commit banаता hai (naya hash) aur branch ref ise move karता hai. Agar purana commit pushed tha, local aur remote ki alag histories hain, to `git push` rejected. `--force` remote ko overwrite karता hai regardless. `--force-with-lease` refuse karता hai jab tak remote wahीं hai jahaan aapne aakhiri baar dekha. RULE: local unpushed freely rewrite karो; pushed history kabhi nahi.',
      },
    ],

    keyTakeaways: [
      'Git is a CONTENT-ADDRESSED store: every object is named by the SHA of its own contents. FOUR object types: BLOB (the bytes of one file — no name/metadata), TREE (a directory snapshot: (mode, type, sha, name) entries pointing at blobs + sub-trees), COMMIT (→ ONE tree, → zero-or-more PARENT commits, author, committer, message — the hash covers ALL of it; stores a full SNAPSHOT, not a diff), annotated TAG (an object: pointer + tagger + date + message + optional signature). Same content → same SHA → stored once; change one byte → new SHA all the way up.',
      'REFS are human names pointing at commits, each a tiny file: a BRANCH = `.git/refs/heads/<name>` containing ONE commit sha (~41 bytes — that IS the whole branch); a lightweight TAG = same but never moves; HEAD = `.git/HEAD`, normally `ref: refs/heads/<name>` (attached) or a raw sha (DETACHED — new commits get orphaned when you leave unless you branch). `git commit`/`reset`/`merge`/`rebase` all just overwrite a ref file with a different sha — which is why branching is instant and free (no file copying, ever).',
      'THE THREE TREES: WORKING TREE (files on disk you edit) → INDEX/STAGE (`.git/index`, a proposed next commit; `git add` copies working-tree→index as a SNAPSHOT AT THAT MOMENT) → HEAD commit (`git commit` writes the index out as a new commit). `git status` = diff(HEAD,index) + diff(index,working). `git diff` = index vs working; `git diff --staged` = HEAD vs index. Staging a file then editing it again → the commit has the EARLIER version (built from the index), not what\'s on disk — check `git diff --staged` before committing.',
      'History is a DAG of commits linked by PARENT pointers (1 parent normally, 2+ for a merge, 0 for the first); branches/tags are just labels on nodes. `HEAD~n` = n first-parents back, `HEAD^2` = the merged-in side, `v1.0..HEAD` = reachable from HEAD but not v1.0. merge = a node with 2 parents (or a FAST-FORWARD = just slide the label when one side is an ancestor); rebase = RE-CREATE a range of commits (new hashes) on a new base; reset = move the branch label (`--soft` keeps index+working, `--mixed` resets index, `--hard` resets working too — the one that discards changes).',
      'COMMITS ARE IMMUTABLE — amend/rebase/squash NEVER edit an object, they create NEW objects and move refs; the old commits are orphaned but stay in `.git/objects`, reachable via the REFLOG. The reflog (`git reflog`) records every position HEAD/each branch has held, with the operation + timestamp, for ~90 days, LOCAL and not pushed. So a "lost" commit after a bad `reset --hard`/rebase is almost always recoverable: `git reflog` → find the entry → `git reset --hard HEAD@{n}` or `git branch recover <sha>`. RULE: rewrite LOCAL unpushed history freely; NEVER rewrite pushed/shared history (add a new commit instead) — a force-push clobbers teammates\' work; use `--force-with-lease` (refuses if the remote moved) not `--force`. If you can NAME an object (sha, branch, tag, `HEAD@{2}`), you can recover it. INSPECT: `git cat-file -t/-p <obj>`, `git rev-parse <rev>`, `git log --graph --oneline --all`, `git reflog`.',
    ],
    keyTakeawaysHi: [
      'Git ek CONTENT-ADDRESSED store hai: har object apne contents ke SHA se named. CHAAR object types: BLOB (ek file ke bytes), TREE (ek directory snapshot: (mode, type, sha, name) entries), COMMIT (→ ONE tree, → zero-or-more PARENT commits, author, committer, message — hash SAB cover karता hai; ek full SNAPSHOT, diff nahi), annotated TAG. Same content → same SHA → ek baar stored.',
      'REFS human names hain jo commits par point karते hain: ek BRANCH = `.git/refs/heads/<name>` jismें ONE commit sha (~41 bytes — ye poora branch HAI); HEAD = `.git/HEAD`, normally `ref: refs/heads/<name>` (attached) ya ek raw sha (DETACHED). `git commit`/`reset`/`merge`/`rebase` sab bस ek ref file ko ek alag sha se overwrite karते hain — isliye branching instant aur free hai.',
      'TEEN TREES: WORKING TREE → INDEX/STAGE (`git add` working-tree→index ek SNAPSHOT US MOMENT copy karता hai) → HEAD commit (`git commit` index ko ek naye commit ke roop mein likhता hai). `git status` = diff(HEAD,index) + diff(index,working). `git diff` = index vs working; `git diff --staged` = HEAD vs index. Ek file stage karके phir edit karना → commit mein PEHLA version hai, disk par jo hai wo nahi.',
      'History ek DAG hai commits ka PARENT pointers se linked (1 parent normally, 2+ merge, 0 pehla). `HEAD~n`, `HEAD^2`, `v1.0..HEAD`. merge = 2 parents ke saath ek node (ya FAST-FORWARD); rebase = commits ki ek range RE-CREATE karो (naye hashes) ek naye base par; reset = branch label move karो (`--hard` working tree bhi reset karता hai).',
      'COMMITS IMMUTABLE HAIN — amend/rebase/squash NAYE objects banाते hain aur refs move karते hain; purane commits orphaned par `.git/objects` mein rehते hain, REFLOG se reachable. `git reflog` har position record karता hai jo HEAD/har branch ne rakhी, ~90 days, LOCAL. Ek "lost" commit ek bad `reset --hard` ke baad lagभag hamesha recoverable: `git reflog` → entry dhoondो → `git reset --hard HEAD@{n}`. RULE: LOCAL unpushed history freely rewrite karो; pushed/shared history KABHI nahi — `--force-with-lease` istemal karो `--force` nahi.',
    ],
  },

  {
    slug: 'ops-branching-strategies-and-trunk-based-delivery',
    title: 'Branching Strategies & Why Trunk-Based Enables CD',
    titleHi: 'Branching Strategies Aur Trunk-Based CD Kyun Enable Karta Hai',
    description: 'The branching model you choose sets a ceiling on how often you can deploy. Long-lived branches batch up changes and defer integration pain; trunk-based development keeps everyone integrating into one branch many times a day, which is the precondition for continuous delivery and for the DORA elite performance band.',
    descriptionHi: 'Jo branching model aap choose karते ho wo ek ceiling set karता hai ki aap kitni baar deploy kar sakते ho. Long-lived branches changes ko batch karते hain aur integration pain defer karते hain; trunk-based development sabko ek branch mein din mein kई baar integrate karवाता hai, jo continuous delivery ke liye aur DORA elite performance band ke liye precondition hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**Merging onto a motorway.** Trunk-based development is a short slip road: you get up to speed and join the flow every few minutes, small adjustments, no drama. GitFlow is asking everyone to drive on separate private roads for weeks and then all merge onto the motorway at the same junction on release day — the pile-up (merge conflicts, "works on my branch", integration bugs found late) is not bad luck, it is the design. The longer a branch lives away from the main flow, the further the traffic on the main road has moved, and the more violent the eventual merge. Continuous delivery needs traffic joining smoothly and constantly, which only the short slip road provides.',
      hi: '**Ek motorway par merge karना.** Trunk-based development ek short slip road hai: aap speed pakadते ho aur har kुछ minutes flow mein join karते ho, chhoटे adjustments, koi drama nahi. GitFlow sabको hafton ke liye separate private roads par drive karने ke liye kehना hai aur phir sab release day par same junction par motorway par merge karना — pile-up (merge conflicts, "mere branch par works hai", integration bugs late mile) bad luck nahi hai, ye design hai. Ek branch jitna zyada main flow se door rehता hai, main road par traffic utna zyada move ho chuka hai, aur eventual merge utna zyada violent. Continuous delivery ko traffic smoothly aur constantly join karना chahiye.',
    },

    simple: `**THE THREE COMMON MODELS:**
\`\`\`
TRUNK-BASED       everyone commits to ONE branch (main) many times a day. branches
                  (if any) live HOURS, not days. main is always releasable. deploy
                  from main continuously. incomplete work hidden behind FEATURE FLAGS.
                  -> the model for CI/CD and DORA "elite".

GITHUB FLOW       one long-lived branch (main) + short-lived feature branches, each
                  merged via PR after checks + review, deployed right after merge.
                  a lightweight middle ground; fine for most web teams.

GITFLOW          long-lived 'main' + 'develop' + feature branches + 'release/*' +
                  'hotfix/*'. designed for versioned, scheduled releases of installed
                  software. HEAVY. actively harmful for continuous web delivery —
                  its own author now says don't use it for that.
\`\`\`

**WHY BRANCH LIFETIME IS THE WHOLE GAME:**
\`\`\`
branch age  ~= batch size  ~= merge risk  ~= how late integration bugs are found
             ~= how long a broken thing blocks others  ~= inverse of deploy frequency

a 2-hour branch:   tiny diff, trivial merge, conflicts caught instantly, easy review.
a 3-week branch:   huge diff, painful merge, "works on my branch", late surprises,
                   a review nobody does properly, and main moved 200 commits under you.
\`\`\`

**TRUNK-BASED REQUIRES (it doesn't work without these):**
\`\`\`
- a FAST, TRUSTED CI suite on every push to main (minutes, not hours; green = deployable)
- FEATURE FLAGS / branch-by-abstraction to merge incomplete work dark
- small, frequent commits + PRs (hours of work, not weeks)
- a culture of "fix main immediately" — a red main blocks everyone
- (optionally) short-lived PR branches with branch protection, OR direct commit + pair/mob
\`\`\`

**FAST-FORWARD vs MERGE COMMIT vs SQUASH (how a branch lands on main):**
\`\`\`
FAST-FORWARD    main just slides to the branch tip. linear history, no merge commit.
                only possible if main hasn't moved since you branched.
MERGE COMMIT    a commit with 2 parents. preserves the branch's individual commits +
                the fact it was a branch. --no-ff forces one even when FF is possible.
SQUASH          collapse the branch's commits into ONE new commit on main. clean linear
                history, one commit per PR; loses intermediate commits. very common.
REBASE-MERGE    replay the branch's commits onto main's tip, then FF. linear, keeps
                individual commits, but rewrites their hashes.
\`\`\`

**RELEASE BRANCHES (even trunk-based teams sometimes need them):** cut \`release/1.4\`
from main at release time, deploy from it, cherry-pick *only* critical fixes onto it,
keep shipping from main. Needed when you support multiple live versions or can't deploy
main's HEAD on demand.`,

    simpleHi: `**TEEN COMMON MODELS:**
\`\`\`
TRUNK-BASED       sab ONE branch (main) ko din mein kई baar commit karте hain. branches
                  (agar koi) GHANTON tak jeeते hain, dinों nahi. main hamesha releasable.
                  incomplete work FEATURE FLAGS ke peeche chhupा. -> CI/CD ka model.

GITHUB FLOW       ek long-lived branch (main) + short-lived feature branches, har ek PR
                  ke through merged checks + review ke baad. ek lightweight middle ground.

GITFLOW          long-lived 'main' + 'develop' + feature + 'release/*' + 'hotfix/*'.
                  versioned, scheduled releases ke liye designed. HEAVY. continuous web
                  delivery ke liye actively harmful.
\`\`\`

**BRANCH LIFETIME POORA GAME KYUN HAI:**
\`\`\`
branch age  ~= batch size  ~= merge risk  ~= integration bugs kitne late mile
             ~= deploy frequency ka inverse

ek 2-ghante ka branch:  tiny diff, trivial merge, conflicts turant caught, easy review.
ek 3-hafte ka branch:   huge diff, painful merge, "mere branch par works", late surprises,
                        ek review jo koi properly nahi karता, aur main 200 commits move ho gaya.
\`\`\`

**TRUNK-BASED KO CHAHIYE:**
\`\`\`
- har push par main par ek FAST, TRUSTED CI suite (minutes, hours nahi; green = deployable)
- FEATURE FLAGS / branch-by-abstraction incomplete work dark merge karने ke liye
- small, frequent commits + PRs (ghanton ka kaam, hafton ka nahi)
- ek culture of "main turant fix karो" — ek red main sabको block karता hai
\`\`\`

**FAST-FORWARD vs MERGE COMMIT vs SQUASH:**
\`\`\`
FAST-FORWARD    main bस branch tip par slide karता hai. linear history, koi merge commit nahi.
MERGE COMMIT    2 parents ke saath ek commit. branch ke individual commits preserve karता hai.
SQUASH          branch ke commits ko main par ONE naye commit mein collapse karता hai. clean
                linear history, per PR ek commit; intermediate commits kho deता hai. bahut common.
REBASE-MERGE    branch ke commits ko main ke tip par replay karो, phir FF. linear.
\`\`\`

**RELEASE BRANCHES:** release time par main se \`release/1.4\` cut karो, ismें se deploy karो,
 ismें *sirf* critical fixes cherry-pick karो. Tab chahiye jab aap multiple live versions support
karते ho.`,

    content: `## The three models

### Trunk-based development

Every developer integrates their work into **one shared branch** (\`main\`, historically "trunk") **multiple times a day**. Branches, if used at all, are **short-lived** — created in the morning, merged by end of day, ideally within a few hours. \`main\` is kept in a **always-releasable** state, and deployment happens from \`main\` continuously or on a fixed cadence. Work that is not finished is merged anyway, hidden behind a **feature flag** or structured so it is not yet reachable, rather than held on a branch.

This is the branching model that the *Accelerate* / DORA research associates with elite delivery performance, and it is a prerequisite for genuine continuous integration — the clue is in the name: integration only happens when code lands on the shared branch.

### GitHub Flow

One permanent branch, \`main\`, always deployable. Each change is made on a **short-lived feature branch**, opened as a **pull request**, run through automated checks and human review, and merged to \`main\` — after which it is deployed, immediately or very soon. There is no \`develop\`, no release branches, no version branches. It is trunk-based development with a mandatory PR step and slightly longer-lived branches (days rather than hours), and it is a reasonable default for most web application teams.

### GitFlow

A heavyweight model with multiple long-lived branches: \`main\` (released versions only), \`develop\` (integration), \`feature/*\` branches off \`develop\`, \`release/*\` branches to stabilise a release, and \`hotfix/*\` branches off \`main\`. It was designed in 2010 for software with **explicit versioned releases on a schedule** — desktop applications, libraries, firmware — where you genuinely maintain several versions at once.

For a web service that deploys continuously it is a poor fit: the \`develop\`/\`main\` split adds ceremony with no benefit, feature branches live for weeks, and the release-branch dance delays delivery. The model's own author has since written that it was never intended for continuous delivery and teams doing that should not use it.

## Why branch lifetime determines deploy frequency

The single variable that matters is **how long a branch lives before it merges**, because it is proportional to almost everything that makes delivery slow or risky:

| Short-lived branch (hours) | Long-lived branch (weeks) |
|---|---|
| Small diff | Large diff |
| Trivial merge, conflicts rare and tiny | Painful merge, large conflicts |
| Conflicts surface within hours, while context is fresh | Conflicts surface at merge time, context long gone |
| "Works on main" — everyone's on the same code | "Works on my branch" — divergent integration state |
| Integration bugs found immediately | Integration bugs found weeks later, expensive |
| Review is small and real | Review is huge and rubber-stamped |
| \`main\` moved a little under you | \`main\` moved hundreds of commits under you |
| A broken change blocks others for minutes | A broken merge blocks others for a day |

**Continuous integration means integrating continuously** — literally, merging to the shared branch many times a day. A team that keeps work on branches for a week is not doing CI regardless of how much CI *tooling* they run; they are running automated tests on isolated branches and deferring the actual integration. Deploy frequency cannot exceed merge frequency, and merge frequency is capped by branch lifetime.

## What trunk-based development requires

It does not work as a naive "everyone push to main" — it depends on supporting practices:

- **A fast, trusted CI suite** that runs on every change to \`main\` (or every PR) and completes in minutes. If CI takes an hour, people batch changes to avoid waiting, and branch lifetime creeps back up. If CI is flaky, a red \`main\` stops meaning "broken" and the discipline collapses.
- **Feature flags or branch by abstraction** so incomplete features can be merged in a disabled or unreachable state. This is what lets you commit a half-built feature to \`main\` daily without exposing it.
- **Small changes.** A change that cannot be made in a day is decomposed into a sequence of small, individually safe, individually mergeable steps.
- **A "stop the line" culture.** When \`main\` goes red, fixing it is the team's top priority, because everyone is blocked from integrating on top of a broken base. Automated reverts after N minutes red are common.
- **Either** short-lived PR branches with branch protection (required checks, required review, no direct pushes to \`main\`), **or** direct commits to \`main\` paired with pair/mob programming as the review mechanism. Both are "trunk-based"; the PR variant is far more common.

## How a branch lands on main

When a short-lived branch merges, the shape of the resulting history depends on the merge method:

- **Fast-forward** — if \`main\` has not moved since the branch was created, \`main\`'s ref simply advances to the branch tip. No merge commit; perfectly linear history. Not possible once \`main\` has other commits.
- **Merge commit (\`--no-ff\`)** — creates a commit with two parents, preserving every individual commit on the branch and the topological fact that a branch existed. History is non-linear. GitFlow relies on this; some teams find the extra commits noisy.
- **Squash merge** — combines all the branch's commits into a **single new commit** on \`main\`. History stays linear with exactly one commit per pull request, which is clean and easy to revert or bisect, at the cost of losing the branch's intermediate commits. Very widely used with GitHub Flow.
- **Rebase and merge** — replays the branch's commits one by one onto \`main\`'s current tip, then fast-forwards. Linear history that keeps the individual commits, but their hashes change and their committer dates shift.

There is no universally correct choice; squash-per-PR and rebase-and-merge both give the linear history that makes \`git bisect\` and \`git revert\` straightforward, which matters more as deploy frequency rises.

## Release branches, when you still need them

Even trunk-based teams sometimes cut a **release branch**: at release time, branch \`release/1.4\` from \`main\`, deploy the product from that branch, and thereafter **cherry-pick only critical fixes** from \`main\` onto it while normal development continues on \`main\`. You need this when:

- you support **multiple live versions** simultaneously (customers on 1.2, 1.3, 1.4);
- you ship software others install and cannot force-update;
- you cannot deploy \`main\`'s current HEAD on demand and need a frozen, stabilised point.

A pure continuously-deployed web service with one live version usually needs none of this — \`main\` *is* the release.`,

    contentHi: `## Teen models

**Trunk-based development.** Har developer apna kaam **ek shared branch** (\`main\`) mein **din mein kई baar** integrate karता hai. Branches, agar istemal ki gayीं, **short-lived** hain — subah banी, din ke ant tak merged. \`main\` ek **hamesha-releasable** state mein rakhа jाता hai. Jo kaam finished nahi hai wo phir bhi merge hoता hai, ek **feature flag** ke peeche chhupा. Ye wo branching model hai jise DORA research elite delivery performance ke saath associate karता hai.

**GitHub Flow.** Ek permanent branch, \`main\`, hamesha deployable. Har change ek **short-lived feature branch** par, ek **pull request** ke roop mein khola, automated checks aur human review ke through, aur \`main\` mein merged. Koi \`develop\` nahi, koi release branches nahi. Zyaादातर web application teams ke liye ek reasonable default.

**GitFlow.** Multiple long-lived branches ke saath ek heavyweight model: \`main\`, \`develop\`, \`feature/*\`, \`release/*\`, \`hotfix/*\`. **Ek schedule par explicit versioned releases** wale software ke liye designed. Continuously deploy karने wali ek web service ke liye ek poor fit — model ke apne author ne likhа hai ki teams jo CD kar rahी hain ise istemal nahi karें.

## Branch lifetime deploy frequency kyun determine karता hai

Jo single variable matter karता hai wo hai **ek branch merge hone se pehle kitni der jeeта hai**, kyunki ye lagभag har cheez ke proportional hai jo delivery slow ya risky banाती hai: chhoटा vs baड़ा diff, trivial vs painful merge, conflicts jaldi vs late surface, "works on main" vs "works on my branch", integration bugs turant vs hafton baad, review real vs rubber-stamped.

**Continuous integration ka matlab continuously integrate karना** — literally, shared branch mein din mein kई baar merge karना. Ek team jo ek hafte ke liye branches par kaam rakhती hai CI nahi kar rahी. Deploy frequency merge frequency se zyada nahi ho sakती, aur merge frequency branch lifetime se capped hai.

## Trunk-based development ko kya chahiye

- **Ek fast, trusted CI suite** jo har change par chalती hai aur minutes mein complete hoती hai.
- **Feature flags ya branch by abstraction** taki incomplete features ek disabled state mein merge ho sakें.
- **Small changes.** Ek change jo ek din mein nahi ho sakта small steps mein decompose hoता hai.
- **Ek "stop the line" culture.** Jab \`main\` red hoता hai, ise fix karना team ki top priority hai.

## Ek branch main par kaise land karता hai

- **Fast-forward** — agar \`main\` move nahi hua, \`main\` ka ref bस branch tip par advance karता hai. Koi merge commit nahi; linear history.
- **Merge commit (\`--no-ff\`)** — do parents ke saath ek commit, branch ke har individual commit preserve karता hai. Non-linear history.
- **Squash merge** — branch ke saare commits ko \`main\` par ek **single naye commit** mein combine karता hai. Per PR exactly ek commit. Bahut widely used.
- **Rebase and merge** — branch ke commits ko \`main\` ke current tip par replay karता hai, phir fast-forward. Linear history jo individual commits rakhती hai par unke hashes change karती hai.

## Release branches, jab aapko abhi bhi chahiye

Release time par, \`release/1.4\` ko \`main\` se branch karो, us branch se deploy karो, aur uske baad \`main\` se **sirf critical fixes cherry-pick** karो. Aapको ye chahiye jab: aap **multiple live versions** support karते ho; aap software ship karते ho jo doosre install karते hain; aap \`main\` ka HEAD on demand deploy nahi kar sakते.`,

    examples: [
      {
        title: 'Branch age vs merge pain: a 2-commit branch vs the same after main moves 20',
        titleHi: 'Branch age vs merge pain',
        code: `# VERIFY
exec 2>&1
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
export GIT_AUTHOR_NAME=dev GIT_AUTHOR_EMAIL=dev@example.com
export GIT_COMMITTER_NAME=dev GIT_COMMITTER_EMAIL=dev@example.com
export GIT_AUTHOR_DATE='2024-01-01T00:00:00Z' GIT_COMMITTER_DATE='2024-01-01T00:00:00Z'
git init -b main -q
printf 'line A\\nline B\\nline C\\n' > app.txt
git add app.txt && git commit -qm "base"

# SHORT-LIVED: branch, one change, merge back before main moves --------------
git switch -qc feat-short
sed -i 's/line B/line B (feature)/' app.txt
git commit -qam "feature: tweak line B"
git switch -q main
git merge feat-short -q                 # fast-forward: main hadn't moved
echo "short-lived branch merge: exit $?  (clean, fast-forward)"

# LONG-LIVED: branch, then main moves a lot on the SAME lines, then merge -----
git switch -qc feat-long
sed -i 's/line C/line C (long feature)/' app.txt
git commit -qam "long feature: rework line C"
git switch -q main
for i in 1 2 3; do sed -i "s/line C.*/line C (main change $i)/" app.txt; git commit -qam "main change $i"; done
echo "--- now merge the stale long branch ---"
git merge feat-long > ../merge.log 2>&1; rc=$?
head -3 ../merge.log
echo "merge exit: $rc"
git status --short
echo "--- the conflict git could not resolve ---"
grep -nE '^(<<<<<<<|=======|>>>>>>>)' app.txt | sed -E 's/ [0-9a-f]{7,}//'`,
        output: `short-lived branch merge: exit 0  (clean, fast-forward)
--- now merge the stale long branch ---
Auto-merging app.txt
CONFLICT (content): Merge conflict in app.txt
Automatic merge failed; fix conflicts and then commit the result.
merge exit: 1
UU app.txt
--- the conflict git could not resolve ---
3:<<<<<<< HEAD
5:=======
7:>>>>>>> feat-long
`,
        explain: 'The two halves of this example run the same kind of change through a short-lived and a long-lived branch. In the first, a branch is created, one line is changed, and it is merged straight back before main has moved at all, so the merge is a fast-forward — main\'s pointer simply advances, there is no merge commit, and there is nothing to reconcile. In the second, the branch changes one line and is then left alone while main receives three commits that repeatedly modify the same line. When the branch is finally merged, git tries to combine two different sets of edits to the same region of the file, cannot decide which is correct, and stops with a conflict: the file now contains conflict markers bracketing the branch\'s version and main\'s version, the working tree is in a conflicted state, and a human must resolve it. Nothing about the branch\'s change was harder in the second case; the difficulty came entirely from how far main diverged while the branch sat unmerged. This is the mechanism behind the rule that branch lifetime drives merge risk, and behind trunk-based development\'s insistence on merging within hours.',
        explainHi: 'Is example ke do halves ek hi tarah ke change ko ek short-lived aur ek long-lived branch se chalाते hain. Pehle mein, ek branch banी, ek line change hui, aur ye seedha wapas merge hui main ke move hone se pehle, to merge ek fast-forward hai — main ka pointer bस advance karта hai, koi merge commit nahi. Doosरे mein, branch ek line change karता hai aur phir akela chhoड़ diya jाता hai jabki main teen commits receive karता hai jo baar-baar same line modify karते hain. Jab branch aakhirkar merge hoता hai, git same region ke do alag sets of edits combine karने ki koshish karता hai, decide nahi kar sakта, aur ek conflict ke saath rukता hai. Branch ke change ke baare mein kुछ doosरे case mein harder nahi tha; difficulty poori tarah is baat se aayी ki main kitna diverge hua.',
      },
      {
        title: 'Squash vs merge-commit vs fast-forward — three histories from one branch',
        titleHi: 'Squash vs merge-commit vs fast-forward',
        code: `# VERIFY
exec 2>&1
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_SYSTEM=/dev/null
export GIT_AUTHOR_NAME=dev GIT_AUTHOR_EMAIL=dev@example.com
export GIT_COMMITTER_NAME=dev GIT_COMMITTER_EMAIL=dev@example.com
export GIT_AUTHOR_DATE='2024-01-01T00:00:00Z' GIT_COMMITTER_DATE='2024-01-01T00:00:00Z'
root=$PWD
mk() {                           # base on main; 2-commit branch 'pr'; THEN main moves
  cd "$root" && rm -rf r && git init -q -b main r && cd r
  echo base > f && git add f && git commit -qm "base"
  git switch -qc pr
  echo a >> f && git commit -qam "pr: step 1"
  echo b >> f && git commit -qam "pr: step 2"
  git switch -q main
  echo x > g && git add g && git commit -qm "main: add g"   # main diverges from pr
}

mk; git merge --no-ff pr -qm "Merge PR #1"
echo "=== MERGE COMMIT (--no-ff): 2 parents, keeps branch commits ==="
git log --oneline --graph | sed -E 's/[0-9a-f]{7,}/<sha>/g'

mk; git merge --squash pr -q && git commit -qm "feat: the PR, squashed"
echo "=== SQUASH: one new commit on main, linear, branch commits gone ==="
git log --oneline --graph | sed -E 's/[0-9a-f]{7,}/<sha>/g'

mk; git rebase main pr -q && git switch -q main && git merge pr -q
echo "=== REBASE + FF: linear, keeps commits, new hashes ==="
git log --oneline --graph | sed -E 's/[0-9a-f]{7,}/<sha>/g'`,
        output: `=== MERGE COMMIT (--no-ff): 2 parents, keeps branch commits ===
*   <sha> Merge PR #1
|\\
| * <sha> pr: step 2
| * <sha> pr: step 1
* | <sha> main: add g
|/
* <sha> base
Squash commit -- not updating HEAD
Automatic merge went well; stopped before committing as requested
=== SQUASH: one new commit on main, linear, branch commits gone ===
* <sha> feat: the PR, squashed
* <sha> main: add g
* <sha> base
=== REBASE + FF: linear, keeps commits, new hashes ===
* <sha> pr: step 2
* <sha> pr: step 1
* <sha> main: add g
* <sha> base`,
        explain: 'The same branch, with the same two commits, produces three different histories depending on how it is integrated. The no-fast-forward merge creates a dedicated merge commit with two parents; the graph shows the branch\'s two commits on their own line joining back at the merge, so the individual steps and the fact that a branch existed are both preserved, at the cost of a non-linear graph. The squash merge takes the combined effect of the branch\'s two commits and records it as a single brand-new commit directly on main; the history is a straight line with exactly one commit representing the whole pull request, and the intermediate steps no longer exist as commits. The rebase approach re-creates the branch\'s commits one at a time on top of main\'s current tip and then fast-forwards main to include them; the history is linear and the individual commits are kept, but because they were re-created their hashes differ from the originals. Squash and rebase both yield the linear history that keeps bisect and revert simple, which is why they dominate on continuously-deployed services; the merge commit is favoured where preserving branch structure matters.',
        explainHi: 'Wahi branch, same do commits ke saath, teen alag histories produce karता hai iske hisaab se ki ise kaise integrate kiya jाता hai. No-fast-forward merge do parents ke saath ek dedicated merge commit banаता hai; graph branch ke do commits ko unki apni line par dikhता hai merge par wapas join karते hue. Squash merge branch ke do commits ka combined effect leता hai aur ise main par ek single brand-new commit ke roop mein record karता hai; history ek straight line hai exactly ek commit ke saath. Rebase approach branch ke commits ko main ke current tip par ek-ek karके re-create karता hai aur phir main ko fast-forward karता hai; history linear hai aur individual commits rakhे jाते hain, par unke hashes differ karते hain. Squash aur rebase dono linear history dete hain jo bisect aur revert simple rakhती hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# a team with "CI" that still can't deploy more than once a sprint
# - every feature is a branch that lives 1-3 weeks
# - CI runs on each branch (green!) — but "integration" only happens at merge
# - merge day = a full day of conflict resolution + "it worked separately" bugs
# - QA then tests the merged result for days
# "we do CI/CD" — no. you run test automation on isolated branches.`,
        right: `# CONTINUOUS integration = integrating (merging to the shared branch) continuously.
# - decompose the feature so each day's work merges to main behind a flag
# - CI runs on MAIN, on the actually-integrated code, many times a day
# - main is always releasable -> deploy is a non-event you can do anytime
# the branching model is upstream of your deploy frequency. fix it first.`,
        why: 'Continuous integration is defined by the act of integrating — merging each developer\'s work into the shared mainline — happening frequently, many times a day. Running an automated test suite is a valuable supporting practice but it is not what the term means, and a team can have extensive test automation while doing very little actual integration. When features are developed on branches that live for weeks, the tests on each branch only verify that branch in isolation; the real integration, where one person\'s changes meet everyone else\'s, is deferred to merge time and happens all at once. That is when conflicts appear, when assumptions that held on separate branches turn out to be incompatible, and when integration bugs surface, all far from the context in which the code was written and all at the worst possible moment. Deploy frequency is bounded by how often code actually reaches the shared branch in a releasable state, so a team merging monthly cannot deploy weekly regardless of tooling. Improving delivery therefore starts with shrinking branch lifetime: decomposing work so each day produces a small, safe, individually mergeable change, integrating it to the mainline behind a flag if incomplete, and running CI on the mainline itself.',
        whyHi: 'Continuous integration integrate karने ke act se define hoती hai — har developer ka kaam shared mainline mein merge karना — frequently, din mein kई baar. Ek automated test suite chalाना ek valuable supporting practice hai par ye wo nahi jo term ka matlab hai. Jab features aisी branches par develop hoते hain jo hafton jeeती hain, har branch par tests sirf us branch ko isolation mein verify karте hain; real integration merge time tak defer hoती hai aur ek saath hoती hai. Tabhi conflicts appear karते hain, tabhi assumptions incompatible nikalते hain, aur tabhi integration bugs surface karते hain. Deploy frequency is se bounded hai ki code kitni baar shared branch tak ek releasable state mein pahunchता hai. Delivery improve karना isliye branch lifetime shrink karने se shuru hoता hai.',
      },
      {
        wrong: `# adopting GitFlow for a continuously-deployed web app "because it's standard"
# main + develop + feature/* + release/* + hotfix/*
# -> every change: branch off develop, PR to develop, later a release/* branch,
//    stabilise, merge to main AND back to develop, tag. days of ceremony to
//    ship a one-line fix. develop and main constantly drift. hotfixes merge
//    into one but not the other. nobody's sure what's actually deployed.`,
        right: `# for a service you deploy continuously with ONE live version: GitHub Flow.
#   main (always deployable) + short-lived feature branches + PR + checks + merge
#   + deploy on merge. that's it.
# GitFlow is for VERSIONED, SCHEDULED releases of software people INSTALL and where
# you maintain several versions at once. its own author says don't use it for CD.`,
        why: 'GitFlow was designed for a specific situation: software released as explicit numbered versions on a schedule, where several versions are supported simultaneously and a release must be stabilised over time before it ships. Its multiple long-lived branches and the prescribed flows between them exist to manage that situation. A web service that is deployed continuously and has exactly one version live at a time has none of those requirements, so every part of GitFlow becomes overhead with no corresponding benefit. The separate integration branch duplicates the role of the mainline; feature branches are encouraged to live long enough to be "features" rather than daily increments; the release-branch step inserts a stabilisation phase into a pipeline whose whole point is that the mainline is always releasable; and keeping the integration branch and the released branch synchronised, especially around urgent fixes, is a recurring source of error and of uncertainty about what is actually running in production. The appropriate model for continuous deployment of a single-version service is the minimal one: a single always-deployable mainline, short-lived branches, review and automated checks on merge, and deployment triggered by the merge. Extra branch structure should be added only when a concrete need for it appears.',
        whyHi: 'GitFlow ek specific situation ke liye designed tha: ek schedule par explicit numbered versions ke roop mein released software, jahaan kई versions ek saath supported hain aur ek release ko ship hone se pehle samay ke saath stabilise karना chahiye. Iski multiple long-lived branches us situation ko manage karने ke liye exist karती hain. Ek web service jo continuously deploy hoती hai aur ek samay par exactly ek version live hai un requirements mein se koi nahi rakhती, to GitFlow ka har part bina corresponding benefit ke overhead ban jата hai. Separate integration branch mainline ki role duplicate karता hai; release-branch step ek stabilisation phase insert karता hai ek pipeline mein jiska poora point ye hai ki mainline hamesha releasable hai. Continuous deployment ke liye appropriate model minimal wala hai.',
      },
      {
        wrong: `# "trunk-based" but with slow, flaky CI and no feature flags
# - CI takes 45 min and fails randomly ~20% of the time
# -> devs batch a day's work to avoid waiting through CI 5x
# -> a red main is ignored ("probably just flaky") so real breakage sits for hours
# -> half-done features can't be merged (no flags) so they pile up on branches
# result: nominally trunk-based, actually back to long branches + big merges.`,
        right: `# trunk-based DEPENDS on its supporting practices — fix these first:
#   - CI < 10 min and TRUSTED (quarantine/fix flaky tests aggressively;
//      a flaky suite is worse than no suite — it trains people to ignore red)
#   - feature flags so incomplete work merges disabled
#   - auto-revert or all-hands-fix when main goes red
# without them, "commit to main" just recreates the problem it was meant to solve.`,
        why: 'Trunk-based development is not simply the instruction to commit to the mainline; it is that practice together with the conditions that make it viable, and removing those conditions makes it fail. A continuous-integration suite that takes a long time to run pushes developers to accumulate changes and merge less often, so that they wait through it fewer times, which lengthens branch lifetime — the exact thing trunk-based development exists to prevent. A suite that fails intermittently for reasons unrelated to the change destroys the signal that a red mainline is supposed to carry: once people learn that failures are often spurious, they stop treating a broken mainline as urgent, and genuine breakage then blocks the team for hours while being ignored. The absence of feature flags means work that is not finished cannot be merged in a safe state, so it stays on branches and grows, reproducing long-lived branches under a different name. Each of these undermines the model, and together they leave a team that describes itself as trunk-based but is really doing infrequent large merges. The supporting practices — a fast and trusted test suite, flags for incomplete work, and a strong response to a red mainline — are not optional add-ons; they are what the model consists of.',
        whyHi: 'Trunk-based development sirf mainline ko commit karने ka instruction nahi hai; ye wo practice hai un conditions ke saath jo ise viable banाती hain, aur un conditions ko remove karना ise fail karता hai. Ek CI suite jo chalने mein lamba samay leता hai developers ko changes accumulate karने aur kम baar merge karने ke liye push karता hai, jo branch lifetime lambा karता hai. Ek suite jo intermittently fail hoती hai us signal ko destroy karता hai jo ek red mainline carry karने waala hai. Feature flags ki absence ka matlab jo kaam finished nahi hai use ek safe state mein merge nahi kiya ja sakта. Supporting practices — ek fast aur trusted test suite, incomplete work ke liye flags, aur ek red mainline ka ek strong response — optional add-ons nahi hain; ye wo hain jismें model consist karта hai.',
      },
    ],

    realWorld: [
      {
        en: '**A team stuck at "deploy every two weeks" moved to daily deploys in a quarter** — not by changing the pipeline, but by capping branch age at 24h, adding feature flags, and getting CI under 8 minutes. Deploy frequency followed merge frequency.',
        hi: '**Ek team jo "har do hafte deploy" par stuck thi ek quarter mein daily deploys par gayी** — pipeline change karके nahi, balki branch age 24h par cap karके, feature flags add karके, aur CI 8 minutes ke neeche laकर.',
      },
      {
        en: '**A GitFlow-to-GitHub-Flow migration that deleted `develop`** — the `develop`/`main` drift had caused three "the hotfix isn\'t in the release" incidents. One always-deployable `main` ended the class of bug.',
        hi: '**Ek GitFlow-se-GitHub-Flow migration jisne `develop` delete kiya** — `develop`/`main` drift ne teen "hotfix release mein nahi hai" incidents cause kiye thे.',
      },
      {
        en: '**A "trunk-based" rollout that regressed to big branches** because CI was 40 minutes and 15% flaky. Fixing the test suite (quarantine flaky tests, parallelise, cache) was the actual unlock — not any git change.',
        hi: '**Ek "trunk-based" rollout jo baड़ी branches par regress hua** kyunki CI 40 minutes aur 15% flaky tha. Test suite fix karна actual unlock tha.',
      },
    ],

    interviewQA: [
      {
        q: 'Why is trunk-based development considered a prerequisite for continuous delivery?',
        qHi: 'Trunk-based development ko continuous delivery ke liye ek prerequisite kyun mाना jाता hai?',
        a: 'Because continuous delivery requires that the mainline is always in a releasable state and that changes reach it frequently, and trunk-based development is the branching model that produces both. Continuous integration, in the original sense, means integrating each person\'s work into the shared branch many times a day; that is what trunk-based development does by keeping branches short-lived, hours rather than weeks, or committing directly. When integration happens continuously, conflicts and incompatibilities surface immediately, in small amounts, close to the context that created them, so they are cheap to resolve and the mainline stays healthy. When branches instead live for weeks, integration is deferred to merge time and arrives all at once as a large, painful event with conflicts and late-discovered integration bugs, and during that period the mainline is not reliably releasable. Deploy frequency cannot exceed the rate at which code reaches the shared branch in a releasable state, so a team merging every few weeks cannot deploy daily no matter how much automation it has. Trunk-based development also forces the supporting practices that continuous delivery needs: a fast trusted test suite, feature flags so incomplete work can be merged safely, and small decomposed changes. Long-lived branches let a team avoid all of that and defer the pain, which is precisely why they are incompatible with continuous delivery.',
        aHi: 'Kyunki continuous delivery ko chahiye ki mainline hamesha ek releasable state mein ho aur changes ise frequently reach karें, aur trunk-based development wo branching model hai jo dono produce karता hai. Continuous integration ka matlab har person ka kaam shared branch mein din mein kई baar integrate karना; wo trunk-based development karता hai branches ko short-lived rakhके. Jab integration continuously hoती hai, conflicts aur incompatibilities turant surface karते hain, small amounts mein, us context ke paas jo unhe create kiya, to wo resolve karना cheap hai. Jab branches hafton jeeती hain, integration merge time tak defer hoती hai aur ek saath ek baड़े, painful event ke roop mein aati hai. Deploy frequency us rate se zyada nahi ho sakती jispar code shared branch tak ek releasable state mein pahunchता hai.',
      },
      {
        q: 'Compare squash merge, merge commit, and rebase-and-merge. When would you pick each?',
        qHi: 'Squash merge, merge commit, aur rebase-and-merge compare karो. Aap har ek kab pick karोge?',
        a: 'A merge commit, forced with the no-fast-forward option, creates a commit with two parents whenever a branch is integrated. It preserves every individual commit on the branch and records the topological fact that a branch existed and was merged, at the cost of a non-linear history with extra commits. You pick it when the branch structure itself is meaningful — for example in GitFlow, or when you want the history to show which commits belonged to which piece of work. A squash merge collapses all of a branch\'s commits into a single new commit on the mainline. History stays perfectly linear with exactly one commit per pull request, which makes it easy to read, to revert a whole change at once, and to bisect. The cost is that the branch\'s intermediate commits are lost, so fine-grained history within a change is gone. It is the most common choice for web teams using GitHub Flow, especially when branch commits tend to be messy work-in-progress. Rebase-and-merge replays the branch\'s commits onto the current mainline tip and fast-forwards, giving a linear history that keeps the individual commits, but their hashes change because they are re-created. You pick it when you want linear history and the individual commits are each clean and worth keeping. In practice, teams optimising for a simple linear history that makes bisect and revert easy choose squash or rebase; the merge commit is for when preserving branch topology matters.',
        aHi: 'Ek merge commit, no-fast-forward option se forced, jab bhi ek branch integrate hoती hai do parents ke saath ek commit banаता hai. Ye branch par har individual commit preserve karता hai, ek non-linear history ki cost par. Aap ise pick karते ho jab branch structure khud meaningful hai. Ek squash merge branch ke saare commits ko mainline par ek single naye commit mein collapse karता hai. History perfectly linear rehती hai per pull request exactly ek commit ke saath, jo padhना, revert karना, aur bisect karना aasan banаता hai. Cost ye hai ki branch ke intermediate commits kho jाते hain. GitHub Flow istemal karने wali web teams ke liye sabse common choice. Rebase-and-merge branch ke commits ko current mainline tip par replay karता hai aur fast-forward karता hai, ek linear history deता hai jo individual commits rakhती hai par unke hashes change karती hai. Practice mein, teams jo ek simple linear history ke liye optimise karती hain squash ya rebase choose karती hain.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, summarise trunk-based development, GitHub Flow, and GitFlow in one line each, and say which fits a continuously-deployed web service with one live version — and which its own author says not to use for CD.',
        taskHi: 'Ek comment mein, teenों models ek-ek line mein summarise karो.',
        hint: 'TRUNK-BASED: everyone integrates into one branch many times a day, branches live hours, main always releasable, incomplete work behind feature flags — the model for CI/CD & DORA elite. GITHUB FLOW: one always-deployable `main` + short-lived feature branches merged via PR + checks + review, deploy on merge — a fine default for most web teams. GITFLOW: `main` + `develop` + `feature/*` + `release/*` + `hotfix/*`, for versioned scheduled releases of installed software — heavyweight; its author (Vincent Driessen) says don\'t use it for continuous delivery. For a continuously-deployed single-version web service: GitHub Flow (or pure trunk-based).',
        hintHi: 'TRUNK-BASED: sab ek branch mein din mein kई baar integrate, branches ghanton jeeती hain, main always releasable, incomplete work feature flags ke peeche. GITHUB FLOW: ek always-deployable `main` + short-lived feature branches PR se merged. GITFLOW: `main` + `develop` + `feature/*` + `release/*` + `hotfix/*`, versioned scheduled releases ke liye — author kehता hai CD ke liye mat istemal karो. Web service ke liye: GitHub Flow.',
      },
      {
        task: 'In a comment, explain the chain: branch lifetime → batch size → merge risk → integration-bug latency → deploy frequency. Then explain why a team with heavy "CI tooling" but 2-week branches is not actually doing CI.',
        taskHi: 'Ek comment mein, chain samjhाओ: branch lifetime → batch size → merge risk → deploy frequency.',
        hint: 'A longer-lived branch accumulates more changes (bigger batch) → a bigger diff diverging further from main → a harder, more conflict-prone merge → integration bugs (incompatible assumptions between branches) are found only at merge, weeks after they were written, when context is gone → and since deploy frequency ≤ merge frequency ≤ (1 / branch lifetime), long branches cap how often you can ship. "CI" means *integrating* continuously — merging to the shared branch many times a day. Running a test suite on isolated 2-week branches verifies each branch alone; the actual integration (where everyone\'s changes meet) is still deferred to one big merge. That\'s test automation, not continuous integration.',
        hintHi: 'Ek longer-lived branch zyada changes accumulate karता hai (bada batch) → ek bada diff main se zyada diverge → ek harder, zyada conflict-prone merge → integration bugs sirf merge par mile, hafton baad → aur deploy frequency ≤ merge frequency ≤ (1 / branch lifetime). "CI" ka matlab continuously *integrate* karना. Isolated 2-hafte branches par ek test suite chalाना har branch ko akela verify karता hai; actual integration abhi bhi ek baड़े merge tak defer hai.',
      },
      {
        task: 'A team says "we\'re trunk-based" but deploys weekly and branches keep growing. CI is 40 min and ~15% flaky, and there are no feature flags. In a comment, explain why it regressed and the three fixes in priority order.',
        taskHi: 'Ek team "trunk-based" kehती hai par weekly deploy karती hai aur branches badhती rehती hain. Kyun regress hua?',
        hint: 'Regressed because trunk-based DEPENDS on its supporting practices: (1) slow CI (40 min) → devs batch a day\'s work to avoid waiting → branch lifetime creeps back up. (2) flaky CI (15%) → a red main stops meaning "broken" → real breakage is ignored for hours, and people avoid merging into a suite they don\'t trust. (3) no feature flags → half-done work can\'t be merged safely → it piles up on branches. Fix in order: (a) make CI fast (<10 min) AND trusted (quarantine/fix flaky tests — a flaky suite trains people to ignore red); (b) add feature flags so incomplete work merges disabled; (c) auto-revert or all-hands-fix on red main. The git workflow change is worthless until these land.',
        hintHi: 'Regress hua kyunki trunk-based apni supporting practices par DEPEND karता hai: (1) slow CI → devs ek din ka kaam batch karте hain → branch lifetime badhती hai. (2) flaky CI → ek red main "broken" ka matlab nahi rehता → real breakage ignore hoता hai. (3) no feature flags → half-done work safely merge nahi ho sakта → branches par pile up. Fix order mein: (a) CI fast (<10 min) AND trusted banाओ; (b) feature flags add karो; (c) red main par auto-revert.',
      },
    ],

    keyTakeaways: [
      'Your branching model sets a CEILING on deploy frequency, because deploy frequency ≤ merge frequency ≤ (1 / branch lifetime). THREE MODELS: TRUNK-BASED (everyone integrates into ONE branch many times a day; branches live HOURS; `main` always releasable; incomplete work behind FEATURE FLAGS) — the model DORA links to elite performance and the precondition for real CI. GITHUB FLOW (one always-deployable `main` + short-lived feature branches, merged via PR + checks + review, deploy on merge) — a good default for most web teams. GITFLOW (`main` + `develop` + `feature/*` + `release/*` + `hotfix/*`) — for VERSIONED, SCHEDULED releases of INSTALLED software with multiple live versions; heavyweight; its own author says DO NOT use it for continuous delivery.',
      'BRANCH LIFETIME is the whole game: a longer branch = bigger batch = bigger diff diverging further from main = harder/conflict-prone merge = integration bugs found weeks late (context gone) = a review nobody does properly = a broken merge blocking everyone longer. "Continuous integration" LITERALLY means merging to the shared branch many times a day — a team running a test suite on isolated 2-week branches is doing TEST AUTOMATION, not CI; the actual integration is still deferred to one big merge.',
      'TRUNK-BASED DEVELOPMENT DEPENDS on supporting practices and fails without them: (1) a FAST (<~10 min) and TRUSTED CI suite on every change to main — slow CI makes people batch (lifetime creeps up), FLAKY CI destroys the meaning of a red main (real breakage gets ignored); (2) FEATURE FLAGS / branch-by-abstraction so incomplete work merges disabled; (3) SMALL changes decomposed to a day or less; (4) a "STOP THE LINE" culture — a red main blocks everyone from integrating, so fixing it (or auto-reverting after N min) is top priority. Without these, "commit to main" just recreates long branches under a new name.',
      'HOW A BRANCH LANDS ON MAIN: FAST-FORWARD (main slides to the branch tip; linear, no merge commit; only if main hasn\'t moved). MERGE COMMIT (`--no-ff`: a commit with 2 parents; keeps every branch commit + the branch topology; non-linear). SQUASH (collapse the branch into ONE new commit on main; perfectly linear, one commit per PR, easy revert/bisect; loses intermediate commits — very common with GitHub Flow). REBASE-AND-MERGE (replay the branch\'s commits onto main\'s tip then FF; linear, keeps commits, but new hashes). Squash & rebase both give the linear history that keeps `git bisect`/`git revert` simple — they dominate on continuously-deployed services; merge commits are for when branch topology matters.',
      'RELEASE BRANCHES (even trunk-based teams sometimes need them): at release time cut `release/1.4` from `main`, deploy from it, and cherry-pick ONLY critical fixes onto it while normal work continues on `main`. Needed when you support MULTIPLE LIVE VERSIONS, ship software others install and can\'t force-update, or can\'t deploy `main`\'s HEAD on demand. A pure continuously-deployed web service with ONE live version usually needs none of this — `main` IS the release.',
    ],
    keyTakeawaysHi: [
      'Aapका branching model deploy frequency par ek CEILING set karता hai, kyunki deploy frequency ≤ merge frequency ≤ (1 / branch lifetime). TEEN MODELS: TRUNK-BASED (sab ONE branch mein din mein kई baar integrate; branches GHANTON jeeती hain; `main` always releasable; incomplete work FEATURE FLAGS ke peeche) — DORA elite ka model. GITHUB FLOW (ek always-deployable `main` + short-lived feature branches PR se merged) — zyaादातर web teams ke liye achha default. GITFLOW (`main` + `develop` + `feature/*` + `release/*` + `hotfix/*`) — VERSIONED, SCHEDULED releases ke liye; author kehता hai CD ke liye MAT istemal karो.',
      'BRANCH LIFETIME poora game hai: ek longer branch = bada batch = bada diff = harder merge = integration bugs hafton late mile = ek review jo koi properly nahi karता. "Continuous integration" ka LITERALLY matlab shared branch mein din mein kई baar merge karना — isolated 2-hafte branches par ek test suite chalाना TEST AUTOMATION hai, CI nahi.',
      'TRUNK-BASED DEVELOPMENT supporting practices par DEPEND karता hai: (1) ek FAST (<~10 min) aur TRUSTED CI suite — slow CI batching karवाता hai, FLAKY CI ek red main ka matlab destroy karता hai; (2) FEATURE FLAGS taki incomplete work disabled merge ho; (3) SMALL changes ek din ya kम mein decompose; (4) ek "STOP THE LINE" culture — ek red main sabको block karता hai. Inके bina, "commit to main" bस long branches ko ek naye naam ke under recreate karता hai.',
      'EK BRANCH MAIN PAR KAISE LAND KARTA HAI: FAST-FORWARD (main branch tip par slide; linear, koi merge commit nahi). MERGE COMMIT (`--no-ff`: 2 parents ke saath ek commit; har branch commit + topology rakhता hai; non-linear). SQUASH (branch ko main par ONE naye commit mein collapse; perfectly linear, per PR ek commit; intermediate commits kho deता hai — GitHub Flow ke saath bahut common). REBASE-AND-MERGE (branch ke commits ko main ke tip par replay phir FF; linear, commits rakhता hai, par naye hashes). Squash aur rebase dono linear history dete hain.',
      'RELEASE BRANCHES: release time par `main` se `release/1.4` cut karो, ismें se deploy karो, ismें SIRF critical fixes cherry-pick karो. Tab chahiye jab aap MULTIPLE LIVE VERSIONS support karते ho, software ship karते ho jo doosre install karते hain, ya `main` ka HEAD on demand deploy nahi kar sakते. Ek pure continuously-deployed web service ONE live version ke saath usually ismें se kुछ nahi chahिए — `main` release HAI.',
    ],
  },

  {
    slug: 'ops-feature-flags-and-decoupling-deploy-from-release',
    title: 'Feature Flags & Decoupling Deploy from Release',
    titleHi: 'Feature Flags Aur Deploy Ko Release Se Alag Karna',
    description: 'Deploy is a technical event — new code is running. Release is a product event — users can see a feature. Feature flags separate the two, which is what makes it safe to merge unfinished work to main, ship continuously, roll out gradually, and turn a bad feature off without a rollback.',
    descriptionHi: 'Deploy ek technical event hai — naya code chal raha hai. Release ek product event hai — users ek feature dekh sakते hain. Feature flags dono ko alag karते hain, jo unfinished work ko main mein merge karना, continuously ship karना, gradually roll out karना, aur ek bad feature ko ek rollback ke bina off karना safe banаता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**A shop that stocks a new product in the back room days before it goes on the shelf.** Stocking it (deploy) is invisible to customers and low-risk — the boxes are just there. Putting it on the shelf (release) is the visible event, and you can do it for one aisle first, watch how it sells, and pull it back to the storeroom in seconds if there\'s a problem — no need to send the whole delivery truck away (a rollback). The staff can also keep half-built displays in the back room without any customer ever seeing them, which is what lets the delivery truck keep coming every day instead of once a quarter.',
      hi: '**Ek shop jo ek naye product ko shelf par jaane se dinों pehle back room mein stock karती hai.** Ise stock karना (deploy) customers ko invisible hai aur low-risk. Ise shelf par rakhना (release) visible event hai, aur aap ise pehle ek aisle ke liye kar sakते ho, dekhо ye kaise bikता hai, aur ek problem hone par seconds mein ise storeroom mein wapas pull kar sakते ho — poore delivery truck ko wapas bhejने ki zaroorat nahi (ek rollback). Staff back room mein half-built displays bhi rakh sakта hai bina kisi customer ke dekhे.',
    },

    simple: `**DEPLOY != RELEASE:**
\`\`\`
DEPLOY   new code is now RUNNING in production. a technical fact. should be frequent,
         small, boring, reversible.
RELEASE  a user can now SEE / USE a feature. a product decision. controlled by a FLAG,
         not by a deploy.
\`\`\`
Decoupling them = you can deploy 20x/day while releasing a feature once, to 1% first.

**A FEATURE FLAG is just a runtime conditional:**
\`\`\`
if (flags.isEnabled("new-checkout", { userId, plan })) {
   newCheckout();
} else {
   oldCheckout();
}
\`\`\`
Evaluated per-request against rules: on/off, % rollout, allow/deny lists, by plan/region/
user attribute. Changed WITHOUT a deploy (a flag service / config), effect in seconds.

**FOUR KINDS OF FLAG (different lifetimes!):**
\`\`\`
RELEASE      hide in-progress work; roll out gradually. LIFETIME: days-weeks, then DELETE.
OPS / KILL   turn off an expensive or fragile subsystem under load. LIFETIME: long-lived.
EXPERIMENT   A/B test; assign variants, measure. LIFETIME: the experiment, then delete.
PERMISSION   entitle features by plan/tenant/user. LIFETIME: permanent (it's product logic).
\`\`\`

**WHAT FLAGS BUY YOU:**
\`\`\`
- merge incomplete work to main daily (flag OFF) -> trunk-based actually works
- progressive delivery: 1% -> 10% -> 50% -> 100%, watching metrics at each step
- instant OFF for a bad feature — SECONDS, no rebuild, no rollback, no redeploy
- test in production safely (internal users / one tenant only)
- decouple "when engineering finishes" from "when marketing launches"
\`\`\`

**THE COSTS (flags are debt):**
\`\`\`
- every flag = a branch in the code = 2x the paths to test. combinatorial if you're careless.
- STALE flags rot: dead code, confusion, "why is this off?", risk of flipping the wrong one.
  -> every release flag needs a REMOVAL ticket from day one. audit quarterly.
- a flag system is infra you must run (SDK, caching, fallback when it's unreachable).
- flags can leak state/security bugs (evaluating with the wrong context).
\`\`\`

**MERGING INCOMPLETE WORK — three techniques:**
\`\`\`
FEATURE FLAG          wrap the new path in a runtime check, default off.
BRANCH BY ABSTRACTION  introduce an interface; move callers to it; add the new impl
                       behind it; switch; delete the old. all on main, no long branch.
DARK LAUNCH / SHADOW   run the new path for real traffic but discard its output; compare
                       to the old path's output + measure load. then cut over.
\`\`\`

**SCHEMA CHANGES use EXPAND / CONTRACT (never a breaking change in one step):**
\`\`\`
EXPAND    add the new column/table, nullable/defaulted. deploy. backfill.
MIGRATE   write to BOTH old and new; read from new. deploy. verify.
CONTRACT  stop writing the old; drop it. deploy.
\`\`\`
Each step is backward-compatible, so a rollback at any point is safe.`,

    simpleHi: `**DEPLOY != RELEASE:**
\`\`\`
DEPLOY   naya code ab production mein CHAL RAHA hai. ek technical fact. frequent, small, boring.
RELEASE  ek user ab ek feature DEKH / USE kar sakта hai. ek product decision. ek FLAG dwara controlled.
\`\`\`
Dono ko alag karना = aap din mein 20x deploy kar sakते ho jabki ek feature ek baar release karते ho, pehle 1% ko.

**Ek FEATURE FLAG bस ek runtime conditional hai:**
\`\`\`
if (flags.isEnabled("new-checkout", { userId, plan })) { newCheckout(); } else { oldCheckout(); }
\`\`\`
Per-request rules ke against evaluated: on/off, % rollout, allow/deny lists, plan/region se.
Ek deploy ke BINA changed, effect seconds mein.

**CHAAR KINDS OF FLAG (alag lifetimes!):**
\`\`\`
RELEASE      in-progress work chhupाओ; gradually roll out. LIFETIME: days-weeks, phir DELETE.
OPS / KILL   load ke under ek expensive subsystem off karो. LIFETIME: long-lived.
EXPERIMENT   A/B test. LIFETIME: experiment, phir delete.
PERMISSION   plan/tenant/user se features entitle karो. LIFETIME: permanent (product logic).
\`\`\`

**FLAGS AAPKO KYA DETE HAIN:**
\`\`\`
- incomplete work main mein daily merge karो (flag OFF) -> trunk-based actually kaam karता hai
- progressive delivery: 1% -> 10% -> 50% -> 100%, har step par metrics dekhते hue
- ek bad feature ke liye instant OFF — SECONDS, koi rebuild nahi, koi rollback nahi
- production mein safely test karो (internal users / ek tenant only)
\`\`\`

**COSTS (flags debt hain):**
\`\`\`
- har flag = code mein ek branch = test karने ke liye 2x paths.
- STALE flags rot: dead code, confusion. -> har release flag ko din ek se ek REMOVAL ticket chahiye.
- ek flag system infra hai jo aapको chalाना hai (SDK, caching, fallback).
\`\`\`

**INCOMPLETE WORK MERGE KARNA — teen techniques:**
\`\`\`
FEATURE FLAG          naye path ko ek runtime check mein wrap karो, default off.
BRANCH BY ABSTRACTION  ek interface introduce karो; callers ise move karो; naya impl iske peeche
                       add karो; switch karो; purana delete karो. sab main par.
DARK LAUNCH / SHADOW   naye path ko real traffic ke liye chalाओ par iska output discard karो;
                       purane path ke output se compare karो. phir cut over.
\`\`\`

**SCHEMA CHANGES EXPAND / CONTRACT istemal karते hain:**
\`\`\`
EXPAND    naya column/table add karो, nullable/defaulted. deploy. backfill.
MIGRATE   DONO old aur new ko write karो; new se read karो. deploy. verify.
CONTRACT  old ko write karना band karो; drop karो. deploy.
\`\`\`
Har step backward-compatible hai.`,

    content: `## Two different events

**Deploying** means new code is now running in the production environment. It is a technical event, it should be frequent and unremarkable, and — done well — it changes nothing a user notices.

**Releasing** means a user can now see or use a particular capability. It is a product decision about timing, audience, and risk.

When these are the same act — "the feature goes live the moment we deploy the branch that contains it" — every deploy carries product risk, deploys get batched and gated and scary, and turning a feature off means rolling back the deploy and everything else in it. **Feature flags** separate the two: the code deploys in a dormant state, and a separate control decides when and for whom it becomes active.

## What a feature flag is

A feature flag (or feature toggle) is a **runtime conditional** whose value comes from configuration rather than code:

\`\`\`
if (flags.isEnabled("new-checkout", { userId: user.id, plan: user.plan, country })) {
    return newCheckoutFlow();
}
return oldCheckoutFlow();
\`\`\`

The flag is evaluated **per request**, against **targeting rules** held outside the deployed artifact — in a flag-management service (LaunchDarkly, Unleash, Flagsmith, Split) or, more simply, a configuration store the app watches. Rules can be: fully on or off; a percentage rollout (deterministically bucketed by a stable key so a given user stays in the same bucket); allow-lists and deny-lists; or predicates on attributes like plan, region, tenant, or account age. Changing a rule takes effect within seconds, with **no deploy**.

## Four kinds of flag — and why lifetime matters

The single most useful distinction, because it dictates how you manage each flag:

| Kind | Purpose | Lifetime |
|---|---|---|
| **Release toggle** | hide in-progress work; roll it out gradually | **short** — days to weeks, then the flag *and* the old code path are deleted |
| **Ops / kill switch** | disable an expensive or fragile subsystem under load or during an incident | **long-lived** — a permanent operational control |
| **Experiment** | assign users to A/B variants and measure an outcome | the duration of the experiment, then deleted |
| **Permission / entitlement** | gate features by subscription plan, tenant, or user role | **permanent** — this is product logic, not a toggle |

Conflating these is a common mistake: teams leave release toggles in place for months "in case", accumulating dead code and confusion, or build entitlement logic as if it were a temporary toggle.

## What flags let you do

- **Merge incomplete work to \`main\` every day** with the flag off. This is what makes trunk-based development practical — a half-built feature lives in \`main\`, dormant, instead of on a branch for three weeks.
- **Progressive delivery.** Turn the feature on for 1% of users, watch error rates, latency, and business metrics, then 10%, 50%, 100% — backing out instantly at any step if a metric moves the wrong way. (Module 11 covers this in depth.)
- **Instant off for a bad feature.** A feature causing errors is disabled by flipping its flag — **seconds**, no rebuild, no redeploy, no rollback, and nothing else that shipped alongside it is affected.
- **Test in production safely.** Enable the feature only for internal users, or a single friendly tenant, and exercise it against real data and real load before anyone else sees it.
- **Decouple schedules.** Engineering merges and deploys when the work is done; the feature is switched on when marketing, support, and docs are ready — possibly weeks apart, with no code change between.

## The costs — flags are debt

- **Every flag is a fork in the code**, so it roughly doubles the paths through that area and, with several interacting flags, multiplies the combinations that could theoretically need testing. Keep flags independent and few.
- **Stale flags rot.** A release toggle left in after rollout is dead code plus a live risk: someone may flip the wrong one, or spend an hour puzzling over why a branch is unreachable. **Every release flag gets a removal ticket the day it is created**, and flag inventory is audited on a schedule.
- **The flag system is infrastructure.** An SDK in every service, a evaluation path on every request, local caching, and a defined behaviour when the flag service is unreachable (default to the safe value — usually "off" / old behaviour).
- **Flags can cause their own bugs** — evaluating with the wrong user context, a percentage rollout that isn't sticky so users flip-flop, a flag that leaks a feature to users who shouldn't have it.

## Merging incomplete work: three techniques

**Feature flag.** Wrap the new code path in a runtime check that defaults to off. Simplest; best when the new and old paths can coexist behind one conditional.

**Branch by abstraction.** When the change is too structural for a single \`if\` — replacing a library, a data layer, a core component:

1. Introduce an **abstraction** (an interface / seam) in front of the thing being replaced.
2. Move all callers to go through the abstraction, with the existing implementation behind it. Ship this; nothing has changed behaviourally.
3. Build the **new implementation** behind the same abstraction, incomplete, not yet wired. Ship it in pieces.
4. **Switch** the abstraction to the new implementation (often itself behind a flag).
5. **Delete** the old implementation and, eventually, the abstraction if it is no longer useful.

Every step is a small, safe, individually shippable change on \`main\` — no long-lived branch, ever.

**Dark launch / shadow traffic.** Run the new code path against **real production traffic** but **discard its output** — the user still gets the old path's result. Compare the new path's output to the old one's for correctness, and measure its latency and resource use under real load. When it matches and performs, cut over. Used for risky rewrites of read paths (search, ranking, pricing).

## Schema changes: expand / contract

A database schema change that both old and new code must tolerate cannot be a single breaking step, because during a deploy both versions of the app run at once and a rollback must stay safe. Use the **expand / contract** (a.k.a. parallel change) pattern:

1. **Expand.** Add the new structure — a new nullable column, a new table — without removing or changing anything. Deploy. Both old and new code work. Backfill existing rows in the background.
2. **Migrate.** Update the code to **write to both** old and new locations and **read from the new** one. Deploy. Verify the new path is correct with real data.
3. **Contract.** Remove the code that writes the old structure, then drop the old column or table. Deploy.

Each of the three deploys is backward-compatible with the one before it, so a rollback at any stage leaves a working system. A rename becomes: add the new column, write both, read new, stop writing old, drop old — five safe steps instead of one unsafe one.`,

    contentHi: `## Do alag events

**Deploy karना** ka matlab naya code ab production environment mein chal raha hai. Ek technical event, frequent aur unremarkable honा chahiye.

**Release karना** ka matlab ek user ab ek particular capability dekh ya use kar sakта hai. Timing, audience, aur risk ke baare mein ek product decision.

Jab ye same act hain, har deploy product risk carry karता hai, deploys batched aur scary ho jाते hain, aur ek feature off karना matlab deploy rollback karना. **Feature flags** dono ko alag karते hain: code ek dormant state mein deploy hoता hai, aur ek separate control decide karता hai kab aur kiske liye ye active banता hai.

## Ek feature flag kya hai

Ek feature flag ek **runtime conditional** hai jiska value code ke bजaay configuration se aata hai. Flag **per request** evaluated hoता hai, **targeting rules** ke against jo deployed artifact ke bahar rakhी hain — ek flag-management service mein ya ek configuration store. Rules ho sakती hain: fully on/off; ek percentage rollout (ek stable key se deterministically bucketed); allow-lists aur deny-lists; ya plan, region, tenant jaisे attributes par predicates. Ek rule change karना seconds mein effect leता hai, **koi deploy nahi**.

## Chaar kinds of flag

| Kind | Purpose | Lifetime |
|---|---|---|
| **Release toggle** | in-progress work chhupाओ; gradually roll out | **short** — days-weeks, phir flag *aur* purana code path delete |
| **Ops / kill switch** | load ke under ek expensive subsystem disable karो | **long-lived** — ek permanent operational control |
| **Experiment** | users ko A/B variants assign karो aur measure karो | experiment ka duration, phir deleted |
| **Permission / entitlement** | subscription plan, tenant, ya role se features gate karो | **permanent** — ye product logic hai |

## Flags aapको kya karने dete hain

- **Incomplete work ko \`main\` mein har din merge karो** flag off ke saath. Ye trunk-based development ko practical banаता hai.
- **Progressive delivery.** Feature ko 1% users ke liye on karो, error rates dekhо, phir 10%, 50%, 100%.
- **Ek bad feature ke liye instant off.** **Seconds**, koi rebuild nahi, koi redeploy nahi, koi rollback nahi.
- **Production mein safely test karो.** Feature ko sirf internal users ke liye enable karो.

## Costs — flags debt hain

- **Har flag code mein ek fork hai**, to ye us area ke through paths ko roughly double karता hai.
- **Stale flags rot.** **Har release flag ko iske create hone ke din ek removal ticket milता hai**.
- **Flag system infrastructure hai.** Har service mein ek SDK, har request par ek evaluation path, local caching, aur ek defined behaviour jab flag service unreachable hai.

## Incomplete work merge karना: teen techniques

**Feature flag.** Naye code path ko ek runtime check mein wrap karो jo off default karता hai.

**Branch by abstraction.** Jab change ek single \`if\` ke liye bahut structural hai: (1) ek **abstraction** introduce karो; (2) saare callers ko abstraction ke through jaane ke liye move karो; (3) **naya implementation** same abstraction ke peeche build karो; (4) abstraction ko naye implementation par **switch** karो; (5) purana **delete** karो. Har step \`main\` par ek small, safe change.

**Dark launch / shadow traffic.** Naye code path ko **real production traffic** ke against chalाओ par iska **output discard** karो. Naye path ke output ko purane ke saath compare karो. Jab ye match karता hai, cut over karो.

## Schema changes: expand / contract

1. **Expand.** Naya structure add karो — ek naya nullable column — bina kुछ remove kiye. Deploy. Backfill.
2. **Migrate.** Code ko **dono** old aur new ko write karने aur **new se read** karने ke liye update karो. Deploy. Verify.
3. **Contract.** Purane structure ko write karने wala code remove karो, phir purana column drop karो. Deploy.

Teenों deploys backward-compatible hain, to kisi bhi stage par ek rollback ek working system chhoड़ता hai.`,

    examples: [
      {
        title: 'A feature flag with progressive rollout and an instant kill',
        titleHi: 'Progressive rollout aur ek instant kill ke saath ek feature flag',
        code: `// the flag check — evaluated per request, rules live OUTSIDE the deployed code
function handleCheckout(req, res) {
  const ctx = { userId: req.user.id, plan: req.user.plan, country: req.geo.country };
  if (flags.isEnabled("new-checkout", ctx)) {
    return newCheckout(req, res);
  }
  return oldCheckout(req, res);
}

// --- rollout timeline, ALL without a deploy (each is a rule change) ---
// day 0   deploy the code. flag rule: OFF for everyone. new path is dormant in prod.
// day 0   rule: ON for  country == "internal-test"        -> QA exercises it for real
// day 2   rule: ON for  plan == "free" AND userId % 100 == 0   -> 1% of free users
//         watch: checkout error rate, p95 latency, completed-purchase rate
// day 3   1% healthy -> rule: userId % 100 < 10             -> 10%
// day 5   -> userId % 100 < 50                              -> 50%
// day 7   -> ON for everyone

// --- day 8: a downstream tax API starts flaking under the new path's load ---
// rule: OFF for everyone.  effect: SECONDS. every request is back on oldCheckout.
// NO rebuild, NO redeploy, NO rollback. the new code is still deployed, just dormant.
// fix the tax-API call, re-enable at 1%, resume the ramp.`,
        output: `The code deploys once, on day 0, in a dormant state. Every subsequent step - internal-only, 1%, 10%, 50%, 100%, and the emergency disable on day 8 - is a targeting-rule change that takes effect in seconds with no deploy. A bad feature is turned off by flipping the flag, not by rolling back, so nothing else that shipped since day 0 is disturbed.`,
        explain: 'The deployment and the release are completely separated here. On day zero the new checkout code reaches production but the flag rule evaluates to off for every request, so the new path never runs and the deployment is risk-free. Making the feature available is then a sequence of changes to the targeting rule, held outside the deployed artifact, each taking effect within seconds: first restricted to internal testers who exercise it against real production infrastructure, then to a small deterministic slice of real users chosen by a stable key so the same users stay in the treatment group as the percentage grows, with the team watching technical and business metrics at each step before widening. If a metric regresses, the previous step is restored just as quickly. The critical property appears on day eight: when the new path overloads a downstream dependency, disabling it is a single rule change that returns every request to the old path in seconds, without rebuilding or redeploying anything and without reverting any of the other changes that shipped in the intervening week. The new code stays in production, dormant, ready to be re-enabled once the dependency problem is fixed.',
        explainHi: 'Deployment aur release yahaan poori tarah separated hain. Day zero par naya checkout code production tak pahunchता hai par flag rule har request ke liye off evaluate karता hai, to naya path kabhi run nahi karता aur deployment risk-free hai. Feature ko available banाना phir targeting rule ke changes ka ek sequence hai, deployed artifact ke bahar rakhа, har ek seconds mein effect leता: pehle internal testers tak restricted, phir real users ke ek small deterministic slice tak ek stable key se chuna. Agar ek metric regress karता hai, pichla step utni hi jaldi restore hoता hai. Critical property day eight par appear karती hai: jab naya path ek downstream dependency overload karता hai, ise disable karना ek single rule change hai jo har request ko seconds mein purane path par wapas karता hai, bina kुछ rebuild ya redeploy kiye.',
      },
      {
        title: 'Renaming a column safely with expand / contract',
        titleHi: 'Expand / contract se ek column safely rename karna',
        code: `-- GOAL: rename users.signup_date  ->  users.created_at  with ZERO downtime,
-- while old and new app versions run side by side during each deploy.

-- ===== STEP 1: EXPAND (deploy A) =====
ALTER TABLE users ADD COLUMN created_at timestamptz;      -- nullable, no default lock
-- backfill in batches, off the hot path:
UPDATE users SET created_at = signup_date WHERE created_at IS NULL AND id BETWEEN 1 AND 10000;
-- ... repeat ...
-- app code unchanged. old code reads/writes signup_date. rollback = drop the column. safe.

-- ===== STEP 2: MIGRATE (deploy B) =====
-- app code now: WRITE both (created_at AND signup_date), READ created_at.
-- new rows get both; old rows already backfilled. old app version (if rolled back)
-- still works off signup_date, which is still being written. safe.

-- ===== STEP 3: CONTRACT (deploy C) =====
-- app code now: WRITE created_at only, READ created_at only. signup_date unused.
-- deploy. confirm nothing references signup_date (logs / grep / query stats).
ALTER TABLE users DROP COLUMN signup_date;                 -- only now
-- rollback of deploy C is safe: the previous version also only used created_at.`,
        output: `A rename is done as five backward-compatible steps across three deploys: add the new column (nullable), backfill it, then write-both/read-new, then write-new/read-new, then drop the old column. At every point both the current and the previous app version work against the schema, so a rollback during any deploy is safe. A single "ALTER TABLE ... RENAME" would break whichever app version it wasn\'t deployed with.`,
        explain: 'A direct column rename is unsafe in a system that deploys without downtime because during the deploy both the old and the new version of the application are running simultaneously against the same database, and a rename satisfies at most one of them. The expand and contract pattern replaces the single breaking change with a series of changes each of which is compatible with the version before it. First the new column is added alongside the old one, nullable so the change does not require rewriting existing rows or holding a long lock, and existing data is copied into it gradually in the background; at this stage the application is unchanged and only uses the old column. Next the application is updated to write every change to both columns while reading from the new one, so a rollback to the previous version still finds the old column populated. Then the application is updated again to use only the new column, and only after that version is confirmed stable is the old column dropped. Each deploy in this sequence is safe to roll back because the previous application version is compatible with the schema as it stands at that moment. The same structure applies to splitting a column, changing a type, or moving data to another table.',
        explainHi: 'Ek direct column rename ek system mein unsafe hai jo bina downtime deploy karता hai kyunki deploy ke dauран application ka old aur new dono version ek saath same database ke against chal rahे hote hain, aur ek rename unmें se at most ek ko satisfy karता hai. Expand aur contract pattern single breaking change ko changes ki ek series se replace karта hai jinmें se har ek pichle version ke compatible hai. Pehle naya column purane ke saath add hoता hai, nullable taki change ko existing rows rewrite karने ki zaroorat na ho, aur existing data ise background mein gradually copy hoता hai. Phir application ko har change ko dono columns mein write karने ke liye update kiya jाता hai jabki naye se read karते hue. Phir application ko phir se sirf naya column use karने ke liye update kiya jाता hai, aur sirf uske baad purana column drop hoता hai. Is sequence mein har deploy roll back karना safe hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# treating a deploy AS the release - every deploy needs sign-off
# -> deploys get batched (one a week), each carrying 30 changes
# -> each deploy is high-risk (30 things could break) and scary
# -> a bad feature means rolling back the whole deploy - and the 29 good changes
# -> "test in prod" is impossible; the feature is either invisible or fully live`,
        right: `# separate them with a flag:
#   deploy = code is running (frequent, small, dormant features, low-risk)
#   release = flip the flag (product decision, gradual, per-segment, instant undo)
# now: deploy 20x/day freely; release "new-checkout" next Tuesday at 1%; kill it
# in seconds if it misbehaves without touching anything else.`,
        why: 'When deploying a change and making it visible to users are the same action, the risk of the product change and the risk of the deployment are fused, so every deployment inherits the caution that product changes warrant. Deployments then acquire approval steps and get batched together to amortise the ceremony, which means each one carries many unrelated changes and any failure is hard to attribute and expensive to reverse, because rolling back to remove one bad feature also removes every good change bundled with it. It also becomes impossible to expose a feature to a subset of users or to watch its effect at small scale, since deploying it makes it live for everyone at once. Separating the two with a flag lets the deployment be a frequent, small, low-risk technical event carrying dormant code, while the decision to activate a feature is made independently, applied gradually to chosen segments, observed, and reversed in seconds if needed without disturbing anything else that has shipped.',
        whyHi: 'Jab ek change deploy karना aur ise users ko visible banाना same action hain, product change ka risk aur deployment ka risk fuse ho jाते hain, to har deployment wo caution inherit karता hai jo product changes warrant karते hain. Deployments phir approval steps acquire karते hain aur batch ho jाते hain, jiska matlab har ek bahut sी unrelated changes carry karता hai aur koi bhi failure attribute karना mushkil aur reverse karना mehnga hai, kyunki ek bad feature remove karने ke liye rollback har good change bhi remove karта hai. Ek feature ko users ke ek subset ko expose karना bhi impossible ho jата hai. Dono ko ek flag se separate karना deployment ko ek frequent, small, low-risk technical event honे deता hai, jabki ek feature ko activate karने ka decision independently banाya jाता hai, gradually apply kiya jाता hai, observed, aur seconds mein reversed.',
      },
      {
        wrong: `# leaving release flags in the code "just in case" after 100% rollout
# 18 months later: 40 flags, most stale. nobody knows which are safe to remove.
# - dead 'else' branches nobody tests
# - "why is this code unreachable?" investigations
# - an incident: someone toggled 'legacy-pricing' (stale, should've been deleted)
//   thinking it was a different flag. prices broke for an hour.`,
        right: `# a release flag is TEMPORARY. the day you create it:
#   - open a REMOVAL ticket, linked to the flag
#   - after 100% + a soak period: remove the flag check AND the old code path,
//      close the ticket
#   - audit the flag inventory quarterly; anything > 60 days old gets challenged
# long-lived flags (ops kill-switches, entitlements) are a DIFFERENT category —
# those stay, and are documented as permanent.`,
        why: 'A release toggle exists to carry a feature from merged-but-hidden to fully-live, and once the feature is at full rollout and has proven stable, the toggle has done its job and both it and the now-unused old code path are pure liability. Left in place, they are dead code that no test meaningfully exercises, they prompt recurring confusion when someone finds an apparently unreachable branch, and they are a hazard during incidents because a stale flag with a plausible name can be toggled by mistake, activating long-abandoned behaviour. The accumulation is gradual and each individual flag seems too minor to prioritise removing, so a codebase ends up with dozens of them and no clear record of which are safe to touch. The discipline that prevents this is to treat every release toggle as temporary from creation: a removal task is filed at the same time the flag is added, and after the rollout completes and soaks, the flag check and the obsolete code path are deleted together. Flags in the other categories — operational kill switches, plan entitlements — are not release toggles, are expected to be permanent, and should be documented as such so they are not swept up in the same cleanup.',
        whyHi: 'Ek release toggle ek feature ko merged-but-hidden se fully-live tak le jaane ke liye exist karता hai, aur ek baar feature full rollout par hai aur stable prove ho chuka hai, toggle ne apna kaam kar diya hai aur ye aur ab-unused purana code path pure liability hain. Jagah par chhoड़े, wo dead code hain jise koi test meaningfully exercise nahi karता, wo recurring confusion prompt karते hain, aur wo incidents ke dauran ek hazard hain kyunki ek plausible naam wala ek stale flag galti se toggle ho sakта hai. Jo discipline ise prevent karती hai wo har release toggle ko creation se temporary treat karना hai: ek removal task file kiya jाता hai jab flag add hoता hai, aur rollout complete hone ke baad, flag check aur obsolete code path saath delete hoते hain.',
      },
      {
        wrong: `# a "quick" schema change: ALTER TABLE ... RENAME during a rolling deploy
ALTER TABLE orders RENAME COLUMN total TO total_cents;
# rolling deploy in progress: pods on the OLD version still do
#   SELECT total FROM orders   -> ERROR: column "total" does not exist
# half your fleet is throwing 500s until the deploy finishes. and a rollback
# now breaks the NEW pods the same way. you're trapped mid-deploy.`,
        right: `# expand / contract — every step backward-compatible:
#  1. EXPAND:   ADD COLUMN total_cents; backfill from total. (old code unaffected)
#  2. MIGRATE:  deploy code that WRITES total AND total_cents, READS total_cents.
#  3. CONTRACT: deploy code that only uses total_cents. THEN: DROP COLUMN total.
# a rollback during any single deploy lands on a version that still works with
# the schema as it currently is.`,
        why: 'During a rolling deploy the previous version and the new version of the application run at the same time against one database, so any schema the database presents must be understood by both. A rename presents a schema that only one of the two versions was written for: the instances still on the old version query a column name that no longer exists and fail, and this continues for the whole duration of the deploy. Worse, rolling back does not recover, because the old version now conflicts with the renamed schema exactly as much as before, so the deploy is stuck in a state where neither direction is safe. The expand and contract approach avoids ever presenting a schema that a running version cannot handle: the new column is added without removing the old, then the application moves to writing both and reading the new, then to using only the new, and only after that is the old column removed. At every individual deploy, the version being rolled back to is compatible with the schema as it exists at that moment, so there is always a safe direction.',
        whyHi: 'Ek rolling deploy ke dauran application ka previous version aur new version ek saath ek database ke against chalते hain, to database jo bhi schema present karता hai wo dono dwara samajhा jaana chahiye. Ek rename ek schema present karता hai jiske liye do versions mein se sirf ek likhा gaya tha: jo instances abhi bhi old version par hain ek column name query karते hain jo ab exist nahi karता aur fail hoते hain, aur ye poore deploy ke duration ke liye continue hoता hai. Aur bura, rollback recover nahi karता, kyunki old version ab renamed schema ke saath exactly utna hi conflict karता hai. Expand aur contract approach kabhi ek aisा schema present karने se bachता hai jise ek running version handle nahi kar sakта.',
      },
    ],

    realWorld: [
      {
        en: '**A checkout rewrite shipped to 100% over 9 days at 1→5→25→60→100%**, caught a 4% cart-abandon regression at 5%, fixed it, resumed — all without a deploy after day 0. A big-bang release would have hit every user with the regression at once.',
        hi: '**Ek checkout rewrite 9 dinों mein 100% par shipped 1→5→25→60→100% par**, 5% par ek 4% cart-abandon regression catch kiya, fix kiya, resume kiya — sab day 0 ke baad ek deploy ke bina.',
      },
      {
        en: '**A stale `use-legacy-tax-calc` flag toggled by mistake during an unrelated incident** — it had been at 100%-new for a year but never removed. Prices were wrong for 40 minutes. The team then bulk-removed 30+ stale flags and made removal tickets mandatory.',
        hi: '**Ek stale `use-legacy-tax-calc` flag ek unrelated incident ke dauran galti se toggled** — ye ek saal se 100%-new par tha par kabhi removed nahi hua.',
      },
      {
        en: '**A zero-downtime column split (`name` → `first_name`/`last_name`) done as expand/contract over 3 deploys across a week** — the naive `ALTER` had caused a 20-minute partial outage the previous quarter when old pods hit the renamed column.',
        hi: '**Ek zero-downtime column split expand/contract ke roop mein 3 deploys mein kiya** — naive `ALTER` ne pichle quarter ek 20-minute partial outage cause kiya tha.',
      },
    ],

    interviewQA: [
      {
        q: 'What does "decouple deploy from release" mean and why does it matter?',
        qHi: '"Deploy ko release se decouple karो" ka kya matlab hai aur ye kyun matter karता hai?',
        a: 'Deploying is the technical event of new code starting to run in production; releasing is the product event of a user being able to see or use a feature. Coupling them means a feature goes live the instant the code containing it is deployed, so every deployment carries product risk and product-level scrutiny. That pushes teams to batch deployments behind approvals, which makes each deployment large and multi-purpose, hard to reason about, and expensive to reverse, since rolling back one bad feature also rolls back everything bundled with it. It also makes gradual rollout and testing in production impossible, because deploying is all-or-nothing for the whole user base. Decoupling them, usually with feature flags, lets code deploy in a dormant state as a frequent, small, low-risk event, while a separate runtime control decides when and for whom the feature activates. That control can ramp the feature from internal users to a small percentage to everyone while metrics are watched, hold it at any level, and disable it in seconds if it misbehaves — without a rebuild, a redeploy, or a rollback, and without affecting anything else that has shipped. It also lets engineering finish and deploy work on its own schedule while the actual launch is timed to when support, docs, and marketing are ready.',
        aHi: 'Deploy karना naye code ke production mein chalना shuru karने ka technical event hai; release karना ek user ke ek feature ko dekh ya use kar sakने ka product event hai. Inhe couple karना matlab ek feature live ho jата hai jis instant code deploy hoता hai, to har deployment product risk carry karता hai. Ye teams ko deployments ko approvals ke peeche batch karने ke liye push karता hai, jo har deployment ko baड़ा aur multi-purpose banаता hai, reverse karना mehnga, kyunki ek bad feature rollback karna sab кुछ bhi rollback karता hai. Ye gradual rollout aur production mein testing bhi impossible banаता hai. Inhe decouple karना, usually feature flags ke saath, code ko ek dormant state mein deploy honे deता hai ek frequent, small, low-risk event ke roop mein, jabki ek separate runtime control decide karता hai kab aur kiske liye feature activate hoता hai. Wo control feature ko ramp kar sakта hai, kisi bhi level par hold kar sakta hai, aur seconds mein disable kar sakта hai.',
      },
      {
        q: 'How do you make a breaking database schema change with zero downtime?',
        qHi: 'Aap zero downtime ke saath ek breaking database schema change kaise karते ho?',
        a: 'You never make it as a single step, because during a zero-downtime deploy the old and new versions of the application run simultaneously against the same database, and a breaking change satisfies at most one of them. Instead you use the expand and contract pattern, also called parallel change, which decomposes the change into a sequence of steps each compatible with the version before it. Take a column rename. First, expand: add the new column alongside the old one, nullable so no existing row must be rewritten and no long lock is taken, and backfill the existing data into it gradually in the background. At this point the application still uses only the old column, so this deploy is safe and its rollback is just dropping the new column. Second, migrate: deploy application code that writes every change to both the old and the new column and reads from the new one; a rollback here still finds the old column being maintained. Third, contract: deploy application code that uses only the new column, confirm nothing references the old one, and only then drop the old column; a rollback here goes to a version that also used only the new column. Each deploy is independently safe to reverse because the previous application version is compatible with the schema as it stands at that moment. The same three-phase structure handles type changes, splitting or merging columns, and moving data between tables.',
        aHi: 'Aap ise kabhi ek single step ke roop mein nahi karते, kyunki ek zero-downtime deploy ke dauран application ke old aur new versions ek saath same database ke against chalते hain, aur ek breaking change unmें se at most ek ko satisfy karता hai. Iske bजaay aap expand aur contract pattern istemal karते ho, jo change ko steps ke ek sequence mein decompose karता hai jinmें se har ek pichle version ke compatible hai. Ek column rename lo. Pehle, expand: naya column purane ke saath add karो, nullable, aur existing data ise background mein backfill karो. Doosra, migrate: application code deploy karो jo har change ko dono columns mein write karता hai aur naye se read karता hai. Teesra, contract: application code deploy karो jo sirf naya column use karता hai, confirm karो kुछ purane ko reference nahi karता, aur sirf tab purana column drop karो. Har deploy independently reverse karना safe hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, define "deploy" and "release" precisely, and list four things you can do once they are decoupled with feature flags that you cannot do when they are coupled.',
        taskHi: 'Ek comment mein, "deploy" aur "release" precisely define karो.',
        hint: 'DEPLOY = new code is now running in production (technical event; should be frequent, small, dormant features, low-risk, reversible). RELEASE = a user can now see/use a feature (product decision about timing/audience/risk; controlled by a flag). Decoupled you can: (1) merge incomplete work to main daily behind an off flag → trunk-based works; (2) progressive rollout 1%→10%→50%→100% watching metrics, back out at any step; (3) turn a bad feature off in SECONDS with no rebuild/redeploy/rollback and no effect on other shipped changes; (4) test in production for internal users / one tenant only; (5) time the launch to when marketing/docs/support are ready, weeks after the deploy.',
        hintHi: 'DEPLOY = naya code ab production mein chal raha hai (technical; frequent, small, dormant, reversible). RELEASE = ek user ab ek feature dekh/use kar sakта hai (product decision; ek flag dwara controlled). Decoupled aap kar sakते ho: (1) incomplete work daily main mein merge; (2) progressive rollout metrics dekhते hue; (3) ek bad feature SECONDS mein off, koi rollback nahi; (4) production mein internal users ke liye test.',
      },
      {
        task: 'In a comment, name the four kinds of feature flag, their lifetimes, and why conflating a release toggle with a permanent one causes problems. Then give the rule for managing release toggles.',
        taskHi: 'Ek comment mein, chaar kinds of feature flag name karो, unki lifetimes.',
        hint: 'RELEASE toggle: hide/gradually roll out in-progress work; lifetime days–weeks, then DELETE the flag AND the old code path. OPS/KILL switch: disable an expensive/fragile subsystem under load; long-lived, permanent operational control. EXPERIMENT: assign A/B variants + measure; lasts the experiment, then delete. PERMISSION/ENTITLEMENT: gate by plan/tenant/role; permanent — it\'s product logic, not a toggle. Conflating: a release toggle left forever becomes dead code + an incident hazard (someone flips the stale one by mistake); building entitlements as a "temporary" toggle means they get cleaned up and break billing. Rule for release toggles: file a removal ticket the day you create the flag; after 100% + a soak, delete the check AND the old path; audit the flag inventory quarterly, challenge anything >60 days old.',
        hintHi: 'RELEASE toggle: in-progress work chhupाओ; lifetime days–weeks, phir flag AUR purana code path DELETE. OPS/KILL switch: ek expensive subsystem disable karो; long-lived. EXPERIMENT: A/B variants; experiment tak, phir delete. PERMISSION: plan/tenant/role se gate; permanent — product logic. Conflating: ek release toggle hamesha ke liye chhoड़ा dead code + incident hazard ban jата hai. Rule: flag create karने ke din ek removal ticket file karो; 100% + soak ke baad check AUR purana path delete karो; quarterly audit.',
      },
      {
        task: 'In a comment, walk through renaming `orders.total` to `orders.total_cents` with zero downtime using expand/contract. Give the exact 3 deploys and say why a plain `ALTER TABLE ... RENAME` breaks a rolling deploy.',
        taskHi: 'Ek comment mein, `orders.total` ko `orders.total_cents` mein zero downtime se rename karना walk through karो.',
        hint: 'Deploy 1 (EXPAND): `ALTER TABLE orders ADD COLUMN total_cents ...` (nullable, no default lock); backfill from `total` in batches. App code unchanged (still uses `total`). Rollback = drop the column. Deploy 2 (MIGRATE): app writes BOTH `total` and `total_cents`, reads `total_cents`. Rollback lands on a version that still uses `total`, which is still being written. Deploy 3 (CONTRACT): app uses only `total_cents`; confirm nothing references `total`; then `ALTER TABLE orders DROP COLUMN total`. Plain RENAME breaks a rolling deploy because old-version pods still running `SELECT total` hit "column does not exist" for the whole deploy window, AND a rollback breaks the new-version pods the same way — you\'re trapped mid-deploy with no safe direction.',
        hintHi: 'Deploy 1 (EXPAND): `ADD COLUMN total_cents` (nullable); `total` se backfill. App code unchanged. Deploy 2 (MIGRATE): app DONO write karता hai, `total_cents` read karता hai. Deploy 3 (CONTRACT): app sirf `total_cents`; confirm karो; phir `DROP COLUMN total`. Plain RENAME rolling deploy ko todता hai kyunki old-version pods abhi bhi `SELECT total` karते hain → "column does not exist" poore deploy window ke liye, AUR rollback new-version pods ko same tarah todता hai.',
      },
    ],

    keyTakeaways: [
      'DEPLOY (new code is RUNNING in production — a technical fact; should be frequent, small, boring, reversible) ≠ RELEASE (a user can SEE/USE a feature — a product decision about timing/audience/risk, controlled by a FLAG not a deploy). Coupling them makes every deploy carry product risk → deploys get batched behind approvals → each is large, risky, and hard to reverse (rolling back one bad feature reverts 29 good changes). Decoupling → deploy 20x/day freely, release when ready, to 1% first.',
      'A FEATURE FLAG is a runtime conditional whose value comes from targeting rules held OUTSIDE the deployed artifact (a flag service or watched config), evaluated PER REQUEST against: on/off, % rollout (deterministically bucketed by a stable key so users don\'t flip-flop), allow/deny lists, or attribute predicates (plan/region/tenant). Rule changes take effect in SECONDS with NO deploy. FOUR KINDS, distinguished by LIFETIME: RELEASE toggle (hide/roll out in-progress work; days–weeks then DELETE the flag AND old path), OPS/KILL switch (disable an expensive/fragile subsystem; long-lived), EXPERIMENT (A/B; lasts the experiment), PERMISSION/ENTITLEMENT (gate by plan/tenant/role; PERMANENT product logic).',
      'FLAGS BUY: merging incomplete work to main DAILY behind an off flag (this is what makes trunk-based practical); PROGRESSIVE DELIVERY (1%→10%→50%→100% watching error rate / latency / business metrics, back out at any step); INSTANT OFF for a bad feature in SECONDS — no rebuild, no redeploy, no rollback, nothing else disturbed; testing in production safely (internal users / one tenant); decoupling "engineering finished" from "marketing launched".',
      'FLAGS ARE DEBT: each flag = a fork in the code = ~2x the paths (combinatorial with several); STALE release toggles rot into dead code + incident hazards (someone flips the wrong stale flag) → file a REMOVAL TICKET the day you create it, delete the check AND old path after 100%+soak, audit quarterly; the flag system is INFRA you must run (SDK, per-request eval, caching, a defined safe default — usually "off"/old behaviour — when the flag service is unreachable). MERGING INCOMPLETE WORK, three techniques: FEATURE FLAG (wrap the new path, default off); BRANCH BY ABSTRACTION (introduce an interface → move callers to it → build the new impl behind it → switch → delete old; every step a small shippable change on main, no long branch); DARK LAUNCH / SHADOW (run the new path on real traffic but DISCARD its output, compare to the old path + measure load, then cut over).',
      'SCHEMA CHANGES use EXPAND / CONTRACT (parallel change) — never a breaking change in one step, because during a rolling deploy BOTH app versions run against one DB and a rollback must stay safe: (1) EXPAND — add the new column (nullable/no lock), backfill in batches, app unchanged; (2) MIGRATE — deploy code that WRITES BOTH old+new, READS new; (3) CONTRACT — deploy code using only new, confirm nothing references old, THEN drop old. Each deploy is backward-compatible with the version before it, so a rollback at any stage lands on a working system. A plain `ALTER TABLE ... RENAME` breaks whichever app version it wasn\'t deployed with — and traps you mid-deploy with no safe direction.',
    ],
    keyTakeawaysHi: [
      'DEPLOY (naya code production mein CHAL RAHA hai — technical; frequent, small, boring, reversible) ≠ RELEASE (ek user ek feature DEKH/USE kar sakта hai — ek product decision, ek FLAG dwara controlled). Inhe couple karना har deploy ko product risk carry karवाता hai → deploys batch ho jाते hain → har ek baड़ा, risky, reverse karना mushkil. Decouple → din mein 20x deploy, ready hone par release, pehle 1% ko.',
      'Ek FEATURE FLAG ek runtime conditional hai jiska value targeting rules se aata hai jo deployed artifact ke BAHAR rakhी hain, PER REQUEST evaluated: on/off, % rollout (ek stable key se deterministically bucketed), allow/deny lists, attribute predicates. Rule changes SECONDS mein effect lete hain, KOI deploy nahi. CHAAR KINDS, LIFETIME se: RELEASE toggle (days–weeks phir DELETE), OPS/KILL switch (long-lived), EXPERIMENT (experiment tak), PERMISSION (PERMANENT product logic).',
      'FLAGS DETE HAIN: incomplete work DAILY main mein merge karना off flag ke peeche (trunk-based practical); PROGRESSIVE DELIVERY (1%→10%→50%→100% metrics dekhते hue); ek bad feature ke liye INSTANT OFF SECONDS mein — koi rebuild/redeploy/rollback nahi; production mein safely test karना; "engineering finished" ko "marketing launched" se decouple karना.',
      'FLAGS DEBT HAIN: har flag = code mein ek fork = ~2x paths; STALE release toggles dead code + incident hazards ban jाते hain → flag create karने ke din ek REMOVAL TICKET file karो, 100%+soak ke baad check AUR purana path delete karो, quarterly audit; flag system INFRA hai (SDK, per-request eval, caching, ek safe default jab flag service unreachable). INCOMPLETE WORK MERGE KARNA: FEATURE FLAG; BRANCH BY ABSTRACTION (interface introduce karो → callers move karो → naya impl peeche build karो → switch → purana delete); DARK LAUNCH / SHADOW (naye path ko real traffic par chalाओ par output DISCARD karो, compare karो, phir cut over).',
      'SCHEMA CHANGES EXPAND / CONTRACT istemal karते hain — kabhi ek step mein breaking change nahi, kyunki ek rolling deploy ke dauran DONO app versions ek DB ke against chalते hain: (1) EXPAND — naya column add karो (nullable), batches mein backfill, app unchanged; (2) MIGRATE — code deploy karो jo DONO write karता hai, new READ karता hai; (3) CONTRACT — code deploy karो jo sirf new use karता hai, confirm karो, PHIR old drop karो. Har deploy pichle version ke backward-compatible hai. Ek plain `ALTER TABLE ... RENAME` us app version ko todता hai jiske saath ye deploy nahi hua.',
    ],
  },
];
