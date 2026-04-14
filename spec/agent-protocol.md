# Agent Protocol (Draft)

## Purpose

Define a simple structured contract for AI agents that inspect or modify the ASD25 bubble model.

## Principles

- agents do not directly edit UI state
- agents operate against the canonical bubble JSON model
- agents should propose structured changes, not freeform hidden mutations
- explanations and conflicts should be visible to the user

## Suggested request shape

```json
{
  "instruction": "Increase total GFA by 20% while keeping public functions on the ground floor.",
  "model": { "...": "bubble diagram JSON" },
  "agent": {
    "id": "architect-agent",
    "role": "architect"
  }
}
```

## Suggested response shape

```json
{
  "agent": {
    "id": "architect-agent",
    "role": "architect"
  },
  "summary": "Expanded public-facing spaces and retained retail/social on ground level.",
  "patches": [
    {
      "op": "replace",
      "path": "/spaces/0/area",
      "value": 1440
    }
  ],
  "conflicts": [
    {
      "type": "ground-floor-competition",
      "message": "Retail and social space both prefer ground floor under current constraints."
    }
  ],
  "explanation": [
    "Increased primary social space by 20%.",
    "Kept public-facing functions at level L1.",
    "Flagged conflict for competing ground-floor demand."
  ]
}
```

## Near-term supported agent roles

- architect
- planner
- sustainability

## Near-term supported behaviors

- inspect model
- propose JSON patches
- raise conflicts
- provide rationale
