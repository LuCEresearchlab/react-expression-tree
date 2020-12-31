import { combineReducers } from 'redux';
import editor from './treeEditorReducer';
import drawer from './drawerReducer';

// Combine the editor and the drawer reducers
export default combineReducers({ editor, drawer });
