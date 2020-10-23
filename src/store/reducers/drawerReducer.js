const initialState = {
  addingNode: false,
  addValue: [""],
  fontSize: 24,
};

const drawerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "addingNodeClick":
      return {
        ...state,
        addingNode: true,
      };
    case "addValueChange":
      return {
        ...state,
        addValue: action.payload.addValue,
      };
    case "clearAdding":
      return {
        ...state,
        addingNode: false,
      };
    case "incrementFont":
      return {
        ...state,
        fontSize: state.fontSize + 1,
      };
    case "decrementFont":
      return {
        ...state,
        fontSize: state.fontSize - 1,
      };

    default:
      return state;
  }
};

export default drawerReducer;
