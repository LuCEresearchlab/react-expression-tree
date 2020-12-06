import Konva from "konva";

// Utility Functions
export function nodeById(nodeId, nodes) {
  if (nodeId === undefined || nodeId === null) {
    throw new Error("Illegal nodeId", nodeId);
  }
  const node = nodes.find(node => node.id === nodeId);
  if (!node) {
    throw new Error("Unknown nodeId", nodeId);
  }
  return node;
}

export function nodePositionById(nodeId, nodes) {
  if (nodeId === undefined || nodeId === null) {
    throw new Error("Illegal nodeId", nodeId);
  }
  const node = nodes.find(node => node.id === nodeId);
  if (!node) {
    throw new Error("Unknown nodeId", nodeId);
  }
  return { x: node.x, y: node.y };
}

export function edgeById(edgeId, edges) {
  if (edgeId === undefined || edgeId === null) {
    throw new Error("Illegal edgeId", edgeId);
  }
  const edge = edges.find(edge => edge.id === edgeId);
  if (!edge) {
    throw new Error("Unknown edgeId", edgeId);
  }
  return edge;
}

export function edgeByChildNode(childNodeId, edges) {
  return edges.filter(edge => edge.childNodeId === childNodeId);
}

export function edgeByParentPiece(parentNodeId, parentPieceId, edges) {
  return edges.filter(
    edge =>
      edge.parentNodeId === parentNodeId && edge.parentPieceId === parentPieceId
  );
}

export const computeEdgeChildPos = (childNodeId, nodes) => {
  const node = nodeById(childNodeId, nodes);
  return {
    x: node.x + node.width / 2,
    y: node.y,
  };
};

export const computeEdgeParentPos = (
  parentNodeId,
  parentPieceX,
  nodes,
  fontSize,
  fontFamily
) => {
  const xPad = fontSize / 2;
  const yPad = fontSize / 2;
  const oText = new Konva.Text({
    text: "o",
    fontFamily: fontFamily,
    fontSize: fontSize,
  });
  const textHeight = oText.fontSize();
  const holeWidth = oText.getTextWidth();
  const node = nodeById(parentNodeId, nodes);
  return {
    x: node.x + xPad + parentPieceX + holeWidth / 2,
    y: node.y + yPad + textHeight,
  };
};

export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

export const closestChildId = (x, y, nodes, fontSize, fontFamily) => {
  const oText = new Konva.Text({
    text: "o",
    fontFamily: fontFamily,
    fontSize: fontSize,
  });
  const targetRange = oText.fontSize();
  let closestNodeId = null;
  let closestDist = null;
  nodes.forEach(node => {
    const pos = computeEdgeChildPos(node.id, nodes);
    const dist = distance(pos.x, pos.y, x, y);
    if (dist < targetRange && (!closestDist || dist < closestDist)) {
      closestDist = dist;
      closestNodeId = node.id;
    }
  });
  return closestNodeId;
};

export const closestParentPiece = (
  x,
  y,
  nodes,
  connectorPlaceholder,
  fontSize,
  fontFamily
) => {
  const oText = new Konva.Text({
    text: "o",
    fontFamily: fontFamily,
    fontSize: fontSize,
  });
  const targetRange = oText.fontSize();
  let closestPiece = null;
  let closestDist = null;
  nodes.forEach(node => {
    const pieces = nodeById(node.id, nodes).pieces;
    pieces.forEach((piece, i) => {
      if (piece === connectorPlaceholder) {
        const pieceX = computePiecesPositions(
          pieces,
          connectorPlaceholder,
          fontSize,
          fontFamily
        )[i];
        const pos = computeEdgeParentPos(
          node.id,
          pieceX,
          nodes,
          fontSize,
          fontFamily
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

export function computePiecesWidths(
  pieces,
  connectorPlaceholder,
  fontSize,
  fontFamily
) {
  const oText = new Konva.Text({
    text: "o",
    fontFamily: fontFamily,
    fontSize: fontSize,
  });
  const holeWidth = oText.getTextWidth();
  return pieces.map(p => {
    if (p === connectorPlaceholder) {
      return holeWidth;
    } else {
      const text = new Konva.Text({
        text: p,
        fontFamily: fontFamily,
        fontSize: fontSize,
      });
      return text.getTextWidth();
    }
  });
}

export function computePiecesPositions(
  pieces,
  connectorPlaceholder,
  fontSize,
  fontFamily
) {
  const gapWidth = fontSize / 5;
  const widths = computePiecesWidths(
    pieces,
    connectorPlaceholder,
    fontSize,
    fontFamily
  );
  let pieceX = 0;
  const xes = widths.map(w => {
    let myX = pieceX;
    pieceX += w + gapWidth;
    return myX;
  });
  return xes;
}

export function computeNodeWidth(
  pieces,
  connectorPlaceholder,
  fontSize,
  fontFamily
) {
  const xPad = fontSize / 2;
  const widths = computePiecesWidths(
    pieces,
    connectorPlaceholder,
    fontSize,
    fontFamily
  );
  const gapWidth = fontSize / 5;
  let width = gapWidth * (pieces.length - 1);
  for (const w of widths) {
    width += w;
  }
  return width + 2 * xPad;
}

export function parsePieces(value, connectorPlaceholder) {
  const values = value.split(connectorPlaceholder);
  var pieces = [];
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
  pieces = pieces.filter(e => e !== "");
  return pieces;
}
