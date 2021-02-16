import {
  edgeByParentPiece,
  nodeById,
} from './tree';

export function exportState(state) {
  const {
    nodes,
    edges,
    selectedRootNode,
    stagePos,
    stageScale,
    connectorPlaceholder,
  } = state;

  return {
    nodes,
    edges,
    selectedRootNode,
    stagePos,
    stageScale,
    connectorPlaceholder,
  };
}

export function importState(
  state,
  uploadState,
  selectedEdgeRef,
  setSelectedEdgeRef,
  addValueChange,
  editValueChange,
  typeValueChange,
  nodeValueChange,
  // setSelectedTemplate,
  stageRef,
  transformerRef,
  setIsSelectedRectVisible,
  // , setState,
  computeNodeWidth,
) {
  const { nodes: tempNodes, edges: tempEdges } = state;
  const nodes =
    tempNodes === undefined || tempNodes === null ? [] : tempNodes.map((node, index) => {
      const nodeWidth = node.nodeWidth || computeNodeWidth(
        node.pieces,
      );
      const id = node.id || index;

      return {
        ...node,
        id,
        width: nodeWidth,
      };
    });

  const edges =
    tempEdges === undefined || tempEdges === null ? [] : tempEdges.map((edge, index) => {
      const id = edge.id || index;

      return {
        ...edge,
        id,
      };
    });

  uploadState({
    nodes,
    edges,
    selectedRootNode: state.selectedRootNode,
  });
  if (selectedEdgeRef) {
    selectedEdgeRef.moveToBottom();
    setSelectedEdgeRef(null);
  }
  addValueChange({ addValue: [] });
  editValueChange({ editValue: [] });
  typeValueChange({ typeValue: '' });
  nodeValueChange({ nodeValue: '' });
  // setSelectedTemplate(null);
  if (state.stagePos) {
    stageRef.current.position({ x: state.stagePos.x, y: state.stagePos.y });
  }
  if (state.stageScale) {
    stageRef.current.scale({
      x: state.stageScale.x,
      y: state.stageScale.y,
    });
  }
  transformerRef.current.nodes([]);
  setIsSelectedRectVisible(false);
  stageRef.current
    .find('.Edge')
    .toArray()
    .map((edge) => edge.moveToBottom());

  // const initialNodes = state.initialNodes.map((node, i) => {
  //   const nodeWidth = computeNodeWidth(
  //     node.pieces,
  //   );
  //   const id = i + 1;
  //   return {
  //     ...node,
  //     id,
  //     width: nodeWidth,
  //   };
  // });

  // const initialEdges = state.initialEdges.map((edge, i) => {
  //   const id = i + 1;
  //   return {
  //     ...edge,
  //     id,
  //   };
  // });

  // setState({
  //   initialNodes,
  //   initialEdges,
  // });
  // dispatch(ActionCreators.clearHistory());
}

// Function that computes the last occupied node id
export function maxNodeId(state) {
  return state.nodes
    .map((n) => n.id)
    .reduce((id1, id2) => Math.max(id1, id2), 0);
}

// Function that computes the last occupied edge id
export function maxEdgeId(state) {
  return state.edges
    .map((e) => e.id)
    .reduce((id1, id2) => Math.max(id1, id2), 0);
}

// Ordered tree walk function used to traverse the tree starting at the selected root node,
// in order to reorder the child nodes connected to the root node in a tree shape
export function orderWalk(
  state,
  node,
  connectorPlaceholder,
  newNodes,
  visitedNodes,
  currentLevelX,
  currentY,
  levelIndex,
  textHeight,
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
  currentY += textHeight * 4;
  node.pieces.forEach((piece, i) => {
    if (piece === connectorPlaceholder) {
      const edges = edgeByParentPiece(node.id, i, state.edges);
      edges.forEach((edge) => {
        const childNode = nodeById(edge.childNodeId, state.nodes);
        if (visitedNodes.find((e) => e === childNode.id) === undefined) {
          [newNodes, currentLevelX] = orderWalk(
            state,
            childNode,
            connectorPlaceholder,
            newNodes,
            visitedNodes,
            currentLevelX,
            currentY,
            levelIndex + 1,
            textHeight,
          );
        }
      });
    }
  });
  currentLevelX[levelIndex] += node.width + 40;
  return [newNodes, currentLevelX];
}
