/* eslint-disable arrow-body-style */
import {
  maxEdgeId,
  orderWalk,
} from '../../utils/state';
import { nodeById } from '../../utils/tree';

const reducers = {
  // Move the selected node to the event coordinates
  moveNodeTo: (state, payload) => {
    const {
      nodeId,
      x,
      y,
    } = payload;

    const { nodes } = state;
    return {
      ...state,
      nodes: nodes.map((node) => (node.id === nodeId
        ? {
          ...node,
          x,
          y,
        }
        : node)),
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

    const { nodes } = state;

    return {
      ...state,
      isDraggingNode: false,
      nodes: nodes.map((node) => (node.id === nodeId
        ? {
          ...node,
          x,
          y,
        }
        : node)),
    };
  },

  // Add the new edge to the array of edges
  addEdge: (state, payload) => {
    const {
      edge,
    } = payload;

    const { edges } = state;

    const addingEdgeId = maxEdgeId(edges) + 1;
    const addingEdge = {
      ...edge,
      id: addingEdgeId,
    };

    return {
      ...state,
      edges: [...edges, addingEdge],
      dragEdge: null,
    };
  },

  // Update the selected edge to the new node/hole connector
  updateEdge: (state, payload) => {
    const {
      newEdge,
      edgeId,
    } = payload;

    const { edges } = state;
    return {
      ...state,
      edges: [
        ...edges.filter((edge) => edge.id !== edgeId),
        newEdge,
      ],
      dragEdge: null,
    };
  },

  // Select the selecting edge
  selectEdge: (state, payload) => {
    const {
      selectedEdge,
    } = payload;

    return {
      ...state,
      selectedEdge,
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

    const { dragEdge } = state;
    return {
      ...state,
      dragEdge: {
        ...dragEdge,
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

    const { dragEdge } = state;

    return {
      ...state,
      dragEdge: {
        ...dragEdge,
        childX: x,
        childY: y,
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

    const { nodes, selectedNode, selectedRootNode } = state;
    return {
      ...state,
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
    };
  },

  // Edit the selected node value, if the selected node is the selected root node,
  // update the selected root node value too
  nodeValueEdit: (state, payload) => {
    const {
      value,
      selectedNodeId,
    } = payload;

    const { nodes, selectedNode, selectedRootNode } = state;
    return {
      ...state,
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

  // Move the multiple nodes selection to the event coordinates
  moveSelectedNodesTo: (state, payload) => {
    const {
      nodes,
      delta,
    } = payload;

    const { nodes: previousNodesState } = state;
    return {
      ...state,
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

    const { nodes: previousNodesState } = state;
    return {
      ...state,
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
    };
  },










  // Remove the selected node from the array of nodes,
  // remove all the edges connected to the removing node,
  // if the removing node is the selected root node,
  // clear the root node selection
  // Add the new node to the array of nodes
  setNodes: (state, payload) => {
    const {
      nodes,
    } = payload;

    return {
      ...state,
      nodes,
    };
  },

  setEdges: (state, payload) => {
    const {
      edges,
    } = payload;

    return {
      ...state,
      edges,
    };
  },

  createNode: (state, payload) => {
    const {
      id,
      pieces,
      x,
      y,
      width,
      type,
      value,
      isFinal,
    } = payload;

    const { nodes } = state;

    const addingNode = {
      id,
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
      nodes: [...nodes, addingNode],
      isCreatingNode: false,
    };
  },
  removeNode: (state, payload) => {
    const {
      nodeId,
    } = payload;

    const {
      nodes,
      edges,
      selectedNode,
      selectedRootNode,
      isSelectedNodeEditable,
      editLabelInputValue,
      editTypeInputValue,
      editValueInputValue,
    } = state;

    return {
      ...state,
      nodes: nodes.filter((node) => node.id !== nodeId),
      edges: edges.filter(
        (edge) => edge.parentNodeId !== nodeId
          && edge.childNodeId !== nodeId,
      ),

      isSelectedNodeEditable: selectedNode ? {
        label: false,
        type: false,
        value: false,
      } : isSelectedNodeEditable,
      editLabelInputValue: selectedNode ? '' : editLabelInputValue,
      editTypeInputValue: selectedNode ? '' : editTypeInputValue,
      editValueInputValue: selectedNode ? '' : editValueInputValue,
      selectedNode: undefined,
      selectedRootNode:
        selectedRootNode
        && selectedRootNode.id === nodeId
          ? null
          : selectedRootNode,
    };
  },

  // Remove the selected edge from the array of edges
  removeEdge: (state, payload) => {
    const {
      edgeId,
    } = payload;

    const { edges } = state;
    return {
      ...state,
      edges: edges.filter((edge) => edge.id !== edgeId),
      dragEdge: undefined,
      selectedEdge: undefined,
    };
  },

  // Reset the editor state to the initial state
  stageReset: (state, payload) => {
    const {
      nodes,
      selectedNode,
      edges,
      selectedEdge,
      selectedRootNode,
      stagePos,
      stageScale,
      connectorPlaceholder,
    } = payload;

    return {
      ...state,
      nodes,
      selectedNode,
      edges,
      selectedEdge,
      selectedRootNode,
      stagePos,
      stageScale,
      connectorPlaceholder,
      dragEdge: null,
    };
  },

  // Select the selecting node
  setSelectedNode: (state, payload) => {
    const {
      selectedNode,
    } = payload;

    const { nodes } = state;

    const node = nodeById(selectedNode, nodes);
    const isSelectedNodeEditable = {
      label: !node.isFinal,
      type: true,
      value: true,
    };

    return {
      ...state,
      selectedNode,
      isSelectedNodeEditable,
      selectedEdge: undefined,
      editLabelInputValue: node.pieces.join(''),
      editTypeInputValue: node.type,
      editValueInputValue: node.value,
    };
  },

  clearSelectedNode: (state) => ({
    ...state,
    selectedNode: undefined,
    isSelectedNodeEditable: {
      label: false,
      type: false,
      value: false,
    },
    editLabelInputValue: '',
    editTypeInputValue: '',
    editValueInputValue: '',
  }),

  setSelectedEdge: (state, payload) => {
    const {
      selectedEdge,
    } = payload;

    return {
      ...state,
      selectedEdge,
      selectedNode: undefined,
    };
  },

  clearSelectedEdge: (state) => ({
    ...state,
    selectedEdge: undefined,
  }),

  setSelectedRootNode: (state, payload) => {
    const {
      selectedRootNode,
    } = payload;

    return {
      ...state,
      selectedRootNode,
    };
  },

  clearSelectedRootNode: (state) => ({
    ...state,
    selectedRootNode: undefined,
  }),

  // Edit the selected node pieces, remove all the edges
  // that are connected to a hole connector of the selected node
  editNode: (state, payload) => {
    const {
      pieces,
      width,
    } = payload;

    const { nodes, edges, selectedNode } = state;
    return {
      ...state,
      nodes: nodes.map((node) => (node.id === selectedNode
        ? {
          ...node,
          pieces,
          width,
        }
        : node)),
      edges: edges.filter(
        (edge) => edge.parentNodeId !== selectedNode,
      ),
    };
  },
  // Edit the selected node type
  editNodeType: (state, payload) => {
    const {
      type,
    } = payload;

    const { nodes, selectedNode } = state;
    return {
      ...state,
      nodes: nodes.map((node) => (node.id === selectedNode
        ? {
          ...node,
          type,
        }
        : node)),
      editTypeInputValue: type,
    };
  },
  // Edit the selected node value
  editNodeValue: (state, payload) => {
    const {
      value,
    } = payload;

    const { nodes, selectedNode } = state;
    return {
      ...state,
      nodes: nodes.map((node) => (node.id === selectedNode
        ? {
          ...node,
          value,
        }
        : node)),
      editValueInputValue: value,
    };
  },
  setOrderedNodes: (state, payload) => {
    const {
      nodes,
      stagePos,
      stageScale,
    } = payload;

    return {
      ...state,
      nodes,
      stagePos,
      stageScale,
    };
  },
};

export default reducers;
