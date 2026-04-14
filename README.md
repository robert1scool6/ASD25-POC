# ASD25-POC

AI-assisted bubble-diagram editing POC for ASD25.

## Core idea

The canonical source of truth is a **bubble-diagram JSON model**.

- AI updates JSON
- UI visualizes JSON
- user can later edit the same JSON
- 2D bubble editing comes first
- 2.5D level-aware organization comes next
- 3D constrained/block massing is a downstream derivation, not the starting point

## POC priorities

1. **2D bubble diagram**
   - circles sized by area/GFA
   - named spaces/programs
   - relationship links
   - baseline for AI updates

2. **2.5D bubble diagram**
   - assign spaces to levels/floors
   - support vertical organization reasoning

3. **3D constrained/block massing**
   - derive lightweight blocks from bubble data
   - introduce site/core/circulation constraints later

## Repo structure

- `docs/` — product/spec and architecture notes
- `spec/` — schemas and protocol docs
- `data/` — sample bubble models
- `app/` — initial frontend scaffold

## Quick start

The current repo now includes a lightweight interactive 2D bubble editor.

To run it locally:

```bash
cd app
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

Note: the app loads sample data from `../data/samples/baseline-campus.json`, so serve it from the repo's `app/` folder exactly as shown.

## Current interactive features

- drag bubbles around the canvas
- collision detection / red overlap feedback
- relationship lines rendered from JSON model data
- add new linkage by selecting two bubbles in link mode
- delete linkage by clicking a line or using the relationship panel
- export current model JSON from the UI

## Immediate next build tasks

1. support editing relationship type/weight in UI
2. persist model changes to local storage or backend
3. add level-aware 2.5D view
4. add JSON patch/update contract for AI actions
5. add derived block-massing preview
