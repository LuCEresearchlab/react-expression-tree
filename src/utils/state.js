export function exportState(state) {
  const {
    nodes,
    edges,
    selectedRootNode,
    stagePos,
    stageScale,
    connectorPlaceholder,
  } = state;

  return {
    nodes,
    edges,
    selectedRootNode,
    stagePos,
    stageScale,
    connectorPlaceholder,
  };
}

export function createUniqueId() {
  return `_${Math.random().toString(10).substr(2, 10)}`;
}

export function arraysAreEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  let isEqual = true;
  a.forEach((elem, index) => {
    if (a[index] !== b[index]) {
      isEqual = false;
    }
  });

  return isEqual;
}

export function createEmptyNode(id) {
  return {
    id: id || createUniqueId(),
    height: 0,
    width: 0,
    pieces: [''],
    piecesPosition: [0],
    type: '',
    value: '',
    isFinal: false,
    isSelected: false,
    isHighlighted: false,
    childEdges: [],
    parentEdges: [[]],
  };
}

export function createEmptyEdge(id) {
  return {
    id: id || createUniqueId(),
    parentNodeId: undefined,
    parentPieceId: undefined,
    childNodeId: undefined,
    childX: 0,
    childY: 0,
    parentX: 0,
    parentY: 0,
    isHighlighted: false,
  };
}
