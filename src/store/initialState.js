const defaultFontSize = 24;
const defaultFontFamily = 'Roboto Mono, Courier';
const defaultNodePaddingX = 12;
const defaultNodePaddingY = 12;
const defaultPlaceholderWidth = 16;

export const defaultProps = {
  // Global
  fontSize: defaultFontSize,
  fontFamily: defaultFontFamily,
  nodePaddingX: defaultNodePaddingX,
  nodePaddingY: defaultNodePaddingY,
  connectorPlaceholder: '#',
  placeholderWidth: defaultPlaceholderWidth,
  isDraggingNode: false,
  // Stage
  isFullScreen: false,
  stagePos: { x: 0, y: 0 },
  stageScale: { x: 1, y: 1 },
  // Tree
  nodes: {},
  edges: {},
  dragEdge: null,
  selectedNode: null,
  selectedEdge: null,
  selectedRootNode: null,
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
  createNodeDescription: undefined,
  templateNodes: undefined,
  templateNodesDescription: undefined,
  updateLabelInputValue: '',
  updateTypeInputValue: '',
  updateValueInputValue: '',
  // Errors
  isValidationDialogOpen: false,
  validationErrors: [],
  currentError: undefined,
  // Undo - Redo
  undoState: [],
  redoState: [],
};

export const createSanitizedUtilsProps = (
  propFontSize,
  propFontFamily,
  propConnectorPlaceholder,
  propPlaceholderWidth,
  propNodePaddingX,
  propNodePaddingY,
) => ({
  sanitizedFontSize: propFontSize || defaultProps.fontSize,
  sanitizedFontFamily: propFontFamily || defaultProps.fontFamily,
  sanitizedConnectorPlaceholder: propConnectorPlaceholder || defaultProps.connectorPlaceholder,
  sanitizedPlaceholderWidth: propPlaceholderWidth || defaultProps.placeholderWidth,
  sanitizedNodePaddingX: propNodePaddingX || defaultNodePaddingX,
  sanitizedNodePaddingY: propNodePaddingY || defaultNodePaddingY,
});

export const createInitialState = (
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
  nodePaddingX,
  nodePaddingY,
  templateNodes,
  templateNodesDescription,
) => ({
  // Global
  fontSize: fontSize || defaultProps.fontSize,
  fontFamily: fontFamily || defaultProps.fontFamily,
  nodePaddingX: nodePaddingX || defaultNodePaddingX,
  nodePaddingY: nodePaddingY || defaultNodePaddingY,
  connectorPlaceholder: connectorPlaceholder || defaultProps.connectorPlaceholder,
  placeholderWidth: placeholderWidth || defaultProps.placeholderWidth,
  isDraggingNode: defaultProps.isDraggingNode,
  // Stage
  isFullScreen: defaultProps.isFullScreen,
  stagePos: stagePos || defaultProps.stagePos,
  stageScale: stageScale || defaultProps.stageScale,
  // Tree
  nodes: nodes || defaultProps.nodes,
  edges: edges || defaultProps.edges,
  dragEdge: null,
  selectedNode: selectedNode || defaultProps.selectedNode,
  selectedEdge: selectedEdge || defaultProps.selectedEdge,
  selectedRootNode: selectedRootNode || defaultProps.selectedRootNode,
  // Drawer
  isDrawerOpen: defaultProps.isDrawerOpen,
  addEdgeErrorMessage: defaultProps.addEdgeErrorMessage,
  isAddEdgeErrorSnackbarOpen: defaultProps.isAddEdgeErrorSnackbarOpen,
  isCreatingNode: defaultProps.isCreatingNode,
  isSelectedNodeEditable: {
    label: defaultProps.isSelectedNodeEditable.label,
    type: defaultProps.isSelectedNodeEditable.type,
    value: defaultProps.isSelectedNodeEditable.value,
  },
  createNodeInputValue: defaultProps.createNodeInputValue,
  createNodeDescription: defaultProps.createNodeDescrpiton,
  templateNodes: templateNodes || defaultProps.templateNodes,
  templateNodesDescription: templateNodesDescription || defaultProps.templateNodesDescription,
  updateLabelInputValue: defaultProps.updateLabelInputValue,
  updateTypeInputValue: defaultProps.updateTypeInputValue,
  updateValueInputValue: defaultProps.updateValueInputValue,
  // Errors
  isValidationDialogOpen: defaultProps.isValidationDialogOpen,
  validationErrors: defaultProps.validationErrors,
  currentError: defaultProps.currentError,
  // Undo - Redo
  undoState: defaultProps.undoState,
  redoState: defaultProps.redoState,
});
