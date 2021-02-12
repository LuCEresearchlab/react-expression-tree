import Konva from 'konva';

import {
  distance,
  nodeById,
} from './tree';

const createPositionUtils = (
  fontSize,
  fontFamily,
  connectorPlaceholder,
  placeholderWidth,
) => {
  const xPad = fontSize / 2;
  const yPad = fontSize / 2;
  const placeholderMiddle = placeholderWidth / 2;
  const gapWidth = fontSize / 5;

  // Compute the edge's child position having the child node id
  const computeEdgeChildPos = (childNodeId, nodes) => {
    const node = nodeById(childNodeId, nodes);
    return {
      x: node.x + node.width / 2,
      y: node.y,
    };
  };

  // Compute the edge's parent position having the parent node and the parent piece ids,
  const computeEdgeParentPos = (
    parentNodeId,
    parentPieceX,
    nodes,
  ) => {
    const node = nodeById(parentNodeId, nodes);
    return {
      x: node.x + xPad + parentPieceX + placeholderMiddle,
      y: node.y + yPad + fontSize,
    };
  };

  // Compute a labele piece width
  const computePieceWidth = (text) => {
    if (text === connectorPlaceholder) {
      return placeholderWidth;
    }
    const konvaText = new Konva.Text({
      text,
      fontFamily,
      fontSize,
    });

    return konvaText.getTextWidth();
  };

  // Compute all the label pieces width
  const computePiecesWidth = (pieces) => pieces.map(computePieceWidth);

  // Compute all the label pieces X coordinate positions
  const computeLabelPiecesXCoordinatePositions = (
    pieces,
  ) => {
    const labelPiecesWidth = computePiecesWidth(pieces);
    let pieceX = 0;
    const xes = labelPiecesWidth.map((w) => {
      const myX = pieceX;
      pieceX += w + gapWidth;
      return myX;
    });
    return xes;
  };

  // Compute the node width
  const computeNodeWidth = (
    pieces,
  ) => {
    const piecesWidth = computePiecesWidth(pieces);
    const totalGapsWidth = 2 * xPad + gapWidth * (pieces.length - 1);
    const totalWidth = piecesWidth.reduce((acc, width) => acc + width, totalGapsWidth);
    return totalWidth;
  };

  // Parse the nodes's pieces from a textfield string into the pieces array
  const parseLabelPieces = (label) => label.split(connectorPlaceholder);

  // Compute the closest child notd given an (x, y) point coordinate
  const closestChildId = (
    x,
    y,
    nodes,
  ) => {
    let closestNodeId = null;
    let closestDist = null;
    nodes.forEach((node) => {
      const pos = computeEdgeChildPos(node.id, nodes);
      const dist = distance(pos.x, pos.y, x, y);
      if (dist < fontSize && (!closestDist || dist < closestDist)) {
        closestDist = dist;
        closestNodeId = node.id;
      }
    });
    return closestNodeId;
  };

  // Compute the closest parent piece given an (x, y) point coordinate
  const closestParentPiece = (
    x,
    y,
    nodes,
  ) => {
    let closestPiece = null;
    let closestDist = null;
    nodes.forEach((node) => {
      const { pieces } = nodeById(node.id, nodes);
      const piecesXCoordinates = computeLabelPiecesXCoordinatePositions(pieces);
      pieces.forEach((piece, i) => {
        if (piece === connectorPlaceholder) {
          const pieceX = piecesXCoordinates[i];
          const pos = computeEdgeParentPos(node.id, pieceX, nodes);
          const dist = distance(pos.x, pos.y, x, y);
          if (dist < fontSize && (!closestDist || dist < closestDist)) {
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

  return {
    closestChildId,
    closestParentPiece,
    computeEdgeChildPos,
    computeEdgeParentPos,
    computeLabelPiecesXCoordinatePositions,
    computeNodeWidth,
    parseLabelPieces,
  };
};

export default createPositionUtils;
