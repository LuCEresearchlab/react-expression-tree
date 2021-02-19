import {
  exportState,
} from '../../utils/state';

const reducers = {
  setStagePos: (state, payload) => {
    const {
      stagePos,
      onStateChange,
    } = payload;

    const newState = {
      ...state,
      stagePos,
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  setStageScale: (state, payload) => {
    const {
      stageScale,
      onStateChange,
    } = payload;

    const newState = {
      ...state,
      stageScale,
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },
};

export default reducers;
