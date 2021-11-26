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
};

export default reducers;
