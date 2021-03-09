const reducers = {
  closeValidationDialog: (state) => ({
    ...state,
    isValidationDialogOpen: false,
  }),

  setValidationErrors: (state, payload) => {
    const {
      validationErrors,
    } = payload;

    return {
      ...state,
      isValidationDialogOpen: true,
      validationErrors,
      currentError: validationErrors.length > 0 ? 0 : undefined,
      selectedNode: undefined,
      selectedEdge: undefined,
    };
  },

  setPreviousError: (state) => {
    const { currentError } = state;
    const startOfArray = currentError === 0;

    return {
      ...state,
      currentError: startOfArray ? 0 : currentError - 1,
    };
  },

  setNextError: (state) => {
    const { validationErrors, currentError } = state;
    const endOfArray = currentError === validationErrors.length - 1;

    return {
      ...state,
      currentError: endOfArray ? currentError : currentError + 1,
    };
  },
};

export default reducers;
