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

  setNodePaddingX: (state, payload) => {
    const {
      nodePaddingX,
    } = payload;

    return {
      ...state,
      nodePaddingX,
    };
  },

  setNodePaddingY: (state, payload) => {
    const {
      nodePaddingY,
    } = payload;

    return {
      ...state,
      nodePaddingY,
    };
  },
};

export default reducers;
