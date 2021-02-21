const reducers = {
  // Invert the addingNode state
  addingNodeClick: (state) => {
    const { expressionTreeEditor } = state;
    const { addingNode } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        addingNode: !addingNode,
      },
    };
  },

  // Clear addingNode state
  clearAdding: (state) => {
    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        addingNode: false,
      },
    };
  },

  // Handle addValue changes
  addValueChange: (state, payload) => {
    const { addValue } = payload;
    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        addValue,
      },
    };
  },

  // Handle editValue changes
  editValueChange: (state, payload) => {
    const { editValue } = payload;
    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        editValue,
      },
    };
  },

  // Handle typeValue changes
  typeValueChange: (state, payload) => {
    const { typeValue } = payload;
    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        typeValue,
      },
    };
  },

  // Handle nodeValue changes
  nodeValueChange: (state, payload) => {
    const { nodeValue } = payload;
    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodeValue,
      },
    };
  },
};

export default reducers;
