import Konva from 'konva';

// Utility Functions

// Get node having the node's id
export function nodeById(nodeId, nodes) {
  if (nodeId === undefined || nodeId === null) {
    throw new Error('Illegal nodeId', nodeId);
  }
  const node = nodes.find((node) => node.id === nodeId);
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
  const node = nodes.find((node) => node.id === nodeId);
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
  const edge = edges.find((edge) => edge.id === edgeId);
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

// Compute the edge's child position having the child node id
export const computeEdgeChildPos = (childNodeId, nodes) => {
  const node = nodeById(childNodeId, nodes);
  return {
    x: node.x + node.width / 2,
    y: node.y,
  };
};

// Compute the edge's parent position having the parent node and the parent piece ids,
export const computeEdgeParentPos = (
  parentNodeId,
  parentPieceX,
  nodes,
  fontSize,
  fontFamily,
) => {
  const xPad = fontSize / 2;
  const yPad = fontSize / 2;
  const oText = new Konva.Text({
    text: 'o',
    fontFamily,
    fontSize,
  });
  const textHeight = oText.fontSize();
  const holeWidth = oText.getTextWidth();
  const node = nodeById(parentNodeId, nodes);
  return {
    x: node.x + xPad + parentPieceX + holeWidth / 2,
    y: node.y + yPad + textHeight,
  };
};

// Compute the distance between two points in 2D space
export const distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

// Compute the closest child notd given an (x, y) point coordinate
export const closestChildId = (x, y, nodes, fontSize, fontFamily) => {
  const oText = new Konva.Text({
    text: 'o',
    fontFamily,
    fontSize,
  });
  const targetRange = oText.fontSize();
  let closestNodeId = null;
  let closestDist = null;
  nodes.forEach((node) => {
    const pos = computeEdgeChildPos(node.id, nodes);
    const dist = distance(pos.x, pos.y, x, y);
    if (dist < targetRange && (!closestDist || dist < closestDist)) {
      closestDist = dist;
      closestNodeId = node.id;
    }
  });
  return closestNodeId;
};

// Compute the closest parent piece given an (x, y) point coordinate
export const closestParentPiece = (
  x,
  y,
  nodes,
  connectorPlaceholder,
  fontSize,
  fontFamily,
) => {
  const oText = new Konva.Text({
    text: 'o',
    fontFamily,
    fontSize,
  });
  const targetRange = oText.fontSize();
  let closestPiece = null;
  let closestDist = null;
  nodes.forEach((node) => {
    const { pieces } = nodeById(node.id, nodes);
    pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        const pieceX = computePiecesPositions(
          pieces,
          connectorPlaceholder,
          fontSize,
          fontFamily,
        )[i];
        const pos = computeEdgeParentPos(
          node.id,
          pieceX,
          nodes,
          fontSize,
          fontFamily,
        );
        const dist = distance(pos.x, pos.y, x, y);
        if (dist < targetRange && (!closestDist || dist < closestDist)) {
          closestDist = dist;
          closestPiece = {
            parentNodeId: node.id,
            parentPieceId: i,
          };
        }
      }
    });
  });
  return closestPiece;
};

// Compute all the node's pieces widths
export function computePiecesWidths(
  pieces,
  connectorPlaceholder,
  fontSize,
  fontFamily,
) {
  const oText = new Konva.Text({
    text: 'o',
    fontFamily,
    fontSize,
  });
  const holeWidth = oText.getTextWidth();
  return pieces.map((p) => {
    if (p === connectorPlaceholder) {
      return holeWidth;
    }
    const text = new Konva.Text({
      text: p,
      fontFamily,
      fontSize,
    });
    return text.getTextWidth();
  });
}

// Compute all the node's pieces positions
export function computePiecesPositions(
  pieces,
  connectorPlaceholder,
  fontSize,
  fontFamily,
) {
  const gapWidth = fontSize / 5;
  const widths = computePiecesWidths(
    pieces,
    connectorPlaceholder,
    fontSize,
    fontFamily,
  );
  let pieceX = 0;
  const xes = widths.map((w) => {
    const myX = pieceX;
    pieceX += w + gapWidth;
    return myX;
  });
  return xes;
}

// Compute the node width
export function computeNodeWidth(
  pieces,
  connectorPlaceholder,
  fontSize,
  fontFamily,
) {
  const xPad = fontSize / 2;
  const widths = computePiecesWidths(
    pieces,
    connectorPlaceholder,
    fontSize,
    fontFamily,
  );
  const gapWidth = fontSize / 5;
  let width = gapWidth * (pieces.length - 1);
  for (const w of widths) {
    width += w;
  }
  return width + 2 * xPad;
}

// Parse the nodes's pieces from a textfield string into the pieces array
export function parsePieces(value, connectorPlaceholder) {
  const values = value.split(connectorPlaceholder);
  let pieces = [];
  values.length < 2
    ? (pieces = values)
    : values.forEach((e, i) => {
      if (i === values.length - 1) {
        pieces.push(values[i]);
      } else {
        pieces.push(values[i]);
        pieces.push(connectorPlaceholder);
      }
    });
  pieces = pieces.filter((e) => e !== '');
  return pieces;
}
