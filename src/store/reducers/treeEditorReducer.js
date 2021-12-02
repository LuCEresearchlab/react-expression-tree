/* eslint-disable arrow-body-style */
import {
  createEmptyEdge,
} from '../../utils/state';

const reducers = {
  // This reducer is used for setting up the initial stage, should not enable Undo and Redo
  setNodes: (state, payload) => {
    const {
      nodes,
    } = payload;

    return {
      ...state,
      nodes,
    };
  },

  // Undo and Redo enabled
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
      editable,
      isSelected,
      childEdges,
      parentEdges,
    } = payload;

    const { undoState, nodes } = state;

    const newUndoState = {
      action: 'createNode',
      nodes,
    };

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
          editable,
          isSelected,
          childEdges,
          parentEdges,
        },
      },
      isCreatingNode: false,
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
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
      action: 'removeNode',
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
      nodes: {
        ...remainingNodes,
        ...updatedNodes,
      },
      edges: newEdges,
      isSelectedNodeEditable: selectedNode ? undefined : isSelectedNodeEditable,
      updateLabelInputValue: selectedNode ? '' : updateLabelInputValue,
      updateTypeInputValue: selectedNode ? '' : updateTypeInputValue,
      updateValueInputValue: selectedNode ? '' : updateValueInputValue,
      selectedNode: undefined,
      selectedRootNode:
        selectedRootNode === nodeId
          ? null
          : selectedRootNode,
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // Undo and Redo enabled
  updateNode: (state, payload) => {
    const {
      updatedEdges,
      pieces,
      piecesPosition,
      width,
      parentEdges,
    } = payload;

    const {
      undoState, nodes, edges, selectedNode,
    } = state;
    const node = nodes[selectedNode];

    const edgesToUpdate = Object.keys(updatedEdges);
    const edgesToRemove = node.parentEdges.flat();
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

    const nodesToUpdate = Object.keys(nodes).reduce((accumulator, id) => {
      const childNode = nodes[id];
      const { childEdges } = childNode;

      if (childEdges.some((edgeId) => edgesToRemove.includes(edgeId))) {
        const updatedChildEdges = childNode.childEdges.filter(
          (edgeId) => !edgesToRemove.includes(edgeId),
        );
        accumulator[id] = {
          ...childNode,
          childEdges: updatedChildEdges,
        };
      }

      return accumulator;
    }, {});

    const newUndoState = {
      action: 'updateNode',
      nodes,
      edges,
      selectedNode,
    };

    return {
      ...state,
      nodes: {
        ...nodes,
        [selectedNode]: {
          ...node,
          pieces,
          piecesPosition,
          width,
          parentEdges,
        },
        ...nodesToUpdate,
      },
      edges: newEdges,
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  /* This reducer is used for changing position during dragging, we add the undo state in here
   * instead of 'updateNodeCoordinates' and 'updateNodeCoordinatesAndFinishDragging', because
   * in here we have the knowledge of the initial position of the nodes before dragging.
   */
  setIsDraggingNode: (state, payload) => {
    const {
      nodeId,
    } = payload;

    const {
      undoState,
      nodes,
      edges,
      selectedNode,
      selectedEdge,
      updateLabelInputValue,
      updateTypeInputValue,
      updateValueInputValue,
    } = state;
    const node = nodes[nodeId];
    const isSelectedNodeEditable = {
      label: node.editable.label,
      type: node.editable.type,
      value: node.editable.value,
      delete: node.editable.delete,
    };

    const newUndoState = {
      action: 'setIsDraggingNode',
      nodes,
      edges,
      selectedNode,
      selectedEdge,
      isSelectedNodeEditable,
      updateLabelInputValue,
      updateTypeInputValue,
      updateValueInputValue,
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
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // Undo and Redo: look at 'setIsDraggingNode'
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

  // Undo and Redo: look at 'setIsDraggingNode'
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

  // Undo and Redo enabled
  updateNodeType: (state, payload) => {
    const {
      type,
    } = payload;

    const {
      undoState, nodes, selectedNode, updateTypeInputValue, isSelectedNodeEditable,
    } = state;
    const node = nodes[selectedNode];

    const newUndoState = {
      action: 'updateNodeType',
      nodes,
      selectedNode,
      updateTypeInputValue,
      isSelectedNodeEditable,
    };

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
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // Undo and Redo enabled
  updateNodeValue: (state, payload) => {
    const {
      value,
    } = payload;

    const {
      undoState, nodes, selectedNode, updateTypeInputValue, isSelectedNodeEditable,
    } = state;
    const node = nodes[selectedNode];

    const newUndoState = {
      action: 'updateNodeValue',
      nodes,
      selectedNode,
      updateTypeInputValue,
      isSelectedNodeEditable,
    };

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
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // No Undo and Redo
  setSelectedNode: (state, payload) => {
    const {
      selectedNode,
    } = payload;

    const { nodes } = state;
    const node = nodes[selectedNode];
    const isSelectedNodeEditable = {
      label: node.editable.label,
      type: node.editable.type,
      value: node.editable.value,
      delete: node.editable.delete,
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

  // No Undo and Redo
  clearSelectedNode: (state) => ({
    ...state,
    selectedNode: undefined,
    isSelectedNodeEditable: undefined,
    updateLabelInputValue: '',
    updateTypeInputValue: '',
    updateValueInputValue: '',
  }),

  // Undo and Redo enabled
  setSelectedRootNode: (state, payload) => {
    const {
      selectedRootNode,
    } = payload;

    const { undoState, selectedRootNode: oldSelectedRootNode } = state;

    const newUndoState = {
      action: 'setSelectedRootNode',
      selectedRootNode: oldSelectedRootNode,
    };

    if (selectedRootNode === oldSelectedRootNode) {
      return state;
    }

    return {
      ...state,
      selectedRootNode,
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // Undo and Redo enabled
  clearSelectedRootNode: (state) => {
    const { undoState, selectedRootNode } = state;
    const newUndoState = {
      action: 'clearSelectedRootNode',
      selectedRootNode,
    };

    if (!selectedRootNode) {
      return state;
    }

    return {
      ...state,
      selectedRootNode: undefined,
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // No Undo and Redo
  setHighlightedNodes: (state, payload) => {
    const { highlightedNodes } = payload;
    const { nodes, highlightedNodes: currentHighlightedNodes } = state;

    const oldHighlightedNodes = currentHighlightedNodes.reduce((accumulator, id) => {
      const node = nodes[id];
      if (node) {
        accumulator[id] = {
          ...node,
          isHighlighted: false,
        };
      }
      return accumulator;
    }, {});
    const newHighlightedNodes = highlightedNodes.reduce((accumulator, id) => {
      const node = nodes[id];
      if (node) {
        accumulator[id] = {
          ...node,
          isHighlighted: true,
        };
      }
      return accumulator;
    }, {});

    return {
      ...state,
      nodes: {
        ...nodes,
        ...oldHighlightedNodes,
        ...newHighlightedNodes,
      },
    };
  },

  // This reducer is used for setting up the initial stage, should not enable Undo and Redo
  setEdges: (state, payload) => {
    const {
      edges,
    } = payload;

    return {
      ...state,
      edges,
    };
  },

  // Undo and Redo enabled
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

    const { undoState, nodes, edges } = state;

    const newEdge = createEmptyEdge();
    const { id: addingEdgeId } = newEdge;

    const addingEdge = {
      ...newEdge,
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

    const newUndoState = {
      action: 'createEdge',
      nodes,
      edges,
    };

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
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // Undo and Redo enabled
  removeEdge: (state, payload) => {
    const {
      edgeId,
    } = payload;

    const {
      undoState, nodes, edges,
    } = state;
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

    const newUndoState = {
      action: 'removeEdge',
      nodes,
      edges,
      selectedEdge: edgeId,
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
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // Undo and Redo enabled
  updateChildEdge: (state, payload) => {
    const {
      newEdge,
      edgeId,
    } = payload;

    const { undoState, nodes, edges } = state;

    const oldEdge = edges[edgeId];
    const {
      childNodeId: oldChildNodeId,
    } = oldEdge;
    const oldChildNode = nodes[oldChildNodeId];

    const {
      childNodeId: newChildNodeId,
    } = newEdge;
    const newChildNode = nodes[newChildNodeId];

    const newUndoState = {
      action: 'updateChildEdge',
      nodes,
      edges,
      selectedEdge: edgeId,
    };

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
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // Undo and Redo enabled
  updateParentEdge: (state, payload) => {
    const {
      newEdge,
      edgeId,
    } = payload;

    const { undoState, nodes, edges } = state;

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

    const newUndoState = {
      action: 'updateParentEdge',
      nodes,
      edges,
      selectedEdge: edgeId,
    };

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
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // No Undo and Redo
  setSelectedEdge: (state, payload) => {
    const {
      selectedEdge,
    } = payload;

    return {
      ...state,
      selectedEdge,
      selectedNode: undefined,
      isSelectedNodeEditable: undefined,
      updateLabelInputValue: '',
      updateTypeInputValue: '',
      updateValueInputValue: '',
    };
  },

  // No Undo and Redo
  clearSelectedEdge: (state) => ({
    ...state,
    selectedEdge: undefined,
  }),

  // No Undo and Redo
  setHighlightedEdges: (state, payload) => {
    const { highlightedEdges } = payload;
    const { edges, highlightedEdges: currentHighlightedEdges } = state;

    const oldHighlightedEdges = currentHighlightedEdges.reduce((accumulator, id) => {
      const node = edges[id];
      if (node) {
        accumulator[id] = {
          ...node,
          isHighlighted: false,
        };
      }
      return accumulator;
    }, {});
    const newHighlightedEdges = highlightedEdges.reduce((accumulator, id) => {
      const node = edges[id];
      if (node) {
        accumulator[id] = {
          ...node,
          isHighlighted: true,
        };
      }
      return accumulator;
    }, {});

    return {
      ...state,
      edges: {
        ...edges,
        ...oldHighlightedEdges,
        ...newHighlightedEdges,
      },
    };
  },

  // No Undo and Redo
  setDragEdge: (state, payload) => {
    const { dragEdge } = payload;
    return {
      ...state,
      dragEdge,
    };
  },

  // No Undo and Redo
  clearDragEdge: (state) => {
    return {
      ...state,
      dragEdge: null,
    };
  },

  // No Undo and Redo
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

  // No Undo and Redo
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

  // Undo and Redo enabled
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

    const {
      undoState,
      nodes: oldNodes,
      selectedNode: oldSelectedNode,
      edges: oldEdges,
      selectedEdge: oldSelectedEdge,
      selectedRootNode: oldSelectedRootNode,
      stagePos: oldStagePos,
      stageScale: oldStageScale,
      connectorPlaceholder: oldConnectorPlaceholder,
    } = state;

    const newUndoState = {
      action: 'stageReset',
      nodes: oldNodes,
      selectedNode: oldSelectedNode,
      edges: oldEdges,
      selectedEdge: oldSelectedEdge,
      selectedRootNode: oldSelectedRootNode,
      stagePos: oldStagePos,
      stageScale: oldStageScale,
      connectorPlaceholder: oldConnectorPlaceholder,
    };

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
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // No Undo and Redo
  setStartingOrderedNodes: (state, payload) => {
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

  // Undo and Redo enabled
  setOrderedNodes: (state, payload) => {
    const {
      nodes,
      edges,
      stagePos,
      stageScale,
    } = payload;

    const {
      undoState,
      nodes: oldNodes,
      edges: oldEdges,
      stagePos: oldStagePos,
      stageScale: oldStageScale,
    } = state;

    const newUndoState = {
      action: 'setOrderedNodes',
      nodes: oldNodes,
      edges: oldEdges,
      stagePos: oldStagePos,
      stageScale: oldStageScale,
    };

    return {
      ...state,
      nodes,
      edges,
      stagePos,
      stageScale,
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },

  // Undo and Redo enabled
  setNodeEditability: (state, payload) => {
    const {
      nodeId,
      allowLabel,
      allowDelete,
      allowValue,
      allowType,
    } = payload;

    const {
      undoState, nodes, selectedNode, isSelectedNodeEditable: oldiISelectedNodeEditable,
    } = state;
    const node = nodes[nodeId];
    const editable = {
      label: allowLabel,
      type: allowType,
      value: allowValue,
      delete: allowDelete,
    };

    const isSelectedNodeEditable = nodeId === selectedNode
      ? editable
      : nodes[selectedNode].editable;

    const newUndoState = {
      action: 'setNodeEditability',
      isSelectedNodeEditable: oldiISelectedNodeEditable,
      nodes,
    };

    return {
      ...state,
      isSelectedNodeEditable,
      nodes: {
        ...nodes,
        [nodeId]: {
          ...node,
          editable,
        },
      },
      undoState: [
        newUndoState,
        ...undoState,
      ],
      redoState: [],
    };
  },
};

export default reducers;
