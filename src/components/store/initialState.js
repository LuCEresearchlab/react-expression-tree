const initialState = {
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
};

export default initialState;
