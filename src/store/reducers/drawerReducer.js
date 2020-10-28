const initialState = {
  addingNode: false,
  addValue: [],
  editValue: [],
  typeValue: "",
};

const drawerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "addingNodeClick":
      return {
        ...state,
        addingNode: !state.addingNode,
      };
    case "addValueChange":
      return {
        ...state,
        addValue: action.payload.addValue,
      };
    case "editValueChange":
      return {
        ...state,
        editValue: action.payload.editValue,
      };
    case "typeValueChange":
      return {
        ...state,
        typeValue: action.payload.typeValue,
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
