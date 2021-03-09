/* eslint-disable arrow-body-style */
const actions = [
  {
    name: 'moveNodeTo',
    action: (payload) => { return { type: 'moveNodeTo', payload }; },
  },
  {
    name: 'moveNodeToEnd',
    action: (payload) => { return { type: 'moveNodeToEnd', payload }; },
  },
  {
    name: 'setDragEdge',
    action: (payload) => { return { type: 'setDragEdge', payload }; },
  },
  {
    name: 'moveDragEdgeParentEndTo',
    action: (payload) => { return { type: 'moveDragEdgeParentEndTo', payload }; },
  },
  {
    name: 'moveDragEdgeChildEndTo',
    action: (payload) => { return { type: 'moveDragEdgeChildEndTo', payload }; },
  },
  {
    name: 'addEdge',
    action: (payload) => { return { type: 'addEdge', payload }; },
  },
  {
    name: 'updateEdge',
    action: (payload) => { return { type: 'updateEdge', payload }; },
  },
  {
    name: 'clearDragEdge',
    action: (payload) => { return { type: 'clearDragEdge', payload }; },
  },
  {
    name: 'clearNodeSelection',
    action: (payload) => { return { type: 'clearNodeSelection', payload }; },
  },
  {
    name: 'typeValueChange',
    action: (payload) => { return { type: 'typeValueChange', payload }; },
  },
  {
    name: 'nodeValueChange',
    action: (payload) => { return { type: 'nodeValueChange', payload }; },
  },
  {
    name: 'selectEdge',
    action: (payload) => { return { type: 'selectEdge', payload }; },
  },
  {
    name: 'clearEdgeSelection',
    action: (payload) => { return { type: 'clearEdgeSelection', payload }; },
  },
  {
    name: 'selectRootNode',
    action: (payload) => { return { type: 'selectRootNode', payload }; },
  },
  {
    name: 'clearRootSelection',
    action: (payload) => { return { type: 'clearRootSelection', payload }; },
  },
  {
    name: 'setInitialState',
    action: (payload) => { return { type: 'setInitialState', payload }; },
  },
  {
    name: 'moveSelectedNodesTo',
    action: (payload) => { return { type: 'moveSelectedNodesTo', payload }; },
  },
  {
    name: 'moveSelectedNodesToEnd',
    action: (payload) => { return { type: 'moveSelectedNodesToEnd', payload }; },
  },
  {
    name: 'uploadState',
    action: (payload) => { return { type: 'uploadState', payload }; },
  },
  {
    name: 'setNodes',
    action: (payload) => { return { type: 'setNodes', payload }; },
  },
  {
    name: 'setEdges',
    action: (payload) => { return { type: 'setEdges', payload }; },
  },
  {
    name: 'setConnectorPlaceholder',
    action: (payload) => { return { type: 'setConnectorPlaceholder', payload }; },
  },
  {
    name: 'setPlaceholderWidth',
    action: (payload) => { return { type: 'setPlaceholderWidth', payload }; },
  },
  {
    name: 'setFontSize',
    action: (payload) => { return { type: 'setFontSize', payload }; },
  },
  {
    name: 'setFontFamily',
    action: (payload) => { return { type: 'setFontFamily', payload }; },
  },

  // Global
  {
    name: 'setIsDraggingNode',
    action: (isDraggingNode) => ({
      type: 'setIsDraggingNode',
      payload: {
        isDraggingNode,
      },
    }),
  },
  // Drawer
  {
    name: 'setAddEdgeErrorSnackbarMessage',
    action: (addEdgeErrorMessage) => ({
      type: 'setAddEdgeErrorSnackbarMessage',
      payload: {
        addEdgeErrorMessage,
      },
    }),
  },
  {
    name: 'toggleIsAddEdgeErrorSnackbarOpen',
    action: () => ({
      type: 'toggleIsAddEdgeErrorSnackbarOpen',
    }),
  },
  {
    name: 'toggleIsCreatingNode',
    action: () => ({
      type: 'toggleIsCreatingNode',
    }),
  },
  {
    name: 'clearIsCreatingNode',
    action: () => ({
      type: 'clearIsCreatingNode',
    }),
  },
  {
    name: 'toggleDrawer',
    action: () => ({
      type: 'toggleDrawer',
    }),
  },
  {
    name: 'setCreateNodeInputValue',
    action: (createNodeInputValue) => ({
      type: 'setCreateNodeInputValue',
      payload: {
        createNodeInputValue,
      },
    }),
  },
  {
    name: 'setEditLabelInputValue',
    action: (editLabelInputValue) => ({
      type: 'setEditLabelInputValue',
      payload: {
        editLabelInputValue,
      },
    }),
  },
  {
    name: 'setEditTypeInputValue',
    action: (editTypeInputValue) => ({
      type: 'setEditTypeInputValue',
      payload: {
        editTypeInputValue,
      },
    }),
  },
  {
    name: 'setEditValueInputValue',
    action: (editValueInputValue) => ({
      type: 'setEditValueInputValue',
      payload: {
        editValueInputValue,
      },
    }),
  },
  // Stage
  {
    name: 'toggleFullScreen',
    action: () => ({
      type: 'toggleFullScreen',
    }),
  },
  {
    name: 'setStagePos',
    action: (stagePos) => ({
      type: 'setStagePos',
      payload: {
        stagePos,
      },
    }),
  },
  {
    name: 'setStageScale',
    action: (stageScale) => ({
      type: 'setStageScale',
      payload: {
        stageScale,
      },
    }),
  },
  {
    name: 'setStagePos',
    action: (stagePos) => ({
      type: 'setStagePos',
      payload: {
        stagePos,
      },
    }),
  },
  {
    name: 'setStagePositionAndScale',
    action: ({
      stagePos,
      stageScale,
    }) => ({
      type: 'setStagePositionAndScale',
      payload: {
        stagePos,
        stageScale,
      },
    }),
  },
  {
    name: 'zoomStage',
    action: (zoomMultiplier) => ({
      type: 'zoomStage',
      payload: {
        zoomMultiplier,
      },
    }),
  },
  {
    name: 'zoomStageWheel',
    action: ({ stageScale, stagePos }) => ({
      type: 'zoomStageWheel',
      payload: {
        stageScale,
        stagePos,
      },
    }),
  },
  // Tree
  {
    name: 'removeEdge',
    action: (edgeId) => ({
      type: 'removeEdge',
      payload: {
        edgeId,
      },
    }),
  },
  {
    name: 'createNode',
    action: ({
      id,
      pieces,
      x,
      y,
      width,
      type,
      value,
      isFinal,
    }) => ({
      type: 'createNode',
      payload: {
        id,
        pieces,
        x,
        y,
        width,
        type,
        value,
        isFinal,
      },
    }),
  },
  {
    name: 'removeNode',
    action: (nodeId) => ({
      type: 'removeNode',
      payload: {
        nodeId,
      },
    }),
  },
  {
    name: 'stageReset',
    action: ({
      nodes,
      selectedNode,
      edges,
      selectedEdge,
      selectedRootNode,
      stagePos,
      stageScale,
      connectorPlaceholder,
    }) => ({
      type: 'stageReset',
      payload: {
        nodes,
        selectedNode,
        edges,
        selectedEdge,
        selectedRootNode,
        stagePos,
        stageScale,
        connectorPlaceholder,
      },
    }),
  },
  {
    name: 'setSelectedNode',
    action: (selectedNode) => ({
      type: 'setSelectedNode',
      payload: {
        selectedNode,
      },
    }),
  },
  {
    name: 'clearSelectedNode',
    action: () => ({
      type: 'clearSelectedNode',
    }),
  },
  {
    name: 'setSelectedEdge',
    action: (selectedEdge) => ({
      type: 'setSelectedEdge',
      payload: {
        selectedEdge,
      },
    }),
  },
  {
    name: 'clearSelectedEdge',
    action: () => ({
      type: 'clearSelectedEdge',
    }),
  },
  {
    name: 'setSelectedRootNode',
    action: (selectedRootNode) => ({
      type: 'setSelectedRootNode',
      payload: {
        selectedRootNode,
      },
    }),
  },
  {
    name: 'clearSelectedRootNode',
    action: () => ({
      type: 'clearSelectedRootNode',
    }),
  },
  {
    name: 'editNode',
    action: ({ pieces, width }) => ({
      type: 'editNode',
      payload: {
        pieces,
        width,
      },
    }),
  },
  {
    name: 'editNodeType',
    action: (type) => ({
      type: 'editNodeType',
      payload: {
        type,
      },
    }),
  },
  {
    name: 'editNodeValue',
    action: (value) => ({
      type: 'editNodeValue',
      payload: {
        value,
      },
    }),
  },
  {
    name: 'setOrderedNodes',
    action: ({
      nodes,
      stagePos,
      stageScale,
    }) => ({
      type: 'setOrderedNodes',
      payload: {
        nodes,
        stagePos,
        stageScale,
      },
    }),
  },
  // Errors
  {
    name: 'setValidationErrors',
    action: (validationErrors) => ({
      type: 'setValidationErrors',
      payload: {
        validationErrors,
      },
    }),
  },
  {
    name: 'closeValidationDialog',
    action: () => ({
      type: 'closeValidationDialog',
    }),
  },
  {
    name: 'setPreviousError',
    action: () => ({
      type: 'setPreviousError',
    }),
  },
  {
    name: 'setNextError',
    action: () => ({
      type: 'setNextError',
    }),
  },
];

export default actions;
