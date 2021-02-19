const reducers = {
  setStagePos: (state, payload) => {
    const {
      stagePos,
    } = payload;

    const newState = {
      ...state,
      stagePos,
    };

    return newState;
  },

  setStageScale: (state, payload) => {
    const {
      stageScale,
    } = payload;

    const newState = {
      ...state,
      stageScale,
    };

    return newState;
  },
};

export default reducers;
