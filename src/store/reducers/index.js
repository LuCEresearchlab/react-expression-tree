import { combineReducers } from "redux";
import editor from "./treeEditorReducer";
import drawer from "./drawerReducer";

export default combineReducers({ editor, drawer });
