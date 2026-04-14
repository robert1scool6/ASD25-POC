# ASD25-POC MEMORY

This file is a compact product-and-implementation memory for future agent sessions working on `ASD25-POC`.

---

## 1. Core product understanding

ASD25 immediate POC is **not** a full BIM authoring tool and should **not** be treated as an IFC-first problem.

The correct framing is:

> ASD25 immediate POC = AI-assisted editing of a bubble-diagram JSON model, visualized in 2D and level-aware 2.5D first, with 3D constrained massing as a downstream derivation rather than the initial deliverable.

The key product principle is:

> **Bubble JSON is the canonical source of truth.**

That means:
- AI updates JSON
- UI visualizes JSON
- future user editing also edits JSON
- 2D, 2.5D, and 3D/block-massing views are all derived from the same underlying model

---

## 2. What the team actually wants

From the meeting discussion and follow-up clarification, the near-term POC is about proving that we can:

1. represent spaces/programs as bubble-diagram data
2. edit that model with AI and user interaction
3. preserve relationships and design intent
4. show conflicts between different agent viewpoints
5. later derive simple massing/block layouts from the same data

It is **not** about solving every geometry, IFC, or BIM problem immediately.

---

## 3. Diagram maturity levels

### 3.1 2D bubble diagram
This is the first and most important POC layer.

Represents:
- program / space entities
- names
- area / GFA
- adjacency / relationship intent
- optional grouping

Visual form:
- circles / bubbles on a plane
- line-based links between bubbles

Purpose:
- easiest conceptual model to manipulate
- easiest place for AI to propose structured updates
- should be the first production-quality POC milestone

Typical example operations:
- increase GFA by 20%
- move a space conceptually closer to another
- make A adjacent to B
- regroup public-facing uses

### 3.2 2.5D bubble diagram
This is the second layer.

Represents:
- everything in 2D
- level / floor assignment
- simple vertical logic

Visual form:
- floor-aware bubble arrangement
- stacked or split views by level

Purpose:
- show spatial organization across levels
- support rules like large/public uses preferring ground floor
- still avoid heavy geometry complexity

### 3.3 3D constrained / block massing
This is a downstream derivation, not the starting point.

Represents:
- rough block/rectangle translation of bubble model
- site or building-envelope constraints
- primitive circulation/core placeholders
- simple buildable arrangement

Visual form:
- rectangles / blocks replacing pure circles
- constrained packing rather than full BIM solids

Purpose:
- bridge the conceptual bubble model to lightweight massing
- should be treated as harder and later than 2D/2.5D

---

## 4. Product scope decisions

### In scope
- 2D bubble editor
- drag/move bubbles
- data-driven relationship lines
- add/delete linkages
- collision detection / overlap feedback
- JSON-based save/load model
- level-aware 2.5D view later
- multi-agent proposal/conflict surfacing later
- human-in-the-loop approval later

### Out of scope for immediate POC
- full BIM authoring
- IFC write-back as the first step
- full compliance automation
- structural / MEP analysis
- enterprise collaboration/governance
- photorealistic rendering
- autonomous final design generation without oversight

---

## 5. Multi-agent understanding

Planned agent roles include:
- architect agent
- planner agent
- sustainability agent

Expected behavior:
- agents inspect the same underlying model
- agents propose changes to the same JSON model
- agents may disagree
- conflicts are expected and should be surfaced, not hidden

Important product decision:
- **Conflict visibility matters more than full conflict resolution in the first POC.**

Near-term acceptable behavior:
- show different agent recommendations
- log rationale
- let human or a simple orchestrator choose

---

## 6. Data model direction

The repo currently uses a canonical bubble-model schema.

Relevant fields include:
- `project`
- `spaces`
- `relationships`
- `groups`
- `levels`
- `constraints`
- optional `site`

Each space generally carries:
- `id`
- `name`
- `program`
- `area`
- `level`
- `position`
- optional `group`
- optional `priority`
- optional `attributes`

Relationships currently include types such as:
- `adjacent_to`
- `avoid`
- `visual_link`
- `connected_to`
- `grouped_with`

---

## 7. Current repo state

Repo URL:
- `https://github.com/robert1scool6/ASD25-POC`

Key files already in repo:
- `README.md`
- `docs/refined-poc-spec.md`
- `docs/architecture-notes.md`
- `spec/bubble-schema-v1.json`
- `spec/agent-protocol.md`
- `data/samples/baseline-campus.json`
- `app/index.html`
- `app/styles.css`
- `app/main.js`

Current implementation status:
- interactive 2D bubble editor exists
- bubbles can be dragged
- bubble overlap/collision feedback exists
- relationship lines are data-driven
- users can add new relationships
- users can delete relationships
- current model can be exported as JSON

Local run method currently used:
```bash
cd app
python3 -m http.server 4173
```
Then open:
```text
http://localhost:4173
```

---

## 8. Important implementation learnings

### 8.1 Canonical model first
Do not let UI-specific state become the real data model.
The UI should always be a view/editor on top of the JSON model.

### 8.2 Update existing model first
The meeting strongly suggested that the POC should prioritize **updating an existing bubble model** rather than regenerating a fresh one from scratch every time.
This preserves design continuity and is simpler to reason about.

### 8.3 Avoid premature IFC complexity
Earlier thinking leaned too hard into IFC / geometry / Kuzu / massing infrastructure too early.
That was too broad for the current POC stage.
Keep those as later extensions unless directly needed.

### 8.4 2D first is the right decision
Do not skip to 3D too early.
The clearest path is:
1. 2D bubble editing
2. 2.5D level-aware organization
3. derived block massing

### 8.5 Agent delegation lesson from this build
A coding-agent report claimed the interactive editor was already implemented, but the repo state did not reflect those changes.
The implementation had to be verified locally before trusting the report.
Future agents should verify actual repo diff/state before announcing completion.

---

## 9. Recommended next steps for any future agent

Priority order:
1. allow create/delete bubble
2. allow editing relationship type and weight in UI
3. persist model changes to local storage or backend
4. add floor-aware / 2.5D mode
5. add structured JSON patch model for AI instructions
6. add agent proposal panel with rationale/conflict display
7. add lightweight block-massing derivation view

---

## 10. If another agent picks this up

They should assume:
- the repo is product-manager-driven toward bubble-model-first planning
- the current app is a lightweight, working browser editor
- all major future work should preserve the canonical JSON model
- 2D interaction quality is more important right now than deeper geometry infrastructure
- any AI update workflow should operate through structured changes to the model, not opaque direct UI mutation

---

## 11. One-sentence memory anchor

If only one thing is remembered, it should be this:

> Build ASD25 as an AI-assisted editor for a canonical bubble-diagram JSON model first; treat 2.5D and 3D massing as derived layers that come later.
