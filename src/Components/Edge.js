import React from "react";
import { Line, Text } from "react-konva";
import {
  xPad,
  yPad,
  holeWidth,
  textHeight,
  computePiecesPositions,
  computeNodeWidth,
} from "../layout.js";

function Edge({
  id,
  parentPieces,
  parentPieceId,
  childPieces,
  parentX,
  parentY,
  childX,
  childY,
  beingDragged,
  onEdgeClick,
  selected,
  type,
}) {
  const xes = computePiecesPositions(parentPieces);
  const childWidth = computeNodeWidth(childPieces);

  return [
    <Line
      key={"Edge-Line-" + id}
      points={[
        parentX + xPad + xes[parentPieceId] + holeWidth / 2,
        parentY + yPad + textHeight / 2,
        childX + xPad + childWidth / 2,
        childY,
      ]}
      stroke={beingDragged ? "#f0f0f0" : selected ? "red" : "black"}
      strokeWidth={5}
      onClick={onEdgeClick}
    />,
    <Text
      key={"Edge-Text-" + id}
      x={childX + xPad + childWidth / 2}
      y={childY - 30}
      fill="red"
      fontFamily={"Arial"}
      fontSize={20}
      text={type}
    />,
  ];
}

export default Edge;
