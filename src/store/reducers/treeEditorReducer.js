import undoable from "redux-undo";

const initialNodes = [
  { id: 1, pieces: ["19"], x: 320, y: 10, width: 28.8046875 },
  { id: 2, pieces: ["age"], x: 320, y: 65, width: 43.20703125 },
  { id: 3, pieces: ['"Hello', 'World!"'], x: 320, y: 120, width: 192.23046875 },
  { id: 4, pieces: ["-", "{{}}"], x: 320, y: 175, width: 33.8046875 },
  { id: 5, pieces: ["{{}}", "<", "{{}}"], x: 320, y: 230, width: 53.20703125 },
  { id: 6, pieces: ["{{}}", "+", "{{}}"], x: 320, y: 285, width: 53.20703125 },
  { id: 7, pieces: ["(int)", "{{}}"], x: 320, y: 340, width: 91.4140625 },
  {
    id: 8,
    pieces: ["{{}}", "?", "{{}}", ":", "{{}}"],
    x: 320,
    y: 395,
    width: 92.01171875,
  },
  { id: 9, pieces: ["{{}}", ".length"], x: 320, y: 450, width: 120.21875 },
  { id: 10, pieces: ["{{}}", ".length()"], x: 320, y: 505, width: 149.0234375 },
  {
    id: 11,
    pieces: ["{{}}", ".append(", "{{}}", ")"],
    x: 320,
    y: 560,
    width: 173.42578125,
  },
];
const initialEdges = [
  { id: 1, parentNodeId: 4, parentPieceId: 1, childNodeId: 1, type: "" },
  { id: 2, parentNodeId: 5, parentPieceId: 0, childNodeId: 4, type: "" },
  { id: 3, parentNodeId: 5, parentPieceId: 2, childNodeId: 2, type: "" },
  { id: 4, parentNodeId: 8, parentPieceId: 0, childNodeId: 5, type: "" },
  { id: 5, parentNodeId: 8, parentPieceId: 2, childNodeId: 10, type: "" },
  { id: 6, parentNodeId: 10, parentPieceId: 0, childNodeId: 3, type: "" },
];

const initialState = {
  nodes: initialNodes,
  edges: initialEdges,
  dragEdge: null,
  selectedNode: null,
  selectedEdge: null,
  selectedRootNode: null,
};

const treeEditorReducer = (state = initialState, action) => {
  function maxNodeId() {
    return state.nodes
      .map(n => n.id)
      .reduce((id1, id2) => Math.max(id1, id2), 1);
  }

  function maxEdgeId() {
    return state.edges
      .map(e => e.id)
      .reduce((id1, id2) => Math.max(id1, id2), 1);
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
            x: action.payload.x,
            y: action.payload.y,
            width: action.payload.width,
          },
        ],
      };

    case "removeNode":
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload.nodeId),
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
        nodes: state.nodes.map(node =>
          node.id === action.payload.nodeId
            ? {
                ...node,
                x: action.payload.x,
                y: action.payload.y,
              }
            : node
        ),
      };

    case "moveNodeToEnd":
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.nodeId
            ? {
                ...node,
                x: action.payload.x,
                y: action.payload.y,
              }
            : node
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
                width: action.payload.width,
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
        ...initialState,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
      };
    case "selectRootNode":
      return {
        ...state,
        selectedRootNode: action.payload.selectedRootNode,
      };
    case "clearRootSelection":
      return {
        ...state,
        selectedRootNode: null,
      };

    default:
      return state;
  }
};

const undoableTreeEditorReducer = undoable(treeEditorReducer, {
  filter: function filterActions(action) {
    return (
      action.type !== "clearNodeSelection" &&
      action.type !== "clearEdgeSelection" &&
      action.type !== "selectNode" &&
      action.type !== "selectEdge" &&
      action.type !== "setDragEdge" &&
      action.type !== "clearDragEdge" &&
      action.type !== "moveDragEdgeChildEndTo" &&
      action.type !== "moveDragEdgeParentEndTo" &&
      action.type !== "moveNodeTo"
    );
  },
});

export default undoableTreeEditorReducer;
