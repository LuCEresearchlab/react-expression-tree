import {
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
    } = payload;

    const { expressionTreeEditor } = state;
    const { nodes } = expressionTreeEditor;

    const addingNodeId = maxNodeId(nodes) + 1;
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

    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: [...nodes, addingNode],
      },
    };
  },

  // Remove the selected node from the array of nodes,
  // remove all the edges connected to the removing node,
  // if the removing node is the selected root node,
  // clear the root node selection
  removeNode: (state, payload) => {
    const {
      nodeId,
    } = payload;

    const { expressionTreeEditor } = state;
    const { nodes, edges, selectedRootNode } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: nodes.filter((node) => node.id !== nodeId),
        edges: edges.filter(
          (edge) => edge.parentNodeId !== nodeId
            && edge.childNodeId !== nodeId,
        ),
        selectedRootNode:
          selectedRootNode
          && selectedRootNode.id === nodeId
            ? null
            : selectedRootNode,
      },
    };
  },

  // Select the selecting node
  selectNode: (state, payload) => {
    const {
      selectedNode,
    } = payload;

    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        selectedNode,
      },
    };
  },

  // Clear the node selection
  clearNodeSelection: (state) => {
    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        selectedNode: null,
      },
    };
  },

  // Select the selecting root node
  selectRootNode: (state, payload) => {
    const {
      selectedRootNode,
    } = payload;

    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        selectedRootNode,
      },
    };
  },

  // Clear the root node selection
  clearRootSelection: (state, payload) => {
    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        selectedRootNode: null,
      },
    };
  },

  // Move the selected node to the event coordinates
  moveNodeTo: (state, payload) => {
    const {
      nodeId,
      x,
      y,
    } = payload;

    const { expressionTreeEditor } = state;
    const { nodes } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: nodes.map((node) => (node.id === nodeId
          ? {
            ...node,
            x,
            y,
          }
          : node)),
      },
    };
  },

  // Move the selected node to the final event coordinates,
  // (different action to be able to filter all the previous
  // moving actions to allow undo/redo working)
  moveNodeToEnd: (state, payload) => {
    const {
      nodeId,
      x,
      y,
    } = payload;

    const { expressionTreeEditor } = state;
    const { nodes } = expressionTreeEditor;

    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: nodes.map((node) => (node.id === nodeId
          ? {
            ...node,
            x,
            y,
          }
          : node)),
      },
    };
  },

  // Add the new edge to the array of edges
  addEdge: (state, payload) => {
    const {
      edge,
    } = payload;

    const { expressionTreeEditor } = state;
    const { edges } = expressionTreeEditor;

    const addingEdgeId = maxEdgeId(edges) + 1;
    const addingEdge = { ...edge, id: addingEdgeId };

    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        edges: [...edges, addingEdge],
      },
    };
  },

  // Remove the selected edge from the array of edges
  removeEdge: (state, payload) => {
    const {
      edgeId,
    } = payload;

    const { expressionTreeEditor } = state;
    const { edges } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        edges: edges.filter((edge) => edge.id !== edgeId),
      },
    };
  },

  // Update the selected edge to the new node/hole connector
  updateEdge: (state, payload) => {
    const {
      newEdge,
      edgeId,
    } = payload;

    const { expressionTreeEditor } = state;
    const { edges } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        edges: [
          ...edges.filter((edge) => edge.id !== edgeId),
          newEdge,
        ],
      },
    };
  },

  // Select the selecting edge
  selectEdge: (state, payload) => {
    const {
      selectedEdge,
    } = payload;

    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        selectedEdge,
      },
    };
  },

  // Clear the edge selection
  clearEdgeSelection: (state) => {
    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        selectedEdge: null,
      },
    };
  },

  // Set up the DragEdge
  setDragEdge: (state, payload) => {
    const { dragEdge } = payload;

    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        dragEdge,
      },
    };
  },

  // Clear the DragEdge
  clearDragEdge: (state) => {
    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        dragEdge: null,
      },
    };
  },

  // Update the DragEdge hole end to the event coordinates
  moveDragEdgeParentEndTo: (state, payload) => {
    const {
      x,
      y,
    } = payload;

    const { expressionTreeEditor } = state;
    const { dragEdge } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        dragEdge: {
          ...dragEdge,
          parentX: x,
          parentY: y,
        },
      },
    };
  },

  // Update the DragEdge node end to the event coordinates
  moveDragEdgeChildEndTo: (state, payload) => {
    const {
      x,
      y,
    } = payload;

    const { expressionTreeEditor } = state;
    const { dragEdge } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        dragEdge: {
          ...dragEdge,
          childX: x,
          childY: y,
        },
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
    } = payload;

    const { expressionTreeEditor } = state;
    const { nodes, edges, selectedNode } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: nodes.map((node) => (node.id === selectedNodeId
          ? {
            ...node,
            pieces,
            width,
          }
          : node)),
        edges: edges.filter(
          (edge) => edge.parentNodeId !== selectedNodeId,
        ),
        selectedNode: {
          ...selectedNode,
          pieces,
          width,
        },
      },
    };
  },

  // Edit the selected node type, if the selected node is the selected root node,
  // update the selected root node type too
  nodeTypeEdit: (state, payload) => {
    const {
      type,
      selectedNodeId,
    } = payload;

    const { expressionTreeEditor } = state;
    const { nodes, selectedNode, selectedRootNode } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: nodes.map((node) => (node.id === selectedNodeId
          ? {
            ...node,
            type,
          }
          : node)),
        selectedNode: {
          ...selectedNode,
          type,
        },
        selectedRootNode:
          selectedRootNode
          && selectedNodeId === selectedRootNode.id
            ? { ...selectedRootNode, type }
            : selectedRootNode,
      },
    };
  },

  // Edit the selected node value, if the selected node is the selected root node,
  // update the selected root node value too
  nodeValueEdit: (state, payload) => {
    const {
      value,
      selectedNodeId,
    } = payload;

    const { expressionTreeEditor } = state;
    const { nodes, selectedNode, selectedRootNode } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: nodes.map((node) => (node.id === selectedNodeId
          ? {
            ...node,
            value,
          }
          : node)),
        selectedNode: {
          ...selectedNode,
          value,
        },
        selectedRootNode:
          selectedRootNode
          && selectedNodeId === selectedRootNode.id
            ? { ...selectedRootNode, value }
            : selectedRootNode,
      },
    };
  },

  // Reset the editor state to the initial state
  stageReset: (state, payload) => {
    const {
      initialEdges,
      initialNodes,
    } = payload;

    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: initialNodes,
        edges: initialEdges,
        dragEdge: null,
        selectedNode: null,
        selectedEdge: null,
        selectedRootNode: null,
      },
    };
  },

  // Set the editor state to a previously downloaded editor state
  uploadState: (state, payload) => {
    const {
      nodes,
      edges,
      selectedRootNode,
    } = payload;

    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes,
        edges,
        selectedNode: null,
        selectedEdge: null,
        dragEdge: null,
        selectedRootNode,
      },
    };
  },

  // Set the editor state to the initial state passed using the initialState prop
  setInitialState: (state, payload) => {
    const {
      initialNodes,
      initialEdges,
    } = payload;

    const { expressionTreeEditor } = state;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: initialNodes,
        edges: initialEdges,
      },
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

    const { expressionTreeEditor } = state;
    const { nodes, selectedRootNode } = expressionTreeEditor;

    const nodesPerRow = isDrawerOpen ? 8 : 10;
    const initialX = isDrawerOpen
      ? drawerWidth + 20
      : 20;
    let unconnectedCurrentX = initialX;
    let unconnectedCount = -1;
    let newNodes = [];
    const visitedNodes = [];
    let currentLevelX = selectedRootNode
      ? [reorderStartingX - selectedRootNode.width / 2]
      : [];
    let levelIndex = 0;
    const currentY = textHeight * 4;
    if (selectedRootNode) {
      [newNodes, currentLevelX] = orderWalk(
        expressionTreeEditor,
        selectedRootNode,
        connectorPlaceholder,
        newNodes,
        visitedNodes,
        currentLevelX,
        currentY,
        levelIndex,
        textHeight,
      );
    }

    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: nodes.map((node) => {
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
      },
    };
  },

  // Move the multiple nodes selection to the event coordinates
  moveSelectedNodesTo: (state, payload) => {
    const {
      nodes,
      delta,
    } = payload;

    const { expressionTreeEditor } = state;
    const { nodes: previousNodesState } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: previousNodesState.map((node) => {
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
      },
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

    const { expressionTreeEditor } = state;
    const { nodes: previousNodesState } = expressionTreeEditor;
    return {
      ...state,
      expressionTreeEditor: {
        ...expressionTreeEditor,
        nodes: previousNodesState.map((node) => {
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
      },
    };
  },
};

export default reducers;
