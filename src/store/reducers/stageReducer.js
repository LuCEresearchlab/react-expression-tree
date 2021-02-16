import {
  exportState,
} from '../../utils/state';

function createStageReducerWithHandlers({
  onStateChange,
}) {
  return {
    setStagePos: (state, payload) => {
      const {
        stagePos,
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
      } = payload;

      const newState = {
        ...state,
        stageScale,
      };

      if (onStateChange) onStateChange(exportState(newState));
      return newState;
    },
  };
}

export default createStageReducerWithHandlers;
