/* eslint-disable arrow-body-style */
const reducers = {
  // Invert the addingNode state
  toggleIsCreatingNode: (state) => {
    const { isCreatingNode } = state;
    return {
      ...state,
      isCreatingNode: !isCreatingNode,
    };
  },

  clearIsCreatingNode: (state) => ({
    ...state,
    isCreatingNode: false,
  }),

  toggleDrawer: (state) => {
    const { isDrawerOpen } = state;

    return {
      ...state,
      isDrawerOpen: !isDrawerOpen,
    };
  },

  // Handle addValue changes
  setCreateNodeInputValue: (state, payload) => {
    const { createNodeInputValue } = payload;
    return {
      ...state,
      createNodeInputValue,
    };
  },

  setEditLabelInputValue: (state, payload) => {
    const { editLabelInputValue } = payload;
    return {
      ...state,
      editLabelInputValue,
    };
  },

  setEditTypeInputValue: (state, payload) => {
    const { editTypeInputValue } = payload;
    return {
      ...state,
      editTypeInputValue,
    };
  },

  setEditValueInputValue: (state, payload) => {
    const { editValueInputValue } = payload;
    return {
      ...state,
      editValueInputValue,
    };
  },

  setAddEdgeErrorSnackbarMessage: (state, payload) => {
    const { addEdgeErrorMessage } = payload;
    return {
      ...state,
      addEdgeErrorMessage,
      isAddEdgeErrorSnackbarOpen: true,
      dragEdge: null,
    };
  },

  toggleIsAddEdgeErrorSnackbarOpen: (state) => ({
    ...state,
    isAddEdgeErrorSnackbarOpen: false,
  }),
};

export default reducers;
