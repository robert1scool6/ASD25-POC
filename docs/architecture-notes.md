# Architecture Notes

## Guiding principle

Use a single canonical bubble-diagram JSON model to drive:
- AI updates
- UI rendering
- user editing
- later level-aware views
- later block/massing derivations

## Initial modules

### 1. Schema layer
Defines the structure for:
- project metadata
- spaces
- relationships
- levels
- groups
- constraints

### 2. Update layer
Future service that:
- receives user prompts
- maps them into structured model patches
- validates proposed changes
- records explanation / diff / provenance

### 3. Visualization layer
Initial frontend that renders:
- 2D bubbles
- relationship links
- metadata panels
- future level-aware slices

### 4. Agent layer
Future layer that lets different agents:
- inspect the current model
- propose modifications
- score proposals
- raise conflicts

### 5. Derived massing layer
Later layer that translates the bubble model into:
- rectangles/blocks
- floor-stacked primitives
- rough site-constrained layouts

## Why not start IFC-first?

Because the current POC needs to prove conceptual planning and AI editing logic first.
IFC and detailed geometry can come later once the bubble model and interaction loop are stable.
