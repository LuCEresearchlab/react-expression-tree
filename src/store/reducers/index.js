import createTreeEditorReducerWithHandlers from './treeEditorReducer';
import drawerReducer from './drawerReducer';

function createReducerWithHandlers(handlers) {
  const editorReducer = createTreeEditorReducerWithHandlers(handlers);

  // Combine the editor and the drawer reducers
  const reducers = {
    ...editorReducer,
    ...drawerReducer,
  };

  return function reducer(state, action) {
    const { type, payload } = action;

    if (!(type in reducers)) throw new Error(`Unknown action: ${type}, ${payload}`);
    return reducers[type](state, payload);
  };

  // // Set up actions filtering and grouping for undo/redo features
  // const undoableTreeEditorReducer = undoable(treeEditorReducer, {
  //   // Filtered actions (these don't count in the undo/redo history)
  //   filter: function filterActions(action) {
  //     return (
  //       action.type !== 'clearNodeSelection'
  //       && action.type !== 'clearEdgeSelection'
  //       && action.type !== 'selectNode'
  //       && action.type !== 'selectEdge'
  //       && action.type !== 'setDragEdge'
  //       && action.type !== 'clearDragEdge'
  //       && action.type !== 'moveDragEdgeChildEndTo'
  //       && action.type !== 'moveDragEdgeParentEndTo'
  //       && action.type !== 'moveNodeTo'
  //       && action.type !== 'addValueChange'
  //       && action.type !== 'editValueChange'
  //       && action.type !== 'typeValueChange'
  //       && action.type !== 'nodeValueChange'
  //       && action.type !== 'clearAdding'
  //       && action.type !== 'addingNodeClick'
  //       && action.type !== 'setInitialState'
  //       && action.type !== 'moveSelectedNodesTo'
  //     );
  //   },
  //   // Grouped actions (multiple following actions of the same type
  //   // will result as a single undo/redo action)
  //   groupBy: groupByActionTypes('reorderNodes'),
  // });
}

export default createReducerWithHandlers;
