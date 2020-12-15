const initialState = {
  addingNode: false,
  addValue: [],
  editValue: [],
  typeValue: "",
  nodeValue: "",
};

const drawerReducer = (state = initialState, action) => {
  switch (action.type) {
    // Invert the addingNode state
    case "addingNodeClick":
      return {
        ...state,
        addingNode: !state.addingNode,
      };

    // Clear addingNode state
    case "clearAdding":
      return {
        ...state,
        addingNode: false,
      };

    // Handle addValue changes
    case "addValueChange":
      return {
        ...state,
        addValue: action.payload.addValue,
      };

    // Handle editValue changes
    case "editValueChange":
      return {
        ...state,
        editValue: action.payload.editValue,
      };

    // Handle typeValue changes
    case "typeValueChange":
      return {
        ...state,
        typeValue: action.payload.typeValue,
      };

    // Handle nodeValue changes
    case "nodeValueChange":
      return {
        ...state,
        nodeValue: action.payload.nodeValue,
      };

    default:
      return state;
  }
};

export default drawerReducer;
