/* eslint-disable arrow-body-style */
export default {
  // Invert the addingNode state
  addingNodeClick: (state) => {
    return {
      ...state,
      addingNode: !state.addingNode,
    };
  },

  // Clear addingNode state
  clearAdding: (state) => {
    return {
      ...state,
      addingNode: false,
    };
  },

  // Handle addValue changes
  addValueChange: (state, payload) => {
    const { addValue } = payload;

    return {
      ...state,
      addValue,
    };
  },

  // Handle editValue changes
  editValueChange: (state, payload) => {
    const { editValue } = payload;

    return {
      ...state,
      editValue,
    };
  },

  // Handle typeValue changes
  typeValueChange: (state, payload) => {
    const { typeValue } = payload;

    return {
      ...state,
      typeValue,
    };
  },

  // Handle nodeValue changes
  nodeValueChange: (state, payload) => {
    const { nodeValue } = payload;

    return {
      ...state,
      nodeValue,
    };
  },
};
