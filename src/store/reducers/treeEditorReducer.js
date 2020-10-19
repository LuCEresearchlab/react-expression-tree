import undoable, { excludeAction, groupByActionTypes } from "redux-undo";

const initialNodes = [
  { id: 0, pieces: ["19"] },
  { id: 1, pieces: ["age"] },
  { id: 2, pieces: ['"Hello', 'World!"'] },
  { id: 3, pieces: ["-", "{{}}"] },
  { id: 4, pieces: ["{{}}", "<", "{{}}"] },
  { id: 5, pieces: ["{{}}", "+", "{{}}"] },
  { id: 6, pieces: ["(int)", "{{}}"] },
  { id: 7, pieces: ["{{}}", "?", "{{}}", ":", "{{}}"] },
  { id: 8, pieces: ["{{}}", ".length"] },
  { id: 9, pieces: ["{{}}", ".length()"] },
  { id: 10, pieces: ["{{}}", ".append(", "{{}}", ")"] },
];
const initialEdges = [
  { id: 0, parentNodeId: 3, parentPieceId: 1, childNodeId: 0, type: "" },
  { id: 1, parentNodeId: 4, parentPieceId: 0, childNodeId: 3, type: "" },
  { id: 2, parentNodeId: 4, parentPieceId: 2, childNodeId: 1, type: "" },
  { id: 3, parentNodeId: 7, parentPieceId: 0, childNodeId: 4, type: "" },
  { id: 4, parentNodeId: 7, parentPieceId: 2, childNodeId: 9, type: "" },
  { id: 5, parentNodeId: 9, parentPieceId: 0, childNodeId: 2, type: "" },
];

const initialNodePositions = initialNodes.map((node, i) => ({
  id: node.id,
  x: 320,
  y: 10 + i * 55,
}));

const initialState = {
  nodes: initialNodes,
  edges: initialEdges,
  nodePositions: initialNodePositions,
  dragEdge: null,
  selectedNode: null,
  selectedEdge: null,
};

const treeEditorReducer = (state = initialState, action) => {
  function maxNodeId() {
    return state.nodes
      .map(n => n.id)
      .reduce((id1, id2) => Math.max(id1, id2), 0);
  }

  function maxEdgeId() {
    return state.edges
      .map(e => e.id)
      .reduce((id1, id2) => Math.max(id1, id2), 0);
  }

  switch (action.type) {
    case "addNode":
      const id = maxNodeId() + 1;
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id,
            pieces: action.payload.pieces,
          },
        ],
        nodePositions: [
          ...state.nodePositions,
          {
            id,
            x: action.payload.x,
            y: action.payload.y,
          },
        ],
      };

    case "removeNode":
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload.nodeId),
        nodePositions: state.nodePositions.filter(
          p => p.id !== action.payload.nodeId
        ),
        edges: state.edges.filter(
          edge =>
            edge.parentNodeId !== action.payload.nodeId &&
            edge.childNodeId !== action.payload.nodeId
        ),
      };

    case "selectNode":
      return {
        ...state,
        selectedNode: action.payload.selectedNode,
      };

    case "clearNodeSelection":
      return {
        ...state,
        selectedNode: null,
      };

    case "moveNodeTo":
      return {
        ...state,
        nodePositions: state.nodePositions.map(nodePosition =>
          nodePosition.id === action.payload.nodeId
            ? {
                ...nodePosition,
                x: action.payload.x,
                y: action.payload.y,
              }
            : nodePosition
        ),
      };

    case "addEdge":
      return {
        ...state,
        edges: [
          ...state.edges,
          {
            ...action.payload.edge,
            id: maxEdgeId() + 1,
          },
        ],
      };

    case "removeEdge":
      return {
        ...state,
        edges: state.edges.filter(edge => edge.id !== action.payload.edgeId),
      };

    case "setDragEdge":
      return {
        ...state,
        dragEdge: action.payload.dragEdge,
      };

    case "moveDragEdgeParentEndTo":
      return {
        ...state,
        dragEdge: {
          ...state.dragEdge,
          parentX: action.payload.x,
          parentY: action.payload.y,
        },
      };

    case "moveDragEdgeChildEndTo":
      return {
        ...state,
        dragEdge: {
          ...state.dragEdge,
          childX: action.payload.x,
          childY: action.payload.y,
        },
      };

    case "clearDragEdge":
      return {
        ...state,
        dragEdge: null,
      };

    case "editNode":
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.selectedNodeId
            ? {
                ...node,
                pieces: action.payload.pieces,
              }
            : node
        ),
      };

    case "selectEdge":
      return {
        ...state,
        selectedEdge: action.payload.selectedEdge,
      };

    case "clearEdgeSelection":
      return {
        ...state,
        selectedEdge: null,
      };

    case "edgeTypeEdit":
      return {
        ...state,
        edges: state.edges.map(edge =>
          edge.id === action.payload.selectedEdgeId
            ? {
                ...edge,
                type: action.payload.type,
              }
            : edge
        ),
      };
    case "stageReset":
      return initialState;
    case "uploadState":
      return {
        ...state,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
        nodePositions: action.payload.nodePositions,
        dragEdge: null,
        selectedNode: null,
        selectedEdge: null,
      };

    default:
      return state;
  }
};

const undoableTreeEditorReducer = undoable(treeEditorReducer, {
  filter: excludeAction([]),
  groupBy: groupByActionTypes([]),
});

export default undoableTreeEditorReducer;
