import undoable, { groupByActionTypes } from "redux-undo";
import { edgeByParentPiece, nodeById } from "../../utils.js";

const initialState = {
  nodes: [],
  edges: [],
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

  function orderWalk(node, connectorPlaceholder, newNodes, currentX, currentY) {
    newNodes.push({ id: node.id, x: currentX, y: currentY });
    currentY = currentY + 70;
    node.pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        const edges = edgeByParentPiece(node.id, i, state.edges);
        edges.forEach(edge => {
          const childNode = nodeById(edge.childNodeId, state.nodes);
          orderWalk(
            childNode,
            connectorPlaceholder,
            newNodes,
            currentX,
            currentY
          );
        });
      }
      currentX = currentX + node.width + 20;
    });
    return newNodes;
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
        selectedRootNode:
          state.selectedRootNode !== null &&
          state.selectedRootNode.id === action.payload.nodeId
            ? null
            : state.selectedRootNode,
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

    case "updateEdge":
      return {
        ...state,
        edges: [
          ...state.edges.filter(edge => edge.id !== action.payload.edgeId),
          {
            ...action.payload.newEdge,
            id: maxEdgeId() + 1,
          },
        ],
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
        edges: state.edges.filter(
          edge => edge.parentNodeId !== action.payload.selectedNodeId
        ),
        selectedNode: {
          ...state.selectedNode,
          pieces: action.payload.pieces,
          width: action.payload.width,
        },
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
        selectedEdge: {
          ...state.selectedEdge,
          type: action.payload.type,
        },
      };
    case "stageReset":
      return {
        ...state,
        nodes: action.payload.initialNodes,
        edges: action.payload.initialEdges,
        dragEdge: null,
        selectedNode: null,
        selectedEdge: null,
        selectedRootNode: null,
      };
    case "uploadState":
      return {
        ...state,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
        selectedNode: action.payload.selectedNode,
        selectedEdge: action.payload.selectedEdge,
        selectedRootNode: action.payload.selectedRootNode,
        dragEdge: null,
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
    case "setInitialState":
      return {
        ...state,
        nodes: action.payload.initialNodes,
        edges: action.payload.initialEdges,
      };
    case "reorderNodes":
      var newNodes = [];
      var unconnectedToRoot = -1;
      var currentX = 600;
      var currentY = 40;
      if (state.selectedRootNode !== null) {
        newNodes = orderWalk(
          state.selectedRootNode,
          action.payload.connectorPlaceholder,
          newNodes,
          currentX,
          currentY
        );
      }
      return {
        ...state,
        nodes: state.nodes.map((node, i) => {
          const newNode = newNodes.find(newNode => node.id === newNode.id);
          if (newNode !== undefined) {
            return {
              ...node,
              x: newNode.x,
              y: newNode.y,
            };
          } else {
            unconnectedToRoot++;
            return {
              ...node,
              x: 320,
              y: 40 + unconnectedToRoot * 55,
            };
          }
        }),
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
      action.type !== "moveNodeTo" &&
      action.type !== "addValueChange" &&
      action.type !== "editValueChange" &&
      action.type !== "typeValueChange" &&
      action.type !== "clearAdding" &&
      action.type !== "addingNodeClick" &&
      action.type !== "setInitialState"
    );
  },
  groupBy: groupByActionTypes("reorderNodes"),
});

export default undoableTreeEditorReducer;
