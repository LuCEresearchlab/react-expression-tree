const reducers = {
  setStagePos: (state, payload) => {
    const {
      stagePos,
    } = payload;

    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        stagePos,
      },
    };
  },

  setStageScale: (state, payload) => {
    const {
      stageScale,
    } = payload;

    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        stageScale,
      },
    };
  },
};

export default reducers;
