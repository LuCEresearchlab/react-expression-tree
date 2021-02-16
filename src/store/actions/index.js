/* eslint-disable arrow-body-style */

export const actionRemoveNode = (dispatch) => {
  return (payload) => dispatch({ type: 'removeNode', payload });
};

export const actionMoveNodeTo = (dispatch) => {
  return (payload) => dispatch({ type: 'moveNodeTo', payload });
};

export const actionMoveNodeToEnd = (dispatch) => {
  return (payload) => dispatch({ type: 'moveNodeToEnd', payload });
};

export const actionSetDragEdge = (dispatch) => {
  return (payload) => dispatch({ type: 'setDragEdge', payload });
};

export const actionMoveDragEdgeParentEndTo = (dispatch) => {
  return (payload) => dispatch({ type: 'moveDragEdgeParentEndTo', payload });
};

export const actionMoveDragEdgeChildEndTo = (dispatch) => {
  return (payload) => dispatch({ type: 'moveDragEdgeChildEndTo', payload });
};

export const actionRemoveEdge = (dispatch) => {
  return (payload) => dispatch({ type: 'removeEdge', payload });
};

export const actionAddEdge = (dispatch) => {
  return (payload) => dispatch({ type: 'addEdge', payload });
};

export const actionUpdateEdge = (dispatch) => {
  return (payload) => dispatch({ type: 'updateEdge', payload });
};

export const actionClearDragEdge = (dispatch) => {
  return () => dispatch({ type: 'clearDragEdge' });
};

export const actionClearNodeSelection = (dispatch) => {
  return () => dispatch({ type: 'clearNodeSelection' });
};

export const actionAddNode = (dispatch) => {
  return (payload) => dispatch({ type: 'addNode', payload });
};

export const actionSelectNode = (dispatch) => {
  return (payload) => dispatch({ type: 'selectNode', payload });
};

export const actionClearAdding = (dispatch) => {
  return () => dispatch({ type: 'clearAdding' });
};

export const actionEditValueChange = (dispatch) => {
  return (payload) => dispatch({ type: 'editValueChange', payload });
};

export const actionTypeValueChange = (dispatch) => {
  return (payload) => dispatch({ type: 'typeValueChange', payload });
};

export const actionNodeValueChange = (dispatch) => {
  return (payload) => dispatch({ type: 'nodeValueChange', payload });
};

export const actionSelectEdge = (dispatch) => {
  return (payload) => dispatch({ type: 'selectEdge', payload });
};

export const actionClearEdgeSelection = (dispatch) => {
  return () => dispatch({ type: 'clearEdgeSelection' });
};

export const actionSelectRootNode = (dispatch) => {
  return (payload) => dispatch({ type: 'selectRootNode', payload });
};

export const actionClearRootSelection = (dispatch) => {
  return () => dispatch({ type: 'clearRootSelection' });
};

export const actionSetInitialState = (dispatch) => {
  return (payload) => dispatch({ type: 'setInitialState', payload });
};

export const actionMoveSelectedNodesTo = (dispatch) => {
  return (payload) => dispatch({ type: 'moveSelectedNodesTo', payload });
};

export const actionMoveSelectedNodesToEnd = (dispatch) => {
  return (payload) => dispatch({ type: 'moveSelectedNodesToEnd', payload });
};

// Drawer
export const actionEditNode = (dispatch) => {
  return (payload) => dispatch({ type: 'editNode', payload });
};

export const actionAddingNodeClick = (dispatch) => {
  return () => dispatch({ type: 'addingNodeClick' });
};

export const actionAddValueChange = (dispatch) => {
  return (payload) => dispatch({ type: 'addValueChange', payload });
};

export const actionNodeTypeEdit = (dispatch) => {
  return (payload) => dispatch({ type: 'nodeTypeEdit', payload });
};

export const actionNodeValueEdit = (dispatch) => {
  return (payload) => dispatch({ type: 'nodeValueEdit', payload });
};

export const actionStageReset = (dispatch) => {
  return (payload) => dispatch({ type: 'stageReset', payload });
};

export const actionUploadState = (dispatch) => {
  return (payload) => dispatch({ type: 'uploadState', payload });
};

export const actionReorderNodes = (dispatch) => {
  return (payload) => dispatch({ type: 'reorderNodes', payload });
};

export const actionSetStagePos = (dispatch) => {
  return (payload) => dispatch({ type: 'setStagePos', payload });
};

export const actionSetStageScale = (dispatch) => {
  return (payload) => dispatch({ type: 'setStageScale', payload });
};
