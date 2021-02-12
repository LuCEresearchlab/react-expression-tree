// Utility Functions

// Compute the distance between two points in 2D space
export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

// Get node having the node's id
export function nodeById(nodeId, nodes) {
  if (nodeId === undefined || nodeId === null) {
    throw new Error('Illegal nodeId', nodeId);
  }
  const node = nodes.find((nd) => nd.id === nodeId);
  if (!node) {
    throw new Error('Unknown nodeId', nodeId);
  }
  return node;
}

// Get node position having the node's id
export function nodePositionById(nodeId, nodes) {
  if (nodeId === undefined || nodeId === null) {
    throw new Error('Illegal nodeId', nodeId);
  }
  const node = nodes.find((nd) => nd.id === nodeId);
  if (!node) {
    throw new Error('Unknown nodeId', nodeId);
  }
  return { x: node.x, y: node.y };
}

// Get edge having the edge's id
export function edgeById(edgeId, edges) {
  if (edgeId === undefined || edgeId === null) {
    throw new Error('Illegal edgeId', edgeId);
  }
  const edge = edges.find((edg) => edg.id === edgeId);
  if (!edge) {
    throw new Error('Unknown edgeId', edgeId);
  }
  return edge;
}

// Get edge having the edge's child node id
export function edgeByChildNode(childNodeId, edges) {
  return edges.filter((edge) => edge.childNodeId === childNodeId);
}

// Get edge having the edge's parent node id
export function edgeByParentPiece(parentNodeId, parentPieceId, edges) {
  return edges.filter(
    (edge) => edge.parentNodeId === parentNodeId && edge.parentPieceId === parentPieceId,
  );
}
