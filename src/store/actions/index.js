/* eslint-disable arrow-body-style */
const actions = [
  {
    name: 'removeNode',
    action: (payload) => { return { type: 'removeNode', payload }; },
  },
  {
    name: 'moveNodeTo',
    action: (payload) => { return { type: 'moveNodeTo', payload }; },
  },
  {
    name: 'moveNodeToEnd',
    action: (payload) => { return { type: 'moveNodeToEnd', payload }; },
  },
  {
    name: 'setDragEdge',
    action: (payload) => { return { type: 'setDragEdge', payload }; },
  },
  {
    name: 'moveDragEdgeParentEndTo',
    action: (payload) => { return { type: 'moveDragEdgeParentEndTo', payload }; },
  },
  {
    name: 'moveDragEdgeChildEndTo',
    action: (payload) => { return { type: 'moveDragEdgeChildEndTo', payload }; },
  },
  {
    name: 'removeEdge',
    action: (payload) => { return { type: 'removeEdge', payload }; },
  },
  {
    name: 'addEdge',
    action: (payload) => { return { type: 'addEdge', payload }; },
  },
  {
    name: 'updateEdge',
    action: (payload) => { return { type: 'updateEdge', payload }; },
  },
  {
    name: 'clearDragEdge',
    action: (payload) => { return { type: 'clearDragEdge', payload }; },
  },
  {
    name: 'clearNodeSelection',
    action: (payload) => { return { type: 'clearNodeSelection', payload }; },
  },
  {
    name: 'addNode',
    action: (payload) => { return { type: 'addNode', payload }; },
  },
  {
    name: 'selectNode',
    action: (payload) => { return { type: 'selectNode', payload }; },
  },
  {
    name: 'clearAdding',
    action: (payload) => { return { type: 'clearAdding', payload }; },
  },
  {
    name: 'editValueChange',
    action: (payload) => { return { type: 'editValueChange', payload }; },
  },
  {
    name: 'typeValueChange',
    action: (payload) => { return { type: 'typeValueChange', payload }; },
  },
  {
    name: 'nodeValueChange',
    action: (payload) => { return { type: 'nodeValueChange', payload }; },
  },
  {
    name: 'selectEdge',
    action: (payload) => { return { type: 'selectEdge', payload }; },
  },
  {
    name: 'clearEdgeSelection',
    action: (payload) => { return { type: 'clearEdgeSelection', payload }; },
  },
  {
    name: 'selectRootNode',
    action: (payload) => { return { type: 'selectRootNode', payload }; },
  },
  {
    name: 'clearRootSelection',
    action: (payload) => { return { type: 'clearRootSelection', payload }; },
  },
  {
    name: 'setInitialState',
    action: (payload) => { return { type: 'setInitialState', payload }; },
  },
  {
    name: 'moveSelectedNodesTo',
    action: (payload) => { return { type: 'moveSelectedNodesTo', payload }; },
  },
  {
    name: 'moveSelectedNodesToEnd',
    action: (payload) => { return { type: 'moveSelectedNodesToEnd', payload }; },
  },
  {
    name: 'editNode',
    action: (payload) => { return { type: 'editNode', payload }; },
  },
  {
    name: 'addingNodeClick',
    action: (payload) => { return { type: 'addingNodeClick', payload }; },
  },
  {
    name: 'addValueChange',
    action: (payload) => { return { type: 'addValueChange', payload }; },
  },
  {
    name: 'nodeTypeEdit',
    action: (payload) => { return { type: 'nodeTypeEdit', payload }; },
  },
  {
    name: 'nodeValueEdit',
    action: (payload) => { return { type: 'nodeValueEdit', payload }; },
  },
  {
    name: 'stageReset',
    action: (payload) => { return { type: 'stageReset', payload }; },
  },
  {
    name: 'uploadState',
    action: (payload) => { return { type: 'uploadState', payload }; },
  },
  {
    name: 'reorderNodes',
    action: (payload) => { return { type: 'reorderNodes', payload }; },
  },
  {
    name: 'setStagePos',
    action: (payload) => { return { type: 'setStagePos', payload }; },
  },
  {
    name: 'setStageScale',
    action: (payload) => { return { type: 'setStageScale', payload }; },
  },
];

export default actions;
