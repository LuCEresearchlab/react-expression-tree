const reducers = {
  toggleFullScreen: (state) => {
    const { isFullScreen } = state;

    return {
      ...state,
      isFullScreen: !isFullScreen,
    };
  },

  setStagePos: (state, payload) => {
    const {
      stagePos,
    } = payload;

    return {
      ...state,
      stagePos,
    };
  },

  setStageScale: (state, payload) => {
    const {
      stageScale,
    } = payload;

    return {
      ...state,
      stageScale,
    };
  },

  setStagePositionAndScale: (state, payload) => {
    const {
      stagePos,
      stageScale,
    } = payload;

    return {
      ...state,
      stagePos,
      stageScale,
    };
  },

  zoomStage: (state, payload) => {
    const {
      zoomMultiplier,
    } = payload;

    const { stageScale } = state;
    const { x } = stageScale;
    const zoomValue = x * zoomMultiplier;

    return {
      ...state,
      stageScale: {
        x: zoomValue,
        y: zoomValue,
      },
    };
  },

  zoomStageWheel: (state, payload) => {
    const {
      stageScale,
      stagePos,
    } = payload;

    return {
      ...state,
      stagePos,
      stageScale,
    };
  },
};

export default reducers;
