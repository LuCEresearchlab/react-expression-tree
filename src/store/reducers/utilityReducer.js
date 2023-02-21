const reducers = {
  resetEdges: (state) => {
    const { nodes } = state;
    const updatedNodes = Object.entries(nodes).reduce((accumulator, [key, value]) => {
      accumulator[key] = {
        ...value,
        childEdges: [],
        parentEdges: value.piecesPosition.map(() => []),
      };
      return accumulator;
    }, {});
    return {
      ...state,
      nodes: updatedNodes,
      edges: {},
    };
  },

  resetTypeLabels: (state) => {
    const { nodes } = state;
    const updatedNodes = Object.keys(nodes).reduce((acc, nodeLabel) => {
      acc[nodeLabel] = {
        ...nodes[nodeLabel],
        type: '',
      };
      return acc;
    }, {});

    return {
      ...state,
      nodes: updatedNodes,
    };
  },

  resetValueLabels: (state) => {
    const { nodes } = state;
    const updatedNodes = Object.keys(nodes).reduce((acc, nodeLabel) => {
      acc[nodeLabel] = {
        ...nodes[nodeLabel],
        value: '',
      };
      return acc;
    }, {});

    return {
      ...state,
      nodes: updatedNodes,
    };
  },

  resetRootNode: (state) => ({
    ...state,
    selectedRootNode: undefined,
  }),

  updateGlobalState: (state, payload) => {
    const {
      nodes,
      edges,
      selectedRootNode,
      stagePos,
      stageScale,
    } = payload;

    const {
      undoState,
      nodes: currentNodes,
      edges: currentEdges,
      selectedNode: currentSelectedNode,
      selectedEdge: currentSelectedEdge,
      selectedRootNode: currentSelectedRootNode,
      stagePos: currentStagePos,
      stageScale: currentStageScale,
    } = state;

    const newUndoState = {
      action: 'updateGlobalState',
      nodes: currentNodes,
      edges: currentEdges,
      selectedNode: currentSelectedNode,
      selectedEdge: currentSelectedEdge,
      selectedRootNode: currentSelectedRootNode,
      stagePos: currentStagePos,
      stageScale: currentStageScale,
    };

    return {
      ...state,
      nodes,
      edges,
      selectedNode: undefined,
      selectedEdge: undefined,
      selectedRootNode,
      stagePos,
      stageScale,
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },
};

export default reducers;
