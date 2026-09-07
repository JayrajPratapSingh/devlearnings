/**
 * DevOps Complete Course — Module 2: Linux & the Command Line for Operations, lessons 4-6.
 *
 * Lesson 4: Users, permissions & the filesystem — uid/gid, sudo, rwx and octal,
 *           setuid/setgid/sticky, umask, the FHS. Octal + umask math VERIFIED;
 *           chmod/chown/FHS behaviour is described (Linux-only semantics).
 * Lesson 5: Inspecting a running system — the "what's wrong" toolkit (top, free,
 *           df/du, ss, lsof, iostat, dmesg, journalctl). ILLUSTRATIVE output
 *           (Linux-only tools); df/du usage is real.
 * Lesson 6: Writing safe shell scripts — set -euo pipefail, quoting, traps,
 *           mktemp, arg parsing, idempotency, the rm -rf guard. VERIFIED bash.
 *
 * Examples whose `code` starts with "# VERIFY" run against a real bash
 * (scratchpad/verify-bash.mjs). The rest show realistic Linux output.
 */

import type { CourseLesson } from './course-js-module1';

export const DEVOPS_MODULE_2_PART2: CourseLesson[] = [
  {
    slug: 'ops-users-permissions-and-the-filesystem',
    title: 'Users, Permissions & the Filesystem',
    titleHi: 'Users, Permissions Aur Filesystem',
    description: 'Every file has an owner, a group, and nine permission bits (read/write/execute for user/group/other), read as three octal digits. Processes run as a user and can only do what that user is allowed. sudo grants specific elevated commands. The filesystem hierarchy puts each kind of file in a predictable place.',
    descriptionHi: 'Har file ka ek owner, ek group, aur nau permission bits hote hain (user/group/other ke liye read/write/execute), teen octal digits ke roop mein read. Processes ek user ke roop mein run karते hain aur sirf wo kar sakते hain jo us user ko allowed hai. sudo specific elevated commands grant karता hai. Filesystem hierarchy har kism ki file ko ek predictable jagah par rakhता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**An office building where every room has a nameplate (owner), a department label (group), and a small sign listing who can do what: the person named, anyone in that department, everyone else — and for each, whether they can read the files, change them, or "run" the room (enter it, for a directory).** Your keycard (your user identity) opens exactly the rooms the signs permit and no others. `sudo` is a supervisor who, for one specific request that you are on the approved list for, walks you into a restricted room, watches you do the one thing, and logs it. And the building has a fixed floor plan — HR is always on 3, records in the basement, supplies in the same closet on every floor — so anyone who knows the plan can find anything without asking.',
      hi: '**Ek office building jahaan har room ka ek nameplate (owner), ek department label (group), aur ek chhoटा sign hai jo list karता hai kaun kya kar sakta hai: named person, us department mein koi bhi, baaki sab — aur har ek ke liye, kya wo files read kar sakते hain, unhe change kar sakते hain, ya room "run" kar sakते hain.** Aapका keycard (aapki user identity) theek wo rooms kholता hai jo signs permit karте hain. `sudo` ek supervisor hai jo, ek specific request ke liye jiske liye aap approved list par ho, aapko ek restricted room mein le jата hai, aapko ek cheez karте dekhता hai, aur ise log karta hai. Aur building ka ek fixed floor plan hai.',
    },

    simple: `**IDENTITY: every process runs as a USER (uid) and one or more GROUPS (gid).**
\`\`\`
whoami / id       | who am I, what groups am I in
/etc/passwd       | one line per user: name:x:uid:gid:comment:home:shell
/etc/group        | one line per group: name:x:gid:members
root = uid 0      | can do anything. everyone else is constrained by permissions.
\`\`\`

**PERMISSIONS: 9 bits, shown as \`rwxrwxrwx\` = 3 groups (User, Group, Other), read as OCTAL:**
\`\`\`
r = 4   w = 2   x = 1            (add them per group)
rwx r-x r-x  =  7 5 5  =  755    typical for an executable / a directory
rw- r-- r--  =  6 4 4  =  644    typical for a regular file
rw- r----- -  =  6 4 0  =  640    file the owner + group read, others nothing
\`\`\`
For a FILE: x = "can execute". For a DIRECTORY: x = "can enter / traverse it";
r = "can list its names"; w = "can create/delete entries in it".

**CHANGING them:**
\`\`\`
chmod 640 file            chmod u+x,g-w,o-rwx file       chmod -R 755 dir/
chown alice file          chown alice:devs file          chown -R app:app /opt/app
\`\`\`

**SPECIAL BITS (a 4th leading octal digit):**
\`\`\`
setuid (4)  on an executable | it runs as the FILE's owner, not the caller (e.g. /usr/bin/passwd runs as root)
setgid (2)  on a directory   | new files inside inherit the dir's GROUP (shared project dirs)
sticky (1)  on a directory   | only the file's owner can delete it (that's why /tmp is 1777)
\`\`\`

**umask = the bits to REMOVE from the default of new files. \`umask 022\` -> files 644, dirs 755.**

**sudo: run ONE command as another user (usually root), if /etc/sudoers permits YOU.**
\`\`\`
sudo systemctl restart nginx        sudo -u postgres psql
sudoers can scope it: "deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp"
every sudo is logged (who, when, what command). Prefer narrow rules over blanket 'ALL'.
\`\`\`

**THE FILESYSTEM HIERARCHY (FHS) — where things live:**
\`\`\`
/etc        config files            /var/log     logs
/var/lib    app state / data        /var/tmp     temp that survives reboot
/tmp        temp, cleared on reboot  /opt         self-contained third-party apps
/usr/bin    system binaries         /usr/local   locally-installed stuff
/home       user home dirs          /proc /sys   kernel-exposed virtual filesystems (not real files)
/run        runtime data (pids, sockets), tmpfs, cleared on reboot
\`\`\``,

    simpleHi: `**IDENTITY: har process ek USER (uid) aur ek ya zyada GROUPS (gid) ke roop mein run karता hai.**
\`\`\`
whoami / id       | main kaun hoon, kaunse groups mein
/etc/passwd       | prati user ek line: name:x:uid:gid:comment:home:shell
root = uid 0      | kुछ bhi kar sakta hai.
\`\`\`

**PERMISSIONS: 9 bits, \`rwxrwxrwx\` = 3 groups (User, Group, Other), OCTAL ke roop mein:**
\`\`\`
r = 4   w = 2   x = 1
rwx r-x r-x  =  7 5 5  =  755    ek executable / directory ke liye typical
rw- r-- r--  =  6 4 4  =  644    ek regular file ke liye typical
\`\`\`
Ek FILE ke liye: x = "execute kar sakta hai". Ek DIRECTORY ke liye: x = "enter / traverse";
r = "iske names list kar sakta hai"; w = "ismें entries create/delete kar sakta hai".

**CHANGING:** \`chmod 640 file\` ; \`chown alice:devs file\` ; \`chown -R app:app /opt/app\`

**SPECIAL BITS (ek 4th leading octal digit):**
\`\`\`
setuid (4)  ek executable par | ye FILE ke owner ke roop mein run karता hai (e.g. /usr/bin/passwd root ke roop mein)
setgid (2)  ek directory par  | andar naye files dir ka GROUP inherit karते hain
sticky (1)  ek directory par  | sirf file ka owner ise delete kar sakta hai (isliye /tmp 1777 hai)
\`\`\`

**umask = naye files ke default se REMOVE karने ke bits. \`umask 022\` -> files 644, dirs 755.**

**sudo: EK command ko doosre user ke roop mein run karो, agar /etc/sudoers aapko permit karता hai.**
\`\`\`
sudo systemctl restart nginx        sudo -u postgres psql
sudoers ise scope kar sakта: "deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp"
\`\`\`

**FHS — cheezen kahaan rehти hain:**
\`\`\`
/etc config    /var/log logs    /var/lib app data    /tmp temp (reboot par cleared)
/opt self-contained apps    /usr/bin system binaries    /home user homes
/proc /sys kernel virtual filesystems    /run runtime data (pids, sockets)
\`\`\``,

    content: `## Identity: users and groups

Every process on a Linux system runs as a specific **user** (identified by a numeric **uid**) and belongs to one primary **group** and possibly several supplementary groups (numeric **gids**). What a process is allowed to do is decided entirely by that identity against the permissions of the files and resources it touches.

- \`id\` shows your uid, primary gid, and all groups. \`whoami\` is just the username.
- \`/etc/passwd\` has one line per user: \`username:x:uid:gid:comment:home_dir:login_shell\` (the \`x\` is a placeholder — the password hash lives in \`/etc/shadow\`, readable only by root).
- \`/etc/group\` has one line per group: \`groupname:x:gid:comma,separated,members\`.
- **\`root\` is uid 0** and bypasses permission checks entirely. Everything else is constrained. The security model is: run as little as possible as root, and give every service its own dedicated unprivileged user.

## Permissions: the nine bits

Every file and directory has an **owner**, a **group**, and **nine permission bits**, displayed by \`ls -l\` as \`rwxrwxrwx\`:

\`\`\`
-  rwx  r-x  r--
^   ^    ^    ^
|   |    |    +--  OTHER  (everyone else)
|   |    +-------  GROUP  (members of the file's group)
|   +------------  USER   (the file's owner)
+----------------  type   (- file, d dir, l symlink, ...)
\`\`\`

Each triad is **read (r=4), write (w=2), execute (x=1)**, summed to one octal digit:

| Symbolic | Octal | Meaning |
|---|---|---|
| \`rwx\` | 7 | read + write + execute |
| \`rw-\` | 6 | read + write |
| \`r-x\` | 5 | read + execute |
| \`r--\` | 4 | read only |
| \`---\` | 0 | nothing |

So \`rwxr-xr-x\` = **755**, \`rw-r--r--\` = **644**, \`rw-r-----\` = **640**.

**The meaning of the bits differs for files and directories:**

- **File:** \`r\` = read the contents, \`w\` = modify the contents, \`x\` = execute it as a program.
- **Directory:** \`r\` = list the names inside, \`w\` = create/rename/delete entries inside (you do **not** need write on a file to delete it — you need write on its *directory*), \`x\` = traverse into it / access files by name (without \`x\` you cannot \`cd\` in or open anything inside even if you know the name).

This is why a directory is typically \`755\` (everyone can enter and list) or \`750\` (only owner and group), and why removing \`x\` from a directory locks everyone out of everything below it.

## Changing ownership and permissions

- \`chmod 640 file\` — set the exact bits. \`chmod u+x file\` / \`chmod g-w,o-rwx file\` — add/remove specific bits symbolically. \`chmod -R 755 dir/\` — recurse (careful: this makes *files* executable too; prefer \`find dir -type d -exec chmod 755 {} + ; find dir -type f -exec chmod 644 {} +\`).
- \`chown alice file\` — change owner. \`chown alice:devs file\` — owner and group. \`chown :devs file\` — group only. \`chown -R app:app /opt/app\` — recurse. Only root can change a file's owner.

## The special bits — a fourth octal digit

Prepended to the three permission digits:

- **setuid (4)** — on an executable file, the program runs with the **file owner's** identity instead of the caller's. \`/usr/bin/passwd\` is setuid-root so an ordinary user can update their own entry in the root-owned \`/etc/shadow\`. Setuid binaries are a classic privilege-escalation target and should be rare and audited.
- **setgid (2)** — on an executable, run with the file's group. On a **directory**, new files created inside **inherit the directory's group** (and new subdirectories inherit setgid too) — the standard setup for a shared project directory so everyone's files stay group-accessible.
- **sticky bit (1)** — on a **directory**, a file inside can only be deleted or renamed by **its own owner** (or root), regardless of directory write permission. \`/tmp\` is mode \`1777\` — world-writable so anyone can create temp files, sticky so nobody can delete anyone else's.

\`chmod 2775 shared/\` sets setgid + \`rwxrwxr-x\`. \`ls -l\` shows special bits as \`s\` / \`t\` in the execute positions.

## umask: the default-permission mask

When a process creates a file, it requests a mode (typically \`666\` for files, \`777\` for directories — the maximum), and the kernel then **subtracts the umask**. The umask is the set of bits to *withhold*:

- \`umask 022\` → files get \`666 & ~022\` = **644**, directories get \`777 & ~022\` = **755**. This is the common default: owner writes, everyone reads.
- \`umask 027\` → files **640**, directories **750**. Group reads, other gets nothing.
- \`umask 077\` → files **600**, directories **700**. Private to the owner. Use this when generating secrets.

A service that writes sensitive files should set a strict umask (or systemd's \`UMask=\` directive) so it does not accidentally create world-readable data.

## The Filesystem Hierarchy Standard

Linux distributions agree (mostly) on where each kind of file lives, which is what lets scripts and admins work across systems:

| Path | Holds |
|---|---|
| \`/etc\` | System and service **configuration** (text files). Back this up. |
| \`/var/log\` | **Log files** (for services not using the journal). |
| \`/var/lib\` | **Application state and data** managed by services (databases, package DBs). |
| \`/var/tmp\` | Temporary files that **survive a reboot**. |
| \`/tmp\` | Temporary files, often \`tmpfs\` (RAM), **cleared on reboot**. |
| \`/run\` | Runtime data — PID files, sockets. \`tmpfs\`, cleared on reboot. |
| \`/opt\` | **Self-contained third-party applications** (\`/opt/vendor/...\`). |
| \`/usr/bin\`, \`/usr/sbin\` | Distribution-provided binaries. |
| \`/usr/local\` | Software **you** installed outside the package manager. |
| \`/home\` | User home directories. |
| \`/boot\` | Kernel and bootloader. |
| \`/proc\`, \`/sys\` | **Virtual** filesystems exposing kernel state — not files on disk. \`/proc/<pid>\`, \`/proc/meminfo\`, \`/sys/class/net/\`. |
| \`/dev\` | Device nodes. |

For ops: config in \`/etc\`, data in \`/var/lib\`, logs in the journal or \`/var/log\`, your app in \`/opt\` or a container, and never store anything you care about in \`/tmp\`.`,

    contentHi: `## Identity: users aur groups

Har process ek specific **user** (numeric **uid**) ke roop mein run karता hai aur ek primary **group** aur possibly several supplementary groups (**gids**) se belong karता hai. Ek process kya karने ki allowed hai wo poori tarah us identity dwara decide hoता hai.

- \`id\` aapका uid, primary gid, aur saare groups dikhता hai.
- \`/etc/passwd\`: \`username:x:uid:gid:comment:home_dir:login_shell\`.
- **\`root\` uid 0 hai** aur permission checks poori tarah bypass karता hai. Security model: root ke roop mein jitna kam possible run karो, aur har service ko iska apna dedicated unprivileged user do.

## Permissions: nau bits

Har file/directory ka ek **owner**, ek **group**, aur **nau permission bits** hote hain, \`ls -l\` dwara \`rwxrwxrwx\` ke roop mein: USER / GROUP / OTHER.

Har triad **read (r=4), write (w=2), execute (x=1)** hai, ek octal digit mein summed. \`rwxr-xr-x\` = **755**, \`rw-r--r--\` = **644**.

**Files aur directories ke liye bits ka matlab alag hai:**
- **File:** \`r\` = contents read, \`w\` = contents modify, \`x\` = program ke roop mein execute.
- **Directory:** \`r\` = andar names list, \`w\` = andar entries create/delete (ek file delete karने ke liye aapko iske *directory* par write chahiye), \`x\` = ismें traverse.

## Ownership aur permissions badalna

- \`chmod 640 file\` ; \`chmod u+x file\` ; \`chmod -R 755 dir/\`.
- \`chown alice:devs file\` ; \`chown -R app:app /opt/app\`. Sirf root ek file ka owner badal sakta hai.

## Special bits — ek chौthा octal digit

- **setuid (4)** — ek executable par, program **file owner ki** identity ke saath run karता hai. \`/usr/bin/passwd\` setuid-root hai.
- **setgid (2)** — ek **directory** par, andar naye files **directory ka group inherit karते hain**.
- **sticky bit (1)** — ek **directory** par, andar ek file sirf **iske apne owner** dwara delete ki ja sakती hai. \`/tmp\` mode \`1777\` hai.

## umask

Jab ek process ek file banाता hai, ye ek mode request karता hai (typically files ke liye \`666\`), aur kernel phir **umask subtract karता hai**. \`umask 022\` → files **644**, directories **755**. \`umask 077\` → files **600** (secrets generate karते samay ye istemal karो).

## FHS

\`/etc\` config, \`/var/log\` logs, \`/var/lib\` app data, \`/tmp\` temp (reboot par cleared), \`/run\` runtime data, \`/opt\` third-party apps, \`/usr/bin\` binaries, \`/usr/local\` locally-installed, \`/proc\` \`/sys\` kernel virtual filesystems.`,

    examples: [
      {
        title: 'Reading and computing permission bits',
        titleHi: 'Permission bits read aur compute karna',
        code: `# VERIFY
for sym in rwxr-xr-x rw-r--r-- rw-r----- rwx------; do
  u=\${sym:0:3}; g=\${sym:3:3}; o=\${sym:6:3}
  val() { local t=0 c
          for c in \$(echo "\$1" | fold -w1); do
            case \$c in r) t=\$((t+4));; w) t=\$((t+2));; x) t=\$((t+1));; esac
          done; echo \$t; }
  printf '%s = %s%s%s\\n' "\$sym" "\$(val "\$u")" "\$(val "\$g")" "\$(val "\$o")"
done`,
        output: `rwxr-xr-x = 755
rw-r--r-- = 644
rw-r----- = 640
rwx------ = 700`,
        explain: 'The nine-character permission string is three groups of three: the owner\'s permissions, the group\'s, and everyone else\'s. Within each group, read contributes 4, write 2, and execute 1, and the three are added to a single octal digit, so a full `rwx` is 7, `rw-` is 6, `r-x` is 5, `r--` is 4, and `---` is 0. The example splits each symbolic string into its three triads and sums the letters in each to reproduce the octal form that `chmod` takes as an argument. Reading this fluently in both directions — seeing `rw-r--r--` and knowing it is 644, seeing `chmod 750` and knowing it grants the owner everything, the group read and traverse, and others nothing — is a basic operational skill, because permission problems are among the most common causes of a service failing to read its config or write its data.',
        explainHi: 'Nau-character permission string teen groups of three hai: owner ke permissions, group ke, aur baaki sabke. Har group ke andar, read 4 contribute karता hai, write 2, aur execute 1, aur teenों ek single octal digit mein add hoते hain, to ek full `rwx` 7 hai, `rw-` 6, `r-x` 5, `r--` 4, aur `---` 0. Example har symbolic string ko iske teen triads mein split karता hai aur har mein letters sum karता hai octal form reproduce karने ke liye jo `chmod` ek argument ke roop mein leता hai. Ise dono directions mein fluently read karना ek basic operational skill hai.',
      },
      {
        title: 'umask determines the permissions of files a process creates',
        titleHi: 'umask determine karta hai ek process jo files banata hai unke permissions',
        code: `# VERIFY
for u in 022 027 077; do
  printf 'umask %s  ->  new files %o, new dirs %o\\n' "$u" $(( 0666 & ~0$u )) $(( 0777 & ~0$u ))
done
echo "---"
echo "022 = the common default: owner writes, world reads (644 / 755)"
echo "027 = group-friendly, private from 'other'      (640 / 750)"
echo "077 = fully private to the owner                (600 / 700)  <- use for secrets"`,
        output: `umask 022  ->  new files 644, new dirs 755
umask 027  ->  new files 640, new dirs 750
umask 077  ->  new files 600, new dirs 700
---
022 = the common default: owner writes, world reads (644 / 755)
027 = group-friendly, private from 'other'      (640 / 750)
077 = fully private to the owner                (600 / 700)  <- use for secrets`,
        explain: 'When a program creates a file it asks the kernel for a mode, and by convention that request is 666 for a regular file and 777 for a directory — the maximum, minus the execute bit that regular files should not get by default. The kernel then removes any bits set in the process\'s umask before applying the mode. A umask of 022 has the write bits for group and other set, so those are cleared: files become 644 and directories 755, the familiar default where the owner can write and everyone can read. A umask of 027 additionally clears all of other\'s bits, giving 640 and 750. A umask of 077 clears every bit for group and other, so files are 600 and directories 700, readable and writable only by the owner. A service that writes credentials, tokens, or private keys should run with a 077 umask, or set systemd\'s UMask directive, so a slip in the code cannot leave a secret world-readable.',
        explainHi: 'Jab ek program ek file banаता hai ye kernel se ek mode maangता hai, aur convention se wo request ek regular file ke liye 666 hai aur ek directory ke liye 777. Kernel phir process ke umask mein set kiye gaye koi bhi bits remove karта hai mode apply karने se pehle. 022 ka ek umask group aur other ke liye write bits set rakhता hai, to wo cleared hote hain: files 644 ban jाते hain aur directories 755. 077 ka ek umask group aur other ke liye har bit clear karता hai, to files 600 hain aur directories 700. Ek service jo credentials likhती hai use ek 077 umask ke saath run karना chahiye.',
      },
      {
        title: 'Directory x vs r: why you can be locked out of files you own',
        titleHi: 'Directory x vs r: aap apni files se lock out kyun ho sakte ho',
        code: `# on a real Linux box:
$ mkdir -p project/secret && echo "data" > project/secret/file.txt
$ chmod 644 project/secret          # removed the x (traverse) bit from the dir
$ cat project/secret/file.txt
cat: project/secret/file.txt: Permission denied     # can't traverse into it
$ ls project/secret
file.txt                                             # r still lets you list names
$ ls -l project/secret
ls: cannot access 'project/secret/file.txt': Permission denied   # ...but not stat them

$ chmod 711 project/secret          # x back, but no r
$ cat project/secret/file.txt
data                                                 # traverse works if you know the name
$ ls project/secret
ls: cannot open directory 'project/secret': Permission denied     # r gone -> can't list`,
        output: `On a directory: r = list the entry names, x = traverse into it / access a known path, w = create/delete entries. They are independent - 644 on a dir lets you see the names but not open anything, 711 lets you open a known path but not list. A service that "can't read its files" often has a missing x somewhere up the directory path.`,
        explain: 'The read and execute bits on a directory control two separate capabilities that are easy to conflate. The read bit lets a process obtain the list of names contained in the directory — this is what `ls` needs. The execute bit, often called the traverse or search bit for directories, lets a process use the directory as a component of a path: to open `dir/file`, resolve `dir/subdir`, or `cd` into it, every directory along the path must grant execute to the accessing user. These are independent, so a directory with read but not execute lets you see that a file exists but not open it, and a directory with execute but not read lets you open a file whose name you already know but not discover what names are there. A very common operational failure is a service that cannot read its configuration or data not because the file\'s own permissions are wrong but because a directory somewhere above it in the path is missing the execute bit for the service\'s user, so the service cannot traverse down to the file at all.',
        explainHi: 'Ek directory par read aur execute bits do separate capabilities control karте hain jinhe conflate karna easy hai. Read bit ek process ko directory mein contained names ki list obtain karने deता hai — ye wo hai jo `ls` ko chahiye. Execute bit, aksar directories ke liye traverse ya search bit kaha jाता hai, ek process ko directory ko ek path ke component ke roop mein istemal karने deта hai. Ye independent hain, to read par execute nahi waali ek directory aapko dekhने deती hai ki ek file exist karती hai par ise open nahi. Ek bahut common operational failure ek service hai jo apni configuration read nahi kar sakти isliye nahi ki file ke apne permissions galat hain balki isliye ki path mein kahin ऊpar ek directory service ke user ke liye execute bit miss kar rahी hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# chmod -R 777 to "fix a permissions problem"
$ chmod -R 777 /var/www/app
# -> now every file is world-writable AND world-executable. any user or any
#    compromised process on the box can modify your app's code and config.
#    you didn't fix the permission problem, you removed permissions as a concept.`,
        right: `# find the actual denied access (usually a missing x on a dir, or wrong owner)
$ namei -l /var/www/app/config/settings.yml   # shows perms at every path component
$ sudo chown -R www-data:www-data /var/www/app
$ sudo find /var/www/app -type d -exec chmod 755 {} +   # dirs: traverse + list
$ sudo find /var/www/app -type f -exec chmod 644 {} +   # files: read; 755 only for real executables`,
        why: 'Setting a tree to mode 777 recursively makes every file readable, writable, and executable by every user and every process on the system, which removes the access control the permission system exists to provide rather than diagnosing why access was denied. Any local user, and any process running as any user including a compromised web request handler, can then overwrite the application\'s code, alter its configuration, or drop an executable into it. The permission problem it was meant to fix is almost always one of two things: the file or directory is owned by the wrong user, so the service running as its own account cannot access it, or a directory somewhere in the path lacks the execute bit for that account, so the service cannot traverse down to the file. The correct fix is to identify which of these it is — tools like `namei -l` show the ownership and mode of every component of a path — then set the ownership to the service\'s account and apply conventional modes: 755 on directories so they can be entered and listed, 644 on regular files, and the execute bit only on files that are actually programs.',
        whyHi: 'Ek tree ko recursively mode 777 set karना har file ko har user aur har process dwara readable, writable, aur executable banаता hai, jo wo access control remove karता hai jo permission system provide karने ke liye exist karता hai. Koi bhi local user, aur koi bhi process, phir application ka code overwrite kar sakta hai. Wo permission problem jise fix karना tha lagभag hamesha do cheezon mein se ek hai: file galat user dwara owned hai, ya path mein kahin ek directory execute bit miss kar rahی hai. Correct fix ye identify karना hai ki ye kaunसा hai, phir ownership service ke account par set karना aur conventional modes apply karना: directories par 755, regular files par 644.',
      },
      {
        wrong: `# a service that runs as root and writes user-uploaded files
[Service]
User=root
ExecStart=/opt/uploader/server
# uploads land in /var/lib/uploader/ owned by root, mode 644
# -> a path-traversal bug in the upload handler now writes files ANYWHERE as
//    root. and the service having root at all means any RCE is game over.`,
        right: `# dedicated unprivileged user, umask so nothing is world-readable, writable
# path scoped to exactly one directory:
[Service]
User=uploader
Group=uploader
UMask=0027
ExecStart=/opt/uploader/server
ReadWritePaths=/var/lib/uploader
ProtectSystem=strict
# now the worst a bug can do is corrupt /var/lib/uploader as the 'uploader' user.`,
        why: 'A service running as root has the authority to read, write, and execute anything on the system, so any flaw that lets an attacker influence what the service does — a path that is not properly sanitised, a deserialization bug, a command injection — is immediately a full compromise of the host, because the service can act anywhere with no restriction. Running the same service as a dedicated unprivileged user confines the damage: the account can only touch what it owns or has been granted, so a path-traversal bug can at most corrupt the service\'s own data directory, and a remote code execution yields a shell as an account with almost no privileges. Combining that with systemd\'s filesystem protections — making the rest of the filesystem read-only to the service and granting write access to exactly the one directory it needs — narrows the writable surface further, and a strict umask ensures the files it does create are not accidentally world-readable. The principle is that a service should run with the least authority that lets it do its job, so that the blast radius of any bug is bounded.',
        whyHi: 'Ek service jo root ke roop mein running hai ke paas system par kुछ bhi read, write, aur execute karने ka authority hai, to koi bhi flaw jo ek attacker ko influence karने deता hai ki service kya karता hai turant host ka ek full compromise hai. Usी service ko ek dedicated unprivileged user ke roop mein running karना damage confine karता hai: account sirf wo touch kar sakता hai jo ye own karता hai. Ise systemd ke filesystem protections ke saath combine karना writable surface further narrow karता hai, aur ek strict umask ensure karता hai ki jo files ye banाता hai wo accidentally world-readable nahi hain. Principle ye hai ki ek service least authority ke saath run karना chahiye.',
      },
      {
        wrong: `# a blanket sudoers rule for a deploy account
deploy ALL=(ALL) NOPASSWD: ALL
# -> the 'deploy' account (and anyone who gets its SSH key, and any process
//    running as it in CI) can run ANY command as root with no password.
//    it's effectively a second root account with a friendlier name.`,
        right: `# scope sudo to exactly the commands the deploy actually needs:
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp, \\
                            /usr/bin/systemctl reload nginx, \\
                            /opt/deploy/migrate.sh
# now a leaked deploy key can restart the app and run migrations - bad, but
# bounded - not "delete the disk". every use is still logged in the auth log.`,
        why: 'A sudoers entry that grants a user the ability to run any command as any target user without a password makes that account equivalent to root: whoever controls the account, whether a person, a leaked SSH key, or a CI job running under it, can do anything the superuser can. This defeats the purpose of having a separate account, which is to limit what that path of access can accomplish. sudo supports scoping the grant to a specific list of commands, optionally with fixed arguments, so a deployment account can be permitted to restart its own service, reload the web server, and run its migration script, and nothing else. A compromise of that account is then bounded to those operations rather than being total, which is a meaningful reduction even though those operations are themselves sensitive. Every sudo invocation is recorded with the user, the timestamp, and the exact command, so a scoped rule also produces a useful audit trail, whereas a blanket rule produces log lines that say only that the account ran something as root.',
        whyHi: 'Ek sudoers entry jo ek user ko bina password ke kisi bhi command ko kisi bhi target user ke roop mein run karने ki ability grant karती hai us account ko root ke barabar banаती hai: jo bhi account control karता hai kुछ bhi kar sakта hai jo superuser kar sakta hai. sudo grant ko commands ki ek specific list tak scope karना support karता hai, to ek deployment account ko apni service restart karने, web server reload karने, aur apni migration script run karने ki permission di ja sakती hai, aur kुछ nahi. Us account ka ek compromise phir un operations tak bounded hai. Har sudo invocation user, timestamp, aur exact command ke saath recorded hai.',
      },
    ],

    realWorld: [
      {
        en: '**A deploy that failed with "permission denied" on the config file that was mode 644 and owned correctly** — the real cause was `/opt/app/config` (the directory) being mode 700 owned by root, so the `app` user could not traverse in. `chmod 755` on the directory fixed it.',
        hi: '**Ek deploy jo config file par "permission denied" ke saath fail hua jo mode 644 tha** — real cause `/opt/app/config` directory ka mode 700 root dwara owned hona tha.',
      },
      {
        en: '**A shared analytics directory set to `2775` (setgid)** so every file dropped in by any team member stays group-readable by the whole analytics group, without anyone having to remember to `chgrp`.',
        hi: '**Ek shared analytics directory `2775` (setgid) par set** taaki har file group-readable rahे.',
      },
      {
        en: '**A secret-generation job that created `token.txt` world-readable** because the cron environment had `umask 022` — fixed by `umask 077` at the top of the script and a `chmod 600` assertion afterward.',
        hi: '**Ek secret-generation job jo `token.txt` world-readable banаता tha** — script ke top par `umask 077` se fix kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'How do permission bits work, and how do they differ between a file and a directory?',
        qHi: 'Permission bits kaise kaam karते hain, aur wo ek file aur ek directory ke beech kaise differ karते hain?',
        a: 'Every file and directory has an owner, a group, and nine permission bits arranged as three triads: the owner\'s permissions, the group\'s, and everyone else\'s. Within each triad there are three bits — read worth 4, write worth 2, execute worth 1 — summed to a single octal digit, so a mode like 644 means the owner can read and write, and the group and others can only read, while 755 means the owner has everything and group and others can read and execute. For a regular file the bits are straightforward: read means read the contents, write means modify them, execute means run it as a program. For a directory the meanings change. Read means you can obtain the list of entry names, which is what `ls` needs. Execute, called the traverse or search bit for directories, means you can use the directory as a path component: to open a file inside it or to cd into it, every directory along the path must grant you execute. Write on a directory means you can create, rename, and delete entries in it, which is why deleting a file requires write on the containing directory rather than on the file itself. Because read and execute on a directory are independent, a directory can be listable but not enterable, or enterable by known path but not listable, and a service that appears unable to read a correctly-permissioned file is very often blocked by a missing execute bit on a directory above it.',
        aHi: 'Har file aur directory ka ek owner, ek group, aur nau permission bits hote hain teen triads ke roop mein arranged: owner ke permissions, group ke, aur baaki sabke. Har triad mein teen bits hain — read 4, write 2, execute 1 — ek single octal digit mein summed, to 644 jaisा ek mode matlab owner read aur write kar sakта hai, aur group aur others sirf read. Ek regular file ke liye bits straightforward hain. Ek directory ke liye meanings change hote hain. Read matlab aap entry names ki list obtain kar sakते ho. Execute matlab aap directory ko ek path component ke roop mein istemal kar sakते ho. Write on a directory matlab aap ismें entries create/delete kar sakते ho.',
      },
      {
        q: 'What do setuid, setgid, and the sticky bit do?',
        qHi: 'setuid, setgid, aur sticky bit kya karते hain?',
        a: 'These are three additional permission bits, represented by a fourth octal digit prepended to the usual three. Setuid, value 4, applies to an executable file and causes the program to run with the identity of the file\'s owner rather than the user who launched it. The standard example is the password-changing utility, which is owned by root and setuid, so an ordinary user running it briefly gains the ability to update the root-owned password database for their own account only. Setuid binaries are a common privilege-escalation vector and should be minimal and audited. Setgid, value 2, on an executable runs it with the file\'s group; more importantly, on a directory it causes newly created files and subdirectories inside to inherit the directory\'s group rather than the creating user\'s primary group, which is the mechanism for a shared project directory where everything must stay accessible to one group. The sticky bit, value 1, on a directory restricts deletion and renaming of entries so that only the entry\'s own owner, or root, can remove it, regardless of who has write permission on the directory. This is why the world-writable temporary directory has mode 1777: anyone can create files there, but nobody can delete files that belong to someone else.',
        aHi: 'Ye teen additional permission bits hain, ek chौthा octal digit dwara represented jo usual teen ke aage prepended hai. Setuid, value 4, ek executable file par apply hoता hai aur program ko file ke owner ki identity ke saath run karवाता hai bजाy us user ke jisne ise launch kiya. Standard example password-changing utility hai. Setgid, value 2, ek directory par newly created files ko directory ka group inherit karवाता hai. Sticky bit, value 1, ek directory par entries ka deletion restrict karता hai taaki sirf entry ka apna owner ya root ise remove kar sakें. Isliye world-writable temporary directory ka mode 1777 hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, convert to octal and back: (a) `rwxr-x---`, (b) `640`, (c) `rw-rw-r--`, (d) `2750`. For (d) state what the leading 2 does and where.',
        taskHi: 'Ek comment mein, octal mein convert karो aur wapas: (a) `rwxr-x---`, (b) `640`, (c) `rw-rw-r--`, (d) `2750`.',
        hint: '(a) rwx=7, r-x=5, ---=0 → 750. (b) 6=rw-, 4=r--, 0=--- → rw-r-----. (c) rw-=6, rw-=6, r--=4 → 664. (d) 750 = rwxr-x--- plus a leading 2 = setgid; on a directory it makes new files/subdirs inside inherit the directory\'s group.',
        hintHi: '(a) 750. (b) rw-r-----. (c) 664. (d) 750 + leading 2 = setgid; ek directory par andar naye files/subdirs directory ka group inherit karते hain.',
      },
      {
        task: 'A service runs as user `app` and gets "Permission denied" opening `/srv/data/app/current/config.yml`, which is `-rw-r--r-- app app`. In a comment, explain the most likely cause and the command to diagnose it, then the fix.',
        taskHi: 'Ek service user `app` ke roop mein runs karता hai aur `/srv/data/app/current/config.yml` open karте hue "Permission denied" paता hai. Ek comment mein, most likely cause samjhाओ.',
        hint: 'The file itself is fine (app can read `-rw-r--r-- app app`). The block is almost certainly a directory in the path (`/srv`, `/srv/data`, `/srv/data/app`, or `.../current`) missing the execute/traverse bit for `app`. Diagnose: `namei -l /srv/data/app/current/config.yml` (shows mode + owner at every level). Fix: `chmod o+x` (or `g+x` + correct group) on whichever directory lacks it.',
        hintHi: 'File theek hai (app `-rw-r--r-- app app` read kar sakta hai). Block lagभag zaroor path mein ek directory hai jo `app` ke liye execute/traverse bit miss kar rahी hai. Diagnose: `namei -l /srv/data/app/current/config.yml`. Fix: jis directory par execute nahi hai uspar `chmod o+x`.',
      },
      {
        task: 'In a comment, write the umask a secret-generating script should set and why, then compute the resulting mode of a file and a directory it creates. Contrast with the default `umask 022`.',
        taskHi: 'Ek comment mein, ek secret-generating script jo umask set karна chahiye wo likho aur kyun.',
        hint: '`umask 077` — clears all bits for group and other. File: `666 & ~077` = 600 (owner rw, nobody else). Dir: `777 & ~077` = 700. With the default `umask 022` the secret file would be `644` — world-readable — so any local user or compromised process could read the token. Set `umask 077` at the top of the script (or `UMask=0077` in the systemd unit).',
        hintHi: '`umask 077` — group aur other ke saare bits clear karता hai. File: `666 & ~077` = 600. Dir: `777 & ~077` = 700. Default `umask 022` ke saath secret file `644` — world-readable — hoती.',
      },
    ],

    keyTakeaways: [
      'IDENTITY: every process runs as a USER (uid) + primary/supplementary GROUPS (gid); what it can do is decided by that identity vs file permissions. `id` / `whoami`, `/etc/passwd` (name:x:uid:gid:comment:home:shell), `/etc/group`. `root` = uid 0, bypasses all checks. Rule: run minimal as root; give every service its own dedicated unprivileged user.',
      'PERMISSIONS: 9 bits = 3 triads (USER / GROUP / OTHER); each = r(4) + w(2) + x(1) summed to one octal digit. `rwxr-xr-x` = 755, `rw-r--r--` = 644, `rw-r-----` = 640. FILE: r=read contents, w=modify, x=execute-as-program. DIRECTORY (different!): r=list names, w=create/delete entries (deleting a file needs write on its DIRECTORY, not the file), x=TRAVERSE into it / access known paths. r and x on a dir are INDEPENDENT — a service that "can\'t read its config" is very often missing an x on a directory ABOVE the file (`namei -l <path>` to diagnose).',
      '`chmod 640 file` / `chmod u+x,g-w,o-rwx file` / recurse with `find dir -type d -exec chmod 755 {} +` and `-type f ... 644` (NOT `chmod -R` which makes files executable). `chown app:app -R /opt/app` (only root changes owner). NEVER `chmod -R 777` "to fix permissions" — that deletes access control as a concept; find the real cause (wrong owner, or a missing dir-x).',
      'SPECIAL BITS (a 4th leading octal digit): SETUID (4) on an executable → runs as the FILE\'s owner not the caller (`/usr/bin/passwd` is setuid-root); a privilege-escalation vector, keep rare + audited. SETGID (2) on a DIRECTORY → new files inside inherit the dir\'s GROUP (shared project dirs, `chmod 2775`). STICKY (1) on a DIRECTORY → only a file\'s own owner can delete it (why `/tmp` is `1777`). UMASK = bits to WITHHOLD from the create-mode (666 files / 777 dirs): `umask 022` → 644/755 (default), `umask 077` → 600/700 (use for secrets — or systemd `UMask=0077`).',
      'sudo = run ONE command as another user (usually root) IF `/etc/sudoers` permits you; every use is logged (who/when/exact command). SCOPE it — `deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp` — never `ALL=(ALL) NOPASSWD: ALL` (that\'s a second root account). FHS — predictable locations: `/etc` config (back it up), `/var/lib` app state/data, `/var/log` logs, `/tmp` temp (RAM, cleared on reboot — store nothing you need), `/run` pids+sockets, `/opt` self-contained third-party apps, `/usr/bin` distro binaries, `/usr/local` your installs, `/proc` `/sys` kernel virtual filesystems.',
    ],
    keyTakeawaysHi: [
      'IDENTITY: har process ek USER (uid) + GROUPS (gid) ke roop mein run karता hai; ye kya kar sakta hai wo us identity vs file permissions dwara decide hoता hai. `id`/`whoami`, `/etc/passwd`, `/etc/group`. `root` = uid 0, saare checks bypass. Rule: root ke roop mein minimal run karो; har service ko iska apna unprivileged user do.',
      'PERMISSIONS: 9 bits = 3 triads (USER/GROUP/OTHER); har ek = r(4)+w(2)+x(1) ek octal digit mein summed. `rwxr-xr-x` = 755. FILE: r=contents read, w=modify, x=execute. DIRECTORY (alag!): r=names list, w=entries create/delete (ek file delete karने ke liye iske DIRECTORY par write chahiye), x=TRAVERSE. Ek dir par r aur x INDEPENDENT hain — "config read nahi kar sakта" aksar file ke UPAR ek directory par x miss hai (`namei -l <path>`).',
      '`chmod 640 file` / recurse with `find dir -type d -exec chmod 755 {} +` (NOT `chmod -R`). `chown app:app -R /opt/app` (sirf root owner badalta hai). KABHI `chmod -R 777` nahi — real cause dhoondो.',
      'SPECIAL BITS (4th leading octal digit): SETUID (4) ek executable par → FILE ke owner ke roop mein run (`/usr/bin/passwd`). SETGID (2) ek DIRECTORY par → andar naye files dir ka GROUP inherit karте hain. STICKY (1) ek DIRECTORY par → sirf file ka owner ise delete kar sakta hai (`/tmp` = `1777`). UMASK = create-mode se WITHHOLD karने ke bits: `umask 022` → 644/755, `umask 077` → 600/700 (secrets ke liye).',
      'sudo = EK command doosre user ke roop mein run karो AGAR `/etc/sudoers` permit karता hai; har use logged hai. SCOPE karो — `deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp` — kabhi `ALL=(ALL) NOPASSWD: ALL` nahi. FHS: `/etc` config, `/var/lib` app data, `/var/log` logs, `/tmp` temp (RAM), `/run` pids+sockets, `/opt` third-party apps, `/proc` `/sys` kernel virtual filesystems.',
    ],
  },

  {
    slug: 'ops-inspecting-a-running-system',
    title: 'Inspecting a Running System',
    titleHi: 'Ek Running System Inspect Karna',
    description: 'When a machine misbehaves, a small toolkit answers "what is wrong?" fast: load and CPU (top, uptime), memory (free), disk space and what fills it (df, du), open sockets and which process owns a port (ss), open files (lsof), I/O pressure (iostat), and kernel events (dmesg). Each points at a resource; the pattern tells you the cause.',
    descriptionHi: 'Jab ek machine misbehave karती hai, ek chhoटा toolkit "kya galat hai?" ka jawab jaldi deता hai: load aur CPU (top, uptime), memory (free), disk space aur ise kya bharता hai (df, du), open sockets aur kaunसा process ek port own karता hai (ss), open files (lsof), I/O pressure (iostat), aur kernel events (dmesg). Har ek ek resource par point karता hai; pattern aapको cause bताता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A car dashboard plus a few quick checks under the hood.** The dashboard gauges — engine load, temperature, fuel — tell you at a glance which system is stressed. If load is high you look at what is revving the engine (which processes). If the fuel gauge is near empty you find where it went (which directory is eating disk). If a warning light is on you read the diagnostic codes (kernel log). You do not rebuild the engine to find out it is low on oil; you have five instruments that each read one thing, and the combination of readings — high load *and* high I/O wait *and* one process at the top — points at the fault in seconds.',
      hi: '**Ek car dashboard plus hood ke neeche kुछ quick checks.** Dashboard gauges — engine load, temperature, fuel — ek glance mein bताते hain kaunसा system stressed hai. Agar load high hai aap dekhते ho kya engine rev kar raha hai (kaunसे processes). Agar fuel gauge near empty hai aap dhoondते ho ye kahaan gaya (kaunसी directory disk kha rahी hai). Agar ek warning light on hai aap diagnostic codes padhते ho (kernel log). Aap engine rebuild nahi karते ye pata lagाने ke liye ki ye oil par low hai; aapke paas paanch instruments hain jo har ek ek cheez read karта hai.',
    },

    simple: `**THE FIRST 60 SECONDS ON A SICK BOX — one command per resource:**
\`\`\`
uptime               | load average (1/5/15 min). rule of thumb: load > #cores = saturated.
top / htop           | live: %CPU, %MEM, per-process. press M (mem) or P (cpu) to sort.
free -h              | memory: used / free / available / swap. 'available' is the number that matters.
df -h                | disk SPACE per filesystem. 100% full breaks writes -> app crashes.
df -i                | disk INODES. can be 100% with space free (millions of tiny files).
du -sh * | sort -h   | what's using the space IN this directory.
ss -tlnp             | listening TCP sockets + the process (which pid owns :8080?).
ss -tanp             | all TCP sockets + state (lots of CLOSE-WAIT / TIME-WAIT = a clue).
lsof -p <pid>        | every file + socket that process has open.
lsof +D /var/log     | which processes hold files open under this dir (why won't the disk free?).
iostat -x 2          | per-disk utilisation + await (ms). %util near 100 = disk-bound.
vmstat 2             | system-wide: run queue (r), swap in/out (si/so), io wait (wa).
dmesg -T | tail      | kernel events: OOM-killer, disk errors, segfaults, network resets.
journalctl -p err -b | this boot's errors from every service.
\`\`\`

**READING THE PATTERN:**
\`\`\`
high load + one process 100% CPU              -> that process is the problem (profile it / kill it)
high load + low CPU + high 'wa' in vmstat     -> I/O bound: check iostat, is a disk saturated?
memory 'available' near 0 + swap in/out       -> memory pressure: find the hog (top -o %MEM)
dmesg shows "Out of memory: Killed process"   -> the OOM killer killed something. raise limits or fix the leak.
df 100% but du doesn't add up                 -> a deleted file still held open by a process (lsof | grep deleted)
port in use on startup                        -> ss -tlnp to find what's already on it
\`\`\`

**LOAD AVERAGE is runnable + uninterruptible (D-state) processes, not CPU %.** On a
4-core box, load 4.0 ~ fully busy; load 12.0 = 3x oversubscribed (or lots of I/O wait).`,

    simpleHi: `**EK SICK BOX PAR PEHLE 60 SECONDS — prati resource ek command:**
\`\`\`
uptime               | load average (1/5/15 min). rule: load > #cores = saturated.
top / htop           | live: %CPU, %MEM, per-process. M (mem) ya P (cpu) sort karो.
free -h              | memory: used / free / available / swap. 'available' matter karता hai.
df -h                | disk SPACE per filesystem. 100% full writes todता hai.
df -i                | disk INODES. space free ke saath 100% ho sakta hai.
du -sh * | sort -h   | is directory mein kya space istemal kar rahा hai.
ss -tlnp             | listening TCP sockets + process (:8080 kaunसा pid?).
lsof -p <pid>        | wo process jo har file + socket open rakhता hai.
iostat -x 2          | per-disk utilisation + await. %util ~100 = disk-bound.
vmstat 2             | run queue (r), swap in/out (si/so), io wait (wa).
dmesg -T | tail      | kernel events: OOM-killer, disk errors, segfaults.
journalctl -p err -b | is boot ke har service ke errors.
\`\`\`

**PATTERN READING:**
\`\`\`
high load + ek process 100% CPU            -> wo process problem hai
high load + low CPU + high 'wa'            -> I/O bound: iostat check karो
memory 'available' ~0 + swap in/out        -> memory pressure: hog dhoondो (top -o %MEM)
dmesg "Out of memory: Killed process"      -> OOM killer ne kुछ mara. limits raise karो / leak fix karो.
df 100% par du add nahi hota               -> ek deleted file ek process dwara open (lsof | grep deleted)
startup par port in use                    -> ss -tlnp
\`\`\`

**LOAD AVERAGE runnable + uninterruptible (D-state) processes hai, CPU % nahi.** Ek
4-core box par, load 4.0 ~ fully busy; load 12.0 = 3x oversubscribed.`,

    content: `## The mindset: one instrument per resource

A machine has a small number of finite resources — CPU, memory, disk space, disk I/O, network — and almost every "the box is sick" situation is one of them being exhausted. The diagnostic approach is not to guess but to **read each instrument in turn** and let the combination point at the cause. The instruments below are on essentially every Linux system; learn to read them and most incidents become a two-minute triage.

## CPU and load

- **\`uptime\`** (and the top line of \`top\`) shows the **load average** over 1, 5, and 15 minutes. Load is the number of processes that are either **running** or **waiting to run** or in **uninterruptible sleep** (usually blocked on disk I/O) — it is **not** a CPU percentage. As a rule of thumb, sustained load above the number of CPU cores means the machine is saturated; load well above that means work is queuing. Comparing the three numbers shows the trend: 1-minute much higher than 15-minute means a spike is developing.
- **\`top\`** / **\`htop\`** — a live, sorted process view. Key columns: **%CPU** (of one core; can exceed 100 on a multithreaded process), **RES** (resident memory — actual RAM used), **S** (state). Press \`P\` to sort by CPU, \`M\` by memory. The summary lines show CPU split into \`us\` (user), \`sy\` (system/kernel), \`wa\` (**I/O wait** — CPU idle because it is waiting for disk), \`st\` (stolen — a VM not getting the CPU it was scheduled).
- **\`mpstat -P ALL 2\`** — per-core breakdown, to see if load is on one core or spread.

**Interpretation:** high load with one process pinned at ~100% CPU means that process is the cause — profile it or, if it is runaway, kill it. High load with low overall CPU% but high \`wa\` means the machine is **I/O bound**, not CPU bound, and the CPU tools will not show the problem — move to the disk tools.

## Memory

- **\`free -h\`** — total, used, free, shared, buff/cache, and **available**. The number that matters is **available**: the amount of memory that can be given to a new process without swapping, which correctly accounts for reclaimable cache. "free" being low is normal and fine (Linux uses spare RAM for disk cache); **available** being low is the real signal.
- **\`swapon --show\`** and the swap line in \`free\` — if swap **used** is climbing and \`vmstat\`'s \`si\`/\`so\` (swap in/out) columns are non-zero, the machine is **actively swapping**, which is catastrophic for latency.
- **\`top\`** sorted by memory (\`M\`), or \`ps aux --sort=-rss | head\`, finds the process with the largest resident set.

**Interpretation:** available near zero plus active swapping means memory pressure. If \`dmesg\` then shows \`Out of memory: Killed process 1234 (name)\`, the kernel's **OOM killer** has terminated a process to reclaim memory — the fix is to lower memory limits, add RAM, or fix a leak in the killed process.

## Disk space and inodes

- **\`df -h\`** — used and available **space** per mounted filesystem, as a percentage. A filesystem at 100% causes every write to it to fail, which crashes applications, breaks logging, and can wedge the whole system if it is \`/\`.
- **\`df -i\`** — used and available **inodes**. A filesystem can be at 100% inodes with plenty of space free, if something created millions of tiny files (a common failure mode for a misconfigured cache or session store). \`df -h\` looks fine; writes still fail with "No space left on device".
- **\`du -sh * | sort -h\`** in a directory — the size of each entry, so you can walk down to what is using the space. \`du -xsh /*\` (the \`-x\` stays on one filesystem) is the usual starting point on a full root.
- **\`ncdu\`** — an interactive version of \`du\` for exploring a full disk fast.

**Interpretation:** \`df\` shows 100% but \`du\` of the whole filesystem does not add up to that — a process is still holding a **deleted file** open, so the space is not reclaimed until the process closes it or restarts. \`lsof +L1\` or \`lsof | grep deleted\` finds it; the classic case is a service writing to a log file that was \`rm\`'d by a rotation script that then did not signal the service to reopen.

## Network sockets

- **\`ss -tlnp\`** — **t**cp, **l**istening, **n**umeric, with the owning **p**rocess. This answers "what is listening on port 8080?" and, on startup failures, "what is already using the port I want?".
- **\`ss -tanp\`** — all TCP sockets with their state. A large number of \`CLOSE-WAIT\` means the local application is not closing sockets after the peer did (a bug); a large number of \`TIME-WAIT\` is normal for a busy client but can exhaust ephemeral ports at extreme rates.
- **\`ss -s\`** — a summary count by state.
- **\`ss -tanp state established '( dport = :443 )'\`** — filter to connections to a specific port.

(\`ss\` replaces the older \`netstat\`; the flags are similar.)

## Open files

- **\`lsof -p <pid>\`** — every file, socket, and pipe that process has open, with the file descriptor number. Useful for "why is this file locked", "what is this process actually connected to", and hitting the **file-descriptor limit** (\`ulimit -n\`; a server under load that suddenly errors with "too many open files" has exhausted its FD limit).
- **\`lsof +D /path\`** — every process with a file open under that directory (why a filesystem will not unmount, or why deleting files does not free space).
- **\`lsof -i :5432\`** — what has a connection to or from port 5432.

## Disk I/O

- **\`iostat -x 2\`** — per-device I/O stats every 2 seconds. Watch **\`%util\`** (near 100 = the device is at capacity) and **\`await\`** (average ms per I/O — rising means the disk is the bottleneck). **\`r/s\`** and **\`w/s\`** are IOPS.
- **\`iotop\`** — like \`top\` but for disk I/O per process (needs root).
- **\`vmstat 2\`** — system-wide: **\`r\`** (run-queue length — processes waiting for CPU), **\`b\`** (blocked on I/O), **\`si\`/\`so\`** (swap), **\`wa\`** (I/O wait %), **\`us\`/\`sy\`** (CPU).

## Kernel and service events

- **\`dmesg -T\`** (or \`journalctl -k\`) — the kernel ring buffer with human timestamps. This is where you find: **OOM killer** actions, **disk errors** (\`I/O error\`, \`SATA link\` messages — failing hardware), **segfaults**, **network** \`link is down\` / \`carrier lost\`, filesystem corruption warnings, and \`conntrack table full\` (dropped connections under load).
- **\`journalctl -p err -b\`** — every error-priority message from every service this boot, in one stream.
- **\`journalctl --since "-15min"\`** — everything from the last 15 minutes, when you know *roughly* when it started.

## Putting it together — a triage sequence

1. \`uptime\` — is load high? By how much relative to core count?
2. \`top\` — is one process eating CPU? Eating memory? What is the \`wa\` figure?
3. If \`wa\` is high → \`iostat -x 2\` → is a disk at 100% \`%util\`?
4. \`free -h\` — is \`available\` low? \`vmstat 2\` — is it swapping (\`si\`/\`so\`)?
5. \`df -h\` and \`df -i\` — is any filesystem full (space or inodes)?
6. \`dmesg -T | tail -50\` — did the kernel log an OOM kill, a disk error, a network flap?
7. \`journalctl -p err --since "-30min"\` — what did the services themselves report?

Most incidents are identified within these seven steps, and the specific instrument that lit up tells you which resource to fix.`,

    contentHi: `## Mindset: prati resource ek instrument

Ek machine ke paas finite resources ki ek chhoटी sankhya hai — CPU, memory, disk space, disk I/O, network — aur lagभag har "box sick hai" situation unmें se ek exhausted hone ki hai. Diagnostic approach guess karना nahi balki **har instrument ko baari-baari read karना** aur combination ko cause par point karने dena hai.

## CPU aur load

- **\`uptime\`** — **load average** 1, 5, aur 15 minutes over dikhता hai. Load un processes ki sankhya hai jo ya to **running** ya **waiting to run** ya **uninterruptible sleep** (usually disk I/O par blocked) hain — ye CPU percentage **nahi** hai. Rule: sustained load CPU cores ki sankhya se ऊpar = machine saturated.
- **\`top\`** / **\`htop\`** — live process view. **%CPU** (ek core ka), **RES** (actual RAM). \`P\` CPU se sort, \`M\` memory se. \`wa\` = **I/O wait**.

**Interpretation:** high load ek process ~100% CPU par pinned ke saath matlab wo process cause hai. High load low CPU% par par high \`wa\` matlab machine **I/O bound** hai.

## Memory

- **\`free -h\`** — jo number matter karता hai wo **available** hai: memory jo ek naye process ko di ja sakती hai bina swapping ke. "free" low hona normal hai (Linux spare RAM disk cache ke liye istemal karता hai).
- Agar swap **used** climb kar raha hai aur \`vmstat\` ke \`si\`/\`so\` non-zero hain, machine **actively swapping** kar rahी hai.

**Interpretation:** available ~zero plus active swapping = memory pressure. Agar \`dmesg\` phir \`Out of memory: Killed process\` dikhता hai, kernel ke **OOM killer** ne ek process terminate kiya.

## Disk space aur inodes

- **\`df -h\`** — prati filesystem **space**. 100% par har write fail hoती hai.
- **\`df -i\`** — **inodes**. Space free ke saath 100% ho sakta hai (millions of tiny files).
- **\`du -sh * | sort -h\`** — har entry ka size.

**Interpretation:** \`df\` 100% dikhता hai par \`du\` add nahi hota — ek process ek **deleted file** open rakhता hai (\`lsof | grep deleted\`).

## Network sockets

- **\`ss -tlnp\`** — **t**cp, **l**istening, **n**umeric, owning **p**rocess. ":8080 par kya listen kar raha hai?"
- **\`ss -tanp\`** — saare TCP sockets state ke saath. Bahut \`CLOSE-WAIT\` = local app sockets close nahi kar rahा.

## Open files

- **\`lsof -p <pid>\`** — wo process jo har file open rakhता hai. **file-descriptor limit** ("too many open files").
- **\`lsof +D /path\`** — us directory ke under ek file open rakhने wale processes.

## Disk I/O

- **\`iostat -x 2\`** — **\`%util\`** (~100 = capacity par), **\`await\`** (prati I/O ms).
- **\`vmstat 2\`** — **\`r\`** (run-queue), **\`b\`** (I/O par blocked), **\`wa\`** (I/O wait %).

## Kernel aur service events

- **\`dmesg -T\`** — kernel ring buffer: **OOM killer**, **disk errors**, **segfaults**, **network** link down.
- **\`journalctl -p err -b\`** — is boot ke har service ke errors.

## Triage sequence

1. \`uptime\` — load high? 2. \`top\` — ek process CPU/memory kha raha? \`wa\`? 3. \`wa\` high → \`iostat -x 2\`. 4. \`free -h\` — \`available\` low? swapping? 5. \`df -h\` aur \`df -i\` — koi filesystem full? 6. \`dmesg -T | tail\`. 7. \`journalctl -p err --since "-30min"\`.`,

    examples: [
      {
        title: 'A CPU-bound box: high load, one process at fault',
        titleHi: 'Ek CPU-bound box: high load, ek process at fault',
        code: `$ uptime
 14:30:12 up 42 days,  3:11,  2 users,  load average: 7.81, 6.20, 3.05
$ nproc
4
# load 7.81 on 4 cores -> ~2x oversubscribed, and the 1-min > 15-min = worsening.

$ top -b -n1 | head -12
top - 14:30:20 up 42 days,  3:11,  2 users,  load average: 7.90, 6.31, 3.12
Tasks: 210 total,   3 running, 207 sleeping
%Cpu(s): 96.8 us,  2.1 sy,  0.0 ni,  0.9 id,  0.0 wa,  0.0 hi,  0.2 si
MiB Mem :   7960.0 total,    412.0 free,   3120.0 used,   4428.0 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used
    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  30412 app       20   0 2140000 380000  12000 R 385.0   4.7  22:14.02 report-worker
   1180 postgres  20   0  620000 110000  90000 S   8.3   1.4   3:02.11 postgres
    980 root      20   0  120000  18000  14000 S   1.0   0.2   0:44.00 systemd-journal`,
        output: `load 7.81 on 4 cores is ~2x oversubscribed and rising (1-min > 15-min). Top shows %Cpu almost all 'us' (user), 'wa' (I/O wait) at 0, and one process - report-worker - at 385% CPU (using ~4 cores). This is CPU-bound on a single process: profile report-worker or, if it is a runaway, stop it. Memory and swap are fine; disk is not the issue.`,
        explain: 'The triage proceeds by elimination. Load of 7.81 against 4 cores is roughly double the machine\'s capacity, and the one-minute figure being higher than the fifteen-minute figure shows the situation is getting worse, not recovering. The top summary line then locates the resource: the CPU time is almost entirely in user space with essentially no I/O wait, which rules out a disk bottleneck, and the process list shows a single process consuming 385% CPU, meaning it is keeping nearly four cores fully busy on its own. Memory shows plenty available and no swap in use, so memory is not involved. The conclusion is specific and reached in under a minute: one process, report-worker, is CPU-bound and responsible for the load, and the next step is to understand why — attach a profiler, check whether it is stuck in a loop, look at what job it is processing — and decide whether to let it finish, throttle it, or kill it.',
        explainHi: 'Triage elimination se proceed karता hai. 4 cores ke against 7.81 ka load machine ki capacity ka roughly double hai, aur one-minute figure fifteen-minute se higher hona dikhता hai ki situation worse ho rahी hai. Top summary line phir resource locate karती hai: CPU time lagभag poori tarah user space mein hai essentially koi I/O wait ke saath, jo ek disk bottleneck rule out karता hai, aur process list ek single process ko 385% CPU consume karте dikhती hai. Memory plenty available dikhती hai. Conclusion specific hai: ek process, report-worker, CPU-bound hai aur load ke liye responsible hai.',
      },
      {
        title: 'Disk full but "du" doesn\'t add up — a deleted file held open',
        titleHi: 'Disk full par "du" add nahi hota — ek deleted file open held',
        code: `$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1    50G   50G  200M 100% /
# 100% full — writes are failing, the app is throwing errors.

$ sudo du -xsh /* 2>/dev/null | sort -h | tail -5
1.2G    /usr
1.8G    /home
2.1G    /var
# ...adds up to ~8G, not 50G. Where are the other 42G?

$ sudo lsof +L1 | head
COMMAND    PID USER   FD   TYPE DEVICE  SIZE/OFF NLINK  NODE NAME
app      30412 app     7w   REG  259,1  4.1e+10     0  1837 /var/log/app/app.log (deleted)
# a 41 GB log file that was 'rm'd (NLINK 0) but is still open by pid 30412.
# the space won't free until that fd is closed.

$ sudo kill -HUP 30412        # tell the app to reopen its log file
$ df -h /
Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1    50G  8.4G   42G  17% /`,
        output: `df reports 100% full but du of the whole tree only accounts for a fraction - the classic sign of a deleted-but-still-open file. lsof +L1 (files with link count < 1) reveals a 41 GB log that a rotation script rm'd without signalling the app to reopen it. Sending SIGHUP (or restarting the process) closes the old fd and the kernel reclaims the space.`,
        explain: 'When a file is deleted while a process still has it open, the directory entry is removed so the file no longer appears in any listing and `du`, which walks directory entries, does not count it, but the file\'s data remains on disk and continues to grow as long as the process keeps writing to the open descriptor. This produces the diagnostic signature of `df` reporting a filesystem as full while `du` of its entire contents accounts for far less. The tool that finds it is `lsof` filtered to files whose link count has dropped below one, which lists exactly the deleted-but-open files along with the process holding each one. The usual cause is a log rotation that removed or renamed a log file without notifying the service to close and reopen its handle, so the service keeps appending to a file that no longer has a name. The remedy is to make the service reopen the file, either by sending it the signal it uses for that purpose, conventionally SIGHUP, or by restarting it, after which the kernel frees the space. The permanent fix is to configure rotation to signal the service, which `logrotate` does through its `postrotate` directive.',
        explainHi: 'Jab ek file delete ki jाती hai jab ek process abhi bhi ise open rakhता hai, directory entry remove ho jाती hai to file kisi listing mein appear nahi hoती aur `du`, jo directory entries walk karता hai, ise count nahi karता, par file ka data disk par rehта hai aur grow karता rehта hai jab tak process open descriptor par likhता rehта hai. Ye `df` ke ek filesystem ko full report karने ka diagnostic signature produce karता hai jab `du` bahut kम account karता hai. Jo tool ise dhoondता hai wo `lsof` hai jise un files par filter kiya jाता hai jinke link count ek se neeche gir gaye hain. Usual cause ek log rotation hai jisne ek log file remove ki bina service ko notify kiye.',
      },
      {
        title: 'A port already in use on startup',
        titleHi: 'Startup par ek port already in use',
        code: `$ systemctl start checkout-api
$ journalctl -u checkout-api -n5 --no-pager
Jun 10 14:40:02 host server[51203]: Error: listen EADDRINUSE: address already in use :::8080
Jun 10 14:40:02 host systemd[1]: checkout-api.service: Main process exited, code=exited, status=1

$ sudo ss -tlnp 'sport = :8080'
State   Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
LISTEN  0       511     0.0.0.0:8080        0.0.0.0:*          users:(("server",pid=50880,fd=18))

$ ps -o pid,ppid,etime,cmd -p 50880
    PID    PPID     ELAPSED CMD
  50880       1    01:12:33 /opt/checkout/bin/server

# an OLD instance (pid 50880, running 1h12m, parented to systemd) never exited on
# the last restart — it ignored SIGTERM. systemd's restart limit gave up, but the
# stale process kept the port. kill it, then start clean.
$ sudo kill -TERM 50880 ; sleep 5 ; sudo kill -KILL 50880 2>/dev/null
$ systemctl start checkout-api        # now binds :8080 successfully`,
        output: `EADDRINUSE on startup means another process already holds the port. ss -tlnp filtered to the source port names the process and PID; ps shows it is a stale old instance of the same service (long uptime, re-parented to PID 1) that did not exit on the previous restart. The fix is to terminate the stale process - and the root cause is a missing SIGTERM handler (Lesson 2).`,
        explain: 'A bind failure with address-already-in-use means the operating system will not let the new process claim the port because another socket is already listening on it. The diagnostic is to ask which process owns that port, which `ss` answers when filtered to the port and asked to show the owning process; it returns the command name and PID. Inspecting that PID with `ps` shows its parent and how long it has been running, and here the picture is a previous instance of the same service that has been alive far longer than the current restart attempt and is parented directly to the init process, which is the signature of a process that outlived the shell or manager that started it. The chain of events is that the earlier restart sent this instance SIGTERM, the instance did not handle it and did not exit, systemd\'s restart limiter eventually stopped trying, and the stale process kept holding the port so every subsequent start fails immediately. The immediate fix is to terminate the stale instance, escalating to SIGKILL if it continues to ignore SIGTERM, and the real fix is to give the service a SIGTERM handler so it shuts down cleanly and releases its port.',
        explainHi: 'Ek bind failure address-already-in-use ke saath matlab operating system naye process ko port claim nahi karने degा kyunki ek doosरा socket already ispar listen kar raha hai. Diagnostic ye poochना hai ki us port ko kaunसा process own karता hai, jo `ss` answer karता hai jab port par filter kiya jाता hai. Us PID ko `ps` se inspect karना iska parent aur ye kitni der running hai dikhता hai, aur yahaan picture usी service ka ek previous instance hai jo current restart attempt se bahut lambा alive hai aur seedhе init process ko parented hai. Immediate fix stale instance ko terminate karना hai, aur real fix service ko ek SIGTERM handler dena hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# reading load average as a CPU percentage
# "load average is 3.5 — the CPU is at 350%?!"
# -> no. load is the number of processes running OR waiting to run OR blocked on
//    I/O. on an 8-core box, load 3.5 means the CPU is ~44% busy and there's
//    headroom. on a 2-core box the same 3.5 means it's oversubscribed.`,
        right: `# always read load RELATIVE to core count:
$ nproc                      # or: grep -c ^processor /proc/cpuinfo
8
$ uptime                     # load 3.5 on 8 cores -> comfortable
# and check WHY it's non-zero: high load + high I/O wait ('wa' in top/vmstat)
# means it's disk-bound, not CPU-bound — the CPU could be nearly idle.`,
        why: 'The load average is a count, not a ratio: it is the number of processes that are in a runnable state or blocked in uninterruptible sleep, averaged over an interval. It has no upper bound and no built-in relationship to the number of CPUs, so a raw load figure is meaningless without knowing the core count. On a machine with eight cores, a load of four means roughly half the CPU capacity is in use and there is substantial headroom; on a machine with two cores, the same load of four means work is queuing because there are twice as many runnable processes as cores to run them. Furthermore, because processes blocked on disk I/O count toward the load, a high load figure can coexist with a nearly idle CPU when the bottleneck is the disk rather than compute. The correct reading is always to divide the load by the core count for a rough utilisation sense, and to check the I/O wait percentage to see whether the load reflects CPU demand or I/O contention.',
        whyHi: 'Load average ek count hai, ek ratio nahi: ye un processes ki sankhya hai jo ek runnable state mein hain ya uninterruptible sleep mein blocked hain, ek interval over averaged. Iska koi upper bound nahi aur CPUs ki sankhya se koi built-in relationship nahi, to ek raw load figure core count jaane bina meaningless hai. Aath cores waali ek machine par, chaar ka ek load matlab roughly half CPU capacity in use hai; do cores waali ek machine par, wahi chaar ka load matlab work queue kar raha hai. Iske alावा, kyunki disk I/O par blocked processes load ki taraf count karते hain, ek high load figure ek nearly idle CPU ke saath coexist kar sakta hai.',
      },
      {
        wrong: `# panicking that "free" shows only 200 MB free
$ free -h
               total        used        free      shared  buff/cache   available
Mem:            15Gi        3Gi       200Mi        80Mi         12Gi        11Gi
# "we're almost out of memory!" -> no. 12 GB is disk CACHE, reclaimable instantly.
# the number that matters is 'available': 11 GB. plenty.`,
        right: `# read 'available', not 'free'. Linux deliberately uses spare RAM as disk cache
# and gives it back the instant a process needs it.
# real memory pressure looks like: 'available' near 0 AND swap 'used' climbing
# AND vmstat's si/so columns non-zero AND (often) dmesg OOM-killer messages.`,
        why: 'Linux treats memory that is not allocated to processes as an opportunity rather than waste: it fills it with a cache of recently-read file data and buffered writes, because RAM used for cache serves reads far faster than going to disk. This cache is fully reclaimable — the moment a process needs memory that the cache is holding, the kernel drops cache pages and hands the memory over, with no delay. The `free` column in the output therefore only counts memory that is neither in use nor in cache, and on a healthy system that has been running for a while it is naturally small, which is not a problem. The column that reflects the actual situation is `available`, which estimates how much memory a new allocation could obtain, counting the reclaimable cache. Genuine memory pressure is a different picture: available approaching zero, the swap in-use figure rising, the swap-in and swap-out counters in `vmstat` showing continuous activity, and the kernel log recording out-of-memory kills. Reacting to a low `free` figure alone leads to unnecessary alarm and sometimes to counterproductive changes like disabling caching.',
        whyHi: 'Linux us memory ko jo processes ko allocated nahi hai ek opportunity ke roop mein treat karता hai: ye ise recently-read file data ke ek cache se bharता hai, kyunki cache ke liye istemal ki gayी RAM reads ko disk par jane se kahin faster serve karती hai. Ye cache fully reclaimable hai — jis moment ek process memory chahता hai jo cache hold kar raha hai, kernel cache pages drop karता hai. `free` column isliye sirf wo memory count karता hai jo na in use hai na cache mein. Jo column actual situation reflect karता hai wo `available` hai. Genuine memory pressure ek alag picture hai: available zero ke paas, swap in-use rising, `vmstat` ke si/so continuous activity, aur kernel log OOM kills record karता.',
      },
      {
        wrong: `# "the disk isn't full, df shows 60%" — while writes fail with ENOSPC
$ df -h /data
Filesystem  Size  Used Avail Use% Mounted on
/dev/sdb1   500G  290G  210G  60% /data
$ touch /data/x
touch: cannot touch '/data/x': No space left on device
# confusing — 210 GB free but can't create a file.`,
        right: `# check INODES, not just space:
$ df -i /data
Filesystem     Inodes    IUsed IFree IUse% Mounted on
/dev/sdb1    32768000 32768000     0  100% /data
# 100% of inodes used. something created ~32 million tiny files (a runaway
# session cache / a fork bomb of temp files). find and clean them:
$ sudo find /data/sessions -type f -mtime +1 -delete
# then fix whatever is creating them.`,
        why: 'A filesystem tracks two independent resources: the data blocks that hold file contents, and the inodes that hold each file\'s metadata — its size, owner, permissions, and pointers to its blocks. The number of inodes is fixed when the filesystem is created, typically generous relative to the expected average file size. A workload that creates an enormous number of very small files — a session store writing one file per session and never cleaning up, a bug producing millions of tiny temp files — can exhaust the inode table while leaving most of the data blocks unused. `df -h` reports only block usage, so it shows plenty of free space, but every attempt to create a new file fails because there is no free inode to represent it, and the error is the same "no space left on device" that a full disk produces. The diagnosis is `df -i`, which reports inode usage, and the fix is to find and remove the excess files, then correct whatever is producing them, since the inode count cannot be increased without recreating the filesystem.',
        whyHi: 'Ek filesystem do independent resources track karता hai: data blocks jo file contents rakhते hain, aur inodes jo har file ka metadata rakhте hain. Inodes ki sankhya fix hoती hai jab filesystem create hoता hai. Ek workload jo bahut chhoती files ki ek enormous sankhya create karता hai inode table exhaust kar sakта hai jab zyaादातर data blocks unused chhoड़ता hai. `df -h` sirf block usage report karता hai, to ye plenty of free space dikhता hai, par ek naya file create karने ki har attempt fail hoती hai. Diagnosis `df -i` hai, aur fix excess files find aur remove karना hai.',
      },
    ],

    realWorld: [
      {
        en: '**A `describe the last 60 seconds` runbook pinned in the incident channel** — `uptime; top -bn1 | head -15; free -h; df -h; df -i; iostat -x 1 3; dmesg -T | tail -30; journalctl -p err --since -15min` — the on-call runs it first, pastes the output, and the resource that lit up is obvious.',
        hi: '**Ek `last 60 seconds describe karो` runbook incident channel mein pinned** — on-call ise pehle chalाता hai aur jo resource lit up hai obvious hai.',
      },
      {
        en: '**A disk-full page at 4am** — `df` said 100%, `du` said 12G on a 100G disk; `lsof | grep deleted` found a 78 GB file a botched logrotate had `rm`\'d; `systemctl restart` freed it and a `postrotate` hook stopped it recurring.',
        hi: '**4am par ek disk-full page** — `lsof | grep deleted` ne ek 78 GB file dhoondी jise ek botched logrotate ne `rm` kiya tha.',
      },
      {
        en: '**"The service is slow" turned out to be `iostat` showing `%util` at 99 on the data volume** — a nightly analytics job and the live database were sharing one disk; moving analytics to its own volume fixed the latency with no code change.',
        hi: '**"Service slow hai" `iostat` par `%util` 99 par nikла** — ek nightly analytics job aur live database ek disk share kar rahे thे.',
      },
    ],

    interviewQA: [
      {
        q: 'A production box is "slow". Walk me through your first two minutes of diagnosis.',
        qHi: 'Ek production box "slow" hai. Apne diagnosis ke pehle do minutes walk karो.',
        a: 'I start with load: `uptime` gives the one, five, and fifteen minute load averages, and `nproc` gives the core count, so I can see whether load is high relative to cores and whether the trend is worsening or recovering. Then `top` to see where the CPU is going: is one process pinned near a hundred percent per core, is memory used high, and critically what is the I/O wait percentage on the summary line. If CPU is nearly all user time with low I/O wait and one process dominates, it is CPU-bound on that process and I go investigate it. If load is high but overall CPU is low and I/O wait is high, it is disk-bound, so I run `iostat -x 2` and look for a device at close to a hundred percent utilisation with rising await. Next `free -h` to check the available memory figure, not the free figure, and `vmstat 2` to see if swap-in and swap-out are non-zero, which would mean active swapping and a latency catastrophe. Then `df -h` and `df -i` on the important filesystems, because a full disk or exhausted inodes make every write fail and produce symptoms that look like a slow application. Finally `dmesg -T | tail` for kernel-level events like an out-of-memory kill or disk errors, and `journalctl -p err --since -15min` for what the services themselves logged. Within these steps the resource that is exhausted is almost always identified, and the specific tool that showed it points at the fix.',
        aHi: 'Main load se shuru karता hoon: `uptime` one, five, aur fifteen minute load averages deта hai, aur `nproc` core count deта hai. Phir `top` ye dekhने ke liye ki CPU kahaan ja rahा hai: kya ek process ~100% per core par pinned hai, memory used high hai, aur critically I/O wait percentage kya hai. Agar CPU lagभag saara user time hai low I/O wait ke saath aur ek process dominate karता hai, ye CPU-bound hai. Agar load high hai par overall CPU low hai aur I/O wait high hai, ye disk-bound hai, to `iostat -x 2`. Phir `free -h` available figure check karने ke liye, aur `vmstat 2` swapping ke liye. Phir `df -h` aur `df -i`. Aakhir mein `dmesg -T | tail` aur `journalctl -p err --since -15min`.',
      },
      {
        q: 'df says a filesystem is 100% full but du of the whole tree accounts for far less. What is going on and how do you fix it?',
        qHi: 'df kehта hai ek filesystem 100% full hai par poore tree ka du bahut kम account karता hai. Kya ho raha hai?',
        a: 'This is the signature of a file that has been deleted while a process still holds it open. Deleting a file removes its directory entry, so it no longer appears in any listing and `du`, which sums the sizes of the entries it walks, does not include it. But the file\'s data blocks are not released until the last open file descriptor referring to it is closed, and if a process is still writing to that descriptor the file keeps growing, invisibly, consuming space that `df` correctly reports as used. The classic cause is a log rotation that removed or renamed a service\'s log file without signalling the service to close and reopen its handle, so the service continues appending to a file that has no name. To find it, `lsof +L1` lists open files whose link count is below one, which is exactly the deleted-but-open files, along with the owning process and the file size. To fix it immediately, make that process reopen the file, either by sending the signal it uses for log reopening, conventionally SIGHUP, or by restarting the process, after which the kernel frees the blocks. To prevent recurrence, configure the rotation tool to signal the service after rotating, which `logrotate` does with a `postrotate` script, or use a logging setup where rotation is handled without deleting an open file.',
        aHi: 'Ye ek file ka signature hai jise delete kiya gaya jab ek process abhi bhi ise open rakhता hai. Ek file delete karना iski directory entry remove karता hai, to ye kisi listing mein appear nahi hoती aur `du` ise include nahi karता. Par file ke data blocks release nahi hote jab tak last open file descriptor close nahi hota, aur agar ek process abhi bhi us descriptor par likh raha hai file grow karती rehती hai, invisibly. Classic cause ek log rotation hai. Ise dhoondने ke liye, `lsof +L1` un open files ko list karता hai jinke link count ek se neeche hain. Immediately fix karने ke liye, us process ko file reopen karवाओ (SIGHUP ya restart). Recurrence prevent karने ke liye, rotation tool ko service signal karने ke liye configure karो (`logrotate` `postrotate`).',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write the 7-step triage sequence for a "slow box" as a list of commands, and next to each say which resource it checks and what a "bad" reading looks like.',
        taskHi: 'Ek comment mein, ek "slow box" ke liye 7-step triage sequence commands ki ek list ke roop mein likho.',
        hint: '1) `uptime` + `nproc` — CPU/queue; bad = load ≫ cores, 1-min > 15-min. 2) `top` — CPU/mem/wait; bad = one proc ~100%/core, or high `wa`. 3) `iostat -x 2` — disk I/O; bad = `%util` ~100, `await` rising. 4) `free -h` + `vmstat 2` — memory; bad = `available` ~0, `si`/`so` non-zero. 5) `df -h` — disk space; bad = 100%. 6) `df -i` — inodes; bad = 100% (space may be free). 7) `dmesg -T | tail` + `journalctl -p err --since -15min` — kernel/service events; bad = OOM kill, disk error, service error burst.',
        hintHi: '1) `uptime`+`nproc` — CPU; bad = load ≫ cores. 2) `top` — CPU/mem/`wa`. 3) `iostat -x 2` — disk; bad = `%util` ~100. 4) `free -h`+`vmstat 2` — memory; bad = `available` ~0 + `si`/`so`. 5) `df -h` — space. 6) `df -i` — inodes. 7) `dmesg -T`+`journalctl -p err`.',
      },
      {
        task: 'A box has load average 14 on 4 cores, `top` shows 92% `wa` and no process above 15% CPU, `free` shows `available` at 9 GB. In a comment, state the diagnosis, the next command, and what you expect it to show.',
        taskHi: 'Ek box ka load average 14 hai 4 cores par, `top` 92% `wa` dikhता hai aur koi process 15% CPU se ऊpar nahi, `free` `available` 9 GB dikhता hai. Ek comment mein, diagnosis batao.',
        hint: 'Diagnosis: NOT CPU-bound (no process is busy) and NOT memory-bound (9 GB available, no swap). 92% I/O wait + high load = the machine is DISK-bound — processes are piling up in uninterruptible sleep waiting for I/O. Next: `iostat -x 2` — expect one device at `%util` near 100 with a high `await` (ms/op) and elevated `r/s` or `w/s`. Then find the process doing the I/O with `iotop` or `pidstat -d 2`.',
        hintHi: 'Diagnosis: CPU-bound NAHI, memory-bound NAHI. 92% I/O wait + high load = machine DISK-bound hai. Next: `iostat -x 2` — ek device `%util` ~100 par high `await` ke saath expect karो. Phir `iotop` se I/O karने wala process dhoondो.',
      },
      {
        task: 'In a comment, explain the difference between the `free` and `available` columns of `free -h`, and describe exactly what real memory pressure looks like across `free`, `vmstat`, and `dmesg`.',
        taskHi: 'Ek comment mein, `free -h` ke `free` aur `available` columns mein antar samjhाओ.',
        hint: '`free` = RAM that is neither used by processes nor holding cache — naturally small on a warm system, NOT a problem. `available` = an estimate of what a new allocation could get, counting reclaimable cache — this is the real signal. Real pressure: `available` near 0 AND swap `used` climbing in `free`; `si`/`so` (swap in/out) continuously non-zero in `vmstat`; and `dmesg -T` showing `Out of memory: Killed process <pid> (<name>)` from the OOM killer.',
        hintHi: '`free` = RAM jo na processes dwara used na cache hold kar raha — warm system par naturally chhoटा, problem NAHI. `available` = ek naya allocation kya paega ka estimate, reclaimable cache count karте hue — real signal. Real pressure: `available` ~0 + swap `used` climbing; `vmstat` mein `si`/`so` non-zero; `dmesg` mein OOM killer.',
      },
    ],

    keyTakeaways: [
      'A machine has a few finite resources (CPU, memory, disk space, disk I/O, network) — almost every "sick box" is ONE of them exhausted. Diagnose by reading ONE INSTRUMENT PER RESOURCE in turn; the combination points at the cause. Learn the toolkit and most incidents become a 2-minute triage.',
      'CPU/LOAD: `uptime` = load average (1/5/15 min) = count of processes RUNNING + WAITING-TO-RUN + in uninterruptible-I/O-sleep — NOT a CPU %. Read it RELATIVE to `nproc`: load > #cores = saturated; 1-min > 15-min = worsening. `top`/`htop`: `%CPU` (per core), `RES` (real RAM), and the summary\'s `wa` = I/O WAIT. High load + one process ~100%/core + low `wa` = CPU-bound on that process. High load + low CPU% + high `wa` = DISK-bound (CPU tools won\'t show it).',
      'MEMORY: `free -h` — read `available` (what a new process can get, counting reclaimable cache), NOT `free` (naturally small — Linux uses spare RAM as disk cache and returns it instantly). Real pressure = `available` ~0 AND swap `used` climbing AND `vmstat` `si`/`so` non-zero AND `dmesg` "Out of memory: Killed process" (the OOM killer). DISK: `df -h` = SPACE (100% → all writes fail); `df -i` = INODES (can be 100% with space free — millions of tiny files); `du -sh * | sort -h` to walk down to the culprit. `df` 100% but `du` doesn\'t add up = a DELETED file still held open (`lsof +L1` / `lsof | grep deleted`) → SIGHUP or restart the holder.',
      'NETWORK: `ss -tlnp` = listening TCP sockets + owning process ("what\'s on :8080?" / "what\'s already using my port?"); `ss -tanp` = all + state (many CLOSE-WAIT = app not closing sockets). OPEN FILES: `lsof -p <pid>` (everything a process has open — FD-limit "too many open files"); `lsof +D /path` (who holds files under this dir — why won\'t it unmount / free space). DISK I/O: `iostat -x 2` — `%util` (~100 = at capacity), `await` (ms/op, rising = bottleneck); `vmstat 2` — `r` (run queue), `b` (blocked on I/O), `wa`.',
      'KERNEL/SERVICE EVENTS: `dmesg -T` (kernel ring buffer, human timestamps) = OOM kills, disk errors (failing hardware), segfaults, network link-down, `conntrack table full`. `journalctl -p err -b` = every error-priority line from every service this boot; `journalctl --since "-15min"` when you know roughly when it started. TRIAGE ORDER: `uptime`+`nproc` → `top` (check `wa`) → `iostat` if `wa` high → `free`+`vmstat` → `df -h`+`df -i` → `dmesg -T | tail` → `journalctl -p err --since -30min`.',
    ],
    keyTakeawaysHi: [
      'Ek machine ke paas kुछ finite resources hain (CPU, memory, disk space, disk I/O, network) — lagभag har "sick box" unmें se EK exhausted hai. PRATI RESOURCE EK INSTRUMENT baari-baari read karके diagnose karो; combination cause par point karता hai.',
      'CPU/LOAD: `uptime` = load average = RUNNING + WAITING-TO-RUN + uninterruptible-I/O-sleep processes ki count — CPU % NAHI. Ise `nproc` ke RELATIVE padho: load > #cores = saturated. `top`: `wa` = I/O WAIT. High load + ek process ~100%/core + low `wa` = CPU-bound. High load + low CPU% + high `wa` = DISK-bound.',
      'MEMORY: `free -h` — `available` padho (`free` nahi — Linux spare RAM disk cache ke liye istemal karता hai). Real pressure = `available` ~0 + swap `used` climbing + `vmstat` `si`/`so` non-zero + `dmesg` "Out of memory: Killed process". DISK: `df -h` = SPACE; `df -i` = INODES (space free ke saath 100% ho sakta hai). `df` 100% par `du` add nahi hota = ek DELETED file open held (`lsof | grep deleted`) → SIGHUP/restart.',
      'NETWORK: `ss -tlnp` = listening sockets + process; `ss -tanp` = all + state. OPEN FILES: `lsof -p <pid>`; `lsof +D /path`. DISK I/O: `iostat -x 2` — `%util` (~100 = capacity), `await`; `vmstat 2` — `r`, `b`, `wa`.',
      'KERNEL/SERVICE EVENTS: `dmesg -T` = OOM kills, disk errors, segfaults, network link-down. `journalctl -p err -b` = is boot ke har service ke errors. TRIAGE ORDER: `uptime`+`nproc` → `top` (`wa` check) → `iostat` agar `wa` high → `free`+`vmstat` → `df -h`+`df -i` → `dmesg -T | tail` → `journalctl -p err`.',
    ],
  },

  {
    slug: 'ops-writing-safe-shell-scripts',
    title: 'Writing Safe Shell Scripts',
    titleHi: 'Safe Shell Scripts Likhna',
    description: 'A shell script that runs unattended on servers needs a small set of defensive habits: strict mode (set -euo pipefail), quoting every expansion, cleaning up with traps, using mktemp, validating inputs, and being idempotent. shellcheck catches most of what you miss.',
    descriptionHi: 'Ek shell script jo servers par unattended run karती hai use defensive habits ka ek chhoटा set chahiye: strict mode (set -euo pipefail), har expansion quote karна, traps se cleanup karना, mktemp istemal karना, inputs validate karना, aur idempotent hona. shellcheck zyaादातर jo aap miss karते ho catch karता hai.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 6,

    analogy: {
      en: '**Fitting a workshop machine with guards, an emergency stop, and interlocks before you leave it running on a night shift.** Strict mode is the interlock: if any step jams, the machine halts instead of feeding the next part into a broken cutter. The trap is the emergency stop wired to "power off *and* retract the tool" — however the job ends, the workspace is left safe. `mktemp` is using a fresh disposable jig each run instead of one that might have someone else\'s part still clamped in it. Input validation is the gauge at the intake that rejects a workpiece that is the wrong size before it reaches the blade. And idempotency is designing the job so that if the shift supervisor runs it twice by mistake, the second run notices the work is done and stops, rather than machining the finished part again.',
      hi: '**Ek workshop machine ko guards, ek emergency stop, aur interlocks se fit karना iske pehle ki aap ise night shift par running chhoड़о.** Strict mode interlock hai: agar koi step jam hoता hai, machine halt hoती hai bजाy agla part ek broken cutter mein feed karने ke. Trap emergency stop hai jo "power off *aur* tool retract" se wired hai — job jaise bhi end ho, workspace safe chhoड़a jाता hai. `mktemp` har run ek fresh disposable jig istemal karना hai. Input validation intake par gauge hai jo galat size ka workpiece reject karता hai. Aur idempotency job ko aise design karना hai ki agar supervisor ise galti se do baar chalाता hai, doosरा run notice karता hai ki work done hai aur stop karता hai.',
    },

    simple: `**THE STRICT-MODE HEADER — put this at the top of every script:**
\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'
\`\`\`
\`\`\`
set -e        | exit immediately if any command fails (non-zero) — no ploughing on
set -u        | referencing an UNSET variable is an error, not an empty string
set -o pipefail | a pipeline fails if ANY stage fails, not just the last
IFS=$'\\n\\t'  | word-split only on newline/tab, not space — safer 'for' loops
\`\`\`
\`set -e\` has gaps: it does NOT trigger inside \`if\`/\`while\`/\`&&\`/\`||\` conditions, or for
a command whose failure you \`|| true\`. Know them; don't fight them.

**CLEAN UP WITH A TRAP — runs however the script exits:**
\`\`\`bash
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT           # EXIT = normal exit, error, or signal
# ... use "$work" ...
\`\`\`

**MAKE TEMP FILES SAFELY:** \`mktemp\` / \`mktemp -d\` — a unique, unpredictable, private
path. NEVER \`/tmp/mylock\` or \`/tmp/$$\` (predictable = a symlink-attack / collision risk).

**QUOTE EVERYTHING:** \`"$var"\`, \`"$@"\` (not \`$*\`), \`"$(cmd)"\`, \`"\${arr[@]}"\`.

**VALIDATE INPUTS before acting:**
\`\`\`bash
[[ $# -eq 1 ]]                  || { echo "usage: $0 <env>" >&2; exit 2; }
[[ "$1" =~ ^(dev|staging|prod)$ ]] || { echo "bad env: $1" >&2; exit 2; }
command -v kubectl >/dev/null   || { echo "kubectl not found" >&2; exit 127; }
\`\`\`

**BE IDEMPOTENT:** running it twice = same result as once. "ensure" not "create":
\`\`\`bash
mkdir -p "$dir"                                   # not: mkdir (fails 2nd time)
grep -qxF "$line" "$file" || echo "$line" >> "$file"   # append only if absent
id "$user" &>/dev/null || useradd "$user"         # create only if missing
\`\`\`

**NEVER:** \`rm -rf $VAR/\` unquoted/unguarded ; \`cd $DIR\` without checking it worked ;
\`curl ... | bash\` from an unpinned URL ; parsing \`ls\` output ; \`[ $x = y ]\` (use \`[[ ]]\`).

**\`shellcheck script.sh\`** — a linter that catches ~90% of these. Run it in CI.`,

    simpleHi: `**STRICT-MODE HEADER — har script ke top par ye daalो:**
\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'
\`\`\`
\`\`\`
set -e        | koi command fail hone par turant exit — aage nahi badho
set -u        | ek UNSET variable reference karना ek error hai
set -o pipefail | ek pipeline fail hoती hai agar KOI stage fail hoता hai
IFS=$'\\n\\t'  | sirf newline/tab par word-split, space par nahi
\`\`\`
\`set -e\` ke gaps hain: ye \`if\`/\`while\`/\`&&\`/\`||\` conditions ke andar trigger NAHI hoता.

**TRAP SE CLEANUP — script jaise bhi exit ho tab runs:**
\`\`\`bash
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
\`\`\`

**TEMP FILES SAFELY BANAO:** \`mktemp\` / \`mktemp -d\` — ek unique, unpredictable, private path.
KABHI \`/tmp/mylock\` ya \`/tmp/$$\` nahi.

**SAB KUCH QUOTE KARO:** \`"$var"\`, \`"$@"\` (\`$*\` nahi), \`"$(cmd)"\`, \`"\${arr[@]}"\`.

**INPUTS VALIDATE KARO act karने se pehle:**
\`\`\`bash
[[ $# -eq 1 ]] || { echo "usage: $0 <env>" >&2; exit 2; }
[[ "$1" =~ ^(dev|staging|prod)$ ]] || { echo "bad env" >&2; exit 2; }
command -v kubectl >/dev/null || { echo "kubectl not found" >&2; exit 127; }
\`\`\`

**IDEMPOTENT BANO:** do baar chalाना = ek baar jaisा result. "create" nahi "ensure":
\`\`\`bash
mkdir -p "$dir"
grep -qxF "$line" "$file" || echo "$line" >> "$file"
id "$user" &>/dev/null || useradd "$user"
\`\`\`

**KABHI NAHI:** unquoted \`rm -rf $VAR/\` ; check kiye bina \`cd $DIR\` ; unpinned URL se \`curl | bash\` ;
\`ls\` output parse karना ; \`[ $x = y ]\` (\`[[ ]]\` istemal karो).

**\`shellcheck script.sh\`** — ek linter jo in ka ~90% catch karता hai. CI mein chalाओ.`,

    content: `## Strict mode

The default behaviour of a shell script is dangerously permissive: a failing command does not stop the script, an unset variable expands to an empty string, and a pipeline's success is judged only by its last stage. The first three lines of any serious script fix this:

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'
\`\`\`

- **\`set -e\` (errexit)** — the script exits the moment any command returns a non-zero status (unless that command is part of a condition). Without it, a script that fails to \`cd\` into a directory happily runs the rest of its commands in the wrong place.
- **\`set -u\` (nounset)** — referencing a variable that was never set is a fatal error rather than silently becoming \`""\`. This is what turns \`rm -rf "$DIR/"*\` with an unset \`DIR\` into an error instead of \`rm -rf /*\`.
- **\`set -o pipefail\`** — a pipeline returns the exit status of the *last command to fail*, not just the last command. Without it, \`generate_data | process\` reports success even if \`generate_data\` crashed, as long as \`process\` handled the truncated input without erroring.
- **\`IFS=$'\\n\\t'\`** — removes the space from the internal field separator, so unquoted expansions and \`for\` loops split only on newlines and tabs. A defensive default (though quoting properly is better).

**\`set -e\` has well-known gaps** you must know rather than fight:

- It does **not** trigger for a command in an \`if\`, \`while\`, or \`until\` condition, or on the left of \`&&\`/\`||\`. \`if ! foo; then ...; fi\` is fine.
- A command you explicitly allow to fail with \`|| true\` does not trip it.
- In a function called in a condition context, \`set -e\` is suppressed for the whole function (a long-standing surprise).
- \`local x=$(cmd)\` masks \`cmd\`'s exit status behind \`local\`'s (always 0). Declare, then assign: \`local x; x=$(cmd)\`.

So \`set -e\` is a safety net, not a guarantee — combine it with explicit checks on the commands that matter.

## Cleanup with traps

A script that creates temporary files, acquires a lock, or starts a background process must clean up **however it exits** — normal completion, an error under \`set -e\`, or a signal (Ctrl-C, SIGTERM from a timeout). \`trap ... EXIT\` runs its command on any exit:

\`\`\`bash
work="$(mktemp -d)"
cleanup() {
  local rc=$?
  rm -rf "$work"
  [[ $rc -ne 0 ]] && echo "failed (rc=$rc), cleaned up $work" >&2
  return $rc
}
trap cleanup EXIT
\`\`\`

The \`EXIT\` pseudo-signal covers everything. You can also trap specific signals (\`trap 'echo interrupted' INT TERM\`) if you need different handling, but for cleanup, \`EXIT\` alone is usually right. Capture \`$?\` as the *first* line of the handler if you need the original exit code, because commands inside the handler overwrite it.

## Safe temporary files

Never construct a temp path yourself:

- \`/tmp/mylock\`, \`/tmp/app-$USER\`, \`/tmp/build.$$\` — all **predictable**. Another user (or an attacker) can pre-create that path, or a symlink pointing somewhere sensitive, and your script writes through it. Predictable temp names are a classic local privilege-escalation and denial-of-service vector.
- \`mktemp\` — creates a file with a random, unpredictable name, mode \`600\`, and returns the path. \`mktemp -d\` — the same for a directory (mode \`700\`). \`mktemp -t prefix.XXXXXX\` — with a prefix for readability. Always pair with a \`trap ... EXIT\` to remove it.

## Quote every expansion

Every \`$var\`, \`$(cmd)\`, \`\${arr[@]}\`, and \`$@\` goes in double quotes unless you have consciously decided you want word splitting (which is rare). Specifically:

- \`"$@"\` — expands to each positional parameter as a **separate** quoted word (correct for forwarding args). \`$*\` and \`"$*"\` join them into one string — almost never what you want.
- \`"\${arr[@]}"\` — each array element as a separate word. \`"\${arr[*]}"\` joins them.
- \`"$(cmd)"\` in a command position; unquoted only when you specifically want the output split into arguments.

## Validate inputs before doing anything

A script that acts on servers should refuse to run on bad input rather than doing something destructive with it:

\`\`\`bash
usage() { echo "usage: $0 --env <dev|staging|prod> [--dry-run]" >&2; exit 2; }
[[ $# -ge 2 ]] || usage
[[ "$ENV" =~ ^(dev|staging|prod)$ ]] || { echo "bad --env: '$ENV'" >&2; exit 2; }
[[ -d "$RELEASE_DIR" ]] || { echo "release dir not found: $RELEASE_DIR" >&2; exit 1; }
command -v kubectl >/dev/null || { echo "kubectl is required" >&2; exit 127; }
[[ $EUID -eq 0 ]] && { echo "do not run this as root" >&2; exit 1; }
\`\`\`

Check: argument count and shape, that enum-like values are in the allowed set, that paths exist and are the right type, that required tools are on \`PATH\`, and that the script is being run as the right user. Use exit code \`2\` for usage errors, \`127\` for missing dependencies, and a meaningful non-zero for everything else.

## Be idempotent

An operations script will be run again — by a retry, by a nervous operator, by a scheduler that double-fired. Design every step so that **running it twice produces the same result as running it once**. The pattern is "ensure X", not "create X":

| Instead of | Use |
|---|---|
| \`mkdir "$d"\` (fails if it exists) | \`mkdir -p "$d"\` |
| \`echo "$line" >> "$f"\` (duplicates) | \`grep -qxF "$line" "$f" || echo "$line" >> "$f"\` |
| \`useradd "$u"\` (fails if present) | \`id "$u" &>/dev/null || useradd "$u"\` |
| \`ln -s "$src" "$dst"\` (fails if present) | \`ln -sfn "$src" "$dst"\` |
| \`git clone "$url" "$dir"\` | \`[[ -d "$dir/.git" ]] && git -C "$dir" pull || git clone "$url" "$dir"\` |
| \`systemctl start x\` (no-op if running, fine) | \`systemctl start x\` — actually already idempotent |

Idempotency is also what makes a script safe to put in a config-management tool or a cron job.

## The list of things not to do

- **\`rm -rf $VAR/\`** unquoted and unguarded — see Lesson 1. Quote it, guard the variable (\`\${VAR:?}\`), and consider moving to a trash directory instead of deleting.
- **\`cd "$DIR"\`** without checking it succeeded — \`set -e\` mostly covers this, but be explicit: \`cd "$DIR" || exit 1\`. A script that continues after a failed \`cd\` runs in the wrong directory.
- **\`curl https://... | bash\`** from a URL you do not control and have not pinned — you are executing whatever that server returns, at that moment, as your user. Download, inspect, checksum, then run.
- **Parsing \`ls\`** — its output is for humans and varies with options, locale, and filenames. Use a glob (\`for f in *.log\`) or \`find ... -print0 | while read -d ''\`.
- **\`[ ... ]\`** for tests — the old \`test\` builtin needs every variable quoted or it breaks on empty/spaces. Use \`[[ ... ]]\` (bash), which handles unquoted variables, supports \`=~\` regex and \`&&\`/\`||\`, and does not word-split.
- **Secrets in the script or in \`ps\`** — do not hardcode a token, and do not pass one as a command-line argument (it shows in \`ps\` and shell history). Read it from a file or an environment variable set by the caller.

## shellcheck

\`shellcheck\` is a static analyser for shell scripts that flags almost every issue above — unquoted expansions, \`set -e\` gotchas, \`[ ]\` misuse, parsing \`ls\`, useless \`cat\`, non-portable constructs — with a link explaining each. Run it locally (editor plugins exist for every editor) and **in CI** as a required check on any \`.sh\` file. It is the single highest-leverage habit for shell quality.`,

    contentHi: `## Strict mode

Ek shell script ka default behaviour dangerously permissive hai: ek failing command script ko stop nahi karता, ek unset variable ek empty string mein expand hoता hai, aur ek pipeline ki success sirf iske last stage se judge hoती hai. Kisi bhi serious script ki pehli teen lines ise fix karती hain:

\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
IFS=$'\\n\\t'
\`\`\`

- **\`set -e\`** — jis moment koi command non-zero status return karता hai script exit hoती hai.
- **\`set -u\`** — ek variable jo kabhi set nahi hui reference karना ek fatal error hai.
- **\`set -o pipefail\`** — ek pipeline *fail hone wale last command* ka exit status return karता hai.
- **\`IFS=$'\\n\\t'\`** — space ko internal field separator se remove karता hai.

**\`set -e\` ke well-known gaps hain:** ye ek \`if\`/\`while\` condition mein, ya \`&&\`/\`||\` ke left par trigger NAHI hoता. \`|| true\` waala ek command ise trip nahi karता. \`local x=$(cmd)\` \`cmd\` ka exit status mask karता hai — declare karो phir assign: \`local x; x=$(cmd)\`.

## Traps se cleanup

Ek script jo temp files banाता hai must clean up **jaise bhi ye exit ho**. \`trap ... EXIT\` kisi bhi exit par apna command run karता hai:

\`\`\`bash
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
\`\`\`

\`EXIT\` pseudo-signal sab кुछ cover karता hai.

## Safe temporary files

Kabhi khud ek temp path construct mat karो: \`/tmp/mylock\`, \`/tmp/build.$$\` — sab **predictable** (symlink-attack risk). \`mktemp\` — ek random, unpredictable naam, mode \`600\`. \`mktemp -d\` — ek directory (mode \`700\`).

## Har expansion quote karो

Har \`$var\`, \`$(cmd)\`, \`\${arr[@]}\`, aur \`$@\` double quotes mein. \`"$@"\` — har positional parameter ko ek **separate** quoted word ke roop mein. \`$*\` unhe ek string mein join karта hai.

## Act karने se pehle inputs validate karो

Argument count aur shape check karो, enum-like values allowed set mein, paths exist karें, required tools \`PATH\` par, aur script sahi user ke roop mein run ho raha hai. Usage errors ke liye exit code \`2\`, missing dependencies ke liye \`127\`.

## Idempotent bano

Ek operations script phir se run kiya jaega. Har step aise design karो ki **do baar chalाना ek baar jaisा result produce karे**. Pattern "ensure X" hai, "create X" nahi: \`mkdir -p\`, \`grep -qxF "$line" "$f" || echo "$line" >> "$f"\`, \`id "$u" &>/dev/null || useradd "$u"\`, \`ln -sfn\`.

## Jo NA karें

- **\`rm -rf $VAR/\`** unquoted/unguarded.
- **\`cd "$DIR"\`** bina check kiye ye succeeded.
- **\`curl https://... | bash\`** ek unpinned URL se.
- **\`ls\` parse karना.**
- Tests ke liye **\`[ ... ]\`** — \`[[ ... ]]\` istemal karो.
- **Script mein ya \`ps\` mein secrets.**

## shellcheck

\`shellcheck\` shell scripts ke liye ek static analyser hai jo lagभag har upar ka issue flag karता hai. Ise locally aur **CI mein** ek required check ke roop mein chalाओ. Ye shell quality ke liye single highest-leverage habit hai.`,

    examples: [
      {
        title: 'The strict-mode skeleton with a cleanup trap',
        titleHi: 'Cleanup trap ke saath strict-mode skeleton',
        code: `# VERIFY
set -euo pipefail
IFS=$'\\n\\t'

need() { command -v "$1" >/dev/null 2>&1 || { echo "missing: $1" >&2; exit 127; }; }
need grep; need awk

work="$(mktemp -d)"
trap 'rm -rf "$work"; echo "cleaned up temp dir"' EXIT

echo "one"   > "$work/a"
echo "two"   > "$work/b"
count=$(ls "$work" | wc -l | tr -d ' ')
echo "files in workdir: $count"

: "\${TARGET:=default-target}"
echo "TARGET is: $TARGET"`,
        output: `files in workdir: 2
TARGET is: default-target
cleaned up temp dir`,
        explain: 'This is the header every operational script should start with. `set -euo pipefail` makes a failure anywhere stop the script, an unset variable an error, and a failing pipeline stage propagate. The `need` helper verifies that each external command the script depends on is present before the script does any work, exiting with code 127 (the conventional "command not found") if one is missing, so the script fails clearly at the start rather than partway through. `mktemp -d` creates a uniquely-named private directory and returns its path, and the `trap ... EXIT` immediately registers a cleanup that removes it — this runs whether the script finishes normally, exits on an error, or is interrupted by a signal, so the temp directory never leaks. The `: "${TARGET:=default-target}"` idiom assigns a default to `TARGET` only if it was unset or empty, using the no-op `:` command so nothing is executed with the value; combined with `set -u` this is how you provide a fallback without tripping the unset-variable check. The output confirms the work happened and the trap fired last.',
        explainHi: 'Ye header har operational script ko shuru karना chahiye. `set -euo pipefail` ek failure ko kahin bhi script stop karवाता hai. `need` helper verify karता hai ki har external command jo script par depend karता hai present hai script kुछ work karने se pehle, code 127 ke saath exit karके agar ek missing hai. `mktemp -d` ek uniquely-named private directory banаता hai, aur `trap ... EXIT` turant ek cleanup register karता hai jo ise remove karता hai — ye tab runs chahे script normally finish ho, ek error par exit ho, ya ek signal se interrupt ho. `: "${TARGET:=default-target}"` idiom ek default assign karता hai sirf agar `TARGET` unset tha.',
      },
      {
        title: 'Input validation with a real argument parser',
        titleHi: 'Ek real argument parser ke saath input validation',
        code: `# VERIFY
exec 2>&1
parse() (
  set -euo pipefail
  ENV="" DRY=0
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --env)      ENV="\${2:-}"; shift 2 ;;
      --dry-run)  DRY=1; shift ;;
      *)          echo "unknown arg: $1"; exit 2 ;;
    esac
  done
  [[ -n "$ENV" ]] || { echo "error: --env is required"; exit 2; }
  [[ "$ENV" =~ ^(dev|staging|prod)$ ]] || { echo "error: --env must be dev|staging|prod, got '$ENV'"; exit 2; }
  echo "OK: deploying to $ENV (dry-run: $DRY)"
)
parse --env staging --dry-run || echo "[rejected: exit $?]"
parse --dry-run               || echo "[rejected: exit $?]"
parse --env production        || echo "[rejected: exit $?]"`,
        output: `OK: deploying to staging (dry-run: 1)
error: --env is required
[rejected: exit 2]
error: --env must be dev|staging|prod, got 'production'
[rejected: exit 2]`,
        explain: 'The parser loops over the arguments with a `case` on each, consuming one or two positions as appropriate and rejecting anything it does not recognise with exit code 2, the conventional code for a usage error. After parsing, it checks that the required `--env` was supplied and that its value is one of the three permitted environments, again exiting 2 with a clear message if not. The three calls exercise the paths: a valid invocation prints the confirmation, a missing `--env` is rejected before any deployment action could run, and a plausible-but-wrong value like `production` (instead of `prod`) is caught rather than being passed through to become a deployment to a nonexistent environment or, worse, a silent mismatch. Running the parser in a subshell with its own `set -e` means a validation failure exits that subshell without terminating the outer script, so all three cases can be demonstrated. In a real script the validated values would then be used with confidence, because everything past this point is known to be well-formed.',
        explainHi: 'Parser arguments over loop karта hai har par ek `case` ke saath, appropriate ek ya do positions consume karके aur jo bhi ye recognise nahi karता ise exit code 2 ke saath reject karके. Parsing ke baad, ye check karता hai ki required `--env` supplied tha aur iski value teen permitted environments mein se ek hai. Teen calls paths exercise karते hain: ek valid invocation confirmation print karता hai, ek missing `--env` reject hoता hai iske pehle ki koi deployment action run ho sake, aur ek plausible-but-wrong value jaise `production` (`prod` ke bजाy) caught hoता hai.',
      },
      {
        title: 'Idempotent "ensure" operations',
        titleHi: 'Idempotent "ensure" operations',
        code: `# VERIFY
set -euo pipefail

ensure_dir()  { [[ -d "$1" ]] || { mkdir -p "$1"; echo "created $1"; }; }
ensure_line() { grep -qxF "$2" "$1" 2>/dev/null || { echo "$2" >> "$1"; echo "appended to $1"; }; }

ensure_dir ./conf
ensure_dir ./conf                       # 2nd call: no output, no error
ensure_line ./conf/app.env "LOG_LEVEL=info"
ensure_line ./conf/app.env "LOG_LEVEL=info"   # 2nd call: no-op
ensure_line ./conf/app.env "PORT=8080"

echo "--- final app.env ---"
cat ./conf/app.env`,
        output: `created ./conf
appended to ./conf/app.env
appended to ./conf/app.env
--- final app.env ---
LOG_LEVEL=info
PORT=8080`,
        explain: 'Each helper is written as "make sure X is true", not "do X". `ensure_dir` checks whether the directory already exists and only creates it if not, so a second call is a silent no-op rather than an error. `ensure_line` checks whether the exact line is already present in the file — `grep -qxF` matches a fixed string as a whole line, quietly — and appends only if it is missing, so re-running the script does not accumulate duplicate configuration lines. The demonstration calls each helper twice: the first call does the work and reports it, the second produces no output because the desired state is already in place. The final file contains each line exactly once regardless of how many times the script ran. This property is what makes a script safe to retry after a partial failure, safe to run from a scheduler that might double-fire, and safe to hand to a configuration-management system that runs it on every convergence cycle.',
        explainHi: 'Har helper "sure karो ki X true hai" ke roop mein likha hai, "X karो" nahi. `ensure_dir` check karता hai ki directory already exist karती hai aur sirf tab create karता hai agar nahi, to ek doosरा call ek silent no-op hai. `ensure_line` check karता hai ki exact line file mein already present hai — `grep -qxF` ek fixed string ko ek poori line ke roop mein match karता hai — aur sirf tab append karता hai agar ye missing hai, to script re-run karना duplicate configuration lines accumulate nahi karता. Ye property wo hai jo ek script ko ek partial failure ke baad retry karने ke liye safe banаती hai.',
      },
      {
        title: 'Guarding a destructive command',
        titleHi: 'Ek destructive command ko guard karna',
        code: `# VERIFY
exec 2>&1
clean_cache() (
  set -euo pipefail
  base="\${1:-}"
  [[ -n "$base" ]]      || { echo "refuse: cache base is empty"; exit 2; }
  [[ "$base" = /* ]]    || { echo "refuse: cache base must be absolute, got '$base'"; exit 2; }
  [[ "$base" != "/" ]]  || { echo "refuse: cache base is /"; exit 2; }
  [[ -d "$base" ]]      || { echo "refuse: not a directory: $base"; exit 2; }
  echo "would run: rm -rf -- '$base'/*"
)
mkdir -p "$PWD/appcache"
clean_cache "$PWD/appcache" | sed "s#$PWD#<cwd>#"
clean_cache ""               || echo "[exit $?]"
clean_cache "relative/path"   || echo "[exit $?]"
clean_cache "/"               || echo "[exit $?]"`,
        output: `would run: rm -rf -- '<cwd>/appcache'/*
refuse: cache base is empty
[exit 2]
refuse: cache base must be absolute, got 'relative/path'
[exit 2]
refuse: cache base is /
[exit 2]`,
        explain: 'A command that recursively deletes needs its target validated before it runs, because the failure modes are catastrophic and irreversible. This function checks four conditions in turn: the path is non-empty (an empty variable would make `rm -rf "$base"/*` into `rm -rf /*`), the path is absolute (a relative path resolves against whatever the current directory happens to be, which is unpredictable in a script), the path is not the root directory itself, and the path actually exists and is a directory rather than a file or a broken value. Only after all four pass does the function proceed — here it prints the command it would run rather than actually deleting, for the demonstration. The four test invocations show a valid path being accepted and each of the dangerous inputs being rejected with a specific message and exit code 2. In a real script the `echo "would run"` line would be the actual `rm -rf -- "$base"/*`, now safe because every way it could go wrong has been checked.',
        explainHi: 'Ek command jo recursively delete karता hai use run hone se pehle apna target validated chahiye, kyunki failure modes catastrophic aur irreversible hain. Ye function chaar conditions baari-baari check karता hai: path non-empty hai (ek empty variable `rm -rf "$base"/*` ko `rm -rf /*` banा deता), path absolute hai, path root directory khud nahi hai, aur path actually exist karता hai aur ek directory hai. Sirf chaarों pass hone ke baad function proceed karता hai. Chaar test invocations ek valid path accept hote aur har dangerous input reject hote dikhते hain.',
      },
    ],

    mistakes: [
      {
        wrong: `# a script with no strict mode that "mostly works"
#!/bin/bash
cd $DEPLOY_DIR              # if $DEPLOY_DIR is unset -> cd to $HOME, silently
rm -rf build/              # ...deletes $HOME/build
cp -r $ARTIFACT build/     # if $ARTIFACT is unset -> cp -r build/ (copies nothing, no error)
./run-migrations.sh        # runs whatever migrations happen to be in $HOME
# every one of these failures is SILENT. the script exits 0. the deploy "succeeded".`,
        why: 'Without strict mode, each of these lines can fail in a way that produces no error and does not stop the script. An unset variable in `cd $DEPLOY_DIR` expands to nothing, so the command becomes bare `cd`, which changes to the home directory and succeeds, and every subsequent path-relative command then operates in the wrong place. An unset variable in `cp -r $ARTIFACT build/` similarly collapses the command into something that does nothing useful but still exits zero. A failing `run-migrations.sh` does not halt the script because nothing checks its exit status. The cumulative effect is a script that reports success while having done the wrong thing or nothing, which is worse than an outright failure because it is not noticed. Enabling `set -euo pipefail` converts every one of these into an immediate, visible error: the unset variable is caught by `set -u`, and any non-zero exit is caught by `set -e`, so the script stops at the first problem with a clear indication of where.',
        right: `#!/usr/bin/env bash
set -euo pipefail
: "\${DEPLOY_DIR:?}" "\${ARTIFACT:?}"          # fail loudly if either is unset
cd "$DEPLOY_DIR"
rm -rf -- "\${DEPLOY_DIR:?}/build"
cp -r -- "$ARTIFACT" "$DEPLOY_DIR/build"
./run-migrations.sh                            # a non-zero exit now stops the script`,
        whyHi: 'Strict mode ke bina, in mein se har line ek aisी tarah se fail ho sakती hai jo koi error produce nahi karती aur script ko stop nahi karती. `cd $DEPLOY_DIR` mein ek unset variable kुछ nahi mein expand hoता hai, to command bare `cd` ban jата hai, jo home directory mein change hoता hai aur succeed karता hai, aur har subsequent path-relative command phir galat jagah operate karता hai. Cumulative effect ek script hai jo success report karती hai jab isne galat cheez ya kुछ nahi kiya. `set -euo pipefail` enable karना in sabko ek immediate, visible error mein convert karता hai.',
      },
      {
        wrong: `# using a predictable temp file
LOCKFILE=/tmp/deploy.lock
if [ -f "$LOCKFILE" ]; then echo "already running"; exit 1; fi
touch "$LOCKFILE"
# ... work ...
rm "$LOCKFILE"
# -> if the script crashes before 'rm', the lock is stuck forever (next run
//    always says "already running"). AND /tmp/deploy.lock is predictable —
//    another user can create it to DoS your deploys, or symlink it somewhere.`,
        why: 'This locking approach has two independent flaws. The lock file is removed by an explicit `rm` at the end of the script, so any path that exits before that line — an error, a signal, a crash — leaves the lock file in place, and every subsequent run sees it and refuses to start, requiring a human to notice and delete it. A `trap ... EXIT` that removes the lock fixes this, because it runs on every exit path. Separately, the lock path is a fixed, predictable name in a world-writable directory, so another user on the system can create that file first to prevent the script from ever running, or replace it with a symlink to a file the script\'s user can write, turning the script\'s `touch` and `rm` into an attack on that target. A correct implementation uses `flock` on a file descriptor, which the kernel releases automatically when the process exits regardless of how, or at minimum creates the lock with `mktemp` in a directory only the running user can write and removes it via an EXIT trap.',
        right: `# use flock: kernel-managed, auto-released on exit, race-free
exec 9>/var/lock/deploy.lock            # a fixed path is fine here — flock, not existence
flock -n 9 || { echo "another deploy is running"; exit 1; }
# ... work ... (lock is held on fd 9 for the life of the process)
# no cleanup needed: the kernel drops the lock when the process exits, any way it exits.`,
        whyHi: 'Is locking approach mein do independent flaws hain. Lock file script ke end par ek explicit `rm` se remove hoती hai, to koi bhi path jo us line se pehle exit hoता hai lock file ko jagah par chhoड़ता hai, aur har subsequent run ise dekhता hai aur start karने se refuse karता hai. Ek `trap ... EXIT` ise fix karता hai. Alag se, lock path ek fixed, predictable naam hai ek world-writable directory mein. Ek correct implementation `flock` istemal karता hai ek file descriptor par, jise kernel automatically release karता hai jab process exit hoता hai.',
      },
      {
        wrong: `# passing a secret as a command-line argument
$ ./deploy.sh --token "ghp_realSecretTokenHere123"
# -> the token is now visible to EVERY user on the box via 'ps aux' for the
//    life of the process, it's in your shell history (~/.bash_history), and
//    if the script logs its args (many do), it's in the log file too.`,
        why: 'A command-line argument is not private. While a process runs, its full command line, including every argument, is readable by any user on the system through the process listing, because the kernel exposes it in `/proc/<pid>/cmdline`. So a secret passed as an argument is exposed to every account on the machine for as long as the script runs, which for a deploy could be minutes. The same string is also written to the shell\'s history file when you run the command interactively, persisting on disk, and many scripts echo or log their arguments for debugging, which would place the secret in a log file that is likely shipped to a central system. Secrets should reach a script through channels that are not world-visible: an environment variable set by the caller (visible only to the process and its children, not in `ps`), a file with restricted permissions that the script reads, or a call to a secret manager. If a value must appear on a command line, it should be a reference to a secret, not the secret itself.',
        right: `# pass a reference, read the value from a private channel:
$ DEPLOY_TOKEN="$(pass show deploy/token)" ./deploy.sh --env prod
# in deploy.sh:
: "\${DEPLOY_TOKEN:?set DEPLOY_TOKEN in the environment}"
# env vars are not shown in 'ps'; or read from a 0600 file the script opens itself.`,
        whyHi: 'Ek command-line argument private nahi hai. Jab ek process runs karता hai, iski full command line, har argument sameत, system par kisi bhi user dwara readable hai process listing ke through, kyunki kernel ise `/proc/<pid>/cmdline` mein expose karता hai. To ek secret jo ek argument ke roop mein pass kiya gaya machine par har account ko exposed hai jab tak script runs karता hai. Wahi string shell ki history file mein bhi likhी jाती hai. Secrets ek script tak un channels ke through pahunchне chahiye jo world-visible nahi hain: ek environment variable, ek restricted-permissions file, ya ek secret manager ko ek call.',
      },
    ],

    realWorld: [
      {
        en: '**`shellcheck` as a required CI check on every `.sh` file** — a pre-commit hook runs it locally and the pipeline fails the build on any warning, so the whole class of unquoted-variable and `set -e`-gotcha bugs never reaches a server.',
        hi: '**Har `.sh` file par ek required CI check ke roop mein `shellcheck`** — ek pre-commit hook ise locally chalाता hai aur pipeline kisi bhi warning par build fail karता hai.',
      },
      {
        en: '**A deploy script that starts with `: "${RELEASE:?}" "${TARGET_HOST:?}"` and validates `$TARGET_HOST` against an allowlist** — a fat-fingered hostname is rejected in the first second instead of deploying to the wrong environment.',
        hi: '**Ek deploy script jo `: "${RELEASE:?}" "${TARGET_HOST:?}"` se shuru hoती hai aur `$TARGET_HOST` ko ek allowlist ke against validate karती hai**.',
      },
      {
        en: '**Every temp-using script switched from `/tmp/$$` to `mktemp -d` + `trap EXIT`** after one left a 12 GB temp directory behind on a crash and filled a disk — the trap-based cleanup means an interrupted run cleans up after itself.',
        hi: '**Har temp-using script `/tmp/$$` se `mktemp -d` + `trap EXIT` par switch kiya** ek ke ek crash par ek 12 GB temp directory chhoड़ने aur ek disk bharने ke baad.',
      },
    ],

    interviewQA: [
      {
        q: 'What does `set -euo pipefail` do, and what are its limitations?',
        qHi: '`set -euo pipefail` kya karता hai, aur iski limitations kya hain?',
        a: 'It sets three shell options that make a script fail fast and loudly instead of continuing after errors. `set -e` makes the script exit the moment any command returns a non-zero status, so a failing step stops the script rather than letting subsequent steps run against a broken state. `set -u` makes any reference to an unset variable a fatal error instead of silently expanding to an empty string, which is what prevents an unset path variable from turning a delete or copy into an operation on the wrong location. `set -o pipefail` makes a pipeline report failure if any stage fails, not only if the last stage fails, so a crash in the first command of a pipeline is not hidden by the last command succeeding on truncated input. The limitations are mostly in `set -e`. It does not trigger for a command used as a condition in `if`, `while`, or `until`, or on the left side of `&&` or `||`, which is by design so you can test commands. A command explicitly followed by `|| true` is allowed to fail. A function invoked in a condition context has `set -e` suppressed for its entire body, which surprises people. And `local x=$(cmd)` masks the command\'s exit status because `local` itself succeeds, so you must write `local x; x=$(cmd)` to let a failure propagate. Because of these gaps, `set -e` is a safety net rather than a guarantee, and important commands should still have explicit error handling.',
        aHi: 'Ye teen shell options set karता hai jo ek script ko fail fast aur loudly banаते hain. `set -e` script ko exit karवाता hai jis moment koi command non-zero status return karता hai. `set -u` ek unset variable ke kisi bhi reference ko ek fatal error banаता hai. `set -o pipefail` ek pipeline ko failure report karवाता hai agar koi stage fail hoता hai. Limitations zyaादातर `set -e` mein hain. Ye ek `if`/`while` condition mein, ya `&&`/`||` ke left par trigger nahi hoता. Ek command jo `|| true` se followed hai fail hone ki allowed hai. Ek function jo ek condition context mein invoked hai iske poore body ke liye `set -e` suppressed hai. Aur `local x=$(cmd)` command ka exit status mask karता hai.',
      },
      {
        q: 'What makes a shell script "idempotent" and why does it matter for operations?',
        qHi: 'Ek shell script ko "idempotent" kya banаता hai aur ye operations ke liye kyun matter karता hai?',
        a: 'A script is idempotent when running it more than once produces the same result as running it once: the second and subsequent runs do not error, do not duplicate work, and do not change anything that is already in the desired state. The way to achieve it is to write each step as "ensure this condition holds" rather than "perform this action". Instead of creating a directory, check whether it exists and create it only if not, or use a command like `mkdir -p` that is a no-op when the directory is present. Instead of appending a line to a file, check whether that exact line is already there and append only if it is missing. Instead of creating a user, check whether the user exists first. Instead of a plain symlink, use one that replaces an existing link. This matters for operations because scripts are rarely run exactly once in a clean state. A retry after a partial failure re-runs steps that already succeeded. A scheduler can double-fire. A nervous operator runs the deploy again because they are not sure the first one worked. A configuration-management tool runs its scripts on every convergence cycle by design. If the script is idempotent, all of these are safe; if it is not, a re-run causes errors, duplicated configuration, or corrupted state, and the script cannot be trusted in any automated context.',
        aHi: 'Ek script idempotent hai jab ise ek baar se zyada run karना ek baar run karने jaisा result produce karता hai: doosरा aur subsequent runs error nahi karते, work duplicate nahi karते, aur kुछ nahi badalते jo already desired state mein hai. Ise achieve karने ka tarika har step ko "ensure karो ki ye condition holds karता hai" ke roop mein likhna hai bجaay "ye action perform karो". Ek directory create karने ke bجaay, check karो ki ye exist karती hai. Ek line append karने ke bجaay, check karो ki wo exact line already wahaan hai. Ye operations ke liye matter karता hai kyunki scripts shायad hi exactly ek baar ek clean state mein run kiye jाते hain. Ek retry, ek scheduler double-fire, ek nervous operator, ek config-management tool.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, write the standard 3-line strict-mode header and explain what each of `-e`, `-u`, `-o pipefail` prevents, with a concrete one-line example of a bug each one catches.',
        taskHi: 'Ek comment mein, standard 3-line strict-mode header likho aur samjhाओ har ek kya prevent karता hai.',
        hint: '`#!/usr/bin/env bash` / `set -euo pipefail` / `IFS=$\'\\n\\t\'`. `-e`: `cd /nope; rm -rf build` — without `-e` the `rm` runs in the wrong dir; with it, the failed `cd` stops the script. `-u`: `rm -rf "$DIR/build"` with `DIR` unset → `rm -rf /build`; with `-u` it errors. `-o pipefail`: `dump_db | gzip > b.gz` — if `dump_db` crashes, without pipefail the pipeline is "success" and you ship a truncated backup.',
        hintHi: '`#!/usr/bin/env bash` / `set -euo pipefail` / `IFS=$\'\\n\\t\'`. `-e`: `cd /nope; rm -rf build` — `-e` ke bina `rm` galat dir mein. `-u`: `rm -rf "$DIR/build"` `DIR` unset ke saath → `rm -rf /build`. `-o pipefail`: `dump_db | gzip` — `dump_db` crash par pipeline "success".',
      },
      {
        task: 'Write (in a comment) a safe temp-directory pattern: create it, register cleanup, use it, and explain why `trap ... EXIT` beats `rm` at the end and why `mktemp` beats `/tmp/build.$$`.',
        taskHi: 'Ek comment mein ek safe temp-directory pattern likho aur samjhाओ.',
        hint: '`work="$(mktemp -d)"; trap \'rm -rf "$work"\' EXIT`. `trap EXIT` runs on EVERY exit path — normal, `set -e` error, Ctrl-C, SIGTERM — so an interrupted run still cleans up; a trailing `rm` is skipped on any early exit and leaks the dir. `mktemp` gives a random unpredictable 0700 path; `/tmp/build.$$` is predictable, so another user can pre-create it (or a symlink) → collision or symlink attack.',
        hintHi: '`work="$(mktemp -d)"; trap \'rm -rf "$work"\' EXIT`. `trap EXIT` HAR exit path par runs. `mktemp` ek random unpredictable 0700 path deता hai; `/tmp/build.$$` predictable hai.',
      },
      {
        task: 'In a comment, rewrite these three non-idempotent lines to be idempotent: `mkdir /opt/app/releases`, `echo "export PATH=$PATH:/opt/app/bin" >> ~/.bashrc`, `useradd deployer`.',
        taskHi: 'Ek comment mein, in teen non-idempotent lines ko idempotent banao.',
        hint: '`mkdir -p /opt/app/releases` (no-op if it exists). `grep -qxF \'export PATH=$PATH:/opt/app/bin\' ~/.bashrc || echo \'export PATH=$PATH:/opt/app/bin\' >> ~/.bashrc` (append only if the exact line is absent). `id deployer &>/dev/null || useradd deployer` (create only if the user doesn\'t exist).',
        hintHi: '`mkdir -p /opt/app/releases`. `grep -qxF \'...\' ~/.bashrc || echo \'...\' >> ~/.bashrc`. `id deployer &>/dev/null || useradd deployer`.',
      },
    ],

    keyTakeaways: [
      'STRICT-MODE HEADER on EVERY script: `#!/usr/bin/env bash` / `set -euo pipefail` / `IFS=$\'\\n\\t\'`. `-e` = exit on any command failure (no ploughing on); `-u` = an unset variable is an ERROR not `""` (this is what stops `rm -rf "$DIR"/*` becoming `rm -rf /*`); `-o pipefail` = a pipeline fails if ANY stage fails, not just the last; `IFS=$\'\\n\\t\'` = word-split only on newline/tab.',
      '`set -e` HAS GAPS — know them, don\'t fight them: does NOT trigger in `if`/`while`/`until` conditions or left of `&&`/`||`; `|| true` suppresses it; a function called in a condition context has `-e` disabled for its whole body; `local x=$(cmd)` masks `cmd`\'s exit status (write `local x; x=$(cmd)`). It\'s a safety NET, not a guarantee — still check the commands that matter explicitly.',
      'CLEAN UP WITH `trap \'...\' EXIT` — runs on EVERY exit path (normal, `set -e` error, Ctrl-C, SIGTERM), so an interrupted run still cleans up; a trailing `rm` is skipped on early exit and leaks. TEMP FILES: `mktemp` / `mktemp -d` (random unpredictable 0600/0700 path) — NEVER `/tmp/mylock` or `/tmp/build.$$` (predictable → symlink attack / collision / stuck-lock). LOCKING: `flock` on an fd (kernel auto-releases on exit), not a lock FILE removed by `rm`.',
      'QUOTE EVERY expansion — `"$var"`, `"$@"` (each arg separate; NOT `$*`), `"$(cmd)"`, `"${arr[@]}"`. VALIDATE INPUTS before acting: arg count/shape, enum values in an allowlist, paths exist and are the right type, required tools on `PATH`, running as the right user. Exit codes: `2` = usage error, `127` = missing dependency. GUARD destructive commands: non-empty + absolute + not `/` + is-a-directory, THEN `rm -rf -- "$base"/*`.',
      'BE IDEMPOTENT — running twice = same result as once. Write "ENSURE X" not "create X": `mkdir -p`, `grep -qxF "$line" "$f" || echo "$line" >> "$f"`, `id "$u" &>/dev/null || useradd "$u"`, `ln -sfn`. This is what makes a script safe for a retry, a double-firing scheduler, a nervous operator, or a config-management tool. NEVER: `curl URL | bash` from an unpinned URL, parse `ls`, `[ $x = y ]` (use `[[ ]]`), or pass a secret as a CLI arg (visible in `ps` + shell history) — read it from an env var or a 0600 file. RUN `shellcheck` locally AND as a required CI check — it catches ~90% of shell bugs.',
    ],
    keyTakeawaysHi: [
      'HAR script par STRICT-MODE HEADER: `#!/usr/bin/env bash` / `set -euo pipefail` / `IFS=$\'\\n\\t\'`. `-e` = koi command fail hone par exit; `-u` = ek unset variable ek ERROR hai `""` nahi (ye `rm -rf "$DIR"/*` ko `rm -rf /*` banने se rokта hai); `-o pipefail` = ek pipeline fail hoती hai agar KOI stage fail hoता hai.',
      '`set -e` KE GAPS HAIN: ye `if`/`while` conditions mein ya `&&`/`||` ke left par trigger NAHI hoता; `|| true` ise suppress karता hai; ek condition context mein call kiya gaya function ke poore body ke liye `-e` disabled hai; `local x=$(cmd)` `cmd` ka exit status mask karта hai. Ye ek safety NET hai, guarantee nahi.',
      '`trap \'...\' EXIT` SE CLEANUP — HAR exit path par runs. TEMP FILES: `mktemp` / `mktemp -d` — KABHI `/tmp/mylock` ya `/tmp/build.$$` nahi (predictable → symlink attack). LOCKING: ek fd par `flock`, ek lock FILE nahi jo `rm` se remove hoती hai.',
      'HAR expansion QUOTE karो — `"$var"`, `"$@"` (`$*` nahi), `"$(cmd)"`, `"${arr[@]}"`. Act karने se pehle INPUTS VALIDATE karो. Exit codes: `2` = usage error, `127` = missing dependency. Destructive commands GUARD karो: non-empty + absolute + `/` nahi + is-a-directory.',
      'IDEMPOTENT BANO — do baar chalाना = ek baar jaisा. "ENSURE X" likho "create X" nahi: `mkdir -p`, `grep -qxF ... || echo ... >>`, `id "$u" &>/dev/null || useradd`. KABHI NAHI: unpinned URL se `curl | bash`, `ls` parse, `[ $x = y ]` (`[[ ]]` istemal karो), ya ek secret CLI arg ke roop mein. `shellcheck` locally AUR ek required CI check ke roop mein chalाओ.',
    ],
  },
];
