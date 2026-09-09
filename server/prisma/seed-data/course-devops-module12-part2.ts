import type { CourseLesson } from './course-js-module1';

// DevOps Module 12 — Infrastructure as Code: Terraform & Immutable Infrastructure
// Lessons 4-6 (part 2 of 2). Lessons 1-3 are in course-devops-module12.ts.
//
// VERIFICATION: `scratchpad/verify-bash.mjs 12`, against a real terraform v1.9.8
// with the hashicorp/local + hashicorp/random providers (offline-cached).
//   L4 variables, outputs, modules, for_each vs count — VERIFIED (a real module, count reindex)
//   L5 terraform in CI and managing change safely     — VERIFIED (plan -out / show -json, workspaces)
//   L6 immutable infrastructure & provisioning         — VERIFIED (templatefile, create_before_destroy)

export const DEVOPS_MODULE_12_PART2: CourseLesson[] = [
  {
    slug: 'ops-variables-outputs-modules-and-composition',
    title: 'Variables, Outputs, Modules & Composition',
    titleHi: 'Variables, Outputs, Modules Aur Composition',
    description:
      'How a terraform configuration is parameterised and built from reusable pieces: variables (typed, validated, sensitive) as inputs, outputs as return values, locals as named expressions, and modules as the unit of reuse. And the choice that trips everyone up — for_each versus count — where using count for a set of named things causes needless destroy-and-recreate the day you remove one from the middle.',
    descriptionHi:
      'Ek terraform configuration kaise parameterise hoti hai aur reusable pieces se build hoti hai: variables (typed, validated, sensitive) inputs ke roop mein, outputs return values ke roop mein, locals named expressions ke roop mein, aur modules reuse ki unit ke roop mein. Aur wo choice jo sabko uljhaati hai — for_each versus count — jahaan named cheezon ke ek set ke liye count use karna needless destroy-and-recreate karता hai jis din aap ek ko beech se hataते ho.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 4,

    analogy: {
      en: '**A function, and a filing system for its instances.** A module is a function: it takes inputs (variables), does work (resources), and returns values (outputs); \`locals\` are the local variables inside it. You call it once per environment, passing different inputs. The \`for_each\` versus \`count\` choice is how the function files the things it made. \`count\` files them by position — folder 0, folder 1, folder 2 — so if you throw away folder 1, everything after it shifts down a number and the filing system thinks every one of those changed. \`for_each\` files them by name — the "logs" folder, the "media" folder, the "backups" folder — so removing "media" leaves "logs" and "backups" exactly where they were. Name your things when they have names.',
      hi: '**Ek function, aur iske instances ke liye ek filing system.** Ek module ek function hai: ye inputs leta hai (variables), kaam karता hai (resources), aur values return karता hai (outputs); \`locals\` iske andar local variables hain. Aap ise har environment ke liye ek baar call karते ho, alag inputs pass karके. \`for_each\` versus \`count\` choice ye hai ki function jo cheezen banाता hai unhe kaise file karता hai. \`count\` unhe position se file karता hai — folder 0, folder 1, folder 2 — to agar aap folder 1 phenk दो, uske baad sab kuch ek number neeche shift hota hai aur filing system sochता hai un sab mein se har ek badla. \`for_each\` unhe naam se file karता hai — "logs" folder, "media" folder, "backups" folder — to "media" hatana "logs" aur "backups" ko exactly wahaan chhodता hai jahaan wo the.',
    },

    simple: `**VARIABLE** — a typed input to a configuration or module:
\`\`\`
variable "instance_count" {
  type    = number
  default = 2
  validation {
    condition     = var.instance_count >= 1 && var.instance_count <= 10
    error_message = "instance_count must be 1..10."
  }
}
variable "db_password" { type = string, sensitive = true }   # kept out of CLI output + plan text
\`\`\`
Set via: \`-var 'k=v'\`, a \`*.tfvars\` file (\`-var-file\`), \`terraform.tfvars\` /
\`*.auto.tfvars\` (auto-loaded), or \`TF_VAR_k\` env vars. Reference as \`var.name\`.

**OUTPUT** — a value the configuration returns (and a module exposes to its caller):
\`\`\`
output "app_url" { value = "https://\${aws_lb.main.dns_name}" }
output "db_password" { value = random_password.db.result, sensitive = true }
\`\`\`
\`terraform output\`, \`terraform output -raw name\`, \`terraform output -json\`.

**LOCALS** — named expressions, computed once, DRY up repetition:
\`\`\`
locals {
  name_prefix = "\${var.project}-\${var.env}"
  common_tags = { Project = var.project, Env = var.env, ManagedBy = "terraform" }
}
# use as local.name_prefix, local.common_tags
\`\`\`

**MODULE** — a directory of \`.tf\` files reused as a unit. It has \`variables\`
(inputs), \`resources\`, and \`outputs\`. Call it:
\`\`\`
module "vpc" {
  source  = "./modules/vpc"          # local path, or a registry ref, or a git URL
  version = "5.1.2"                  # for registry modules — pin it
  cidr    = "10.0.0.0/16"
  env     = var.env
}
# module.vpc.<output_name> to use its outputs
\`\`\`
The top-level directory you run terraform in is the **root module**.

**\`for_each\` vs \`count\` — the one to get right:**
\`\`\`
count = 3                 -> addresses  x[0]  x[1]  x[2]   (by POSITION)
for_each = toset([...])   -> addresses  x["logs"] x["media"] ...  (by KEY)
for_each = { a = 1, ... } -> each.key / each.value
\`\`\`
Remove the MIDDLE element of a \`count\` list -> everything after it shifts index ->
terraform destroys + recreates all of them. With \`for_each\`, only the removed key
is destroyed. **Use \`count\` only for "N identical copies" or a simple on/off
(\`count = var.enabled ? 1 : 0\`). Use \`for_each\` for a set of distinct named things.**`,

    simpleHi: `**VARIABLE** — ek configuration ya module ka ek typed input:
\`\`\`
variable "instance_count" {
  type    = number
  default = 2
  validation {
    condition     = var.instance_count >= 1 && var.instance_count <= 10
    error_message = "instance_count must be 1..10."
  }
}
variable "db_password" { type = string, sensitive = true }   # CLI output + plan text se bahar rakha
\`\`\`
Set karo: \`-var 'k=v'\`, ek \`*.tfvars\` file (\`-var-file\`), \`terraform.tfvars\` /
\`*.auto.tfvars\` (auto-loaded), ya \`TF_VAR_k\` env vars. \`var.name\` ke roop mein reference.

**OUTPUT** — ek value jo configuration return karती hai (aur ek module apne caller ko expose karता hai):
\`\`\`
output "app_url" { value = "https://\${aws_lb.main.dns_name}" }
output "db_password" { value = random_password.db.result, sensitive = true }
\`\`\`
\`terraform output\`, \`terraform output -raw name\`, \`terraform output -json\`.

**LOCALS** — named expressions, ek baar computed, repetition DRY karते hain:
\`\`\`
locals {
  name_prefix = "\${var.project}-\${var.env}"
  common_tags = { Project = var.project, Env = var.env, ManagedBy = "terraform" }
}
# local.name_prefix, local.common_tags ke roop mein use karo
\`\`\`

**MODULE** — \`.tf\` files ki ek directory ek unit ke roop mein reused. Isme \`variables\`
(inputs), \`resources\`, aur \`outputs\` hain. Ise call karo:
\`\`\`
module "vpc" {
  source  = "./modules/vpc"          # local path, ya ek registry ref, ya ek git URL
  version = "5.1.2"                  # registry modules ke liye — ise pin karo
  cidr    = "10.0.0.0/16"
  env     = var.env
}
# module.vpc.<output_name> iske outputs use karne ke liye
\`\`\`
Jis top-level directory mein aap terraform chalाते ho wo **root module** hai.

**\`for_each\` vs \`count\` — sahi karne wala:**
\`\`\`
count = 3                 -> addresses  x[0]  x[1]  x[2]   (POSITION se)
for_each = toset([...])   -> addresses  x["logs"] x["media"] ...  (KEY se)
for_each = { a = 1, ... } -> each.key / each.value
\`\`\`
Ek \`count\` list ka MIDDLE element hatao -> uske baad sab kuch index shift hota hai ->
terraform un sab ko destroy + recreate karता hai. \`for_each\` ke saath, sirf hataya
gaya key destroy hota hai. **\`count\` sirf "N identical copies" ya ek simple on/off
(\`count = var.enabled ? 1 : 0\`) ke liye use karo. \`for_each\` distinct named cheezon
ke ek set ke liye use karo.**`,

    content: `## Variables — inputs

A \`variable\` block declares an input. Give it a \`type\` (\`string\`, \`number\`, \`bool\`, \`list(...)\`, \`map(...)\`, \`object({...})\`, \`set(...)\`) so terraform rejects wrong-shaped input early. Give it a \`default\` to make it optional, or omit the default to make it required. Add a \`validation\` block with a \`condition\` and an \`error_message\` to enforce rules terraform cannot infer from the type — a CIDR that must be /16 or larger, an environment name from a fixed set, a port in range. Mark it \`sensitive = true\` to keep its value out of CLI output and plan text (it is still in state — Lesson 3).

Values are supplied, in increasing precedence: a \`default\`; a \`terraform.tfvars\` or \`*.auto.tfvars\` file (loaded automatically); a \`-var-file=prod.tfvars\` flag; a \`-var 'key=value'\` flag; and \`TF_VAR_key\` environment variables. In CI the common pattern is a checked-in \`prod.tfvars\` for non-secret settings plus \`TF_VAR_\` env vars (from the CI secret store) for secrets.

## Outputs — return values

An \`output\` block exposes a value: after \`apply\`, \`terraform output\` prints all of them; \`terraform output -raw name\` prints one unquoted (for shell use); \`terraform output -json\` prints them machine-readably. Outputs are also how a **module returns values to its caller** — the parent references \`module.NAME.OUTPUT\`. Mark an output \`sensitive = true\` if it carries a secret, so it shows as \`<sensitive>\` rather than printing.

## Locals — named expressions

\`locals\` are computed values you name once and reuse. They are not inputs (you cannot override them) and not outputs (callers cannot see them) — they exist to remove repetition and give a meaningful name to an expression: \`local.name_prefix\` instead of \`"\${var.project}-\${var.env}"\` written fifteen times, \`local.common_tags\` merged into every resource\'s \`tags\`. A change to a local propagates everywhere it is used.

## Modules — the unit of reuse

A **module** is just a directory containing \`.tf\` files. The directory you run \`terraform\` in is the **root module**; any module it calls with a \`module\` block is a **child module**. A well-formed module has \`variables.tf\` (its inputs), \`main.tf\` (its resources), and \`outputs.tf\` (what it returns) — though the file names are convention, not rule.

The \`source\` argument says where the module is: a local path (\`./modules/vpc\`), a Terraform Registry reference (\`terraform-aws-modules/vpc/aws\` — pin \`version\`), or a git URL (\`git::https://github.com/org/repo//modules/vpc?ref=v1.4.0\`). Registry and git modules are versioned; **always pin the version**, because a module is code and an unpinned module can change under you between applies.

Modules compose: a root module calls a \`network\` module and an \`app\` module, passing \`module.network.private_subnet_ids\` into the \`app\` module. Keep modules focused — a module per logical component (a VPC, a service, a database) rather than one giant module or a module per single resource.

## for_each versus count

Both create multiple instances of a resource or module block. The difference is how instances are **addressed in state**, and it matters enormously.

\`count = N\` creates instances addressed by **integer position**: \`aws_instance.web[0]\`, \`aws_instance.web[1]\`, \`aws_instance.web[2]\`. The index is the position in the list you are iterating. If you remove an element from the **middle** of that list, every element after it shifts down one index — \`web[2]\` becomes \`web[1]\` — and because terraform keys state by that index, it sees \`web[1]\` as "the resource whose config completely changed" and \`web[2]\` as "a resource to destroy". You get a cascade of destroy-and-recreate for resources that did not actually change, just because their neighbour was removed.

\`for_each\` over a set or map creates instances addressed by **key**: \`aws_s3_bucket.b["logs"]\`, \`aws_s3_bucket.b["media"]\`, \`aws_s3_bucket.b["backups"]\`. Removing \`"media"\` from the set destroys exactly \`aws_s3_bucket.b["media"]\` and leaves the other two untouched, because their keys — and therefore their state addresses — are unchanged. Inside the block you reference \`each.key\` and \`each.value\`.

The rule: use \`count\` only when the instances are genuinely interchangeable and identified by nothing but a number ("give me 3 identical workers"), or for a simple conditional (\`count = var.create_bucket ? 1 : 0\`). Use \`for_each\` whenever the instances have distinct identities — names, regions, config maps — which is most of the time. Converting a \`count\` resource to \`for_each\` later requires \`terraform state mv\` for each instance to avoid the recreate, so choosing \`for_each\` up front is worth it.`,

    contentHi: `## Variables — inputs

Ek \`variable\` block ek input declare karता hai. Ise ek \`type\` do (\`string\`, \`number\`, \`bool\`, \`list(...)\`, \`map(...)\`, \`object({...})\`, \`set(...)\`) taaki terraform wrong-shaped input jaldi reject kare. Ise ek \`default\` do ise optional banane ke liye, ya default omit karo ise required banane ke liye. Ek \`validation\` block add karo rules enforce karne ke liye jo terraform type se infer nahi kar sakta. Ise \`sensitive = true\` mark karo iski value ko CLI output aur plan text se bahar rakhne ke liye (ye abhi bhi state mein hai — Lesson 3).

Values supply hoti hain, increasing precedence mein: ek \`default\`; ek \`terraform.tfvars\` ya \`*.auto.tfvars\` file (automatically loaded); ek \`-var-file=prod.tfvars\` flag; ek \`-var 'key=value'\` flag; aur \`TF_VAR_key\` environment variables. CI mein common pattern ek checked-in \`prod.tfvars\` non-secret settings ke liye plus \`TF_VAR_\` env vars secrets ke liye hai.

## Outputs — return values

Ek \`output\` block ek value expose karता hai: \`apply\` ke baad, \`terraform output\` unhe sab print karता hai; \`terraform output -raw name\` ek ko unquoted print karता hai; \`terraform output -json\` unhe machine-readably print karता hai. Outputs bhi wo hain jaise ek **module apne caller ko values return karता hai** — parent \`module.NAME.OUTPUT\` reference karता hai. Ek output ko \`sensitive = true\` mark karo agar ye ek secret carry karता hai.

## Locals — named expressions

\`locals\` computed values hain jo aap ek baar name karते ho aur reuse karते ho. Wo inputs nahi hain (aap unhe override nahi kar sakte) aur outputs nahi (callers unhe nahi dekh sakte) — wo repetition hatane aur ek expression ko ek meaningful naam dene ke liye exist karते hain.

## Modules — reuse ki unit

Ek **module** bas ek directory hai jismें \`.tf\` files hain. Jis directory mein aap \`terraform\` chalाते ho wo **root module** hai; koi bhi module jise ye ek \`module\` block se call karता hai ek **child module** hai. Ek well-formed module mein \`variables.tf\` (iske inputs), \`main.tf\` (iske resources), aur \`outputs.tf\` (jo ye return karता hai) hote hain.

\`source\` argument batata hai module kahaan hai: ek local path (\`./modules/vpc\`), ek Terraform Registry reference (\`version\` pin karo), ya ek git URL. Registry aur git modules versioned hain; **hamesha version pin karo**, kyunki ek module code hai.

Modules compose karते hain: ek root module ek \`network\` module aur ek \`app\` module call karता hai, \`module.network.private_subnet_ids\` ko \`app\` module mein pass karता hua. Modules ko focused rakho — ek module per logical component.

## for_each versus count

Dono ek resource ya module block ke multiple instances banाते hain. Difference ye hai ki instances **state mein kaise addressed** hote hain, aur ye bahut matter karता hai.

\`count = N\` **integer position** se addressed instances banाता hai: \`aws_instance.web[0]\`, \`web[1]\`, \`web[2]\`. Agar aap us list ke **middle** se ek element hatao, uske baad har element ek index neeche shift hota hai — \`web[2]\` \`web[1]\` ban jaता hai — aur kyunki terraform state ko us index se key karता hai, ye \`web[1]\` ko "wo resource jiska config poori tarah badla" ke roop mein dekhता hai. Aapko destroy-and-recreate ka ek cascade milता hai resources ke liye jo actually nahi badle.

\`for_each\` ek set ya map par **key** se addressed instances banाता hai: \`aws_s3_bucket.b["logs"]\`, \`b["media"]\`, \`b["backups"]\`. Set se \`"media"\` hatana exactly \`b["media"]\` destroy karता hai aur doosre do ko untouched chhodता hai. Block ke andar aap \`each.key\` aur \`each.value\` reference karते ho.

Rule: \`count\` sirf tab use karo jab instances genuinely interchangeable hain, ya ek simple conditional ke liye (\`count = var.create_bucket ? 1 : 0\`). \`for_each\` tab use karo jab bhi instances ki distinct identities hain — jo zyadaatar samay hai.`,

    examples: [
      {
        title: 'A module called with for_each: one definition, three instances, typed inputs, outputs',
        titleHi: 'Ek module for_each ke saath call kiya: ek definition, teen instances, typed inputs, outputs',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

# --- a reusable module: modules/appfile/ ---
mkdir -p modules/appfile
cat > modules/appfile/variables.tf <<'EOF'
variable "name"     { type = string }
variable "replicas" {
  type    = number
  default = 1
  validation {
    condition     = var.replicas >= 1 && var.replicas <= 10
    error_message = "replicas must be between 1 and 10."
  }
}
EOF
cat > modules/appfile/main.tf <<'EOF'
terraform {
  required_providers { local = { source = "hashicorp/local", version = "2.9.0" } }
}
resource "local_file" "manifest" {
  content  = "app=\${var.name}\\nreplicas=\${var.replicas}\\n"
  filename = "\${path.root}/out/\${var.name}.conf"
}
EOF
cat > modules/appfile/outputs.tf <<'EOF'
output "path" { value = local_file.manifest.filename }
EOF

# --- root: call the module once per entry in a map, with for_each ---
cat > main.tf <<'EOF'
terraform {
  required_providers { local = { source = "hashicorp/local", version = "2.9.0" } }
}
locals {
  services = {
    api    = 3
    worker = 2
    cron   = 1
  }
}
module "svc" {
  source   = "./modules/appfile"
  for_each = local.services
  name     = each.key
  replicas = each.value
}
output "written" {
  value = { for k, m in module.svc : k => m.path }
}
EOF

terraform init -no-color -input=false >/dev/null
out=\$(terraform apply -no-color -auto-approve 2>&1)
echo "--- one module block, three instances (for_each over the map) ---"
echo "\$out" | grep -E 'will be created' | sort
echo "\$out" | grep -E '^Apply complete'
echo
echo "--- outputs (keys are the map keys, not 0/1/2) ---"
terraform output -no-color
echo
echo "--- files the module produced ---"
for f in out/*.conf; do echo "\$f:"; sed 's/^/    /' "\$f"; done`,
        output: `--- one module block, three instances (for_each over the map) ---
  # module.svc["api"].local_file.manifest will be created
  # module.svc["cron"].local_file.manifest will be created
  # module.svc["worker"].local_file.manifest will be created
Apply complete! Resources: 3 added, 0 changed, 0 destroyed.

--- outputs (keys are the map keys, not 0/1/2) ---
written = {
  "api" = "./out/api.conf"
  "cron" = "./out/cron.conf"
  "worker" = "./out/worker.conf"
}

--- files the module produced ---
out/api.conf:
    app=api
    replicas=3
out/cron.conf:
    app=cron
    replicas=1
out/worker.conf:
    app=worker
    replicas=2
`,
        explain: 'A module lives in modules/appfile/ with the conventional three files: variables.tf declares its inputs (a required name and an optional replicas with a validation rule), main.tf has the one resource it manages, outputs.tf returns the path it wrote. The root module defines a map of three services to replica counts as a local, then calls the module once with for_each = local.services — so there is a single module block but three instances, addressed module.svc["api"], module.svc["worker"], module.svc["cron"] by their map keys. Inside the module, each.key and each.value are the service name and its replica count. The root output uses a for expression to collect each instance\'s path output into a map. The apply creates three files, the output is keyed by name rather than by position, and each rendered file has the right values. This is the normal shape of a real terraform codebase: a handful of focused modules, each parameterised by variables and exposing outputs, invoked with for_each over a data structure that describes what should exist. Removing "worker" from the local map would destroy only module.svc["worker"] and its file, leaving "api" and "cron" untouched.',
        explainHi: 'Ek module modules/appfile/ mein rehta hai conventional teen files ke saath: variables.tf iske inputs declare karता hai (ek required name aur ek optional replicas ek validation rule ke saath), main.tf mein wo ek resource hai jo ye manage karता hai, outputs.tf jo path likha wo return karता hai. Root module teen services ka ek map replica counts ko ek local ke roop mein define karता hai, phir module ko ek baar for_each = local.services ke saath call karता hai — to ek single module block hai par teen instances, module.svc["api"], module.svc["worker"], module.svc["cron"] unke map keys se addressed. Module ke andar, each.key aur each.value service naam aur iska replica count hain. Apply teen files banाता hai, output naam se keyed hai position se nahi. Ye ek real terraform codebase ka normal shape hai. Local map se "worker" hatana sirf module.svc["worker"] aur iski file destroy karega.',
      },
      {
        title: 'count keys by position, for_each keys by name: what happens when you remove the middle one',
        titleHi: 'count position se key karता hai, for_each naam se: jab aap beech wala hatate ho tab kya hota hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

mk() {  # write main.tf using either count or for_each over the SAME 3 names
cat > main.tf <<EOF
terraform {
  required_providers { local = { source = "hashicorp/local", version = "2.9.0" } }
}
variable "buckets" { default = ["logs", "media", "backups"] }
EOF
if [ "\$1" = count ]; then
cat >> main.tf <<'EOF'
resource "local_file" "b" {
  count    = length(var.buckets)
  content  = "bucket \${var.buckets[count.index]}\\n"
  filename = "\${path.module}/\${var.buckets[count.index]}.txt"
}
EOF
else
cat >> main.tf <<'EOF'
resource "local_file" "b" {
  for_each = toset(var.buckets)
  content  = "bucket \${each.key}\\n"
  filename = "\${path.module}/\${each.key}.txt"
}
EOF
fi
}

echo "############ with count ############"
mk count
terraform init -no-color -input=false >/dev/null
terraform apply -no-color -auto-approve >/dev/null
echo "addresses in state:"; terraform state list
echo
echo "--- now remove the MIDDLE bucket ('media') from the list ---"
sed -i 's/\\["logs", "media", "backups"\\]/["logs", "backups"]/' main.tf
terraform plan -no-color 2>&1 | grep -E 'will be|must be|^Plan:'
echo '  ^ count reindexed: "backups" moved from [2] to [1], so terraform wants to'
echo '    DESTROY + RECREATE it just because its neighbour was deleted.'

echo
echo "############ with for_each ############"
rm -f ./*.txt
mk for_each
terraform init -no-color -input=false >/dev/null
terraform apply -no-color -auto-approve >/dev/null
echo "addresses in state:"; terraform state list
echo
echo "--- remove the same middle bucket ('media') ---"
sed -i 's/\\["logs", "media", "backups"\\]/["logs", "backups"]/' main.tf
terraform plan -no-color 2>&1 | grep -E 'will be|must be|^Plan:'
echo '  ^ for_each keys by NAME: only local_file.b["media"] is destroyed. "backups" is untouched.'`,
        output: `############ with count ############
addresses in state:
local_file.b[0]
local_file.b[1]
local_file.b[2]

--- now remove the MIDDLE bucket ('media') from the list ---
  # local_file.b[1] must be replaced
  # local_file.b[2] will be destroyed
Plan: 1 to add, 0 to change, 2 to destroy.
  ^ count reindexed: "backups" moved from [2] to [1], so terraform wants to
    DESTROY + RECREATE it just because its neighbour was deleted.

############ with for_each ############
addresses in state:
local_file.b["backups"]
local_file.b["logs"]
local_file.b["media"]

--- remove the same middle bucket ('media') ---
  # local_file.b["media"] will be destroyed
Plan: 0 to add, 0 to change, 1 to destroy.
  ^ for_each keys by NAME: only local_file.b["media"] is destroyed. "backups" is untouched.`,
        explain: 'The same three named things — buckets called logs, media and backups — are created two ways. With count, the instances are addressed by list position: b[0], b[1], b[2]. Removing "media" (the middle entry) makes the list ["logs", "backups"], so "backups" moves from index 2 to index 1. Terraform keys state by index, so it now sees b[1] as a resource whose filename and content both changed (from media to backups) and must be replaced, and b[2] as a resource that no longer exists and must be destroyed. Two resources are disrupted and one recreated, none of which reflect a real change to "logs" or "backups" — only "media" was actually removed. With for_each over the set, the instances are addressed by key: b["logs"], b["media"], b["backups"]. Removing "media" changes nothing about the other two keys, so the plan is exactly one destroy: b["media"]. This is why the guidance is to use for_each for anything with a stable identity and reserve count for truly positional cases. On real infrastructure the count version is not a cosmetic problem — it is an unplanned destroy-and-recreate of live resources.',
        explainHi: 'Wahi teen named cheezen — buckets jinhe logs, media aur backups kehte hain — do tarah se banaye jaate hain. count ke saath, instances list position se addressed hain: b[0], b[1], b[2]. "media" (middle entry) hatana list ko ["logs", "backups"] banाता hai, to "backups" index 2 se index 1 par move hota hai. Terraform state ko index se key karता hai, to ab ye b[1] ko ek resource ke roop mein dekhता hai jiska filename aur content dono badle aur ise replace hona chahiye, aur b[2] ko ek resource ke roop mein jo ab exist nahi karता. Do resources disrupt hote hain aur ek recreate hota hai, jinme se koi "logs" ya "backups" mein ek real change reflect nahi karता. for_each ke saath set par, instances key se addressed hain. "media" hatana doosre do keys ke baare mein kuch nahi badalता, to plan exactly ek destroy hai: b["media"]. Real infrastructure par count version cosmetic problem nahi hai — ye live resources ka ek unplanned destroy-and-recreate hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# using count for a set of distinct, named resources
variable "regions" { default = ["us-east-1", "eu-west-1", "ap-south-1"] }
resource "aws_sns_topic" "alerts" {
  count = length(var.regions)
  name  = "alerts-\${var.regions[count.index]}"
}
# six months later you close the eu-west-1 region. you edit the list to
# ["us-east-1", "ap-south-1"]. plan:
#   aws_sns_topic.alerts[1]  must be replaced   (eu -> ap: name changed)
#   aws_sns_topic.alerts[2]  will be destroyed
# the ap-south-1 topic - which you did NOT touch - is destroyed and recreated.
# every subscription on it is gone.`,
        right: `# for_each over the set - each instance is keyed by its own name:
resource "aws_sns_topic" "alerts" {
  for_each = toset(["us-east-1", "eu-west-1", "ap-south-1"])
  name     = "alerts-\${each.key}"
}
# close eu-west-1 -> remove it from the set -> plan:
#   aws_sns_topic.alerts["eu-west-1"]  will be destroyed
# that's it. us-east-1 and ap-south-1 are untouched.
#
# count is for: N interchangeable copies (count = var.worker_count), or
# on/off (count = var.enable_alerts ? 1 : 0). nothing with a name.`,
        why: 'The rule of thumb is that \`count\` addresses instances by their position in a list and \`for_each\` addresses them by a stable key, and that difference decides what happens when the collection changes. With \`count\`, removing any element except the last renumbers every element after it, and because terraform stores state keyed by the index, a renumbered element looks like a resource whose entire configuration changed — so terraform replaces it — and the now-missing last index looks like a resource to destroy. For distinct named resources (one per region, one per environment, one per team) this means removing one from the middle triggers a destroy-and-recreate of unrelated resources, taking their real-world state — subscriptions, data, attached policies — with them. \`for_each\` over a set or map keys each instance by its own identity, so removing one entry affects exactly that entry and nothing else. Reserve \`count\` for the two cases where position genuinely is the only identifier: a number of interchangeable copies (\`count = var.replica_count\`), and a boolean toggle (\`count = var.enabled ? 1 : 0\`). Everything with a name gets \`for_each\`.',
        whyHi: 'Rule of thumb ye hai ki \`count\` instances ko unki list mein position se address karता hai aur \`for_each\` unhe ek stable key se address karता hai, aur wo difference decide karता hai jab collection badalती hai tab kya hota hai. \`count\` ke saath, aakhri ke alawa koi bhi element hatana uske baad har element ko renumber karता hai, aur kyunki terraform state ko index se keyed store karता hai, ek renumbered element ek resource jaisा dikhता hai jiska poora configuration badla — to terraform ise replace karता hai. Distinct named resources ke liye iska matlab beech se ek hatana unrelated resources ka destroy-and-recreate trigger karता hai, unki real-world state — subscriptions, data, attached policies — ke saath le jaता hua. \`for_each\` set ya map par har instance ko iski apni identity se key karता hai. \`count\` un do cases ke liye reserve karo jahaan position genuinely ekmatra identifier hai.',
      },
      {
        wrong: `# an unpinned module source - the module changes under you
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"       # no version!
  cidr   = "10.0.0.0/16"
}
# monday: 'terraform init' pulls v5.1.2, plan is clean.
# thursday: someone else runs 'terraform init' -> pulls v5.8.0 (released wednesday).
# v5.8.0 changed a default subnet tag and split a resource. their plan shows
# 14 changes and 2 replacements they never made. is that safe to apply? nobody knows.`,
        right: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.1.0"                # 5.1.x only; upgrades are a deliberate PR
  cidr    = "10.0.0.0/16"
}
# for a git source, pin a ref (a tag or a commit SHA):
module "internal" {
  source = "git::https://github.com/acme/tf-modules.git//vpc?ref=v1.4.0"
}
# upgrading: bump the version in a PR, run 'terraform init -upgrade', review the
# plan the new version produces, merge. never a surprise.`,
        why: 'A module is code, fetched from somewhere, and like any dependency it changes over time — new defaults, renamed variables, resources split or merged, occasionally bugs. Terraform Registry and git modules are versioned precisely so you can control which version you use. An unpinned \`source\` means \`terraform init\` resolves to whatever the latest version is *at the moment init runs*, which differs between the developer who set it up last month and the colleague who inits today and the CI runner that inits on every pipeline. They end up planning against different module versions, and a plan full of changes that "appeared on their own" is impossible to review — you cannot tell your change from the module upgrade\'s change. Pinning \`version = "~> 5.1.0"\` for a registry module, or \`?ref=v1.4.0\` for a git module, makes the version part of your committed configuration. Upgrading is then an explicit act: bump the constraint in a pull request, run \`terraform init -upgrade\`, review exactly what the new module version changes in the plan, and merge. The provider lock file (Lesson 2) does the same job for providers; module versions you pin in the source yourself.',
        whyHi: 'Ek module code hai, kahin se fetched, aur kisi bhi dependency ki tarah ye samay ke saath badalता hai — naye defaults, renamed variables, resources split ya merged, kabhi kabhi bugs. Terraform Registry aur git modules versioned hain precisely taaki aap control kar sako aap kaun sा version use karते ho. Ek unpinned \`source\` ka matlab \`terraform init\` jo bhi latest version hai *us pal jab init chalता hai* us par resolve karता hai, jo us developer jisne ise pichle mahine set up kiya aur us colleague jo aaj init karता hai aur CI runner ke beech alag hai. Wo alag module versions ke against plan karते hain. \`version = "~> 5.1.0"\` pin karna version ko aapki committed configuration ka part banाता hai. Upgrading phir ek explicit act hai: PR mein constraint bump karo, \`terraform init -upgrade\` chalao, review karo, merge karo.',
      },
      {
        wrong: `# putting a secret in a plain variable with a default, in a committed file
# variables.tf:
variable "db_password" {
  type    = string
  default = "S3cr3t-pgpw-2024"        # committed to git. forever. in history.
}
# also: not marking it sensitive, so it prints in every plan:
#   ~ password = "S3cr3t-pgpw-2024" -> "S3cr3t-pgpw-2024"    (in the CI logs)`,
        right: `# declare it, don't default it, mark it sensitive:
variable "db_password" {
  type      = string
  sensitive = true                    # kept out of CLI output + plan text
}
# supply it from OUTSIDE the repo:
#   - CI:   TF_VAR_db_password  from the CI secret store (env var)
#   - local: a gitignored  secrets.auto.tfvars  (or better, don't - use a
#            'data' source that reads AWS Secrets Manager / Vault at plan time)
# BEST: don't pass the secret at all - have terraform generate it
#   (random_password) and write it straight to a secret manager resource,
#   so it never transits a variable or a human.
# (it is still in STATE either way - Lesson 3 - so the backend must be encrypted.)`,
        why: 'A \`variable\` with a \`default\` bakes that value into the configuration files, so a secret used as a default is committed to version control and lives in the git history permanently, retrievable by anyone who ever clones the repository even after you "remove" it. Not marking a secret variable \`sensitive\` compounds it: the value then appears in plan output and \`apply\` logs, which in CI means it is printed into build logs that are often widely readable and retained for months. The correct handling has three parts. Declare the variable but give it no default, so it must be supplied explicitly. Mark it \`sensitive = true\` so terraform keeps it out of console output and plan text. And supply the actual value from outside the repository — a \`TF_VAR_\` environment variable sourced from the CI secret store, or a \`data\` source that reads the secret from AWS Secrets Manager, Azure Key Vault or HashiCorp Vault at plan time so it is never written down at all. The strongest pattern is to not pass the secret through terraform as an input: have terraform generate it with \`random_password\` and write it directly into a secret-manager resource. In every case the value still lands in state, so the state backend must be encrypted and access-controlled regardless.',
        whyHi: 'Ek \`variable\` ek \`default\` ke saath us value ko configuration files mein bake karता hai, to ek secret jo default ke roop mein use kiya version control mein commit hota hai aur git history mein permanently rehता hai, kisi bhi ke dwara retrievable jo kabhi repository clone karता hai "remove" karne ke baad bhi. Ek secret variable ko \`sensitive\` mark na karna ise compound karता hai: value phir plan output aur \`apply\` logs mein appear karती hai, jo CI mein build logs mein print hoti hai jo aksar widely readable hain. Correct handling ke teen parts hain. Variable declare karo par ise koi default mat do. Ise \`sensitive = true\` mark karo. Aur actual value repository ke bahar se supply karo — ek \`TF_VAR_\` env var, ya ek \`data\` source jo secret ko Secrets Manager / Key Vault / Vault se plan time par read karता hai. Strongest pattern secret ko ek input ke roop mein terraform ke through pass na karna hai. Har case mein value abhi bhi state mein land karती hai.',
      },
    ],

    realWorld: [
      {
        en: '**A \`count\`-based rename that recreated 40 IAM roles** — roles were \`for count.index in team_list\`. Alphabetising the team list shifted every index; the plan was "39 to replace". Applied in a hurry, it briefly deleted roles that running workloads were using. Rewritten as \`for_each = toset(team_list)\`; reordering the list is now a no-op.',
        hi: '**Ek \`count\`-based rename jisne 40 IAM roles recreate kiye** — roles \`for count.index in team_list\` the. Team list alphabetise karne se har index shift hua; plan "39 to replace" tha. Jaldi mein apply, isne briefly roles delete kiye jo running workloads use kar rahe the. \`for_each = toset(team_list)\` ke roop mein rewrite kiya.',
      },
      {
        en: '**Unpinned community module, silent breaking change** — \`terraform-aws-modules/eks\` without \`version\`. A CI apply picked up a new major that changed the node-group resource address; it planned to destroy and recreate the entire node group. Caught in review by luck. Now every module has \`version = "~> X.Y"\` and a Renovate PR for bumps.',
        hi: '**Unpinned community module, silent breaking change** — \`terraform-aws-modules/eks\` bina \`version\` ke. Ek CI apply ne ek naya major pick kiya jisne node-group resource address badla; isne poora node group destroy aur recreate karne ka plan kiya. Luck se review mein caught. Ab har module mein \`version = "~> X.Y"\` hai.',
      },
      {
        en: '**A password default in \`variables.tf\`** — a staging DB password shipped as a variable default, committed. It was the same password reused in prod. Found by a secret scanner 8 months later, in history. Rotated everywhere; variable changed to \`sensitive\` with no default, value moved to \`TF_VAR_\` in the CI secret store.',
        hi: '**\`variables.tf\` mein ek password default** — ek staging DB password ek variable default ke roop mein shipped, committed. Ye wahi password tha jo prod mein reused. 8 mahine baad ek secret scanner dwara found, history mein. Har jagah rotate kiya; variable \`sensitive\` mein badla bina default ke.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain variables, outputs, locals and modules, and how a module returns values to its caller.',
        qHi: 'Variables, outputs, locals aur modules samjhao, aur ek module apne caller ko values kaise return karता hai.',
        a: 'A variable is a typed input to a configuration or module: it has a type so terraform rejects wrong-shaped input, an optional default (omit it to make the variable required), an optional validation block for rules the type cannot express, and a sensitive flag to keep the value out of CLI and plan output. Values come, in increasing precedence, from the default, auto-loaded tfvars files, a -var-file flag, a -var flag, and TF_VAR_ environment variables. An output exposes a value after apply — terraform output prints them — and is also how a module hands values back to whoever called it. Locals are named expressions computed once and reused within a configuration; they are neither inputs nor outputs, they exist to remove repetition and name an expression meaningfully. A module is a directory of .tf files reused as a unit: it declares variables as its interface, contains resources, and defines outputs as its return values. The directory you run terraform in is the root module; a module it calls with a module block is a child. The caller passes inputs as arguments in the module block and reads results as module.NAME.OUTPUT. Modules compose — a root module wires a network module\'s subnet-id output into an app module\'s input — and should be scoped to a logical component, not one giant module and not one per resource.',
        aHi: 'Ek variable ek configuration ya module ka ek typed input hai: iska ek type hai taaki terraform wrong-shaped input reject kare, ek optional default (ise omit karo variable ko required banane ke liye), ek optional validation block, aur ek sensitive flag. Values aati hain, increasing precedence mein, default se, auto-loaded tfvars files se, ek -var-file flag se, ek -var flag se, aur TF_VAR_ env vars se. Ek output apply ke baad ek value expose karता hai — aur ye bhi wo hai jaise ek module values wapas deता hai jisne bhi ise call kiya. Locals named expressions hain ek baar computed aur ek configuration ke andar reused. Ek module \`.tf\` files ki ek directory hai ek unit ke roop mein reused: ye variables ko apne interface ke roop mein declare karता hai, resources contain karता hai, aur outputs ko apni return values ke roop mein define karता hai. Caller inputs ko module block mein arguments ke roop mein pass karता hai aur results ko module.NAME.OUTPUT ke roop mein read karता hai.',
      },
      {
        q: 'When should you use for_each versus count, and what specifically goes wrong with count?',
        qHi: 'Aapko for_each versus count kab use karna chahiye, aur count ke saath specifically kya galat hota hai?',
        a: 'Both create multiple instances of a resource or module block; the difference is how instances are addressed in state. count = N addresses them by integer position — resource[0], resource[1], resource[2] — where the index is the position in the collection being iterated. for_each over a set or map addresses them by key — resource["logs"], resource["media"] — and exposes each.key and each.value. The problem with count is what happens when the collection changes in the middle. If you remove an element that is not the last one, every element after it shifts down an index. Terraform keys state by that index, so a shifted element now looks like a resource whose entire configuration changed and gets replaced, and the vanished final index looks like a resource to destroy. For distinct named resources — one per region, per environment, per team — removing one from the middle triggers destroy-and-recreate of unrelated resources, taking their real-world state with them: subscriptions, attached policies, data. With for_each, each instance is keyed by its own identity, so removing one entry affects exactly that entry. The rule: use count only for a number of genuinely interchangeable copies (count = var.replica_count) or a boolean toggle (count = var.enabled ? 1 : 0). Use for_each for anything with a name or stable identity, which is most cases. Converting count to for_each later needs a terraform state mv per instance to avoid the recreate.',
        aHi: 'Dono ek resource ya module block ke multiple instances banाते hain; difference ye hai ki instances state mein kaise addressed hote hain. count = N unhe integer position se address karता hai — resource[0], resource[1] — jahaan index iterate ho rahi collection mein position hai. for_each ek set ya map par unhe key se address karता hai — resource["logs"] — aur each.key aur each.value expose karता hai. count ke saath problem ye hai ki jab collection beech mein badalती hai tab kya hota hai. Agar aap ek element hatao jo aakhri nahi hai, uske baad har element ek index neeche shift hota hai. Terraform state ko us index se key karता hai, to ek shifted element ab ek resource jaisा dikhता hai jiska poora configuration badla aur replace hota hai. Distinct named resources ke liye, beech se ek hatana unrelated resources ka destroy-and-recreate trigger karता hai. for_each ke saath, har instance iski apni identity se keyed hai. Rule: count sirf genuinely interchangeable copies ya ek boolean toggle ke liye use karo.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, describe variables (type, default, validation, sensitive), how values are supplied and their precedence, and what outputs and locals are for.',
        taskHi: 'Ek comment mein, variables describe karo (type, default, validation, sensitive), values kaise supply hoti hain.',
        hint: 'VARIABLE = a typed input. `type` (string/number/bool/list/map/object/set) → terraform rejects wrong-shaped input early. `default` present → optional; absent → REQUIRED. `validation { condition, error_message }` → enforce rules the type cannot express (a CIDR ≥ /16, an env name from a fixed set, a port in range). `sensitive = true` → value kept out of CLI output + plan text (STILL in state — Lesson 3). Reference as `var.name`. VALUE SOURCES, increasing precedence: (1) the `default`; (2) `terraform.tfvars` / `*.auto.tfvars` (auto-loaded); (3) `-var-file=prod.tfvars`; (4) `-var k=v`; (5) `TF_VAR_k` env vars. CI pattern: a checked-in `prod.tfvars` for non-secret settings + `TF_VAR_` env vars (from the CI secret store) for secrets. OUTPUT = a value the config returns AND how a module hands values to its caller (`module.NAME.OUTPUT`). `terraform output` / `output -raw name` (unquoted, for shell) / `output -json`. Mark `sensitive = true` for secrets → shows `<sensitive>`. LOCALS = named expressions computed once, reused within the config — NOT inputs (cannot override) and NOT outputs (callers cannot see). They exist to DRY repetition and name an expression: `local.name_prefix` instead of `"${var.project}-${var.env}"` fifteen times; `local.common_tags` merged into every resource.',
        hintHi: 'VARIABLE = ek typed input. `type` → terraform wrong-shaped input jaldi reject karta hai. `default` present → optional; absent → REQUIRED. `validation { condition, error_message }` → rules enforce karo jo type express nahi kar sakta. `sensitive = true` → value CLI output + plan text se bahar (ABHI BHI state mein). VALUE SOURCES, increasing precedence: (1) `default`; (2) `terraform.tfvars` / `*.auto.tfvars`; (3) `-var-file`; (4) `-var k=v`; (5) `TF_VAR_k` env vars. OUTPUT = ek value jo config return karti hai AUR jaise ek module values apne caller ko deta hai. LOCALS = named expressions ek baar computed, config ke andar reused — NA inputs NA outputs. Repetition DRY karne aur ek expression ko naam dene ke liye.',
      },
      {
        task: 'In a comment, explain what a module is, the conventional file layout, the three kinds of `source`, and why registry/git module versions must be pinned.',
        taskHi: 'Ek comment mein, ek module kya hai samjhao.',
        hint: 'A MODULE = a directory of `.tf` files reused as a UNIT. The directory you run `terraform` in = the ROOT MODULE; any module it calls with a `module "name" { }` block = a CHILD MODULE. CONVENTIONAL LAYOUT (names are convention, not rule): `variables.tf` (the module\'s inputs/interface), `main.tf` (its resources), `outputs.tf` (its return values). Call it: `module "vpc" { source = "..."  <inputs> }`, read results as `module.vpc.<output>`. THREE `source` KINDS: (1) LOCAL PATH — `./modules/vpc` (no version; it is in your repo); (2) TERRAFORM REGISTRY — `terraform-aws-modules/vpc/aws` + `version = "~> 5.1.0"`; (3) GIT URL — `git::https://github.com/acme/tf-modules.git//vpc?ref=v1.4.0` (the `//` separates repo from subdir, `?ref=` pins a tag/branch/SHA). PIN REGISTRY/GIT VERSIONS because a module IS code fetched from elsewhere — new defaults, renamed vars, resources split/merged, bugs. Unpinned → `terraform init` resolves to whatever is latest AT THE MOMENT init runs, which differs between the dev who set it up, the colleague who inits today, and the CI runner — they plan against different module versions and a plan full of changes that "appeared on their own" cannot be reviewed. Upgrading a pinned module = bump the constraint in a PR → `terraform init -upgrade` → review the plan the new version produces → merge. COMPOSITION: a root module wires one module\'s output (`module.network.private_subnet_ids`) into another\'s input; scope a module to a logical component (a VPC, a service, a DB) — not one giant module, not one per single resource.',
        hintHi: 'Ek MODULE = `.tf` files ki ek directory ek UNIT ke roop mein reused. Jis directory mein aap `terraform` chalate ho = ROOT MODULE; koi bhi module jise ye `module "name" { }` block se call karta hai = CHILD MODULE. LAYOUT: `variables.tf` (inputs), `main.tf` (resources), `outputs.tf` (return values). THREE `source` KINDS: (1) LOCAL PATH `./modules/vpc`; (2) REGISTRY `terraform-aws-modules/vpc/aws` + `version = "~> 5.1.0"`; (3) GIT URL `git::https://...//vpc?ref=v1.4.0`. VERSIONS PIN KARO kyunki ek module code hai kahin se fetched. Unpinned → `terraform init` jo bhi latest hai us par resolve karta hai. Upgrade = PR mein constraint bump → `init -upgrade` → plan review → merge.',
      },
      {
        task: 'In a comment, give the `for_each` vs `count` rule, walk through exactly what a `count` config does when you remove a middle element, and name the two cases where `count` is correct.',
        taskHi: 'Ek comment mein, `for_each` vs `count` rule do, aur exactly samjhao ek `count` config kya karta hai jab aap ek middle element hatate ho.',
        hint: 'Both make multiple instances of a resource/module block; the difference is how instances are ADDRESSED IN STATE. `count = N` → addressed by INTEGER POSITION: `x[0]`, `x[1]`, `x[2]` (index = position in the iterated list). `for_each = toset([...])` or `for_each = { k = v }` → addressed by KEY: `x["logs"]`, `x["media"]`; inside the block use `each.key` / `each.value`. WHAT `count` DOES ON MIDDLE REMOVAL: list `["logs","media","backups"]` → `x[0]=logs, x[1]=media, x[2]=backups`. Remove "media" → list is `["logs","backups"]` → now `x[0]=logs, x[1]=backups`. Terraform keys state by index, so: `x[1]` was media, is now backups → "config completely changed" → REPLACE (destroy media\'s resource, create backups\' — but backups already existed at x[2]!); `x[2]` no longer exists → DESTROY. Net: the backups resource — which you never touched — is destroyed and recreated, losing its real-world state (subscriptions, data, attached policies), and media is destroyed. With `for_each`, removing "media" → plan is exactly `x["media"] will be destroyed`, `x["logs"]` and `x["backups"]` untouched (their keys, hence state addresses, are unchanged). `count` IS CORRECT for exactly two cases: (1) N genuinely interchangeable copies — `count = var.worker_count`; (2) a boolean on/off — `count = var.enabled ? 1 : 0`. Anything with a name/region/identity → `for_each`. Converting `count`→`for_each` later needs a `terraform state mv` per instance to avoid the recreate, so choose `for_each` up front.',
        hintHi: 'Dono ek resource/module block ke multiple instances banate hain; difference ye hai ki instances STATE MEIN KAISE ADDRESSED hote hain. `count = N` → INTEGER POSITION se: `x[0]`, `x[1]`, `x[2]`. `for_each` → KEY se: `x["logs"]`; block ke andar `each.key`/`each.value`. MIDDLE REMOVAL PAR `count`: list `["logs","media","backups"]` → remove "media" → `["logs","backups"]` → ab `x[1]=backups`. Terraform index se key karta hai: `x[1]` REPLACE, `x[2]` DESTROY. Net: backups resource — jise aapne kabhi touch nahi kiya — destroy aur recreate hota hai. `for_each` ke saath sirf `x["media"]` destroy hota hai. `count` SAHI hai: (1) N interchangeable copies; (2) boolean on/off `count = var.enabled ? 1 : 0`. Naam wali koi cheez → `for_each`.',
      },
    ],

    keyTakeaways: [
      'VARIABLE = typed input: `type` (rejects wrong shapes), `default` (present → optional, absent → required), `validation { condition, error_message }`, `sensitive = true` (out of CLI/plan text, still in state). Precedence: default < `*.auto.tfvars` < `-var-file` < `-var` < `TF_VAR_`. CI: `prod.tfvars` for settings + `TF_VAR_` for secrets.',
      'OUTPUT = the config\'s / a module\'s return value (`module.NAME.OUTPUT`; `terraform output [-raw|-json]`; `sensitive` for secrets). LOCALS = named expressions computed once and reused — not inputs, not outputs — to DRY repetition (`local.name_prefix`, `local.common_tags`).',
      'MODULE = a directory of `.tf` reused as a unit — `variables.tf` (interface), `main.tf` (resources), `outputs.tf` (returns). `source` = local path / registry ref / git URL. PIN `version` (registry) or `?ref=` (git) — a module is code and an unpinned one changes between applies; upgrade deliberately in a PR with `init -upgrade`.',
      '`count = N` addresses instances by POSITION (`x[0]`, `x[1]`); `for_each` over a set/map addresses by KEY (`x["logs"]`, with `each.key`/`each.value`). Removing a MIDDLE element of a `count` list renumbers everything after it → terraform destroys-and-recreates unrelated resources. `for_each` removal touches only that key.',
      'Use `count` ONLY for N genuinely interchangeable copies (`count = var.worker_count`) or an on/off toggle (`count = var.enabled ? 1 : 0`). Use `for_each` for anything with a name, region, or stable identity — most cases. Converting `count`→`for_each` later needs a `terraform state mv` per instance.',
    ],
    keyTakeawaysHi: [
      'VARIABLE = typed input: `type` (wrong shapes reject karta hai), `default` (present → optional, absent → required), `validation { condition, error_message }`, `sensitive = true` (CLI/plan text se bahar, abhi bhi state mein). Precedence: default < `*.auto.tfvars` < `-var-file` < `-var` < `TF_VAR_`.',
      'OUTPUT = config ka / ek module ka return value (`module.NAME.OUTPUT`; `terraform output [-raw|-json]`; secrets ke liye `sensitive`). LOCALS = named expressions ek baar computed aur reused — na inputs, na outputs — repetition DRY karne ke liye (`local.name_prefix`).',
      'MODULE = `.tf` ki ek directory ek unit ke roop mein reused — `variables.tf` (interface), `main.tf` (resources), `outputs.tf` (returns). `source` = local path / registry ref / git URL. `version` (registry) ya `?ref=` (git) PIN karo — ek module code hai aur ek unpinned applies ke beech badalta hai.',
      '`count = N` instances ko POSITION se address karta hai (`x[0]`, `x[1]`); `for_each` ek set/map par KEY se (`x["logs"]`, `each.key`/`each.value` ke saath). Ek `count` list ka MIDDLE element hatana uske baad sab kuch renumber karta hai → terraform unrelated resources ko destroy-and-recreate karta hai. `for_each` removal sirf us key ko touch karta hai.',
      '`count` SIRF N genuinely interchangeable copies (`count = var.worker_count`) ya ek on/off toggle (`count = var.enabled ? 1 : 0`) ke liye use karo. `for_each` naam, region, ya stable identity wali koi cheez ke liye — zyadaatar cases. `count`→`for_each` baad mein convert karne ke liye per instance ek `terraform state mv` chahiye.',
    ],
  },

  {
    slug: 'ops-terraform-in-ci-and-managing-change-safely',
    title: 'Terraform in CI & Managing Change Safely',
    titleHi: 'CI Mein Terraform Aur Change Safely Manage Karna',
    description:
      'How terraform runs in a pipeline rather than from a laptop: fmt and validate on every push, a saved plan posted to the pull request for review, and apply of that exact plan only after merge and approval. Plus the tools for keeping change safe — a machine-readable plan for policy checks, workspaces versus a directory per environment, and where secrets go so they never touch state in plaintext.',
    descriptionHi:
      'Terraform ek pipeline mein kaise chalता hai ek laptop se nahi: har push par fmt aur validate, ek saved plan pull request par review ke liye posted, aur us exact plan ka apply sirf merge aur approval ke baad. Plus change safe rakhne ke tools — policy checks ke liye ek machine-readable plan, workspaces versus ek directory per environment, aur secrets kahaan jaate hain taaki wo kabhi state ko plaintext mein touch na karein.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 5,

    analogy: {
      en: '**A change-control board for a power grid.** Nobody walks up to the substation and flips breakers. You submit a change request; the system produces a precise impact statement — "these twelve circuits de-energised for four minutes, these two permanently rerouted"; the board reads that exact statement and signs it; and then a technician executes *that signed statement*, not a fresh interpretation of it. If the grid state changed between the impact statement and the execution, the statement is void and you redo it. The plan file is the impact statement; the pull request is the board; \`apply tf.plan\` executes the signed one.',
      hi: '**Ek power grid ke liye ek change-control board.** Koi substation tak nahi jaता aur breakers flip nahi karता. Aap ek change request submit karते ho; system ek precise impact statement produce karता hai — "ye baarah circuits chaar minute ke liye de-energised, ye do permanently rerouted"; board wo exact statement padhता hai aur ise sign karता hai; aur phir ek technician *us signed statement* ko execute karता hai, iski ek fresh interpretation nahi. Agar grid state impact statement aur execution ke beech badla, statement void hai aur aap ise dobara karते ho. Plan file impact statement hai; pull request board hai; \`apply tf.plan\` signed wala execute karता hai.',
    },

    simple: `**THE TERRAFORM CI FLOW:**
\`\`\`
on every push to a branch / PR:
  terraform fmt -check        formatting is consistent (fails if not)
  terraform init              (with the backend + provider lock)
  terraform validate          the config is internally valid (no apply, no creds needed)
  terraform plan -out=tf.plan  -> render it, POST it as a PR comment
  [policy checks on the plan]  OPA/conftest/Sentinel/checkov - can HARD-FAIL

human reviews the PLAN in the PR (not just the code diff), approves, merges

on merge to main:
  terraform apply tf.plan     apply THAT saved plan (from the merge commit's plan),
                              behind an environment protection rule / manual approval
\`\`\`

**WHY A SAVED PLAN:** \`terraform apply\` on its own re-plans and can do something
different from what was reviewed. \`plan -out=f\` + \`apply f\` applies *exactly* the
reviewed set of actions, or refuses if state changed underneath ("saved plan is stale").

**THE PLAN AS DATA:** \`terraform show -json tf.plan\` -> every \`resource_changes[]\`
with \`.change.actions\` (\`["create"]\`, \`["delete","create"]\` = replace, \`["delete"]\`).
A policy engine reads this and fails the pipeline on, e.g., any delete of a
resource tagged \`stateful\`, a public S3 bucket, a security-group rule to \`0.0.0.0/0\`.

**\`-target\`** (\`apply -target=aws_x.y\`) applies a SUBSET. It is an emergency tool —
it makes state partially applied and hides dependency effects. Don't use it in CI.

**ENVIRONMENTS — two layouts:**
\`\`\`
WORKSPACES        one config dir, 'terraform workspace new prod', terraform.workspace
                  in the config. ONE backend, ONE set of creds, ONE code version.
                  fine for near-identical, low-risk envs. cheap.
DIR-PER-ENV       envs/dev/  envs/staging/  envs/prod/  each with its own backend
                  block + tfvars, sharing modules. separate state, separate creds,
                  separate blast radius, per-env approval. use for prod isolation.
\`\`\`

**SECRETS IN IaC:** never a literal in \`.tf\` / \`.tfvars\` in git. Options:
\`TF_VAR_\` from the CI secret store; a \`data\` source reading AWS Secrets Manager /
Azure Key Vault / Vault at plan time; \`random_password\` -> written straight into a
secret-manager resource. All still land in STATE -> encrypted backend is mandatory
(Lesson 3). SOPS / sealed-secrets for secrets that must sit in git encrypted.`,

    simpleHi: `**TERRAFORM CI FLOW:**
\`\`\`
har push par ek branch / PR par:
  terraform fmt -check        formatting consistent hai (nahi to fail)
  terraform init              (backend + provider lock ke saath)
  terraform validate          config internally valid hai (koi apply nahi, creds nahi chahiye)
  terraform plan -out=tf.plan  -> ise render karo, ek PR comment ke roop mein POST karo
  [plan par policy checks]     OPA/conftest/Sentinel/checkov - HARD-FAIL kar sakte hain

human PR mein PLAN review karता hai (sirf code diff nahi), approve karता hai, merge karता hai

main par merge par:
  terraform apply tf.plan     WO saved plan apply karo, ek environment protection
                              rule / manual approval ke peeche
\`\`\`

**EK SAVED PLAN KYUN:** \`terraform apply\` apne aap re-plan karता hai aur jo review
kiya gaya us se alag kuch kar sakता hai. \`plan -out=f\` + \`apply f\` *exactly* review
kiya gaya set of actions apply karता hai, ya refuse karता hai agar state neeche badla.

**PLAN DATA KE ROOP MEIN:** \`terraform show -json tf.plan\` -> har \`resource_changes[]\`
\`.change.actions\` ke saath (\`["create"]\`, \`["delete","create"]\` = replace, \`["delete"]\`).
Ek policy engine ise padhता hai aur pipeline fail karता hai, jaise, \`stateful\`
tagged resource ke kisi bhi delete par, ek public S3 bucket, \`0.0.0.0/0\` ko ek SG rule.

**\`-target\`** (\`apply -target=aws_x.y\`) ek SUBSET apply karता hai. Ye ek emergency
tool hai — ye state ko partially applied banाता hai. Ise CI mein use mat karo.

**ENVIRONMENTS — do layouts:**
\`\`\`
WORKSPACES        ek config dir, 'terraform workspace new prod', config mein
                  terraform.workspace. EK backend, EK set of creds, EK code version.
                  near-identical, low-risk envs ke liye theek. sasta.
DIR-PER-ENV       envs/dev/  envs/staging/  envs/prod/  har ek apne backend block +
                  tfvars ke saath, modules share karте. separate state, separate creds,
                  separate blast radius, per-env approval. prod isolation ke liye use karo.
\`\`\`

**SECRETS IN IaC:** kabhi git mein \`.tf\` / \`.tfvars\` mein ek literal nahi. Options:
CI secret store se \`TF_VAR_\`; ek \`data\` source jo AWS Secrets Manager / Azure Key
Vault / Vault ko plan time par read karता hai; \`random_password\` -> seedhे ek
secret-manager resource mein written. Sab abhi bhi STATE mein land karते hain ->
encrypted backend mandatory hai (Lesson 3). SOPS / sealed-secrets un secrets ke liye
jo git mein encrypted baithne chahiye.`,

    content: `## Terraform belongs in a pipeline

Running terraform from a laptop has all the problems running any deploy from a laptop has: no review of what will change, no audit trail, "works on my machine" provider versions, and one person as a single point of failure. The fix is the same as for application deploys (Module 10): terraform runs in CI, triggered by git.

**On every push to a feature branch or pull request**, the pipeline runs read-only checks: \`terraform fmt -check\` (canonical formatting — fails the build if a file is not formatted), \`terraform init\` (with the shared backend and the committed provider lock), and \`terraform validate\` (the configuration is internally consistent — references resolve, types match — which needs no credentials and touches nothing). Then \`terraform plan -out=tf.plan\`, and the rendered plan is posted as a comment on the pull request.

**Code review then includes the plan, not just the code diff.** A one-line HCL change can produce a plan that destroys a database; a large refactor can produce a plan with zero changes. The reviewer approves based on what terraform says it will do.

**On merge to the main branch**, the pipeline runs \`terraform apply tf.plan\` — applying the exact plan that was reviewed — gated behind an environment protection rule (Module 10) so that production applies require a second person to click approve.

## Why the saved plan matters

\`terraform apply\` with no plan file re-runs plan internally and then applies the result. Between the plan you reviewed and the apply, reality can change — someone else applied, a resource was modified out of band, a data source now returns something different — and the apply proceeds with the *new* plan, which nobody reviewed. \`terraform plan -out=tf.plan\` freezes the exact set of actions; \`terraform apply tf.plan\` executes that frozen set and nothing else, or aborts with "Saved plan is stale" if the state has moved on since the plan was created. This is what makes "review the plan, then apply the plan" a real guarantee rather than an approximation.

## The plan as machine-readable data

\`terraform show -json tf.plan\` emits the plan as JSON. The useful part is \`resource_changes\`: an array where each entry has an \`address\`, and a \`change\` object with \`actions\` — \`["create"]\`, \`["update"]\`, \`["delete"]\`, or \`["delete","create"]\` (a replace) — plus \`before\` and \`after\` attribute maps. A **policy check** reads this and fails the pipeline on rules you cannot enforce in HCL: no plan may delete a resource tagged \`stateful\`; no security group may open a port to \`0.0.0.0/0\`; no S3 bucket may be created without encryption; the total number of destroys may not exceed some threshold without an override label. Tools: Open Policy Agent / \`conftest\`, HashiCorp Sentinel (Terraform Cloud/Enterprise), \`checkov\`, \`tfsec\`/Trivy. The check runs on the PR, so a dangerous change is blocked before a human even reviews it.

## -target is not a workflow

\`terraform apply -target=aws_instance.web\` applies only that resource and its dependencies, skipping the rest of the configuration. It exists for recovering from a specific broken state — a half-failed apply, a resource wedged in a way that blocks the full plan. It is not a normal way to work: it leaves state partially applied (some resources reflect the new config, others do not), it silently skips changes that depend on things outside the target, and using it routinely means your applies no longer correspond to your configuration. Never put \`-target\` in a pipeline.

## Workspaces versus directory-per-environment

Two ways to manage dev / staging / prod from one codebase:

**Workspaces**: one configuration directory, multiple named states. \`terraform workspace new staging\` creates a separate state; \`terraform workspace select staging\` switches to it; \`terraform.workspace\` in the config lets you vary values (\`replicas = local.replicas[terraform.workspace]\`). All workspaces share one backend, one set of provider credentials, and one code version at a time. Workspaces suit environments that are near-identical and low-risk to change together, and they are cheap to set up.

**Directory per environment**: \`envs/dev/\`, \`envs/staging/\`, \`envs/prod/\`, each a small root module with its own backend block, its own \`.tfvars\`, and its own CI job, all calling the same shared modules. Each environment has separate state, can use separate credentials (a different AWS account for prod), has its own blast radius, and can have its own approval rules. This is the right choice when production must be strongly isolated from the others — which is most serious setups. The cost is more boilerplate.

## Secrets in IaC

A secret must never appear as a literal in a \`.tf\` or \`.tfvars\` file that is committed — it goes into git history permanently. The options, roughly in order of preference:

- **Generate, do not pass**: \`random_password\` creates the secret inside terraform and you write it directly into an \`aws_secretsmanager_secret_version\` / \`azurerm_key_vault_secret\` resource. The secret never transits a variable or a human.
- **Read at plan time**: a \`data\` source (\`data "aws_secretsmanager_secret_version"\`, \`data "vault_generic_secret"\`) pulls the secret from the secret manager when terraform runs, so it is never written in config.
- **Inject as an environment variable**: \`TF_VAR_db_password\` set from the CI secret store, for cases where terraform genuinely needs the value as an input.
- **Encrypted in git**: SOPS or sealed-secrets for the rare case where an encrypted secret file must live in the repo.

In every case the secret still lands in state (Lesson 3), so an encrypted, access-controlled remote backend is not optional — it is the thing that makes any of these safe.`,

    contentHi: `## Terraform ek pipeline mein belong karता hai

Terraform ko ek laptop se chalाना wahi problems rakhता hai jo kisi bhi deploy ko ek laptop se chalाना: kya badlega iski koi review nahi, koi audit trail nahi, "mere machine par kaam karता hai" provider versions, aur ek person ek single point of failure. Fix wahi hai jo application deploys ke liye (Module 10): terraform CI mein chalता hai, git se triggered.

**Ek feature branch ya PR par har push par**, pipeline read-only checks chalाती hai: \`terraform fmt -check\` (canonical formatting), \`terraform init\`, aur \`terraform validate\` (configuration internally consistent hai — jise koi credentials nahi chahiye). Phir \`terraform plan -out=tf.plan\`, aur rendered plan PR par ek comment ke roop mein posted hota hai.

**Code review phir plan include karता hai, sirf code diff nahi.** Ek one-line HCL change ek plan produce kar sakता hai jo ek database destroy karता hai. Reviewer approve karता hai based on jo terraform kehता hai ye karega.

**Main branch par merge par**, pipeline \`terraform apply tf.plan\` chalाती hai — exact plan jo review kiya gaya apply karता hua — ek environment protection rule ke peeche gated.

## Saved plan kyun matter karता hai

\`terraform apply\` bina ek plan file ke internally plan re-run karता hai aur phir result apply karता hai. Aapke review kiye plan aur apply ke beech, reality badल sakती hai, aur apply *naye* plan ke saath proceed karता hai, jo kisi ne review nahi kiya. \`terraform plan -out=tf.plan\` exact set of actions freeze karता hai; \`terraform apply tf.plan\` us frozen set ko execute karता hai aur kuch nahi, ya "Saved plan is stale" ke saath abort karता hai.

## Plan machine-readable data ke roop mein

\`terraform show -json tf.plan\` plan ko JSON ke roop mein emit karता hai. Useful part \`resource_changes\` hai: ek array jahaan har entry mein ek \`address\` hai, aur ek \`change\` object \`actions\` ke saath — \`["create"]\`, \`["update"]\`, \`["delete"]\`, ya \`["delete","create"]\` (ek replace). Ek **policy check** ise padhता hai aur pipeline fail karता hai rules par jo aap HCL mein enforce nahi kar sakते. Tools: Open Policy Agent / \`conftest\`, HashiCorp Sentinel, \`checkov\`, \`tfsec\`/Trivy.

## -target ek workflow nahi hai

\`terraform apply -target=aws_instance.web\` sirf us resource aur iski dependencies apply karता hai. Ye ek specific broken state se recover karne ke liye exist karता hai. Ye kaam karne ka ek normal tarika nahi hai: ye state ko partially applied chhodता hai. \`-target\` ko kabhi ek pipeline mein mat daalo.

## Workspaces versus directory-per-environment

**Workspaces**: ek configuration directory, multiple named states. \`terraform workspace new staging\` ek separate state banाता hai; \`terraform.workspace\` config mein aapko values vary karने deता hai. Saare workspaces ek backend, ek set of provider credentials, aur ek samay mein ek code version share karते hain. Workspaces un environments ke liye suit karते hain jo near-identical hain.

**Directory per environment**: \`envs/dev/\`, \`envs/staging/\`, \`envs/prod/\`, har ek apne backend block, apne \`.tfvars\`, aur apni CI job ke saath, sab same shared modules call karते. Har environment ki separate state hai, separate credentials use kar sakता hai (prod ke liye ek alag AWS account), apna blast radius hai. Ye sahi choice hai jab production ko strongly isolated hona chahiye.

## Secrets in IaC

Ek secret kabhi ek \`.tf\` ya \`.tfvars\` file mein ek literal ke roop mein appear nahi hona chahiye jo committed hai. Options, roughly preference order mein:
- **Generate karo, pass mat karo**: \`random_password\` secret ko terraform ke andar banाता hai aur aap ise seedhे ek secret-manager resource mein likhते ho.
- **Plan time par read karo**: ek \`data\` source secret ko secret manager se pull karता hai jab terraform chalता hai.
- **Ek env var ke roop mein inject karo**: \`TF_VAR_db_password\` CI secret store se set.
- **Git mein encrypted**: SOPS ya sealed-secrets us rare case ke liye jahaan ek encrypted secret file repo mein rehna chahiye.

Har case mein secret abhi bhi state mein land karता hai (Lesson 3), to ek encrypted remote backend optional nahi hai.`,

    examples: [
      {
        title: 'plan -out then apply that file: the reviewed plan is the applied plan, and a stale one is refused',
        titleHi: 'plan -out phir wo file apply karo: review kiya plan applied plan hai, aur ek stale refuse hota hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

cat > main.tf <<'EOF'
terraform {
  required_providers { local = { source = "hashicorp/local", version = "2.9.0" } }
}
variable "release" { default = "1.0.0" }
resource "local_file" "app" {
  content  = "release=\${var.release}\\n"
  filename = "\${path.module}/deployed.txt"
}
EOF
terraform init -no-color -input=false >/dev/null
terraform apply -no-color -auto-approve -var 'release=1.0.0' >/dev/null

echo "=== CI on the PR: 'terraform plan -out=tf.plan'  (a saved, reviewable artifact) ==="
terraform plan -no-color -out=tf.plan -var 'release=1.1.0' 2>&1 | grep -E '^  # |^Plan:'

echo
echo "=== a machine-readable view of that exact plan (what a policy check / PR bot reads) ==="
terraform show -json tf.plan > plan.json
python - <<'PY'
import json
p = json.load(open("plan.json"))
for rc in p["resource_changes"]:
    print(f"  {rc['address']:24} actions={rc['change']['actions']}")
    b = rc["change"]["before"] or {}
    a = rc["change"]["after"] or {}
    if "content" in (b | a):
        print(f"    content: {b.get('content')!r} -> {a.get('content')!r}")
PY

echo
echo "=== on merge, CI runs 'terraform apply tf.plan' - applies THAT plan, no re-plan, no prompt ==="
terraform apply -no-color tf.plan 2>&1 | grep -E '^local_file|^Apply complete' | sed -E 's/ \\[id=[^]]*\\]//; s/ after [0-9]+s//'
echo "file now: \$(cat deployed.txt)"

echo
echo "=== a stale plan is rejected (the world moved on since it was made) ==="
terraform plan -no-color -out=old.plan -var 'release=2.0.0' >/dev/null 2>&1
terraform apply -no-color -auto-approve -var 'release=1.5.0' >/dev/null 2>&1   # someone else applied first
terraform apply -no-color old.plan 2>&1 | grep -iE 'stale|saved plan is no longer|Error:' | head -2`,
        output: `=== CI on the PR: 'terraform plan -out=tf.plan'  (a saved, reviewable artifact) ===
  # local_file.app must be replaced
Plan: 1 to add, 0 to change, 1 to destroy.

=== a machine-readable view of that exact plan (what a policy check / PR bot reads) ===
  local_file.app           actions=['delete', 'create']
    content: 'release=1.0.0\\n' -> 'release=1.1.0\\n'

=== on merge, CI runs 'terraform apply tf.plan' - applies THAT plan, no re-plan, no prompt ===
local_file.app: Destroying...
local_file.app: Destruction complete
local_file.app: Creating...
local_file.app: Creation complete
Apply complete! Resources: 1 added, 0 changed, 1 destroyed.
file now: release=1.1.0

=== a stale plan is rejected (the world moved on since it was made) ===
Error: Saved plan is stale`,
        explain: 'This is the core CI flow in miniature. A resource is applied at release 1.0.0. On a pull request that bumps the release to 1.1.0, CI runs terraform plan -out=tf.plan, which both prints a human-readable diff (this resource must be replaced, 1 to add and 1 to destroy) and saves the exact planned actions to a file. terraform show -json tf.plan turns that file into JSON; the script walks resource_changes and prints each address with its actions array — ["delete", "create"] is a replace — and the before and after content. A policy engine reads exactly this structure to enforce rules. On merge, CI runs terraform apply tf.plan: it executes the saved plan directly, with no re-planning and no interactive prompt, and the file ends up at release 1.1.0. The last block shows the safety property: a second plan is saved, then someone else applies a different change, and when we try to apply the now-outdated saved plan terraform refuses with "Saved plan is stale" rather than applying something that no longer matches reality. That refusal is what makes "review the plan, apply the plan" a guarantee.',
        explainHi: 'Ye core CI flow miniature mein hai. Ek resource release 1.0.0 par applied hai. Ek PR par jo release ko 1.1.0 bump karता hai, CI terraform plan -out=tf.plan chalाता hai, jo dono ek human-readable diff print karता hai (ye resource replace hona chahiye) aur exact planned actions ek file mein save karता hai. terraform show -json tf.plan us file ko JSON mein badalता hai; script resource_changes walk karता hai aur har address ko iske actions array ke saath print karता hai — ["delete", "create"] ek replace hai. Merge par, CI terraform apply tf.plan chalाता hai: ye saved plan ko seedhे execute karता hai, koi re-planning nahi aur koi interactive prompt nahi. Aakhri block safety property dikhाता hai: ek doosra plan save hota hai, phir koi aur ek alag change apply karता hai, aur jab hum now-outdated saved plan apply karने ki koshish karते hain terraform "Saved plan is stale" ke saath refuse karता hai.',
      },
      {
        title: 'Workspaces: one config, one code version, separate state per environment',
        titleHi: 'Workspaces: ek config, ek code version, per environment separate state',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
export TF_CLI_ARGS=-no-color

cat > main.tf <<'EOF'
terraform {
  required_providers { local = { source = "hashicorp/local", version = "2.9.0" } }
}
locals {
  replicas = { default = 1, staging = 2, prod = 6 }
}
resource "local_file" "cfg" {
  content  = "env=\${terraform.workspace}\\nreplicas=\${lookup(local.replicas, terraform.workspace, 1)}\\n"
  filename = "\${path.module}/\${terraform.workspace}.conf"
}
EOF
terraform init -no-color -input=false >/dev/null

echo "=== default workspace ==="
terraform workspace show
terraform apply -no-color -auto-approve >/dev/null
cat default.conf

echo
echo "=== create + switch to 'staging' - a SEPARATE state, same code ==="
terraform workspace new staging 2>&1 | grep -E "Created and switched"
terraform apply -no-color -auto-approve >/dev/null
cat staging.conf

echo
echo "=== and 'prod' ==="
terraform workspace new prod 2>&1 | grep -E "Created and switched"
terraform apply -no-color -auto-approve >/dev/null
cat prod.conf

echo
echo "=== each workspace has its own state file ==="
terraform workspace list
find terraform.tfstate.d -name '*.tfstate' | sort
echo
echo "NOTE: workspaces share ONE backend + ONE set of credentials + ONE code version."
echo "For strongly-isolated prod (separate account, separate approval), prefer a"
echo "directory-per-environment layout over workspaces."`,
        output: `=== default workspace ===
default
env=default
replicas=1

=== create + switch to 'staging' - a SEPARATE state, same code ===
Created and switched to workspace "staging"!
env=staging
replicas=2

=== and 'prod' ===
Created and switched to workspace "prod"!
env=prod
replicas=6

=== each workspace has its own state file ===
  default
* prod
  staging

terraform.tfstate.d/prod/terraform.tfstate
terraform.tfstate.d/staging/terraform.tfstate

NOTE: workspaces share ONE backend + ONE set of credentials + ONE code version.
For strongly-isolated prod (separate account, separate approval), prefer a
directory-per-environment layout over workspaces.`,
        explain: 'One configuration uses terraform.workspace to look up an environment-specific replica count and to name its output file. In the default workspace it renders env=default, replicas=1. terraform workspace new staging creates a second, completely separate state and switches to it; applying the same code now renders env=staging, replicas=2, into staging.conf. The same again for prod gives replicas=6. terraform workspace list shows all three with the current one starred, and the state files live side by side under terraform.tfstate.d/<workspace>/. The important caveat is in the note: every workspace uses the same backend, the same provider credentials, and whatever code is currently checked out — so a mistake in the shared config, or applying while on the wrong workspace, can hit production. Workspaces are convenient for environments that are genuinely alike and low-stakes. When production needs to be isolated — its own cloud account, its own state bucket, its own approval gate, the ability to be on a different code version during a rollout — a directory per environment, each a thin root module over shared child modules, is the safer structure.',
        explainHi: 'Ek configuration terraform.workspace ka use ek environment-specific replica count look up karne aur apni output file naam karne ke liye karता hai. default workspace mein ye env=default, replicas=1 render karता hai. terraform workspace new staging ek doosra, poori tarah separate state banाता hai aur ise switch karता hai; same code apply karna ab env=staging, replicas=2 render karता hai. prod ke liye wahi replicas=6 deता hai. terraform workspace list teenon dikhाता hai current wale ke saath starred. Important caveat note mein hai: har workspace same backend, same provider credentials, aur jo bhi code currently checked out hai use karता hai — to shared config mein ek mistake, ya wrong workspace par hote hue apply karna, production ko hit kar sakता hai. Jab production ko isolated hona chahiye — apna cloud account, apna state bucket, apna approval gate — ek directory per environment safer structure hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# CI that runs a bare 'terraform apply' on merge (re-plans at apply time)
# .github/workflows/tf.yml (on push to main):
  - run: terraform apply -auto-approve
# the PR showed a clean plan on Tuesday. it merges Thursday. between Tuesday and
# Thursday someone applied a hotfix + a data source's result changed. Thursday's
# apply re-plans and now also reverts the hotfix and rebuilds 3 resources -
# none of which any human reviewed.`,
        right: `# plan on the PR, save it, apply THAT file on merge:
# --- job: plan (on pull_request) ---
  - run: terraform plan -no-color -out=tf.plan
  - run: terraform show -no-color tf.plan > plan.txt
  - uses: actions/upload-artifact@v4       # OR post plan.txt as a PR comment
    with: { name: tfplan, path: tf.plan }
# --- job: apply (on push to main, environment: production w/ required reviewers) ---
  - uses: actions/download-artifact@v4
    with: { name: tfplan }
  - run: terraform apply -no-color tf.plan   # exact reviewed plan, or "stale" -> re-run the PR flow
# the apply can ONLY do what the reviewed plan said. if state moved, it refuses
# and a human re-plans.`,
        why: 'A bare \`terraform apply\` re-computes the plan at apply time and applies whatever that produces. The plan a reviewer approved on the pull request and the plan that actually runs on merge are therefore two different computations, separated by however long the PR sat open, during which state can drift, someone can apply a hotfix, a data source can return a new value, or a provider can be upgraded. The merge-time apply silently incorporates all of that, so it can revert changes, rebuild resources, or destroy things that were never in the reviewed plan. The correct pipeline separates the two phases: the PR job runs \`terraform plan -out=tf.plan\` and publishes the plan (as an artifact and/or a PR comment) for review; the merge job downloads that exact plan file and runs \`terraform apply tf.plan\`, which executes precisely those actions or refuses with "saved plan is stale" if state has moved. The apply is then provably the thing that was reviewed. The production apply job also sits behind an environment protection rule so a second person approves the actual apply, not just the code merge.',
        whyHi: 'Ek bare \`terraform apply\` apply time par plan re-compute karता hai aur jo bhi wo produce karता hai apply karता hai. Jo plan ek reviewer ne PR par approve kiya aur jo plan actually merge par chalता hai isliye do alag computations hain, jitne bhi samay PR khula raha usse separated, jiske dauraan state drift kar sakती hai, koi ek hotfix apply kar sakता hai, ek data source ek naya value return kar sakता hai. Merge-time apply silently wo sab incorporate karता hai. Correct pipeline do phases ko separate karती hai: PR job \`terraform plan -out=tf.plan\` chalाती hai aur plan publish karती hai review ke liye; merge job wo exact plan file download karती hai aur \`terraform apply tf.plan\` chalाती hai, jo precisely wo actions execute karता hai ya "saved plan is stale" ke saath refuse karता hai. Apply phir provably wo cheez hai jo review ki gayi.',
      },
      {
        wrong: `# reaching for -target to "just fix this one thing" in the pipeline
$ terraform apply -target=aws_ecs_service.api      # deploy just the API
# it worked, so it goes into the deploy script permanently. now:
#   - aws_ecs_task_definition (which the service needs) was skipped -> the service
#     points at an old task def
#   - state is "partially applied": some resources match main.tf, others don't
#   - the next FULL 'terraform apply' shows a pile of changes nobody expected,
#     because -target has been hiding them for weeks`,
        right: `# -target is an emergency-recovery tool, used by hand, once, then discard:
#   - a partial apply failed halfway -> '-target' the stuck resource to unstick it
#   - a resource is wedged -> 'apply -replace=<addr>' (usually better than -target)
# then immediately run a FULL 'terraform plan' + 'apply' to reconcile everything.
#
# in the PIPELINE, always apply the WHOLE configuration. if deploys are too
# coupled, SPLIT the configuration (separate state per service / per layer) so a
# full apply of one part is naturally scoped - don't fake it with -target.`,
        why: '\`-target\` tells terraform to apply only the named resource and whatever it depends on, ignoring the rest of the configuration. That breaks terraform\'s core guarantee that state reflects the whole config: after a targeted apply, some resources match the configuration and others are frozen at whatever they were, and terraform has no record that this is a partial state. Dependencies that run the other way — a resource the target *feeds* rather than depends on — are silently not updated. Used once by hand to unstick a failed apply it is fine, as long as a full \`plan\` and \`apply\` follow immediately to reconcile. Baked into a pipeline it is corrosive: every run leaves more of the configuration unapplied, the drift accumulates invisibly, and eventually someone runs a normal full apply and is confronted with dozens of changes that \`-target\` had been silently deferring, some of them now dangerous. If parts of the infrastructure genuinely need to deploy independently, the answer is to split them into separate configurations with separate state, so that a full apply of each is naturally the right scope — not to simulate that with \`-target\` inside one big configuration.',
        whyHi: '\`-target\` terraform ko sirf named resource aur jo bhi ye depend karता hai apply karने ko kehता hai, baaki configuration ignore karता hua. Ye terraform ki core guarantee todता hai ki state poore config ko reflect karता hai: ek targeted apply ke baad, kuch resources configuration se match karते hain aur doosre frozen hain, aur terraform ke paas koi record nahi ki ye ek partial state hai. Ek failed apply unstick karने ke liye ek baar haath se use kiya theek hai, jab tak ek full \`plan\` aur \`apply\` turant follow karें. Ek pipeline mein baked ye corrosive hai: har run configuration ka aur zyada unapplied chhodता hai, drift invisibly accumulate karता hai. Agar infrastructure ke parts genuinely independently deploy karने chahiye, answer unhe separate configurations mein split karना hai separate state ke saath.',
      },
      {
        wrong: `# using one 'prod' workspace of a shared config for genuinely critical infra
terraform workspace select prod
terraform apply           # same backend + creds + code as 'dev' and 'staging'
# risks:
#   - you were on 'dev' a minute ago; 'select' is easy to forget -> apply to prod
#   - the state bucket, the IAM role, the provider version are shared across all envs
#   - a bug in a 'count = terraform.workspace == "prod" ? 3 : 1' expression hits prod
#   - prod can't be on a different module version during a careful rollout`,
        right: `# directory per environment for anything where prod isolation matters:
#   envs/
#     dev/     main.tf (backend "s3" key=dev/...)   dev.tfvars     -> AWS acct 111
#     staging/ main.tf (backend "s3" key=staging/…) staging.tfvars -> AWS acct 222
#     prod/    main.tf (backend "s3" key=prod/...)  prod.tfvars    -> AWS acct 333
#   modules/   vpc/  app/  db/     <- shared, versioned, called by each env
# each env: own state, own creds, own CI job, own approval gate. you 'cd envs/prod'
# to touch prod - explicit. prod can pin an older module version mid-migration.
# workspaces are still fine for ephemeral/preview envs that are cheap and identical.`,
        why: 'Workspaces give you separate state per environment but nothing else is separated: the backend, the provider credentials, and the checked-out code are shared across every workspace. For environments that are cheap, short-lived, and genuinely identical — per-branch preview environments, for instance — that is fine and convenient. For production, it is a set of risks. Switching workspace is a stateful CLI action that is easy to forget, so an \`apply\` meant for dev lands on prod. The shared credentials mean a compromised pipeline or an over-broad IAM role touches every environment. Conditional logic keyed on \`terraform.workspace\` puts prod-specific behaviour in the same code path as dev, where a bug in the condition reaches prod. And because there is one code version, prod cannot be held on a known-good module version while a risky change is validated in staging. A directory per environment fixes all of this: each environment is a small root module with its own backend, its own \`.tfvars\`, ideally its own cloud account, and its own CI job and approval rules, all sharing the same versioned child modules. Touching production means \`cd envs/prod\` — explicit and hard to do by accident.',
        whyHi: 'Workspaces aapko per environment separate state deते hain par kuch aur separated nahi hai: backend, provider credentials, aur checked-out code har workspace ke across shared hain. Un environments ke liye jo cheap, short-lived, aur genuinely identical hain — per-branch preview environments, jaise — wo theek hai. Production ke liye, ye risks ka ek set hai. Workspace switch karna ek stateful CLI action hai jo bhoolना aasan hai, to ek \`apply\` jo dev ke liye tha prod par land karता hai. Shared credentials ka matlab ek compromised pipeline har environment ko touch karता hai. \`terraform.workspace\` par keyed conditional logic prod-specific behaviour ko dev ke same code path mein daalता hai. Ek directory per environment ye sab fix karता hai: har environment apne backend, apne \`.tfvars\`, ideally apne cloud account ke saath ek small root module hai.',
      },
    ],

    realWorld: [
      {
        en: '**The merge that reverted a hotfix** — a PR\'s plan was clean; it merged four days later. In between, an incident hotfix was applied by hand. The merge job ran a bare \`terraform apply\`, which re-planned and quietly reverted the hotfix. The outage recurred. Switched to \`plan -out\` on the PR, \`apply tf.plan\` on merge — a stale plan now blocks the apply and forces a re-review.',
        hi: '**Wo merge jisne ek hotfix revert kiya** — ek PR ka plan clean tha; ye chaar din baad merge hua. Beech mein, ek incident hotfix haath se apply hua. Merge job ne ek bare \`terraform apply\` chalाया, jisne re-plan kiya aur chupke se hotfix revert kiya. \`plan -out\` PR par, \`apply tf.plan\` merge par switch kiya.',
      },
      {
        en: '**\`-target\` in the deploy script for a year** — the pipeline had \`terraform apply -target=module.app\` "to keep deploys fast". A new hire ran a full \`terraform apply\` and got a 200-line plan: a year of deferred networking, IAM and DNS changes. Untangled over a week. Now the app is its own configuration with its own state.',
        hi: '**Ek saal ke liye deploy script mein \`-target\`** — pipeline mein \`terraform apply -target=module.app\` tha "deploys fast rakhne ke liye". Ek naya hire ne ek full \`terraform apply\` chalाya aur ek 200-line plan mila: ek saal ke deferred changes. Ab app apni configuration hai apni state ke saath.',
      },
      {
        en: '**Wrong workspace, real money** — an engineer meant to destroy a \`dev\` sandbox, was actually on the \`prod\` workspace (shared config), and ran \`terraform destroy\`. The protection rule was on the pipeline, not the CLI. Rebuilt from state backups in ~3 hours. Prod moved to \`envs/prod/\` in a separate account with no destroy permission for humans.',
        hi: '**Galat workspace, real paisa** — ek engineer ne ek \`dev\` sandbox destroy karने ka socha, actually \`prod\` workspace par tha (shared config), aur \`terraform destroy\` chalाया. Protection rule pipeline par thi, CLI par nahi. Prod ek separate account mein \`envs/prod/\` mein move hua.',
      },
    ],

    interviewQA: [
      {
        q: 'Describe a safe CI pipeline for terraform, and explain why applying a saved plan file matters.',
        qHi: 'Terraform ke liye ek safe CI pipeline describe karo, aur samjhao ek saved plan file apply karna kyun matter karता hai.',
        a: 'On every push to a branch or pull request, the pipeline runs read-only checks that need no credentials and change nothing: \`terraform fmt -check\` for consistent formatting, \`terraform init\` with the shared backend and committed provider lock, and \`terraform validate\` for internal consistency. Then \`terraform plan -out=tf.plan\`, and the rendered plan is posted to the pull request so review covers what terraform will actually do, not just the HCL diff. A policy check can run against the plan JSON here and hard-fail dangerous changes before a human even looks. On merge to main, the pipeline runs \`terraform apply tf.plan\` — the exact saved plan — gated behind an environment protection rule requiring a second approver. Applying the saved plan file matters because a bare \`terraform apply\` re-plans at apply time. The plan a reviewer approved and the plan that runs on merge would then be separate computations, separated by however long the PR was open, during which state can drift, a hotfix can be applied, a data source can return a new value, or a provider can be upgraded. The merge-time apply silently folds all of that in and can revert or rebuild things nobody reviewed. \`plan -out\` freezes the action set; \`apply <file>\` executes exactly that or aborts with "saved plan is stale" if state has moved, which forces a fresh plan and review.',
        aHi: 'Ek branch ya PR par har push par, pipeline read-only checks chalाती hai jinhe koi credentials nahi chahiye: \`terraform fmt -check\`, \`terraform init\` shared backend aur committed provider lock ke saath, aur \`terraform validate\`. Phir \`terraform plan -out=tf.plan\`, aur rendered plan PR par posted hota hai taaki review cover kare jo terraform actually karega. Ek policy check yahaan plan JSON ke against chal sakता hai. Main par merge par, pipeline \`terraform apply tf.plan\` chalाती hai — exact saved plan — ek environment protection rule ke peeche gated. Saved plan file apply karna matter karता hai kyunki ek bare \`terraform apply\` apply time par re-plan karता hai. Jo plan ek reviewer ne approve kiya aur jo plan merge par chalता hai phir separate computations honge, jitne bhi samay PR khula raha usse separated. \`plan -out\` action set freeze karता hai; \`apply <file>\` exactly wo execute karता hai ya "saved plan is stale" ke saath abort karता hai.',
      },
      {
        q: 'Workspaces versus a directory per environment — when do you use each?',
        qHi: 'Workspaces versus ek directory per environment — aap har ek kab use karते ho?',
        a: 'Both manage multiple environments from one codebase. Workspaces give you one configuration directory with multiple named states — \`terraform workspace new staging\` creates a separate state, \`terraform.workspace\` in the config lets you vary values per environment. But every workspace shares one backend, one set of provider credentials, and one checked-out code version. That is fine for environments that are cheap, short-lived, and genuinely identical — per-branch preview environments are the canonical fit — and it is quick to set up. A directory per environment means \`envs/dev\`, \`envs/staging\`, \`envs/prod\`, each a small root module with its own backend block, its own tfvars, its own CI job, and ideally its own cloud account, all calling the same shared child modules. Each environment then has separate state, separate credentials, its own blast radius, its own approval rules, and can be pinned to a different module version during a careful rollout. Use workspaces for low-stakes, look-alike environments. Use a directory per environment whenever production needs to be strongly isolated — which is most real setups — because with workspaces a forgotten \`workspace select\`, a shared over-broad credential, or a bug in a \`terraform.workspace\` conditional can all reach production.',
        aHi: 'Dono ek codebase se multiple environments manage karते hain. Workspaces aapko ek configuration directory multiple named states ke saath deते hain. Par har workspace ek backend, ek set of provider credentials, aur ek checked-out code version share karता hai. Wo un environments ke liye theek hai jo cheap, short-lived, aur genuinely identical hain. Ek directory per environment ka matlab \`envs/dev\`, \`envs/staging\`, \`envs/prod\`, har ek apne backend block, apne tfvars, apni CI job, aur ideally apne cloud account ke saath ek small root module. Har environment ki phir separate state, separate credentials, apna blast radius hai. Workspaces low-stakes, look-alike environments ke liye use karo. Ek directory per environment tab use karो jab bhi production ko strongly isolated hona chahiye — jo zyadaatar real setups hai.',
      },
      {
        q: 'How should secrets be handled in terraform, given that state stores them in plaintext?',
        qHi: 'Terraform mein secrets kaise handle hone chahiye, given ki state unhe plaintext mein store karता hai?',
        a: 'The first rule is that a secret never appears as a literal in a \`.tf\` or \`.tfvars\` file that is committed, because that puts it in git history permanently. In rough order of preference: generate the secret inside terraform with \`random_password\` and write it straight into a secret-manager resource like \`aws_secretsmanager_secret_version\`, so it never passes through a variable or a person; or read it at plan time with a \`data\` source such as \`data "aws_secretsmanager_secret_version"\` or \`data "vault_generic_secret"\`, so it is fetched when terraform runs and never stored in config; or, when terraform genuinely needs it as an input, inject it as a \`TF_VAR_\` environment variable from the CI secret store; or, for the rare case where an encrypted secret file must live in the repo, use SOPS or sealed-secrets. But all of these still result in the secret being written into state, because terraform records every attribute it manages. So none of it is safe unless the state backend is encrypted at rest and access-controlled — an S3 bucket with \`encrypt = true\` and a tight policy, Azure Blob with encryption, a managed backend. The \`sensitive = true\` flag on variables and outputs only keeps values out of CLI output and plan text; it does nothing for the state file. Encrypted remote state is the non-negotiable foundation that makes every secret-handling pattern above acceptable.',
        aHi: 'Pehla rule ye hai ki ek secret kabhi ek committed \`.tf\` ya \`.tfvars\` file mein ek literal ke roop mein appear nahi hota, kyunki wo ise git history mein permanently daalता hai. Roughly preference order mein: secret ko terraform ke andar \`random_password\` se generate karo aur ise seedhे ek secret-manager resource mein likho; ya ise plan time par ek \`data\` source se read karo; ya, jab terraform genuinely ise ek input ke roop mein chahिए, ise CI secret store se ek \`TF_VAR_\` env var ke roop mein inject karo; ya, us rare case ke liye jahaan ek encrypted secret file repo mein rehna chahiye, SOPS ya sealed-secrets use karो. Par ye sab abhi bhi secret ko state mein written hone mein result karते hain. To inme se kuch bhi safe nahi hai jab tak state backend encrypted aur access-controlled nahi hai. \`sensitive = true\` flag sirf values ko CLI output aur plan text se bahar rakhता hai; ye state file ke liye kuch nahi karता.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, lay out the terraform CI pipeline stage by stage, and explain precisely why `terraform apply tf.plan` beats a bare `terraform apply` on merge.',
        taskHi: 'Ek comment mein, terraform CI pipeline stage by stage layout karo.',
        hint: 'ON EVERY PUSH TO A BRANCH / PR (read-only, no creds needed, changes nothing): (1) `terraform fmt -check` — canonical formatting, FAILS the build if a file is not formatted; (2) `terraform init` — with the shared backend + committed `.terraform.lock.hcl`; (3) `terraform validate` — config is internally consistent (references resolve, types match); (4) `terraform plan -out=tf.plan` → render it + POST as a PR comment; (5) POLICY CHECKS on the plan JSON (OPA/conftest/Sentinel/checkov/tfsec) — can HARD-FAIL before a human looks. HUMAN reviews THE PLAN in the PR (not just the code diff — a 1-line HCL change can destroy a DB; a big refactor can be 0 changes). Approves, merges. ON MERGE TO MAIN: `terraform apply tf.plan` — the EXACT saved plan — behind an environment protection rule / required second approver (Module 10). WHY THE SAVED PLAN: a bare `terraform apply` RE-PLANS at apply time. The plan the reviewer approved and the plan that runs on merge are then two different computations, separated by however long the PR sat open — during which state can drift, a hotfix can be applied by hand, a `data` source can return a new value, a provider can be upgraded. The merge-time apply silently folds all that in → it can revert the hotfix, rebuild resources, destroy things nobody reviewed. `plan -out=f` FREEZES the exact action set; `apply f` executes precisely those or ABORTS with "Saved plan is stale" if state moved → forces a fresh plan + re-review. The apply is then provably the reviewed thing.',
        hintHi: 'HAR PUSH PAR (read-only, koi creds nahi, kuch nahi badalta): (1) `terraform fmt -check` — FAILS agar file formatted nahi; (2) `terraform init` — shared backend + committed lock; (3) `terraform validate` — config internally consistent; (4) `terraform plan -out=tf.plan` → render + PR comment ke roop mein POST; (5) plan JSON par POLICY CHECKS — HARD-FAIL kar sakte hain. HUMAN PR mein PLAN review karta hai. Merge par: `terraform apply tf.plan` — EXACT saved plan — environment protection rule ke peeche. SAVED PLAN KYUN: bare `terraform apply` apply time par RE-PLAN karta hai. Reviewer ka plan aur merge par chalne wala plan do alag computations, PR ke khule rehne se separated — state drift, haath se hotfix, naya data source value. `plan -out=f` action set FREEZE karta hai; `apply f` exactly wo execute karta hai ya "Saved plan is stale" ke saath ABORT.',
      },
      {
        task: 'In a comment, explain the plan-as-JSON (`terraform show -json`) and give three concrete policy rules a check could enforce; and explain why `-target` must never be in a pipeline.',
        taskHi: 'Ek comment mein, plan-as-JSON samjhao aur teen concrete policy rules do.',
        hint: '`terraform show -json tf.plan` → the plan as JSON. Key part: `resource_changes[]`, each with an `address` and a `change` object: `.change.actions` = `["create"]` / `["update"]` / `["delete"]` / `["delete","create"]` (a REPLACE) / `["no-op"]`, plus `.change.before` and `.change.after` attribute maps. A POLICY ENGINE (Open Policy Agent + `conftest`, HashiCorp Sentinel on TFC/TFE, `checkov`, `tfsec`/Trivy) reads this and fails the pipeline ON THE PR — before a human reviews. THREE CONCRETE RULES: (1) no plan may `delete` (or `delete,create`) a resource whose tags include `stateful = true` — unless the PR carries a `DATA-LOSS-OK` label; (2) no `aws_security_group_rule` / `ingress` block in `.change.after` may have `cidr_blocks` containing `0.0.0.0/0` on port 22 or 3389; (3) every `aws_s3_bucket` in `.change.after` must have encryption + `block_public_access` all true; (also: total destroys ≤ N without an override; no resource created without a `CostCenter` tag; only approved instance types). WHY `-target` IS NEVER IN A PIPELINE: `terraform apply -target=aws_x.y` applies ONLY that resource + what it depends on, skipping the rest of the config. It breaks terraform\'s core guarantee that state reflects the WHOLE config: after a targeted apply some resources match `main.tf` and others are frozen, with no record that state is partial; changes that depend on things OUTSIDE the target are silently skipped. Baked into CI it is corrosive — every run leaves more unapplied, drift accumulates invisibly, then a normal full apply surfaces dozens of deferred (sometimes dangerous) changes at once. It is a by-hand emergency tool (unstick a half-failed apply), used ONCE, followed IMMEDIATELY by a full `plan` + `apply` to reconcile. If parts must deploy independently → SPLIT into separate configs with separate state, don\'t fake it with `-target`.',
        hintHi: '`terraform show -json tf.plan` → plan JSON ke roop mein. Key: `resource_changes[]`, har ek `address` + `change` object ke saath: `.change.actions` = `["create"]` / `["update"]` / `["delete"]` / `["delete","create"]` (REPLACE), plus `.change.before`/`.change.after`. Ek POLICY ENGINE (OPA + `conftest`, Sentinel, `checkov`, `tfsec`) ise padhta hai aur pipeline PR PAR fail karta hai. TEEN RULES: (1) koi plan `stateful` tagged resource `delete` nahi kar sakta bina `DATA-LOSS-OK` label ke; (2) koi SG rule port 22 par `0.0.0.0/0` nahi khol sakta; (3) har S3 bucket encrypted + public access blocked hona chahiye. `-target` KABHI PIPELINE MEIN NAHI: ye SIRF us resource + dependencies apply karta hai, baaki config skip. State partial ho jaata hai bina record ke. Ek by-hand emergency tool, EK BAAR use, phir TURANT full `plan` + `apply`.',
      },
      {
        task: 'In a comment, compare workspaces and directory-per-environment on state, credentials, code version, blast radius and approval — and state which to use for preview envs versus production.',
        taskHi: 'Ek comment mein, workspaces aur directory-per-environment ka comparison karo.',
        hint: 'WORKSPACES: one config dir, multiple named states. `terraform workspace new staging` → a separate state under `terraform.tfstate.d/staging/` (or a keyed path in the remote backend); `terraform workspace select staging` switches; `terraform.workspace` in the config varies values (`replicas = local.by_env[terraform.workspace]`). SHARED across ALL workspaces: ONE backend, ONE set of provider credentials, ONE checked-out code version at a time. Blast radius: a bug in the shared config or a `terraform.workspace` conditional hits every env; a forgotten `workspace select` applies to the wrong env. Approval: one pipeline, hard to gate per-env. Cheap, fast to set up. DIRECTORY-PER-ENV: `envs/dev/`, `envs/staging/`, `envs/prod/` — each a THIN root module with its OWN `backend` block + its own `.tfvars` + its own CI job, all calling the SAME shared, versioned `modules/`. Per env: SEPARATE state, SEPARATE credentials (prod in its own cloud account), SEPARATE blast radius, SEPARATE approval gate, and prod can be PINNED to an older module version mid-rollout while staging tests the new one. Cost: more boilerplate. USE WORKSPACES FOR: ephemeral / per-branch PREVIEW environments — cheap, short-lived, genuinely identical, low stakes. USE DIRECTORY-PER-ENV FOR: anything where PRODUCTION must be strongly isolated (which is most serious setups) — because with workspaces a forgotten select, a shared over-broad credential, or a conditional bug all reach prod, and a CLI `terraform destroy` on the wrong workspace bypasses a pipeline-only protection rule.',
        hintHi: 'WORKSPACES: ek config dir, multiple named states. `terraform workspace new staging` → separate state; `terraform.workspace` config mein values vary karta hai. SAARE workspaces ke across SHARED: EK backend, EK set of credentials, EK code version. Blast radius: shared config mein ek bug har env ko hit karta hai; bhoola hua `workspace select` galat env par apply. Sasta. DIRECTORY-PER-ENV: `envs/dev/`, `envs/staging/`, `envs/prod/` — har ek apne `backend` block + `.tfvars` + CI job ke saath, sab SAME shared `modules/` call karte. Per env: SEPARATE state, credentials (prod apne account mein), blast radius, approval gate. WORKSPACES FOR: ephemeral / per-branch PREVIEW envs. DIRECTORY-PER-ENV FOR: jahaan bhi PRODUCTION strongly isolated hona chahiye (zyadaatar serious setups).',
      },
    ],

    keyTakeaways: [
      'TERRAFORM CI: on every push — `fmt -check`, `init`, `validate`, `plan -out=tf.plan` posted to the PR, policy checks on the plan JSON (can hard-fail). Human reviews THE PLAN, not just the code. On merge to main — `terraform apply tf.plan` (the exact saved plan) behind an environment protection rule / second approver.',
      'A bare `terraform apply` RE-PLANS at apply time, so it can apply something the reviewer never saw (state drifted, a hotfix landed, a data source changed, a provider upgraded). `plan -out=f` freezes the action set; `apply f` runs exactly that or aborts "Saved plan is stale" → forces a re-plan and re-review.',
      'THE PLAN IS DATA: `terraform show -json tf.plan` → `resource_changes[].change.actions` (`["delete","create"]` = replace). A policy engine (OPA/conftest, Sentinel, checkov, tfsec) fails the PR on rules HCL cannot express — no delete of a `stateful` resource, no SG rule to `0.0.0.0/0`, no unencrypted bucket.',
      '`-target` applies only one resource + its deps, leaving state PARTIALLY applied with no record — corrosive in a pipeline (drift accumulates invisibly). It is a by-hand emergency tool used ONCE, then a full `plan`+`apply` to reconcile. If parts must deploy independently, SPLIT the config into separate state.',
      'ENVIRONMENTS: WORKSPACES = one config, separate state per env, but SHARED backend + credentials + code version → good only for cheap, identical, low-stakes (preview) envs. DIRECTORY-PER-ENV (`envs/dev|staging|prod`, each own backend + tfvars + CI, shared modules) → separate state, credentials, blast radius, approval → use whenever prod must be isolated. SECRETS: never a literal in committed `.tf`/`.tfvars`; prefer `random_password` → secret-manager resource, or a `data` source at plan time, or `TF_VAR_` from the CI store; all land in STATE so the encrypted backend (Lesson 3) is mandatory.',
    ],
    keyTakeawaysHi: [
      'TERRAFORM CI: har push par — `fmt -check`, `init`, `validate`, `plan -out=tf.plan` PR par posted, plan JSON par policy checks (hard-fail kar sakte hain). Human PLAN review karta hai, sirf code nahi. Main par merge par — `terraform apply tf.plan` (exact saved plan) ek environment protection rule / doosre approver ke peeche.',
      'Ek bare `terraform apply` apply time par RE-PLAN karta hai, to ye kuch apply kar sakta hai jo reviewer ne kabhi nahi dekha (state drift, ek hotfix, ek data source badla, ek provider upgrade). `plan -out=f` action set freeze karta hai; `apply f` exactly wo chalata hai ya "Saved plan is stale" ke saath abort → re-plan aur re-review force.',
      'PLAN DATA HAI: `terraform show -json tf.plan` → `resource_changes[].change.actions` (`["delete","create"]` = replace). Ek policy engine (OPA/conftest, Sentinel, checkov, tfsec) PR ko rules par fail karta hai jo HCL express nahi kar sakta — koi `stateful` resource delete nahi, koi SG rule `0.0.0.0/0` ko nahi, koi unencrypted bucket nahi.',
      '`-target` sirf ek resource + iski deps apply karta hai, state ko PARTIALLY applied chhodta hua bina record ke — ek pipeline mein corrosive. Ye ek by-hand emergency tool hai EK BAAR use, phir ek full `plan`+`apply` reconcile ke liye. Agar parts independently deploy karne chahiye, config ko separate state mein SPLIT karo.',
      'ENVIRONMENTS: WORKSPACES = ek config, per env separate state, par SHARED backend + credentials + code version → sirf cheap, identical, low-stakes (preview) envs ke liye achha. DIRECTORY-PER-ENV → separate state, credentials, blast radius, approval → jab bhi prod isolated hona chahiye use karo. SECRETS: kabhi committed `.tf`/`.tfvars` mein ek literal nahi; `random_password` → secret-manager resource, ya ek `data` source plan time par, ya CI store se `TF_VAR_` prefer karo; sab STATE mein land karte hain to encrypted backend (Lesson 3) mandatory hai.',
    ],
  },

  {
    slug: 'ops-immutable-infrastructure-golden-images-and-provisioning',
    title: 'Immutable Infrastructure, Golden Images & Provisioning',
    titleHi: 'Immutable Infrastructure, Golden Images Aur Provisioning',
    description:
      'The principle that a running server is never modified after it is created — to change it you build a new image and replace the server. Golden images baked with Packer, boot-time configuration with cloud-init, the cattle-not-pets mindset, and where Ansible still fits. Concrete on AWS (AMI + launch template + Auto Scaling group) and Azure (image + VM Scale Set), plus a note on OpenTofu and Terragrunt.',
    descriptionHi:
      'Ye principle ki ek running server ko banane ke baad kabhi modify nahi kiya jaता — ise badalne ke liye aap ek naya image banाते ho aur server replace karते ho. Packer se baked golden images, cloud-init se boot-time configuration, cattle-not-pets mindset, aur Ansible abhi kahaan fit hota hai. AWS par concrete (AMI + launch template + Auto Scaling group) aur Azure par (image + VM Scale Set), plus OpenTofu aur Terragrunt par ek note.',
    difficulty: 'MEDIUM',
    duration: 22,
    order: 6,

    analogy: {
      en: '**Rental cars versus the family car.** The family car is a pet: you know its quirks, you top up the oil it burns, you know the trick to the sticky door, and if it dies you are stranded because nothing else has your exact setup. A rental fleet is cattle: every car is built to one spec, and if one has a problem you do not diagnose it — you drop it off and take an identical one. Immutable infrastructure runs servers like the rental fleet. You never "fix" a running server; if it misbehaves you terminate it and the group brings up a fresh one from the same image. To roll out a change you build a new spec (a new image) and cycle the fleet through it.',
      hi: '**Rental cars versus family car.** Family car ek pet hai: aap iski quirks jaanते ho, jo oil ye burn karती hai aap top up karते ho, sticky door ka trick jaanते ho, aur agar ye mar jaaye aap stranded ho kyunki kuch aur ke paas aapka exact setup nahi. Ek rental fleet cattle hai: har car ek spec par built hai, aur agar ek mein problem hai aap ise diagnose nahi karते — aap ise drop off karते ho aur ek identical le lete ho. Immutable infrastructure servers ko rental fleet ki tarah chalाती hai. Aap ek running server kabhi "fix" nahi karते; agar ye misbehave karता hai aap ise terminate karते ho aur group ek fresh wala same image se laता hai. Ek change roll out karने ke liye aap ek naya spec (ek naya image) banाते ho aur fleet ko iske through cycle karते ho.',
    },

    simple: `**MUTABLE (old way):** provision a server once, then keep changing it in place —
SSH in, run \`apt upgrade\`, edit config, deploy new code onto the same box, for years.
Every server drifts to a unique snowflake state nobody can reproduce ("works on
box 3, not box 7 — why?"). This is the CONFIGURATION DRIFT problem (Module 1).

**IMMUTABLE:** a server is **never changed after creation**. To change anything —
a package, a config, the app version, the OS — you **build a new image** and
**replace** the running servers with fresh ones from it. Servers are disposable.
\`\`\`
mutable    build box -> [ patch, patch, deploy, patch, tweak ... ] -> mystery box
immutable  build IMAGE v1 -> run N copies.  need a change? build IMAGE v2 ->
           roll the fleet: kill a v1, start a v2, repeat.  every box is identical
           and reproducible. rollback = roll back to the v1 image.
\`\`\`

**GOLDEN IMAGE** — a machine image with the OS, runtime, agents, hardening and
(often) the app baked in, built ONCE in CI, then booted many times.
- **Packer** (HashiCorp) — \`packer build\` takes a base image + provisioning steps
  (shell, Ansible) -> a versioned AMI / Azure Managed Image / GCP image / Docker image / OVA.
- Boot is then FAST (nothing to install) and DETERMINISTIC (every boot identical).

**CLOUD-INIT / USER-DATA** — the small bit of per-instance config that can't be
baked: inject secrets/config at boot, register with a load balancer, pull the exact
app version. \`templatefile()\` renders it from variables. AWS \`user_data\`,
Azure \`custom_data\` (base64), GCP \`metadata.user-data\`. Keep it SMALL — heavy
logic here means slow, fragile boots; bake instead.

**THE CLOUD SHAPE (concrete):**
\`\`\`
AWS    Packer -> AMI ->  aws_launch_template (ami, user_data) ->  aws_autoscaling_group
       deploy = new AMI -> new launch template version -> instance refresh (rolling)
AZURE  Packer -> Azure Compute Gallery image ->  azurerm_orchestrated_virtual_machine_scale_set
       deploy = new image version -> VMSS rolling upgrade
\`\`\`

**ANSIBLE** — push-based (SSH, agentless), idempotent modules, imperative-ish.
Immutable infra reduces its role, but it still fits: BUILDING golden images (as a
Packer provisioner), configuring things that aren't cattle (on-prem, network gear,
databases), and one-off orchestration. It is NOT a substitute for a real IaC tool
for cloud resources.

**OpenTofu** — the open-source (MPL) fork of Terraform after the 2023 licence
change; near drop-in, same HCL, community-governed. **Terragrunt** — a wrapper that
DRYs up backend/provider config and \`for_each\`-es over many env directories.`,

    simpleHi: `**MUTABLE (purana tarika):** ek server ek baar provision karo, phir ise in place
badalte raho — SSH in, \`apt upgrade\`, config edit, same box par naya code deploy,
saalon ke liye. Har server ek unique snowflake state par drift hota hai jise koi
reproduce nahi kar sakта. Ye CONFIGURATION DRIFT problem hai (Module 1).

**IMMUTABLE:** ek server ko **creation ke baad kabhi nahi badla jaता**. Kuch bhi
badalne ke liye — ek package, ek config, app version, OS — aap ek **naya image
banाते ho** aur running servers ko iske se fresh walon se **replace** karते ho.
Servers disposable hain.
\`\`\`
mutable    box banao -> [ patch, patch, deploy, patch, tweak ... ] -> mystery box
immutable  IMAGE v1 banao -> N copies chalao.  change chahiye? IMAGE v2 banao ->
           fleet roll karo: ek v1 kill, ek v2 start, repeat.  har box identical
           aur reproducible. rollback = v1 image par roll back.
\`\`\`

**GOLDEN IMAGE** — OS, runtime, agents, hardening aur (aksar) app baked ke saath
ek machine image, CI mein EK BAAR built, phir kई baar booted.
- **Packer** (HashiCorp) — \`packer build\` ek base image + provisioning steps leता
  hai -> ek versioned AMI / Azure Managed Image / GCP image / Docker image.
- Boot phir FAST hai (install karne ko kuch nahi) aur DETERMINISTIC.

**CLOUD-INIT / USER-DATA** — per-instance config ka wo chhota bit jo baked nahi ho
sakta: boot par secrets/config inject karo, ek load balancer se register karो, exact
app version pull karो. \`templatefile()\` ise variables se render karता hai. AWS
\`user_data\`, Azure \`custom_data\` (base64), GCP \`metadata.user-data\`. Ise CHHOTA
rakho — yahaan heavy logic ka matlab slow, fragile boots; bake karo instead.

**CLOUD SHAPE (concrete):**
\`\`\`
AWS    Packer -> AMI ->  aws_launch_template (ami, user_data) ->  aws_autoscaling_group
       deploy = naya AMI -> naya launch template version -> instance refresh (rolling)
AZURE  Packer -> Azure Compute Gallery image ->  azurerm_orchestrated_virtual_machine_scale_set
       deploy = naya image version -> VMSS rolling upgrade
\`\`\`

**ANSIBLE** — push-based (SSH, agentless), idempotent modules, imperative-ish.
Immutable infra iska role kam karता hai, par ye abhi bhi fit hota hai: golden
images BUILD karना (ek Packer provisioner ke roop mein), cheezen configure karना
jo cattle nahi hain (on-prem, network gear, databases), aur one-off orchestration.
Ye cloud resources ke liye ek real IaC tool ka substitute NAHI hai.

**OpenTofu** — 2023 licence change ke baad Terraform ka open-source (MPL) fork;
near drop-in, same HCL, community-governed. **Terragrunt** — ek wrapper jo
backend/provider config DRY karता hai aur kई env directories par \`for_each\` karता hai.`,

    content: `## Mutable versus immutable

The traditional way to run a server is **mutable**: you provision it once, and from then on you change it in place — log in and patch packages, edit configuration files, deploy new application code onto the same machine, tune kernel settings during an incident. Over months and years each server accumulates a unique history of changes, and no two are exactly alike. This is **configuration drift** (Module 1): the reason a bug reproduces on server 7 but not server 3 is that server 7 had a manual change in 2022 that nobody recorded. Rebuilding a mutable server from scratch is frightening because nobody knows the full set of changes that made it work.

**Immutable infrastructure** takes the opposite stance: a server is never modified after it boots. To change *anything* — a package version, a config value, the application, the operating system, a security patch — you build a **new image** with that change and replace the running servers with fresh instances launched from the new image. A running server is disposable; if it misbehaves you terminate it and let the platform launch a replacement from the known image rather than debugging it in place.

The payoff: every server is byte-identical and reproducible, drift is impossible (there is no in-place change to drift), rollback is just redeploying the previous image, and scaling out means launching more copies of a known-good thing. The cost: you need an image build pipeline, and changes take an image build plus a fleet roll rather than an \`ssh\` and an \`apt install\`.

## Golden images and Packer

A **golden image** is a machine image with everything baked in: the OS at a known patch level, the language runtime, monitoring and logging agents, security hardening, and often the application itself. It is built **once** in CI and booted **many** times.

**Packer** (HashiCorp) is the standard tool. A Packer template names a **base image** (an official Ubuntu AMI, say), a **builder** (the target — \`amazon-ebs\`, \`azure-arm\`, \`googlecompute\`, \`docker\`, \`vmware\`), and **provisioners** — shell scripts, or an Ansible playbook — that run against a temporary instance. \`packer build\` launches the temporary instance, runs the provisioners, snapshots the result into a versioned image, and tears the instance down. The output is an AMI id / Azure image version / GCP image name that you feed into terraform.

Because the image already contains everything, boot is **fast** (nothing to download or compile) and **deterministic** (every instance from image \`v42\` is exactly the same). Contrast with configuring at boot time, where a slow package mirror or a transient failure makes one instance in fifty come up subtly wrong.

## Cloud-init and user-data

A few things genuinely cannot be baked because they differ per instance or per launch: injecting an instance-specific secret or config, registering with the right load balancer target group, or pulling the exact application version this deployment wants. That goes in **user-data** (AWS), **custom_data** (Azure, base64-encoded), or the **user-data** metadata key (GCP) — a script or a cloud-init document the instance runs on first boot. In terraform you build it with \`templatefile()\`, rendering a template file with variables.

Keep it small. Every line of boot-time logic is a chance for a boot to be slow or to fail, and it runs on every single instance launch including autoscaling events at 3am. If you find substantial configuration happening in user-data, that is a signal to move it into the image.

## The cloud shape, concretely

**On AWS**: Packer produces an **AMI**. Terraform defines an \`aws_launch_template\` referencing that AMI id and the user-data, and an \`aws_autoscaling_group\` that uses the launch template to run N instances across availability zones, behind a target group on a load balancer. Deploying a change means: Packer builds a new AMI, terraform updates the launch template to a new version, and an **instance refresh** on the Auto Scaling group rolls the fleet — terminating old instances and launching new ones from the new template, a few at a time, respecting a minimum healthy percentage. This is a rolling deployment (Module 11) at the infrastructure layer.

**On Azure**: Packer produces an image published to an **Azure Compute Gallery** (formerly Shared Image Gallery), versioned and optionally replicated across regions. Terraform defines an \`azurerm_orchestrated_virtual_machine_scale_set\` (or the older \`azurerm_linux_virtual_machine_scale_set\`) referencing the gallery image version. Deploying means publishing a new image version and triggering a **rolling upgrade** on the scale set, which cycles instances to the new version in batches with health checks between them.

**On GCP** the equivalent is a custom image, an instance template, and a managed instance group with a rolling update policy.

In all three, \`create_before_destroy\` on the terraform resource, or the platform\'s native rolling-update mechanism, ensures new capacity is healthy before old capacity is removed.

## Where Ansible fits

**Ansible** is a configuration-management tool: push-based (it connects over SSH, no agent on the target), with a large library of idempotent modules, and playbooks that are more imperative than terraform\'s declarative model. In a fully immutable cloud setup its role shrinks, but it does not vanish:

- **Building images**: Ansible is a common Packer provisioner — Packer boots a temporary instance, Ansible configures it, Packer snapshots it.
- **Things that are not cattle**: on-premises servers, network devices, appliances, databases that must be configured in place rather than replaced.
- **Orchestration and one-off tasks**: run a command across a fleet, perform a coordinated multi-step operation.

What Ansible is *not* is a replacement for terraform when provisioning cloud resources — it has cloud modules, but it lacks a real state model and plan, so managing a VPC or an RDS instance with Ansible gives up the safety terraform provides.

## OpenTofu and Terragrunt

**OpenTofu** is the open-source fork of Terraform created after HashiCorp changed Terraform\'s licence from MPL to the Business Source License in 2023. It is under the Linux Foundation, community-governed, and stays close to drop-in compatible — same HCL, same providers, \`tofu\` instead of \`terraform\`. Organisations that need a genuinely open-source licence, or want community governance, use it; the concepts in this module are identical either way.

**Terragrunt** is a thin wrapper around terraform (or tofu) that addresses two pain points in large setups: it keeps backend and provider configuration DRY by generating it from one place instead of repeating it in every environment directory, and it can run terraform across many directories at once with dependency ordering between them. It is useful when a directory-per-environment layout has grown to dozens of components; smaller setups do not need it.`,

    contentHi: `## Mutable versus immutable

Ek server chalाने ka traditional tarika **mutable** hai: aap ise ek baar provision karте ho, aur us se aage ise in place badalते ho — login karके packages patch karो, config files edit karो, same machine par naya application code deploy karो, ek incident ke dauraan kernel settings tune karो. Mahinon aur saalon mein har server changes ka ek unique history accumulate karता hai. Ye **configuration drift** hai (Module 1). Ek mutable server ko scratch se rebuild karना frightening hai kyunki koi nahi jaanता changes ka poora set jisne ise kaam karवाया.

**Immutable infrastructure** opposite stance leता hai: ek server boot hone ke baad kabhi modify nahi hota. *Kuch bhi* badalne ke liye — ek package version, ek config value, application, OS, ek security patch — aap us change ke saath ek **naya image** banाते ho aur running servers ko naye image se launched fresh instances se replace karते ho. Ek running server disposable hai.

Payoff: har server byte-identical aur reproducible hai, drift impossible hai, rollback bas previous image redeploy karना hai. Cost: aapko ek image build pipeline chahिए, aur changes ek image build plus ek fleet roll leते hain.

## Golden images aur Packer

Ek **golden image** ek machine image hai sab kuch baked ke saath: ek known patch level par OS, language runtime, monitoring aur logging agents, security hardening, aur aksar application khud. Ye CI mein **ek baar** built hai aur **kई** baar booted.

**Packer** (HashiCorp) standard tool hai. Ek Packer template ek **base image** name karता hai, ek **builder** (target — \`amazon-ebs\`, \`azure-arm\`, \`googlecompute\`, \`docker\`), aur **provisioners** — shell scripts, ya ek Ansible playbook. \`packer build\` temporary instance launch karता hai, provisioners chalाता hai, result ko ek versioned image mein snapshot karता hai, aur instance tear down karता hai.

Kyunki image mein already sab kuch hai, boot **fast** hai aur **deterministic** hai.

## Cloud-init aur user-data

Kuch cheezen genuinely baked nahi ho sakती kyunki wo per instance ya per launch alag hain: ek instance-specific secret inject karना, sahi load balancer target group se register karना, ya exact application version pull karना. Wo **user-data** (AWS), **custom_data** (Azure, base64-encoded), ya **user-data** metadata key (GCP) mein jaता hai. Terraform mein aap ise \`templatefile()\` se build karте ho.

Ise chhota rakho. Boot-time logic ki har line ek boot ke slow ya fail hone ka ek chance hai, aur ye har single instance launch par chalती hai.

## Cloud shape, concretely

**AWS par**: Packer ek **AMI** produce karता hai. Terraform ek \`aws_launch_template\` define karता hai us AMI id aur user-data ko reference karता hua, aur ek \`aws_autoscaling_group\`. Ek change deploy karने ka matlab: Packer ek naya AMI banाता hai, terraform launch template ko ek naye version par update karता hai, aur Auto Scaling group par ek **instance refresh** fleet roll karता hai.

**Azure par**: Packer ek image produce karता hai jo ek **Azure Compute Gallery** mein published hai. Terraform ek \`azurerm_orchestrated_virtual_machine_scale_set\` define karता hai. Deploy karने ka matlab ek naya image version publish karना aur scale set par ek **rolling upgrade** trigger karना.

**GCP par** equivalent ek custom image, ek instance template, aur ek rolling update policy ke saath ek managed instance group hai.

## Ansible kahaan fit hota hai

**Ansible** ek configuration-management tool hai: push-based (ye SSH par connect karता hai), idempotent modules ki ek badी library ke saath. Ek fully immutable cloud setup mein iska role shrink karता hai, par ye vanish nahi hota:
- **Images build karना**: Ansible ek common Packer provisioner hai.
- **Cheezen jo cattle nahi hain**: on-premises servers, network devices, databases jo in place configure hone chahिए.
- **Orchestration aur one-off tasks**.

Jo Ansible *nahi* hai wo cloud resources provision karते samay terraform ka replacement hai.

## OpenTofu aur Terragrunt

**OpenTofu** Terraform ka open-source fork hai jo HashiCorp dwara 2023 mein Terraform ka licence MPL se Business Source License mein change karने ke baad banaya gaya. Ye Linux Foundation ke tahat hai, community-governed, aur drop-in compatible ke kareeb rehता hai.

**Terragrunt** terraform (ya tofu) ke aas-paas ek thin wrapper hai jo badे setups mein do pain points address karता hai: ye backend aur provider configuration ko DRY rakhता hai, aur ye terraform ko ek saath kई directories ke across chala sakता hai unke beech dependency ordering ke saath.`,

    examples: [
      {
        title: 'templatefile(): rendering per-instance boot config (AWS user_data / Azure custom_data)',
        titleHi: 'templatefile(): per-instance boot config render karna (AWS user_data / Azure custom_data)',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
export TF_CLI_ARGS=-no-color

# a cloud-init / user-data template - identical idea on AWS (user_data) and Azure (custom_data)
cat > init.sh.tftpl <<'EOF'
#!/bin/bash
set -euo pipefail
APP_VERSION="\${app_version}"
echo "boot: pulling myapp:\${app_version}" >> /var/log/provision.log
docker run -d --name app -p 80:8080 \\
  %{ for k, v in env ~}
  -e \${k}=\${v} \\
  %{ endfor ~}
  myregistry/myapp:\${app_version}
EOF

cat > main.tf <<'EOF'
terraform {
  required_providers { local = { source = "hashicorp/local", version = "2.9.0" } }
}
variable "app_version" { default = "1.4.2" }

locals {
  user_data = templatefile("\${path.module}/init.sh.tftpl", {
    app_version = var.app_version
    env = {
      LOG_LEVEL = "info"
      REGION    = "us-east-1"
    }
  })
}

# on AWS:   resource "aws_instance" "web" { user_data   = local.user_data ... }
# on Azure: resource "azurerm_linux_virtual_machine" "web" { custom_data = base64encode(local.user_data) ... }
resource "local_file" "rendered" {
  content  = local.user_data
  filename = "\${path.module}/rendered-user-data.sh"
}
output "user_data" { value = local.user_data }
EOF

terraform init -no-color -input=false >/dev/null
terraform apply -no-color -auto-approve >/dev/null

echo "=== the template renders to a concrete boot script (no loops/vars left) ==="
cat rendered-user-data.sh

echo
echo "=== bump app_version -> the rendered text changes -> the instance is REPLACED ==="
terraform plan -no-color -var 'app_version=1.5.0' 2>&1 | grep -E '^  # |forces replacement|^Plan:' | head -4`,
        output: `=== the template renders to a concrete boot script (no loops/vars left) ===
#!/bin/bash
set -euo pipefail
APP_VERSION="1.4.2"
echo "boot: pulling myapp:1.4.2" >> /var/log/provision.log
docker run -d --name app -p 80:8080 \\
    -e LOG_LEVEL=info \\
    -e REGION=us-east-1 \\
    myregistry/myapp:1.4.2

=== bump app_version -> the rendered text changes -> the instance is REPLACED ===
  # local_file.rendered must be replaced
      ~ content              = <<-EOT # forces replacement
Plan: 1 to add, 0 to change, 1 to destroy.`,
        explain: 'A cloud-init style boot script is written as a template file, init.sh.tftpl, with two kinds of placeholder: ${app_version} for a scalar, and a %{ for k, v in env } ... %{ endfor } directive that loops over a map to emit one -e flag per environment variable. In the terraform config, templatefile() renders that template with a data object — the app version from a variable, and an env map of two entries. The rendered result, written out for inspection, is a plain shell script with every placeholder resolved and the loop expanded into two concrete -e lines. On AWS this string goes into an aws_instance user_data or a launch template; on Azure it goes into custom_data base64-encoded. The second part shows the immutable-infrastructure consequence: bumping app_version changes the rendered boot script, and because user-data is part of the instance\'s identity, terraform plans to replace the instance rather than modify it — which on a real launch template plus Auto Scaling group becomes an instance refresh that rolls the fleet onto the new version. You never edit a running box; you change the input, a new image or boot config is produced, and the fleet is cycled.',
        explainHi: 'Ek cloud-init style boot script ek template file ke roop mein likha jaता hai, init.sh.tftpl, do kind ke placeholder ke saath: ${app_version} ek scalar ke liye, aur ek %{ for k, v in env } ... %{ endfor } directive jo ek map par loop karता hai per environment variable ek -e flag emit karने ke liye. Terraform config mein, templatefile() us template ko ek data object ke saath render karता hai. Rendered result ek plain shell script hai har placeholder resolved ke saath aur loop do concrete -e lines mein expanded. AWS par ye string ek aws_instance user_data mein jaता hai; Azure par ye custom_data mein base64-encoded jaता hai. Doosra part immutable-infrastructure consequence dikhाता hai: app_version bump karना rendered boot script badalता hai, aur kyunki user-data instance ki identity ka part hai, terraform instance ko replace karने ka plan karता hai modify karने ke bajaay.',
      },
      {
        title: 'Immutable replace with create_before_destroy: ship a new image, never mutate the old server',
        titleHi: 'create_before_destroy ke saath immutable replace: ek naya image ship karo, purane server ko kabhi mutate mat karo',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"
export TF_CLI_ARGS=-no-color

cat > main.tf <<'EOF'
terraform {
  required_providers { local = { source = "hashicorp/local", version = "2.9.0" } }
}
variable "ami" { default = "ami-1111-app-v1" }   # a GOLDEN IMAGE id (baked by Packer, etc.)

# stand-in for aws_instance / azurerm_linux_virtual_machine: the "server" is defined
# entirely by its image. there is no in-place "ssh in and upgrade" path.
resource "local_file" "server" {
  content  = "running image: \${var.ami}\\n"
  filename = "\${path.module}/server-\${var.ami}.txt"
  lifecycle {
    create_before_destroy = true   # bring the new one up BEFORE tearing the old one down
  }
}
EOF
terraform init -no-color -input=false >/dev/null
terraform apply -no-color -auto-approve >/dev/null
echo "before: \$(ls server-*.txt)"

echo
echo "=== ship a new golden image: change the AMI id ==="
out=\$(terraform apply -no-color -auto-approve -var 'ami=ami-2222-app-v2' 2>&1)
echo "\$out" | grep -E 'must be replaced|^Plan:|Creating\\.\\.\\.|Destroying\\.\\.\\.|Apply complete' \\
  | sed -E 's/ \\[id=[^]]*\\]//; s/\\(deposed object [0-9a-f]+\\)/(deposed object <id>)/'
echo
echo "after:  \$(ls server-*.txt)"
echo
echo "the v1 'server' was never modified - it was destroyed and a v2 built from a"
echo "fresh image took its place (create_before_destroy = the new one first). that is"
echo "IMMUTABLE infrastructure: servers are cattle, not pets; no config drift accumulates."`,
        output: `before: server-ami-1111-app-v1.txt

=== ship a new golden image: change the AMI id ===
  # local_file.server must be replaced
Plan: 1 to add, 0 to change, 1 to destroy.
local_file.server: Creating...
local_file.server (deposed object <id>): Destroying...
Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

after:  server-ami-2222-app-v2.txt

the v1 'server' was never modified - it was destroyed and a v2 built from a
fresh image took its place (create_before_destroy = the new one first). that is
IMMUTABLE infrastructure: servers are cattle, not pets; no config drift accumulates.`,
        explain: 'The "server" is a resource whose entire definition is its image id — a stand-in for an aws_instance whose ami is set from a variable, with no provisioner or in-place mutation path. It has lifecycle { create_before_destroy = true }. The first apply builds the v1 server. Changing the ami variable to v2 forces a replacement, because the image is baked into the resource\'s identity — there is no "update the AMI in place" operation for a running instance. The apply output shows the ordering that create_before_destroy produces: Creating... (the v2 server) comes before Destroying... (the v1, now a "deposed object"), so new healthy capacity exists before the old capacity is removed. After the apply, only the v2 file remains. The v1 server was never patched, reconfigured, or upgraded — it was replaced wholesale by a fresh instance from a new image. On real infrastructure this is exactly what an Auto Scaling group instance refresh or a VM Scale Set rolling upgrade does, a batch at a time across the fleet. Rollback is symmetric: set the variable back to the v1 image and the fleet rolls back to it.',
        explainHi: 'Ek "server" ek resource hai jiska poora definition iski image id hai — ek aws_instance ke liye ek stand-in jiska ami ek variable se set hai, bina provisioner ya in-place mutation path ke. Isme lifecycle { create_before_destroy = true } hai. Pehla apply v1 server banाता hai. ami variable ko v2 mein badalna ek replacement force karता hai, kyunki image resource ki identity mein baked hai — ek running instance ke liye koi "AMI ko in place update karो" operation nahi hai. Apply output wo ordering dikhाता hai jo create_before_destroy produce karता hai: Creating... (v2 server) Destroying... (v1) se pehle aata hai, to naya healthy capacity purane capacity ke hataye jaane se pehle exist karता hai. Apply ke baad, sirf v2 file rehती hai. v1 server kabhi patch, reconfigure, ya upgrade nahi hua — ise ek naye image se ek fresh instance ne wholesale replace kiya. Real infrastructure par ye exactly wahi hai jo ek Auto Scaling group instance refresh karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# "immutable" infra with a heavy provisioner that configures the box at boot
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id      # a PLAIN ubuntu image
  user_data     = <<-EOF
    #!/bin/bash
    apt-get update && apt-get install -y docker.io nginx certbot python3-pip
    pip3 install -r /opt/requirements.txt      # from where? not baked in.
    git clone https://github.com/acme/app /opt/app && cd /opt/app && make build
    # ...60 more lines...
  EOF
}
# every launch: 4-8 minutes of apt + pip + build. one flaky mirror = a broken node
# in the ASG. autoscaling at peak load = new nodes that take 8 min to serve traffic.
# and it's not actually immutable - two launches a week apart get different package
# versions from the upstream repos.`,
        right: `# bake the image with Packer; user_data does only per-instance wiring:
# packer/web.pkr.hcl : ubuntu base -> install docker+nginx+certbot, add the app,
#   harden, install the CloudWatch agent -> output AMI  ami-web-2024-11-03-abc123
resource "aws_instance" "web" {
  ami       = var.web_ami          # the Packer output, pinned per deploy
  user_data = templatefile("\${path.module}/boot.sh.tftpl", {
    app_version = var.app_version   # which already-baked version to activate
    env_name    = var.env
  })
}
# boot.sh.tftpl is ~10 lines: fetch config from SSM, register with the target
# group, 'systemctl start app'. boot is ~20s and identical every time.`,
        why: 'Calling infrastructure "immutable" because it is defined in terraform misses the point — immutability is about the running server never changing, and a server that installs and builds its software at boot is doing exactly the mutation immutability is meant to eliminate, just at boot time instead of later. It is slow: every launch, including every autoscaling event, pays the full install-and-build cost, so new capacity is minutes late to help with the load spike that triggered it. It is fragile: any of the dozens of network fetches — an apt mirror, PyPI, a git host, a container registry — can be slow or down, producing a node that comes up broken or not at all. And it is not even reproducible: the upstream repositories serve newer package versions over time, so two instances launched a week apart from the "same" config are actually running different software. The fix is to bake a golden image with Packer that already contains the OS, the runtime, the agents, the hardening and the application, versioned as an artifact, and reduce user-data to the handful of genuinely per-instance steps — fetch this instance\'s config, join this target group, start the service. Boot then takes seconds and is identical every time.',
        whyHi: 'Infrastructure ko "immutable" kehना kyunki ye terraform mein defined hai point miss karता hai — immutability running server ke kabhi na badalne ke baare mein hai, aur ek server jo boot par apna software install aur build karता hai exactly wo mutation kar raha hai jise immutability eliminate karने ke liye hai. Ye slow hai: har launch full install-and-build cost pay karता hai. Ye fragile hai: dozens network fetches mein se koi bhi slow ya down ho sakता hai. Aur ye reproducible bhi nahi hai: upstream repositories samay ke saath newer package versions serve karते hain. Fix ek golden image Packer se bake karना hai jo already OS, runtime, agents, hardening aur application contain karता hai, ek artifact ke roop mein versioned, aur user-data ko genuinely per-instance steps ke handful tak reduce karना.',
      },
      {
        wrong: `# treating one server as special - SSHing in to "just fix" it during an incident
# 2am incident: node web-7 is throwing OOMs. on-call SSHes in, bumps a JVM heap
# flag in /etc/app/jvm.opts, restarts the service. it recovers. everyone goes back to bed.
# web-7 is now DIFFERENT from web-1..6 and web-8..12. it's a pet.
# next deploy: the ASG instance refresh replaces web-7 with a fresh node from the
# image - which does NOT have the heap fix. the OOMs come back, "randomly", on
# whichever node gets the traffic. nobody connects it to the deploy.`,
        right: `# the fix goes into the IMAGE or its config source, never onto one box:
#   - is it config? put the heap flag in the SSM parameter / config repo that
#     boot.sh.tftpl reads -> every node gets it on next cycle.
#   - is it a package/kernel/AMI thing? new Packer build -> roll the fleet.
# for the IMMEDIATE incident: if you must touch a box, treat that box as
# CONDEMNED - cordon it, take the pressure off, then TERMINATE it (the ASG
# launches a clean replacement) and land the real fix through the pipeline.
# never let a hand-modified node survive into normal rotation.`,
        why: 'The entire value of immutable infrastructure is that every server is identical and reproducible, and that value is destroyed the moment one server is modified by hand. An incident-time SSH fix — bumping a flag, editing a config, restarting with different options — turns that node into a pet: it now behaves differently from its siblings, and nobody has a record of why. The failure is delayed and confusing: the next deployment\'s rolling instance refresh replaces the hand-fixed node with a fresh one built from the unchanged image, the fix silently disappears, and the original symptom returns intermittently on whichever node happens to be handling load, with no obvious connection to the deploy that caused it. The discipline is that fixes go where the fleet is defined: configuration changes into the parameter store or config repository that boot reads, so every node picks them up on the next cycle; package, kernel or base-OS changes into a new Packer image that the fleet is rolled onto. If an incident genuinely requires touching a specific box, that box is treated as condemned — drained of traffic and then terminated so the group replaces it — and the real fix is shipped through the normal pipeline. A hand-modified node is never allowed to persist in normal rotation.',
        whyHi: 'Immutable infrastructure ka poora value ye hai ki har server identical aur reproducible hai, aur wo value us pal destroy ho jaता hai jab ek server haath se modify hota hai. Ek incident-time SSH fix us node ko ek pet mein badल deता hai: ye ab apne siblings se alag behave karता hai, aur kisi ke paas record nahi kyun. Failure delayed aur confusing hai: agle deployment ka rolling instance refresh hand-fixed node ko ek fresh wale se replace karता hai jo unchanged image se built hai, fix silently disappear ho jaता hai, aur original symptom intermittently wapas aata hai. Discipline ye hai ki fixes wahaan jaते hain jahaan fleet defined hai: configuration changes parameter store mein; package ya OS changes ek naye Packer image mein. Agar ek incident genuinely ek specific box ko touch karना require karता hai, wo box condemned treat hota hai.',
      },
      {
        wrong: `# baking secrets or environment-specific values INTO the golden image
# packer/web.pkr.hcl provisioner:
#   echo "DATABASE_URL=postgres://app:PROD_PASSWORD@prod-db/app" > /etc/app/env
#   echo "STRIPE_KEY=sk_live_..." >> /etc/app/env
# now:
#   - the prod DB password is in an AMI. AMIs get shared, copied across accounts,
#     and sit in snapshots forever. it's a credential leak with a long tail.
#   - the image is not reusable across environments - you need a separate build
#     per env, defeating "build once".`,
        right: `# the image is environment-AGNOSTIC. per-env + secret values come in at boot:
# packer: install the app, NO env file, NO secrets.
# boot.sh.tftpl (user_data), running on the instance with an instance role:
#   aws ssm get-parameters-by-path --path "/app/\${env_name}/" --with-decryption \\
#     | jq -r '...' > /etc/app/env          # config + secret refs from SSM/Secrets Manager
#   # OR: the app fetches its own secrets at startup via the instance role
# one image -> dev, staging, prod. secrets never touch the image or terraform state.
# rotating a secret = update SSM, recycle instances. no rebuild.`,
        why: 'A golden image is meant to be built once and run everywhere, which requires it to contain nothing environment-specific — and secrets are the most environment-specific thing there is. Baking a production database password or an API key into an AMI is a serious leak: machine images are routinely shared between accounts, copied to other regions, retained in snapshots long after the instances are gone, and granted broad read access within an organisation, so a credential placed in one has a very long and uncontrolled life. It also breaks the "build once" model, because an image with prod secrets in it cannot be used for staging, so you end up building a separate image per environment and lose the reproducibility guarantee. The correct design keeps the image completely environment-agnostic: it has the application and its runtime and nothing about where it will run. Environment-specific configuration and secrets are supplied at boot — the instance uses its instance role to read a path in AWS Systems Manager Parameter Store or Secrets Manager (or the Azure / GCP equivalents) scoped to its environment, or the application fetches its own secrets at startup using the workload identity. One image serves every environment, secrets never enter the image or terraform state, and rotating a secret is an update to the parameter store followed by an instance recycle, with no rebuild.',
        whyHi: 'Ek golden image ek baar build hone aur har jagah run hone ke liye hai, jiske liye ise kuch bhi environment-specific contain nahi karना chahिए — aur secrets sabse environment-specific cheez hain. Ek production database password ko ek AMI mein bake karना ek serious leak hai: machine images routinely accounts ke beech shared, doosre regions mein copied, snapshots mein retained hote hain instances ke chale jaane ke baad bhi. Ye "build once" model bhi todता hai. Correct design image ko poori tarah environment-agnostic rakhता hai. Environment-specific configuration aur secrets boot par supply hote hain — instance apne instance role ka use ek path AWS Systems Manager Parameter Store ya Secrets Manager mein read karने ke liye karता hai. Ek image har environment ko serve karता hai, secrets kabhi image ya terraform state mein enter nahi karते.',
      },
    ],

    realWorld: [
      {
        en: '**8-minute autoscaling** — a "cloud-native" fleet built plain Ubuntu instances that \`apt install\`ed and \`git clone\`d at boot. Under a traffic spike the ASG added nodes that took eight minutes to serve — by which time the spike had caused an outage. Moved to a Packer AMI (app baked in); boot dropped to ~25 seconds and the same spike was absorbed.',
        hi: '**8-minute autoscaling** — ek "cloud-native" fleet ne plain Ubuntu instances banaye jo boot par \`apt install\` aur \`git clone\` karте the. Ek traffic spike ke tahat ASG ne nodes add kiye jinhe serve karne mein aath minute lage. Ek Packer AMI par move kiya; boot ~25 seconds tak gira.',
      },
      {
        en: '**The heap flag that vanished every deploy** — an on-call SSH fix to a JVM flag on one node fixed an OOM. Every deploy\'s instance refresh wiped it; the OOMs recurred "randomly" for six weeks before someone linked them to deploys. The flag went into the SSM config the boot script reads; problem gone.',
        hi: '**Wo heap flag jo har deploy vanish ho jaता tha** — ek node par ek JVM flag ka ek on-call SSH fix ne ek OOM fix kiya. Har deploy ka instance refresh ise wipe kar deता tha; OOMs chhah hafton ke liye "randomly" wapas aate the. Flag SSM config mein gaya jo boot script read karता hai.',
      },
      {
        en: '**A prod password in a shared AMI** — a golden image had \`/etc/app/env\` with the live DB URL baked in by a Packer provisioner. The AMI was shared to a sandbox account for testing. A secret scan flagged it months later. Rebuilt the image with no env file; config now comes from SSM by instance role at boot.',
        hi: '**Ek shared AMI mein ek prod password** — ek golden image mein \`/etc/app/env\` tha live DB URL ke saath ek Packer provisioner dwara baked. AMI ek sandbox account ko shared kiya gaya. Image bina env file ke rebuild kiya; config ab boot par instance role se SSM se aata hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is immutable infrastructure, and what problem does it solve that mutable servers have?',
        qHi: 'Immutable infrastructure kya hai, aur ye kya problem solve karता hai jo mutable servers ke paas hai?',
        a: 'Immutable infrastructure means a running server is never modified after it boots. To change anything about it — a package, a config value, the application version, the OS, a security patch — you build a new machine image containing that change and replace the running servers with fresh instances launched from the new image. A misbehaving server is terminated and replaced from the known image rather than debugged in place. The problem it solves is configuration drift, which is what mutable servers accumulate: when you provision a server once and then keep changing it in place over months and years — patching, editing config, deploying code, tuning settings during incidents — every server ends up with a unique, unrecorded history, and no two are exactly alike. That is why a bug reproduces on one node and not another, and why rebuilding a working server from scratch is frightening: nobody knows the full set of changes that made it work. Immutable infrastructure eliminates drift structurally, because there is no in-place change to drift. Every server is byte-identical and reproducible, rollback is redeploying the previous image, and scaling out is launching more copies of a known-good artifact. The cost is that you need an image build pipeline and changes take an image build plus a fleet roll rather than a quick SSH.',
        aHi: 'Immutable infrastructure ka matlab hai ek running server boot hone ke baad kabhi modify nahi hota. Iske baare mein kuch bhi badalne ke liye — ek package, ek config value, application version, OS — aap us change ko contain karता hua ek naya machine image banाते ho aur running servers ko naye image se launched fresh instances se replace karते ho. Jo problem ye solve karता hai wo configuration drift hai, jo mutable servers accumulate karते hain: jab aap ek server ek baar provision karते ho aur phir mahinon aur saalon ke liye ise in place badalते raho, har server ek unique, unrecorded history ke saath end hota hai. Isliye ek bug ek node par reproduce hota hai aur doosre par nahi. Immutable infrastructure drift ko structurally eliminate karता hai, kyunki drift karने ke liye koi in-place change nahi hai.',
      },
      {
        q: 'What is a golden image, how does Packer build one, and what belongs in user-data instead of the image?',
        qHi: 'Ek golden image kya hai, Packer ek kaise banाता hai, aur image ke bajaay user-data mein kya belong karता hai?',
        a: 'A golden image is a machine image with everything baked in — the OS at a known patch level, the language runtime, monitoring and logging agents, security hardening, and usually the application itself — built once in CI and booted many times. Packer builds one from a template that names a base image, a builder for the target platform (amazon-ebs, azure-arm, googlecompute, docker), and provisioners: shell scripts or an Ansible playbook. \`packer build\` launches a temporary instance from the base, runs the provisioners against it, snapshots the result into a versioned image, and tears the temporary instance down. The output is an AMI id, an Azure Compute Gallery image version, or a GCP image name that terraform consumes. Because the image already contains everything, boot is fast and deterministic. What belongs in user-data instead of the image is only the genuinely per-instance or per-launch configuration: reading this instance\'s config and secrets from a parameter store using its instance role, registering with the correct load balancer target group, and activating the specific already-baked application version this deployment wants. It should be small — every line of boot logic is a chance for a slow or failed boot, and it runs on every autoscaling event. Substantial work in user-data is a signal to move it into the image. And secrets and environment-specific values must never be baked into the image, which is meant to be environment-agnostic and reused across dev, staging and prod.',
        aHi: 'Ek golden image ek machine image hai sab kuch baked ke saath — ek known patch level par OS, language runtime, monitoring aur logging agents, security hardening, aur aam taur par application khud — CI mein ek baar built aur kई baar booted. Packer ek template se ek banाता hai jo ek base image, target platform ke liye ek builder, aur provisioners name karता hai: shell scripts ya ek Ansible playbook. \`packer build\` base se ek temporary instance launch karता hai, provisioners chalाता hai, result ko ek versioned image mein snapshot karता hai. Jo user-data mein belong karता hai wo sirf genuinely per-instance configuration hai: ek parameter store se is instance ka config aur secrets read karना, sahi load balancer target group se register karना. Ise chhota hona chahिए. Aur secrets kabhi image mein baked nahi hone chahिए.',
      },
      {
        q: 'Where does Ansible fit in an immutable-infrastructure world, and what are OpenTofu and Terragrunt?',
        qHi: 'Ansible ek immutable-infrastructure duniya mein kahaan fit hota hai, aur OpenTofu aur Terragrunt kya hain?',
        a: 'Ansible is a push-based, agentless configuration-management tool — it connects over SSH, has a large library of idempotent modules, and playbooks that are more imperative than terraform. In a fully immutable cloud setup its role shrinks but does not disappear. It is a common Packer provisioner for building the golden image itself: Packer boots a temporary instance, Ansible configures it, Packer snapshots it. It handles things that genuinely are not cattle — on-premises servers, network devices, appliances, databases configured in place. And it does orchestration and one-off tasks across a fleet. What it is not is a replacement for terraform when provisioning cloud resources: it has cloud modules but no real state model or plan, so managing a VPC or a database with it gives up terraform\'s safety. OpenTofu is the open-source fork of Terraform, created after HashiCorp relicensed Terraform from MPL to the Business Source License in 2023; it is under the Linux Foundation, community-governed, and stays close to drop-in compatible — same HCL, same providers, \`tofu\` instead of \`terraform\`. Terragrunt is a thin wrapper around terraform or tofu that keeps backend and provider configuration DRY across many environment directories and can run terraform across multiple directories with dependency ordering; it earns its place when a directory-per-environment layout has grown to dozens of components, and is unnecessary for smaller setups.',
        aHi: 'Ansible ek push-based, agentless configuration-management tool hai — ye SSH par connect karता hai, idempotent modules ki ek badी library ke saath. Ek fully immutable cloud setup mein iska role shrink karता hai par disappear nahi hota. Ye golden image khud build karने ke liye ek common Packer provisioner hai. Ye cheezen handle karता hai jo genuinely cattle nahi hain — on-premises servers, network devices, databases. Jo ye nahi hai wo cloud resources provision karते samay terraform ka replacement hai. OpenTofu Terraform ka open-source fork hai, HashiCorp dwara 2023 mein Terraform ko MPL se Business Source License mein relicense karने ke baad banaya gaya; ye Linux Foundation ke tahat hai. Terragrunt terraform ya tofu ke aas-paas ek thin wrapper hai jo backend aur provider configuration ko kई environment directories ke across DRY rakhता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, contrast mutable and immutable infrastructure, and explain how a change is rolled out and rolled back under the immutable model.',
        taskHi: 'Ek comment mein, mutable aur immutable infrastructure ka contrast karo.',
        hint: 'MUTABLE: provision a server once, then change it IN PLACE forever — SSH in, `apt upgrade`, edit config, deploy code onto the same box, tune settings during incidents. Over months every server drifts to a unique, unrecorded snowflake state → CONFIGURATION DRIFT (Module 1): a bug reproduces on box 7 not box 3 because box 7 had a manual change in 2022 nobody logged; rebuilding a working box is frightening because nobody knows the full set of changes. IMMUTABLE: a server is NEVER modified after boot. To change ANYTHING (a package, a config, the app version, the OS, a security patch) → build a NEW IMAGE with the change → REPLACE the running servers with fresh instances from it. A misbehaving server is terminated + replaced from the known image, not debugged in place. ROLL OUT a change: (1) Packer builds image v2 in CI (versioned artifact); (2) terraform points the launch template / VMSS / instance template at v2; (3) a rolling mechanism — AWS Auto Scaling group INSTANCE REFRESH, Azure VMSS ROLLING UPGRADE, GCP MIG rolling update — cycles the fleet a batch at a time, respecting a minimum healthy percentage, `create_before_destroy` so new healthy capacity exists before old is removed. ROLL BACK: point the launch template / scale set back at the v1 image and run the same rolling mechanism. PAYOFF: every server byte-identical + reproducible, drift structurally impossible, scaling out = more copies of a known-good artifact. COST: you need an image build pipeline; a change is an image build + a fleet roll, not a 30-second SSH.',
        hintHi: 'MUTABLE: ek server ek baar provision karo, phir ise HAMESHA IN PLACE badalte raho. Mahinon mein har server ek unique snowflake state par drift → CONFIGURATION DRIFT: ek bug box 7 par reproduce hota hai box 3 par nahi. IMMUTABLE: ek server boot ke baad KABHI modify nahi hota. KUCH BHI badalne ke liye → ek NAYA IMAGE banao → running servers ko usse fresh instances se REPLACE karo. ROLL OUT: (1) Packer image v2 banata hai; (2) terraform launch template ko v2 par point karta hai; (3) ek rolling mechanism (ASG INSTANCE REFRESH / VMSS ROLLING UPGRADE / MIG rolling update) fleet ko batch by batch cycle karta hai, `create_before_destroy`. ROLL BACK: launch template ko v1 image par wapas point karo. PAYOFF: har server byte-identical, drift impossible. COST: ek image build pipeline chahiye.',
      },
      {
        task: 'In a comment, explain golden images and Packer, what belongs in user-data / cloud-init versus the image, and why secrets must never be baked in.',
        taskHi: 'Ek comment mein, golden images aur Packer samjhao.',
        hint: 'GOLDEN IMAGE = a machine image with everything baked: OS at a known patch level, language runtime, monitoring/logging agents, security hardening, USUALLY the app itself. Built ONCE in CI, booted MANY times. PACKER (HashiCorp): a template names a BASE IMAGE (an official Ubuntu AMI), a BUILDER (the target — `amazon-ebs` / `azure-arm` / `googlecompute` / `docker` / `vmware`), and PROVISIONERS (shell scripts, or an Ansible playbook). `packer build` → launches a temp instance from the base, runs the provisioners, SNAPSHOTS the result into a VERSIONED image (an AMI id / Azure Compute Gallery image version / GCP image name), tears the temp instance down. That id feeds terraform. Boot is then FAST (nothing to install/compile) + DETERMINISTIC (every instance from `v42` is identical) — vs configuring at boot, where a slow mirror makes 1 in 50 come up subtly wrong. WHAT GOES IN USER-DATA / CLOUD-INIT (not the image) — only genuinely PER-INSTANCE / PER-LAUNCH bits: read THIS instance\'s config + secret refs from a parameter store (SSM / Key Vault) using its instance/workload role; register with the correct load-balancer target group; activate the specific already-baked app version this deploy wants. Render it with terraform\'s `templatefile()`. AWS `user_data`, Azure `custom_data` (base64), GCP `metadata.user-data`. Keep it SMALL — every line is a chance for a slow/failed boot, it runs on every autoscaling event; substantial work here = move it into the image. SECRETS NEVER BAKED IN: machine images are shared across accounts, copied across regions, kept in snapshots forever, broadly readable in an org → a baked prod password has a long uncontrolled life. It also breaks "build once" — an image with prod secrets can\'t serve staging, so you build one per env and lose reproducibility. The image is ENVIRONMENT-AGNOSTIC; per-env config + secrets arrive at boot via the instance role, or the app fetches its own at startup. One image → dev/staging/prod; rotating a secret = update the parameter store + recycle instances, no rebuild.',
        hintHi: 'GOLDEN IMAGE = ek machine image sab kuch baked ke saath: OS, runtime, agents, hardening, AAM TAUR PAR app khud. CI mein EK BAAR built, KAI baar booted. PACKER: ek template ek BASE IMAGE, ek BUILDER (`amazon-ebs` / `azure-arm` / `googlecompute` / `docker`), aur PROVISIONERS (shell / Ansible) name karta hai. `packer build` → temp instance launch, provisioners chalao, VERSIONED image mein SNAPSHOT, temp instance tear down. Boot phir FAST + DETERMINISTIC. USER-DATA MEIN: sirf genuinely PER-INSTANCE bits — is instance ka config + secrets ek parameter store se instance role se, load balancer target group se register, specific baked app version activate. `templatefile()` se render. CHHOTA rakho. SECRETS KABHI BAKED NAHI: images accounts ke beech shared, snapshots mein forever. Image ENVIRONMENT-AGNOSTIC hai; secrets boot par aate hain.',
      },
      {
        task: 'In a comment, spell out the concrete AWS and Azure immutable deployment shapes, where Ansible still fits, and what OpenTofu and Terragrunt are.',
        taskHi: 'Ek comment mein, concrete AWS aur Azure immutable deployment shapes spell out karo.',
        hint: 'AWS SHAPE: Packer → an AMI → `aws_launch_template` (references the AMI id + the `templatefile()`-rendered user_data) → `aws_autoscaling_group` (runs N instances across AZs, behind an ALB target group). DEPLOY = Packer builds a new AMI → terraform bumps the launch template to a new VERSION → an INSTANCE REFRESH on the ASG rolls the fleet: terminate old / launch new from the new template version, a few at a time, honouring a minimum-healthy-percentage. Rollback = point the launch template at the old AMI, refresh again. AZURE SHAPE: Packer → an image published to an AZURE COMPUTE GALLERY (formerly Shared Image Gallery), versioned, optionally region-replicated → `azurerm_orchestrated_virtual_machine_scale_set` (or the older `azurerm_linux_virtual_machine_scale_set`) referencing the gallery image version. DEPLOY = publish a new image version → trigger a VMSS ROLLING UPGRADE, which cycles instances to the new version in batches with health checks between. (GCP: custom image → instance template → managed instance group with a rolling update policy.) In all three: `create_before_destroy` or the platform\'s native rolling mechanism ensures new healthy capacity before old is removed. ANSIBLE STILL FITS: (1) BUILDING golden images — a common Packer provisioner (Packer boots a temp instance, Ansible configures it, Packer snapshots); (2) things that are NOT cattle — on-prem servers, network gear, appliances, databases configured in place; (3) orchestration / one-off fleet tasks. It is NOT a terraform replacement for cloud resources — it has cloud modules but no real state model or plan, so a VPC/RDS managed with Ansible gives up terraform\'s safety. OPENTOFU = the open-source (MPL, Linux Foundation, community-governed) FORK of Terraform after the 2023 BSL relicense; near drop-in, same HCL, same providers, `tofu` not `terraform`. TERRAGRUNT = a thin wrapper around terraform/tofu that keeps backend + provider config DRY (generated from one place, not repeated per env dir) and runs terraform across many directories with dependency ordering — earns its place at dozens of components, unnecessary for small setups.',
        hintHi: 'AWS SHAPE: Packer → ek AMI → `aws_launch_template` (AMI id + `templatefile()` user_data) → `aws_autoscaling_group` (N instances across AZs, ALB target group ke peeche). DEPLOY = Packer naya AMI → terraform launch template ko naye VERSION par → ASG par INSTANCE REFRESH fleet roll karta hai. AZURE SHAPE: Packer → ek image ek AZURE COMPUTE GALLERY mein published → `azurerm_orchestrated_virtual_machine_scale_set`. DEPLOY = naya image version publish → VMSS ROLLING UPGRADE. Dono mein `create_before_destroy`. ANSIBLE FITS: (1) golden images BUILD karna (Packer provisioner); (2) cheezen jo cattle NAHI hain — on-prem, network gear, databases; (3) orchestration. Cloud resources ke liye terraform ka replacement NAHI. OPENTOFU = 2023 BSL relicense ke baad Terraform ka open-source FORK; `tofu` not `terraform`. TERRAGRUNT = ek thin wrapper jo backend + provider config DRY rakhta hai.',
      },
    ],

    keyTakeaways: [
      'MUTABLE = provision once, change in place forever → configuration drift (every box a unique unrecorded snowflake; "works on box 3 not box 7"). IMMUTABLE = a server is NEVER modified after boot; to change anything you build a NEW IMAGE and REPLACE the running servers with fresh instances from it. Drift becomes structurally impossible; rollback = redeploy the previous image.',
      'GOLDEN IMAGE = OS + runtime + agents + hardening + (usually) the app, baked ONCE in CI, booted MANY times. PACKER builds it: base image + builder (amazon-ebs / azure-arm / googlecompute / docker) + provisioners (shell / Ansible) → a versioned AMI / gallery image / GCP image. Boot is then fast and deterministic.',
      'USER-DATA / CLOUD-INIT carries ONLY genuinely per-instance bits: fetch this instance\'s config + secret refs from a parameter store via the instance role, join the right target group, activate the baked app version. Render with `templatefile()`. Keep it SMALL — it runs on every autoscaling launch. NEVER bake secrets or env-specific values into the image — images are shared/copied/retained and it breaks "build once".',
      'AWS: Packer→AMI→`aws_launch_template`→`aws_autoscaling_group`; deploy = new AMI → new template version → ASG INSTANCE REFRESH (rolling). AZURE: Packer→Azure Compute Gallery image→`azurerm_orchestrated_virtual_machine_scale_set`; deploy = new image version → VMSS ROLLING UPGRADE. `create_before_destroy` / native rolling ensures new healthy capacity before old is removed.',
      'ANSIBLE still fits: building golden images (a Packer provisioner), configuring things that are NOT cattle (on-prem, network gear, in-place databases), and one-off orchestration — but it is NOT a terraform replacement for cloud resources (no real state/plan). OPENTOFU = the open-source (MPL, Linux Foundation) fork of Terraform after the 2023 BSL relicense — near drop-in. TERRAGRUNT = a wrapper that DRYs backend/provider config across many env directories and orders runs between them.',
    ],
    keyTakeawaysHi: [
      'MUTABLE = ek baar provision, hamesha in place badlo → configuration drift (har box ek unique unrecorded snowflake). IMMUTABLE = ek server boot ke baad KABHI modify nahi hota; kuch bhi badalne ke liye ek NAYA IMAGE banao aur running servers ko usse fresh instances se REPLACE karo. Drift structurally impossible; rollback = previous image redeploy.',
      'GOLDEN IMAGE = OS + runtime + agents + hardening + (aam taur par) app, CI mein EK BAAR baked, KAI baar booted. PACKER ise banata hai: base image + builder (amazon-ebs / azure-arm / googlecompute / docker) + provisioners (shell / Ansible) → ek versioned AMI / gallery image / GCP image. Boot phir fast aur deterministic.',
      'USER-DATA / CLOUD-INIT sirf genuinely per-instance bits carry karta hai: is instance ka config + secret refs ek parameter store se instance role se, sahi target group join, baked app version activate. `templatefile()` se render. CHHOTA rakho. Secrets ya env-specific values KABHI image mein bake mat karo.',
      'AWS: Packer→AMI→`aws_launch_template`→`aws_autoscaling_group`; deploy = naya AMI → naya template version → ASG INSTANCE REFRESH. AZURE: Packer→Azure Compute Gallery image→`azurerm_orchestrated_virtual_machine_scale_set`; deploy = naya image version → VMSS ROLLING UPGRADE. `create_before_destroy` / native rolling naye healthy capacity ko purane ke hatne se pehle ensure karta hai.',
      'ANSIBLE abhi bhi fit hota hai: golden images build karna (ek Packer provisioner), cheezen configure karna jo cattle NAHI hain (on-prem, network gear, in-place databases), aur one-off orchestration — par ye cloud resources ke liye terraform ka replacement NAHI hai. OPENTOFU = 2023 BSL relicense ke baad Terraform ka open-source fork. TERRAGRUNT = ek wrapper jo backend/provider config DRY karta hai.',
    ],
  },
];
