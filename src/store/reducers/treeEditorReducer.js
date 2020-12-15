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
  // Function that computes the last occupied node id
  function maxNodeId() {
    return state.nodes
      .map(n => n.id)
      .reduce((id1, id2) => Math.max(id1, id2), 0);
  }

  // Function that computes the last occupied edge id
  function maxEdgeId() {
    return state.edges
      .map(e => e.id)
      .reduce((id1, id2) => Math.max(id1, id2), 0);
  }

  // Ordered tree walk function used to traverse the tree starting at the selected root node,
  // in order to reorder the child nodes connected to the root node in a tree shape
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
    // Add the new node to the array of nodes
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
      // Remove the selected node from the array of nodes,
      // remove all the edges connected to the removing node,
      // if the removing node is the selected root node,
      // clear the root node selection
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
      // Select the selecting node
      action.payload.onNodeSelect &&
        action.payload.onNodeSelect(action.payload.selectedNode);
      return {
        ...state,
        selectedNode: action.payload.selectedNode,
      };

    case "clearNodeSelection":
      // Clear the node selection
      return {
        ...state,
        selectedNode: null,
      };

    // Select the selecting root node
    case "selectRootNode":
      return {
        ...state,
        selectedRootNode: action.payload.selectedRootNode,
      };

    // Clear the root node selection
    case "clearRootSelection":
      return {
        ...state,
        selectedRootNode: null,
      };

    case "moveNodeTo":
      // Move the selected node to the event coordinates
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

    // Move the selected node to the final event coordinates,
    // (different action to be able to filter all the previous
    // moving actions to allow undo/redo working)
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

    // Add the new edge to the array of edges
    case "addEdge":
      const addingEdgeId = maxEdgeId() + 1;
      const addingEdge = { ...action.payload.edge, id: addingEdgeId };
      action.payload.onEdgeAdd && action.payload.onEdgeAdd(addingEdge);
      return {
        ...state,
        edges: [...state.edges, addingEdge],
      };

    // Remove the selected edge from the array of edges
    case "removeEdge":
      action.payload.onEdgeDelete &&
        action.payload.onEdgeDelete(action.payload.edgeId);
      return {
        ...state,
        edges: state.edges.filter(edge => edge.id !== action.payload.edgeId),
      };

    // Update the selected edge to the new node/hole connector
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

    // Select the selecting edge
    case "selectEdge":
      action.payload.onEdgeSelect &&
        action.payload.onEdgeSelect(action.payload.selectedEdge);
      return {
        ...state,
        selectedEdge: action.payload.selectedEdge,
      };

    // Clear the edge selection
    case "clearEdgeSelection":
      return {
        ...state,
        selectedEdge: null,
      };

    // Set up the DragEdge
    case "setDragEdge":
      return {
        ...state,
        dragEdge: action.payload.dragEdge,
      };

    // Clear the DragEdge
    case "clearDragEdge":
      return {
        ...state,
        dragEdge: null,
      };

    // Update the DragEdge hole end to the event coordinates
    case "moveDragEdgeParentEndTo":
      return {
        ...state,
        dragEdge: {
          ...state.dragEdge,
          parentX: action.payload.x,
          parentY: action.payload.y,
        },
      };

    // Update the DragEdge node end to the event coordinates
    case "moveDragEdgeChildEndTo":
      return {
        ...state,
        dragEdge: {
          ...state.dragEdge,
          childX: action.payload.x,
          childY: action.payload.y,
        },
      };

    // Edit the selected node pieces, remove all the edges
    // that are connected to a hole connector of the selected node
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

    // Edit the selected node type, if the selected node is the selected root node,
    // update the selected root node type too
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

    // Edit the selected node value, if the selected node is the selected root node,
    // update the selected root node value too
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

    // Reset the editor state to the initial state
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

    // Set the editor state to a previously downloaded editor state
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

    // Set the editor state to the initial state passed using the initialState prop
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

    // Reorder the nodes as a tree using the selected root node
    // as starting node for the orderWalk function,
    // all the other nodes will be reordered as a compact rectangle
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
      var currentY = action.payload.textHeight * 4;
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
                action.payload.textHeight * 4 +
                (currentLevelX.length +
                  Math.floor(unconnectedCount / nodesPerRow)) *
                  (action.payload.textHeight * 4),
            };
          }
        }),
      };

    // Move the multiple nodes selection to the event coordinates
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

    // Move the multiple nodes selection to the final event coordinates,
    // (different action to be able to filter all the previous
    // moving actions to allow undo/redo working)
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

// Set up actions filtering and grouping for undo/redo features
const undoableTreeEditorReducer = undoable(treeEditorReducer, {
  // Filtered actions (these don't count in the undo/redo history)
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
  // Grouped actions (multiple following actions of the same type
  // will result as a single undo/redo action)
  groupBy: groupByActionTypes("reorderNodes"),
});

export default undoableTreeEditorReducer;
