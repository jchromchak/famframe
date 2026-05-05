# launcher.md
# Context Governance — Session Launcher
# Lives at project root. Loaded into ChatGPT project once. Governs every session.

---

## 1. Project

project: famframe
context-folder: .famframe-context/
status: active
version: 0.1

Fam Frame is a family dashboard designed for a frame TV and companion admin screen. It renders schedule, commute, weather, calendar, and routine information from dashboard-config.js with a calm editorial display aesthetic.

---

## 2. Session Initialization

At the start of every session, before doing anything else:

### Step 1 — Generate session hash
Generate a session hash using:
  sha256(ISO-timestamp + first scope mention)[:8]
  Format: codex-[8char]
  Example: codex-4f3e2d1c

### Step 1b — Identify user
Ask: "who am I working with today?"
Use the answer as [username] for this entire session.
Source convention updates to: codex-[hash] | prompt-[username]-[hash]
If working alone, [username] is the person's first name (e.g. john).
If no answer is given, default to: user

### Step 2 — Announce orientation
Output the following before any work begins:

  ---
  SESSION START
  Hash: codex-[generated hash]
  Scope: [restate what the user asked to work on]
  Reading: launcher → session-handoff → seed → [scope-relevant files]
  Confirm scope before proceeding? [yes/no]
  ---

Do not proceed until scope is confirmed.

### Step 3 — Read in order
1. launcher.md (this file — already loaded)
2. .famframe-context/session-handoff.md — where did the last session leave off?
3. .famframe-context/seed.md — full project context
4. Scope-relevant files only — do not load all files unless explicitly asked

### Step 4 — Declare active context
After reading, output a one-line summary of what context was loaded:

  Context loaded: [files read] | Last session: [codex-hash from handoff] | Pending: [count of pending tasks]

---

## 3. Ground Rules

These apply to every session without exception.

### Never modify vetted decisions without flagging
If a proposed change would alter or contradict any entry in decisions.md
with status:resolved — stop. Surface the conflict. Ask for explicit confirmation
before proceeding. Log the confirmation as a new decision entry.

### Always check rules.md before changing business logic
Before modifying any logic, field behavior, calculation, or output format —
read rules.md. If the change conflicts with an active rule — stop. Surface the
conflict. Do not proceed until the rule is explicitly updated or superseded.
Log the change with source:codex-[hash].

### Flag when a change touches a process boundary
If a proposed change affects any step defined in processes.md — flag it before
executing. State which process is affected, which step, and what the impact is.
Ask for confirmation. Log the flag in session-handoff.md.

---

## 4. Boundary Conditions

These are hard stops. When any boundary condition is triggered, Codex must
stop, surface the condition, and wait for explicit instruction before continuing.

### Scope boundary
If the session was scoped to one file or problem but a proposed change requires
touching a different file or domain — flag it.
Output: SCOPE BOUNDARY — this change requires touching [file/domain] which is
outside the declared scope. Confirm to proceed or defer to a new session.

### Rule boundary
If a proposed change conflicts with any active entry in rules.md — flag it.
Output: RULE BOUNDARY — proposed change conflicts with rule-[id]: [title].
Resolve the conflict before proceeding.

### Process boundary
If a proposed change affects any step in a defined process in processes.md — flag it.
Output: PROCESS BOUNDARY — proposed change affects process-[id]: [title],
step [n]. Confirm impact before proceeding.

### Data boundary
If a proposed change touches fields, outputs, or logic that appear sensitive,
proprietary, personally identifiable, or safety-critical — flag it.
Output: DATA BOUNDARY — proposed change touches [field/output] which may be
sensitive or proprietary. Confirm handling before proceeding.

---

## 5. ID and Source Conventions

Every object created in any context file must follow these conventions.

### Session hash
Format: codex-[8char] — generated at session start
Used as: source field on all objects created this session

### Object IDs
task-[8char]        tasks.md
decision-[8char]    decisions.md
rule-[8char]        rules.md
risk-[8char]        risks.md
process-[8char]     processes.md

Generation: cryptographically random 8-character lowercase hex string.
Good examples: 4fd8063e · ed54693b · 8393d543 · 7a2f91bc · c38d05e1
Never use sequential or patterned strings like a1b2c3d4 or a1b2c3e4.
Never derive from object slug — always random.
All IDs are lowercase kebab-case. No exceptions.

### Cross-references
Objects reference each other by ID inline.
Example: a task referencing a decision uses decision-[id] in the decision field.
Example: a rule referencing a process uses process-[id] in the process field.
Never use plain-text references. Always use the ID.

### Object fields — revisionId only

Every object carries exactly one lineage field:

  revisionId: rev-[8char]
    one random 8-char hex ID per atomic action.
    all objects touched in the same operation share the same revisionId.
    everything else — user, session, prompt, date — lives in changelog.md.
    do not put user, source, or any other lineage field on the object.

### changelog.md

Every atomic action writes one entry to changelog.md:

  - rev-[8char]
    date: YYYY-MM-DDTHH:MMZ
    user: [username]
    origin: direct|codex|prompt
    codex-session: codex-[hash]
    claude-session: [claude-session-hash]
    prompt: prompt-[claude-session-hash]-[prompt-hash]
    objects:
      - [object-id]: [action]
    action: created|updated|completed|retired|migrated
    summary: [one line — what changed and why]

  origin values:
    direct  — user typed it directly, no codex or prompt involved
    codex   — codex generated it without a shaped prompt
    prompt  — driven by a shaped prompt from claude/chatgpt session

  omit codex-session if origin is direct.
  omit prompt if origin is direct or codex.

The revisionId is the join key between objects and changelog.
Objects carry only revisionId. All lineage detail lives in changelog.
This is flat file normalization — no redundant data.

---

## 6. File Conventions

All context files live in .famframe-context/
All files are flat append logs — newest entries at the bottom.
No headers inside data files unless specified in the schema.
No tables inside data files — flat bullet format only.
lowercase kebab-case for all filenames and field names.
No version suffixes on production files.

---

## 7. Session Close

At the end of every session, before the conversation ends, Codex must write
a session-handoff.md update. This is not optional.

### Handoff must include:
  session: codex-[hash]
  date: YYYY-MM-DD
  scope: [what this session covered]
  files-touched: [list]
  decisions-made: [decision IDs or none]
  tasks-added: [task IDs or none]
  rules-added: [rule IDs or none]
  boundary-conditions-triggered: [list or none]
  pending: [what is unresolved]
  next-session-start-here: [2-3 plain English sentences — what to pick up, where, and why]

### Handoff replaces the previous entry — it is not appended.
The handoff is a snapshot of now, not a log. The log lives in the individual files.

---

## 8. What Codex Does Not Do

- Does not modify decisions with status:resolved without explicit confirmation
- Does not proceed past a boundary condition without explicit instruction
- Does not create new file types without an explicit scope decision
- Does not store sensitive data, credentials, or PII in any context file
- Does not skip the session-handoff write at close
- Does not assume scope — always confirms before working

---

## 9. Context File Index

| File | Purpose |
|------|---------|
| .famframe-context/seed.md | Deep living memory. Full project context. |
| .famframe-context/session-handoff.md | Micro-seed. Updated every session close. |
| .famframe-context/product-profile.md | Living white paper. Problem statement, current state, desired state. |
| .famframe-context/personas.md | User personas. Who uses the product and how. |
| .famframe-context/opportunities.md | Landscape file. Not commitments. Scope-checked before elevating. |
| .famframe-context/tasks.md | Active work queue. Flat append log. |
| .famframe-context/completed-tasks.md | Completed tasks. Moved here from tasks.md on completion. |
| .famframe-context/decisions.md | Commitments made. Flat append log. |
| .famframe-context/rules.md | Business rules and constraints. Flat append log. |
| .famframe-context/risks.md | Risk register. Flat append log. |
| .famframe-context/processes.md | Business process definitions. Flat append log. |
| .famframe-context/mapping-discrepancies.md | Auto-resolved and pending-review naming conflicts. |
| .famframe-context/changelog.md | Revision log. One entry per atomic action. Join key for all object lineage. |

**Supporting folders (at project root):**

| Folder | Purpose |
|--------|---------|
| audits/ | Standing audit prompt files. Run to generate output. |
| audits/output/ | Dated audit output files — audit-rules-YYYY-MM-DD.md · data-lineage-YYYY-MM-DD.md |
| ref/ | Reference material consulted but not executed — queries, specs, notes. |

---

*launcher.md — Fam Frame — v0.1*
*This file governs every session. Update only when ground rules change.*
