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

  setCreateNodeInputValue: (state, payload) => {
    const { createNodeInputValue } = payload;

    return {
      ...state,
      createNodeInputValue,
    };
  },

  setUpdateLabelInputValue: (state, payload) => {
    const { updateLabelInputValue } = payload;
    return {
      ...state,
      updateLabelInputValue,
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

  setCreateNodeDescription: (state, payload) => {
    const { createNodeDescription } = payload;

    return {
      ...state,
      createNodeDescription,
    };
  },

  undo: (state) => {
    const { undoState, redoState } = state;

    const lastUndoState = undoState[undoState.length - 1];
    const changedKeys = Object.keys(lastUndoState);

    const currentState = {};
    changedKeys.forEach((key) => {
      currentState[key] = state[key];
    });

    return {
      ...state,
      undoState: undoState.slice(0, -1),
      redoState: [
        ...redoState,
        currentState,
      ],
      ...lastUndoState,
    };
  },

  redo: (state) => {
    const { undoState, redoState } = state;

    const lastRedoState = redoState[redoState.length - 1];
    const changedKeys = Object.keys(lastRedoState);

    const currentState = {};
    changedKeys.forEach((key) => {
      currentState[key] = state[key];
    });

    return {
      ...state,
      redoState: redoState.slice(0, -1),
      undoState: [
        ...undoState,
        currentState,
      ],
      ...lastRedoState,
    };
  },
};

export default reducers;
