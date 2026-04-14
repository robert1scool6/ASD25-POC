const sampleUrl = '../data/samples/baseline-campus.json';

const state = {
  model: null,
  baseModel: null,
  mode: 'move',
  draggingId: null,
  dragOffset: { x: 0, y: 0 },
  linkSelection: [],
  collidingSpaceIds: new Set(),
};

const els = {
  canvas: document.getElementById('canvas'),
  bubblesLayer: document.getElementById('bubbles-layer'),
  linksLayer: document.getElementById('links-layer'),
  relationshipList: document.getElementById('relationship-list'),
  modelSummary: document.getElementById('model-summary'),
  exportOutput: document.getElementById('export-output'),
  selectionPanel: document.getElementById('selection-panel'),
  linkModePanel: document.getElementById('link-mode-panel'),
  moveBtn: document.getElementById('mode-move'),
  linkBtn: document.getElementById('mode-link'),
  resetBtn: document.getElementById('reset-btn'),
  exportBtn: document.getElementById('export-btn'),
};

init();

async function init() {
  const res = await fetch(sampleUrl);
  const data = await res.json();
  state.model = structuredClone(data);
  state.baseModel = structuredClone(data);
  bindUi();
  render();
}

function bindUi() {
  els.moveBtn.addEventListener('click', () => setMode('move'));
  els.linkBtn.addEventListener('click', () => setMode('link'));
  els.resetBtn.addEventListener('click', () => {
    state.model = structuredClone(state.baseModel);
    state.linkSelection = [];
    state.collidingSpaceIds = new Set();
    setMode('move');
    render();
  });
  els.exportBtn.addEventListener('click', exportJson);

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('resize', render);
}

function setMode(mode) {
  state.mode = mode;
  state.linkSelection = [];
  els.moveBtn.classList.toggle('active', mode === 'move');
  els.linkBtn.classList.toggle('active', mode === 'link');
  updatePanels();
  render();
}

function render() {
  if (!state.model) return;
  computeCollisions();
  renderSummary();
  renderLinks();
  renderBubbles();
  renderRelationshipList();
  updatePanels();
}

function renderSummary() {
  const totalArea = state.model.spaces.reduce((sum, s) => sum + s.area, 0);
  els.modelSummary.innerHTML = `
    <li>Spaces: ${state.model.spaces.length}</li>
    <li>Relationships: ${state.model.relationships.length}</li>
    <li>Levels: ${state.model.levels.length}</li>
    <li>Total Area: ${Math.round(totalArea)}</li>
    <li>Collisions: ${state.collidingSpaceIds.size}</li>
  `;
}

function renderBubbles() {
  els.bubblesLayer.innerHTML = '';
  const canvasRect = els.canvas.getBoundingClientRect();

  state.model.spaces.forEach((space) => {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${programClass(space.program)} ${state.collidingSpaceIds.has(space.id) ? 'colliding' : ''}`;
    if (state.linkSelection.includes(space.id)) bubble.classList.add('selected');

    const radius = bubbleRadius(space.area);
    bubble.style.width = `${radius * 2}px`;
    bubble.style.height = `${radius * 2}px`;
    bubble.style.left = `${space.position.x}px`;
    bubble.style.top = `${space.position.y}px`;
    bubble.dataset.spaceId = space.id;
    bubble.innerHTML = `<div>${space.name}<span class="bubble-meta">${space.level} · ${space.area} m²</span></div>`;

    bubble.addEventListener('pointerdown', (event) => onBubblePointerDown(event, space, canvasRect));
    bubble.addEventListener('click', (event) => onBubbleClick(event, space));

    els.bubblesLayer.appendChild(bubble);
  });
}

function renderLinks() {
  const width = els.canvas.clientWidth;
  const height = els.canvas.clientHeight;
  els.linksLayer.setAttribute('viewBox', `0 0 ${width} ${height}`);
  els.linksLayer.innerHTML = '';

  state.model.relationships.forEach((rel) => {
    const from = findSpace(rel.from);
    const to = findSpace(rel.to);
    if (!from || !to) return;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', from.position.x);
    line.setAttribute('y1', from.position.y);
    line.setAttribute('x2', to.position.x);
    line.setAttribute('y2', to.position.y);
    line.setAttribute('class', 'relationship-line');
    line.dataset.relationshipId = rel.id;
    line.addEventListener('click', () => {
      removeRelationship(rel.id);
    });
    els.linksLayer.appendChild(line);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', (from.position.x + to.position.x) / 2);
    label.setAttribute('y', (from.position.y + to.position.y) / 2 - 6);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'relationship-label');
    label.textContent = rel.type;
    els.linksLayer.appendChild(label);
  });
}

function renderRelationshipList() {
  if (!state.model.relationships.length) {
    els.relationshipList.innerHTML = '<div class="card muted-card">No relationships.</div>';
    return;
  }

  els.relationshipList.innerHTML = '';
  state.model.relationships.forEach((rel) => {
    const from = findSpace(rel.from)?.name || rel.from;
    const to = findSpace(rel.to)?.name || rel.to;
    const item = document.createElement('div');
    item.className = 'relationship-item';
    item.innerHTML = `
      <div><strong>${from}</strong> → <strong>${to}</strong></div>
      <div class="muted">${rel.type}${rel.weight != null ? ` · weight ${rel.weight}` : ''}</div>
    `;
    const btn = document.createElement('button');
    btn.textContent = 'Delete linkage';
    btn.addEventListener('click', () => removeRelationship(rel.id));
    item.appendChild(btn);
    els.relationshipList.appendChild(item);
  });
}

function updatePanels() {
  if (state.mode === 'move') {
    els.linkModePanel.textContent = 'Move mode active. Drag any bubble to reposition it.';
  } else if (state.linkSelection.length === 0) {
    els.linkModePanel.textContent = 'Link mode active. Click the first bubble to start a new linkage.';
  } else if (state.linkSelection.length === 1) {
    const first = findSpace(state.linkSelection[0]);
    els.linkModePanel.textContent = `Selected source: ${first?.name || state.linkSelection[0]}. Click a second bubble to create the linkage.`;
  }

  if (!state.linkSelection.length) {
    els.selectionPanel.textContent = 'No active selection.';
  } else {
    const names = state.linkSelection.map((id) => findSpace(id)?.name || id).join(' → ');
    els.selectionPanel.textContent = `Link selection: ${names}`;
  }
}

function onBubblePointerDown(event, space, canvasRect) {
  if (state.mode !== 'move') return;
  state.draggingId = space.id;
  state.dragOffset = {
    x: event.clientX - canvasRect.left - space.position.x,
    y: event.clientY - canvasRect.top - space.position.y,
  };
  event.currentTarget.classList.add('dragging');
}

function onPointerMove(event) {
  if (!state.draggingId) return;
  const canvasRect = els.canvas.getBoundingClientRect();
  const space = findSpace(state.draggingId);
  if (!space) return;

  const radius = bubbleRadius(space.area);
  const x = clamp(event.clientX - canvasRect.left - state.dragOffset.x, radius, canvasRect.width - radius);
  const y = clamp(event.clientY - canvasRect.top - state.dragOffset.y, radius, canvasRect.height - radius);

  space.position.x = Math.round(x);
  space.position.y = Math.round(y);
  render();
}

function onPointerUp() {
  state.draggingId = null;
  document.querySelectorAll('.bubble.dragging').forEach((el) => el.classList.remove('dragging'));
}

function onBubbleClick(event, space) {
  if (state.mode !== 'link') return;
  event.stopPropagation();

  if (!state.linkSelection.length) {
    state.linkSelection = [space.id];
    updatePanels();
    renderBubbles();
    return;
  }

  const sourceId = state.linkSelection[0];
  if (sourceId === space.id) {
    state.linkSelection = [];
    updatePanels();
    renderBubbles();
    return;
  }

  const duplicate = state.model.relationships.some((rel) =>
    (rel.from === sourceId && rel.to === space.id) ||
    (rel.from === space.id && rel.to === sourceId)
  );

  if (!duplicate) {
    const nextId = `r${Date.now()}`;
    state.model.relationships.push({
      id: nextId,
      from: sourceId,
      to: space.id,
      type: 'adjacent_to',
      weight: 0.5,
    });
  }

  state.linkSelection = [];
  render();
}

function removeRelationship(id) {
  state.model.relationships = state.model.relationships.filter((rel) => rel.id !== id);
  render();
}

function computeCollisions() {
  const colliding = new Set();
  const spaces = state.model.spaces;

  for (let i = 0; i < spaces.length; i += 1) {
    for (let j = i + 1; j < spaces.length; j += 1) {
      const a = spaces[i];
      const b = spaces[j];
      const dx = a.position.x - b.position.x;
      const dy = a.position.y - b.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDistance = bubbleRadius(a.area) + bubbleRadius(b.area);
      if (distance < minDistance) {
        colliding.add(a.id);
        colliding.add(b.id);
      }
    }
  }

  state.collidingSpaceIds = colliding;
}

function exportJson() {
  els.exportOutput.value = JSON.stringify(state.model, null, 2);
}

function bubbleRadius(area) {
  return Math.max(42, Math.min(105, Math.sqrt(area) * 2.2));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function findSpace(id) {
  return state.model.spaces.find((space) => space.id === id);
}

function programClass(program) {
  if (['social', 'retail', 'sports', 'education'].includes(program)) return program;
  return 'other';
}
