import React from 'react';
import { 
  Line,
} from "react-konva";
import {
  xPad,
  yPad,
  holeWidth,
  textHeight,
  computePiecesPositions,
  computeNodeWidth,
} from './layout.js';

function Edge({parentPieces, parentPieceId, childPieces, parentX, parentY, childX, childY, beingDragged}) {
  const xes = computePiecesPositions(parentPieces);
  const childWidth = computeNodeWidth(childPieces);

  return (
    <Line
      points={[
        parentX + xPad + xes[parentPieceId] + holeWidth/2, 
        parentY + yPad + textHeight,
        childX + xPad + childWidth/2, 
        childY
      ]}
      stroke={beingDragged ? "#f0f0f0" : "black"}
      strokeWidth={3}
    />
  );
}

export default Edge;
