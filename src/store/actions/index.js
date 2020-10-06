export const removeNode = payload => ({
  type: "removeNode",
  payload,
});

export const moveNodeTo = payload => ({
  type: "moveNodeTo",
  payload,
});

export const setDragEdge = payload => ({
  type: "setDragEdge",
  payload,
});

export const moveDragEdgeParentEndTo = payload => ({
  type: "moveDragEdgeParentEndTo",
  payload,
});

export const moveDragEdgeChildEndTo = payload => ({
  type: "moveDragEdgeChildEndTo",
  payload,
});

export const removeEdge = payload => ({
  type: "removeEdge",
  payload,
});

export const addEdge = payload => ({
  type: "addEdge",
  payload,
});

export const clearDragEdge = () => ({
  type: "clearDragEdge",
});

export const clearNodeSelection = () => ({
  type: "clearNodeSelection",
});

export const addNode = payload => ({
  type: "addNode",
  payload,
});

export const selectNode = payload => ({
  type: "selectNode",
  payload,
});
