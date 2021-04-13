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
  return `_${Math.random().toString(12).substr(2, 9)}`;
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
