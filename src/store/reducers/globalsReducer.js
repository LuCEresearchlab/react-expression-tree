const reducers = {
  setConnectorPlaceholder: (state, payload) => {
    const {
      connectorPlaceholder,
    } = payload;

    return {
      ...state,
      connectorPlaceholder,
    };
  },

  setPlaceholderWidth: (state, payload) => {
    const {
      placeholderWidth,
    } = payload;

    return {
      ...state,
      placeholderWidth,
    };
  },

  setFontFamily: (state, payload) => {
    const {
      fontFamily,
    } = payload;

    return {
      ...state,
      fontFamily,
    };
  },

  setFontSize: (state, payload) => {
    const {
      fontSize,
    } = payload;

    return {
      ...state,
      fontSize,
    };
  },

  setIsDraggingNode: (state, payload) => {
    const {
      isDraggingNode,
    } = payload;

    return {
      ...state,
      isDraggingNode,
    };
  },
};

export default reducers;
