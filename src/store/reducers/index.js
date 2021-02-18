import createTreeEditorReducerWithHandlers from './treeEditorReducer';
import createGlobalsReducerWithHandlers from './globalsReducer';
import createStageReducerWithHandlers from './stageReducer';
import createDrawerReducerWithHandlers from './drawerReducer';

function createReducerWithHandlers(handlers) {
  const globalsReducer = createGlobalsReducerWithHandlers(handlers);
  const stageReducer = createStageReducerWithHandlers(handlers);
  const editorReducer = createTreeEditorReducerWithHandlers(handlers);
  const drawerReducer = createDrawerReducerWithHandlers(handlers);

  // Combine the editor and the drawer reducers
  const reducers = {
    ...globalsReducer,
    ...stageReducer,
    ...editorReducer,
    ...drawerReducer,
  };

  return function reducer(state, action) {
    const { type, payload } = action;

    if (!(type in reducers)) throw new Error(`Unknown action: ${type}, ${payload}`);
    return reducers[type](state, payload);
  };
}

export default createReducerWithHandlers;

export const reducerFunctions = {
  ...createGlobalsReducerWithHandlers({}),
  ...createStageReducerWithHandlers({}),
  ...createTreeEditorReducerWithHandlers({}),
  ...createDrawerReducerWithHandlers({}),
};
