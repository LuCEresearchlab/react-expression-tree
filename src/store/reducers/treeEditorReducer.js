/* eslint-disable arrow-body-style */
import {
  createUniqueId,
} from '../../utils/state';

const reducers = {
  setNodes: (state, payload) => {
    const {
      nodes,
    } = payload;

    return {
      ...state,
      nodes,
    };
  },

  createNode: (state, payload) => {
    const {
      id,
      pieces,
      piecesPosition,
      x,
      y,
      width,
      height,
      type,
      value,
      isFinal,
      isSelected,
      childEdges,
      parentEdges,
    } = payload;

    const { nodes } = state;

    return {
      ...state,
      nodes: {
        ...nodes,
        [id]: {
          id,
          pieces,
          piecesPosition,
          x,
          y,
          width,
          height,
          type,
          value,
          isFinal,
          isSelected,
          childEdges,
          parentEdges,
        },
      },
      isCreatingNode: false,
    };
  },

  removeNode: (state, payload) => {
    const {
      nodeId,
    } = payload;

    const {
      undoState,
      nodes,
      edges,
      selectedNode,
      selectedRootNode,
      isSelectedNodeEditable,
      updateLabelInputValue,
      updateTypeInputValue,
      updateValueInputValue,
    } = state;

    // Remove node
    const {
      [nodeId]: toRemove,
      ...remainingNodes
    } = nodes;

    // Check which edges need to be removed
    const { childEdges: childEdgesToRemove, parentEdges: parentEdgesToRemove } = nodes[nodeId];
    const parentFlatEdgesToRemove = parentEdgesToRemove.flat();
    const edgesToRemove = childEdgesToRemove.concat(parentFlatEdgesToRemove);

    // Compute the new edges
    const newEdges = Object.keys(edges).reduce((accumulator, id) => {
      if (edgesToRemove.includes(id)) {
        return accumulator;
      }

      accumulator[id] = edges[id];
      return accumulator;
    }, {});

    const updatedNodes = {};
    childEdgesToRemove.forEach((id) => {
      const {
        parentNodeId,
        parentPieceId,
      } = edges[id];

      const parentNode = remainingNodes[parentNodeId];
      const { parentEdges } = parentNode;
      const updatedParentEdges = [...parentEdges];
      updatedParentEdges[parentPieceId] = updatedParentEdges[parentPieceId].filter(
        (edgeId) => !edgesToRemove.includes(edgeId),
      );

      updatedNodes[parentNodeId] = {
        ...parentNode,
        parentEdges: updatedParentEdges,
      };
    });
    parentFlatEdgesToRemove.forEach((id) => {
      const {
        childNodeId,
      } = edges[id];

      const childNode = remainingNodes[childNodeId];
      const { childEdges } = childNode;
      updatedNodes[childNodeId] = {
        ...childNode,
        childEdges: childEdges.filter(
          (edgeId) => !edgesToRemove.includes(edgeId),
        ),
      };
    });

    const newUndoState = {
      nodes,
      edges,
      isSelectedNodeEditable,
      updateLabelInputValue,
      updateTypeInputValue,
      updateValueInputValue,
      selectedNode,
      selectedRootNode,
    };

    return {
      ...state,
      undoState: [
        ...undoState,
        newUndoState,
      ],
      redoState: [],
      nodes: {
        ...remainingNodes,
        ...updatedNodes,
      },
      edges: newEdges,
      isSelectedNodeEditable: selectedNode ? {
        label: false,
        type: false,
        value: false,
      } : isSelectedNodeEditable,
      updateLabelInputValue: selectedNode ? '' : updateLabelInputValue,
      updateTypeInputValue: selectedNode ? '' : updateTypeInputValue,
      updateValueInputValue: selectedNode ? '' : updateValueInputValue,
      selectedNode: undefined,
      selectedRootNode:
        selectedRootNode === nodeId
          ? null
          : selectedRootNode,
    };
  },

  updateNode: (state, payload) => {
    const {
      updatedEdges,
      pieces,
      piecesPosition,
      width,
    } = payload;

    const { nodes, edges, selectedNode } = state;
    const node = nodes[selectedNode];

    const edgesToUpdate = Object.keys(updatedEdges);
    const edgesToRemove = nodes[selectedNode].parentEdges.flat();
    const newEdges = Object.keys(edges).reduce((accumulator, id) => {
      if (edgesToRemove.includes(id)) {
        return accumulator;
      }

      if (edgesToUpdate.includes(id)) {
        accumulator[id] = {
          ...edges[id],
          ...updatedEdges[id],
        };
        return accumulator;
      }

      accumulator[id] = edges[id];
      return accumulator;
    }, {});

    return {
      ...state,
      nodes: {
        ...nodes,
        [selectedNode]: {
          ...node,
          pieces,
          piecesPosition,
          width,
        },
      },
      edges: newEdges,
    };
  },

  updateNodeCoordinates: (state, payload) => {
    const {
      updatedEdges,
      nodeId,
      updatedNode,
    } = payload;

    const { nodes, edges } = state;
    const oldNode = nodes[nodeId];
    return {
      ...state,
      nodes: {
        ...nodes,
        [nodeId]: {
          ...oldNode,
          ...updatedNode,
        },
      },
      edges: {
        ...edges,
        ...updatedEdges,
      },
    };
  },

  updateNodeCoordinatesAndFinishDragging: (state, payload) => {
    const {
      updatedEdges,
      nodeId,
      updatedNode,
    } = payload;

    const { nodes, edges } = state;
    const oldNode = nodes[nodeId];
    return {
      ...state,
      isDraggingNode: false,
      nodes: {
        ...nodes,
        [nodeId]: {
          ...oldNode,
          ...updatedNode,
        },
      },
      edges: {
        ...edges,
        ...updatedEdges,
      },
    };
  },

  updateNodeType: (state, payload) => {
    const {
      type,
    } = payload;

    const { nodes, selectedNode } = state;
    const node = nodes[selectedNode];
    return {
      ...state,
      nodes: {
        ...nodes,
        [selectedNode]: {
          ...node,
          type,
        },
      },
      updateTypeInputValue: type,
    };
  },

  updateNodeValue: (state, payload) => {
    const {
      value,
    } = payload;

    const { nodes, selectedNode } = state;
    const node = nodes[selectedNode];
    return {
      ...state,
      nodes: {
        ...nodes,
        [selectedNode]: {
          ...node,
          value,
        },
      },
      updateValueInputValue: value,
    };
  },

  setSelectedNode: (state, payload) => {
    const {
      selectedNode,
    } = payload;

    const { nodes } = state;
    const node = nodes[selectedNode];
    const isSelectedNodeEditable = {
      label: !node.isFinal,
      type: true,
      value: true,
    };

    return {
      ...state,
      selectedNode,
      selectedEdge: undefined,
      isSelectedNodeEditable,
      updateLabelInputValue: node.pieces.join(''),
      updateTypeInputValue: node.type,
      updateValueInputValue: node.value,
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
    updateLabelInputValue: '',
    updateTypeInputValue: '',
    updateValueInputValue: '',
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

  setEdges: (state, payload) => {
    const {
      edges,
    } = payload;

    return {
      ...state,
      edges,
    };
  },

  createEdge: (state, payload) => {
    const {
      childNodeId,
      parentNodeId,
      parentPieceId,
      childX,
      childY,
      parentX,
      parentY,
    } = payload;

    const { nodes, edges } = state;

    const addingEdgeId = createUniqueId();
    const addingEdge = {
      id: addingEdgeId,
      childNodeId,
      parentNodeId,
      parentPieceId,
      childX,
      childY,
      parentX,
      parentY,
    };

    const childNode = nodes[childNodeId];
    const { childEdges } = childNode;
    const parentNode = nodes[parentNodeId];
    const { parentEdges } = parentNode;
    const newParentEdges = [...parentEdges];
    const pieceEdges = newParentEdges[parentPieceId];
    newParentEdges[parentPieceId] = [
      ...pieceEdges,
      addingEdgeId,
    ];

    return {
      ...state,
      nodes: {
        ...nodes,
        [childNodeId]: {
          ...childNode,
          childEdges: [
            ...childEdges,
            addingEdgeId,
          ],
        },
        [parentNodeId]: {
          ...parentNode,
          parentEdges: [
            ...newParentEdges,
          ],
        },
      },
      edges: {
        ...edges,
        [addingEdgeId]: addingEdge,
      },
      dragEdge: null,
    };
  },

  removeEdge: (state, payload) => {
    const {
      edgeId,
    } = payload;

    const { nodes, edges } = state;
    const {
      [edgeId]: toRemove,
      ...remainingEdges
    } = edges;

    const {
      childNodeId,
      parentNodeId,
      parentPieceId,
    } = edges[edgeId];

    const childNode = nodes[childNodeId];
    const parentNode = nodes[parentNodeId];
    const { parentEdges } = parentNode;
    const updatedParentNodes = [...parentEdges];
    updatedParentNodes[parentPieceId] = updatedParentNodes[parentPieceId].filter(
      (id) => id !== edgeId,
    );

    const updatedNodes = {};
    updatedNodes[childNodeId] = {
      ...childNode,
      childEdges: childNode.childEdges.filter((id) => id !== edgeId),
    };
    updatedNodes[parentNodeId] = {
      ...parentNode,
      parentEdges: updatedParentNodes,
    };

    return {
      ...state,
      nodes: {
        ...nodes,
        ...updatedNodes,
      },
      edges: {
        ...remainingEdges,
      },
      dragEdge: undefined,
      selectedEdge: undefined,
    };
  },

  updateChildEdge: (state, payload) => {
    const {
      newEdge,
      edgeId,
    } = payload;

    const { nodes, edges } = state;

    const oldEdge = edges[edgeId];
    const {
      childNodeId: oldChildNodeId,
    } = oldEdge;
    const oldChildNode = nodes[oldChildNodeId];

    const {
      childNodeId: newChildNodeId,
    } = newEdge;
    const newChildNode = nodes[newChildNodeId];

    return {
      ...state,
      nodes: {
        ...nodes,
        [oldChildNodeId]: {
          ...oldChildNode,
          childEdges: oldChildNode.childEdges.filter((id) => id !== edgeId),
        },
        [newChildNodeId]: {
          ...newChildNode,
          childEdges: [
            ...newChildNode.childEdges,
            edgeId,
          ],
        },
      },
      edges: {
        ...edges,
        [edgeId]: newEdge,
      },
      dragEdge: null,
    };
  },

  updateParentEdge: (state, payload) => {
    const {
      newEdge,
      edgeId,
    } = payload;

    const { nodes, edges } = state;

    const oldEdge = edges[edgeId];
    const {
      parentNodeId: oldParentNodeId,
      parentPieceId: oldParentPieceId,
    } = oldEdge;

    const {
      parentNodeId: newParentNodeId,
      parentPieceId: newParentPieceId,
    } = newEdge;

    const oldParentNode = nodes[oldParentNodeId];
    const { parentEdges: oldParentEdges } = oldParentNode;
    const newParentNode = nodes[newParentNodeId];
    const { parentEdges: newParentEdges } = newParentNode;

    const updatedNodes = {};
    if (oldParentNodeId === newParentNodeId) {
      const updatedParentEdges = [...oldParentEdges];
      updatedParentEdges[oldParentPieceId] = updatedParentEdges[oldParentPieceId].filter(
        (id) => id !== edgeId,
      );
      updatedParentEdges[newParentPieceId] = [
        ...updatedParentEdges[newParentPieceId],
        edgeId,
      ];

      updatedNodes[oldParentNodeId] = {
        ...oldParentNode,
        parentEdges: updatedParentEdges,
      };
    } else {
      const updatedOldParentEdges = [...oldParentEdges];
      updatedOldParentEdges[oldParentPieceId] = updatedOldParentEdges[oldParentPieceId].filter(
        (id) => id !== edgeId,
      );

      const updatedNewParentEdges = [...newParentEdges];
      updatedNewParentEdges[newParentPieceId] = [
        ...updatedNewParentEdges[newParentPieceId],
        edgeId,
      ];

      updatedNodes[oldParentNodeId] = {
        ...oldParentNode,
        parentEdges: updatedOldParentEdges,
      };
      updatedNodes[newParentNodeId] = {
        ...newParentNode,
        parentEdges: updatedNewParentEdges,
      };
    }

    return {
      ...state,
      nodes: {
        ...nodes,
        ...updatedNodes,
      },
      edges: {
        ...edges,
        [edgeId]: newEdge,
      },
      dragEdge: null,
    };
  },

  setSelectedEdge: (state, payload) => {
    const {
      selectedEdge,
    } = payload;

    return {
      ...state,
      selectedEdge,
      selectedNode: undefined,
      isSelectedNodeEditable: {
        label: false,
        type: false,
        value: false,
      },
      updateLabelInputValue: '',
      updateTypeInputValue: '',
      updateValueInputValue: '',
    };
  },

  clearSelectedEdge: (state) => ({
    ...state,
    selectedEdge: undefined,
  }),

  setDragEdge: (state, payload) => {
    const { dragEdge } = payload;
    return {
      ...state,
      dragEdge,
    };
  },

  clearDragEdge: (state) => {
    return {
      ...state,
      dragEdge: null,
    };
  },

  updateDragEdgeParentCoordinates: (state, payload) => {
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

  updateDragEdgeChildCoordinates: (state, payload) => {
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

  setOrderedNodes: (state, payload) => {
    const {
      nodes,
      edges,
      stagePos,
      stageScale,
    } = payload;

    return {
      ...state,
      nodes,
      edges,
      stagePos,
      stageScale,
    };
  },

  setIsDraggingNode: (state, payload) => {
    const {
      nodeId,
    } = payload;

    const { nodes } = state;
    const node = nodes[nodeId];
    const isSelectedNodeEditable = {
      label: !node.isFinal,
      type: true,
      value: true,
    };

    return {
      ...state,
      isDraggingNode: true,
      selectedNode: nodeId,
      selectedEdge: undefined,
      isSelectedNodeEditable,
      updateLabelInputValue: node.pieces.join(''),
      updateTypeInputValue: node.type,
      updateValueInputValue: node.value,
    };
  },
};

export default reducers;
