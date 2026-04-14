# ASD25-POC Refined POC Spec

## Product framing

ASD25-POC is an AI-assisted spatial planning tool centered on a **bubble-diagram data model**.

The core premise is:
- semantic relationships and spatial intent come first
- geometry is derived later
- humans stay in control
- agents can propose, modify, and conflict over options
- the system should expose those conflicts clearly instead of pretending they do not exist

## Why this framing

The team discussion and reference images clarified that the immediate task is **not** full BIM authoring or IFC-first massing generation.

The immediate task is to:
1. model spaces/programs and their relationships
2. let AI update the model using natural-language instructions
3. visualize the updated model in 2D first
4. add level-aware organization next
5. derive lightweight block/massing representations later

## Canonical architecture rule

**Bubble JSON is the source of truth.**

That means:
- AI edits JSON
- UI visualizes JSON
- future user editing also edits JSON
- derived views (2D, 2.5D, 3D/block massing) all come from the same model

## POC outputs by maturity level

### 1. 2D bubble diagram

Represents:
- spaces/programs
- names
- area/GFA
- adjacency / relationship intent
- optional grouping

Visual form:
- circles / bubbles on a plane
- line-based relationship links

Purpose:
- simplest editable conceptual model
- easiest starting point for AI updates

### 2. 2.5D bubble diagram

Represents:
- everything in 2D
- level/floor assignment
- vertical organization logic

Visual form:
- bubble diagrams split or stacked by level
- floor-aware organization without full physical geometry

Purpose:
- supports reasoning such as public/large functions on lower levels
- introduces Z-axis logic without needing full 3D massing

### 3. 3D constrained/block massing

Represents:
- rough block/rectangle translation of bubble content
- site envelope or boundary constraints
- circulation/core placeholders
- primitive buildable arrangement

Visual form:
- rectangles or blocks replacing pure circles
- site-aware packing / constrained arrangement

Purpose:
- bridge from conceptual bubble relationships to a simple massing preview
- not full BIM authoring

## In scope

- 2D bubble editor/viewer
- named spaces with area/GFA-driven size
- relationships such as adjacency / avoid / visual link
- baseline JSON model load/save
- level-aware 2.5D representation
- agent proposals against a shared model
- conflict surfacing between agents
- lightweight massing/block derivation later
- human-in-the-loop approval

## Out of scope

- full BIM authoring
- IFC write-back in the first POC
- full code-compliance automation
- real-time collaboration
- photorealistic rendering
- structural/MEP analysis
- autonomous final design approval
- sophisticated global optimization from day one

## Recommended phased roadmap

### P0
- finalize bubble schema
- create baseline JSON examples
- load/view/save diagrams
- implement first AI update loop
- support simple instructions like:
  - increase GFA by 20%
  - move retail to ground floor
  - make A adjacent to B

### P1
- add level-aware 2.5D view
- support floor reassignment
- support grouped floor-based reasoning

### P2
- derive block/rectangular massing from the bubble model
- introduce simple packing within a site box
- show conflicts and overlaps

### P3
- add multi-agent proposal flow
- architect/planner/sustainability perspectives
- expose conflicts and rationale
- human selects or approves variants

## MVP user flow

1. Open or load a baseline bubble model
2. View 2D bubbles and relationships
3. Enter a natural-language instruction
4. AI proposes structured JSON changes
5. User reviews explanation and diff
6. Updated bubble model is rendered
7. Future phases add levels, options, and massing previews

## Initial repository artifacts

- `spec/bubble-schema-v1.json`
- `spec/agent-protocol.md`
- `data/samples/baseline-campus.json`
- `app/` frontend scaffold
- `docs/architecture-notes.md`

## Product-management interpretation

The most important strategic point is this:

> ASD25 immediate POC = AI-assisted editing of a bubble-diagram JSON model, visualized in 2D and level-aware 2.5D first, with 3D constrained massing as a downstream derivation rather than the initial deliverable.
