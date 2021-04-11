function checkHasLoop(
  currentNode,
  oldVisitedNodes,
  edges,
  nodes,
  connectorPlaceholder,
) {
  let currentVisitedNodes = [
    ...oldVisitedNodes,
    currentNode.id,
  ];

  let hasLoop = false;

  currentNode.pieces.forEach((piece) => {
    if (piece === connectorPlaceholder) {
      const childEdgeIds = nodes[currentNode.id].childEdges;
      const childEdges = childEdgeIds.map((id) => edges[id]);

      childEdges.forEach((edge) => {
        const childNode = nodes[edge.childNodeId];
        if (currentVisitedNodes.find((e) => e === childNode.id) !== undefined) {
          hasLoop = true;
        } else {
          const [nextHasLoop, newVisitedNodes] = checkHasLoop(
            childNode,
            oldVisitedNodes,
            edges,
            nodes,
            connectorPlaceholder,
          );
          currentVisitedNodes = [
            ...currentVisitedNodes,
            ...newVisitedNodes,
          ];
          hasLoop = hasLoop || nextHasLoop;
        }
      });
    }
  });

  return [hasLoop, currentVisitedNodes];
}

export function checkIsCreatingLoop(
  allowLoopError,
  currentNode,
  visitedBranches,
  edges,
  nodes,
  connectorPlaceholder,
) {
  return new Promise((resolve, reject) => {
    // Do nothing
    if (allowLoopError) {
      resolve();
      return;
    }

    // Check loop
    const [hasLoop] = checkHasLoop(
      currentNode,
      visitedBranches,
      edges,
      nodes,
      connectorPlaceholder,
    );

    if (hasLoop) {
      reject(new Error('Edge creates a loop in the tree'));
    } else {
      resolve();
    }
  });
}

export function checkIsMultiEdgeOnParentConnector(
  allowMultiEdgeOnHoleConnector,
  parentPiece,
  nodes,
) {
  return new Promise((resolve, reject) => {
    if (allowMultiEdgeOnHoleConnector) {
      resolve();
    }
    const {
      parentNodeId,
      parentPieceId,
    } = parentPiece;

    const parentPieceEdges = nodes[parentNodeId].parentEdges[parentPieceId];
    if (parentPieceEdges.length > 0) {
      reject(new Error('Multiple edges pointing to the same target'));
    } else {
      resolve();
    }
  });
}

export function checkIsMultiEdgeOnChildConnector(
  allowMultiEdgeOnNodeConnector,
  targetChildId,
  nodes,
) {
  return new Promise((resolve, reject) => {
    if (allowMultiEdgeOnNodeConnector) {
      resolve();
    }
    const { childEdges } = nodes[targetChildId];
    if (childEdges.length > 0) {
      reject(new Error('Multiple edges pointing to the same target'));
    } else {
      resolve();
    }
  });
}

export function checkSameNodeTarget(parentPiece, childNodeId) {
  return new Promise((resolve, reject) => {
    // If it points to the same node piece, do nothing and notify
    if (parentPiece.parentNodeId === childNodeId) {
      reject(new Error('Edge points to the same node'));
    } else {
      resolve();
    }
  });
}

export function checkSamePreviousParent(oldEdge, targetParentPiece) {
  return new Promise((resolve, reject) => {
    if (oldEdge.parentNodeId === targetParentPiece.parentNodeId
      && oldEdge.parentPieceId === targetParentPiece.parentPieceId
    ) {
      reject(new Error('No update, target did not change'));
    } else {
      resolve();
    }
  });
}

export function checkSamePreviousChild(oldEdge, targetChildId) {
  return new Promise((resolve, reject) => {
    if (oldEdge.childNodeId === targetChildId) {
      reject(new Error('No update, target did not change'));
    } else {
      resolve();
    }
  });
}
