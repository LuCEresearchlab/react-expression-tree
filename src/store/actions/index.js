export const removeNode = payload => ({
  type: "removeNode",
  payload,
});

export const moveNodeTo = payload => ({
  type: "moveNodeTo",
  payload,
});

export const moveNodeToEnd = payload => ({
  type: "moveNodeToEnd",
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

export const editNode = payload => ({
  type: "editNode",
  payload,
});

export const addingNodeClick = () => ({
  type: "addingNodeClick",
});

export const clearAdding = () => ({
  type: "clearAdding",
});

export const addValueChange = payload => ({
  type: "addValueChange",
  payload,
});

export const selectEdge = payload => ({
  type: "selectEdge",
  payload,
});

export const clearEdgeSelection = () => ({
  type: "clearEdgeSelection",
});

export const edgeTypeEdit = payload => ({
  type: "edgeTypeEdit",
  payload,
});

export const stageReset = () => ({
  type: "stageReset",
});

export const uploadState = payload => ({
  type: "uploadState",
  payload,
});

export const selectRootNode = payload => ({
  type: "selectRootNode",
  payload,
});

export const clearRootSelection = () => ({
  type: "clearRootSelection",
});
