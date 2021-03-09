function createInitialState(
  nodes,
  selectedNode,
  edges,
  selectedEdge,
  selectedRootNode,
  stagePos,
  stageScale,
  connectorPlaceholder,
  placeholderWidth,
  fontSize,
  fontFamily,
) {
  return {
    // Global
    fontSize: fontSize || 24,
    fontFamily: fontFamily || 'Roboto Mono, Courier',
    connectorPlaceholder: connectorPlaceholder || '{{}}',
    placeholderWidth: placeholderWidth || 16,
    isDraggingNode: false,
    // Stage
    isFullScreen: false,
    stagePos: stagePos || { x: 0, y: 0 },
    stageScale: stageScale || { x: 1, y: 1 },
    // Tree
    nodes: nodes || [],
    edges: edges || [],
    dragEdge: null,
    selectedNode: selectedNode || null,
    selectedEdge: selectedEdge || null,
    selectedRootNode: selectedRootNode || null,
    // Drawer
    isDrawerOpen: true,
    addEdgeErrorMessage: '',
    isAddEdgeErrorSnackbarOpen: false,
    isCreatingNode: false,
    isSelectedNodeEditable: {
      label: false,
      type: false,
      value: false,
    },
    createNodeInputValue: '',
    editLabelInputValue: '',
    editTypeInputValue: '',
    editValueInputValue: '',
    // Errors
    isValidationDialogOpen: false,
    validationErrors: [],
    currentError: undefined,
  };
}

export default createInitialState;
