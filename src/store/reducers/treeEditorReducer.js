import {
  exportState,
  maxNodeId,
  maxEdgeId,
  orderWalk,
} from '../../utils/state';

const reducers = {
  // Add the new node to the array of nodes
  addNode: (state, payload) => {
    const {
      pieces,
      x,
      y,
      width,
      type,
      value,
      isFinal,
      onNodeAdd,
      onStateChange,
    } = payload;

    const addingNodeId = maxNodeId(state) + 1;
    const addingNode = {
      id: addingNodeId,
      pieces,
      x,
      y,
      width,
      type,
      value,
      isFinal,
    };

    if (onNodeAdd) onNodeAdd(addingNode);

    const newState = {
      ...state,
      nodes: [...state.nodes, addingNode],
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Remove the selected node from the array of nodes,
  // remove all the edges connected to the removing node,
  // if the removing node is the selected root node,
  // clear the root node selection
  removeNode: (state, payload) => {
    const {
      nodeId,
      onNodeDelete,
      onStateChange,
    } = payload;

    if (onNodeDelete) onNodeDelete(nodeId);
    const newState = {
      ...state,
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.parentNodeId !== nodeId
          && edge.childNodeId !== nodeId,
      ),
      selectedRootNode:
        state.selectedRootNode
        && state.selectedRootNode.id === nodeId
          ? null
          : state.selectedRootNode,
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Select the selecting node
  selectNode: (state, payload) => {
    const {
      selectedNode,
      onNodeSelect,
    } = payload;

    if (onNodeSelect) onNodeSelect(selectedNode);
    return {
      ...state,
      selectedNode,
    };
  },

  // Clear the node selection
  clearNodeSelection: (state) => {
    return {
      ...state,
      selectedNode: null,
    };
  },

  // Select the selecting root node
  selectRootNode: (state, payload) => {
    const {
      selectedRootNode,
      onStateChange,
    } = payload;

    const newState = {
      ...state,
      selectedRootNode,
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Clear the root node selection
  clearRootSelection: (state, payload) => {
    const {
      onStateChange,
    } = payload;

    const newState = {
      ...state,
      selectedRootNode: null,
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Move the selected node to the event coordinates
  moveNodeTo: (state, payload) => {
    const {
      nodeId,
      x,
      y,
    } = payload;

    const newState = {
      ...state,
      nodes: state.nodes.map((node) => (node.id === nodeId
        ? {
          ...node,
          x,
          y,
        }
        : node)),
    };

    // if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Move the selected node to the final event coordinates,
  // (different action to be able to filter all the previous
  // moving actions to allow undo/redo working)
  moveNodeToEnd: (state, payload) => {
    const {
      nodeId,
      x,
      y,
      onNodeMove,
      onStateChange,
    } = payload;

    if (onNodeMove) onNodeMove(nodeId, { x, y });
    const newState = {
      ...state,
      nodes: state.nodes.map((node) => (node.id === nodeId
        ? {
          ...node,
          x,
          y,
        }
        : node)),
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Add the new edge to the array of edges
  addEdge: (state, payload) => {
    const {
      edge,
      onEdgeAdd,
      onStateChange,
    } = payload;

    const addingEdgeId = maxEdgeId(state) + 1;
    const addingEdge = { ...edge, id: addingEdgeId };
    if (onEdgeAdd) onEdgeAdd(addingEdge);
    const newState = {
      ...state,
      edges: [...state.edges, addingEdge],
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Remove the selected edge from the array of edges
  removeEdge: (state, payload) => {
    const {
      edgeId,
      onEdgeDelete,
      onStateChange,
    } = payload;

    if (onEdgeDelete) onEdgeDelete(edgeId);
    const newState = {
      ...state,
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Update the selected edge to the new node/hole connector
  updateEdge: (state, payload) => {
    const {
      newEdge,
      edgeId,
      onEdgeUpdate,
      onStateChange,
    } = payload;

    if (onEdgeUpdate) onEdgeUpdate(newEdge);
    const newState = {
      ...state,
      edges: [
        ...state.edges.filter((edge) => edge.id !== edgeId),
        newEdge,
      ],
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Select the selecting edge
  selectEdge: (state, payload) => {
    const {
      selectedEdge,
      onEdgeSelect,
    } = payload;

    if (onEdgeSelect) onEdgeSelect(selectedEdge);
    return {
      ...state,
      selectedEdge,
    };
  },

  // Clear the edge selection
  clearEdgeSelection: (state) => {
    return {
      ...state,
      selectedEdge: null,
    };
  },

  // Set up the DragEdge
  setDragEdge: (state, payload) => {
    const { dragEdge } = payload;

    return {
      ...state,
      dragEdge,
    };
  },

  // Clear the DragEdge
  clearDragEdge: (state) => {
    return {
      ...state,
      dragEdge: null,
    };
  },

  // Update the DragEdge hole end to the event coordinates
  moveDragEdgeParentEndTo: (state, payload) => {
    const {
      x,
      y,
    } = payload;

    return {
      ...state,
      dragEdge: {
        ...state.dragEdge,
        parentX: x,
        parentY: y,
      },
    };
  },

  // Update the DragEdge node end to the event coordinates
  moveDragEdgeChildEndTo: (state, payload) => {
    const {
      x,
      y,
    } = payload;

    return {
      ...state,
      dragEdge: {
        ...state.dragEdge,
        childX: x,
        childY: y,
      },
    };
  },

  // Edit the selected node pieces, remove all the edges
  // that are connected to a hole connector of the selected node
  editNode: (state, payload) => {
    const {
      pieces,
      selectedNodeId,
      width,
      onNodePiecesChange,
      onStateChange,
    } = payload;

    if (onNodePiecesChange) onNodePiecesChange(pieces);
    const newState = {
      ...state,
      nodes: state.nodes.map((node) => (node.id === selectedNodeId
        ? {
          ...node,
          pieces,
          width,
        }
        : node)),
      edges: state.edges.filter(
        (edge) => edge.parentNodeId !== selectedNodeId,
      ),
      selectedNode: {
        ...state.selectedNode,
        pieces,
        width,
      },
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Edit the selected node type, if the selected node is the selected root node,
  // update the selected root node type too
  nodeTypeEdit: (state, payload) => {
    const {
      type,
      selectedNodeId,
      onNodeTypeChange,
      onStateChange,
    } = payload;

    if (onNodeTypeChange) onNodeTypeChange(type);
    const newState = {
      ...state,
      nodes: state.nodes.map((node) => (node.id === selectedNodeId
        ? {
          ...node,
          type,
        }
        : node)),
      selectedNode: {
        ...state.selectedNode,
        type,
      },
      selectedRootNode:
        state.selectedRootNode
        && selectedNodeId === state.selectedRootNode.id
          ? { ...state.selectedRootNode, type }
          : state.selectedRootNode,
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Edit the selected node value, if the selected node is the selected root node,
  // update the selected root node value too
  nodeValueEdit: (state, payload) => {
    const {
      value,
      selectedNodeId,
      onNodeValueChange,
      onStateChange,
    } = payload;

    if (onNodeValueChange) onNodeValueChange(value);
    const newState = {
      ...state,
      nodes: state.nodes.map((node) => (node.id === selectedNodeId
        ? {
          ...node,
          value,
        }
        : node)),
      selectedNode: {
        ...state.selectedNode,
        value,
      },
      selectedRootNode:
        state.selectedRootNode
        && selectedNodeId === state.selectedRootNode.id
          ? { ...state.selectedRootNode, value }
          : state.selectedRootNode,
    };

    if (onStateChange) onStateChange(exportState(newState));
    return newState;
  },

  // Reset the editor state to the initial state
  stageReset: (state, payload) => {
    const {
      initialEdges,
      initialNodes,
    } = payload;

    return {
      ...state,
      nodes: initialNodes,
      edges: initialEdges,
      dragEdge: null,
      selectedNode: null,
      selectedEdge: null,
      selectedRootNode: null,
    };
  },

  // Set the editor state to a previously downloaded editor state
  uploadState: (state, payload) => {
    const {
      nodes,
      edges,
      selectedRootNode,
    } = payload;

    return {
      ...state,
      nodes,
      edges,
      selectedNode: null,
      selectedEdge: null,
      dragEdge: null,
      selectedRootNode,
    };
  },

  // Set the editor state to the initial state passed using the initialState prop
  setInitialState: (state, payload) => {
    const {
      initialNodes,
      initialEdges,
    } = payload;

    return {
      ...state,
      nodes: initialNodes,
      edges: initialEdges,
    };
  },

  // Reorder the nodes as a tree using the selected root node
  // as starting node for the orderWalk function,
  // all the other nodes will be reordered as a compact rectangle
  reorderNodes: (state, payload) => {
    const {
      isDrawerOpen,
      drawerWidth,
      reorderStartingX,
      textHeight,
      connectorPlaceholder,
    } = payload;

    const nodesPerRow = isDrawerOpen ? 8 : 10;
    const initialX = isDrawerOpen
      ? drawerWidth + 20
      : 20;
    let unconnectedCurrentX = initialX;
    let unconnectedCount = -1;
    let newNodes = [];
    const visitedNodes = [];
    let currentLevelX = state.selectedRootNode
      ? [reorderStartingX - state.selectedRootNode.width / 2]
      : [];
    let levelIndex = 0;
    const currentY = textHeight * 4;
    if (state.selectedRootNode) {
      [newNodes, currentLevelX] = orderWalk(
        state,
        state.selectedRootNode,
        connectorPlaceholder,
        newNodes,
        visitedNodes,
        currentLevelX,
        currentY,
        levelIndex,
        textHeight,
      );
    }
    
    const newState = {
      ...state,
      nodes: state.nodes.map((node) => {
        const newNode = newNodes.find((newNode) => node.id === newNode.id);
        if (newNode !== undefined) {
          return {
            ...node,
            x: newNode.x,
            y: newNode.y,
          };
        }
        unconnectedCount++;
        if (unconnectedCount % nodesPerRow === 0) {
          unconnectedCurrentX = initialX;
        }
        const tmpX = unconnectedCurrentX;
        unconnectedCurrentX += node.width + 10;
        return {
          ...node,
          x: tmpX,
          y:
              textHeight * 4
              + (currentLevelX.length
                + Math.floor(unconnectedCount / nodesPerRow))
                * (textHeight * 4),
        };
      }),
    };

    return newState;
  },

  // Move the multiple nodes selection to the event coordinates
  moveSelectedNodesTo: (state, payload) => {
    const {
      nodes,
      delta,
    } = payload;

    return {
      ...state,
      nodes: state.nodes.map((node) => {
        const foundNode = nodes.find(
          (payloadNode) => payloadNode.attrs.id === node.id,
        );
        if (foundNode !== undefined) {
          return {
            ...node,
            x: node.x + delta.x,
            y: node.y + delta.y,
          };
        }
        return { ...node };
      }),
    };
  },

  // Move the multiple nodes selection to the final event coordinates,
  // (different action to be able to filter all the previous
  // moving actions to allow undo/redo working)
  moveSelectedNodesToEnd: (state, payload) => {
    const {
      nodes,
      delta,
    } = payload;

    return {
      ...state,
      nodes: state.nodes.map((node) => {
        const foundNode = nodes.find(
          (payloadNode) => payloadNode.attrs.id === node.id,
        );
        if (foundNode !== undefined) {
          return {
            ...node,
            x: node.x + delta.x,
            y: node.y + delta.y,
          };
        }
        return { ...node };
      }),
    };
  },
};

export default reducers;
