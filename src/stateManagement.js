// Initial state
const initialNodes = [
  { id: 0, pieces: ["19"] },
  { id: 1, pieces: ["age"] },
  { id: 2, pieces: ['"Hello World!"'] },
  { id: 3, pieces: ["-", null] },
  { id: 4, pieces: [null, "<", null] },
  { id: 5, pieces: [null, "+", null] },
  { id: 6, pieces: ["(int)", null] },
  { id: 7, pieces: [null, "?", null, ":", null] },
  { id: 8, pieces: [null, ".", "length"] },
  { id: 9, pieces: [null, ".", "length()"] },
  { id: 10, pieces: [null, ".", "append(", null, ")"] },
];
const initialEdges = [
  { id: 0, parentNodeId: 3, parentPieceId: 1, childNodeId: 0 },
  { id: 1, parentNodeId: 4, parentPieceId: 0, childNodeId: 3 },
  { id: 2, parentNodeId: 4, parentPieceId: 2, childNodeId: 1 },
  { id: 3, parentNodeId: 7, parentPieceId: 0, childNodeId: 4 },
  { id: 4, parentNodeId: 7, parentPieceId: 2, childNodeId: 9 },
  { id: 5, parentNodeId: 9, parentPieceId: 0, childNodeId: 2 },
];

const initialNodePositions = initialNodes.map((node, i) => ({
  id: node.id,
  x: 250,
  y: 80 + i * 55,
}));

export function getInitialDemoState() {
  return {
    nodes: initialNodes,
    edges: initialEdges,
    nodePositions: initialNodePositions,
    dragEdge: null,
    selectedNodeId: null,
  };
}

// Lookup functions
export function nodeById(state, nodeId) {
  if (nodeId === undefined || nodeId === null) {
    throw new Error("Illegal nodeId", nodeId);
  }
  const node = state.nodes.find(node => node.id === nodeId);
  if (!node) {
    throw new Error("Unknown nodeId", nodeId);
  }
  return node;
}

export function edgeById(state, edgeId) {
  if (edgeId === undefined || edgeId === null) {
    throw new Error("Illegal edgeId", edgeId);
  }
  const edge = state.edges.find(edge => edge.id === edgeId);
  if (!edge) {
    throw new Error("Unknown edgeId", edgeId);
  }
  return edge;
}

//TODO: what if we have multiple edges to a child node?
export function edgeByChildNode(state, childNodeId) {
  return state.edges.find(edge => edge.childNodeId === childNodeId);
}

//TODO: what if we have multiple edges from a parent piece?
export function edgeByParentPiece(state, parentNodeId, parentPieceId) {
  return state.edges.find(
    edge =>
      edge.parentNodeId === parentNodeId && edge.parentPieceId === parentPieceId
  );
}

export function nodePositionById(state, nodeId) {
  return state.nodePositions.find(nodePosition => nodePosition.id === nodeId);
}

export function loggingReducer(state, action) {
  console.group(action.type);
  console.log("%cState before:", "color: #ff0000;", state);
  console.log("%cAction:", "color: #00ff00;", action);
  const stateAfter = reducer(state, action);
  console.log("%cState after:", "color: #0000ff;", stateAfter);
  console.groupEnd();
  return stateAfter;
}
// reducer
export default function reducer(state, action) {
  //console.log("reducer(", state, action, ")");
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
        selectedNodeId: id,
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
        selectedNodeId:
          state.selectedNodeId === action.payload.nodeId
            ? null
            : state.selectedNodeId,
      };

    case "selectNode":
      return {
        ...state,
        selectedNodeId: action.payload.nodeId,
      };

    case "clearNodeSelection":
      return {
        ...state,
        selectedNodeId: null,
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
        selectedNodeId: action.payload.nodeId,
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

    default:
      throw new Error();
  }
}
