import Konva from "konva";

// Debug
export const logging = false;
export const log = function (...args) {
  if (logging === true) {
    console.log(...args);
  }
};

// Layout Defaults
export const xPad = 10;
export const yPad = 10;
export const gapWidth = 5;
export const fontFamily = "Ubuntu Mono, Courier";
export const defaultFontSize = 24;
export const oText = new Konva.Text({
  text: "o",
  fontFamily: fontFamily,
  fontSize: defaultFontSize,
});
export const textHeight = oText.fontSize();
export const holeWidth = oText.getTextWidth();
export const targetRange = textHeight;

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

//TODO: what if we have multiple edges to a child node?
export function edgeByChildNode(childNodeId, edges) {
  return edges.find(edge => edge.childNodeId === childNodeId);
}

//TODO: what if we have multiple edges from a parent piece?
export function edgeByParentPiece(parentNodeId, parentPieceId, edges) {
  return edges.find(
    edge =>
      edge.parentNodeId === parentNodeId && edge.parentPieceId === parentPieceId
  );
}

export function nodePositionById(nodeId, nodePositions) {
  return nodePositions.find(nodePosition => nodePosition.id === nodeId);
}

export const computeEdgeChildPos = (childNodeId, nodes, nodePositions) => {
  const nodePos = nodePositionById(childNodeId, nodePositions);
  return {
    x:
      nodePos.x +
      xPad +
      computeNodeWidth(nodeById(childNodeId, nodes).pieces) / 2,
    y: nodePos.y,
  };
};

export const computeEdgeParentPos = (
  parentNodeId,
  parentPieceId,
  nodes,
  nodePositions
) => {
  const nodePos = nodePositionById(parentNodeId, nodePositions);
  return {
    x:
      nodePos.x +
      xPad +
      computePiecesPositions(nodeById(parentNodeId, nodes).pieces)[
        parentPieceId
      ] +
      holeWidth / 2,
    y: nodePos.y + yPad + textHeight,
  };
};

export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

export const closestChildId = (x, y, nodes, nodePositions) => {
  let closestNodeId = null;
  let closestDist = null;
  nodes.forEach(node => {
    const pos = computeEdgeChildPos(node.id, nodes, nodePositions);
    const dist = distance(pos.x, pos.y, x, y);
    if (dist < targetRange && (!closestDist || dist < closestDist)) {
      closestDist = dist;
      closestNodeId = node.id;
    }
  });
  return closestNodeId;
};

export const closestParentPiece = (x, y, nodes, nodePositions) => {
  let closestPiece = null;
  let closestDist = null;
  nodes.forEach(node => {
    nodeById(node.id, nodes).pieces.forEach((piece, i) => {
      if (piece === null) {
        // only look for holes (represented by null)
        const pos = computeEdgeParentPos(node.id, i, nodes, nodePositions);
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

export function computePiecesWidths(pieces, fontSize = defaultFontSize) {
  return pieces.map(p => {
    if (p == null) {
      const holeText = new Konva.Text({
        text: "o",
        fontFamily: fontFamily,
        fontSize: fontSize,
      });
      return holeText.getTextWidth();
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

export function computePiecesPositions(pieces, fontSize) {
  const widths = computePiecesWidths(pieces, fontSize);
  let pieceX = 0;
  const xes = widths.map(w => {
    let myX = pieceX;
    pieceX += w + gapWidth;
    return myX;
  });
  return xes;
}

export function computeNodeWidth(pieces, fontSize) {
  const widths = computePiecesWidths(pieces, fontSize);
  let width = gapWidth * (pieces.length - 1);
  for (const w of widths) {
    width += w;
  }
  return width;
}
