import {
  edgeByParentPiece,
  edgeByChildNode,
  nodeById,
} from './tree';

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

  currentNode.pieces.forEach((piece, i) => {
    if (piece === connectorPlaceholder) {
      const childEdges = edgeByParentPiece(currentNode.id, i, edges);

      childEdges.forEach((edge) => {
        const childNode = nodeById(edge.childNodeId, nodes);
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

export function checkIsMultiEdgeOnHoleConnector(
  allowMultiEdgeOnHoleConnector,
  parentPiece,
  edges,
) {
  return new Promise((resolve, reject) => {
    if (allowMultiEdgeOnHoleConnector) {
      resolve();
    }

    // If it points to a valid and different target, check if there are multiple edges
    const currentlyConnectedEdges = edgeByParentPiece(
      parentPiece.parentNodeId,
      parentPiece.parentPieceId,
      edges,
    );

    // If we cannot add the edge, don't add the edge and notify
    if (currentlyConnectedEdges.length > 0) {
      reject(new Error('Multiple edges pointing to the same target'));
    } else {
      resolve();
    }
  });
}

export function checkIsMultiEdgeOnNodeConnector(
  allowMultiEdgeOnNodeConnector,
  targetChildId,
  edges,
) {
  return new Promise((resolve, reject) => {
    if (allowMultiEdgeOnNodeConnector) {
      resolve();
    }

    // If it points to a valid and different target, check if there are multiple edges
    const currentlyConnectedEdges = edgeByChildNode(targetChildId, edges);

    // If we cannot add the edge, don't add the edge and notify
    if (currentlyConnectedEdges.length > 0) {
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
