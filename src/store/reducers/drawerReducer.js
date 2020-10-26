const initialState = {
  addingNode: false,
  addValue: [""],
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

    default:
      return state;
  }
};

export default drawerReducer;
