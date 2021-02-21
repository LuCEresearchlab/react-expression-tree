const initialState = {
  expressionTreeEditor: {
    // Global
    connectorPlaceholder: '{{}}',
    // Stage
    stagePos: { x: 0, y: 0 },
    stageScale: { x: 1, y: 1 },
    // Tree
    nodes: [],
    edges: [],
    dragEdge: null,
    selectedNode: null,
    selectedEdge: null,
    selectedRootNode: null,
    // Drawer
    addingNode: false,
    addValue: [],
    editValue: [],
    typeValue: '',
    nodeValue: '',
  },
};

export default initialState;
