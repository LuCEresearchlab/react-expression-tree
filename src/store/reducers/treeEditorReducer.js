import undoable, { groupByActionTypes } from "redux-undo";
import { computeNodeWidth, edgeByParentPiece, nodeById } from "../../utils.js";

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
      .reduce((id1, id2) => Math.max(id1, id2), 0);
  }

  function maxEdgeId() {
    return state.edges
      .map(e => e.id)
      .reduce((id1, id2) => Math.max(id1, id2), 0);
  }

  function orderWalk(
    node,
    connectorPlaceholder,
    newNodes,
    visitedNodes,
    currentLevelX,
    currentY,
    levelIndex,
    textHeight
  ) {
    if (currentLevelX[levelIndex] === undefined) {
      currentLevelX[levelIndex] = currentLevelX[levelIndex - 1] - 50;
    }
    newNodes.push({
      id: node.id,
      x: currentLevelX[levelIndex],
      y: currentY,
    });
    visitedNodes.push(node.id);
    currentY = currentY + textHeight * 4;
    node.pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        const edges = edgeByParentPiece(node.id, i, state.edges);
        edges.forEach(edge => {
          const childNode = nodeById(edge.childNodeId, state.nodes);
          if (visitedNodes.find(e => e === childNode.id) === undefined) {
            [newNodes, currentLevelX] = orderWalk(
              childNode,
              connectorPlaceholder,
              newNodes,
              visitedNodes,
              currentLevelX,
              currentY,
              levelIndex + 1,
              textHeight
            );
          } else {
            return;
          }
        });
      }
    });
    currentLevelX[levelIndex] += node.width + 40;
    return [newNodes, currentLevelX];
  }

  switch (action.type) {
    case "addNode":
      const addingNodeId = maxNodeId() + 1;
      const addingNode = {
        id: addingNodeId,
        pieces: action.payload.pieces,
        x: action.payload.x,
        y: action.payload.y,
        width: action.payload.width,
        type: action.payload.type,
        value: action.payload.value,
        isFinal: action.payload.isFinal,
      };
      action.payload.onNodeAdd && action.payload.onNodeAdd(addingNode);
      return {
        ...state,
        nodes: [...state.nodes, addingNode],
      };

    case "removeNode":
      action.payload.onNodeDelete &&
        action.payload.onNodeDelete(action.payload.nodeId);
      return {
        ...state,
        nodes: state.nodes.filter(node => node.id !== action.payload.nodeId),
        edges: state.edges.filter(
          edge =>
            edge.parentNodeId !== action.payload.nodeId &&
            edge.childNodeId !== action.payload.nodeId
        ),
        selectedRootNode:
          state.selectedRootNode &&
          state.selectedRootNode.id === action.payload.nodeId
            ? null
            : state.selectedRootNode,
      };

    case "selectNode":
      action.payload.onNodeSelect &&
        action.payload.onNodeSelect(action.payload.selectedNode);
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
      const addingEdgeId = maxEdgeId() + 1;
      const addingEdge = { ...action.payload.edge, id: addingEdgeId };
      action.payload.onEdgeAdd && action.payload.onEdgeAdd(addingEdge);
      return {
        ...state,
        edges: [...state.edges, addingEdge],
      };

    case "removeEdge":
      action.payload.onEdgeDelete &&
        action.payload.onEdgeDelete(action.payload.edgeId);
      return {
        ...state,
        edges: state.edges.filter(edge => edge.id !== action.payload.edgeId),
      };

    case "updateEdge":
      action.payload.onEdgeUpdate &&
        action.payload.onEdgeUpdate(action.payload.newEdge);
      return {
        ...state,
        edges: [
          ...state.edges.filter(edge => edge.id !== action.payload.edgeId),
          action.payload.newEdge,
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
      action.payload.onNodePiecesChange &&
        action.payload.onNodePiecesChange(action.payload.pieces);
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
      action.payload.onEdgeSelect &&
        action.payload.onEdgeSelect(action.payload.selectedEdge);
      return {
        ...state,
        selectedEdge: action.payload.selectedEdge,
      };

    case "clearEdgeSelection":
      return {
        ...state,
        selectedEdge: null,
      };

    case "nodeTypeEdit":
      action.payload.onNodeTypeChange &&
        action.payload.onNodeTypeChange(action.payload.type);
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.selectedNodeId
            ? {
                ...node,
                type: action.payload.type,
              }
            : node
        ),
        selectedNode: {
          ...state.selectedNode,
          type: action.payload.type,
        },
        selectedRootNode:
          state.selectedRootNode &&
          action.payload.selectedNodeId === state.selectedRootNode.id
            ? { ...state.selectedRootNode, type: action.payload.type }
            : state.selectedRootNode,
      };
    case "nodeValueEdit":
      action.payload.onNodeValueChange &&
        action.payload.onNodeValueChange(action.payload.value);
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.selectedNodeId
            ? {
                ...node,
                value: action.payload.value,
              }
            : node
        ),
        selectedNode: {
          ...state.selectedNode,
          value: action.payload.value,
        },
        selectedRootNode:
          state.selectedRootNode &&
          action.payload.selectedNodeId === state.selectedRootNode.id
            ? { ...state.selectedRootNode, value: action.payload.value }
            : state.selectedRootNode,
      };
    case "stageReset":
      action.payload.initialNodes.map((node, i) => {
        node.width = computeNodeWidth(
          node.pieces,
          action.payload.connectorPlaceholder,
          action.payload.fontSize,
          action.payload.fontFamily
        );
        node.id = i + 1;
        return node;
      });
      action.payload.initialEdges.map((edge, i) => (edge.id = i + 1));
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
        selectedNode: null,
        selectedEdge: null,
        dragEdge: null,
        selectedRootNode: action.payload.selectedRootNode,
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
      action.payload.initialNodes.map((node, i) => {
        node.width = computeNodeWidth(
          node.pieces,
          action.payload.connectorPlaceholder,
          action.payload.fontSize,
          action.payload.fontFamily
        );
        node.id = i + 1;
        return node;
      });
      action.payload.initialEdges.map((edge, i) => (edge.id = i + 1));
      return {
        ...state,
        nodes: action.payload.initialNodes,
        edges: action.payload.initialEdges,
      };
    case "reorderNodes":
      const nodesPerRow = action.payload.isDrawerOpen ? 8 : 10;
      const initialX = action.payload.isDrawerOpen
        ? action.payload.drawerWidth + 20
        : 20;
      var unconnectedCurrentX = initialX;
      var unconnectedCount = -1;
      var newNodes = [];
      var visitedNodes = [];
      var currentLevelX = state.selectedRootNode
        ? [action.payload.reorderStartingX - state.selectedRootNode.width / 2]
        : [];
      var levelIndex = 0;
      var currentY = action.payload.textHeight * 3;
      if (state.selectedRootNode) {
        [newNodes, currentLevelX] = orderWalk(
          state.selectedRootNode,
          action.payload.connectorPlaceholder,
          newNodes,
          visitedNodes,
          currentLevelX,
          currentY,
          levelIndex,
          action.payload.textHeight
        );
      }
      return {
        ...state,
        nodes: state.nodes.map(node => {
          const newNode = newNodes.find(newNode => node.id === newNode.id);
          if (newNode !== undefined) {
            return {
              ...node,
              x: newNode.x,
              y: newNode.y,
            };
          } else {
            unconnectedCount++;
            if (unconnectedCount % nodesPerRow === 0) {
              unconnectedCurrentX = initialX;
            }
            var tmpX = unconnectedCurrentX;
            unconnectedCurrentX += node.width + 10;
            return {
              ...node,
              x: tmpX,
              y:
                action.payload.textHeight * 3 +
                (currentLevelX.length +
                  Math.floor(unconnectedCount / nodesPerRow)) *
                  (action.payload.textHeight * 4),
            };
          }
        }),
      };

    case "moveSelectedNodesTo":
      return {
        ...state,
        nodes: state.nodes.map(node => {
          const foundNode = action.payload.nodes.find(
            payloadNode => payloadNode.attrs.id === node.id
          );
          if (foundNode !== undefined) {
            return {
              ...node,
              x: node.x + action.payload.delta.x,
              y: node.y + action.payload.delta.y,
            };
          } else {
            return { ...node };
          }
        }),
      };

    case "moveSelectedNodesToEnd":
      return {
        ...state,
        nodes: state.nodes.map(node => {
          const foundNode = action.payload.nodes.find(
            payloadNode => payloadNode.attrs.id === node.id
          );
          if (foundNode !== undefined) {
            return {
              ...node,
              x: node.x + action.payload.delta.x,
              y: node.y + action.payload.delta.y,
            };
          } else {
            return { ...node };
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
      action.type !== "nodeValueChange" &&
      action.type !== "clearAdding" &&
      action.type !== "addingNodeClick" &&
      action.type !== "setInitialState" &&
      action.type !== "moveSelectedNodesTo"
    );
  },
  groupBy: groupByActionTypes("reorderNodes"),
});

export default undoableTreeEditorReducer;
