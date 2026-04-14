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

This first scaffold is documentation- and schema-first.

To preview the web scaffold locally:

```bash
cd app
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Immediate next build tasks

1. finalize bubble schema v1
2. add JSON patch/update contract for AI actions
3. implement canvas-based 2D editor
4. add level-aware 2.5D view
5. add derived block-massing preview
