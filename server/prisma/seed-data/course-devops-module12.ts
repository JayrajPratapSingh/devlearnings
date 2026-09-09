import type { CourseLesson } from './course-js-module1';

// DevOps Module 12 — Infrastructure as Code: Terraform & Immutable Infrastructure
// Lessons 1-3 (part 1 of 2). Lessons 4-6 are in course-devops-module12-part2.ts.
//
// VERIFICATION: every `# VERIFY` example runs against a REAL terraform v1.9.8
// (~/bin/terraform.exe) with the hashicorp/local, hashicorp/random and
// hashicorp/null providers (offline-cached in TF_PLUGIN_CACHE_DIR). No cloud
// credentials are used — the local/random providers model the resource
// lifecycle (create / update / replace / destroy), state, drift, the plan, and
// modules exactly as a cloud provider would. `scratchpad/verify-bash.mjs 12`.
//   L1 declarative & idempotency        — VERIFIED (terraform apply x3, drift correction)
//   L2 providers, resources & the plan  — VERIFIED (plan symbols, terraform graph)
//   L3 state, remote backends & locking — VERIFIED (secrets in tfstate, state list/show/rm, drift)

export const DEVOPS_MODULE_12: CourseLesson[] = [
  {
    slug: 'ops-declarative-infrastructure-and-idempotency',
    title: 'Declarative Infrastructure & Idempotency',
    titleHi: 'Declarative Infrastructure Aur Idempotency',
    description:
      'Infrastructure as Code means describing the infrastructure you want in files that live in version control, and letting a tool make reality match. The key idea is declarative — you state the end result, not the steps — and the key property is idempotency: running the same code again when nothing has changed does nothing. This is the same desired-state model Kubernetes uses, applied to servers, networks, databases and DNS.',
    descriptionHi:
      'Infrastructure as Code ka matlab hai jo infrastructure aap chahte ho use files mein describe karna jo version control mein rehti hain, aur ek tool ko reality ko match karane dena. Key idea declarative hai — aap end result batate ho, steps nahi — aur key property idempotency hai: same code dobara chalana jab kuch nahi badla to kuch nahi karta. Ye wahi desired-state model hai jo Kubernetes use karta hai, servers, networks, databases aur DNS par apply kiya gaya.',
    difficulty: 'EASY',
    duration: 20,
    order: 1,

    analogy: {
      en: '**A thermostat versus a light switch.** A light switch is imperative: you flip it up, the light comes on; flip it up again and nothing happens because it is already up; and if someone else flipped it down, you have no idea until you look. A thermostat is declarative: you set "21 degrees" once, and the system continuously does whatever it takes — heat, cool, nothing — to make the room match that number. Set it to 21 again when the room is already 21 and it does nothing. Open a window and it notices the drift and corrects. Infrastructure as Code is the thermostat: you write down the desired state, and the tool reconciles reality to it, over and over, safely.',
      hi: '**Ek thermostat versus ek light switch.** Ek light switch imperative hai: aap ise up flip karte ho, light on ho jaati hai; dobara up flip karo aur kuch nahi hota kyunki ye already up hai; aur agar kisi aur ne ise down flip kiya, aapko pata nahi jab tak aap dekhte nahi. Ek thermostat declarative hai: aap "21 degrees" ek baar set karte ho, aur system continuously jo bhi lagta hai wo karta hai — heat, cool, kuch nahi — room ko us number se match karane ke liye. Ise 21 dobara set karo jab room already 21 hai aur ye kuch nahi karta. Ek window kholo aur ye drift notice karta hai aur correct karta hai. Infrastructure as Code thermostat hai.',
    },

    simple: `**IMPERATIVE = the steps. DECLARATIVE = the end state.**
\`\`\`
IMPERATIVE   "create a VM, then attach a disk, then open port 443, then install nginx"
             - you must know the current state to know which steps to run
             - run it twice and step 1 fails ("VM already exists") or duplicates
DECLARATIVE  "there is 1 VM, with a 50GB disk, port 443 open, running nginx"
             - the tool figures out the diff between this and reality, and applies only that
             - run it twice with no change -> it does NOTHING
\`\`\`

**INFRASTRUCTURE AS CODE (IaC):** the desired state of your infra — servers,
networks, load balancers, DNS records, databases, IAM roles, Kubernetes clusters
— written as **text files kept in git**, applied by a tool (Terraform, OpenTofu,
CloudFormation, Pulumi, ...).

**WHY IT MATTERS:**
\`\`\`
REPEATABLE    the same files build dev, staging and prod identically
REVIEWABLE    infra changes go through a pull request + diff + approval, like code
VERSIONED     'what did the network look like in March?' -> git log
RECOVERABLE   the datacentre burned down -> re-apply the files into a new region
NO CLICKOPS   no undocumented click in a web console that nobody else knows about
\`\`\`

**IDEMPOTENCY** — the defining property. \`apply\` = "make reality match the code":
\`\`\`
reality already matches   -> no changes, nothing happens
reality is missing X      -> create X
reality has drifted       -> correct it back
X removed from the code   -> destroy X
\`\`\`
You can run \`apply\` any number of times; the result depends only on the code +
reality, never on how many times you ran it.

**THE DESIRED-STATE LOOP** is exactly Kubernetes' reconciliation (Module 7),
one level down: K8s reconciles Pods to a Deployment spec; Terraform reconciles
cloud resources to \`.tf\` files. Same idea, same benefits.`,

    simpleHi: `**IMPERATIVE = steps. DECLARATIVE = end state.**
\`\`\`
IMPERATIVE   "ek VM banao, phir ek disk attach karo, phir port 443 kholo, phir nginx install karo"
             - aapko current state pata hona chahiye taaki pata chale kaun se steps chalane hain
             - ise do baar chalao aur step 1 fail hota hai ("VM already exists") ya duplicate karta hai
DECLARATIVE  "1 VM hai, ek 50GB disk ke saath, port 443 open, nginx chala raha hai"
             - tool is aur reality ke beech diff figure karta hai, aur sirf wo apply karta hai
             - ise do baar chalao bina change ke -> ye KUCH NAHI karta
\`\`\`

**INFRASTRUCTURE AS CODE (IaC):** aapke infra ka desired state — servers,
networks, load balancers, DNS records, databases, IAM roles, Kubernetes clusters
— **text files ke roop mein git mein rakha**, ek tool dwara apply kiya (Terraform,
OpenTofu, CloudFormation, Pulumi, ...).

**KYUN MATTER KARTA HAI:**
\`\`\`
REPEATABLE    same files dev, staging aur prod ko identically build karti hain
REVIEWABLE    infra changes ek pull request + diff + approval se guzarte hain, code ki tarah
VERSIONED     'March mein network kaisa dikhta tha?' -> git log
RECOVERABLE   datacentre jal gaya -> files ko ek naye region mein re-apply karo
NO CLICKOPS   ek web console mein koi undocumented click nahi jo koi aur nahi jaanta
\`\`\`

**IDEMPOTENCY** — defining property. \`apply\` = "reality ko code se match karao":
\`\`\`
reality already match karti hai   -> koi changes nahi, kuch nahi hota
reality mein X missing hai         -> X banao
reality drift ho gayi hai          -> ise wapas correct karo
code se X hataya gaya              -> X destroy karo
\`\`\`
Aap \`apply\` kitni bhi baar chala sakte ho; result sirf code + reality par depend
karta hai, kabhi is par nahi ki aapne kitni baar chalaya.

**DESIRED-STATE LOOP** exactly Kubernetes ki reconciliation hai (Module 7),
ek level neeche: K8s Pods ko ek Deployment spec se reconcile karta hai; Terraform
cloud resources ko \`.tf\` files se reconcile karta hai.`,

    content: `## The problem IaC solves

Before IaC, infrastructure was built by hand: someone opened the cloud console, clicked "create instance", picked options from dropdowns, then SSHed in and ran a series of commands. This works once. Then:

- **Staging does not match production**, because they were clicked into existence months apart by different people with slightly different choices. Bugs that only appear in prod are often really "staging was built differently" bugs.
- **Nobody can say what exists or why.** There are forty security-group rules and no record of which are still needed. There is an instance called \`test-2\` that nobody dares delete.
- **A rebuild takes days.** If a region goes down, or you want a second environment, someone has to remember and re-click everything.
- **Changes are invisible.** A rule was changed last Tuesday and the service broke on Thursday; there is no diff, no author, no reason recorded.

Infrastructure as Code fixes all of this by making the infrastructure a **program**: text files, in version control, applied by a tool. The files are the single source of truth; reality is derived from them.

## Declarative versus imperative

An **imperative** approach specifies the steps: create this, then modify that, then run this command. The script author has to know the current state to know which steps are valid — creating something that already exists is an error, so the script needs "if not exists" guards everywhere, and it is fragile if reality is not exactly what the author assumed.

A **declarative** approach specifies the desired end state: this is what should exist. The tool inspects reality, computes the difference between reality and the desired state, and performs only the actions needed to close that gap. The same declaration works whether you are starting from nothing, from a half-built environment, or from a fully-built one that has drifted.

Almost all modern IaC tools are declarative: Terraform, OpenTofu, CloudFormation, Bicep, Pulumi, Kubernetes manifests. A few tools (Ansible, shell scripts) are imperative or partly so, and lean on idempotent modules to approximate declarative behaviour.

## Idempotency

An operation is **idempotent** if applying it multiple times has the same effect as applying it once. \`mkdir /data\` is not idempotent — the second run errors. \`mkdir -p /data\` is idempotent — the second run is a no-op. Setting a thermostat to 21 degrees is idempotent; nudging it "two degrees warmer" is not.

IaC \`apply\` is idempotent by construction. It always does the same thing: make reality match the code. If reality already matches, \`apply\` reports "no changes" and does nothing. If part of reality is missing or wrong, \`apply\` fixes exactly that part. You never have to track "have I run this yet" — you can run \`apply\` in a loop, in CI on every merge, or by hand when you are unsure, and the outcome is always the same converged state.

This is what makes IaC safe to automate. A pipeline can run \`terraform apply\` on every merge to main without any bookkeeping, because a merge that changed nothing infrastructural produces an apply that changes nothing.

## Drift

**Drift** is when reality no longer matches the code — someone made a manual change in the console, or an outage recreated something with different settings, or another tool touched a shared resource. Because IaC is declarative and idempotent, the next \`apply\` (or a \`plan\`) detects the drift and offers to correct it: reality is brought back to what the code says. Drift is covered in depth in Lesson 3; the point here is that the desired-state model makes drift *visible and fixable* rather than a silent surprise.

## The connection to Kubernetes

You have already seen this exact model. In Module 7, a Kubernetes Deployment declares "I want 3 Pods running this image", and a controller continuously reconciles the cluster to that: if a Pod dies, it makes a new one; if you change the replica count, it adjusts. Terraform is the same loop one layer down — it reconciles *cloud resources* (the VMs the Pods run on, the load balancer in front, the database beside them, the DNS record pointing at it) to \`.tf\` files. Kubernetes reconciles continuously in a running controller; Terraform reconciles each time you run \`apply\`. The mental model — desired state in a file, a tool that computes and applies the diff, idempotent by design — is identical.`,

    contentHi: `## IaC jo problem solve karta hai

IaC se pehle, infrastructure haath se banaya jaata tha: koi cloud console kholta, "create instance" click karta, dropdowns se options pick karta, phir SSH karke commands ki ek series chalata. Ye ek baar kaam karta hai. Phir:

- **Staging production se match nahi karta**, kyunki wo mahinon alag alag logon dwara thode alag choices ke saath click karke banaye gaye the. Bugs jo sirf prod mein aate hain aksar wo "staging alag tarah se banaya gaya tha" bugs hote hain.
- **Koi nahi bata sakta kya exist karta hai ya kyun.** Chalees security-group rules hain aur koi record nahi ki kaun se abhi bhi zaroori hain.
- **Ek rebuild din leta hai.** Agar ek region down ho jaaye, ya aap ek doosra environment chaho, kisi ko sab kuch yaad karke re-click karna padega.
- **Changes invisible hain.** Ek rule pichle Tuesday badla gaya aur service Thursday ko toot gayi; koi diff nahi, koi author nahi, koi reason record nahi.

Infrastructure as Code ye sab fix karta hai infrastructure ko ek **program** banakar: text files, version control mein, ek tool dwara apply. Files single source of truth hain; reality unse derive hoti hai.

## Declarative versus imperative

Ek **imperative** approach steps specify karta hai: ye banao, phir wo modify karo, phir ye command chalao. Script author ko current state pata hona chahiye taaki pata chale kaun se steps valid hain — kuch banana jo already exist karta hai ek error hai.

Ek **declarative** approach desired end state specify karta hai: ye hai jo exist karna chahiye. Tool reality inspect karta hai, reality aur desired state ke beech difference compute karta hai, aur sirf wo actions perform karta hai jo us gap ko close karne ke liye zaroori hain.

Lagbhag saare modern IaC tools declarative hain: Terraform, OpenTofu, CloudFormation, Bicep, Pulumi, Kubernetes manifests. Kuch tools (Ansible, shell scripts) imperative hain ya partly, aur declarative behaviour approximate karne ke liye idempotent modules par lean karte hain.

## Idempotency

Ek operation **idempotent** hai agar ise kई baar apply karne ka wahi effect hai jo ise ek baar apply karne ka. \`mkdir /data\` idempotent nahi hai — doosra run error karta hai. \`mkdir -p /data\` idempotent hai — doosra run ek no-op hai.

IaC \`apply\` construction se idempotent hai. Ye hamesha wahi karta hai: reality ko code se match karao. Agar reality already match karti hai, \`apply\` "no changes" report karta hai. Aapko kabhi track nahi karna "kya maine ise chalaya" — aap \`apply\` ek loop mein chala sakte ho, har merge par CI mein, aur outcome hamesha wahi converged state hai.

Yahi IaC ko automate karne ke liye safe banata hai.

## Drift

**Drift** tab hai jab reality ab code se match nahi karti — kisi ne console mein ek manual change kiya. Kyunki IaC declarative aur idempotent hai, agla \`apply\` (ya ek \`plan\`) drift detect karta hai aur ise correct karne ka offer karta hai. Drift Lesson 3 mein depth mein hai.

## Kubernetes se connection

Aap ye exact model pehle dekh chuke ho. Module 7 mein, ek Kubernetes Deployment declare karta hai "main 3 Pods chahta hoon ye image chala rahe", aur ek controller continuously cluster ko us se reconcile karta hai. Terraform wahi loop ek layer neeche hai — ye *cloud resources* ko \`.tf\` files se reconcile karta hai. Mental model — ek file mein desired state, ek tool jo diff compute aur apply karta hai, design se idempotent — identical hai.`,

    examples: [
      {
        title: 'Idempotency, in three applies: create, no-op, and drift correction',
        titleHi: 'Idempotency, teen applies mein: create, no-op, aur drift correction',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

cat > main.tf <<'EOF'
terraform {
  required_providers {
    local = { source = "hashicorp/local", version = "2.9.0" }
  }
}
resource "local_file" "greeting" {
  content  = "hello from terraform\\n"
  filename = "\${path.module}/greeting.txt"
}
EOF

terraform init -no-color -input=false >/dev/null

echo "--- apply #1: the file does not exist yet ---"
terraform apply -no-color -auto-approve 2>&1 | grep -E '^(local_file|Apply complete)'
echo "file on disk: \$(cat greeting.txt)"

echo "--- apply #2: nothing changed in the config, the file already matches ---"
terraform apply -no-color -auto-approve 2>&1 | grep -E '^(No changes|Apply complete|local_file)'
echo "  (same command, same result state - the second apply is a no-op: IDEMPOTENT)"

echo "--- someone edits the file by hand (drift) ---"
echo "TAMPERED" > greeting.txt
echo "--- apply #3: terraform sees the drift and corrects it back to desired state ---"
terraform apply -no-color -auto-approve 2>&1 | grep -E '^(local_file|Apply complete)'
echo "file on disk: \$(cat greeting.txt)"`,
        output: `--- apply #1: the file does not exist yet ---
local_file.greeting: Creating...
local_file.greeting: Creation complete after 0s [id=2ffa7f6c49f636710e6b30e1e7763d32ba20f678]
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
file on disk: hello from terraform
--- apply #2: nothing changed in the config, the file already matches ---
local_file.greeting: Refreshing state... [id=2ffa7f6c49f636710e6b30e1e7763d32ba20f678]
No changes. Your infrastructure matches the configuration.
Apply complete! Resources: 0 added, 0 changed, 0 destroyed.
  (same command, same result state - the second apply is a no-op: IDEMPOTENT)
--- someone edits the file by hand (drift) ---
--- apply #3: terraform sees the drift and corrects it back to desired state ---
local_file.greeting: Refreshing state... [id=2ffa7f6c49f636710e6b30e1e7763d32ba20f678]
local_file.greeting: Creating...
local_file.greeting: Creation complete after 0s [id=2ffa7f6c49f636710e6b30e1e7763d32ba20f678]
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
file on disk: hello from terraform`,
        explain: 'One resource is declared: a file with fixed content. The first apply finds the file missing and creates it; the resource id is a hash of the content, so it is stable across runs. The second apply runs the identical command with an unchanged configuration; terraform refreshes its knowledge of the file, sees that reality already matches the desired state, prints "No changes", and does nothing — this is idempotency, the property that running apply again is safe and free when nothing needs to change. Then the file is edited outside terraform, which is drift: reality no longer matches the code. The third apply detects that the on-disk content differs from what the state records, and reconciles it — the file is rewritten to the declared content, and the hand-edit is gone. The same command was run three times and produced three different behaviours (create, nothing, correct) entirely because the gap between code and reality was different each time. That is the whole model: you never tell terraform what to do, only what the end state should be.',
        explainHi: 'Ek resource declare kiya gaya hai: fixed content wali ek file. Pehla apply file ko missing paata hai aur ise banaता hai; resource id content ka ek hash hai, to ye runs ke across stable hai. Doosra apply identical command ek unchanged configuration ke saath chalata hai; terraform file ki apni knowledge refresh karta hai, dekhता hai ki reality already desired state se match karti hai, "No changes" print karta hai, aur kuch nahi karta — ye idempotency hai. Phir file terraform ke bahar edit hoti hai, jo drift hai. Teesra apply detect karta hai ki on-disk content us se alag hai jo state record karta hai, aur ise reconcile karta hai — file declared content par rewrite hoti hai. Same command teen baar chala aur teen alag behaviours produce kiye (create, kuch nahi, correct) poori tarah kyunki code aur reality ke beech gap har baar alag tha.',
      },
    ],

    mistakes: [
      {
        wrong: `# treating terraform like an imperative deploy script - running it once, by hand,
# then making "small fixes" directly in the cloud console
$ terraform apply          # built the VPC + instances 6 months ago
# since then:
#   - added 3 security-group rules in the console (prod incident, "temporary")
#   - resized an instance in the console (needed more RAM fast)
#   - someone deleted an unused subnet in the console
# now: main.tf describes a world that no longer exists. the next 'terraform apply'
# wants to DELETE the 3 rules, SHRINK the instance, and RECREATE the subnet.`,
        right: `# every infrastructure change goes through the code, always:
#   1. edit the .tf files
#   2. open a PR - reviewer sees the 'terraform plan' diff
#   3. merge -> CI runs 'terraform apply'
# NEVER touch the console except to look. if you must make an emergency console
# change, immediately reconcile it back into the code (or 'terraform import' it)
# and open the PR the same day - otherwise the code is now fiction.
# a 'terraform plan' in CI on a schedule catches drift before it piles up.`,
        why: 'Infrastructure as Code only works if the code is the single source of truth. The moment someone makes a change directly in the cloud console and does not put it back into the files, the files become a description of a world that no longer exists, and every subsequent \`plan\` is misleading: it shows terraform wanting to undo the console changes, because from terraform\'s point of view those are unexplained drift to be corrected. People then learn to distrust the plan, apply becomes scary, and the whole team stops running it — at which point you have manual infrastructure again, with the added cost of some \`.tf\` files that lie. The discipline that keeps IaC honest is that the console is read-only: you look at it, you never change it. Every change is a code change, reviewed as a diff, applied by the pipeline. When an emergency genuinely forces a console change, the fix is reconciled back into the code immediately — edited in by hand or pulled in with \`terraform import\` — so the code is true again within hours, not left to rot.',
        whyHi: 'Infrastructure as Code sirf tab kaam karta hai agar code single source of truth hai. Jis pal koi cloud console mein seedha ek change karta hai aur ise files mein wapas nahi daalता, files ek aisी duniya ka description ban jaati hain jo ab exist nahi karti, aur har subsequent \`plan\` misleading hai: ye terraform ko console changes undo karna chahte hue dikhata hai. Log phir plan par distrust karna seekhते hain, apply scary ban jaata hai, aur poori team ise chalana band kar deti hai — us point par aapke paas phir se manual infrastructure hai. Discipline jo IaC ko honest rakhती hai ye hai ki console read-only hai: aap ise dekhte ho, aap kabhi ise nahi badalते. Jab ek emergency genuinely ek console change force karti hai, fix turant code mein reconcile hota hai.',
      },
      {
        wrong: `# writing infrastructure as an imperative bash script, and calling it "IaC"
#!/bin/bash
aws ec2 run-instances --image-id ami-123 --count 1 ...       # run twice -> 2 instances
aws ec2 create-security-group --group-name web ...           # run twice -> error, already exists
aws ec2 authorize-security-group-ingress --port 443 ...      # run twice -> error, rule exists
# to make it re-runnable you now add "does it exist?" checks before every line,
# and a "remove things not in this script" pass. congratulations, you are writing
# a bad terraform.`,
        right: `# use a declarative tool - state the end result, let it compute the diff:
resource "aws_instance" "web" {
  count         = 1
  ami           = "ami-123"
  instance_type = "t3.small"
}
resource "aws_security_group" "web" {
  name = "web"
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
# run 'terraform apply' as many times as you like: 1 instance, 1 group, 1 rule,
# always. remove the security_group block and apply -> it deletes the group.`,
        why: 'An imperative script that provisions infrastructure has to answer a hard question on every line: does this thing already exist, and is it in the right state? Cloud CLIs do not answer that for you — \`run-instances\` always creates, \`create-security-group\` always errors if the name is taken. To make the script safe to re-run you end up hand-writing existence checks, attribute comparisons, and a reconciliation pass that deletes resources the script no longer mentions. That is precisely the engine a declarative tool already provides, built and tested by a large team, handling ordering, partial failure, dependency graphs, and hundreds of resource types. Writing it yourself in bash gets you a fragile, untested subset. The declarative version states only the desired end state; the tool refreshes reality, diffs, and applies the minimum change — and does the same thing every time regardless of the starting point. Reach for a real IaC tool rather than reinventing its core loop badly.',
        whyHi: 'Ek imperative script jo infrastructure provision karta hai har line par ek hard question answer karna padta hai: kya ye cheez already exist karti hai, aur kya ye sahi state mein hai? Cloud CLIs wo aapke liye answer nahi karte — \`run-instances\` hamesha create karta hai. Script ko re-run karne ke liye safe banane ke liye aap existence checks, attribute comparisons, aur ek reconciliation pass hand-write karte ho jo resources delete karta hai jo script ab mention nahi karta. Wo exactly wo engine hai jo ek declarative tool already provide karta hai, ek badी team dwara built aur tested. Ise khud bash mein likhna aapko ek fragile, untested subset deता hai. Ek real IaC tool ke liye reach karo bajaay iske core loop ko kharab tarike se reinvent karne ke.',
      },
    ],

    realWorld: [
      {
        en: '**"It works in staging"** — a payments bug only reproduced in prod. Three days later the cause: staging\'s RDS was \`db.t3.medium\` single-AZ, prod was \`db.r5.large\` multi-AZ, clicked in a year apart. Moving both to one Terraform module with an environment variable made them identical; the class of bug disappeared.',
        hi: '**"Staging mein kaam karta hai"** — ek payments bug sirf prod mein reproduce hua. Teen din baad cause: staging ka RDS single-AZ tha, prod multi-AZ, ek saal alag click kiye gaye. Dono ko ek Terraform module mein move karne se wo identical ho gaye.',
      },
      {
        en: '**The 3am rebuild** — a region-wide outage took out a whole environment. With everything in Terraform, a new environment in a second region was \`terraform apply -var region=eu-west-1\` and ~25 minutes. The team that had ClickOps\'d their infra took two days and still missed some firewall rules.',
        hi: '**3am ka rebuild** — ek region-wide outage ne ek poora environment le liya. Sab kuch Terraform mein hone se, ek doosre region mein ek naya environment \`terraform apply -var region=eu-west-1\` aur ~25 minute tha. Jis team ne apna infra ClickOps kiya tha unhe do din lage.',
      },
      {
        en: '**Drift that bit back** — an on-call engineer widened a security group in the console during an incident and never reconciled it. Two months later a routine \`terraform apply\` for an unrelated change silently removed the rule (terraform saw it as drift), and the incident recurred. Now a nightly \`terraform plan\` posts any drift to Slack.',
        hi: '**Drift jisne wapas kaata** — ek on-call engineer ne ek incident ke dauraan console mein ek security group widen kiya aur kabhi reconcile nahi kiya. Do mahine baad ek routine \`terraform apply\` ne rule silently hata diya. Ab ek nightly \`terraform plan\` koi bhi drift Slack par post karta hai.',
      },
    ],

    interviewQA: [
      {
        q: 'What is the difference between declarative and imperative infrastructure, and why does declarative dominate IaC?',
        qHi: 'Declarative aur imperative infrastructure mein kya difference hai, aur declarative IaC mein kyun dominate karta hai?',
        a: 'Imperative means specifying the sequence of steps to reach a result — create this, then modify that, then run this command. The author must know the current state to know which steps are valid, so the script needs existence checks and guards everywhere and breaks if reality is not what was assumed. Declarative means specifying the desired end state — this is what should exist — and letting the tool inspect reality, compute the difference, and perform only the actions needed to close the gap. Declarative dominates IaC for three reasons. First, idempotency comes for free: the same declaration applied to any starting point converges to the same state, so you can run apply repeatedly, in CI on every merge, without bookkeeping. Second, it handles drift: because the tool always diffs against reality, a manual change shows up as a correction to be made rather than a silent surprise. Third, the declaration is a reviewable artifact — a pull request diff of the desired state, with the tool showing exactly what will change before anything happens. An imperative script gives you none of these without a lot of hand-written machinery that amounts to reimplementing a declarative engine badly. Terraform, OpenTofu, CloudFormation, Pulumi and Kubernetes manifests are all declarative; Ansible and shell scripts are imperative and lean on idempotent modules to approximate it.',
        aHi: 'Imperative ka matlab hai ek result tak pahunchne ke steps ka sequence specify karna. Author ko current state pata hona chahiye. Declarative ka matlab hai desired end state specify karna aur tool ko reality inspect karne, difference compute karne, aur sirf zaroori actions perform karne dena. Declarative IaC mein teen reasons se dominate karta hai. Pehla, idempotency free milti hai: same declaration kisi bhi starting point par apply kiya same state par converge karta hai. Doosra, ye drift handle karta hai: kyunki tool hamesha reality ke against diff karta hai, ek manual change ek correction ke roop mein dikhता hai. Teesra, declaration ek reviewable artifact hai — desired state ka ek PR diff, tool ke saath jo dikhata hai kya change hoga kuch hone se pehle. Terraform, OpenTofu, CloudFormation, Pulumi aur Kubernetes manifests sab declarative hain.',
      },
      {
        q: 'What does idempotency mean for terraform apply, and why does it matter for automation?',
        qHi: 'terraform apply ke liye idempotency ka kya matlab hai, aur automation ke liye kyun matter karta hai?',
        a: 'An operation is idempotent if applying it several times has the same effect as applying it once. \`terraform apply\` is idempotent by construction because it always does one thing: make reality match the code. If reality already matches, it reports no changes and does nothing; if part of reality is missing, wrong, or drifted, it fixes exactly that part; if something was removed from the code, it destroys it. The result depends only on the code and the current state of reality, never on how many times apply has run. This matters for automation because it removes all bookkeeping. A CI pipeline can run \`terraform apply\` on every merge to the main branch without tracking whether a given change has been applied yet — a merge that changed nothing infrastructural produces an apply that changes nothing, harmlessly. It also makes apply safe to run by hand when you are unsure of the current state: running it cannot make things worse, it can only converge reality toward the code. Without idempotency you would need a system to record which changes have been applied, handle the case where a change was applied but the record was lost, and prevent double-application — exactly the kind of fragile state-tracking that declarative, idempotent tools eliminate.',
        aHi: 'Ek operation idempotent hai agar ise kई baar apply karne ka wahi effect hai jo ek baar. \`terraform apply\` construction se idempotent hai kyunki ye hamesha ek cheez karta hai: reality ko code se match karao. Agar reality already match karti hai, ye no changes report karta hai; agar part missing, wrong, ya drifted hai, ye exactly wo part fix karta hai; agar kuch code se hataya gaya, ye ise destroy karta hai. Result sirf code aur reality ke current state par depend karta hai. Ye automation ke liye matter karta hai kyunki ye saara bookkeeping hataता hai. Ek CI pipeline har merge par \`terraform apply\` chala sakti hai bina track kiye ki ek change apply hua ya nahi. Ye apply ko haath se chalane ke liye bhi safe banaता hai jab aap current state ke unsure ho.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, contrast imperative and declarative infrastructure with a concrete example, and list the five things IaC gives you over ClickOps.',
        taskHi: 'Ek comment mein, imperative aur declarative infrastructure ka contrast ek concrete example ke saath karo.',
        hint: 'IMPERATIVE = the STEPS: "create a VM, attach a 50GB disk, open port 443, install nginx". You must know the current state to know which steps are valid — `create` errors if the thing exists, so you need "if not exists" guards everywhere; running it twice fails or duplicates. DECLARATIVE = the END STATE: "there is 1 VM, 50GB disk, port 443 open, nginx running". The tool inspects reality, computes reality→desired diff, applies ONLY that. Same declaration works from nothing, from half-built, or from a drifted environment. Run it twice with no change → does NOTHING. FIVE THINGS IaC GIVES YOU OVER CLICKOPS: (1) REPEATABLE — the same files build dev/staging/prod identically (kills "works in staging" bugs); (2) REVIEWABLE — infra changes go through a PR + `plan` diff + approval, like code; (3) VERSIONED — "what did the network look like in March?" = `git log`; (4) RECOVERABLE — datacentre gone → re-apply the files into a new region in minutes; (5) NO CLICKOPS — no undocumented console click nobody else knows about. Almost all modern IaC tools are declarative (Terraform, OpenTofu, CloudFormation, Bicep, Pulumi, K8s manifests); Ansible / shell are imperative and use idempotent modules to approximate it.',
        hintHi: 'IMPERATIVE = STEPS: "ek VM banao, ek 50GB disk attach karo, port 443 kholo, nginx install karo". Aapko current state pata hona chahiye. DECLARATIVE = END STATE: "1 VM hai, 50GB disk, port 443 open, nginx running". Tool reality inspect karta hai, reality→desired diff compute karta hai, sirf wo apply karta hai. FIVE THINGS: (1) REPEATABLE — same files dev/staging/prod identically build karti hain; (2) REVIEWABLE — infra changes PR + `plan` diff + approval se guzarte hain; (3) VERSIONED — `git log`; (4) RECOVERABLE — datacentre gaya → files re-apply minutes mein; (5) NO CLICKOPS. Lagbhag saare modern IaC tools declarative hain; Ansible / shell imperative hain.',
      },
      {
        task: 'In a comment, define idempotency, give an idempotent and a non-idempotent shell example, and explain the four things `terraform apply` does depending on the gap between code and reality.',
        taskHi: 'Ek comment mein, idempotency define karo, ek idempotent aur ek non-idempotent shell example do.',
        hint: 'IDEMPOTENT = applying it N times == applying it once. NOT idempotent: `mkdir /data` (2nd run errors), `echo x >> f` (appends each time), thermostat "+2 degrees". Idempotent: `mkdir -p /data` (2nd run no-op), `echo x > f` (same result), thermostat "set to 21". `terraform apply` is idempotent by construction — it always does ONE thing: make reality match the code. THE FOUR OUTCOMES depending on the code↔reality gap: (1) reality already matches → "No changes", nothing happens; (2) reality is missing X → CREATE X; (3) reality has DRIFTED (a value differs from what state records) → correct it back to the declared value; (4) X was removed from the code → DESTROY X. The result depends only on (code, current reality), NEVER on how many times you ran apply. Why it matters for automation: zero bookkeeping — CI can run `terraform apply` on every merge to main without tracking "has this been applied yet", because a no-op merge produces a no-op apply. And it is safe to run by hand when unsure of the current state — it can only converge reality toward the code, never make things worse.',
        hintHi: 'IDEMPOTENT = ise N baar apply karna == ek baar apply karna. NOT idempotent: `mkdir /data`, `echo x >> f`, thermostat "+2 degrees". Idempotent: `mkdir -p /data`, `echo x > f`, thermostat "set to 21". `terraform apply` construction se idempotent hai — hamesha ONE cheez karta hai: reality ko code se match karao. FOUR OUTCOMES: (1) already match → "No changes"; (2) X missing → CREATE X; (3) DRIFTED → wapas declared value par correct; (4) X code se hataya → DESTROY X. Result sirf (code, current reality) par depend karta hai. Automation ke liye: zero bookkeeping.',
      },
      {
        task: 'In a comment, explain how terraform\'s desired-state model relates to Kubernetes\' reconciliation loop, and what "drift" is.',
        taskHi: 'Ek comment mein, samjhao ki terraform ka desired-state model Kubernetes ki reconciliation loop se kaise relate karta hai.',
        hint: 'SAME MODEL, DIFFERENT LAYER. Kubernetes (Module 7): a Deployment declares "3 Pods of this image"; a controller runs CONTINUOUSLY, watching actual vs desired, and reconciles — Pod dies → make a new one; replica count changed → adjust. Terraform: `.tf` files declare "1 VM, this size, this disk, port 443 open, this DNS record"; `terraform apply` reconciles CLOUD RESOURCES to the files — but each time you RUN it, not continuously in a daemon. K8s reconciles Pods to a spec; Terraform reconciles the VMs the Pods run on + the LB in front + the DB beside + the DNS pointing at it. Same idea (desired state in a file, a tool computes and applies the diff, idempotent by design), same benefits. DRIFT = reality no longer matches the code: a manual console change, an outage that recreated something with different settings, another tool touching a shared resource. Because the model is declarative + idempotent, the next `plan`/`apply` DETECTS drift and offers to correct it (reality → back to what the code says) — drift becomes VISIBLE and FIXABLE instead of a silent surprise. K8s corrects drift within seconds (the controller never stops); terraform corrects it on the next apply, so teams run a scheduled `terraform plan` to surface drift early (Lesson 3).',
        hintHi: 'SAME MODEL, DIFFERENT LAYER. Kubernetes: ek Deployment "3 Pods of this image" declare karta hai; ek controller CONTINUOUSLY chalta hai aur reconcile karta hai. Terraform: `.tf` files "1 VM, this size, port 443 open" declare karti hain; `terraform apply` CLOUD RESOURCES ko files se reconcile karta hai — har baar jab aap ise RUN karte ho, continuously nahi. Same idea, same benefits. DRIFT = reality ab code se match nahi karti: ek manual console change, ek outage. Kyunki model declarative + idempotent hai, agla `plan`/`apply` drift DETECT karta hai aur correct karne ka offer karta hai — drift VISIBLE aur FIXABLE ban jaata hai. Teams ek scheduled `terraform plan` chalate hain drift ko jaldi surface karne ke liye.',
      },
    ],

    keyTakeaways: [
      'IMPERATIVE states the STEPS (create, then modify, then run) — needs "if exists" guards, breaks if reality is not what you assumed, fails or duplicates on a second run. DECLARATIVE states the END STATE — the tool inspects reality, diffs, and applies only the gap. The same declaration works from nothing, half-built, or drifted. Almost all IaC (Terraform, OpenTofu, CloudFormation, Pulumi, K8s manifests) is declarative.',
      'INFRASTRUCTURE AS CODE = the desired state of servers / networks / LBs / DNS / databases / IAM / clusters written as text files in GIT, applied by a tool. Over ClickOps it buys: REPEATABLE (identical dev/staging/prod), REVIEWABLE (PR + `plan` diff + approval), VERSIONED (`git log` the infra), RECOVERABLE (re-apply into a new region), and NO undocumented console clicks.',
      'IDEMPOTENCY: `terraform apply` always does one thing — make reality match the code. Reality matches → "No changes". Missing → create. Drifted → correct back. Removed from code → destroy. The outcome depends only on (code, reality), never on run count — so CI can apply on every merge with zero bookkeeping, and a hand-run apply when unsure can only converge, never worsen.',
      'DRIFT = reality stopped matching the code (a console change, an outage, another tool). The declarative + idempotent model makes drift VISIBLE in the next `plan` and FIXABLE by the next `apply` — instead of a silent surprise months later. A scheduled `terraform plan` surfaces drift before it piles up.',
      'This is Kubernetes\' reconciliation loop (Module 7) one layer down: K8s continuously reconciles Pods to a Deployment spec; Terraform reconciles cloud resources to `.tf` files each time you run `apply`. Same mental model — desired state in a file, a tool computes and applies the diff, idempotent by design.',
    ],
    keyTakeawaysHi: [
      'IMPERATIVE STEPS batata hai (create, phir modify, phir run) — "if exists" guards chahiye, toot jaata hai agar reality wo nahi jo aapne assume kiya. DECLARATIVE END STATE batata hai — tool reality inspect karta hai, diff karta hai, sirf gap apply karta hai. Lagbhag saara IaC declarative hai.',
      'INFRASTRUCTURE AS CODE = servers / networks / LBs / DNS / databases / IAM / clusters ka desired state text files ke roop mein GIT mein, ek tool dwara apply. ClickOps ke upar: REPEATABLE, REVIEWABLE (PR + `plan` diff + approval), VERSIONED (`git log`), RECOVERABLE (naye region mein re-apply), aur koi undocumented console clicks nahi.',
      'IDEMPOTENCY: `terraform apply` hamesha ek cheez karta hai — reality ko code se match karao. Match → "No changes". Missing → create. Drifted → wapas correct. Code se hataya → destroy. Outcome sirf (code, reality) par depend karta hai, run count par kabhi nahi.',
      'DRIFT = reality ne code se match karna band kiya (ek console change, ek outage, ek doosra tool). Declarative + idempotent model drift ko agle `plan` mein VISIBLE aur agle `apply` se FIXABLE banata hai. Ek scheduled `terraform plan` drift ko pile up hone se pehle surface karta hai.',
      'Ye Kubernetes ki reconciliation loop (Module 7) ek layer neeche hai: K8s continuously Pods ko ek Deployment spec se reconcile karta hai; Terraform cloud resources ko `.tf` files se reconcile karta hai har baar jab aap `apply` chalate ho. Same mental model.',
    ],
  },

  {
    slug: 'ops-terraform-providers-resources-and-the-plan',
    title: 'Terraform: Providers, Resources & the Plan',
    titleHi: 'Terraform: Providers, Resources Aur Plan',
    description:
      'Terraform\'s building blocks: providers (the plugins that talk to AWS, Azure, GitHub, Kubernetes and hundreds more), resources (the things you declare), and data sources (things you look up). Terraform builds a dependency graph from the references between them, and `plan` shows you exactly what it will create, change, replace or destroy before `apply` touches anything.',
    descriptionHi:
      'Terraform ke building blocks: providers (plugins jo AWS, Azure, GitHub, Kubernetes aur sainkdon aur se baat karte hain), resources (jo cheezen aap declare karte ho), aur data sources (jo cheezen aap look up karte ho). Terraform unke beech ke references se ek dependency graph banata hai, aur `plan` aapko exactly dikhata hai kya ye create, change, replace ya destroy karega `apply` ke kuch touch karne se pehle.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 2,

    analogy: {
      en: '**An architect\'s drawing versus the builders.** The provider is the trade — a plumber, an electrician, a bricklayer — each one knows how to do one kind of work and speaks to one kind of supplier. A resource is a thing on the drawing you want built: "a bathroom here". A data source is a measurement you take of what already exists: "the mains water comes in on this wall". Before anyone lifts a tool, the architect walks you through the plan: "we add a bathroom, we move this door, we knock through that wall, we leave the kitchen alone". You approve the walkthrough, and only then do the builders start — and they do exactly what was on the walkthrough, in the order the dependencies require (you cannot tile a wall that is not built yet).',
      hi: '**Ek architect ki drawing versus builders.** Provider trade hai — ek plumber, ek electrician, ek bricklayer — har ek ek kind ka kaam karna jaanta hai aur ek kind ke supplier se baat karta hai. Ek resource drawing par ek cheez hai jo aap built chahte ho: "yahaan ek bathroom". Ek data source ek measurement hai jo aap us cheez ki lete ho jo already exist karti hai: "mains water is wall par aata hai". Koi tool uthाne se pehle, architect aapko plan ke through walk karता hai: "hum ek bathroom add karte hain, hum ye door move karte hain, hum us wall ko knock through karte hain, hum kitchen ko chhodते hain". Aap walkthrough approve karte ho, aur sirf phir builders start karte hain.',
    },

    simple: `**FOUR BLOCK TYPES you write in \`.tf\` files (HCL — HashiCorp Configuration Language):**
\`\`\`
terraform { }   settings: required terraform version, required PROVIDERS + versions, the BACKEND
provider  "x"   config for one provider (region, credentials source, ...)
resource  "type" "name" { }   a thing terraform MANAGES (creates/updates/deletes)
data      "type" "name" { }    a thing terraform LOOKS UP (read-only; already exists)
variable / output / locals / module   (Lesson 4)
\`\`\`

**PROVIDER** = a plugin that maps HCL to one platform's API. \`hashicorp/aws\`,
\`hashicorp/azurerm\`, \`hashicorp/google\`, \`hashicorp/kubernetes\`, \`integrations/github\`,
\`cloudflare/cloudflare\`, ... 3000+ in the registry. \`terraform init\` downloads them
into \`.terraform/\` and pins exact versions in \`.terraform.lock.hcl\` (commit that file).

**RESOURCE** = \`resource "aws_instance" "web" { ... }\`. Address = \`aws_instance.web\`.
Terraform creates it, tracks it in STATE (Lesson 3), updates it when the config
changes, destroys it when you remove the block.

**DATA SOURCE** = \`data "aws_ami" "ubuntu" { ... }\`. Terraform reads it every run;
never creates or changes it. Use it to pull in things owned elsewhere (the latest
AMI id, an existing VPC, a secret from a secret manager).

**THE DEPENDENCY GRAPH** — you never write ordering. Terraform reads it from
REFERENCES: \`subnet_id = aws_subnet.main.id\` means "the subnet must exist first".
It builds a DAG and creates/updates in dependency order, in parallel where it can.
\`depends_on = [...]\` adds an edge the references don't capture.

**\`terraform plan\` — the diff, shown BEFORE anything changes:**
\`\`\`
  + create              a new resource
  - destroy             a resource removed from the config
  ~ update in-place     an attribute changed, no recreation ("0 to destroy")
-/+ replace             a change to an immutable attribute -> destroy then create
                        (plan prints "# forces replacement" next to the attribute)
Plan: 2 to add, 1 to change, 1 to destroy.
\`\`\`
\`plan -out=f\` saves it; \`apply f\` runs *exactly that* plan. Always read the plan —
the "1 to destroy" is where outages come from.`,

    simpleHi: `**CHAAR BLOCK TYPES jo aap \`.tf\` files mein likhte ho (HCL):**
\`\`\`
terraform { }   settings: required terraform version, required PROVIDERS + versions, BACKEND
provider  "x"   ek provider ke liye config (region, credentials source, ...)
resource  "type" "name" { }   ek cheez jo terraform MANAGE karta hai (create/update/delete)
data      "type" "name" { }    ek cheez jo terraform LOOK UP karta hai (read-only; already exists)
variable / output / locals / module   (Lesson 4)
\`\`\`

**PROVIDER** = ek plugin jo HCL ko ek platform ke API se map karta hai. \`hashicorp/aws\`,
\`hashicorp/azurerm\`, \`hashicorp/google\`, \`hashicorp/kubernetes\`, ... registry mein 3000+.
\`terraform init\` unhe \`.terraform/\` mein download karta hai aur exact versions
\`.terraform.lock.hcl\` mein pin karta hai (wo file commit karo).

**RESOURCE** = \`resource "aws_instance" "web" { ... }\`. Address = \`aws_instance.web\`.
Terraform ise banata hai, STATE mein track karta hai (Lesson 3), config badalne par
update karta hai, block hatane par destroy karta hai.

**DATA SOURCE** = \`data "aws_ami" "ubuntu" { ... }\`. Terraform ise har run read karta
hai; kabhi create ya change nahi karta. Ise cheezen pull karne ke liye use karo jo
kahin aur owned hain.

**DEPENDENCY GRAPH** — aap kabhi ordering nahi likhते. Terraform ise REFERENCES se
padhta hai: \`subnet_id = aws_subnet.main.id\` ka matlab "subnet pehle exist karna
chahiye". Ye ek DAG banata hai. \`depends_on = [...]\` ek edge add karta hai jo
references capture nahi karte.

**\`terraform plan\` — diff, kuch badalne se PEHLE dikhaya:**
\`\`\`
  + create              ek naya resource
  - destroy             ek resource config se hataya gaya
  ~ update in-place     ek attribute badla, koi recreation nahi ("0 to destroy")
-/+ replace             ek immutable attribute ka change -> destroy phir create
Plan: 2 to add, 1 to change, 1 to destroy.
\`\`\`
\`plan -out=f\` ise save karta hai; \`apply f\` *exactly wo* plan chalata hai. Hamesha
plan padho — "1 to destroy" wahaan hai jahaan se outages aate hain.`,

    content: `## HCL and the four blocks

Terraform configuration is written in **HCL** (HashiCorp Configuration Language) in files ending \`.tf\`. All \`.tf\` files in a directory are concatenated — order and file names do not matter. The blocks you write:

- **\`terraform { }\`** — settings for terraform itself: which terraform versions are allowed (\`required_version\`), which providers this configuration needs and their version constraints (\`required_providers\`), and the **backend** (where state lives — Lesson 3).
- **\`provider "aws" { }\`** — configuration for a provider instance: region, and how it finds credentials (environment variables, a shared config file, an assumed role, instance metadata — never hard-coded).
- **\`resource "TYPE" "NAME" { }\`** — a piece of infrastructure terraform will **manage**: create it, track it, update it when you change the block, destroy it when you delete the block. The **resource address** is \`TYPE.NAME\` (e.g. \`aws_instance.web\`).
- **\`data "TYPE" "NAME" { }\`** — a **data source**: something terraform **reads** on every run and never modifies. Used to look up values owned outside this configuration.

Plus \`variable\`, \`output\`, \`locals\` and \`module\` — Lesson 4.

## Providers

A **provider** is a plugin that translates HCL resource blocks into API calls for one platform. \`hashicorp/aws\` knows how to create an EC2 instance; \`hashicorp/azurerm\` knows Azure VMs; \`hashicorp/kubernetes\` applies manifests; \`integrations/github\` manages repositories and teams; there are providers for Cloudflare, Datadog, PagerDuty, Postgres, Vault, and thousands more in the public registry. A single configuration commonly uses several — an app might need \`aws\` for infrastructure, \`kubernetes\` and \`helm\` for what runs on it, and \`github\` for the repository and its secrets.

\`terraform init\` reads \`required_providers\`, downloads the matching plugin versions into \`.terraform/\`, and records the exact resolved versions (and their checksums) in **\`.terraform.lock.hcl\`**. Commit that lock file: it guarantees every developer and the CI pipeline use byte-identical provider versions, the same way a \`package-lock.json\` pins npm dependencies.

## Resources and data sources

A **resource** is the unit of managed infrastructure. \`resource "aws_db_instance" "main" { ... }\` tells terraform: this database should exist, with these settings. Terraform creates it on the first apply, stores its identity and attributes in state, and on later applies compares the block against state and reality to decide whether to update in place, replace, or leave it alone. Deleting the block tells terraform to destroy the database.

A **data source** is a read-only lookup. \`data "aws_ami" "ubuntu" { filter { ... } }\` finds the current Ubuntu image id so you do not hard-code one that goes stale. \`data "aws_vpc" "existing" { tags = { Name = "main" } }\` pulls in a VPC that another team or another terraform configuration owns, so you can attach resources to it without managing it. Data sources are read on every plan and apply; if the underlying thing changes, your next plan sees the new value.

## The dependency graph

You never write execution order in terraform. Instead, terraform builds a **directed acyclic graph** from the references between blocks. When \`aws_instance.web\` has \`subnet_id = aws_subnet.main.id\`, terraform knows \`aws_subnet.main\` must be created before \`aws_instance.web\`, and that changing the subnet may affect the instance. It walks the graph in dependency order, and runs independent branches **in parallel** (default: up to 10 at once).

Two references it cannot see from attributes: when resource A must exist before resource B but B does not reference any of A's attributes (an IAM policy that must be attached before an instance profile is used, say). For those you add an explicit edge with \`depends_on = [aws_iam_role_policy.example]\`. Use it sparingly — most ordering falls out of natural references, and over-using \`depends_on\` creates coarse dependencies that reduce parallelism.

## The plan

\`terraform plan\` is terraform's most important safety feature. It refreshes state against reality, computes the diff between your configuration and that reality, and prints **exactly what apply would do**, with no changes made. The action symbols:

- **\`+\` create** — a resource in the config that does not exist yet.
- **\`-\` destroy** — a resource in state that is no longer in the config (you deleted the block), or a \`terraform plan -destroy\`.
- **\`~\` update in-place** — an attribute changed and the provider can modify it without recreating the resource. The plan shows \`~ old -> new\` and the summary says "N to change" with "0 to destroy".
- **\`-/+\` replace** — an attribute changed that the provider *cannot* modify in place (an EC2 AMI, an RDS engine, a resource name on many services). Terraform will **destroy the existing resource and create a new one**. The plan prints \`# forces replacement\` next to the offending attribute. This is where downtime hides — a replace on your database is a very different thing from a replace on a DNS record.

\`terraform plan -out=tf.plan\` saves the plan to a file. \`terraform apply tf.plan\` then executes **that exact plan** — no re-planning, no prompt — which is the basis of the review-then-apply CI flow in Lesson 5. Always read the plan before approving it; the summary line and every \`-\` and \`-/+\` are what you are actually agreeing to.`,

    contentHi: `## HCL aur chaar blocks

Terraform configuration **HCL** mein likhi jaati hai \`.tf\` files mein. Ek directory mein saari \`.tf\` files concatenate hoti hain — order aur file names matter nahi karte. Jo blocks aap likhte ho:

- **\`terraform { }\`** — terraform ke liye settings: kaun se terraform versions allowed hain, kaun se providers chahiye aur unke version constraints, aur **backend** (state kahaan rehta hai — Lesson 3).
- **\`provider "aws" { }\`** — ek provider instance ke liye config: region, aur ye credentials kaise dhoondhta hai (kabhi hard-coded nahi).
- **\`resource "TYPE" "NAME" { }\`** — infrastructure ka ek piece jo terraform **manage** karega. **Resource address** \`TYPE.NAME\` hai.
- **\`data "TYPE" "NAME" { }\`** — ek **data source**: kuch jo terraform har run **read** karta hai aur kabhi modify nahi karta.

## Providers

Ek **provider** ek plugin hai jo HCL resource blocks ko ek platform ke liye API calls mein translate karta hai. \`hashicorp/aws\` ek EC2 instance banana jaanta hai; \`hashicorp/azurerm\` Azure VMs; \`hashicorp/kubernetes\` manifests apply karta hai; public registry mein hazaron hain. Ek single configuration aam taur par kई use karta hai.

\`terraform init\` \`required_providers\` read karta hai, matching plugin versions \`.terraform/\` mein download karta hai, aur exact resolved versions **\`.terraform.lock.hcl\`** mein record karta hai. Wo lock file commit karo.

## Resources aur data sources

Ek **resource** managed infrastructure ki unit hai. Terraform ise pehle apply par banata hai, iski identity aur attributes state mein store karta hai, aur baad ke applies par block ko state aur reality ke against compare karta hai. Block delete karna terraform ko database destroy karne ko kehta hai.

Ek **data source** ek read-only lookup hai. \`data "aws_ami" "ubuntu"\` current Ubuntu image id dhoondhता hai. Data sources har plan aur apply par read hote hain.

## Dependency graph

Aap kabhi execution order nahi likhते. Terraform blocks ke beech ke references se ek **directed acyclic graph** banata hai. Jab \`aws_instance.web\` mein \`subnet_id = aws_subnet.main.id\` hai, terraform jaanta hai \`aws_subnet.main\` pehle banana chahiye. Ye graph ko dependency order mein walk karta hai, aur independent branches **parallel mein** chalata hai.

Do references jo ye attributes se nahi dekh sakta ke liye aap \`depends_on = [...]\` ke saath ek explicit edge add karते ho. Ise sparingly use karo.

## Plan

\`terraform plan\` terraform ka sabse important safety feature hai. Ye state ko reality ke against refresh karta hai, diff compute karta hai, aur **exactly kya apply karega** print karta hai, koi changes nahi. Action symbols:

- **\`+\` create** — config mein ek resource jo abhi exist nahi karta.
- **\`-\` destroy** — state mein ek resource jo ab config mein nahi hai.
- **\`~\` update in-place** — ek attribute badla aur provider ise recreate kiye bina modify kar sakta hai. Summary "N to change" "0 to destroy" ke saath.
- **\`-/+\` replace** — ek attribute badla jo provider in place modify *nahi* kar sakta. Terraform **existing resource destroy karega aur ek naya banayega**. Plan \`# forces replacement\` print karta hai. Yahaan downtime chhupti hai.

\`terraform plan -out=tf.plan\` plan ko ek file mein save karta hai. \`terraform apply tf.plan\` phir **wo exact plan** execute karta hai. Hamesha plan padho approve karne se pehle.`,

    examples: [
      {
        title: 'The four plan symbols: create (+), replace (-/+), destroy (-)',
        titleHi: 'Chaar plan symbols: create (+), replace (-/+), destroy (-)',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

cat > main.tf <<'EOF'
terraform {
  required_providers {
    local = { source = "hashicorp/local", version = "2.9.0" }
  }
}
variable "message" { default = "v1" }
resource "local_file" "config" {
  content  = "message=\${var.message}\\n"
  filename = "\${path.module}/app.conf"
}
EOF
terraform init -no-color -input=false >/dev/null

echo "=== plan: nothing exists -> CREATE (the + symbol) ==="
terraform plan -no-color 2>&1 | grep -E '^  # |^Plan:'

terraform apply -no-color -auto-approve >/dev/null

echo
echo "=== plan -var message=v2 : this resource can't update in place -> REPLACE (-/+) ==="
terraform plan -no-color -var 'message=v2' 2>&1 | grep -E '^  # |forces replacement|^Plan:'

echo
echo "=== plan -destroy : tear it all down -> DESTROY (the - symbol) ==="
terraform plan -no-color -destroy 2>&1 | grep -E '^  # |^Plan:'

echo
echo "the fourth symbol, ~ (update in place, '0 to destroy'), needs a resource that"
echo "supports it - e.g. changing tags on an aws_instance. changing its ami is -/+."`,
        output: `=== plan: nothing exists -> CREATE (the + symbol) ===
  # local_file.config will be created
Plan: 1 to add, 0 to change, 0 to destroy.

=== plan -var message=v2 : this resource can't update in place -> REPLACE (-/+) ===
  # local_file.config must be replaced
      ~ content              = <<-EOT # forces replacement
Plan: 1 to add, 0 to change, 1 to destroy.

=== plan -destroy : tear it all down -> DESTROY (the - symbol) ===
  # local_file.config will be destroyed
Plan: 0 to add, 0 to change, 1 to destroy.

the fourth symbol, ~ (update in place, '0 to destroy'), needs a resource that
supports it - e.g. changing tags on an aws_instance. changing its ami is -/+.`,
        explain: 'One resource — a file whose content comes from a variable — is used to show what a plan looks like in each situation. With nothing built yet, the plan is a pure create: "will be created", "1 to add". After applying, changing the variable changes the file content; the local_file resource has no in-place update for content, so terraform reports "must be replaced" and annotates the content attribute with "# forces replacement", and the summary becomes "1 to add, 1 to destroy" — the same resource address is destroyed and recreated. A plan with -destroy shows the pure removal: "will be destroyed", "1 to destroy". The fourth symbol, ~ for a true in-place update, needs a provider that can PATCH the attribute — changing the tags on an aws_instance updates it in place ("1 to change, 0 to destroy"), whereas changing its AMI forces a replace just like the file content here. Reading which symbol applies to which resource is the core skill: a replace on a stateless thing is routine, a replace on a database or a stateful volume is an outage, and the plan is where you catch that before it happens.',
        explainHi: 'Ek resource — ek file jiska content ek variable se aata hai — use kiya gaya hai ye dikhane ke liye ek plan har situation mein kaisा dikhta hai. Kuch built nahi hone ke saath, plan ek pure create hai. Apply karne ke baad, variable badalna file content badalta hai; local_file resource ke paas content ke liye koi in-place update nahi hai, to terraform "must be replaced" report karta hai aur content attribute ko "# forces replacement" se annotate karta hai. Ek -destroy wala plan pure removal dikhata hai. Chautha symbol, ~ ek true in-place update ke liye, ek provider chahiye jo attribute ko PATCH kar sake — ek aws_instance par tags badalna ise in place update karta hai, jabki iska AMI badalna ek replace force karta hai. Kaun sa symbol kaun se resource par apply hota hai padhna core skill hai: ek stateless cheez par replace routine hai, ek database par replace ek outage hai.',
      },
      {
        title: 'The dependency graph: terraform derives order from references, not file layout',
        titleHi: 'Dependency graph: terraform order references se derive karta hai, file layout se nahi',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

cat > main.tf <<'EOF'
terraform {
  required_providers {
    local  = { source = "hashicorp/local",  version = "2.9.0" }
    random = { source = "hashicorp/random", version = "3.9.0" }
  }
}

# there is NO explicit ordering anywhere - terraform derives it from references

resource "random_pet" "env" {
  length = 1
}

resource "local_file" "name_file" {
  content  = "env=\${random_pet.env.id}\\n"        # references random_pet -> depends on it
  filename = "\${path.module}/name.txt"
}

data "local_file" "readback" {
  filename = local_file.name_file.filename        # references local_file -> reads AFTER it exists
}

output "data_source_saw" {
  value = trimspace(data.local_file.readback.content)
}
EOF
terraform init -no-color -input=false >/dev/null

echo "=== apply: terraform creates in dependency order, not file order ==="
terraform apply -no-color -auto-approve 2>&1 \\
  | grep -E 'Creating\\.\\.\\.|Read complete' \\
  | sed -E 's/ \\[id=[^]]*\\]//; s/ after [0-9]+s//'

echo
echo "=== terraform graph:  \\"X\\" -> \\"Y\\"  means  X needs Y first ==="
terraform graph 2>&1 | grep -oE '"[a-z._]+" -> "[a-z._]+"' | sort

echo
terraform output -no-color 2>&1 | sed -E 's/=[a-z]+"/=<pet>"/'`,
        output: `=== apply: terraform creates in dependency order, not file order ===
random_pet.env: Creating...
local_file.name_file: Creating...
data.local_file.readback: Read complete

=== terraform graph:  "X" -> "Y"  means  X needs Y first ===
"data.local_file.readback" -> "local_file.name_file"
"local_file.name_file" -> "random_pet.env"

data_source_saw = "env=<pet>"`,
        explain: 'Three blocks reference each other in a chain: the file\'s content interpolates the random pet\'s id, and the data source\'s filename comes from the file resource. No depends_on is written anywhere. Terraform parses these references, builds a graph, and applies in the only valid order — the random pet first, then the file that needs its value, then the data source that reads the file back. The apply log shows exactly that sequence. terraform graph prints the dependency edges directly: each "A" -> "B" means A cannot be processed until B exists. The output confirms the data source really did read the file that the earlier resource wrote, proving the ordering held. The lesson is that you describe relationships, not steps: put aws_subnet.main.id where the instance needs it and terraform will always create the subnet first, create independent resources in parallel, and destroy in reverse dependency order. depends_on is only for the rare edge terraform cannot infer — resource A must exist before B, but B\'s configuration never mentions A.',
        explainHi: 'Teen blocks ek chain mein ek doosre ko reference karte hain: file ka content random pet ka id interpolate karta hai, aur data source ka filename file resource se aata hai. Koi depends_on kahin nahi likha. Terraform in references ko parse karta hai, ek graph banata hai, aur ekmatra valid order mein apply karta hai — random pet pehle, phir file jise iski value chahiye, phir data source jo file wapas read karता hai. terraform graph dependency edges seedhे print karta hai: har "A" -> "B" ka matlab A process nahi ho sakta jab tak B exist nahi karta. Lesson ye hai ki aap relationships describe karte ho, steps nahi: \`aws_subnet.main.id\` wahaan rakho jahaan instance ko chahiye aur terraform hamesha subnet pehle banayega. depends_on sirf us rare edge ke liye hai jo terraform infer nahi kar sakta.',
      },
    ],

    mistakes: [
      {
        wrong: `# not reading the plan - just typing 'yes' (or running apply -auto-approve by hand)
$ terraform apply
  # ...40 lines of plan output scroll past...
Plan: 3 to add, 1 to change, 2 to destroy.
Do you want to perform these actions?
  Enter a value: yes
# one of the "2 to destroy" was aws_db_instance.main, because a teammate changed
# 'engine_version' in a way that forces replacement. the database (and its data)
# is gone. the plan said so, on a line you scrolled past.`,
        right: `# read every plan. in CI, make the plan a required review artifact:
$ terraform plan -no-color -out tf.plan
$ terraform show -no-color tf.plan | grep -E 'will be (destroyed|replaced)|forces replacement'
  # aws_db_instance.main must be replaced
  #   engine_version = "14.7" -> "15.3" # forces replacement
# STOP. a replace on a stateful resource = data loss. options:
#   - is an in-place upgrade path available? (often engine_version CAN be ~ if minor)
#   - snapshot first + accept the downtime window, scheduled
#   - use create_before_destroy + a migration
# a policy check (Lesson 5) can hard-FAIL any plan that destroys a resource
# tagged 'stateful' unless a human approves.`,
        why: 'The plan is the entire safety mechanism of terraform, and it only works if someone reads it. The dangerous lines are the destroys and the replaces, and a replace is especially easy to miss because it looks like a change — you changed one attribute, terraform is "updating" the resource — except the update is a destroy followed by a create, and for anything stateful (a database, a disk, a stateful set\'s volume) that means the data is gone. The failure mode is a plan that scrolls past in a terminal, a summary line reading "2 to destroy" that nobody parses, and a "yes" typed from habit. The fix is process: never auto-approve a plan a human has not read; in CI, save the plan with \`-out\` and surface the destroys and replaces as a required part of code review; and add a policy check that automatically fails any plan destroying a resource marked stateful unless a reviewer explicitly overrides. When a replace on a stateful resource is genuinely necessary, it is planned — a snapshot, a scheduled window, a migration, \`create_before_destroy\` — not discovered at apply time.',
        whyHi: 'Plan terraform ka poora safety mechanism hai, aur ye sirf tab kaam karता hai agar koi ise padhता hai. Dangerous lines destroys aur replaces hain, aur ek replace miss karna especially aasan hai kyunki ye ek change jaisा dikhता hai — aapne ek attribute badla, terraform resource "update" kar raha hai — sivaay iske ki update ek destroy hai uske baad ek create, aur kisi bhi stateful cheez ke liye iska matlab data chala gaya. Failure mode ek plan hai jo ek terminal mein scroll ho jaata hai, ek summary line "2 to destroy" jise koi parse nahi karता, aur habit se type kiya gaya "yes". Fix process hai: kabhi ek plan auto-approve mat karo jise ek human ne nahi padha; CI mein, plan ko \`-out\` se save karo aur destroys aur replaces ko code review ka ek required part banao; aur ek policy check add karo.',
      },
      {
        wrong: `# not committing .terraform.lock.hcl - or deleting it "because it keeps changing"
$ echo '.terraform*' >> .gitignore     # oops: this ignores the lock file too
# result: every developer + CI resolves provider versions independently.
# your laptop: aws provider 5.40. CI: aws provider 5.72 (released yesterday).
# 5.72 changed a default -> CI's plan shows changes yours didn't. or worse,
# 5.72 has a regression and CI applies broken infra.`,
        right: `# .gitignore:
.terraform/            # the downloaded provider binaries - big, machine-specific
*.tfstate             # NEVER commit state (Lesson 3)
*.tfstate.backup
# but DO commit:
.terraform.lock.hcl    # pins exact provider versions + checksums for everyone

# and pin a sensible range in required_providers so 'init -upgrade' is deliberate:
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.70" }   # 5.70.x .. <6.0
  }
}
# bump it in a PR: 'terraform init -upgrade' -> commit the changed lock file ->
# review the plan diff the new version produces.`,
        why: 'Terraform providers are dependencies exactly like npm packages, and they ship changes — new defaults, new validation, occasionally regressions — on their own schedule, often several releases a week for the big cloud providers. \`.terraform.lock.hcl\` is terraform\'s lock file: it records the exact provider versions and their checksums that were resolved, so that \`terraform init\` on any other machine installs byte-identical plugins. If the lock file is not committed — or is caught by an over-broad \`.terraform*\` gitignore rule — then every developer and the CI runner resolves versions independently against the constraint in \`required_providers\`, and they drift apart: your machine plans with one version, CI plans with a newer one that changed a default, and the plans disagree for reasons unrelated to your change. Worse, a provider release with a regression gets picked up silently by CI and applied. The correct setup ignores \`.terraform/\` (the large machine-specific binaries) and all \`*.tfstate\` files, but commits the lock file, and pins a deliberate version range in \`required_providers\` so that upgrading providers is an explicit \`init -upgrade\` in a pull request with the resulting plan diff reviewed.',
        whyHi: 'Terraform providers exactly npm packages ki tarah dependencies hain, aur wo apne schedule par changes ship karते hain — naye defaults, naya validation, kabhi kabhi regressions — badे cloud providers ke liye aksar ek hafte mein kई releases. \`.terraform.lock.hcl\` terraform ka lock file hai: ye exact provider versions aur unke checksums record karta hai, taaki kisi bhi doosri machine par \`terraform init\` byte-identical plugins install kare. Agar lock file commit nahi hai — ya ek over-broad \`.terraform*\` gitignore rule se pakda gaya — to har developer aur CI runner versions independently resolve karte hain, aur wo drift apart hote hain. Correct setup \`.terraform/\` aur saari \`*.tfstate\` files ignore karta hai, par lock file commit karta hai, aur \`required_providers\` mein ek deliberate version range pin karता hai.',
      },
      {
        wrong: `# using a resource where a data source was right - terraform now "owns" something it shouldn't
resource "aws_vpc" "main" {           # the VPC already exists, built by the platform team
  cidr_block = "10.0.0.0/16"
}
# terraform apply: either it tries to CREATE a second VPC, or (if imported) it now
# manages the platform team's VPC - and 'terraform destroy' in your dev environment
# would delete the shared VPC everyone uses.`,
        right: `# it exists and someone else owns it -> LOOK IT UP with a data source:
data "aws_vpc" "main" {
  tags = { Name = "shared-main" }
}
resource "aws_subnet" "app" {
  vpc_id     = data.aws_vpc.main.id     # reference the looked-up id
  cidr_block = "10.0.42.0/24"
}
# terraform manages only your subnet. it reads the VPC every run but never
# creates, changes, or destroys it. 'terraform destroy' removes your subnet only.`,
        why: 'A resource block means "terraform owns the lifecycle of this thing" — it will create it, and crucially it will destroy it when the block is removed or \`terraform destroy\` is run. A data source means "terraform reads this thing that something else owns". Using a resource block for infrastructure that already exists and belongs to another team is a category error with two bad outcomes: either terraform tries to create a duplicate (a second VPC with the same CIDR, which fails or causes conflicts), or someone runs \`terraform import\` to adopt the existing one and now your configuration manages a shared resource — at which point a \`terraform destroy\` in a development environment, or a plan that decides the VPC must be replaced, takes out infrastructure that dozens of other people depend on. The rule is ownership: if this configuration is responsible for creating and deleting the thing, it is a \`resource\`; if the thing is owned elsewhere and you only need to reference its attributes, it is a \`data\` source. Data sources let you compose against infrastructure you do not manage without any risk of terraform modifying it.',
        whyHi: 'Ek resource block ka matlab "terraform is cheez ka lifecycle own karता hai" — ye ise banayega, aur crucially ye ise destroy karega jab block hataya jaaye ya \`terraform destroy\` chale. Ek data source ka matlab "terraform ye cheez read karता hai jo kuch aur own karता hai". Infrastructure jo already exist karti hai aur doosri team ki hai ke liye ek resource block use karna ek category error hai do bure outcomes ke saath: ya to terraform ek duplicate banane ki koshish karता hai, ya koi \`terraform import\` chalाता hai existing ko adopt karne ke liye aur ab aapki configuration ek shared resource manage karती hai — us point par ek dev environment mein \`terraform destroy\` infrastructure le leता hai jis par dozens log depend karते hain. Rule ownership hai: agar ye configuration cheez banane aur delete karne ke liye responsible hai, ye ek \`resource\` hai; agar cheez kahin aur owned hai, ye ek \`data\` source hai.',
      },
    ],

    realWorld: [
      {
        en: '**A "version bump" that dropped a table** — a PR changed an RDS \`engine_version\` from 13 to 15. The plan said "must be replaced / # forces replacement" but the reviewer skimmed. Apply destroyed the instance; the nightly snapshot was 19 hours old. Now CI fails any plan with \`forces replacement\` on an \`aws_db_instance\` unless a \`DATA-LOSS-OK\` label is on the PR.',
        hi: '**Ek "version bump" jisne ek table drop ki** — ek PR ne ek RDS \`engine_version\` 13 se 15 badla. Plan ne "must be replaced" kaha par reviewer ne skim kiya. Ab CI koi bhi plan fail karta hai jisme \`aws_db_instance\` par \`forces replacement\` hai.',
      },
      {
        en: '**Provider drift between laptop and CI** — a dev\'s plan was clean; CI\'s plan for the same commit showed 12 changes. Cause: \`.terraform.lock.hcl\` was gitignored, CI had picked up an aws provider release from that morning that flipped a default on \`aws_s3_bucket\`. Committing the lock file made both plans identical.',
        hi: '**Laptop aur CI ke beech provider drift** — ek dev ka plan clean tha; same commit ke liye CI ka plan 12 changes dikhाya. Cause: \`.terraform.lock.hcl\` gitignored tha. Lock file commit karne se dono plans identical ho gaye.',
      },
      {
        en: '**\`terraform destroy\` in dev took out shared networking** — a dev environment had \`resource "aws_vpc" "main"\` (imported months earlier "to make the plan clean"). A routine \`destroy\` to save weekend costs deleted the VPC that staging also used. Rebuilt as a \`data "aws_vpc"\` lookup; dev now owns only its own subnets.',
        hi: '**Dev mein \`terraform destroy\` ne shared networking le liya** — ek dev environment mein \`resource "aws_vpc" "main"\` tha (mahine pehle imported). Weekend costs bachane ke liye ek routine \`destroy\` ne wo VPC delete ki jo staging bhi use karta tha. \`data "aws_vpc"\` lookup ke roop mein rebuild kiya.',
      },
    ],

    interviewQA: [
      {
        q: 'Explain providers, resources and data sources, and how terraform decides the order to create things.',
        qHi: 'Providers, resources aur data sources samjhao, aur terraform kaise decide karta hai cheezen banane ka order.',
        a: 'A provider is a plugin that translates terraform\'s HCL into API calls for one platform — hashicorp/aws, hashicorp/azurerm, hashicorp/kubernetes, integrations/github and thousands more. \`terraform init\` downloads the versions named in \`required_providers\` and records the exact resolved versions and checksums in \`.terraform.lock.hcl\`, which you commit so everyone and CI use identical versions. A resource block declares a piece of infrastructure terraform manages: it creates it, tracks it in state, updates it when the block changes, and destroys it when the block is removed. A data source declares something terraform only reads on each run and never modifies — used to look up values owned outside this configuration, like the latest AMI id or an existing VPC. Terraform never takes an explicit execution order from you. It builds a directed acyclic graph from the references between blocks: if \`aws_instance.web\` sets \`subnet_id = aws_subnet.main.id\`, terraform knows the subnet must exist first. It walks that graph in dependency order, running independent branches in parallel, and destroys in reverse order. For the rare case where A must precede B but B\'s config never references A, you add an explicit \`depends_on\`; everything else falls out of natural references.',
        aHi: 'Ek provider ek plugin hai jo terraform ki HCL ko ek platform ke liye API calls mein translate karता hai. \`terraform init\` \`required_providers\` mein named versions download karता hai aur exact resolved versions \`.terraform.lock.hcl\` mein record karता hai, jo aap commit karते ho. Ek resource block infrastructure ka ek piece declare karता hai jo terraform manage karता hai. Ek data source kuch declare karता hai jo terraform sirf read karता hai aur kabhi modify nahi karता. Terraform kabhi aapse ek explicit execution order nahi leता. Ye blocks ke beech ke references se ek DAG banाता hai: agar \`aws_instance.web\` \`subnet_id = aws_subnet.main.id\` set karता hai, terraform jaanता hai subnet pehle exist karna chahiye. Rare case ke liye jahaan A ko B se pehle hona chahiye par B ka config kabhi A reference nahi karता, aap ek explicit \`depends_on\` add karते ho.',
      },
      {
        q: 'What do the plan symbols +, -, ~ and -/+ mean, and which one is the dangerous one?',
        qHi: 'Plan symbols +, -, ~ aur -/+ ka kya matlab hai, aur kaun sa dangerous hai?',
        a: '\`+\` create is a resource in the configuration that does not exist yet. \`-\` destroy is a resource in state that is no longer in the configuration, or a \`plan -destroy\`. \`~\` update in-place is an attribute that changed and the provider can modify without recreating the resource; the summary shows "N to change" with "0 to destroy". \`-/+\` replace is an attribute that changed which the provider cannot modify in place — an EC2 AMI, an RDS engine version, a name on many resources — so terraform will destroy the existing resource and create a new one, and the plan prints "# forces replacement" next to that attribute. The dangerous one is \`-/+\` replace, for two reasons. First, it is easy to misread as a routine change: you edited one field, terraform is "updating" the resource, but the update is really a delete-then-create. Second, for anything stateful — a database, a persistent disk, a stateful set\'s volume — a replace destroys the data. A replace on a DNS record is nothing; a replace on your production database is a data-loss incident. Reading the plan means specifically checking every \`-\` and every \`-/+\`, and a good CI setup fails automatically on a replace of a resource marked stateful unless a human explicitly approves it.',
        aHi: '\`+\` create configuration mein ek resource hai jo abhi exist nahi karता. \`-\` destroy state mein ek resource hai jo ab configuration mein nahi hai. \`~\` update in-place ek attribute hai jo badla aur provider ise recreate kiye bina modify kar sakता hai; summary "N to change" "0 to destroy" ke saath. \`-/+\` replace ek attribute hai jo badla jo provider in place modify nahi kar sakता — to terraform existing resource destroy karega aur ek naya banayega, aur plan "# forces replacement" print karता hai. Dangerous \`-/+\` replace hai, do reasons se. Pehla, ise ek routine change ke roop mein misread karna aasan hai. Doosra, kisi bhi stateful cheez ke liye — ek database, ek persistent disk — ek replace data destroy karता hai. Ek DNS record par replace kuch nahi; aapke production database par replace ek data-loss incident hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, list the four HCL block types and what each is for, and explain the difference between a `resource` and a `data` source in terms of ownership.',
        taskHi: 'Ek comment mein, chaar HCL block types aur har ek kis liye hai list karo.',
        hint: 'FOUR BLOCK TYPES (in `.tf` files — HCL; all `.tf` in a dir are concatenated, order/filenames irrelevant): (1) `terraform { }` — settings for terraform itself: `required_version`, `required_providers` (which providers + version constraints), and the `backend` (where state lives, Lesson 3). (2) `provider "aws" { }` — config for one provider instance: region, how it finds credentials (env vars / shared config / assumed role / instance metadata — NEVER hard-coded). (3) `resource "TYPE" "NAME" { }` — infra terraform MANAGES: creates it, tracks it in state, updates on block change, DESTROYS it when you delete the block. Address = `TYPE.NAME`. (4) `data "TYPE" "NAME" { }` — a data source: terraform READS it every run, NEVER creates/changes/destroys it. (Plus `variable`/`output`/`locals`/`module` — Lesson 4.) RESOURCE vs DATA = OWNERSHIP: a `resource` means "this config owns the lifecycle — create AND delete". A `data` source means "something else owns this; I only reference its attributes". Using a `resource` for infra another team owns → either terraform makes a duplicate, or (if imported) a `terraform destroy` in dev / a forced-replace plan takes out shared infrastructure. If this config creates and deletes the thing → `resource`; if it is owned elsewhere and you just need its id/attributes → `data`.',
        hintHi: 'FOUR BLOCK TYPES: (1) `terraform { }` — terraform ke liye settings: `required_version`, `required_providers`, `backend`. (2) `provider "aws" { }` — ek provider instance ke liye config: region, credentials kaise dhoondhta hai (kabhi hard-coded nahi). (3) `resource "TYPE" "NAME" { }` — infra jo terraform MANAGE karta hai: banata hai, state mein track, block delete karne par DESTROY. Address = `TYPE.NAME`. (4) `data "TYPE" "NAME" { }` — data source: terraform har run READ karta hai, kabhi create/change/destroy nahi. RESOURCE vs DATA = OWNERSHIP: `resource` = "ye config lifecycle own karta hai — create AUR delete". `data` = "kuch aur ise own karta hai; main sirf iske attributes reference karta hoon".',
      },
      {
        task: 'In a comment, explain the four plan action symbols, why `-/+` is the one to watch, and how to make CI enforce that.',
        taskHi: 'Ek comment mein, chaar plan action symbols samjhao, `-/+` kyun dekhne wala hai.',
        hint: '`terraform plan` refreshes state vs reality, diffs config vs reality, prints EXACTLY what apply would do — no changes made. SYMBOLS: `+` CREATE (in config, does not exist yet). `-` DESTROY (in state, removed from config — or `plan -destroy`). `~` UPDATE IN-PLACE (attribute changed, provider can PATCH it without recreating — summary "N to change", "0 to destroy"). `-/+` REPLACE (attribute changed that the provider CANNOT modify in place — an EC2 `ami`, an RDS `engine_version`, a `name` on many resources — terraform DESTROYS the existing resource then CREATES a new one; plan prints `# forces replacement` next to the attribute). WATCH `-/+` because: (a) it reads like a routine change — you edited one field, terraform is "updating" — but it is a delete-then-create; (b) for anything STATEFUL (database, persistent disk, StatefulSet volume) the data is GONE. Replace on a DNS record = nothing; replace on prod DB = a data-loss incident. ENFORCE IN CI: `terraform plan -out tf.plan` (save it), then `terraform show tf.plan` (human or `-json`) and a policy check (OPA/Sentinel/conftest, Lesson 5) that HARD-FAILS any plan destroying/replacing a resource tagged `stateful` unless a human adds an explicit override label. Never `apply -auto-approve` a plan no human has read; surface every `-` and `-/+` as a required part of code review.',
        hintHi: '`terraform plan` state ko reality ke against refresh karta hai, config vs reality diff karta hai, EXACTLY kya apply karega print karta hai. SYMBOLS: `+` CREATE. `-` DESTROY (state mein, config se hataya — ya `plan -destroy`). `~` UPDATE IN-PLACE (attribute badla, provider PATCH kar sakta hai — "N to change", "0 to destroy"). `-/+` REPLACE (attribute badla jo provider in place modify NAHI kar sakta — terraform existing DESTROY karta hai phir naya CREATE; plan `# forces replacement` print karta hai). `-/+` DEKHO kyunki: (a) ye ek routine change jaisa padhta hai par delete-then-create hai; (b) kisi bhi STATEFUL cheez ke liye data GAYA. ENFORCE IN CI: `terraform plan -out tf.plan`, phir ek policy check jo HARD-FAIL karta hai koi plan jo `stateful` tagged resource destroy/replace karta hai.',
      },
      {
        task: 'In a comment, explain what `.terraform.lock.hcl` is, what belongs in `.gitignore` for a terraform project, and how the dependency graph is built.',
        taskHi: 'Ek comment mein, `.terraform.lock.hcl` kya hai samjhao.',
        hint: '`.terraform.lock.hcl` = terraform\'s LOCK FILE — records the EXACT provider versions + checksums resolved by `terraform init`, so init on any other machine/CI installs BYTE-IDENTICAL plugins (like `package-lock.json` for npm). COMMIT IT. Without it (or caught by an over-broad `.terraform*` gitignore rule), every dev + CI resolves versions independently against the `required_providers` range and drifts apart — your laptop plans with aws 5.40, CI with 5.72 released yesterday that changed a default, and the plans disagree for reasons unrelated to your change; worse, a provider regression gets applied silently. `.gitignore` FOR TERRAFORM: `.terraform/` (downloaded provider binaries — large, machine-specific), `*.tfstate` + `*.tfstate.backup` (NEVER commit state — Lesson 3; it holds secrets), `*.tfplan`, `.terraformrc`/`terraform.rc`. DO commit: `.terraform.lock.hcl`, all `*.tf`, `*.tfvars.example` (but NOT real `*.tfvars` with secrets). Pin a deliberate range: `version = "~> 5.70"` and bump it in a PR via `terraform init -upgrade` → commit the changed lock file → review the plan the new version produces. THE DEPENDENCY GRAPH: you never write order. Terraform builds a DAG from REFERENCES between blocks — `subnet_id = aws_subnet.main.id` means "subnet first". It creates/updates in dependency order, independent branches IN PARALLEL (default 10), destroys in REVERSE. `depends_on = [...]` adds an edge terraform cannot infer (A must exist before B, but B never references A) — use sparingly; it coarsens the graph and cuts parallelism.',
        hintHi: '`.terraform.lock.hcl` = terraform ka LOCK FILE — `terraform init` dwara resolved EXACT provider versions + checksums record karta hai, taaki kisi bhi machine/CI par init BYTE-IDENTICAL plugins install kare. COMMIT KARO. Iske bina har dev + CI versions independently resolve karte hain aur drift apart hote hain. `.gitignore`: `.terraform/`, `*.tfstate` + `*.tfstate.backup` (KABHI state commit nahi — secrets rakhta hai), `*.tfplan`. COMMIT karo: `.terraform.lock.hcl`, saari `*.tf`. Pin karo: `version = "~> 5.70"`, PR mein `terraform init -upgrade` se bump karo. DEPENDENCY GRAPH: aap kabhi order nahi likhte. Terraform blocks ke beech REFERENCES se ek DAG banata hai. Independent branches PARALLEL mein, destroy REVERSE mein. `depends_on` sparingly use karo.',
      },
    ],

    keyTakeaways: [
      'HCL, four blocks: `terraform {}` (version + `required_providers` + `backend`), `provider "x" {}` (region, credential SOURCE — never hard-coded), `resource "TYPE" "NAME" {}` (terraform MANAGES — create/update/DESTROY-on-removal; address `TYPE.NAME`), `data "TYPE" "NAME" {}` (terraform READS every run, never modifies). All `.tf` in a directory are concatenated.',
      'PROVIDERS are versioned plugins (hashicorp/aws, azurerm, google, kubernetes, github, cloudflare … 3000+). `terraform init` downloads them and pins exact versions + checksums in `.terraform.lock.hcl` — COMMIT that; gitignore `.terraform/` and `*.tfstate*`. Pin a range (`~> 5.70`) and upgrade deliberately via `init -upgrade` in a PR.',
      'RESOURCE vs DATA = ownership. `resource` = this config creates AND deletes the thing. `data` = it is owned elsewhere; you only read its attributes. Using `resource` for another team\'s infra risks a duplicate, or a `terraform destroy` / forced-replace that takes out shared infrastructure.',
      'The DEPENDENCY GRAPH is derived from REFERENCES, never written: `subnet_id = aws_subnet.main.id` → subnet first. Terraform builds a DAG, creates in order, runs independent branches in PARALLEL (10 by default), destroys in reverse. `depends_on = [...]` only for an edge terraform cannot infer — use sparingly.',
      '`terraform plan` shows the diff before anything changes: `+` create, `-` destroy (removed from config), `~` update in-place ("0 to destroy"), `-/+` REPLACE (immutable attribute changed → destroy-then-create, plan says `# forces replacement`). `-/+` is the dangerous one — on a stateful resource it is data loss. `plan -out=f` then `apply f` runs that exact plan. Always read the plan; check every `-` and `-/+`.',
    ],
    keyTakeawaysHi: [
      'HCL, chaar blocks: `terraform {}` (version + `required_providers` + `backend`), `provider "x" {}` (region, credential SOURCE — kabhi hard-coded nahi), `resource "TYPE" "NAME" {}` (terraform MANAGE karta hai — create/update/removal-par-DESTROY; address `TYPE.NAME`), `data "TYPE" "NAME" {}` (terraform har run READ karta hai, kabhi modify nahi).',
      'PROVIDERS versioned plugins hain (hashicorp/aws, azurerm, google, kubernetes … 3000+). `terraform init` unhe download karta hai aur exact versions + checksums `.terraform.lock.hcl` mein pin karta hai — wo COMMIT karo; `.terraform/` aur `*.tfstate*` gitignore karo. Ek range pin karo (`~> 5.70`).',
      'RESOURCE vs DATA = ownership. `resource` = ye config cheez banata AUR delete karta hai. `data` = ye kahin aur owned hai; aap sirf iske attributes read karte ho. Doosri team ke infra ke liye `resource` use karna ek duplicate ya ek `terraform destroy` risk karta hai jo shared infrastructure le leta hai.',
      'DEPENDENCY GRAPH REFERENCES se derive hoti hai, kabhi likhi nahi jaati: `subnet_id = aws_subnet.main.id` → subnet pehle. Terraform ek DAG banata hai, order mein banata hai, independent branches PARALLEL mein, destroy reverse mein. `depends_on` sirf ek edge ke liye jo terraform infer nahi kar sakta.',
      '`terraform plan` kuch badalne se pehle diff dikhata hai: `+` create, `-` destroy, `~` update in-place ("0 to destroy"), `-/+` REPLACE (immutable attribute badla → destroy-then-create, plan `# forces replacement` kehta hai). `-/+` dangerous hai — ek stateful resource par ye data loss hai. `plan -out=f` phir `apply f` wo exact plan chalata hai. Hamesha plan padho.',
    ],
  },

  {
    slug: 'ops-terraform-state-remote-backends-and-locking',
    title: 'Terraform State, Remote Backends & Locking',
    titleHi: 'Terraform State, Remote Backends Aur Locking',
    description:
      'State is the file where terraform records what it built and how the config maps to real resource ids. It is the heart of terraform and its biggest operational hazard: it holds every secret in plaintext, two people running apply at once will corrupt it, and if it is lost terraform no longer knows what it owns. Remote backends with locking solve all three.',
    descriptionHi:
      'State wo file hai jahaan terraform record karta hai ki usne kya banaya aur config real resource ids se kaise map karta hai. Ye terraform ka dil hai aur iska sabse bada operational hazard: ye har secret plaintext mein rakhta hai, do log ek saath apply chalate hain to ise corrupt kar denge, aur agar ye kho gaya to terraform ko ab nahi pata ki ye kya own karta hai. Locking wale remote backends teenon solve karte hain.',
    difficulty: 'MEDIUM',
    duration: 24,
    order: 3,

    analogy: {
      en: '**The register in a property office.** The buildings are the real infrastructure. The register is a ledger that says "plot 14 in the code corresponds to the building at 22 Oak Street, here are its recorded details". Without the register, a surveyor arriving fresh has no idea which building matches which entry in the plans — they would have to re-survey everything. If two clerks write in the register at the same time, the entries get interleaved and the ledger is nonsense — so there is one register, kept in a safe, and you sign it out (a lock) before writing. And the register lists the safe combinations and alarm codes of every building in plain handwriting, so the register itself is kept under exactly the same security as the most sensitive building it describes.',
      hi: '**Ek property office mein register.** Buildings real infrastructure hain. Register ek ledger hai jo kehta hai "code mein plot 14 22 Oak Street ki building se correspond karta hai, yahan iske recorded details hain". Register ke bina, ek surveyor jo fresh aata hai ko koi pata nahi kaun si building plans mein kaun si entry se match karti hai. Agar do clerks ek saath register mein likhते hain, entries interleave ho jaati hain aur ledger bakwas hai — to ek register hai, ek safe mein rakha, aur aap likhne se pehle ise sign out karते ho (ek lock). Aur register har building ke safe combinations aur alarm codes plain handwriting mein list karता hai, to register khud exactly usi security ke tahat rakha jaata hai jaisा sabse sensitive building jo ye describe karta hai.',
    },

    simple: `**STATE** (\`terraform.tfstate\`, JSON) — the record of everything terraform built:
\`\`\`
- the MAPPING: config address 'aws_instance.web' -> real id 'i-0abc123...'
- every ATTRIBUTE terraform last saw (so 'plan' can diff without re-reading everything)
- resource DEPENDENCIES (so destroy order is correct even after you delete the code)
- metadata: the state schema version, which provider versions wrote it
\`\`\`
Without state, terraform cannot connect your \`.tf\` files to the real resources —
it would try to create everything again.

**THREE HARD FACTS about state:**
\`\`\`
1. IT HOLDS SECRETS IN PLAINTEXT   a random_password, an RDS password, a private
   key, any 'sensitive' output - all sit in the JSON in the clear. 'sensitive'
   only hides them from CLI output, not from the file.
2. CONCURRENT WRITES CORRUPT IT    two 'apply's at once = interleaved writes =
   a broken state file = a very bad day.
3. LOSE IT AND TERRAFORM IS LOST   no state = terraform doesn't know what it owns
   = it plans to recreate your whole infrastructure.
\`\`\`

**REMOTE BACKEND** — store state in a shared, versioned, encrypted, lockable place
instead of a local file:
\`\`\`
AWS      backend "s3"      { bucket, key, region, dynamodb_table (lock), encrypt = true }
         (newer: S3 native locking with use_lockfile = true, no DynamoDB needed)
Azure    backend "azurerm" { storage_account_name, container_name, key }  (blob lease = lock)
GCP      backend "gcs"     { bucket, prefix }                              (object generation = lock)
Terraform Cloud / Enterprise, Spacelift, env0, Scalr - managed state + runs
\`\`\`

**LOCKING** — before \`plan\`/\`apply\` the backend takes a lock; a second run waits
(or fails with \`-lock-timeout=0\`). Prevents concurrent corruption. \`terraform
force-unlock <id>\` only if a lock is genuinely stale (a crashed run).

**DRIFT & STATE COMMANDS:**
\`\`\`
terraform plan / apply -refresh-only   detect drift (reality vs state), reconcile the RECORD
terraform state list                    what terraform tracks
terraform state show <addr>             one resource's recorded attributes
terraform state rm <addr>               forget a resource (does NOT destroy it)
terraform state mv <a> <b>              rename in state without destroy/create
terraform import <addr> <id>            adopt an existing real resource into state
terraform apply -replace=<addr>         force one resource to be recreated
\`\`\``,

    simpleHi: `**STATE** (\`terraform.tfstate\`, JSON) — jo kuch terraform ne banaya uska record:
\`\`\`
- MAPPING: config address 'aws_instance.web' -> real id 'i-0abc123...'
- har ATTRIBUTE jo terraform ne last dekha (taaki 'plan' bina sab kuch re-read kiye diff kar sake)
- resource DEPENDENCIES (taaki destroy order sahi ho code delete karne ke baad bhi)
- metadata: state schema version, kaun se provider versions ne ise likha
\`\`\`
State ke bina, terraform aapki \`.tf\` files ko real resources se connect nahi kar sakta.

**STATE ke baare mein TEEN HARD FACTS:**
\`\`\`
1. YE SECRETS PLAINTEXT MEIN RAKHTA HAI   ek random_password, ek RDS password, ek
   private key, koi bhi 'sensitive' output - sab JSON mein clear mein baithते hain.
   'sensitive' sirf unhe CLI output se chhupाता hai, file se nahi.
2. CONCURRENT WRITES ISE CORRUPT KARTE HAIN   ek saath do 'apply's = interleaved writes.
3. ISE KHO DO AUR TERRAFORM KHO GAYA   koi state nahi = terraform ko nahi pata ye kya own karta hai.
\`\`\`

**REMOTE BACKEND** — state ek shared, versioned, encrypted, lockable jagah mein
store karo ek local file ke bajaay:
\`\`\`
AWS      backend "s3"      { bucket, key, region, dynamodb_table (lock), encrypt = true }
         (newer: S3 native locking with use_lockfile = true)
Azure    backend "azurerm" { storage_account_name, container_name, key }  (blob lease = lock)
GCP      backend "gcs"     { bucket, prefix }
Terraform Cloud / Enterprise, Spacelift, env0, Scalr - managed state + runs
\`\`\`

**LOCKING** — \`plan\`/\`apply\` se pehle backend ek lock leта hai; ek doosra run wait
karता hai. Concurrent corruption rokता hai. \`terraform force-unlock <id>\` sirf agar
ek lock genuinely stale hai.

**DRIFT & STATE COMMANDS:**
\`\`\`
terraform plan / apply -refresh-only   drift detect karo, RECORD reconcile karo
terraform state list                    terraform kya track karता hai
terraform state show <addr>             ek resource ke recorded attributes
terraform state rm <addr>               ek resource bhool jao (ise DESTROY nahi karता)
terraform state mv <a> <b>              state mein rename bina destroy/create ke
terraform import <addr> <id>            ek existing real resource ko state mein adopt karo
terraform apply -replace=<addr>         ek resource ko recreate karne ke liye force karo
\`\`\``,

    content: `## What state is and why it exists

When terraform creates a resource, the cloud gives back an identifier — an instance id, an ARN, a resource path. Terraform has to remember that "the block I call \`aws_instance.web\` is the real instance \`i-0abc123\`", because next time you run \`plan\` it needs to fetch *that* instance and compare it to your config. That mapping, plus a cached copy of every attribute terraform last saw, plus the dependency relationships, is **state** — stored by default in \`terraform.tfstate\`, a JSON file.

State is not just a cache. It is the only place the config-to-reality mapping lives. If you delete a resource block, terraform still needs to know which real resource to destroy and in what order — that information is in state, not in your (now-deleted) code. If state is lost, terraform has no idea which real resources correspond to which blocks; a fresh \`plan\` proposes creating everything from scratch, on top of the infrastructure that already exists.

## The three hazards

**State holds secrets in plaintext.** Any secret that flows through a resource ends up in state as-is: a \`random_password\` result, the master password on an RDS instance, a generated private key, a Kubernetes secret\'s data, the value of any output — even one marked \`sensitive\`. The \`sensitive\` flag only suppresses the value in CLI output and plan text; in the state JSON it is right there in the clear. This means the state file must be protected exactly like a secrets store: encrypted at rest, access-controlled, never committed to git, never left in a downloads folder or a CI artifact.

**Concurrent writes corrupt it.** If two people (or a person and a CI job) run \`apply\` against the same state at the same time, both read the old state, both make changes, and both write back — the second write clobbers the first, or the two interleave into invalid JSON. Now state does not match reality and terraform cannot safely do anything.

**Losing it is catastrophic.** A local \`terraform.tfstate\` on a laptop that dies, or in a directory someone \`rm -rf\`s, takes the entire record of your infrastructure with it. Recovery means \`terraform import\`ing every single resource back one at a time, matching real ids to config addresses by hand.

## Remote backends

The **backend** is where state is stored. The default is \`local\` (the \`terraform.tfstate\` file). A **remote backend** puts state in a shared service that is encrypted, versioned, access-controlled, and supports locking:

- **AWS — \`backend "s3"\`**: state in an S3 bucket (\`encrypt = true\`, bucket versioning on for point-in-time recovery, a restrictive bucket policy). Locking historically used a DynamoDB table (\`dynamodb_table\`); modern terraform (1.10+) supports S3-native locking with \`use_lockfile = true\` and no DynamoDB.
- **Azure — \`backend "azurerm"\`**: state as a blob in a storage account container. Locking uses a blob lease automatically. Encryption is on by default; enable blob versioning and soft-delete.
- **GCP — \`backend "gcs"\`**: state as an object in a GCS bucket. Locking uses object generation numbers. Enable object versioning.
- **Managed**: Terraform Cloud / Enterprise, Spacelift, env0, Scalr — these host state *and* run the plan/apply, adding a UI, policy enforcement, and an audit log.

You configure the backend in the \`terraform { backend "s3" { ... } }\` block, run \`terraform init\`, and terraform migrates the existing local state up. From then on every \`plan\` and \`apply\` reads and writes the remote state.

## Locking

With a locking backend, \`terraform plan\` and \`apply\` **acquire a lock** before touching state and release it after. If someone else holds the lock, your command waits (or, with \`-lock-timeout=0\`, fails immediately with a message naming who holds it and since when). This makes concurrent runs safe: the second one queues behind the first instead of corrupting state.

If a run crashes hard — the machine loses power mid-apply — the lock can be left dangling. \`terraform force-unlock <LOCK_ID>\` removes it, but only do this when you are certain no apply is actually running; force-unlocking a live apply reintroduces exactly the corruption locking prevents.

## Drift and the state commands

**Drift** is reality diverging from state: a manual console change, an out-of-band edit by another tool, an autoscaler that changed an instance count. \`terraform plan\` refreshes state against reality first, so drift shows up in the plan as changes terraform wants to make (to bring reality back to the config) or as notes that a resource "has changed outside of Terraform". \`terraform apply -refresh-only\` updates the *state record* to match reality without changing any infrastructure — useful when the drift is legitimate and you want the code and state to acknowledge it before making other changes. A scheduled \`terraform plan\` in CI that posts non-empty diffs to a channel catches drift early.

The state subcommands operate on the record, not on infrastructure:

- \`terraform state list\` — every resource address terraform is tracking.
- \`terraform state show <addr>\` — the recorded attributes of one resource.
- \`terraform state rm <addr>\` — remove a resource from state *without destroying it*. The real resource keeps running; terraform just stops managing it. Used when handing a resource to another configuration or team.
- \`terraform state mv <old> <new>\` — rename a resource\'s address in state (after you rename it in code, or move it into a module) without a destroy-and-recreate.
- \`terraform import <addr> <real-id>\` — the inverse: adopt an existing real resource into state so terraform starts managing it. You write the resource block first, then import.
- \`terraform apply -replace=<addr>\` — force one specific resource to be destroyed and recreated on the next apply (the supported replacement for the old \`terraform taint\`), for when a resource is in a bad state that terraform cannot detect.`,

    contentHi: `## State kya hai aur ye kyun exist karta hai

Jab terraform ek resource banata hai, cloud ek identifier wapas deta hai — ek instance id, ek ARN. Terraform ko yaad rakhna padta hai ki "jo block main \`aws_instance.web\` kehta hoon wo real instance \`i-0abc123\` hai", kyunki agli baar jab aap \`plan\` chalate ho ise *wo* instance fetch karke aapke config se compare karna hai. Wo mapping, plus har attribute ki ek cached copy jo terraform ne last dekhi, plus dependency relationships, **state** hai — default mein \`terraform.tfstate\` mein store, ek JSON file.

State sirf ek cache nahi hai. Ye ekmatra jagah hai jahaan config-to-reality mapping rehti hai. Agar aap ek resource block delete karte ho, terraform ko abhi bhi jaanna hai kaun sा real resource destroy karna aur kis order mein — wo information state mein hai, aapke (ab-deleted) code mein nahi. Agar state kho gaya, terraform ko koi pata nahi kaun se real resources kaun se blocks se correspond karते hain.

## Teen hazards

**State secrets plaintext mein rakhता hai.** Koi bhi secret jo ek resource se flow karता hai state mein as-is end hota hai: ek \`random_password\` result, ek RDS instance par master password, ek generated private key, kisi bhi output ki value — even ek jo \`sensitive\` mark ki gayi. \`sensitive\` flag sirf value ko CLI output aur plan text mein suppress karता hai; state JSON mein ye wahaan clear mein hai.

**Concurrent writes ise corrupt karते hain.** Agar do log same state ke against ek saath \`apply\` chalाते hain, dono old state read karते hain, dono changes karते hain, aur dono wapas likhते hain — doosra write pehle ko clobber karता hai.

**Ise khona catastrophic hai.** Ek laptop par ek local \`terraform.tfstate\` jo mar jaata hai aapke infrastructure ka poora record apne saath le jaata hai.

## Remote backends

**Backend** wo hai jahaan state store hoti hai. Default \`local\` hai. Ek **remote backend** state ko ek shared service mein rakhता hai jo encrypted, versioned, access-controlled hai, aur locking support karता hai:

- **AWS — \`backend "s3"\`**: state ek S3 bucket mein (\`encrypt = true\`, bucket versioning on). Locking historically ek DynamoDB table use karता tha; modern terraform (1.10+) \`use_lockfile = true\` ke saath S3-native locking support karता hai.
- **Azure — \`backend "azurerm"\`**: state ek storage account container mein ek blob ke roop mein. Locking ek blob lease use karता hai automatically.
- **GCP — \`backend "gcs"\`**: state ek GCS bucket mein ek object. Locking object generation numbers use karता hai.
- **Managed**: Terraform Cloud / Enterprise, Spacelift, env0, Scalr — ye state host *aur* plan/apply run karते hain.

Aap backend ko \`terraform { backend "s3" { ... } }\` block mein configure karते ho, \`terraform init\` chalाते ho, aur terraform existing local state ko up migrate karता hai.

## Locking

Ek locking backend ke saath, \`terraform plan\` aur \`apply\` state ko touch karne se pehle ek **lock acquire** karते hain aur baad mein release. Agar koi aur lock rakhता hai, aapki command wait karती hai. Ye concurrent runs ko safe banाता hai.

Agar ek run hard crash karता hai, lock dangling reh sakता hai. \`terraform force-unlock <LOCK_ID>\` ise hataता hai, par ye sirf tab karo jab aap certain ho koi apply actually nahi chal raha.

## Drift aur state commands

**Drift** reality ka state se diverge karna hai. \`terraform plan\` pehle state ko reality ke against refresh karता hai, to drift plan mein changes ke roop mein dikhता hai. \`terraform apply -refresh-only\` *state record* ko reality se match karने ke liye update karता hai bina kisi infrastructure ko badle.

State subcommands record par operate karते hain, infrastructure par nahi:
- \`terraform state list\` — har resource address jo terraform track kar raha hai.
- \`terraform state show <addr>\` — ek resource ke recorded attributes.
- \`terraform state rm <addr>\` — ek resource ko state se hatao *bina ise destroy kiye*.
- \`terraform state mv <old> <new>\` — ek resource ka address rename karo bina destroy-and-recreate ke.
- \`terraform import <addr> <real-id>\` — ek existing real resource ko state mein adopt karo.
- \`terraform apply -replace=<addr>\` — ek specific resource ko agle apply par destroy aur recreate karne ke liye force karo.`,

    examples: [
      {
        title: 'State holds secrets in the clear — "sensitive" only hides them from your screen',
        titleHi: 'State secrets clear mein rakhta hai — "sensitive" sirf unhe screen se chhupata hai',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

cat > main.tf <<'EOF'
terraform {
  required_providers {
    random = { source = "hashicorp/random", version = "3.9.0" }
  }
}
resource "random_password" "db" {
  length  = 20
  special = false
}
output "db_password" {
  value     = random_password.db.result
  sensitive = true
}
EOF
terraform init -no-color -input=false >/dev/null
terraform apply -no-color -auto-approve >/dev/null

echo "--- 'terraform output' hides it (sensitive = true) ---"
terraform output -no-color

echo
echo "--- but the state file is plain JSON on disk. pull the value straight out: ---"
python - <<'PY'
import json
st = json.load(open("terraform.tfstate"))
raw = st["resources"][0]["instances"][0]["attributes"]["result"]
print("  json path      : resources[].instances[].attributes.result")
print("  value type     : plain JSON string, %d chars, no encryption, no hashing" % len(raw))
PY
grep -q "\\"result\\": \\"\$(terraform output -raw db_password)\\"" terraform.tfstate \\
  && echo "  cross-check    : the secret from 'terraform output -raw' appears byte-for-byte in terraform.tfstate"

echo
echo "CONSEQUENCE: tfstate (and saved plan files) contain every secret any resource"
echo "produced or received, in the clear. Treat them AS secrets: an encrypted remote"
echo "backend with access control, never a git repo, never a laptop's Downloads folder."`,
        output: `--- 'terraform output' hides it (sensitive = true) ---
db_password = <sensitive>

--- but the state file is plain JSON on disk. pull the value straight out: ---
  json path      : resources[].instances[].attributes.result
  value type     : plain JSON string, 20 chars, no encryption, no hashing
  cross-check    : the secret from 'terraform output -raw' appears byte-for-byte in terraform.tfstate

CONSEQUENCE: tfstate (and saved plan files) contain every secret any resource
produced or received, in the clear. Treat them AS secrets: an encrypted remote
backend with access control, never a git repo, never a laptop's Downloads folder.`,
        explain: 'A random_password resource generates a 20-character secret, and the output that exposes it is marked sensitive. Running terraform output shows db_password = <sensitive> — the value is suppressed on screen, which is what the sensitive flag does. But the flag is purely a display convention. The state file, terraform.tfstate, is plain JSON on disk, and the password sits in it unencrypted at resources[].instances[].attributes.result. The script reads it straight out with a JSON parser, and cross-checks that the exact string terraform output -raw prints is present byte-for-byte in the file. The same is true of an RDS master password, a TLS private key, a Kubernetes secret\'s contents, or any other secret that passes through a resource. The operational consequence is that the state file has the same sensitivity as the most secret thing it describes: it must live in an encrypted, access-controlled backend, must never be committed to version control, and must never be left lying in a CI artifact or a downloads folder. Saved plan files (plan -out) have the same problem and the same rule.',
        explainHi: 'Ek random_password resource ek 20-character secret generate karता hai, aur jo output ise expose karता hai sensitive mark hai. terraform output chalाना dikhता hai db_password = <sensitive> — value screen par suppress hai, jo sensitive flag karता hai. Par flag purely ek display convention hai. State file, terraform.tfstate, disk par plain JSON hai, aur password ise mein unencrypted baithता hai. Script ise ek JSON parser se seedhे read karता hai, aur cross-check karता hai ki exact string jo terraform output -raw print karता hai file mein byte-for-byte present hai. Wahi ek RDS master password, ek TLS private key, ek Kubernetes secret ke contents ke liye sach hai. Operational consequence ye hai ki state file ki wahi sensitivity hai jo sabse secret cheez jo ye describe karता hai: ise ek encrypted, access-controlled backend mein rehna chahiye, kabhi version control mein commit nahi.',
      },
      {
        title: 'State commands and drift: list, show, correct a manual change, and stop managing a resource',
        titleHi: 'State commands aur drift: list, show, ek manual change correct karo, aur ek resource manage karna band karo',
        code: `# VERIFY
exec 2>&1
export PATH="$HOME/bin:$PATH"

cat > main.tf <<'EOF'
terraform {
  required_providers {
    local = { source = "hashicorp/local", version = "2.9.0" }
  }
}
resource "local_file" "a" {
  content  = "service A\\n"
  filename = "\${path.module}/a.txt"
}
resource "local_file" "b" {
  content  = "service B\\n"
  filename = "\${path.module}/b.txt"
}
EOF
terraform init -no-color -input=false >/dev/null
terraform apply -no-color -auto-approve >/dev/null

echo "=== terraform state list : what terraform is tracking ==="
terraform state list

echo
echo "=== terraform state show : one resource's recorded attributes ==="
terraform state show local_file.a 2>&1 | grep -E 'filename|content ' | sed -E 's/^\\s+//'

echo
echo "=== DRIFT: someone deletes a.txt outside terraform ==="
rm a.txt
terraform plan -no-color 2>&1 | grep -E 'has been deleted|will be created|^Plan:'

echo
echo "=== 'terraform apply' reconciles the drift back to desired state ==="
terraform apply -no-color -auto-approve 2>&1 | grep -E '^local_file\\.a:|^Apply complete' | sed -E 's/ \\[id=[^]]*\\]//; s/ after [0-9]+s//'
test -f a.txt && echo "a.txt is back: \$(cat a.txt)"

echo
echo "=== terraform state rm : forget b WITHOUT deleting the real file ==="
terraform state rm local_file.b 2>&1 | grep -E 'Removed|Successfully'
terraform state list
test -f b.txt && echo "b.txt still on disk (untracked now): \$(cat b.txt)"`,
        output: `=== terraform state list : what terraform is tracking ===
local_file.a
local_file.b

=== terraform state show : one resource's recorded attributes ===
content              = <<-EOT
filename             = "./a.txt"

=== DRIFT: someone deletes a.txt outside terraform ===
  # local_file.a will be created
Plan: 1 to add, 0 to change, 0 to destroy.

=== 'terraform apply' reconciles the drift back to desired state ===
local_file.a: Refreshing state...
local_file.a: Creating...
local_file.a: Creation complete
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
a.txt is back: service A

=== terraform state rm : forget b WITHOUT deleting the real file ===
Removed local_file.b
Successfully removed 1 resource instance(s).
local_file.a
b.txt still on disk (untracked now): service B`,
        explain: 'Two file resources are created, so state has two entries. terraform state list prints both addresses — this is how you see what terraform is responsible for. terraform state show local_file.a prints the recorded attributes of that one resource, straight from state, without contacting anything. Then a.txt is deleted outside terraform, which is drift. The next plan refreshes state against reality, notices a.txt is gone, and proposes to create it — reality has diverged from the desired state and terraform will close the gap. Apply does exactly that: the file is recreated with its declared content. Finally, terraform state rm local_file.b removes resource b from state without touching the real file: state list now shows only local_file.a, but b.txt is still on disk. This is how you hand a resource to another team or configuration — terraform forgets it exists and will neither manage nor destroy it. The mirror-image command, terraform import, adopts an existing real resource into state so terraform starts managing it.',
        explainHi: 'Do file resources banaye jaate hain, to state mein do entries hain. terraform state list dono addresses print karता hai — aise aap dekhते ho terraform kis ke liye responsible hai. terraform state show local_file.a us ek resource ke recorded attributes print karता hai, seedhे state se. Phir a.txt terraform ke bahar delete hoti hai, jo drift hai. Agla plan state ko reality ke against refresh karता hai, notice karता hai a.txt chali gayi, aur ise banane ka propose karता hai. Apply exactly wo karता hai. Aakhir mein, terraform state rm local_file.b resource b ko state se hataता hai bina real file ko touch kiye: state list ab sirf local_file.a dikhता hai, par b.txt abhi bhi disk par hai. Aise aap ek resource ko doosri team ko hand karते ho. Mirror-image command, terraform import, ek existing real resource ko state mein adopt karता hai.',
      },
    ],

    mistakes: [
      {
        wrong: `# committing terraform.tfstate to git "so the team can share it"
$ git add terraform.tfstate && git commit -m "update state" && git push
# now:
#   - every RDS password, private key, and API token is in the git history forever
#   - two people push state from different applies -> merge conflict in a 4000-line
#     JSON file that you cannot hand-merge safely
#   - the state on 'main' lags reality by however long since the last push`,
        right: `# state goes in a remote backend, never in git:
terraform {
  backend "s3" {
    bucket       = "acme-tfstate-prod"
    key          = "networking/terraform.tfstate"
    region       = "us-east-1"
    encrypt      = true
    use_lockfile = true          # S3-native locking (terraform >= 1.10); or dynamodb_table
  }
}
# .gitignore:  *.tfstate  *.tfstate.backup
# $ terraform init   -> migrates local state into S3, enables locking
# now the team shares ONE encrypted, versioned, locked state. concurrent applies
# queue instead of colliding. point-in-time recovery via bucket versioning.`,
        why: 'Committing state to git fails on every axis. Secrets: the state file contains every sensitive value in plaintext, so \`git push\` puts your database passwords and private keys into history permanently, readable by anyone who ever clones the repo, and unremovable without rewriting history. Concurrency: git has no locking model for this — two engineers who both apply and both commit produce a merge conflict inside a large machine-generated JSON document, and there is no safe way to resolve it by hand because the file encodes resource identities and dependency ordering. Freshness: the state on the main branch is only as current as the last push, so anyone who pulls and plans is working from a stale picture. A remote backend solves all three: S3, Azure Blob or GCS storage that is encrypted at rest and access-controlled; automatic locking (S3-native \`use_lockfile\`, a DynamoDB table, a blob lease, or an object generation check) so concurrent runs queue instead of colliding; and object versioning for point-in-time recovery. State never goes in version control — \`*.tfstate*\` is in \`.gitignore\` — and the backend block is the only state configuration in the repo.',
        whyHi: 'State ko git mein commit karna har axis par fail hota hai. Secrets: state file har sensitive value plaintext mein rakhती hai, to \`git push\` aapke database passwords aur private keys ko history mein permanently daalता hai, kisi bhi ke dwara readable jo kabhi repo clone karता hai. Concurrency: git ke paas iske liye koi locking model nahi hai — do engineers jo dono apply aur dono commit karते hain ek badे machine-generated JSON document ke andar ek merge conflict produce karते hain. Freshness: main branch par state sirf utna current hai jitna last push. Ek remote backend teenon solve karता hai: S3, Azure Blob ya GCS storage jo encrypted aur access-controlled hai; automatic locking; aur object versioning point-in-time recovery ke liye. State kabhi version control mein nahi jaati.',
      },
      {
        wrong: `# running two applies at once against local state (or a backend with no locking)
# terminal 1:  $ terraform apply    # adds a subnet
# terminal 2:  $ terraform apply    # adds a security group, at the same time
# both read state v10. t1 writes v11 (with the subnet). t2 writes v11 (with the SG,
# but NOT the subnet - it never saw it). the subnet is now real but ORPHANED:
# it exists in the cloud, it is gone from state, and the next plan wants to
# create it again -> "a resource with this CIDR already exists" error.`,
        right: `# use a backend that locks, and let it serialise the runs:
#   backend "s3"     with use_lockfile = true  (or a dynamodb_table)
#   backend "azurerm" - blob lease, automatic
#   backend "gcs"     - object generation, automatic
# now terminal 2 prints:
#   Acquiring state lock. This may take a few moments...
#   Error: Error acquiring the state lock
#   Lock Info: ID: ... , Who: alice@..., Created: 12s ago
# t2 waits (or you re-run it after t1 finishes). in CI, a 'concurrency' group
# (Module 10) on the deploy workflow stops two pipeline runs racing in the first place.
# force-unlock ONLY a lock from a genuinely crashed run, never a running one.`,
        why: 'Terraform state is read-modify-write: a run reads the current state, computes and applies changes, then writes the new state back. If two runs do this concurrently against the same state with no lock, they both start from the same version and both write back — and whichever writes last wins, silently discarding the other run\'s record of what it built. The resources the losing run created are still real in the cloud but no longer in state, so they are orphaned: terraform will not manage them, will not destroy them, and will try to recreate them on the next plan, usually hitting a uniqueness conflict. A locking backend prevents this by making state operations mutually exclusive: the second run cannot acquire the lock until the first releases it, so it either waits or fails fast with a message identifying who holds the lock. Every production backend supports this — S3 with native lockfiles or a DynamoDB table, Azure Blob via lease, GCS via generation numbers. In CI, a concurrency group on the deploy workflow is a second layer that stops two pipeline runs from racing at all. \`force-unlock\` is only ever for a lock left behind by a run that actually crashed — using it on a live run recreates the exact corruption locking exists to prevent.',
        whyHi: 'Terraform state read-modify-write hai: ek run current state read karता hai, changes compute aur apply karता hai, phir naya state wapas likhता hai. Agar do runs ye concurrently same state ke against bina lock ke karते hain, dono same version se start karते hain aur dono wapas likhते hain — aur jo last likhता hai jeetता hai, silently doosre run ke record ko discard karता hua. Jo resources losing run ne banaye wo abhi bhi cloud mein real hain par ab state mein nahi, to wo orphaned hain: terraform unhe manage nahi karega, destroy nahi karega, aur agle plan par recreate karne ki koshish karega. Ek locking backend ise rokता hai state operations ko mutually exclusive banakar. Har production backend ise support karता hai. \`force-unlock\` sirf ek lock ke liye hai jo actually crash hue run ne chhoda.',
      },
      {
        wrong: `# 'terraform destroy' to clean up, when you only meant to stop managing ONE resource
$ terraform destroy -target=aws_s3_bucket.uploads
# you wanted terraform to "let go" of the bucket. instead -target DESTROYED it -
# and -target also destroyed anything that depended only on it. the uploads are gone.
# OR: you delete the resource block and apply -> same result, the bucket is destroyed.`,
        right: `# "stop managing without destroying" is exactly 'terraform state rm':
$ terraform state rm aws_s3_bucket.uploads
  Removed aws_s3_bucket.uploads
# the bucket keeps running. terraform now ignores it entirely.
# then remove the resource block from the .tf file (so it doesn't get re-added).
#
# the INVERSE - "start managing an existing resource" - is 'terraform import':
$ terraform import aws_s3_bucket.uploads acme-user-uploads      # write the block first
#
# and to recreate one bad resource without touching the rest:
$ terraform apply -replace=aws_instance.web    # (not 'destroy'; not the old 'taint')`,
        why: 'There is a crucial difference between "terraform should stop managing this resource" and "this resource should cease to exist", and the commands are completely different. Deleting a resource block and applying, or running \`terraform destroy -target\`, both mean *destroy the real thing* — the S3 bucket and its contents are gone. What you usually want when decommissioning a piece of code, or handing a resource to another team, is for terraform to forget the resource while it keeps running: that is \`terraform state rm <addr>\`, which removes the entry from state and leaves the cloud resource untouched. After that you delete the now-unused block from the configuration so terraform does not propose re-adding it. The inverse operation is \`terraform import <addr> <id>\`, which adopts an already-existing real resource into state (you write the block first, then import). And when a single resource is wedged in a way terraform cannot detect — a VM that booted wrong, a resource the provider reports as healthy but is not — the way to force just that one to be recreated is \`terraform apply -replace=<addr>\`, the supported successor to the deprecated \`terraform taint\`. Reaching for \`destroy\` when you meant \`state rm\` is how data disappears.',
        whyHi: '"terraform ko is resource ko manage karna band karna chahiye" aur "is resource ko exist karna band karna chahiye" ke beech ek crucial difference hai, aur commands poori tarah alag hain. Ek resource block delete karke apply karna, ya \`terraform destroy -target\` chalाना, dono ka matlab *real cheez destroy karo* — S3 bucket aur iske contents chale gaye. Jo aap aam taur par chahते ho jab ek piece of code decommission karते ho wo hai terraform resource bhool jaaye jabki ye chalता rehta hai: wo \`terraform state rm <addr>\` hai. Uske baad aap ab-unused block ko configuration se delete karते ho. Inverse operation \`terraform import <addr> <id>\` hai. Aur jab ek single resource wedged hai jise terraform detect nahi kar sakता, sirf us ek ko recreate karne ka tarika \`terraform apply -replace=<addr>\` hai.',
      },
    ],

    realWorld: [
      {
        en: '**tfstate in a public repo** — a startup committed \`terraform.tfstate\` to a repo that later went public for an open-source release. It contained the production database master password and a long-lived AWS access key. Both were live. Now: S3 backend with \`encrypt\`, a pre-commit hook blocking \`*.tfstate\`, and every secret rotated.',
        hi: '**Ek public repo mein tfstate** — ek startup ne \`terraform.tfstate\` ek repo mein commit kiya jo baad mein public ho gaya. Isme production database master password aur ek long-lived AWS access key thi. Dono live the.',
      },
      {
        en: '**The double-apply orphan** — two engineers applied the same networking config within a minute (local state on a shared EFS mount, no lock). A NAT gateway ended up real-but-not-in-state; the next plan tried to create a second one and hit an AZ limit. Recovery was a manual \`terraform import\`. Fix: S3 + DynamoDB lock, and a CI concurrency group.',
        hi: '**Double-apply orphan** — do engineers ne same networking config ek minute ke andar apply kiya (shared mount par local state, koi lock nahi). Ek NAT gateway real-but-not-in-state ho gaya. Fix: S3 + DynamoDB lock, aur ek CI concurrency group.',
      },
      {
        en: '**\`destroy\` when they meant \`state rm\`** — a team splitting a monolith config into per-service configs ran \`terraform destroy -target\` on the shared Redis "to move it out". It deleted the ElastiCache cluster. They meant \`terraform state rm\` (forget it) followed by \`terraform import\` in the new config. Restored from a backup, 40 minutes of cache-cold latency.',
        hi: '**\`destroy\` jab unka matlab \`state rm\` tha** — ek team ne shared Redis par \`terraform destroy -target\` chalाya "ise bahar move karne ke liye". Isne ElastiCache cluster delete kar diya. Unka matlab \`terraform state rm\` phir naye config mein \`terraform import\` tha.',
      },
    ],

    interviewQA: [
      {
        q: 'What is terraform state, what does it contain, and why can it not just be regenerated from the config and the cloud?',
        qHi: 'Terraform state kya hai, isme kya hota hai, aur ise config aur cloud se regenerate kyun nahi kiya ja sakta?',
        a: 'State is terraform\'s record of what it has built. It contains the mapping from each configuration address, like \`aws_instance.web\`, to the real resource id the cloud assigned, like \`i-0abc123\`; a cached copy of every attribute terraform last observed, so \`plan\` can diff without re-reading every resource in full; the dependency relationships between resources, so destroy order stays correct even after you delete the code that expressed them; and metadata about the state schema and provider versions. It cannot be regenerated automatically because the config-to-reality mapping is not derivable: your config says "an instance called web", the cloud has fifty instances, and nothing in either tells terraform which one is web — that link was recorded at create time and exists only in state. If state is lost, terraform has no idea which real resources correspond to which blocks; a fresh plan proposes creating everything from scratch, on top of infrastructure that already exists, causing conflicts. Rebuilding it means \`terraform import\` for every single resource, one at a time, matching ids to addresses by hand. This is why state is treated as critical data — stored in a versioned, encrypted, locked remote backend, never only on one machine.',
        aHi: 'State terraform ka record hai ki usne kya banaya. Isme har configuration address, jaise \`aws_instance.web\`, se real resource id ka mapping hota hai jo cloud ne assign kiya, jaise \`i-0abc123\`; har attribute ki ek cached copy jo terraform ne last observe kiya; resources ke beech dependency relationships, taaki destroy order sahi rahe code delete karne ke baad bhi; aur metadata. Ise automatically regenerate nahi kiya ja sakta kyunki config-to-reality mapping derivable nahi hai: aapka config kehta hai "web naam ka ek instance", cloud ke paas pachas instances hain, aur kisi mein bhi kuch nahi terraform ko batata kaun sा web hai — wo link create time par record hua aur sirf state mein exist karता hai. Agar state kho gaya, ek fresh plan sab kuch scratch se banane ka propose karता hai.',
      },
      {
        q: 'Why is a remote backend with locking essential for a team, and what does locking actually prevent?',
        qHi: 'Ek team ke liye locking wala ek remote backend kyun essential hai, aur locking actually kya rokता hai?',
        a: 'Local state is a single file on one machine, which fails for a team in three ways: only that person can run terraform, the file holds every secret in plaintext where it is easy to leak, and if the machine or directory is lost so is the record of the infrastructure. Committing it to git is worse — secrets go into history permanently and concurrent applies produce unmergeable conflicts in a machine-generated JSON file. A remote backend (S3, Azure Blob, GCS, or a managed service) puts state in shared storage that is encrypted at rest, access-controlled, and versioned for point-in-time recovery. Locking is the other half. Terraform state operations are read-modify-write: a run reads the current state, computes changes, and writes the new state back. If two runs do this at once with no lock, both start from the same version and the last writer wins, silently discarding the other run\'s record — so resources it created are real in the cloud but absent from state, orphaned, and the next plan tries to recreate them into a conflict. A locking backend makes state operations mutually exclusive: the second run waits for the lock or fails fast naming who holds it. S3 does this with native lockfiles or a DynamoDB table, Azure with a blob lease, GCS with generation numbers. \`force-unlock\` is only for a lock left by a genuinely crashed run.',
        aHi: 'Local state ek machine par ek single file hai, jo ek team ke liye teen tarah se fail hoti hai: sirf wo person terraform chala sakta hai, file har secret plaintext mein rakhती hai, aur agar machine kho gayi to infrastructure ka record bhi. Ise git mein commit karna worse hai. Ek remote backend state ko shared storage mein rakhता hai jo encrypted, access-controlled, aur versioned hai. Locking doosra aadha hai. Terraform state operations read-modify-write hain. Agar do runs ye ek saath bina lock ke karते hain, last writer jeetता hai, silently doosre run ke record ko discard karता hua — to jo resources usne banaye wo cloud mein real hain par state mein absent, orphaned. Ek locking backend state operations ko mutually exclusive banाता hai. S3 native lockfiles ya ek DynamoDB table se, Azure ek blob lease se, GCS generation numbers se. \`force-unlock\` sirf ek genuinely crashed run ke lock ke liye hai.',
      },
      {
        q: 'What is drift, how does terraform surface it, and what is the difference between `terraform state rm` and `terraform destroy`?',
        qHi: 'Drift kya hai, terraform ise kaise surface karता hai, aur `terraform state rm` aur `terraform destroy` mein kya difference hai?',
        a: 'Drift is reality diverging from what terraform recorded in state — a manual change in the cloud console, an edit by another tool, an autoscaler adjusting a count. Terraform surfaces it because \`plan\` refreshes state against reality before diffing: drift then appears as changes terraform proposes to make (to bring reality back in line with the config) or as a note that a resource "has changed outside of Terraform". \`terraform apply -refresh-only\` updates just the state record to match reality, changing no infrastructure — used when the drift is legitimate and you want state to acknowledge it. A scheduled \`plan\` in CI that alerts on any non-empty diff catches drift before it accumulates. \`terraform state rm\` and \`terraform destroy\` are opposites in intent. \`state rm <addr>\` removes a resource from state without touching the real thing: the cloud resource keeps running, terraform just stops managing it — used to hand a resource to another team or configuration. \`destroy\` (or deleting the block and applying) destroys the real resource. Confusing the two is how data is lost: someone means "terraform, let go of this bucket" and runs \`destroy -target\`, which deletes the bucket and its contents. The inverse of \`state rm\` is \`terraform import\`, which adopts an existing resource into state; and \`terraform apply -replace=<addr>\` forces one resource to be recreated, replacing the deprecated \`terraform taint\`.',
        aHi: 'Drift reality ka us se diverge karna hai jo terraform ne state mein record kiya — cloud console mein ek manual change, ek doosre tool ka edit, ek autoscaler. Terraform ise surface karता hai kyunki \`plan\` diff karne se pehle state ko reality ke against refresh karता hai. \`terraform apply -refresh-only\` sirf state record ko reality se match karने ke liye update karता hai. \`terraform state rm\` aur \`terraform destroy\` intent mein opposites hain. \`state rm <addr>\` ek resource ko state se hataता hai bina real cheez ko touch kiye: cloud resource chalता rehta hai, terraform bas ise manage karna band karता hai. \`destroy\` real resource destroy karता hai. Dono ko confuse karna aise data khota hai. \`state rm\` ka inverse \`terraform import\` hai; aur \`terraform apply -replace=<addr>\` ek resource ko recreate karne ke liye force karता hai.',
      },
    ],

    exercises: [
      {
        task: 'In a comment, describe what terraform state contains, the three hazards, and why "sensitive" does not protect secrets in it.',
        taskHi: 'Ek comment mein, terraform state mein kya hota hai describe karo, teen hazards, aur "sensitive" secrets ko kyun protect nahi karta.',
        hint: 'STATE (`terraform.tfstate`, JSON) CONTAINS: (1) the MAPPING — config address `aws_instance.web` → real cloud id `i-0abc123`; nothing else records this link, and it is not derivable ("web" vs 50 real instances); (2) a CACHED copy of every attribute terraform last saw (so `plan` diffs without fully re-reading every resource); (3) resource DEPENDENCIES (so destroy order is right even after you delete the code that expressed them); (4) metadata — state schema version, provider versions that wrote it. THREE HAZARDS: (1) SECRETS IN PLAINTEXT — a `random_password`, an RDS master password, a generated private key, a K8s secret\'s data, ANY output value sit in the JSON in the clear. The `sensitive` flag ONLY suppresses the value in CLI output + plan text — in the state file it is right there. So tfstate (and saved `plan -out` files) must be treated AS a secrets store: encrypted at rest, access-controlled, NEVER in git, never in a CI artifact or Downloads folder. (2) CONCURRENT WRITES CORRUPT IT — state is read-modify-write; two applies at once → last writer wins → the other run\'s resources are real-but-not-in-state (orphaned) → next plan tries to recreate them into a conflict. (3) LOSE IT AND TERRAFORM IS LOST — no state = terraform does not know what it owns = a fresh plan proposes recreating everything on top of what exists. Recovery = `terraform import` every resource one at a time.',
        hintHi: 'STATE (`terraform.tfstate`, JSON) CONTAINS: (1) MAPPING — config address `aws_instance.web` → real cloud id `i-0abc123`; kuch aur ise record nahi karta; (2) har attribute ki CACHED copy jo terraform ne last dekha; (3) resource DEPENDENCIES (destroy order ke liye); (4) metadata. THREE HAZARDS: (1) SECRETS PLAINTEXT MEIN — `random_password`, RDS password, private key, KOI bhi output value JSON mein clear mein. `sensitive` flag SIRF CLI output + plan text mein suppress karta hai. To tfstate secrets store ki tarah treat karo: encrypted, access-controlled, KABHI git mein nahi. (2) CONCURRENT WRITES CORRUPT — read-modify-write; do applies ek saath → last writer jeetta hai → orphaned resources. (3) ISE KHO DO AUR TERRAFORM KHO GAYA.',
      },
      {
        task: 'In a comment, explain remote backends and locking: the AWS, Azure and GCP options, what locking prevents, and when `force-unlock` is safe.',
        taskHi: 'Ek comment mein, remote backends aur locking samjhao.',
        hint: 'A REMOTE BACKEND stores state in shared storage that is ENCRYPTED at rest, ACCESS-CONTROLLED, VERSIONED (point-in-time recovery), and supports LOCKING — instead of a local `terraform.tfstate`. Configure in `terraform { backend "..." { } }`, run `terraform init` → it migrates local state up. OPTIONS: AWS `backend "s3"` — bucket + key + region + `encrypt = true`; locking via a DynamoDB table (`dynamodb_table`) OR, terraform ≥ 1.10, S3-native `use_lockfile = true` (no DynamoDB); turn on bucket versioning. Azure `backend "azurerm"` — `storage_account_name` + `container_name` + `key`; locking is an automatic BLOB LEASE; enable blob versioning + soft-delete. GCP `backend "gcs"` — `bucket` + `prefix`; locking via OBJECT GENERATION numbers, automatic; enable object versioning. Managed: Terraform Cloud/Enterprise, Spacelift, env0, Scalr — host state AND run plan/apply, adding a UI + policy + audit log. WHAT LOCKING PREVENTS: state ops are read-modify-write; two concurrent runs both start from version N and the last writer wins, silently dropping the other run\'s record → orphaned resources (real in cloud, gone from state) → next plan recreates them into a uniqueness conflict. With a lock, run 2 waits ("Acquiring state lock...") or fails fast with `-lock-timeout=0` naming who holds it. In CI, also put a `concurrency` group (Module 10) on the deploy workflow. `force-unlock <ID>` is safe ONLY for a lock left behind by a run that genuinely crashed (power loss mid-apply) — NEVER on a lock held by a running apply, or you reintroduce exactly the corruption locking prevents.',
        hintHi: 'Ek REMOTE BACKEND state ko shared storage mein rakhta hai jo ENCRYPTED, ACCESS-CONTROLLED, VERSIONED hai, aur LOCKING support karta hai. `terraform { backend "..." { } }` mein configure karo, `terraform init` → local state up migrate hota hai. OPTIONS: AWS `backend "s3"` — bucket + key + region + `encrypt = true`; locking DynamoDB table se YA terraform ≥ 1.10 mein S3-native `use_lockfile = true`. Azure `backend "azurerm"` — automatic BLOB LEASE. GCP `backend "gcs"` — OBJECT GENERATION numbers. LOCKING KYA ROKTA HAI: read-modify-write; do concurrent runs, last writer jeetta hai → orphaned resources. `force-unlock <ID>` SIRF ek genuinely crashed run ke lock ke liye safe hai — KABHI ek running apply ke lock par nahi.',
      },
      {
        task: 'In a comment, list the terraform state / lifecycle subcommands and what each does, being precise about which ones touch real infrastructure.',
        taskHi: 'Ek comment mein, terraform state / lifecycle subcommands list karo aur har ek kya karta hai.',
        hint: 'TOUCH ONLY THE STATE RECORD (no real infrastructure changes): `terraform state list` — every resource address terraform tracks. `terraform state show <addr>` — one resource\'s recorded attributes, straight from state, contacts nothing. `terraform state rm <addr>` — FORGET a resource: removes it from state, the real resource KEEPS RUNNING and is no longer managed (use to hand a resource to another config/team; then delete the block so it is not re-added). `terraform state mv <old> <new>` — rename a resource\'s address (after renaming in code, or moving it into a module) WITHOUT destroy-and-recreate. `terraform import <addr> <real-id>` — the inverse of `state rm`: adopt an existing real resource into state so terraform starts managing it (write the resource block FIRST, then import). DETECT / RECONCILE DRIFT: `terraform plan` / `apply -refresh-only` — refresh state against reality; `-refresh-only` updates the RECORD to match reality, changes NO infrastructure. TOUCH REAL INFRASTRUCTURE: `terraform apply -replace=<addr>` — force ONE resource to be destroyed + recreated on the next apply (the supported successor to the deprecated `terraform taint`), for a resource wedged in a way terraform cannot detect. `terraform destroy` / `destroy -target=<addr>` / deleting the block + apply — DESTROYS the real resource(s). THE KEY DISTINCTION: "stop managing" = `state rm` (safe, resource lives); "cease to exist" = `destroy` (data gone). Confusing them is how buckets and databases disappear.',
        hintHi: 'SIRF STATE RECORD KO TOUCH KARTE HAIN (koi real infra change nahi): `terraform state list` — har address jo terraform track karta hai. `terraform state show <addr>` — ek resource ke recorded attributes. `terraform state rm <addr>` — FORGET: state se hatao, real resource CHALTA REHTA HAI, ab managed nahi. `terraform state mv <old> <new>` — address rename bina destroy-and-recreate. `terraform import <addr> <real-id>` — `state rm` ka inverse: existing resource ko state mein adopt karo (block PEHLE likho). DRIFT: `apply -refresh-only` — RECORD ko reality se match karo, koi infra change nahi. REAL INFRA TOUCH: `terraform apply -replace=<addr>` — ek resource ko destroy + recreate force karo (deprecated `taint` ka successor). `terraform destroy` — real resource DESTROY karta hai. KEY: "manage karna band" = `state rm`; "exist karna band" = `destroy`.',
      },
    ],

    keyTakeaways: [
      'STATE (`terraform.tfstate`, JSON) is the record of what terraform built: the mapping from config address (`aws_instance.web`) to real id (`i-0abc123`), a cached copy of every attribute, resource dependencies, and schema/provider metadata. The mapping is NOT derivable from config + cloud — lose state and a fresh plan wants to recreate everything.',
      'THREE HAZARDS: (1) state holds every secret — passwords, keys, any output — in PLAINTEXT; `sensitive` only hides them from CLI/plan text, not the file. (2) concurrent writes corrupt it (read-modify-write; last writer wins → orphaned resources). (3) losing it is catastrophic. So: encrypted access-controlled remote backend, `*.tfstate*` in `.gitignore`, never a CI artifact.',
      'REMOTE BACKEND options: AWS `backend "s3"` (`encrypt`, bucket versioning; locking via DynamoDB table OR terraform ≥ 1.10 `use_lockfile = true`); Azure `backend "azurerm"` (blob lease locking, automatic); GCP `backend "gcs"` (object-generation locking); or managed (Terraform Cloud, Spacelift, env0, Scalr). `terraform init` migrates local state up.',
      'LOCKING makes `plan`/`apply` acquire a lock first; a second run waits or fails fast naming the holder. It prevents the concurrent read-modify-write that orphans resources. Add a CI `concurrency` group as a second layer. `force-unlock <id>` ONLY for a lock left by a genuinely crashed run — never a live one.',
      'DRIFT = reality diverging from state (console change, another tool, an autoscaler); `plan` refreshes and shows it, `apply -refresh-only` reconciles the RECORD with no infra change, a scheduled `plan` alerts early. STATE COMMANDS: `state list`/`show` (inspect), `state rm` (forget, resource lives), `state mv` (rename, no recreate), `import` (adopt existing), `apply -replace=<addr>` (force recreate — replaces `taint`). "Stop managing" (`state rm`) vs "destroy" (data gone) — never confuse them.',
    ],
    keyTakeawaysHi: [
      'STATE (`terraform.tfstate`, JSON) jo kuch terraform ne banaya uska record hai: config address (`aws_instance.web`) se real id (`i-0abc123`) ka mapping, har attribute ki cached copy, resource dependencies, aur schema/provider metadata. Mapping config + cloud se derivable NAHI — state kho do aur ek fresh plan sab kuch recreate karna chahta hai.',
      'THREE HAZARDS: (1) state har secret — passwords, keys, koi bhi output — PLAINTEXT mein rakhta hai; `sensitive` sirf CLI/plan text se chhupata hai, file se nahi. (2) concurrent writes ise corrupt karte hain. (3) ise khona catastrophic hai. To: encrypted access-controlled remote backend, `*.tfstate*` `.gitignore` mein.',
      'REMOTE BACKEND options: AWS `backend "s3"` (`encrypt`, bucket versioning; locking DynamoDB table se YA terraform ≥ 1.10 `use_lockfile = true`); Azure `backend "azurerm"` (blob lease locking); GCP `backend "gcs"` (object-generation locking); ya managed. `terraform init` local state up migrate karta hai.',
      'LOCKING `plan`/`apply` ko pehle ek lock acquire karwata hai; ek doosra run wait karta hai ya fast fail hota hai. Ye concurrent read-modify-write rokta hai jo resources orphan karta hai. Ek CI `concurrency` group doosri layer ke roop mein add karo. `force-unlock <id>` SIRF ek genuinely crashed run ke lock ke liye.',
      'DRIFT = reality ka state se diverge karna; `plan` refresh karke dikhata hai, `apply -refresh-only` RECORD ko reconcile karta hai bina infra change ke. STATE COMMANDS: `state list`/`show` (inspect), `state rm` (forget, resource zinda), `state mv` (rename, no recreate), `import` (existing adopt), `apply -replace=<addr>` (force recreate). "Manage band" (`state rm`) vs "destroy" (data gaya) — kabhi confuse mat karo.',
    ],
  },
];
