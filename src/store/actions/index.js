const actions = [
  {
    name: 'setNodes',
    action: (nodes) => ({
      type: 'setNodes',
      payload: {
        nodes,
      },
    }),
  },
  {
    name: 'createNode',
    action: ({
      id,
      pieces,
      piecesPosition,
      x,
      y,
      width,
      height,
      type,
      value,
      isFinal,
      isSelected,
      childEdges,
      parentEdges,
    }) => ({
      type: 'createNode',
      payload: {
        id,
        pieces,
        piecesPosition,
        x,
        y,
        width,
        height,
        type,
        value,
        isFinal,
        isSelected,
        childEdges,
        parentEdges,
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
    name: 'updateNode',
    action: ({
      updatedEdges,
      pieces,
      piecesPosition,
      width,
      parentEdges,
    }) => ({
      type: 'updateNode',
      payload: {
        updatedEdges,
        pieces,
        piecesPosition,
        width,
        parentEdges,
      },
    }),
  },
  {
    name: 'updateNodeCoordinates',
    action: ({
      updatedEdges,
      nodeId,
      updatedNode,
    }) => ({
      type: 'updateNodeCoordinates',
      payload: {
        updatedEdges,
        nodeId,
        updatedNode,
      },
    }),
  },
  {
    name: 'updateNodeCoordinatesAndFinishDragging',
    action: ({
      updatedEdges,
      nodeId,
      updatedNode,
    }) => ({
      type: 'updateNodeCoordinatesAndFinishDragging',
      payload: {
        updatedEdges,
        nodeId,
        updatedNode,
      },
    }),
  },
  {
    name: 'updateNodeType',
    action: (type) => ({
      type: 'updateNodeType',
      payload: {
        type,
      },
    }),
  },
  {
    name: 'updateNodeValue',
    action: (value) => ({
      type: 'updateNodeValue',
      payload: {
        value,
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
    name: 'setEdges',
    action: (edges) => ({
      type: 'setEdges',
      payload: {
        edges,
      },
    }),
  },
  {
    name: 'createEdge',
    action: ({
      childNodeId,
      parentNodeId,
      parentPieceId,
      childX,
      childY,
      parentX,
      parentY,
    }) => ({
      type: 'createEdge',
      payload: {
        childNodeId,
        parentNodeId,
        parentPieceId,
        childX,
        childY,
        parentX,
        parentY,
      },
    }),
  },
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
    name: 'updateChildEdge',
    action: ({
      edgeId,
      newEdge,
    }) => ({
      type: 'updateChildEdge',
      payload: {
        edgeId,
        newEdge,
      },
    }),
  },
  {
    name: 'updateParentEdge',
    action: ({
      edgeId,
      newEdge,
    }) => ({
      type: 'updateParentEdge',
      payload: {
        edgeId,
        newEdge,
      },
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
    name: 'setDragEdge',
    action: (dragEdge) => ({
      type: 'setDragEdge',
      payload: {
        dragEdge,
      },
    }),
  },
  {
    name: 'clearDragEdge',
    action: () => ({
      type: 'clearDragEdge',
    }),
  },
  {
    name: 'updateDragEdgeParentCoordinates',
    action: ({
      x,
      y,
    }) => ({
      type: 'updateDragEdgeParentCoordinates',
      payload: {
        x,
        y,
      },
    }),
  },
  {
    name: 'updateDragEdgeChildCoordinates',
    action: ({
      x,
      y,
    }) => ({
      type: 'updateDragEdgeChildCoordinates',
      payload: {
        x,
        y,
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
    name: 'setOrderedNodes',
    action: ({
      nodes,
      edges,
      stagePos,
      stageScale,
    }) => ({
      type: 'setOrderedNodes',
      payload: {
        nodes,
        edges,
        stagePos,
        stageScale,
      },
    }),
  },
  {
    name: 'setIsDraggingNode',
    action: (nodeId) => ({
      type: 'setIsDraggingNode',
      payload: {
        nodeId,
      },
    }),
  },
  
  
  


  
  
  
  
  

  {
    name: 'moveNodeToEnd',
    action: (payload) => { return { type: 'moveNodeToEnd', payload }; },
  },
  {
    name: 'nodeValueChange',
    action: (payload) => { return { type: 'nodeValueChange', payload }; },
  },
  {
    name: 'setConnectorPlaceholder',
    action: (payload) => { return { type: 'setConnectorPlaceholder', payload }; },
  },
  {
    name: 'setPlaceholderWidth',
    action: (payload) => { return { type: 'setPlaceholderWidth', payload }; },
  },

  // Globals
  {
    name: 'setFontSize',
    action: (fontSize) => ({
      type: 'setFontSize',
      payload: {
        fontSize,
      },
    }),
  },
  {
    name: 'setFontFamily',
    action: (fontFamily) => ({
      type: 'setFontFamily',
      payload: {
        fontFamily,
      },
    }),
  },
  {
    name: 'setNodePaddingX',
    action: (nodePaddingX) => ({
      type: 'setNodePaddingX',
      payload: {
        nodePaddingX,
      },
    }),
  },
  {
    name: 'setNodePaddingY',
    action: (nodePaddingY) => ({
      type: 'setNodePaddingY',
      payload: {
        nodePaddingY,
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
    name: 'setUpdateLabelInputValue',
    action: (updateLabelInputValue) => ({
      type: 'setUpdateLabelInputValue',
      payload: {
        updateLabelInputValue,
      },
    }),
  },
  {
    name: 'setCreateNodeDescription',
    action: (createNodeDescription) => ({
      type: 'setCreateNodeDescription',
      payload: {
        createNodeDescription,
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
  // Undo - Redo
  {
    name: 'undo',
    action: () => ({
      type: 'undo',
    }),
  },
  {
    name: 'redo',
    action: () => ({
      type: 'redo',
    }),
  },
];

export default actions;
